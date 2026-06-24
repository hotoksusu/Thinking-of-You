"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const registrationKey = "oneul-anbu-parent-registered";

const evidence = [
  {
    label: "응답 상태",
    value: "오전 8:42 안부 응답",
    detail: "평소 응답 시간과 비슷합니다.",
    tone: "bg-emerald-500",
  },
  {
    label: "식사 상태",
    value: "아침 식사 확인",
    detail: "오늘 식사 흐름이 안정적입니다.",
    tone: "bg-emerald-500",
  },
  {
    label: "약 복용 상태",
    value: "혈압약 복용 완료",
    detail: "복용 확인이 정상 범위입니다.",
    tone: "bg-emerald-500",
  },
  {
    label: "활동 상태",
    value: "평소 수준의 외출 감지",
    detail: "급격한 활동 감소는 없습니다.",
    tone: "bg-sky-500",
  },
];

const family = [
  { name: "민지", role: "딸", status: "확인함" },
  { name: "현우", role: "아들", status: "알림 수신" },
  { name: "이모", role: "보호자", status: "대기 중" },
];

export function UserMode({ initialRegistered }: { initialRegistered: boolean }) {
  const [registered, setRegistered] = useState(initialRegistered);

  useEffect(() => {
    if (initialRegistered) {
      window.localStorage.setItem(registrationKey, "true");
      return;
    }

    setRegistered(window.localStorage.getItem(registrationKey) === "true");
  }, [initialRegistered]);

  function registerParent() {
    window.localStorage.setItem(registrationKey, "true");
    setRegistered(true);
  }

  function resetParent() {
    window.localStorage.removeItem(registrationKey);
    setRegistered(false);
  }

  if (!registered) {
    return <RegisterParent onRegister={registerParent} />;
  }

  return <ReassuranceDashboard onReset={resetParent} />;
}

function RegisterParent({ onRegister }: { onRegister: () => void }) {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-8 text-[#16201b]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[560px] items-center">
        <div className="w-full rounded-lg border border-[#dfe5dc] bg-white p-8 shadow-[0_22px_60px_rgba(24,36,29,0.12)] sm:p-11">
          <p className="text-sm font-black text-[#1f8a5b]">오늘안부</p>
          <h1 className="mt-3 text-[2.45rem] font-black leading-tight tracking-normal sm:text-[3.35rem]">
            부모님이 괜찮은지 바로 확인하세요.
          </h1>
          <p className="mt-5 text-lg font-semibold leading-8 text-[#66736b]">
            등록 후 첫 화면은 현재 안심 상태만 먼저 보여줍니다.
          </p>
          <button
            type="button"
            onClick={onRegister}
            className="mt-8 flex min-h-16 w-full items-center justify-center rounded-lg bg-[#16201b] px-6 text-xl font-black text-white transition hover:bg-[#223028] focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            부모님 등록하기
          </button>
        </div>
      </section>
    </main>
  );
}

function ReassuranceDashboard({ onReset }: { onReset: () => void }) {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-5 text-[#16201b] sm:px-7 sm:py-8">
      <div className="mx-auto w-full max-w-[1060px]">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#1f8a5b]">오늘안부</p>
            <h1 className="mt-1 text-3xl font-black tracking-normal">엄마 안심 상태</h1>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#dfe5dc] bg-white px-4 text-sm font-black text-[#66736b]"
          >
            등록 전 보기
          </button>
        </header>

        <section className="grid gap-6 rounded-lg border border-[#dfe5dc] bg-white p-7 shadow-[0_22px_60px_rgba(24,36,29,0.12)] md:grid-cols-[1fr_220px] md:items-center md:p-9">
          <div>
            <span className="inline-flex min-h-9 items-center rounded-full bg-[#e5f5ee] px-4 text-base font-black text-[#1f8a5b]">
              안심
            </span>
            <h2 className="mt-5 text-[2.35rem] font-black leading-tight tracking-normal sm:text-[3.6rem]">
              엄마는 현재 안심 상태입니다.
            </h2>
            <p className="mt-4 text-xl font-black text-[#66736b]">최근 이상 신호 없음</p>
          </div>
          <div className="grid min-h-36 content-center rounded-lg bg-[#10231b] p-6 text-white md:min-h-44">
            <span className="text-sm font-black text-[#b9d5c8]">안심 점수</span>
            <strong className="mt-2 text-5xl font-black leading-none">92점</strong>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <SectionTitle label="판단 근거" title="오늘 상태를 이렇게 확인했어요." />
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {evidence.map((item) => (
              <article key={item.label} className="min-h-32 rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] p-5">
                <div className="flex items-start gap-3">
                  <span className={`mt-1 size-3 shrink-0 rounded-full ${item.tone}`} />
                  <div>
                    <h3 className="font-black">{item.label}</h3>
                    <p className="mt-2 text-sm font-bold text-[#66736b]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[#66736b]">{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <SectionTitle label="AI 안심 리포트" title="지금 필요한 말만 정리했어요." />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <ReportCard title="최근 변화">
              응답 시간과 활동량이 지난 7일 평균과 비슷합니다.
            </ReportCard>
            <ReportCard title="AI 해석">
              식사, 복약, 활동 흐름이 안정적이라 위험 신호는 낮습니다.
            </ReportCard>
            <ReportCard title="권장 행동">
              오늘은 가벼운 안부 메시지만 보내도 충분합니다.
            </ReportCard>
          </div>
        </section>

        <details className="mt-5 rounded-lg border border-[#dfe5dc] bg-white">
          <summary className="flex min-h-24 cursor-pointer list-none items-center justify-between gap-4 p-6 marker:hidden">
            <span>
              <span className="block text-sm font-black text-[#1f8a5b]">변화 감지</span>
              <strong className="mt-2 block text-2xl font-black">자세히 보기</strong>
            </span>
            <span className="text-sm font-black text-[#66736b]">기본 접힘</span>
          </summary>
          <div className="grid gap-3 px-6 pb-6">
            <p className="rounded-lg bg-[#f6f8f5] px-4 py-3 text-[#66736b]">
              최근 24시간 동안 급격한 활동 감소는 없습니다.
            </p>
            <p className="rounded-lg bg-[#f6f8f5] px-4 py-3 text-[#66736b]">
              복약 확인 시간이 평소보다 12분 늦었지만 정상 범위입니다.
            </p>
            <p className="rounded-lg bg-[#f6f8f5] px-4 py-3 text-[#66736b]">
              밤사이 긴 미응답 구간은 감지되지 않았습니다.
            </p>
          </div>
        </details>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <SectionTitle label="가족 네트워크" title="함께 확인하는 사람들" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {family.map((member) => (
              <article
                key={member.name}
                className="flex min-h-24 items-center justify-between gap-4 rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] p-5"
              >
                <div>
                  <strong className="block text-lg font-black">{member.name}</strong>
                  <span className="mt-1 block text-sm font-semibold text-[#66736b]">{member.role}</span>
                </div>
                <p className="shrink-0 font-black text-[#66736b]">{member.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-black text-[#1f8a5b]">{label}</p>
      <h2 className="mt-2 text-2xl font-black tracking-normal">{title}</h2>
    </div>
  );
}

function ReportCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="min-h-32 rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] p-5">
      <h3 className="font-black">{title}</h3>
      <p className="mt-3 leading-7 text-[#66736b]">{children}</p>
    </article>
  );
}
