"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { ConsumerShell } from "@/components/consumer-shell";
import { Button, Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTodayISO } from "@/lib/dates";
import { createId } from "@/lib/id";
import { consumerSchedules } from "@/lib/mock-data";
import {
  repeatLabel,
  scheduleTypeIcon,
  scheduleTypeLabel,
  scheduleTypeTone,
} from "@/lib/schedule";
import { storageKeys } from "@/lib/storage-keys";
import type { CareSchedule, CareScheduleType, ScheduleRepeat } from "@/types/care";

type ScheduleTab = "today" | "week" | "month" | "repeat";

const tabs: Array<{ key: ScheduleTab; label: string }> = [
  { key: "today", label: "오늘" },
  { key: "week", label: "이번 주" },
  { key: "month", label: "이번 달" },
  { key: "repeat", label: "반복" },
];

const scheduleTypes: CareScheduleType[] = [
  "안부",
  "병원",
  "약",
  "건강검진",
  "생신",
  "가족모임",
  "기타",
];

const repeatOptions: ScheduleRepeat[] = ["none", "daily", "weekly", "monthly", "yearly"];

export default function ConsumerSchedulePage() {
  const formRef = useRef<HTMLInputElement>(null);
  const today = getTodayISO();
  const [activeTab, setActiveTab] = useState<ScheduleTab>("today");
  const [schedules, setSchedules] = useLocalStorage<CareSchedule[]>(
    storageKeys.consumerSchedules,
    consumerSchedules,
  );
  const [form, setForm] = useState({
    title: "",
    type: "안부" as CareScheduleType,
    date: today,
    time: "",
    repeat: "none" as ScheduleRepeat,
    memo: "",
  });

  const normalizedSchedules = useMemo(
    () =>
      schedules
        .map(normalizeSchedule)
        .sort((a, b) => `${a.date}${a.time ?? ""}`.localeCompare(`${b.date}${b.time ?? ""}`)),
    [schedules],
  );

  const todaySchedules = normalizedSchedules.filter((item) => occursToday(item, today));
  const weekGroups = groupWeekSchedules(normalizedSchedules, today);
  const monthSchedules = normalizedSchedules.filter((item) => occursThisMonth(item, today));
  const repeatGroups = groupRepeatSchedules(normalizedSchedules);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim()) return;

    setSchedules((current) => [
      ...current.map(normalizeSchedule),
      {
        id: createId("consumer-schedule"),
        profileId: "consumer",
        title: form.title.trim(),
        type: form.type,
        date: form.date,
        time: form.time || undefined,
        repeat: form.repeat,
        memo: form.memo.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({
      title: "",
      type: "안부",
      date: today,
      time: "",
      repeat: "none",
      memo: "",
    });
    setActiveTab(form.repeat === "none" ? "today" : "repeat");
  }

  function markDone(id: string) {
    setSchedules((current) =>
      current.map((item) =>
        item.id === id ? { ...normalizeSchedule(item), status: "done" } : normalizeSchedule(item),
      ),
    );
  }

  function focusForm() {
    formRef.current?.focus();
  }

  return (
    <ConsumerShell
      title="일정"
      subtitle="안부·건강·병원·약 일정을 카드로 쉽게 확인해요."
      active="schedule"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-2 rounded-full bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`min-h-11 rounded-full text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-brand-mint text-brand-ink"
                  : "text-stone-500 hover:bg-brand-cream"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "today" ? (
          <ScheduleSection
            title="오늘 챙길 일정"
            description="오늘 확인하면 좋은 안부·건강 일정을 모았어요."
          >
            {todaySchedules.length ? (
              <div className="space-y-3">
                {todaySchedules.map((item) => (
                  <ScheduleItemCard key={item.id} item={item} onDone={() => markDone(item.id)} />
                ))}
              </div>
            ) : (
              <ScheduleEmptyState
                title="오늘 예정된 일정은 없어요."
                description="가볍게 안부만 확인해도 좋아요."
                actionLabel="일정 추가하기"
                onAction={focusForm}
              />
            )}
          </ScheduleSection>
        ) : null}

        {activeTab === "week" ? (
          <ScheduleSection
            title="이번 주 일정"
            description="이번 주에 챙길 병원·약·검진·안부 일정을 확인해보세요."
          >
            {weekGroups.length ? (
              <div className="space-y-4">
                <SummaryCard>{formatTypeSummary(flattenWeekGroups(weekGroups), "이번 주에는")}</SummaryCard>
                {weekGroups.map((group) => (
                  <Card key={group.label}>
                    <h3 className="text-lg font-bold">{group.label}</h3>
                    <div className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <MiniScheduleRow key={item.id} item={item} />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <ScheduleEmptyState
                title="이번 주에 등록된 일정이 없어요."
                description="병원, 약, 안부 루틴을 추가해보세요."
                actionLabel="일정 추가하기"
                onAction={focusForm}
              />
            )}
          </ScheduleSection>
        ) : null}

        {activeTab === "month" ? (
          <ScheduleSection
            title="이번 달 안부·건강 일정"
            description="이번 달에 놓치지 말아야 할 일정을 한눈에 확인해요."
          >
            {monthSchedules.length ? (
              <div className="space-y-4">
                <MonthlySummary schedules={monthSchedules} />
                <div className="space-y-3">
                  {monthSchedules.map((item) => (
                    <Card key={item.id}>
                      <p className="text-sm font-bold text-brand-sage">{formatMonthDay(item.date)}</p>
                      <MiniScheduleRow item={item} />
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <ScheduleEmptyState
                title="이번 달 일정이 아직 없어요."
                description="건강검진, 생신, 약 처방일처럼 놓치기 쉬운 일정을 등록해보세요."
                actionLabel="일정 추가하기"
                onAction={focusForm}
              />
            )}
          </ScheduleSection>
        ) : null}

        {activeTab === "repeat" ? (
          <ScheduleSection
            title="반복되는 루틴"
            description="주기적으로 챙길 일을 한곳에서 확인해요."
          >
            {repeatGroups.length ? (
              <div className="space-y-4">
                {repeatGroups.map((group) => (
                  <Card key={group.repeat}>
                    <h3 className="text-lg font-bold">{repeatLabel[group.repeat]}</h3>
                    <div className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <MiniScheduleRow key={item.id} item={item} />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <ScheduleEmptyState
                title="반복 루틴이 아직 없어요."
                description="자주 챙기는 일을 등록해두면 매번 기억하지 않아도 돼요."
                actionLabel="반복 루틴 추가하기"
                onAction={focusForm}
              />
            )}
          </ScheduleSection>
        ) : null}

        <form onSubmit={submit}>
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">일정 추가하기</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  안부, 병원, 약, 검진처럼 놓치기 쉬운 일을 등록해요.
                </p>
              </div>
              <Plus size={24} className="text-brand-sage" aria-hidden />
            </div>

            <div className="grid gap-2">
              <FieldLabel>일정 제목</FieldLabel>
              <input
                ref={formRef}
                className={inputClassName}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="예: 정형외과 진료"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <FieldLabel>유형</FieldLabel>
                <select
                  className={inputClassName}
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as CareScheduleType,
                    }))
                  }
                >
                  {scheduleTypes.map((type) => (
                    <option key={type} value={type}>
                      {scheduleTypeIcon[type]} {scheduleTypeLabel[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <FieldLabel>날짜</FieldLabel>
                <input
                  className={inputClassName}
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <FieldLabel>시간 선택 사항</FieldLabel>
                <input
                  className={inputClassName}
                  type="time"
                  value={form.time}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, time: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>반복 주기</FieldLabel>
                <select
                  className={inputClassName}
                  value={form.repeat}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      repeat: event.target.value as ScheduleRepeat,
                    }))
                  }
                >
                  {repeatOptions.map((repeat) => (
                    <option key={repeat} value={repeat}>
                      {repeatLabel[repeat]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              className={`${inputClassName} min-h-20 py-3`}
              value={form.memo}
              onChange={(event) =>
                setForm((current) => ({ ...current, memo: event.target.value }))
              }
              placeholder="메모"
            />

            <Button className="w-full">
              <Plus size={18} aria-hidden />
              일정 추가하기
            </Button>
          </Card>
        </form>
      </div>
    </ConsumerShell>
  );
}

function normalizeSchedule(item: CareSchedule): CareSchedule {
  return {
    ...item,
    repeat: item.repeat ?? "none",
    status: item.status ?? "pending",
  };
}

function ScheduleSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="soft-copy mt-1 text-sm text-stone-600">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ScheduleItemCard({ item, onDone }: { item: CareSchedule; onDone: () => void }) {
  const done = item.status === "done";

  return (
    <Card className={done ? "bg-brand-mint/80" : "bg-white"}>
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-cream text-2xl">
          {scheduleTypeIcon[item.type]}
        </span>
        <div className="min-w-0 flex-1">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${scheduleTypeTone[item.type]}`}>
            {scheduleTypeLabel[item.type]}
          </span>
          <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
          <p className="mt-1 text-sm font-semibold text-stone-600">
            {formatScheduleTime(item)}
          </p>
          {item.memo ? <p className="mt-2 line-clamp-1 text-sm text-stone-600">{item.memo}</p> : null}
        </div>
      </div>
      <Button
        tone={done ? "primary" : "secondary"}
        className="mt-4 w-full"
        onClick={onDone}
      >
        <CheckCircle2 size={18} aria-hidden />
        {done ? "확인 완료" : "확인했어요"}
      </Button>
    </Card>
  );
}

function MiniScheduleRow({ item }: { item: CareSchedule }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-brand-cream/70 p-3">
      <span className="text-2xl">{scheduleTypeIcon[item.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="font-bold">{item.title}</p>
        <p className="mt-1 text-sm text-stone-600">
          {formatScheduleTime(item)} · {repeatLabel[item.repeat ?? "none"]}
        </p>
        {item.memo ? <p className="mt-1 line-clamp-1 text-sm text-stone-500">{item.memo}</p> : null}
      </div>
    </div>
  );
}

function SummaryCard({ children }: { children: ReactNode }) {
  return (
    <Card className="bg-brand-ink text-white">
      <p className="text-base font-bold leading-7">{children}</p>
    </Card>
  );
}

function MonthlySummary({ schedules }: { schedules: CareSchedule[] }) {
  const hospital = schedules.filter((item) => item.type === "병원").length;
  const medicine = schedules.filter((item) => item.type === "약").length;
  const checkup = schedules.filter((item) => item.type === "건강검진").length;
  const birthday = schedules.filter((item) => item.type === "생신").length;

  return (
    <Card className="bg-brand-mint/80">
      <div className="grid grid-cols-2 gap-3 text-sm font-bold">
        <SummaryMetric icon="🏥" label="병원 일정" value={`${hospital}건`} />
        <SummaryMetric icon="💊" label="약 관련 일정" value={`${medicine}건`} />
        <SummaryMetric icon="🩺" label="검진" value={`${checkup}건`} />
        <SummaryMetric icon="🎂" label="생신/기념일" value={`${birthday}건`} />
      </div>
    </Card>
  );
}

function SummaryMetric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/75 p-3">
      <p className="text-xl">{icon}</p>
      <p className="mt-1 text-stone-600">{label}</p>
      <p className="mt-1 text-xl text-brand-ink">{value}</p>
    </div>
  );
}

function ScheduleEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Card className="bg-white/80 text-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="soft-copy mt-2 text-sm text-stone-600">{description}</p>
      <Button tone="secondary" className="mt-4 w-full" onClick={onAction}>
        {actionLabel}
      </Button>
    </Card>
  );
}

function occursToday(item: CareSchedule, today: string) {
  if (item.date === today) return true;
  if (item.repeat === "daily") return true;

  const itemDate = parseISODate(item.date);
  const todayDate = parseISODate(today);

  if (item.repeat === "weekly") return itemDate.getDay() === todayDate.getDay();
  if (item.repeat === "monthly") return itemDate.getDate() === todayDate.getDate();
  if (item.repeat === "yearly") {
    return itemDate.getMonth() === todayDate.getMonth() && itemDate.getDate() === todayDate.getDate();
  }

  return false;
}

function occursThisMonth(item: CareSchedule, today: string) {
  const itemDate = parseISODate(item.date);
  const todayDate = parseISODate(today);
  if (itemDate.getFullYear() === todayDate.getFullYear() && itemDate.getMonth() === todayDate.getMonth()) {
    return true;
  }
  return item.repeat === "monthly" || item.repeat === "yearly";
}

function groupWeekSchedules(schedules: CareSchedule[], today: string) {
  const start = getWeekStart(parseISODate(today));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const grouped = new Map<string, CareSchedule[]>();

  schedules.forEach((item) => {
    const occurrence = getWeekOccurrenceDate(item, start, end);
    if (!occurrence) return;
    const label = formatWeekday(occurrence);
    grouped.set(label, [...(grouped.get(label) ?? []), item]);
  });

  return Array.from(grouped.entries()).map(([label, items]) => ({ label, items }));
}

function groupRepeatSchedules(schedules: CareSchedule[]) {
  return repeatOptions
    .filter((repeat) => repeat !== "none")
    .map((repeat) => ({
      repeat,
      items: schedules.filter((item) => item.repeat === repeat),
    }))
    .filter((group) => group.items.length > 0);
}

function flattenWeekGroups(groups: Array<{ label: string; items: CareSchedule[] }>) {
  return groups.flatMap((group) => group.items);
}

function getWeekOccurrenceDate(item: CareSchedule, start: Date, end: Date) {
  const itemDate = parseISODate(item.date);

  if (item.repeat === "daily") return new Date(start);

  if (item.repeat === "weekly") {
    const date = new Date(start);
    date.setDate(start.getDate() + ((itemDate.getDay() + 6) % 7));
    return date;
  }

  if (itemDate >= start && itemDate <= end) return itemDate;
  return null;
}

function formatTypeSummary(schedules: CareSchedule[], prefix: string) {
  const counts = scheduleTypes
    .map((type) => ({
      type,
      count: schedules.filter((item) => item.type === type).length,
    }))
    .filter((item) => item.count > 0);

  if (!counts.length) return `${prefix} 등록된 일정이 없어요.`;
  return `${prefix} ${counts.map((item) => `${scheduleTypeLabel[item.type]} ${item.count}건`).join(", ")}이 있어요.`;
}

function formatScheduleTime(item: CareSchedule) {
  if (item.time) return `${formatMonthDay(item.date)} ${item.time}`;
  return formatMonthDay(item.date);
}

function formatMonthDay(isoDate: string) {
  const date = parseISODate(isoDate);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", { weekday: "long" }).format(date);
}

function getWeekStart(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function parseISODate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`);
}
