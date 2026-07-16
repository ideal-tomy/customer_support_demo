# カスタマーサポートAI — Demo Definition

**Demo ID:** `customer-support`  
**Demo Name:** カスタマーサポートAI（トワちゃん サポート）  
**Brand ID:** `towa-support`  
**Repository:** `customer_support_demo`（別URL公開想定）  
**Requirement File:** `docs/customer_support_requirements.md`  
**Extraction Map:** `docs/extraction_from_internal_knowledge.md`  
**UI Mock:** `docs/ai_customer_center_chat_mockup.html`

---

## 1. Demo Goal

> FAQ・返品ポリシー等を横断参照し、顧客チャットで結論・要点・次アクションと有人導線を提示できることを体験してもらう。あわせて自社FAQ投入での挙動確認ができる。

体験終了時の理想: 「自社のサポートにも載せられそう」「有人切替までの型が分かる」

詳細な次期体験設計: [`industry-packs/00_common/dual-lens-experience-plan.md`](industry-packs/00_common/dual-lens-experience-plan.md)

---

## 1.5 Dual Lens（Experience / Adoption）

同一デモで次の二層を両立する。別アプリには分けない。

| 層 | 目的 | 表示タイミング |
|----|------|----------------|
| **Experience（顧客層）** | 実サービス相当の接客利便性 | 常時・デフォルト |
| **Adoption（導入層）** | 自社に載せたい納得（仕組み・載せ替え） | デモ説明モード ON、設定／Knowledge シート |

### 表示境界

- **Experience のみ（デフォルト）:** チャット、常時ショートカット、回答カード、文脈 CTA、顧客向け「参照したご案内」
- **Adoption 追加（デモ説明 ON 時）:** 仕組みカード（回答方式・根拠・次アクション型）、3層説明、技術ラベル
- 顧客 UI に Layer / fixture / LLM 等の技術語を常時出さない
- お試しナレッジ・Access Mode・Trial ポータルは導入層の入口として残す

商談フロー: 顧客体験（A）→ 仕組みを見る（B）→ お試しナレッジで載せ替え（C）

---

## 2. Common Core Integration

使用する Core 機能:

- AI Request / Transport
- Provider Adapter（OpenAI 中心）
- Sample Mode / BYOK / Managed Trial
- Trial Status / Usage
- Knowledge（文字数カウント等）
- Storage

Package: `@axeon/ai-demo-core`（`file:./packages/ai-demo-core`）

原則: Provider / Trial をデモ側で再実装しない。体験コード取得は `VITE_TRIAL_PORTAL_URL` → Studio `/admin/trial`。

---

## 3. Access Mode

| Mode | 用途 |
|------|------|
| sample | ガイド質問 fixture + ローカル retrieve 合成 |
| byok-direct | 利用者 API キー |
| managed-trial | 体験コード + Gateway |

---

## 4. UI

- チャットアプリ型（モバイル最適化）
- ヘッダー: トワちゃん / AI対応中・24時間 / 有人アイコン
- クイックリプライ（配送・返品・請求）
- 回答カード: ステータスバッジ + 結論 + チェック箇条 + CTA
- FAQパックシート: サンプル / マイFAQ
- 設定シート: Access Mode
- 有人シート: 接続デモ演出

---

## 5. Input / Output Adapter

**Input:** 質問文 + pack context + conversationContext → retrieve chunks → prompt

**Output schema:** 社内デモと同型の JSON（status / conclusion / bullets / citations / followUps…）  
差分:

- システムプロンプトは CS 人格
- followUp に `escalate_human` を追加
- UI ラベルは顧客向け（回答できます / 申請方法 / 担当者に相談）

---

## 6. Retrieval

- 対象: Active Pack（サンプル or セッション custom）
- 方式: キーワードスコア（デモ側）
- カスタム投稿: sessionStorage のみ、タブ閉鎖で消去

---

## 7. Demo 固有 Delta

- ブランド・色・キャラクター
- CS サンプルパック
- 有人ハンドオフ演出
- マイFAQ / カタログ文言

Core に入れないもの: 有人キュー実装、注文データ連携、CS固有スキーマの強制共通化

---

## 8. 受け入れ条件

- [ ] サンプルFAQで返品・配送・請求が案内できる
- [ ] マイFAQ投稿後、その内容だけを根拠に回答できる
- [ ] 担当者相談シートが開ける
- [ ] Sample / BYOK / Trial が動く（環境設定時）
- [ ] 体験コード取得が Studio ポータルへ誘導される
- [ ] Provider 直叩きがない
- [ ] デモ説明 OFF で技術語が出ず、自由入力後も常時ショートカットが残る
- [ ] デモ説明 ON で仕組みカード（方式・根拠・次アクション型）が出る
- [ ] Dual Lens 詳細受け入れは `industry-packs/00_common/acceptance-checklist.md` に従う
