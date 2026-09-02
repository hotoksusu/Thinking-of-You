"use client";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {PatientCareMvp} from "@/components/patient-care-mvp";
function DemoPatient(){const mode=useSearchParams().get("mode");return <PatientCareMvp mode={mode==="checkin"?"checkin":mode==="history"?"history":"home"} demo/>}
export default function Page(){return <Suspense fallback={<main className="grid min-h-screen place-items-center text-lg font-bold">회복 화면을 불러오고 있어요.</main>}><DemoPatient/></Suspense>}
