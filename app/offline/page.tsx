import Link from "next/link";
import { WifiOff } from "lucide-react";
import { AnsimiCharacter } from "@/components/ansimi-character";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F9FAFB] px-5 py-10 text-[#1F2937]">
      <section className="w-full max-w-[430px] rounded-[30px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <AnsimiCharacter state="offline" motion="once" size="small" ariaLabel="인터넷 연결을 차분히 기다리는 안심이" />
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <WifiOff size={24} aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-black leading-tight">
          인터넷 연결이
          <br />
          불안정해도 괜찮아요.
        </h1>
        <p className="mt-4 font-semibold leading-7 text-[#6B7280]">
          연결되면 자동으로 다시 확인할게요. 따로 하실 일은 없습니다.
        </p>
        <Link
          href="/app?role=parent"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#2563EB] px-5 font-black text-white"
        >
          오늘 화면으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
