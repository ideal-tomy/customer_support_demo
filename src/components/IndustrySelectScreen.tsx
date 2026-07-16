import { useKnowledgePack } from "../knowledge/pack-store";
import type { IndustryId } from "../packs/types";

const INDUSTRY_BLURBS: Record<IndustryId, string> = {
  "retail-commerce": "商品・配送・返品の案内",
  restaurant: "コース・アレルギー・予約の案内",
  "beauty-salon": "メニュー・予約・安全な有人誘導",
};

type IndustrySelectScreenProps = {
  onStarted: () => void;
};

/** First-screen industry picker before the chat experience starts. */
export function IndustrySelectScreen({ onStarted }: IndustrySelectScreenProps) {
  const { industryRegistry, setIndustry } = useKnowledgePack();

  const handleSelect = (industry: IndustryId) => {
    const ok = setIndustry(industry);
    if (!ok) return;
    onStarted();
  };

  return (
    <div className="industry-select">
      <p className="industry-select-lead">
        試したい業種を選ぶと、その店舗のチャット案内が始まります。
      </p>
      <div className="industry-select-list" role="list">
        {industryRegistry.map((entry) => {
          if (!entry.available) return null;
          return (
            <button
              key={entry.industry}
              type="button"
              className="industry-select-card"
              role="listitem"
              onClick={() => handleSelect(entry.industry)}
            >
              <span className="industry-select-card-title">
                {entry.brand.storeName}
              </span>
              <span className="industry-select-card-blurb">
                {INDUSTRY_BLURBS[entry.industry]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
