{
  "cycle": 4,
  "closeable_after_patch": false,
  "previous_cycle_closed_findings": [
    "SPIKEC3-005: C.2 ListBucket SoT drift is corrected in docs and local scenario now covers app-layer + minio credential-level negative cases.",
    "SPIKEC3-006: RefreshRejectedError split to errors.ts is acceptable; re-export preserves existing imports and instanceof uses the same class object.",
    "SPIKEC2-001: _localShortTtlIssue is scenario-local and tsconfig production exclude is structurally correct, though build wiring still needs a new finding below."
  ],
  "previous_cycle_remaining_findings": [
    "SPIKEC2-002 / SPIKEC3-002: RefreshPolicy validation improved but does not hard-reject top-level null/non-object policy as RefreshRejectedError('invalid-policy'). apps/spike-c-local/src/sign-url.ts:174 dereferences policy.graceMs directly.",
    "SPIKEC2-003 / SPIKEC3-003: HEAD↔GET SoT is still inconsistent. Docs C.2-4 says empirical-provider-behavior, but C.3 table still says provider standard, and test-method-confusion comments still claim identical canonical signature. docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md:229, apps/spike-c-local/src/scenarios/test-method-confusion.ts:79",
    "SPIKEC2-004 / SPIKEC3-004: content-length mismatch remains INCONCLUSIVE locally and scenario:all still exits 0 without machine-readable propagation beyond stdout.",
    "SPIKEC2-006, SPIKEC1-006, SPIKEC1-011: not fully closeable because content-type/provider-deny helper still treats client-side rejection as PASS for cases 2/3. apps/spike-c-local/src/scenarios/test-content-type.ts:23"
  ],
  "new_blocking_findings": [],
  "new_major_findings": [
    {
      "id": "SPIKEC4-001",
      "title": "Production/scenario typecheck split is not wired into package scripts",
      "evidence": "apps/spike-c-local/package.json:6 has no build/typecheck/typecheck:scenarios scripts. Root package only exposes spike-c:all. Running `pnpm --filter @glitzy/spike-c-local exec tsc --noEmit -p tsconfig.json` and scenarios tsconfig both failed because tsc is not installed in the current environment.",
      "impact": "The tsconfig exclude is correct in isolation, but CI/local acceptance cannot prove production emit excludes scenarios or that scenarios typecheck unless callers know the raw tsc commands.",
      "recommendation": "Add explicit scripts such as `typecheck:prod`, `typecheck:scenarios`, and optionally `build`, then wire them into the acceptance command or document them as required gates."
    },
    {
      "id": "SPIKEC4-002",
      "title": "RefreshPolicy hard validation misses top-level null/non-object policy",
      "evidence": "validateRefreshPolicy(policy) immediately reads policy.graceMs at apps/spike-c-local/src/sign-url.ts:174.",
      "impact": "`refreshSignedUrl(..., null as any)` throws a TypeError instead of RefreshRejectedError('invalid-policy'), so hostile JS/runtime callers can escape the intended error contract.",
      "recommendation": "First check `typeof policy === 'object' && policy !== null`, then validate fields. Add cases for null and a primitive top-level policy."
    },
    {
      "id": "SPIKEC4-003",
      "title": "HEAD↔GET correction is incomplete in code comments and C.3 acceptance table",
      "evidence": "docs line 218 is corrected, but docs line 229 still says HEAD↔GET interop is provider standard. test-method-confusion lines 79-81 still state identical canonical signature.",
      "impact": "The old incorrect SoT remains discoverable exactly where acceptance criteria and scenario interpretation are read.",
      "recommendation": "Update C.3 and scenario comments/output to say informational empirical provider behavior, not provider standard or canonical-signature equivalence."
    },
    {
      "id": "SPIKEC4-004",
      "title": "content-type negative cases can still pass on client-side rejection",
      "evidence": "assertProviderDeny returns success when r.clientError is set at apps/spike-c-local/src/scenarios/test-content-type.ts:23-26, and that helper is used for mismatched/missing content-type cases.",
      "impact": "Provider awsCode/status assertion can be bypassed for cases that are supposed to prove provider-side signed header enforcement.",
      "recommendation": "For content-type cases 2/3, treat clientError as INCONCLUSIVE or FAIL, not PASS. Keep the separate INCONCLUSIVE handling only for the known content-length injection limitation."
    },
    {
      "id": "SPIKEC4-005",
      "title": "INCONCLUSIVE status is not machine-enforced by scenario:all",
      "evidence": "test-content-type prints INCONCLUSIVE but exits 0; package scenario:all chains it with `&&` at apps/spike-c-local/package.json:18.",
      "impact": "A CI/CD job that only checks exit code will report green despite an unresolved provider-gate requirement.",
      "recommendation": "Emit a machine-readable status artifact, split `scenario:content-type` into local-pass and provider-required checks, or add a strict mode env flag that exits non-zero on INCONCLUSIVE."
    }
  ],
  "new_minor_findings": [
    {
      "id": "SPIKEC4-006",
      "title": "Method-confusion summary overstates informational case as PASS",
      "evidence": "apps/spike-c-local/src/scenarios/test-method-confusion.ts:86 prints `4 enforced + 1 informational PASS`.",
      "recommendation": "Change to `4 enforced PASS + 1 informational recorded`."
    },
    {
      "id": "SPIKEC4-007",
      "title": "R2 documentation reference is bare text, not a durable citation",
      "evidence": "docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md:218 includes the URL in prose only.",
      "recommendation": "Use a markdown link and, if this remains decision-critical, cite the exact R2 presigned URL operation wording in a short note."
    }
  ],
  "convergence_signal": "Improving but not converged. The patch closed the ListBucket drift and error-class split, and moved the TTL helper out of production source. Remaining issues are now mostly acceptance-contract problems: stale SoT text, runtime validation edge cases, and local/CI status signaling.",
  "next_cycle_focus": "Make acceptance mechanically enforceable: add prod/scenario typecheck scripts, normalize HEAD↔GET wording in docs and scenario output, harden RefreshPolicy object validation, and ensure INCONCLUSIVE cannot be mistaken for LOCAL_PASS by scenario:all."
}