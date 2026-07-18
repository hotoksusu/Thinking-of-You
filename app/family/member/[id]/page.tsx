import { notFound } from "next/navigation";
import { Activity, Bell, Phone, ShieldCheck } from "lucide-react";
import { FamilyManagerShell } from "@/components/desktop-shells";
import { Card } from "@/components/ui";
import { consumerSchedules, familyHistory, managedParents } from "@/lib/mock-data";
import {
  calculateSafetyStatus,
  getCareRequestStatusLabel,
  getProfileRequest,
  getProfileResponses,
  getProfileScheduler,
  getResponseMethodLabel,
  getResponsePattern,
} from "@/lib/safety";

export function generateStaticParams() {
  return managedParents.map((parent) => ({ id: parent.id }));
}

export default async function FamilyMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parent = managedParents.find((item) => item.id === id);
  if (!parent) notFound();
  const responses = getProfileResponses(parent.id);
  const request = getProfileRequest(parent.id);
  const safety = calculateSafetyStatus(responses, request);
  const pattern = getResponsePattern(responses);
  const scheduler = getProfileScheduler(parent.id);

  return (
    <FamilyManagerShell
      title={`${parent.nickname} 상세`}
      description="안심 상태, 최근 응답 패턴, 이상 신호와 긴급 연락처를 확인합니다."
      active="/family"
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-bold">프로필</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Info label="관계" value={parent.relationship ?? "-"} />
            <Info label="연락처" value={parent.phone ?? "-"} />
            <Info label="응답 방식" value={getResponseMethodLabel(parent.responseMethod ?? "sms")} />
            <Info label="연령대" value={parent.ageRange} />
            <Info label="거주 지역" value={parent.region} />
            <Info label="관심사" value={parent.interests.join(", ")} />
            <Info label="챙길 점" value={parent.healthNotes} />
            <Info label="가족 메모" value={parent.memo ?? ""} />
          </dl>
        </Card>
        <Card className="border-[#BFDBFE] bg-[#EFF6FF]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#1D4ED8]">안심 상태</p>
              <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold">
                <span className={`size-3 rounded-full ${getSafetyDotClass(safety.level)}`} />
                {safety.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{safety.summary}</p>
            </div>
            <ShieldCheck size={38} className="text-[#2563EB]" aria-hidden />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <MiniStat label="최근 7일 응답률" value={`${pattern.responseRate}%`} />
            <MiniStat label="식사 확인" value={pattern.mealConfirmed} />
            <MiniStat label="약 복용" value={pattern.medicineConfirmed} />
          </div>
          <div className="mt-4 rounded-xl bg-white p-3">
            <p className="text-xs font-bold text-stone-500">현재 요청 상태</p>
            <p className="mt-1 font-bold">{getCareRequestStatusLabel(request?.status ?? "ready")}</p>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-bold">최근 7일 안부 이력</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {familyHistory.map((item) => (
              <div key={item.date} className="rounded-lg bg-brand-cream p-3">
                <p className="text-sm font-bold">{item.date} · {item.status}</p>
                <p className="mt-1 text-xs text-stone-600">약 복용: {item.medicine}</p>
                <p className="mt-1 text-xs text-stone-600">{item.memo}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">응답 패턴</h2>
          <div className="mt-4 grid gap-3">
            <PatternRow label="최근 7일 응답률" value={`${pattern.responseRate}%`} />
            <PatternRow label="식사 확인" value={pattern.mealConfirmed} />
            <PatternRow label="약 복용" value={pattern.medicineConfirmed} />
            <PatternRow label="컨디션 좋음" value={`${pattern.goodConditionDays}일`} />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Bell size={20} className="text-[#2563EB]" aria-hidden />
            이상 신호
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(safety.signals.length ? safety.signals : ["오늘 응답 완료"]).map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1D4ED8]"
              >
                {signal}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            3일 연속 미응답처럼 확인이 필요한 상태가 지속되면 긴급 연락처 알림으로
            확장할 수 있도록 데이터를 저장합니다.
          </p>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Phone size={20} className="text-[#2563EB]" aria-hidden />
            긴급 연락처
          </h2>
          {parent.emergencyContact ? (
            <dl className="mt-4 space-y-3 text-sm">
              <Info label="이름" value={parent.emergencyContact.name} />
              <Info label="관계" value={parent.emergencyContact.relationship} />
              <Info label="연락처" value={parent.emergencyContact.contact} />
            </dl>
          ) : (
            <p className="mt-4 text-sm text-stone-600">등록된 긴급 연락처가 없습니다.</p>
          )}
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Activity size={20} className="text-[#2563EB]" aria-hidden />
          자동 안부 요청 구조
        </h2>
        {scheduler ? (
          <div className="mt-4">
            <p className="text-sm font-bold">
              매일 {scheduler.time} · 다음 실행 {scheduler.nextRunLabel}
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-4">
              {scheduler.flow.map((step, index) => (
                <div key={step} className="rounded-xl border border-brand-line bg-brand-cream p-3">
                  <p className="text-xs font-bold text-stone-500">STEP {index + 1}</p>
                  <p className="mt-1 text-sm font-bold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-stone-600">자동 요청 규칙이 없습니다.</p>
        )}
      </Card>

      <Card className="mt-5">
        <h2 className="text-lg font-bold">병원/건강검진 일정</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {consumerSchedules.map((schedule) => (
            <div key={schedule.id} className="rounded-lg border border-brand-line bg-white p-3">
              <p className="text-xs font-bold text-brand-sage">{schedule.type}</p>
              <p className="mt-2 font-bold">{schedule.title}</p>
              <p className="mt-1 text-sm text-stone-600">{schedule.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </FamilyManagerShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-bold text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#1D4ED8]">{value}</p>
    </div>
  );
}

function PatternRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-3">
      <span className="text-sm font-bold text-stone-600">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function getSafetyDotClass(level: "safe" | "caution" | "needs_check") {
  if (level === "safe") return "bg-emerald-500";
  if (level === "caution") return "bg-amber-400";
  return "bg-rose-500";
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-stone-500">{label}</dt>
      <dd className="mt-1 font-semibold text-brand-ink">{value}</dd>
    </div>
  );
}
