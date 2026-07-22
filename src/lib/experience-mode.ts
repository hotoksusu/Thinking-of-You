import { PRODUCT_COPY } from "@/lib/product-copy";

export type ExperienceMode = "demo" | "learning" | "connected" | "data_unavailable";

export const experienceCopy: Record<ExperienceMode, { badge: string; status: string; detail: string }> = {
  demo: { badge: "체험용 예시", status: PRODUCT_COPY.changeDetected, detail: "예시 생활 흐름으로 변화 감지 과정을 보여드리고 있어요." },
  learning: { badge: "생활 흐름 학습 중", status: PRODUCT_COPY.learning, detail: "며칠 더 살펴본 뒤 평소와 다른 점을 알려드릴게요." },
  connected: { badge: "실제 데이터 연결됨", status: PRODUCT_COPY.noChange, detail: "연결된 질문 응답과 응답 시간대를 평소 범위와 비교했어요." },
  data_unavailable: { badge: "데이터 확인 필요", status: "오늘은 생활 정보를 확인할 수 없습니다.", detail: "연결 상태를 확인한 뒤 다시 살펴볼게요." },
};
