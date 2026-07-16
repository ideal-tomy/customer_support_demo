import { getActiveIndustryPack } from "../packs/registry";
import type { KnowledgeDocument } from "../types/pack-shared";

export type KnowledgeChunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  version: string;
  sectionId: string;
  sectionTitle: string;
  articleNumber?: string;
  text: string;
  excerpt: string;
};

export function buildChunksFromDocument(doc: KnowledgeDocument): KnowledgeChunk[] {
  return doc.sections.map((section) => {
    const excerpt =
      section.body.length > 180 ? `${section.body.slice(0, 180)}…` : section.body;
    return {
      id: `${doc.id}:${section.id}`,
      documentId: doc.id,
      documentTitle: doc.title,
      version: doc.version,
      sectionId: section.id,
      sectionTitle: section.title,
      articleNumber: section.articleNumber,
      text: [
        doc.title,
        section.articleNumber ?? "",
        section.title,
        section.body,
      ]
        .filter(Boolean)
        .join("\n"),
      excerpt,
    };
  });
}

export function buildChunksFromDocuments(
  documents: KnowledgeDocument[],
): KnowledgeChunk[] {
  return documents.flatMap(buildChunksFromDocument);
}

let cachedKey: string | null = null;
let cachedChunks: KnowledgeChunk[] | null = null;

export function getSampleChunks(): KnowledgeChunk[] {
  const pack = getActiveIndustryPack();
  const key = pack.manifest.packId;
  if (!cachedChunks || cachedKey !== key) {
    cachedKey = key;
    cachedChunks = buildChunksFromDocuments(pack.documents);
  }
  return cachedChunks;
}

export function invalidateSampleChunksCache(): void {
  cachedKey = null;
  cachedChunks = null;
}
