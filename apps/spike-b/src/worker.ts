// Spike B — worker (v0.2 — SPIKEB1-001·002·004·012·013 정정 + SPIKEB2-002·003·004 강화)
//
// flow:
// 1. claim outbox (control-plane)
// 2. withTenantTransaction: tenant inbox insert (ON CONFLICT DO NOTHING) → tenant commit
// 3. AFTER tenant commit: callFakeProvider (HTTP-like)
// 4. markCompleted (control-plane)
//
// failure injection 10 point — outer try-catch가 모든 point 흡수

import { sql } from "drizzle-orm";
import {
  claimNextOutbox,
  markCompleted,
  markTransientFail,
  markFailedPermanent,
  type OutboxRow,
} from "./outbox.ts";
import { withTenantTransaction } from "./tenant.ts";
import { callFakeProvider, type FakeProviderConfig } from "./fake-provider.ts";
import { errorMessage, PermanentProviderError, TransientProviderError } from "./errors.ts";
import { maybeFail, type InjectionConfig, NO_INJECTION, InjectedFailureError } from "./failure-injection.ts";
import { dbSuper } from "./db.ts";

export type WorkerConfig = {
  workerId: string;
  staleAfterMs: number;
  backoffMs: number[];
  providerConfig: FakeProviderConfig;
  injection: InjectionConfig;
};

export type ProcessResult =
  | { outcome: "completed"; outboxId: string }
  | { outcome: "retry-scheduled"; outboxId: string }
  | { outcome: "exhausted"; outboxId: string }
  | { outcome: "failed-permanent"; outboxId: string }
  | { outcome: "injected-crash"; outboxId: string | null; point: string }
  | { outcome: "no-job" };

function getBackoffMs(attempts: number, backoffMs: number[]): number {
  if (backoffMs.length === 0) return 1000;
  const idx = Math.min(attempts - 1, backoffMs.length - 1);
  return backoffMs[idx]!;
}

/**
 * idempotent permanent_alert insert (SPIKEB2-004).
 * UNIQUE(outbox_id, alert_type) 충돌은 no-op (race·재시도 안전)
 */
async function recordPermanentAlert(input: {
  outboxId: string;
  instanceId: string;
  sourceEventId: string;
  workerId: string;
  alertType: "permanent-fail" | "exhausted";
}): Promise<void> {
  await dbSuper.execute(sql`
    INSERT INTO permanent_alert (outbox_id, instance_id, source_event_id, worker_id, alert_type)
    VALUES (
      ${input.outboxId}::uuid,
      ${input.instanceId}::uuid,
      ${input.sourceEventId},
      ${input.workerId},
      ${input.alertType}
    )
    ON CONFLICT (outbox_id, alert_type) DO NOTHING
  `);
}

/**
 * worker 1회 루프 — SPIKEB2-002 정정: outer try-catch가 모든 injection point 흡수
 */
export async function processOneJob(config: WorkerConfig): Promise<ProcessResult> {
  const inj = config.injection;

  // SPIKEB2-002: outer try-catch 전체 감싸기
  try {
    // 1. before-claim
    maybeFail(inj, "before-claim", 0);

    const row: OutboxRow | null = await claimNextOutbox(config.workerId, config.staleAfterMs);
    if (!row) return { outcome: "no-job" };

    // 2. after-claim
    maybeFail(inj, "after-claim", row.attempts);

    try {
      // 3. tenant transaction (inbox insert만, provider 호출은 commit 후)
      await withTenantTransaction(row.instance_id, async (tx) => {
        maybeFail(inj, "before-tenant-insert", row.attempts);
        await tx.execute(sql`
          INSERT INTO inbox (instance_id, source_event_id, outbox_id, payload)
          VALUES (
            ${row.instance_id}::uuid,
            ${row.source_event_id},
            ${row.id}::uuid,
            ${JSON.stringify(row.payload)}::jsonb
          )
          ON CONFLICT (instance_id, source_event_id) DO NOTHING
        `);
        maybeFail(inj, "after-tenant-insert", row.attempts);
      });

      // SPIKEB2-003·SPIKEB1-002: tenant commit 후 별도 step에서 provider 호출
      maybeFail(inj, "after-tenant-commit-before-provider", row.attempts);

      await callFakeProvider({
        instanceId: row.instance_id,
        sourceEventId: row.source_event_id,
        payload: row.payload,
        workerId: config.workerId,
        config: config.providerConfig,
      });

      // SPIKEB1-002 신규 point
      maybeFail(inj, "after-provider-success-before-mark-completed", row.attempts);

      await markCompleted(row.id);
      return { outcome: "completed", outboxId: row.id };
    } catch (e) {
      if (e instanceof InjectedFailureError) throw e; // outer catch로 전파

      if (e instanceof PermanentProviderError) {
        maybeFail(inj, "before-permanent-alert", row.attempts);
        await markFailedPermanent(row.id, errorMessage(e));
        // SPIKEB2-004: permanent_alert insert
        await recordPermanentAlert({
          outboxId: row.id,
          instanceId: row.instance_id,
          sourceEventId: row.source_event_id,
          workerId: config.workerId,
          alertType: "permanent-fail",
        });
        maybeFail(inj, "after-permanent-alert", row.attempts);
        return { outcome: "failed-permanent", outboxId: row.id };
      }

      if (e instanceof TransientProviderError) {
        maybeFail(inj, "before-retry-schedule", row.attempts);
        const backoff = getBackoffMs(row.attempts, config.backoffMs);
        const { exhausted } = await markTransientFail(row.id, errorMessage(e), backoff);
        if (exhausted) {
          await recordPermanentAlert({
            outboxId: row.id,
            instanceId: row.instance_id,
            sourceEventId: row.source_event_id,
            workerId: config.workerId,
            alertType: "exhausted",
          });
        }
        maybeFail(inj, "after-retry-schedule", row.attempts);
        return { outcome: exhausted ? "exhausted" : "retry-scheduled", outboxId: row.id };
      }

      // unknown error → transient
      const backoff = getBackoffMs(row.attempts, config.backoffMs);
      const { exhausted } = await markTransientFail(row.id, errorMessage(e), backoff);
      return { outcome: exhausted ? "exhausted" : "retry-scheduled", outboxId: row.id };
    }
  } catch (e) {
    // outer catch — injection point에서 throw된 InjectedFailureError 처리
    if (e instanceof InjectedFailureError) {
      return { outcome: "injected-crash", outboxId: null, point: e.message };
    }
    throw e; // 예상치 못한 에러는 caller로
  }
}

/**
 * 동시 worker 처리 — Promise.all
 */
export async function runConcurrentWorkers(input: {
  workerCount: number;
  maxRoundsPerWorker: number;
  emptyConsecutiveStop: number;
  configFactory: (workerIdx: number) => WorkerConfig;
}): Promise<{ perWorker: Array<{ workerId: string; rounds: number; results: Record<string, number> }> }> {
  const promises: Promise<{ workerId: string; rounds: number; results: Record<string, number> }>[] = [];

  for (let w = 0; w < input.workerCount; w++) {
    const cfg = input.configFactory(w);
    promises.push((async () => {
      const counts: Record<string, number> = {};
      let consecutiveEmpty = 0;
      let rounds = 0;
      for (let i = 0; i < input.maxRoundsPerWorker; i++) {
        rounds++;
        const r = await processOneJob(cfg);
        counts[r.outcome] = (counts[r.outcome] ?? 0) + 1;
        if (r.outcome === "no-job") {
          consecutiveEmpty++;
          if (consecutiveEmpty >= input.emptyConsecutiveStop) break;
        } else {
          consecutiveEmpty = 0;
        }
      }
      return { workerId: cfg.workerId, rounds, results: counts };
    })());
  }

  const perWorker = await Promise.all(promises);
  return { perWorker };
}
