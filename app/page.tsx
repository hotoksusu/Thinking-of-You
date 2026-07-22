import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CircleHelp, Coins, Landmark, LockKeyhole, UserRound, UsersRound } from "lucide-react";

const interests = [
  ["오늘안부는 어떻게 다름을 알까요?", "생활 변화 확인 원리", "/how-it-works", CircleHelp],
  ["개인정보는 어떻게 사용하나요?", "확인 정보와 보호 원칙", "/faq", LockKeyhole],
  ["요금이 궁금해요", "현재 제공 중인 플랜", "/pricing", Coins],
  ["기관에서 도입하고 싶어요", "파일럿과 협력 문의", "/institutions", Landmark],
] as const;

export default function LandingPage() {
  return <main className="min-h-screen bg-[#FFF9F0] text-[#20302C]">
    <header className="border-b border-[#E3E8DF] bg-[#FFF9F0]/95"><div className="mx-auto flex min-h-16 max-w-[1080px] items-center justify-between px-5"><Link href="/" className="flex items-center gap-2 text-xl font-black text-[#315B3D]"><Image src="/brand/brand-icon.png" alt="" width={38} height={38} className="rounded-xl"/>오늘안부</Link><Link href="/guide" className="flex min-h-11 items-center px-3 font-black text-[#52635C]">사용 방법</Link></div></header>

    <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1080px] items-center gap-8 px-5 py-12 lg:grid-cols-[1fr_.9fr] lg:py-16">
      <div><p className="text-sm font-black text-[#D95C24]">부모님과 가족을 위한 생활 안부</p><h1 className="mt-4 text-[clamp(2.6rem,7vw,4.8rem)] font-black leading-[1.12] tracking-[-.04em]">매일 묻지 않아도,<br/>평소와 다른 날을<br/>알려드립니다.</h1><div className="mt-6 space-y-2 text-lg font-bold leading-8 text-[#5A6962] sm:text-xl"><p>부모님은 필요한 날에만 질문 하나에 답합니다.</p><p>가족은 달라진 날만 확인하면 됩니다.</p></div><div className="mt-9 grid max-w-[620px] gap-3 sm:grid-cols-2"><RoleLink href="/for-parent" icon={UserRound} title="부모님이 사용하나요?" text="질문 하나만 누르면 돼요"/><RoleLink href="/for-family" icon={UsersRound} title="가족이 사용하나요?" text="달라진 날만 확인해요"/></div></div>
      <div className="relative mx-auto w-full max-w-[500px]"><Image src="/illustrations/todayanbu-hero.png" alt="편안히 생활하는 부모님과 안부를 확인하는 가족" width={760} height={680} priority className="h-auto w-full"/></div>
    </section>

    <section id="roles" className="bg-white px-5 py-16 sm:py-20"><div className="mx-auto max-w-[980px]"><p className="text-sm font-black text-[#D95C24]">누가 먼저 보고 계신가요?</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">내게 필요한 화면만 보세요.</h2><div className="mt-8 grid gap-4 md:grid-cols-2"><RoleLink href="/for-parent" icon={UserRound} title="부모님이에요" text="질문이 오면 답 하나만 누르면 됩니다." large/><RoleLink href="/for-family" icon={UsersRound} title="가족이에요" text="부모님의 생활이 달라진 날만 확인합니다." large/></div></div></section>

    <section className="px-5 py-16 sm:py-20"><div className="mx-auto max-w-[980px]"><h2 className="text-3xl font-black sm:text-5xl">한쪽은 가볍게 답하고,<br/>한쪽은 필요한 날만 봅니다.</h2><div className="mt-9 grid gap-4 md:grid-cols-2"><Preview role="부모님 화면" title="오늘은 하실 일이 없어요" text="질문이 온 날에도 큰 답 하나만 누릅니다." action="괜찮아요"/><Preview role="가족 화면 · 데모" title="오늘은 평소와 비슷합니다" text="달라진 날에는 이유와 권장 행동을 함께 봅니다." action="지금 할 일은 없어요"/></div></div></section>

    <section className="bg-[#173F35] px-5 py-16 text-white sm:py-20"><div className="mx-auto max-w-[980px]"><h2 className="text-3xl font-black sm:text-5xl">더 궁금한 내용만 골라 보세요.</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{interests.map(([title,text,href,Icon])=><Link key={href} href={href} className="group flex min-h-28 items-center gap-4 rounded-[22px] bg-white/10 p-5 hover:bg-white/15"><Icon className="shrink-0 text-[#B9E1C0]"/><span className="flex-1"><strong className="block text-lg">{title}</strong><span className="mt-1 block text-white/65">{text}</span></span><ArrowRight/></Link>)}</div></div></section>

    <section className="bg-white px-5 py-16 sm:py-20"><div className="mx-auto max-w-[820px]"><h2 className="text-3xl font-black">먼저 이것만 확인하세요.</h2><div className="mt-7 space-y-3"><Faq q="부모님이 매일 입력해야 하나요?" a="아니요. 확인이 필요한 날에만 질문 하나에 답하고, 답하기 어려운 날은 건너뛸 수 있습니다."/><Faq q="무엇을 확인하나요?" a="현재는 질문 응답과 응답 시간대를 바탕으로 개인의 평소 흐름과 달라진 날을 확인합니다."/><Faq q="앱을 설치해야 하나요?" a="아니요. 링크로 바로 체험할 수 있고, 홈 화면 추가는 연결 이후 선택할 수 있습니다."/></div><div className="mt-8 flex flex-wrap gap-3"><Link href="/faq" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-[#A9BEA6] px-6 text-lg font-black">FAQ 전체 보기 <ArrowRight size={20}/></Link><Link href="/for-family" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#E9652B] px-6 text-lg font-black text-white">가족 화면부터 보기 <ArrowRight size={20}/></Link></div></div></section>
    <footer className="border-t border-[#E4E8E1] px-5 py-8 text-center font-bold text-[#68756F]">오늘안부 · 의료 진단이 아닌 생활 변화 안내 서비스</footer>
  </main>;
}

function RoleLink({href,icon:Icon,title,text,large=false}:{href:string;icon:typeof UserRound;title:string;text:string;large?:boolean}){return <Link href={href} className={`group flex min-h-24 items-center gap-4 rounded-[22px] border-2 border-[#C9D8C5] bg-white p-5 text-left shadow-[0_12px_28px_rgba(45,70,50,.06)] hover:border-[#6F9471] ${large?"sm:min-h-36 sm:p-7":""}`}><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3E5] text-[#315B3D]"><Icon/></span><span className="flex-1"><strong className="block text-lg font-black sm:text-xl">{title}</strong><span className="mt-1 block font-bold text-[#65736C]">{text}</span></span><ArrowRight className="text-[#52725B] transition group-hover:translate-x-1"/></Link>}
function Preview({role,title,text,action}:{role:string;title:string;text:string;action:string}){return <article className="rounded-[28px] bg-[#EAF3E5] p-6 sm:p-8"><p className="font-black text-[#D95C24]">{role}</p><div className="mt-4 rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(49,78,58,.08)]"><h3 className="text-2xl font-black">{title}</h3><p className="mt-3 font-bold leading-7 text-[#65736C]">{text}</p><div className="mt-6 flex min-h-14 items-center justify-center rounded-2xl bg-[#2F6B46] px-5 text-lg font-black text-white">{action}</div></div></article>}
function Faq({q,a}:{q:string;a:string}){return <details className="rounded-[20px] border border-[#DFE6DC] bg-[#FAFCF9] p-5"><summary className="cursor-pointer text-lg font-black">{q}</summary><p className="mt-4 font-bold leading-8 text-[#586960]">{a}</p></details>}
