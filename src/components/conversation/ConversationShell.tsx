import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ClarifyingChoice } from "./ClarifyingChoice";
import { DecisionCard } from "./DecisionCard";
import { FollowUpChips } from "./FollowUpChips";
import { IntentQuickReplies } from "./IntentQuickReplies";
import { TypingIndicator } from "./TypingIndicator";
import { useAskFlow } from "../../hooks/useAskFlow";
import { askInternalKnowledge } from "../../ai/askInternalKnowledge";
import {
  setDemoExplainMode,
  useDemoExplainMode,
} from "../../demo/demo-explain-mode";
import { MechanismCard } from "./MechanismCard";
import {
  findFixtureByGuidedQuestionId,
  findGuidedQuestion,
  getPhase3IntentTree,
} from "../../mocks/guided-questions";
import {
  findActiveDocument,
  useKnowledgePack,
} from "../../knowledge/pack-store";
import { targetFromCitation } from "../../knowledge/sample-pack";
import type { OpenDocumentTarget } from "../../knowledge/sample-pack";
import type {
  AnswerBlocks,
  Citation,
  FollowUpChip,
  IntentNode,
  IntentTree,
  MissingInfoChoice,
} from "../../types/internal-knowledge";

const CUSTOM_WELCOME_LINES = [
  "お試しナレッジ（セッション内）だけを根拠にご案内します。",
  "本番の機密は入れず、挙動確認用のテキストでお試しください。",
  "自由に質問してください。",
];

type ThreadTurn = {
  id: string;
  question: string;
  displayText: string;
  meta: string;
  blocks: AnswerBlocks | null;
  guidedQuestionId?: string;
};

type IntentSelection = {
  id: string;
  label: string;
};

type ConversationShellProps = {
  onOpenDocument: (target: OpenDocumentTarget) => void;
  onEscalateHuman?: () => void;
};

/**
 * Conversation host: Intent → retrieve/LLM ask → Answer Skeleton + Follow-ups.
 * UI はチャットアプリ型（吹き出し＋クイックリプライ）。
 */
export function ConversationShell({
  onOpenDocument,
  onEscalateHuman,
}: ConversationShellProps) {
  const { isRunning, result, error, runAsk, reset } = useAskFlow();
  const pack = useKnowledgePack();
  const demoExplain = useDemoExplainMode();
  const intentTree = getPhase3IntentTree() as IntentTree;
  const [turns, setTurns] = useState<ThreadTurn[]>([]);
  const [intentPath, setIntentPath] = useState<IntentNode[]>([]);
  const [intentSelections, setIntentSelections] = useState<IntentSelection[]>([]);
  const [draft, setDraft] = useState("");
  const [evidenceOpenByTurn, setEvidenceOpenByTurn] = useState<Record<string, boolean>>({});
  const [clarifyTurnId, setClarifyTurnId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingTurnId, setPendingTurnId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const packRevisionRef = useRef(pack.revision);

  /** 初回: ウェルカム直下の用件チップ */
  const showWelcomeIntents =
    pack.isSample && turns.length === 0 && intentPath.length === 0 && !isRunning;
  /** 入力欄直上の常時ショートカット B（階層ドリル中は隠す） */
  const showComposerShortcuts =
    pack.isSample && intentPath.length === 0 && !isRunning;
  /** 中間階層のチップ（初回／継続どちらでも） */
  const showIntentPathChips =
    pack.isSample && intentPath.length > 0 && !isRunning;
  const welcomeLines = pack.isSample
    ? [
        `こんにちは！${pack.brand.storeName}の案内です。ご用件を選ぶかそのまま入力してください。`,
      ]
    : CUSTOM_WELCOME_LINES;

  const attachResult = useEffectEvent((blocks: AnswerBlocks) => {
    if (!pendingTurnId) return;
    const turnId = pendingTurnId;
    setTurns((prev) =>
      prev.map((turn) =>
        turn.id === turnId && turn.blocks === null ? { ...turn, blocks } : turn,
      ),
    );
    setPendingTurnId(null);
    if (blocks.missingInfoChoices.length > 0) {
      setClarifyTurnId(turnId);
    }
  });

  useEffect(() => {
    if (result && !isRunning) {
      attachResult(result.blocks);
    }
  }, [result, isRunning]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [
    turns,
    intentSelections,
    isRunning,
    showWelcomeIntents,
    showComposerShortcuts,
    showIntentPathChips,
    error,
    notice,
  ]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const styles = window.getComputedStyle(el);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 26;
    const paddingY =
      Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
    const maxHeight = lineHeight * 4 + paddingY;
    const next = Math.min(Math.max(el.scrollHeight, 44), maxHeight);
    el.style.height = `${next}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [draft]);

  const buildConversationContext = () =>
    turns.flatMap((turn) => {
      const rows: Array<{ role: "user" | "assistant"; content: string }> = [
        { role: "user", content: turn.question },
      ];
      if (turn.blocks) {
        rows.push({
          role: "assistant",
          content: `${turn.blocks.conclusion}\n${turn.blocks.bullets.join("\n")}`,
        });
      }
      return rows;
    });

  const startAsk = (
    question: string,
    meta: string,
    guidedQuestionId?: string,
    displayText?: string,
  ) => {
    if (isRunning) return;
    const id = `turn-${Date.now()}`;
    setNotice(null);
    setTurns((prev) => [
      ...prev,
      {
        id,
        question,
        displayText: displayText ?? question,
        meta,
        blocks: null,
        guidedQuestionId,
      },
    ]);
    setPendingTurnId(id);
    setIntentPath([]);
    setIntentSelections([]);
    setDraft("");
    setClarifyTurnId(null);

    runAsk(
      askInternalKnowledge({
        question,
        guidedQuestionId,
        conversationContext: buildConversationContext(),
      }),
    );
  };

  const handleIntentSelect = (node: IntentNode) => {
    if (isRunning) return;

    // 最下層: 選択ラベルをユーザー吹き出しにし、該当プロンプトで送信（履歴は turn 側）
    if (node.guidedQuestionId) {
      const guided = findGuidedQuestion(node.guidedQuestionId);
      const fixture = findFixtureByGuidedQuestionId(node.guidedQuestionId);
      const question = guided?.question ?? fixture?.question ?? node.label;
      const title = fixture?.title ?? node.label;
      startAsk(question, title, node.guidedQuestionId, node.label);
      return;
    }

    // 中間階層: 選択を履歴に残し、次階層チップを表示
    if (node.children && node.children.length > 0) {
      if (intentPath.length >= 2) return;
      const selection: IntentSelection = {
        id: `intent-${Date.now()}-${node.id}`,
        label: node.label,
      };
      setIntentSelections((prev) => [...prev, selection]);
      setIntentPath((prev) => [...prev, node]);
    }
  };

  const handleFreeSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || isRunning) return;
    startAsk(text, "自由入力");
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleFreeSubmit();
    }
  };

  const openDocument = (documentId: string, sectionId?: string) => {
    const doc = findActiveDocument(documentId);
    if (!doc) {
      setNotice(`文書「${documentId}」は選択中のナレッジパックにありません。`);
      return;
    }
    setNotice(null);
    onOpenDocument({ documentId, sectionId });
  };

  const handleCitationClick = (citation: Citation) => {
    onOpenDocument(targetFromCitation(citation));
    setNotice(null);
  };

  const handleFollowUp = (turnId: string, chip: FollowUpChip) => {
    if (isRunning) return;

    switch (chip.action) {
      case "open_evidence":
        setEvidenceOpenByTurn((prev) => ({ ...prev, [turnId]: true }));
        setNotice(null);
        break;
      case "open_document": {
        const documentId = chip.payload?.documentId;
        if (!documentId) {
          setNotice("開く文書が指定されていません。");
          break;
        }
        openDocument(documentId);
        break;
      }
      case "clarify":
        setClarifyTurnId(turnId);
        setNotice(null);
        break;
      case "ask_related": {
        const gq = chip.payload?.guidedQuestionId;
        if (gq) {
          const guided = findGuidedQuestion(gq);
          const fixture = findFixtureByGuidedQuestionId(gq);
          startAsk(
            guided?.question ?? fixture?.question ?? chip.label,
            fixture?.title ?? chip.label,
            gq,
            chip.label,
          );
          break;
        }
        const relatedQuestion = chip.payload?.question;
        if (relatedQuestion) {
          startAsk(relatedQuestion, chip.label, undefined, chip.label);
        }
        break;
      }
      case "resend_variant": {
        const question = chip.payload?.question;
        if (!question) break;
        startAsk(question, "条件を変えて再質問");
        break;
      }
      case "escalate_human":
        setNotice(null);
        onEscalateHuman?.();
        break;
      default:
        break;
    }
  };

  const handleClarify = (_turnId: string, choice: MissingInfoChoice) => {
    if (isRunning) return;
    const question = `追加情報: ${choice.appendText}。この条件で案内を続きください。`;
    setClarifyTurnId(null);
    startAsk(question, "条件を追加", undefined, choice.label);
  };

  const handleReset = () => {
    reset();
    setTurns([]);
    setIntentPath([]);
    setIntentSelections([]);
    setDraft("");
    setEvidenceOpenByTurn({});
    setClarifyTurnId(null);
    setNotice(null);
    setPendingTurnId(null);
  };

  const resetConversation = useEffectEvent(() => {
    handleReset();
  });

  useEffect(() => {
    if (packRevisionRef.current === pack.revision) return;
    packRevisionRef.current = pack.revision;
    resetConversation();
  }, [pack.revision]);

  return (
    <div className="conversation-shell">
      {!pack.isSample ? (
        <p className="conversation-pack-banner" role="status">
          利用中: お試しナレッジ（業種パックとは別）
          {pack.documents.length > 0
            ? ` · ${pack.documents.length}文書`
            : " · 文書なし — FAQパックから追加"}
        </p>
      ) : null}
      <div className="conversation-thread" aria-live="polite">
        <div className="chat-row chat-row-bot">
          <div className="chat-bubble chat-bubble-bot">
            {welcomeLines.map((line) => (
              <p key={line} className="chat-bubble-text">
                {line}
              </p>
            ))}
          </div>
          {showWelcomeIntents ? (
            <IntentQuickReplies
              tree={intentTree}
              path={intentPath}
              disabled={isRunning}
              onSelect={handleIntentSelect}
            />
          ) : null}
        </div>

        {turns.length === 0
          ? intentSelections.map((selection, index) => {
              const isLast = index === intentSelections.length - 1;
              const showNextChips = showIntentPathChips && isLast;
              return (
                <div key={selection.id} className="chat-intent-block">
                  <div className="chat-row chat-row-user">
                    <div className="chat-bubble chat-bubble-user">
                      <p className="chat-bubble-text">{selection.label}</p>
                    </div>
                  </div>
                  <div className="chat-row chat-row-bot">
                    <div className="chat-bubble chat-bubble-bot">
                      <p className="chat-bubble-text">もう少し詳しく選んでください。</p>
                    </div>
                    {showNextChips ? (
                      <IntentQuickReplies
                        tree={intentTree}
                        path={intentPath}
                        disabled={isRunning}
                        onSelect={handleIntentSelect}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}

        {notice ? (
          <p className="conversation-stub-notice" role="status">
            {notice}
          </p>
        ) : null}

        {error ? (
          <p className="conversation-error" role="alert">
            {error}
          </p>
        ) : null}

        {turns.map((turn, turnIndex) => {
          const isLatestAnswered =
            !isRunning &&
            Boolean(turn.blocks) &&
            turnIndex === turns.length - 1 &&
            Boolean(result?.source);
          return (
            <div key={turn.id} className="conversation-turn">
              <div className="chat-row chat-row-user">
                <div className="chat-bubble chat-bubble-user">
                  <p className="chat-bubble-text">{turn.displayText}</p>
                </div>
              </div>

              {turn.blocks ? (
                <div className="chat-row chat-row-bot">
                  <div className="chat-bubble chat-bubble-bot chat-bubble-answer">
                    <DecisionCard
                      blocks={turn.blocks}
                      evidenceOpen={
                        turn.id in evidenceOpenByTurn
                          ? evidenceOpenByTurn[turn.id]
                          : undefined
                      }
                      onEvidenceOpenChange={(open) =>
                        setEvidenceOpenByTurn((prev) => ({ ...prev, [turn.id]: open }))
                      }
                      onCitationClick={handleCitationClick}
                    />
                    <FollowUpChips
                      chips={turn.blocks.followUps}
                      disabled={isRunning}
                      onSelect={(chip) => handleFollowUp(turn.id, chip)}
                    />
                    {clarifyTurnId === turn.id &&
                    turn.blocks.missingInfoChoices.length > 0 ? (
                      <ClarifyingChoice
                        choices={turn.blocks.missingInfoChoices}
                        disabled={isRunning}
                        onSelect={(choice) => handleClarify(turn.id, choice)}
                      />
                    ) : null}
                  </div>
                  {isLatestAnswered && result?.source && turn.blocks ? (
                    <div className="conversation-source-hints">
                      {turn.blocks.citations[0]?.documentTitle ? (
                        <p className="conversation-source-hint">
                          参照したご案内: {turn.blocks.citations[0].documentTitle}
                        </p>
                      ) : null}
                      {demoExplain ? (
                        <MechanismCard
                          source={result.source}
                          blocks={turn.blocks}
                        />
                      ) : (
                        <button
                          type="button"
                          className="conversation-explain-cta"
                          onClick={() => setDemoExplainMode(true)}
                        >
                          この案内の仕組みを見る
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}

        {turns.length > 0
          ? intentSelections.map((selection, index) => {
              const isLast = index === intentSelections.length - 1;
              const showNextChips = showIntentPathChips && isLast;
              return (
                <div key={selection.id} className="chat-intent-block">
                  <div className="chat-row chat-row-user">
                    <div className="chat-bubble chat-bubble-user">
                      <p className="chat-bubble-text">{selection.label}</p>
                    </div>
                  </div>
                  <div className="chat-row chat-row-bot">
                    <div className="chat-bubble chat-bubble-bot">
                      <p className="chat-bubble-text">もう少し詳しく選んでください。</p>
                    </div>
                    {showNextChips ? (
                      <IntentQuickReplies
                        tree={intentTree}
                        path={intentPath}
                        disabled={isRunning}
                        onSelect={handleIntentSelect}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}

        {isRunning ? (
          <div className="chat-row chat-row-bot">
            <TypingIndicator />
          </div>
        ) : null}

        <div ref={threadEndRef} />
      </div>

      {showComposerShortcuts ? (
        <div className="composer-shortcuts" aria-label="よくあるご用件">
          <IntentQuickReplies
            tree={intentTree}
            path={[]}
            disabled={isRunning}
            onSelect={handleIntentSelect}
          />
        </div>
      ) : null}

      <form className="conversation-composer" onSubmit={handleFreeSubmit}>
        <label className="visually-hidden" htmlFor="conversation-draft">
          質問を入力
        </label>
        <textarea
          id="conversation-draft"
          ref={textareaRef}
          className="conversation-composer-input"
          rows={1}
          value={draft}
          disabled={isRunning || pack.documents.length === 0}
          placeholder={
            pack.documents.length === 0
              ? "先にお試しナレッジへ文書を追加してください"
              : turns.length > 0
                ? "続けて質問できます"
                : "メッセージを入力"
          }
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleComposerKeyDown}
        />
        <button
          type="submit"
          className="conversation-composer-submit"
          disabled={isRunning || !draft.trim() || pack.documents.length === 0}
        >
          送信
        </button>
      </form>
    </div>
  );
}
