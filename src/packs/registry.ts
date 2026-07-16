import { useSyncExternalStore } from "react";
import { retailCommercePack } from "./retail-commerce";
import type {
  CustomerSupportPack,
  IndustryId,
  PackRegistryEntry,
  UnavailablePack,
} from "./types";

const STORAGE_INDUSTRY_KEY = "cs-industry-pack-v1";

const restaurantStub: UnavailablePack = {
  industry: "restaurant",
  available: false,
  label: "飲食店",
  description: "準備中（旬菜ダイニング 灯）",
};

const beautyStub: UnavailablePack = {
  industry: "beauty-salon",
  available: false,
  label: "エステ・美容",
  description: "準備中（Beauty Salon Lueur）",
};

export const packRegistry: PackRegistryEntry[] = [
  retailCommercePack,
  restaurantStub,
  beautyStub,
];

const listeners = new Set<() => void>();

function loadIndustry(): IndustryId {
  try {
    const raw = sessionStorage.getItem(STORAGE_INDUSTRY_KEY);
    if (raw === "retail-commerce" || raw === "restaurant" || raw === "beauty-salon") {
      const entry = packRegistry.find((p) => p.industry === raw);
      if (entry?.available) return raw;
    }
  } catch {
    /* ignore */
  }
  return "retail-commerce";
}

let industryId: IndustryId = loadIndustry();
let revision = 0;

function emit() {
  revision += 1;
  try {
    sessionStorage.setItem(STORAGE_INDUSTRY_KEY, industryId);
  } catch {
    /* ignore */
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActiveIndustryId(): IndustryId {
  return industryId;
}

export function getIndustryRevision(): number {
  return revision;
}

export function getActiveIndustryPack(): CustomerSupportPack {
  const entry = packRegistry.find((p) => p.industry === industryId);
  if (entry?.available) return entry;
  return retailCommercePack;
}

export function setActiveIndustry(next: IndustryId): boolean {
  const entry = packRegistry.find((p) => p.industry === next);
  if (!entry?.available) return false;
  if (industryId === next) return true;
  industryId = next;
  emit();
  return true;
}

export function listPackRegistry(): PackRegistryEntry[] {
  return packRegistry;
}

export function useIndustryPack() {
  const rev = useSyncExternalStore(
    subscribe,
    () => revision,
    () => 0,
  );
  const pack = getActiveIndustryPack();
  return {
    revision: rev,
    industryId: pack.industry,
    pack,
    setIndustry: setActiveIndustry,
    registry: packRegistry,
  };
}
