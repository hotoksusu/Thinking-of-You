import Link from "next/link";
import Image from "next/image";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="오늘안부 홈">
      <Image src="/brand/oneul-anbu-icon.png" alt="" width={34} height={34} className="size-[34px] object-contain" />
      {!compact ? <span className="text-xl font-black text-[#F45D18]">오늘안부</span> : null}
    </Link>
  );
}

