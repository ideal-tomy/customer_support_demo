import type { InternalKnowledgeOutput } from "../types/internal-knowledge";
import {
  lookupShippingTrackMock,
  type ShippingTrackMock,
} from "../mocks/shipping-track";
import type { AnswerSkeletonFixture, KeywordFixture } from "./types";

const emptyWorkflow = {
  suggestedFields: {},
  automationCandidates: [] as string[],
};

function shippingTrackFromMock(mock: ShippingTrackMock): InternalKnowledgeOutput {
  return {
    status: "needs_confirmation",
    conclusion: `注文 ${mock.orderId} はモック上「${mock.statusLabel}」です（本番の現在地ではありません）`,
    answer: `${mock.note} キャリア: ${mock.carrier}／追跡番号: ${mock.trackingNumber}／最終更新: ${mock.lastUpdated}／目安位置: ${mock.locationHint}。確定や再配達の手配は担当者またはマイページでご確認ください。`,
    bullets: [
      `ステータス: ${mock.statusLabel}（${mock.status}）`,
      `追跡番号: ${mock.trackingNumber}（${mock.carrier}）`,
      `最終更新: ${mock.lastUpdated}・${mock.locationHint}`,
      mock.note,
    ],
    conditions: ["デモ用モックであること", "本番配送 API ではないこと"],
    exceptions: ["未知の注文番号は追跡できません"],
    requiredActions: ["マイページでも状況を確認する", "必要なら担当者に相談する"],
    requiredDocuments: ["注文番号"],
    approvers: [],
    responsibleDepartments: ["ロジスティクス"],
    deadlines: [],
    missingInformation: [],
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
        reason: "Layer 3 モックへの導線",
      },
    ],
    workflowPreview: {
      suggestedFields: { orderId: mock.orderId, trackingNumber: mock.trackingNumber },
      automationCandidates: ["shipping_track_lookup"],
    },
  };
}

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
      id: "fu-related-defect",
      label: "初期不良でも返品できますか？",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-initial-defect" },
    },
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
      id: "fu-related-shipping",
      label: "配送状況を確認したい",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-shipping-track" },
    },
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
      id: "fu-related-compare",
      label: "MiniとProの違いは？",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-humidifier-compare" },
    },
    {
      id: "fu-catalog",
      label: "カタログを見る",
      action: "open_document",
      payload: { documentId: "product-catalog", sectionId: "luna-mist-mini" },
    },
    {
      id: "fu-compare",
      label: "比較ガイドを見る",
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

/** Q2: 色違い返品 — Layer 1/2 お客様都合 */
export const fixtureColorMismatch: InternalKnowledgeOutput = {
  status: "conditional",
  conclusion:
    "色・イメージ違いはお客様都合の返品候補です。未使用・未開封かつ到着後14日以内が条件です",
  answer:
    "届いた色がイメージと違う場合は、お客様都合の返品として扱います。未使用・未開封かつ到着後14日以内ならマイページから申請できます。送料はお客様負担です。初期不良とは条件が異なります。",
  bullets: [
    "お客様都合: 到着後14日・未使用未開封",
    "送料はお客様負担（初期不良・誤配送は当社負担）",
    "マイページから返品申請",
  ],
  conditions: ["未使用・未開封であること", "到着後14日以内であること"],
  exceptions: ["開封済み・汚損・食品・ダウンロードは対象外"],
  requiredActions: ["マイページから返品申請する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["カスタマーサポート"],
  deadlines: ["到着後14日以内"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-related-deadline",
      label: "返品期限は何日？",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-return-deadline" },
    },
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
        "イメージ違い・サイズ違いなどお客様都合の返品も、未使用未開封かつ14日以内であれば対象です。",
      reason: "色違い返品の根拠",
    },
    {
      documentId: "return-exchange",
      documentTitle: "返品・交換規定",
      sectionId: "shipping-cost",
      sectionTitle: "返品時の送料",
      articleNumber: "2",
      excerpt:
        "お客様都合の返品（イメージ違い・色違いなど）の送料はお客様負担です。",
      reason: "送料負担の切り分け",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q3: 明後日までに東京へ — Layer 1/3 着日断定禁止 */
export const fixtureDeliveryByDayAfter: InternalKnowledgeOutput = {
  status: "needs_confirmation",
  conclusion:
    "明後日までのお届け可否は在庫と発送状況の確認が必要です（着日は断定できません）",
  answer:
    "在庫品の発送目安は注文確定後2〜4営業日、東京宛は発送後1〜2日程度が目安です。ただし「明後日までに届く」とはチャット上で確約できません。取り寄せ・予約品はさらに日数がかかる場合があります。急ぎの場合は在庫確認または担当者へご相談ください。",
  bullets: [
    "在庫品: 発送目安 2〜4営業日",
    "東京宛: 発送後 1〜2日程度が目安",
    "着日・在庫の断定は不可（システム確認が必要）",
  ],
  conditions: ["在庫品であること", "本州・東京宛であること"],
  exceptions: ["取り寄せ・予約・離島は追加日数の可能性"],
  requiredActions: ["商品ページで在庫表示を確認する", "急ぎなら担当者に相談する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["ロジスティクス", "EC運営"],
  deadlines: [],
  missingInformation: ["対象商品の在庫状況"],
  followUps: [
    {
      id: "fu-ship-estimate",
      label: "配送目安を見る",
      action: "open_document",
      payload: { documentId: "shipping-guide", sectionId: "delivery-estimate" },
    },
    {
      id: "fu-inventory",
      label: "在庫ルールを見る",
      action: "open_document",
      payload: { documentId: "inventory-rules", sectionId: "when-to-check" },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "shipping-guide",
      documentTitle: "配送ガイド",
      sectionId: "delivery-estimate",
      sectionTitle: "お届け日数目安",
      articleNumber: "2",
      excerpt:
        "在庫がある商品はご注文確定後、2〜4営業日で発送します。東京宛は発送後1〜2日程度が目安です。",
      reason: "発送・お届け目安",
    },
    {
      documentId: "inventory-rules",
      documentTitle: "在庫・入荷ルール",
      sectionId: "backorder",
      sectionTitle: "取り寄せ・予約商品",
      articleNumber: "2",
      excerpt:
        "明後日までのお届け可否は、在庫状況と配送日数の両方の確認が必要です。",
      reason: "着日断定禁止の根拠",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q4: Mini vs Pro 比較 — Layer 2 */
export const fixtureHumidifierCompare: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "Mini は置きやすさ・一人暮らし向け、Pro は広さ・連続運転向けの候補です（最適とは断定しません）",
  answer:
    "Luna Mist Mini（税込8,800円）は幅が小さく約8時間運転・木造5畳／洋室8畳目安です。Luna Mist Pro（税込14,800円）は約16時間運転・木造8畳／洋室14畳目安です。どちらもタンク着脱洗浄に対応。部屋の広さと連続運転の優先度で候補を分けてご案内します。",
  bullets: [
    "Mini: 8,800円・約8時間・洋室8畳目安",
    "Pro: 14,800円・約16時間・洋室14畳目安",
    "手入れ: どちらもタンク着脱洗浄",
  ],
  conditions: ["カタログ仕様に基づく比較であること"],
  exceptions: ["「どちらが最適か」の断定はしない"],
  requiredActions: ["部屋の広さと予算を確認する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["EC運営"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-related-pick",
      label: "一人暮らし向けはどれ？",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-humidifier-pick" },
    },
    {
      id: "fu-compare-doc",
      label: "比較ガイドを見る",
      action: "open_document",
      payload: {
        documentId: "product-comparison",
        sectionId: "mini-vs-pro-table",
      },
    },
    { id: "fu-human", label: "担当者に相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "product-comparison",
      documentTitle: "商品比較ガイド",
      sectionId: "humidifier-compare",
      sectionTitle: "加湿器 Mini と Pro の違い",
      articleNumber: "1",
      excerpt:
        "Luna Mist Mini（8,800円）は幅18cm・約8時間運転・木造5畳／洋室8畳目安。Luna Mist Pro（14,800円）は約16時間運転・木造8畳／洋室14畳目安。",
      reason: "比較の根拠",
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

export const fixtureShippingTrack: InternalKnowledgeOutput = (() => {
  const mock = lookupShippingTrackMock("TW-20482");
  if (mock) return shippingTrackFromMock(mock);
  return {
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
})();

/** 注文番号付き質問向け。モックがあればモック回答、なければ汎用の要確認。 */
export function resolveShippingTrackOutput(
  question: string,
): InternalKnowledgeOutput {
  const match = question.toUpperCase().match(/\bTW-\d+\b/);
  if (match) {
    const mock = lookupShippingTrackMock(match[0]);
    if (mock) return shippingTrackFromMock(mock);
  }
  return {
    status: "needs_confirmation",
    conclusion:
      "個別の配送状況は注文番号の確認が必要です（ナレッジだけでは現在地は分かりません）",
    answer:
      "出荷後の位置はマイページまたは追跡番号で確認できます。例として注文番号 TW-20482 をいただければ、デモ用モック追跡を表示できます。",
    bullets: [
      "本ガイドに個別注文の現在地は記載なし",
      "既知デモ注文: TW-20482",
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
        id: "fu-related-demo",
        label: "TW-20482 を確認",
        action: "ask_related",
        payload: { guidedQuestionId: "gq-shipping-track" },
      },
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
}

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
    id: "color-mismatch",
    title: "色違いの返品",
    question:
      "商品が届きましたが、思っていた色と違いました。返品できますか",
    output: fixtureColorMismatch,
  },
  {
    id: "delivery-by-day-after",
    title: "急ぎ配送の可否",
    question: "明後日までに東京へ届けられる商品はありますか",
    output: fixtureDeliveryByDayAfter,
  },
  {
    id: "humidifier-pick",
    title: "加湿器選び",
    question: "一人暮らしで使う、小さくて手入れしやすい加湿器はどれですか",
    output: fixtureHumidifierPick,
  },
  {
    id: "humidifier-compare",
    title: "加湿器比較",
    question:
      "Luna Mist Mini と Pro の違いを、価格以外も含めて教えてください",
    output: fixtureHumidifierCompare,
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
  { needles: ["色と違い", "色が違い", "イメージと違い"], output: fixtureColorMismatch },
  { needles: ["明後日までに東京", "明後日までに"], output: fixtureDeliveryByDayAfter },
  { needles: ["MiniとPro", "価格以外"], output: fixtureHumidifierCompare },
  { needles: ["加湿器", "一人暮らし"], output: fixtureHumidifierPick },
  { needles: ["Luna Mist", "Mini"], output: fixtureHumidifierPick },
  { needles: ["領収", "会社名義"], output: fixtureReceipt },
  { needles: ["TW-20482"], output: fixtureShippingTrack },
  { needles: ["配送状況", "追跡"], output: fixtureShippingTrack },
];
