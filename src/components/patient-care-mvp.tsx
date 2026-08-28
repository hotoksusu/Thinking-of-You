"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  HeartPulse,
  Hospital,
  ShieldCheck,
} from "lucide-react";
import {
  comparisonLabels,
  concernLabels,
  daysSince,
  demoPainBucket,
  loadCareState,
  loadPublicDemoCareState,
  mobilityLabels,
  painValue,
  saveCareState,
  savePublicDemoCareState,
  TODAY,
  type CareState,
  type CheckIn,
  type DayComparison,
  type Patient,
  type PatientStatus,
} from "@/lib/care-mvp";
import { prioritizationProvider } from "@/services/prioritization";
import { trackCareEvent } from "@/lib/care-analytics";
import { CareCompanion } from "@/components/care-companion";
import {
  findInvitation,
  getPatientSession,
  verifyPatientIdentity,
} from "@/lib/demo-auth";
import { RecoveryTrend } from "@/components/recovery-trend";

type Mode = "home" | "onboarding" | "checkin" | "history";
export function PatientCareMvp({ mode, demo = false }: { mode: Mode; demo?: boolean }) {
  const [state, setState] = useState<CareState | null>(null),
    [patient, setPatient] = useState<Patient | null>(null),
    [invalid, setInvalid] = useState(false),
    [onboardStep, setOnboardStep] = useState(0),
    [question, setQuestion] = useState(0),
    [painScore, setPainScore] = useState<number | null>(null),
    [mobility, setMobility] = useState<number | null>(null),
    [concerns, setConcerns] = useState<string[]>([]),
    [customConcern, setCustomConcern] = useState(""),
    [dayComparison, setDayComparison] = useState<DayComparison | null>(null),
    [saved, setSaved] = useState(false),
    [guardianMode, setGuardianMode] = useState(false);
  useEffect(() => {
    const next = demo ? loadPublicDemoCareState() : loadCareState(),
      params = new URLSearchParams(location.search),
      token = params.get("token"),
      invitation = token ? findInvitation(token) : null,
      session = getPatientSession();
    setGuardianMode(mode === "checkin" && params.get("proxy") === "guardian");
    const id = demo ? "patient_001" : mode === "onboarding" ? invitation?.patientId : session?.patientId;
    const found = next.patients.find(
      (p) =>
        p.id === id &&
        (demo || (mode === "onboarding" && p.hospitalId === invitation?.hospitalId) ||
          (mode !== "onboarding" && p.hospitalId === session?.hospitalId)),
    );
    setState(next);
    setPatient(found || null);
    setInvalid(!found);
    if (mode === "onboarding" && found){
      trackCareEvent("invite_opened", { patientId: found.id, hospitalId: found.hospitalId });trackCareEvent("registration_started", { patientId: found.id, hospitalId: found.hospitalId });trackCareEvent("patient_onboarding_started", { patientId: found.id });
    }
    if (mode === "checkin" && found)
      trackCareEvent("checkin_started", { patientId: found.id, hospitalId: found.hospitalId, demo });
  }, [mode, demo]);
  const hospital = state?.hospitals.find((h) => h.id === patient?.hospitalId);
  const todayCheck = state?.checkIns.find(
    (c) => c.patientId === patient?.id && c.date === TODAY,
  );
  const history = useMemo(
    () =>
      state?.checkIns
        .filter((c) => c.patientId === patient?.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) || [],
    [state, patient],
  );
  const patientFollowUp = state?.followUps.find(item => item.patientId === patient?.id && item.status === "scheduled");
  if (invalid)
    return (
      <PatientShell>
        <Empty
          title={
            mode === "onboarding"
              ? "초대 링크를 확인할 수 없어요"
              : "다시 확인이 필요해요"
          }
          text={
            mode === "onboarding"
              ? "유효하지 않거나 만료된 안내 링크입니다. 병원에서 받은 링크를 다시 확인해 주세요."
              : "병원에서 안내받은 링크로 다시 시작해 주세요."
          }
          recovery
        />
      </PatientShell>
    );
  if (!state || !patient)
    return (
      <PatientShell>
        <p className="py-24 text-center text-lg font-bold">
          정보를 불러오고 있어요.
        </p>
      </PatientShell>
    );
  if (mode === "home" && patient.careStatus === "completed") {
    const ordered=[...history].sort((a,b)=>a.date.localeCompare(b.date)),first=ordered[0],last=ordered.at(-1),programDays=Math.max(1,daysSince(patient.dischargeDate)+1);
    return <PatientShell><div className="py-10 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#DDEDE3] text-[#315E50]"><Check size={42}/></span><h1 className="mt-6 text-3xl font-black">회복 기록 프로그램을 완료했어요</h1><p className="mt-3 text-lg font-bold leading-8 text-[#596A62]">{programDays}일 동안 {history.length}번 회복 상태를 남겼어요.</p><div className="mt-6 rounded-3xl bg-white p-5 text-left"><p className="text-lg font-black">통증 <span className="float-right text-[#315E50]">{first?painValue(first):"-"} → {last?painValue(last):"-"}</span></p><p className="mt-4 text-lg font-black">체크인 <span className="float-right text-[#315E50]">{history.length} / {programDays}일</span></p></div><p className="mt-5 text-base font-semibold leading-7 text-[#68766F]">이는 오늘안부 Care 관리기간이 끝났다는 의미이며 의료적인 완치나 정상 판정을 뜻하지 않습니다.</p><Link href="/app/patient/history" className="primary">내 회복 기록 보기</Link></div></PatientShell>;
  }
  if (mode === "onboarding") {
    if (onboardStep === 0)
      return (
        <PatientShell>
          <div className="py-10">
            <Hospital className="text-[#315E50]" size={42} />
            <p className="mt-5 text-lg font-black text-[#315E50]">
              {hospital?.name}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight">
              퇴원 후 회복 확인을 위해
              <br />
              오늘안부를 안내했습니다.
            </h1>
            <div className="mt-8 rounded-3xl bg-white p-6">
              <p className="text-xl font-black">{patient.name}님 맞으신가요?</p>
              <p className="mt-2 text-lg text-[#617069]">
                회원가입이나 비밀번호 없이 시작합니다.
              </p>
            </div>
            <button onClick={() => setOnboardStep(1)} className="primary">
              네, 시작할게요
            </button>
          </div>
        </PatientShell>
      );
    return (
      <PatientShell>
        <div className="py-10">
          <ShieldCheck className="text-[#315E50]" size={44} />
          <h1 className="mt-5 text-3xl font-black">
            매일 오래 입력하지 않아도 됩니다.
          </h1>
          <ul className="mt-7 space-y-4 text-lg font-bold leading-8">
            <li>✓ 하루 한 번 간단히 확인합니다.</li>
            <li>✓ 회복 상태를 병원과 함께 확인할 수 있습니다.</li>
            <li>✓ 전화·문자 내용이나 개인 사진을 확인하지 않습니다.</li>
          </ul>
          <p className="mt-6 rounded-2xl bg-white p-4 text-base font-bold leading-7 text-[#596A62]">오늘안부 Care는 회복 기록을 병원과 공유하는 데 도움을 주는 서비스이며 실시간 응급 대응 서비스는 아닙니다. 갑작스러운 심한 증상은 병원 또는 응급의료기관에 직접 연락해주세요.</p>
          <button
            onClick={() => {
              const token = new URLSearchParams(location.search).get("token");
              if (!token || !verifyPatientIdentity(token)) {
                setInvalid(true);
                return;
              }
              const next = {
                ...state,
                patients: state.patients.map((p) =>
                  p.id === patient.id
                    ? { ...p, status: "onboarded" as const }
                    : p,
                ),
              };
              saveCareState(next);
              trackCareEvent("patient_onboarding_completed", {
                patientId: patient.id,
              });
              trackCareEvent("registration_completed", {patientId:patient.id,hospitalId:patient.hospitalId});
              location.href = "/app/patient";
            }}
            className="primary"
          >
            확인했어요
          </button>
        </div>
      </PatientShell>
    );
  }
  if ((mode as Mode) === "checkin") {
    return <AdaptiveCheckin patient={patient} todayCheck={todayCheck} history={history} guardianMode={guardianMode} demo={demo} />;
  }
  if ((mode as Mode) === "checkin") {
    if (todayCheck || saved)
      return (
        <PatientShell>
          <div className="py-12 text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#DDEDE3] text-[#315E50]">
              <Check size={42} />
            </span>
            <h1 className="mt-6 text-3xl font-black">오늘 확인이 끝났어요.</h1>
            <p className="mt-3 text-lg font-bold text-[#46574F]">
              알려주셔서 감사합니다.
            </p>
            <Link href="/app/patient" className="primary">
              홈으로
            </Link>
            <p className="mt-6 rounded-2xl bg-white p-4 text-left text-[16px] font-bold leading-7 text-[#46574F]">
              갑자기 많이 아프거나 급한 상황이라면 오늘안부를 기다리지 말고
              안내받은 병원 또는 119를 이용해주세요.
            </p>
          </div>
        </PatientShell>
      );
    const concernOptions = Object.entries(concernLabels).filter(
      ([id]) => id !== "none",
    );
    const valueReady =
      question === 0
        ? painScore !== null
        : question === 1
          ? mobility !== null
          : question === 2
            ? concerns.length > 0
            : dayComparison !== null;
    return (
      <PatientShell>
        <div className="flex min-h-[calc(100dvh-40px)] flex-col py-5">
          <p className="text-base font-black text-[#315E50]">
            {question + 1} / 4
          </p>
          <div className="mt-5 h-2 rounded-full bg-[#DDE5E0]">
            <div
              className="h-full rounded-full bg-[#315E50] transition-all"
              style={{ width: `${(question + 1) * 25}%` }}
            />
          </div>
          <h1 className="mt-9 text-3xl font-black leading-tight">
            {question === 0
              ? "오늘 통증은 어느 정도인가요?"
              : question === 1
                ? "오늘 움직이기는 어떠셨어요?"
                : question === 2
                  ? "오늘 새롭게 생겼거나 더 불편해진 점이 있나요?"
                  : "어제와 비교하면 오늘은 어떠세요?"}
          </h1>
          {question === 0 ? (
            <>
              <div className="mt-7 grid grid-cols-6 gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPainScore(i)}
                    className={`min-h-[58px] rounded-xl border-2 text-xl font-black ${painScore === i ? "border-[#315E50] bg-[#315E50] text-white" : "border-[#C8D3CD] bg-white"}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-sm font-bold text-[#68766F]">오늘 통증</p>
                <p className="text-3xl font-black text-[#315E50]">
                  {painScore === null ? "선택해주세요" : `${painScore} / 10`}
                </p>
                <p className="mt-2 text-sm font-bold text-[#68766F]">
                  0 통증 없음 · 1~3 가벼운 통증 · 4~6 중간 정도 · 7~9 심한 통증
                  · 10 가장 심한 통증
                </p>
              </div>
            </>
          ) : null}
          {question === 1 ? (
            <div className="mt-7 grid gap-3">
              {mobilityLabels.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setMobility(i)}
                  className={`min-h-[68px] rounded-2xl border-2 px-5 text-left text-lg font-black ${mobility === i ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          {question === 2 ? (
            <>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {concernOptions.map(([id, label]) => {
                  const on = concerns.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() =>
                        setConcerns((v) =>
                          on
                            ? v.filter((x) => x !== id)
                            : [...v.filter((x) => x !== "none"), id],
                        )
                      }
                      className={`min-h-[64px] rounded-2xl border-2 px-4 text-left font-black ${on ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}
                    >
                      {label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setConcerns(["none"])}
                  className={`col-span-2 min-h-[64px] rounded-2xl border-2 px-4 text-left font-black ${concerns.includes("none") ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}
                >
                  없음
                </button>
              </div>
              {concerns.includes("other") ? (
                <textarea
                  value={customConcern}
                  onChange={(e) => setCustomConcern(e.target.value)}
                  placeholder="직접 알려주세요."
                  maxLength={100}
                  className="mt-4 min-h-24 w-full rounded-2xl border-2 border-[#C8D3CD] bg-white p-4 text-lg"
                />
              ) : null}
            </>
          ) : null}
          {question === 3 ? (
            <div className="mt-7 grid gap-3">
              {Object.entries(comparisonLabels).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setDayComparison(id as DayComparison)}
                  className={`min-h-[68px] rounded-2xl border-2 px-5 text-left text-lg font-black ${dayComparison === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex gap-3 pt-8">
            {question > 0 ? (
              <button
                onClick={() => setQuestion((q) => q - 1)}
                className="min-h-[60px] rounded-2xl border-2 border-[#315E50] px-5 text-lg font-black"
              >
                <ArrowLeft />
              </button>
            ) : null}
            <button
              disabled={!valueReady}
              onClick={() => {
                if (question < 3) {
                  setQuestion((q) => q + 1);
                  return;
                }
                if (
                  painScore === null ||
                  mobility === null ||
                  !concerns.length ||
                  !dayComparison
                )
                  return;
                const hasConcern = !concerns.includes("none"),
                  concernText = hasConcern
                    ? concerns
                        .map((x) =>
                          x === "other" ? customConcern : concernLabels[x],
                        )
                        .filter(Boolean)
                        .join(" · ")
                    : "",
                  createdAt = new Date().toISOString(),
                  episode = state.episodes.find(
                    (e) => e.patientId === patient.id,
                  );
                const check: CheckIn = {
                  id: `check_${Date.now()}`,
                  episodeId: episode?.id,
                  patientId: patient.id,
                  date: TODAY,
                  checkInDate: TODAY,
                  pain: demoPainBucket(painScore),
                  painScore,
                  mobility,
                  mobilityScore: mobility,
                  hasConcern,
                  concernStatus: hasConcern ? "reported" : "none",
                  concernText,
                  concerns: hasConcern ? concerns : [],
                  customConcern,
                  dayComparison,
                  source: "patient",
                  createdAt,
                  updatedAt: createdAt,
                };
                const previous = history[0],
                  priority = prioritizationProvider.evaluate({
                    current: { ...check, painScore },
                    previous: previous
                      ? {
                          ...previous,
                          painScore: previous.painScore ?? undefined,
                        }
                      : undefined,
                  }),
                  status: PatientStatus = {
                    patientId: patient.id,
                    level: priority.level,
                    reason: priority.explanation,
                    reasonCodes: priority.reasonCodes,
                    ruleVersion: priority.ruleVersion,
                    source: "system",
                    updatedAt: priority.createdAt,
                  };
                const next = {
                  ...state,
                  checkIns: [...state.checkIns, check],
                  statuses: [
                    ...state.statuses.filter((s) => s.patientId !== patient.id),
                    status,
                  ],
                };
                try {
                  saveCareState(next);
                  setState(next);
                  setSaved(true);
                  trackCareEvent("checkin_completed", {
                    patientId: patient.id,
                  });
                  trackCareEvent("patient_status_changed", {
                    patientId: patient.id,
                    level: status.level,
                  });
                } catch {
                  alert("저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
                }
              }}
              className="min-h-[60px] flex-1 rounded-2xl bg-[#315E50] text-xl font-black text-white disabled:bg-[#B7C2BC]"
            >
              {question === 3 ? "오늘 확인 마치기" : "다음"}
            </button>
          </div>
        </div>
      </PatientShell>
    );
  }
  if (mode === "history")
    return (
      <PatientShell>
        <header className="py-5">
          <Link
            href="/app/patient"
            className="flex items-center gap-2 font-black text-[#315E50]"
          >
            <ArrowLeft /> 홈
          </Link>
          <h1 className="mt-7 text-3xl font-black">내 회복</h1>
          <p className="mt-2 font-bold text-[#68766F]">
            내가 입력한 기록을 날짜별로 확인할 수 있어요.
          </p>
        </header>
        {history.length ? (
          <>
            <section className="rounded-3xl bg-white p-5"><p className="text-sm font-black text-[#315E50]">RECOVERY JOURNEY</p><h2 className="mt-2 text-2xl font-black">지금은 회복 {Math.max(1, Math.ceil(daysSince(patient.surgeryDate || patient.dischargeDate) / 7))}주차예요</h2><p className="mt-2 font-semibold leading-7 text-[#596A62]">매일의 작은 변화가 회복 기록으로 쌓이고 있어요.</p><div className="mt-5 flex items-center justify-between text-center text-xs font-black text-[#596A62]"><span>●<br/>수술</span><span className="h-0.5 flex-1 bg-[#CFE0D5]"/><span>●<br/>퇴원</span><span className="h-0.5 flex-1 bg-[#CFE0D5]"/><span className="text-[#315E50]">◎<br/>현재 D+{daysSince(patient.surgeryDate || patient.dischargeDate)}</span><span className="h-0.5 flex-1 bg-[#DDE5E0]"/><span>○<br/>다음 외래</span></div></section>
            <section className="mt-5 rounded-3xl bg-[#E8F1EA] p-5"><h2 className="text-xl font-black text-[#315E50]">이번 주 회복 기록</h2><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4"><p className="text-sm font-bold text-[#68766F]">평균 통증</p><p className="mt-1 text-2xl font-black">{(history.slice(0,7).reduce((sum,item)=>sum+painValue(item),0)/Math.min(7,history.length)).toFixed(1)}</p></div><div className="rounded-2xl bg-white p-4"><p className="text-sm font-bold text-[#68766F]">체크인</p><p className="mt-1 text-2xl font-black">7일 중 {Math.min(7,history.length)}일</p></div></div><p className="mt-4 font-bold leading-7 text-[#315E50]">최근 기록이 차곡차곡 쌓이고 있어요. 숫자는 의료적 예후 판단을 의미하지 않습니다.</p></section>
            <RecoveryTrend checks={history} audience="patient" />
            <div className="mt-5 space-y-3">
              {history.slice(0, 7).map((c) => (
                <article key={c.id} className="rounded-2xl bg-white p-5">
                  <p className="font-black">
                    {c.date === TODAY ? "오늘" : c.date}
                  </p>
                  <p className="mt-3 text-lg">
                    통증: <strong>{painValue(c)} / 10</strong>
                  </p>
                  <p className="mt-1 text-lg">
                    움직임:{" "}
                    <strong>
                      {mobilityLabels[c.mobilityScore ?? c.mobility]}
                    </strong>
                  </p>
                  {c.hasConcern ? (
                    <p className="mt-1 text-lg">
                      추가 불편: <strong>{c.concernText || "있어요"}</strong>
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        ) : (
          <Empty
            title="아직 회복 기록이 없습니다"
            text="오늘 상태를 알려주시면 여기에 기록됩니다."
            action="/app/patient/checkin"
          />
        )}
      </PatientShell>
    );
  return (
    <PatientShell>
      <header className="flex items-center gap-2 py-5 text-xl font-black text-[#315E50]">
        <HeartPulse /> 오늘안부 Care
      </header>
      <section className="mt-2 rounded-[28px] bg-white p-6">
        <p className="flex items-center gap-2 text-lg font-black text-[#315E50]">
          <Hospital size={21} />
          {hospital?.name}와 함께하는 회복 확인
        </p>
        <div className="mx-auto mt-3 w-[120px]">
          <CareCompanion state={todayCheck ? "completed" : "welcome"} compact />
        </div>
        <h1 className="mt-3 text-[2.05rem] font-black leading-tight">
          오늘 회복은 어떤가요?
        </h1>
        {todayCheck ? (
          <>
            <div className="mt-5 rounded-2xl bg-[#E8F1EA] p-5">
              <p className="text-xl font-black text-[#315E50]">
                오늘 확인을 마쳤어요.
              </p>
              <p className="mt-2 text-lg font-bold text-[#46574F]">
                알려주셔서 감사합니다.
              </p>
            </div>
            <Link href="/app/patient/history" className="secondary">
              지난 기록 보기 <ChevronRight />
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-xl font-bold leading-8 text-[#46574F]">
              수술 후 {daysSince(patient.surgeryDate || patient.dischargeDate)}일째
              <br />
              어제와 비교해서 달라진 점을 알려주세요. 1분이면 끝나요.
            </p>
            <Link href="/app/patient/checkin" className="primary">
              오늘 회복 기록하기 <ChevronRight />
            </Link>
            <p className="mt-4 text-center text-base font-semibold text-[#66736C]">매일 남긴 기록으로 회복 변화를 확인할 수 있어요.</p>
          </>
        )}
      </section>
      {patientFollowUp ? <div className="mt-5 rounded-2xl border border-[#CFE0D5] bg-[#E8F1EA] p-5"><p className="font-black text-[#315E50]">병원에서 회복 상태를 계속 확인할 예정이에요.</p><p className="mt-2 font-semibold leading-7 text-[#596A62]">최근 남긴 회복 기록을 참고해 {patientFollowUp.followUpDueDate ? `${patientFollowUp.followUpDueDate}에` : "다음 일정에"} 상태를 한 번 더 확인합니다.</p></div> : null}
      <p className="mt-5 rounded-2xl bg-white p-4 text-[16px] font-bold leading-7 text-[#46574F]">
        실시간 응급 대응 서비스는 아닙니다. 갑자기 많이 아프거나 급한 상황이라면 병원 또는 119에 직접 연락하세요.
      </p>
    </PatientShell>
  );
}
type AdaptiveStep = "pain" | "painContext" | "mobility" | "movement" | "comparison" | "concern" | "complete";
const adaptiveConcerns = [
  ["none", "새롭게 불편해진 점은 없어요"],
  ["swelling", "붓기가 어제보다 더 생겼어요"],
  ["fever", "수술 부위가 평소보다 뜨거워요"],
  ["incision_discomfort", "상처가 더 빨갛거나 진물이 보여요"],
  ["sleep", "통증 때문에 잠을 자주 깼어요"],
  ["other", "기타"],
] as const;
const recoveryMobilityLabels = ["어제보다 편해요", "어제와 비슷해요", "어제보다 불편해요"];
const painContextLabels = [["rest","가만히 있을 때"],["moving","움직일 때"],["walking","걸을 때"],["night","밤에 잘 때"],["constant","계속 아픔"],["unsure","잘 모르겠어요"]] as const;
function pathwayMovementLabels(patient: Patient) {
  const part = `${patient.bodyPart || ""} ${patient.procedureDetail || ""}`;
  if (part.includes("어깨")) return ["팔 올리기", "옷 입기", "밤에 자세 바꾸기", "보조기 착용", "기타"];
  if (part.includes("고관절")) return ["걷기", "앉았다 일어나기", "체중 싣기", "넘어질 뻔함", "기타"];
  if (part.includes("척추")) return ["일어나기", "걷기", "앉아 있기", "자세 바꾸기", "기타"];
  return ["일어나기", "걷기", "계단", "무릎 굽히기", "앉았다 일어나기", "기타"];
}

function AdaptiveCheckin({ patient, todayCheck, history, guardianMode, demo }: { patient: Patient; todayCheck?: CheckIn; history: CheckIn[]; guardianMode: boolean; demo: boolean }) {
  const [startedAt] = useState(() => new Date().toISOString());
  const [step, setStep] = useState<AdaptiveStep>("pain");
  const [dayComparison, setDayComparison] = useState<DayComparison | null>(null);
  const [concern, setConcern] = useState<(typeof adaptiveConcerns)[number][0] | null>(null);
  const [customConcern, setCustomConcern] = useState("");
  const [painScore, setPainScore] = useState<number | null>(null);
  const [painContext, setPainContext] = useState<CheckIn["painContext"]>();
  const [mobility, setMobility] = useState<number | null>(null);
  const [movementDifficulty, setMovementDifficulty] = useState("");
  const [savedCheck, setSavedCheck] = useState<CheckIn | null>(todayCheck || null);
  const [isSaving,setIsSaving]=useState(false),submitLock=useRef(false);

  const currentCheck = savedCheck || todayCheck;
  if (currentCheck || step === "complete") {
    const comparison = currentCheck?.dayComparison || dayComparison || "same", previous = history.find(item => item.id !== currentCheck?.id), currentPain = currentCheck ? painValue(currentCheck) : painScore, streak = Math.min(7, history.length + (todayCheck ? 0 : 1));
    return <PatientShell demo={demo}><div className="py-10 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#DDEDE3] text-[#315E50]"><Check size={42} /></span><h1 className="mt-6 text-[2rem] font-black leading-tight">오늘 회복 기록을 남겼어요</h1>{currentCheck?.source === "guardian" ? <p className="mt-3 text-lg font-black text-[#315E50]">보호자 대리 입력으로 저장했습니다.</p> : null}<div className="mt-5 rounded-3xl bg-white p-5 text-left"><p className="text-lg font-black text-[#315E50]">어제와 비교</p><p className="mt-2 text-xl font-bold leading-8">통증 {previous ? `${painValue(previous)} → ` : ""}{currentPain ?? "-"}점<br/>움직임은 {recoveryMobilityLabels[currentCheck?.mobilityScore ?? mobility ?? 1]}.</p><p className="mt-4 rounded-2xl bg-[#F1F0E9] p-4 font-black">수술 후 {daysSince(patient.surgeryDate || patient.dischargeDate)}일째 · {streak}일 연속 기록</p></div><p className="mt-4 rounded-2xl bg-white p-5 text-left text-lg font-bold leading-8 text-[#46574F]">전반적으로 어제보다 {comparisonLabels[comparison]}.</p>{currentCheck?.hasConcern ? <p className="mt-3 rounded-2xl bg-white p-5 text-left text-lg font-bold leading-8 text-[#46574F]">오늘 남긴 변화: {currentCheck.concernText}</p> : null}<div className="mt-4 rounded-2xl border border-[#CFE0D5] bg-[#E8F1EA] p-5 text-left"><p className="font-black text-[#315E50]">병원과 함께 보는 회복 기록</p><p className="mt-2 font-semibold leading-7 text-[#596A62]">매일 남긴 기록은 회복 변화를 확인하는 데 활용됩니다. 필요한 경우 의료진이 최근 변화와 체크인 기록을 확인할 수 있습니다.</p></div>{demo ? <><Link href="/demo/hospital" className="primary">병원에서는 어떻게 보일까요?</Link><Link href="/" className="secondary">처음으로</Link></> : <Link href={guardianMode ? "/care/guardian" : "/app/patient/history"} className="primary">{guardianMode ? "보호자 화면으로" : "내 회복 추이 보기"}</Link>}</div></PatientShell>;
  }

  function goBack() {
    if (step === "painContext") setStep("pain");
    else if (step === "mobility") setStep(painScore !== null && (painScore >= 6 || (history[0] && painScore - painValue(history[0]) >= 2)) ? "painContext" : "pain");
    else if (step === "movement") setStep("mobility");
    else if (step === "comparison") setStep(mobility === 2 ? "movement" : "mobility");
    else if (step === "concern") setStep("comparison");
  }

  function finish(selectedMobility: number) {
    if (painScore === null || !dayComparison) return;
    if(submitLock.current)return;submitLock.current=true;setIsSaving(true);
    const currentState = demo ? loadPublicDemoCareState() : loadCareState();
    const existingToday = currentState.checkIns.find(check => check.patientId === patient.id && (check.checkInDate || check.date) === TODAY);
    if (existingToday) { setSavedCheck(existingToday); setStep("complete"); setIsSaving(false); return; }
    const hasConcern = concern !== null && concern !== "none";
    const storedConcerns = hasConcern ? [concern] : [];
    const concernText = !hasConcern ? "" : concern === "other" ? customConcern.trim() || "기타" : adaptiveConcerns.find(item => item[0] === concern)?.[1] || "변화 있음";
    const createdAt = new Date().toISOString();
    const episode = currentState.episodes.find(e => e.patientId === patient.id);
    const check: CheckIn = { id: `check_${Date.now()}`, episodeId: episode?.id, patientId: patient.id, date: TODAY, checkInDate: TODAY, pain: demoPainBucket(painScore), painScore, painContext, mobility: selectedMobility, mobilityScore: selectedMobility, mobilityComparison: selectedMobility === 0 ? "better" : selectedMobility === 2 ? "worse" : "same", movementDifficulty: movementDifficulty || undefined, hasConcern, concernStatus: hasConcern ? "reported" : "none", concernText, concerns: storedConcerns, swellingChange: concern === "swelling" ? "more" : undefined, warmth: concern === "fever" ? "clear" : undefined, woundChange: concern === "incision_discomfort" ? "redder" : undefined, sleep: concern === "sleep" ? "often" : undefined, customConcern: concern === "other" ? customConcern.trim() : "", dayComparison, source: guardianMode ? "guardian" : "patient",submittedByType:guardianMode?"guardian":"patient",submittedById:patient.id, createdAt, updatedAt: createdAt };
    const previous = currentState.checkIns.filter(item => item.patientId === patient.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || history[0];
    const priority = prioritizationProvider.evaluate({ current: { ...check, painScore }, previous: previous ? { ...previous, painScore: previous.painScore ?? undefined } : undefined });
    const status: PatientStatus = { patientId: patient.id, level: priority.level, reason: priority.explanation, reasonCodes: priority.reasonCodes, ruleVersion: priority.ruleVersion, source: "system", updatedAt: priority.createdAt };
    const signal = status.level === "stable" ? null : { id: `signal_${Date.now()}`, patientId: patient.id, type: concern === "swelling" ? "new_swelling" as const : concern === "fever" ? "new_warmth" as const : concern === "incision_discomfort" ? "wound_change" as const : previous && painScore - painValue(previous) >= 3 ? "pain_jump" as const : "other" as const, severity: status.level === "needs_attention" ? "priority" as const : "check" as const, reason: status.reason, detectedAt: createdAt, sourceCheckInIds: [check.id, ...(previous ? [previous.id] : [])], status: "open" as const };
    const task = signal ? { id: `task_${Date.now()}`, patientId: patient.id, signalIds: [signal.id], priority: signal.severity === "priority" ? "high" as const : "normal" as const, status: patient.assignedNurse ? "assigned" as const : "unassigned" as const, assignedTo: patient.assignedNurse, assignedAt: patient.assignedNurse ? createdAt : undefined, dueAt: `${TODAY}T18:00:00+09:00`, createdAt } : null;
    const next = { ...currentState, checkIns: [...currentState.checkIns, check], statuses: [...currentState.statuses.filter(s => s.patientId !== patient.id), status], careSignals: signal ? [...(currentState.careSignals || []).filter(item => item.patientId !== patient.id || item.status !== "open"), signal] : currentState.careSignals, careTasks: task ? [...(currentState.careTasks || []).filter(item => item.patientId !== patient.id || item.status === "done"), task] : currentState.careTasks };
    try { (demo ? savePublicDemoCareState : saveCareState)(next); setMobility(selectedMobility); setSavedCheck(check); setStep("complete"); const durationSeconds=Math.max(1,Math.round((Date.now()-Date.parse(startedAt))/1000));trackCareEvent("checkin_completed", { patientId: patient.id, hospitalId: patient.hospitalId, source: check.source, checkInActor:guardianMode?"guardian_assisted":"patient", startedAt, completedAt: createdAt, durationSeconds, adaptiveQuestion: Boolean(painContext||movementDifficulty), unsureSelected: painContext==="unsure", demo });if(!previous)trackCareEvent("first_checkin_completed",{patientId:patient.id,hospitalId:patient.hospitalId,demo}); trackCareEvent("patient_status_changed", { patientId: patient.id, level: status.level, demo }); if(signal)trackCareEvent("care_signal_created",{patientId:patient.id,hospitalId:patient.hospitalId,careSignalId:signal.id,careTaskId:task?.id,signalType:signal.type,ruleVersion:status.ruleVersion,demo}); }
    catch { submitLock.current=false;setIsSaving(false);alert("저장하지 못했어요. 다시 시도해주세요."); }
  }

  const previousPain = history[0] ? painValue(history[0]) : null;
  const needsPainContext = painScore !== null && (painScore >= 6 || (previousPain !== null && painScore - previousPain >= 2));
  const steps = ["pain", ...(needsPainContext ? ["painContext"] : []), "mobility", ...(mobility === 2 ? ["movement"] : []), "comparison", "concern"] as AdaptiveStep[];
  const stepNumber = Math.max(1, steps.indexOf(step) + 1), totalSteps = steps.length;
  const ready = step === "pain" ? painScore !== null : step === "painContext" ? Boolean(painContext) : step === "mobility" ? mobility !== null : step === "movement" ? Boolean(movementDifficulty) : step === "comparison" ? dayComparison !== null : Boolean(concern) && (concern !== "other" || Boolean(customConcern.trim()));
  function nextStep() { trackCareEvent("checkin_question_answered",{patientId:patient.id,hospitalId:patient.hospitalId,question:step,elapsedSeconds:Math.max(1,Math.round((Date.now()-Date.parse(startedAt))/1000)),adaptive:["painContext","movement"].includes(step),unsureSelected:step==="painContext"&&painContext==="unsure",demo});if (step === "pain") setStep(needsPainContext ? "painContext" : "mobility"); else if (step === "painContext") setStep("mobility"); else if (step === "mobility") setStep(mobility === 2 ? "movement" : "comparison"); else if (step === "movement") setStep("comparison"); else if (step === "comparison") setStep("concern"); else if (mobility !== null) finish(mobility); }
  return <PatientShell demo={demo}><div className="flex min-h-[100dvh] flex-col py-5">{guardianMode ? <p className="mb-3 rounded-xl bg-white p-3 text-lg font-black text-[#315E50]">보호자 대리 입력 · {patient.name}님</p> : null}<p className="text-lg font-black text-[#315E50]">{stepNumber} / {totalSteps}</p><div className="mt-4 h-2 rounded-full bg-[#DDE5E0]"><div className="h-full rounded-full bg-[#315E50] transition-all" style={{ width: `${stepNumber / totalSteps * 100}%` }} /></div>
    <h1 className="mt-9 text-[2rem] font-black leading-tight">{step === "pain" ? "지금 통증은 어느 정도인가요?" : step === "painContext" ? "어떤 때 가장 아픈가요?" : step === "mobility" ? "오늘 움직이는 것은 어땠나요?" : step === "movement" ? "어떤 움직임이 가장 불편했나요?" : step === "comparison" ? "어제와 비교하면 전반적으로 어떠세요?" : "오늘 새롭게 달라진 점이 있나요?"}</h1>
    {step === "pain" ? <><div className="mt-8 grid grid-cols-6 gap-2">{Array.from({ length: 11 }, (_, i) => <button key={i} onClick={() => setPainScore(i)} className={`min-h-[58px] rounded-xl border-2 text-xl font-black ${painScore === i ? "border-[#315E50] bg-[#315E50] text-white" : "border-[#C8D3CD] bg-white"}`}>{i}</button>)}</div><div className="mt-5 rounded-2xl bg-white p-4 text-lg font-bold leading-8 text-[#596A62]"><p>0 통증 없음 · 5 꽤 불편함 · 10 견디기 매우 힘듦</p>{previousPain !== null ? <p className="mt-2 text-[#315E50]">어제는 <strong>{previousPain}점</strong>이었어요.{painScore !== null && painScore !== previousPain ? ` 오늘은 ${Math.abs(painScore - previousPain)}점 ${painScore > previousPain ? "높아요" : "낮아요"}.` : ""}</p> : null}</div></> : null}
    {step === "painContext" ? <div className="mt-8 grid gap-3">{painContextLabels.map(([id,label]) => <button key={id} onClick={() => setPainContext(id)} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left text-xl font-black ${painContext === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step === "mobility" ? <div className="mt-8 grid gap-3">{recoveryMobilityLabels.map((label, i) => <button key={label} onClick={() => setMobility(i)} className={`min-h-[72px] rounded-2xl border-2 px-5 text-left text-xl font-black ${mobility === i ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step === "movement" ? <div className="mt-8 grid grid-cols-2 gap-3">{pathwayMovementLabels(patient).map(label => <button key={label} onClick={() => setMovementDifficulty(label)} className={`min-h-[68px] rounded-2xl border-2 px-4 text-left text-lg font-black ${movementDifficulty === label ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step === "comparison" ? <div className="mt-8 grid gap-4">{Object.entries(comparisonLabels).map(([id, label]) => <button key={id} onClick={() => setDayComparison(id as DayComparison)} className={`min-h-[72px] rounded-2xl border-2 bg-white px-5 text-left text-xl font-black ${dayComparison === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD]"}`}>{label}</button>)}</div> : null}
    {step === "concern" ? <><div className="mt-8 grid gap-3">{adaptiveConcerns.map(([id, label]) => <button key={id} onClick={() => setConcern(id)} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left text-lg font-black ${concern === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div>{concern === "other" ? <textarea value={customConcern} onChange={e => setCustomConcern(e.target.value)} maxLength={100} placeholder="불편한 점을 짧게 알려주세요." className="mt-4 min-h-24 w-full rounded-2xl border-2 border-[#C8D3CD] bg-white p-4 text-lg" /> : null}</> : null}
    <div className={`mt-auto grid ${step === "pain" ? "grid-cols-1" : "grid-cols-[auto_1fr]"} gap-3 pt-8`}>{step !== "pain" ? <button onClick={goBack} className="min-h-[60px] rounded-2xl border-2 border-[#315E50] px-5 text-lg font-black text-[#315E50]"><ArrowLeft className="mr-2 inline" />이전</button> : null}<button disabled={!ready||isSaving} onClick={nextStep} className="min-h-[60px] rounded-2xl bg-[#315E50] px-5 text-xl font-black text-white disabled:bg-[#B7C2BC]">{isSaving?"저장 중...":step === "concern" ? "오늘 기록 마치기" : "다음"}</button></div>
  </div></PatientShell>;
}

function PatientShell({ children, demo = false }: { children: React.ReactNode; demo?: boolean }) {
  return (
    <main className="min-h-[100dvh] bg-[#F1F0E9] px-5 text-[#202923] [font-size:18px]">
      <div className="mx-auto max-w-[520px]">{demo ? <div className="pt-4 text-center"><span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-black text-[#587066]">오늘안부 데모</span></div> : null}{children}</div>
    </main>
  );
}
function Empty({
  title,
  text,
  action,
  recovery = false,
}: {
  title: string;
  text: string;
  action?: string;
  recovery?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center">
      <h1 className="text-2xl font-black">{title}</h1>
      <p className="mt-3 text-lg text-[#617069]">{text}</p>
      {action ? (
        <Link href={action} className="primary">
          오늘 상태 확인하기
        </Link>
      ) : null}
      {recovery ? <div className="mt-6 grid gap-3"><Link href="/" className="primary">처음 화면으로 돌아가기</Link><p className="mt-2 text-base font-bold text-[#617069]">제품을 둘러보시는 중인가요?</p><Link href="/demo/patient" className="secondary">체험 화면으로 이동</Link></div> : null}
    </div>
  );
}
