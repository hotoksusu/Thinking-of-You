"use client";
import Link from "next/link";
import { AccessGuard } from "@/components/access-guard";
import {
  BarChart3,
  Building2,
  FileText,
  Headphones,
  HeartPulse,
  Users,
} from "lucide-react";

const navigation = [
  { label: "대시보드", icon: BarChart3, active: true },
  { label: "병원 관리", icon: Building2 },
  { label: "계정 관리", icon: Users },
  { label: "환자 이용 현황", icon: HeartPulse },
  { label: "도입 문의", icon: FileText },
  { label: "Pilot · 계약 관리", icon: FileText },
  { label: "고객 지원", icon: Headphones },
];

const hospitals = [
  {
    name: "서울온정형외과",
    owner: "김현정 팀장",
    status: "정상 운영",
    started: "2026. 07. 01",
    registered: 428,
    active: 128,
    contract: "연간 계약",
  },
  {
    name: "해온병원",
    owner: "박민수 원무부장",
    status: "확인 필요",
    started: "2026. 08. 12",
    registered: 96,
    active: 71,
    contract: "초기 도입",
  },
  {
    name: "우리관절의원",
    owner: "이서연 간호팀장",
    status: "설정 중",
    started: "2026. 08. 21",
    registered: 24,
    active: 18,
    contract: "도입 준비",
  },
];

export default function AdminPage(){return <AccessGuard area="operator">{()=> <AdminDashboard/>}</AccessGuard>}
function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 bg-slate-950 px-5 py-7 text-white lg:block">
          <Link href="/" className="text-xl font-black tracking-tight">
            오늘안부 Admin
          </Link>
          <p className="mt-2 text-xs text-slate-400">내부 운영 전용</p>
          <nav className="mt-10 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                    item.active ? "bg-teal-500 text-slate-950" : "text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-teal-700">플랫폼 운영</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">병원 운영 현황</h1>
              <p className="mt-2 text-sm text-slate-500">
                병원 도입, 계정, 환자 이용, 계약 상태를 한곳에서 관리합니다.
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
              데모 데이터
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["운영 병원", "12곳", "이번 달 +2"],
              ["활성 환자", "1,842명", "7일 기준"],
              ["확인 필요 병원", "2곳", "설정 · 운영 점검"],
              ["진행 중 문의", "7건", "도입 상담 포함"],
            ].map(([label, value, note]) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-black">{value}</p>
                <p className="mt-2 text-xs font-semibold text-teal-700">{note}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-black">병원별 운영 상태</h2>
              <p className="mt-1 text-xs text-slate-500">실제 운영 환경에서는 권한에 따라 정보가 제한됩니다.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    {[
                      "병원명",
                      "담당자",
                      "상태",
                      "도입일",
                      "등록 환자",
                      "활성 환자",
                      "Pilot · 계약",
                    ].map((head) => (
                      <th key={head} className="px-5 py-3 font-bold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hospitals.map((hospital) => (
                    <tr key={hospital.name} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-black">{hospital.name}</td>
                      <td className="px-5 py-4 text-slate-600">{hospital.owner}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            hospital.status === "정상 운영"
                              ? "bg-emerald-100 text-emerald-700"
                              : hospital.status === "확인 필요"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {hospital.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{hospital.started}</td>
                      <td className="px-5 py-4 font-bold">{hospital.registered}</td>
                      <td className="px-5 py-4 font-bold">{hospital.active}</td>
                      <td className="px-5 py-4 text-slate-600">{hospital.contract}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
