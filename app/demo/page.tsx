"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { applySampleFamilyData } from "@/lib/sample-data";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    applySampleFamilyData();
    router.replace("/home");
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center bg-brand-background px-5 text-center text-brand-text">
      <span className="flex size-14 items-center justify-center rounded-full bg-white text-brand-primary shadow-soft">
        <HeartHandshake size={28} aria-hidden />
      </span>
      <h1 className="brand-title mt-4 text-2xl">예시 화면을 준비하고 있어요</h1>
      <p className="soft-copy mt-2 text-sm text-brand-subtext">
        오늘안부의 주요 화면으로 곧 이동합니다.
      </p>
    </main>
  );
}
