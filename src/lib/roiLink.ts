import type { IndustryId } from "../packs/types";

const ROI_FROM = "customer-support";

const INDUSTRY_MAP: Record<IndustryId, string> = {
  "retail-commerce": "other",
  restaurant: "other",
  "beauty-salon": "professional",
};

/** roi-simulator への導線URL。未設定時は null（CTA非表示）。 */
export function getRoiSimulatorUrl(packIndustryId?: IndustryId | string): string | null {
  const raw = import.meta.env.VITE_ROI_SIMULATOR_URL?.trim();
  if (!raw) return null;

  const industry =
    packIndustryId && packIndustryId in INDUSTRY_MAP
      ? INDUSTRY_MAP[packIndustryId as IndustryId]
      : "other";

  const origin = raw.replace(/\/+$/, "");
  const q = new URLSearchParams({
    kit: "chatbot",
    industry,
    cat: "internal",
    from: ROI_FROM,
  });
  return `${origin}/?${q.toString()}`;
}
