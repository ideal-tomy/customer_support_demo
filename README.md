# カスタマーサポートAI（トワちゃん サポート）

顧客向けチャットボットのデモです。FAQ・返品／配送ポリシーを根拠に回答し、体験者が自社の FAQ やカタログテキストを投入して挙動確認できます。

社内ナレッジデモ（`internal_knowledge_demo`）から転用した共通層の対応表は  
[`docs/extraction_from_internal_knowledge.md`](docs/extraction_from_internal_knowledge.md) を参照してください。

## 開発

```bash
npm install
cp .env.example .env.local   # Trial 用キーは Studio と共有可
npm run dev
```

体験コード取得は `VITE_TRIAL_PORTAL_URL`（Studio `/admin/trial`）へ誘導します。

## ドキュメント

- [`docs/customer_support_requirements.md`](docs/customer_support_requirements.md) — テーマ別要件
- [`docs/customer_support_demo_definition.md`](docs/customer_support_demo_definition.md) — Demo Definition
