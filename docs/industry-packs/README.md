# 業種別カスタマーサポートデモ — 整理版インデックス

元メモ: [`../参考.md`](../参考.md)  
要件: [`../customer_support_requirements.md`](../customer_support_requirements.md)  
Definition: [`../customer_support_demo_definition.md`](../customer_support_demo_definition.md)

---

## このデモの一言

単なる FAQ 自動回答ではなく、**購入・予約前の不安を解消し、条件を確認し、次の行動まで案内する接客AI**。

現在の実装ですでに成立している基盤:

- サンプル FAQ と利用者投入 FAQ の切り替え
- ナレッジ本文の事前閲覧
- 回答根拠の表示
- 回答後のアクションボタン
- PC / スマートフォン対応

方針: **共通チャット基盤は固定し、業種別ナレッジパックと回答ルールだけ差し替える。**

---

## 推奨する完成順

| 順 | 業種パック ID | 見せる価値 |
|----|---------------|------------|
| 1 | `retail-commerce` | 情報検索＋比較＋注文後サポート（本命・最初に完成） |
| 2 | `restaurant` | 条件確認＋提案＋予約導線 |
| 3 | `beauty-salon` | ヒアリング＋メニュー案内＋安全な有人誘導 |

詳細な作業分解: [`00_common/work-plan.md`](00_common/work-plan.md)  
手動受け入れ: [`00_common/acceptance-checklist.md`](00_common/acceptance-checklist.md)

---

## ドキュメント構成

```text
docs/industry-packs/
├─ README.md                          ← 本ファイル
├─ 00_common/
│  ├─ work-plan.md                    ← 実装作業の順番（正）
│  ├─ acceptance-checklist.md         ← 手動受け入れチェックリスト
│  ├─ dual-lens-experience-plan.md    ← 顧客体験×導入訴求の次期大枠PLAN
│  ├─ sales-scripts.md                ← 営業向け3分台本（A→B→C）
│  ├─ answer-layers.md                ← 回答3層モデル
│  ├─ pack-architecture.md            ← 共通構造・差し替え契約
│  ├─ common-prompt.md                ← 全業種共通システムプロンプト
│  └─ ui-improvements.md              ← UI改善メモ
├─ 01_retail-commerce/
│  ├─ README.md                       ← 業種ふるまい・質問・ルール
│  └─ knowledge/                      ← 文書ごとのナレッジ仕様（1ファイル1文書）
├─ 02_restaurant/
│  ├─ README.md
│  └─ knowledge/
└─ 03_beauty-salon/
   ├─ README.md
   └─ knowledge/
```

各 `knowledge/*.md` は **本文の完成原稿ではなく仕様書** です。  
「何を書くか・どの体験に効くか・他文書との横断」を定義し、実装時に JSON / Markdown 本文へ落とし込みます。

---

## 回答の3層（全業種共通）

| Layer | 役割 | 例 |
|-------|------|-----|
| 1 | 確定情報への忠実な回答 | 営業時間、料金、送料、キャンセル期限 |
| 2 | 複数情報を組み合わせた提案 | 条件に合う商品／コース、返品可否の整理 |
| 3 | 外部システムまたは有人へ接続 | 在庫、空席、配送追跡、クレーム、健康判断 |

詳細: [`00_common/answer-layers.md`](00_common/answer-layers.md)

---

## 読み方（おすすめ順）

1. 本 README  
2. [`00_common/work-plan.md`](00_common/work-plan.md)  
3. [`00_common/answer-layers.md`](00_common/answer-layers.md) + [`pack-architecture.md`](00_common/pack-architecture.md)  
4. 着手業種の `0x_*/README.md`  
5. 同フォルダの `knowledge/*.md` を文書単位で埋めていく  

---

## 現状コードとの関係

実装済み:

- `data/sample/retail-commerce-v1/` / `restaurant-v1/` / `beauty-salon-v1/`
- 業種レジストリ: `src/packs/`（3業種とも available）
- 業種選択ファースト UX → チャット →「最初からやり直す」
- Phase 5: 顧客向け参照表示・デモ説明モード・お試しナレッジ案内

次期大枠（未実装の計画）:

- [`00_common/dual-lens-experience-plan.md`](00_common/dual-lens-experience-plan.md) — Experience（利便）と Adoption（導入ロジック）の両立
