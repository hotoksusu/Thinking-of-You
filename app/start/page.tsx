import Link from "next/link";
import { ArrowLeft, ChevronRight, HeartHandshake, Home, Smile } from "lucide-react";

const roles = [
  {
    label: "부모님",
    text: "평소처럼 생활하시면 됩니다.",
    href: "/app?role=parent",
    icon: Smile,
    tone: "bg-[#FFF0E4] border-[#F6C9A7]",
    iconTone: "bg-[#FFE2CC] text-[#D85B24]",
    arrowTone: "text-[#D85B24]",
  },
  {
    label: "가족",
    text: "생활 변화와 안심을 확인해요.",
    href: "/app?role=family",
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
            <p className="text-lg font-black text-[#6B7A72]">생활이 안심이 되는 하루</p>
            <h1 className="mt-4 text-[2.25rem] font-black leading-[1.16] tracking-[-0.01em] text-[#162720] sm:text-[2.75rem]">
              오늘안부를
              <br />
              누가 사용하시나요?
            </h1>
            <p className="mt-4 text-xl font-bold text-[#5E6A65]">맞는 화면을 선택해 주세요.</p>
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

        <p className="shrink-0 pb-2 text-center text-base font-bold leading-7 text-[#68756F]">
          부모님은 입력하지 않고,
          <br className="sm:hidden" />
          평소처럼 생활하시면 됩니다.
        </p>
      </div>
    </main>
  );
}
