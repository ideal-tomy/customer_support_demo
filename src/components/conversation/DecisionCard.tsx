import type { AnswerBlocks, AnswerStatus, Citation } from "../../types/internal-knowledge";

const STATUS_LABEL: Record<AnswerStatus, string> = {
  allowed: "回答できます",
  conditional: "条件付きで案内できます",
  needs_confirmation: "確認が必要です",
  not_allowed: "ご案内できません",
  not_found: "該当案内なし",
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
