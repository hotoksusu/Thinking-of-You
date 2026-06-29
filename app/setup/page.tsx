"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo } from "react";
import { Check, MessageCircle, Phone, HeartHandshake, Smartphone, Sprout, UserRoundCheck } from "lucide-react";
import { Button, Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  defaultConsumerSettings,
  type ConsumerMode,
  type ConsumerSettings,
} from "@/lib/mock-data";
import { clearSampleFamilyData } from "@/lib/sample-data";
import { storageKeys } from "@/lib/storage-keys";

const careOptions = ["약 복용", "병원 일정", "건강검진", "식사/수면/운동", "정서 안부"];
const contactMethods = [
  {
    value: "kakao",
    label: "카카오톡",
    description: "카카오톡으로 안부 요청",
    icon: MessageCircle,
  },
  {
    value: "sms",
    label: "문자(SMS)",
    description: "카카오톡 없이 문자로 응답 가능",
    icon: Smartphone,
  },
  {
    value: "phone",
    label: "전화 확인",
    description: "스마트폰 사용이 어려운 경우",
    icon: Phone,
  },
] as const;

export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupContent />
    </Suspense>
  );
}

function SetupContent() {
  const params = useSearchParams();
  const router = useRouter();
  const initialMode: ConsumerMode = params.get("mode") === "self" ? "self-care" : "family-care";
  const freshStart = params.get("fresh") === "1";
  const [settings, setSettings] = useLocalStorage<ConsumerSettings>(
    storageKeys.consumerSettings,
    { ...defaultConsumerSettings, mode: initialMode },
  );

  const isFamily = settings.mode === "family-care";
  const title = isFamily ? "부모님 안심 확인 설정" : "내 안심 상태 설정";

  const selectedCount = useMemo(() => settings.careItems.length, [settings.careItems]);

  useEffect(() => {
    if (!freshStart) return;
    clearSampleFamilyData();
    setSettings({ ...defaultConsumerSettings, mode: "family-care" });
  }, [freshStart, setSettings]);

  function toggleCareItem(item: string) {
    setSettings((current) => ({
      ...current,
      careItems: current.careItems.includes(item)
        ? current.careItems.filter((value) => value !== item)
        : [...current.careItems, item],
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/home");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[440px] bg-brand-cream px-5 py-6 text-brand-ink shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header>
        <p className="text-sm font-bold text-brand-coral">처음 설정</p>
        <h1 className="brand-title mt-2 text-3xl">{title}</h1>
        <p className="soft-copy mt-2 text-sm text-stone-600">
          몇 가지만 정하면 안심 점수와 변화 감지 화면이 준비됩니다.
        </p>
      </header>

      {isFamily ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#15803D]">
            <Sprout size={23} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-black text-[#15803D]">부모님이 꾸준히 돌아오는 안심농장</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">연결이 끝나면 부모님은 첫 씨앗을 고릅니다. 매일 짧은 안부가 작물을 키우고 가족의 안심 흐름도 더 또렷하게 만듭니다.</p>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className={`rounded-xl border p-4 text-left ${isFamily ? "border-brand-sage bg-brand-mint" : "border-brand-line bg-white"}`}
          onClick={() => setSettings((current) => ({ ...current, mode: "family-care" }))}
        >
          <HeartHandshake size={22} aria-hidden />
          <span className="mt-2 block text-sm font-bold">부모님 안심 확인</span>
        </button>
        <button
          className={`rounded-xl border p-4 text-left ${!isFamily ? "border-brand-sage bg-brand-mint" : "border-brand-line bg-white"}`}
          onClick={() => setSettings((current) => ({ ...current, mode: "self-care" }))}
        >
          <UserRoundCheck size={22} aria-hidden />
          <span className="mt-2 block text-sm font-bold">내 안심 상태 관리</span>
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <Card className="space-y-4">
          <div className="grid gap-2">
            <FieldLabel>{isFamily ? "부모님 이름" : "내 이름"}</FieldLabel>
            <input
              className={inputClassName}
              value={settings.name}
              onChange={(event) =>
                setSettings((current) => ({ ...current, name: event.target.value }))
              }
              placeholder={isFamily ? "예: 엄마" : "예: 내 이름"}
            />
          </div>
          {isFamily ? (
            <>
              <div className="grid gap-2">
                <FieldLabel>관계</FieldLabel>
                <input
                  className={inputClassName}
                  value={settings.relation}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, relation: event.target.value }))
                  }
                  placeholder="예: 어머니"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>연락처</FieldLabel>
                <input
                  className={inputClassName}
                  value={settings.phone ?? ""}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="예: 010-1234-5678"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>연락 방식</FieldLabel>
                <div className="grid gap-2">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    const selected = (settings.responseMethod ?? "sms") === method.value;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        className={`flex min-h-[70px] items-center gap-3 rounded-xl border px-3 text-left transition ${
                          selected
                            ? "border-[#2563EB] bg-[#EFF6FF] shadow-sm"
                            : "border-brand-line bg-white"
                        }`}
                        onClick={() =>
                          setSettings((current) => ({
                            ...current,
                            responseMethod: method.value,
                          }))
                        }
                      >
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                            selected ? "bg-[#2563EB] text-white" : "bg-brand-cream text-stone-600"
                          }`}
                        >
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">{method.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-stone-600">
                            {method.description}
                          </span>
                        </span>
                        {selected ? <Check size={18} className="text-[#2563EB]" aria-hidden /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-2">
                <FieldLabel>안부 확인 주기</FieldLabel>
                <select
                  className={inputClassName}
                  value={settings.checkFrequency}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, checkFrequency: event.target.value }))
                  }
                >
                  <option>매일</option>
                  <option>주 2회</option>
                  <option>주 1회</option>
                  <option>필요할 때</option>
                </select>
              </div>
            </>
          ) : (
            <div className="grid gap-2">
              <FieldLabel>알림 시간</FieldLabel>
              <input
                className={inputClassName}
                type="time"
                value={settings.reminderTime}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, reminderTime: event.target.value }))
                }
              />
            </div>
          )}
        </Card>

        {isFamily ? (
          <Card className="space-y-4">
            <div>
              <FieldLabel>긴급 연락처</FieldLabel>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                3일 연속 미응답 같은 상황에서 함께 확인할 사람을 저장해둘 수 있어요.
              </p>
            </div>
            <div className="grid gap-2">
              <FieldLabel>이름</FieldLabel>
              <input
                className={inputClassName}
                value={settings.emergencyName ?? ""}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, emergencyName: event.target.value }))
                }
                placeholder="예: 김서연"
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel>관계</FieldLabel>
              <input
                className={inputClassName}
                value={settings.emergencyRelation ?? ""}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, emergencyRelation: event.target.value }))
                }
                placeholder="예: 동생, 이웃, 요양보호사"
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel>연락처</FieldLabel>
              <input
                className={inputClassName}
                value={settings.emergencyContact ?? ""}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, emergencyContact: event.target.value }))
                }
                placeholder="예: 010-2222-8899"
              />
            </div>
          </Card>
        ) : null}

        <Card>
          <div className="flex items-center justify-between">
            <FieldLabel>관리하고 싶은 항목</FieldLabel>
            <span className="text-xs font-bold text-brand-sage">{selectedCount}개 선택</span>
          </div>
          <div className="mt-3 grid gap-2">
            {careOptions.map((item) => {
              const selected = settings.careItems.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`flex min-h-12 items-center justify-between rounded-lg border px-3 text-left text-sm font-bold ${
                    selected ? "border-brand-sage bg-brand-mint" : "border-brand-line bg-white"
                  }`}
                  onClick={() => toggleCareItem(item)}
                >
                  {item}
                  {selected ? <Check size={18} aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        </Card>

        <Button type="submit" className="w-full">
          {isFamily ? "부모님 연결하고 안심농장 준비하기" : "오늘의 안심 홈으로 가기"}
        </Button>
      </form>
    </main>
  );
}
