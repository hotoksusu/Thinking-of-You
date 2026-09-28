# Patient navigation and recovery UX verification

## Changes
- Demo loading and completed-program shells previously omitted demo context, exposing real patient links. All patient links now resolve through a shared navigation context, preserving patientId and proxy.
- Real invitations/session access is checked independently from demo storage. Expired, missing, invalid, missing-patient and storage errors have distinct recovery screens.
- Subpages have Back controls with tracked patient history and a direct-entry fallback. Error pages offer retry and usable link/contact guidance without dead bottom navigation.
- History records open a detail screen. Today's record can be edited repeatedly without creating duplicate daily records; patient edits do not complete clinical tasks.

## Verification
Production export (157 pages) and ESLint on changed source passed.
Edge desktop (1440px) and mobile (390px) click tests passed:
- Landing, demo home, history, detail, reload, back, hospital guidance.
- Check-in, completion, edit and re-edit; separate demo/real storage.
- Direct demo patientId/proxy links and completed-program navigation.
- Synthetic real invite, patient home, check-in, history/detail and guidance.
- Expired/missing session, invalid/expired invite, corrupt storage and retry.
- Empty history, no 404/page errors, no transient real links in demo.
- Existing patient-home and landing-entry regressions; cold image CLS below 0.001 in observed runs.

Screenshots: patient-error-1440.png and patient-error-390.png.

## Scope
Invitation/session verification uses the application's existing localStorage prototype. These tests do not establish cross-device invitation delivery or server-backed authentication. Hospital help without a session provides instructions for finding the existing hospital message/discharge contact, rather than inventing a hospital telephone number.
