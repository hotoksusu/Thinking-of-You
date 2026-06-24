export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-8 text-[#16201b]">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[760px] place-items-center">
        <div className="w-full rounded-lg border border-[#dfe5dc] bg-white p-8 shadow-[0_22px_60px_rgba(24,36,29,0.12)] sm:p-12">
          <p className="text-base font-black text-[#1f8a5b]">오늘안부</p>
          <h1 className="mt-4 text-[2.7rem] font-black leading-tight tracking-normal sm:text-[4.2rem]">
            부모님의 작은 변화를
            <br />
            AI가 먼저 알려드립니다
          </h1>
          <p className="mt-6 max-w-[560px] text-lg font-semibold leading-8 text-[#66736b]">
            매일의 안부를 기록하는 것이 아니라 평소와 다른 신호를 발견해 부모님의 안심 상태를
            알려드립니다.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <a
              href="/app"
              className="flex min-h-16 items-center justify-center rounded-lg bg-[#16201b] px-6 text-lg font-black text-white transition hover:bg-[#223028] focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              오늘안부 시작하기
            </a>
            <a
              href="/guide"
              className="flex min-h-16 items-center justify-center rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] px-6 text-lg font-black text-[#16201b] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              서비스 둘러보기
            </a>
          </div>
          <a
            href="/app"
            className="mt-7 inline-flex text-sm font-black text-[#1f8a5b] underline-offset-4 hover:underline"
          >
            이미 등록하셨나요? 안심 상태 확인하기
          </a>
        </div>
      </section>
    </main>
  );
}
