import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { CalendarDays, Check, Clock, Copy, RotateCcw } from "lucide-react";
import { Card, Button } from "./ui";
import type { CareSchedule, CareTask } from "@/types/care";
import { formatKoreanDate } from "@/lib/dates";
import { repeatLabel, scheduleTypeLabel, scheduleTypeTone } from "@/lib/schedule";

export function ModeSelectCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-brand-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-brand-mint text-brand-ink">
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </Link>
  );
}

export function TaskCard({
  task,
  onStatus,
  onMemo,
}: {
  task: CareTask;
  onStatus: (status: CareTask["status"]) => void;
  onMemo: (memo: string) => void;
}) {
  const isDone = task.status === "done";
  const isLater = task.status === "later";

  return (
    <Card className={isDone ? "bg-brand-mint" : isLater ? "bg-stone-50" : ""}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-brand-sage">
          {task.type}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold">{task.title}</h3>
          <p className="mt-1 text-sm text-stone-600">
            {isDone ? "완료했어요" : isLater ? "나중에 다시 볼게요" : "오늘 챙길 항목이에요"}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          tone={isDone ? "primary" : "secondary"}
          className="min-h-11 px-3"
          onClick={() => onStatus("done")}
        >
          <Check size={17} aria-hidden />
          완료
        </Button>
        <Button
          tone={isLater ? "primary" : "secondary"}
          className="min-h-11 px-3"
          onClick={() => onStatus("later")}
        >
          <Clock size={17} aria-hidden />
          나중에
        </Button>
      </div>
      <textarea
        className="mt-3 min-h-20 w-full rounded-lg border border-brand-line bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-brand-sage focus:ring-4 focus:ring-brand-mint"
        value={task.memo ?? ""}
        onChange={(event) => onMemo(event.target.value)}
        placeholder="메모"
      />
    </Card>
  );
}

export function ScheduleCard({
  schedule,
  action,
}: {
  schedule: CareSchedule;
  action?: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${scheduleTypeTone[schedule.type]}`}
          >
            {scheduleTypeLabel[schedule.type]}
          </span>
          <h3 className="mt-3 font-bold">{schedule.title}</h3>
          <p className="mt-1 text-sm text-stone-600">
            {formatKoreanDate(schedule.date)} · {repeatLabel[schedule.repeat ?? "none"]}
          </p>
          {schedule.memo ? (
            <p className="mt-3 text-sm leading-6 text-stone-600">{schedule.memo}</p>
          ) : null}
        </div>
        {action ?? <CalendarDays size={24} className="text-brand-sage" aria-hidden />}
      </div>
    </Card>
  );
}

export function MessageSuggestionCard({
  message,
  onCopy,
  actions,
}: {
  message: string;
  onCopy: () => void;
  actions: ReactNode;
}) {
  return (
    <Card>
      <p className="text-base leading-7 text-stone-700">{message}</p>
      <Button tone="secondary" className="mt-4 w-full" onClick={onCopy}>
        <Copy size={18} aria-hidden />
        복사하기
      </Button>
      <div className="mt-3 grid grid-cols-3 gap-2">{actions}</div>
    </Card>
  );
}

export function ReportSummaryCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="bg-brand-ink text-white">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-6 text-white/82">{children}</div>
    </Card>
  );
}

export function SeniorBigButton({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: ReactNode;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-28 items-center gap-4 rounded-lg border border-brand-line bg-white p-5 text-2xl font-bold shadow-sm"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-apricot text-brand-ink">
        <Icon size={30} aria-hidden />
      </span>
      <span>{children}</span>
    </Link>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card className="bg-white/75">
      <p className="text-sm leading-6 text-stone-600">{children}</p>
    </Card>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <Button tone="secondary" className="min-h-10 px-3 text-xs" onClick={onClick}>
      <RotateCcw size={16} aria-hidden />
      다시 생성
    </Button>
  );
}
