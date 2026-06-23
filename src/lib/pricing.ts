export type PricingPlanId = "free" | "safety" | "family" | "premium";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "무료",
    price: "월 0원",
    description: "AI 안심 서비스를 부담 없이 먼저 체험해요.",
    features: ["부모님 1명", "최근 기록 확인"],
    cta: "무료로 시작하기",
  },
  {
    id: "safety",
    name: "안심 플랜",
    price: "월 4,900원",
    description: "매일의 안부 요청과 변화 감지로 이상 신호를 놓치지 않아요.",
    features: ["자동 안부 요청", "미응답 알림", "안심 점수", "변화 감지"],
    cta: "안심 플랜 시작하기",
    highlighted: true,
  },
  {
    id: "family",
    name: "가족 플랜",
    price: "월 9,900원",
    description: "형제자매가 함께 부모님의 안심 상태를 공유해요.",
    features: ["최대 5명", "가족 공유", "AI 안심 리포트", "패턴 분석"],
    cta: "가족 플랜 보기",
  },
  {
    id: "premium",
    name: "프리미엄 케어",
    price: "월 19,900원",
    description: "AI 전화 확인과 주간 리포트까지 확장하는 케어 플랜이에요.",
    features: ["AI 전화 안부 확인", "주간 안심 리포트", "이상 패턴 분석", "긴급 연락망"],
    cta: "프리미엄 케어 보기",
  },
];
