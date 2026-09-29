"use client";
import { useState } from "react";
import { PatientLink, usePatientNavigation } from "@/components/patient-navigation";
import { mobilityLabels, painValue, TODAY, type Patient, type CareState, type CheckIn } from "@/lib/care-mvp";

export function swellingLabel(record: CheckIn) {
  return record.swellingChange ? ({ none:"붓기 없음", same:"이전과 비슷함", more:"이전보다 늘어남", sudden:"갑자기 심해짐" })[record.swellingChange] : record.concerns?.includes("swelling") ? "붓기 불편을 기록했어요" : "별도 기록 없음";
}
export function RecordFacts({record}:{record:CheckIn}) {
  return <dl className="grid gap-3 text-lg leading-8"><div><dt className="font-bold">통증</dt><dd>{painValue(record)}점 / 10점</dd></div><div><dt className="font-bold">붓기</dt><dd>{swellingLabel(record)}</dd></div><div><dt className="font-bold">움직임</dt><dd>{mobilityLabels[record.mobilityScore ?? record.mobility] || "별도 기록 없음"}</dd></div><div><dt className="font-bold">남긴 내용</dt><dd className="break-words">{record.hasConcern ? record.concernText || record.customConcern || "불편한 변화가 있다고 기록했어요." : "새롭게 불편해진 점은 없었어요."}</dd></div></dl>;
}
export function PatientHistory({patient,state}:{patient:Patient;state:CareState}) {
  const nav=usePatientNavigation(),[all,setAll]=useState(false);
  const records=state.checkIns.filter(c=>c.patientId===patient.id).sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt));
  const first=records[0],last=records.at(-1),recent=records.slice(-7);
  const completion=state.careCompletions?.filter(c=>c.patientId===patient.id).sort((a,b)=>b.completedAt.localeCompare(a.completedAt))[0];
  const end=patient.careStatus==="completed" ? completion?.completedAt.slice(0,10) : TODAY;
  const span=end ? Math.floor((Date.parse(end)-Date.parse(patient.dischargeDate.slice(0,10)))/86400000)+1 : NaN;
  const points=recent.map((r,i)=>`${40+i*480/Math.max(1,recent.length-1)},${180-painValue(r)*14}`);
  return <div className="space-y-5 py-5">
    <header><h1 className="text-3xl font-black">회복 기록</h1><p className="mt-3 text-lg leading-8 text-[#40554A]">지금까지 남긴 상태와 변화를 확인할 수 있어요.</p></header>
    {!last ? <section className="rounded-3xl bg-white p-6"><h2 className="text-2xl font-black">아직 회복 기록이 없어요.</h2><p className="mt-3 text-lg leading-8">오늘 상태를 입력하면 기록이 쌓이기 시작해요.</p><PatientLink href={nav.href("checkin")} className="primary">오늘 상태 입력하기</PatientLink></section> : <>
      <section className="rounded-3xl bg-white p-6"><h2 className="text-2xl font-black">나의 회복 기록</h2><dl className="mt-5 grid gap-4 sm:grid-cols-3"><div><dt>남긴 기록</dt><dd className="mt-1 text-2xl font-black">{records.length}회</dd></div><div><dt>관리기간 · 퇴원일부터</dt><dd className="mt-1 text-xl font-black">{Number.isFinite(span)&&span>0 ? `${span}일` : "종료일 미등록"}</dd></div><div><dt>최근 기록</dt><dd className="mt-1 text-xl font-black">{last.date.replaceAll("-",".")}</dd></div></dl><p className="mt-4 text-lg text-[#40554A]">{patient.careStatus==="completed" ? "관리기간 종료 · 치료 종료를 뜻하지 않아요." : "회복관리 중"}</p></section>
      <section className="rounded-3xl bg-white p-6"><h2 className="text-2xl font-black">최근 기록 변화</h2><h3 className="mt-5 text-xl font-black">통증</h3><p className="mt-2 text-xl font-bold">{records.length>1 ? `첫 기록 ${painValue(first)}점 → 최근 기록 ${painValue(last)}점` : `최근 기록 ${painValue(last)}점`}</p><p className="mt-2 text-base leading-7 text-[#40554A]">0~10점 중 높을수록 통증이 심한 점수예요.</p>
        {records.length>1 ? <p className="mt-3 text-lg leading-8">{painValue(last)===painValue(first) ? "첫 기록과 최근 기록의 통증 점수가 같아요." : `최근 통증 점수가 첫 기록보다 ${painValue(last)>painValue(first)?"높아요.":"낮아요."}`}</p> : <p className="mt-3 text-lg">기록이 더 쌓이면 변화를 비교할 수 있어요.</p>}
        {recent.length>1 ? <figure className="mt-4"><figcaption className="text-base font-bold">최근 {recent.length}회 통증 기록 · 기록한 날짜 순서</figcaption><svg role="img" aria-label={recent.map(c=>`${c.date} 통증 ${painValue(c)}점`).join(", ")} viewBox="0 0 560 220" className="mt-2 w-full"><line x1="40" y1="40" x2="520" y2="40" stroke="#D5DED7"/><line x1="40" y1="180" x2="520" y2="180" stroke="#D5DED7"/><text x="0" y="45" fontSize="18">10</text><text x="10" y="185" fontSize="18">0</text><polyline points={points.join(" ")} fill="none" stroke="#315E50" strokeWidth="4"/>{recent.map((r,i)=><g key={r.id}><circle cx={40+i*480/(recent.length-1)} cy={180-painValue(r)*14} r="5" fill="#315E50"/><text x={40+i*480/(recent.length-1)} y={168-painValue(r)*14} textAnchor="middle" fontSize="20" fill="#315E50">{painValue(r)}</text></g>)}</svg><div className="flex justify-between text-base text-[#40554A]"><span>{recent[0].date}</span><span>{last.date}</span></div></figure> : null}
        <div className="mt-5 space-y-4 border-t border-[#D5DED7] pt-4">{[["붓기",swellingLabel(first),swellingLabel(last)],["움직임",mobilityLabels[first.mobilityScore??first.mobility]||"별도 기록 없음",mobilityLabels[last.mobilityScore??last.mobility]||"별도 기록 없음"]].map(([title,a,b])=><div key={title}><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-lg leading-8">{records.length>1 ? <>첫 기록: {a}<br/></> : null}최근 기록: {b}</p></div>)}</div>
      </section>
      <section><h2 className="text-2xl font-black">날짜별 기록</h2><p className="mt-2 text-lg leading-8">날짜를 누르면 자세한 기록을 볼 수 있어요.</p><div className="mt-4 space-y-3">{[...records].reverse().slice(0,all?records.length:7).map(r=><article key={r.id} className="rounded-3xl bg-white p-5"><PatientLink href={nav.href("history",{recordId:r.id})} aria-label={`${r.date.replaceAll("-",".")} 기록`} className="flex min-h-12 items-center justify-between text-xl font-black text-[#315E50]">{r.date.replaceAll("-",".")} 기록 <span aria-hidden>→</span></PatientLink><p className="mt-2 text-lg leading-8">통증 {painValue(r)}점 · 붓기: {swellingLabel(r)}<br/>움직임: {mobilityLabels[r.mobilityScore??r.mobility]||"별도 기록 없음"}</p><p className="mt-2 break-words text-lg leading-8">{r.hasConcern ? r.concernText || "불편한 변화를 기록했어요." : "새롭게 불편해진 점은 없었어요."}</p></article>)}</div>{records.length>7&&!all ? <button onClick={()=>setAll(true)} className="secondary w-full">전체 기록 보기 ({records.length}회)</button> : null}</section>
    </>}
    <section className="rounded-3xl border border-[#CDDAD2] p-5"><h2 className="text-xl font-black">불편한 증상이 계속되나요?</h2><p className="mt-2 text-lg leading-8">병원 연락 방법과 진료 안내를 확인해주세요.</p><PatientLink href={nav.href("hospital")} className="mt-2 inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">병원 안내 보기 →</PatientLink></section>
  </div>;
}
