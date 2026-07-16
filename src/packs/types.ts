import type {
  AnswerSkeletonFixture,
  GuidedQuestionDef,
  IntentTree,
  KnowledgeDocument,
  KnowledgePackManifest,
} from "../types/pack-shared";
import type {
  FollowUpChip,
  InternalKnowledgeOutput,
} from "../types/internal-knowledge";

export type { AnswerSkeletonFixture };

export type IndustryId = "retail-commerce" | "restaurant" | "beauty-salon";

export type PackUiLabels = {
  supportTitle: string;
  statusLine: string;
  knowledgeSheetTitle: string;
  sampleTabLabel: string;
  customTabLabel: string;
  knowledgeEyebrow: string;
};

export type PackBrand = {
  storeName: string;
  assistantName: string;
  companyName: string;
};

export type KeywordFixture = {
  needles: string[];
  output: InternalKnowledgeOutput;
};

export type CustomerSupportPack = {
  industry: IndustryId;
  available: true;
  brand: PackBrand;
  uiLabels: PackUiLabels;
  manifest: KnowledgePackManifest;
  documents: KnowledgeDocument[];
  intentTree: IntentTree;
  guidedQuestions: GuidedQuestionDef[];
  fixtures: AnswerSkeletonFixture[];
  keywordFixtures: KeywordFixture[];
  promptOverlay: string;
  systemPromptIntro: string[];
  /** Status=allowed 等で LLM followUps が不足したときの補完候補 */
  defaultFollowUps: FollowUpChip[];
};

export type UnavailablePack = {
  industry: IndustryId;
  available: false;
  label: string;
  description: string;
};

export type PackRegistryEntry = CustomerSupportPack | UnavailablePack;
