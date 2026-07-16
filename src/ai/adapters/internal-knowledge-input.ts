import type { AiRequest } from "@axeon/ai-demo-core/types/provider";
import type { AiProvider } from "@axeon/ai-demo-core/types/access-mode";
import { getActiveIndustryPack } from "../../packs/registry";
import type { ScoredChunk } from "../retrieve";

export function buildInternalKnowledgeSchemaHint(): string {
  return `Return ONLY a JSON object with this shape (Japanese strings):
{
  "status": "allowed" | "conditional" | "needs_confirmation" | "not_allowed" | "not_found",
  "conclusion": string,
  "answer": string,
  "bullets": string[],
  "conditions": string[],
  "exceptions": string[],
  "requiredActions": string[],
  "requiredDocuments": string[],
  "approvers": string[],
  "responsibleDepartments": string[],
  "deadlines": string[],
  "missingInformation": string[],
  "missingInfoChoices": { "id": string, "label": string, "appendText": string }[],
  "followUps": { "id": string, "label": string, "action": "resend_variant"|"open_evidence"|"open_document"|"clarify"|"ask_related"|"escalate_human", "payload"?: object }[],
  "citations": {
    "documentId": string,
    "documentTitle": string,
    "sectionId": string,
    "sectionTitle": string,
    "articleNumber"?: string,
    "excerpt": string,
    "reason": string
  }[],
  "workflowPreview": {
    "routingTarget"?: string,
    "formType"?: string,
    "suggestedFields": object,
    "automationCandidates": string[]
  }
}
Rules:
- Use ONLY facts in the provided knowledge chunks. Do not invent policies.
- citations.documentId and citations.sectionId MUST match chunk fields exactly.
- If evidence is insufficient, use status "needs_confirmation" or "not_found".
- Do not invent order status, tracking numbers, or account-specific facts.
- Prefer short customer-friendly bullets (2-4).
- When a human agent is appropriate, include followUp action "escalate_human" with label like "担当者に相談".
- Prefer a followUp "申請方法を見る" (ask_related or open_document) when return/application steps exist.`;
}

export function buildInternalKnowledgeSystemPrompt(): string {
  const pack = getActiveIndustryPack();
  return [
    ...pack.systemPromptIntro,
    buildInternalKnowledgeSchemaHint(),
    pack.promptOverlay,
  ].join("\n");
}

export type BuildIkAiRequestInput = {
  question: string;
  hits: ScoredChunk[];
  conversationContext?: Array<{ role: "user" | "assistant"; content: string }>;
  provider: AiProvider;
  model: string;
  accessMode: "byok-direct" | "managed-trial";
  apiKey?: string;
};

export function buildInternalKnowledgeAiRequest(
  input: BuildIkAiRequestInput,
): AiRequest {
  const chunkPayload = input.hits.map((h) => ({
    id: h.id,
    documentId: h.documentId,
    documentTitle: h.documentTitle,
    version: h.version,
    sectionId: h.sectionId,
    sectionTitle: h.sectionTitle,
    articleNumber: h.articleNumber ?? null,
    text: h.text,
  }));

  return {
    accessMode: input.accessMode,
    provider: input.provider,
    model: input.model,
    apiKey: input.apiKey,
    systemPrompt: buildInternalKnowledgeSystemPrompt(),
    messages: [
      {
        role: "user",
        content: JSON.stringify(
          {
            question: input.question,
            conversationContext: input.conversationContext ?? [],
            knowledgeChunks: chunkPayload,
          },
          null,
          2,
        ),
      },
    ],
    responseFormat: { type: "json_object" },
    maxOutputTokens: 8192,
    reasoningEffort: resolveReasoningEffort(input.model),
  };
}

function resolveReasoningEffort(
  model: string,
): "none" | "minimal" | undefined {
  const id = model.toLowerCase();
  if (id.includes("gpt-5.4")) return "none";
  if (id.includes("gpt-5")) return "minimal";
  return undefined;
}
