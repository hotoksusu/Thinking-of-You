const MIGRATION_FLAG = "today-anbu:supabase-migration:v1";
const USER_DATA_KEYS = [
  "today-anbu:care-schedules", "today-anbu:checkin-records", "today-anbu:daily-check-in",
  "today-anbu:self-checkin-condition", "today-anbu:self-checkin-medicine", "today-anbu:self-checkin-schedule",
  "oneul-anbu-mood-history", "oneul-anbu-farm", "oneul-anbu-question-history",
];

export async function migrateLocalUserData() {
  if (typeof window === "undefined" || localStorage.getItem(MIGRATION_FLAG) === "done") return;
  const records = USER_DATA_KEYS.flatMap((key) => {
    const value = localStorage.getItem(key); if (!value) return [];
    try { return [{ storage_key: key, value: JSON.parse(value) }]; } catch { return []; }
  });
  if (!records.length) { localStorage.setItem(MIGRATION_FLAG, "done"); return; }
  const response = await fetch("/api/user-data/migrate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ records }) });
  if (!response.ok) return;
  const result = await response.json() as { migrated?: string[] };
  result.migrated?.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(MIGRATION_FLAG, "done");
}
