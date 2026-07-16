import { type KnowledgeChunk } from "../knowledge/chunks";
import { getActiveChunks } from "../knowledge/pack-store";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[？?！!。、．，,§]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SYNONYM_GROUPS: string[][] = [
  ["返品", "返却", "戻す", "交換"],
  ["配送", "発送", "届く", "お届け", "追跡", "再配達"],
  ["請求", "支払い", "領収書", "課金", "決済"],
  ["送料", "着払い", "運賃"],
  ["マイページ", "注文", "申請"],
  ["不良", "破損", "誤配送", "初期不良"],
];

function expandTokens(question: string): string[] {
  const n = normalize(question);
  const base = n
    .split(/[\s/・：:（）()【】\[\]\-]+/)
    .filter((t) => t.length >= 2);

  const extra: string[] = [];
  for (const group of SYNONYM_GROUPS) {
    if (group.some((g) => n.includes(normalize(g)))) {
      extra.push(...group.map(normalize));
    }
  }
  return [...new Set([...base, ...extra])];
}

export type ScoredChunk = KnowledgeChunk & { score: number };

/** Keyword retrieval over active pack sections (demo-side; not in Core). */
export function retrieveChunks(
  question: string,
  options?: { topK?: number; chunks?: KnowledgeChunk[] },
): ScoredChunk[] {
  const topK = options?.topK ?? 6;
  const chunks = options?.chunks ?? getActiveChunks();
  const tokens = expandTokens(question);
  if (tokens.length === 0) return [];

  const scored = chunks.map((chunk) => {
    const hay = normalize(chunk.text);
    let score = 0;
    for (const t of tokens) {
      if (t.length < 2) continue;
      if (hay.includes(t)) score += t.length >= 3 ? 3 : 2;
      if (normalize(chunk.sectionTitle).includes(t)) score += 2;
      if (normalize(chunk.documentTitle).includes(t)) score += 1;
    }
    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
