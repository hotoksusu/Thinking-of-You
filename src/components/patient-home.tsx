import Link from "next/link";
import { CalendarDays, Check, ChevronRight, HeartPulse, Hospital } from "lucide-react";
import type { CareState, Patient } from "@/lib/care-mvp";
import { getPatientHome } from "@/lib/patient-home";
import { CareCompanion } from "@/components/care-companion";

export function PatientHome({ patient, state, today, demo }: { patient: Patient; state: CareState; today: string; demo: boolean }) {
  const home = getPatientHome({ patient, checks: state.checkIns, signals: state.careSignals, today });
  const hospital = state.hospitals.find(h => h.id === patient.hospitalId);
  const href = (mode: string) => demo ? `/demo/patient?mode=${mode}` : `/app/patient/${mode}`;
  const alert = home.states.includes("symptomAlert");
  const followUp = state.followUps.find(f => f.patientId === patient.id && f.status === "scheduled");
  return <div data-home-states={home.states.join(" ")}>
    <header className="flex items-center gap-2 py-5 text-xl font-black text-[#315E50]"><HeartPulse aria-hidden/>오늘안부 Care</header>
    <section aria-label="오늘 회복관리" className="rounded-[28px] bg-white p-6 sm:p-8">
      <p className="flex items-start gap-2 text-lg font-bold leading-7 text-[#315E50]"><Hospital className="mt-1 shrink-0" size={21} aria-hidden/>{hospital?.name || "담당 병원"}와 함께 확인하고 있어요</p>
      <p className="mt-3 text-xl font-bold leading-8">{patient.name}님, {home.recoveryDays === null ? "회복 상태를 함께 확인해요." : `${home.recoveryPoint} 후 ${home.recoveryDays}일째예요.`}</p>
      <div className="mt-6 border-t border-[#DDE5DF] pt-6">
        {home.todayCheck ? <>
          <h1 className="flex items-start gap-2 text-[1.9rem] font-black leading-tight text-[#315E50]"><Check className="mt-1 shrink-0" aria-hidden/>오늘 기록을 완료했어요</h1>
          <p className="mt-3 text-lg font-semibold leading-8">오늘 남긴 상태는 병원에서 확인할 수 있어요.</p>
          <div className="mt-4 flex items-center gap-4"><CareCompanion compact priority state="completed"/><p className="text-lg font-bold leading-8 text-[#315E50]">오늘도 기록해주셔서<br/>감사합니다.</p></div>
        </> : <>
          <h1 className="text-[2rem] font-black leading-tight">오늘 회복 상태를<br/>알려주세요.</h1>
          <p className="mt-3 text-xl font-semibold leading-8 text-[#40554A]">통증·붓기·움직임 등<br className="sm:hidden"/> 오늘 상태를 확인할게요.</p>
          <p className="mt-2 text-lg font-bold text-[#315E50]">약 1분이면 끝나요.</p>
          <Link href={href("checkin")} prefetch className="mt-6 flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#315E50] px-4 text-xl font-black text-white">오늘 상태 입력하기 <ChevronRight aria-hidden/></Link>
        </>}
      </div>
      <p className="mt-5 text-lg font-bold leading-7 text-[#40554A]">이번 주 {home.weeklyDays}일 기록했어요.</p>
      <p className="mt-1 text-lg leading-7 text-[#40554A]">오늘 기록도 다음 진료 때 의료진이 함께 확인할 수 있어요.</p>
    </section>
    {home.appointmentMessage ? <section aria-label="진료 일정" className="mt-5 rounded-2xl border border-[#B9CFC1] bg-[#E8F1EA] p-5"><h2 className="flex items-center gap-2 text-xl font-black text-[#315E50]"><CalendarDays aria-hidden/>{home.appointmentMessage}</h2><p className="mt-2 text-lg leading-8">최근 기록을 의료진이 함께 확인할 수 있습니다.</p></section> : null}
    {home.cardOrder.map(card => card === "help" ? <section key={card} aria-label="병원 도움" className={`mt-5 rounded-[24px] border p-5 ${alert ? "border-[#D6A086] bg-[#FFF5EE]" : "border-[#D9E1DC] bg-white"}`}>
      <h2 className="text-xl font-black">{alert ? "달라진 증상은 병원에 확인해주세요." : "회복 중 궁금한 점이 있나요?"}</h2>
      <p className="mt-2 text-lg leading-8 text-[#40554A]">병원 안내와 연락 방법을 확인할 수 있어요.</p>
      <Link href={href("hospital")} prefetch className="mt-2 flex min-h-12 items-center justify-between gap-2 text-lg font-black text-[#315E50]">병원 도움받기 <ChevronRight aria-hidden/></Link>
    </section> : <section key={card} aria-label="최근 회복" className={`mt-5 rounded-[24px] p-5 ${home.todayCheck ? "border-2 border-[#315E50] bg-[#E8F1EA]" : "border border-[#D9E1DC] bg-white"}`}>
      <h2 className="text-xl font-black">최근 회복</h2><p className="mt-2 text-lg leading-8 text-[#40554A]">{home.recoverySummary}</p>
      <Link href={href("history")} prefetch className="mt-2 flex min-h-12 items-center justify-between gap-2 text-lg font-black text-[#315E50]">회복 추이 보기 <ChevronRight aria-hidden/></Link>
    </section>)}
    {followUp ? <section className="mt-5 rounded-2xl bg-white p-5"><h2 className="text-xl font-black">병원에서 다시 확인할 예정이에요.</h2><p className="mt-2 text-lg leading-8">{followUp.followUpDueDate ? `${followUp.followUpDueDate}에` : "다음 일정에"} 회복 상태를 한 번 더 확인합니다.</p></section> : null}
    {!home.todayCheck && home.weeklyDays > 0 ? <aside className="mt-5 flex items-center gap-4 p-2"><CareCompanion compact state="welcome"/><p className="text-lg font-bold leading-8 text-[#40554A]">하루 한 번,<br/>회복 기록을 이어가세요.</p></aside> : null}
  </div>;
}
