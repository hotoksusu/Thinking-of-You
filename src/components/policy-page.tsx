import Link from "next/link";
export function PolicyPage({ title, notice, children }: { title: string; notice?: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#FFF9F0] px-5 py-12 text-[#20302C]"><article className="mx-auto max-w-3xl rounded-[28px] bg-white p-7 shadow-sm sm:p-10"><Link href="/" className="font-black text-[#315B3D]">← 오늘안부</Link><h1 className="mt-6 text-3xl font-black sm:text-4xl">{title}</h1>{notice && <p className="mt-5 rounded-2xl bg-[#FFF1D9] p-4 font-bold leading-7">{notice}</p>}<div className="mt-8 space-y-7 text-base font-medium leading-8 text-[#43534C]">{children}</div></article></main>;
}
export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="text-xl font-black text-[#20302C]">{title}</h2><div className="mt-2">{children}</div></section>; }
