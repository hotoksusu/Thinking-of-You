"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";
import { Card } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { buildAlertSignals } from "@/lib/care-contact";
import { getTodayISO } from "@/lib/dates";
import { storageKeys } from "@/lib/storage-keys";
import type { AlertSignal, DailyCareCheck, ParentProfile } from "@/types/onboarding";

const today = getTodayISO();

const defaultCheck: DailyCareCheck = {
  date: today,
  meal: "unknown",
  medication: "unknown",
  condition: "normal",
  contact: "message",
  activity: "unknown",
  note: "",
  status: "good",
  responseStatus: "ready",
  responseMethod: "sms",
};

const defaultProfile: ParentProfile = {
  name: "",
  relation: "부모님",
  phone: "",
  contactMethod: "sms",
  responseMethod: "sms",
};

const mockExamples: AlertSignal[] = [
  {
    id: "example-no-response",
    title: "오늘 응답 없음",
    description: "요청 후 일정 시간이 지나도 응답이 없을 때 표시됩니다.",
    tone: "info",
  },
  {
    id: "example-medicine",
    title: "약 복용 미확인",
    description: "복용 확인이 비어 있으면 보호자가 다시 확인할 수 있어요.",
    tone: "info",
  },
  {
    id: "example-condition",
    title: "컨디션 나쁨",
    description: "나쁨 응답이 반복되면 더 눈에 띄게 표시할 수 있어요.",
    tone: "info",
  },
  {
    id: "example-three-day",
    title: "3일 연속 미응답",
    description: "향후 긴급 연락처 알림으로 확장할 수 있어요.",
    tone: "info",
  },
];

export default function AlertsPage() {
  const [profile] = useLocalStorage<ParentProfile>(
    storageKeys.lovedOneProfile,
    defaultProfile,
  );
  const [check] = useLocalStorage<DailyCareCheck>(
    storageKeys.dailyCareCheck,
    defaultCheck,
  );

  const displayName = profile.name.trim();
  const personLabel = displayName ? `${displayName}님` : "부모님";
  const alerts = buildAlertSignals(check);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[440px] bg-brand-background px-5 py-6 text-brand-text shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header className="space-y-3">
        <Link
          href="/checkin"
          className="inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-bold text-brand-subtext hover:text-brand-hover"
        >
          <ArrowLeft size={17} aria-hidden />
          오늘 안심 상태 확인으로
        </Link>
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-mint text-brand-primary">
          <AlertTriangle size={23} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-primary">안심 상태와 이상 신호</p>
          <h1 className="brand-title mt-2 text-3xl">
            {personLabel}의 놓치기 쉬운 신호
          </h1>
        </div>
        <p className="soft-copy text-sm text-brand-subtext">
          현재는 mock 상태입니다. 이후 응답 시간, 반복 미응답, 컨디션 변화,
          약 복용 미확인과 긴급 연락처 알림을 연결할 수 있어요.
        </p>
      </header>

      <section className="mt-6 space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <Card className="rounded-2xl border-brand-primary/20 bg-brand-mint/75">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary">
                <CheckCircle2 size={20} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-extrabold text-brand-hover">
                  현재 큰 이상 신호는 없어요
                </p>
                <p className="soft-copy mt-1 text-sm text-brand-subtext">
                  응답 없음이나 컨디션 나쁨을 표시하면 이 화면에서 바로 확인할
                  수 있습니다.
                </p>
              </div>
            </div>
          </Card>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-base font-extrabold text-brand-text">
          표시될 수 있는 상태 예시
        </h2>
        <div className="mt-3 grid gap-2">
          {mockExamples.map((alert) => (
            <AlertCard key={alert.id} alert={alert} compact />
          ))}
        </div>
      </section>

      <Link
        href="/checkin"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-primary px-5 text-sm font-bold text-white shadow-soft hover:bg-brand-hover"
      >
        오늘 안심 상태 다시 확인하기
      </Link>
    </main>
  );
}

function AlertCard({
  alert,
  compact = false,
}: {
  alert: AlertSignal;
  compact?: boolean;
}) {
  const danger = alert.tone === "danger";
  const warning = alert.tone === "warning";

  return (
    <Card
      className={`rounded-2xl ${
        danger
          ? "border-[#F6B6A9] bg-[#FFF1ED]"
          : warning
            ? "border-[#F3D489] bg-[#FFF9E6]"
            : "border-brand-primary/20 bg-white"
      } ${compact ? "p-3" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-white ${
            danger ? "text-brand-coral" : warning ? "text-[#8A6500]" : "text-brand-primary"
          }`}
        >
          {warning ? <Clock3 size={20} aria-hidden /> : <AlertTriangle size={20} aria-hidden />}
        </span>
        <div>
          <p className="text-sm font-extrabold text-brand-text">{alert.title}</p>
          <p className="soft-copy mt-1 text-sm text-brand-subtext">
            {alert.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
