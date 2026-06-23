import { AdminShell } from "@/components/desktop-shells";
import { Button, Card, inputClassName } from "@/components/ui";
import { contentTemplates } from "@/lib/mock-data";

export default function AdminContentPage() {
  return (
    <AdminShell title="콘텐츠/문구 관리" description="온보딩, 알림, 안부 질문과 건강 루틴 템플릿을 관리합니다." active="/admin/content">
      <div className="grid gap-4 lg:grid-cols-2">
        {contentTemplates.map((template) => (
          <Card key={template.name}>
            <label className="text-sm font-bold text-brand-ink" htmlFor={template.name}>
              {template.name}
            </label>
            <textarea
              id={template.name}
              className={`${inputClassName} mt-3 min-h-28 py-3`}
              defaultValue={template.value}
            />
            <Button className="mt-3">수정 저장</Button>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
