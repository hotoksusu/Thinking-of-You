import Link from "next/link";
import { ArrowLeft, ChevronRight, ClipboardList, HeartHandshake, Hospital, ShieldPlus, Sparkles } from "lucide-react";

const cards = [
  { href: "/family/report", icon: ClipboardList, title: "병원 방문용 리포트", text: "최근 생활 변화를 진료 전에 한눈에 정리합니다.", cta: "리포트 보기" },
  { href: "/family/care/recovery", icon: ShieldPlus, title: "퇴원 후 생활 확인", text: "퇴원 뒤 활동이 평소 수준으로 돌아오는 과정을 확인합니다.", cta: "회복 확인하기" },
  { href: "/family/check", icon: HeartHandshake, title: "가족 확인 기록", text: "가족이 전화하거나 방문해 확인한 내용을 기록합니다.", cta: "기록 보기" },
] as const;

export default function CarePage() {
  return <main className="min-h-screen bg-[#F7F9F6] px-5 pb-16 pt-5 text-[#17221B]"><div className="mx-auto max-w-[620px]">
    <Link href="/app?role=family" className="inline-flex min-h-12 items-center gap-2 font-black text-[#52635C]"><ArrowLeft size={21}/>가족 홈</Link>
    <header className="mt-5 rounded-[30px] bg-[#1F6F7A] p-7 text-white"><span className="flex size-12 items-center justify-center rounded-2xl bg-white/15"><Hospital/></span><h1 className="mt-5 text-3xl font-black">오늘안부 Care</h1><p className="mt-3 text-lg font-bold leading-8 text-white/80">부모님의 생활 변화를 병원 방문과 건강관리에 활용해보세요.</p></header>
    <section className="mt-5 grid gap-4">{cards.map(({href,icon:Icon,title,text,cta})=><Link key={href} href={href} className="rounded-[24px] bg-white p-6 shadow-[0_12px_34px_rgba(49,78,58,.07)]"><div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF6F7] text-[#1F6F7A]"><Icon/></span><div><h2 className="text-xl font-black">{title}</h2><p className="mt-2 font-bold leading-7 text-[#657069]">{text}</p></div></div><p className="mt-5 flex items-center justify-end font-black text-[#1F6F7A]">{cta}<ChevronRight/></p></Link>)}</section>
    <section className="mt-6 rounded-[26px] border-2 border-dashed border-[#C8D8C8] bg-[#EFF5EC] p-6"><div className="flex items-center gap-3"><Sparkles className="text-[#52725B]"/><h2 className="text-xl font-black">보험사 건강관리 서비스</h2><span className="ml-auto rounded-full bg-white px-3 py-1 text-sm font-black text-[#52725B]">준비 중</span></div><p className="mt-4 font-bold leading-7 text-[#617067]">향후 건강상담, 가족 안심 알림, 건강활동 리워드와 연결할 수 있도록 준비하고 있습니다.</p><p className="mt-3 text-sm font-bold text-[#78827C]">보험 가입·보험료·보상 심사에 생활 데이터를 사용하지 않습니다.</p></section>
  </div></main>;
}
