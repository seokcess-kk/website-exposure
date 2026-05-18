// @glitzy/notifications-outbox — Spike B LOCAL_PASS 패턴 production module (v0.2)
//
// v0.2 scope:
//   - errors (4 domain)
//   - provider-adapter (interface·ProviderAttemptResult union)
//   - outbox (enqueue·claim SKIP LOCKED·markCompleted·markRetry·markFailedPermanent·reclaimStale)
//
// v0.3 scope (다음 cycle·worker harness):
//   - inbox (insertWithIdempotency)
//   - permanent-alert (recordPermanentAlert·UNIQUE)
//   - provider_attempt_log (accepted-success UNIQUE·idempotency-key)
//   - worker harness (claim → tenant tx → provider call → markCompleted·outer try-catch·failure injection 10 point)

export {
  OutboxAlreadyEnqueuedError,
  OutboxClaimRaceError,
  ProviderTransientError,
  ProviderPermanentError,
} from "./errors.js";

export type {
  ProviderAdapter,
  ProviderAttemptRequest,
  ProviderAttemptResult,
} from "./provider-adapter.js";

export {
  enqueue,
  claim,
  markCompleted,
  markRetry,
  markFailedPermanent,
  reclaimStale,
  type OutboxRow,
  type EnqueueInput,
  type OutboxStatus,
  type LastErrorClass,
} from "./outbox.js";
