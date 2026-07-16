import type { AnswerBlocks } from "../../types/internal-knowledge";
import {
  buildMechanismCardLines,
  type AskSource,
} from "../../demo/demo-explain-mode";

type MechanismCardProps = {
  source: AskSource;
  blocks: AnswerBlocks;
};

/** Adoption-layer explanation under an answer (demo explain mode only). */
export function MechanismCard({ source, blocks }: MechanismCardProps) {
  const lines = buildMechanismCardLines(source, blocks);
  return (
    <div className="mechanism-card" role="note">
      <p className="mechanism-card-title">仕組みメモ</p>
      <ul className="mechanism-card-list">
        <li>{lines.method}</li>
        <li>{lines.evidence}</li>
        <li>{lines.nextAction}</li>
      </ul>
    </div>
  );
}
