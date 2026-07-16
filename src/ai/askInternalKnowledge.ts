import {
  countCharacters,
  estimateTokens,
} from "@axeon/ai-demo-core/demo-core/knowledge";
import {
  AiTransportError,
  sendAiRequest,
} from "@axeon/ai-demo-core/demo-core";
import {
  getApiKey,
  getIkAccessMode,
  getIkModel,
  getIkProvider,
  getTrialCode,
} from "../access/ik-settings";
import {
  findFixtureByGuidedQuestionId,
  getSampleOutputByKeyword,
} from "../mocks/guided-questions";
import {
  extractOrderIdFromQuestion,
  lookupShippingTrackMock,
} from "../mocks/shipping-track";
import { getAnswerSkeletonFixtures } from "../mocks/answer-skeleton-fixtures";
import type { InternalKnowledgeOutput } from "../types/internal-knowledge";
import { resolveShippingTrackOutput } from "../packs/retail-fixtures";
import { getActiveIndustryId, getActiveIndustryPack } from "../packs/registry";
import { buildInternalKnowledgeAiRequest } from "./adapters/internal-knowledge-input";
import {
  parseInternalKnowledgeAiResult,
  synthesizeFromHits,
} from "./adapters/internal-knowledge-output";
import { ensureFollowUps } from "./follow-up-fallback";
import {
  getActiveDocuments,
  isSamplePackActive,
} from "../knowledge/pack-store";
import { retrieveChunks } from "./retrieve";

function withFollowUps(
  output: InternalKnowledgeOutput,
  question: string,
): InternalKnowledgeOutput {
  return ensureFollowUps(output, getActiveIndustryPack(), question);
}

function matchKnownSampleOutput(question: string): InternalKnowledgeOutput | null {
  const normalized = question.replace(/\s+/g, "");
  for (const fixture of getAnswerSkeletonFixtures()) {
    if (normalized.includes(fixture.question.replace(/\s+/g, "").slice(0, 8))) {
      return fixture.output;
    }
  }
  for (const row of getSampleOutputByKeyword()) {
    if (row.needles.some((n) => normalized.includes(n))) {
      return row.output;
    }
  }
  return null;
}

export type AskInternalKnowledgeInput = {
  question: string;
  guidedQuestionId?: string;
  conversationContext?: Array<{ role: "user" | "assistant"; content: string }>;
};

export type AskInternalKnowledgeResult = {
  output: InternalKnowledgeOutput;
  mode: string;
  source: "fixture" | "sample-retrieve" | "llm" | "llm-empty-fallback";
  remainingRequests?: number;
};

function formatAskError(err: unknown): Error {
  if (err instanceof AiTransportError) {
    const detail = err.normalized.recommendedAction
      ? `${err.message}（${err.normalized.recommendedAction}）`
      : err.message;
    return new Error(detail);
  }
  if (err instanceof Error) return err;
  return new Error("回答の取得に失敗しました。");
}

/**
 * Sample → fixture or local retrieve synthesize.
 * BYOK / Trial → retrieve → sendAiRequest (json_object) → Output Adapter.
 */
export async function askInternalKnowledge(
  input: AskInternalKnowledgeInput,
): Promise<AskInternalKnowledgeResult> {
  const question = input.question.trim();
  if (!question) {
    throw new Error("質問が空です。");
  }

  const mode = getIkAccessMode();
  const samplePack = isSamplePackActive();
  const activeDocs = getActiveDocuments();

  if (activeDocs.length === 0) {
    throw new Error(
      "FAQ文書がありません。「お試しナレッジ」から文書を追加してください。",
    );
  }

  if (mode === "sample") {
    // ガイド質問の固定回答はサンプルパック時のみ（自社ナレッジでは誤発火させない）
    if (samplePack) {
      if (input.guidedQuestionId) {
        const fixture = findFixtureByGuidedQuestionId(input.guidedQuestionId);
        if (fixture) {
          return {
            output: withFollowUps(fixture.output, question),
            mode,
            source: "fixture",
          };
        }
      }
      // 小売: 注文番号付き配送確認はインプロセス追跡モックを優先
      if (getActiveIndustryId() === "retail-commerce") {
        const orderId = extractOrderIdFromQuestion(question);
        if (orderId && lookupShippingTrackMock(orderId)) {
          return {
            output: withFollowUps(resolveShippingTrackOutput(question), question),
            mode,
            source: "fixture",
          };
        }
      }
      const known = matchKnownSampleOutput(question);
      if (known) {
        return {
          output: withFollowUps(known, question),
          mode,
          source: "fixture",
        };
      }
    }
    const hits = retrieveChunks(question, { topK: 5 });
    return {
      output: withFollowUps(synthesizeFromHits(hits), question),
      mode,
      source: "sample-retrieve",
    };
  }

  const hits = retrieveChunks(question, { topK: 6 });
  if (hits.length === 0) {
    return {
      output: withFollowUps(synthesizeFromHits([]), question),
      mode,
      source: "sample-retrieve",
    };
  }

  const provider = mode === "managed-trial" ? "openai" : getIkProvider();
  const model = getIkModel();
  const apiKey = mode === "byok-direct" ? getApiKey(provider).trim() : undefined;

  if (mode === "byok-direct" && !apiKey) {
    throw new Error("APIキーをヘッダーの設定で保存してください。");
  }

  const trialCode = getTrialCode().trim();
  if (mode === "managed-trial" && !trialCode) {
    throw new Error("体験コードをヘッダーの設定で保存してください。");
  }

  const request = buildInternalKnowledgeAiRequest({
    question,
    hits,
    conversationContext: input.conversationContext,
    provider,
    model,
    accessMode: mode,
    apiKey,
  });

  const knowledgeText = hits.map((h) => h.text).join("\n");
  const userMsg =
    typeof request.messages[0]?.content === "string"
      ? request.messages[0].content
      : question;

  try {
    const response = await sendAiRequest(request, {
      trialCode: mode === "managed-trial" ? trialCode : undefined,
      knowledgeCharCount: countCharacters(knowledgeText),
      estimatedInputTokens:
        estimateTokens(request.systemPrompt) + estimateTokens(userMsg),
    });

    if (!response.text?.trim()) {
      return {
        output: withFollowUps(
          synthesizeFromHits(
            hits,
            "モデル応答が空だったため、検索結果を表示します。",
          ),
          question,
        ),
        mode,
        source: "llm-empty-fallback",
      };
    }

    return {
      output: withFollowUps(
        parseInternalKnowledgeAiResult(response.text, hits),
        question,
      ),
      mode,
      source: "llm",
      remainingRequests: response.trialStatus?.remainingRequests,
    };
  } catch (err) {
    throw formatAskError(err);
  }
}
