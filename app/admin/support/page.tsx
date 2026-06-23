import { AdminShell } from "@/components/desktop-shells";
import { AdminTable } from "@/components/admin-table";
import { Card, inputClassName } from "@/components/ui";
import { supportTickets } from "@/lib/mock-data";

export default function AdminSupportPage() {
  return (
    <AdminShell title="문의/CS 관리" description="문의 상태와 사용자 정보를 확인하고 답변 상태를 관리합니다." active="/admin/support">
      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input className={inputClassName} placeholder="문의 제목 또는 사용자 검색" />
          <select className={inputClassName}>
            <option>전체 문의</option>
            <option>답변 대기</option>
            <option>처리 중</option>
            <option>완료</option>
          </select>
        </div>
        <AdminTable
          headers={["문의", "사용자", "상태", "상세"]}
          rows={supportTickets.map((ticket) => [ticket.title, ticket.user, ticket.status, "상세 보기"])}
        />
      </Card>
    </AdminShell>
  );
}
