/** Limit Disclosure — set expectations before conversation starts. */
export function LimitDisclosure() {
  return (
    <aside className="limit-disclosure" aria-label="利用上の注意">
      <p className="limit-disclosure-can">
        <span className="limit-disclosure-label">できること</span>
        FAQ・ポリシーに基づくご案内、申請手順の整理、担当者への橋渡し
      </p>
      <p className="limit-disclosure-cannot">
        <span className="limit-disclosure-label">できないこと</span>
        ナレッジ外の約束、個別補償の確定、注文の実データ照会
      </p>
    </aside>
  );
}
