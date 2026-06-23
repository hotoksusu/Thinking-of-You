import { notFound } from "next/navigation";
import { FamilyManagerShell } from "@/components/desktop-shells";
import { Card } from "@/components/ui";
import { consumerSchedules, familyHistory, managedParents } from "@/lib/mock-data";

export default async function FamilyMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parent = managedParents.find((item) => item.id === id);
  if (!parent) notFound();

  return (
    <FamilyManagerShell
      title={`${parent.nickname} 상세`}
      description="프로필, 최근 안부 이력, 약 복용과 병원 일정을 확인합니다."
      active="/family"
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-bold">프로필</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Info label="연령대" value={parent.ageRange} />
            <Info label="거주 지역" value={parent.region} />
            <Info label="관심사" value={parent.interests.join(", ")} />
            <Info label="챙길 점" value={parent.healthNotes} />
            <Info label="가족 메모" value={parent.memo ?? ""} />
          </dl>
        </Card>
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
      </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-stone-500">{label}</dt>
      <dd className="mt-1 font-semibold text-brand-ink">{value}</dd>
    </div>
  );
}
