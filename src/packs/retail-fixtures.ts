import type { InternalKnowledgeOutput } from "../types/internal-knowledge";
import type { AnswerSkeletonFixture, KeywordFixture } from "./types";

const emptyWorkflow = {
  suggestedFields: {},
  automationCandidates: [] as string[],
};

export const fixtureReturnDeadline: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion: "未使用・未開封なら到着後14日以内に返品できます",
  answer:
    "お客様都合の返品は、未使用・未開封かつ到着後14日以内が条件です。初期不良は到着後30日以内で、送料は当社負担です。",
  bullets: [
    "お客様都合: 到着後14日・未使用未開封",
    "初期不良: 到着後30日以内・送料当社負担",
    "マイページから返品申請が可能",
  ],
  conditions: ["未使用・未開封、または初期不良であること"],
  exceptions: ["食品・ダウンロード・お客様都合の破損は対象外"],
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
      payload: { documentId: "return-exchange", sectionId: "how-to-apply" },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "return-exchange",
      documentTitle: "返品・交換規定",
      sectionId: "return-window",
      sectionTitle: "返品できる条件と期限",
      articleNumber: "1",
      excerpt:
        "未使用・未開封の商品は、商品到着日を起算日として14日以内にマイページから返品申請できます。",
      reason: "返品期限の根拠",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const fixtureInitialDefect: InternalKnowledgeOutput = {
  status: "conditional",
  conclusion:
    "初期不良なら到着後30日以内に、返品・交換または保証修理が候補です",
  answer:
    "開封後でも製造上の不具合（初期不良）と認められる場合は、到着後30日以内に返品・交換、または購入日より1年の保証に基づく修理が候補になります。送料は当社負担です。お客様都合のイメージ違いとは条件が異なります。",
  bullets: [
    "初期不良: 到着後30日以内・送料当社負担",
    "保証期間: 購入日より1年",
    "返品と保証修理の両方が候補",
  ],
  conditions: ["製造上の不具合であること", "到着後30日以内に申し出ること"],
  exceptions: ["落下・水没など保証対象外の損傷"],
  requiredActions: ["症状と注文番号を添えて申請する"],
  requiredDocuments: ["購入証明"],
  approvers: [],
  responsibleDepartments: ["カスタマーサポート"],
  deadlines: ["初期不良は到着後30日以内"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-return",
      label: "返品規定を見る",
      action: "open_document",
      payload: { documentId: "return-exchange", sectionId: "return-window" },
    },
    {
      id: "fu-warranty",
      label: "保証規定を見る",
      action: "open_document",
      payload: { documentId: "warranty-repair", sectionId: "initial-defect" },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "return-exchange",
      documentTitle: "返品・交換規定",
      sectionId: "return-window",
      sectionTitle: "返品できる条件と期限",
      articleNumber: "1",
      excerpt:
        "開封済みでも初期不良が認められる場合は、到着後30日以内に交換または返品が可能です。",
      reason: "初期不良の返品期限",
    },
    {
      documentId: "warranty-repair",
      documentTitle: "保証・修理規定",
      sectionId: "initial-defect",
      sectionTitle: "初期不良の扱い",
      articleNumber: "2",
      excerpt:
        "到着後30日以内に判明した製造上の不具合は初期不良として扱います。",
      reason: "保証との関係",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const fixtureHumidifierPick: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "一人暮らし・手入れしやすさなら「Luna Mist Mini」が最も近い候補です",
  answer:
    "幅18cmで置きやすく、タンク着脱洗浄、約8時間運転、約28dBです。対応目安は木造5畳・洋室8畳。部屋が広い場合は Luna Mist Pro も候補です。",
  bullets: [
    "税込8,800円・幅18cmで一人暮らし向け",
    "給水タンクを取り外して洗える",
    "約8時間連続・約28dB",
  ],
  conditions: ["利用部屋が木造5畳・洋室8畳目安に近いこと"],
  exceptions: ["より広い部屋では Pro も検討"],
  requiredActions: ["商品ページで色・在庫を確認する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["EC運営"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-catalog",
      label: "カタログを見る",
      action: "open_document",
      payload: { documentId: "product-catalog", sectionId: "luna-mist-mini" },
    },
    {
      id: "fu-compare",
      label: "MiniとProを比較",
      action: "open_document",
      payload: {
        documentId: "product-comparison",
        sectionId: "humidifier-compare",
      },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "product-catalog",
      documentTitle: "商品カタログ",
      sectionId: "luna-mist-mini",
      sectionTitle: "Luna Mist Mini（加湿器）",
      articleNumber: "2",
      excerpt:
        "税込8,800円。幅18cm。給水タンクは取り外して洗えます。連続運転は約8時間、動作音は約28dB。",
      reason: "提案根拠",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const fixtureReceipt: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion: "領収書はマイページからPDF発行でき、会社名義にも変更できます",
  answer:
    "注文詳細の「宛名を編集」から会社名義に変更し、領収書（PDF）を発行できます。紙の郵送が必要な場合は担当者へご相談ください。",
  bullets: ["PDFはマイページから発行", "宛名は会社名義に変更可能"],
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
      id: "fu-pay",
      label: "支払いガイドを見る",
      action: "open_document",
      payload: { documentId: "payment-guide", sectionId: "receipt" },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "payment-guide",
      documentTitle: "支払いガイド",
      sectionId: "receipt",
      sectionTitle: "領収書の発行",
      articleNumber: "2",
      excerpt:
        "マイページの注文詳細から領収書（PDF）を発行できます。宛名は会社名義への変更が可能です。",
      reason: "領収書発行方法",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const fixtureShippingTrack: InternalKnowledgeOutput = {
  status: "needs_confirmation",
  conclusion:
    "個別の配送状況は注文番号の確認が必要です（ナレッジだけでは現在地は分かりません）",
  answer:
    "出荷後の位置はマイページまたは追跡番号で確認できます。チャットで特定注文を調べる場合は注文番号（例: TW-20482）を伺い、担当連携または追跡確認へ進みます。",
  bullets: [
    "本ガイドに個別注文の現在地は記載なし",
    "注文番号があれば状況確認へ進める",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: ["注文番号を用意する", "担当者に相談する"],
  requiredDocuments: ["注文番号"],
  approvers: [],
  responsibleDepartments: ["ロジスティクス"],
  deadlines: [],
  missingInformation: ["注文番号"],
  followUps: [
    {
      id: "fu-ship-guide",
      label: "配送ガイドを見る",
      action: "open_document",
      payload: { documentId: "shipping-guide", sectionId: "how-to-track" },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "shipping-guide",
      documentTitle: "配送ガイド",
      sectionId: "how-to-track",
      sectionTitle: "配送状況の確認方法",
      articleNumber: "4",
      excerpt:
        "個別注文の現在地をチャットで知るには注文番号が必要です。本ガイドだけでは特定注文の位置は分かりません。",
      reason: "Layer 3 への導線",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const retailFixtures: AnswerSkeletonFixture[] = [
  {
    id: "return-deadline",
    title: "返品期限",
    question: "返品期限は何日ですか",
    output: fixtureReturnDeadline,
  },
  {
    id: "initial-defect",
    title: "初期不良の返品",
    question: "開封しましたが初期不良でした。返品できますか",
    output: fixtureInitialDefect,
  },
  {
    id: "humidifier-pick",
    title: "加湿器選び",
    question: "一人暮らしで使う、小さくて手入れしやすい加湿器はどれですか",
    output: fixtureHumidifierPick,
  },
  {
    id: "receipt-company",
    title: "領収書",
    question: "領収書を会社名義で発行できますか",
    output: fixtureReceipt,
  },
  {
    id: "shipping-track",
    title: "配送状況",
    question: "注文番号 TW-20482 の配送状況を確認したいです",
    output: fixtureShippingTrack,
  },
];

export const retailKeywordFixtures: KeywordFixture[] = [
  { needles: ["返品期限", "何日"], output: fixtureReturnDeadline },
  { needles: ["初期不良"], output: fixtureInitialDefect },
  { needles: ["加湿器", "一人暮らし"], output: fixtureHumidifierPick },
  { needles: ["Luna Mist", "Mini"], output: fixtureHumidifierPick },
  { needles: ["領収", "会社名義"], output: fixtureReceipt },
  { needles: ["TW-20482"], output: fixtureShippingTrack },
  { needles: ["配送状況", "追跡"], output: fixtureShippingTrack },
  { needles: ["色と違い", "色が違い"], output: fixtureReturnDeadline },
];
