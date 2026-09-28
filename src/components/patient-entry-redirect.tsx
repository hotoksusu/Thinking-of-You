"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPatientSession } from "@/lib/demo-auth";
export function PatientEntryRedirect() {
 const router = useRouter();
 useEffect(() => {
  const token = new URLSearchParams(window.location.search).get("token");
  if (token) router.replace("/i?token=" + encodeURIComponent(token));
  else if (getPatientSession()) router.replace("/app/patient/checkin");
 }, [router]);
 return null;
}
