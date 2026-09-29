"use client";
import { useEffect, useState } from "react";
import { PatientLink, usePatientNavigation } from "@/components/patient-navigation";
import { patientAppointment } from "@/lib/patient-appointment";
import type { Hospital, Patient } from "@/lib/care-mvp";

export function PatientHospitalGuide({hospital,patient}:{hospital?:Hospital;patient:Patient}) {
  const nav=usePatientNavigation(),[now,setNow]=useState(()=>new Date()),[urgent,setUrgent]=useState(false),[family,setFamily]=useState(false),[consent,setConsent]=useState(false);
  useEffect(()=>{const refresh=()=>setNow(new Date());const timer=window.setInterval(refresh,60000);window.addEventListener("focus",refresh);return()=>{clearInterval(timer);window.removeEventListener("focus",refresh);};},[]);
  const appointment=patientAppointment(patient.nextAppointment,now);
  const phone=hospital?.phone?.trim(), dial=phone?.replace(/[\s().-]/g,"");
  const callable=!!dial && /^\+?\d{7,15}$/.test(dial);
  const card="rounded-3xl bg-white p-6", action="flex min-h-14 items-center justify-between rounded-2xl border border-[#CAD8CF] px-4 text-lg font-black text-[#315E50]";
  return <div className="space-y-5 py-5">
    <header><p className="text-lg font-bold text-[#315E50]">병원 안내</p><h1 className="mt-2 text-3xl font-black leading-snug">{hospital?.name || "연결된 병원"}</h1><p className="mt-3 text-lg leading-8">퇴원 후 회복관리 안내</p></header>
    <section className={card}><h2 className="text-2xl font-black">어떤 도움이 필요하세요?</h2><div className="mt-4 grid gap-3">
      <button className={action+" border-[#DFB8A5] bg-[#FFF8F4] text-[#803F2D]"} aria-expanded={urgent} aria-controls="urgent-detail" onClick={()=>setUrgent(v=>!v)}>긴급한 증상이 있어요 <span aria-hidden>→</span></button>
      {urgent ? <div id="urgent-detail" className="rounded-2xl bg-[#FFF8F4] p-5 text-lg leading-8"><h3 className="text-xl font-black">갑자기 이런 증상이 있나요?</h3><ul className="mt-3 list-disc pl-5"><li>갑작스럽게 심해진 통증</li><li>호흡곤란</li><li>의식 변화</li><li>지속적인 출혈</li></ul><p className="mt-4 font-bold">응급 증상이 있다면 오늘안부의 답변을 기다리지 말고 119 또는 가까운 응급의료기관을 이용하세요.</p><a href="tel:119" className="mt-4 flex min-h-14 items-center justify-center rounded-xl border-2 border-[#803F2D] font-black text-[#803F2D]">119 전화하기</a></div> : null}
      <a href="#hospital-contact" className={action}>병원에 문의하기 <span aria-hidden>→</span></a>
      <a href="#patient-appointment" className={action}>진료 일정 확인하기 <span aria-hidden>→</span></a>
    </div></section>
    <section id="patient-appointment" className={card+" scroll-mt-5"} aria-labelledby="appointment-title">
      <h2 id="appointment-title" className="text-2xl font-black">{appointment.state==="today" ? "오늘 진료가 있어요" : appointment.state==="upcoming" ? "다음 진료" : "예정된 다음 진료가 없어요."}</h2>
      {appointment.state==="today"||appointment.state==="upcoming" ? <><p className="mt-4 text-xl font-black leading-8">{appointment.label}</p>{appointment.state==="upcoming" ? <p className="mt-2 text-lg font-black text-[#315E50]">D-{appointment.days}</p> : null}</> : <><p className="mt-3 text-lg leading-8">필요하면 병원에 일정을 확인해주세요.</p>{appointment.state==="past" ? <p className="mt-4 border-t border-[#D5DED7] pt-4 text-lg leading-8"><strong>지난 진료</strong><br/>{appointment.label}</p> : null}</>}
      <p className="mt-3 text-lg leading-8 text-[#40554A]">{hospital?.name || "연결된 병원"}{patient.department ? ` · ${patient.department}` : ""}</p>
      <PatientLink href={nav.href("history")} className="mt-3 inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">{appointment.state==="today"||appointment.state==="upcoming" ? "진료 전 회복 기록 보기 →" : "회복 기록 보기 →"}</PatientLink>
    </section>
    <section id="hospital-contact" className={card+" scroll-mt-5"}><h2 className="text-2xl font-black">병원에 문의하기</h2><p className="mt-2 text-lg font-bold">{hospital?.name || "연결된 병원"}</p>
      <dl className="mt-5 space-y-5"><div><dt className="text-lg font-bold">대표전화</dt><dd className="mt-2 break-words text-2xl font-black">{phone || "등록된 전화번호가 없어요."}</dd></div></dl>
      {callable ? <a href={`tel:${dial}`} className="mt-4 flex min-h-14 items-center justify-center rounded-2xl bg-[#315E50] text-xl font-black text-white">전화하기</a> : <p className="mt-3 text-lg leading-8">퇴원 안내문이나 병원에서 받은 문자에 적힌 연락처를 확인해주세요.</p>}
      <dl className="mt-5 space-y-5"><div><dt className="text-lg font-bold">진료시간</dt><dd className="mt-2 text-lg leading-8 whitespace-pre-line">{hospital?.openingHours || "등록된 진료시간이 없어요. 병원에 확인해주세요."}</dd></div><div><dt className="text-lg font-bold">주소</dt><dd className="mt-2 text-lg leading-8">{hospital?.address || "등록된 주소가 없어요. 병원에 위치를 확인해주세요."}</dd></div></dl>
      {hospital?.address ? <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">길찾기 · 새 창 →</a> : null}
    </section>
    <section className={card}><h2 className="text-2xl font-black">가족이 함께 관리하고 있나요?</h2><p className="mt-3 text-lg leading-8">환자가 동의하면 이 기기에서 보호자가 오늘 상태 입력을 도울 수 있어요.</p><button className={action+" mt-4 w-full"} aria-expanded={family} onClick={()=>setFamily(v=>!v)}>보호자 도움 안내 <span aria-hidden>→</span></button>
      {family ? <div className="mt-4 space-y-3 text-lg leading-8"><p>보호자는 환자 이름과 회복 기록을 볼 수 있고, 오늘 상태를 대신 입력할 수 있어요. 입력 내용은 보호자 대리 기록으로 저장돼요.</p><p>현재는 환자가 연결된 기기에서 함께 사용하는 기능이에요. 별도 보호자 전용 링크 발송과 연결 해제 기능은 아직 지원하지 않아요.</p><p>공용 기기에서는 사용을 피해주세요. 환자 동의 없이 화면이나 초대 링크를 공유하지 마세요.</p><label className="flex min-h-14 items-start gap-3 rounded-xl bg-[#F1F0E9] p-4"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-2 size-5 shrink-0"/>환자가 정보 확인과 보호자의 대리 입력에 동의했어요.</label>{consent ? <PatientLink href={nav.href("checkin",{proxy:"guardian"})} className={action}>이 기기에서 함께 입력하기 →</PatientLink> : null}</div> : null}
    </section>
    <aside className="rounded-3xl border border-[#DFB8A5] bg-[#FFF8F4] p-5 text-[#6E3B2B]"><h2 className="text-xl font-black">지금 바로 도움이 필요한 경우</h2><p className="mt-3 text-lg leading-8">응급 증상이 있다면 <strong>오늘안부의 답변을 기다리지 말고 119 또는 가까운 응급의료기관을 이용하세요.</strong></p></aside>
  </div>;
}
