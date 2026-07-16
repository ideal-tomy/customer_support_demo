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

営業端末で起動時から仕組み説明を出す場合: `http://localhost:5173/?explain=1`（ポートは環境による）。

### Access Mode の確認

| Mode | 確認内容 |
|------|----------|
| サンプル | Provider 非呼び出し。固定回答／ローカル合成 |
| APIキー（BYOK） | 設定にキーを保存し、自由質問で LLM 回答 |
| 体験コード | Studio ポータルでコード取得 → 設定に保存 → 質問 |

Core を Studio から取り込む: `npm run vendor-core`（隣に `AI-Demo-Studio` があること）。

## ドキュメント

- [`docs/customer_support_requirements.md`](docs/customer_support_requirements.md) — テーマ別要件
- [`docs/customer_support_demo_definition.md`](docs/customer_support_demo_definition.md) — Demo Definition（Dual Lens 含む）
- [`docs/industry-packs/00_common/dual-lens-experience-plan.md`](docs/industry-packs/00_common/dual-lens-experience-plan.md) — 顧客体験×導入訴求
- [`docs/industry-packs/00_common/sales-scripts.md`](docs/industry-packs/00_common/sales-scripts.md) — 営業向け3分台本
