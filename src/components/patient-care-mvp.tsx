"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
    if (mode === "onboarding" && found)
      trackCareEvent("patient_onboarding_started", { patientId: found.id });
    if (mode === "checkin" && found)
      trackCareEvent("checkin_started", { patientId: found.id });
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
          오늘 몸은 어떠세요?
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
              1분이면 오늘 확인이 끝나요.
              <br />
              간단하게 알려주세요.
            </p>
            <Link href="/app/patient/checkin" className="primary">
              오늘 상태 확인하기 <ChevronRight />
            </Link>
          </>
        )}
      </section>
      <p className="mt-5 rounded-2xl bg-white p-4 text-[16px] font-bold leading-7 text-[#46574F]">
        갑자기 많이 아프거나 급한 상황이라면 병원 또는 119에 연락하세요.
      </p>
    </PatientShell>
  );
}
type AdaptiveStep = "comparison" | "concern" | "pain" | "mobility" | "complete";
const adaptiveConcerns = [
  ["pain", "통증"],
  ["swelling", "붓기"],
  ["mobility", "움직임"],
  ["incision_discomfort", "상처"],
  ["other", "기타"],
] as const;

function AdaptiveCheckin({ patient, todayCheck, history, guardianMode, demo }: { patient: Patient; todayCheck?: CheckIn; history: CheckIn[]; guardianMode: boolean; demo: boolean }) {
  const [step, setStep] = useState<AdaptiveStep>("comparison");
  const [dayComparison, setDayComparison] = useState<DayComparison | null>(null);
  const [concern, setConcern] = useState<(typeof adaptiveConcerns)[number][0] | null>(null);
  const [customConcern, setCustomConcern] = useState("");
  const [painScore, setPainScore] = useState<number | null>(null);
  const [mobility, setMobility] = useState<number | null>(null);
  const [savedCheck, setSavedCheck] = useState<CheckIn | null>(todayCheck || null);

  const currentCheck = savedCheck || todayCheck;
  if (currentCheck || step === "complete") {
    const comparison = currentCheck?.dayComparison || dayComparison || "same";
    return <PatientShell demo={demo}><div className="py-12 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#DDEDE3] text-[#315E50]"><Check size={42} /></span><h1 className="mt-6 text-[2rem] font-black leading-tight">오늘 상태가 기록됐어요.</h1>{currentCheck?.source === "guardian" ? <p className="mt-3 text-lg font-black text-[#315E50]">보호자 대리 입력으로 저장했습니다.</p> : null}<p className="mt-4 rounded-2xl bg-white p-5 text-left text-xl font-bold leading-8 text-[#46574F]">오늘은 어제보다 {comparisonLabels[comparison]}라고 알려주셨어요.</p>{currentCheck?.hasConcern ? <p className="mt-3 rounded-2xl bg-white p-5 text-left text-lg font-bold leading-8 text-[#46574F]">불편한 점: {currentCheck.concernText}</p> : null}<p className="mt-4 text-lg font-semibold leading-8 text-[#596A62]">입력한 내용은 병원에서 회복 상태를 확인할 때 참고할 수 있어요.</p>{demo ? <><Link href="/demo/hospital" className="primary">병원에서는 어떻게 보일까요?</Link><Link href="/" className="secondary">처음으로</Link></> : <Link href={guardianMode ? "/care/guardian" : "/app/patient"} className="primary">{guardianMode ? "보호자 화면으로" : "홈으로 돌아가기"}</Link>}</div></PatientShell>;
  }

  function chooseComparison(value: DayComparison) {
    setDayComparison(value);
    setStep(value === "worse" ? "concern" : "pain");
  }

  function goBack() {
    if (step === "concern") setStep("comparison");
    else if (step === "pain") setStep(dayComparison === "worse" ? "concern" : "comparison");
    else if (step === "mobility") setStep("pain");
  }

  function finish(selectedMobility: number) {
    if (painScore === null || !dayComparison) return;
    const currentState = demo ? loadPublicDemoCareState() : loadCareState();
    const existingToday = currentState.checkIns.find(check => check.patientId === patient.id && (check.checkInDate || check.date) === TODAY);
    if (existingToday) { setSavedCheck(existingToday); setStep("complete"); return; }
    const hasConcern = dayComparison === "worse" && concern !== null;
    const storedConcerns = !hasConcern || concern === "pain" || concern === "mobility" ? [] : [concern];
    const concernText = !hasConcern ? "" : concern === "pain" ? "통증" : concern === "mobility" ? "움직임" : concern === "other" ? customConcern.trim() || "기타" : concernLabels[concern];
    const createdAt = new Date().toISOString();
    const episode = currentState.episodes.find(e => e.patientId === patient.id);
    const check: CheckIn = { id: `check_${Date.now()}`, episodeId: episode?.id, patientId: patient.id, date: TODAY, checkInDate: TODAY, pain: demoPainBucket(painScore), painScore, mobility: selectedMobility, mobilityScore: selectedMobility, hasConcern, concernStatus: hasConcern ? "reported" : "none", concernText, concerns: storedConcerns, customConcern: concern === "other" ? customConcern.trim() : "", dayComparison, source: guardianMode ? "guardian" : "patient", createdAt, updatedAt: createdAt };
    const previous = currentState.checkIns.filter(item => item.patientId === patient.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || history[0];
    const priority = prioritizationProvider.evaluate({ current: { ...check, painScore }, previous: previous ? { ...previous, painScore: previous.painScore ?? undefined } : undefined });
    const status: PatientStatus = { patientId: patient.id, level: priority.level, reason: priority.explanation, reasonCodes: priority.reasonCodes, ruleVersion: priority.ruleVersion, source: "system", updatedAt: priority.createdAt };
    const next = { ...currentState, checkIns: [...currentState.checkIns, check], statuses: [...currentState.statuses.filter(s => s.patientId !== patient.id), status] };
    try { (demo ? savePublicDemoCareState : saveCareState)(next); setMobility(selectedMobility); setSavedCheck(check); setStep("complete"); trackCareEvent("checkin_completed", { patientId: patient.id, source: check.source }); trackCareEvent("patient_status_changed", { patientId: patient.id, level: status.level }); }
    catch { alert("저장하지 못했어요. 잠시 후 다시 시도해 주세요."); }
  }

  const stepNumber = step === "comparison" ? 1 : step === "concern" ? 2 : dayComparison === "worse" ? step === "pain" ? 3 : 4 : step === "pain" ? 2 : 3;
  const totalSteps = dayComparison === "worse" ? 4 : 3;
  return <PatientShell><div className="flex min-h-[100dvh] flex-col py-5">{guardianMode ? <p className="mb-3 rounded-xl bg-white p-3 text-lg font-black text-[#315E50]">보호자 대리 입력 · {patient.name}님</p> : null}<p className="text-lg font-black text-[#315E50]">{stepNumber} / {totalSteps}</p><div className="mt-4 h-2 rounded-full bg-[#DDE5E0]"><div className="h-full rounded-full bg-[#315E50] transition-all" style={{ width: `${stepNumber / totalSteps * 100}%` }} /></div>
    <h1 className="mt-9 text-[2rem] font-black leading-tight">{step === "comparison" ? "오늘은 어제보다 어떠세요?" : step === "concern" ? "무엇이 가장 불편하세요?" : step === "pain" ? "오늘 통증은 어느 정도인가요?" : "오늘 움직이기는 어떠셨어요?"}</h1>
    {step === "comparison" ? <div className="mt-8 grid gap-4">{Object.entries(comparisonLabels).map(([id, label]) => <button key={id} onClick={() => chooseComparison(id as DayComparison)} className="min-h-[72px] rounded-2xl border-2 border-[#C8D3CD] bg-white px-5 text-left text-xl font-black active:border-[#315E50] active:bg-[#E8F1EA]">{label}</button>)}</div> : null}
    {step === "concern" ? <><div className="mt-8 grid gap-3">{adaptiveConcerns.map(([id, label]) => <button key={id} onClick={() => setConcern(id)} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left text-xl font-black ${concern === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div>{concern === "other" ? <textarea value={customConcern} onChange={e => setCustomConcern(e.target.value)} maxLength={100} placeholder="불편한 점을 짧게 알려주세요." className="mt-4 min-h-24 w-full rounded-2xl border-2 border-[#C8D3CD] bg-white p-4 text-lg" /> : null}</> : null}
    {step === "pain" ? <><div className="mt-8 grid grid-cols-6 gap-2">{Array.from({ length: 11 }, (_, i) => <button key={i} onClick={() => setPainScore(i)} className={`min-h-[58px] rounded-xl border-2 text-xl font-black ${painScore === i ? "border-[#315E50] bg-[#315E50] text-white" : "border-[#C8D3CD] bg-white"}`}>{i}</button>)}</div><p className="mt-5 rounded-2xl bg-white p-4 text-lg font-bold leading-8 text-[#596A62]">0은 통증 없음, 10은 가장 심한 통증이에요.</p></> : null}
    {step === "mobility" ? <div className="mt-8 grid gap-3">{mobilityLabels.map((label, i) => <button key={label} onClick={() => setMobility(i)} className={`min-h-[68px] rounded-2xl border-2 px-5 text-left text-lg font-black ${mobility === i ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step !== "comparison" ? <div className="mt-auto grid grid-cols-[auto_1fr] gap-3 pt-8"><button onClick={goBack} className="min-h-[60px] rounded-2xl border-2 border-[#315E50] px-5 text-lg font-black text-[#315E50]"><ArrowLeft className="mr-2 inline" />이전</button><button disabled={step === "concern" ? !concern || (concern === "other" && !customConcern.trim()) : step === "pain" ? painScore === null : mobility === null} onClick={() => { if (step === "concern") setStep("pain"); else if (step === "pain") setStep("mobility"); else if (mobility !== null) finish(mobility); }} className="min-h-[60px] rounded-2xl bg-[#315E50] px-5 text-xl font-black text-white disabled:bg-[#B7C2BC]">{step === "mobility" ? "오늘 기록 마치기" : "다음"}</button></div> : null}
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
