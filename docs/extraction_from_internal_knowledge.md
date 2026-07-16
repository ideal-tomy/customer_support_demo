# internal_knowledge_demo からの切り出し対応表

`customer_support_demo` は `internal_knowledge_demo` をベースに、**別URL・別 Demo Identity** として作成したカスタマー向けデモです。

## 転用した共通層（そのまま近い形で移植）

| 領域 | パス（本デモ） | 備考 |
|------|----------------|------|
| Active Pack / マイ投稿 | `src/knowledge/pack-store.ts` | storage key を `cs-*` に変更 |
| テキスト正規化 | `src/knowledge/normalize-text.ts` | md/txt → Document |
| Chunk 化 | `src/knowledge/chunks.ts` | 汎用 |
| キーワード検索 | `src/ai/retrieve.ts` | 同義語を CS 向けに差し替え |
| Ask オーケストレーション | `src/ai/askInternalKnowledge.ts` | fixture / プロンプト差し替え |
| Input / Output Adapter 骨格 | `src/ai/adapters/*` | スキーマは流用、人格・ルールは CS |
| UI → AnswerBlocks | `src/adapters/internal-knowledge-output-adapter.ts` | 流用 |
| Access Mode / Trial | `src/access/*`, `AccessModeBar`, `api/trial/*`, `vite.ik-api.ts` | demoId / namespace 変更 |
| Core 接続 | `src/lib/ai-demo-core-setup.ts`, `packages/ai-demo-core` | 同方式 |
| チャット進行 | `ConversationShell`, `useAskFlow`, `BottomSheet` 等 | 文言・CTA 差し替え |
| モバイル viewport | `useVisualViewportHeight` | 流用 |

## カスタマー固有に差し替えた層

| 領域 | 内容 |
|------|------|
| Brand / Demo Config | トワちゃん / `customer-support` |
| サンプルパック | 返品・配送・請求 FAQ（`data/sample/towa-customer-support-v1/`） |
| ガイド質問 / fixture | CS シナリオ |
| システムプロンプト | カスタマーサポート人格 |
| 回答カード | `DecisionCard` → モック準拠の support-card |
| シェル UI | アバター、24h 表示、有人（headset）シート |
| Follow-up | `escalate_human` アクション追加 |
| テーマ CSS | 緑系（`.cs-theme`） |

## 意図的に共有パッケージ化しなかった理由

当面はデモごとの自己完結（Studio / dd_demo / product_flow と同じ）を優先しました。  
共通化パッケージ化は、両デモの Adapter 契約が安定してからでも遅くありません。

## 社内デモ側との関係

- `internal_knowledge_demo` は変更せず、社内ストーリー用に維持
- 本デモは別リポジトリ／別デプロイを想定（別 URL）
