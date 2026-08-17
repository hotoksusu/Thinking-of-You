"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PatientExperience } from "@/components/patient-experience";

function Experience(){
  const role=useSearchParams().get("role");
  return <PatientExperience guardian={role==="guardian"}/>;
}

export default function AppPage(){return <Suspense fallback={<main className="min-h-screen bg-[#F7F9F6]"/>}><Experience/></Suspense>}
