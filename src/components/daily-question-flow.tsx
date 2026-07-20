"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Leaf, Sparkles } from "lucide-react";
import { AnsimiCharacter } from "@/components/ansimi-character";
import { getQuestionById, saveQuestionAnswer, selectDailyQuestion, type DailyQuestion, type QuestionChoice } from "@/lib/daily-questions";

type Stage = "question" | "follow-up" | "result" | "skipped" | "empty";

export function DailyQuestionFlow() {
  const initialQuestion = useMemo(() => selectDailyQuestion({ enabledSettings: ["meal", "mood", "body", "sleep", "family_message"], triggers: [] }), []);
  const [question, setQuestion] = useState<DailyQuestion | null>(initialQuestion);
  const [stage, setStage] = useState<Stage>(initialQuestion ? "question" : "empty");
  const [selected, setSelected] = useState<QuestionChoice | null>(null);

  function answer(choice: QuestionChoice) {
    if (!question) return;
    saveQuestionAnswer({ questionId: question.id, category: question.category, choiceId: choice.id, choiceLabel: choice.label, answeredAt: new Date().toISOString(), familyInterpretation: choice.familyInterpretation });
    setSelected(choice);
    const followUp = choice.nextQuestionId ? getQuestionById(choice.nextQuestionId) : undefined;
    if (followUp && stage !== "follow-up") {
      setQuestion(followUp);
      setStage("follow-up");
      return;
    }
    setStage("result");
  }

  function skip() {
    if (question) saveQuestionAnswer({ questionId: question.id, category: question.category, choiceId: "skipped", choiceLabel: "오늘은 건너뛰기", answeredAt: new Date().toISOString(), skipped: true, familyInterpretation: "오늘은 질문을 쉬어갔어요. 부정적인 의미는 없어요." });
    setStage("skipped");
  }

  if (stage === "empty") return <ResultShell><AnsimiCharacter state="calm" message="오늘은 따로 여쭤볼 것이 없어요." secondaryMessage="평소처럼 편하게 지내세요." /><ResultActions primary="농장 구경하기" href="/app?role=parent&view=farm" secondary="가족 소식 보기" secondaryHref="/app?role=parent&view=photos" /></ResultShell>;
  if (stage === "skipped") return <ResultShell><AnsimiCharacter state="rest" message="알겠습니다." secondaryMessage="오늘은 편하게 쉬세요." /><div className="mt-5 rounded-[22px] bg-[#F2F6EF] p-5 text-center font-bold leading-7 text-[#536258]">건너뛰어도 농장과 기록에는 아무 불이익이 없어요.<br />내일 같은 질문을 다시 강제로 묻지 않아요.</div><ResultActions primary="홈으로 가기" href="/app?role=parent" /></ResultShell>;
  if (stage === "result" && selected) return <ResultShell tone={selected.farmEffect.includes("보호") || selected.farmEffect.includes("쉼") ? "rest" : "warm"}><AnsimiCharacter state={selected.farmEffect.includes("꽃") || selected.farmEffect.includes("햇빛") ? "celebrate" : selected.farmEffect.includes("쉼") || selected.farmEffect.includes("보호") ? "rest" : "happy"} message={selected.empathy} secondaryMessage={selected.suggestion} /><div className="mt-5 rounded-[22px] bg-[#EEF7EA] p-5 text-center"><p className="text-sm font-black text-[#477052]">오늘의 농장 장면</p><p className="mt-2 text-xl font-black text-[#285F3A]"><Leaf className="mr-2 inline" />{selected.farmEffect}</p><p className="mt-2 text-sm font-bold text-[#637069]">답변은 벌점 없이 따뜻한 장면으로만 더해져요.</p></div><ResultActions primary={selected.cta} href={selected.cta.includes("가족") ? "/app?role=parent&view=photos" : selected.cta.includes("농장") ? "/app?role=parent&view=farm" : "/app?role=parent"} /></ResultShell>;

  return (
    <main className="min-h-screen bg-[#F7F9F6] px-4 py-5 text-[#17221B]">
      <div className="mx-auto max-w-[560px]">
        <header className="flex items-center justify-between">
          <Link href="/app?role=parent" aria-label="홈으로" className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft size={24} /></Link>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#52705A]">{stage === "follow-up" ? "마지막 질문" : "오늘의 한 질문"}</span>
          <span className="w-12" />
        </header>
        <section className="mt-5 rounded-[34px] bg-white p-6 shadow-[0_22px_60px_rgba(49,78,58,.11)] sm:p-8">
          <AnsimiCharacter state="guide" message={stage === "follow-up" ? "한 가지만 더 여쭤볼게요." : "정희님, 오늘은 이것만 여쭤볼게요."} secondaryMessage={question?.title} />
          <h1 className="mt-6 text-center text-[clamp(2rem,8vw,2.8rem)] font-black leading-tight tracking-[-.03em]">{question?.prompt}</h1>
          <div className="mt-7 grid gap-3">
            {question?.choices.map((item) => <button key={item.id} type="button" onClick={() => answer(item)} className="flex min-h-[76px] items-center justify-between rounded-[22px] border-2 border-[#DCE5DC] bg-[#FAFCF9] px-6 text-left text-[1.25rem] font-black transition active:scale-[.98] active:border-[#E9652B] active:bg-[#FFF1E8]"><span>{item.label}</span><span className="flex size-9 items-center justify-center rounded-full bg-white text-[#78A76E]"><Check size={20} /></span></button>)}
          </div>
          <button type="button" onClick={skip} className="mt-4 min-h-14 w-full rounded-2xl text-lg font-black text-[#6B766F]">오늘은 건너뛰기</button>
        </section>
        <p className="mt-4 text-center text-sm font-bold text-[#7A847D]">전체 5~10초 · 답변하지 않아도 괜찮아요</p>
      </div>
    </main>
  );
}

function ResultShell({ children, tone = "warm" }: { children: React.ReactNode; tone?: "warm" | "rest" }) { return <main className={`flex min-h-screen items-center px-4 py-6 ${tone === "rest" ? "bg-[#F1F4F8]" : "bg-[#FFF8E8]"}`}><section className="mx-auto w-full max-w-[560px] rounded-[36px] bg-white p-7 shadow-[0_24px_70px_rgba(49,78,58,.13)] sm:p-9">{children}</section></main>; }
function ResultActions({ primary, href, secondary, secondaryHref }: { primary: string; href: string; secondary?: string; secondaryHref?: string }) { return <div className="mt-7"><Link href={href} className="flex min-h-[72px] items-center justify-center gap-2 rounded-[22px] bg-[#D95C24] px-6 text-[1.3rem] font-black text-white"><Sparkles size={22} />{primary}</Link>{secondary && secondaryHref ? <Link href={secondaryHref} className="mt-3 flex min-h-14 items-center justify-center text-lg font-black text-[#526059]">{secondary}</Link> : null}</div>; }
