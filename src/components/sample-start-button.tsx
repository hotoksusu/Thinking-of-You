"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "./ui";
import { applySampleFamilyData } from "@/lib/sample-data";

export function SampleStartButton({ className }: { className?: string }) {
  const router = useRouter();

  function handleClick() {
    applySampleFamilyData();
    router.push("/home");
    router.refresh();
  }

  return (
    <Button tone="secondary" className={className} onClick={handleClick}>
      <Eye size={18} aria-hidden />
      예시로 먼저 둘러보기
    </Button>
  );
}
