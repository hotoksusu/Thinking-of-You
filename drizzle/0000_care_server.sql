CREATE TABLE care_hospitals (id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE care_staff (email TEXT NOT NULL, hospital_id TEXT NOT NULL REFERENCES care_hospitals(id), PRIMARY KEY(email,hospital_id));
--> statement-breakpoint
CREATE TABLE care_patients (id TEXT NOT NULL, hospital_id TEXT NOT NULL REFERENCES care_hospitals(id), payload TEXT NOT NULL, source_ref TEXT, UNIQUE(hospital_id,source_ref), PRIMARY KEY(id,hospital_id));
--> statement-breakpoint
CREATE TABLE care_invitations (id TEXT PRIMARY KEY NOT NULL, token_hash TEXT UNIQUE NOT NULL, patient_id TEXT NOT NULL, hospital_id TEXT NOT NULL, expires_at INTEGER NOT NULL, revoked INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, FOREIGN KEY(patient_id,hospital_id) REFERENCES care_patients(id,hospital_id));
--> statement-breakpoint
CREATE TABLE care_sessions (token_hash TEXT PRIMARY KEY NOT NULL, invitation_id TEXT NOT NULL REFERENCES care_invitations(id), patient_id TEXT NOT NULL, hospital_id TEXT NOT NULL, expires_at INTEGER NOT NULL, confirmed_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE care_checkins (patient_id TEXT NOT NULL, hospital_id TEXT NOT NULL, day TEXT NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(patient_id,hospital_id,day), FOREIGN KEY(patient_id,hospital_id) REFERENCES care_patients(id,hospital_id));
--> statement-breakpoint
CREATE TABLE care_alerts (id TEXT PRIMARY KEY NOT NULL, patient_id TEXT NOT NULL, hospital_id TEXT NOT NULL, payload TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX care_sessions_expiry ON care_sessions(expires_at);
