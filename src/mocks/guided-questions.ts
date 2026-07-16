import type { GuidedQuestionDef, IntentTree } from "../types/internal-knowledge";
import intentTreeJson from "../../data/sample/towa-customer-support-v1/intent-tree.json";
import {
  answerSkeletonFixtures,
  fixtureBillingReceipt,
  fixtureReturnPolicy,
  fixtureTrackShipping,
} from "./answer-skeleton-fixtures";

export const phase3IntentTree = intentTreeJson as IntentTree;

export const guidedQuestions: GuidedQuestionDef[] = [
  {
    id: "gq-track-shipping",
    question: "配送状況を確認したいです。どこで見られますか。",
    fixtureId: "track-shipping",
    difficulty: 1,
  },
  {
    id: "gq-return-policy",
    question: "返品したいです。条件と期限を教えてください。",
    fixtureId: "return-policy",
    difficulty: 1,
  },
  {
    id: "gq-billing-receipt",
    question: "領収書を発行したいです。",
    fixtureId: "billing-receipt",
    difficulty: 1,
  },
];

export function findGuidedQuestion(id: string): GuidedQuestionDef | undefined {
  return guidedQuestions.find((q) => q.id === id);
}

export function findFixtureByGuidedQuestionId(guidedQuestionId: string) {
  const guided = findGuidedQuestion(guidedQuestionId);
  if (!guided) return undefined;
  return answerSkeletonFixtures.find((f) => f.id === guided.fixtureId);
}

/** Sample-mode keyword shortcuts used by askInternalKnowledge. */
export const sampleOutputByKeyword: Array<{
  needles: string[];
  output: typeof fixtureReturnPolicy;
}> = [
  { needles: ["返品", "交換"], output: fixtureReturnPolicy },
  { needles: ["配送", "追跡", "届"], output: fixtureTrackShipping },
  { needles: ["領収", "請求", "支払い"], output: fixtureBillingReceipt },
];
