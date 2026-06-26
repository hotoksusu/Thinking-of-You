"use client";

import { FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, HeartHandshake, Phone } from "lucide-react";
import { Button, Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storageKeys } from "@/lib/storage-keys";
import type {
  KakaoSession,
  LovedOneRelation,
  ParentProfile,
} from "@/types/onboarding";

const relations: LovedOneRelation[] = ["부모님", "배우자", "가족", "지인", "기타"];

const defaultProfile: ParentProfile = {
  name: "",
  relation: "부모님",
  phone: "",
  contactMethod: "sms",
  responseMethod: "sms",
  emergencyContact: {
    name: "",
    relation: "",
    phone: "",
  },
};

export default function AddParentPage() {
  return (
    <Suspense fallback={null}>
      <AddParentContent />
    </Suspense>
  );
}

function AddParentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const auth = params.get("auth");
  const [profile, setProfile] = useLocalStorage<ParentProfile>(
    storageKeys.lovedOneProfile,
    defaultProfile,
  );
  const [, setSession] = useLocalStorage<KakaoSession>(storageKeys.kakaoSession, {
    provider: "kakao",
    status: "mock",
    connectedAt: "",
  });

  useEffect(() => {
    if (!auth) return;

    setSession({
      provider: "kakao",
      status: auth === "kakao" ? "connected" : "mock",
      connectedAt: new Date().toISOString(),
    });
  }, [auth, setSession]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/onboarding/contact-method");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[440px] bg-brand-background px-5 py-6 text-brand-text shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header className="space-y-3">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-mint text-brand-primary">
          <HeartHandshake size={23} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-primary">부모님 등록</p>
          <h1 className="brand-title mt-2 text-3xl">
            안부를 확인할 부모님을 알려주세요
          </h1>
        </div>
        <p className="soft-copy text-sm text-brand-subtext">
          부모님이 앱을 직접 쓰지 않아도 괜찮아요. 이름과 연락처를 저장한 뒤
          카카오톡, 문자/SMS, 전화 확인 중 편한 방식을 고를 수 있어요.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Card className="space-y-4 rounded-2xl">
          <div className="grid gap-2">
            <FieldLabel>부모님 이름</FieldLabel>
            <input
              className={inputClassName}
              value={profile.name}
              onChange={(event) =>
                setProfile((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="예: 엄마"
              required
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>관계</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {relations.map((relation) => {
                const selected = profile.relation === relation;
                return (
                  <button
                    key={relation}
                    type="button"
                    className={`flex min-h-12 items-center justify-between rounded-xl border px-3 text-sm font-bold transition ${
                      selected
                        ? "border-brand-primary bg-brand-mint text-brand-hover"
                        : "border-brand-line bg-white text-brand-text"
                    }`}
                    onClick={() => setProfile((current) => ({ ...current, relation }))}
                  >
                    {relation}
                    {selected ? <Check size={17} aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <FieldLabel>연락처</FieldLabel>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary"
                aria-hidden
              />
              <input
                className={`${inputClassName} pl-10`}
                value={profile.phone}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, phone: event.target.value }))
                }
                inputMode="tel"
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4 rounded-2xl">
          <div>
            <p className="text-sm font-extrabold text-brand-text">
              긴급 연락처 <span className="text-brand-subtext">(선택)</span>
            </p>
            <p className="soft-copy mt-1 text-xs text-brand-subtext">
              3일 연속 미응답 같은 상황에서 나중에 알림 대상으로 활용할 수 있어요.
            </p>
          </div>

          <div className="grid gap-2">
            <FieldLabel>이름</FieldLabel>
            <input
              className={inputClassName}
              value={profile.emergencyContact?.name ?? ""}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  emergencyContact: {
                    name: event.target.value,
                    relation: current.emergencyContact?.relation ?? "",
                    phone: current.emergencyContact?.phone ?? "",
                  },
                }))
              }
              placeholder="예: 큰딸"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <FieldLabel>관계</FieldLabel>
              <input
                className={inputClassName}
                value={profile.emergencyContact?.relation ?? ""}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    emergencyContact: {
                      name: current.emergencyContact?.name ?? "",
                      relation: event.target.value,
                      phone: current.emergencyContact?.phone ?? "",
                    },
                  }))
                }
                placeholder="예: 자녀"
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel>연락처</FieldLabel>
              <input
                className={inputClassName}
                value={profile.emergencyContact?.phone ?? ""}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    emergencyContact: {
                      name: current.emergencyContact?.name ?? "",
                      relation: current.emergencyContact?.relation ?? "",
                      phone: event.target.value,
                    },
                  }))
                }
                inputMode="tel"
                placeholder="010-0000-0000"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-brand-primary/20 bg-brand-mint/80">
          <p className="text-sm font-extrabold text-brand-hover">
            다음 단계에서 연락 방식을 고릅니다.
          </p>
          <p className="soft-copy mt-1 text-sm text-brand-subtext">
            카카오톡을 쓰지 않는 부모님도 문자나 전화 확인으로 안부 요청을
            이어갈 수 있어요.
          </p>
        </Card>

        <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-hover">
          연락 방식 선택하기
          <ChevronRight size={18} aria-hidden />
        </Button>
      </form>
    </main>
  );
}
