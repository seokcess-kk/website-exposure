# 자동 비평 의뢰 — `docs/decisions/INFRA_DECISIONS_DRAFT.md` v0.2 (2차)

## 컨텍스트

1차 비평(17 지적: blocking 5 + major 9 + minor 3) 전건 수용. v0.2 핵심 변경:
- Multi-tenant: service_role → break-glass 한정. tenant-scoped role + RLS ON 기본. scopedDb API + lint + composite FK. schema-per-tenant ADR 별도
- Backup/restore: Phase 0부터 tenant export/import tooling + restore rehearsal
- Noisy neighbor: statement_timeout per query class·worker pool 분리·instance별 concurrency·DB connection pool 분리
- Resend: PHI/환자정보 금지·DPA·Postmark fallback·provider adapter interface
- Sentry: error 한정·DB audit·feature tables·platform log 분리·PII scrubber·correlationId·event sampling·quota alert
- Upstash: dedupe·suppression만. 정밀 token bucket·quota는 Postgres
- Phase 0 6~8주로 확장·dev/staging vertical (prod 이연)·M0 vertical slice schema 15 tables·P0 critical 패턴 8종
- TypeScript strict·Biome·Vitest·Playwright·fixture convention·migration deploy expand/contract
- 베타: DPA·legal-reviewer Phase 1 시작 gate·외부 법무 자문 retainer·internal beta fallback
- Provider adapter interface·canonical enum·INV-* fixture 자동 생성

## 의뢰

v0.2를 v1.0 인프라 결정으로서 엄정하게 비평하라:

1. **1차 지적 재발 여부**: 17개가 실제로 정정됐는가? 표면만 바뀌고 본질이 남아있지 않은가?
2. **v0.2 신규 메커니즘 모순**:
   - scopedDb + RLS 양층 — repository에서 instance_id를 명시 지정하는데 RLS가 또 검사? 중복인가 안전망인가? next-auth session 기반 `app.current_instance_id` set_config의 worker 적용 방식
   - service_role break-glass 사용 시 audit log `service-role-invoked` cascade — REVIEW_WORKFLOW에 실제 추가 필요?
   - composite FK `(instance_id, parent_id)` — 모든 child table에 적용하면 spec의 기존 UNIQUE·FK와 충돌 가능성
   - tenant export/import — encrypted secrets·legalApproval·credential rotation 등 cross-instance 의존이 있는 데이터를 어떻게 처리?
   - P0 critical 8종 + P1 + Deferrable 분류가 실제 spec 의존성과 일치하는가? (예: NotificationLog가 P1인데 outbox/dispatch가 P0면 NotificationLog 없이 outbox가 동작 가능한가)
3. **운영 현실성**:
   - Phase 0 6~8주가 솔로 + AI 보조에서 도전적인가, 적정한가, 여유로운가?
   - legal-reviewer 외부 법무 자문 retainer 비용(월 300만+) 부담·대안 (시간당 contract)
   - internal beta fallback이 의료광고법 검증의 가치를 어떻게 제공하는가 — 가상 의료기관으로 실제 법무 워크플로 학습 가능한가?
4. **이전 결정과의 정합**:
   - 8 Feature spec에서 `service_role` 기반 backend 운영을 암묵 가정하는 부분 (예: notifications outbox worker가 service_role 없이 가능한가)
   - Drizzle ORM이 RLS와 호환되는가 (set_config 트랜잭션 scope)
   - Supabase Storage RLS는 next-auth 환경에서 어떻게 매핑되는가 (v0.2에서 deferred한 부분)
5. **누락된 결정**:
   - PoCs·spike·기술 검증 일정 (예: Drizzle + RLS + Supabase에서 실제 동작 검증)
   - 베타 의료기관별 customer domain 처리 (Phase 1+)·SSL 인증서·DNS·Cloudflare for SaaS
   - 의료광고 사전심의 협업 (대한의사협회·치과의사협회·한의사협회 — 각 기관마다 사전심의 절차 다름)·integration 방식
   - GDPR vs 한국 개인정보보호법 정합 (베타 의료기관이 외국인 환자 대상이면 GDPR도 적용)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `INFRA2-`. **v1.0 인프라 결정으로 acceptance 가능하면 `ready_for_acceptance=true`** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\infra_decisions_cycle1_response.md`
- `C:\Users\assag\solution\website-exposure\docs\features\*.md` (8 Feature v1.0)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
