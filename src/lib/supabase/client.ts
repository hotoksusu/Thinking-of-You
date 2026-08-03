"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requirePublicSupabaseEnv } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const { url, anonKey } = requirePublicSupabaseEnv();
  browserClient ??= createBrowserClient(url, anonKey);
  return browserClient;
}
