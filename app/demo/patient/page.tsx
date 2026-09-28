"use client";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {PatientCareMvp} from "@/components/patient-care-mvp";
import {PatientPreviewLoading} from "@/components/patient-preview-loading";
function DemoPatient(){const mode=useSearchParams().get("mode");return <PatientCareMvp mode={mode==="checkin"?"checkin":mode==="history"?"history":mode==="hospital"?"hospital":"home"} demo/>}
export default function Page(){return <Suspense fallback={<PatientPreviewLoading/>}><DemoPatient/></Suspense>}
