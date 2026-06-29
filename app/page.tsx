import {
  ArrowRight,
  Brain,
  ChevronDown,
  Gift,
  Link,
  MessageCircle,
  PackageOpen,
  ShieldCheck,
  Sprout,
  UserRoundPlus,
} from "lucide-react";

const flowSteps = [
  {
    step: "1",
    title: "자녀 가입",
    description: "가족이 먼저 오늘안부를 시작합니다.",
    icon: UserRoundPlus,
  },
  {
    step: "2",
    title: "부모님 연결",
    description: "설치 없이 부모님께 기록 링크를 보냅니다.",
    icon: Link,
  },
  {
    step: "3",
    title: "AI 환영과 작물 선택",
    description: "따뜻한 환영 인사 뒤 키우고 싶은 작물을 고릅니다.",
    icon: Sprout,
  },
  {
    step: "4",
    title: "20초 안부 기록",
    description: "큰 버튼으로 오늘 하루를 가볍게 남깁니다.",
    icon: MessageCircle,
  },
  {
    step: "5",
    title: "AI 안심 분석",
    description: "AI가 생활 흐름을 따뜻한 문장으로 정리합니다.",
    icon: Brain,
  },
  {
    step: "6",
    title: "작물 성장",
    description: "오늘의 안부만큼 작물이 하루 한 번 자랍니다.",
    icon: Sprout,
  },
  {
    step: "7",
    title: "수확",
    description: "꾸준히 쌓인 안부가 디지털 수확물이 됩니다.",
    icon: PackageOpen,
  },
  {
    step: "8",
    title: "시즌 이벤트",
    description: "수확물은 브랜드 협업 이벤트에 활용할 수 있습니다.",
    icon: Gift,
  },
];

const faqs = [
  {
    question: "앱 설치가 꼭 필요한가요?",
    answer: "아닙니다. 부모님은 카카오톡이나 문자로 받은 링크만 열어도 오늘의 기록을 남길 수 있습니다.",
  },
  {
    question: "그냥 카카오톡이나 문자로 안부를 챙기면 안 되나요?",
    answer:
      "물론 카카오톡이나 전화도 중요합니다. 하지만 대부분의 부모님은 걱정시키기 싫어 “괜찮다”고 말씀하시는 경우가 많습니다. 오늘안부는 단순한 대화 대신, 하루하루의 기록과 가족의 관심이 쌓이는 흐름을 살펴봅니다. AI는 그 변화를 정리해 가족에게 안심 리포트로 전달합니다.",
  },
  {
    question: "가족 응원 문구는 정해진 것만 보낼 수 있나요?",
    answer: "아닙니다. 추천 문구를 선택한 뒤 가족의 말투로 수정할 수 있고, 직접 작성도 가능합니다. 계절, 날씨, 명절 등에 맞는 응원 문구도 주기적으로 업데이트됩니다.",
  },
  {
    question: "가족 응원 문구를 제 말투로 바꿀 수 있나요?",
    answer: "네. 추천 문구를 선택한 뒤 다정하게, 간단하게, 밝게, 담백하게 등 원하는 말투로 바꿀 수 있고 직접 수정도 가능합니다.",
  },
  {
    question: "같은 문구가 반복되면 어색하지 않나요?",
    answer: "오늘안부는 최근 사용한 문구를 고려해 다양한 문구를 제안합니다. 가족이 직접 수정할 수도 있어 매번 더 자연스럽게 마음을 전할 수 있습니다.",
  },
  {
    question: "부모님을 감시하는 서비스인가요?",
    answer: "아닙니다. 위치 추적이나 감시가 아니라, 부모님이 남긴 오늘의 기록과 가족의 관심을 바탕으로 변화 감지를 돕는 서비스입니다.",
  },
  {
    question: "답변하지 않으면 위험 신호인가요?",
    answer: "한 번의 미응답을 위험으로 단정하지 않습니다. 반복되는 흐름을 평소와 비교해 안심 리포트에 반영합니다.",
  },
  {
    question: "부모님이 매일 기록하는 것을 귀찮아하지 않을까요?",
    answer: "오늘안부는 긴 기록을 요구하지 않습니다. 몇 번의 선택이면 충분하고, 첫 씨앗을 심은 뒤 매일 작물이 자라는 안심농장이 부모님이 스스로 다시 돌아올 작은 이유가 됩니다.",
  },
  {
    question: "이 기록은 어떤 의미가 있나요?",
    answer: "하루하루의 기록은 작아 보이지만, 시간이 지나면 생활 패턴과 감정 변화, 가족과의 연결 흐름을 보여줍니다. 오늘안부는 그 변화를 안심 리포트로 정리합니다.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <nav className="flex items-center gap-5 text-sm font-bold text-[#6B7280]">
          <a href="/" className="text-[#2563EB]">
            홈
          </a>
          <a href="/app" className="transition hover:text-[#2563EB]">
            앱 체험
          </a>
          <a href="/guide" className="transition hover:text-[#2563EB]">
            이용 가이드
          </a>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pb-24 lg:pt-16">
        <div>
          <p className="text-sm font-black text-[#2563EB]">AI 안심 리포트와 매일 자라는 안심농장</p>
          <h1 className="mt-5 max-w-[680px] text-[3.05rem] font-black leading-[1.12] tracking-[-0.01em] sm:text-[4.25rem]">
            관심이 쌓이면,
            <br />
            <span className="text-[#2563EB]">안심</span>이 됩니다.
          </h1>
          <p className="mt-7 max-w-[620px] text-xl font-black leading-9 text-[#1F2937]">
            부모님은 하루를 남기며 작물을 키우고
            <br />
            AI는 그 하루를 따뜻하게 기억하고
            <br />
            가족은 안심 리포트를 확인합니다.
          </p>

          <div className="mt-7 rounded-[24px] bg-[#EFF6FF] p-5">
            <p className="text-sm font-black text-[#2563EB]">
              가족의 말투로 더 자연스럽게 전할 수 있습니다.
            </p>
            <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
              추천 문구를 고르고, 다정하게·간단하게·밝게 등 원하는 말투로 바꿔 보낼 수 있습니다. 직접 수정하거나 새로 작성할 수도 있고, 계절과 상황에 맞는 따뜻한 문구도 주기적으로 제안합니다.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/app"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
            >
              안심 리포트 체험하기
              <ArrowRight size={18} aria-hidden />
            </a>
          </div>
        </div>

        <ReportPreview />
      </section>

      <section className="border-y border-[#BBF7D0] bg-[#F0FDF4]">
        <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#15803D]">부모님이 꾸준히 사용하는 이유</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              안부를 남기는 일이
              <br />
              기다려지는 하루가 됩니다.
            </h2>
            <p className="mt-5 max-w-[620px] text-lg font-semibold leading-8 text-[#4B5563]">
              부모님께 기록을 요구하는 대신,
              <br />
              첫 씨앗을 심고 매일 작물이 자라는 작은 즐거움을 드립니다.
              <br />
              꾸준한 기록은 부모님께는 수확의 기쁨이 되고,
              <br />
              가족에게는 더 정확한 안심 흐름이 됩니다.
            </p>
          </div>
          <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(21,128,61,0.10)] sm:p-8">
            <div className="flex items-center gap-5">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-[24px] bg-[#DCFCE7] text-6xl" aria-hidden>🌱</div>
              <div>
                <p className="text-sm font-black text-[#15803D]">나의 안심농장</p>
                <p className="mt-2 text-2xl font-black leading-8">오늘의 기록이<br />작물을 키워요.</p>
              </div>
            </div>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-[#DCFCE7]" aria-hidden>
              <div className="h-full w-[42%] rounded-full bg-[#22C55E]" />
            </div>
            <p className="mt-4 font-black leading-7 text-[#166534]">오늘 안부 덕분에 작물이 햇빛을 받았어요.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-[#FFF7ED]">
        <div className="mx-auto w-full max-w-[920px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-black text-[#F97316]">하루가 쌓이는 의미</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            하루의 기록은 안심이 되고,
            <br />
            시간이 지나면 소중한 변화가 됩니다.
          </h2>
          <div className="mt-6 grid gap-4 text-lg font-semibold leading-8 text-[#4B5563]">
            <p>오늘안부는 부모님께 데이터를 요구하지 않습니다.</p>
            <p>
              부모님은 하루를 가볍게 남기고,
              <br />
              가족은 그 흐름을 안심 리포트로 확인합니다.
            </p>
            <p>
              시간이 지나며 쌓인 기록은
              <br />
              부모님의 생활 변화와 추억을 함께 보여줍니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
        <div>
          <p className="text-sm font-black text-[#2563EB]">앱 체험</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            부모님과 가족은
            <br />
            이렇게 연결됩니다
          </h2>
          <p className="mt-5 max-w-[680px] font-semibold leading-8 text-[#6B7280]">
            부모님은 하루를 남기고,
            <br />
            가족은 안심 리포트를 봅니다.
            <br />
            <br />
            두 화면으로
            <br />
            오늘안부의 흐름을 체험해 보세요.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <span className="inline-flex rounded-full bg-[#FFF7ED] px-3 py-1 text-sm font-black text-[#F97316]">부모님 화면</span>
            <h3 className="mt-5 text-[1.625rem] font-black leading-[1.28] sm:text-[2rem]">
              오늘의 기록과
              <br />
              가족의 응원
            </h3>
            <p className="mt-4 text-[1.05rem] font-semibold leading-[1.6] text-[#6B7280]">
              복잡한 입력 없이
              <br />
              오늘의 기록을 남깁니다.
              <br />
              <br />
              가족이 보낸 응원도
              <br />
              함께 확인합니다.
            </p>
            <a
              href="/app?role=parent"
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#F97316] px-5 text-lg font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]"
            >
              부모님 화면 보기
            </a>
          </article>
          <article className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-black text-[#2563EB]">가족 화면</span>
            <h3 className="mt-5 text-[1.625rem] font-black leading-[1.28] sm:text-[2rem]">
              안심 리포트와
              <br />
              변화 감지
            </h3>
            <p className="mt-4 text-[1.05rem] font-semibold leading-[1.6] text-[#6B7280]">
              부모님의 기록 흐름을
              <br />
              안심 점수로 봅니다.
              <br />
              <br />
              변화가 있으면
              <br />
              리포트로 알려줍니다.
            </p>
            <a
              href="/app?role=family"
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#2563EB] px-5 text-lg font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
            >
              가족 화면 보기
            </a>
          </article>
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <p className="text-sm font-black text-[#2563EB]">오늘안부 이용 흐름</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            안부를 남기면,
            <br />
            안심과 작물이 함께 자랍니다.
          </h2>
          <div className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {flowSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sm font-black text-[#2563EB]">
                    {item.step}
                  </span>
                  <Icon size={22} className="mt-5 text-[#2563EB]" aria-hidden />
                  <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#6B7280]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#2563EB]">왜 오늘안부인가요?</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              카카오톡은 대화를 남깁니다.
              <br />
              오늘안부는 변화를 남깁니다.
            </h2>
            <p className="mt-5 font-semibold leading-8 text-[#6B7280]">
              카카오톡이나 전화는 부모님의 오늘을 확인하는 데 좋습니다. 하지만 부모님은 대부분 “괜찮다”고 말씀하십니다. 오늘안부는 하루의 대화보다, 시간이 지나며 쌓이는 기록의 변화를 살펴봅니다.
            </p>
            <p className="mt-5 rounded-[24px] bg-[#EFF6FF] p-5 text-xl font-black leading-8 text-[#2563EB]">
              안부를 묻는 것과
              <br />
              변화를 살피는 것은 다릅니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[24px] bg-[#F9FAFB] p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-black text-[#6B7280]">카카오톡</p>
              <h3 className="mt-3 text-2xl font-black">오늘의 대화</h3>
              <ul className="mt-5 grid gap-3 text-sm font-bold leading-6 text-[#6B7280]">
                <li>그날의 안부 확인</li>
                <li>흘러가는 메시지</li>
                <li>가족이 직접 기억해야 함</li>
              </ul>
            </article>
            <article className="rounded-[24px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
              <p className="text-sm font-black text-[#93C5FD]">오늘안부</p>
              <h3 className="mt-3 text-2xl font-black">쌓이는 변화</h3>
              <ul className="mt-5 grid gap-3 text-sm font-bold leading-6 text-white/70">
                <li>오늘의 기록 축적</li>
                <li>가족의 관심 저장</li>
                <li>AI가 변화 흐름 분석</li>
                <li>안심 리포트 제공</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-black text-[#2563EB]">예시 안심 리포트</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            원시 데이터가 아니라
            <br />
            변화 요약을 봅니다.
          </h2>
          <p className="mt-5 font-semibold leading-8 text-[#6B7280]">
            최근 7일간 기록 참여도, 가족의 관심, 변화 감지 결과를 안심 리포트로 정리합니다.
          </p>
        </div>
        <ReportPreview compact />
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[920px] px-5 py-16 sm:px-8">
          <p className="text-sm font-black text-[#2563EB]">FAQ</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">자주 묻는 질문</h2>
          <div className="mt-8 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                  {faq.question}
                  <ChevronDown size={20} className="shrink-0 transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[920px] px-5 py-16 text-center sm:px-8">
        <ShieldCheck size={34} className="mx-auto text-[#2563EB]" aria-hidden />
        <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
          가족의 말투로
          <br />
          오늘의 안심을 전해보세요.
        </h2>
        <div className="mt-8 flex justify-center">
          <a
            href="/app"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
          >
            바로 시작하기
            <ArrowRight size={18} aria-hidden />
          </a>
        </div>
      </section>
    </main>
  );
}

function ReportPreview({ compact = false }: { compact?: boolean }) {
  return (
    <article className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#93C5FD]">안심 리포트</p>
          <h2 className="mt-3 text-3xl font-black">엄마</h2>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">안심</span>
      </div>
      <p className="mt-7 text-6xl font-black leading-none">89</p>
      <p className="mt-2 text-sm font-black text-white/55">안심 점수</p>
      <div className="mt-6 grid gap-3">
        {["오늘의 응원 확인", "오늘의 기록이 도착했습니다", "변화 감지 결과 큰 변화 없음"].map((item) => (
          <p key={item} className="rounded-2xl bg-white/10 px-4 py-3 font-black">
            {item}
          </p>
        ))}
      </div>
      {!compact ? (
        <p className="mt-5 rounded-2xl bg-white px-4 py-3 font-black leading-7 text-[#2563EB]">
          최근 7일간 기록 참여도는 안정적입니다. 이번 주에는 짧은 통화를 권장합니다.
        </p>
      ) : null}
    </article>
  );
}
