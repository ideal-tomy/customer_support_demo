import { useSyncExternalStore } from "react";
import type { AnswerStatus } from "../types/internal-knowledge";

const STORAGE_KEY = "cs-demo-explain-v1";

const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

let enabled = readStored();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoExplainMode(): boolean {
  return enabled;
}

export function setDemoExplainMode(next: boolean): void {
  if (enabled === next) return;
  enabled = next;
  try {
    if (next) sessionStorage.setItem(STORAGE_KEY, "1");
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function useDemoExplainMode(): boolean {
  return useSyncExternalStore(subscribe, getDemoExplainMode, () => false);
}

export type AskSource =
  | "fixture"
  | "sample-retrieve"
  | "llm"
  | "llm-empty-fallback";

/** Demo explain mode label for technical audiences. */
export function formatAnswerMethodLabel(
  source: AskSource,
  status: AnswerStatus,
): string {
  if (source === "fixture" && status === "needs_confirmation") {
    return "回答方式: 業務データ連携（モック）";
  }
  if (source === "fixture") {
    return "回答方式: 固定回答";
  }
  if (source === "llm") {
    return "回答方式: AI＋ナレッジ";
  }
  return "回答方式: AI＋ナレッジ（ローカル合成）";
}
