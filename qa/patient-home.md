# Patient home UX QA — 2026-09-28

- Home view-model: src/lib/patient-home.ts. Data-driven pending/completed base state plus symptomAlert, appointmentSoon, normalRecovery context; no diagnostic claims from the normalRecovery UI state.
- Home hierarchy: hospital → actual patient/recovery day → daily action → weekly count. Pending order: help then recovery; completed: recovery then help. Character is a secondary completion/encouragement element.
- Weekly counts use unique dates from Monday through today, exclude future records and other patients. Missing surgery date uses discharge date with the correct label.
- Symptom context uses existing open signals linked to recent check-ins, excluding missed-check-in signals. No new clinical thresholds introduced.
- Patient hospital guidance now uses /app/patient/hospital instead of the staff-facing /care/hospital route. Appointment comes from nextAppointment. The data model has no hospital phone field; guidance uses the hospital's discharge/SMS contact information instead of an unrelated hardcoded phone number.
- Navigation titles and active states: 오늘 / 회복 기록 / 병원 안내. Real patient routes and their loading screens have no demo badge.
- Completion flow retains persistence and demo separation, with recovery history as the next main action. No edit CTA added because existing check-in flow does not support record editing.
- Build: 157 routes generated successfully. Changed-file ESLint: zero errors/warnings. Existing warnings elsewhere in repository remain. Local ESLint package resolution uses the previously documented NODE_PATH workaround.
- Unit test: node tests/patient-home-state.mjs — passed (date boundaries, duplicates, missing dates, all states, signal scope, appointment dates).
- UI tests: TEST_BASE_URL=http://127.0.0.1:3100 node --test tests/patient-home-flow.mjs tests/landing-entry.mjs — 4/4 passed at 1440×1000 and 390×844.
- Clicked complete check-in, returned home, verified completed priorities, opened recovery history and hospital guidance; exercised synthetic authenticated patient and appointment state; previous invitation and public landing flows also passed.
- Fresh browser contexts with service workers blocked: completed CLS 0 on both sizes; pending CLS 0 desktop / ~0.0094 mobile. Character dimensions unchanged after decode. These are local static-build measurements, not production-network guarantees.
- Optimized shared 24KB WebP retained; both patient and demo route layouts preload it. Above-fold completion character eager/priority/blur with reserved aspect ratio; lower encouragement stays lazy.
- Screenshots: qa/patient-home-pending-{390,1440}.png and qa/patient-home-completed-{390,1440}.png.
- Existing localStorage session and invitation model retained; not deployed.
