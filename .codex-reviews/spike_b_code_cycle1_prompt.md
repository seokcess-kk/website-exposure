# 자동 비평 의뢰 — `apps/spike-b/` v0.1 (1차)

## 컨텍스트

Phase 0 Spike B prototype 코드 1차 작성 완료. Spike A는 v1.0 LOCAL_PASS acceptance. Spike B는 Spike 계획 v1.0 § B 따라 구현:

핵심 가설:
- worker가 control-plane connection으로 outbox SKIP LOCKED claim → instance_id 추출 → withTenantTransaction tenant-plane 처리
- **idempotent at-least-once with exactly-once observable effects**:
  - outbox: 동일 (instance_id, source_event_id) active state 중복 enqueue 차단 (partial unique)
  - inbox: UNIQUE(instance_id, source_event_id) — 재처리 시 ON CONFLICT DO NOTHING
  - external_call_log: UNIQUE(instance_id, source_event_id) WHERE outcome='success' — 중복 success 차단
- stale lock reclaim·retry backoff·exhausted·failed-permanent 전이
- failure injection 9 point (8 originally + after-claim 분리)

통과 기준 (Spike B § B.3):
- 100 outbox·5 worker → completed=100·inbox=100·foreign=0·duplicate=0
- idempotency 시나리오
- failure injection 9 point — 각 point crash 후 reclaim/recovery로 최종 invariant 정합
- stale reclaim·retry·permanent
- no-cross-tenant
- 1000 jobs × 10 workers × 5 runs invariant runner

## 의뢰

prototype 코드를 Spike A 비평과 동일한 강도로 비평하라. 특히:

1. **SQL migration 정확성**:
   - 001_roles.sql: app_tenant_user NOBYPASSRLS·pgcrypto·GRANT 부재가 spec 정합?
   - 002_outbox.sql: status enum CHECK·partial unique active idempotency·claim/stale partial index·timing
   - 003_inbox.sql: RLS WITH CHECK·UNIQUE idempotency·outbox_id FK 미적용 (schema-per-tenant 시 깨질 수 있어 생략)
   - 004_external_call_log.sql: UNIQUE success partial·outcome CHECK
   - 005_invariant_log.sql: 측정 metadata table

2. **TS 코어**:
   - `outbox.ts` claim SQL: stale reclaim + SKIP LOCKED + attempts++가 한 transaction (sqlSuper.begin) 안에서 안전?
   - `outbox.ts` markTransientFail의 CASE expression — attempts vs max_attempts 비교 후 exhausted 전이 정확?
   - `worker.ts` processOneJob의 control vs tenant transaction 분리 — tenant transaction commit 후 markCompleted 사이 crash 시 idempotent recovery 보장?
   - `fake-provider.ts` 동일 source_event_id 동시 호출 race — SELECT idempotency check + INSERT 사이 race·unique violation 처리 정확?
   - `worker.ts` `runConcurrentWorkers` Promise.all 동시성·emptyConsecutiveStop 정책
   - `failure-injection.ts` 9 point 분류 정확? after-claim·before-permanent-alert·after-permanent-alert 의미

3. **시나리오 측정**:
   - test-basic-100: 100 outbox·5 worker — Promise.all로 진짜 동시? inbox foreign check 정확?
   - test-idempotency: completed 후 same sourceEventId enqueue 허용 — 의도? 운영 위험?
   - test-failure-injection: 각 point에서 expectedOutbox·expectedExt·expectedInbox 분류 정확? after-tenant-commit-before-mark-completed에서 inbox는 commit됐지만 outbox는 processing — 후속 worker가 stale reclaim 후 다시 처리 → inbox UNIQUE로 idempotent → outbox completed·inbox 1·external success 1 정합?
   - test-stale-reclaim: claim 후 즉시 10분 threshold no-job vs 0ms reclaim 검증
   - test-retry-permanent: maxAttempts=3·999 fail → exhausted 정확? maxAttempts 도달 시점이 attempts++ 후 vs before?
   - test-no-cross-tenant: RLS WITH CHECK가 worker code의 instance_id 매칭과 정합?
   - test-invariant-runner: 5 runs × 1000 jobs × 10 workers — 누적 invariant·시간 측정

4. **누락 시나리오**:
   - outbox idempotency 충돌 시점의 동시 enqueue race (2 worker가 동시에 동일 sourceEventId enqueue)
   - external_call_log success UNIQUE race (2 worker가 동시에 success 시도)
   - tenant transaction abort (RLS violation) 후 outbox state — markTransientFail 호출되는가?
   - tenant transaction 진행 중 connection drop·DB shutdown
   - 외부 call 시간 초과 (TransientProviderError 외 다른 timeout)

5. **production gap**:
   - 실제 외부 provider는 HTTP API — fake-provider DB call vs 실제 HTTP의 차이
   - idempotency-Key HTTP 헤더와 본 prototype DB UNIQUE 차이
   - pgbouncer transaction pooling (Spike A)와 본 Spike의 direct connection 차이
   - worker pool size·rate limit·backpressure

6. **코드 품질**:
   - TypeScript strict 호환성
   - 모든 catch에서 errorMessage helper 사용
   - resource cleanup·closeAll
   - logging 일관성
   - empty consecutive stop 정책 — race로 후속 작업이 들어와도 종료될 수 있음?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEB1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-b\` (대상 prototype)
- `C:\Users\assag\solution\website-exposure\apps\spike-a\` (Spike A 패턴 참조)
- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (Spike 계획 v1.0)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`·`crm-sync.md`·`content-migration.md` (outbox SoT 패턴)
