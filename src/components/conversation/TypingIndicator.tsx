/** Bot 応答待ちのタイピングインジケーター（顧客向け文言つき）。 */
export function TypingIndicator() {
  return (
    <div
      className="typing-indicator"
      role="status"
      aria-live="polite"
      aria-label="ご案内を確認しています"
    >
      <div className="typing-indicator-dots" aria-hidden="true">
        <span className="typing-indicator-dot" />
        <span className="typing-indicator-dot" />
        <span className="typing-indicator-dot" />
      </div>
      <p className="typing-indicator-label">ご案内を確認しています…</p>
    </div>
  );
}
