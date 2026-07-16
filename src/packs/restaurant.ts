import manifestJson from "../../data/sample/restaurant-v1/manifest.json";
import intentTreeJson from "../../data/sample/restaurant-v1/intent-tree.json";
import storeBasic from "../../data/sample/restaurant-v1/documents/store-basic.json";
import seatingFacilities from "../../data/sample/restaurant-v1/documents/seating-facilities.json";
import regularMenu from "../../data/sample/restaurant-v1/documents/regular-menu.json";
import courseGuide from "../../data/sample/restaurant-v1/documents/course-guide.json";
import drinkGuide from "../../data/sample/restaurant-v1/documents/drink-guide.json";
import allergyPolicy from "../../data/sample/restaurant-v1/documents/allergy-policy.json";
import reservationPolicy from "../../data/sample/restaurant-v1/documents/reservation-policy.json";
import occasionGuide from "../../data/sample/restaurant-v1/documents/occasion-guide.json";
import takeout from "../../data/sample/restaurant-v1/documents/takeout.json";
import type {
  GuidedQuestionDef,
  IntentTree,
  KnowledgeDocument,
  KnowledgePackManifest,
} from "../types/pack-shared";
import {
  restaurantFixtures,
  restaurantKeywordFixtures,
} from "./restaurant-fixtures";
import type { CustomerSupportPack } from "./types";

const promptOverlay = `
## 飲食店（旬菜ダイニング 灯）固定ルール
1. 営業時間・価格・コース・予約条件は登録情報だけを使用する。
2. 空席は予約システム確認まで断定しない（「空いています」と言わない）。
3. アレルギーで「完全に安全」「完全除去できる」と保証しない。
4. 共用厨房・油による混入可能性を明示する。
5. 重度アレルギーは事前の店舗確認を案内する。
6. 目的・人数・予算・時間を確認して候補を提案する（最適断定はしない）。
7. コース提案時は価格・内容・予約期限を表示する。
8. キャンセル料は日時・人数・コース有無の規定に忠実にする（前日18時まで無料／当日50%／無断100%）。
9. 個別対応を確約せず、必要なら店舗確認へ案内する。
10. 回答後に「予約する」「空席を確認」「店舗へ相談」のいずれかを案内する。
`.trim();

export const restaurantGuidedQuestions: GuidedQuestionDef[] = [
  {
    id: "gq-hours-holiday",
    question: "営業時間と定休日は？",
    fixtureId: "hours-holiday",
    difficulty: 1,
  },
  {
    id: "gq-course-5k-drink",
    question: "一人5,000円程度で、飲み放題付きのコースはありますか？",
    fixtureId: "course-5k-drink",
    difficulty: 2,
  },
  {
    id: "gq-family-saturday",
    question: "大人4人、子ども2人で土曜日に利用できますか？",
    fixtureId: "family-saturday",
    difficulty: 2,
  },
  {
    id: "gq-dairy-allergy",
    question: "乳製品アレルギーがありますが、対応できますか？",
    fixtureId: "dairy-allergy",
    difficulty: 2,
  },
  {
    id: "gq-anniversary-quiet",
    question: "両親の結婚記念日で利用したい。静かな席はありますか？",
    fixtureId: "anniversary-quiet",
    difficulty: 2,
  },
  {
    id: "gq-cancel-reduce-1",
    question: "予約を1人減らしたい。キャンセル料は？",
    fixtureId: "cancel-reduce-1",
    difficulty: 1,
  },
  {
    id: "gq-vacancy-today-19",
    question: "今日19時から4名で空いていますか？",
    fixtureId: "vacancy-today-19",
    difficulty: 3,
  },
];

export const restaurantPack: CustomerSupportPack = {
  industry: "restaurant",
  available: true,
  brand: {
    storeName: "旬菜ダイニング 灯",
    assistantName: "灯 サポート",
    companyName: "旬菜ダイニング 灯（架空）",
  },
  uiLabels: {
    supportTitle: "灯 サポート",
    statusLine: "AIが対応中・ご予約案内",
    knowledgeSheetTitle: "メニュー・ご予約案内",
    sampleTabLabel: "店舗のご案内",
    customTabLabel: "お試しナレッジ",
    knowledgeEyebrow: "Dining Knowledge",
  },
  manifest: manifestJson as KnowledgePackManifest,
  documents: [
    storeBasic,
    seatingFacilities,
    regularMenu,
    courseGuide,
    drinkGuide,
    allergyPolicy,
    reservationPolicy,
    occasionGuide,
    takeout,
  ] as KnowledgeDocument[],
  intentTree: intentTreeJson as IntentTree,
  guidedQuestions: restaurantGuidedQuestions,
  fixtures: restaurantFixtures,
  keywordFixtures: restaurantKeywordFixtures,
  promptOverlay,
  systemPromptIntro: [
    "あなたは旬菜ダイニング 灯のカスタマーサポートAIです。",
    "和食ダイニングのメニュー・コース・予約案内を担当します。",
    "与えられたメニュー・規約だけを根拠に、お客様へ丁寧に案内してください。",
    "空席の有無を断定しないこと。アレルギーの完全安全を保証しないこと。",
    "コース提案は候補提示に留め、価格・予約期限を正確に扱うこと。",
    "不明点や個別対応は店舗確認・有人へ案内すること。",
  ],
};
