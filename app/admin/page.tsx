import { AdminShell } from "@/components/desktop-shells";
import { Card } from "@/components/ui";
import { adminStats, adminNotifications } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <AdminShell
      title="운영자 대시보드"
      description="서비스 운영 지표와 오늘의 주요 알림 상태를 확인합니다."
      active="/admin"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {adminStats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs font-bold text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-xs font-bold text-brand-sage">{stat.delta}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <h2 className="text-lg font-bold">최근 알림 현황</h2>
        <AdminTable
          headers={["유형", "대상", "시간", "상태"]}
          rows={adminNotifications.map((item) => [item.type, item.target, item.time, item.status])}
        />
      </Card>
    </AdminShell>
  );
}

function AdminTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-line text-stone-500">
            {headers.map((header) => (
              <th key={header} className="py-3 font-bold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-b border-brand-line">
              {row.map((cell) => (
                <td key={cell} className="py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
