import { ArrowRight, Smartphone } from "lucide-react";

export function InstallGuide({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "rounded-[24px] bg-[#EFF6FF] p-5" : "rounded-[28px] bg-[#EFF6FF] p-6"}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB]">
          <Smartphone size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-black text-[#2563EB]">설치 없이 홈화면에 추가</p>
          <h2 className={compact ? "mt-1 text-xl font-black" : "mt-2 text-2xl font-black"}>
            앱스토어를 찾지 않아도 바로 시작할 수 있어요.
          </h2>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
            부모님 휴대폰 첫 화면에 오늘안부를 꺼내두세요. 아이콘을 누르면 오늘안부 앱처럼 바로 시작됩니다.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-black text-[#2563EB]">iPhone</p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">Safari에서 공유 버튼 → 홈 화면에 추가</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-black text-[#2563EB]">Android</p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">Chrome 메뉴 → 홈 화면에 추가</p>
        </div>
      </div>
      {!compact ? (
        <a
          href="/app"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 font-black text-white sm:w-auto"
        >
          앱 체험하기
          <ArrowRight size={17} aria-hidden />
        </a>
      ) : null}
    </section>
  );
}

export function AppInstallBanner() {
  return (
    <section className="mb-5 rounded-[24px] border border-[#BFDBFE] bg-[#EFF6FF] p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB]">
          <Smartphone size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-black text-[#2563EB]">설치 없이 홈화면에 추가</p>
          <h2 className="mt-1 text-xl font-black leading-7 text-[#111827]">
            오늘안부를 휴대폰 첫 화면에 꺼내두세요.
          </h2>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
            홈화면에 추가하면 앱처럼 바로 열 수 있어요.
          </p>
          <p className="mt-2 text-sm font-black text-[#2563EB]">
            아이콘을 누르면 오늘안부 앱처럼 바로 시작됩니다.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-sm font-black text-[#2563EB]">iPhone</p>
          <p className="mt-1 text-sm font-bold text-[#4B5563]">Safari에서 공유 버튼 → 홈 화면에 추가</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-sm font-black text-[#2563EB]">Android</p>
          <p className="mt-1 text-sm font-bold text-[#4B5563]">Chrome 메뉴 → 홈 화면에 추가</p>
        </div>
      </div>
    </section>
  );
}
