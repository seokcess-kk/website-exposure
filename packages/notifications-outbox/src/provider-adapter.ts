// @glitzy/notifications-outbox/provider-adapter — provider interface
// 모든 provider (email·sms·webhook·push)는 본 interface 구현
// idempotent at-least-once with exactly-once observable — accepted-success UNIQUE 보장은 caller (provider_attempt_log)·본 interface는 attempt 행위만

import { ProviderPermanentError, ProviderTransientError } from "./errors.js";

export type ProviderAttemptResult =
  | { kind: "accepted-success"; providerMessageId: string; meta?: Record<string, unknown> }
  | { kind: "accepted-failure"; providerMessageId: string; reason: string; meta?: Record<string, unknown> }
  | { kind: "attempted-failure"; transient: boolean; reason: string };

export type ProviderAttemptRequest = {
  /** Idempotency key — provider 호출 시 동일 key로 재시도 안전 */
  readonly idempotencyKey: string;
  /** Payload — provider-specific */
  readonly payload: Record<string, unknown>;
};

/**
 * ProviderAdapter contract:
 *   - send: caller가 idempotencyKey와 payload를 넘김
 *   - 결과: accepted-success (provider가 명시 ACK)·accepted-failure (provider가 명시 reject)·attempted-failure (network·timeout·unknown)
 *   - transient=true이면 caller가 retry·false면 permanent
 *
 * 예: Resend·Slack·Webhook·SMS provider 모두 본 interface 구현
 */
export interface ProviderAdapter {
  readonly providerName: string;
  send(req: ProviderAttemptRequest): Promise<ProviderAttemptResult>;
}

export { ProviderPermanentError, ProviderTransientError };
