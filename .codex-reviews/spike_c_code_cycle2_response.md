```json
{
  "cycle": 2,
  "closeable_after_patch": false,
  "previous_cycle_closed_findings": [
    "SPIKEC1-001",
    "SPIKEC1-002",
    "SPIKEC1-003",
    "SPIKEC1-004",
    "SPIKEC1-005",
    "SPIKEC1-007",
    "SPIKEC1-008",
    "SPIKEC1-009",
    "SPIKEC1-010",
    "SPIKEC1-012"
  ],
  "previous_cycle_remaining_findings": [
    "SPIKEC1-006",
    "SPIKEC1-011"
  ],
  "new_blocking_findings": [
    {
      "id": "SPIKEC2-001",
      "severity": "blocking",
      "category": "test-only escape hatch / TTL policy bypass",
      "file": "apps/spike-c-local/src/sign-url.ts",
      "line_range": "175-204",
      "issue": "_issueShortTtlForExpiryTest is exported from the production signing module and bypasses normal ttl max / refresh-before / audit policy. The only production separation is a comment and underscore prefix.",
      "evidence": "The helper directly calls getSignedUrl with req.ttlSeconds at lines 187-190 and never checks SIGNED_URL_MAX_TTL_SECONDS, refresh_before < ttl, or emits audit. Any production caller can import it.",
      "suggested_patch": "Move short-TTL issuance into the scenario file, or gate it with an explicit test-only module that is excluded from production builds. If it must remain exported, enforce NODE_ENV/test flag and still apply max TTL + audit."
    },
    {
      "id": "SPIKEC2-002",
      "severity": "major",
      "category": "refresh policy",
      "file": "apps/spike-c-local/src/sign-url.ts",
      "line_range": "156-173",
      "issue": "refreshSignedUrl can refresh an expired SignedUrlResult indefinitely. This makes refresh a bearer-metadata renewal endpoint unless the caller adds a separate policy.",
      "evidence": "The comment explicitly says '만료 후 무기한 refresh 가능' and the function immediately reissues via issueSignedUrl without checking previous.expiresAt, previous.refreshAt, grace window, or membership state.",
      "suggested_patch": "Add a refresh policy object or parameters: reject when Date.now() > previous.expiresAt, optionally require now >= previous.refreshAt, and revalidate current membership/authorization before issuing."
    },
    {
      "id": "SPIKEC2-003",
      "severity": "major",
      "category": "method confusion acceptance weakened",
      "file": "apps/spike-c-local/src/scenarios/test-method-confusion.ts",
      "line_range": "79-86",
      "issue": "HEAD against a GET signed URL is counted as PASS even when status is 200, while C.3 still says method confusion must be 100% blocked.",
      "evidence": "Line 83 allows r5.status === 200. docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md lines 228-230 require method confusion '100% block'.",
      "suggested_patch": "Either change the SoT to explicitly define HEAD-on-GET as provider-compatible and acceptable, or make the test fail on 200 and add separate HEAD signed URL cases: HEAD→HEAD 200, GET/PUT/DELETE→HEAD denied."
    },
    {
      "id": "SPIKEC2-004",
      "severity": "major",
      "category": "content-length provider gate false pass",
      "file": "apps/spike-c-local/src/scenarios/test-content-type.ts",
      "line_range": "105-117",
      "issue": "The content-length mismatch case can pass when the bad request never reaches the provider, so local PASS does not prove provider-side enforcement.",
      "evidence": "Lines 110-111 count client-side rejection as LOCAL acceptable. That is useful information, but it should not satisfy a provider-enforcement scenario.",
      "suggested_patch": "Split the result into LOCAL_CLIENT_BLOCKED vs PROVIDER_DENIED. For provider verification, use a lower-level HTTP client capable of sending controlled Content-Length behavior, or mark this scenario PROVIDER_REQUIRED instead of PASS."
    },
    {
      "id": "SPIKEC2-005",
      "severity": "major",
      "category": "ListBucket credential coverage gap",
      "file": "apps/spike-c-local/src/scenarios/test-list-bucket.ts",
      "line_range": "108-125",
      "issue": "Credential-layer ListBucket tests cover own prefix and cross prefix, but not empty/missing/root prefixes. That leaves the highest-risk list-all path unverified.",
      "evidence": "Cases 4-6 only call listWithClient with instancePrefix(A) or instancePrefix(B). docker-compose.yml policy uses StringLike s3:prefix, but no test proves Prefix undefined, '', or 'instances/' is denied.",
      "suggested_patch": "Add credential negative cases for Prefix omitted, Prefix '', Prefix 'instances/', and Prefix 'instances/{uuid}' without trailing slash/wildcard expectation. Require 403 and zero keys."
    },
    {
      "id": "SPIKEC2-006",
      "severity": "minor",
      "category": "SoT/documentation drift",
      "file": "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md",
      "line_range": "220-235",
      "issue": "The C.3 table is stale relative to v0.2 tests: ListBucket says local only app-layer despite minio credential tests, and URL audit says 4 cases despite 11 negative cases.",
      "evidence": "Lines 220 and 232 still call ListBucket LOCAL_STUB/application-layer only. Line 234 says scrubber test 4 case PASS, while test-audit-scrubbing.ts defines 11 negative leak cases plus positive issuance.",
      "suggested_patch": "Update C.3 to separate minio credential-smoke from R2 provider gate, and update audit scenario counts/criteria so acceptance cannot be misread."
    }
  ],
  "convergence_signal": "cycle 1 12개 중 10개 close, 2개 partially remaining. 신규 6개 발견: blocking 1, major 4, minor 1. 수렴 추세는 좋지만, production/test 분리와 PASS 기준 약화가 남아 closeable은 아님.",
  "next_cycle_focus": "test-only signing helper 제거 또는 빌드 격리, refresh expiry/membership policy 명문화, HEAD/GET SoT 결정, content-length provider gate 분리, ListBucket empty-prefix credential deny 추가."
}
```