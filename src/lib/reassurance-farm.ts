export const farmStorageKey = "oneul-anbu-farm";
export const harvestStorageKey = "oneul-anbu-harvest-storage";

export type FarmStage = "seed" | "sprout" | "stem" | "flower" | "tiny_fruit" | "ripe" | "harvest";

export type FarmCrop = {
  id: string;
  name: string;
  emoji: string;
  requiredDays: number;
  season: string;
};

export type FarmState = {
  currentCropId: string | null;
  recordedDays: number;
  growthPercent: number;
  startedAt?: string;
  lastGrowthDate?: string;
  harvestable: boolean;
  totalHarvests: number;
  familySupportEnabled: false;
};

export type HarvestItem = { cropId: string; count: number; harvestedAt: string };

export const farmCrops: FarmCrop[] = [
  { id: "mushroom", name: "버섯", emoji: "🍄", requiredDays: 7, season: "봄·가을" },
  { id: "lettuce", name: "상추", emoji: "🥬", requiredDays: 14, season: "봄·가을" },
  { id: "cherry-tomato", name: "방울토마토", emoji: "🍅", requiredDays: 30, season: "여름" },
  { id: "strawberry", name: "딸기", emoji: "🍓", requiredDays: 45, season: "봄" },
  { id: "corn", name: "옥수수", emoji: "🌽", requiredDays: 60, season: "여름" },
  { id: "tangerine", name: "귤", emoji: "🍊", requiredDays: 90, season: "겨울" },
  { id: "apple", name: "사과", emoji: "🍎", requiredDays: 180, season: "가을" },
];

export function getFarmCrop(id?: string | null) {
  return farmCrops.find((crop) => crop.id === id);
}

export function getFarmStage(percent: number): FarmStage {
  if (percent >= 100) return "harvest";
  if (percent >= 84) return "ripe";
  if (percent >= 68) return "tiny_fruit";
  if (percent >= 50) return "flower";
  if (percent >= 30) return "stem";
  if (percent > 0) return "sprout";
  return "seed";
}

export function getStageVisual(stage: FarmStage, crop: FarmCrop) {
  if (stage === "seed") return "•";
  if (stage === "sprout") return "🌱";
  if (stage === "stem") return crop.id === "apple" || crop.id === "tangerine" ? "🌳" : "🌿";
  if (stage === "flower") return "🌼";
  if (stage === "tiny_fruit") return `🌿${crop.emoji}`;
  return crop.emoji;
}

export function readFarm(): FarmState | null {
  try {
    const raw = window.localStorage.getItem(farmStorageKey);
    return raw ? JSON.parse(raw) as FarmState : null;
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

export function createFreshFarm(crop: FarmCrop, totalHarvests = 0): FarmState {
  return {
    currentCropId: crop.id,
    recordedDays: 0,
    growthPercent: 0,
    startedAt: new Date().toISOString(),
    harvestable: false,
    totalHarvests,
    familySupportEnabled: false,
  };
}
