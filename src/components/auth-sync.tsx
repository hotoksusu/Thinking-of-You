"use client";
import { useEffect } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { migrateLocalUserData } from "@/lib/local-data-migration";

export function AuthSync() {
  useEffect(() => {
    if (!getPublicSupabaseEnv()) return;
    const supabase = createClient();
    supabase.auth.getSession().then((result: { data: { session: Session | null } }) => { if (result.data.session) void migrateLocalUserData(); });
    const { data } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => { if (event === "SIGNED_IN") void migrateLocalUserData(); });
    return () => data.subscription.unsubscribe();
  }, []);
  return null;
}
