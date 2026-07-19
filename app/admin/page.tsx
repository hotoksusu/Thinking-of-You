import { AlertTriangle, Check, Clock3, Users } from "lucide-react";
import { AdminShell } from "@/components/desktop-shells";

const people = [
  { name: "김정희", group: "확인 필요", change: "활동 시작 2시간 지연", last: "12분 전", tone: "bg-[#FFF0E6] text-[#B95327]" },
  { name: "박영수", group: "변화 발생", change: "3일 연속 활동 감소", last: "28분 전", tone: "bg-[#FFF5D9] text-[#8A6500]" },
  { name: "이순자", group: "확인 완료", change: "담당자 전화 확인", last: "1시간 전", tone: "bg-[#E8F5EF] text-[#2F6B46]" },
  { name: "최복례", group: "최근 변화 없음", change: "최근 7일 평소 범위", last: "오늘", tone: "bg-[#EEF2EF] text-[#667169]" },
];

export default function InstitutionDashboardPage() {
  return <AdminShell title="생활 변화 관리" description="확인이 필요한 대상부터 우선 확인합니다. · 체험용 데이터" active="/admin">
    <div className="grid gap-4 md:grid-cols-4">
      <Metric icon={<AlertTriangle />} label="확인 필요" value="2명" tone="text-[#B95327] bg-[#FFF0E6]" />
      <Metric icon={<Clock3 />} label="평균 대응 시간" value="18분" tone="text-[#8A6500] bg-[#FFF5D9]" />
      <Metric icon={<Check />} label="오늘 확인 완료" value="11명" tone="text-[#2F6B46] bg-[#E8F5EF]" />
      <Metric icon={<Users />} label="관리 대상" value="48명" tone="text-[#1F6F7A] bg-[#EAF6F7]" />
    </div>
    <section className="mt-5 overflow-hidden rounded-[22px] border border-[#E1E7DF] bg-white shadow-sm">
      <div className="p-5"><h2 className="text-xl font-black">관리 대상 우선순위</h2><p className="mt-2 font-bold text-[#6A746E]">변화 발생과 미확인 대상을 먼저 보여줍니다.</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#F4F7F3] text-sm text-[#68736C]"><tr><th className="p-4">대상</th><th className="p-4">상태</th><th className="p-4">변화 근거</th><th className="p-4">최근 확인</th><th className="p-4">다음 행동</th></tr></thead><tbody>{people.map(person=><tr key={person.name} className="border-t border-[#E8ECE7]"><td className="p-4 font-black">{person.name}</td><td className="p-4"><span className={`rounded-full px-3 py-2 text-sm font-black ${person.tone}`}>{person.group}</span></td><td className="p-4 font-bold">{person.change}</td><td className="p-4 text-[#6A746E]">{person.last}</td><td className="p-4"><button className="min-h-11 rounded-xl bg-[#173F46] px-4 font-black text-white">상세 확인</button></td></tr>)}</tbody></table></div>
    </section>
    <p className="mt-5 text-sm font-bold text-[#7B847E]">오늘안부는 의료 진단 서비스가 아닙니다. 표시된 내용은 기관용 제품 구조를 보여주는 체험 데이터입니다.</p>
  </AdminShell>;
}

function Metric({icon,label,value,tone}:{icon:React.ReactNode;label:string;value:string;tone:string}){return <article className="rounded-[20px] border border-[#E1E7DF] bg-white p-5"><span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>{icon}</span><p className="mt-5 text-sm font-black text-[#68736C]">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></article>}
