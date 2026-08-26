"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ClipboardCheck,
  Copy,
  HeartPulse,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import {
  daysSince,
  getInviteUrl,
  loadCareState,
  loadPublicDemoCareState,
  mobilityLabels,
  concernLabels,
  painLabels,
  saveCareState,
  savePublicDemoCareState,
  statusLabels,
  TODAY,
  type CareState,
  type Patient,
  type StatusLevel,
  type SurgeryType,
} from "@/lib/care-mvp";
import { trackCareEvent } from "@/lib/care-analytics";
import { AccessGuard } from "@/components/access-guard";
import { RecoveryTrend } from "@/components/recovery-trend";
import {
  audit,
  canFollowUp,
  canManagePatient,
  createInvitation,
  demoHospitalUsers,
  type HospitalSession,
} from "@/lib/demo-auth";

const order: StatusLevel[] = [
  "needs_attention",
  "watch",
  "no_response",
  "stable",
];
function queueFollowUp(state: CareState, patientId: string) {
  const latestCheck = state.checkIns
    .filter((c) => c.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  return state.followUps
    .filter(
      (f) =>
        f.patientId === patientId &&
        (!latestCheck ||
          f.triggeredFromCheckInId === latestCheck.id ||
          (f.performedAt || f.completedAt) >= latestCheck.createdAt),
    )
    .sort((a, b) =>
      (b.followUpCompletedAt || b.performedAt || b.completedAt).localeCompare(
        a.followUpCompletedAt || a.performedAt || a.completedAt,
      ),
    )[0];
}
function queueRank(state: CareState, patientId: string) {
  const follow = queueFollowUp(state, patientId);
  return !follow ? 0 : follow.status === "scheduled" ? 1 : 2;
}
function reasonLabel(
  state: CareState,
  patientId: string,
  level: StatusLevel,
  statusReason?: string,
) {
  if (level === "no_response") return "오늘 체크인 미응답";
  const checks = state.checkIns
    .filter((c) => c.patientId === patientId)
    .sort((a, b) =>
      (b.createdAt || b.date).localeCompare(a.createdAt || a.date),
    );
  const current = checks[0],
    previous = checks[1],
    reasons: string[] = [];
  if (
    current?.painScore != null &&
    previous?.painScore != null &&
    current.painScore !== previous.painScore
  )
    reasons.push(`통증 ${previous.painScore} → ${current.painScore}`);
  if (current?.dayComparison === "worse") reasons.push("전일 대비 악화");
  if (
    current?.mobilityScore != null &&
    previous?.mobilityScore != null &&
    current.mobilityScore > previous.mobilityScore
  )
    reasons.push("보행 상태 저하");
  if (!reasons.length && (current?.hasConcern || current?.concernText))
    reasons.push(
      current.concernText ||
        concernLabels[current.concerns?.[0] || "other"] ||
        "환자 응답 확인 필요",
    );
  return reasons.length ? reasons.join(" · ") : statusReason;
}
export function HospitalMvp({ demo = false }: { demo?: boolean }) {
  if (demo) return <HospitalInner session={{kind:"hospital",sessionId:"public-demo",userId:"hu_a_nurse",hospitalId:"hospital_001",role:"nurse",expiresAt:"2999-12-31T00:00:00.000Z"}} demo />;
  return (
    <AccessGuard area="hospital">
      {(session) => <HospitalInner session={session as HospitalSession} />}
    </AccessGuard>
  );
}
function HospitalInner({ session, demo = false }: { session: HospitalSession; demo?: boolean }) {
  const [state, setState] = useState<CareState | null>(null),
    [filter, setFilter] = useState<StatusLevel | "all">("all"),
    [surgery, setSurgery] = useState<SurgeryType | "all">("all"),
    [search, setSearch] = useState(""),
    [register, setRegister] = useState(false),
    [selected, setSelected] = useState<Patient | null>(null),
    [toast, setToast] = useState("");
  useEffect(() => {
    const sync = () => {
      const all = demo ? loadPublicDemoCareState() : loadCareState(),
        ids = new Set(
          all.patients
            .filter((p) => p.hospitalId === session.hospitalId)
            .map((p) => p.id),
        );
      setState({
        ...all,
        hospitals: all.hospitals.filter((h) => h.id === session.hospitalId),
        patients: all.patients.filter((p) => ids.has(p.id)),
        checkIns: all.checkIns.filter((c) => ids.has(c.patientId)),
        statuses: all.statuses.filter((s) => ids.has(s.patientId)),
        followUps: all.followUps.filter(
          (f) => f.hospitalId === session.hospitalId,
        ),
      });
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(demo ? "todayanbu:public-demo-care-updated" : "todayanbu:care-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(demo ? "todayanbu:public-demo-care-updated" : "todayanbu:care-updated", sync);
    };
  }, [session.hospitalId, demo]);
  const rows = useMemo(
    () =>
      state?.patients
        .filter(
          (p) =>
            (filter === "all" ||
              state.statuses.find((s) => s.patientId === p.id)?.level ===
                filter) &&
            (surgery === "all" || p.surgeryType === surgery) &&
            p.name.includes(search),
        )
        .sort((a, b) => {
          const rankDifference = queueRank(state, a.id) - queueRank(state, b.id);
          if (rankDifference) return rankDifference;
          return (
            order.indexOf(
              state.statuses.find((s) => s.patientId === a.id)?.level ||
                "stable",
            ) -
            order.indexOf(
              state.statuses.find((s) => s.patientId === b.id)?.level ||
                "stable",
            )
          );
        }) || [],
    [state, filter, surgery, search],
  );
  if (!state)
    return (
      <main className="min-h-screen bg-[#F3F5F3] p-10 text-center font-bold">
        환자 정보를 불러오고 있습니다.
      </main>
    );
  const counts = Object.fromEntries(
    order.map((level) => [
      level,
      state.statuses.filter((s) => s.level === level).length,
    ]),
  ) as Record<StatusLevel, number>;
  return (
    <main className="min-h-screen bg-[#F3F5F3] text-[#1E2923] lg:flex">
      <aside className="hidden w-[220px] shrink-0 bg-[#29483D] p-5 text-white lg:block">
        <Link href="/" className="flex items-center gap-2 text-lg font-black">
          <HeartPulse />
          오늘안부 Care
        </Link>
        <p className="mt-8 px-3 text-xs font-black text-white/50">
          서울온정형외과
        </p>
        <nav className="mt-3 space-y-1">
          <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-black text-[#29483D]">
            <ClipboardCheck />
            오늘 확인
          </div>
          <div className="px-3 py-3 text-sm font-black text-white/70">
            환자 관리
          </div>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex min-h-[68px] items-center justify-between border-b bg-white px-5 lg:px-8">
          <div>
            <p className="text-xs font-black text-[#77837D]">
              HOSPITAL CARE CRM · DEMO
            </p>
            <h1 className="font-black">오늘 확인할 환자</h1>
          </div>
          {!demo ? <button
            onClick={() => setRegister(true)}
            className="flex min-h-12 items-center gap-2 rounded-xl bg-[#315E50] px-4 font-black text-white"
          >
            <UserPlus size={19} /> 환자 등록
          </button> : <span className="rounded-full bg-[#E8F1EA] px-3 py-2 text-sm font-black text-[#315E50]">병원 데모</span>}
        </header>
        <div className="mx-auto max-w-[1400px] p-5 lg:p-8">
          <section
            aria-labelledby="morning-summary-title"
            className="rounded-[24px] border border-[#DCE5DF] bg-white p-5 shadow-sm lg:p-7"
          >
            <p className="text-sm font-black text-[#315E50]">
                {new Date(`${TODAY}T12:00:00+09:00`).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })} · 오늘 퇴원환자 관리
            </p>
            <h2
              id="morning-summary-title"
              className="mt-2 text-3xl font-black lg:text-4xl"
            >
              오늘 퇴원환자 관리
            </h2>
            <p className="mt-1 text-lg font-bold text-[#4B5850]">
              오늘 먼저 확인할 환자를 선택해보세요.
            </p>
            <p className="mt-3 max-w-4xl font-semibold leading-6 text-[#66736C]">
              환자 응답 변화를 기준으로 확인 우선순위를 정리합니다. 최종 판단은
              의료진이 합니다.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {order.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(filter === level ? "all" : level)}
                  aria-pressed={filter === level}
                  className={`rounded-[20px] border p-5 text-left transition-colors ${filter === level ? "border-[#315E50] bg-[#315E50] text-white" : "border-[#DCE5DF] bg-white hover:border-[#B9C9BF]"}`}
                >
                  <p className="text-sm font-bold opacity-70">
                    {statusLabels[level]}
                  </p>
                  <strong className="mt-2 block text-3xl">
                    {counts[level]}명
                  </strong>
                </button>
              ))}
            </div>
          </section>
          <div className="mt-7 flex flex-col gap-3 lg:flex-row">
            <label className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border bg-white px-4">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="환자 이름 검색"
                className="w-full bg-transparent outline-none"
              />
            </label>
            <select
              value={surgery}
              onChange={(e) =>
                setSurgery(e.target.value as SurgeryType | "all")
              }
              className="min-h-12 rounded-xl border bg-white px-4 font-bold"
            >
              <option value="all">전체 수술 유형</option>
              {["인공관절", "척추", "골절", "기타"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <button
              onClick={() => setFilter("all")}
              className="min-h-12 rounded-xl border bg-white px-4 font-bold"
            >
              전체 보기
            </button>
          </div>
          <section
            aria-labelledby="today-patients-title"
            className="mt-4 overflow-hidden rounded-[24px] border border-[#DDE5E0] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-[#F8FAF9] px-5 py-4 lg:px-6">
              <h2 id="today-patients-title" className="text-xl font-black">
                오늘 확인할 환자
              </h2>
              <p className="max-w-2xl text-sm font-semibold text-[#66736C]">
                환자 응답 변화를 기준으로 확인 우선순위를 정리합니다. 최종
                판단은 의료진이 합니다.
              </p>
            </div>
            {rows.length ? (
              rows.map((p) => {
                const status = state.statuses.find((s) => s.patientId === p.id),
                  level = status?.level || "stable";
                const last = state.checkIns
                  .filter((c) => c.patientId === p.id)
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
                const follow = queueFollowUp(state, p.id);
                return (
                  <article
                    key={p.id}
                    className="grid gap-4 border-b p-5 last:border-0 xl:grid-cols-[240px_1fr_230px] xl:items-center"
                  >
                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${level === "needs_attention" ? "bg-[#FFF0E9] text-[#A74A2D]" : level === "watch" ? "bg-amber-100 text-amber-800" : level === "no_response" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"}`}
                      >
                        {statusLabels[level]}
                      </span>
                      <h3 className="mt-3 text-xl font-black">
                        {p.name}{" "}
                        <span className="text-sm text-[#68766F]">
                          {p.age}세
                        </span>
                      </h3>
                      <p className="mt-1 text-sm font-bold text-[#68766F]">
                        {p.surgeryType} · 퇴원 {daysSince(p.dischargeDate)}일차
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-black ${status?.level === "needs_attention" ? "text-[#A74A2D]" : status?.level === "watch" ? "text-amber-700" : "text-[#315E50]"}`}
                      >
                        <strong className="block">확인 이유</strong>
                        <span>
                          {reasonLabel(state, p.id, level, status?.reason)}
                        </span>
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#66736C]">
                        {last
                          ? `${last.date} ${new Date(last.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 체크`
                          : "최근 체크인 없음"}
                      </p>
                      <p
                        className={`mt-2 text-sm font-black ${!follow || follow.status === "scheduled" ? "text-[#A74A2D]" : "text-emerald-700"}`}
                      >
                        {!follow
                          ? "미처리"
                          : follow.status === "scheduled"
                            ? `Follow-up 예정 · ${follow.followUpDueDate || "예정일 미입력"}`
                            : `${new Date(follow.followUpCompletedAt || follow.completedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} ${follow.followUpHandledBy || follow.handledBy} 처리 완료`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        trackCareEvent("hospital_patient_opened", {
                          patientId: p.id,
                        });
                        window.location.href = demo ? `/demo/hospital/patient?patientId=${encodeURIComponent(p.id)}` : `/care/hospital/kim?patientId=${encodeURIComponent(p.id)}`;
                      }}
                      className="min-h-12 rounded-xl bg-[#315E50] px-5 font-black text-white"
                    >
                      상세 보기
                    </button>
                  </article>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Check className="mx-auto text-[#315E50]" />
                <h3 className="mt-4 text-xl font-black">
                  현재 해당 환자가 없습니다.
                </h3>
                <p className="mt-2 text-[#68766F]">
                  다른 필터를 선택해 보세요.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
      {register ? (
        <RegisterModal
          state={state}
          close={() => setRegister(false)}
          done={(next, message) => {
            setState(next);
            setToast(message);
          }}
        />
      ) : null}
      {selected ? (
        <PatientDetail
          state={state}
          patient={selected}
          close={() => setSelected(null)}
          saveState={demo ? savePublicDemoCareState : saveCareState}
          update={(next) => {
            setState(next);
            setToast("후속 조치를 처리 완료로 기록했습니다.");
          }}
        />
      ) : null}
      {toast ? (
        <div className="fixed bottom-5 right-5 z-[60] rounded-xl bg-[#29483D] px-5 py-4 font-black text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
function RegisterModal({
  state,
  close,
  done,
}: {
  state: CareState;
  close: () => void;
  done: (s: CareState, m: string) => void;
}) {
  const [form, setForm] = useState({
      name: "",
      phone: "",
      age: "",
      surgeryType: "인공관절" as SurgeryType,
      dischargeDate: TODAY,
    }),
    [created, setCreated] = useState<Patient | null>(null);
  function submit() {
    if (!form.name || !form.phone || !form.age || !form.dischargeDate) return;
    const patient: Patient = {
      id: `patient_${Date.now()}`,
      hospitalId: state.hospitals[0].id,
      name: form.name,
      phone: form.phone,
      age: Number(form.age),
      surgeryType: form.surgeryType,
      dischargeDate: form.dischargeDate,
      createdAt: new Date().toISOString(),
      status: "invited",
    };
    const next = {
      ...state,
      patients: [...state.patients, patient],
      statuses: [
        ...state.statuses,
        {
          patientId: patient.id,
          level: "no_response" as const,
          reason: "아직 체크인 응답이 없음",
          updatedAt: new Date().toISOString(),
        },
      ],
    };
    saveCareState(next);
    trackCareEvent("patient_invited", { patientId: patient.id });
    done(next, "환자가 등록되었습니다.");
    setCreated(patient);
  }
  const url = created ? `${location.origin}${getInviteUrl(created.id)}` : "";
  return (
    <Modal
      close={close}
      title={created ? "초대 링크가 생성되었습니다" : "신규 환자 등록"}
    >
      {created ? (
        <div>
          <p className="rounded-xl bg-[#EEF4F0] p-4 font-bold break-all">
            {url}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                done(state, "초대 링크를 복사했습니다.");
              }}
              className="min-h-12 rounded-xl border-2 border-[#315E50] font-black text-[#315E50]"
            >
              <Copy className="mr-2 inline" size={18} />
              링크 복사
            </button>
            <a
              href={url}
              target="_blank"
              className="flex min-h-12 items-center justify-center rounded-xl bg-[#315E50] font-black text-white"
            >
              환자 화면 열기
            </a>
          </div>
          <p className="mt-4 text-sm font-bold text-[#68766F]">
            Demo: 실제 운영 시 문자 발송 연동 예정
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {[
            ["name", "환자 이름", "text"],
            ["phone", "휴대전화 번호", "tel"],
            ["age", "연령", "number"],
            ["dischargeDate", "퇴원일", "date"],
          ].map(([key, label, type]) => (
            <label key={key} className="font-bold">
              {label}
              <input
                type={type}
                value={String(form[key as keyof typeof form])}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 min-h-12 w-full rounded-xl border-2 p-3"
              />
            </label>
          ))}
          <label className="font-bold">
            수술 유형
            <select
              value={form.surgeryType}
              onChange={(e) =>
                setForm({ ...form, surgeryType: e.target.value as SurgeryType })
              }
              className="mt-1 min-h-12 w-full rounded-xl border-2 p-3"
            >
              {["인공관절", "척추", "골절", "기타"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <button
            onClick={submit}
            className="mt-2 min-h-14 rounded-xl bg-[#315E50] text-lg font-black text-white"
          >
            환자 등록하기
          </button>
        </div>
      )}
    </Modal>
  );
}
function PatientDetail({
  state,
  patient,
  close,
  update,
  saveState,
}: {
  state: CareState;
  patient: Patient;
  close: () => void;
  update: (s: CareState) => void;
  saveState: (s: CareState) => void;
}) {
  const [action, setAction] = useState(""),
    [note, setNote] = useState("");
  const status = state.statuses.find((s) => s.patientId === patient.id);
  const checks = state.checkIns
    .filter((c) => c.patientId === patient.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const follows = state.followUps
    .filter((f) => f.patientId === patient.id)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  function complete() {
    if (!action) return;
    const now = new Date().toISOString();
    const next = {
      ...state,
      followUps: [
        ...state.followUps,
        {
          id: `follow_${Date.now()}`,
          patientId: patient.id,
          hospitalId: patient.hospitalId,
          action,
          note,
          status: "completed" as const,
          handledBy: "박간호",
          createdAt: now,
          completedAt: now,
        },
      ],
    };
    saveState(next);
    trackCareEvent("followup_completed", { patientId: patient.id, action });
    update(next);
  }
  return (
    <Modal close={close} title={`${patient.name} · ${patient.age}세`} wide>
      <RecoveryTrend checks={checks} followUps={follows} audience="hospital" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <p className="font-bold text-[#68766F]">
            {patient.surgeryType} · 퇴원 후 {daysSince(patient.dischargeDate)}일
          </p>
          <h3 className="mt-5 text-sm font-black text-[#315E50]">현재 상태</h3>
          <p className="mt-1 text-2xl font-black">
            {statusLabels[status?.level || "stable"]}
          </p>
          <h3 className="mt-5 text-sm font-black text-[#315E50]">주요 이유</h3>
          <p className="mt-1 font-bold leading-7">{status?.reason}</p>
          <h3 className="mt-6 text-lg font-black">최근 체크인</h3>
          <div className="mt-3 space-y-2">
            {checks.length ? (
              checks.map((c) => (
                <div key={c.id} className="rounded-xl bg-[#F3F5F3] p-4">
                  <strong>{c.date}</strong>
                  <p className="mt-1 text-sm">
                    통증 {painLabels[c.pain]} · 움직임{" "}
                    {mobilityLabels[c.mobility]}
                  </p>
                  {c.hasConcern ? (
                    <p className="mt-1 text-sm font-bold">
                      추가 불편: {c.concernText || "있음"}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-[#68766F]">아직 체크인 기록이 없습니다.</p>
            )}
          </div>
        </section>
        <section className="rounded-2xl border p-5">
          <h3 className="text-xl font-black">후속 조치 기록</h3>
          <p className="mt-1 text-sm text-[#68766F]">
            환자 상태와 병원의 처리 여부는 별도로 유지됩니다.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              "전화 확인",
              "추가 관찰",
              "내원 안내",
              "특이사항 없음",
              "기타",
            ].map((x) => (
              <button
                key={x}
                onClick={() => {
                  setAction(x);
                  trackCareEvent("followup_started", { patientId: patient.id });
                }}
                className={`min-h-12 rounded-xl border-2 font-black ${action === x ? "border-[#315E50] bg-[#E8F1EA]" : ""}`}
              >
                {x}
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="추가 메모 (선택)"
            className="mt-3 min-h-20 w-full rounded-xl border-2 p-3"
          />
          <button
            disabled={!action}
            onClick={complete}
            className="mt-3 min-h-14 w-full rounded-xl bg-[#315E50] font-black text-white disabled:bg-[#B7C2BC]"
          >
            처리 완료
          </button>
          {follows.length ? (
            <div className="mt-5 border-t pt-4">
              <h4 className="font-black">처리 기록</h4>
              {follows.map((f) => (
                <div
                  key={f.id}
                  className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm"
                >
                  <strong>
                    {f.action} · {f.handledBy}
                  </strong>
                  <p>{new Date(f.completedAt).toLocaleString("ko-KR")}</p>
                  {f.note ? <p className="mt-1">{f.note}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </Modal>
  );
}
function Modal({
  close,
  title,
  children,
  wide = false,
}: {
  close: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        className={`mx-auto max-h-[92dvh] w-full overflow-y-auto rounded-[26px] bg-white p-6 ${wide ? "max-w-[980px]" : "max-w-[560px]"}`}
      >
        <header className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black">{title}</h2>
          <button
            onClick={close}
            aria-label="닫기"
            className="grid size-12 place-items-center rounded-full bg-[#EEF2EF]"
          >
            <X />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
