# 자동 비평 의뢰 — `docs/decisions/INFRA_DECISIONS_DRAFT.md` v0.3 (3차 — v1.0 acceptance 검증)

## 컨텍스트

2차 비평(15 지적: blocking 5 + major 9 + minor 1) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.3 핵심 변경:
- RLS 실행 모델: withTenantTransaction·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard
- REVIEW_WORKFLOW cascade: service-role-invoked·instance-switched AuditAction 2종 추가
- Phase 0 outbox 옵션 A: P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함
- composite FK 3등급 분류
- tenant export/import manifest dependency class 7종
- rate limit taxonomy (Postgres hard quota·Redis soft cache)
- Storage ADR — Cloudflare R2 reversal 권장
- resolveTenantContext + instance-switched audit
- Spike A·B·C gate Week 1
- legal-reviewer fixed-scope package → 시간당 → retainer 단계
- internal beta는 workflow technical validation 한정
- customer domain ADR 별도
- 사전심의 manual-assisted workflow
- PIPA + GDPR checklist Phase 1 gate
- DATA_MODEL C-08 v0.23 — email transport/provider 분리

## 의뢰

v0.3을 v1.0 인프라 결정으로 최종 검증하라.

ready_for_acceptance=true 판정 기준:
- blocking 0개
- major 0~2개 (잔여 minor 수준)
- SoT cascade 동기화 완료 (REVIEW_WORKFLOW·DATA_MODEL)
- 솔로 + AI 보조 운영 가능
- 의료법·개인정보보호법 준수

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `INFRA3-`. **v1.0 acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\infra_decisions_cycle2_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\features\*.md`
