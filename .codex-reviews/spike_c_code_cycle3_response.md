{
  "cycle": 3,
  "closeable_after_patch": false,
  "previous_cycle_closed_findings": [
    "SPIKEC2-005"
  ],
  "previous_cycle_remaining_findings": [
    "SPIKEC2-001",
    "SPIKEC2-002",
    "SPIKEC2-003",
    "SPIKEC2-004",
    "SPIKEC2-006",
    "SPIKEC1-006",
    "SPIKEC1-011"
  ],
  "new_blocking_findings": [],
  "new_major_findings": [
    "SPIKEC3-001: test-only scenario code is still in the production TypeScript build surface. apps/spike-c-local/tsconfig.json includes src/**/*.ts, so src/scenarios/test-replay.ts and _localShortTtlIssue are emitted by a normal tsc build. This materially weakens the SPIKEC2-001 isolation claim. Fix by excluding src/scenarios from production tsconfig and adding a separate tsconfig.scenarios.json or keeping scenarios tsx-only.",
    "SPIKEC3-002: RefreshPolicy accepts NaN/Infinity/huge graceMs. In apps/spike-c-local/src/sign-url.ts, `now > previous.expiresAt + policy.graceMs` becomes false for NaN and effectively unbounded for Infinity, allowing expired URL refresh. Validate Number.isFinite(policy.graceMs), integer/non-negative, and cap it to an explicit max.",
    "SPIKEC3-003: HEAD↔GET SoT rationale is not defensible as written. The doc says AWS S3/minio/R2 use the same canonical signature, but AWS SigV4 canonical requests include HTTPMethod, and Cloudflare R2 documents presigned URLs by permitted operation GET/PUT/HEAD/DELETE. Sources: https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html and https://developers.cloudflare.com/r2/api/s3/presigned-urls/. Keep case-5 informational if desired, but change SoT to empirical-provider-behavior-with-provider-gate, not canonical-signature equivalence.",
    "SPIKEC3-004: content-length mismatch is still counted as PASS in scenario output even when provider never receives the request. The code improved the marker, but `scenario:all` still exits green and prints LOCAL_CLIENT_BLOCKED/PROVIDER_GATE PASS, so C-local can be over-read as satisfying the provider gate. Make this an explicit SKIP/INCONCLUSIVE artifact or split provider-gated checks out of local PASS.",
    "SPIKEC3-005: SoT drift remains in C.2. docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md still says `ListBucket — LOCAL_STUB`, root credential only, `PROVIDER_REQUIRED`, while C.3 and code now claim minio per-instance policy credential negatives. The old paragraph will mislead downstream readers."
  ],
  "new_minor_findings": [
    "SPIKEC3-006: RefreshRejectedError lives in sign-url.ts while related domain errors live in errors.ts. Not a correctness blocker, but error taxonomy is now split and tests import from the feature module rather than the domain error module.",
    "SPIKEC3-007: I could not run TypeScript verification because `tsc` is not installed/resolvable in the current workspace node_modules despite package.json declaring it."
  ],
  "convergence_signal": "Improving but not converged. The patch moved several issues from absent coverage to explicit policy/marker language, and ListBucket credential negatives are materially stronger. Remaining risk is now mostly acceptance-boundary precision: test-only build isolation, invalid refresh policy inputs, unsupported HEAD/GET rationale, and local PASS wording for provider-gated behavior.",
  "next_cycle_focus": "Separate production and scenario tsconfigs, hard-validate RefreshPolicy, rewrite HEAD/GET SoT with provider citations or empirical gate language, make provider-gated local checks non-closeable in output, and clean the C.2/C.3/C.4 drift before declaring closeable."
}