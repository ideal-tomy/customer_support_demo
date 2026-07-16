import type { AnswerBlocks, AnswerStatus, Citation } from "../../types/internal-knowledge";

const STATUS_LABEL: Record<AnswerStatus, string> = {
  allowed: "ご案内できます",
  conditional: "条件付きでご案内できます",
  needs_confirmation: "確認が必要です",
  not_allowed: "こちらではお受けできません",
  not_found: "ご案内が見つかりません",
};

type DecisionCardProps = {
  blocks: AnswerBlocks;
  evidenceOpen?: boolean;
  onEvidenceOpenChange?: (open: boolean) => void;
  onCitationClick?: (citation: Citation) => void;
};

/**
 * Customer-support answer card (mockup-aligned).
 */
export function DecisionCard({
  blocks,
  evidenceOpen,
  onEvidenceOpenChange,
  onCitationClick,
}: DecisionCardProps) {
  const open =
    evidenceOpen ?? (blocks.evidenceCollapsedByDefault ? false : true);
  const conditions = blocks.conditions.slice(0, 3);
  const exceptions = blocks.exceptions.slice(0, 3);
  const procedures = blocks.procedures.slice(0, 4);
  const notices = [...conditions, ...exceptions];

  return (
    <article className="support-card" data-status={blocks.status}>
      <span className={`support-status-badge status-${blocks.status}`}>
        {STATUS_LABEL[blocks.status]}
      </span>

      <p className="support-conclusion">{blocks.conclusion}</p>

      {blocks.bullets.length > 0 ? (
        <ul className="support-check-list">
          {blocks.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {notices.length > 0 ? (
        <section className="support-notices">
          <p className="support-notices-title">ご注意</p>
          <ul>
            {notices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {procedures.length > 0 ? (
        <section className="support-procedures">
          <p className="support-procedures-title">次の手順</p>
          <ol>
            {procedures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {blocks.missingInformation.length > 0 ? (
        <section className="support-missing">
          <p className="support-missing-title">確認させてください</p>
          <ul>
            {blocks.missingInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {blocks.citations.length > 0 ? (
        <details
          className="support-evidence"
          open={open}
          onToggle={(e) =>
            onEvidenceOpenChange?.((e.target as HTMLDetailsElement).open)
          }
        >
          <summary>参考にしたご案内（{blocks.citations.length}件）</summary>
          <ul className="support-citation-list">
            {blocks.citations.map((c) => (
              <li key={`${c.documentId}:${c.sectionId}`}>
                <button
                  type="button"
                  className="support-citation-btn"
                  onClick={() => onCitationClick?.(c)}
                >
                  {c.documentTitle}
                  {c.articleNumber ? ` ${c.articleNumber}` : ""} — {c.sectionTitle}
                </button>
                <p className="support-citation-excerpt">{c.excerpt}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}
