# 実装作業計画（順番つき）

作業は上から順に進める。各 Phase の受け入れを満たしてから次へ進む。

---

## Phase 0 — 設計・仕様の固定（完了）

| # | 作業 | 成果物 | 状態 |
|---|------|--------|------|
| 0.1 | 参考メモの整理・索引化 | `industry-packs/README.md` | 完了 |
| 0.2 | 共通ふるまい（3層・パック契約・プロンプト）の文書化 | `00_common/*.md` | 完了 |
| 0.3 | 業種別ふるまい・質問・固定ルールの整理 | 各業種 `README.md` | 完了 |
| 0.4 | サンプルナレッジの文書単位仕様 | 各業種 `knowledge/*.md` | 完了 |

**受け入れ:** knowledge 仕様が揃い、本文作成（小売から）に入れる状態。 → **達成済み**

---

## Phase 1 — パック基盤（コード）

| # | 作業 | 内容 | 状態 |
|---|------|------|------|
| 1.1 | `CustomerSupportPack` 型の導入 | `src/packs/types.ts` | 完了 |
| 1.2 | パックレジストリ | retail / restaurant / beauty いずれも `available: true` | 完了 |
| 1.3 | UI の業種切替 | 業種選択ファースト UX | 完了 |
| 1.4 | 表示名の業種別差し替え | uiLabels（商品・ご利用ガイド等） | 完了 |
| 1.5 | 固定回答 / AI+ナレッジ / 有人 | fixtures + promptOverlay + escalate | 完了 |

**受け入れ:** パックを差し替えるとブランド名・ガイド質問・ナレッジが一括で変わる。 → **小売＋飲食＋エステで達成**

---

## Phase 2 — 小売・EC パック（本命）

| # | 作業 | 内容 | 状態 |
|---|------|------|------|
| 2.1 | 架空店舗「東和ライフストア」のブランド設定 | retail-commerce pack | 完了 |
| 2.2 | knowledge 仕様に沿った本文作成 | `data/sample/retail-commerce-v1/` | 完了 |
| 2.3 | Layer 1 固定回答 | fixtures（返品期限・領収書・色違い等） | 完了 |
| 2.4 | Layer 2 AI 横断シナリオ | 初期不良×保証、加湿器比較 fixture | 完了 |
| 2.5 | Layer 3 デモ演出 | TW-20482 インプロセス追跡モック（`src/mocks/shipping-track.ts`） | 完了 |
| 2.6 | ガイド質問・fixture・intent tree | Q1–Q8 対応 | 完了 |
| 2.7 | 固定返信ルールを promptOverlay | 完了 |

---

## Phase 3 — 飲食店パック

| # | 作業 | 内容 | 状態 |
|---|------|------|------|
| 3.1 | 「旬菜ダイニング 灯」ブランド | restaurant pack | 完了 |
| 3.2 | knowledge 本文作成 | `data/sample/restaurant-v1/`（仕様 MD は確定値反映済み） | 完了 |
| 3.3 | アレルギー・空席のガード | dairy-allergy / vacancy-today-19 fixtures | 完了 |
| 3.4 | コース提案＋予約導線 CTA | course-5k-drink 等 | 完了 |
| 3.5 | 空席確認のモック連携 | Layer 3 `needs_confirmation`（本番 API なし） | 完了 |

**受け入れ:** 人数×予算×アレルギー系の横断提案と、空席→予約の導線が見える。 → **達成**

---

## Phase 4 — エステ・美容サロンパック

| # | 作業 | 内容 | 状態 |
|---|------|------|------|
| 4.1 | 「Beauty Salon Lueur」ブランド | 医療脱毛・HIFU 等は含めない | 完了 |
| 4.2 | knowledge 本文作成 | `data/sample/beauty-salon-v1/`（仕様 MD に確定値反映済み） | 完了 |
| 4.3 | 危険質問の固定拒否／有人誘導 | pain-redness fixture（メニュー提案禁止） | 完了 |
| 4.4 | メニュー候補提示（断定しない） | first-facial / dry-skin-menu | 完了 |
| 4.5 | registry 有効化・ガイド質問 | `beauty-salon` available: true | 完了 |

**受け入れ:** 通常のメニュー相談と、危険質問で施術を勧めない挙動が明確。 → **達成**

---

## Phase 5 — 磨き込み（全業種）

| # | 作業 | 内容 | 状態 |
|---|------|------|------|
| 5.1 | 回答ソース表示の顧客向け文言 | 「参照したご案内: …」 | 完了 |
| 5.2 | デモ説明モード（固定 / AI+ナレッジ / 業務連携） | 設定トグル＋sessionStorage | 完了 |
| 5.3 | マイFAQ と業種パックの同居 UX | Knowledge ヒント＋custom バナー（表示名は「お試しナレッジ」） | 完了 |
| 5.4 | Ground Truth / 代表質問チェックリスト | `acceptance-checklist.md`（手動） | 完了 |

**受け入れ:** 顧客向け参照表示と、技術向けデモ説明モードの切替ができる。 → **達成**

---

## やらないこと（この計画のスコープ外）

- 業種ごとに別リポジトリ・別アプリを増やすこと
- 本番在庫・予約・配送 API の本接続（デモはモックで十分）
- 配送業者向けデモの先行実装（小売の注文・配送部分からの横展開は後続）

---

## 次の一手

次期の大枠は Dual Lens PLAN に移行する。

1. [`dual-lens-experience-plan.md`](dual-lens-experience-plan.md) に沿って DL-0 → DL-1 から着手する  
2. [`acceptance-checklist.md`](acceptance-checklist.md) は Dual Lens 受け入れ追記後に手動確認する  
3. 本番 API 接続が必要になったら別タスクとして切り出す  
