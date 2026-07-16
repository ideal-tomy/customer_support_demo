import type { InternalKnowledgeOutput } from "../types/internal-knowledge";

export type AnswerSkeletonFixture = {
  id: string;
  title: string;
  question: string;
  output: InternalKnowledgeOutput;
};

const emptyWorkflow = {
  suggestedFields: {},
  automationCandidates: [] as string[],
};

export const fixtureReturnPolicy: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion: "未使用品は到着後14日以内に返品できます",
  answer:
    "未使用・未開封の商品は到着後14日以内にマイページから返品申請できます。初期不良の場合は送料当社負担です。",
  bullets: [
    "送料は当社負担（初期不良の場合）",
    "マイページから返品申請が可能",
  ],
  conditions: ["未使用・未開封、または初期不良であること"],
  exceptions: ["食品・ダウンロードコンテンツ・お客様都合の破損は対象外"],
  requiredActions: ["マイページから返品申請する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["カスタマーサポート"],
  deadlines: ["到着後14日以内（初期不良は30日以内）"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-how-apply",
      label: "申請方法を見る",
      action: "open_document",
      payload: {
        documentId: "return-exchange-policy",
        sectionId: "how-to-apply",
      },
    },
    {
      id: "fu-human",
      label: "担当者に相談",
      action: "escalate_human",
    },
  ],
  citations: [
    {
      documentId: "return-exchange-policy",
      documentTitle: "返品・交換ポリシー",
      sectionId: "return-window",
      sectionTitle: "返品できる条件と期限",
      articleNumber: "1",
      excerpt:
        "未使用・未開封の商品は、商品到着日を起算日として14日以内にマイページから返品申請できます。",
      reason: "返品期限の根拠",
    },
    {
      documentId: "return-exchange-policy",
      documentTitle: "返品・交換ポリシー",
      sectionId: "shipping-cost",
      sectionTitle: "返品時の送料",
      articleNumber: "2",
      excerpt: "初期不良または当社の誤配送による返品・交換の送料は当社負担です。",
      reason: "送料負担の根拠",
    },
  ],
  workflowPreview: {
    ...emptyWorkflow,
    formType: "return_request",
    automationCandidates: ["return_request_form"],
  },
};

export const fixtureTrackShipping: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion: "マイページまたは追跡番号から配送状況を確認できます",
  answer:
    "注文詳細または出荷完了メールの追跡番号から確認できます。出荷当日は反映まで数時間かかることがあります。",
  bullets: [
    "マイページの注文詳細から確認",
    "出荷メールの追跡番号でも確認可能",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: ["マイページで注文を開く"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["ロジスティクス"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-shipping-doc",
      label: "配送FAQを見る",
      action: "open_document",
      payload: { documentId: "shipping-faq", sectionId: "track-order" },
    },
    {
      id: "fu-human",
      label: "担当者に相談",
      action: "escalate_human",
    },
  ],
  citations: [
    {
      documentId: "shipping-faq",
      documentTitle: "配送・お届けFAQ",
      sectionId: "track-order",
      sectionTitle: "配送状況の確認",
      articleNumber: "1",
      excerpt:
        "マイページの注文詳細、または出荷完了メールに記載の追跡番号から配送状況を確認できます。",
      reason: "配送確認方法",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const fixtureBillingReceipt: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion: "領収書はマイページの注文詳細からPDF発行できます",
  answer: "宛名変更も注文詳細から可能です。紙の郵送が必要な場合は担当者へご相談ください。",
  bullets: ["PDF領収書はマイページから発行", "宛名は注文詳細で編集可能"],
  conditions: [],
  exceptions: [],
  requiredActions: ["マイページから領収書を発行する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["経理・カスタマーサポート"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-billing-doc",
      label: "請求FAQを見る",
      action: "open_document",
      payload: { documentId: "billing-faq", sectionId: "receipt" },
    },
    {
      id: "fu-human",
      label: "担当者に相談",
      action: "escalate_human",
    },
  ],
  citations: [
    {
      documentId: "billing-faq",
      documentTitle: "お支払い・請求FAQ",
      sectionId: "receipt",
      sectionTitle: "領収書の発行",
      articleNumber: "2",
      excerpt: "マイページの注文詳細から領収書（PDF）を発行できます。",
      reason: "領収書発行方法",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const answerSkeletonFixtures: AnswerSkeletonFixture[] = [
  {
    id: "return-policy",
    title: "返品ポリシー",
    question: "返品したいです",
    output: fixtureReturnPolicy,
  },
  {
    id: "track-shipping",
    title: "配送状況",
    question: "配送状況を確認したい",
    output: fixtureTrackShipping,
  },
  {
    id: "billing-receipt",
    title: "領収書",
    question: "領収書を発行したい",
    output: fixtureBillingReceipt,
  },
];
