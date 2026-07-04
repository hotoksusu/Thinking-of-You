import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Footprints, Phone, ShieldCheck } from "lucide-react";
import { todayReport } from "@/lib/life-pattern";

export default function FamilyReportPage() {
  return (
    <main className="min-h-screen bg-[#F5F8F4] px-5 py-6 text-[#17221B]">
      <div className="mx-auto max-w-[760px]">
        <Link href="/app?role=family" className="inline-flex min-h-11 items-center gap-2 font-black text-[#496152]"><ArrowLeft size={19} />엄마의 오늘</Link>
        <header className="mt-8">
          <p className="text-sm font-black text-[#4D7858]">AI 생활 패턴 리포트</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">생활의 변화만<br />차분하게 알려드려요.</h1>
          <p className="mt-4 font-semibold leading-7 text-[#6C766E]">하루의 작은 흔들림보다 여러 날 이어지는 변화를 살펴봅니다.</p>
        </header>

        <section className="mt-8 rounded-[30px] bg-[#2F6B46] p-6 text-white">
          <div className="flex items-start justify-between"><div><p className="text-sm font-black text-[#C7E4CC]">최근 4주 안심지수</p><p className="mt-3 text-5xl font-black">{todayReport.score}점</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black">안정적</span></div>
          <div className="mt-7 flex h-24 items-end gap-3">{[76, 82, 78, 86, 89, 90, 92].map((value) => <div key={value} className="flex-1 rounded-t-xl bg-[#A8D4AF]" style={{ height: `${value}%` }} />)}</div>
          <p className="mt-5 font-bold leading-7 text-white/80">생활 리듬과 통화 활동이 평소 범위 안에서 유지되고 있습니다.</p>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-6">
          <h2 className="text-xl font-black">AI가 살펴본 변화</h2>
          <div className="mt-5 divide-y divide-[#EDF1ED]">
            <ReportRow icon={<Footprints />} title="활동량" value="평소 범위" detail="최근 4주 평균 3,320걸음" />
            <ReportRow icon={<Clock3 />} title="생활 리듬" value="일정함" detail="첫·마지막 활동 시간 변화 없음" />
            <ReportRow icon={<Phone />} title="통화 활동" value="유지 중" detail="통화 내용은 수집하지 않아요" />
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-[#E3E9E3] bg-white p-6">
          <p className="flex items-center gap-2 text-sm font-black text-[#4B7556]"><ShieldCheck size={18} />가족에게만 보이는 제안</p>
          <h2 className="mt-3 text-xl font-black">지금은 평소처럼 지켜봐도 좋아요.</h2>
          <p className="mt-3 font-semibold leading-7 text-[#6C766E]">장기적인 활동 감소가 이어질 때만 연락을 권하는 알림을 보내드릴게요.</p>
        </section>
      </div>
    </main>
  );
}

function ReportRow({ icon, title, value, detail }: { icon: React.ReactNode; title: string; value: string; detail: string }) {
  return <div className="flex items-center justify-between gap-4 py-5"><span className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#EFF5EF] text-[#3D6F4B]">{icon}</span><span><strong className="block">{title}</strong><small className="mt-1 block font-semibold text-[#818A83]">{detail}</small></span></span><strong className="whitespace-nowrap text-[#3D6F4B]">{value}</strong></div>;
}
