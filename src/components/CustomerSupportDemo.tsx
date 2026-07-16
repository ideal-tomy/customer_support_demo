import { useEffect, useState } from "react";
import { AccessModeBar } from "./access/AccessModeBar";
import { ConversationShell } from "./conversation/ConversationShell";
import { KnowledgePanel } from "./knowledge/KnowledgePanel";
import { BottomSheet } from "./ui/BottomSheet";
import { useVisualViewportHeight } from "../hooks/useVisualViewportHeight";
import { useKnowledgePack } from "../knowledge/pack-store";
import type { OpenDocumentTarget } from "../knowledge/sample-pack";

const trialPortalUrl =
  import.meta.env.VITE_TRIAL_PORTAL_URL?.trim() ||
  "https://ai-demo-studio-lime.vercel.app/admin/trial";

type SheetKind = "none" | "knowledge" | "settings" | "human";

/** Customer support chat shell — mockup-aligned header + thread. */
export function CustomerSupportDemo() {
  const { height, offsetTop } = useVisualViewportHeight();
  const pack = useKnowledgePack();
  const [activeTarget, setActiveTarget] = useState<OpenDocumentTarget | null>(null);
  const [sheet, setSheet] = useState<SheetKind>("none");

  const handleOpenDocument = (target: OpenDocumentTarget) => {
    setActiveTarget(target);
    setSheet("knowledge");
  };

  useEffect(() => {
    setActiveTarget((prev) => {
      if (!prev) return prev;
      const exists = pack.documents.some((d) => d.id === prev.documentId);
      return exists ? prev : null;
    });
  }, [pack.revision, pack.documents]);

  return (
    <div
      className="chat-app cs-theme"
      style={{
        height: height > 0 ? `${height}px` : "100dvh",
        transform: offsetTop ? `translateY(${offsetTop}px)` : undefined,
      }}
    >
      <div className="chat-app-column">
        <header className="chat-app-header cs-header">
          <div className="cs-header-main">
            <TowaAvatar size={38} />
            <div className="cs-header-text">
              <h1 className="chat-app-title">{pack.uiLabels.supportTitle}</h1>
              <p className="cs-header-status">
                <span className="cs-status-dot" aria-hidden="true" />
                {pack.uiLabels.statusLine}
              </p>
            </div>
          </div>
          <div className="chat-app-header-actions">
            <button
              type="button"
              className={
                pack.isSample
                  ? "chat-app-pack-badge"
                  : "chat-app-pack-badge is-custom"
              }
              onClick={() => setSheet("knowledge")}
              title={pack.uiLabels.knowledgeSheetTitle}
            >
              {pack.isSample
                ? pack.uiLabels.sampleTabLabel
                : pack.uiLabels.customTabLabel}
            </button>
            <button
              type="button"
              className="chat-app-icon-btn"
              aria-label="担当者に相談"
              onClick={() => setSheet("human")}
            >
              <HeadsetIcon />
            </button>
            <button
              type="button"
              className="chat-app-icon-btn"
              aria-label="FAQパック"
              onClick={() => setSheet("knowledge")}
            >
              <InfoIcon />
            </button>
            <button
              type="button"
              className="chat-app-icon-btn"
              aria-label="設定"
              onClick={() => setSheet("settings")}
            >
              <SettingsIcon />
            </button>
          </div>
        </header>

        <ConversationShell
          onOpenDocument={handleOpenDocument}
          onEscalateHuman={() => setSheet("human")}
        />
      </div>

      <BottomSheet
        open={sheet === "knowledge"}
        title={pack.uiLabels.knowledgeSheetTitle}
        onClose={() => setSheet("none")}
      >
        <KnowledgePanel
          activeTarget={activeTarget}
          onSelectDocument={(documentId) =>
            setActiveTarget({ documentId, sectionId: undefined })
          }
        />
      </BottomSheet>

      <BottomSheet
        open={sheet === "human"}
        title="担当者に相談"
        onClose={() => setSheet("none")}
      >
        <div className="cs-human-sheet">
          <TowaAvatar size={48} />
          <p className="cs-human-title">有人サポートへ接続（デモ）</p>
          <p className="cs-human-body">
            本番ではチャットや電話の担当者キューへ接続します。このデモでは接続演出のみです。
            AIで解決できない個別事情・補償判断などは、こちらからお進みください。
          </p>
          <button
            type="button"
            className="cs-human-cta"
            onClick={() => setSheet("none")}
          >
            閉じる
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={sheet === "settings"}
        title="アクセス設定"
        onClose={() => setSheet("none")}
      >
        <AccessModeBar trialPortalUrl={trialPortalUrl} />
      </BottomSheet>
    </div>
  );
}

export function TowaAvatar({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="cs-avatar"
    >
      <circle cx="20" cy="20" r="19" fill="#E1F5EE" />
      <circle cx="20" cy="22" r="11" fill="#1D9E75" />
      <circle cx="16" cy="20" r="1.8" fill="#E1F5EE" />
      <circle cx="24" cy="20" r="1.8" fill="#E1F5EE" />
      <path
        d="M16.5 25 Q20 27.5 23.5 25"
        stroke="#E1F5EE"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M13 12 Q20 7 27 12"
        stroke="#1D9E75"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4 12v3.5A2.5 2.5 0 0 0 6.5 18H8v-6H6.5A2.5 2.5 0 0 0 4 14.5V12Zm16 0v2.5A2.5 2.5 0 0 1 17.5 17H16v-5h1.5A2.5 2.5 0 0 1 20 14.5V12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M16 17.5v1A2.5 2.5 0 0 1 13.5 21H12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="8" r="1.1" fill="currentColor" />
      <path
        d="M12 11.25v5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M19.4 13.1c.04-.36.06-.73.06-1.1s-.02-.74-.06-1.1l1.7-1.33a.4.4 0 0 0 .1-.51l-1.61-2.79a.4.4 0 0 0-.48-.18l-2 .8a7.3 7.3 0 0 0-1.9-1.1l-.3-2.13A.4.4 0 0 0 14.5 3h-5a.4.4 0 0 0-.4.34l-.3 2.13a7.3 7.3 0 0 0-1.9 1.1l-2-.8a.4.4 0 0 0-.48.18L2.8 9.06a.4.4 0 0 0 .1.51L4.6 10.9c-.04.36-.06.73-.06 1.1s.02.74.06 1.1L2.9 14.43a.4.4 0 0 0-.1.51l1.61 2.79c.1.18.3.25.48.18l2-.8c.58.45 1.22.82 1.9 1.1l.3 2.13c.03.2.2.34.4.34h5c.2 0 .37-.14.4-.34l.3-2.13c.68-.28 1.32-.65 1.9-1.1l2 .8c.18.07.38 0 .48-.18l1.61-2.79a.4.4 0 0 0-.1-.51L19.4 13.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
