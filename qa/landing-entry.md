# Landing entry QA — 2026-09-28

- Production static export: Next build completed, 156 pages generated.
- TypeScript: passed.
- Targeted ESLint: zero errors; existing unused CalendarCheck warning in hospital/page.tsx. Local pnpm plugin resolution required NODE_PATH pointing at installed ESLint package node_modules directories; no dependency/config changes made for this workaround.
- Regression command: node --test tests/landing-entry.mjs (Edge; TEST_BASE_URL defaults to localhost:3100).
- Desktop 1440×1000 and mobile 390×844: both passed.
- Click flows: public → patient preview → check-in; public → hospital service → hospital demo; valid invitation → identity/onboarding → patient check-in.
- Existing matching patient session skips onboarding. Public landing redirects a patient session to check-in. Invalid invitation has no demo CTA.
- Separate fresh browser contexts, service workers blocked: direct patient preview CLS 0 on both sizes; no horizontal overflow; image dimensions unchanged after decode. Reload also checked.
- Image transfer: 24,698 bytes including response overhead; local resource duration approximately 18–22ms. These are local measurements, not a production network latency guarantee.
- Original four character PNGs have identical SHA256 hashes. Shared 560×560 WebP retains the artwork and reduces 776,040 bytes to 24,398 bytes (~97%). State-specific icons remain unchanged. Maximum component width is 280px (2× asset).
- Above-the-fold patient companion uses eager/priority, fixed aspect ratio, blur placeholder. Other companion instances remain lazy. Public landing and preview layout preload the same URL; Next Link prefetches preview route.
- Screenshots: qa/entry-1440.png and qa/entry-390.png.
- Invitation QA uses the existing localStorage invitation/session implementation and synthetic records. Cross-device production invitation delivery is outside this change; existing validation and demo data separation remain intact.
- Not deployed.
