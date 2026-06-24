import {
  ArrowRight,
  CheckCircle2,
  Home,
  MessageCircle,
  Phone,
  Smartphone,
  WifiOff,
} from "lucide-react";
import { InstallGuide } from "@/components/install-guide";

const startSteps = [
  {
    title: "오늘안부는 앱스토어 설치가 필요 없어요",
    detail: "링크를 열고 홈화면에 추가하면 아이콘으로 바로 시작할 수 있습니다.",
    icon: Smartphone,
  },
  {
    title: "자녀가 먼저 시작해요",
    detail: "가족 계정을 만들고 부모님 이름과 안부 확인 방식을 정합니다.",
    icon: Home,
  },
  {
    title: "부모님 휴대폰에 홈화면 추가하기",
    detail: "부모님 휴대폰에서 초대 링크를 열고 첫 화면에 오늘안부를 꺼내둡니다.",
    icon: Phone,
  },
  {
    title: "인터넷이 불안정해도 먼저 남길 수 있어요",
    detail: "오늘 안부는 기기에 잠시 보관되고, 연결되면 가족에게 전달됩니다.",
    icon: WifiOff,
  },
  {
    title: "가족은 안심 리포트를 확인해요",
    detail: "부모님 안부 도착 여부, 오늘의 안심 상태, 평소와 다른 변화를 확인합니다.",
    icon: CheckCircle2,
  },
];

const seniorOptions = ["괜찮아요", "조금 피곤해요", "이야기하고 싶어요"];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <nav className="flex items-center gap-4 text-sm font-bold text-[#6B7280]">
          <a href="/" className="transition hover:text-[#2563EB]">
            서비스 소개
          </a>
          <a href="/app" className="transition hover:text-[#2563EB]">
            오늘안부 체험
          </a>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black text-[#F97316]">설치와 사용 시작 가이드</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            부모님 휴대폰에
            <br />
            오늘안부를 꺼내두세요.
          </h1>
          <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
            자녀가 먼저 연결하고, 부모님은 큰 버튼으로 오늘 안부만 남기면 됩니다.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="/app"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-7 font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]"
            >
              부모님 안부 시작하기
              <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href="#install"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#FED7AA] bg-white px-7 font-black text-[#C2410C]"
            >
              설치 방법 바로 보기
            </a>
          </div>
        </div>

        <article className="rounded-[30px] bg-[#FFF7ED] p-6 shadow-[0_24px_70px_rgba(249,115,22,0.08)]">
          <p className="text-sm font-black text-[#F97316]">부모님 화면 예시</p>
          <h2 className="mt-3 text-3xl font-black">오늘 안부 남기기</h2>
          <div className="mt-5 grid gap-3">
            {seniorOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="min-h-14 rounded-2xl bg-white px-5 text-left text-lg font-black shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
              >
                {option}
              </button>
            ))}
          </div>
          <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#F97316]">
            가족에게 전달됐어요
          </p>
        </article>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8">
          <h2 className="text-2xl font-black">시작 순서</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {startSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[#FFEDD5] text-sm font-black text-[#F97316]">
                    {index + 1}
                  </span>
                  <Icon size={22} className="mt-5 text-[#F97316]" aria-hidden />
                  <h3 className="mt-3 text-lg font-black leading-7">{item.title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#6B7280]">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="install" className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8">
        <InstallGuide />
      </section>

      <section className="mx-auto grid w-full max-w-[1120px] gap-4 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <article className="rounded-[28px] bg-[#EFF6FF] p-6">
          <p className="text-sm font-black text-[#2563EB]">가족 화면</p>
          <h2 className="mt-3 text-3xl font-black">부모님 안부가 도착했어요</h2>
          <div className="mt-5 grid gap-3">
            {["오늘의 안심 상태", "평소와 다른 변화", "AI 안심 리포트", "관심 표현 보내기"].map((item) => (
              <p key={item} className="rounded-2xl bg-white px-4 py-3 font-black">
                {item}
              </p>
            ))}
          </div>
        </article>
        <article className="rounded-[28px] bg-[#111827] p-6 text-white">
          <p className="text-sm font-black text-[#93C5FD]">연결이 불안정할 때</p>
          <h2 className="mt-3 text-3xl font-black">먼저 남기면 됩니다</h2>
          <p className="mt-4 font-semibold leading-7 text-white/70">
            인터넷이 연결되면 자동으로 전달돼요. 부모님은 복잡한 설정을 몰라도 괜찮습니다.
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <MessageCircle size={22} className="text-[#FDE047]" aria-hidden />
            <p className="font-black">오늘 안부가 잠시 보관됐어요</p>
          </div>
        </article>
      </section>
    </main>
  );
}
