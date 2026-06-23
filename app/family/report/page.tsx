import { Share2 } from "lucide-react";
import { FamilyManagerShell } from "@/components/desktop-shells";
import { Button, Card } from "@/components/ui";
import { familyHistory } from "@/lib/mock-data";

export default function FamilyReportPage() {
  return (
    <FamilyManagerShell
      title="공유 리포트"
      description="주간 안부 요약과 놓친 알림, 최근 메모를 함께하는 사람에게 공유합니다."
      active="/family/report"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-brand-ink text-white lg:col-span-2">
          <h2 className="text-lg font-bold">이번 주 안부 요약</h2>
          <div className="mt-4 space-y-2 text-sm leading-6 text-white/85">
            <p>이번 주 엄마께 4번 안부를 챙겼어요.</p>
            <p>약 복용 확인은 5번 중 4번 완료했어요.</p>
            <p>놓친 알림은 1건이며, 금요일 무릎 통증 메모가 주의 항목입니다.</p>
          </div>
          <Button tone="secondary" className="mt-5">
            <Share2 size={18} aria-hidden />
            함께하는 사람에게 공유하기
          </Button>
        </Card>
        <Card>
          <h2 className="font-bold">완료율</h2>
          <p className="mt-4 text-5xl font-bold">82%</p>
          <p className="mt-2 text-sm text-stone-600">지난주보다 9% 좋아졌어요.</p>
        </Card>
      </div>
      <Card className="mt-5">
        <h2 className="text-lg font-bold">최근 메모</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {familyHistory.slice(0, 4).map((item) => (
            <div key={item.date} className="rounded-lg bg-brand-cream p-3 text-sm">
              <p className="font-bold">{item.date} · {item.status}</p>
              <p className="mt-1 text-stone-600">{item.memo}</p>
            </div>
          ))}
        </div>
      </Card>
    </FamilyManagerShell>
  );
}
