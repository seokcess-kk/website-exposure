# 자동 비평 의뢰 — `apps/spike-a/` prototype 코드 (1차)

## 컨텍스트

Phase 0 Spike A prototype 코드 1차 작성 완료. Spike 계획 v1.0 (`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § A) 따라 구현:
- docker-compose (postgres 16 + pgbouncer transaction pooling mode·port 6433)
- migration 4개 (roles·content_test·audit_log·invariant_log)
- TS 코어 (db.ts·tenant.ts·service-role.ts·schema.ts·migrate.ts·seed.ts)
- 시나리오 6개 (read·write·rollback·nested-tx·audit·invariant-runner)
- README + wait-db 스크립트

핵심 가설 (Spike 계획 § A.1):
- `withTenantTransaction(instanceId, fn)` 안에서 SET LOCAL이 RLS context 전달
- Drizzle ORM이 transaction 안에서 SELECT/INSERT/UPDATE/DELETE 모두 tenant 격리
- rollback 후 context 누설 없음
- pgbouncer transaction pooling에서 SET LOCAL 안전 (session leak 없음)
- service-role break-glass는 audit log 필수
- audit_log는 read-RLS + append-only (GRANT level UPDATE/DELETE 미부여)

통과 기준 (Spike 계획 § A.3):
- 1000 iter × 20 concurrent SELECT — foreign_instance_count 0건
- INSERT/UPDATE/DELETE WITH CHECK — cross-instance write 0건
- rollback 후 transaction 밖 query 0건 (RLS reject)
- nested tx·savepoint — context 유지
- audit_log RLS 읽기 격리 + append-only

## 의뢰

prototype 코드를 이전 spec/결정 비평과 동일한 강도로 비평하라. 특히:

1. **SQL migration 정확성**:
   - 001_roles.sql: app_tenant_user NOBYPASSRLS·GRANT default·LOGIN — 누락된 권한?
   - 002_content_test.sql: RLS + FORCE ROW LEVEL SECURITY·USING + WITH CHECK·current_setting('app.current_instance_id', true)::uuid — null·malformed UUID 처리?
   - 003_audit_log.sql: SELECT policy + INSERT policy·UPDATE/DELETE policy 없음 — RLS는 정책 없으면 deny이므로 GRANT 미부여 + RLS 둘 다 안전망? 한쪽이 빠지면 어떤 위험?
   - 004_invariant_log.sql: super-user 전용 — app_tenant_user GRANT 미부여로 충분?

2. **TS 코어 정확성**:
   - `tenant.ts` withTenantTransaction: SET LOCAL ROLE 없이 connection level role(app_tenant_user)이 충분? dbTenant 가 service_role connection을 재사용한다면? prepare: false 정합성
   - `db.ts` postgres-js + pgbouncer transaction pooling — `prepare: false` 필수. 다른 option (idle_timeout·max·debug) 누락?
   - `service-role.ts` withServiceRole: audit insert가 service-role 사용 *전*에 — 사용 *후* audit이 더 안전한가? loop 안 instance마다 insert는 N+1?
   - migrate.ts: 단순 file sort — version conflict·rollback·transaction wrapping?

3. **시나리오 측정 정확성**:
   - test-write.ts: `RETURNING id` 결과 count로 INSERT 성공 판단 — postgres-js drizzle execute가 array로 반환? 검증 방식 정확?
   - test-rollback.ts: `dbTenant.execute(...)` transaction 밖 → drizzle implicit transaction? prepared statement·pooling 영향
   - test-invariant-runner.ts: 1000 iter × 20 concurrent = 20,000 query. Promise.all로 진짜 동시? pgbouncer pool size 20 — 부족하지 않은가? batch insert N+1
   - test-audit.ts: GRANT denied error message가 'permission denied' 또는 'insufficient privilege' — 둘 다 매칭 정확?

4. **누락된 시나리오**:
   - schema-per-tenant 호환성 (Spike A의 fallback)
   - SQL injection 시도 (raw input)
   - service-role 격리 (env mistake·prod에서 client context 호출)
   - lint·runtime guard 검증 (scopedDb tx 밖 사용)
   - malformed instanceId (UUID 검증)
   - 성능 측정 (withTenantTransaction overhead p50·p95)

5. **production gap (provider smoke gate Day 9 대비)**:
   - Supabase Pooler와 pgbouncer 동작 차이
   - Supabase RLS policy는 동일 방식?
   - Supabase auth.uid()와 본 prototype set_config 차이

6. **코드 품질**:
   - TypeScript strict + exactOptionalPropertyTypes — 호환성
   - error handling — `(e as Error).message` 패턴 안전?
   - resource cleanup — closeAll에서 transaction 미완료 시 hang
   - 모든 async/await catch
   - logging — console.log만으로 충분? structured?

7. **README·실행 가능성**:
   - 실행 순서 정확? pnpm script 빠진 단계
   - .env.example로 충분? secret 안전

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEA1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-a\` (대상 prototype 전체)
- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (Spike 계획 v1.0)
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md` (인프라 결정 v1.0)
