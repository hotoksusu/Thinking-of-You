import { Smartphone } from "lucide-react";

export function InstallGuide({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "rounded-[24px] bg-[#EFF6FF] p-5" : "rounded-[28px] bg-[#EFF6FF] p-6"}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB]">
          <Smartphone size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-black text-[#2563EB]">홈화면에 추가</p>
          <h2 className={compact ? "mt-1 text-xl font-black" : "mt-2 text-2xl font-black"}>
            앱 설치 없이 시작하고, 앱처럼 사용하세요.
          </h2>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
            부모님 휴대폰 첫 화면에 오늘안부를 꺼내두세요.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-black text-[#2563EB]">iOS Safari</p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">공유 버튼 → 홈 화면에 추가</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-black text-[#2563EB]">Android Chrome</p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">메뉴 → 앱 설치 또는 홈 화면에 추가</p>
        </div>
      </div>
    </section>
  );
}
