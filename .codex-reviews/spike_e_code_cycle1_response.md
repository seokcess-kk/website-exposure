{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {
      "id": "SPIKEE1-001",
      "severity": "blocking",
      "category": "SoT/RLS",
      "file": "apps/spike-e/src/resolve-tenant-context.ts",
      "line_range": "54-166",
      "issue": "E.1/E.3 requires authorized request to set `app.current_instance_id`, but the implementation only returns a context object and never performs `SET LOCAL`/`set_config` or enters Spike A `withTenantTransaction`.",
      "evidence": "SoT says `app.current_instance_id` set and E.3 requires `100% 통과 + RLS set` (`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md:341,383`). Spike A pattern sets `SELECT set_config('app.current_instance_id', ...)` (`apps/spike-a/src/tenant.ts:42-43`). Spike E has no `SET LOCAL`, `set_config`, or `current_setting` use.",
      "suggested_patch": "Add a resolver-to-RLS integration path: either `resolveTenantContextAndRunTenantTransaction(...)` wrapping Spike A `withTenantTransaction`, or return only a branded context consumed by a tested wrapper that sets `app.current_instance_id`. Add scenario asserting `current_setting('app.current_instance_id', true) == ctx.instanceId` inside the authorized request transaction."
    },
    {
      "id": "SPIKEE1-002",
      "severity": "blocking",
      "category": "Audit correctness",
      "file": "apps/spike-e/src/session.ts",
      "line_range": "103-109",
      "issue": "`instance-switched` audit is caller-responsibility, so the acceptance criterion '전환 1회 = audit 1건' is not guaranteed by the switching API.",
      "evidence": "`setSuperAdminSelectedInstance` only updates the session row. The scenario manually calls `emitAuditEvent` after each switch (`apps/spike-e/src/scenarios/test-super-admin-switch.ts:25-42`), so tests prove only the happy-path scenario remembered to audit, not the API invariant.",
      "suggested_patch": "Replace or wrap `setSuperAdminSelectedInstance` with `switchSuperAdminInstance(sql, sessionId, actorUserId, toInstanceId)` that reads the previous selected instance, updates the row, and emits exactly one `instance-switched` audit in the same transaction. Test missing-audit is impossible by checking audit count after calling only the public switch API."
    },
    {
      "id": "SPIKEE1-003",
      "severity": "blocking",
      "category": "Auth.js compatibility",
      "file": "apps/spike-e/migrations/003_auth_session.sql",
      "line_range": "1-27",
      "issue": "The migration claims Auth.js Drizzle adapter compatibility, but creates custom `auth_session` and `auth_verification_token` tables instead of the next-auth/Auth.js `user/session/account/verificationToken` schema required by INFRA.",
      "evidence": "INFRA lists User/Auth next-auth tables as `user·session·account·verificationToken` (`docs/decisions/INFRA_DECISIONS_DRAFT.md:348`). The local migration creates `auth_session` and `auth_verification_token` and omits account/user adapter tables.",
      "suggested_patch": "Either use actual Auth.js Drizzle adapter table names/shapes in local spike, or mark this as LOCAL_AUTH_SIMULATION with an explicit PROVIDER_GATE blocker. Do not label the schema compatible until a NextAuth adapter smoke test writes and reads the same rows."
    },
    {
      "id": "SPIKEE1-004",
      "severity": "major",
      "category": "Authorization model",
      "file": "apps/spike-e/migrations/002_admin_user.sql",
      "line_range": "20-31",
      "issue": "The membership role enum diverges from REVIEW_WORKFLOW/DATA_MODEL roles and can accept roles that do not exist in the SoT while rejecting roles that do.",
      "evidence": "SoT roles are `super-admin`, `operator`, `physician-reviewer`, `legal-reviewer`, `client-approver` (`docs/admin/REVIEW_WORKFLOW.md:731-735`, `docs/core/DATA_MODEL.md:968`). Spike E stores `operator`, `admin`, `legal_reviewer`, `analyst` (`apps/spike-e/migrations/002_admin_user.sql:28`).",
      "suggested_patch": "Align DB CHECK and TypeScript union to the SoT role vocabulary, or explicitly document this as a spike-local reduced enum and add a mapping test proving no production role semantics are being inferred from the local enum."
    },
    {
      "id": "SPIKEE1-005",
      "severity": "major",
      "category": "DATA_MODEL cascade",
      "file": "apps/spike-e/migrations/002_admin_user.sql",
      "line_range": "20-31",
      "issue": "`instance_membership` omits `deactivated_at` and `deactivated_by`, despite DATA_MODEL C-23 requiring them after SPIKE2-03 cascade.",
      "evidence": "C-23 requires `instanceMemberships` entries to include `active`, `deactivatedAt`, and `deactivatedBy` and states `active=false` must reject on next request (`docs/core/DATA_MODEL.md:974`). Migration only has `active`, `created_at`, and `updated_at`.",
      "suggested_patch": "Add nullable `deactivated_at TIMESTAMPTZ` and `deactivated_by UUID/TEXT` fields, update membership-removal scenario to set them, and assert resolve still rejects based on `active=false` without waiting for session refresh."
    },
    {
      "id": "SPIKEE1-006",
      "severity": "major",
      "category": "Super-admin eligibility",
      "file": "apps/spike-e/src/resolve-tenant-context.ts",
      "line_range": "92-116",
      "issue": "Super-admin bypasses membership and legal eligibility entirely and is assigned `admin` role for any selected instance.",
      "evidence": "REVIEW_WORKFLOW says super-admin must not bypass medical/legal/client approval eligibility (`docs/admin/REVIEW_WORKFLOW.md:754-757`). The super-admin branch never checks `legal_reviewer_eligible` or approver eligibility and returns `effectiveRole = 'admin'`.",
      "suggested_patch": "Separate tenant access from action eligibility. For super-admin tenant switching, resolve a tenant context without granting reviewer roles, and require action-level eligibility checks for legal/medical/client approval paths. Add a scenario where super-admin attempts legal-reviewer action without legal eligibility and is rejected."
    },
    {
      "id": "SPIKEE1-007",
      "severity": "major",
      "category": "Input validation/403 matrix",
      "file": "apps/spike-e/src/resolve-tenant-context.ts",
      "line_range": "57,119-120",
      "issue": "Malformed or empty `requestedInstanceId` is not normalized into a controlled `TenantResolveError`/403 path.",
      "evidence": "The value is used directly in the UUID comparison query. Invalid UUID input can surface as a raw PostgreSQL error rather than a `membership-not-found`/403-denied audit path. No scenario covers malformed UUID, null-equivalent, whitespace, or non-canonical UUID.",
      "suggested_patch": "Validate `requestedInstanceId` before SQL with a strict UUID parser/canonicalizer. On failure emit `tenant-resolve-denied` with reason `invalid-instance-id` and throw `TenantResolveError`. Add negative cases to `test-client-tampering` or a dedicated 403 matrix scenario."
    },
    {
      "id": "SPIKEE1-008",
      "severity": "major",
      "category": "Magic link TTL/race",
      "file": "apps/spike-e/src/magic-link.ts",
      "line_range": "61-80",
      "issue": "Magic link consumption checks expiry before the CAS update, but the atomic update does not include `expires_at > now()`. A token that expires between SELECT and UPDATE can still be consumed.",
      "evidence": "The SELECT reads `expires_at`, then UPDATE guards only `consumed_at IS NULL`. TTL-bound one-time semantics are part of the stated output and scenario.",
      "suggested_patch": "Make the consume operation a single atomic UPDATE with `consumed_at IS NULL AND expires_at > now()` returning the identifier, or include `expires_at > now()` in the CAS and distinguish expired vs consumed with a follow-up read if needed."
    },
    {
      "id": "SPIKEE1-009",
      "severity": "minor",
      "category": "Identifier normalization",
      "file": "apps/spike-e/src/magic-link.ts",
      "line_range": "35-49,56-58",
      "issue": "Email normalization is only `toLowerCase()`. Leading/trailing whitespace and Unicode normalization differences produce distinct identifiers or invalid behavior.",
      "evidence": "`issueMagicLink` and `consumeMagicLink` call `identifier.toLowerCase()` directly. No trim, NFC/NFKC normalization, or canonical validation is applied.",
      "suggested_patch": "Introduce `normalizeIdentifier(input)` using `trim()`, Unicode normalization, lowercase, and a conservative email validator. Use it consistently for issue, consume, seed lookup, and mailbox entries."
    },
    {
      "id": "SPIKEE1-010",
      "severity": "major",
      "category": "Provider gate evidence",
      "file": "apps/spike-e",
      "line_range": "N/A",
      "issue": "E.2-provider Day 10 artifacts and PROVIDER_GATE markers are absent, so local pass cannot be interpreted as unblocking admin UI middleware/login flow.",
      "evidence": "SoT requires Vercel preview + Auth.js production-like callback, secure cookie/SameSite, DB session persistence, and 403 matrix (`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md:368-375`). The repo has local function scenarios only; no provider report, marker, or preview smoke script is present.",
      "suggested_patch": "Add an explicit `PROVIDER_PENDING`/`PROVIDER_GATE` artifact for Spike E, with checklist rows for Auth.js callback, secure cookie, DB persistence, and requestedInstanceId tampering. Wire acceptance status so LOCAL_PASS does not imply provider pass."
    }
  ],
  "convergence_signal": "핵심 auth/session primitives는 로컬 함수 수준으로는 대부분 존재하지만, acceptance의 가장 중요한 두 축인 RLS context set과 switch audit invariant가 API 레벨에서 보장되지 않는다. 또한 Auth.js 호환성 주장이 실제 schema/API와 맞지 않아 provider gate 전에는 close 불가다.",
  "next_cycle_focus": "RLS integration wrapper + boolean assertion, audited super-admin switch API, Auth.js schema/provider marker 정리, malformed requestedInstanceId 403 matrix, C-23 role/deactivation cascade."
}