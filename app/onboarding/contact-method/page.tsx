"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, MessageCircle, Phone, Smartphone } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { methodLabel } from "@/lib/care-contact";
import { storageKeys } from "@/lib/storage-keys";
import type { ContactMethod, ParentProfile } from "@/types/onboarding";

const defaultProfile: ParentProfile = {
  name: "",
  relation: "부모님",
  phone: "",
  contactMethod: "sms",
  responseMethod: "sms",
};

const methods: {
  id: ContactMethod;
  title: string;
  description: string;
  icon: typeof MessageCircle;
}[] = [
  {
    id: "kakao",
    title: "카카오톡",
    description: "카카오톡으로 안부 요청",
    icon: MessageCircle,
  },
  {
    id: "sms",
    title: "문자/SMS",
    description: "카카오톡 없이 문자로 응답 가능",
    icon: Smartphone,
  },
  {
    id: "phone",
    title: "전화 확인",
    description: "스마트폰 사용이 어려운 경우",
    icon: Phone,
  },
];

export default function ContactMethodPage() {
  const router = useRouter();
  const [profile, setProfile] = useLocalStorage<ParentProfile>(
    storageKeys.lovedOneProfile,
    defaultProfile,
  );

  function submit() {
    router.push("/checkin");
  }

  const displayName = profile.name.trim() || "부모님";

  return (
    <main className="mx-auto min-h-screen w-full max-w-[440px] bg-brand-background px-5 py-6 text-brand-text shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header className="space-y-3">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-mint text-brand-primary">
          <Smartphone size={23} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-primary">연락 방식 선택</p>
          <h1 className="brand-title mt-2 text-3xl">
            {displayName}께 어떻게 안부를 요청할까요?
          </h1>
        </div>
        <p className="soft-copy text-sm text-brand-subtext">
          현재는 mock 상태만 저장합니다. 이후 알림톡, Kakao Message API,
          Naver Cloud SENS, Twilio, ARS로 연결할 수 있어요.
        </p>
      </header>

      <section className="mt-6 grid gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const selected = profile.contactMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              className={`flex min-h-[94px] w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition active:scale-[0.985] ${
                selected
                  ? "border-brand-primary bg-brand-mint text-brand-hover"
                  : "border-brand-line bg-white text-brand-text hover:border-brand-primary/40"
              }`}
              onClick={() =>
                setProfile((current) => ({
                  ...current,
                  contactMethod: method.id,
                  responseMethod: method.id,
                }))
              }
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                  method.id === "kakao"
                    ? "bg-[#FEE500] text-[#191919]"
                    : "bg-white text-brand-primary"
                } shadow-sm`}
              >
                <Icon size={21} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-base font-extrabold">
                  {method.title}
                  {selected ? <Check size={18} aria-hidden /> : null}
                </span>
                <span className="soft-copy mt-1 block text-sm text-brand-subtext">
                  {method.description}
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <Card className="mt-4 rounded-2xl border-brand-primary/20 bg-white">
        <p className="text-sm font-extrabold text-brand-hover">
          선택됨: {methodLabel[profile.contactMethod]}
        </p>
        <p className="soft-copy mt-1 text-sm text-brand-subtext">
          부모님이 카카오톡을 쓰지 않아도 안부 요청과 응답 상태를 관리할 수
          있게 설계했어요.
        </p>
      </Card>

      <div className="mt-5 grid gap-3">
        <Button className="w-full bg-brand-primary hover:bg-brand-hover" onClick={submit}>
          오늘 안심 상태 확인으로 이동
          <ChevronRight size={18} aria-hidden />
        </Button>
        <Link
          href="/onboarding/add-parent"
          className="inline-flex min-h-11 items-center justify-center rounded-full text-sm font-bold text-brand-subtext hover:text-brand-hover"
        >
          부모님 정보 다시 수정하기
        </Link>
      </div>
    </main>
  );
}
