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
    description: "오늘의 안심을 부담 없이 먼저 확인해요.",
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
    features: ["최대 5명", "가족 공유", "최근 생활 변화", "달라진 점 알림"],
    cta: "가족 플랜 보기",
  },
  {
    id: "premium",
    name: "프리미엄 케어",
    price: "월 19,900원",
    description: "전화 확인과 주간 생활 변화까지 함께 살펴드려요.",
    features: ["전화 안부 확인", "이번 주 생활 변화", "달라진 점 알림", "긴급 연락망"],
    cta: "프리미엄 케어 보기",
  },
];
