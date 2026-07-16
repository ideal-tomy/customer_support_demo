import type { InternalKnowledgeOutput } from "./internal-knowledge";

export type KnowledgeSection = {
  id: string;
  title: string;
  articleNumber?: string;
  body: string;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  version: string;
  effectiveDate: string;
  ownerDepartment: string;
  summary: string;
  sections: KnowledgeSection[];
};

export type KnowledgePackManifest = {
  packId: string;
  name: string;
  companyName: string;
  isFictional: boolean;
  version: string;
  documentCount: number;
  categories: string[];
  lastUpdated: string;
};

export type IntentNode = {
  id: string;
  label: string;
  description?: string;
  children?: IntentNode[];
  guidedQuestionId?: string;
  clarifyOptions?: Array<{
    id: string;
    label: string;
    appendText: string;
  }>;
};

export type IntentTree = {
  packId: string;
  version: string;
  roots: IntentNode[];
};

export type GuidedQuestionDef = {
  id: string;
  question: string;
  fixtureId: string;
  difficulty: 1 | 2 | 3;
};

export type AnswerSkeletonFixture = {
  id: string;
  title: string;
  question: string;
  output: InternalKnowledgeOutput;
};

export type { InternalKnowledgeOutput };
