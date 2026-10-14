"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPatientSession } from "@/lib/demo-auth";
export function PatientEntryRedirect({ redirectSession = true }: { redirectSession?: boolean }) {
 const router = useRouter();
 useEffect(() => {
  const query = new URLSearchParams(window.location.search);
  if (query.has("token")) router.replace("/i?token=" + encodeURIComponent(query.get("token") || ""));
  else if (redirectSession && getPatientSession()) router.replace("/app/patient");
 }, [router, redirectSession]);
 return null;
}
