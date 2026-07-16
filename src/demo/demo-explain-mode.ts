import { useSyncExternalStore } from "react";
import type {
  AnswerBlocks,
  AnswerStatus,
  FollowUpAction,
} from "../types/internal-knowledge";

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

const ACTION_TYPE_LABEL: Record<FollowUpAction, string> = {
  resend_variant: "条件を変えて再質問",
  open_evidence: "根拠を開く",
  open_document: "ご案内を開く",
  clarify: "確認の選択",
  ask_related: "関連質問",
  escalate_human: "有人へつなぐ",
};

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

export type MechanismCardLines = {
  method: string;
  evidence: string;
  nextAction: string;
};

/** Three-line adoption card under an answer (demo explain ON). */
export function buildMechanismCardLines(
  source: AskSource,
  blocks: AnswerBlocks,
): MechanismCardLines {
  const method = formatAnswerMethodLabel(source, blocks.status);
  const titles = blocks.citations
    .map((c) => c.documentTitle)
    .filter(Boolean)
    .slice(0, 2);
  const evidence =
    titles.length > 0
      ? `根拠: ${titles.join(" / ")}`
      : "根拠: （この回答では文書参照なし）";
  const actions = blocks.followUps
    .map((f) => ACTION_TYPE_LABEL[f.action] ?? f.label)
    .slice(0, 3);
  const nextAction =
    actions.length > 0
      ? `次アクション型: ${actions.join(" · ")}`
      : "次アクション型: （未提示）";
  return { method, evidence, nextAction };
}
