import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "평소처럼 생활하세요 | 오늘안부",
  description: "따로 매일 기록할 것 없이 평소처럼 생활하시면 됩니다.",
  openGraph: {
    title: "평소처럼 생활하세요 | 오늘안부",
    description: "따로 하실 일은 거의 없습니다.",
    images: [{ url: "/og-parent-v1.png", width: 1200, height: 630, alt: "평소처럼 생활하세요. 따로 하실 일은 거의 없습니다." }],
  },
};

export default function ParentStartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
