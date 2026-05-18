// Spike B — failure injection (v0.2 — SPIKEB1-002·013 정정)
//
// 10 point (SPIKEB1-002: after-provider-success-before-mark-completed 신규):
//  before-claim·after-claim
//  before-tenant-insert·after-tenant-insert
//  after-tenant-commit-before-provider
//  after-provider-success-before-mark-completed
//  before-retry-schedule·after-retry-schedule
//  before-permanent-alert·after-permanent-alert

export type FailurePoint =
  | "before-claim"
  | "after-claim"
  | "before-tenant-insert"
  | "after-tenant-insert"
  | "after-tenant-commit-before-provider"
  | "after-provider-success-before-mark-completed"
  | "before-retry-schedule"
  | "after-retry-schedule"
  | "before-permanent-alert"
  | "after-permanent-alert";

export const ALL_FAILURE_POINTS: FailurePoint[] = [
  "before-claim",
  "after-claim",
  "before-tenant-insert",
  "after-tenant-insert",
  "after-tenant-commit-before-provider",
  "after-provider-success-before-mark-completed",
  "before-retry-schedule",
  "after-retry-schedule",
  "before-permanent-alert",
  "after-permanent-alert",
];

export type InjectionConfig = {
  pointToFailAt: FailurePoint | null;
  triggerOnAttempt: number | null;
};

export const NO_INJECTION: InjectionConfig = { pointToFailAt: null, triggerOnAttempt: null };

export class InjectedFailureError extends Error {
  override readonly name = "InjectedFailureError";
}

export function maybeFail(
  config: InjectionConfig,
  currentPoint: FailurePoint,
  currentAttempt: number,
): void {
  if (config.pointToFailAt !== currentPoint) return;
  if (config.triggerOnAttempt !== null && config.triggerOnAttempt !== currentAttempt) return;
  throw new InjectedFailureError(`injected failure at ${currentPoint} (attempt ${currentAttempt})`);
}
