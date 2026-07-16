import type { Citation } from "../types/internal-knowledge";
import manifestJson from "../../data/sample/towa-customer-support-v1/manifest.json";
import returnDoc from "../../data/sample/towa-customer-support-v1/documents/return-exchange-policy.json";
import shippingDoc from "../../data/sample/towa-customer-support-v1/documents/shipping-faq.json";
import billingDoc from "../../data/sample/towa-customer-support-v1/documents/billing-faq.json";

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

export const samplePackManifest = manifestJson as KnowledgePackManifest;

export const sampleDocuments: KnowledgeDocument[] = [
  returnDoc as KnowledgeDocument,
  shippingDoc as KnowledgeDocument,
  billingDoc as KnowledgeDocument,
];

export function findSampleDocument(documentId: string): KnowledgeDocument | undefined {
  return sampleDocuments.find((doc) => doc.id === documentId);
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
