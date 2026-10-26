import Link from "next/link";

// The static production site has no server-side internal-user authorization.
// Do not mount demo clients (including their sample-storage effects) in exports.
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "development") return <>{children}</>;

  return <main className="grid min-h-[100dvh] place-items-center bg-[#F1F0E9] px-5 text-[#202923]">
    <section className="max-w-md py-8">
      <p className="font-bold text-[#315E50]">오늘안부</p>
      <h1 className="mt-3 text-3xl font-black">개발 전용 화면입니다.</h1>
      <p className="mt-4 text-lg leading-8">운영 사이트에서는 샘플 체험을 제공하지 않습니다. 환자 기록은 병원에서 받은 안내 링크로 이용해주세요.</p>
      <Link href="/patient" className="mt-5 flex min-h-14 items-center justify-center rounded-xl bg-[#315E50] px-5 font-bold text-white">병원 링크 이용 안내</Link>
      <Link href="/" className="mt-3 flex min-h-12 items-center justify-center font-bold text-[#315E50]">처음으로 돌아가기</Link>
    </section>
  </main>;
}
