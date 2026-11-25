-- Existing staff retain legacy access. New program access requires an explicit department
-- for non-administrators, in addition to current membership and patient assignment rules.
ALTER TABLE care_staff ADD COLUMN department_scope TEXT;
--> statement-breakpoint
CREATE TABLE care_program_versions (
  tenant_id TEXT NOT NULL REFERENCES care_hospitals(id),
  program_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  status TEXT NOT NULL CHECK (status IN ('draft','review','approved','active','stopped')),
  payload TEXT NOT NULL,
  PRIMARY KEY (tenant_id, program_id, version)
);
--> statement-breakpoint
CREATE UNIQUE INDEX care_program_one_active_version
  ON care_program_versions (tenant_id, program_id)
  WHERE status = 'active';

