# 자동 비평 의뢰 — `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v0.2 (2차 — acceptance 검증)

## 컨텍스트

1차 비평(18 지적: blocking 4 + major 9 + minor 5) 전건 수용. v0.2 핵심:
- 5 Spike 확장 (A·B·C + D 신설 + E 신설)
- provider smoke gate (local + provider 2단계)
- 10일 일정 (Week 1 Day 1-7 + Week 2 Day 8-10)
- B 가설 정정: idempotent at-least-once with exactly-once observable effects
- A 쓰기 path·rollback·audit_log RLS·invariant SQL
- B failure injection 8 point + 외부 call count
- C TTL 상태 code 정정·signature replay·method confusion·ListBucket·content-type·URL scrubbing
- D Drizzle Kit migration (RLS·composite FK·partial unique·CHECK)
- E Auth.js + resolveTenantContext + membership invalidation
- REVIEW_WORKFLOW cascade: `signed-url-issued`·`signed-url-revoked` AuditAction
- fallback에 reversal blast radius
- Week 3~6 dependency graph

## 의뢰

v0.2를 v1.0 acceptance로 검증하라:

1. **1차 18 지적 재발 여부**
2. **v0.2 신규 메커니즘 모순**:
   - 5 Spike 10일 일정 솔로 현실성
   - provider smoke gate가 Phase 0 일정 영향 (Week 1 vs Week 2)
   - dependency graph가 모든 Spike 결과 분기를 다루는가
   - reversal blast radius 표가 실제 SoT cascade 영향 평가했는가
3. **누락된 critical scenario**: 다른 미검증 가정 (Spike F·G 외)
4. **acceptance 기준**: blocking 0개·major 0~2개·SoT cascade 동기화·솔로 운영 가능

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKE2-`. **acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\spike_cycle1_response.md`
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
