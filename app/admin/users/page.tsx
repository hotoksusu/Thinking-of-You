import { AdminShell } from "@/components/desktop-shells";
import { AdminTable } from "@/components/admin-table";
import { Card, inputClassName } from "@/components/ui";
import { adminUsers } from "@/lib/mock-data";

export default function AdminUsersPage() {
  return (
    <AdminShell title="사용자 관리" description="사용자 유형, 가입일, 최근 활동과 상태를 확인합니다." active="/admin/users">
      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input className={inputClassName} placeholder="이름 또는 유형 검색" />
          <select className={inputClassName}>
            <option>전체 상태</option>
            <option>활성</option>
            <option>확인 필요</option>
            <option>휴면 위험</option>
          </select>
        </div>
        <AdminTable
          headers={["사용자", "유형", "가입일", "최근 활동", "상태"]}
          rows={adminUsers.map((user) => [user.name, user.type, user.joined, user.recent, user.status])}
        />
      </Card>
    </AdminShell>
  );
}
