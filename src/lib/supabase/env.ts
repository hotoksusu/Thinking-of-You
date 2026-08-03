export function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function requirePublicSupabaseEnv() {
  const env = getPublicSupabaseEnv();
  if (!env) throw new Error("Supabase 연결 정보가 설정되지 않았습니다. 운영자에게 문의해 주세요.");
  return env;
}
