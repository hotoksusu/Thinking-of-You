"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserMode } from "@/components/user-mode";

function AppPageContent() {
  const params = useSearchParams();
  const roleParam = params.get("role");
  const role = roleParam === "parent" || roleParam === "family" ? roleParam : undefined;
  const view = params.get("view");
  const parentView = view === "record" || view === "photos" || view === "farm" || view === "profile" || view === "guide"
    ? view
    : "home";
  const familyView = view === "reassurance" || view === "changes" || view === "compose" || view === "farm" || view === "profile" || view === "guide"
    ? view
    : "home";

  return <UserMode initialRegistered={params.get("registered") === "1"} initialRole={role} initialParentView={parentView} initialFamilyView={familyView} initialAnswered={params.get("answered") === "1"} />;
}

export default function AppPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F7F9F6]" />}>
      <AppPageContent />
    </Suspense>
  );
}
