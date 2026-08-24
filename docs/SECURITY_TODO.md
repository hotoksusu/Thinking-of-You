# Production security checklist

The current authentication and persistence implementation is **DEMO ONLY**. Before any hospital pilot with real patient data, replace or complete:

- Production authentication provider and secure password storage
- SMS/OTP identity verification and cryptographically secure invitation tokens
- Server-side sessions, expiration/revocation policy, account recovery and rate limiting
- Database access control and server-enforced hospital tenant isolation
- Operator MFA and least-privilege role review
- Persistent, tamper-resistant audit logs and backup/retention policy
- CSRF, XSS, dependency and penetration testing
- Privacy policy, consent records and personal-data minimization review
- Secure secrets management, encryption and incident response procedures

Never treat browser storage, client route guards, or Demo credentials as production security controls.
