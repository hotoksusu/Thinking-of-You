"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, PackageOpen, Sparkles } from "lucide-react";
import {
  createFreshFarm,
  farmCrops,
  getFarmCrop,
  getFarmStage,
  getStageVisual,
  readFarm,
  readHarvests,
  saveFarm,
  saveHarvests,
  type FarmCrop,
  type FarmState,
  type HarvestItem,
} from "@/lib/reassurance-farm";

const stageMessages = {
  seed: "따뜻한 흙 속에서 첫날을 기다리고 있어요.",
  sprout: "작은 새싹이 고개를 내밀었어요.",
  stem: "줄기가 한 뼘 더 자랐어요.",
  flower: "꽃이 피었습니다.",
  tiny_fruit: "작은 열매가 맺히기 시작했어요.",
  ripe: "열매가 곱게 익어가고 있어요.",
  harvest: "잘 자랐어요. 이제 수확할 수 있어요.",
} as const;

const visitors = [
  { icon: "☀️", text: "따뜻한 햇살이 머물렀어요." },
  { icon: "☁️", text: "포근한 구름이 천천히 지나가요." },
  { icon: "🦋", text: "작은 나비가 농장에 다녀갔어요." },
  { icon: "🐞", text: "무당벌레가 잎 위에서 쉬고 있어요." },
  { icon: "🌸", text: "바람에 꽃잎이 살랑 날아왔어요." },
  { icon: "🐦", text: "작은 새가 아침 인사를 건넸어요." },
];

function dayNumber() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
}

export function ReassuranceFarmPage() {
  const [farm, setFarm] = useState<FarmState | null>(null);
  const [storage, setStorage] = useState<HarvestItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [harvestState, setHarvestState] = useState<"idle" | "moving" | "done">("idle");

  useEffect(() => {
    setFarm(readFarm());
    setStorage(readHarvests());
    setLoaded(true);
  }, []);

  const crop = getFarmCrop(farm?.currentCropId);
  const stage = getFarmStage(farm?.growthPercent ?? 0);
  const visitor = useMemo(() => visitors[(dayNumber() + (crop?.id.length ?? 0)) % visitors.length], [crop?.id]);
  const remainingDays = crop && farm ? Math.max(crop.requiredDays - farm.recordedDays, 0) : 0;

  function reactToTouch() {
    setReacting(false);
    window.requestAnimationFrame(() => setReacting(true));
    window.setTimeout(() => setReacting(false), 720);
  }

  function selectCrop(nextCrop: FarmCrop) {
    const nextFarm = createFreshFarm(nextCrop, farm?.totalHarvests ?? 0);
    setFarm(nextFarm);
    saveFarm(nextFarm);
  }

  function harvest() {
    if (!farm || !crop || !farm.harvestable || harvestState !== "idle") return;
    setHarvestState("moving");
    window.setTimeout(() => {
      const harvestedAt = new Date().toISOString();
      const existing = storage.find((item) => item.cropId === crop.id);
      const nextStorage = existing
        ? storage.map((item) => item.cropId === crop.id ? { ...item, count: item.count + 1, harvestedAt } : item)
        : [...storage, { cropId: crop.id, count: 1, harvestedAt }];
      const nextFarm: FarmState = { ...farm, currentCropId: null, recordedDays: 0, growthPercent: 0, harvestable: false, totalHarvests: farm.totalHarvests + 1 };
      setStorage(nextStorage);
      setFarm(nextFarm);
      saveHarvests(nextStorage);
      saveFarm(nextFarm);
      setHarvestState("done");
    }, 1900);
  }

  if (!loaded) return <main className="min-h-screen bg-[#F6FBF3]" aria-label="안심농장을 불러오고 있어요" />;

  return (
    <main className="min-h-screen bg-[#F6FBF3] text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 py-5">
        <Link href="/app?role=parent" className="flex min-h-12 items-center gap-2 font-black text-[#166534]"><ArrowLeft size={22} aria-hidden /> 부모님 홈</Link>
        <span className="font-black text-[#15803D]">나의 안심농장</span>
      </header>

      <div className="mx-auto w-full max-w-[760px] px-5 pb-16">
        {crop && farm ? (
          <>
            <section className="overflow-hidden rounded-[28px] border border-[#BBF7D0] bg-white shadow-[0_24px_70px_rgba(21,128,61,0.10)]">
              <div className="farm-sky relative min-h-[360px] overflow-hidden px-6 pt-7 text-center">
                <div className="absolute right-6 top-6 rounded-full bg-white/90 px-4 py-2 text-lg shadow-sm" aria-label={visitor.text}>{visitor.icon}</div>
                <p className="text-sm font-black text-[#166534]">오늘의 농장 풍경</p>
                <h1 className="mt-2 text-[2rem] font-black leading-tight">{crop.name}이<br />천천히 자라고 있어요</h1>
                <button type="button" onClick={reactToTouch} className={`farm-crop mt-8 inline-flex min-h-40 min-w-40 items-center justify-center rounded-full bg-white/75 px-5 text-7xl shadow-[0_18px_42px_rgba(21,128,61,0.16)] ${reacting ? "farm-crop-react" : ""}`} aria-label={`${crop.name}을 살짝 만져보기`}>
                  {getStageVisual(stage, crop)}
                </button>
                <p className="mt-4 font-bold text-[#166534]">살짝 눌러 인사해보세요.</p>
                <div className="farm-ground absolute inset-x-0 bottom-0 h-16" aria-hidden />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-sm font-black text-[#15803D]">지금은 {stageMessages[stage]}</p><p className="mt-2 text-xl font-black">수확까지 {remainingDays}일</p></div>
                  <span className="text-3xl font-black text-[#15803D]">{Math.round(farm.growthPercent)}%</span>
                </div>
                <div className="mt-4 h-5 overflow-hidden rounded-full bg-[#DCFCE7]" role="progressbar" aria-label="작물 성장률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(farm.growthPercent)}>
                  <div className="h-full rounded-full bg-[#22C55E] transition-all" style={{ width: `${farm.growthPercent}%` }} />
                </div>
                {farm.harvestable ? <button type="button" onClick={harvest} disabled={harvestState !== "idle"} className="mt-6 min-h-16 w-full rounded-2xl bg-[#15803D] px-5 text-xl font-black text-white disabled:bg-[#86B795]">{harvestState === "moving" ? "바구니에 담고 있어요..." : "잘 자란 작물 수확하기"}</button> : null}
              </div>
            </section>

            <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-black text-[#15803D]">농장 일기</p>
              <h2 className="mt-2 text-2xl font-black">최근 농장 소식</h2>
              <div className="mt-5 divide-y divide-[#E5E7EB]">
                <DiaryRow day="오늘" icon={visitor.icon} text={visitor.text} />
                <DiaryRow day="어제" icon="🌱" text={farm.recordedDays > 1 ? "안부를 먹고 새 잎이 자랐어요." : "씨앗이 포근한 흙에서 쉬었어요."} />
                <DiaryRow day="3일 전" icon="🌼" text={farm.growthPercent >= 50 ? "작은 꽃이 피기 시작했어요." : "햇빛을 받아 힘을 모았어요."} />
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-[28px] bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            {harvestState === "done" ? <div className="mb-7 rounded-2xl bg-[#FFF7ED] p-5 text-center"><Check className="mx-auto text-[#F97316]" size={34} aria-hidden /><h1 className="mt-3 text-2xl font-black">축하합니다!</h1><p className="mt-2 font-bold leading-7 text-[#7C2D12]">꾸준히 안부를 남긴 덕분에<br />작물이 수확 창고에 잘 담겼어요.</p></div> : null}
            <Sparkles className="text-[#15803D]" size={34} aria-hidden />
            <h1 className="mt-4 text-3xl font-black leading-tight">다음 계절을 함께할<br />작물을 골라보세요.</h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{farmCrops.map((item) => <button key={item.id} type="button" onClick={() => selectCrop(item)} className="flex min-h-24 items-center gap-4 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-left"><span className="text-4xl" aria-hidden>{item.emoji}</span><span><strong className="block text-xl">{item.name}</strong><span className="mt-1 block font-bold text-[#4B5563]">{item.requiredDays}일 · {item.season}</span></span></button>)}</div>
          </section>
        )}

        <Warehouse storage={storage} />
      </div>
      {harvestState === "moving" && crop ? <div className="farm-harvest-overlay fixed inset-0 z-50 grid place-items-center bg-white/85 text-center"><div><div className="farm-harvest-crop text-8xl">{crop.emoji}</div><div className="mt-5 text-5xl">🧺</div><p className="mt-5 text-2xl font-black text-[#166534]">정성껏 수확하고 있어요.</p></div></div> : null}
    </main>
  );
}

function DiaryRow({ day, icon, text }: { day: string; icon: string; text: string }) {
  return <div className="grid grid-cols-[56px_42px_1fr] items-center gap-2 py-4"><strong className="text-[#6B7280]">{day}</strong><span className="text-2xl" aria-hidden>{icon}</span><p className="font-bold leading-7">{text}</p></div>;
}

function Warehouse({ storage }: { storage: HarvestItem[] }) {
  return (
    <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3 text-[#166534]"><PackageOpen size={26} aria-hidden /><h2 className="text-2xl font-black">수확 창고</h2></div>
      <p className="mt-2 font-semibold leading-7 text-[#6B7280]">함께 키운 계절이 하나씩 모이는 곳이에요.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {farmCrops.map((crop) => {
          const item = storage.find((stored) => stored.cropId === crop.id);
          return <div key={crop.id} className={`min-h-36 rounded-2xl border p-4 text-center ${item ? "border-[#BBF7D0] bg-[#F0FDF4]" : "border-dashed border-[#D1D5DB] bg-[#F9FAFB]"}`}><span className={`text-4xl ${item ? "" : "grayscale opacity-30"}`} aria-hidden>{crop.emoji}</span><strong className="mt-2 block">{crop.name}</strong><span className="mt-1 block text-sm font-bold text-[#6B7280]">{item ? `수확 완료 · ${item.count}개` : "다음 작물을 기다리고 있어요."}</span></div>;
        })}
      </div>
    </section>
  );
}
