import type {
  FollowUpChip,
  InternalKnowledgeOutput,
} from "../types/internal-knowledge";
import type { CustomerSupportPack } from "../packs/types";

const RISK_NEEDLES = [
  "痛み",
  "赤み",
  "腫れ",
  "出血",
  "発熱",
  "痛い",
  "炎症",
];

const MENUISH_LABEL = /メニュー|フェイシャル|施術|コースを見る/;

function isRiskContext(question: string, output: InternalKnowledgeOutput): boolean {
  const hay = `${question}\n${output.conclusion}\n${output.answer ?? ""}`;
  return RISK_NEEDLES.some((n) => hay.includes(n));
}

function dedupeFollowUps(chips: FollowUpChip[]): FollowUpChip[] {
  const seen = new Set<string>();
  const out: FollowUpChip[] = [];
  for (const chip of chips) {
    const key = `${chip.action}:${chip.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(chip);
  }
  return out;
}

/**
 * Ensure every answer has actionable followUps (context CTA layer A).
 */
export function ensureFollowUps(
  output: InternalKnowledgeOutput,
  pack: CustomerSupportPack,
  question = "",
): InternalKnowledgeOutput {
  let followUps = [...(output.followUps ?? [])];
  const risk =
    pack.industry === "beauty-salon" && isRiskContext(question, output);

  if (risk) {
    followUps = followUps.filter((c) => !MENUISH_LABEL.test(c.label));
    const escalate =
      followUps.find((c) => c.action === "escalate_human") ??
      pack.defaultFollowUps.find((c) => c.action === "escalate_human");
    if (escalate) {
      followUps = [
        escalate,
        ...followUps.filter((c) => c.action !== "escalate_human"),
      ];
    }
  }

  const nonEscalate = followUps.filter((c) => c.action !== "escalate_human");
  const needsFill =
    followUps.length === 0 ||
    (nonEscalate.length === 0 && output.status !== "not_allowed");

  if (needsFill) {
    let defaults = [...pack.defaultFollowUps];
    if (risk) {
      defaults = defaults.filter(
        (c) =>
          c.action === "escalate_human" || !MENUISH_LABEL.test(c.label),
      );
    }
    if (output.status === "not_found" || output.status === "not_allowed") {
      defaults = defaults.filter((c) => c.action === "escalate_human");
      if (defaults.length === 0) {
        defaults = pack.defaultFollowUps.filter(
          (c) => c.action === "escalate_human",
        );
      }
    }
    followUps = dedupeFollowUps([...followUps, ...defaults]).slice(0, 3);
  } else {
    followUps = dedupeFollowUps(followUps).slice(0, 4);
  }

  if (followUps.length === 0) {
    followUps = pack.defaultFollowUps.slice(0, 1);
  }

  return { ...output, followUps };
}
