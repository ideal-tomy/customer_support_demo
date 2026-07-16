import type { Citation } from "../types/internal-knowledge";
import { getActiveIndustryPack } from "../packs/registry";
import type {
  KnowledgeDocument,
  KnowledgePackManifest,
  KnowledgeSection,
} from "../types/pack-shared";

export type {
  KnowledgeDocument,
  KnowledgePackManifest,
  KnowledgeSection,
} from "../types/pack-shared";

export function getSamplePackManifest(): KnowledgePackManifest {
  return getActiveIndustryPack().manifest;
}

export function getSampleDocuments(): KnowledgeDocument[] {
  return getActiveIndustryPack().documents;
}

export function findSampleDocument(documentId: string): KnowledgeDocument | undefined {
  return getSampleDocuments().find((doc) => doc.id === documentId);
}

export function findSection(
  documentId: string,
  sectionId: string,
): { document: KnowledgeDocument; section: KnowledgeSection } | undefined {
  const document = findSampleDocument(documentId);
  if (!document) return undefined;
  const section = document.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  return { document, section };
}

export type OpenDocumentTarget = {
  documentId: string;
  sectionId?: string;
  reason?: string;
};

export function targetFromCitation(citation: Citation): OpenDocumentTarget {
  return {
    documentId: citation.documentId,
    sectionId: citation.sectionId,
    reason: citation.reason,
  };
}
