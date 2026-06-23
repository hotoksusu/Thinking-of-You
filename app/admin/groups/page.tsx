import { AdminShell } from "@/components/desktop-shells";
import { AdminTable } from "@/components/admin-table";
import { Card, inputClassName } from "@/components/ui";
import { adminGroups } from "@/lib/mock-data";

export default function AdminGroupsPage() {
  return (
    <AdminShell title="가족 그룹 관리" description="가족 그룹별 구성원, 안부 대상, 최근 안부 상태를 봅니다." active="/admin/groups">
      <Card>
        <input className={inputClassName} placeholder="가족 그룹 검색" />
        <AdminTable
          headers={["그룹명", "구성원 수", "안부 대상 수", "최근 안부 상태", "상세"]}
          rows={adminGroups.map((group) => [
            group.name,
            `${group.members}명`,
            `${group.parents}명`,
            group.status,
            "상세 보기",
          ])}
        />
      </Card>
    </AdminShell>
  );
}
