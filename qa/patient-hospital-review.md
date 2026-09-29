# Patient hospital guide QA

## Compact-detail follow-up
Urgent symptoms and previous appointment details default collapsed. Removed the duplicated expanded emergency footer. Appointment, hospital contact, visit preparation and family help are separate sections. Desktop contact fields use two columns within the existing 640px shell; bottom padding now includes safe-area in addition to navigation clearance.

Demo missing-contact fixtures are explicitly labeled examples; mock telephone/map buttons simulate the action without dialing fictitious numbers. Real missing telephone information offers expandable contact-finding steps and an official-contact search link. Owner/admin hospital settings now require telephone, opening hours and address; persistence is guarded by the existing hospital session and uses the existing storage architecture.

Added desktop/mobile checks for accordion toggles, mock action feedback, real missing-phone recovery, manager settings persistence through to patient contact, 640px desktop width and last-card/navigation non-overlap at page end. Existing patient journeys remain passing. No telephone calls were placed by QA.

- Hospital-first header; separate urgent expansion, contact anchor and appointment anchor.
- Seoul-calendar appointment states: upcoming, today, past and noAppointment. Past dates cannot be labeled next appointment; date-only values do not invent a time. Upcoming/today connect to recovery history.
- Optional registered Hospital.phone/openingHours/address fields render contact details, sanitized tel links and encoded map directions. Missing contact data retains honest fallback guidance. No invented contact information was added to production fixtures.
- Guardian help accurately describes the existing same-device workflow, visible patient information and consent. Separate invitation delivery and revocation are not implemented or advertised. Same-device assistance requires the on-screen consent checkbox before its link is shown.
- Urgent guidance is separate from ordinary hospital contact, with a 119 telephone link. Tests inspect telephone destinations without placing calls.

Validation: Next production export (157 routes) succeeded. Seven tests passed: Seoul date boundaries/invalid dates; desktop/mobile hospital guide; desktop/mobile existing patient home; desktop/mobile complete demo and synthetic real patient journeys. Registered and missing contacts, maps, guardian consent, four appointment states, active tab and history navigation were checked. Existing unrelated lint warnings remain; changed components have no warnings.

patient-hospital-1440.png and patient-hospital-390.png use synthetic contact data inside the isolated test browser only. Existing localStorage authentication remains unchanged.
