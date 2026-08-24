import Link from "next/link";
import { ArrowLeft, ChevronRight, HeartHandshake, Home, UserRound } from "lucide-react";

const roles = [
  {
    label: "환자",
    text: "병원에서 퇴원 후 회복관리를 안내받았습니다.",
    href: "/care/onboarding?role=patient",
    icon: UserRound,
    tone: "bg-[#FFF0E4] border-[#F6C9A7]",
    iconTone: "bg-[#FFE2CC] text-[#D85B24]",
    arrowTone: "text-[#D85B24]",
  },
  {
    label: "보호자",
    text: "가족의 회복 상태를 함께 확인합니다.",
    href: "/care/onboarding?role=guardian",
    icon: HeartHandshake,
    tone: "bg-[#EEF4FF] border-[#BFD2F5]",
    iconTone: "bg-[#DCE8FF] text-[#315FA8]",
    arrowTone: "text-[#315FA8]",
  },
];

export default function StartPage() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#FFF9F0] text-[#20302C]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[620px] flex-col px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex shrink-0 items-center justify-between">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-full px-1 text-base font-black text-[#52635C]"
            aria-label="첫 화면으로 돌아가기"
          >
            <ArrowLeft size={22} aria-hidden />
            뒤로
          </Link>
          <div className="flex items-center gap-2.5" aria-label="오늘안부">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EEF5E9] text-[#52725B]">
              <Home size={22} aria-hidden />
            </span>
            <span className="text-[1.35rem] font-black text-[#48634F]">오늘안부</span>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col justify-center py-5">
          <div className="text-center">
            <p className="text-lg font-black text-[#1D6B5B]">퇴원 후에도 병원과 함께</p>
            <h1 className="mt-4 text-[2.25rem] font-black leading-[1.16] tracking-[-0.01em] text-[#162720] sm:text-[2.75rem]">
              누구로 시작하시나요?
            </h1>
            <p className="mt-4 text-xl font-bold text-[#5E6A65]">아래에서 골라 주세요.</p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <Link
                  key={role.label}
                  href={role.href}
                  className={`group flex min-h-[124px] items-center gap-4 rounded-[26px] border-2 p-5 shadow-[0_14px_34px_rgba(55,72,55,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(55,72,55,0.12)] focus:outline-none focus:ring-4 focus:ring-[#F5A36D]/35 sm:min-h-[138px] sm:p-6 ${role.tone}`}
                >
                  <span className={`flex size-16 shrink-0 items-center justify-center rounded-[22px] sm:size-[72px] ${role.iconTone}`}>
                    <Icon size={34} strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-[1.55rem] font-black leading-tight text-[#17251F] sm:text-[1.8rem]">
                      {role.label}
                    </span>
                    <span className="mt-2 block text-[1.08rem] font-bold leading-7 text-[#43534C] sm:text-xl">
                      {role.text}
                    </span>
                  </span>
                  <ChevronRight
                    size={34}
                    strokeWidth={2.8}
                    className={`shrink-0 transition group-hover:translate-x-1 ${role.arrowTone}`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <div className="shrink-0 pb-2 text-center"><Link href="/care/hospital" className="inline-flex min-h-12 items-center justify-center font-black text-[#1D6B5B] underline underline-offset-4">병원 담당자 로그인</Link><p className="text-sm font-bold leading-7 text-[#68756F]">기존 가족 안부 기능은 보호자 Care로 계속 이용할 수 있습니다.</p></div>
      </div>
    </main>
  );
}
