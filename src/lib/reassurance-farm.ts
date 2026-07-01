export const farmStorageKey = "oneul-anbu-farm";
export const harvestStorageKey = "oneul-anbu-harvest-storage";

export const DEFAULT_GROWTH_DAYS = 90;
export const EXTENDED_GROWTH_DAYS = 120;

export type FarmSeason = "spring" | "summer" | "autumn" | "winter";
export type FarmStage = "seed" | "sprout" | "stem" | "fruit" | "harvest";

export type FarmCrop = {
  id: string;
  name: string;
  emoji: string;
  requiredDays: number;
  seasons: FarmSeason[];
  giftPackage: string;
  estimatedFulfillmentCost: number;
  extendedGrowthDays?: number;
};

export type FarmState = {
  currentCropId: string | null;
  recordedDays: number;
  growthPercent: number;
  startedAt?: string;
  lastGrowthDate?: string;
  harvestable: boolean;
  totalHarvests: number;
  familySupportEnabled: boolean;
  selectedBy?: "family" | "parent";
  familySupportBy?: string;
  lastWateredAt?: string;
  supportMessage?: string;
  harvestNotifiedAt?: string;
  lastHarvestedCropId?: string;
  giftStatus?: "growing" | "ready" | "address_confirmed" | "sent";
};

export type HarvestItem = { cropId: string; count: number; harvestedAt: string };

// estimatedFulfillmentCost is planning-only metadata and must never be rendered in the consumer UI.
export const farmCrops: FarmCrop[] = [
  { id: "lettuce", name: "상추", emoji: "🥬", requiredDays: 90, seasons: ["spring"], giftPackage: "상추 꾸러미", estimatedFulfillmentCost: 10000 },
  { id: "potato", name: "감자", emoji: "🥔", requiredDays: 90, seasons: ["spring"], giftPackage: "감자 3kg", estimatedFulfillmentCost: 10000 },
  { id: "strawberry", name: "딸기", emoji: "🍓", requiredDays: 90, seasons: ["spring", "winter"], giftPackage: "제철 딸기", estimatedFulfillmentCost: 16000, extendedGrowthDays: 120 },
  { id: "cherry-tomato", name: "토마토", emoji: "🍅", requiredDays: 90, seasons: ["summer"], giftPackage: "토마토 2kg", estimatedFulfillmentCost: 13000 },
  { id: "corn", name: "옥수수", emoji: "🌽", requiredDays: 90, seasons: ["summer"], giftPackage: "옥수수 10개", estimatedFulfillmentCost: 12000 },
  { id: "melon", name: "참외", emoji: "🍈", requiredDays: 90, seasons: ["summer"], giftPackage: "제철 참외", estimatedFulfillmentCost: 15000, extendedGrowthDays: 120 },
  { id: "sweet-potato", name: "고구마", emoji: "🍠", requiredDays: 90, seasons: ["autumn"], giftPackage: "고구마 3kg", estimatedFulfillmentCost: 11000 },
  { id: "apple", name: "사과", emoji: "🍎", requiredDays: 90, seasons: ["autumn"], giftPackage: "사과 2kg", estimatedFulfillmentCost: 16000, extendedGrowthDays: 120 },
  { id: "pear", name: "배", emoji: "🍐", requiredDays: 90, seasons: ["autumn"], giftPackage: "배 2kg", estimatedFulfillmentCost: 18000, extendedGrowthDays: 120 },
  { id: "tangerine", name: "귤", emoji: "🍊", requiredDays: 90, seasons: ["winter"], giftPackage: "귤 3kg", estimatedFulfillmentCost: 14000 },
  { id: "hallabong", name: "한라봉", emoji: "🍊", requiredDays: 90, seasons: ["winter"], giftPackage: "한라봉 꾸러미", estimatedFulfillmentCost: 18000, extendedGrowthDays: 120 },
];

export const seasonLabels: Record<FarmSeason, string> = {
  spring: "봄",
  summer: "여름",
  autumn: "가을",
  winter: "겨울",
};

export function getCurrentFarmSeason(date = new Date()): FarmSeason {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function getSeasonalCrops(season = getCurrentFarmSeason()) {
  return farmCrops.filter((crop) => crop.seasons.includes(season)).slice(0, 3);
}

export function getFarmCrop(id?: string | null) {
  return farmCrops.find((crop) => crop.id === id);
}

export function getFarmStage(recordedDays: number): FarmStage {
  if (recordedDays >= 90) return "harvest";
  if (recordedDays >= 61) return "fruit";
  if (recordedDays >= 31) return "stem";
  if (recordedDays >= 8) return "sprout";
  return "seed";
}

export function getGrowthPercent(recordedDays: number, requiredDays = DEFAULT_GROWTH_DAYS) {
  return Math.min((recordedDays / requiredDays) * 100, 100);
}

export function getStageVisual(stage: FarmStage, crop: FarmCrop) {
  if (stage === "seed") return "•";
  if (stage === "sprout") return "🌱";
  if (stage === "stem") return ["apple", "pear", "tangerine", "hallabong"].includes(crop.id) ? "🌳" : "🌿";
  if (stage === "fruit") return `🌿${crop.emoji}`;
  return crop.emoji;
}

export function readFarm(): FarmState | null {
  try {
    const raw = window.localStorage.getItem(farmStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FarmState>;
    const crop = getFarmCrop(parsed.currentCropId);
    const recordedDays = Math.min(parsed.recordedDays ?? 0, crop?.requiredDays ?? DEFAULT_GROWTH_DAYS);
    return {
      currentCropId: crop?.id ?? null,
      recordedDays,
      growthPercent: getGrowthPercent(recordedDays, crop?.requiredDays),
      startedAt: parsed.startedAt,
      lastGrowthDate: parsed.lastGrowthDate,
      harvestable: recordedDays >= (crop?.requiredDays ?? DEFAULT_GROWTH_DAYS),
      totalHarvests: parsed.totalHarvests ?? 0,
      familySupportEnabled: parsed.familySupportEnabled ?? false,
      selectedBy: parsed.selectedBy,
      familySupportBy: parsed.familySupportBy,
      lastWateredAt: parsed.lastWateredAt,
      supportMessage: parsed.supportMessage,
      harvestNotifiedAt: parsed.harvestNotifiedAt,
      lastHarvestedCropId: parsed.lastHarvestedCropId,
      giftStatus: parsed.giftStatus ?? (recordedDays >= DEFAULT_GROWTH_DAYS ? "ready" : "growing"),
    };
  } catch {
    return null;
  }
}

export function saveFarm(farm: FarmState) {
  window.localStorage.setItem(farmStorageKey, JSON.stringify(farm));
}

export function readHarvests(): HarvestItem[] {
  try {
    const raw = window.localStorage.getItem(harvestStorageKey);
    return raw ? JSON.parse(raw) as HarvestItem[] : [];
  } catch {
    return [];
  }
}

export function saveHarvests(items: HarvestItem[]) {
  window.localStorage.setItem(harvestStorageKey, JSON.stringify(items));
}

export function createFreshFarm(crop: FarmCrop | string, totalHarvests = 0, selectedBy: "family" | "parent" = "family"): FarmState {
  const selectedCrop = typeof crop === "string" ? getFarmCrop(crop) : crop;
  if (!selectedCrop) throw new Error("선택한 작물을 찾을 수 없습니다.");
  return {
    currentCropId: selectedCrop.id,
    recordedDays: 0,
    growthPercent: 0,
    startedAt: new Date().toISOString(),
    harvestable: false,
    totalHarvests,
    familySupportEnabled: false,
    selectedBy,
    giftStatus: "growing",
  };
}
