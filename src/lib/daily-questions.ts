export type QuestionCategory =
  | "mood" | "meal" | "medication" | "body" | "sleep" | "activity"
  | "hospital" | "checkup" | "social" | "daily_difficulty" | "outing" | "family_message";

export type QuestionChoice = {
  id: string;
  label: string;
  responseType: string;
  nextQuestionId?: string;
  empathy: string;
  suggestion: string;
  farmEffect: string;
  cta: string;
  familyInterpretation: string;
};

export type DailyQuestion = {
  id: string;
  category: QuestionCategory;
  title: string;
  prompt: string;
  choices: QuestionChoice[];
  defaultWeeklyFrequency: number;
  minimumIntervalDays: number;
  triggerConditions?: string[];
  applicableUserSettings?: string[];
  familySharePolicy: "none" | "summary" | "repeat_only" | "ask_parent_consent";
  priority: 1 | 2 | 3 | 4;
};

export type QuestionAnswer = {
  questionId: string;
  category: QuestionCategory;
  choiceId: string;
  choiceLabel: string;
  answeredAt: string;
  skipped?: boolean;
  familyInterpretation: string;
};

export type QuestionContext = {
  enabledSettings: string[];
  triggers?: string[];
  scheduledQuestionIds?: string[];
  preferredHour?: number;
};

const choice = (id: string, label: string, empathy: string, suggestion: string, farmEffect: string, cta = "확인했어요", familyInterpretation = "평소와 비슷한 흐름이에요.", nextQuestionId?: string): QuestionChoice => ({ id, label, responseType: id, empathy, suggestion, farmEffect, cta, familyInterpretation, nextQuestionId });

export const DAILY_QUESTIONS: DailyQuestion[] = [
  { id: "meal", category: "meal", title: "식사", prompt: "오늘 식사는 어떠셨어요?", defaultWeeklyFrequency: 2, minimumIntervalDays: 3, priority: 4, familySharePolicy: "repeat_only", triggerConditions: ["meal_gap"], choices: [
    choice("well", "잘 먹었어요", "잘 드셨군요. 오늘도 든든한 하루예요.", "이제 편하게 쉬어도 좋아요.", "따뜻한 햇빛", "농장 보기", "식사를 대체로 잘 챙기셨어요."),
    choice("simple", "간단히 먹었어요", "간단하게라도 챙겨 드셨군요.", "다음 식사도 부담 없이 챙겨보세요.", "포근한 바람", "확인했어요", "간단하게 식사를 챙기셨어요."),
    choice("not_yet", "아직 못 먹었어요", "아직 식사를 못 하셨군요.", "부담 없는 것부터 조금 드셔도 괜찮아요.", "저녁빛과 쉼", "다음 질문", "식사를 거른 응답은 반복될 때만 함께 살펴봐요.", "meal-follow-up"),
    choice("no_appetite", "입맛이 없었어요", "오늘은 입맛이 없으셨군요.", "부담 없는 음식부터 조금씩 드셔도 괜찮아요.", "포근한 보호 장면", "다음 질문", "입맛 저하가 반복되는지 생활 흐름과 함께 살펴봐요.", "meal-follow-up"),
  ]},
  { id: "meal-follow-up", category: "meal", title: "식사", prompt: "지금 간단히 드실 수 있을까요?", defaultWeeklyFrequency: 0, minimumIntervalDays: 0, priority: 3, familySharePolicy: "repeat_only", choices: [
    choice("will_eat", "조금 챙겨 먹을게요", "좋아요. 천천히 챙겨 드세요.", "작은 한입이면 충분해요.", "따뜻한 햇빛", "확인했어요", "스스로 식사를 챙기겠다고 하셨어요."),
    choice("not_now", "지금은 괜찮아요", "알겠습니다. 지금은 편하게 쉬세요.", "필요할 때 부담 없이 챙겨보세요.", "포근한 쉼", "쉬러 가기", "한 번의 응답으로 알리지 않고 반복 여부만 살펴봐요."),
  ]},
  { id: "mood", category: "mood", title: "마음·안부", prompt: "오늘 마음은 어떠셨어요?", defaultWeeklyFrequency: 2, minimumIntervalDays: 3, priority: 4, familySharePolicy: "ask_parent_consent", triggerConditions: ["call_drop", "activity_drop", "routine_change", "repeated_tired"], choices: [
    choice("good", "좋았어요", "좋은 하루를 알려주셔서 고마워요.", "그 기분을 천천히 이어가세요.", "꽃이 피어남", "농장 보기", "기분이 편안한 날이었어요."),
    choice("okay", "괜찮았어요", "오늘도 무난하게 보내셨군요.", "평소처럼 편안히 지내세요.", "새잎", "확인했어요", "마음은 대체로 편안했어요."),
    choice("tired", "피곤했어요", "오늘은 조금 피곤하셨군요.", "오늘은 편하게 쉬어도 괜찮아요.", "저녁빛과 휴식", "쉬러 가기", "최근 피곤함이 반복되는지 생활 흐름과 함께 살펴봐요."),
    choice("difficult", "조금 힘들었어요", "말해주셔서 고마워요. 혼자 참지 않아도 괜찮아요.", "가족 소식을 보거나 편하게 쉬어보세요.", "포근한 보호 장면", "가족 소식 보기", "부모님의 공유 동의를 확인한 경우에만 가족에게 전해요."),
  ]},
  { id: "body", category: "body", title: "몸 상태", prompt: "오늘 몸은 어떠세요?", defaultWeeklyFrequency: 1, minimumIntervalDays: 3, priority: 4, familySharePolicy: "repeat_only", triggerConditions: ["activity_drop", "routine_change", "repeated_tired"], choices: [
    choice("comfortable", "편안해요", "몸이 편안하시다니 다행이에요.", "오늘도 무리하지 말고 지내세요.", "새잎", "농장 보기", "몸 상태는 편안하다고 하셨어요."),
    choice("tired", "조금 피곤해요", "조금 피곤하셨군요.", "따뜻한 물과 함께 잠시 쉬어보세요.", "저녁빛과 휴식", "쉬러 가기", "피곤함이 반복되는지 함께 살펴봐요."),
    choice("uncomfortable", "불편한 곳이 있어요", "불편한 곳이 있으셨군요.", "어느 쪽인지 한 번만 더 여쭤볼게요.", "포근한 보호 장면", "다음 질문", "몸의 불편함을 답하셨어요. 반복될 때 안부를 권해요.", "body-follow-up"),
  ]},
  { id: "body-follow-up", category: "body", title: "몸 상태", prompt: "어느 쪽이 불편하세요?", defaultWeeklyFrequency: 0, minimumIntervalDays: 0, priority: 3, familySharePolicy: "repeat_only", choices: ["머리·목", "어깨·허리", "다리·무릎", "속이 불편해요", "그 외"].map((label, index) => choice(`area_${index}`, label, "알려주셔서 고마워요.", "무리하지 말고 편하게 쉬세요.", "포근한 보호 장면", "확인했어요", `${label} 쪽이 불편하다고 하셨어요.`)) },
  { id: "sleep", category: "sleep", title: "수면", prompt: "어젯밤은 잘 주무셨어요?", defaultWeeklyFrequency: 1, minimumIntervalDays: 7, priority: 4, familySharePolicy: "summary", triggerConditions: ["routine_change"], choices: ["잘 잤어요", "중간에 깼어요", "잠들기 어려웠어요", "잘 모르겠어요"].map((label, index) => choice(`sleep_${index}`, label, index === 0 ? "푹 쉬셨군요." : "알려주셔서 고마워요.", "오늘은 몸의 흐름에 맞춰 지내세요.", index === 0 ? "아침 햇살" : "잔잔한 밤빛", "확인했어요", `수면에 대해 “${label}”라고 답하셨어요.`)) },
  { id: "activity", category: "activity", title: "생활 움직임", prompt: "오늘은 평소보다 덜 움직이셨어요. 몸이 조금 불편하셨나요?", defaultWeeklyFrequency: 0, minimumIntervalDays: 3, priority: 2, familySharePolicy: "repeat_only", triggerConditions: ["activity_drop"], choices: ["괜찮아요", "조금 피곤했어요", "불편한 곳이 있어요", "집에서 쉬었어요"].map((label, index) => choice(`activity_${index}`, label, "그렇군요. 알려주셔서 고마워요.", "걸음 목표보다 오늘 몸의 느낌이 중요해요.", index === 0 ? "산들바람" : "편안한 쉼", "확인했어요", `활동 감소에 대해 “${label}”라고 답하셨어요.`)) },
  { id: "family-message", category: "family_message", title: "가족에게 전할 말", prompt: "가족에게 전하고 싶은 말이 있으세요?", defaultWeeklyFrequency: 1, minimumIntervalDays: 7, priority: 4, familySharePolicy: "ask_parent_consent", choices: ["잘 지내고 있어요", "보고 싶어요", "전화해 주세요", "오늘은 괜찮아요"].map((label, index) => choice(`message_${index}`, label, "마음을 알려주셔서 고마워요.", index === 2 ? "동의를 확인하고 가족에게 전할게요." : "따뜻한 마음을 농장에 담아둘게요.", "농장 편지", index === 2 ? "가족에게 전하기" : "농장 보기", `가족에게 “${label}”라고 전하고 싶어 하셨어요.`)) },
  { id: "daily-difficulty", category: "daily_difficulty", title: "오늘의 불편", prompt: "오늘 불편한 일은 없으셨어요?", defaultWeeklyFrequency: 1, minimumIntervalDays: 7, priority: 3, familySharePolicy: "repeat_only", triggerConditions: ["routine_change"], choices: ["없었어요", "몸이 불편했어요", "휴대폰 사용이 어려웠어요", "다른 도움이 필요해요"].map((label, index) => choice(`difficulty_${index}`, label, "알려주셔서 고마워요.", index >= 2 ? "가족에게 도움을 요청할 수 있어요." : "오늘도 편하게 지내세요.", index === 0 ? "맑은 햇살" : "도움의 불빛", index >= 2 ? "연락하기" : "확인했어요", index === 2 ? "휴대폰 사용에 도움이 필요하다고 하셨어요." : `오늘의 불편에 “${label}”라고 답하셨어요.`)) },
];

export const QUESTION_HISTORY_KEY = "today-anbu:daily-question-history";

function dayDiff(a: string, b: string) { return Math.floor(Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000); }

export function readQuestionHistory(): QuestionAnswer[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(QUESTION_HISTORY_KEY) ?? "[]") as QuestionAnswer[]; } catch { return []; }
}

export function saveQuestionAnswer(answer: QuestionAnswer) {
  const history = readQuestionHistory();
  window.localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify([...history, answer].slice(-90)));
}

export function selectDailyQuestion(context: QuestionContext, now = new Date()): DailyQuestion | null {
  const history = readQuestionHistory();
  const today = now.toISOString().slice(0, 10);
  if (history.some((item) => item.answeredAt.slice(0, 10) === today)) return null;
  const triggers = new Set(context.triggers ?? []);
  const scheduled = new Set(context.scheduledQuestionIds ?? []);
  const candidates = DAILY_QUESTIONS.filter((question) => {
    if (question.id.includes("follow-up")) return false;
    if (question.applicableUserSettings?.some((setting) => !context.enabledSettings.includes(setting))) return false;
    const last = [...history].reverse().find((item) => item.questionId === question.id);
    if (last && dayDiff(today, last.answeredAt.slice(0, 10)) < question.minimumIntervalDays) return false;
    if (question.priority === 1) return scheduled.has(question.id);
    if (question.triggerConditions?.some((trigger) => triggers.has(trigger))) return true;
    const answeredThisWeek = history.filter((item) => item.questionId === question.id && dayDiff(today, item.answeredAt.slice(0, 10)) < 7).length;
    return answeredThisWeek < question.defaultWeeklyFrequency;
  });
  return candidates.sort((a, b) => {
    const aTriggered = a.triggerConditions?.some((trigger) => triggers.has(trigger)) ? 1 : 0;
    const bTriggered = b.triggerConditions?.some((trigger) => triggers.has(trigger)) ? 1 : 0;
    return a.priority - b.priority || bTriggered - aTriggered || a.id.localeCompare(b.id);
  })[0] ?? null;
}

export function getQuestionById(id: string) { return DAILY_QUESTIONS.find((question) => question.id === id); }
