# 자동 비평 의뢰 — `docs/decisions/INFRA_DECISIONS_DRAFT.md` (1차)

## 컨텍스트

8 Feature spec v1.0 완료 후 솔로 개발자(1명 + AI 보조) MVP 구축 단계. 이전 결정:
- 8 Feature 한 번에 구현·Phase 0~4 단계 deploy·9~12개월 추정
- 스택: Node + Next.js + Drizzle + Supabase PostgreSQL + Railway worker + Vercel web
- Storage: Supabase Storage·Auth: next-auth (Auth.js)

본 결정 문서(`docs/decisions/INFRA_DECISIONS_DRAFT.md`)는 다음 4영역을 결정:
1. Multi-tenant 모델 (single DB + instanceId column 권장)
2. Email·Monitoring·Redis provider 세부 (Resend + Sentry + Upstash Redis 권장)
3. Phase 0 첫 1~2주 구체 작업 목록 (Week 1-2 repo·DB·worker·webhook·auth·monitoring + Week 3-6 Core schema·공통 패턴·UI 골격)
4. 베타 타겟 의료기관·법무·계약 일정 (Phase 1 끝 베타 1곳·외부 영업·DPA 동기화)

## 의뢰

이전 spec 비평(content-migration·crm-sync 등)과 동일한 강도로 비평하라. 특히:

1. **Multi-tenant A 선택의 risk**:
   - noisy neighbor (한 instance 쿼리가 다른 instance 성능 영향)
   - backup per instance 어려움
   - data isolation 감사 요구 (의료기관별 물리 격리)
   - Phase 3+ schema-per-tenant 마이그레이션 path가 실제로 열려 있는가?
   - Drizzle repository 자동 scoping이 빠뜨릴 위험 (forgotten `WHERE instance_id`)
   - service_role key 사용 정책의 보안 위험

2. **Provider 세부 결정 trade-off**:
   - Resend: 의료 도메인 적합성 (DKIM·HIPAA?)·100/day 무료 → MVP 충분?
   - Sentry: 5k events 무료 → 의료기관 운영 중 충분?
   - Upstash Redis: serverless HTTP API의 latency·spec의 token bucket 정확도
   - 모두 vendor lock-in 정도

3. **Phase 0 작업 목록 현실성**:
   - Week 1-2 (10 working days) 안에 GitHub·Vercel·Supabase·Railway·Cloudflare·Doppler·Sentry·Resend·Upstash·next-auth·Drizzle·CI 셋업 가능한가?
   - 솔로 + AI 보조 가정에서 도전적인가?
   - 누락된 항목 (예: Storybook·테스트 framework·linter·formatter·typescript strict 등 결정)

4. **베타 일정 외부 의존 buffer**:
   - DPA 작성·체결 일정이 Phase 1 16주 안에 가능한가?
   - legal-reviewer 운영자가 M0 deploy 전 (Week 16) 정해져야 하는데 가능한가?
   - 베타 의료기관 1곳 영업이 Phase 0~1 동안 진행되는데 일정 risk

5. **공통 패턴 라이브러리 (Week 4 1주)**:
   - spec의 70+ table·8 Feature가 의존하는 cross-cutting 패턴 (closed schema·hash secrets·CAS·outbox·retry·grace expiry·legalImpactClassifier·writeSetManifest·purge worker·legal hold precedence·rate limit token bucket 등) 모두 1주 안에 가능한가?
   - 어떤 패턴이 가장 critical하고 어떤 패턴은 Phase 1~2 deferral 가능한가?

6. **누락된 결정 항목**:
   - TypeScript strict mode·linter (biome/eslint)·formatter
   - 테스트 framework (Vitest·Playwright)
   - DB migration deploy 전략 (Drizzle Kit·db-mate·Atlas)
   - environment variable 관리 (Doppler API·local override)
   - logging strategy (Sentry breadcrumbs vs 별도 log sink)
   - error handling 표준 (Result type·throw)
   - acceptance test fixture 자동 생성 전략 (spec의 INV-* 표를 fixture로)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `INFRA1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\decisions\INFRA_DECISIONS_DRAFT.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\*.md` (8 Feature v1.0)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
