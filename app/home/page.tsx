"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  Brain,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  MessageCircle,
  Phone,
  Pill,
  Send,
  Share2,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { ConsumerShell } from "@/components/consumer-shell";
import { Button, Card, inputClassName } from "@/components/ui";
import { ProgressBar } from "@/components/progress-bar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  consumerSchedules,
  defaultConsumerSettings,
  defaultRoutineState,
  type ConsumerSettings,
  type RoutineState,
} from "@/lib/mock-data";
import {
  calculatePeaceScore,
  calculateSafetyStatus,
  detectPatternChanges,
  generateAiInsight,
  generateAiReport,
  getCareRequestStatusLabel,
  getProfileRequest,
  getProfileResponses,
  getResponseMethodLabel,
  sendKakaoRequest,
  sendSmsRequest,
  startPhoneCheck,
} from "@/lib/safety";
import { storageKeys } from "@/lib/storage-keys";
import type {
  AiInsight,
  AiReport,
  CareRequest,
  CareRequestStatus,
  PatternChange,
  PeaceScore,
  SafetyStatus,
} from "@/types/care";

export default function ConsumerHomePage() {
  const [settings] = useLocalStorage<ConsumerSettings>(
    storageKeys.consumerSettings,
    defaultConsumerSettings,
  );
  const [routine, setRoutine] = useLocalStorage<RoutineState>(
    storageKeys.consumerRoutine,
    defaultRoutineState,
  );
  const [schedules] = useLocalStorage(storageKeys.consumerSchedules, consumerSchedules);
  const [request, setRequest] = useState<CareRequest | undefined>(() => getProfileRequest("mom"));

  const responses = useMemo(() => getProfileResponses("mom"), []);
  const peaceScore = useMemo(() => calculatePeaceScore(responses), [responses]);
  const aiReport = useMemo(() => generateAiReport(), []);
  const patternChanges = useMemo(() => detectPatternChanges(), []);
  const aiInsight = useMemo(() => generateAiInsight(), []);
  const safety = useMemo(() => calculateSafetyStatus(responses, request), [responses, request]);
  const requestSteps: CareRequestStatus[] = ["ready", "sent", "waiting", "completed"];
  const currentRequestStatus = request?.status ?? "ready";

  return (
    <ConsumerShell
      title="오늘의 안심 홈"
      subtitle={`${settings.name}님이 괜찮은지 하루 1분 안에 확인해요.`}
      active="home"
    >
      <div className="space-y-5">
        <PeaceScoreCard score={peaceScore} />
        <AiReportCard report={aiReport} />
        <PatternChangesCard changes={patternChanges} />
        <AiInsightCard insight={aiInsight} />
        <SafetyStatusCard safety={safety} />

        <Card className="border-[#BFDBFE] bg-[#EFF6FF]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#1D4ED8]">안부 요청</p>
              <h2 className="mt-1 text-lg font-bold">요청 보내고 응답을 기다려요</h2>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {getResponseMethodLabel(settings.responseMethod ?? "sms")} 방식으로 부모님께
                앱 설치 없이 안부를 확인할 수 있어요.
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#2563EB]">
              {getCareRequestStatusLabel(currentRequestStatus)}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {requestSteps.map((step) => (
              <div
                key={step}
                className={`rounded-xl border px-2 py-2 text-center text-[11px] font-bold ${
                  step === currentRequestStatus
                    ? "border-[#2563EB] bg-white text-[#2563EB] shadow-sm"
                    : "border-[#BFDBFE] bg-white/55 text-stone-500"
                }`}
              >
                {getCareRequestStatusLabel(step)}
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full bg-[#2563EB] hover:bg-[#1D4ED8]" onClick={sendMockRequest}>
            <Send size={17} aria-hidden />
            안부 요청 보내기
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <Pill size={22} className="text-[#2563EB]" aria-hidden />
            <p className="mt-3 text-sm font-bold">약 복용</p>
            <p className="mt-1 text-xl font-bold">{responses[0]?.medicine ?? "대기"}</p>
          </Card>
          <Card>
            <HeartPulse size={22} className="text-[#2563EB]" aria-hidden />
            <p className="mt-3 text-sm font-bold">컨디션</p>
            <p className="mt-1 text-xl font-bold">{responses[0]?.condition ?? "확인 전"}</p>
          </Card>
        </div>

        <Card>
          <h2 className="font-bold">오늘 확인 항목</h2>
          <div className="mt-3 grid gap-2">
            <CheckItem icon={<CheckCircle2 size={18} />} label="식사" value={responses[0]?.meal ?? "모르겠어요"} />
            <CheckItem icon={<Pill size={18} />} label="약 복용" value={responses[0]?.medicine ?? "모르겠어요"} />
            <CheckItem icon={<HeartPulse size={18} />} label="컨디션" value={responses[0]?.condition ?? "보통이에요"} />
            <CheckItem icon={<Phone size={18} />} label="연락 여부" value={responses[0]?.contact ?? "연락 안됨"} />
            <CheckItem icon={<Activity size={18} />} label="활동 여부" value={responses[0]?.activity ?? "모르겠어요"} />
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <CalendarDays size={24} className="text-[#2563EB]" aria-hidden />
            <div>
              <h2 className="font-bold">가까운 병원/검진 일정</h2>
              <p className="mt-1 text-sm text-stone-600">{schedules[0]?.title} · {schedules[0]?.date}</p>
            </div>
          </div>
        </Card>

        <Button
          className="w-full"
          onClick={() => {
            setRequest((current) =>
              current ? { ...current, status: "completed" } : sendSmsRequest("mom"),
            );
            setRoutine((current) => ({ ...current, completedToday: true }));
          }}
        >
          오늘 안심 상태 확인 완료
        </Button>

        <Card>
          <label className="text-sm font-bold text-brand-ink" htmlFor="shareMemo">
            함께하는 사람에게 공유할 짧은 안부 메모
          </label>
          <textarea
            id="shareMemo"
            className={`${inputClassName} mt-2 min-h-24 py-3`}
            value={routine.shareMemo}
            onChange={(event) => setRoutine((current) => ({ ...current, shareMemo: event.target.value }))}
          />
          <Link
            href="/family-invite"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-brand-line bg-white text-sm font-bold"
          >
            <Share2 size={17} aria-hidden />
            함께하는 사람 설정
          </Link>
        </Card>
      </div>
    </ConsumerShell>
  );

  function sendMockRequest() {
    const method = settings.responseMethod ?? "sms";
    if (method === "kakao") setRequest(sendKakaoRequest("mom"));
    if (method === "sms") setRequest({ ...sendSmsRequest("mom"), status: "waiting" });
    if (method === "phone") setRequest(startPhoneCheck("mom"));
  }
}

function PeaceScoreCard({ score }: { score: PeaceScore }) {
  const tone = {
    good: {
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-700",
      card: "border-[#BFDBFE] bg-white",
    },
    caution: {
      dot: "bg-amber-400",
      badge: "bg-amber-50 text-amber-800",
      card: "border-amber-200 bg-amber-50",
    },
    needs_check: {
      dot: "bg-rose-500",
      badge: "bg-rose-50 text-rose-700",
      card: "border-rose-200 bg-rose-50",
    },
  }[score.level];

  return (
    <Card className={`${tone.card} border shadow-[0_18px_42px_rgba(37,99,235,0.10)]`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#2563EB]">오늘의 안심 점수</p>
          <p className="mt-2 text-5xl font-black leading-none text-brand-ink">
            {score.score}점
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${tone.badge}`}>
          <span className={`size-2 rounded-full ${tone.dot}`} />
          {score.label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600">{score.summary}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500">
          <span>최근 7일 응답률</span>
          <span>{score.responseRate}%</span>
        </div>
        <ProgressBar value={score.responseRate} />
      </div>
      <div className="mt-4 grid gap-2">
        {score.factors.map((factor) => (
          <p key={factor} className="flex items-center gap-2 rounded-xl bg-[#EFF6FF] px-3 py-2 text-sm font-bold text-[#1D4ED8]">
            <CheckCircle2 size={16} aria-hidden />
            {factor}
          </p>
        ))}
      </div>
    </Card>
  );
}

function AiReportCard({ report }: { report: AiReport }) {
  return (
    <Card className="border-[#BFDBFE] bg-[#EFF6FF]">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
          <Brain size={20} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold text-[#1D4ED8]">AI 안심 리포트</p>
          <h2 className="mt-1 text-lg font-bold">{report.period}</h2>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {report.highlights.map((item) => (
          <p key={item} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-stone-700">
            {item}
          </p>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-white px-4 py-3">
        <p className="text-xs font-black text-[#2563EB]">AI 의견</p>
        <p className="mt-1 text-sm font-bold leading-6 text-brand-ink">{report.opinion}</p>
        <p className="mt-1 text-sm leading-6 text-stone-600">{report.recommendation}</p>
      </div>
    </Card>
  );
}

function PatternChangesCard({ changes }: { changes: PatternChange[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <TrendingDown size={20} className="text-[#2563EB]" aria-hidden />
        <h2 className="font-bold">최근 변화 감지</h2>
      </div>
      <div className="mt-3 grid gap-2">
        {changes.map((change) => (
          <div key={change.label} className="rounded-xl bg-brand-cream px-3 py-2.5">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>{change.label}</span>
              <span className="text-[#2563EB]">
                {change.before} → {change.after}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-stone-500">{change.analysis}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-[#EFF6FF] px-3 py-2 text-sm font-bold leading-6 text-[#1D4ED8]">
        AI 분석: 최근 생활 패턴 변화가 감지되었습니다.
      </p>
    </Card>
  );
}

function AiInsightCard({ insight }: { insight: AiInsight }) {
  return (
    <Card className="border-[#DDD6FE] bg-[#F5F3FF]">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-[#2563EB]" aria-hidden />
        <h2 className="font-bold">AI 인사이트</h2>
      </div>
      <p className="mt-2 text-sm font-bold text-stone-500">{insight.period}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {insight.signals.map((signal) => (
          <span key={signal} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1D4ED8]">
            {signal}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-brand-ink">{insight.opinion}</p>
      <p className="mt-1 text-sm leading-6 text-stone-600">{insight.recommendation}</p>
    </Card>
  );
}

function SafetyStatusCard({ safety }: { safety: SafetyStatus }) {
  const tone = {
    safe: {
      dot: "bg-emerald-500",
      card: "bg-[#EFF6FF] border-[#BFDBFE]",
      text: "text-[#1D4ED8]",
    },
    caution: {
      dot: "bg-amber-400",
      card: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
    },
    needs_check: {
      dot: "bg-rose-500",
      card: "bg-rose-50 border-rose-200",
      text: "text-rose-700",
    },
  }[safety.level];

  return (
    <Card className={`${tone.card} border`}>
      <p className="text-sm font-bold text-stone-600">안심 상태</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className={`flex items-center gap-2 text-2xl font-bold ${tone.text}`}>
            <span className={`size-3 rounded-full ${tone.dot}`} />
            {safety.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{safety.summary}</p>
        </div>
        <MessageCircle size={34} className={tone.text} aria-hidden />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500">
          <span>최근 7일 중</span>
          <span>{safety.responseDays}일 응답 완료</span>
        </div>
        <ProgressBar value={Math.round((safety.responseDays / safety.totalDays) * 100)} />
      </div>
    </Card>
  );
}

function CheckItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm font-bold text-brand-ink">
        <span className="text-[#2563EB]">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-bold text-stone-600">{value}</span>
    </div>
  );
}
