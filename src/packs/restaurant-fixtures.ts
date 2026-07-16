import type { InternalKnowledgeOutput } from "../types/internal-knowledge";
import type { AnswerSkeletonFixture, KeywordFixture } from "./types";

const emptyWorkflow = {
  suggestedFields: {},
  automationCandidates: [] as string[],
};

/** Q7: 営業・定休日 — Layer 1 */
export const fixtureHoursHoliday: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "ランチ 11:30–14:30、ディナー 17:00–22:00、定休日は毎週火曜日です",
  answer:
    "営業時間はランチ 11:30–14:30（ラストオーダー 14:00）、ディナー 17:00–22:00（ラストオーダー 21:00）です。定休日は毎週火曜日です。",
  bullets: [
    "ランチ 11:30–14:30（L.O. 14:00）",
    "ディナー 17:00–22:00（L.O. 21:00）",
    "定休日: 毎週火曜日",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: [],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-hours",
      label: "店舗案内を見る",
      action: "open_document",
      payload: { documentId: "store-basic", sectionId: "hours-holiday" },
    },
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "store-basic",
      documentTitle: "店舗基本情報",
      sectionId: "hours-holiday",
      sectionTitle: "営業時間・定休日",
      articleNumber: "2",
      excerpt:
        "ランチ 11:30–14:30（ラストオーダー 14:00）。ディナー 17:00–22:00（ラストオーダー 21:00）。定休日は毎週火曜日です。",
      reason: "営業時間の根拠",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q1: 家族土曜 — Layer 2 */
export const fixtureFamilySaturday: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "大人4名・子ども2名ならテーブル席または座敷とお子さま御膳が候補です（空席は断定しません）",
  answer:
    "大人4名と子ども2名でのご利用は可能です。席はテーブル席または座敷が候補で、子ども椅子もあります。お子さま御膳は税込1,200円です。土曜日も営業しますが、空席の有無はチャットでは断定できません。空席確認または予約へ進んでください。",
  bullets: [
    "テーブル席・座敷・子ども椅子が候補",
    "お子さま御膳 税込1,200円",
    "空席はシステム確認が必要",
  ],
  conditions: ["火曜定休でないこと"],
  exceptions: ["空席は確約しない"],
  requiredActions: ["空席を確認する", "予約する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    {
      id: "fu-seat",
      label: "席案内を見る",
      action: "open_document",
      payload: { documentId: "seating-facilities", sectionId: "seat-types" },
    },
    {
      id: "fu-vacancy",
      label: "空席を確認",
      action: "ask_related",
      payload: { question: "今日19時から4名で空いていますか？" },
    },
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "seating-facilities",
      documentTitle: "席・設備案内",
      sectionId: "seat-types",
      sectionTitle: "席の種類と人数目安",
      articleNumber: "1",
      excerpt:
        "大人4名＋子ども2名程度ならテーブル席または座敷が候補です。空席の確約はできません。",
      reason: "家族利用の席候補",
    },
    {
      documentId: "occasion-guide",
      documentTitle: "利用シーンガイド",
      sectionId: "family",
      sectionTitle: "家族連れ",
      articleNumber: "2",
      excerpt:
        "大人と子ども連れにはテーブル席または座敷、お子さま御膳（税込1,200円）が候補です。",
      reason: "家族シーンの候補",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q2: 5000円＋飲み放題 — Layer 2 */
export const fixtureCourse5kDrink: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "一人5,000円前後なら、季節の彩りコース＋ノンアル飲み放題（約5,500円）が近い候補です",
  answer:
    "季節の彩りコースは税込4,500円／人です。ノンアル飲み放題（90分・税込1,000円）を付けると約5,500円／人、ソフト＋アルコール飲み放題（税込2,200円）を付けると約6,700円／人です。飲み放題付きの「セット割引」はありません。予算に近い候補からお選びください。",
  bullets: [
    "彩りコース 税込4,500円／人",
    "彩り＋ノンアル 約5,500円／人",
    "彩り＋飲み放題 約6,700円／人",
  ],
  conditions: ["2名以上・利用日の3日前までの予約"],
  exceptions: [],
  requiredActions: ["希望予算を伝える", "予約する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント", "キッチン"],
  deadlines: ["コースは利用日の3日前まで"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-course",
      label: "コースを見る",
      action: "open_document",
      payload: { documentId: "course-guide", sectionId: "irodori-course" },
    },
    {
      id: "fu-drink",
      label: "飲み放題を見る",
      action: "open_document",
      payload: { documentId: "drink-guide", sectionId: "with-course" },
    },
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "course-guide",
      documentTitle: "コース案内",
      sectionId: "irodori-course",
      sectionTitle: "季節の彩りコース",
      articleNumber: "2",
      excerpt:
        "税込4,500円／人。一人5,000円前後の候補として、彩り＋ノンアル飲み放題で約5,500円／人、彩り＋飲み放題で約6,700円／人をご案内できます。",
      reason: "予算帯の候補",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q3: 乳アレルギー — Layer 2 保証禁止 */
export const fixtureDairyAllergy: InternalKnowledgeOutput = {
  status: "conditional",
  conclusion:
    "乳製品アレルギーは除去相談が可能な場合がありますが、完全安全は保証できません",
  answer:
    "乳・卵・小麦については、メニューにより除去・代替の相談が可能な場合があります。ただし厨房共用のため混入の可能性を排除できず、「完全に安全」「完全除去」とはお答えできません。重度の場合は来店前に店舗確認が必須です。",
  bullets: [
    "除去相談は可能な場合あり",
    "完全除去・絶対安全は保証しない",
    "重度は店舗確認必須",
  ],
  conditions: ["事前申告", "店舗での最終確認"],
  exceptions: ["重度アレルギーはチャットでは判断しない"],
  requiredActions: ["アレルゲンを申告する", "店舗へ相談する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["キッチン", "フロント"],
  deadlines: [],
  missingInformation: [],
  followUps: [
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
    {
      id: "fu-allergy",
      label: "アレルギー方針を見る",
      action: "open_document",
      payload: { documentId: "allergy-policy", sectionId: "scope" },
    },
  ],
  citations: [
    {
      documentId: "allergy-policy",
      documentTitle: "アレルギー対応方針",
      sectionId: "scope",
      sectionTitle: "対応できる範囲",
      articleNumber: "1",
      excerpt:
        "乳・卵・小麦については、メニューにより除去・代替の相談が可能な場合があります。チャットでは「完全に対応できる」「絶対安全」とは言いません。",
      reason: "アレルギー方針",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q4: 記念日・静かな席 — Layer 2 */
export const fixtureAnniversaryQuiet: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "記念日には半個室と灯会席が候補です（静かな席の確約は空席次第です）",
  answer:
    "両親の結婚記念日には、半個室（2室・目安6名まで）と灯会席（税込6,800円／人）が候補です。静かな席のご希望には半個室をご案内できますが、確約は空席次第です。メッセージプレート等は店舗確認が必要です。",
  bullets: [
    "半個室2室（〜6名）が静かな席の候補",
    "灯会席 税込6,800円／人",
    "確約は空席・店舗確認次第",
  ],
  conditions: ["コースは3日前までの予約"],
  exceptions: ["空席・半個室は断定しない"],
  requiredActions: ["希望日時を伝える", "店舗へ相談する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント"],
  deadlines: ["コースは利用日の3日前まで"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-semi",
      label: "半個室を見る",
      action: "open_document",
      payload: { documentId: "seating-facilities", sectionId: "semi-private" },
    },
    {
      id: "fu-kaiseki",
      label: "灯会席を見る",
      action: "open_document",
      payload: { documentId: "course-guide", sectionId: "akari-kaiseki" },
    },
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "occasion-guide",
      documentTitle: "利用シーンガイド",
      sectionId: "anniversary",
      sectionTitle: "記念日",
      articleNumber: "1",
      excerpt:
        "半個室（2室・〜6名）と灯会席（税込6,800円／人）が候補です。静かな席の確約は空席次第です。",
      reason: "記念日候補",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q5: 1人減・キャンセル料 — Layer 1/2 */
export const fixtureCancelReduce1: InternalKnowledgeOutput = {
  status: "allowed",
  conclusion:
    "人数減もキャンセル料テーブルが適用されます。前日18時までなら無料です",
  answer:
    "コース予約で人数を1人減らす場合も、減った人数分にキャンセル料テーブルが適用されます。利用日前日の18時までなら無料、当日はコース料金の50%、無断は100%です。変更日時によって金額が変わるため、確定には予約内容の確認が必要な場合があります。",
  bullets: [
    "前日18時まで: 無料",
    "当日: コース料金の50%",
    "無断: 100%（人数減にも適用）",
  ],
  conditions: ["コース予約であること"],
  exceptions: [],
  requiredActions: ["変更希望を連絡する"],
  requiredDocuments: [],
  approvers: [],
  responsibleDepartments: ["フロント"],
  deadlines: ["無料変更は前日18時まで"],
  missingInformation: [],
  followUps: [
    {
      id: "fu-cancel",
      label: "キャンセル規定を見る",
      action: "open_document",
      payload: { documentId: "reservation-policy", sectionId: "cancel-fees" },
    },
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "reservation-policy",
      documentTitle: "予約・変更規定",
      sectionId: "cancel-fees",
      sectionTitle: "キャンセル料",
      articleNumber: "2",
      excerpt:
        "コース予約: 利用日前日の18時まで無料。当日キャンセルはコース料金の50%。人数を減らす場合も、減った人数分に同テーブルを適用します。",
      reason: "人数減のキャンセル料",
    },
  ],
  workflowPreview: emptyWorkflow,
};

/** Q6: 今日19時4名 — Layer 3 空席断定禁止 */
export const fixtureVacancyToday19: InternalKnowledgeOutput = {
  status: "needs_confirmation",
  conclusion:
    "今日19時の空席はナレッジだけでは分かりません。システム確認または店舗相談が必要です",
  answer:
    "個別日時の空席（例: 今日19時・4名）は、本案内だけでは分かりません。チャットでは「空いています」と断定できません。予約システムの確認、または店舗への相談へ進んでください。",
  bullets: [
    "空席はナレッジに記載なし",
    "システム確認または店舗相談が必要",
    "断定しない",
  ],
  conditions: [],
  exceptions: [],
  requiredActions: ["空席を確認する", "店舗へ相談する"],
  requiredDocuments: ["希望日時・人数"],
  approvers: [],
  responsibleDepartments: ["フロント"],
  deadlines: [],
  missingInformation: ["システム上の空席状況"],
  followUps: [
    {
      id: "fu-vacancy-mock",
      label: "空席を確認",
      action: "escalate_human",
    },
    {
      id: "fu-book",
      label: "予約する",
      action: "open_document",
      payload: { documentId: "reservation-policy", sectionId: "how-to-book" },
    },
    { id: "fu-human", label: "店舗へ相談", action: "escalate_human" },
  ],
  citations: [
    {
      documentId: "reservation-policy",
      documentTitle: "予約・変更規定",
      sectionId: "vacancy-note",
      sectionTitle: "空席について",
      articleNumber: "4",
      excerpt:
        "個別日時の空席は、ナレッジだけでは分かりません。予約システムの確認、または店舗への相談が必要です。チャットでは空席を断定しません。",
      reason: "Layer 3 空席方針",
    },
  ],
  workflowPreview: emptyWorkflow,
};

export const restaurantFixtures: AnswerSkeletonFixture[] = [
  {
    id: "hours-holiday",
    title: "営業時間・定休日",
    question: "営業時間と定休日は？",
    output: fixtureHoursHoliday,
  },
  {
    id: "family-saturday",
    title: "家族連れ・土曜",
    question: "大人4人、子ども2人で土曜日に利用できますか？",
    output: fixtureFamilySaturday,
  },
  {
    id: "course-5k-drink",
    title: "5000円帯コース",
    question: "一人5,000円程度で、飲み放題付きのコースはありますか？",
    output: fixtureCourse5kDrink,
  },
  {
    id: "dairy-allergy",
    title: "乳アレルギー",
    question: "乳製品アレルギーがありますが、対応できますか？",
    output: fixtureDairyAllergy,
  },
  {
    id: "anniversary-quiet",
    title: "記念日・静かな席",
    question: "両親の結婚記念日で利用したい。静かな席はありますか？",
    output: fixtureAnniversaryQuiet,
  },
  {
    id: "cancel-reduce-1",
    title: "人数減・キャンセル料",
    question: "予約を1人減らしたい。キャンセル料は？",
    output: fixtureCancelReduce1,
  },
  {
    id: "vacancy-today-19",
    title: "今日の空席",
    question: "今日19時から4名で空いていますか？",
    output: fixtureVacancyToday19,
  },
];

export const restaurantKeywordFixtures: KeywordFixture[] = [
  { needles: ["営業時間", "定休日"], output: fixtureHoursHoliday },
  { needles: ["営業時間"], output: fixtureHoursHoliday },
  { needles: ["大人4", "子ども2"], output: fixtureFamilySaturday },
  { needles: ["土曜日", "子ども"], output: fixtureFamilySaturday },
  { needles: ["5,000", "飲み放題"], output: fixtureCourse5kDrink },
  { needles: ["5000", "飲み放題"], output: fixtureCourse5kDrink },
  { needles: ["乳", "アレルギー"], output: fixtureDairyAllergy },
  { needles: ["乳製品"], output: fixtureDairyAllergy },
  { needles: ["記念日", "静か"], output: fixtureAnniversaryQuiet },
  { needles: ["結婚記念日"], output: fixtureAnniversaryQuiet },
  { needles: ["1人減ら", "キャンセル"], output: fixtureCancelReduce1 },
  { needles: ["人数", "キャンセル料"], output: fixtureCancelReduce1 },
  { needles: ["今日", "19時", "空"], output: fixtureVacancyToday19 },
  { needles: ["空いて"], output: fixtureVacancyToday19 },
  { needles: ["空席"], output: fixtureVacancyToday19 },
];
