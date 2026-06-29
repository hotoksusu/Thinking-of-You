import Link from "next/link";
import { Flower2 } from "lucide-react";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="오늘안부 홈">
      <span className="flex size-10 items-center justify-center rounded-full bg-[#FF6B22] text-white shadow-[0_8px_18px_rgba(255,107,34,0.2)]">
        <Flower2 size={23} strokeWidth={2.8} aria-hidden />
      </span>
      {!compact ? <span className="text-xl font-black text-[#F45D18]">오늘안부</span> : null}
    </Link>
  );
}

