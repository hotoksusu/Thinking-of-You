import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { FamilyManagerShell } from "@/components/desktop-shells";
import { Card } from "@/components/ui";
import { familyHistory, familyMembers, managedParents } from "@/lib/mock-data";
import { getRelationshipLabel } from "@/lib/share-options";

export default function FamilyDashboardPage() {
  return (
    <FamilyManagerShell
      title="가족 대시보드"
      description="함께 챙기는 안부 상태와 미확인 항목을 확인합니다."
      active="/family"
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard icon={<Users size={22} />} label="안부 대상" value={`${managedParents.length}명`} />
        <MetricCard icon={<CheckCircle2 size={22} />} label="오늘 안부 상태" value="1명 완료" />
        <MetricCard icon={<Clock size={22} />} label="미확인 항목" value="3건" />
        <MetricCard icon={<AlertTriangle size={22} />} label="주의 신호" value="1건" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <h2 className="text-lg font-bold">안부 대상 목록</h2>
          <div className="mt-4 grid gap-3">
            {managedParents.map((parent) => (
              <Link
                key={parent.id}
                href={`/family/member/${parent.id}`}
                className="rounded-xl border border-brand-line bg-brand-cream/60 p-4 transition hover:border-brand-sage"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{parent.nickname}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {parent.region} · {parent.contactFrequency} · {parent.healthNotes}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-mint px-3 py-1 text-xs font-bold">
                    안부 확인
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">함께하는 사람별 확인 여부</h2>
          <div className="mt-4 space-y-3">
            {familyMembers.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg bg-brand-cream px-3 py-3">
                <div>
                  <p className="text-sm font-bold">{member.name}</p>
                  <p className="text-xs text-stone-500">{getRelationshipLabel(member.relationship)}</p>
                </div>
                <span className="text-sm font-bold text-brand-sage">
                  {index === 2 ? "대기" : "확인"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="text-lg font-bold">최근 7일 안부 흐름</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {familyHistory.map((day) => (
            <div key={day.date} className="rounded-lg bg-brand-cream p-3">
              <p className="text-xs font-bold text-stone-500">{day.date}</p>
              <p className="mt-2 font-bold">{day.status}</p>
              <p className="mt-1 text-xs text-stone-600">{day.memo}</p>
            </div>
          ))}
        </div>
      </Card>
    </FamilyManagerShell>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <div className="text-brand-sage">{icon}</div>
      <p className="mt-3 text-xs font-bold text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </Card>
  );
}
