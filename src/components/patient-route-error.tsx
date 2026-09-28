"use client";
import { Suspense } from "react";
import { PatientNavigation } from "./patient-navigation";
import { PatientError } from "./patient-error";
export function PatientRouteError({ reset }: { reset: () => void }) {
  return <Suspense fallback={<main className="min-h-screen bg-[#F1F0E9] p-8 text-xl">화면을 다시 준비하고 있어요.</main>}><PatientNavigation><PatientError type={typeof navigator!=="undefined"&&!navigator.onLine?"networkError":"unknownError"} retry={reset}/></PatientNavigation></Suspense>;
}
