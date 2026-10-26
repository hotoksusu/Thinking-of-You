ALTER TABLE care_notifications ADD COLUMN provider_id TEXT;
--> statement-breakpoint
ALTER TABLE care_notifications ADD COLUMN error_code TEXT;
--> statement-breakpoint
ALTER TABLE care_notifications ADD COLUMN next_attempt_at INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE care_notifications ADD COLUMN lease TEXT;
--> statement-breakpoint
CREATE TABLE care_notification_attempts (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, notification_id TEXT NOT NULL REFERENCES care_notifications(id), status TEXT NOT NULL, code TEXT, created_at INTEGER NOT NULL);
