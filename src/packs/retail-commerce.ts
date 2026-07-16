import manifestJson from "../../data/sample/retail-commerce-v1/manifest.json";
import intentTreeJson from "../../data/sample/retail-commerce-v1/intent-tree.json";
import productCatalog from "../../data/sample/retail-commerce-v1/documents/product-catalog.json";
import productComparison from "../../data/sample/retail-commerce-v1/documents/product-comparison.json";
import inventoryRules from "../../data/sample/retail-commerce-v1/documents/inventory-rules.json";
import shippingGuide from "../../data/sample/retail-commerce-v1/documents/shipping-guide.json";
import returnExchange from "../../data/sample/retail-commerce-v1/documents/return-exchange.json";
import paymentGuide from "../../data/sample/retail-commerce-v1/documents/payment-guide.json";
import warrantyRepair from "../../data/sample/retail-commerce-v1/documents/warranty-repair.json";
import membershipPoints from "../../data/sample/retail-commerce-v1/documents/membership-points.json";
import type {
  GuidedQuestionDef,
  IntentTree,
  KnowledgeDocument,
  KnowledgePackManifest,
} from "../types/pack-shared";
import { retailFixtures, retailKeywordFixtures } from "./retail-fixtures";
import type { CustomerSupportPack } from "./types";

const promptOverlay = `
## 小売・EC（東和ライフストア）固定ルール
1. 商品価格、在庫、配送予定、キャンペーン情報は、登録された最新データだけを使用する。
2. 在庫情報がリアルタイムデータに接続されていない場合、「在庫があります」と断定しない。
3. 商品の特徴と、利用者の希望条件を分けて整理する。
4. 商品を提案する場合は、提案理由を明示する。
5. 返品・交換については、期限、商品状態、対象外条件、送料負担を確認する。
6. 注文情報を扱う場合は、注文番号など必要最小限の情報だけを求める。
7. クレジットカード番号、暗証番号、パスワードを入力させない。
8. 返金の確約、特別対応、値引きの確約は行わない。
9. ナレッジに存在しない仕様を推測しない。
10. 回答できない場合は、問い合わせ窓口または担当者へ接続する。
11. 個別注文の配送現在地はナレッジだけでは答えず、注文番号確認または担当者へ案内する。
12. followUps を必ず1〜3件返す（例: 申請方法を見る / 配送状況を確認 / 担当者に相談）。
`.trim();

const defaultFollowUps = [
  {
    id: "fu-retail-apply",
    label: "申請方法を見る",
    action: "ask_related" as const,
    payload: { guidedQuestionId: "gq-color-mismatch" },
  },
  {
    id: "fu-retail-ship",
    label: "配送状況を確認",
    action: "ask_related" as const,
    payload: { guidedQuestionId: "gq-shipping-track" },
  },
  {
    id: "fu-retail-human",
    label: "担当者に相談",
    action: "escalate_human" as const,
  },
];

export const retailGuidedQuestions: GuidedQuestionDef[] = [
  {
    id: "gq-return-deadline",
    question: "返品期限は何日ですか。",
    fixtureId: "return-deadline",
    difficulty: 1,
  },
  {
    id: "gq-color-mismatch",
    question:
      "商品が届きましたが、思っていた色と違いました。返品できますか。",
    fixtureId: "color-mismatch",
    difficulty: 2,
  },
  {
    id: "gq-delivery-by-day-after",
    question: "明後日までに東京へ届けられる商品はありますか。",
    fixtureId: "delivery-by-day-after",
    difficulty: 2,
  },
  {
    id: "gq-humidifier-pick",
    question:
      "一人暮らしで使う、小さくて手入れしやすい加湿器はどれですか。",
    fixtureId: "humidifier-pick",
    difficulty: 2,
  },
  {
    id: "gq-humidifier-compare",
    question:
      "Luna Mist Mini と Pro の違いを、価格以外も含めて教えてください。",
    fixtureId: "humidifier-compare",
    difficulty: 2,
  },
  {
    id: "gq-shipping-track",
    question: "注文番号 TW-20482 の配送状況を確認したいです。",
    fixtureId: "shipping-track",
    difficulty: 1,
  },
  {
    id: "gq-initial-defect",
    question: "開封しましたが初期不良でした。返品できますか。",
    fixtureId: "initial-defect",
    difficulty: 2,
  },
  {
    id: "gq-receipt",
    question: "領収書を会社名義で発行できますか。",
    fixtureId: "receipt-company",
    difficulty: 1,
  },
];

export const retailCommercePack: CustomerSupportPack = {
  industry: "retail-commerce",
  available: true,
  brand: {
    storeName: "東和ライフストア",
    assistantName: "トワちゃん サポート",
    companyName: "東和ライフストア（架空）",
  },
  uiLabels: {
    supportTitle: "トワちゃん サポート",
    statusLine: "AIが対応中・24時間受付",
    knowledgeSheetTitle: "商品・ご利用ガイド",
    sampleTabLabel: "店舗のご案内",
    customTabLabel: "お試しナレッジ",
    knowledgeEyebrow: "Support Knowledge",
  },
  manifest: manifestJson as KnowledgePackManifest,
  documents: [
    productCatalog,
    productComparison,
    inventoryRules,
    shippingGuide,
    returnExchange,
    paymentGuide,
    warrantyRepair,
    membershipPoints,
  ] as KnowledgeDocument[],
  intentTree: intentTreeJson as IntentTree,
  guidedQuestions: retailGuidedQuestions,
  fixtures: retailFixtures,
  keywordFixtures: retailKeywordFixtures,
  promptOverlay,
  systemPromptIntro: [
    "あなたは東和ライフストアのカスタマーサポートAI「トワ」です。",
    "暮らし・アウトドア・小型家電のオンラインショップ案内を担当します。",
    "与えられたFAQ・カタログ・規約だけを根拠に、お客様へ丁寧に案内してください。",
  ],
  defaultFollowUps,
};
