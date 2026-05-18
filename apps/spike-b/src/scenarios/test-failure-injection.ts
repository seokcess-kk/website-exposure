// Spike B — Scenario 3: failure injection 10 point (v0.2 — SPIKEB1-001·002·004 정정)
//
// 각 point별 precondition·expected state·recovery 검증
// retry point는 transient provider, permanent point는 permanent provider precondition
// after-provider-success-before-mark-completed: 새 point — inbox/external success는 commit됐지만 outbox는 processing
// recovery worker (NO_INJECTION) 1차로 outbox completed mark + 후속 idempotent

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { processOneJob } from "../worker.ts";
import { getExternalCallStats, getProviderAttemptStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { type FailurePoint, ALL_FAILURE_POINTS, NO_INJECTION } from "../failure-injection.ts";

type Result = { passed: boolean; detail: string };

type PointPreset = {
  // provider config preset
  providerSuccess: boolean;       // true = 모든 attempt success
  providerPermanent: boolean;     // true = permanent fail
  // expected 최종 state
  expectedOutbox: "completed" | "failed-permanent" | "exhausted";
  expectedInbox: number;
  expectedExtSuccess: number;
  expectedPermanentAlert: number;
};

// 각 point별 precondition·expected (SPIKEB1-001 정정)
const PRESETS: Record<FailurePoint, PointPreset> = {
  "before-claim": {
    providerSuccess: true, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "after-claim": {
    providerSuccess: true, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "before-tenant-insert": {
    providerSuccess: true, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "after-tenant-insert": {
    // tenant transaction abort (inbox insert는 rollback) → recovery에서 다시 처리
    providerSuccess: true, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "after-tenant-commit-before-provider": {
    // inbox commit 됐지만 provider 호출 전 crash → recovery에서 ON CONFLICT inbox no-op + provider success
    providerSuccess: true, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "after-provider-success-before-mark-completed": {
    // provider accepted-success는 이미 기록됨 → recovery는 idempotent-success (외부 호출 없음·새 inbox no-op) → outbox completed
    providerSuccess: true, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "before-retry-schedule": {
    // transient provider → before-retry-schedule injection → outbox processing 유지 → stale reclaim
    // recovery에서 새 attempt — 이번엔 success로 전환 (failBeforeSuccessAttempts=1)
    providerSuccess: false, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "after-retry-schedule": {
    // markTransientFail은 실행됨 → outbox pending. injection 후 outer catch → recovery (재시도 → success)
    providerSuccess: false, providerPermanent: false,
    expectedOutbox: "completed", expectedInbox: 1, expectedExtSuccess: 1, expectedPermanentAlert: 0,
  },
  "before-permanent-alert": {
    // SPIKEB4-001 정정: injection은 markFailedPermanent 전 → 1차는 outbox processing 유지
    // recovery worker가 stale reclaim → 다시 permanent fail → markFailedPermanent + recordPermanentAlert 1건
    providerSuccess: false, providerPermanent: true,
    expectedOutbox: "failed-permanent", expectedInbox: 1, expectedExtSuccess: 0, expectedPermanentAlert: 1,
  },
  "after-permanent-alert": {
    // markFailedPermanent + alert 모두 commit. outer catch만 발생. inbox=1·alert=1
    // SPIKEB3-001 정정
    providerSuccess: false, providerPermanent: true,
    expectedOutbox: "failed-permanent", expectedInbox: 1, expectedExtSuccess: 0, expectedPermanentAlert: 1,
  },
};

async function getPermanentAlertCount(): Promise<number> {
  const r = await dbSuper.execute(sql`SELECT count(*)::int AS c FROM permanent_alert`);
  return ((r as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
}

async function main(): Promise<void> {
  console.log(`failure-injection 10 point`);
  const results: Result[] = [];

  for (const point of ALL_FAILURE_POINTS) {
    const preset = PRESETS[point];
    await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);
    const sourceEventId = `inject-${point}`;
    await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId, payload: { point } });

    // provider preset
    const providerConfig = preset.providerPermanent
      ? { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set([sourceEventId]) }
      : preset.providerSuccess
        ? { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set<string>() }
        : { failBeforeSuccessAttempts: 1, permanentSourceEventIds: new Set<string>() }; // 1 fail 후 success

    // 1차: injection — crash 시뮬레이션 (outer catch에서 injected-crash 반환)
    const r1 = await processOneJob({
      workerId: "worker-inj",
      staleAfterMs: 0,
      backoffMs: [1],
      providerConfig,
      injection: { pointToFailAt: point, triggerOnAttempt: null },
    });

    // SPIKEB3-002: 1차 실행에서 injected-crash가 실제로 발생했는지 assert
    const crashAsserted = r1.outcome === "injected-crash" && (r1 as { point?: string }).point?.includes(point);
    if (!crashAsserted) {
      results.push({
        passed: false,
        detail: `${point}: r1.outcome=${r1.outcome} (expected injected-crash with point=${point}) — injection hook missing`,
      });
      continue;
    }

    // 2~10차: recovery worker (NO_INJECTION) — stale reclaim·재처리
    let postOutcome = r1.outcome;
    for (let i = 0; i < 10; i++) {
      const r2 = await processOneJob({
        workerId: `worker-recovery-${i}`,
        staleAfterMs: 0,
        backoffMs: [1],
        providerConfig,
        injection: NO_INJECTION,
      });
      postOutcome = r2.outcome;
      if (r2.outcome === "completed" || r2.outcome === "failed-permanent" || r2.outcome === "no-job") break;
    }

    const stats = await getOutboxStats();
    const ext = await getExternalCallStats();
    const inboxR = await dbSuper.execute(sql`SELECT count(*)::int AS c FROM inbox`);
    const inboxN = ((inboxR as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
    const alertN = await getPermanentAlertCount();

    let outboxMatch = false;
    if (preset.expectedOutbox === "completed") outboxMatch = stats.completed === 1;
    if (preset.expectedOutbox === "failed-permanent") outboxMatch = stats.failedPermanent === 1;
    if (preset.expectedOutbox === "exhausted") outboxMatch = stats.exhausted === 1;

    const passed =
      outboxMatch &&
      ext.successUnique === preset.expectedExtSuccess &&
      inboxN === preset.expectedInbox &&
      ext.duplicateSuccess === 0 &&
      alertN === preset.expectedPermanentAlert;

    results.push({
      passed,
      detail: `${point}: r1=${r1.outcome} → recovery=${postOutcome} → outbox.${preset.expectedOutbox}=${outboxMatch} inbox=${inboxN}/${preset.expectedInbox} ext=${ext.successUnique}/${preset.expectedExtSuccess} alert=${alertN}/${preset.expectedPermanentAlert} dup=${ext.duplicateSuccess}`,
    });
  }

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`failure-injection: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}
