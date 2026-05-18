# 자동 비평 의뢰 — `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` (1차)

## 컨텍스트

8 Feature spec v1.0 + 인프라 결정 v1.0 완료 후 Phase 0 Week 1 진입. 3개 Spike로 가장 위험한 기술 가정 검증.

- **Spike A**: Drizzle + RLS + Auth.js + Supabase tenant scoping (`withTenantTransaction`·SET LOCAL·pgBouncer transaction pooling)
- **Spike B**: worker control-plane queue + tenant-plane processing (SKIP LOCKED claim·2 transaction 분리·stale lock reclaim)
- **Spike C**: Cloudflare R2 signed URL + instance prefix + IAM isolation (object key prefix·tenant-check·TTL·refresh)

각 Spike는 가설·실험 시나리오·통과 기준·실패 시 대안 정의. 7일 (Day 1~7) 일정·실패 시 Week 2 buffer.

## 의뢰

이전 spec/인프라 비평과 동일한 강도로 본 Spike 계획을 비평하라. 본 문서 끝의 "codex 비평 의뢰 사항" 8항목을 참고.

특히:

1. **가설 우선순위**: 본 Spike 3개가 인프라 결정 v1.0의 가장 위험한 가정 — 다른 미검증 critical 가정이 더 위험하지 않은가? (Drizzle Kit migration·Auth.js session·Cloudflare for SaaS·Doppler·환경 분리)
2. **통과 기준 측정 가능성**: binary pass/fail 평가 가능? negative invariant 검증 방법
3. **실험 누락**: 각 Spike의 critical scenario 빠뜨린 것
4. **prototype vs production 차이**: Spike 통과해도 prod에서 실패할 수 있는 부분
5. **솔로 일정 현실성**: 1~3일/Spike 적정한가
6. **실패 시 reversal 비용**: A 실패 → 인프라 결정 v1.0 INFRA2-01 전체 reversal 부담
7. **후속 작업 의존성**: Phase 0 Week 2~6 작업이 Spike 결과에 어떻게 의존
8. **누락 Spike**: 다른 critical 가설

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `SPIKE1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md`
- `C:\Users\assag\solution\website-exposure\docs\features\*.md` (8 Feature v1.0)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
