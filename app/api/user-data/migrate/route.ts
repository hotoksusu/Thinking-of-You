import { createClient } from "@/lib/supabase/server";

type RecordInput = { storage_key?: unknown; value?: unknown };
const allowedKeys = new Set(["today-anbu:care-schedules","today-anbu:checkin-records","today-anbu:daily-check-in","today-anbu:self-checkin-condition","today-anbu:self-checkin-medicine","today-anbu:self-checkin-schedule","oneul-anbu-mood-history","oneul-anbu-farm","oneul-anbu-question-history"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  let body: { records?: RecordInput[] };
  try { body = await request.json(); } catch { return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 }); }
  const records = (body.records ?? []).filter((item): item is { storage_key: string; value: unknown } => typeof item.storage_key === "string" && allowedKeys.has(item.storage_key) && JSON.stringify(item.value).length <= 100_000).slice(0, 20);
  if (!records.length) return Response.json({ migrated: [] });
  const rows = records.map((item) => ({ user_id: user.id, storage_key: item.storage_key, payload: item.value, migrated_at: new Date().toISOString() }));
  const { error } = await supabase.from("local_data_imports").upsert(rows, { onConflict: "user_id,storage_key" });
  if (error) return Response.json({ error: "기존 기록을 옮기지 못했어요. 로컬 기록은 그대로 유지됩니다." }, { status: 503 });
  return Response.json({ migrated: records.map((item) => item.storage_key) });
}
