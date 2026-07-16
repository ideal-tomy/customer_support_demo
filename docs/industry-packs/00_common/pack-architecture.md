# 共通デモ構造と業種パック契約

## 目標構造

```text
Customer Support AI
├─ 共通チャットUI
├─ FAQ・カタログ閲覧
├─ 根拠表示
├─ 回答カード
├─ アクションボタン
├─ 有人切り替え
│
└─ 業種別パック
   ├─ retail-commerce
   ├─ restaurant
   └─ beauty-salon
```

3個の別アプリは作らない。**共通ボット＋業種別ナレッジパック**。

---

## パック差し替え対象

業種ごとに差し替えるもの:

| 項目 | 説明 |
|------|------|
| brand | 店舗名・トーン・ウェルカム |
| knowledgeDocuments | サンプル文書一式 |
| sampleQuestions / intent tree | ガイド質問 |
| fixedResponseRules | Layer 1 固定回答ルール |
| aiPromptOverlay | 業種固有の追加指示 |
| escalationRules | 有人へ渡す条件 |
| actionDefinitions | CTA（商品を見る / 空席確認 等） |

共通のまま残すもの:

- チャットシェル、retrieve 骨格、Core / Trial、マイFAQ 投入、有人シートの枠

---

## 型イメージ（実装時）

```ts
type CustomerSupportPack = {
  industry: "retail-commerce" | "restaurant" | "beauty-salon";
  brand: BrandConfig;
  knowledgeDocuments: KnowledgeDocument[];
  sampleQuestions: SampleQuestion[];
  fixedResponseRules: ResponseRule[];
  aiPromptOverlay: string;
  escalationRules: EscalationRule[];
  actionDefinitions: ActionDefinition[];
};
```

ナレッジ本文の正本は将来 `data/sample/<packId>/` に置く。  
仕様の正本は `docs/industry-packs/0x_*/knowledge/*.md`。

---

## 適性条件（業種選定の観点）

向いているのは「質問が多い」だけでなく、次が重なる業種:

| 条件 | 内容 |
|------|------|
| 購入前に確認事項が多い | 料金、条件、所要時間、対象者、キャンセル |
| 質問が売上に直結 | 回答後に購入・予約・来店 |
| 同じ質問が繰り返される | 営業時間、送料、持ち物、支払い |
| 情報が分散 | FAQ・規約・メニュー・商品を横断 |
| 営業時間外にも質問 | 夜間・休日 |
| 次の行動が明確 | 予約、購入、在庫確認、問い合わせ |
| 有人切替条件が定義できる | 個別判断、クレーム、健康、例外 |

推奨順位（参考メモより）: 小売・EC → 飲食 → エステ → 宿泊 → 整骨院 → 配送業者。  
本計画の初期スコープは上位3業種。
