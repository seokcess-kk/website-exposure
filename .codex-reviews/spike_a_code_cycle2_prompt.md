# 자동 비평 의뢰 — `apps/spike-a/` v0.2 (2차 — acceptance 검증)

## 컨텍스트

1차 비평(19 지적: blocking 4 + major 10 + minor 5) 전건 수용. v0.2 핵심 변경:
- `fixtures.ts` 분리 (SPIKEA1-001) — seed.ts import side effect 차단
- `errors.ts` errorMessage(unknown) helper (SPIKEA1-017)
- 001_roles.sql: pgcrypto 최상단 + broad default grant 폐기 (SPIKEA1-002·003)
- 002·003·004: 명시 GRANT·REVOKE 적용 (SPIKEA1-002·015)
- tenant.ts: SET LOCAL ROLE app_tenant_user + ScopedDb brand wrapper + assertScopedDb runtime guard + TenantContextError + isValidUuid (SPIKEA1-005·011·012)
- service-role.ts: assertBreakGlassAllowed (function allowlist·actorRole·ticketRef·correlationId) + 1 invocation = 1 audit row + outcome (status·errorClass·startedAt/finishedAt) (SPIKEA1-008·009)
- migrate.ts: advisory lock + checksum + per-file transaction wrapping (SPIKEA1-010)
- db.ts: idle/connect_timeout + optional debug logger (SPIKEA1-016)
- 모든 시나리오: CLI guard (pathToFileURL) + errorMessage helper 사용
- test-write.ts: instance_id 변경 시도 WITH CHECK reject 추가 (SPIKEA1-007)
- test-invariant-runner.ts: PASS 조건 강화 — processed === expected + total_failures === 0 + bad_result_count 포함 (SPIKEA1-004)
- test-audit.ts: 1 invocation = 1 row 검증 + 2-layer 설명 (SPIKEA1-015)
- 신규 test-negative.ts: malformed UUID·SQL injection·assertScopedDb·service-role guard (SPIKEA1-011·012·014)
- 신규 test-perf.ts: p50·p95 measurement (SPIKEA1-014·017)
- README: dotenv-cli·PowerShell·dependency install + LOCAL ONLY 경고 (SPIKEA1-018·019)

## 의뢰

v0.2를 v1.0 prototype acceptance로 검증하라:

1. **1차 19 지적 재발 여부**: 각각 fixed/partial/regressed 평가
2. **v0.2 신규 메커니즘 모순**:
   - assertScopedDb brand의 실제 효과 (TS 컴파일러 타입만 vs runtime)
   - migrate.ts advisory lock·checksum·transaction wrapping 정확성
   - service-role 1:1 audit이 finally에서 throw 안 되는지 (finally 안 audit 실패가 outer fn 결과에 영향?)
   - test-perf.ts가 baseline 비교 정확? RLS bypass인 dbSuper로 baseline 측정이 의미 있는가?
   - test-audit.ts의 "layer 2 (RLS no-policy)는 별도 role 시 검증 가능 — 본 prototype은 layer 1 강제로 충분" 처리 적절?
3. **누락된 시나리오 (1차에서 식별된 것 외)**:
   - Supabase Pooler vs pgbouncer 차이 검증 (Day 9 provider gate 대비) — local만으로 PASS 가능?
   - schema-per-tenant fallback prototype (없어도 OK?)
4. **acceptance 기준**:
   - blocking 0개·major 0~2개
   - 솔로 + AI 보조 실행 가능 (실제 docker-compose 실행 가능한 코드 품질)
   - 모든 시나리오 PASS 가능성

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEA2-`. **acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-a\` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\spike_a_code_cycle1_response.md`
- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (Spike 계획 v1.0)
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md`
