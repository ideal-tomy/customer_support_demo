import manifestJson from "../../data/sample/beauty-salon-v1/manifest.json";
import intentTreeJson from "../../data/sample/beauty-salon-v1/intent-tree.json";
import salonBasic from "../../data/sample/beauty-salon-v1/documents/salon-basic.json";
import menuList from "../../data/sample/beauty-salon-v1/documents/menu-list.json";
import firstVisit from "../../data/sample/beauty-salon-v1/documents/first-visit.json";
import menuSelection from "../../data/sample/beauty-salon-v1/documents/menu-selection.json";
import preCare from "../../data/sample/beauty-salon-v1/documents/pre-care.json";
import afterCare from "../../data/sample/beauty-salon-v1/documents/after-care.json";
import contraindications from "../../data/sample/beauty-salon-v1/documents/contraindications.json";
import reservationCancel from "../../data/sample/beauty-salon-v1/documents/reservation-cancel.json";
import ticketPricing from "../../data/sample/beauty-salon-v1/documents/ticket-pricing.json";
import humanEscalation from "../../data/sample/beauty-salon-v1/documents/human-escalation.json";
import type {
  GuidedQuestionDef,
  IntentTree,
  KnowledgeDocument,
  KnowledgePackManifest,
} from "../types/pack-shared";
import { beautyFixtures, beautyKeywordFixtures } from "./beauty-fixtures";
import type { CustomerSupportPack } from "./types";

const promptOverlay = `
## エステ・美容サロン（Beauty Salon Lueur）固定ルール
1. 病名・原因・治療法を判断しない。
2. 医療上の診断・治療効果・安全性を断定しない。
3. 「治る」「改善する」「必ず効果」を使わない。
4. 体調質問は一般的な利用条件の案内に限定する。
5. 痛み・出血・強い赤み・腫れ・発熱では施術を勧めない（メニュー提案禁止）。
6. 通院・服薬・妊娠・授乳・持病はスタッフ／必要なら医療機関確認を案内する。
7. 「利用できる」と個別確約しない。
8. メニューは「候補」、最終は来店カウンセリング後とする。
9. 未記載の施術・効果・禁忌を推測しない。医療脱毛・HIFU・治療行為は扱わない。
10. 緊急性が疑われる内容はチャット継続せず医療機関へ案内する。
11. 料金・時間・キャンセルは登録情報に忠実にする（キャンセル無料は24時間前まで、遅刻は15分超で短縮またはキャンセル扱い）。
12. 回答後に「メニューを見る」「予約する」「スタッフへ相談」などの次アクションを案内する。
13. followUps を必ず1〜3件返す。危険症状時はメニュー提案チップを出さず、スタッフへ相談を優先する。
`.trim();

const defaultFollowUps = [
  {
    id: "fu-beauty-menu",
    label: "メニューを見る",
    action: "ask_related" as const,
    payload: { guidedQuestionId: "gq-first-facial" },
  },
  {
    id: "fu-beauty-reserve",
    label: "予約する",
    action: "ask_related" as const,
    payload: { guidedQuestionId: "gq-late-15min" },
  },
  {
    id: "fu-beauty-staff",
    label: "スタッフへ相談",
    action: "escalate_human" as const,
  },
];

export const beautyGuidedQuestions: GuidedQuestionDef[] = [
  {
    id: "gq-first-facial",
    question: "初めてですが、どのフェイシャルを選べばよいですか？",
    fixtureId: "first-facial",
    difficulty: 2,
  },
  {
    id: "gq-dry-skin-menu",
    question: "乾燥が気になります。利用できるメニューは？",
    fixtureId: "dry-skin-menu",
    difficulty: 2,
  },
  {
    id: "gq-makeup-day",
    question: "施術当日はメイクをして行っても大丈夫ですか？",
    fixtureId: "makeup-day",
    difficulty: 1,
  },
  {
    id: "gq-late-15min",
    question: "予約に15分遅れそうです。",
    fixtureId: "late-15min",
    difficulty: 1,
  },
  {
    id: "gq-pain-redness",
    question: "昨日から赤みと痛みがあります。どの施術がよいですか？",
    fixtureId: "pain-redness",
    difficulty: 3,
  },
  {
    id: "gq-pregnancy",
    question: "妊娠中でも利用できますか？",
    fixtureId: "pregnancy",
    difficulty: 3,
  },
  {
    id: "gq-dermatology",
    question: "皮膚科に通院中ですが受けられますか？",
    fixtureId: "dermatology",
    difficulty: 3,
  },
];

export const beautySalonPack: CustomerSupportPack = {
  industry: "beauty-salon",
  available: true,
  brand: {
    storeName: "Beauty Salon Lueur",
    assistantName: "Lueur サポート",
    companyName: "Beauty Salon Lueur（架空）",
  },
  uiLabels: {
    supportTitle: "Lueur サポート",
    statusLine: "AIが対応中・予約制サロン案内",
    knowledgeSheetTitle: "メニュー・ご利用案内",
    sampleTabLabel: "店舗のご案内",
    customTabLabel: "お試しナレッジ",
    knowledgeEyebrow: "Salon Knowledge",
  },
  manifest: manifestJson as KnowledgePackManifest,
  documents: [
    salonBasic,
    menuList,
    firstVisit,
    menuSelection,
    preCare,
    afterCare,
    contraindications,
    reservationCancel,
    ticketPricing,
    humanEscalation,
  ] as KnowledgeDocument[],
  intentTree: intentTreeJson as IntentTree,
  guidedQuestions: beautyGuidedQuestions,
  fixtures: beautyFixtures,
  keywordFixtures: beautyKeywordFixtures,
  promptOverlay,
  systemPromptIntro: [
    "あなたは Beauty Salon Lueur のカスタマーサポートAIです。",
    "フェイシャル・ボディケア・リラクゼーションの予約制サロン案内を担当します。",
    "与えられたメニュー・規約・注意事項だけを根拠に、お客様へ丁寧に案内してください。",
  ],
  defaultFollowUps,
};
