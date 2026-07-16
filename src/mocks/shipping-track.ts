/**
 * デモ用の注文配送追跡モック（本番 API なし）。
 * ナレッジ本文には個別追跡結果を書かず、ここだけが正。
 */

export type ShippingTrackMock = {
  orderId: string;
  status: string;
  statusLabel: string;
  carrier: string;
  trackingNumber: string;
  lastUpdated: string;
  locationHint: string;
  note: string;
};

const DEMO_TRACKS: Record<string, ShippingTrackMock> = {
  "TW-20482": {
    orderId: "TW-20482",
    status: "in_transit",
    statusLabel: "輸送中",
    carrier: "デモ宅配",
    trackingNumber: "DEMO-998877",
    lastUpdated: "2026-07-16 18:40",
    locationHint: "関東ハブセンター通過",
    note: "デモ用モックデータです。実在の配送状況ではありません。",
  },
};

/** 注文番号からモック追跡を返す。未知の番号は null。 */
export function lookupShippingTrackMock(
  orderId: string,
): ShippingTrackMock | null {
  const key = orderId.trim().toUpperCase();
  return DEMO_TRACKS[key] ?? null;
}

/** 質問文から注文番号らしきトークンを拾う（TW-xxxxx）。 */
export function extractOrderIdFromQuestion(question: string): string | null {
  const match = question.toUpperCase().match(/\bTW-\d+\b/);
  return match?.[0] ?? null;
}
