// Spike B — fake external provider (v0.2 — SPIKEB1-006·SPIKEB2-005 정정)
//
// 실제 HTTP provider 모델:
//  - attempted-*: HTTP 요청 시도 (중복 가능)
//  - accepted-*: provider가 idempotency-key로 side effect 수용 (1 source_event_id당 1번)
//
// provider_attempt_log: attempted vs accepted 분리 (실제 HTTP 모델)
// external_call_log: 통계용 사후 dedupe (기존 schema 유지)

import { sql } from "drizzle-orm";
import { dbSuper } from "./db.ts";
import { PermanentProviderError, TransientProviderError } from "./errors.ts";

export type FakeProviderConfig = {
  failBeforeSuccessAttempts: number;
  permanentSourceEventIds: Set<string>;
};

const DEFAULT_CONFIG: FakeProviderConfig = {
  failBeforeSuccessAttempts: 0,
  permanentSourceEventIds: new Set(),
};

/**
 * fake provider 호출.
 *  - 이미 accepted-success 있으면 → attempted-success row만 추가·idempotent-success 반환
 *  - permanent → attempted-failure + accepted-permanent + throw
 *  - transient → attempted-failure + throw
 *  - success → attempted-success + accepted-success + return success
 */
export async function callFakeProvider(input: {
  instanceId: string;
  sourceEventId: string;
  payload: Record<string, unknown>;
  workerId: string;
  config?: FakeProviderConfig;
}): Promise<{ outcome: "success" | "idempotent-success" }> {
  const cfg = input.config ?? DEFAULT_CONFIG;

  // 1. 이미 accepted-success 존재 → idempotent
  const existing = await dbSuper.execute(sql`
    SELECT 1 FROM provider_attempt_log
    WHERE instance_id=${input.instanceId}::uuid
      AND source_event_id=${input.sourceEventId}
      AND outcome='accepted-success'
    LIMIT 1
  `);
  if ((existing as unknown as unknown[]).length > 0) {
    await dbSuper.execute(sql`
      INSERT INTO provider_attempt_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'attempted-success')
    `);
    return { outcome: "idempotent-success" };
  }

  // 2. permanent fail
  if (cfg.permanentSourceEventIds.has(input.sourceEventId)) {
    await dbSuper.execute(sql`
      INSERT INTO provider_attempt_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'attempted-failure')
    `);
    // accepted-permanent는 UNIQUE 없음 — 다수 attempt 가능 (실제 provider도 매번 permanent 응답 가능)
    await dbSuper.execute(sql`
      INSERT INTO provider_attempt_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'accepted-permanent')
    `);
    await dbSuper.execute(sql`
      INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'permanent-fail')
    `);
    throw new PermanentProviderError(`permanent fail for ${input.sourceEventId}`);
  }

  // 3. transient fail count
  const failCountResult = await dbSuper.execute(sql`
    SELECT count(*)::int AS c FROM external_call_log
    WHERE instance_id=${input.instanceId}::uuid
      AND source_event_id=${input.sourceEventId}
      AND outcome='transient-fail'
  `);
  const failCount = (failCountResult as unknown as Array<{ c: number }>)[0]?.c ?? 0;

  if (failCount < cfg.failBeforeSuccessAttempts) {
    await dbSuper.execute(sql`
      INSERT INTO provider_attempt_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'attempted-failure')
    `);
    await dbSuper.execute(sql`
      INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'transient-fail')
    `);
    throw new TransientProviderError(`transient fail attempt ${failCount + 1}`);
  }

  // 4. success — accepted-success는 UNIQUE
  try {
    await dbSuper.execute(sql`
      INSERT INTO provider_attempt_log (instance_id, source_event_id, worker_id, outcome)
      VALUES
        (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'attempted-success'),
        (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'accepted-success')
    `);
    await dbSuper.execute(sql`
      INSERT INTO external_call_log (instance_id, source_event_id, worker_id, outcome)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${input.workerId}, 'success')
    `);
    return { outcome: "success" };
  } catch (e) {
    // race: 동시 worker 둘 다 success insert → UNIQUE 충돌 → idempotent
    if ((e as { code?: string })?.code === "23505") {
      return { outcome: "idempotent-success" };
    }
    throw e;
  }
}

export async function getExternalCallStats(): Promise<{
  total: number;
  successUnique: number;
  successTotal: number;
  transientFail: number;
  permanentFail: number;
  duplicateSuccess: number;
}> {
  const r = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE outcome='success')::int AS success_total,
      count(DISTINCT (instance_id, source_event_id)) FILTER (WHERE outcome='success')::int AS success_unique,
      count(*) FILTER (WHERE outcome='transient-fail')::int AS transient_fail,
      count(*) FILTER (WHERE outcome='permanent-fail')::int AS permanent_fail
    FROM external_call_log
  `);
  const row = (r as unknown as Array<{
    total: number; success_total: number; success_unique: number;
    transient_fail: number; permanent_fail: number;
  }>)[0];
  return {
    total: row?.total ?? 0,
    successUnique: row?.success_unique ?? 0,
    successTotal: row?.success_total ?? 0,
    transientFail: row?.transient_fail ?? 0,
    permanentFail: row?.permanent_fail ?? 0,
    duplicateSuccess: (row?.success_total ?? 0) - (row?.success_unique ?? 0),
  };
}

/**
 * SPIKEB1-006·SPIKEB2-005: provider attempt 통계 — attempted vs accepted 분리
 */
export async function getProviderAttemptStats(): Promise<{
  attempted: number;
  acceptedSuccess: number;
  acceptedPermanent: number;
  duplicateAcceptedSuccess: number;
}> {
  const r = await dbSuper.execute(sql`
    SELECT
      count(*) FILTER (WHERE outcome IN ('attempted-success','attempted-failure'))::int AS attempted,
      count(DISTINCT (instance_id, source_event_id)) FILTER (WHERE outcome='accepted-success')::int AS accepted_success_unique,
      count(*) FILTER (WHERE outcome='accepted-success')::int AS accepted_success_total,
      count(*) FILTER (WHERE outcome='accepted-permanent')::int AS accepted_permanent
    FROM provider_attempt_log
  `);
  const row = (r as unknown as Array<{
    attempted: number;
    accepted_success_unique: number;
    accepted_success_total: number;
    accepted_permanent: number;
  }>)[0];
  return {
    attempted: row?.attempted ?? 0,
    acceptedSuccess: row?.accepted_success_unique ?? 0,
    acceptedPermanent: row?.accepted_permanent ?? 0,
    duplicateAcceptedSuccess: (row?.accepted_success_total ?? 0) - (row?.accepted_success_unique ?? 0),
  };
}
