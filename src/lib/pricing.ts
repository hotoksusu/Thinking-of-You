export type PricingPlanId = "free" | "safety" | "family";

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
    description: "먼저 부모님 한 분의 안심 상태를 가볍게 확인해요.",
    features: ["부모님 1명 등록", "수동 안부 확인", "최근 3일 기록 확인"],
    cta: "무료로 시작하기",
  },
  {
    id: "safety",
    name: "안심 플랜",
    price: "월 4,900원",
    description: "매일 자동 요청과 미응답 알림으로 놓치지 않게 챙겨요.",
    features: [
      "부모님 2명 등록",
      "매일 자동 안부 요청",
      "미응답 알림",
      "최근 30일 기록 확인",
    ],
    cta: "안심 플랜 시작하기",
    highlighted: true,
  },
  {
    id: "family",
    name: "가족 플랜",
    price: "월 9,900원",
    description: "가족이 함께 부모님의 이상 신호와 기록을 확인해요.",
    features: [
      "부모님/가족 최대 5명 등록",
      "가족 구성원 공유",
      "긴급 연락처 알림",
      "최근 90일 기록 확인",
    ],
    cta: "가족 플랜 보기",
  },
];
