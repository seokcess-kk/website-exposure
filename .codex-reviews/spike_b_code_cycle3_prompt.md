# 자동 비평 의뢰 — `apps/spike-b/` v0.2 (3차 — LOCAL_PASS acceptance 최종)

## 컨텍스트

2차 비평(8 지적: blocking 4 + major 2 + minor 2) 핵심 정정 — 이전 write가 한 번에 안 적용된 것 발견 후 재적용:
- worker.ts 완전 재작성 — outer try-catch + provider call 별도 step + recordPermanentAlert (SPIKEB2-002·003·004)
- fake-provider.ts 완전 재작성 — provider_attempt_log attempted vs accepted (SPIKEB2-005)
- failure-injection.ts 10 point (after-tenant-commit-before-provider, after-provider-success-before-mark-completed) (SPIKEB1-001·002)
- test-failure-injection.ts 10 point + 각 point precondition·expected matching
- test-idempotency.ts full UNIQUE·동시 race·SPIKEB1-003·007
- test-rls-mismatch.ts 신규 (SPIKEB1-005)
- seed.ts: 신규 테이블 truncate 포함 (SPIKEB2-007)
- README v0.2 갱신 (SPIKEB2-008)

## 의뢰

v0.2 (재적용 후)를 v1.0 LOCAL_PASS prototype acceptance로 검증.

ready_for_acceptance=true 판정 기준:
- blocking 0개
- major 0~2개
- 모든 시나리오 PASS 가능성
- SoT 정합

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKEB3-`. **LOCAL_PASS acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\apps\spike-b\` (대상)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\spike_b_code_cycle2_response.md`
