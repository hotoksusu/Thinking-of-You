"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    try {
      const supabase = createClient();
      const next = new URLSearchParams(location.search).get("next") || "/app";
      const callback = new URL("/auth/callback", location.origin);
      callback.searchParams.set("next", next.startsWith("/") ? next : "/app");
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: callback.toString() } });
      if (error) throw error;
      setMessage("로그인 링크를 이메일로 보냈어요. 받은편지함을 확인해 주세요.");
    } catch { setMessage("로그인 이메일을 보내지 못했어요. 설정과 인터넷 연결을 확인해 주세요."); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-[#FFF9F0] px-5 py-16 text-[#20302C]">
    <section className="mx-auto max-w-md rounded-[28px] bg-white p-7 shadow-[0_20px_60px_rgba(45,70,50,.12)]">
      <Link href="/" className="font-black text-[#315B3D]">← 오늘안부</Link>
      <h1 className="mt-6 text-3xl font-black">기록 이어보기</h1>
      <p className="mt-3 font-bold leading-7 text-[#65736C]">찜과 활동 기록을 다른 기기에서도 이어서 보려면 이메일로 로그인해 주세요.</p>
      <form onSubmit={submit} className="mt-7">
        <label htmlFor="email" className="font-black">이메일</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border-2 border-[#C9D8C5] px-4 text-lg outline-none focus:border-[#315B3D]" />
        <button disabled={loading} className="mt-4 min-h-14 w-full rounded-2xl bg-[#2F6B46] px-5 text-lg font-black text-white disabled:opacity-60">{loading ? "보내는 중…" : "이메일 로그인 링크 받기"}</button>
      </form>
      {message && <p role="status" className="mt-4 rounded-2xl bg-[#EAF3E5] p-4 font-bold">{message}</p>}
      <p className="mt-6 text-sm font-bold text-[#65736C]">로그인 없이도 공개 콘텐츠는 계속 둘러볼 수 있습니다.</p>
    </section>
  </main>;
}
