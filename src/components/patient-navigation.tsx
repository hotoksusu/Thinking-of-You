"use client";
import NextLink from "next/link";
import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Navigation = { demo: boolean; href: (mode?: string, values?: Record<string, string>) => string };
const Context = createContext<Navigation>({ demo: false, href: () => "/patient" });
const pendingKey = "oneul-anbu:patient-navigation";
export function PatientNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(), params = useSearchParams(), demo = pathname.startsWith("/demo/patient");
  const current = pathname + (params.size ? `?${params}` : "");
  useEffect(() => {
    try {
      const pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null");
      sessionStorage.removeItem(pendingKey);
      if (pending?.to === current) window.history.replaceState({ ...window.history.state, patientPrevious: pending.from }, "");
    } catch { /* Direct entry uses the explicit fallback. */ }
  }, [current]);
  const href = (mode = "home", values: Record<string, string> = {}) => {
    const query = new URLSearchParams();
    // Record identifiers belong to a destination; identity context survives tab changes.
    for (const key of ["patientId", "proxy"]) { const value = params.get(key); if (value) query.set(key, value); }
    if (demo && mode !== "home") query.set("mode", mode);
    for (const [key, value] of Object.entries(values)) query.set(key, value);
    const path = demo ? "/demo/patient" : `/app/patient${mode === "home" ? "" : `/${mode}`}`;
    return path + (query.size ? `?${query}` : "");
  };
  return <Context.Provider value={{ demo, href }}>{children}</Context.Provider>;
}
export const usePatientNavigation = () => useContext(Context);

export function PatientLink({ href, onClick, ...props }: React.ComponentProps<typeof NextLink>) {
  const nav = usePatientNavigation();
  let target = String(href);
  if (/^\/(?:app\/patient|demo\/patient)(?:[/?]|$)/.test(target)) {
    const url = new URL(target, "https://patient.local");
    const mode = url.searchParams.get("mode") || url.pathname.split("/").at(3) || "home";
    const values = Object.fromEntries(url.searchParams); delete values.mode;
    target = nav.href(mode, values);
  }
  return <NextLink {...props} href={target} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try { sessionStorage.setItem(pendingKey, JSON.stringify({ from: location.pathname + location.search, to: target })); } catch { /* Fallback remains usable. */ }
  }}/>;
}

export function PatientBack({ label = "이전 화면", fallback, onBack }: { label?: string; fallback?: string; onBack?: () => void }) {
  const nav = usePatientNavigation(), router = useRouter();
  return <button type="button" className="inline-flex min-h-12 items-center gap-2 rounded-xl pr-4 text-lg font-black text-[#315E50]" onClick={() => {
    if (onBack) { onBack(); return; }
    const previous = window.history.state?.patientPrevious as string | undefined;
    const safe = previous && (nav.demo ? previous.startsWith("/demo/patient") : /^\/(app\/patient|patient)([/?]|$)/.test(previous));
    if (safe && previous !== location.pathname + location.search && window.history.length > 1) router.back();
    else router.replace(fallback || nav.href());
  }}><ArrowLeft aria-hidden size={22}/>{label}</button>;
}
