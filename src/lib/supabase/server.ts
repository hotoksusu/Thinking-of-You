import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicSupabaseEnv } from "./env";

export async function createClient() {
  const { url, anonKey } = requirePublicSupabaseEnv();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
      },
    },
  });
}
