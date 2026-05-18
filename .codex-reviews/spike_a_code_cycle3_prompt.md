# 자동 비평 의뢰 — `apps/spike-a/` v0.3 (3차 — LOCAL_PASS acceptance 최종)

## 컨텍스트

2차 비평(7 지적: blocking 1 + major 4 + minor 2) 전건 수용. v0.3:
- ScopedDb runtime brand 실제 부여 (Object.defineProperty) — SPIKEA2-001
- service-role pending audit pattern (pre-insert + outcome update) + audit 실패 시 AuditMandatoryFailureError throw — SPIKEA2-002
- multi-instance audit 한계 README 명시 — SPIKEA2-003
- test-perf 3 baseline (direct-bypass·tenant-no-context·tenant-with-context) — SPIKEA2-004
- pgbouncer userlist.txt + pgbouncer.ini + auth smoke 시나리오 — SPIKEA2-005
- README v0.3 한계 표 (layer 2·multi-instance audit·Supabase Pooler Day 9) — SPIKEA2-006·007
- 003 audit_log FORCE RLS 제거 (super-user outcome update 허용)
- 시나리오 9개 (pgbouncer-auth 추가)

## 의뢰

v0.3을 v1.0 **LOCAL_PASS prototype acceptance**로 검증하라:

ready_for_acceptance=true 판정 기준 (LOCAL_PASS 한정):
- blocking 0개
- major 0~2개
- 모든 시나리오 PASS 가능성 (실제 docker 실행 가능한 코드 품질)
- SoT 정합

PROVIDER_PASS는 Day 9 별도 검증 — 본 비평에서는 LOCAL_PASS만 평가.

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEA3-`. **LOCAL_PASS acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-a\` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\spike_a_code_cycle2_response.md`
- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md`
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md`
