ALTER TABLE care_staff ADD COLUMN role TEXT NOT NULL DEFAULT 'nurse';
--> statement-breakpoint
ALTER TABLE care_staff ADD COLUMN active INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
ALTER TABLE care_staff ADD COLUMN expires_at INTEGER;
--> statement-breakpoint
ALTER TABLE care_sessions ADD COLUMN last_seen_at INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
CREATE TABLE care_audit (id TEXT PRIMARY KEY, tenant_id TEXT, actor_hash TEXT NOT NULL, action TEXT NOT NULL, outcome TEXT NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE care_work (tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, PRIMARY KEY(tenant_id,patient_id), FOREIGN KEY(patient_id,tenant_id) REFERENCES care_patients(id,hospital_id));
--> statement-breakpoint
CREATE TABLE care_work_events (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, kind TEXT NOT NULL, payload TEXT NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE care_time_entries (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES care_hospitals(id), actor_hash TEXT NOT NULL, day TEXT NOT NULL, phase TEXT NOT NULL, category TEXT NOT NULL, minutes REAL NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE care_policies (tenant_id TEXT PRIMARY KEY REFERENCES care_hospitals(id), payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1);
--> statement-breakpoint
CREATE TABLE care_notifications (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, event_key TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'not_configured', attempts INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE care_rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE care_pilot_requests (id TEXT PRIMARY KEY, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', revision INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX care_audit_tenant_time ON care_audit(tenant_id,created_at);
--> statement-breakpoint
CREATE INDEX care_events_tenant_patient ON care_work_events(tenant_id,patient_id,created_at);
--> statement-breakpoint
CREATE TABLE care_classifications (tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, source_id TEXT NOT NULL, source_updated_at TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(tenant_id,patient_id,source_id,source_updated_at));
