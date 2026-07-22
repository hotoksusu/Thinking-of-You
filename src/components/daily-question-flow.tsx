"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { AnsimiCharacter } from "@/components/ansimi-character";
import { saveQuestionAnswer, selectDailyQuestion, type DailyQuestion, type QuestionChoice } from "@/lib/daily-questions";

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
    setStage("result");
  }

  function skip() {
    if (question) saveQuestionAnswer({ questionId: question.id, category: question.category, choiceId: "skipped", choiceLabel: "오늘은 건너뛰기", answeredAt: new Date().toISOString(), skipped: true, familyInterpretation: "오늘은 질문을 쉬어갔어요. 부정적인 의미는 없어요." });
    setStage("skipped");
  }

  if (stage === "empty") return <ResultShell><AnsimiCharacter state="calm" message="오늘은 하실 일이 없습니다." secondaryMessage="평소처럼 생활하세요. 필요한 날에만 질문을 드릴게요." /><Link href="/app?role=parent&view=photos" className="mt-7 flex min-h-14 items-center justify-center text-lg font-black text-[#526059]">가족에게 안부 한마디 보내기</Link></ResultShell>;
  if (stage === "skipped") return <ResultShell><AnsimiCharacter state="rest" message="알겠습니다." secondaryMessage="오늘은 편하게 쉬세요." /><div className="mt-5 rounded-[22px] bg-[#F2F6EF] p-5 text-center font-bold leading-7 text-[#536258]">오늘은 답하지 않아도 괜찮습니다.<br />농장에도 불이익이 없어요.</div><ResultActions primary="오늘 화면으로 돌아가기" href="/app?role=parent&answered=1" /></ResultShell>;
  if (stage === "result" && selected) return <ResultShell><AnsimiCharacter state="completed" motion="once" message="답변해 주셔서 고맙습니다." secondaryMessage="이제 평소처럼 하루를 보내세요." ariaLabel="답변 완료를 미소로 안내하는 안심이" /><ResultActions primary="오늘 화면으로 돌아가기" href="/app?role=parent&answered=1" /></ResultShell>;

  return (
    <main className="min-h-screen bg-[#F7F9F6] px-4 py-5 text-[#17221B]">
      <div className="mx-auto max-w-[560px]">
        <header className="flex items-center justify-between">
          <Link href="/app?role=parent" aria-label="홈으로" className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft size={24} /></Link>
          <span className="rounded-full bg-white px-4 py-2 text-lg font-black text-[#52705A]">오늘 질문 하나</span>
          <span className="w-12" />
        </header>
        <section className="mt-5 rounded-[34px] bg-white p-6 shadow-[0_22px_60px_rgba(49,78,58,.11)] sm:p-8">
          <AnsimiCharacter state="question" motion="once" message="오늘은 질문 하나만 부탁드릴게요." secondaryMessage="편한 답을 눌러 주세요." ariaLabel="휴대폰으로 오늘 질문 하나를 안내하는 안심이" />
          <h1 className="mt-6 text-center text-[clamp(2rem,8vw,2.8rem)] font-black leading-tight tracking-[-.03em]">{question?.prompt}</h1>
          <div className="mt-7 grid gap-3">
            {question?.choices.map((item) => <button key={item.id} type="button" onClick={() => answer(item)} className="flex min-h-[76px] items-center justify-between rounded-[22px] border-2 border-[#DCE5DC] bg-[#FAFCF9] px-6 text-left text-[1.25rem] font-black transition active:scale-[.98] active:border-[#E9652B] active:bg-[#FFF1E8]"><span>{item.label}</span><span className="flex size-9 items-center justify-center rounded-full bg-white text-[#78A76E]"><Check size={20} /></span></button>)}
          </div>
          <button type="button" onClick={skip} className="mt-4 min-h-14 w-full rounded-2xl text-lg font-black text-[#6B766F]">오늘은 건너뛰기</button>
        </section>
        <p className="mt-4 text-center text-lg font-bold text-[#6B766F]">답하기 어려우면 건너뛰어도 괜찮습니다.</p>
      </div>
    </main>
  );
}

function ResultShell({ children, tone = "warm" }: { children: React.ReactNode; tone?: "warm" | "rest" }) { return <main className={`flex min-h-screen items-center px-4 py-6 ${tone === "rest" ? "bg-[#F1F4F8]" : "bg-[#FFF8E8]"}`}><section className="mx-auto w-full max-w-[560px] rounded-[36px] bg-white p-7 shadow-[0_24px_70px_rgba(49,78,58,.13)] sm:p-9">{children}</section></main>; }
function ResultActions({ primary, href, secondary, secondaryHref }: { primary: string; href: string; secondary?: string; secondaryHref?: string }) { return <div className="mt-7"><Link href={href} className="flex min-h-[72px] items-center justify-center gap-2 rounded-[22px] bg-[#D95C24] px-6 text-[1.3rem] font-black text-white"><Sparkles size={22} />{primary}</Link>{secondary && secondaryHref ? <Link href={secondaryHref} className="mt-3 flex min-h-14 items-center justify-center text-lg font-black text-[#526059]">{secondary}</Link> : null}</div>; }
