import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Building2, Check, Footprints, HeartHandshake, MessageCircle, ShieldCheck, Smile, Smartphone, Users } from "lucide-react";

const steps = [
  { icon: <Smile />, number: "01", title: "기분을 선택해요", body: "부모님은 오늘 기분만 남깁니다." },
  { icon: <Footprints />, number: "02", title: "생활 흐름을 확인해요", body: "걷기와 생활 리듬의 변화를 살핍니다." },
  { icon: <HeartHandshake />, number: "03", title: "가족에게 알려드려요", body: "달라진 날과 필요한 행동을 전합니다." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] text-[#17251F]">
      <header className="border-b border-[#E7E9E3] bg-[#FFF9F0]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-black"><Image src="/brand/brand-icon.png" alt="" width={38} height={38} className="rounded-xl" />오늘안부</Link>
          <Link href="/plans" className="min-h-11 rounded-full px-4 py-3 text-sm font-black text-[#52635C]">요금 안내</Link>
        </div>
      </header>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E9F3E8] px-4 py-2 text-sm font-black text-[#2F6B46]"><ShieldCheck size={18} /> 생활 패턴 모니터링 플랫폼</span>
            <h1 className="mt-7 text-[2.7rem] font-black leading-[1.12] tracking-[-0.04em] sm:text-6xl">매일 전화하지 않아도,<br /><span className="text-[#2F6B46]">필요한 순간을</span><br />알 수 있습니다.</h1>
            <p className="mt-7 text-xl font-bold leading-9 text-[#52635C]">생활이 평소와 달라지면 알려드립니다.<br />확인이 필요한 변화만 가족과 기관에 전달합니다.</p>
            <div className="mt-9 grid gap-3 sm:flex">
              <Link href="/app?role=family" className="flex min-h-16 items-center justify-center gap-2 rounded-[20px] bg-[#1F6F7A] px-7 text-lg font-black text-white shadow-[0_16px_34px_rgba(31,111,122,.2)]">가족으로 시작하기 <ArrowRight size={21} /></Link>
              <Link href="/app?role=parent" className="flex min-h-16 items-center justify-center rounded-[20px] border-2 border-[#2F6B46] bg-white px-7 text-lg font-black text-[#2F6B46]">부모님 화면 체험하기</Link>
            </div>
            <p className="mt-4 text-sm font-bold text-[#7C857F]">현재 화면은 체험용 데이터로 제공됩니다.</p>
          </div>
          <div className="rounded-[36px] bg-[#EAF3E5] p-6 shadow-[0_24px_70px_rgba(49,78,58,.12)] sm:p-9">
            <Image src="/illustrations/todayanbu-hero.png" alt="부모님과 가족을 연결하는 오늘안부" width={760} height={680} className="h-auto w-full rounded-[28px]" priority />
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5E9E2] bg-[#F3F7F1] px-5 py-14">
        <div className="mx-auto grid max-w-[1040px] gap-7 md:grid-cols-3">
          <div><p className="text-sm font-black text-[#D95423]">문제</p><h2 className="mt-2 text-2xl font-black">매일 확인하기는 어렵습니다.</h2><p className="mt-3 font-bold leading-7 text-[#657069]">멀리 사는 가족은 작은 생활 변화를 놓치기 쉽습니다.</p></div>
          <div><p className="text-sm font-black text-[#2F6B46]">해결</p><h2 className="mt-2 text-2xl font-black">달라진 날만 알려드립니다.</h2><p className="mt-3 font-bold leading-7 text-[#657069]">평소 흐름과 다른 변화의 이유를 함께 보여줍니다.</p></div>
          <div><p className="text-sm font-black text-[#1F6F7A]">행동</p><h2 className="mt-2 text-2xl font-black">가족의 확인까지 연결합니다.</h2><p className="mt-3 font-bold leading-7 text-[#657069]">전화·메시지·확인 완료가 하나의 흐름으로 이어집니다.</p></div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="text-center text-sm font-black text-[#D95423]">이렇게 작동합니다</p>
          <h2 className="mt-3 text-center text-3xl font-black sm:text-5xl">부모님께는 가볍게,<br />가족에게는 분명하게.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => <article key={step.number} className="rounded-[28px] border border-[#E3E9E1] bg-[#FAFCF9] p-7"><span className="flex size-14 items-center justify-center rounded-2xl bg-[#EAF3E5] text-[#2F6B46]">{step.icon}</span><p className="mt-6 text-sm font-black text-[#D95423]">{step.number}</p><h3 className="mt-2 text-2xl font-black">{step.title}</h3><p className="mt-3 text-lg font-bold leading-8 text-[#657069]">{step.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1040px] gap-6 rounded-[34px] bg-[#163F46] p-7 text-white sm:grid-cols-2 sm:p-12">
          <div><p className="text-sm font-black text-[#9FD6D9]">가족이 얻는 가치</p><h2 className="mt-3 text-3xl font-black leading-tight">매일 확인하지 않아도,<br />달라진 날을 알려드립니다.</h2></div>
          <div className="grid gap-4 text-lg font-bold"><p className="flex gap-3"><Check className="shrink-0 text-[#9FD6D9]" />오늘 평소와 다른지 확인</p><p className="flex gap-3"><Check className="shrink-0 text-[#9FD6D9]" />가족이 해야 할 행동 안내</p><p className="flex gap-3"><Check className="shrink-0 text-[#9FD6D9]" />주간 생활 변화 요약</p></div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="text-sm font-black text-[#D95423]">역할별 경험</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">기록, 확인, 관리를 분리했습니다.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-[26px] bg-[#FFF8ED] p-7"><Smile className="text-[#D95423]" /><h3 className="mt-5 text-2xl font-black">부모는 기록</h3><p className="mt-3 font-bold leading-7 text-[#657069]">기분과 선택 메모만 20초 안에 남깁니다.</p></article>
            <article className="rounded-[26px] bg-[#EAF6F7] p-7"><HeartHandshake className="text-[#1F6F7A]" /><h3 className="mt-5 text-2xl font-black">가족은 확인</h3><p className="mt-3 font-bold leading-7 text-[#657069]">상태, 변화 원인, 권장 행동만 확인합니다.</p></article>
            <article className="rounded-[26px] bg-[#EAF3E5] p-7"><Users className="text-[#2F6B46]" /><h3 className="mt-5 text-2xl font-black">기관은 관리</h3><p className="mt-3 font-bold leading-7 text-[#657069]">확인 필요 대상을 우선순위로 관리합니다.</p></article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-2">
          <div className="rounded-[30px] bg-[#173F46] p-7 text-white sm:p-10"><Activity size={34} className="text-[#9FD6D9]" /><p className="mt-5 text-sm font-black text-[#9FD6D9]">확인하는 생활 변화</p><h2 className="mt-3 text-3xl font-black">변화의 근거를 공개합니다.</h2><ul className="mt-6 grid gap-4 font-bold"><li>활동량 · 연동 예정</li><li>활동 시작 시간 · 연동 예정</li><li>휴대폰 사용 패턴 · 연동 예정</li><li>기분 및 연속 기록 · 체험 가능</li></ul><p className="mt-6 text-sm font-bold leading-6 text-white/65">연동 기능은 기기 지원 범위에 따라 달라질 수 있습니다. 데이터가 없으면 결과를 만들지 않습니다.</p></div>
          <div className="rounded-[30px] border border-[#E0E6DF] bg-white p-7 sm:p-10"><Smartphone size={34} className="text-[#2F6B46]" /><p className="mt-5 text-sm font-black text-[#2F6B46]">체험용 가족 화면</p><h2 className="mt-3 text-3xl font-black">변화 → 이유 → 행동</h2><div className="mt-6 rounded-[22px] bg-[#F3F7F1] p-5"><p className="text-sm font-black text-[#B95327]">확인이 필요한 변화</p><p className="mt-2 text-xl font-black">오늘 활동이 평소보다 적습니다.</p><p className="mt-2 font-bold text-[#657069]">이틀 연속 활동 시작이 늦었습니다.</p></div><Link href="/app?role=family" className="mt-5 flex min-h-14 items-center justify-center rounded-2xl bg-[#1F6F7A] px-5 font-black text-white">가족 화면 체험하기</Link></div>
        </div>
      </section>

      <section className="bg-[#F3F7F1] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]"><p className="text-center text-sm font-black text-[#D95423]">기존 방식과의 차이</p><h2 className="mt-3 text-center text-3xl font-black sm:text-5xl">항상 보는 대신, 필요할 때 행동합니다.</h2><div className="mt-10 overflow-hidden rounded-[26px] border border-[#DCE4DA] bg-white"><div className="grid grid-cols-2 bg-[#173F46] p-4 font-black text-white"><span>기존 방식</span><span>오늘안부</span></div>{[["매일 전화", "변화가 있을 때 확인"],["워치 착용 필요", "별도 기기 없이 시작"],["항상 확인", "필요한 순간만 알림"],["기억에 의존", "장기 변화 기록"]].map(([oldWay,newWay])=><div key={oldWay} className="grid grid-cols-2 border-t border-[#E5EAE4] p-4 font-bold"><span className="text-[#7B827E]">{oldWay}</span><span className="text-[#2F6B46]">{newWay}</span></div>)}</div></div>
      </section>

      <section className="bg-[#F0F5EF] px-5 py-16">
        <div className="mx-auto max-w-[1040px] rounded-[30px] bg-white p-7 sm:flex sm:items-center sm:justify-between sm:gap-10 sm:p-10">
          <div><span className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF3E5] text-[#2F6B46]"><Building2 /></span><h2 className="mt-5 text-2xl font-black">돌봄기관과 실증 파트너를 찾습니다.</h2><p className="mt-3 max-w-[620px] font-bold leading-7 text-[#657069]">위험군 우선 확인, 변화 통계, 관리 대상 목록을 하나의 플랫폼에서 제공합니다.</p></div>
          <div className="mt-7 grid gap-3 sm:mt-0"><Link href="/admin" className="flex min-h-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2F6B46] px-6 font-black text-[#2F6B46]">기관 화면 체험</Link><a href="mailto:osyoun@yna.co.kr?subject=오늘안부 실증 협력 문의" className="flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#2F6B46] px-6 font-black text-white">실증 협력 문의 <MessageCircle size={19} /></a></div>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-sm font-bold text-[#6D766F]">오늘안부는 의료 진단 서비스가 아닙니다. 생활 변화 확인을 돕는 참고 서비스입니다.</footer>
    </main>
  );
}
