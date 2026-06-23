import { AdminShell } from "@/components/desktop-shells";
import { AdminTable } from "@/components/admin-table";
import { Card, inputClassName } from "@/components/ui";
import { adminNotifications } from "@/lib/mock-data";

export default function AdminNotificationsPage() {
  return (
    <AdminShell title="알림 관리" description="발송 예정, 완료, 실패 알림을 유형별로 확인합니다." active="/admin/notifications">
      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input className={inputClassName} placeholder="알림 대상 검색" />
          <select className={inputClassName}>
            <option>전체 유형</option>
            <option>안부</option>
            <option>약</option>
            <option>병원</option>
            <option>검진</option>
            <option>안부 공유</option>
          </select>
        </div>
        <AdminTable
          headers={["알림 유형", "대상", "시간", "상태"]}
          rows={adminNotifications.map((item) => [item.type, item.target, item.time, item.status])}
        />
      </Card>
    </AdminShell>
  );
}
