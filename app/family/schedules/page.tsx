import { FamilyManagerShell } from "@/components/desktop-shells";
import { Card } from "@/components/ui";
import { consumerSchedules, managedParents } from "@/lib/mock-data";
import { repeatLabel, scheduleTypeIcon } from "@/lib/schedule";

export default function FamilySchedulesPage() {
  return (
    <FamilyManagerShell
      title="일정/루틴 관리"
      description="부모님별 약 복용, 병원 예약, 정기 검진 일정을 확인합니다."
      active="/family/schedules"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {managedParents.flatMap((parent) =>
          consumerSchedules.map((schedule) => (
            <Card key={`${parent.id}-${schedule.id}`}>
              <p className="text-xs font-bold text-brand-sage">
                {parent.nickname} · {scheduleTypeIcon[schedule.type]} {schedule.type}
              </p>
              <h2 className="mt-2 font-bold">{schedule.title}</h2>
              <p className="mt-1 text-sm text-stone-600">
                {schedule.date}{schedule.time ? ` ${schedule.time}` : ""}
              </p>
              <p className="mt-2 text-sm text-stone-600">반복: {repeatLabel[schedule.repeat]}</p>
            </Card>
          )),
        )}
      </div>
    </FamilyManagerShell>
  );
}
