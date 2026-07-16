import type { AnswerSkeletonFixture } from "../types/pack-shared";
import { getActiveIndustryPack } from "../packs/registry";

export type { AnswerSkeletonFixture };

/** Active industry pack fixtures. */
export function getAnswerSkeletonFixtures(): AnswerSkeletonFixture[] {
  return getActiveIndustryPack().fixtures;
}

/** @deprecated use getAnswerSkeletonFixtures() */
export const answerSkeletonFixtures = new Proxy([] as AnswerSkeletonFixture[], {
  get(_t, prop) {
    const list = getAnswerSkeletonFixtures();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    if (typeof prop === "string" && /^\d+$/.test(prop)) return list[Number(prop)];
    const value = Reflect.get(list, prop);
    return typeof value === "function" ? value.bind(list) : value;
  },
});
