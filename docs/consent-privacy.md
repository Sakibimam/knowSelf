# Consent, Privacy, and Data Deletion Requirements

## Consent screen requirements (before question 1)
Display these checkboxes (unchecked by default):
- `I understand this is an informational personality trait assessment, not a clinical diagnosis.`
- `I consent to processing my responses to generate trait results.`
- Optional: `I consent to my de-identified responses being used to improve norms/research.`

Blocking rule:
- Required checkboxes must be accepted before the user can proceed.

## Data minimization model
- `assessment_session` table:
  - `session_id` (UUID)
  - `created_at`, `completed_at`
  - `duration_seconds`
  - `validity_flags` (JSON)
  - `result_snapshot` (JSON)
- `assessment_responses` table:
  - `session_id`
  - `item_id`
  - `raw_value`
- `identity_contact` table (optional, only if user requests saved history):
  - `session_id`
  - `email_hash` (salted hash)
  - `consent_research` (bool)

PII boundary:
- Keep identity/contact data isolated from responses/results.
- Default mode should allow anonymous completion.

## Security controls
- Encrypt in transit: TLS only.
- Encrypt at rest for database and backups.
- Role-based access for admin analytics.
- Audit log for export/delete operations.

## Retention policy (default)
- Anonymous response + score data: 12 months.
- Identifiable data (if any): 90 days unless user keeps account/history.
- Auto-delete expired records via scheduled job.

## Delete-my-data workflow
User-facing steps:
1. User enters email/token in deletion page.
2. System verifies ownership via one-time link/code.
3. System performs hard delete on identity mapping and responses linked to that identity.
4. System returns confirmation receipt ID and timestamp.

Backend endpoint contract:
- `POST /api/privacy/delete-request`
  - Input: `{ email }`
  - Output: `{ requestId, status: "verification_sent" }`
- `POST /api/privacy/delete-confirm`
  - Input: `{ requestId, verificationCode }`
  - Output: `{ status: "deleted", deletedSessionCount, deletedAt }`

## Mandatory user disclosures
- Inform users of:
  - What data is collected
  - Why data is used
  - How long data is retained
  - How to request deletion
  - Non-diagnostic limitation

## Pre-production privacy checklist
- Consent gating implemented and tested.
- Optional research consent split from core consent.
- Deletion endpoints tested with integration test.
- Logs exclude response text and raw PII.
- Backup deletion process documented.
