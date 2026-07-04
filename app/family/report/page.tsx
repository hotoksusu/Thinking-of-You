import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Footprints, Phone, ShieldCheck } from "lucide-react";
import { todayReport } from "@/lib/life-pattern";

export default function FamilyReportPage() {
  return (
    <main className="min-h-screen bg-[#F5F8F4] px-5 py-6 text-[#17221B]">
      <div className="mx-auto max-w-[760px]">
        <Link href="/app?role=family" className="inline-flex min-h-11 items-center gap-2 font-black text-[#496152]"><ArrowLeft size={19} />엄마의 오늘</Link>
        <header className="mt-8">
          <p className="text-sm font-black text-[#4D7858]">최근 생활 변화</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">달라진 점만<br />차분하게 알려드려요.</h1>
          <p className="mt-4 font-semibold leading-7 text-[#6C766E]">며칠 동안 이어진 변화만 살펴봤어요.</p>
          <p className="mt-2 text-xs font-bold text-[#8A938C]">AI가 최근 변화를 분석했어요.</p>
        </header>

        <section className="mt-8 rounded-[30px] bg-[#2F6B46] p-6 text-white">
          <div className="flex items-start justify-between"><div><p className="text-sm font-black text-[#C7E4CC]">최근 4주도 편안해요</p><p className="mt-3 text-5xl font-black">{todayReport.score}<small className="ml-1 text-base">점</small></p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black">평소와 비슷</span></div>
          <div className="mt-7 flex h-24 items-end gap-3">{[76, 82, 78, 86, 89, 90, 92].map((value) => <div key={value} className="flex-1 rounded-t-xl bg-[#A8D4AF]" style={{ height: `${value}%` }} />)}</div>
          <p className="mt-5 font-bold leading-7 text-white/80">평소처럼 하루를 보내고, 소중한 사람과 연락했어요.</p>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-6">
          <h2 className="text-xl font-black">최근 생활에 이런 모습이 있었어요</h2>
          <div className="mt-5 divide-y divide-[#EDF1ED]">
            <ReportRow icon={<Footprints />} title="꾸준히 몸을 움직였어요" value="평소만큼" detail="자세히 보기에서 걸음수를 확인해요" />
            <ReportRow icon={<Clock3 />} title="평소처럼 하루를 시작했어요" value="편안해요" detail="시작하고 쉬는 시간이 비슷해요" />
            <ReportRow icon={<Phone />} title="소중한 사람과 연락했어요" value="잘 지냈어요" detail="통화 내용은 보지 않아요" />
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-[#E3E9E3] bg-white p-6">
          <p className="flex items-center gap-2 text-sm font-black text-[#4B7556]"><ShieldCheck size={18} />가족에게 드리는 안내</p>
          <h2 className="mt-3 text-xl font-black">오늘은 마음 놓으셔도 괜찮아요.</h2>
          <p className="mt-3 font-semibold leading-7 text-[#6C766E]">달라진 모습이 며칠 이어질 때만 알려드릴게요.</p>
        </section>
      </div>
    </main>
  );
}

function ReportRow({ icon, title, value, detail }: { icon: React.ReactNode; title: string; value: string; detail: string }) {
  return <div className="flex items-center justify-between gap-4 py-5"><span className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#EFF5EF] text-[#3D6F4B]">{icon}</span><span><strong className="block">{title}</strong><small className="mt-1 block font-semibold text-[#818A83]">{detail}</small></span></span><strong className="whitespace-nowrap text-[#3D6F4B]">{value}</strong></div>;
}
