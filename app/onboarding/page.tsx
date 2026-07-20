"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Footprints,
  HeartHandshake,
  Image as ImageIcon,
  Leaf,
  MessageCircle,
  PackageOpen,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import { storageKeys } from "@/lib/storage-keys";

type Role = "parent" | "family";
type Choice = { id: string; label: string; icon?: React.ReactNode };

const familyPurposes: Choice[] = [
  { id: "change", label: "가족의 생활 변화를 알고 싶어요.", icon: <Footprints /> },
  { id: "alone", label: "혼자 계신 가족이 걱정돼요.", icon: <ShieldCheck /> },
  { id: "together", label: "가족이 함께 안심을 확인하고 싶어요.", icon: <Users /> },
  { id: "news", label: "가족 소식을 자주 전하고 싶어요.", icon: <ImageIcon /> },
];

const relations: Choice[] = ["어머니", "아버지", "배우자", "조부모", "가족"].map((label) => ({ id: label, label }));
const methods: Choice[] = [
  { id: "kakao", label: "카카오톡 보내기", icon: <MessageCircle /> },
  { id: "sms", label: "문자 보내기", icon: <Smartphone /> },
  { id: "together", label: "지금 같이 연결하기", icon: <Phone /> },
];

export default function OnboardingPage() {
  return <Suspense fallback={<main className="min-h-[100dvh] bg-[#F5F8F3]" />}><OnboardingFlow /></Suspense>;
}

function OnboardingFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const role: Role = params.get("role") === "family" ? "family" : "parent";
  const total = role === "parent" ? 4 : 6;
  const [step, setStep] = useState(1);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [relation, setRelation] = useState("");
  const [method, setMethod] = useState("");

  const answers = useMemo(() => {
    if (role === "parent") return [];
    const values: string[] = [];
    if (step > 1 && purposes.length) values.push(familyPurposes.filter((item) => purposes.includes(item.id)).map((item) => item.label.replace("요.", "요")).join(" · "));
    if (step > 2 && relation) values.push(`${relation}와 연결할게요.`);
    if (step > 5 && method) values.push(`${methods.find((item) => item.id === method)?.label}로 연결할게요.`);
    return values;
  }, [method, purposes, relation, role, step]);

  function togglePurpose(id: string) {
    setPurposes((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 2 ? [...current, id] : current);
  }

  function next() {
    if (step < total) setStep((value) => value + 1);
  }

  function back() {
    if (step > 1) setStep((value) => value - 1);
    else router.push("/start");
  }

  function finish() {
    if (role === "parent") window.localStorage.setItem("todayanbu.parent-onboarding.completed", "true");
    else window.localStorage.setItem(storageKeys.familyOnboardingCompleted, "true");
    router.push(`/app?role=${role}&onboarding=done`);
  }

  return (
    <main className="min-h-[100dvh] bg-[#F5F8F3] px-4 py-4 text-[#17251F] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[600px] flex-col">
        <header className="flex min-h-14 items-center justify-between gap-3">
          <button type="button" onClick={back} className="flex min-h-12 items-center gap-2 rounded-full px-2 text-lg font-black text-[#4E6056]"><ArrowLeft size={24} /> 이전</button>
          <span className="text-xl font-black text-[#315B3D]">오늘안부</span>
          <span className="min-w-16 text-right text-lg font-black text-[#6D7A72]">{step}/{total}</span>
        </header>

        <div className="mt-3 flex justify-center gap-2" aria-label={`${total}단계 중 ${step}단계`}>
          {Array.from({ length: total }, (_, index) => <span key={index} className={`h-3 rounded-full transition-all ${index + 1 === step ? "w-9 bg-[#D95C24]" : index + 1 < step ? "w-3 bg-[#78A76E]" : "w-3 bg-[#D8DED8]"}`} />)}
        </div>

        <section className="mt-5 flex-1 rounded-[32px] bg-white p-5 shadow-[0_22px_60px_rgba(49,78,58,.11)] sm:p-8">
          <div className="max-h-40 space-y-3 overflow-y-auto" aria-live="polite">
            {answers.map((answer, index) => <div key={`${answer}-${index}`} className="ml-auto w-fit max-w-[88%] rounded-[22px_22px_5px_22px] bg-[#2F6B46] px-5 py-3 text-lg font-bold leading-7 text-white">{answer}</div>)}
          </div>
          <div key={`${role}-${step}`} className="completion-slide mt-4">
            <div className="flex items-start gap-3">
              <img src="/brand/brand-icon.png?v=10" alt="" className="size-12 rounded-2xl object-cover" />
              <div className="rounded-[6px_22px_22px_22px] bg-[#EEF4EA] px-5 py-4 text-lg font-black text-[#315B3D]">차근차근 도와드릴게요.</div>
            </div>
            {role === "parent" ? <ParentStep step={step} onNext={next} onFinish={finish} /> : <FamilyStep step={step} purposes={purposes} relation={relation} method={method} onTogglePurpose={togglePurpose} onRelation={setRelation} onMethod={setMethod} onNext={next} onFinish={finish} />}
          </div>
        </section>
      </div>
    </main>
  );
}

function ParentStep({ step, onNext, onFinish }: { step: number; onNext: () => void; onFinish: () => void }) {
  if (step === 1) return <StepBody icon={<HeartHandshake />} title={<>안녕하세요.<br />오늘안부를 편하게 시작해볼게요.</>}><PrimaryButton onClick={onNext}>시작하기</PrimaryButton></StepBody>;
  if (step === 2) return <StepBody icon={<Footprints />} title={<>따로 적지 않아도<br />괜찮아요.</>} description={<>걸음과 생활 흐름을<br />자동으로 살펴봅니다.</>}><div className="mx-auto mt-6 flex max-w-[330px] items-center justify-center gap-4 rounded-[26px] bg-[#F2F7EF] p-5"><span className="text-5xl">🚶</span><ArrowRight className="text-[#78A76E]" /><span className="text-5xl">🌿</span></div><PrimaryButton onClick={onNext}>생활 확인 시작하기</PrimaryButton></StepBody>;
  if (step === 3) return <StepBody icon={<ShieldCheck />} title={<>통화 내용은<br />보지 않습니다.</>} description={<>연락한 시간과 횟수의<br />변화만 확인합니다.</>}><div className="mt-6 rounded-[22px] bg-[#EFF6F1] p-4 text-lg font-black text-[#315B3D]">내용은 보호하고, 변화만 살펴봐요.</div><PrimaryButton onClick={onNext}>확인했어요</PrimaryButton></StepBody>;
  return <StepBody icon={<Sparkles />} title={<>준비가 끝났습니다.</>} description={<>이제 평소처럼 생활하시면 됩니다.<br />가족 소식도 언제든 확인할 수 있어요.</>}><ServiceSummary role="parent" /><PrimaryButton onClick={onFinish}>오늘안부 시작하기</PrimaryButton></StepBody>;
}

function FamilyStep({ step, purposes, relation, method, onTogglePurpose, onRelation, onMethod, onNext, onFinish }: { step: number; purposes: string[]; relation: string; method: string; onTogglePurpose: (id: string) => void; onRelation: (id: string) => void; onMethod: (id: string) => void; onNext: () => void; onFinish: () => void }) {
  if (step === 1) return <StepBody icon={<HeartHandshake />} title={<>오늘안부를<br />어떻게 사용하고 싶으신가요?</>} description="최대 2개까지 선택해 주세요."><ChoiceList items={familyPurposes} selected={purposes} onSelect={onTogglePurpose} /><PrimaryButton onClick={onNext} disabled={!purposes.length}>다음</PrimaryButton></StepBody>;
  if (step === 2) return <StepBody icon={<Users />} title="누구와 연결하시나요?"><ChoiceList items={relations} selected={relation ? [relation] : []} onSelect={onRelation} compact /><PrimaryButton onClick={onNext} disabled={!relation}>다음</PrimaryButton></StepBody>;
  if (step === 3) return <StepBody icon={<ImageIcon />} title={<>사진 한 장도<br />큰 안부가 됩니다.</>}><div className="mt-6 grid grid-cols-4 gap-2">{[["👶","손주"],["🍚","식사"],["✈️","여행"],["☀️","일상"]].map(([icon,label]) => <div key={label} className="rounded-2xl bg-[#FFF5EC] p-3 text-center"><span className="text-3xl">{icon}</span><strong className="mt-2 block text-sm">{label}</strong></div>)}</div><PrimaryButton onClick={onNext}>알겠습니다</PrimaryButton></StepBody>;
  if (step === 4) return <StepBody icon={<ShieldCheck />} title={<>연결하면 생활 변화는<br />자동으로 확인됩니다.</>} description={<>필요할 때만 사진이나<br />한 줄을 남겨주세요.</>}><PrimaryButton onClick={onNext}>가족 연결하기</PrimaryButton></StepBody>;
  if (step === 5) return <StepBody icon={<Smartphone />} title="어떻게 연결할까요?"><ChoiceList items={methods} selected={method ? [method] : []} onSelect={onMethod} /><PrimaryButton onClick={onNext} disabled={!method}>이 방법으로 연결하기</PrimaryButton></StepBody>;
  return <StepBody icon={<Check />} title={<>이제부터 평소와 다른<br />변화만 알려드립니다.</>} description="가끔 사진 한 장만 보내주세요."><ServiceSummary role="family" /><PrimaryButton onClick={onFinish}>가족 홈 시작하기</PrimaryButton></StepBody>;
}

function StepBody({ icon, title, description, children }: { icon: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; children: React.ReactNode }) {
  return <div className="mt-7 text-center"><span className="mx-auto flex size-20 items-center justify-center rounded-[26px] bg-[#FFF0E6] text-[#D95C24] [&>svg]:size-10">{icon}</span><h1 className="mt-5 text-[clamp(2rem,8vw,2.7rem)] font-black leading-[1.2] tracking-[-.025em]">{title}</h1>{description ? <p className="mt-4 text-xl font-bold leading-8 text-[#596A61]">{description}</p> : null}{children}</div>;
}

function ChoiceList({ items, selected, onSelect, compact = false }: { items: Choice[]; selected: string[]; onSelect: (id: string) => void; compact?: boolean }) {
  return <div className={`mt-6 grid gap-3 ${compact ? "grid-cols-2" : ""}`}>{items.map((item) => { const active = selected.includes(item.id); return <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`flex min-h-[68px] items-center gap-3 rounded-[20px] border-2 px-4 text-left text-lg font-black transition ${active ? "border-[#2F6B46] bg-[#EAF3E5] text-[#245F3D]" : "border-[#DCE4DC] bg-white text-[#35463D]"}`}><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-[#2F6B46] text-white" : "bg-[#F1F4F0] text-[#657169]"}`}>{active ? <Check size={23} /> : item.icon ?? <span className="size-3 rounded-full border-2 border-current" />}</span><span>{item.label}</span></button>;})}</div>;
}

function PrimaryButton({ onClick, disabled = false, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="mt-7 flex min-h-[76px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#2F6B46] px-6 text-[1.3rem] font-black text-white shadow-[0_14px_30px_rgba(47,107,70,.22)] disabled:bg-[#B8C2B9] disabled:shadow-none">{children}<ChevronRight size={26} /></button>;
}

function ServiceSummary({ role }: { role: Role }) {
  const items = role === "parent" ? [["오늘의 생활","평소처럼 생활하면 됩니다.",<Footprints key="a" />],["가족 소식","사진과 안부를 받아봅니다.",<ImageIcon key="b" />],["안부농장","생활이 쌓이면 작물이 자랍니다.",<Sprout key="c" />],["수확 선물","꾸준한 생활이 계절 수확이 됩니다.",<PackageOpen key="d" />]] : [["오늘의 안심","평소와 다른 변화만 확인합니다.",<ShieldCheck key="a" />],["생활 변화","생활 흐름을 살펴봅니다.",<Footprints key="b" />],["가족 소식","사진이나 한 줄을 남깁니다.",<ImageIcon key="c" />],["안부농장","성장과 수확 시기를 확인합니다.",<Leaf key="d" />]];
  return <div className="mt-6 rounded-[24px] bg-[#F2F7EF] p-4 text-left"><p className="mb-3 text-center text-lg font-black text-[#315B3D]">오늘안부는 이렇게 사용해요</p><div className="grid gap-2">{items.map(([title,text,icon]) => <div key={String(title)} className="flex items-center gap-3 rounded-2xl bg-white p-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E5] text-[#2F6B46] [&>svg]:size-5">{icon}</span><span><strong className="block text-base">{title}</strong><span className="text-sm font-bold text-[#667169]">{text}</span></span></div>)}</div></div>;
}
