import type { InternalKnowledgeOutput } from "../types/internal-knowledge";
import type { AnswerSkeletonFixture, KeywordFixture } from "./types";

const emptyWorkflow = {
  suggestedFields: {},
  automationCandidates: [] as string[],
};

/** Q1: 初めてフェイシャル — Layer 2 候補提示 */
export const fixtureFirstFacial: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "初めての方には保湿フェイシャルまたは敏感肌向けショートケアが候補です",
  answer:
    "初めてのフェイシャルなら、保湿フェイシャル（60分・税込7,700円）か、短めの敏感肌向けショートケア（40分・税込5,500円）が候補です。最終メニューは来店時のカウンセリング後に決まります。効果の断定はしません。",
  bullets: [
    "保湿フェイシャル: 60分・税込7,700円",
    "敏感肌向けショートケア: 40分・税込5,500円",
    "最終決定はカウンセリング後",
  ],
  conditions: ["痛み・強い赤み・発熱などがないこと"],
  exceptions: ["通院・妊娠・服薬中はスタッフ確認が必要"],
  requiredActions: ["希望を伝える", "来店時にカウンセリングを受ける"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント", "施術"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-related-dry",
      label: "乾燥が気になるときは？",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-dry-skin-menu" },
    },
    {
      id: "fu-menu",
      label: "メニューを見る",
      action: "open_document",
      payload: { documentId: "menu-list", sectionId: "moisturizing-facial" },
    },
    {
      id: "fu-book",
      label: "予約する",
      action: "open_document",
      payload: { documentId: "reservation-cancel", sectionId: "how-to-book" },
    },
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "menu-selection",
      documentTitle: "メニュー選択ガイド",
      sectionId: "first-time-candidates",
      sectionTitle: "初めてのフェイシャルの候補",
      articleNumber: "3",
      excerpt:
        "初めての方には、保湿フェイシャルまたは敏感肌向けショートケアを候補としてご案内できます。",
      reason: "初回候補の根拠",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q2: 乾燥 — Layer 2 候補＋注意 */
export const fixtureDrySkinMenu: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "乾燥が気になる場合の候補は保湿フェイシャルです（効果は断定しません）",
  answer:
    "乾燥が気になる方への候補として、保湿フェイシャル（60分・税込7,700円）があります。時間が短い場合は敏感肌向けショートケア（40分・税込5,500円）も候補です。痛みや強い赤みがある場合は施術を勧めません。",
  bullets: [
    "保湿フェイシャル: 60分・税込7,700円",
    "短時間なら敏感肌向けショートケアも候補",
    "炎症・痛みがある場合は施術提案なし",
  ],
  conditions: ["強い炎症・痛みがないこと"],
  exceptions: ["危険症状時はメニュー提案禁止"],
  requiredActions: ["希望を伝える", "気になる症状があればスタッフへ伝える"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["施術"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-related-pain",
      label: "赤み・痛みがあるときは？",
      action: "ask_related",
      payload: { guidedQuestionId: "gq-pain-redness" },
    },
    {
      id: "fu-menu",
      label: "メニューを見る",
      action: "open_document",
      payload: { documentId: "menu-list", sectionId: "moisturizing-facial" },
    },
    {
      id: "fu-contra",
      label: "控える条件を見る",
      action: "open_document",
      payload: {
        documentId: "contraindications",
        sectionId: "do-not-recommend",
      },
    },
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "menu-selection",
      documentTitle: "メニュー選択ガイド",
      sectionId: "dry-skin-candidates",
      sectionTitle: "乾燥が気になる場合の候補",
      articleNumber: "2",
      excerpt:
        "保湿フェイシャル（60分・税込7,700円）が近い候補です。時間が短い場合は敏感肌向けショートケアも候補です。",
      reason: "乾燥時の候補",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q3: 当日メイク — Layer 1 */
export const fixtureMakeupDay: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion: "施術当日のメイクをしてのご来店は可能です",
  answer:
    "フェイシャル当日はメイクをしてご来店いただけます。施術前にクレンジングで落とします。強いメイクやラメは落としにくい場合があるため、可能な範囲で薄めにしていただくとスムーズです。",
  bullets: [
    "メイクをしての来店可",
    "施術前にクレンジングで落とす",
    "強いメイクは薄めがスムーズ",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: [],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["施術"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-pre",
      label: "施術前の注意を見る",
      action: "open_document",
      payload: { documentId: "pre-care", sectionId: "makeup-day" },
    },
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "pre-care",
      documentTitle: "施術前の注意",
      sectionId: "makeup-day",
      sectionTitle: "当日のメイク",
      articleNumber: "1",
      excerpt:
        "フェイシャル当日はメイクをしてご来店いただけます。施術前にクレンジングで落とします。",
      reason: "当日メイクの規定",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q6: 15分遅れ — Layer 1 */
export const fixtureLate15min: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "15分を超える遅刻は、施術短縮または当日キャンセル扱いになることがあります",
  answer:
    "予約時刻から15分を超えて遅れる場合、施術時間の短縮または当日キャンセル扱いとなることがあります。遅れそうな場合はできるだけ早くご連絡ください。変更・キャンセル無料は予約時刻の24時間前までです。",
  bullets: [
    "15分超: 短縮または当日キャンセル扱いの場合あり",
    "遅れそうなら早めに連絡",
    "キャンセル無料は24時間前まで",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: ["遅れそうな場合は連絡する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント"],
  deadlines: ["キャンセル無料は予約時刻の24時間前まで"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-late",
      label: "遅刻規定を見る",
      action: "open_document",
      payload: { documentId: "reservation-cancel", sectionId: "late-policy" },
    },
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "reservation-cancel",
      documentTitle: "予約・キャンセル規定",
      sectionId: "late-policy",
      sectionTitle: "遅刻の扱い",
      articleNumber: "3",
      excerpt:
        "予約時刻から15分を超えて遅れる場合、施術時間の短縮または当日キャンセル扱いとなることがあります。",
      reason: "遅刻規定",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q7: 赤みと痛み — Layer 3 提案禁止＋有人／医療機関 */
export const fixturePainRedness: InternalKnowledgeOutput = {
  status: "not_allowed",
  conclusion:
    "赤みと痛みがある場合は施術をおすすめしません。スタッフまたは医療機関へご相談ください",
  answer:
    "昨日からの赤みと痛みがある状態では、施術メニューのご提案はできません。サロンでの判断ではなく、スタッフへの相談、必要に応じて医療機関へのご相談をおすすめします。病名・原因・治療法の判断はしません。",
  bullets: [
    "施術メニューは提案しない",
    "スタッフへ相談",
    "必要なら医療機関へ",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: ["スタッフに相談する", "症状が強い場合は医療機関へ"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント", "施術"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
    {
      id: "fu-contra",
      label: "控える条件を見る",
      action: "open_document",
      payload: {
        documentId: "contraindications",
        sectionId: "do-not-recommend",
      },
    },
    {
      id: "fu-change",
      label: "予約を変更",
      action: "open_document",
      payload: { documentId: "reservation-cancel", sectionId: "cancel-free" },
    },
  ],
  citations: [
    {
      documentId: "contraindications",
      documentTitle: "利用を控える条件",
      sectionId: "do-not-recommend",
      sectionTitle: "施術を勧めない症状",
      articleNumber: "1",
      excerpt:
        "痛み、強い赤み、腫れ、出血、発熱がある場合は、施術メニューを提案しません。",
      reason: "危険症状時の方針",
    },
    {
      documentId: "human-escalation",
      documentTitle: "有人相談条件",
      sectionId: "when-escalate",
      sectionTitle: "スタッフへつなぐ例",
      articleNumber: "1",
      excerpt:
        "痛み・強い赤み・腫れ・出血・発熱があるときは、スタッフへ相談してください。この場合は施術メニューをおすすめしません。",
      reason: "有人誘導",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q4: 妊娠 — Layer 3 確約せず確認 */
export const fixturePregnancy: InternalKnowledgeOutput = {
  status: "needs_confirmation",
  conclusion:
    "妊娠中の利用可否はチャットでは確約できません。スタッフ確認が必要です",
  answer:
    "妊娠中のメニュー利用は、チャットでは「利用できる」とお答えできません。メニューにより要確認のため、来店前または来店時にスタッフへご相談ください。効果や安全性の断定はしません。",
  bullets: [
    "チャットでは可否を確約しない",
    "スタッフ確認が必要",
    "メニューにより扱いが異なる場合あり",
  ],
  conditions: ["スタッフ確認後に最終判断"],
  exceptions: [],
  requiredActions: ["スタッフへ相談する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント", "施術"],
  deadlines: [],
  missingInformation: ["スタッフによる個別確認"],
  followUps: [
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
    {
      id: "fu-contra",
      label: "控える条件を見る",
      action: "open_document",
      payload: {
        documentId: "contraindications",
        sectionId: "need-staff-check",
      },
    },
  ],
  citations: [
    {
      documentId: "contraindications",
      documentTitle: "利用を控える条件",
      sectionId: "need-staff-check",
      sectionTitle: "スタッフ確認が必要な例",
      articleNumber: "2",
      excerpt:
        "妊娠中・授乳中、皮膚科等への通院中、服薬中、持病がある場合は、チャットでは「利用できる」と確約しません。",
      reason: "妊娠時の方針",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q5: 皮膚科通院 — Layer 3 */
export const fixtureDermatology: InternalKnowledgeOutput = {
  status: "needs_confirmation",
  conclusion:
    "皮膚科通院中の施術可否は確約できません。スタッフ確認が必要です",
  answer:
    "皮膚科に通院中の場合、チャットでは施術を「受けられる」と確約できません。通院・服薬の状況を踏まえ、スタッフへご確認ください。診断や治療の判断はしません。",
  bullets: [
    "可否の確約はしない",
    "スタッフ確認が必要",
    "診断・治療の判断はしない",
  ],
  conditions: ["スタッフ確認後に最終判断"],
  exceptions: [],
  requiredActions: ["スタッフへ相談する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント", "施術"],
  deadlines: [],
  missingInformation: ["スタッフによる個別確認"],
  followUps: [
    { id: "fu-human", label: "スタッフへ相談", action: "escalate_human" },
    {
      id: "fu-contra",
      label: "控える条件を見る",
      action: "open_document",
      payload: {
        documentId: "contraindications",
        sectionId: "need-staff-check",
      },
    },
  ],
  citations: [
    {
      documentId: "contraindications",
      documentTitle: "利用を控える条件",
      sectionId: "need-staff-check",
      sectionTitle: "スタッフ確認が必要な例",
      articleNumber: "2",
      excerpt:
        "妊娠中・授乳中、皮膚科等への通院中、服薬中、持病がある場合は、チャットでは「利用できる」と確約しません。",
      reason: "通院時の方針",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const beautyFixtures: AnswerSkeletonFixture[] = [
  {
    id: "first-facial",
    title: "初めてのフェイシャル",
    question: "初めてですが、どのフェイシャルを選べばよいですか？",
    output: fixtureFirstFacial,
  },
  {
    id: "dry-skin-menu",
    title: "乾燥とメニュー",
    question: "乾燥が気になります。利用できるメニューは？",
    output: fixtureDrySkinMenu,
  },
  {
    id: "makeup-day",
    title: "当日メイク",
    question: "施術当日はメイクをして行っても大丈夫ですか？",
    output: fixtureMakeupDay,
  },
  {
    id: "late-15min",
    title: "15分遅刻",
    question: "予約に15分遅れそうです。",
    output: fixtureLate15min,
  },
  {
    id: "pain-redness",
    title: "赤みと痛み",
    question: "昨日から赤みと痛みがあります。どの施術がよいですか？",
    output: fixturePainRedness,
  },
  {
    id: "pregnancy",
    title: "妊娠中の利用",
    question: "妊娠中でも利用できますか？",
    output: fixturePregnancy,
  },
  {
    id: "dermatology",
    title: "皮膚科通院",
    question: "皮膚科に通院中ですが受けられますか？",
    output: fixtureDermatology,
  },
];

export const beautyKeywordFixtures: KeywordFixture[] = [
  { needles: ["初めて", "フェイシャル"], output: fixtureFirstFacial },
  { needles: ["どのフェイシャル", "選べ"], output: fixtureFirstFacial },
  { needles: ["乾燥", "メニュー"], output: fixtureDrySkinMenu },
  { needles: ["乾燥が気"], output: fixtureDrySkinMenu },
  { needles: ["メイク", "当日"], output: fixtureMakeupDay },
  { needles: ["15分", "遅れ"], output: fixtureLate15min },
  { needles: ["遅刻"], output: fixtureLate15min },
  { needles: ["赤み", "痛み"], output: fixturePainRedness },
  { needles: ["妊娠"], output: fixturePregnancy },
  { needles: ["皮膚科", "通院"], output: fixtureDermatology },
];
