import type { GuidedQuestionDef, IntentTree } from "../types/pack-shared";
import { getActiveIndustryPack } from "../packs/registry";
import { getAnswerSkeletonFixtures } from "./answer-skeleton-fixtures";

export function getPhase3IntentTree(): IntentTree {
  return getActiveIndustryPack().intentTree;
}

/** @deprecated Prefer getPhase3IntentTree() */
export const phase3IntentTree = new Proxy({} as IntentTree, {
  get(_t, prop) {
    return Reflect.get(getPhase3IntentTree(), prop);
  },
});

export function getGuidedQuestions(): GuidedQuestionDef[] {
  return getActiveIndustryPack().guidedQuestions;
}

export const guidedQuestions = new Proxy([] as GuidedQuestionDef[], {
  get(_t, prop) {
    const list = getGuidedQuestions();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    if (typeof prop === "string" && /^\d+$/.test(prop)) return list[Number(prop)];
    const value = Reflect.get(list, prop);
    return typeof value === "function" ? value.bind(list) : value;
  },
});

export function findGuidedQuestion(id: string): GuidedQuestionDef | undefined {
  return getGuidedQuestions().find((q) => q.id === id);
}

export function findFixtureByGuidedQuestionId(guidedQuestionId: string) {
  const guided = findGuidedQuestion(guidedQuestionId);
  if (!guided) return undefined;
  return getAnswerSkeletonFixtures().find((f) => f.id === guided.fixtureId);
}

export function getSampleOutputByKeyword() {
  return getActiveIndustryPack().keywordFixtures;
}

/** @deprecated */
export const sampleOutputByKeyword = new Proxy(
  [] as ReturnType<typeof getSampleOutputByKeyword>,
  {
    get(_t, prop) {
      const list = getSampleOutputByKeyword();
      if (prop === "length") return list.length;
      if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
      if (typeof prop === "string" && /^\d+$/.test(prop)) return list[Number(prop)];
      const value = Reflect.get(list, prop);
      return typeof value === "function" ? value.bind(list) : value;
    },
  },
);
