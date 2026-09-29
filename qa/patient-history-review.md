# Patient history UX

Implemented a dedicated patient history component: summary, first/latest pain and symptom comparisons, responsive recent-seven-record pain chart, date cards, expand-all, and shared record detail facts. Missing swelling data is explicitly unrecorded, not inferred as no swelling. Removed patient-facing hardcoded sleep improvement and the misleading seven-records-as-seven-days summary.

Existing route/session isolation and typed recovery screens are retained. History and details explicitly activate the history tab. Loading hides bottom navigation rather than momentarily activating Today.

Verification: production export (157 pages) passed; no lint warnings in changed components (existing unrelated repository warnings remain). Edge at 1440px and 390px passed demo and synthetic real invite journeys, active tabs, detail/reload/back, context preservation, expiry/retry, empty records, completed-care navigation, and seven-to-ten-record expansion including zero pain. Screenshots: patient-history-1440.png and patient-history-390.png.

Management duration is explicitly counted from discharge; ended care without a recorded end date shows that the end date is unregistered. Existing localStorage authentication architecture is unchanged; these tests do not validate server-backed or cross-device invitations.
