"use client";
import { useEffect, useState } from "react";
import { PatientLink, usePatientNavigation } from "@/components/patient-navigation";
import { patientAppointment } from "@/lib/patient-appointment";
import type { Hospital, Patient } from "@/lib/care-mvp";

export function PatientHospitalGuide({hospital,patient}:{hospital?:Hospital;patient:Patient}) {
  const nav=usePatientNavigation(),[now,setNow]=useState(()=>new Date()),[urgent,setUrgent]=useState(false),[family,setFamily]=useState(false),[consent,setConsent]=useState(false),[past,setPast]=useState(false),[help,setHelp]=useState(false),[demoAction,setDemoAction]=useState("");
  useEffect(()=>{const refresh=()=>setNow(new Date());const timer=window.setInterval(refresh,60000);window.addEventListener("focus",refresh);return()=>{clearInterval(timer);window.removeEventListener("focus",refresh);};},[]);
  const appointment=patientAppointment(patient.nextAppointment,now);
  const mock=nav.demo && !hospital?.phone;
  const phone=mock?"02-000-0000":hospital?.phone?.trim(), hours=mock?"평일 09:00–18:00":hospital?.openingHours, address=mock?"서울 ○○구 ○○로 00":hospital?.address, dial=phone?.replace(/[\s().-]/g,"");
  const callable=!!dial && /^\+?\d{7,15}$/.test(dial);
  const card="rounded-3xl bg-white p-6", action="flex min-h-14 items-center justify-between rounded-2xl border border-[#CAD8CF] px-4 text-lg font-black text-[#315E50]";
  return <div className="space-y-5 py-5">
    <header><p className="text-lg font-bold text-[#315E50]">병원 안내</p><h1 className="mt-2 text-3xl font-black leading-snug">{hospital?.name || "연결된 병원"}</h1><p className="mt-3 text-lg leading-8">퇴원 후 회복관리 안내</p></header>
    <section className={card}><h2 className="text-2xl font-black">어떤 도움이 필요하세요?</h2><div className="mt-4 grid gap-3">
      <button className={action+" border-[#DFB8A5] bg-[#FFF8F4] text-[#803F2D]"} aria-expanded={urgent} aria-controls="urgent-detail" onClick={()=>setUrgent(v=>!v)}>긴급한 증상이 있어요 <span aria-hidden>→</span></button>
      {urgent ? <div id="urgent-detail" className="rounded-2xl bg-[#FFF8F4] p-5 text-lg leading-8"><h3 className="text-xl font-black">갑자기 이런 증상이 있나요?</h3><ul className="mt-3 list-disc pl-5"><li>갑작스럽게 심해진 통증</li><li>호흡곤란</li><li>의식 변화</li><li>지속적인 출혈</li></ul><p className="mt-4 font-bold">응급 증상이 있다면 오늘안부의 답변을 기다리지 말고 119 또는 가까운 응급의료기관을 이용하세요.</p><a href="tel:119" className="mt-4 flex min-h-14 items-center justify-center rounded-xl border-2 border-[#803F2D] font-black text-[#803F2D]">119 전화하기</a></div> : null}
      <a href="#hospital-contact" className={action}>병원에 문의하기 <span aria-hidden>→</span></a>
      
    </div></section>
    <section id="patient-appointment" className={card+" scroll-mt-5"} aria-labelledby="appointment-title">
      <h2 id="appointment-title" className="text-2xl font-black">다음 진료</h2>
      {appointment.state==="today"||appointment.state==="upcoming" ? <><p className="mt-3 text-xl font-black">{appointment.state==="today"?"오늘 진료가 있어요":`D-${appointment.days}`}</p><p className="mt-2 text-lg leading-8">{appointment.label}</p><p className="mt-2 text-lg">{hospital?.name} · {patient.department || "진료과 확인 필요"}</p></> : <><h3 className="mt-3 text-xl font-black">예정된 다음 진료가 없어요.</h3><p className="mt-2 text-lg leading-8">필요하면 병원에 일정을 확인해주세요.</p></>}
      <a href="#hospital-contact" className="mt-3 inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">병원에 일정 문의하기 →</a>
      {appointment.state==="past" ? <div className="mt-3 border-t border-[#D5DED7] pt-2"><button aria-expanded={past} aria-controls="past-appointment" onClick={()=>setPast(v=>!v)} className="min-h-12 text-lg font-bold text-[#40554A]">지난 진료 {past?"접기":"보기"}</button>{past?<p id="past-appointment" className="text-lg leading-8">{appointment.label}<br/>{hospital?.name} · {patient.department || "진료과 확인 필요"}</p>:null}</div>:null}
    </section>
    <section id="hospital-contact" className={card+" scroll-mt-5"}><h2 className="text-2xl font-black">병원 정보</h2>
      {mock?<p className="mt-2 rounded-xl bg-[#E8F1EA] p-3 text-base font-bold">데모용 예시 정보 · 실제 병원 연락처가 아닙니다.</p>:null}
      <dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-lg font-bold">전화</dt><dd className="mt-1 text-xl font-black">{phone || "전화번호 정보 없음"}</dd></div><div><dt className="text-lg font-bold">진료시간</dt><dd className="mt-1 text-lg whitespace-pre-line">{hours || "진료시간 정보 없음"}</dd></div></dl>
      {mock?<button onClick={()=>setDemoAction("전화 연결 미리보기예요. 실제 서비스에서는 등록된 병원 번호로 전화 앱이 열립니다.")} className="mt-3 min-h-12 rounded-xl bg-[#315E50] px-6 text-lg font-black text-white">전화하기</button>:callable?<a href={`tel:${dial}`} className="mt-3 inline-flex min-h-12 items-center rounded-xl bg-[#315E50] px-6 text-lg font-black text-white">전화하기</a>:<button onClick={()=>setHelp(v=>!v)} aria-expanded={help} className="mt-3 min-h-12 text-lg font-black text-[#315E50]">병원 연락처 찾는 방법 →</button>}
      {help?<div className="mt-3 rounded-xl bg-[#F1F0E9] p-4 text-lg leading-8"><p>문자나 카카오톡에서 병원 이름을 검색해 받은 안내의 전화번호를 확인해주세요. 퇴원 안내문에서도 찾을 수 있어요.</p><a href={`https://www.google.com/search?q=${encodeURIComponent((hospital?.name||"")+" 공식 홈페이지 전화번호")}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center font-bold text-[#315E50]">병원 공식 연락처 검색 · 새 창 →</a><p className="text-base">동명이 있는 병원은 주소를 함께 확인해주세요.</p></div>:null}
      <dl className="mt-4 border-t border-[#D5DED7] pt-4"><dt className="text-lg font-bold">주소</dt><dd className="mt-1 text-lg leading-8">{address || "주소 정보 없음"}</dd></dl>
      {mock?<button onClick={()=>setDemoAction("길찾기 미리보기예요. 실제 서비스에서는 등록된 병원 주소로 지도가 열립니다.")} className="min-h-12 text-lg font-black text-[#315E50]">길찾기 →</button>:address?<a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">길찾기 · 새 창 →</a>:null}
      {demoAction?<p role="status" className="mt-3 rounded-xl bg-[#E8F1EA] p-3 text-lg leading-7">{demoAction}</p>:null}
    </section>
    <section className={card}><h2 className="text-xl font-black">다음 진료를 준비한다면</h2><p className="mt-2 text-lg leading-8">지금까지 남긴 회복 기록을 확인해보세요.</p><PatientLink href={nav.href("history")} className="mt-2 inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">회복 기록 보기 →</PatientLink></section>
    <section className={card}><h2 className="text-2xl font-black">가족과 함께 사용하기</h2><p className="mt-3 text-lg leading-8">환자 동의 후 이 기기에서 함께 입력할 수 있어요.</p><button className={action+" mt-4 w-full"} aria-expanded={family} onClick={()=>setFamily(v=>!v)}>보호자 도움 안내 <span aria-hidden>→</span></button>
      {family ? <div className="mt-4 space-y-3 text-lg leading-8"><p>보호자는 환자 이름과 회복 기록을 볼 수 있고, 오늘 상태를 대신 입력할 수 있어요. 입력 내용은 보호자 대리 기록으로 저장돼요.</p><p>현재는 환자가 연결된 기기에서 함께 사용하는 기능이에요. 별도 보호자 전용 링크 발송과 연결 해제 기능은 아직 지원하지 않아요.</p><p>공용 기기에서는 사용을 피해주세요. 환자 동의 없이 화면이나 초대 링크를 공유하지 마세요.</p><label className="flex min-h-14 items-start gap-3 rounded-xl bg-[#F1F0E9] p-4"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-2 size-5 shrink-0"/>환자가 정보 확인과 보호자의 대리 입력에 동의했어요.</label>{consent ? <PatientLink href={nav.href("checkin",{proxy:"guardian"})} className={action}>이 기기에서 함께 입력하기 →</PatientLink> : null}</div> : null}
    </section>
  </div>;
}
