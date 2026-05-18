Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e2976-7933-71e2-92fd-27b50601b999
--------
user
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
codex
대상 결정 문서와 관련 SoT를 먼저 읽고, 결정 문서가 실제 feature spec의 요구를 감당하는지 기준으로 비평하겠습니다. 특히 infra 결정이 나중에 되돌리기 어려운 지점과 일정 산정의 숨은 의존성을 우선 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files docs/features' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/decisions/INFRA_DECISIONS_DRAFT.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 699ms:
# 인프라 결정 — 4영역 draft (v0.1)

> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 결정**: 8 Feature spec v1.0 완료·솔로 1명 + AI 보조·9~12개월·Phase 0~4 단계·Vercel+Supabase+Railway 스택·Supabase Storage·next-auth
> **목적**: 4영역 인프라/운영 결정 draft. codex 비평 후 확정.

---

## 영역 1: Multi-tenant 모델

### 컨텍스트

- spec의 DATA_MODEL C-08 InstanceManifest는 instanceId 기반 multi-tenant 가정
- 모든 70+ table에 `instanceId` column·`UNIQUE(instanceId, ...)`·partial unique `WHERE active=true` 패턴 다수
- 의료기관별 데이터 격리 요구 (의료법·개인정보보호법)
- 솔로 운영 + 12개월 + Phase 4까지 점진적 multi-tenant 운영

### 옵션

| 옵션 | 격리 수준 | 솔로 운영 | 확장성 | 비용 |
|---|---|---|---|---|
| A. Single DB + instanceId column + RLS | 논리적 (column level) | **단순** — 1개 DB | 수십 ~ 수백 instance | 최소 |
| B. Single DB + Schema-per-tenant | 물리적 (schema level) | 중간 — schema 관리 | 수백 instance | 중간 |
| C. Database-per-tenant | 물리적 (DB level) | 복잡 — DB 다수 | 수천 instance | 큼 |
| D. Hybrid (control plane DB + tenant DB) | 혼합 | 복잡 | 무제한 | 큼 |

### 권장: **A. Single DB + instanceId column + Postgres RLS (선택적)**

근거:
1. spec이 A를 가정 — 70+ table이 이미 instanceId 패턴
2. 솔로 운영 비용 최소 — 1개 DB·backup·migration·monitoring
3. Phase 0~M2 (수십 instance) 충분
4. instance 격리 강화 필요 시 Phase 3+에서 schema-per-tenant 마이그레이션 가능 (path 열어둠)

RLS 사용 정책:
- backend(web·worker)는 Supabase **service_role key** 사용 → RLS bypass
- application-level instance scoping은 **Drizzle repository에서 강제** (모든 query 자동 `WHERE instance_id = ?` 주입)
- next-auth session에 `currentInstanceId` claim 포함 → repository가 read
- 솔로 운영 단순화 위해 RLS는 보조 안전망 (security defense in depth) — 실수로 service_role 외부 노출 시만 보호

trade-off 명시:
- **noisy neighbor**: 한 instance 쿼리가 다른 instance 성능 영향 가능 → 모니터링 + slow query alert
- **backup/restore per instance**: 어려움. Phase 3+ 데이터량 임계 도달 시 schema-per-tenant 옵션 평가
- **의료기관별 데이터 격리 감사 요구**: 일부 의료기관 계약에서 물리 격리 요구 가능 — 그 시점에 schema-per-tenant 옵션

### 운영 규칙

- 모든 repository 함수는 `currentInstanceId` 파라미터 받아 자동 주입
- worker는 작업 시작 시 instanceId 명시 + scoped query만 허용
- 운영자 UI는 super-admin이 instance switcher로 전환 (audit `instance-switched`)
- migration script는 instance-agnostic 또는 instance-loop (per instance)

---

## 영역 2: Email·Monitoring·Redis provider 세부

### 컨텍스트

- spec의 notifications: 이메일 채널·DKIM·delivery tracking 필요
- spec의 externalMonitoringSink: provider=sentry·dsnSecretRef 가정
- spec의 rateLimit: bucketBackend=redis-token-bucket

### Email Provider

| 옵션 | 무료 | 유료 | DX | DKIM | 비고 |
|---|---|---|---|---|---|
| **Resend** (권장) | 100/day·3000/월 | 1k/일 20$ | 매우 좋음 | 자동 | TS SDK·Next.js 적합 |
| SendGrid | 100/day | 50$/월부터 | 보통 | 자동 | enterprise tier |
| Postmark | 100/월 | 15$/월부터 | 좋음 | 자동 | transactional 강력 |
| AWS SES | 첫 62k/월 (EC2) | 0.10$/1k | 약함 | 수동 | 가장 저렴·셋업 복잡 |

**권장: Resend**
- 솔로 + Next.js 적합·React Email template 통합
- spec의 notifications "email channel" 첫 100/day 무료 → MVP 충분
- Phase 1+ 대량 발송 시 비용 검토 (분원·digest 발송 누적)

### Monitoring/Error Tracking

| 옵션 | 무료 | 유료 | spec 명시 |
|---|---|---|---|
| **Sentry** (권장) | 5k events/월 | 26$/월부터 | ✅ |
| BetterStack (Logtail + Better Uptime) | 1GB/월 | 25$/월 | — |
| Datadog | 14일 trial | 15$/host | — |
| Axiom | 0.5TB/월 | 25$/월 | — |

**권장: Sentry**
- spec 명시 (`externalMonitoringSink.provider="sentry"`)
- 표준·생태계
- Phase 1+ 추가로 log 통합 필요 시 BetterStack 또는 Axiom 결합 검토

### Redis

| 옵션 | 무료 | 유료 | DX |
|---|---|---|---|
| **Upstash Redis** (권장) | 10k commands/day | 0.2$/100k | HTTP API·serverless·Vercel/Railway 모두 |
| Railway Redis | 5$/월 (Hobby) | 사용량 | 표준 Redis·전용 instance |
| Supabase (pgmq) | — | DB tier | Postgres queue·Redis 대체 가능 |

**권장: Upstash Redis**
- serverless·HTTP API → Vercel·Railway·Supabase Edge 모두 사용
- spec의 token bucket·digest state·rate-limit 적합
- 솔로 운영 부담 0 (서버 관리 없음)

### 운영 규칙

- Email: notifications Feature가 Resend SDK 사용·outbox dispatch가 email 채널일 때만 호출·sandbox env에서는 Resend test API 사용
- Sentry: 모든 worker·web·webhook receiver에 SDK 통합·user context는 actorId·instanceId 포함
- Redis: token bucket key naming convention `{feature}:quota:{instanceId}:{provider}` (spec 명시)

---

## 영역 3: Phase 0 첫 1~2주 구체 작업 목록

### Week 1 — repo·DB·Vercel·CI 기본

| Day | 작업 | 산출물 |
|---|---|---|
| Day 1 | GitHub repo 생성·pnpm workspaces·.gitignore·README·LICENSE | repo skeleton |
| Day 1-2 | `apps/web` Next.js (App Router) shell·tsconfig·biome | 빈 admin layout + health check page |
| Day 2-3 | Supabase 프로젝트 생성 (dev·staging·prod 3개)·DB connection string·env vars | Supabase 3 projects |
| Day 2-3 | Doppler workspace + 3 환경·Vercel·Railway·Supabase env propagation | Doppler config |
| Day 3-4 | `packages/db` Drizzle 셋업·첫 migration (`health_check` table)·migration script | drizzle.config.ts + 1 migration |
| Day 4-5 | GitHub Actions CI (typecheck·biome·test·build)·Vercel Preview deploy | green CI |
| Day 5 | 로컬 docker-compose (postgres·redis·minio·resend mock) | docker-compose.yml |

### Week 2 — worker·webhook·auth·monitoring

| Day | 작업 | 산출물 |
|---|---|---|
| Day 6 | Railway project·`apps/worker` dummy script (5초 sleep loop + health)·deploy | Railway worker running |
| Day 6-7 | `apps/webhook-receiver` Hono shell + Railway deploy | Hono health endpoint |
| Day 7-8 | Cloudflare DNS·Vercel custom domain·dev/staging/prod 분리 | 3 domain |
| Day 8 | Sentry projects (web·worker·webhook 각각)·DSN env | Sentry 3 projects |
| Day 8 | Resend account + DNS·DKIM 검증 | Resend domain verified |
| Day 8 | Upstash Redis (dev·staging·prod) | 3 Redis instances |
| Day 9-10 | next-auth (Auth.js) 기본 + Drizzle adapter·user/session/account/verificationToken table·magic link (Resend) | login page + magic link 동작 |

### Week 3-6 (이후 — Phase 0 나머지)

| 주차 | 영역 | 결과 |
|---|---|---|
| Week 3 | DATA_MODEL Core schema (페이지·콘텐츠·ComplianceRecord 등) Drizzle 정의·migration | DB schema 30+ tables (Core) |
| Week 4 | 공통 패턴 라이브러리: outbox·retry queue·CAS·closed schema validator·hash utils (HMAC·secretRef 추상화) | `packages/core-data-model` + `packages/db` 확장 |
| Week 4 | DESIGN_TOKENS Style Dictionary build·ui-tokens 패키지·디자인 system 기본 컴포넌트 (Button·Input·Card 등 10개) | `packages/ui-tokens` + Storybook (선택) |
| Week 5 | REVIEW_WORKFLOW 상태 머신 구현 (compliance lifecycle·multi-role gate) | `packages/features/_review-workflow` |
| Week 5 | 운영자 UI 골격: navigation·layout·role guard·instance switcher·audit log viewer | Admin shell |
| Week 6 | Phase 1 시작 전 Phase 0 검증: 첫 e2e (login → 콘텐츠 작성 dummy → audit log row 확인) | Phase 0 sign-off |

### Phase 0 완료 조건

1. 3개 환경 (dev·staging·prod) 모두 deploy 가능
2. CI 통과 (typecheck·biome·test·build)
3. next-auth magic link 로그인 동작
4. 빈 콘텐츠 CRUD가 instance scoping 통과
5. DB migration 자동화 (Drizzle migrate on deploy)
6. Sentry·Resend·Upstash 모두 연결·smoke test 통과

---

## 영역 4: 베타 타겟 의료기관·법무·계약 일정

### 컨텍스트

- 솔로 개발·외부 영업·법무 진행 상황 미상
- spec의 legalApproved·DPA·legal-reviewer 운영자는 외부 의존
- Phase 1 끝(약 Week 14~18) M0 베타 가능 시점

### 권장 일정 (개발 일정 기준 — 외부 일정과 동기화 필요)

| 시점 | 영업·법무 작업 | 개발 작업 |
|---|---|---|
| Week 1~6 (Phase 0) | 타겟 의료기관 1~3곳 영업·MVP 가치 제안 정리·NDA·1차 미팅 | Phase 0 구축 |
| Week 7~16 (Phase 1) | 베타 1곳 정식 선정·DPA 템플릿 작성·legal-reviewer 후보 결정 (Glitzy 내부 또는 외부 법무 자문) | M0 (notifications + compliance-assistant + 콘텐츠 발행) |
| Week 16~18 | 베타 계약 체결·legalApproved=true·DPA 증빙 secretRef 셋업 | M0 deploy + 베타 1곳 운영 시작 |
| Week 17~24 (Phase 2) | 베타 피드백·KPI 측정·2번째 베타 의료기관 영업 | M1 (search-visibility + keyword-monitoring) |
| Week 25~32 (Phase 3) | 베타 2곳 확장·legal-reviewer 운영 안정화 | M2 (asset-ingestion + analytics-reporting) |
| Week 33~48 (Phase 4) | crm-sync 위한 CRM provider 계약 (Salesforce·HubSpot)·DPA 강화·정식 출시 준비 | M3 (crm-sync + content-migration) |

### 베타 타겟 의료기관 선정 기준 (권장)

| 기준 | 우선순위 |
|---|---|
| 콘텐츠 발행 빈도가 높은 곳 (블로그·정보 페이지 운영 적극적) | 높음 |
| 의료광고법 준수 의지가 명확한 곳 (legal-reviewer 협조 가능) | 높음 |
| 네이버 SEO 노출 개선 의지가 강한 곳 | 높음 |
| CRM 사용 중 (Salesforce·HubSpot·자체) — Phase 4 crm-sync 검증 | 중간 (Phase 4용) |
| 분원 다수 (multi-instance 운영) | 낮음 (Phase 3+용) |

### 결정 보류 항목

- 구체 타겟 의료기관은 사용자(Glitzy)가 영업 진행 상황 알려줘야 구체화 가능
- legal-reviewer 운영자: Glitzy 내부 인력 vs 외부 법무 자문 (의료광고법 전문 변호사) — 비용·전문성 trade-off
- DPA 템플릿: Glitzy 자체 작성 vs 외부 법무 자문 작성 — 외부 자문 권장 (개인정보보호법 + 의료법 + 위탁 계약 복합)

---

## 종합 권장 요약

| 영역 | 결정 |
|---|---|
| 1. Multi-tenant | Single DB + instanceId + Drizzle repository scoping + RLS 보조 |
| 2-1. Email | Resend |
| 2-2. Monitoring | Sentry |
| 2-3. Redis | Upstash Redis |
| 3. Phase 0 작업 | Week 1-2 (repo·DB·worker·webhook·auth·monitoring) + Week 3-6 (Core schema·공통 패턴·UI 골격) |
| 4. 베타 일정 | Phase 1 끝 (Week 16~18) 1곳·Phase 2 끝 2곳·Phase 4 정식 출시 |

---

## codex 비평 의뢰 사항

다음 영역을 엄정하게 비평하라:

1. **Multi-tenant A 선택의 risk**: noisy neighbor·backup per instance·data isolation 감사 요구 — Phase 3+ schema-per-tenant 마이그레이션 path가 실제로 열려 있는가? Drizzle repository 자동 scoping이 빠뜨릴 위험은?
2. **Provider 세부 결정**: Resend·Sentry·Upstash 각각의 lock-in·비용 임계·솔로 운영 적합성
3. **Phase 0 작업 목록**: 누락된 항목·Week 1-2 일정 현실성·솔로 + AI 보조 가정에서 도전적인가?
4. **베타 일정**: 외부 의존(DPA·legal-reviewer·의료기관 영업) 일정 buffer 충분한가? legal-reviewer 운영 시작 시점이 M0 deploy 전에 와야 하는가?
5. **공통 패턴 라이브러리 (Week 4)**: spec의 closed schema·hash secrets·CAS·outbox·retry·grace expiry·legalImpactClassifier·writeSetManifest 등 cross-cutting 패턴 모두 포괄 가능한가? Week 4 1주 안에 가능한가?


 succeeded in 720ms:
# Admin — 검수 워크플로

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4 / `docs/admin/ARCHITECTURE.md` (v0.7)
> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 사용자별 권한·승인자 식별 정보 노출 주의.
> **연관 문서**:
> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
> - 위험도 자동 추론·ApproverRole 통과 기준·StaleFlags → `compliance/RISK_LEVELS.md`
> - 의료법 운영 가이드·사전심의 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
> - 어드민 화면 구성 → `docs/admin/ARCHITECTURE.md`

---

## 0. 한 페이지 요약

- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
- **사전심의 흐름**: `priorReviewRequired=true` 시 외부 자율심의기구 제출 → `priorReviewSubmissionId`·`priorReviewPassed` 기록 후 발행 허용
- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 상태 머신 enum 변경 | **MAJOR** | 진행 중 콘텐츠 영향 |
| 큐 진입 트리거 변경 | **MAJOR** | 미검수 콘텐츠 발생 가능 |
| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
| 화면·UX 변경 | MINOR | |
| 알림 채널 추가 | MINOR | |
| 감사 로그 필드 추가 | PATCH (append-only) | |

### 1.2 SoT 원칙

- 본 문서 = **검수 워크플로 운영 SoT** — 상태 머신·큐·승인 흐름·권한
- ApproverRole 통과 기준 SoT는 `compliance/RISK_LEVELS.md` § 4 (본 문서는 워크플로 적용)
- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)

### 1.3 본 문서가 다루지 않는 영역

- 데이터 계약 자체 — `DATA_MODEL.md`
- 룰 카탈로그·자동 추론 알고리즘 — `RISK_LEVELS.md`
- UI 시각 디자인 — `DESIGN_TOKENS.md`·`admin/ARCHITECTURE.md`

---

## 2. 워크플로 상태 머신

### 2.1 상태 enum

```ts
type ContentWorkflowState =
  | "draft"           // 작성 중 — 자동 검수 미실행
  | "review-queued"   // 검수 큐 진입 (작성자가 검수 요청 또는 자동 트리거)
  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
  | "approved"        // 필요한 모든 역할의 승인 완료
  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
  | "published"       // 발행됨 (Git 사본 생성)
  | "blocked"         // automatedDecision=block (fail 룰) — 본문 정정 필요
  | "rejected"        // 검수자가 명시적 거부
  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
```

### 2.2 전이 다이어그램

```
                            ┌──────────────────────┐
                            │       draft          │
                            └──────────┬───────────┘
                                       │ submit-for-review (작성자) 또는 자동 트리거 (§ 3.2)
                                       ▼
                            ┌──────────────────────┐
              ┌────────────►│   review-queued      │
              │             └──────────┬───────────┘
              │                        │ assign (검수자 픽업)
              │                        ▼
              │             ┌──────────────────────┐
              │             │     in-review        │
              │             └──┬──────┬────────────┘
              │                │      │
              │     reject     │      │ approve (해당 역할)
              │   (검수자)     │      ▼
              │                │   ┌─────────────────────────────┐
              │                │   │ AND 게이트 평가 (§ 4.5)     │
              │                │   │  모든 ApproverRole 충족?    │
              │                │   └────┬──────────┬──────────────┘
              │                │       Y           N (다음 역할 검수)
              │                │       ▼           │
              │                │  ┌──────────┐     │
              │                │  │ approved │     ┘
              │                │  └────┬─────┘
              │                │       │ automatedDecision != block 재확인
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │ publishable  │
              │                │  └────┬─────────┘
              │                │       │ publish (운영자 발행 액션)
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │  published   │
              │                │  └────┬─────────┘
              │                │       │ staleFlags 발생 (§ 6)
              │                │       ▼
              │                │  ┌──────────┐
              │                │  │  stale   │
              │                │  └────┬─────┘
              │                │       │ 재검수 큐 진입
              │                └────►──┘
              │                ▼
              │       ┌──────────────┐
              │       │   rejected   │
              │       └──────┬───────┘
              │              │ 작성자가 본문 정정 후 재제출
              └──────────────┘

draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
```

### 2.3 전이 트리거

| 전이 | 트리거 | 권한 |
|---|---|---|
| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
| `review-queued → in-review` | 검수자 픽업(assign) 또는 자동 라운드로빈 | 검수자(역할별) |
| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
| `in-review → rejected` | 검수자 명시 거부 | 검수자 |
| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
| `blocked → draft` | 작성자 본문 정정 후 (compliance-assistant 재실행 시 fail 미발생 시) | 작성자 |
| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |

---

## 3. 검수 큐 (Review Queues)

### 3.1 큐 종류 3종

| 큐 | 진입 조건 | 우선순위 | 처리자 |
|---|---|---|---|
| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |

#### 3.1.1 warning 큐 이탈 조건·기록

- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
- 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)

#### 3.1.2 content-gate와 warning 동시 발생 처리

ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)

### 3.2 자동 큐 진입 트리거

다음 이벤트 발생 시 콘텐츠 상태가 자동으로 `review-queued`로 전이:

- compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
- 자동 위험도 추론 결과 — High 등급
- StaleFlags 발생:
  - 의료법 개정 (`medical-law-revision-<id>`)
  - 콘텐츠 본문 RiskRule 매칭 텍스트 변경
  - 가격·ReviewPolicy·전후사진 미디어 변경
  - 의료진 자격·인증 변경
  - 인용 외부 링크 만료
- LegalDocument 발행 의무(C-10 LegalDocument required)
- 운영자 수동 트리거

### 3.3 우선순위·SLA

| 처리 영역 | SLA 목표 | 알림 정책 SoT |
|---|---|---|
| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |

SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).

> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.

---

## 4. multi-role AND 게이트

### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)

콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:

```
riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
            = ComplianceRecord.pageRiskLevel 출력 결과

finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
           ∪ (riskLevel ∈ {Medium, High} ? medical : ∅)               // 등급 기본 요구
           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
```

**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):

`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.

> **개념 정리**:
> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
> 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.

### 4.2 검수자별 검수 화면

| 역할 | 검수 화면 책임 |
|---|---|
| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
| **medical** (physicianApprover) | 의학 정보 사실성·효과·기간·부작용·금기 표현. 의료진 자격 검증 (RISK_LEVELS § 4.1) |
| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
| **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |

### 4.3 승인 액션

각 검수자는 자신의 역할에 한해 다음 액션 수행:

| 액션 | 결과 |
|---|---|
| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
| **reject** | `rejected` 상태로 전이. 거부 사유 메모 필수 (50자 이상) |
| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |

### 4.4 자동 차단

- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)

---

## 5. ComplianceRecord 슬롯 채움 흐름

### 5.1 역할 → 필드 매핑 (RISK_LEVELS § 4.1.3 정합)

approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:

| ApproverRole | 갱신 필드 |
|---|---|
| `operator` | `peerReviewer` (운영자 ID), `peerReviewedAt` (timestamp) |
| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
| `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |

### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)

DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.

**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
- 어드민 내부 저장소에만 존재. Git 사본·정적 빌드에 영향 없음

**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
- `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
- Git 사본·정적 빌드에 반영

### 5.3 갱신 시점

| 시점 | 동작 | 대상 |
|---|---|---|
| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
| 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |

### 5.4 ComplianceRecord 불변성·버전 모델

- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
- staleFlags 외 필드 수정 시도 — 빌드/API fail

---

## 6. StaleFlags 처리

### 6.1 발생 트리거 (RISK_LEVELS § 4 정합)

| 트리거 이벤트 | 설정되는 flag |
|---|---|
| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
| 콘텐츠 본문 RiskRule 매칭 텍스트 영역 변경 | `medical=true` |
| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
| 의료진 자격·인증 변경 (DoctorProfile) | `medical=true` |
| 인용 외부 링크 만료 (404·5xx) | `medical=true` |
| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
| ReviewPolicy 변경 | `legal=true` |
| 전후사진 미디어 첨부·교체 | `legal=true` |
| 본문 일반 변경 | `operator=true` |
| 기관 정체성 변경 (ClinicProfile name·businessRegistrationNumber 등) | `client=true` |

각 이벤트는 `triggeredBy`·`triggeredAt` 동시 기록.

### 6.2 stale 큐 진입·처리

- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
- 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
- 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
- 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)

### 6.3 staleFlags 우선순위

여러 flag가 동시 발생 시 우선순위:

```
legal > medical > client > operator
```

- 우선순위 높은 flag가 먼저 처리되어야 다음 처리 가능 (선택적 정책 — instance 옵션 — MA-07)
- 또는 병렬 처리 허용 (기본값)

---

## 7. 발행 결정

### 7.1 publishable 산정 알고리즘

콘텐츠가 `publishable` 상태가 되기 위한 조건:

```
publishable = (1) automatedDecision !== "block"
           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
           ∧ (3) priorReviewRequired=true 이면 priorReviewPassed=true ∧ priorReviewSubmissionId 기록 ∧ 법무 의견서 attachments[] 첨부
           ∧ (4) staleFlags 모두 false 또는 미설정
           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
```

위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)

### 7.2 publish 액션

- 권한: `super-admin`·`operator` (역할별 운영 정책)
- 입력: 콘텐츠 @id
- 검증: § 7.1 재실행 (auth time-of-use)
- 결과:
  - `published` 상태 전이
  - ComplianceRecord `publishedAt`·`publishedBy` 기록
  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
  - 빌드 트리거 (정적 사이트 재빌드)

### 7.3 unpublish 액션

- 권한: `super-admin`만
- 결과:
  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
  - Git 사본 제거
  - 재발행 시 워크플로 재실행

---

## 8. 사전심의 (priorReview) 흐름

### 8.1 priorReviewRequired 판정

**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:

1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)

**판정 기준** (MEDICAL_AD_COMPLIANCE_COMMON § 4 정합):
- 매체 분류 (시행령 제24조제1항·제2항)
- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
- 의료광고 정의(제56조제1항) 결합 판정

판정 결과 기록 (DATA_MODEL C-10 v0.15 정합):
- `ComplianceRecord.priorReviewRequired=true|false`
- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
- `mediaThresholdOperationalInput` 슬롯 (rolling operational 입력 자료 — 감사 보존)

#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거

`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).

```ts
async function enqueueMediaThresholdReassessment(input: {
  instanceId: Slug;
  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
  newState: "threshold-reached" | "threshold-released";
  assessmentBasisDate: ISODateString;
  measurementSnapshot: MediaThresholdAssessment;  // DATA_MODEL C-10 v0.14 SoT 타입
}): Promise<{ enqueuedCount: number; reassessmentBatchId: string }>
```

**동작**:
1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
8. `analytics-reporting`이 자동 발송하는 `media-threshold-*` 이벤트는 운영 alert 성격 — 법적 판정 자체는 본 워크플로 책임

**priorReviewRequired 산정 기준 분리** (AR2-08):
- 운영 측정(`mediaThresholdAssessment.calendarPolicy="rolling-90-days"`)은 조기경보 입력만. **priorReviewRequired 산정에 직접 사용 금지**
- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록

### 8.2 사전심의 대상인 경우

```
1. legal 검수자 priorReviewRequired=true 기록
2. 운영자가 자율심의기구(대한의사협회·대한치과의사협회·대한한의사협회 등) 제출
3. 제출 ID 기록 — priorReviewSubmissionId
4. 심의 결과 도착 (외부)
5. 통과 — priorReviewPassed=true 기록 + 심의 결과 첨부(attachments[])
6. 거부 — priorReviewPassed=false. 본문 정정 후 재제출 또는 콘텐츠 폐기
7. publishable 조건 § 7.1 (3) 충족
```

### 8.3 priorReview 상태 추적 화면

어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.

---

## 9. 알림 (notifications Feature Module 인터페이스)

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered"
  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |

- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)

- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)

### 9.2 알림 페이로드

본 절은 두 단계 타입을 정의:
- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
- **NotificationPayload** — 본 Feature 내부 fan-out 결과 (per-recipient 발송 단위)

```ts
type NotificationEvent = {
  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
  eventType: NotificationEventType;                    // § 9.1 enum
  contentRef: string;                                  // 대상 콘텐츠 @id
  contentTitle: string;
  recipients: NotificationRecipient[];                 // 다수 수신자 fan-out
  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
  createdAt: ISODateString;
};

type NotificationRecipient = {
  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
  recipientRole: ApproverRole | "author" | "operations";  // 표시·라우팅용 컨텍스트
};

type NotificationPayload = {
  payloadId: string;                                   // UUID — fan-out 단위 ID
  eventId: string;                                     // 상위 NotificationEvent 참조
  eventType: NotificationEventType;
  contentRef: string;
  contentTitle: string;
  recipientId: string;                                 // 단건 수신자
  recipientRole: ApproverRole | "author" | "operations";
  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
  criticality: "critical" | "high" | "normal";
  metadata: object;
  createdAt: ISODateString;
};
```

#### 9.2.1 idempotency 계약

- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)

### 9.3 알림 채널·운영

- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
- Slack은 **2가지 동작 모드 분기**:
  - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2

---

## 10. 감사 로그 (Audit Log)

### 10.1 기록 대상

- 모든 워크플로 상태 전이
- 모든 검수자 액션 (approve·reject·request-changes·delegate)
- ComplianceRecord 슬롯 갱신
- staleFlags 발생·해제
- publish·unpublish
- 권한 변경·로그인·로그아웃
- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적

### 10.2 audit log 페이로드

```ts
type AuditLogEntry = {
  id: string;                 // UUID
  timestamp: ISODateString;
  actorId: string;             // 사용자 ID 또는 "system" (자동 트리거)
  actorRole: AdminUserRole;
  action: AuditAction;          // § 10.2.1 enum
  contentRef: string;
  fromState?: ContentWorkflowState;
  toState?: ContentWorkflowState;
  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
};
```

#### 10.2.1 AuditAction enum

```ts
type AuditAction =
  | "approve" | "reject" | "request-changes" | "delegate"
  | "publish" | "unpublish"
  | "stale-triggered" | "stale-resolved"
  | "compliance-record-updated"
  | "permission-changed" | "login" | "logout"
  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
  | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
  | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
  | "asset-ingestion-source-registered"       // IngestionSource 등록
  | "asset-ingestion-source-unregistered"     // soft delete
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
  | "asset-ingestion-asset-rejected"          // 검수 거부
  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
  | "crm-integration-registered"              // CRM 연동 등록
  | "crm-integration-unregistered"            // soft delete
  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-paused"            // CM3-01
  | "content-migration-run-resumed"           // CM3-01
  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted";          // CM4-05 — abortRun
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

---

## 11. 권한·역할

### 11.1 AdminUserRole enum

```ts
type AdminUserRole =
  | "super-admin"        // 모든 권한 (Glitzy 운영팀)
  | "operator"            // 일반 운영자 — 작성·검수 큐 처리·발행
  | "physician-reviewer"  // medical 역할 검수만
  | "legal-reviewer"      // legal 역할 검수만
  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
```

### 11.2 권한 매트릭스

| 액션 | super-admin | operator | physician | legal | client |
|---|:---:|:---:|:---:|:---:|:---:|
| 콘텐츠 작성·편집 | ✅ | ✅ | | | |
| 검수 요청 (draft→review-queued) | ✅ | ✅ | | | |
| operator approve | ✅ | ✅ | | | |
| medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
| publish | ✅ | ✅ | | | |
| unpublish | ✅ | | | | |
| 권한 관리 | ✅ | | | | |
| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |

> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
> - medical: DoctorProfile (C-02) 등록 + `credentials[]` 항목으로 의료진 자격 인증 검증
> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
> - client: 클라이언트 측 위임 권한 (RL-05)
>
> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
>
> **자격 검증 알고리즘 구현 영역**: medical 도메인 자격 매칭(한의 콘텐츠 → 한의사 등) 자동 판정은 RISK_LEVELS RL-03 미결정 영역. v1.0에서는 어드민 운영자가 자격 매칭 수동 검증·기록.

### 11.3 역할 위임

- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
- 다른 역할로의 위임 금지 — 검수 자격 분리 원칙

---

## 12. 빌드 검증 — 룰 레벨

| 레벨 | 본 문서 영역 |
|---|---|
| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |

---

## 13. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AW-01 | 검수자 라운드로빈 알고리즘 (assign 자동화) — FIFO vs 워크로드 기반 | M2+ |
| AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
| AW-03 | 외부 법무법인 식별자 데이터 모델 (RISK_LEVELS RL-04와 동일) | DATA_MODEL 후속 |
| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
| AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |

---

### 13.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |


 succeeded in 727ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.22
> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
> **연관 문서**:
> - 페이지 타입 → `core/PAGE_TYPES.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 위험도 → `compliance/RISK_LEVELS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (23개)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |

### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)

| ID | 공통 타입 | 책임 | 소속 | 사용처 |
|---|---|---|:---:|---|
| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |

---

## 2. 공통 룰

### 2.1 타입 표기법

| 표기 | 의미 |
|---|---|
| `string`/`number`/`boolean` | 기본 |
| `Date` | ISO 8601 |
| `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
| `Markdown` | Markdown 본문 |
| `T[]` | 배열 |
| `T \| U` | 합 타입 |
| `enum {A, B, C}` | 열거형 |
| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
| `?` (필드 뒤) | optional |

### 2.2 공통 메타 필드 (모든 계약)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
| `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
| `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
| `@version` | `number` | optional | 계약 스키마 버전 |
| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |

### 2.3 식별자(`@id`) 규약
- 인스턴스 내 유일, slug 형식, 3~64자.
- 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).

### 2.4 다국어
- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.

### 2.5 SoT 원칙 (v0.4 명시)
- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.

### 2.6 변경 정책

| 변경 종류 | 분류 |
|---|---|
| optional 필드 추가 | MINOR |
| required 필드 추가 | **MAJOR** |
| 필드 타입 변경 (호환) | MINOR |
| 필드 타입 변경 (비호환) | **MAJOR** |
| 필드 제거 | **MAJOR** |
| validation 강화 | 케이스별 |
| validation 완화 | PATCH |
| enum 값 추가 | MINOR |
| enum 값 제거 | **MAJOR** |
| 기본값 변경 | 케이스별 |

> 상위 `release/VERSIONING_POLICY.md` 참조.

---

## 3. 공통 타입 풀명세

### CT-01. `TrustMetric` — 신뢰도·통계 지표

**목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 지표 식별자 |
| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
| `value` | `number \| string` | ✅ | 값 |
| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
| `measuredFrom` | `Date` | optional | 측정 시작일 |
| `measuredTo` | `Date` | optional | 측정 종료일 |
| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
| `evidenceNote` | `string` | optional | 증빙 설명 |
| `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
| `displayFormat` | `string` | optional | 노출 형식 템플릿 |

**컴플라이언스 룰**:
- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").

### CT-02. `BusinessHours` — 진료시간·접수시간·휴진

**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |

**하위 타입**:

#### `OpeningHoursSpec`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
| `opens` | `string` | ✅ | `"HH:mm"` |
| `closes` | `string` | ✅ | `"HH:mm"` |
| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
| `note` | `string` | optional | |

#### `LunchBreak`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
| `from` | `string` | ✅ | |
| `to` | `string` | ✅ | |

#### `SpecialClosure`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | |
| `reason` | `string` | optional | |
| `note` | `string` | optional | |

### CT-03. `CTAConfig` — 전환 채널 설정

**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 채널 식별자 |
| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
| `label` | `string` | ✅ | 버튼·링크 텍스트 |
| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
| `iconKey` | `string` | optional | 아이콘 식별자 |
| `style` | `enum {primary, secondary, minimal}` | optional | |
| `displayOrder` | `number` | optional | 정렬 |
| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
| `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |

> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.

---

## 4. 데이터 계약 풀명세 (M0 핵심)

### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)

**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
| `name` | `string` | ✅ | 정식 명칭 (1~100자) |
| `alternateName` | `string` | optional | 영문명 |
| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
| `slogan` | `string` | optional | 한 줄 가치 |
| `description` | `string` | ✅ | 80~300자 |
| `longDescription` | `Markdown` | optional | About 본문 |
| `foundingDate` | `Date` | optional | 설립일 |
| `founder` | `string` | optional | 대표자명 |
| `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
| `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
| `awards` | `Award[]` | optional | 인증·수상 |
| `memberOf` | `Affiliation[]` | optional | 학회·협회 |
| `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
| `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
| `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
| `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
| `logoUrl` | `URL` | ✅ | 로고 |
| `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |

**하위 타입**:

#### `Address`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `streetAddress` | `string` | ✅ | 도로명 상세 |
| `addressLocality` | `string` | ✅ | 시·군 |
| `addressRegion` | `string` | ✅ | 도·광역시 |
| `postalCode` | `string` | ✅ | 우편번호 |
| `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |

#### `GeoCoordinates`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `latitude` | `number` | ✅ | |
| `longitude` | `number` | ✅ | |

#### `Award`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 인증·수상명 |
| `awardedBy` | `string` | optional | 수여 기관 |
| `awardedDate` | `Date` | optional | |
| `verificationUrl` | `URL` | optional | 검증 가능 링크 |

#### `Affiliation`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 학회·협회명 |
| `role` | `string` | optional | |
| `url` | `URL` | optional | |
| `verified` | `boolean` | optional | |

#### `ResearchInstitute`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 연구 기관명 |
| `description` | `string` | optional | |
| `url` | `URL` | optional | |
| `relationship` | `enum {affiliate, partner, owned}` | optional | |

#### `SocialMediaLinks`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `naverBlog` | `URL` | optional | |
| `instagram` | `URL` | optional | |
| `youtube` | `URL` | optional | |
| `kakao` | `URL` | optional | |
| `facebook` | `URL` | optional | |
| `linkedin` | `URL` | optional | |
| `others` | `{label: string, url: URL}[]` | optional | |

#### `MediaItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `outlet` | `string` | ✅ | 매체명 |
| `title` | `string` | ✅ | |
| `date` | `Date` | optional | |
| `url` | `URL` | optional | |

#### `InternationalSupport`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `languages` | `string[]` | ✅ | ISO 639-1 |
| `interpreterAvailable` | `boolean` | optional | |
| `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
| `targetCountries` | `string[]` | optional | |

### C-02. `DoctorProfile` — 의료진 권위·전문성

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `alternateName` | `string` | optional | 영문명 |
| `jobTitle` | `string` | ✅ | 직책 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
| `briefBio` | `string` | ✅ | 50~200자 |
| `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
| `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
| `photoUrl` | `URL` | optional | |
| `credentials` | `Credential[]` | ✅ | 최소 1개 |
| `education` | `Education[]` | optional | |
| `career` | `CareerItem[]` | optional | |
| `affiliations` | `Affiliation[]` | optional | |
| `publications` | `Publication[]` | optional | |
| `media` | `MediaItem[]` | optional | |
| `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
| `email` | `Email` | optional | |
| `socialMedia` | `SocialMediaLinks` | optional | |
| `consultationAvailable` | `boolean` | optional | 기본 `true` |
| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |

**하위 타입**:

#### `Credential`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {license, certification, board}` | ✅ | |
| `name` | `string` | ✅ | |
| `issuedBy` | `string` | optional | |
| `issuedDate` | `Date` | optional | |
| `expiryDate` | `Date` | optional | |

#### `Education`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `institution` | `string` | ✅ | |
| `degree` | `string` | ✅ | |
| `period` | `string` | optional | 예: `"2010-2016"` |

#### `CareerItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `organization` | `string` | ✅ | |
| `role` | `string` | ✅ | |
| `period` | `string` | optional | |

#### `Publication`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | |
| `venue` | `string` | optional | 학회지·매체 |
| `year` | `number` | optional | |
| `url` | `URL` | optional | |

### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~80자 |
| `alternateName` | `string` | optional | |
| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
| `category` | `string` | optional | 시술 카테고리 |
| `medicalSpecialty` | `Ref<C-14>` | optional | |
| `overview` | `Markdown` | ✅ | 개요 |
| `mechanism` | `Markdown` | ✅ | 원리 |
| `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
| `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
| `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
| `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
| `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
| `duration` | `string` | optional | 소요 시간 |
| `sessionCount` | `string` | optional | 권장 횟수 |
| `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
| `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
| `aftercare` | `Markdown` | optional | 시술 후 관리 |
| `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
| `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
| `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
| `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
| `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
| `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
| `heroImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |

**하위 타입**:

#### `ProcessStep`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | 단계 번호 |
| `name` | `string` | ✅ | 단계명 |
| `description` | `Markdown` | ✅ | |
| `durationMinutes` | `number` | optional | |

#### `TreatmentComponent` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
| `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
| `description` | `Markdown` | optional | |
| `included` | `boolean` | optional | 패키지 포함 여부 (default true) |

#### `VisitFlowStep` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | |
| `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
| `description` | `Markdown` | optional | |
| `durationMinutes` | `number` | optional | |
| `location` | `enum {clinic, remote, both}` | optional | |

#### `ProgramVariant`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
| `duration` | `string` | ✅ | 기간 |
| `sessionCount` | `string` | optional | 세션 수 |
| `targetSegment` | `string` | optional | 대상 분류 |
| `briefDescription` | `Markdown` | ✅ | |
| `includes` | `string[]` | optional | 포함 항목 |
| `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |

#### `EvidenceNote` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
| `summary` | `string` | optional | 간략 요약 |
| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
| `publishedYear` | `number` | optional | |
| `verifiedBy` | `string` | optional | 검증자·기관 |

#### `SlotRiskOverride`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
| `level` | `RiskLevel` | ✅ | 격상 등급 |
| `reason` | `string` | ✅ | 감사 추적용 |

### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `headline` | `string` | ✅ | 1~120자 |
| `summary` | `string` | ✅ | 80~200자 |
| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
| `author` | `Ref<C-02>` | ✅ | 저자 |
| `coAuthors` | `Ref<C-02>[]` | optional | |
| `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
| `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
| `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
| `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
| `datePublished` | `Date` | ✅ | 최초 발행일 |
| `dateModified` | `Date` | ✅ | 최종 수정일 |
| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
| `tags` | `string[]` | optional | |
| `readingTimeMinutes` | `number` | optional | 자동 계산 |
| `wordCount` | `number` | optional | 자동 계산 |
| `coverImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
| `relatedArticles` | `Ref<C-04>[]` | optional | |
| `relatedTreatments` | `Ref<C-03>[]` | optional | |
| `relatedConditions` | `Ref<C-11>[]` | optional | |
| `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |

**ArticleType ↔ 자동 추론 위험도**:

| ArticleType | 자동 위험도 | 운영자 오버라이드 |
|---|:---:|:---:|
| `notice` | Low | ✅ |
| `general-medical-info` | Medium | ✅ |
| `treatment-explainer` | Medium | ✅ |
| `condition-explainer` | Medium | ✅ |
| `effect-result-related` | High | ✅ (낮출 수 없음) |
| `review-case` | High | ✅ (낮출 수 없음) |
| `event-price` | High | ✅ (낮출 수 없음) |

**하위 타입**:

#### `EmbeddedMedia`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
| `url` | `URL` | ✅ | |
| `title` | `string` | optional | |
| `caption` | `string` | optional | |
| `durationSeconds` | `number` | optional | |
| `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |

**컴플라이언스 주의**:
- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
- `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
- `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).

### C-05. `RiskLevel` (enum) — 위험도 등급

```ts
type RiskLevel = "Low" | "Medium" | "High";
```

**v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).

> 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.

### C-06. `PageMeta` — 페이지별 메타 데이터

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | 10~70자, `<title>` |
| `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
| `canonical` | `URL` | optional | 미지정 시 자동 생성 |
| `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
| `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
| `ogTitle` | `string` | optional | 미지정 시 `title` |
| `ogDescription` | `string` | optional | 미지정 시 `description` |
| `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
| `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
| `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
| `noIndex` | `boolean` | optional | 기본 `false` |

> 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.

### C-07. `BrandTokens` — 디자인 토큰 최종값

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
| `colors` | `ColorTokens` | ✅ | 색 토큰 |
| `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
| `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
| `radius` | `RadiusScale` | ✅ | |
| `shadow` | `ShadowScale` | ✅ | |
| `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
| `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |

> 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.

### C-08. `InstanceManifest` — 버전 고정 명세

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `instanceId` | `Slug` | ✅ | |
| `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
| `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
| `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
| `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
| `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
| `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
| `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
| `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
| `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
| `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
| `lastReleaseApprovedAt` | `Date` | optional | |

#### `RobotsOverride` (v0.11 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
| `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
| `allow` | `string[]` | optional | Allow 경로 목록 |
| `disallow` | `string[]` | optional | Disallow 경로 목록 |
| `note` | `string` | optional | 운영자 메모 |

#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
| `clsOverride` | `number` | optional | CLS budget 강화 override |
| `tbtMsOverride` | `number` | optional | |
| `bundleSizeKbOverride` | `number` | optional | |
| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |

#### `NotificationChannelsConfig` (v0.13 확장)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `email` | `{enabled: boolean, transport: "smtp" \| "ses" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | 이메일 활성화·트랜스포트·발신자·시간당 발송 한도. `secretRef`는 API 키 또는 SMTP 자격 (예: `secretRef://EMAIL_TRANSPORT_KEY`) |
| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |

> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).

#### `VersionSpec`
SemVer 형식 (`"1.4.2"`).

#### `IANATimezone` (v0.13 신규)

IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.

#### `AnalyticsConfig` (v0.14 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
| `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |

> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).

#### `SearchVisibilityConfig` (v0.16 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.

#### `KeywordMonitoringConfig` (v0.17 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).

#### `AssetIngestionConfig` (v0.18 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
| `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
| `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |

#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)

SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
| `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
| `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
| `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
| `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
| `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |

> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).

#### `CrmSyncConfig` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |

#### `CrmIntegrationEntry` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | string | ✅ | integration 식별자 (instance scope unique) |
| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
| `apiUrl` | URL | ✅ | provider endpoint |
| `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
| `legalApprovedBy` | string | ✅ | |
| `legalApprovedAt` | Date | ✅ | |
| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).

#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)

솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
| `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |

> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.

#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)

법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
| `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
| `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
| `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
| `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
| `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |

### C-09. `FeatureModuleConfig` — Feature Module 설정

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `moduleName` | `string` | ✅ | 모듈 식별자 |
| `enabled` | `boolean` | ✅ | |
| `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |

### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록

**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)

#### 어드민 DB 원본 (풀데이터)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `instanceId` | `Slug` | ✅ | |
| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
| `articleType` | `string` | optional | (Article인 경우) |
| `inlineRiskFlags` | `string[]` | optional | |
| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
| `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
| `peerReviewedAt` | `Date` | ✅ | |
| `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
| `physicianApprovedAt` | `Date` | optional | |
| `clientApprover` | `string` | optional | |
| `clientApprovedAt` | `Date` | optional | |
| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
| `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
| `priorReviewSubmissionId` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
| `attachments` | `Attachment[]` | optional | 증빙 파일 |
| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |

#### `MediaThresholdAssessment` (v0.14 +)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
| `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
| `windowEnd` | `Date` | ✅ | |
| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
| `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
| `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
| `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
| `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |

> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.

#### `WarningAcknowledgement` (v0.8 +)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
| `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
| `operatorId` | `string` | ✅ | operator 사용자 ID |
| `timestamp` | `Date` | ✅ | |
| `note` | `string` | optional | 메모 |

#### `StaleFlags`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
| `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
| `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
| `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
| `triggeredAt` | `Date` | optional | |

#### Git 사본 (경량 빌드 참조)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
| `articleType` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | |
| `publishedAt` | `Date` | ✅ | schema datePublished |
| `lastModifiedAt` | `Date` | ✅ | schema dateModified |

### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)

**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).

**참조 페이지 타입**: P-013
**참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
| `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
| `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
| `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
| `effectiveDate` | `Date` | ✅ | 시행일 |
| `lastRevisedDate` | `Date` | optional | 최종 개정일 |
| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
| `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
| `contactEmail` | `Email` | optional | 정책 문의 채널 |

**하위 타입**:

#### `LegalDocumentRevision`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | 개정일 |
| `summary` | `string` | ✅ | 개정 내용 요약 |
| `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |

**컴플라이언스 룰**:
- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
- 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.

### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)

**SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
| `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
| `branchDescription` | `string` | optional | 50~200자 |
| `address` | `Address` | ✅ | 지점 주소 |
| `geo` | `GeoCoordinates` | optional | |
| `telephone` | `Phone` | ✅ | 지점 직통 |
| `fax` | `Phone` | optional | |
| `email` | `Email` | optional | 지점 이메일 |
| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
| `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
| `images` | `URL[]` | optional | |
| `transportInfo` | `Markdown` | optional | |
| `parkingInfo` | `Markdown` | optional | |
| `openingDate` | `Date` | optional | 지점 개원일 |
| `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
| `branchCode` | `string` | optional | |
| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |

> v0.4 → v0.6 강조 채널 표기 변천:
> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조

> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.

### C-22. `ArticleCategory` — Article Pillar 분류

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `description` | `string` | optional | 80~200자 |
| `pillar` | `string` | optional | 상위 Pillar |
| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
| `coverImageUrl` | `URL` | optional | |
| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
| `displayOrder` | `number` | optional | |
| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |

---

## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

### C-11. `MedicalConditionPage`
필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.

### C-12. `FAQ`
필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.

### C-13. `ReviewPolicy`
필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**

### C-14. `MedicalSpecialty`
필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.

### C-15. `SchemaInput`
JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.

### C-17. `PricingPage`
필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**

### C-18. `FacilitiesPage`
필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.

### C-19. `NewsItem`
필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**

### C-20. `ReservationPage`
필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.

### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)

**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
| `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
| `displayName` | `string` | ✅ | 어드민 UI 표시명 |
| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
| `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date}>` | ✅ | 사용자가 접근 가능한 인스턴스 목록 (multi-tenant) |
| `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
| `lastLoginAt` | `Date` | optional | |
| `createdAt` | `Date` | ✅ | |

#### `NotificationPreferences` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
| `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |

#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
| `firstObservedAt` | `Date` | ✅ | |
| `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
| `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
| `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
| `unsuppressedAt` | `Date` | optional | |

---

## 6. 관계 다이어그램

```
ClinicProfile (C-01)
   ├─ trustMetrics → TrustMetric[] (CT-01)
   ├─ primaryCtas → CTAConfig[] (CT-03)
   ├─ medicalSpecialty → MedicalSpecialty (C-14)
   ├─ affiliatedInstitutes → ResearchInstitute
   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+

LocationProfile (C-21) — 위치·시간·연락 SoT
   ├─ businessHours → BusinessHours (CT-02)
   ├─ reservationChannels → CTAConfig[] (CT-03)
   ├─ parentClinic → ClinicProfile (C-01)
   ├─ representativeDoctors → DoctorProfile[]
   ├─ doctorsAtLocation → DoctorProfile[]
   └─ availableTreatments → TreatmentPage[]

DoctorProfile (C-02)
   ├─ primaryLocation → LocationProfile (C-21)
   ├─ additionalLocations → LocationProfile[]
   └─ trustMetrics → TrustMetric[] (CT-01)

TreatmentPage (C-03)
   ├─ cta → CTAConfig (CT-03)
   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
   ├─ relatedDoctors → DoctorProfile[]
   ├─ relatedConditions → MedicalConditionPage[]
   └─ pageRiskLevel → RiskLevel (직접 enum)

Article (C-04)
   ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
   ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
   ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
   ├─ category → ArticleCategory (C-22)
   ├─ contentSource / externalUrl (v0.4)
   ├─ embeddedMedia → EmbeddedMedia[]
   └─ pageRiskLevel → RiskLevel

ComplianceRecord (C-10)
   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
   └─ pageRiskLevel → RiskLevel
```

---

## 7. 변경 정책

(§ 2.6 표 참조 — MAJOR/MINOR/PATCH)

---

## 8. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
| DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
| DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
| DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
| DM-07 | cross-reference 빌드 검증 | |
| DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
| DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
| DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
| DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
| DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |

---

## 9. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 739ms:
# Compliance — 의료광고 준수 공통 가이드

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9 / `compliance/RISK_LEVELS.md` § 1.2
> **목적**: 의료법(제56조·제57조)·시행령·의료광고심의 운영규정에 대한 실무 해석, 금지 항목 카탈로그(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격·한의 회색지대 운영 가이드, 인용 가능 외부 도메인 화이트리스트의 단일 SoT.
> **외부 공유 시 주의**: 상위 문서와 동일. **법무 자문 보완 필수** — 본 문서는 운영 가이드이며 개별 사례의 최종 법적 판정은 법무 자문에 따른다.
> **연관 문서**:
> - 운영 SoT — RiskLevel 자동 추론·RiskRule 카탈로그·ApproverRole → `compliance/RISK_LEVELS.md`
> - 콘텐츠 표현 룰 → `core/CONTENT_STANDARDS.md` § 4
> - 데이터 계약 — ComplianceRecord·StaleFlags → `core/DATA_MODEL.md` C-10
> - 법무 의견서·심의 결과 첨부 → ComplianceRecord.attachments

---

## 0. 한 페이지 요약

- **본 문서가 단일 SoT**: (1) 의료법 조문 인용·해석 (제56조·제57조·시행령 제23조·제24조), (2) 의료법 금지 항목과 RiskRule.id의 **법령→룰 매핑** (표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4. 본 문서는 법령 조문과 룰 ID의 연결 매핑만), (3) 사전심의 대상·면제 사유 판정 가이드, (4) 환자 후기·전후사진·가격 운영 가이드, (5) 한의 회색지대 가이드, (6) 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)
- **법무 자문 보완 의무**: 본 문서는 사람이 읽고 판단하는 운영 가이드. 법적 정확성 책임은 ComplianceRecord(C-10) 법무 기록 — `legalCounsel` 필수는 다음 경우만: **(a) LegalDocument(C-16) 발행** (DATA_MODEL C-10 required), **(b) 룰별 `requiredApproverRoles[]`에 `legal`이 포함된 경우** (예: `review-case`·`event-price` ArticleType, 전후사진 노출 콘텐츠). High 등급 자체는 `medical` 기본 요구이며 `legal`은 룰 요구에 따라 추가
- **갱신 책임**: 분기 1회 + 의료법 개정 즉시
- **데이터 파일과의 관계**: 본 문서 = 사람 가독 SoT, `data/compliance-rules/rules.medical-ad.yaml` = 기계 처리 SoT. 양자는 RiskRule.id로 1:1 또는 1:N 매핑
- **현재 데이터 파일 상태** (2026-05-14 기준): `data/compliance-rules/` 디렉토리 및 YAML 파일은 **아직 미생성** (자체 룰 checker 구현 시 동시 생성). 따라서:
  - 본 문서 § 3의 RiskRule.id는 **권장 ID 형식** — `<category-keyword>-<sequence>` (kebab-case) 패턴. 파일 생성 시 본 문서가 ID 명세 SoT로 활성
  - 본 문서·`rules.medical-ad.yaml`은 RiskRule.id로 1:N 매핑 — 1개 법령 호에 여러 RiskRule 가능, 1개 RiskRule이 여러 법령 호 참조 가능 (§ 3 각 절의 RiskRule은 `legalBasis[]`로 복수 조문 인용)
  - `medical-law-tracking.yaml`이 미생성인 동안 `RISK_LEVELS.md` § 3.3의 "파일 부재 시 fail" 검증은 **자체 룰 checker 비활성 상태에서만 유보**. checker 활성화 즉시 본 문서 § 11.2 표를 YAML로 변환해야 함 (실제 구현 마일스톤에서 동시 생성 — `RISK_LEVELS.md` § 7.1.3 절차 활성화 시점)
  - 본 문서·`rules.medical-ad.yaml`·`medical-law-tracking.yaml` 3개는 **활성화 후에는 동시 갱신**

---

## 1. 일반 규약

### 1.1 갱신 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 의료법 조문 인용 정정 | PATCH | 본문 명문 정합성 |
| 새 금지 항목 추가 (개정 대응) | **MAJOR** | RiskRule cascade 필수 + `medical-law-tracking.yaml` revision 추가 |
| 사전심의 대상 판정 기준 변경 | **MAJOR** | 운영 영향 큼 — 기존 ComplianceRecord stale 처리 |
| 인용 가능 도메인 화이트리스트 추가 | MINOR | RiskRule.medical-ad cascade 권장 |
| 한의 회색지대 사례 추가·분류 | MINOR | preset cascade 권장 |
| 사례 풍부화 (실제 처분 사례) | PATCH | 운영 누적 |

### 1.2 SoT 원칙

| SoT 영역 | 문서·파일 |
|---|---|
| 표현 카테고리 원본 (효과 단정·보장·비교·유인 등의 카테고리·대체 표현) | **`core/CONTENT_STANDARDS.md` § 4** |
| 의료법 조문 인용·법령 해석·사람 가독 운영 가이드 | **본 문서** |
| 법령 조문 ↔ RiskRule.id 매핑 | **본 문서 § 3** |
| RiskRule 기계 처리 데이터 | `data/compliance-rules/rules.medical-ad.yaml` |
| 개정 추적 데이터 | `data/compliance-rules/medical-law-tracking.yaml` |
| 위험도 자동 추론·검수 운영 | `compliance/RISK_LEVELS.md` |

본 문서는 표현 카테고리 원본 SoT가 아님 — CONTENT_STANDARDS § 4 변경 시 본 문서 § 3 매핑만 cascade. 5개 SoT는 § 11 개정 이력과 동시 갱신.

### 1.3 본 문서가 다루지 않는 영역

- RiskRule 데이터 포맷·로드·머지 — `RISK_LEVELS.md` § 3
- 자동 추론 알고리즘 — `RISK_LEVELS.md` § 2
- 표현 룰 일반 카탈로그 (최상급·보장 표현 등) — `CONTENT_STANDARDS.md` § 4

---

## 2. 의료법 핵심 조문

> **법문 인용 원칙**: 본 문서의 조문 인용은 운영자가 빠르게 참조하는 사람 가독 SoT — 법적 정확성은 ComplianceRecord(C-10) `legalCounsel` 기록 + 국가법령정보센터 원문 조회로 보완. 인용 조문 개정 시 § 11 추적 갱신 + `rules.medical-ad.yaml` cascade.
>
> **확인 출처** (codex 자동 비평 1차 사이클에서 확인된 URL — § 11 추적 표 참조):
> - 의료법 제56조: https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681
> - 의료법 제57조: https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000721562
> - 의료법 시행령 제23조: https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1011395655
> - 의료법 시행령 제24조: https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000945403

### 2.1 의료법 제56조 — 의료광고의 금지 등

| 항 | 내용 요약 |
|---|---|
| **제1항** | 의료법인·의료기관·의료인이 아닌 자의 의료광고 금지 + 의료광고의 정의 |
| **제2항** | **의료광고 금지 유형 15호 각 호 열거** — 본 문서 § 3이 호별 매핑 |
| **제3항** | 방송법상 방송을 통한 의료광고 방법 자체 금지 — 매체별 추가 제한 |
| **제4항** | 광고 의뢰자·매체의 위반 책임 |

### 2.2 의료법 제56조제2항 — 금지 유형 15호 (운영 기준)

| 호 | 카테고리 | 본 문서 § |
|---|---|---|
| 1호 | 평가받지 아니한 신의료기술 광고 | § 3.1 |
| 2호 | 환자에 관한 치료경험담 광고 (제3자가 환자의 치료경험을 표현하는 것 포함) | § 3.2 / § 5 |
| 3호 | 거짓된 내용을 표시하는 광고 | § 3.3 |
| 4호 | 다른 의료기관·의료인을 비교하는 광고 | § 3.4 |
| 5호 | 다른 의료기관·의료인을 비방하는 광고 | § 3.5 |
| 6호 | 수술 장면 등 직접적 시술 행위를 노출하는 광고 (시행령 제23조제1항제6호와 결합) | § 3.6 / § 6 |
| 7호 | 의료인 등의 기능·진료방법과 관련하여 심각한 부작용 등 정보를 누락하는 광고 | § 3.7 |
| 8호 | **객관적인 사실을 과장하는 광고** | § 3.8 |
| 9호 | **법적 근거가 없는 자격·명칭을 표방하는 광고** | § 3.9 |
| 10호 | 신문·방송·잡지 등을 이용하여 기사 또는 전문가의 의견 형태로 표현되는 광고 (기사형 광고) | § 3.10 |
| 11호 | 제57조에 따른 심의를 받지 아니하거나 심의받은 내용과 다른 광고 | § 3.11 / § 4 |
| 12호 | 외국인환자 유치를 위한 국내광고 (의료법 제27조제3항 위반 광고) | § 3.12 |
| 13호 | **비급여 진료비용의 할인·면제 광고로서 소비자를 속이거나 잘못 알게 할 우려가 있는 방법** | § 3.13 / § 7 |
| 14호 | **각종 상장·감사장 등을 이용하는 광고 또는 인증·보증·추천 표현 광고** (원칙 금지, 가~라목 법정 예외는 **인증·보증 표시만** — 의료기관 인증(가목)·공공기관 인증·보증(나목)·다른 법령 인증·보증(다목)·WHO/ISQua 등 국제 인증(라목). 추천 표시는 예외 범위 아님) | § 3.14 |
| 15호 | 그 밖에 의료광고의 방법 등이 의료법 시행령으로 정하는 광고 (시행령 제23조 위임 조항) | § 3.15 |

> ⚠️ **호 번호·법문 보완 의무**: 위 15호의 정확한 법문은 분기 1회 + 개정 즉시 국가법령정보센터 원문으로 검증 (§ 11 추적 + `legalCounsel` 검수).

### 2.3 의료법 제57조 — 의료광고의 심의

| 항 | 내용 요약 |
|---|---|
| **제1항** | 사전심의 대상 매체 — 신문·잡지·옥외광고물·인터넷·SNS 등 (시행령 제24조 위임) |
| **제2항** | 심의 기관 — 자율심의기구 (대한의사협회·대한치과의사협회·대한한의사협회 등) |
| **제3항** | 사전심의 면제 사항 — 의료기관·의료인의 한정된 사실 안내 (시행령 제24조제7항 위임) |
| **제4항~** | 심의 결과 통지·이의신청·재심의 등 절차 |

### 2.4 의료법 시행령 제23조 — 의료광고 금지 기준 세부

| 항 | 위임 영역 | 본 문서 § |
|---|---|---|
| **제1항** | 제56조제2항 각 호 금지 광고의 **구체 기준** — 제1호~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별도 추적 | § 3 각 절 |
| **제2항** | 제56조제2항제14호 라목의 **국제 인증 구체 범위** — WHO/ISQua 등 시행령이 정하는 국제 인증 | § 3.14 |
| **제3항** | **의료인등이 자신이 운영하는 인터넷 홈페이지에 게재하는 광고에 대해 보건복지부장관이 세부 기준을 고시할 수 있음** | § 4.2 자사 홈페이지 판정 |
| 후속 항 등 | 개정에 따라 변동 | § 11 추적 |

> ⚠️ 시행령 제23조는 제56조제2항의 단순 위임이 아니라 **각 호의 구체 기준 명세**. 본 문서 § 3 각 절은 법 본문 호 + 시행령 호의 결합으로 운영.

### 2.5 의료법 시행령 제24조 — 의료광고 심의 대상 매체

| 항 | 내용 요약 |
|---|---|
| **제1항** | 사전심의 대상 매체 — 인터넷뉴스서비스, 방송사업자 홈페이지, 방송프로그램 중심 인터넷 매체, 전년도 말 기준 직전 3개월 일평균 이용자 10만명 이상 정보통신서비스 제공자 운영 매체 |
| **제2항** | 일평균 이용자 10만명 이상 SNS 광고매체 |
| **제3항~제6항** | 자율심의기구 조직 요건·신고·수리·변경신고 등 (자율심의 체계 운영 규정) |
| **제7항** | 제57조제3항 면제 사항의 추가 항목 — 개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증·전문의 자격·전문과목 등 |

---

## 3. 금지 표현 카탈로그 — 의료법 조문 → RiskRule.id 매핑

본 § 3은 의료법 제56조제2항 각 호와 `data/compliance-rules/rules.medical-ad.yaml`의 RiskRule을 매핑한다. **표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4가 SoT** — 본 § 3은 법령 조문과 룰 ID의 **연결 매핑 SoT**.

### 3.0 canonical RiskRule + legalBasis[] 패턴

동일 본문 표현이 여러 법령 호와 결합되는 경우, **canonical RiskRule 1개**만 정의하고 `legalBasis[]` 필드(또는 동등 메타)로 복수 조문을 인용한다. 동일 문구가 여러 RiskRule로 중복 매칭되어 finding이 부풀려지는 것을 회피.

예시:
- "100% 효과·반드시 효과" 표현
  - canonical RiskRule: `guarantee-composite-001` (CompositeRiskRule, severity=fail)
  - `legalBasis: ["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]`
- 본 § 3 각 절은 카테고리 의미상 다른 호에 동일 표현 축이 보이더라도 RiskRule 자체는 canonical 1개로 정의. 본 § 3의 호별 절은 **법령 인용 매핑 SoT**일 뿐 RiskRule 정의 SoT 아님 (RiskRule 정의 SoT는 `rules.medical-ad.yaml`)

> CONTENT_STANDARDS § 7.4 RiskRule 스키마에 `legalBasis: string[]` 필드 cascade 필요 — RISK_LEVELS § 3.3 JSON Schema 검증에 항목 추가.

> RiskRule ID는 권장 형식 예시이며, 실제 ID는 `rules.medical-ad.yaml` 파일 작성 시 확정 (MA-06 참조).

### 3.1 평가받지 아니한 신의료기술 광고 (제56조제2항제1호 + 시행령 제23조제1항제1호)

- **RiskRule (예시 ID)**: `new-medical-technology-unevaluated-001`
- **금지**: 평가받지 아니한 신의료기술 (보건복지부 신의료기술평가위원회 미평가)을 효과·안전성 측면에서 광고
- **구분**: 식약처 미승인 의료기기·약품 광고는 별도 규제(약사법·의료기기법) — 본 호에 직접 매핑하지 않음

### 3.2 환자 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조제2항제2호 + 시행령 제23조제1항제2호)

시행령 제23조제1항제2호는 본 호의 구체 기준으로 **3가지 유형**을 함께 다룬다:

- **RiskRule (예시 ID)**: `testimonial-001`, `short-clinical-experience-001`, `treatment-effect-assertion-001`
- **금지 1 (치료경험담)**: 환자 본인 또는 제3자가 환자의 치료경험을 표현하는 광고
- **금지 2 (단기 임상경력)**: **6개월 이하의 임상경력**을 광고하는 행위
- **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 표현**하는 광고 — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록
- **세부 운영**: § 5 참조

### 3.3 거짓된 내용을 표시하는 광고 (제56조제2항제3호)

- **RiskRule (예시 ID)**: `false-statement-001`, `false-credential-001`
- **금지**: 사실과 다른 효과·자격·실적 표시
- **검출**: 통계·자격·실적 주장 + 인용 부재 → content-gate (`CONTENT_STANDARDS § 3.5`)

### 3.4 비교 광고 (제56조제2항제4호 + 시행령 제23조제1항제4호)

- **RiskRule (예시 ID)**: `comparison-001`
- **금지**: "타 병원보다·다른 의원보다·기존 ○○보다 우수"
- **허용**: 본원의 진료 방식·실적의 사실 안내 (증빙 동반)
- **CONTENT_STANDARDS 매핑**: § 4.1 "비교 표현" 카테고리

### 3.5 비방 광고 (제56조제2항제5호)

- **RiskRule (예시 ID)**: `defamation-001`
- **금지**: 다른 의료기관·의료인을 비방·폄훼하는 표현
- **허용**: 본원의 진료 방식·차별점의 사실 안내 (타 기관 직접 언급 회피)

### 3.6 수술 장면·환부 노출 광고 (제56조제2항제6호 + 시행령 제23조제1항제6호)

- **RiskRule (예시 ID)**: `graphic-procedure-001`, `before-after-photo-001`
- **금지**: 수술 장면·환부 등 혐오감을 일으킬 수 있는 사진·영상
- **전후사진**: 본 호의 시행령 결합 영역 — 보수적 운영 정책은 § 6 별도 가이드
- **자동 검출**: inlineRiskFlag `includes-before-after` (`RISK_LEVELS.md` § 2.4)

### 3.7 부작용 등 정보 누락 광고 (제56조제2항제7호)

- **RiskRule (예시 ID)**: `side-effect-missing-001` (warning)
- **금지**: 의료인 기능·진료방법 광고에서 심각한 부작용 정보 누락
- **권장**: TreatmentPage·MedicalConditionPage 본문에 부작용·금기·주의사항 동반 (medical disclaimer)

### 3.8 사실 과장 광고 (제56조제2항제8호 + 시행령 제23조제1항제8호)

- **RiskRule (예시 ID)**: `exaggeration-001`, `effect-claim-001`, `guarantee-001`, `guarantee-composite-001`, `supremacy-001`
- **금지**: 객관적인 사실을 과장하는 광고 — "완치·100% 효과·반드시 효과·안전합니다·부작용 없음·효과 보장·결과 보장·최고의·국내 1위"
- **시행령 결합**: 시행령 제23조제1항제8호의 사실 과장 광고 구체 기준 (법 본문 호와 시행령 호 1:1 대응)
- **허용**: "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" (`CONTENT_STANDARDS § 4.2` 대체 표현)
- **CONTENT_STANDARDS 매핑**: § 4.1 효과 단정·전문성 단정·최상급·보장 표현·수치/기간 단정 카테고리 다수

### 3.9 법적 근거 없는 자격·명칭 광고 (제56조제2항제9호)

- **RiskRule (예시 ID)**: `false-credential-001`, `false-title-001`
- **금지**: 법적 근거가 없는 자격·명칭을 표방하는 광고 — "OOO 명의·OOO 박사 (학위 미보유)·전문의 자격이 없는데 전문 표방"
- **허용**: 의료법·전문의의 수련 및 자격 인정 등에 관한 규정 등에 따른 자격·명칭만

### 3.10 기사형 광고 (제56조제2항제10호)

- **RiskRule (예시 ID)**: `editorial-format-ad-001`
- **금지**: 신문·방송·잡지의 기사 또는 전문가 의견 형태로 표현된 광고
- **자체 운영**: P-010 Article은 의료기관 자체 발행 콘텐츠 — 기사형 광고 형식 모방 금지 (제3자 인용·기자 명시 등 회피)

### 3.11 미심의 광고 (제56조제2항제11호)

- **RiskRule (예시 ID)**: `unreviewed-ad-001`
- **금지**: 제57조 사전심의 대상이면서 심의 미경유 또는 심의받은 내용과 다른 광고
- **세부 운영**: § 4 참조 (사전심의 대상 판정 + 발행 차단 게이트)

### 3.12 외국인환자 유치 국내광고 (제56조제2항제12호 + 시행령 제23조제1항제12호)

본 호는 금지 유형 — 다음 **2단계 룰**로 분리 적용:

| 단계 | RiskRule (예시 ID) | severity | requiredApproverRoles | 적용 조건 |
|---|---|---|---|---|
| 확정 | `foreign-patient-recruit-domestic-confirmed-001` | **fail** | (fail이므로 미적용 — § 3.3.1) | 국내광고 해당성이 명백 (예: 한국어로 외국인환자 유치 안내, 한국 내 SNS·전단지) |
| 불명확 | `foreign-patient-recruit-domestic-uncertain-001` | **content-gate** | `["legal"]` | 자사 외국어 페이지·다국어 콘텐츠 등 국내광고 해당성이 매체·방식상 모호 — 법무 판단 후 발행 |

- **금지**: 외국인환자 유치를 위한 의료광고를 국내 매체에 게재 (의료법 제27조제3항)
- **운영**: 확정 케이스는 발행 차단(fail). 불명확 케이스만 법무 검수 — ComplianceRecord(C-10) `legalCounsel` 기록 + 판정 근거를 `attachments[]`로 첨부. `InternationalSupport`의 외국어 페이지 존재 자체가 회피 근거 아님

### 3.13 비급여 할인·면제 오인 광고 (제56조제2항제13호)

- **RiskRule (예시 ID)**: `non-covered-discount-misleading-001`, `non-covered-discount-pressure-001`
- **금지**: 비급여 진료비용의 할인·면제 광고로서 **소비자를 속이거나 잘못 알게 할 우려가 있는 방법** — 허위·불명확한 금액·대상·기간·범위 표시 (시행령 제23조제1항제13호 결합)
- **분류** (`CONTENT_STANDARDS § 4.1` 정합):
  - 압박형·유인성 표현(지금만·특가·한정·선착순·기간 한정) → **fail**
  - 허위·불명확한 할인 표현 → **fail**
  - 명확한 사실 고지("비급여 진료 ○○ 시술 20% 할인, 2026-06-01~06-30, 신규 내원 환자 대상") → **content-gate** (법무 검수 후 발행)
- **세부 운영**: § 7 참조 (P-102 Pricing·P-104 Event·P-010 articleType=event-price 페이지 정책)

### 3.14 상장·인증·보증·추천 광고 (제56조제2항제14호 + 시행령 제23조제1항제14호)

- **RiskRule (예시 ID)**: `award-endorsement-001`, `false-award-001`, `false-endorsement-001`
- **원칙 금지**: 각종 상장·감사장 등을 이용한 광고 또는 인증·보증·추천 표현 광고 자체가 원칙적으로 금지
- **법정 예외 (가~라목)** — 본 호 예외로 허용 (인증·보증 표시만 — 추천·자격 표시는 본 예외 범위 아님):
  - **가목**. 의료법 제58조에 따른 의료기관 인증
  - **나목**. 정부조직법에 따른 중앙행정기관·지방자치단체 등 공공기관으로부터 받은 **인증·보증** 표시
  - **다목**. 다른 법령에 따라 받은 **인증·보증** 표시 (자격 표시는 별도 — 제56조제2항제9호 적용)
  - **라목**. WHO/ISQua 등 시행령(제23조제2항)이 정하는 국제 인증
- 가~라목 인증을 광고에 사용할 때도 시행령 제23조제1항제14호의 구체 표현 기준 준수 필요
- **허용 표시 시 권장**: 검증 가능 출처(`Award.verificationUrl`) 동반 (`DATA_MODEL` C-01 Award)

### 3.15 시행령 위임 — 그 밖의 광고 (제56조제2항제15호)

- **현행 상태 (2026-05-14 기준)**: 시행령 제23조제1항이 제1호~제14호까지만 독립 금지 기준을 두므로 본 호에 직접 대응하는 **현행 독립 시행령 기준 없음**
- 본 § 3.15는 **개정 추적 자리표시** — 시행령 개정으로 신규 금지 기준 신설 시 본 절 cascade + RiskRule 추가
- 운영 RiskRule 미생성 상태 — 빌드 시 본 호 매핑 룰 없음 (정상)

---

## 4. 사전심의 대상 판정 (제57조 + 시행령 제24조)

### 4.1 방송 의료광고 — 매체 자체 금지 (제56조제3항)

| 매체 | 분류 |
|---|---|
| 방송법상 방송 (TV·라디오) | **매체 자체 금지** — 사전심의를 받더라도 의료광고 방법 자체가 금지. "심의 통과 시 가능"으로 오해 금지 |

### 4.2 사전심의 대상 매체 (제57조제1항 + 시행령 제24조)

| 매체 유형 | 출처 |
|---|---|
| 신문·인터넷신문·정기간행물 | 의료법 제57조제1항 |
| 옥외광고물 중 현수막·벽보·전단 | 의료법 제57조제1항 |
| 옥외광고물 중 교통시설·교통수단 표시 광고 | 의료법 제57조제1항 |
| 옥외광고물 중 전광판 광고 | 의료법 제57조제1항 (별도 호) |
| 인터넷뉴스서비스 | 시행령 제24조제1항 |
| 방송사업자가 운영하는 인터넷 홈페이지 | 시행령 제24조제1항 |
| 방송프로그램을 중심으로 운영되는 인터넷 매체 | 시행령 제24조제1항 |
| 전년도 말 기준 직전 3개월 일평균 이용자 10만명 이상 정보통신서비스 제공자 운영 매체 | 시행령 제24조제1항 |
| 일평균 이용자 10만명 이상 SNS 광고매체 | 시행령 제24조제2항 |
| **자사 웹사이트 — 의료광고 해당성·사전심의 대상 여부** | **법무 판정** — 매체 분류(시행령 제24조제1항·제2항) + 의료광고 정의(제56조제1항) 결합 판정. **운영 감사 추적**: 판정 결과를 ComplianceRecord(C-10)에 기록 — `priorReviewRequired: boolean` (산정 결과), `legalCounsel` + `legalCounselAt` (법무 판정 기록), `attachments[]` (판정 근거 의견서). 자사 사이트 일평균 이용자 측정 책임은 운영자 (MA-02) |

### 4.3 사전심의 절차

1. 콘텐츠 발행 전 — 본 문서 § 3 카테고리 매칭 + § 4.2 매체 판정
2. 사전심의 대상 판정 시 — ComplianceRecord(C-10) `priorReviewRequired=true`
3. 자율심의기구(대한의사협회·대한치과의사협회·대한한의사협회 등) 제출 — `priorReviewSubmissionId` 기록
4. 심의 통과 — `priorReviewPassed=true` + 심의 결과 첨부 (`attachments[]`)
5. 발행 — 어드민 워크플로가 차단 해제 (`RISK_LEVELS.md` § 4.2 발행 차단 조건 정합)

### 4.4 사전심의 면제 사항 (제57조제3항 + 시행령 제24조제7항)

법령이 정한 **제한된 항목**만 면제. 일반 학력·경력 전체는 면제 아님.

**의료법 제57조제3항 본문** (각 호):

| 면제 항목 |
|---|
| 의료기관 명칭 |
| 의료기관 소재지·전화번호 |
| 진료과목 (의료법 제43조에 따른 진료과목) |
| 의료인의 성명·성별·면허종류 |

**시행령 제24조제7항이 추가하는 항목**:

| 면제 항목 |
|---|
| 의료기관 개설자·개설연도 |
| 의료기관 홈페이지 주소 |
| 진료일·진료시간 |
| 전문병원으로 지정받은 사실 |
| 의료법 제58조에 따른 의료기관 인증 사실 |
| 전문의 자격 인정 사실 + 전문과목 |
| 그 밖에 시행령이 한정한 항목 |

> 위 면제 항목은 사전심의 면제일 뿐 — 본 문서 § 3 금지 표현(거짓·과장·비교 등)은 매체와 무관하게 항상 적용됨.

---

## 5. 환자 후기 (치료경험담) 운영 가이드

### 5.1 원칙

- **의료법 제56조제2항제2호 — 환자에 관한 치료경험담 광고 금지**
- 본문 직접 인용 원칙 금지 (`CONTENT_STANDARDS.md` § 4.3 정합)
- 매체·방식별 법무 판정 (광고 해당 여부 + § 4 사전심의 대상 여부)

### 5.2 P-101 Reviews 페이지 운영

P-101 페이지 운영 시 **차단 기준 우선** — 다음에 해당하면 법무 검수로도 치유되지 않고 발행 차단:
- 치료경험담 광고 형식의 직접 인용 — 본문에 환자 1인칭 사례·치료 효과 묘사를 그대로 노출 (CONTENT_STANDARDS § 4.3 "본문 직접 인용 원칙 금지" 정합)
- 치료 효과 오인 우려 — § 3.2 단정 표현(반드시·확실히·100%) 결합

위 차단 기준을 통과한 콘텐츠에만 적용되는 운영:
- 모든 후기 콘텐츠에 ReviewPolicy(C-13) 적용
- ArticleType=review-case → `["medical", "legal"]` 모두 검수 (`RISK_LEVELS.md` § 6.2)
- 환자 동의서·증빙 첨부 권장 (`ComplianceRecord.attachments`)

### 5.3 P-101 미운영 시

- DoctorProfile·TreatmentPage 본문에 환자 후기 인용 금지
- TrustMetric(누적 통계)은 후기 아님 — 사실 안내 + 기준 기간·범위 (CT-01)

---

## 6. 전후사진 운영 가이드

### 6.1 원칙

- **의료법 제56조제2항제6호 + 시행령 제23조제1항제6호** — 수술 장면·환부 등 혐오감을 일으킬 수 있는 사진·영상 광고 금지
- 전후사진은 본 호의 시행령 결합 영역 (수술 장면·환부 노출에 해당될 수 있음) + 사실 과장(제8호)·치료경험담(제2호) 결합 리스크
- 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed = false` (`CONTENT_STANDARDS.md` § 4.3 정합)

### 6.2 예외적 허용 조건

전후사진 노출은 다음 **2축의 적법성을 모두** 확보해야 발행 가능 — 한쪽만으로는 부족:

**축 1. 의료광고법 적법성** (필수):
- `beforeAfterPhotoAllowed = true` 설정
- 해당 콘텐츠의 ComplianceRecord(C-10) — `legalCounsel` + `legalCounselAt` + `attachments[]` (법무 의견서) 필수
- 시행령 제23조제1항제6호 (수술 장면·환부 등 혐오감 유발 사진·영상 광고 금지) 위반 부재
- 시행령 제23조제1항제2호 (치료효과 단정·치료경험담) 위반 부재

**축 2. 환자 개인정보·초상권** (필수):
- 환자 본인 동의서 첨부 (`attachments[]`)
- 개인정보 보호법·초상권 적법성

> ⚠️ 환자 동의서는 개인정보·초상권 측면의 필요조건일 뿐 의료광고법 적법성을 보장하지 않음. 동의서 보유 = 발행 가능 아님.

### 6.3 자동 검출

- inlineRiskFlag `includes-before-after` 검출 시 자동 High (`RISK_LEVELS.md` § 2.4)
- 어드민 검수 큐 강제 진입

---

## 7. 가격·할인·이벤트 노출 가이드

### 7.1 원칙

- **의료법 제56조제2항제13호** — 비급여 진료비용의 할인·면제 광고로서 소비자를 속이거나 잘못 알게 할 우려가 있는 방법 금지 (시행령 제23조제1항제13호 결합)
- 일괄 금지 아님 — 허위·불명확·압박형은 fail, 명확한 사실 고지는 법무 검수 후 발행 (§ 3.13 정합)
- 비급여 명시 의무 (의료법 시행규칙)

### 7.2 분류

| 표현 | 분류 | 처리 |
|---|---|---|
| "최저가·최고가·최대 할인" | **fail** | 발행 차단 |
| "지금만·특가·한정·선착순·오늘까지" (시간·수량 압박) | **fail** | 발행 차단 |
| "20% 할인 진행" (단순 사실 고지) | **content-gate** | 법무 검수 후 발행 |
| "비급여 진료 가격: ○○원" | Allowed | 비급여 명시 필수 |
| "이벤트" 단어 단독 (할인 결합 없음) | 컨텍스트별 | § 7.3 false-positive 완화 |

### 7.3 허용 페이지

- P-102 Pricing — 비급여 진료 가격 안내 (사실)
- P-104 News/Event `category=event` — 시간·수량 압박 없는 사실 안내
- P-010 Article `articleType=event-price` — 위 카테고리의 상세

본 페이지 외 본문에 가격·할인 어휘 등장 시 content-gate (`CONTENT_STANDARDS.md` § 4.3).

### 7.4 가격 변경 운영

- 가격 정보 변경 시 — ComplianceRecord(C-10) `staleFlags.legal=true` 자동 설정 (`RISK_LEVELS.md` § 4.2)
- 어드민 검수 큐 재진입

---

## 8. 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)

`CONTENT_STANDARDS.md` § 3.5 citation absence 검출에서 사용. 본 § 8이 화이트리스트의 SoT.

### 8.1 인정 단위·정책

- **기관 단위로 도메인 또는 path prefix 명시** — 와일드카드(`*.or.kr`·`*.go.kr`) 자동 인정 금지. 기관별 정확한 등록만 인정
- **매칭 정책 2종**:
  - **도메인 매칭 (host)** — 등록 도메인의 모든 하위 도메인·path 자동 인정 (예: `nejm.org` 등록 시 `nejm.org/*` 모두 인정)
  - **path prefix 매칭** — 더 좁은 범위 인정 필요 시 사용. URL 호스트 + path prefix가 등록값과 일치하는 경우만 인정 (예: `www.ncbi.nlm.nih.gov/pmc/` 등록 시 PMC path만 인정)
- 본 § 8.2~§ 8.4 표의 각 행은 **호스트 또는 호스트+path prefix**를 명시 — 슬래시 `/` 포함이면 path 매칭, 미포함이면 호스트 매칭
- **원문 vs 검색 서비스 구분** — Google Scholar 등 검색 결과 URL은 **원문 근거 아님**. 검색 결과에서 원문 도메인(예: pubmed·nejm·bmj)으로 deep link만 인정
- HTTPS 강제 — HTTP 링크는 warning
- 링크 만료(404·5xx) 검출 시 — `staleFlags.medical=true` 자동 설정 (`RISK_LEVELS.md` § 4.1)
- 화이트리스트 외 URL은 인용 불인정 — `CONTENT_STANDARDS § 3.5` content-gate

### 8.2 한국 학회·전문 단체

| 도메인 | 기관 | 콘텐츠 유형 |
|---|---|---|
| `kams.or.kr` | 대한의학회 | 학회 공지·논문 색인 |
| `akom.org` | 대한한의사협회 | 한의학회 공식 |
| `kda.or.kr` | 대한치과의사협회 | |
| `kpanet.or.kr` | 대한약사회 | |
| `koreamed.org` | KoreaMed | 한국 의학 논문 DB (원문 deep link 인정) |
| `synapse.koreamed.org` | KoreaMed Synapse | 한국 의학 논문 원문 |

### 8.3 정부·공공기관 (개별 도메인 등록)

| 도메인 | 기관 |
|---|---|
| `mohw.go.kr` | 보건복지부 |
| `mfds.go.kr` | 식품의약품안전처 |
| `hira.or.kr` | 건강보험심사평가원 |
| `kdca.go.kr` | 질병관리청 |
| `nhis.or.kr` | 국민건강보험공단 |
| `nih.go.kr` | 국립보건연구원 |
| `khidi.or.kr` | 한국보건산업진흥원 |
| `law.go.kr` | 국가법령정보센터 — 의료법·시행령·시행규칙·관련 법령 본문 인용 |

### 8.4 국제 학술·공공기관 — 원문 도메인만

| 도메인 | 종류 | 비고 |
|---|---|---|
| `pubmed.ncbi.nlm.nih.gov` | 검색 + 원문 메타 (도메인 매칭) | 초록·메타 인정. 원문 PDF deep link 권장 |
| `www.ncbi.nlm.nih.gov/pmc/` | PubMed Central 원문 (path 매칭) | PMC path만 인정 |
| `nejm.org` | NEJM 원문 (도메인 매칭) | |
| `thelancet.com` | The Lancet 원문 (도메인 매칭) | |
| `bmj.com` | BMJ 원문 (도메인 매칭) | |
| `jamanetwork.com` | JAMA Network 원문 (도메인 매칭) | |
| `who.int` | WHO 공식 발표·가이드라인 (도메인 매칭) | |
| `www.nih.gov/` | NIH 공식 (path 매칭, 호스트 + 슬래시 prefix) | `nih.gov` 전체 와일드카드 미인정. 산하 별도 도메인(예: pubmed.ncbi.nlm.nih.gov)은 개별 등록 |
| `www.cdc.gov/` | CDC 공식 (path 매칭, 호스트 + 슬래시 prefix) | |

### 8.5 인정하지 않는 카테고리

| 도메인·서비스 | 사유 |
|---|---|
| `scholar.google.com` | 검색 서비스 — 원문 도메인 아님. deep link로 변환 후 인정 |
| `sciencedirect.com` (검색 결과 페이지) | 결과 페이지 아닌 원문 DOI 페이지만 인정 검토 (MA-03) |
| 일반 블로그·뉴스 매체 | 검증 가능 학술 근거 아님 |
| 위키피디아·나무위키 등 위키 | 1차 출처 아님 |

### 8.6 화이트리스트 갱신

- 분기 1회 검토 + 신규 학회·기관 추가 시
- 학회·기관 도메인 폐쇄 시 즉시 제거 (`staleFlags.medical=true` cascade)
- 갱신 책임은 본 문서 작성자 (현재 Glitzy 운영) — § 11 추적 절차와 동시

---

## 9. 한의 특유 표현 회색지대 (CS-04 해소)

한의 진료의 특유 표현 — 의료광고법 위반 가능성과 한의 임상의 표현 자유 사이 회색지대.

### 9.1 회색지대 카테고리

| 표현 | 분류 | 처리 |
|---|---|---|
| "체질에 맞춘·체질별 처방" | content-gate | 한의 진료 정체성. 효과 단정 결합 시 fail |
| "1:1 맞춤·개인 맞춤" | content-gate | 효과 결합 시 fail |
| "기맥·경락·기혈" | Allowed (한의 전문 용어) | 단, 효과 단정 결합 시 fail |
| "사상의학·팔체질" | Allowed | 학술적 근거 인용 권장 |
| "면역력 강화·해독" | content-gate | 효과 단정 위험 — 법무 검수 |

### 9.2 preset 데이터 파일

- `data/compliance-rules/rules.preset-hanui-clinic.yaml` (`RISK_LEVELS.md` § 3.1 정합)
- 본 § 9 카테고리를 RiskRule로 변환 + override
- preset 추가·변경 시 본 § 9 cascade

---

## 10. 다국어 표현 가이드 (CS-06 부분 해소)

`CONTENT_STANDARDS.md` § 1.2 다국어 콘텐츠 활성화 시 표현 룰 적용 정책.

### 10.1 적용 원칙

- 의료법은 한국 영토 내 광고에 적용 — 외국어 콘텐츠도 한국 매체 노출 시 동일 적용
- 영문·중문·일문 사전 별도 — `data/compliance-rules/rules.medical-ad.en.yaml` 등
- 한국어 사전이 SoT — 다국어 사전은 한국어 룰의 의미 매핑

### 10.2 다국어 RiskRule 매핑

- 동일 카테고리 ID 사용 (예: `supremacy-001`)
- 패턴은 언어별 — `"best clinic"`·`"国内一位"` 등
- `version`은 한국어 사전과 동기화 (동일 카테고리 의미 변경 시 일괄 갱신)

### 10.3 사전 선택·결합

- 콘텐츠 `PageMeta.inLanguage` (DATA_MODEL C-06) + `InternationalSupport.internationalLanguagePages[]` (DATA_MODEL) 기반 사전 선택
- 단일 언어 콘텐츠 — 해당 언어 사전 1개 적용
- 다국어 혼합 콘텐츠 — 적용 가능한 모든 언어 사전의 **finding 합집합**으로 처리. 양쪽 모두 매칭되어야 위반인 AND가 아님

> 다국어 사전 실제 구축은 M3 다국어 단계 — 본 § 10은 정책 명세만.

---

## 11. 의료법 개정 이력 (사람 가독 SoT)

본 § 11은 `data/compliance-rules/medical-law-tracking.yaml`의 사람 가독 사본. 두 SoT는 항상 동시 갱신.

### 11.1 추적 항목

| 추적 항목 | 출처 | 갱신 주기 |
|---|---|---|
| 의료법 제56조 (의료광고 금지) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 제57조 (사전심의) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 시행령 제23조·24조 | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 시행규칙 광고 관련 조항 | 국가법령정보센터 | 분기 1회 |
| 의료광고심의위원회 운영규정 | 의료광고심의위원회 | 분기 1회 |

### 11.2 개정 이력 (실제 추적 — 운영 누적)

본 표는 `medical-law-tracking.yaml` (RISK_LEVELS § 7.1.2)와 **동일 모델·동시 갱신**. 모든 컬럼이 `yaml.revisions[]` 필드와 1:1 매핑.

| revisionId | lawSource | affectedArticles | revisionEffectiveDate | revisionType | sourceUrl | checkedAt | checkedBy | affectedRuleIds | staleScope | summary |
|---|---|---|---|---|---|---|---|---|---|---|
| `2026-Q2-medical-law-2026-04-07` | `의료법` | `["제56조 제2항", "제57조"]` | `2026-04-07` (법령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681 | `2026-05-14T00:00:00Z` (본 문서 v0.1 작성 시 본문 확인 일자) | `operator:seokcess@glitzy.kr` | `[]` (v0.1 시점 RiskRule 미작성) | `{ kind: "all" }` | v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4. 7.] 확인. RiskRule 카탈로그는 후속 |
| `2026-Q1-enforcement-decree-2026-02-10` | `의료법 시행령` | `["제23조", "제24조"]` | `2026-02-10` (시행령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1011395655 | `2026-05-14T00:00:00Z` | `operator:seokcess@glitzy.kr` | `[]` | `{ kind: "all" }` | v0.1 시점 시행령 제23조·제24조 본문 [시행 2026. 2. 10.] 확인 |

> ⚠️ `revisionEffectiveDate`는 **법령 본문 명시 시행일** (예: `[시행 2026. 4. 7.]`). 본 문서 확인 일자는 `checkedAt` 필드. 둘 분리 운영.

> 실제 개정 발생 시 본 표에 행 추가 + `medical-law-tracking.yaml`에 동시 추가 (`RISK_LEVELS.md` § 7.1.3 절차). 컬럼 위반·누락은 빌드 fail (`RISK_LEVELS.md` § 3.3 검증).

### 11.3 개정 시 절차 (RISK_LEVELS § 7.1.3 정합)

1. 본 문서 § 11.2 표에 revision 추가
2. `medical-law-tracking.yaml`에 revision 항목 추가
3. `rules.medical-ad.yaml` 룰 추가·갱신 (`version` MAJOR)
4. `meta.yaml`의 `medicalLawRevisionRef` 갱신
5. 영향 ComplianceRecord 일괄 `staleFlags.legal=true` 처리
6. 재검수 큐 처리 — 통과 시 stale 해제

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| MA-03 | 인용 가능 도메인 — 출판사 DOI 페이지·논문 식별 자동 검증 (sciencedirect 등) | M3+ 운영 누적 |
| MA-04 | 다국어 RiskRule 사전 실제 구축 | M3 다국어 단계 |
| MA-05 | 한의 회색지대 사례 — 면역력·해독 등 효능 표현 정밀 분류 | 운영 누적 후 |
| MA-06 | RiskRule.id 명세 확정 — 본 문서 § 3 예시 ID와 `rules.medical-ad.yaml` 실제 ID | 자체 룰 checker 구현 시 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~MA-02~~ | 자사 웹사이트 일평균 이용자 10만 기준 측정 책임 | v1.0 — **운영자(클라이언트 의료기관) 책임** 확정. Glitzy는 솔루션 제공자로 측정 데이터의 정확성·법령 준수 판단의 직접 책임 없음. 클라이언트는 analytics-reporting Feature Module의 측정 결과를 기준으로 자체 판단. 매체 분류 결과는 ComplianceRecord에 기록 |

### 12.2 의도적 범위 외 (포함하지 않음)

| 항목 | 사유 |
|---|---|
| 의료법 제56조제2항 15호 각 호의 **법문 전문 인용** | 본 문서는 카테고리·해석·운영 가이드 SoT. 법문 전문은 국가법령정보센터 원문(§ 11.2 sourceUrl) 직접 조회로 보완. 본 문서에 전문 인용 시 개정 추적 부담 + 갱신 지연 리스크 증가 |
| 개별 사례·처분 사례 카탈로그 | 운영 누적 후 별도 부록 — v1.0 범위 외 |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 의료법 제56조·제57조 해석, 금지 항목 카탈로그 11종(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격 운영 가이드, 인용 가능 외부 도메인 화이트리스트 3계열(학회·정부·국제 학술), 한의 특유 표현 회색지대, 다국어 표현 가이드, 의료법 개정 이력 추적 표 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 3.12 외국인환자 국내광고 — **2단계 룰**(확정 fail / 불명확 content-gate+legal)로 분리. 법무 승인이 금지 광고를 발행 가능하게 만드는 오해 회피, (2) **MA-02 해소** — 자사 사이트 일평균 이용자 측정 책임을 **운영자(클라이언트 의료기관)**로 확정. § 12.1 해소 표 신설, (3) § 0 RiskRule.id를 "예시 ID" → "권장 ID 형식" 명문화 + `<category-keyword>-<sequence>` kebab-case 패턴 명시. MA-06은 미결정 유지하되 v1.0 안정판 조건과 분리, (4) § 3.0 **canonical RiskRule + legalBasis[] 패턴** 신설 — 동일 본문 표현이 여러 법령 호와 결합 시 canonical RiskRule 1개 + 복수 조문 인용. **CONTENT_STANDARDS § 7.4 SimpleRiskRule·CompositeRiskRule에 `legalBasis: string[]` 필드 cascade** + **RISK_LEVELS § 3.3 JSON Schema 검증 2종 추가** (형식 위반·tracking 카탈로그 미존재) |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (13개 지적 전건 수용 — 의료법 조문 구조 전면 재작성)**: (1) § 2.2 의료법 제56조제2항 **15호 카탈로그**로 재구성 (이전 11종 오류 수정). 비방·수술장면 노출·기사형·미심의·외국인환자 유치 국내광고·비급여 할인면제 오인·인증 부정사용·상장 부정사용 추가, (2) § 2.1 제1항(비의료인 광고 금지·정의)과 제2항(금지 유형) 구조 분리 — 이전 "제1항 금지 항목" 표현 오류 정정, (3) § 3.1 평가받지 아니한 **신의료기술** 광고로 정정 (미승인 의료기기·약품은 약사법·의료기기법 별도), (4) § 3.4·§ 3.5·§ 3.6 등 호 번호 정정 (비교 4호·비방 5호·수술장면 6호·과대 8호·기사형 9호·미심의 10호 등), (5) § 3.6 수술 장면·환부 노출(시행령 결합)과 § 6 전후사진 보수적 운영 정책 구분, (6) § 4.1 제56조제3항 방송 광고 매체 자체 금지 명시 — TV·라디오 "심의 통과 시 가능" 오해 회피, (7) § 4.2 시행령 제24조제1항 4종 매체 + 제2항 SNS 매체 정확히 분류, (8) § 4.4 사전심의 면제 항목을 시행령 제24조제7항 한정 항목(성명·성별·면허종류·전문의 자격·전문과목·진료시간·진료과목)으로 좁힘. 일반 학력·경력 과잉 면제 정정, (9) § 1.2 SoT 분리표 — 표현 카테고리 원본은 `CONTENT_STANDARDS § 4`, 본 문서는 의료법 조문·매핑 SoT로 제한, (10) § 8 인용 가능 도메인 화이트리스트 정밀화 — 와일드카드 제거·기관 단위 등록·원문/검색 구분·KoreaMed 등 한국 학술 추가·인정 않는 카테고리 명시, (11) § 0 data/compliance-rules/ 미생성 명시 — v0.1 시점 파일 부재. ID는 예시, (12) § 10.3 다국어 — `PageMeta.inLanguage` + `InternationalSupport` 결합, 사전 결합 AND→**finding 합집합** 정정, (13) § 11.2 개정 이력 표를 `medical-law-tracking.yaml`과 동일 11개 컬럼(lawSource·affectedArticles·revisionType·checkedAt/By·affectedRuleIds·staleScope 등)으로 정합 + 시행령 별도 행 추가. MA-06 미결정 신설 |


 succeeded in 761ms:
docs/features\search-visibility.md
docs/features\notifications.md
docs/features\keyword-monitoring.md
docs/features\crm-sync.md
docs/features\content-migration.md
docs/features\compliance-assistant.md
docs/features\asset-ingestion.md
docs/features\analytics-reporting.md

codex
결정 문서 자체는 “single DB + 앱 레벨 scoping”을 선택하면서도 RLS를 보조 안전망으로 둔다고 표현합니다. 여기서 service_role 사용과 RLS 우회가 서로 충돌하는지, 그리고 feature 문서들이 요구하는 outbox/CAS/secret/audit 패턴이 Phase 0 일정에 과소 산정됐는지 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "instanceId|service_role|RLS|outbox|retry|CAS|compare-and-set|token bucket|rateLimit|secretRef|writeSetManifest|legalImpactClassifier|purge|legal hold|grace|DPA|legalApproved|audit|NotificationLog|DLQ" docs/features docs/core docs/admin docs/compliance' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "Vitest|Playwright|Storybook|biome|eslint|formatter|strict|Drizzle|migration|Doppler|environment|Sentry|Resend|Upstash|logging|Result|fixture|INV-" docs' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/features/crm-sync.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/features/notifications.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
 succeeded in 691ms:
docs\ARCHITECTURE.md:20:- 코어의 직각 차원으로 **Feature Modules**(notifications · asset-ingestion · crm-sync · analytics-reporting · keyword-monitoring · **search-visibility** · compliance-assistant · content-migration)를 둔다. Instance가 선택 장착한다.
docs\ARCHITECTURE.md:138:   keyword-monitoring · search-visibility · compliance-assistant · content-migration
docs\ARCHITECTURE.md:200:| 기존 콘텐츠 이관 | | | | ✅ content-migration | 도구 |
docs\ARCHITECTURE.md:408:| Feature | `features/*` (8종) | notifications, asset-ingestion, crm-sync, analytics-reporting, keyword-monitoring, **search-visibility**, compliance-assistant, content-migration |
docs\ARCHITECTURE.md:531:| **content-migration** | 기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관 | Core 콘텐츠 저장소 인터페이스 | 이관 분량·복잡도 |
docs\ARCHITECTURE.md:562:| content-migration | 검토 | 기존 콘텐츠 이관 규모 |
docs\admin\ARCHITECTURE.md:307:| asset-ingestion · content-migration 통합 | 신규 클라이언트 온보딩 자동화 |
docs\admin\REVIEW_WORKFLOW.md:10:> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
docs\admin\REVIEW_WORKFLOW.md:48:- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)
docs\admin\REVIEW_WORKFLOW.md:127:draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
docs\admin\REVIEW_WORKFLOW.md:140:| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
docs\admin\REVIEW_WORKFLOW.md:158:| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
docs\admin\REVIEW_WORKFLOW.md:170:ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
docs\admin\REVIEW_WORKFLOW.md:179:- compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
docs\admin\REVIEW_WORKFLOW.md:217:           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
docs\admin\REVIEW_WORKFLOW.md:290:| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
docs\admin\REVIEW_WORKFLOW.md:508:  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
docs\admin\REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs\admin\REVIEW_WORKFLOW.md:510:  | "content-migration-run-completed"
docs\admin\REVIEW_WORKFLOW.md:511:  | "content-migration-run-failed"
docs\admin\REVIEW_WORKFLOW.md:512:  | "content-migration-rollback-triggered"
docs\admin\REVIEW_WORKFLOW.md:513:  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
docs\admin\REVIEW_WORKFLOW.md:514:  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
docs\admin\REVIEW_WORKFLOW.md:558:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs\admin\REVIEW_WORKFLOW.md:559:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs\admin\REVIEW_WORKFLOW.md:560:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs\admin\REVIEW_WORKFLOW.md:561:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs\admin\REVIEW_WORKFLOW.md:562:| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs\admin\REVIEW_WORKFLOW.md:563:| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |
docs\admin\REVIEW_WORKFLOW.md:614:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
docs\admin\REVIEW_WORKFLOW.md:624:  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2
docs\admin\REVIEW_WORKFLOW.md:675:  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
docs\admin\REVIEW_WORKFLOW.md:691:  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
docs\admin\REVIEW_WORKFLOW.md:692:  | "content-migration-plan-defined"          // plan 정의
docs\admin\REVIEW_WORKFLOW.md:693:  | "content-migration-plan-validated"        // plan 검증
docs\admin\REVIEW_WORKFLOW.md:694:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
docs\admin\REVIEW_WORKFLOW.md:695:  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
docs\admin\REVIEW_WORKFLOW.md:696:  | "content-migration-run-started"           // apply 실행 시작
docs\admin\REVIEW_WORKFLOW.md:697:  | "content-migration-run-paused"            // CM3-01
docs\admin\REVIEW_WORKFLOW.md:698:  | "content-migration-run-resumed"           // CM3-01
docs\admin\REVIEW_WORKFLOW.md:699:  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
docs\admin\REVIEW_WORKFLOW.md:700:  | "content-migration-run-completed"
docs\admin\REVIEW_WORKFLOW.md:701:  | "content-migration-run-failed"
docs\admin\REVIEW_WORKFLOW.md:702:  | "content-migration-run-cancelled"
docs\admin\REVIEW_WORKFLOW.md:703:  | "content-migration-rollback-applied"
docs\admin\REVIEW_WORKFLOW.md:704:  | "content-migration-step-skipped"          // irreversible step skip
docs\admin\REVIEW_WORKFLOW.md:705:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs\admin\REVIEW_WORKFLOW.md:706:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs\decisions\INFRA_DECISIONS_DRAFT.md:32:2. 솔로 운영 비용 최소 — 1개 DB·backup·migration·monitoring
docs\decisions\INFRA_DECISIONS_DRAFT.md:38:- application-level instance scoping은 **Drizzle repository에서 강제** (모든 query 자동 `WHERE instance_id = ?` 주입)
docs\decisions\INFRA_DECISIONS_DRAFT.md:52:- migration script는 instance-agnostic 또는 instance-loop (per instance)
docs\decisions\INFRA_DECISIONS_DRAFT.md:68:| **Resend** (권장) | 100/day·3000/월 | 1k/일 20$ | 매우 좋음 | 자동 | TS SDK·Next.js 적합 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:73:**권장: Resend**
docs\decisions\INFRA_DECISIONS_DRAFT.md:82:| **Sentry** (권장) | 5k events/월 | 26$/월부터 | ✅ |
docs\decisions\INFRA_DECISIONS_DRAFT.md:87:**권장: Sentry**
docs\decisions\INFRA_DECISIONS_DRAFT.md:96:| **Upstash Redis** (권장) | 10k commands/day | 0.2$/100k | HTTP API·serverless·Vercel/Railway 모두 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:100:**권장: Upstash Redis**
docs\decisions\INFRA_DECISIONS_DRAFT.md:107:- Email: notifications Feature가 Resend SDK 사용·outbox dispatch가 email 채널일 때만 호출·sandbox env에서는 Resend test API 사용
docs\decisions\INFRA_DECISIONS_DRAFT.md:108:- Sentry: 모든 worker·web·webhook receiver에 SDK 통합·user context는 actorId·instanceId 포함
docs\decisions\INFRA_DECISIONS_DRAFT.md:120:| Day 1-2 | `apps/web` Next.js (App Router) shell·tsconfig·biome | 빈 admin layout + health check page |
docs\decisions\INFRA_DECISIONS_DRAFT.md:122:| Day 2-3 | Doppler workspace + 3 환경·Vercel·Railway·Supabase env propagation | Doppler config |
docs\decisions\INFRA_DECISIONS_DRAFT.md:123:| Day 3-4 | `packages/db` Drizzle 셋업·첫 migration (`health_check` table)·migration script | drizzle.config.ts + 1 migration |
docs\decisions\INFRA_DECISIONS_DRAFT.md:124:| Day 4-5 | GitHub Actions CI (typecheck·biome·test·build)·Vercel Preview deploy | green CI |
docs\decisions\INFRA_DECISIONS_DRAFT.md:134:| Day 8 | Sentry projects (web·worker·webhook 각각)·DSN env | Sentry 3 projects |
docs\decisions\INFRA_DECISIONS_DRAFT.md:135:| Day 8 | Resend account + DNS·DKIM 검증 | Resend domain verified |
docs\decisions\INFRA_DECISIONS_DRAFT.md:136:| Day 8 | Upstash Redis (dev·staging·prod) | 3 Redis instances |
docs\decisions\INFRA_DECISIONS_DRAFT.md:137:| Day 9-10 | next-auth (Auth.js) 기본 + Drizzle adapter·user/session/account/verificationToken table·magic link (Resend) | login page + magic link 동작 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:143:| Week 3 | DATA_MODEL Core schema (페이지·콘텐츠·ComplianceRecord 등) Drizzle 정의·migration | DB schema 30+ tables (Core) |
docs\decisions\INFRA_DECISIONS_DRAFT.md:145:| Week 4 | DESIGN_TOKENS Style Dictionary build·ui-tokens 패키지·디자인 system 기본 컴포넌트 (Button·Input·Card 등 10개) | `packages/ui-tokens` + Storybook (선택) |
docs\decisions\INFRA_DECISIONS_DRAFT.md:153:2. CI 통과 (typecheck·biome·test·build)
docs\decisions\INFRA_DECISIONS_DRAFT.md:156:5. DB migration 자동화 (Drizzle migrate on deploy)
docs\decisions\INFRA_DECISIONS_DRAFT.md:157:6. Sentry·Resend·Upstash 모두 연결·smoke test 통과
docs\decisions\INFRA_DECISIONS_DRAFT.md:178:| Week 33~48 (Phase 4) | crm-sync 위한 CRM provider 계약 (Salesforce·HubSpot)·DPA 강화·정식 출시 준비 | M3 (crm-sync + content-migration) |
docs\decisions\INFRA_DECISIONS_DRAFT.md:202:| 1. Multi-tenant | Single DB + instanceId + Drizzle repository scoping + RLS 보조 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:203:| 2-1. Email | Resend |
docs\decisions\INFRA_DECISIONS_DRAFT.md:204:| 2-2. Monitoring | Sentry |
docs\decisions\INFRA_DECISIONS_DRAFT.md:205:| 2-3. Redis | Upstash Redis |
docs\decisions\INFRA_DECISIONS_DRAFT.md:215:1. **Multi-tenant A 선택의 risk**: noisy neighbor·backup per instance·data isolation 감사 요구 — Phase 3+ schema-per-tenant 마이그레이션 path가 실제로 열려 있는가? Drizzle repository 자동 scoping이 빠뜨릴 위험은?
docs\decisions\INFRA_DECISIONS_DRAFT.md:216:2. **Provider 세부 결정**: Resend·Sentry·Upstash 각각의 lock-in·비용 임계·솔로 운영 적합성
docs\features\analytics-reporting.md:231:### 3.2 CollectionInput·Result + idempotency·force refresh
docs\features\analytics-reporting.md:273:type CollectionResult = {
docs\features\analytics-reporting.md:280:  perSource: Array<CollectionSourceAttemptResult>;  // 상태 SoT는 § 14.4 CollectionSourceAttempt 테이블
docs\features\analytics-reporting.md:287:type CollectionSourceAttemptResult = {
docs\features\analytics-reporting.md:302:  | "processing"            // attempt insert 후 provider 호출 전 (internal — Result에는 외부 노출 가능)
docs\features\analytics-reporting.md:314:### 3.3 ReportGenerationInput·Result
docs\features\analytics-reporting.md:331:type ReportGenerationResult = {
docs\features\analytics-reporting.md:348:  deliveryResult?: DeliveryResult;
docs\features\analytics-reporting.md:355:async function queryNormalizedMetrics(input: QueryInput): Promise<QueryResult>
docs\features\analytics-reporting.md:406:type QueryResult = {
docs\features\analytics-reporting.md:482:6. CollectionResult 산출
docs\core\CONTENT_STANDARDS.md:447:type ComplianceCheckResult = {
docs\core\CONTENT_STANDARDS.md:586:- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
docs\core\CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs\core\CONTENT_STANDARDS.md:644:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
docs\core\CONTENT_STANDARDS.md:647:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
docs\compliance\RISK_LEVELS.md:3:> **상태**: **v1.2 구현 명세 안정판** (compliance-assistant v1.0 cascade — § 2.3.1 RiskInferenceResult.steps 표준화)
docs\compliance\RISK_LEVELS.md:95:#### 2.3.1 RiskInferenceResult — steps[] 추적
docs\compliance\RISK_LEVELS.md:98:type RiskInferenceResult = {
docs\compliance\RISK_LEVELS.md:539:type InlineRiskExtractionResult = {
docs\compliance\RISK_LEVELS.md:713:| 2026-05-14 | **v1.2** | **compliance-assistant v1.0 cascade**: § 2.3.1 RiskInferenceResult.steps[] 표준화 — `{ source, sourceValue, level }[]`. triggeredBy 판정 근거를 SoT에 정식화 |
docs\core\DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
docs\core\DATA_MODEL.md:575:| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
docs\core\DATA_MODEL.md:598:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
docs\core\DATA_MODEL.md:599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
docs\core\DATA_MODEL.md:722:솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
docs\core\DATA_MODEL.md:726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
docs\core\DATA_MODEL.md:734:> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
docs\core\DATA_MODEL.md:775:| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
docs\core\DATA_MODEL.md:818:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
docs\core\DATA_MODEL.md:1095:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
docs\core\DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs\core\DATA_MODEL.md:1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
docs\features\asset-ingestion.md:16:- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
docs\features\asset-ingestion.md:33:| source type 제거 | **MAJOR** | 별개 | 기존 IngestionSource row migration |
docs\features\asset-ingestion.md:36:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs\features\asset-ingestion.md:61:- 기존 솔루션 내 콘텐츠 이전·대량 이관 계획·URL 리다이렉트 — content-migration (후속)
docs\features\asset-ingestion.md:116:### 3.2 IngestionSource·RunIngestionInput·Result·queryIngestedAssets
docs\features\asset-ingestion.md:172:const result: ComplianceCheckResult = await complianceAssistant.check({
docs\features\asset-ingestion.md:184:// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
docs\features\asset-ingestion.md:348:- `checkStartedAt`·`checkCompletedAt`·`commitStartedAt`·`commitCompletedAt`·`lastError`·`checkResultVersion`
docs\features\asset-ingestion.md:357:   c. 성공 → AssetPromotionRecord UPDATE status="pending-commit", checkCompletedAt, checkResultVersion
docs\features\asset-ingestion.md:365:   e. ComplianceRecord pre-publish row 생성 (recordPhase="pre-publish", recordVersion=1, contentRef=Core row @id, autoCheckResult=2단계 결과)
docs\features\asset-ingestion.md:494:## 13. 빌드·런타임·migration 검증 (3분리 — search-visibility 패턴)
docs\features\asset-ingestion.md:524:### 13.3 migration-time validation·migration 정책 (AI3-07 + AI5-04 backfill)
docs\features\asset-ingestion.md:527:- migration-time validation: `IngestedAsset.blobKeyVersion IS NULL` row 감지 시 자동 backfill 수행
docs\features\asset-ingestion.md:530:  - 양쪽 패턴 모두 미일치 → migration fail + sink alert (운영자 명시 정정 필요)
docs\features\asset-ingestion.md:533:**v0.2 → v0.3 blob key format migration**:
docs\features\asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
docs\features\asset-ingestion.md:539:  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제
docs\features\asset-ingestion.md:581:| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
docs\features\asset-ingestion.md:585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs\features\asset-ingestion.md:717:| `checkResultVersion` | string | optional | 2단계 check() 결과 식별자 |
docs\features\compliance-assistant.md:7:> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
docs\features\compliance-assistant.md:21:- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
docs\features\compliance-assistant.md:23:- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
docs\features\compliance-assistant.md:78:| `CONTENT_STANDARDS.md` § 7 | ComplianceCheckInput·Result 인터페이스 |
docs\features\compliance-assistant.md:101:      strictMode: false
docs\features\compliance-assistant.md:127:### 3.2 출력 — ComplianceCheckResult (CONTENT_STANDARDS § 7.2)
docs\features\compliance-assistant.md:130:type ComplianceCheckResult = {
docs\features\compliance-assistant.md:151:async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult>
docs\features\compliance-assistant.md:163:4. RiskInference 실행 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 → `RiskInferenceResult` (RISK_LEVELS § 2.3.1)
docs\features\compliance-assistant.md:184:type RiskInferenceResult = {
docs\features\compliance-assistant.md:221:   - **`triggeredBy` 판정**: RiskInferenceResult.steps[] 검사 — High 등급에 가장 먼저 도달한 source 기준. `explicitRiskLevel === "High"`가 그 source이면 `triggeredBy="explicit"`, 그 외(pageType·articleType·slot·inlineRiskFlags 중 하나)이면 `triggeredBy="inferred"`. explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)
docs\features\compliance-assistant.md:222:8. severity 집계 → ComplianceCheckResult 산출:
docs\features\compliance-assistant.md:252:| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
docs\features\compliance-assistant.md:334:type LlmAssistResult = {
docs\features\compliance-assistant.md:368:- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
docs\features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
docs\features\compliance-assistant.md:444:  strictMode                            // true 시 warning도 빌드 차단 — automatedDecision 산출에 영향
docs\features\compliance-assistant.md:506:- 모든 ComplianceCheckResult 호출에 timing 메트릭 기록
docs\features\compliance-assistant.md:542:      strictMode: false              # true 시 warning도 빌드 차단 (운영 정책)
docs\features\compliance-assistant.md:552:   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
docs\features\compliance-assistant.md:589:| CA-07 | strictMode 정책 — 인스턴스별 vs Glitzy 표준 | 운영 정책 |
docs\features\compliance-assistant.md:598:| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
docs\features\compliance-assistant.md:608:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
docs\features\compliance-assistant.md:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
docs\features\compliance-assistant.md:611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
docs\features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs\features\content-migration.md:1:# Feature — content-migration
docs\features\content-migration.md:7:> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
docs\features\content-migration.md:20:- **Feature 식별자**: `content-migration`
docs\features\content-migration.md:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
docs\features\content-migration.md:24:- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
docs\features\content-migration.md:37:| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
docs\features\content-migration.md:38:| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
docs\features\content-migration.md:39:| migration plan kind 제거 | **MAJOR** | 별개 | |
docs\features\content-migration.md:60:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs\features\content-migration.md:98:name: "content-migration"
docs\features\content-migration.md:138:  - name: "content-migration"
docs\features\content-migration.md:152:            - "content-migration-run-failed"
docs\features\content-migration.md:153:            - "content-migration-rollback-triggered"
docs\features\content-migration.md:154:            - "content-migration-plan-legal-approved"
docs\features\content-migration.md:221:| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
docs\features\content-migration.md:222:| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
docs\features\content-migration.md:223:| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
docs\features\content-migration.md:224:| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
docs\features\content-migration.md:225:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
docs\features\content-migration.md:226:| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
docs\features\content-migration.md:227:| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
docs\features\content-migration.md:228:| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
docs\features\content-migration.md:229:| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
docs\features\content-migration.md:230:| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
docs\features\content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
docs\features\content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
docs\features\content-migration.md:233:| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
docs\features\content-migration.md:236:| read | `queryStepResults` (closed schema masking) | | 동일 | — | — |
docs\features\content-migration.md:244:| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
docs\features\content-migration.md:245:| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
docs\features\content-migration.md:246:| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
docs\features\content-migration.md:247:| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
docs\features\content-migration.md:248:| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
docs\features\content-migration.md:249:| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
docs\features\content-migration.md:250:| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
docs\features\content-migration.md:251:| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
docs\features\content-migration.md:252:| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
docs\features\content-migration.md:253:| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
docs\features\content-migration.md:254:| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
docs\features\content-migration.md:255:| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
docs\features\content-migration.md:256:| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |
docs\features\content-migration.md:297:  inputs: Record<string, unknown>;                       // registry inputSchema strict
docs\features\content-migration.md:326:type RunApplyResult = {
docs\features\content-migration.md:342:  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
docs\features\content-migration.md:353:  stepResultId: string;
docs\features\content-migration.md:372:type PolicyReevaluateResult = {
docs\features\content-migration.md:407:| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
docs\features\content-migration.md:408:| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
docs\features\content-migration.md:438:  inputSchema: JsonSchema;                              // strict — additionalProperties=false
docs\features\content-migration.md:466:      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
docs\features\content-migration.md:477:각 step 실행 시 StepResult에 기록:
docs\features\content-migration.md:493:  invariantQueryResults: Array<{ name: string; passed: boolean }>;
docs\features\content-migration.md:500:- `chunked-returning`: actualAffectedRows ≠ expectedAffectedRows 또는 invariantQueryResults에 fail
docs\features\content-migration.md:509:### 3.8 read API privacy class (CM3-20 — StepResult schema)
docs\features\content-migration.md:512:type StepResultRow = {
docs\features\content-migration.md:516:  status: StepResultStatus;
docs\features\content-migration.md:546:   - step type registry 등록 + inputSchema strict
docs\features\content-migration.md:647:`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).
docs\features\content-migration.md:654:  SELECT id FROM content_migration_notification_outbox
docs\features\content-migration.md:659:UPDATE content_migration_notification_outbox o
docs\features\content-migration.md:664:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:669:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:676:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:682:UPDATE content_migration_notification_outbox
docs\features\content-migration.md:717:   - cachedResultRef 기록
docs\features\content-migration.md:719:4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04 + CM4-08·CM5-06):
docs\features\content-migration.md:734:9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
docs\features\content-migration.md:745:| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
docs\features\content-migration.md:746:| `content-migration-run-completed` | normal | inApp | super-admin |
docs\features\content-migration.md:747:| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
docs\features\content-migration.md:748:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
docs\features\content-migration.md:749:| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
docs\features\content-migration.md:750:| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |
docs\features\content-migration.md:758:| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
docs\features\content-migration.md:759:| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
docs\features\content-migration.md:760:| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
docs\features\content-migration.md:761:| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
docs\features\content-migration.md:762:| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
docs\features\content-migration.md:763:| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |
docs\features\content-migration.md:791:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
docs\features\content-migration.md:792:| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
docs\features\content-migration.md:793:| INV-LEGAL-UNKNOWN-CLASS | § 9.2 unknownClassesEncountered | legal-classifier |
docs\features\content-migration.md:794:| INV-LEGAL-OVERRIDE | § 9.2 forceProceedDespiteWarnings legal/critical 시도 | legal override |
docs\features\content-migration.md:795:| INV-LEGAL-APPROVAL-LINK | § 9.2 expectedLegalApprovalId 누락 (legalGateRequired) | legal-approval |
docs\features\content-migration.md:796:| INV-ROLLBACK-IRREVERSIBLE | § 9.2 irreversible encountered | rollback |
docs\features\content-migration.md:797:| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
docs\features\content-migration.md:798:| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
docs\features\content-migration.md:799:| INV-READONLY-CONTENT | § 9.2 content-mutating 차단 | read-only-window |
docs\features\content-migration.md:800:| INV-READONLY-DISPATCH | § 9.2 dispatchAllowlist 외 즉시 dispatch 차단 | read-only-window |
docs\features\content-migration.md:801:| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
docs\features\content-migration.md:802:| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
docs\features\content-migration.md:803:| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
docs\features\content-migration.md:804:| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
docs\features\content-migration.md:805:| INV-POLICY-REEVAL-RISK | § 9.2 priorReview·legalEntity·Critical → new-record-version 강제 | policy |
docs\features\content-migration.md:806:| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
docs\features\content-migration.md:807:| INV-COOP-CANCEL-FAIL | § 9.3 cooperativeCancellation 미지원 + non-per-chunk → validate fail | step-registry |
docs\features\content-migration.md:808:| INV-CANCEL-TIMEOUT | § 9.2 cancellation-timeout-manual-review 진입 | state-machine |
docs\features\content-migration.md:809:| INV-STEP-REGISTRY | § 9.3 inputSchema strict | step-registry |
docs\features\content-migration.md:810:| INV-PRIVACY-EXPORT | § 9.2 PII step exportAllowed=false | privacy |
docs\features\content-migration.md:811:| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
docs\features\content-migration.md:812:| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
docs\features\content-migration.md:813:| INV-RUN-ACTIVE-UNIQUE | § 9.2 partial unique (planId WHERE active) | concurrency |
docs\features\content-migration.md:814:| INV-CATALOG-VALIDATION | § 9.3 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate | classifier |
docs\features\content-migration.md:815:| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
docs\features\content-migration.md:816:| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
docs\features\content-migration.md:817:| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
docs\features\content-migration.md:818:| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
docs\features\content-migration.md:819:| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |
docs\features\content-migration.md:821:### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)
docs\features\content-migration.md:823:| INV ID | happy fixture | violation fixture |
docs\features\content-migration.md:825:| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
docs\features\content-migration.md:826:| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
docs\features\content-migration.md:827:| INV-LEGAL-UNKNOWN-CLASS | 등록 step + catalog 매칭 → classification 완료 | unknown step type → fail-closed (legalGateRequired=true) |
docs\features\content-migration.md:828:| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings + low risk warning → 진행 | forceProceedDespiteWarnings + legal-required warning → 거부 |
docs\features\content-migration.md:829:| INV-LEGAL-APPROVAL-LINK | legalGateRequired=true + 일치 LegalApproval → 200 | 일치 LegalApproval 없음 → fail |
docs\features\content-migration.md:830:| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
docs\features\content-migration.md:831:| INV-ROLLBACK-SKIP | super-admin + remediationTicketRef 제공 → skipped | remediationTicketRef 누락 → runtime fail |
docs\features\content-migration.md:832:| INV-PARTIAL-WRITE | actualAffectedRows = expected → 정상 | invariantQueryResults에 fail → rollback 우선 |
docs\features\content-migration.md:833:| INV-READONLY-CONTENT | window 종료 후 write → 정상 | window 중 content-mutating write → rejected |
docs\features\content-migration.md:834:| INV-READONLY-DISPATCH | allowlist 이벤트 즉시 dispatch → 정상 | 외 이벤트 즉시 dispatch → queued |
docs\features\content-migration.md:835:| INV-IDEMPOTENCY-REPLAY | 동일 fingerprint 재요청 → 기존 결과 (no-op) | mismatched fingerprint → 409 |
docs\features\content-migration.md:836:| INV-IDEMPOTENCY-COLLISION | 동일 → ok | 다른 input → 409 |
docs\features\content-migration.md:837:| INV-OUTBOX-SOURCE-EVENT | 신규 sourceEventId → row insert | 동일 sourceEventId → unique violation |
docs\features\content-migration.md:838:| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
docs\features\content-migration.md:839:| INV-POLICY-REEVAL-RISK | low + no legal/priorReview → stale-flags-only | priorReview true → new-record-version 강제 |
docs\features\content-migration.md:840:| INV-POLICY-REEVAL-OVERRIDE | low + no legal·priorReview 변화 + stale-flags-only override → 허용 | high risk + stale-flags-only override 시도 → 거부 |
docs\features\content-migration.md:841:| INV-COOP-CANCEL-FAIL | supportsCooperativeCancellation=true 또는 transactionBoundary=per-chunk → validate ok | supportsCooperativeCancellation=false + non-per-chunk → validate fail |
docs\features\content-migration.md:842:| INV-CANCEL-TIMEOUT | timeout 이전 cancel → cancelled | timeout 도달 → cancellation-timeout-manual-review |
docs\features\content-migration.md:843:| INV-STEP-REGISTRY | inputSchema strict 통과 → validate ok | additionalProperties=true → validate fail |
docs\features\content-migration.md:844:| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
docs\features\content-migration.md:845:| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
docs\features\content-migration.md:846:| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
docs\features\content-migration.md:847:| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
docs\features\content-migration.md:848:| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
docs\features\content-migration.md:849:| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
docs\features\content-migration.md:850:| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
docs\features\content-migration.md:851:| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
docs\features\content-migration.md:852:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
docs\features\content-migration.md:853:| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |
docs\features\content-migration.md:859:ContentMigrationPlan·DryRunReport·StepResult는 `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.
docs\features\content-migration.md:869:## 9. 빌드·런타임·migration·invariant 검증
docs\features\content-migration.md:892:- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
docs\features\content-migration.md:893:- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
docs\features\content-migration.md:894:- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
docs\features\content-migration.md:895:- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
docs\features\content-migration.md:896:- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
docs\features\content-migration.md:898:- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
docs\features\content-migration.md:901:- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
docs\features\content-migration.md:903:- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
docs\features\content-migration.md:904:- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
docs\features\content-migration.md:906:- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
docs\features\content-migration.md:907:- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
docs\features\content-migration.md:908:- skipStep 대상 stepResult.rollbackClass ≠ "irreversible" → runtime fail (CM6-03 — `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason)
docs\features\content-migration.md:909:- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
docs\features\content-migration.md:910:- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
docs\features\content-migration.md:911:- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
docs\features\content-migration.md:912:- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
docs\features\content-migration.md:913:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
docs\features\content-migration.md:914:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
docs\features\content-migration.md:917:### 9.3 migration-time validation
docs\features\content-migration.md:928:- step type registry 미등록 stepType → validate fail [INV-STEP-REGISTRY]
docs\features\content-migration.md:929:- step writeSetProjection·mutableFieldAllowlist가 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate 실패 → validate fail [INV-CATALOG-VALIDATION]
docs\features\content-migration.md:930:- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
docs\features\content-migration.md:932:- DDL precondition 검증 외 DDL 실행 시도 → validate fail [INV-DDL-BOUNDARY]
docs\features\content-migration.md:933:- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]
docs\features\content-migration.md:942:- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
docs\features\content-migration.md:948:  - StepResult: retentionDays.step
docs\features\content-migration.md:992:| ~~§ 6.3 fixture violation path~~ | ~~resolved (v0.5 28 INV happy + violation)~~ |
docs\features\content-migration.md:1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
docs\features\content-migration.md:1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
docs\features\content-migration.md:1008:| 2026-05-15 | v0.7 | **codex 6차 비평 3 지적 정정**: (1) NotificationEventType **4종→6종**·AuditAction **13종→15종** 상단 SoT 카운트 정정 + NotificationOutbox `eventType` enum 6종 정정 (CM6-01), (2) § 12 heading 번호 총괄 인벤토리와 정합 (12.10 PolicyReevaluateRecord·12.11 NotificationOutbox·12.12 ActiveTargetLock) (CM6-02), (3) § 9.2 skipStep fail rule에서 제거된 `rollbackClass` 입력 참조 삭제 — `skipStep 대상 stepResult.rollbackClass ≠ "irreversible"` 으로 정정 (CM6-03) |
docs\features\content-migration.md:1009:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs\features\content-migration.md:1099:### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)
docs\features\content-migration.md:1132:| `stepResultId` | UUID | ✅ — FK ON DELETE RESTRICT |
docs\features\content-migration.md:1142:**Constraints**: `UNIQUE(stepResultId) WHERE status IN ('pending','processing')`.
docs\features\content-migration.md:1150:  SELECT id FROM content_migration_step_retry_queue
docs\features\content-migration.md:1155:UPDATE content_migration_step_retry_queue q
docs\features\content-migration.md:1160:UPDATE content_migration_step_retry_queue
docs\features\content-migration.md:1166:UPDATE content_migration_step_retry_queue
docs\features\content-migration.md:1171:UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;
docs\features\content-migration.md:1174:UPDATE content_migration_step_retry_queue
docs\features\content-migration.md:1180:UPDATE content_migration_step_retry_queue
docs\features\content-migration.md:1232:batch row 1개당 per-ComplianceRecord N row. 별도 물리 table. PolicyReevaluateResult 기록:
docs\features\content-migration.md:1239:| `cachedResultRef` | UUID | optional |
docs\features\content-migration.md:1317:| 12.5 | `ContentMigrationStepResult` |
docs\features\crm-sync.md:45:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs\features\crm-sync.md:50:| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
docs\features\crm-sync.md:55:| DB table 추가 | MINOR | 별개 | migration + invariant 표 추가 |
docs\features\crm-sync.md:56:| DB table 제거·rename | **MAJOR** | policyVersion 신규 | migration |
docs\features\crm-sync.md:199:| 실행 | `runSync(input: RunSyncInput): RunSyncResult` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
docs\features\crm-sync.md:201:| 실행 | `pushOutbound(entity, recordId, operation): PushOutboundResult` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
docs\features\crm-sync.md:202:| 실행 | `resolveConflict(input: ResolveConflictInput): ResolveConflictResult` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
docs\features\crm-sync.md:203:| 실행 | `recoverRrnFalsePositive(input: RecoverRrnInput): RecoverRrnResult` | RRN 복구 | super-admin | 허용 | 허용 |
docs\features\crm-sync.md:204:| 실행 | `applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` | 환자 동의 철회 | super-admin | 허용 | 허용 |
docs\features\crm-sync.md:205:| 실행 | `resetCredentialRotation(input: ResetCredentialRotationInput): ResetCredentialRotationResult` (CS4-07) | reverted → stable 명시적 reset | super-admin | 허용 | 허용 |
docs\features\crm-sync.md:334:#### 3.3.1 `RunSyncInput`·`RunSyncResult`
docs\features\crm-sync.md:347:type RunSyncResult = {
docs\features\crm-sync.md:359:#### 3.3.2 `PushOutboundResult`
docs\features\crm-sync.md:362:type PushOutboundResult = {
docs\features\crm-sync.md:370:#### 3.3.3 `ResolveConflictInput`·Result
docs\features\crm-sync.md:381:type ResolveConflictResult = {
docs\features\crm-sync.md:388:#### 3.3.4 `RecoverRrnInput`·Result
docs\features\crm-sync.md:400:type RecoverRrnResult = {
docs\features\crm-sync.md:407:#### 3.3.5 `ApplyConsentWithdrawalInput`·Result (CS4-01·10 — discriminated)
docs\features\crm-sync.md:430:type ApplyConsentWithdrawalResult = {
docs\features\crm-sync.md:452:#### 3.3.6 `ResetCredentialRotationInput`·Result (CS4-07)
docs\features\crm-sync.md:463:type ResetCredentialRotationResult = {
docs\features\crm-sync.md:496:  verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
docs\features\crm-sync.md:499:type VerifierResult = {
docs\features\crm-sync.md:528:  verifierResult: VerifierResult;
docs\features\crm-sync.md:586:5. **consent withdrawal lookup** — piiHash·crmExternalIdHash 모두 검사 → 매칭 시 PushOutboundResult.status="blocked-consent-withdrawn"
docs\features\crm-sync.md:600:2. ProviderWebhookVerifier.verify → VerifierResult (signatureValid=false → HTTP 401)
docs\features\crm-sync.md:648:4. input.dryRun=true → 1·2c까지만 수행. ledger·CrmRecord 미변경. RecoverRrnResult.finalStatus는 예상값만 반환
docs\features\crm-sync.md:860:`applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` (§ 3.3.5):
docs\features\crm-sync.md:962:## 8. 운영 지표 + acceptance test (CS4-09 — invariant 별 fixture 재편)
docs\features\crm-sync.md:983:### 8.2 acceptance test (CS4-09 — invariant 별 fixture)
docs\features\crm-sync.md:985:invariant 별 fixture 구조 (개수보다 invariant coverage):
docs\features\crm-sync.md:987:#### INV-MANIFEST (build-time)
docs\features\crm-sync.md:990:#### INV-WEBHOOK-DEDUPE (transport-level)
docs\features\crm-sync.md:999:#### INV-CHANGE-IDENTITY (record-level)
docs\features\crm-sync.md:1003:#### INV-RRN
docs\features\crm-sync.md:1010:#### INV-OUTBOUND-ONLY
docs\features\crm-sync.md:1016:#### INV-RETRY
docs\features\crm-sync.md:1021:#### INV-CREDENTIAL-ROTATION (CS4-02 동시성)
docs\features\crm-sync.md:1031:#### INV-CAS
docs\features\crm-sync.md:1036:#### INV-PII (closed schema)
docs\features\crm-sync.md:1042:#### INV-OPERATIONAL-HINTS (CS4-05)
docs\features\crm-sync.md:1047:#### INV-CONSENT-WITHDRAWAL (CS4-01)
docs\features\crm-sync.md:1058:#### INV-UNREGISTER (CS4-06 precedence)
docs\features\crm-sync.md:1063:#### INV-PURGE
docs\features\crm-sync.md:1075:#### INV-MIGRATION (CS4-09)
docs\features\crm-sync.md:1079:#### INV-CASCADE
docs\features\crm-sync.md:1085:### 8.3 § 10 rule → § 8.2 fixture traceability 표 (CS5-06)
docs\features\crm-sync.md:1087:§ 10 build-time / runtime / migration / invariant rule 각각이 INV fixture group에 매핑됨을 보장:
docs\features\crm-sync.md:1089:| § 10 rule (build/runtime/invariant) | INV fixture group |
docs\features\crm-sync.md:1091:| § 10.1 legalApproved=false | INV-MANIFEST |
docs\features\crm-sync.md:1092:| § 10.1 korean-emr provider | INV-MANIFEST |
docs\features\crm-sync.md:1093:| § 10.1 appointment enabled | INV-MANIFEST |
docs\features\crm-sync.md:1094:| § 10.1 rawPiiStorageAllowed=true | INV-MANIFEST |
docs\features\crm-sync.md:1095:| § 10.1 ssnRrnHandling≠deny | INV-MANIFEST |
docs\features\crm-sync.md:1096:| § 10.1 dpaEvidenceRef 누락 | INV-MANIFEST |
docs\features\crm-sync.md:1097:| § 10.1 outbound-only + 부정합 conflictResolution | INV-MANIFEST + INV-OUTBOUND-ONLY |
docs\features\crm-sync.md:1098:| § 10.1 generic-rest-api 5필드 누락 (CS5-01) | INV-MANIFEST |
docs\features\crm-sync.md:1099:| § 10.1 versionTokenType ∉ enum (CS5-01) | INV-MANIFEST |
docs\features\crm-sync.md:1100:| § 10.1 providerVersionToken=null provider | INV-MANIFEST + INV-CHANGE-IDENTITY |
docs\features\crm-sync.md:1101:| § 10.1 liveReadEnabled=true | INV-MANIFEST |
docs\features\crm-sync.md:1102:| § 10.1 fieldMappingPolicyVersion 누락 | INV-MANIFEST |
docs\features\crm-sync.md:1103:| § 10.1 hashSecrets.* 5종 누락 | INV-MANIFEST |
docs\features\crm-sync.md:1104:| § 10.2 webhook signature 실패 | INV-WEBHOOK-DEDUPE |
docs\features\crm-sync.md:1105:| § 10.2 replay window 초과 | INV-WEBHOOK-DEDUPE |
docs\features\crm-sync.md:1106:| § 10.2 inbound RRN 검출 | INV-RRN |
docs\features\crm-sync.md:1107:| § 10.2 outbound RRN 검출 | INV-RRN |
docs\features\crm-sync.md:1108:| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
docs\features\crm-sync.md:1109:| § 10.2 outbound-only direct invocation | INV-OUTBOUND-ONLY |
docs\features\crm-sync.md:1110:| § 10.2 CAS WHERE 0 rows | INV-CAS |
docs\features\crm-sync.md:1111:| § 10.2 displayHints closed schema 위반 | INV-PII |
docs\features\crm-sync.md:1112:| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
docs\features\crm-sync.md:1113:| § 10.2 applyConsentWithdrawal same-request replay (CS5-02) | INV-CONSENT-WITHDRAWAL |
docs\features\crm-sync.md:1114:| § 10.2 applyConsentWithdrawal mismatched collision 409 (CS5-02) | INV-CONSENT-WITHDRAWAL |
docs\features\crm-sync.md:1115:| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1116:| § 10.2 rotateCredential row LOCK state≠stable | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1117:| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1118:| § 10.3 v0.6 migration | INV-MIGRATION |
docs\features\crm-sync.md:1119:| § 10.4 RetryQueue stale reclaim | INV-RETRY |
docs\features\crm-sync.md:1120:| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
docs\features\crm-sync.md:1121:| § 10.4 credential expiry 임박/만료 | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1122:| § 10.4 PII drift 감지 | INV-PII |
docs\features\crm-sync.md:1123:| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1124:| § 10.4 graceExpiry worker 3회 실패 | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1125:| § 10.4 NonceLedger RRN recoverable 24h 무처리 | INV-RRN |
docs\features\crm-sync.md:1126:| § 10.4 purge worker — 모든 retention 대상 | INV-PURGE |
docs\features\crm-sync.md:1127:| § 10.4 small-cell suppression 적용 (CS5-05) | INV-OPERATIONAL-HINTS |
docs\features\crm-sync.md:1137:## 10. 빌드·런타임·migration·invariant 검증
docs\features\crm-sync.md:1161:- **provider VerifierResult `providerVersionToken=null` 정의** (v1.0 build validator가 adapter 등록 시점에 검사 — CS4-04)
docs\features\crm-sync.md:1183:### 10.3 migration-time validation
docs\features\keyword-monitoring.md:59:| **migration-time validation 룰 추가·강화** | **MAJOR** | 별개 | KMF4-06 — § 11.3 신설 영역. 운영 데이터 무결성 영향 |
docs\features\keyword-monitoring.md:210:| `keyword-tracking-target-migrated-v02-v03` | `"instance:" + instanceId` | § 10.3 migration audit contract metadata 참조 (decompositions[]·conflictResolutions[]·actorRole="super-admin") |
docs\features\keyword-monitoring.md:233:### 3.3 MonitoringInput·Result
docs\features\keyword-monitoring.md:237:### 3.4 AnomalyDetectionResult.anomalies[] detectorOutput shape
docs\features\keyword-monitoring.md:491:## 10.3 migration·backfill 정책 (KM2-04)
docs\features\keyword-monitoring.md:493:본 Feature는 v0.1 초안과 v0.2/v0.3 정규화 사이 데이터 모델 변경이 있음 — v1.0 이전 운영 데이터가 있는 인스턴스는 다음 migration 적용:
docs\features\keyword-monitoring.md:502:  - 나머지 신규 row는 본 migration 시점 이후 snapshot만 누적
docs\features\keyword-monitoring.md:503:- **migration 운영**:
docs\features\keyword-monitoring.md:517:           activeAfter: boolean                          // migration 후 active 상태
docs\features\keyword-monitoring.md:529:신규 인스턴스(v0.3 이후 만들어진 인스턴스)는 본 migration 불필요.
docs\features\keyword-monitoring.md:533:## 11. 빌드·런타임·migration 검증 (KMF3-07 — 3분리)
docs\features\keyword-monitoring.md:561:### 11.3 migration-time validation (KMF3-07)
docs\features\keyword-monitoring.md:566:- migration 후 active KeywordTrackingTarget 수가 maxKeywordsPerInstance 초과 — **migration-time fail** (preflight dryRun에서 감지. 운영자 명시 정리 후 dryRun=false 재실행 필요)
docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
docs\core\SEARCH_STANDARDIZATION.md:272:| `User-agent: *  Disallow: /` (전체 차단) | **environment별 결정** | `environment=production`에서는 **Blocked** (의료기관 사이트 노출 필수). `environment=staging`·`preview`에서는 **Allowed** (또는 Basic Auth 권장 — `InstanceManifest.environment` 기반) |
docs\core\SEARCH_STANDARDIZATION.md:575:| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
docs\core\SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
docs\core\SEARCH_STANDARDIZATION.md:578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
docs\core\SCHEMA_MAPPING.md:25:- **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).
docs\core\SCHEMA_MAPPING.md:161:### 2.3 Schema 분류 — Rich Results 실효성 vs Entity 의미 전달
docs\core\SCHEMA_MAPPING.md:165:**A. Rich Results 직접 효과 (검색 결과 시각적 노출)**:
docs\core\SCHEMA_MAPPING.md:169:- `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
docs\core\SCHEMA_MAPPING.md:178:- `Physician` — 의료진 entity (Rich Results는 제한적)
docs\core\SCHEMA_MAPPING.md:179:- `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제한적)
docs\core\SCHEMA_MAPPING.md:183:> **운영 함의**: A 카테고리는 빌드 검증·콘텐츠 패턴 최적화 우선. B 카테고리는 검색 엔진 신뢰도·entity 그래프에 의미 전달. 의료 schema는 유효해도 Google Rich Results 혜택이 제한적이므로 **A 카테고리를 위주로 효율 추구, B 카테고리는 신뢰도 신호로 두는 전략**.
docs\core\SCHEMA_MAPPING.md:547:`ItemList` 사용 (권장 — Rich Results A 카테고리 대상):
docs\core\SCHEMA_MAPPING.md:620:**VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
docs\core\SCHEMA_MAPPING.md:637:**필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
docs\core\SCHEMA_MAPPING.md:908:| **운영 모니터링 (수동·정기)** | schema.org official validator, Google Rich Results Test, 자체 대시보드 | 경고·이슈 트래커 |
docs\core\SCHEMA_MAPPING.md:953:| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
docs\core\SCHEMA_MAPPING.md:963:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
docs\core\SCHEMA_MAPPING.md:964:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
docs\core\SCHEMA_MAPPING.md:966:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
docs\features\notifications.md:149:### 3.2 출력 — DeliveryResult·DeliveryStatus
docs\features\notifications.md:152:type DeliveryResult = {
docs\features\notifications.md:210:**DeliveryResult 소비 규칙** (REVIEW_WORKFLOW·운영 UI 정합):
docs\features\notifications.md:218:async function notify(event: NotificationEvent): Promise<DeliveryResult>
docs\features\notifications.md:227:  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
docs\features\notifications.md:228:  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
docs\features\notifications.md:230:  - `receiptState="completed"` → 완성 DeliveryResult 반환
docs\features\notifications.md:231:  - `receiptState="accepted"` 또는 `"processing"` → 짧은 poll(최대 500ms, 100ms 간격) 후 completed면 완성 결과, 미완성이면 `receiptState="processing"`로 부분 DeliveryResult 반환 (호출자가 후속 query 가능)
docs\features\notifications.md:250:     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
docs\features\notifications.md:251:     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음
docs\features\notifications.md:312:  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
docs\features\notifications.md:313:  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
docs\features\notifications.md:397:  - `perRecipient[].deliveries[]`의 broadcast-only placeholder는 **DB row 없는 합성 값** — DeliveryResult 합성 시점에 만들어지고 `broadcastAttemptId`로 broadcastDeliveries 매핑. DB에 placeholder DeliveryAttempt를 만들지 않음 → § 14.4 deliveryMode enum에서 `broadcast-placeholder` 제거
docs\features\notifications.md:399:- broadcast 결과는 `DeliveryResult.broadcastDeliveries[]`에 기록 (broadcastAttemptId = broadcast DeliveryAttempt.id)
docs\features\notifications.md:570:| `externalMonitoringSink` | permanent 실패, DB 장애, DLQ 누적 임계 초과, rate-limit 발생률 > 30%, fallback 채널도 hard-suppressed | Sentry·Datadog·PagerDuty |
docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs\features\notifications.md:780:> **broadcast 모드 PayloadRecord 생성 규칙** (N4-14): envelope+channel 단위 1건만 생성 (recipientId=NULL, recipientRole=NULL). broadcast-only 추가 recipient들에 대해 별도 PayloadRecord 생성하지 않음. perRecipient[] DeliveryResult의 broadcast-placeholder는 DB row 없는 합성값 (N4-16).
docs\features\notifications.md:794:| `deliveryMode` | enum | ✅ | perRecipient·broadcast (broadcast-placeholder는 DB row 아님 — N4-16: DeliveryResult 합성값) |
docs\features\notifications.md:812:> `broadcastAttemptId` 필드는 별도 보관하지 않음 (N4-15). broadcast DeliveryAttempt.id 자체가 식별자. DeliveryResult 합성 시 `broadcastDeliveries[].broadcastAttemptId = broadcast attempt.id`로 매핑.
docs\features\notifications.md:932:| `lastResendBy` | string | optional |
docs\features\notifications.md:933:| `lastResendAt` | Date | optional |
docs\features\search-visibility.md:230:### 3.2 MonitoringInput·Result
docs\features\search-visibility.md:234:MonitoringSourceAttemptResult.status enum:
docs\features\search-visibility.md:237:### 3.3 AnomalyDetectionResult.anomalies[] detectorOutput shape (SV2-11)
docs\features\search-visibility.md:463:DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.

 succeeded in 693ms:
# Feature — notifications

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 7개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 11 / `docs/admin/REVIEW_WORKFLOW.md` § 9
> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
> **외부 공유 시 주의**: 상위 문서와 동일. 수신자 식별 정보·이메일 주소·Slack webhook URL 노출 주의.
> **연관 문서**:
> - 이벤트 enum·페이로드·이벤트별 정책 매트릭스(fallback 채널 포함) SoT → `admin/REVIEW_WORKFLOW.md` § 9
> - audit log enum(`notification-dispatched`·`notification-resend-attempted`·`notification-read`) → `admin/REVIEW_WORKFLOW.md` § 10
> - 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT → `core/DATA_MODEL.md` C-08
> - AdminUser·자격·알림 선호·suppression(autoReleaseAt) SoT → `core/DATA_MODEL.md` C-23
> - 운영시간 SoT → `core/DATA_MODEL.md` C-21 LocationProfile + CT-02 BusinessHours

---

## 0. 한 페이지 요약

- **Feature 식별자**: `notifications`
- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
- **dedupe Redis SET NX EX**: 채널별 dedupe는 `SET key value NX EX <ttl>` 원자 연산. 선기록 성공 worker만 provider 호출. 실패 worker는 `deduped` (§ 4.3)
- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
- **Slack broadcast**: AdminUser.slackUserId 미보유 시 — broadcast 1건 (envelope 단위)·dedupeKey sentinel `"broadcast"`. per-recipient placeholder는 `skipped-broadcast-only` (집계 대상 아님)
- **인벤토리**: DB **11 tables** (Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt) + Redis 1 keyspace (DedupeCache)

---

## 1. 일반 규약

### 1.1 변경 정책

**두 축 분리**: 본 Feature는 (a) **패키지 SemVer**(코드 호환성)와 (b) **policyVersion**(매트릭스 의미)을 분리 관리.

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9 cascade |
| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
| `DeliveryStatus` enum 변경 | **MAJOR** | 별개 | |
| **§ 9.1.1 매트릭스 의미 변경** (수신자·채널·criticality 등) | MINOR (append-only 시) / MAJOR (기존 version 의미 변경) | **policyVersion 신규 부여** | 패키지는 신규 + 기존 version 병렬 보관 (§ 4.2). 인스턴스 manifest opt-in |
| § 14 데이터 구조 변경 | MINOR (append-only) / MAJOR (semantic) | 별개 | DB 마이그레이션 동반 |
| 채널 enum 추가 | MINOR | 별개 | C-08 `NotificationChannelsConfig` cascade |
| dedupe key 알고리즘 변경 | **MAJOR** | 별개 | |
| 재시도 분류표(§ 7.1) 변경 | MINOR | 별개 | |
| 운영 지표 항목 추가 | PATCH | 별개 | |

**매트릭스 정합 운영(병렬 보관 SoT)**: § 9.1.1 매트릭스가 변경되면 본 Feature 패키지에 **새 policyVersion을 추가하고 이전 버전도 병렬 보관**. 인스턴스는 InstanceManifest.config.`notificationPolicyVersion`이 명시한 버전을 사용. 롤백은 manifest의 version만 이전 값으로 변경 (§ 4.2). 운영 배포 순서: 매트릭스 SoT 갱신 → 패키지에 새 version 추가 + 이전 보관 → 인스턴스 manifest 갱신 (opt-in).

### 1.2 SoT 원칙

- 이벤트 enum·페이로드 타입·이벤트별 정책 매트릭스(fallback·criticality·quietHoursPolicy·optOutPolicy) SoT는 `admin/REVIEW_WORKFLOW.md` § 9
- 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT는 `core/DATA_MODEL.md` C-08
- AdminUser·자격·알림 선호·suppression SoT는 `core/DATA_MODEL.md` C-23
- audit log enum SoT는 `admin/REVIEW_WORKFLOW.md` § 10.2.1
- 운영시간 SoT는 `core/DATA_MODEL.md` C-21·CT-02
- 본 문서 = **발송 구현·운영 SoT** + **본 Feature 내부 데이터 구조 SoT** (§ 14)

### 1.3 본 문서가 다루지 않는 영역

- 알림을 발생시키는 워크플로 트리거 — `admin/REVIEW_WORKFLOW.md` § 2·§ 6
- 이벤트 enum·페이로드 필드·정책 매트릭스 — `admin/REVIEW_WORKFLOW.md` § 9
- 사용자 자격 인증 — `admin/REVIEW_WORKFLOW.md` § 11.2 + DATA_MODEL C-23 `eligibilityEvidence`
- 이메일 템플릿 시각 디자인 — `core/DESIGN_TOKENS.md` (NT-05)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "notifications"
specVersion: "1.0"               # 본 문서 명세 버전 (안정판)
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: true
```

> **세 버전 의미 차이** (N5-07): `specVersion`(본 문서 v0.x→1.0, 명세 자체) ≠ 패키지 SemVer(코드 호환성, InstanceManifest.features[].version) ≠ `notificationPolicyVersion`(§ 9.1.1 매트릭스 의미, § 1.1·§ 4.2).

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `admin/REVIEW_WORKFLOW.md` § 9 | NotificationEventType·NotificationEvent/Payload·정책 매트릭스(fallback 채널 포함) |
| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
| `admin/REVIEW_WORKFLOW.md` § 11 | AdminUserRole·ApproverRole·자격 검증 |
| `core/DATA_MODEL.md` C-08 | `notificationChannels`·`adminBaseUrl`·`timezone`·`holidayCalendar`·features[] |
| `core/DATA_MODEL.md` C-23 | AdminUser·NotificationPreferences·suppression(autoReleaseAt) |
| `core/DATA_MODEL.md` C-21·CT-02 | LocationProfile(`@id="main"` 관례) + BusinessHours·SpecialClosure·LunchBreak |

### 2.3 InstanceManifest 통합

```yaml
adminBaseUrl: "https://admin.client-01.glitzy.kr"
timezone: "Asia/Seoul"

holidayCalendar:                                       # § 8.4 — clientApproverBusinessHoursAware=true 시 required
  region: "KR"
  source: "package-embedded"

notificationChannels:
  email: { enabled: true, transport: "ses", secretRef: "secretRef://EMAIL_TRANSPORT_KEY", sender: "notice@clinic.example.com", replyTo: "ops@glitzy.kr", rateLimitPerHour: 100 }
  slack: { enabled: true, webhookUrlSecretRef: "secretRef://SLACK_WEBHOOK_URL", rateLimitPerHour: 60 }
  inApp: { enabled: true }

features:
  - name: "notifications"
    version: "0.4.0"
    enabled: true
    config:
      notificationPolicyVersion: "9.1.1-2026-05-14"  # § 4.2 병렬 보관 SoT
      digestSchedule: { daily: "09:00", weekly: "MON 09:00" }
      dedupeWindowSeconds: 60
      retryMaxAttempts: 3
      retryBackoffSeconds: [30, 300, 1800]
      ctaRouteTemplates:
        Article: "/admin/content/article/{contentRef}"
        TreatmentPage: "/admin/content/treatment/{contentRef}"
        LegalDocument: "/admin/legal/{contentRef}"
        default: "/admin/content/{contentType}/{contentRef}"
      clientApproverBusinessHoursAware: true
      businessHoursReference: "openingHours"
      logRetentionDaysAfterDlqExpiry: 90
      receiptRetentionDays: 365                        # § 4.3 — sourceEventId 재사용 차단 기간 (dedupeWindow ≪ receipt retention)
      suppression:
        softSuppressionThreshold: 3
        softSuppressionAutoReleaseDays: 14            # C-23 autoReleaseAt 계산 (§ 7.4 worker)
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 입력 — NotificationEvent

REVIEW_WORKFLOW § 9.2 SoT. 핵심:

- `sourceEventId` — idempotency key (필수)
- `recipients[]` — 비어 있으면 fail
- `criticality` 미지정 시 본 Feature가 § 9.1.1에서 자동 산정
- `metadata.locationRef` — multi-location 인스턴스 권장 (§ 8.4)
- recipient의 AdminUser `instanceMemberships[]`에 본 인스턴스 미포함 시 → `skipped-missing-user` (§ 4.1 4.a — instance membership 검증)

### 3.2 출력 — DeliveryResult·DeliveryStatus

```ts
type DeliveryResult = {
  eventId: string;
  sourceEventId: string;
  eventType: NotificationEventType;
  contentRef: string;
  receiptState: ReceiptState;
  acceptedAt: ISODateString;
  perRecipient: Array<{
    recipientId: string;
    deliveries: Array<{
      payloadId: string;
      channel: "email" | "slack" | "inApp";
      deliveryMode: "perRecipient" | "broadcast-placeholder";
      broadcastAttemptId?: string;     // broadcast-placeholder인 경우 실제 broadcast attempt id 참조
      status: DeliveryStatus;
      attempts: number;
      lastAttemptAt: ISODateString;
      provider?: string;
      providerResponseCode?: string;
      error?: string;
    }>;
  }>;
  broadcastDeliveries?: Array<{
    broadcastAttemptId: string;        // envelope+channel 단위 1건
    channel: "slack";
    status: DeliveryStatus;
    attempts: number;
    lastAttemptAt: ISODateString;
    provider?: string;
    providerResponseCode?: string;
    error?: string;
  }>;
};

type ReceiptState = "accepted" | "processing" | "completed" | "failed";

type DeliveryStatus =
  | "delivered"
  | "deferred-digest"
  | "deferred-quiet-hours"
  | "deferred-business-hours"
  | "deferred-rate-limit"
  | "failed-permanent"
  | "failed-retrying"
  | "deduped"
  | "skipped-missing-user"           // AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함
  | "skipped-disabled-channel"
  | "skipped-opt-out"
  | "skipped-suppressed"
  | "skipped-missing-location"       // metadata.locationRef가 InstanceManifest에 없는 ID — § 8.4 invalid locationRef
  | "skipped-broadcast-only";        // per-recipient placeholder — 집계 대상 아님

// 내부 attempt-level 상태 — DeliveryAttempt.status에만 사용 (외부 DeliveryStatus와 분리, N5-03)
type DeliveryAttemptStatus =
  | "processing"                      // attemptNumber 선점 후 provider 호출 전 (§ 4.4)
  | DeliveryStatus;
```

**DeliveryResult 소비 규칙** (REVIEW_WORKFLOW·운영 UI 정합):
- 성공/실패 집계는 `broadcastDeliveries[]`(broadcast 모드) + `perRecipient[].deliveries[]`(`skipped-broadcast-only` 제외)를 합산
- `skipped-broadcast-only`는 per-recipient 추적 placeholder만 — `broadcastAttemptId`로 실제 broadcast 결과 참조 가능
- `deferred-rate-limit`·`deferred-*`·`skipped-*`·`deduped`는 발송 성공율 분모 제외 (§ 9.1)

### 3.3 단일 엔트리포인트 — `notify()`

```ts
async function notify(event: NotificationEvent): Promise<DeliveryResult>
```

**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
- 1단계 단일 DB 트랜잭션 (immediate FK — Receipt.notificationLogId는 같은 트랜잭션에서 먼저 insert된 Log를 참조하므로 deferred FK 불필요):
  1. NotificationLog insert (UUID 생성)
  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
  3. Receipt insert 성공 시 트랜잭션 commit → receiptState="accepted"
- **abort 원인 분기** (N4-01):
  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
- **duplicate caller 결과 계약** (N4-02): 기존 receipt의 receiptState별 응답:
  - `receiptState="completed"` → 완성 DeliveryResult 반환
  - `receiptState="accepted"` 또는 `"processing"` → 짧은 poll(최대 500ms, 100ms 간격) 후 completed면 완성 결과, 미완성이면 `receiptState="processing"`로 부분 DeliveryResult 반환 (호출자가 후속 query 가능)
  - `receiptState="failed"` → 마지막 실패 결과 반환
- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제

**resendDeadLetter** — § 7.2 별도 command (notify() 경로 우회)

**ctaUrl 자동 합성**: `adminBaseUrl + ctaRouteTemplates[contentType].replace("{contentRef}", contentRef)` (default 사용)

---

## 4. 발송 파이프라인

### 4.1 실행 순서 (critical-aware filter ordering)

```
1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
   - NotificationLog insert (UUID 생성)
   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
   - **abort 원인 분기** (N5-02·§ 3.3 정합):
     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음

2. fan-out + NotificationPayloadRecord 영속:
   - recipients[] 각각 payloadId(UUID) 부여
   - ctaUrl 자동 합성
   - criticality 미지정 시 § 9.1.1 매트릭스 산정
   - NotificationPayloadRecord 저장 (payloadId·eventId·recipientId·contentRef·ctaUrl·metadata·criticality — channel별 추적은 DeliveryAttempt가 담당, PayloadRecord는 recipient-envelope unit)
   - receiptState="processing"

3. 즉시 채널 라우팅 — § 9.1.1 매트릭스:
   - immediateChannels(매트릭스) ∩ InstanceManifest.notificationChannels.<channel>.enabled=true
   - digest 채널은 § 6 별도 경로

4. critical-aware 필터 (순서 중요):
   a. **항상 적용** (critical 우회 불가):
      - AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함 → `skipped-missing-user`
      - 인스턴스 채널 비활성 → `skipped-disabled-channel`
      - dedupe 매칭 (§ 4.3 Redis SET NX EX) → `deduped`
   b. **사용자 opt-out 필터** (mandatory 우회):
      - matrix.optOutPolicy="mandatory" → opt-out 무시 + 사용자 채널 off 무시 (단 인스턴스 채널 활성 channel만)
      - 그 외 + AdminUser.notificationPreferences.channels.<channel>=false → `skipped-opt-out`
      - digest 채널 + AdminUser.digestOptOut=true (digestOptOut-allowed 정책) → `skipped-opt-out`
   c. **suppression 필터**:
      - C-23 suppression.<channel>.state ∈ {soft-suppressed, hard-suppressed} → 원 채널에 `skipped-suppressed` DeliveryAttempt 기록
      - 단 hard-suppressed인 채널 + 매트릭스 `fallback 채널` 컬럼이 정의되어 있으면 → **fallback 채널은 해당 eventType의 immediateChannels 집합 안에 있어야 함**(N4-07) 검증 후 라우팅 시도
      - **fallback 채널도 hard-suppressed인 경우** (N4-08): fallback 채널에도 별도 `skipped-suppressed` DeliveryAttempt 기록 + DeliveryAttempt.metadata에 `fallbackExhausted=true` 마킹 + 외부 monitoring sink alert. 호출자/운영 UI는 두 attempt를 보고 "원 채널·fallback 모두 막힘"을 추적 가능
   d. **criticality=critical은 e~f만 우회**:
      - **(e) quietHours** → `deferred-quiet-hours` (critical 우회 → 즉시 발송)
      - **(f) businessHours 평가** (§ 8.4 client-approver):
        - **(f-pre) invalid locationRef** (N5-04): `metadata.locationRef`가 InstanceManifest LocationProfile에 없는 ID → `skipped-missing-location` + 외부 monitoring sink alert. main fallback으로 보정하지 않음. critical 이벤트도 본 분기는 우회하지 않음 (runtime 입력 오류 감지)
        - (f-main) businessHours 외 → `deferred-business-hours` (critical 우회)
   e. high/normal은 e·f 모두 적용

5. 채널 어댑터 호출 (§ 5):
   - rate limit 평가 → 초과 시 `deferred-rate-limit`
   - 정상 → provider 호출
   - DeliveryAttempt 생성·갱신 (§ 14.4 — 동시성 안전 § 4.4)

6. 결과별 처리:
   - delivered → NotificationLog summary 갱신
   - failed-retrying → 재시도 큐
   - failed-permanent → DLQ 저장 (§ 7.2) + suppression 갱신(§ 7.1) + 외부 sink alert
   - deferred-digest → NotificationDigestBucket (§ 14.6·14.7)
   - deferred-quiet-hours → NotificationQuietHoursQueue (§ 14.8)
   - deferred-business-hours → NotificationBusinessHoursQueue (§ 14.9)
   - deferred-rate-limit → 채널별 rate limit 큐

7. receiptState="completed" + audit log `notification-dispatched` (envelope 1건)
```

### 4.2 매트릭스 병렬 보관 — notificationPolicyVersion

- 본 Feature 패키지는 매트릭스(§ 9.1.1)를 **policyVersion별 병렬 보관**
- 패키지 빌드 시 매트릭스 SoT의 hash + version 메타 포함
- 인스턴스 manifest의 `notificationPolicyVersion`이 명시한 버전을 런타임에 라우팅
- 빌드 검증(§ 11): manifest version이 본 Feature 패키지에 등록된 version 중 하나여야 함 (불일치 fail)
- 매트릭스 변경 운영:
  - REVIEW_WORKFLOW § 9.1.1 갱신 → 본 Feature 패키지에 새 policyVersion 추가 (이전 버전도 보관) → 인스턴스 manifest의 `notificationPolicyVersion` 갱신 (opt-in)
  - 롤백: manifest version을 이전 값으로 변경 (패키지 변경 없음)
- **보관 정책** (N4-10):
  - **최소 지원 기간**: 1 policyVersion당 12개월 (사용 인스턴스 0건 이후에도)
  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
  - 패키지 SemVer와 분리: policyVersion append는 패키지 MINOR. policyVersion semantic 변경(같은 version의 의미 변경)은 금지 — 항상 새 version 부여

### 4.3 dedupe 알고리즘 (Redis SET NX EX 원자)

```
dedupeKey:
  notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}
  broadcast 모드: recipientId 위치에 sentinel "broadcast" 사용
    notif:dedupe:{instanceId}:{sourceEventId}:broadcast:{channel}

저장소: Redis (§ 14.10)

원자 연산: SET key value NX EX <ttl>
  - 성공(키 생성) → worker가 provider 호출 진행
  - 실패(키 존재) → DeliveryAttempt status=deduped 기록, provider 호출 생략

값 구조: { state, payloadId, attemptedAt }
state 머신:
  - 발송 시도 직전: SET NX EX "failed-retrying" (dedupeWindowSeconds + 300)
  - delivered → SET XX EX "delivered" (dedupeWindowSeconds)
  - failed-permanent → SET XX EX "failed-permanent" (dedupeWindowSeconds) — 재시도 자동 차단

수동 resendDeadLetter:
  - dedupe key 검사 우회 + dedupe key 갱신하지 않음
  - 별도 attempt(dedupeMode="resend") 생성. 기존 dedupe TTL 자연 만료

sourceEventId 재사용:
  - dedupeWindowSeconds(기본 60초) << receiptRetentionDays(기본 365일)
  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
  - receipt 보존 기간 만료 후 재사용은 새 이벤트로 처리됨 — 운영 정책상 sourceEventId 재사용 금지 권장
```

### 4.4 rate limiting·DeliveryAttempt 동시성

**rate limiting**:
- 채널별 시간당 한도: C-08 `rateLimitPerHour`
- 초과 → `deferred-rate-limit` + 채널별 rate limit 큐. 다음 윈도우 재시도
- 메트릭 제외: § 9.1 성공율·실패율 계산 분모에서 제외

**DeliveryAttempt attemptNumber 동시성** (multi-worker race 방지 — N4-04·05·06):
- attemptNumber는 `(payloadId, channel)` 범위 sequence (PayloadRecord에 channel 필드 없음 — lock 대상은 PayloadRecord row 자체이고 channel은 query 조건)
- **운영 SoT lock 메커니즘**: PostgreSQL advisory lock `pg_advisory_xact_lock(hash(payloadId, channel))` (다른 DBMS는 동등한 named lock — 운영 결정 NT-17)
- **provider 호출은 lock·DB transaction 밖에서 진행** — lock 시간 최소화·deadlock·connection pool 고갈 방지:
  ```
  1. 짧은 transaction 시작
  2. advisory lock acquire (hash(payloadId, channel))
  3. SELECT MAX(attemptNumber)+1 FROM NotificationDeliveryAttempt WHERE payloadId=? AND channel=?
  4. INSERT NotificationDeliveryAttempt (status="processing", attemptNumber=max+1, ...)
  5. transaction commit (lock 자동 해제)
  6. 별도 비-트랜잭션 영역에서 provider 호출
  7. 별도 transaction에서 attempt UPDATE (status=delivered/failed-*, providerResponseCode, ...)
  ```
- 실패 처리: 6단계 직후 worker 장애 시 attempt status="processing" 그대로 남음. 운영 worker가 stale processing(>SLA) 감지 → status="failed-retrying" 또는 운영 alert로 정리 (NT-17)
- **resendDeadLetter도 동일 메커니즘** — attemptNumber sequence 통합 관리

---

## 5. 채널 어댑터

### 5.1 email

- C-08 `notificationChannels.email` 적용 (transport·secretRef·sender·replyTo)
- 템플릿: Markdown → HTML, BrandTokens(C-07) (NT-05 운영)
- 본문 필수: 이벤트 제목·콘텐츠 제목·CTA 버튼·발신자/Reply-To
- 실패 분류: § 7.1 표 → suppression 갱신 자동

### 5.2 Slack (per-recipient vs broadcast 모드)

- C-08 webhookUrlSecretRef
- 포맷: Slack Block Kit

**per-recipient 모드** (slackUserId 보유):
- mention(`<@U12345>`) 포함
- DeliveryAttempt: `deliveryMode="perRecipient"` + `recipientId`
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:slack`
- 일반 필터(dedupe·opt-out·quietHours·suppression) 정상 적용

**broadcast 모드** (slackUserId 미보유, recipients 중 1명 이상):
- 매트릭스 immediateChannels에 slack 포함 + `criticality=critical` 이벤트만 허용. 그 외는 broadcast 미발송
- **broadcast 데이터 모델** (N4-14·N4-15·N4-16):
  - **NotificationPayloadRecord 1건 생성** — envelope+channel 단위 (recipientId=NULL). § 14.3 broadcast 모드에서 PayloadRecord 1건만, 추가 broadcast-only recipient에 대한 PayloadRecord는 생성하지 않음
  - **NotificationDeliveryAttempt 1건 생성** — envelope+channel 단위 (deliveryMode="broadcast", recipientId=NULL, payloadId=위 broadcast PayloadRecord)
  - `broadcastAttemptId` = **broadcast DeliveryAttempt.id 그대로 참조** (별도 group id 아님 — 자기 참조 의미 제거)
  - `perRecipient[].deliveries[]`의 broadcast-only placeholder는 **DB row 없는 합성 값** — DeliveryResult 합성 시점에 만들어지고 `broadcastAttemptId`로 broadcastDeliveries 매핑. DB에 placeholder DeliveryAttempt를 만들지 않음 → § 14.4 deliveryMode enum에서 `broadcast-placeholder` 제거
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:broadcast:slack` (sentinel "broadcast" 사용)
- broadcast 결과는 `DeliveryResult.broadcastDeliveries[]`에 기록 (broadcastAttemptId = broadcast DeliveryAttempt.id)
- 실패/성공 집계는 `broadcastDeliveries[]`가 SoT, `perRecipient[].deliveries[].status="skipped-broadcast-only"`는 placeholder (집계 제외)

**suppression fallback** (§ 9.1.1 매트릭스):
- slack hard-suppressed (workspace 4xx 등) → fallback 채널(매트릭스 컬럼)로 라우팅. fallback도 막히면 외부 sink alert
- broadcast 모드는 workspace 단위 suppression 대상이 아님 (per-user suppression 없음)

### 5.3 in-app

- 저장소: NotificationInbox (§ 14.5)
- 표시: 어드민 종 아이콘 미확인 카운트
- **발송 원자성** (N4-24): inApp은 **단일 DB transaction에서 NotificationInbox insert + NotificationDeliveryAttempt(status=delivered) insert를 원자 처리**. `UNIQUE(payloadId)` 충돌 시 (race) — 이미 존재하는 Inbox·Attempt 조회하여 `status=deduped` 결과 반환
- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
- **inactive 사용자의 historical inbox**: `active=false` 사용자 inbox는 어드민 UI에서 기본 숨김. 단 DB row는 보존 (감사). 사용자 reactive 시 자동 재노출. 본 정책은 v0.5 기본 운영 결정 — NT-16 해소

---

## 6. digest 모드 (DigestPolicy AST)

### 6.1 정책 AST 구조 (자연어 매트릭스 → 구조화)

REVIEW_WORKFLOW § 9.1.1의 `digest 주기` 컬럼은 본 Feature 패키지 빌드 시 다음 AST로 코드 생성:

```ts
type DigestPolicy = {
  channel: "email";                                  // 현재 email만
  cadence: "daily" | "weekly";
  when?: DigestCondition;                             // 미지정 시 default
  optOutPolicy: "mandatory" | "digestOptOut-allowed";
  policyKey: string;                                  // 매트릭스 빌드 시 결정적 부여
};

type DigestCondition = {
  field: DigestConditionField;                        // 허용 enum
  op: "equals" | "notEquals" | "startsWith" | "endsWith" | "contains" | "exists" | "notExists";
  value?: string | number | boolean;                  // op="exists"·"notExists"는 미지정
};

type DigestConditionField =
  | "metadata.staleTriggeredBy"
  | "metadata.rejectReason"
  | "metadata.priorReviewSubmissionId"
  | "metadata.locationRef"
  | "criticality"
  | "eventType";
```

**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.

**exists/notExists deep path 평가 규칙** (N4-12):
- `missing parent` (예: `metadata.priorReviewSubmissionId` 평가 시 `metadata` 객체에 본 키 자체 부재) → `exists=false`
- `null` 값 → `exists=false`
- `undefined` 값 → `exists=false`
- `""` (빈 문자열) → `exists=true`
- `0`·`false` → `exists=true`

**default policy 유일성 검증** (N4-13): 본 Feature 패키지 빌드 시 — 각 `(eventType, channel)`별 매트릭스 셀이 digest 정책을 가지면 (a) `when: undefined` default 정책 정확히 1개, (b) 조건부 정책 0개 이상. default 부재·중복은 build fail.

**예시 (stale-queued 셀 "email — 의료법 개정은 일일, 기타는 주간" 분해)**:

```ts
[
  {
    channel: "email",
    cadence: "daily",
    when: {
      field: "metadata.staleTriggeredBy",
      op: "startsWith",
      value: "medical-law-revision-"
    },
    optOutPolicy: "mandatory",
    policyKey: "stale-queued.email.daily.medical-law-revision"
  },
  {
    channel: "email",
    cadence: "weekly",
    when: undefined,                                  // default — 위 when 미충족 시
    optOutPolicy: "digestOptOut-allowed",
    policyKey: "stale-queued.email.weekly.default"
  }
]
```

**매칭 우선순위**: 배열 순서대로 평가, 첫 매칭 정책 사용. when 미지정(default)은 항상 마지막. 평가 안전:
- 허용 field/op 외 사용 금지 (빌드 시 fail)
- 값 타입 검증: `equals`/`notEquals`는 일치 타입, `startsWith` 등은 string 한정
- 런타임 eval·임의 식 평가 금지

### 6.2 발송 트리거

- 일일: InstanceManifest.timezone 기준 `digestSchedule.daily`
- 주간: `digestSchedule.weekly`
- 스케줄러: 외부 cron 또는 내부 (NT-08)
- missed run: ±10분 → 다음 cycle carry-over
- DST: IANA 기준 자동 (fall-back 중복 시 첫 발생, spring-forward 누락 시 다음 정상 시각)

### 6.3 그룹화·발송

- DigestBucket key: `(recipientId + policyKey + cadenceWindow)` — § 14.6·14.7 join table
- **cadenceWindow 표기 (§ 14.6 정합)**:
  - daily: `YYYY-MM-DD` (인스턴스 timezone 기준 일자)
  - weekly: `YYYY-Wnn` (ISO week)
- 발송 시점에 join table 조인 → NotificationPayloadRecord[] 묶음 처리
- 발송 완료 → bucket `digestSentAt` 기록 (중복 발송 방지)
- opt-out 평가:
  - policy.optOutPolicy="mandatory" → AdminUser.digestOptOut 무시
  - "digestOptOut-allowed" → digestOptOut=true 시 `skipped-opt-out` (bucket 누적 안 함)

### 6.4 큐 분리·중복 발송 방지 정확화

- DigestBucket·QuietHoursQueue·BusinessHoursQueue 별도 테이블 (§ 14)
- 동일 payloadId가 여러 큐에 동시 누적 가능. **큐 worker 중복 발송 방지 SoT 쿼리** (N4-23):
  ```
  1. advisory lock acquire (hash(payloadId, channel)) — § 4.4와 동일 메커니즘
  2. SELECT 1 FROM NotificationDeliveryAttempt
     WHERE payloadId=? AND channel=? AND status IN ('processing', 'delivered', 'deferred-digest', 'deferred-quiet-hours', 'deferred-business-hours')
     LIMIT 1
  3. row 존재 시 → 본 worker는 발송 생략 (다른 worker가 이미 처리 중·완료)
  4. row 미존재 시 → § 4.4 attemptNumber lock·INSERT processing → commit → provider 호출
  5. advisory lock 해제
  ```
- **인덱스**: `NotificationDeliveryAttempt(payloadId, channel, status)` partial index (status IN above 집합) — 위 쿼리 최적화 (§ 14.4 추가 인덱스)

---

## 7. 재시도·실패·suppression

### 7.1 채널별 실패 분류표

| 채널 | 분류 | 트리거 | 처리 | suppression 갱신 |
|---|---|---|---|---|
| email | `transient` | SMTP 4xx, network timeout, provider 5xx | 재시도 3회 | **atomic increment** `observedCount`. **compare-and-set**으로 threshold 도달 시 1회만 state=`soft-suppressed` + `autoReleaseAt = lastObservedAt + softSuppressionAutoReleaseDays` 설정 |
| email | `permanent` (hard bounce) | 5xx 영구·invalid recipient | DLQ + sink alert | 즉시 `hard-suppressed` (자동 해제 없음) |
| email | `permanent` (config) | provider auth 401/403 | DLQ + sink alert (긴급) | 갱신 없음 |
| email | `permanent` (spam) | spam complaint | DLQ + sink alert | 즉시 `hard-suppressed` |
| email | `rate-limited` | 429 | `deferred-rate-limit` | 갱신 없음 |
| slack | `transient` | webhook 5xx, timeout | 재시도 | (per-recipient 모드에서만) atomic increment |
| slack | `permanent` | 4xx (404·403) | DLQ + sink alert | webhook 자체 문제 — webhookUrlSecretRef 점검 alert |
| slack | `rate-limited` | 429 + Retry-After | header + retryBackoff | 갱신 없음 |
| inApp | `transient` | DB 일시 | 1회 재시도, 실패 시 DLQ | 갱신 없음 |
| inApp | `permanent` | DB 스키마·constraint | DLQ + sink alert (긴급) | 갱신 없음 |

**suppression atomic 갱신 규칙** (N3-16 해소):
- `observedCount` 증가는 DB atomic increment (`UPDATE ... SET observedCount = observedCount + 1`)
- threshold 도달 판정: `UPDATE ... SET state='soft-suppressed', autoReleaseAt=... WHERE state='active' AND observedCount >= threshold` — 영향 row 1건일 때만 자동 sink alert 발생 (중복 alert 방지)

**soft → hard 전이** (N4-22):
- soft-suppressed 상태에서 hard bounce·spam complaint 발생 시 → **hard가 soft를 무조건 override**: `UPDATE ... SET state='hard-suppressed', autoReleaseAt=NULL, observedCount=observedCount(보존)` — autoReleaseAt 제거 + observedCount는 운영 추적용 보존
- worker(§ 7.4)는 자동 해제 조건에 `state='soft-suppressed'` 명시적으로 추가하여 hard 상태 불변성 보장

### 7.2 DLQ + resendDeadLetter

- 저장소: NotificationDeadLetter (§ 14.10) + join table NotificationDeadLetterAttempt (§ 14.11 — N3-19 정정)
- `failedAttemptIds`는 join table FK 참조 — RDBMS 무결성 보장

**resendDeadLetter(deadLetterId)** — notify() 우회 별도 command:
- 새 resendAttemptId(UUID) 생성
- 새 NotificationDeliveryAttempt(attemptNumber = § 4.4 lock 메커니즘 사용, dedupeMode="resend") 생성. dedupe 우회
- 발송 성공 → DeadLetter.resolvedAt 마킹 + NotificationLog summary 재계산
- 발송 실패 → join table에 새 attempt 추가, DeadLetter unresolved 유지
- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)

**보존 기간·순서** (N3-21 해소):
- DLQ `expiresAt`: 기본 30일 (NT-12)
- NotificationLog·PayloadRecord·DeliveryAttempt: DLQ `expiresAt` + `logRetentionDaysAfterDlqExpiry`(기본 90일) 이상 보존
- ON DELETE RESTRICT FK로 보존 순서 강제

### 7.3 self-notification 차단 — 외부 sink

| sink | 트리거 | 대상 |
|---|---|---|
| `externalMonitoringSink` | permanent 실패, DB 장애, DLQ 누적 임계 초과, rate-limit 발생률 > 30%, fallback 채널도 hard-suppressed | Sentry·Datadog·PagerDuty |
| `auditLog` | envelope 종결·재발송·읽음 | 어드민 콘솔 |
| `NotificationLog` | per-payload·per-attempt | 운영 메트릭 SoT |

### 7.4 suppression auto-release worker + 운영자 수동 해제 (N3-15·N4-20·N4-21 해소)

**자동 해제 worker** (soft-suppressed 한정):
- 주기 worker: 1시간 간격
- 조건: `state='soft-suppressed' AND autoReleaseAt <= now()` (hard-suppressed 자동 해제 금지)
- 액션: `state='active', observedCount=0, autoReleaseAt=NULL, firstObservedAt=NULL, lastObservedAt=NULL`
- 동시성 안전: 위 WHERE 조건부 update (DB atomic)

**운영자 수동 해제** (hard-suppressed·soft-suppressed 공통):
- **권한**: `super-admin`·`operator` (REVIEW_WORKFLOW § 11.1)
- **command**: `unsuppressAdminUserChannel(adminUserId, channel, reason)` — notify() 우회 별도 command
- **갱신**: `state='active', observedCount=0, firstObservedAt=NULL, lastObservedAt=NULL, autoReleaseAt=NULL, unsuppressedBy=actor.id, unsuppressedAt=now()`
- **observedCount reset 정책**: 수동 해제 시 0 리셋 — 다음 transient 발생부터 새 epoch으로 카운트. threshold 재도달 시 정상 alert 발생 (즉시 재-alert 방지하면서 재발 추적 보장)
- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`

---

## 8. 사용자 설정·옵트아웃·운영시간

### 8.1 timezone 우선순위

- **quietHours**: `AdminUser.notificationPreferences.quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`
- **digest 발송 시각**: **InstanceManifest.timezone 고정** (DATA_MODEL C-23 v0.13 cascade로 AdminUser.timezone 설명을 quietHours 한정으로 좁힘 — N3-20)

### 8.2 quietHours

- 즉시 채널(email·slack-perRecipient) 보류 → `deferred-quiet-hours` → NotificationQuietHoursQueue (§ 14.8)
- inApp은 quietHours 무시
- critical은 quietHours 우회

### 8.3 글로벌 opt-out

- 모든 채널 off + digestOptOut=true:
  - mandatory 이벤트 → opt-out 우회 + 사용자 채널 off 무시 (단 인스턴스 채널 비활성은 우회 안 함). 인스턴스 inApp 활성 시 강제 inApp
  - 그 외 → `skipped-opt-out`
- 강제 inApp 발송 사전 고지 — 어드민 알림 설정 화면

### 8.4 인스턴스 운영시간 — client-approver

- 적용 조건: `clientApproverBusinessHoursAware=true` + recipient.recipientRole="client"
- **locationRef 산정**:
  1. NotificationEvent.metadata.locationRef
  2. fallback — **LocationProfile `@id="main"`** (C-21 SoT 관례, N3-14 정정)
  3. main 부재 → § 11 빌드 검증 fail (multi-location + main 부재는 fail로 격상 — N4-29)
- **invalid locationRef 처리** (N4-19): metadata.locationRef가 InstanceManifest에 없는 ID이면 → 본 recipient는 `status="skipped-missing-location"` (DeliveryStatus enum 신규 — § 3.2) + 외부 monitoring sink alert. main fallback으로 조용히 보정하지 않음 (runtime 입력 오류 감지)
- 기준 필드: `businessHoursReference` (`openingHours` | `receptionHours` — 기본 openingHours)
- 휴진·공휴일·점심:
  - `openingHours`/`receptionHours`의 `dayOfWeek` 시간 범위
  - `lunchBreaks` 제외 (점심 종료 후 발송)
  - `specialClosures[]` (특정 일자)
  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
- `holidayPolicy` Markdown 필드는 표시용. 계산에 사용 안 함
- 종료 시각 산정 (N4-18): "다음 운영 가능 시각" 탐색 — **최대 90일 탐색 한계**. 90일 내 운영 시각 미발견 시 → `status="failed-permanent"` + 외부 sink alert. 연속 휴일·잘못된 businessHours 설정 등 입력 오류 감지
- **package-embedded holidayCalendar 갱신 정책** (N4-17):
  - 본 Feature 패키지 buld에 한국 공휴일 데이터 embed (해당 연도 + 다음 연도 + 1)
  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
  - **긴급 패치**: 임시공휴일·대체공휴일 지정 시 본 Feature 패키지 patch release (1-2주 내). 운영팀이 모든 인스턴스에 패치 알림
  - `holidayCalendar.source="external-api"` override 우선 — 패키지 데이터보다 외부 API가 최신이면 외부 우선 (NT-18 인프라 결정)
- 큐: NotificationBusinessHoursQueue (§ 14.9)
- critical은 businessHours 우회
- operator·physician·legal·super-admin: 본 정책 미적용

---

## 9. 운영 지표

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| 발송 지연 (즉시) | event 수신 → delivered/deferred-* 종결 | < 30초 (p95) |
| 발송 성공율 | delivered / (delivered + failed-permanent) — `deferred-*`·`skipped-*`·`deduped`는 분모 제외 | > 99% (email·slack), > 99.9% (inApp) |
| transient 재시도율 | failed-retrying / 전체 | < 5% |
| rate-limit 발생율 | deferred-rate-limit / 전체 | < 10% |
| DLQ 신규 발생 | failed-permanent / 일 | < 10 |
| dedupe 적중률 | deduped / 전체 | baseline |
| digest 적시성 | 예정 시각 ± 5분 | > 95% |
| broadcast 비율 (Slack) | broadcastDeliveries / 전체 slack | baseline |
| suppression 누적 | hard-suppressed AdminUser 수 | M2+ baseline |

### 9.2 측정·로깅

- NotificationLog·DeliveryAttempt·PayloadRecord가 SoT
- audit log는 envelope 요약·재발송·읽음만

### 9.3 자체 alert (외부 sink)

- 성공율 < 95% (10분 이동평균)
- DLQ 신규 > 10/일
- 발송 지연 p95 > 60초
- rate-limit > 30% (1시간)

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. notificationChannels·adminBaseUrl·timezone·holidayCalendar 설정 (C-08 v0.13)
# 3. secretRef 등록 (이메일·Slack·monitoring sink)
# 4. 어드민 DB 마이그레이션 — § 14 인벤토리 (DB 11 tables + Redis 1 keyspace)
# 5. AdminUser(C-23) 등록
# 6. notificationPolicyVersion 확인 — 본 Feature 패키지의 매트릭스 보관 버전 중 하나와 일치
```

### 10.2 설정 예시 — § 2.3 참조

---

## 11. 빌드 검증

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | `enabled=true` + 전체 채널 `enabled=false`, email 활성 + secretRef·sender 누락, slack 활성 + webhookUrlSecretRef 누락, `adminBaseUrl`·`timezone` 누락, `ctaRouteTemplates.default` 누락, `externalMonitoringSink.dsnSecretRef` 누락, `notificationPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치, `clientApproverBusinessHoursAware=true` + `holidayCalendar` 누락, **`clientApproverBusinessHoursAware=true` + multi-location 인스턴스 + LocationProfile `@id="main"` 부재** (N4-29 fail 격상) |
| **warning** | AdminUser(C-23) 0건, slack 활성 + slackUserId 등록 0건(broadcast 모드만), `clientApproverBusinessHoursAware=true` + LocationProfile.businessHours 미설정 |

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| NT-04 | 이메일 트랜스포트 — SMTP vs SES vs Mailgun | 운영 결정 |
| NT-05 | 이메일 템플릿 — BrandTokens·다국어 | M2+ |
| NT-08 | digest 스케줄러 — 외부 cron vs 내부 | 인프라 결정 |
| NT-11 | SMS 채널 도입 시점 | v1.x |
| NT-12 | DLQ 보존 기간 — 기본 30일 vs 운영 | 운영 정책 |
| NT-17 | DeliveryAttempt advisory lock 메커니즘 — PostgreSQL `pg_advisory_xact_lock` vs 다른 DBMS named lock + stale processing worker 정리 정책 | 인프라 결정 |
| NT-18 | holidayCalendar external-api override 운영 — provider 선택·API 호출 빈도 | 인프라 결정 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~NT-01~~ | Slack webhook secretRef | v0.2 |
| ~~NT-02~~ | AdminUser cascade | v0.2 — C-23 신설 |
| ~~NT-03~~ | dedupe 저장소 | v0.2 — Redis (v0.4 SET NX EX 원자) |
| ~~NT-06~~ | Slack 사용자 매핑 | v0.2/v0.3 — slackUserId·broadcast 모드. v0.4 — broadcast attempt envelope+channel 단위 1건, sentinel dedupeKey |
| ~~NT-07~~ | NotificationInbox 스키마 | v0.2 |
| ~~NT-09~~ | 글로벌 opt-out | v0.3 |
| ~~NT-10~~ | NotificationLog vs audit log | v0.2 |
| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
| ~~NT-14~~ | hard bounce suppression | v0.3 — C-23 suppression. v0.4 — autoReleaseAt + worker |
| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
| ~~NT-16~~ | inactive 사용자 historical inbox | v0.5 — 기본 숨김 운영 결정 (§ 5.3). 인스턴스 옵션 override 없음 |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (22 지적) |
| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
| 2026-05-14 | v0.4 | codex 3차 (23 지적) |
| 2026-05-14 | v0.5 | codex 4차 (30 지적 전건 수용) — 트랜잭션 abort 분기·attemptNumber lock SoT·UNIQUE 정정·fallback 두 attempt·두 축 분리·DigestPolicy AST 검증·broadcast 단일 PayloadRecord·holidayCalendar 갱신·businessHours 90일·skipped-missing-location·운영자 수동 unsuppress·soft→hard·큐 worker 중복 방지·inApp 원자성·DeadLetter UNIQUE·MySQL schema·actorRole·AdminUserRole system·main 부재 fail
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |

---

## 14. 본 Feature 내부 데이터 구조 (admin DB 11 tables + Redis 1 keyspace)

### 14.1 공통 원칙

- 모든 테이블 `id` UUID PK, `createdAt` Date
- FK 기본 ON DELETE RESTRICT — 보존 순서 보장 (DigestBucketPayload만 분리, § 14.7)
- 인스턴스 격리: `instanceId` 컬럼 + index. recipient의 AdminUser.instanceMemberships에 본 instanceId 미포함 시 `skipped-missing-user` 처리 (§ 4.1 4.a)

### 14.2 `NotificationEventReceipt` (idempotency 선점)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | PK |
| `instanceId` | Slug | ✅ | |
| `sourceEventId` | string | ✅ | idempotency key |
| `notificationLogId` | UUID | ✅ | NotificationLog FK |
| `receiptState` | enum | ✅ | accepted/processing/completed/failed |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |

**Constraints**: `UNIQUE(instanceId, sourceEventId)`. **트랜잭션 순서**: 단일 트랜잭션에서 NotificationLog INSERT → Receipt INSERT. abort 시 양쪽 롤백.
**Index**: `(instanceId, sourceEventId)` unique, `(receiptState, acceptedAt)`.
**보존**: `receiptRetentionDays`(기본 365일) — sourceEventId 재사용 차단.

### 14.3 `NotificationPayloadRecord` (recipient-envelope unit)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | = payloadId |
| `notificationLogId` | UUID | ✅ | FK |
| `eventId` | string | ✅ | |
| `recipientId` | Ref<C-23> | optional | **broadcast 모드: NULL (envelope+channel 단위 1건 — N4-14)**. per-recipient 모드: AdminUser @id |
| `recipientRole` | enum | optional | broadcast 모드 NULL. per-recipient 모드 ✅ |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `metadata` | object | ✅ | |
| `createdAt` | Date | ✅ | |

> 채널별 sentAt 추적은 NotificationDeliveryAttempt.status로만 판단 (per-channel scope). PayloadRecord에는 channel 필드·sentAt 필드 없음 — N3-04 정정.
>
> **broadcast 모드 PayloadRecord 생성 규칙** (N4-14): envelope+channel 단위 1건만 생성 (recipientId=NULL, recipientRole=NULL). broadcast-only 추가 recipient들에 대해 별도 PayloadRecord 생성하지 않음. perRecipient[] DeliveryResult의 broadcast-placeholder는 DB row 없는 합성값 (N4-16).

**Constraints**: `FK notificationLogId ON DELETE RESTRICT`.
**Index**: `(notificationLogId)`, `(recipientId, createdAt)`.

### 14.4 `NotificationDeliveryAttempt`

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `notificationLogId` | UUID | ✅ | FK |
| `payloadId` | UUID | ✅ | PayloadRecord FK |
| `recipientId` | Ref<C-23> | optional | broadcast → null |
| `channel` | enum | ✅ | email·slack·inApp |
| `deliveryMode` | enum | ✅ | perRecipient·broadcast (broadcast-placeholder는 DB row 아님 — N4-16: DeliveryResult 합성값) |
| `attemptNumber` | integer (1~) | ✅ | payloadId+channel 범위 sequence (§ 4.4 lock 메커니즘) |
| `dedupeMode` | enum | ✅ | normal·resend |
| `status` | DeliveryStatus | ✅ | processing(선점) → delivered/failed-*/deferred-*/deduped/skipped-* |
| `provider` | string | optional | |
| `providerResponseCode` | string | optional | |
| `providerResponseBody` | string | optional | 민감 마스킹 |
| `error` | string | optional | |
| `latencyMs` | number | optional | |
| `attemptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `failureClassification` | enum {transient, permanent, rate-limited} | optional | § 7.1 |

**Constraints**:
- `FK notificationLogId ON DELETE RESTRICT`, `FK payloadId ON DELETE RESTRICT`
- `UNIQUE(payloadId, channel, attemptNumber)` — N4-05 정정: sequence가 `(payloadId, channel)` 범위이므로 dedupeMode를 unique에서 제외. dedupeMode는 일반 컬럼
**Index**: `(notificationLogId)`, `(payloadId, channel)`, `(status, attemptedAt)`, `(failureClassification, attemptedAt)`, **`(payloadId, channel, status)` partial index where status IN ('processing','delivered','deferred-digest','deferred-quiet-hours','deferred-business-hours')** (§ 6.4 큐 worker 중복 방지 최적화 — N4-23).

> `broadcastAttemptId` 필드는 별도 보관하지 않음 (N4-15). broadcast DeliveryAttempt.id 자체가 식별자. DeliveryResult 합성 시 `broadcastDeliveries[].broadcastAttemptId = broadcast attempt.id`로 매핑.

### 14.5 `NotificationInbox` (in-app)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `recipientId` | Ref<C-23> | ✅ | |
| `payloadId` | UUID | ✅ | FK |
| `notificationLogId` | UUID | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `createdAt` | Date | ✅ | |
| `readAt` | Date | optional | |

**Constraints**: `FK payloadId ON DELETE RESTRICT`. `UNIQUE(payloadId)`.
**Index**: `(recipientId, readAt)`, `(recipientId, createdAt DESC)`.
**inactive UI 정책**: § 5.3 (NT-16 운영).

### 14.6 `NotificationLog` (envelope 단위 메트릭)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `instanceId` | Slug | ✅ | |
| `eventId` | string | ✅ | |
| `sourceEventId` | string | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `criticality` | enum | ✅ | |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `summary` | `{delivered, failed, deferred, deduped, skipped, broadcast: number}` | ✅ | |

**Constraints**: `UNIQUE(eventId)`, `UNIQUE(instanceId, sourceEventId)`.
**Index**: `(instanceId, sourceEventId)`, `(eventType, acceptedAt)`, `(completedAt)`.

### 14.7 `NotificationDigestBucket` + `NotificationDigestBucketPayload` (join table)

**NotificationDigestBucket**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `digest:{recipientId}:{policyKey}:{cadenceWindow}` |
| `recipientId` | Ref<C-23> | ✅ |
| `policyKey` | string | ✅ |
| `cadenceWindow` | string | ✅ — `YYYY-MM-DD` (daily) 또는 `YYYY-Wnn` (weekly) |
| `scheduledFor` | Date | ✅ |
| `digestSentAt` | Date | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

**NotificationDigestBucketPayload** (join):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
| `payloadId` | UUID | ✅ — FK NotificationPayloadRecord ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
**Index**: `(scheduledFor, digestSentAt IS NULL)`, `(recipientId, policyKey)`.

### 14.8 `NotificationQuietHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `quiet:{recipientId}:{quietHoursWindowStart}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `scheduledFor` | Date | ✅ — quietHours 종료 |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.9 `NotificationBusinessHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `business:{recipientId}:{instanceId}:{locationRef}:{releaseAt}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `locationRef` | string | ✅ |
| `scheduledFor` | Date | ✅ |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.10 `NotificationDedupeCache` (Redis SoT)

```
키: notif:dedupe:{instanceId}:{sourceEventId}:{recipientId|"broadcast"}:{channel}
값: { state: "failed-retrying" | "delivered" | "failed-permanent", payloadId, attemptedAt }
원자 연산: SET key value NX EX <ttl>
TTL:
  failed-retrying: dedupeWindowSeconds + 300
  delivered·failed-permanent: dedupeWindowSeconds
```

### 14.11 `NotificationDeadLetter` + `NotificationDeadLetterAttempt` (join table)

**NotificationDeadLetter**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `notificationLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `failingChannel` | enum | ✅ |
| `failureClassification` | enum | ✅ — permanent |
| `firstFailedAt` | Date | ✅ |
| `lastResendBy` | string | optional |
| `lastResendAt` | Date | optional |
| `resolvedAt` | Date | optional |
| `expiresAt` | Date | ✅ — 기본 30일 |

**Constraints (PostgreSQL 기준)**:
```sql
CREATE UNIQUE INDEX notification_dead_letter_active_unique
  ON notification_dead_letter (payload_id, failing_channel)
  WHERE resolved_at IS NULL;
```
(다른 DBMS는 generated column `isActive`로 대체 — N3-18 정정)

**Index**: `(expiresAt)`, `(resolvedAt IS NULL, firstFailedAt)`.

**NotificationDeadLetterAttempt** (join — N3-19 신설):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
| `attemptId` | UUID | ✅ — FK NotificationDeliveryAttempt ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(deadLetterId, attemptId)` (deadLetter 내 동일 attempt 중복 방지)
- **`UNIQUE(attemptId)`** — 1개 DeliveryAttempt는 정확히 1개 DLQ에만 속함 (N4-25 정정). 여러 DLQ 연결 의미 모호 회피

> NotificationDeliveryAttempt 보존 ≥ DeadLetter 보존 + `logRetentionDaysAfterDlqExpiry`. join FK가 RESTRICT라 보존 순서 강제.

#### 14.11.1 다른 DBMS (MySQL 등) 대체 schema (N4-26)

PostgreSQL partial unique index 미지원 DBMS에서는 generated column + 일반 unique constraint로 대체:

```sql
-- NotificationDeadLetter 추가 컬럼 (MySQL 5.7+/MariaDB 등 generated column 지원):
-- 활성 DLQ는 1 (resolved 안 됨), 종결된 DLQ는 NULL (unique 제약 무시) — N5-05 정정
activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
UNIQUE KEY notification_dead_letter_active_unique (payloadId, failingChannel, activeKey)

-- 결과:
--   - activeKey=1 row가 (payloadId, failingChannel)별 0~1건 (active DLQ unique)
--   - activeKey=NULL row(resolved 이력)는 unique 제약에서 무시 — MySQL NULL은 unique 충돌 발생 안 함, 다수 보존 허용
```

---


 succeeded in 718ms:
# Feature — crm-sync

> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 **raw PII 저장 금지**. webhook(실시간) + polling(배치).
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.20
> - RRN checksum → `features/asset-ingestion.md` § 9.1
> - retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
- **vs ReservationPage(C-20)**: C-20은 콘텐츠 페이지. 본 Feature는 ReservationSubmission·Inquiry·ConversionEvent·Contact 운영 이벤트 sync
- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x (CS-13). **`providerVersionToken=null` provider build fail (CS4-04)** — record-level dedupe 보장 불가
- **운영 모드 2종**: `bi-directional`·`outbound-only`
- **sync entity 4종 (v1.0)**: `reservation`·`contact`·`inquiry`·`conversion-event`. `appointment` v1.x (CS-12)
- **PII 정책**: raw PII 저장 금지. operationalHints는 privacy-sensitive metadata로 분류 (CS4-05). liveRead v1.x (CS-14)
- **RRN deny**: v1.0 강제. false positive 복구 + audit cascade
- **DB 인벤토리**: **15 tables** (§ 13.1 ~ § 13.15) — 각 절 stand-alone schema

---

## 1. 일반 규약

### 1.1 변경 정책 (CS4-13 보강)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08·adapter contract·webhook verifier·build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping·canonical schema § 3.2 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |
| displayHints column 추가 | MINOR | 별개 | nullable. read API output 추가 |
| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
| operationalHints column 추가 | MINOR | 별개 | nullable. privacy classification 검토 필수 (CS4-13) |
| operationalHints privacy classification 변경 | **MAJOR** | policyVersion 신규 | retention·masking·role access 재평가 |
| CrmCredentialVersion.state enum 추가 | MINOR | 별개 | invariant 표 갱신 |
| CrmCredentialVersion.state enum 제거·rename | **MAJOR** | policyVersion 신규 | |
| DB table 추가 | MINOR | 별개 | migration + invariant 표 추가 |
| DB table 제거·rename | **MAJOR** | policyVersion 신규 | migration |
| **consent withdrawal scope enum 추가·변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 적용 의미 변경은 record-level erasure 영향 |
| **consent withdrawal matching key 알고리즘·hash 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 tombstone 무효화 위험 |
| **ChangeIdentityLedger key 산정 알고리즘 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 ledger row 무효화 |
| **providerVersionToken requirement 강화** (CS4-13) | **MAJOR** | 별개 | build fail 룰 추가 |

### 1.2 SoT 원칙

- 알림 발송·audit canonical → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion → DATA_MODEL C-08 v0.20
- RRN checksum → `features/asset-ingestion.md` § 9.1
- retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| CrmSyncRetryQueue | 5·configurable | [60, 300, 1800, 7200, 21600]s |
| CrmSyncNotificationOutbox | 상수 5 | search-visibility § 7.3 SQL 동일 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 → notifications
- 외부 CRM 운영·계약 → 클라이언트·CRM provider
- Core 콘텐츠 변환 → asset-ingestion. CRM→Core auto promote v1.x (CS-11)
- 의료 진료 기록 보관 → CRM·EMR
- raw PII 실시간 조회 → v1.x (CS-14)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
| DATA_MODEL C-08 v0.20 | `crmSyncConfig`·`crmSyncPolicyVersion`·`genericRestApiAdapter` |
| DATA_MODEL CT-03·C-20 | 참조만 |
| asset-ingestion § 9.1 | RRN checksum |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |

### 2.3 InstanceManifest 통합

v0.4 § 2.3과 동일 구조. 정정 필드는 없으나 stand-alone SoT 강화를 위해 명시:

```yaml
crmSyncConfig:
  integrations:
    - id: "main-crm"
      provider: "salesforce"
      apiKeySecretRef: "secretRef://..."
      apiUrl: "..."
      webhookSecret: "secretRef://..."
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
      dpaEvidenceRef: "secretRef://..."
      genericRestApiAdapter:                            # provider=generic-rest-api 시 ✅. DATA_MODEL C-08 v0.20 동기화 (5필드)
        webhookSignatureHeader: "X-Webhook-Signature"
        webhookTimestampHeader: "X-Webhook-Timestamp"
        webhookEventIdHeader: "X-Webhook-Event-Id"
        canonicalStringFormat: "timestamp.method.path.bodySha256"
        versionTokenJsonPath: "$.metadata.version"     # CS4-04·CS5-01 — providerVersionToken 추출 path 필수
        versionTokenType: "epoch-ms"                    # CS5-01 — enum: epoch-ms·integer·string
crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "1.0.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"
      syncSchedule: { pollIntervalMinutes: 15, timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" } }
      entities:
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint: { path: "/api/crm-sync/webhook/{integrationId}", timestampToleranceSeconds: 300 }
      retryQueue: { maxAttempts: 5, backoffSeconds: [60,300,1800,7200,21600], workerPollIntervalSeconds: 30 }
      credentialRotation: { warnDaysBeforeExpiry: 14, autoNotifyEnabled: true, rotationGracePeriodMinutes: 30 }
      rateLimit:
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii: { rawPiiStorageAllowed: false, displayHintsRetentionDays: 30, ssnRrnHandling: "deny", liveReadEnabled: false }
      operationalHintsRetentionDays: 365                # CS4-05 — operationalHints 보존 (privacy-sensitive)
      retentionDays:
        syncLog: 730; sourceAttempt: 730; changeLog: 1095; conflictRecord: 1095
        retryQueueCompleted: 30; notificationOutbox: 30; consentWithdrawalLedger: 1095
      webhookNonceLedgerRetentionMinutes: 360
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:                                       # CS4-01·CS5-02 — canonical hash 알고리즘
        piiHashPepperRef: "secretRef://CRM_PII_HASH_PEPPER"
        crmExternalIdHashPepperRef: "secretRef://CRM_EXT_ID_HASH_PEPPER"
        changeIdentityKeyPepperRef: "secretRef://CRM_CHANGE_IDENTITY_PEPPER"
        rrnFingerprintPepperRef: "secretRef://CRM_RRN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://..." }
```

#### 2.3.1 hash algorithm SoT (CS4-01)

| hash | 입력 | 알고리즘 | 산식 |
|---|---|---|---|
| `piiHash` | raw PII (이름·전화·이메일·생년월일 정규화 후 concat) | HMAC-SHA256 | `HMAC(piiHashPepperRef, normalize(name) + ":" + normalize(phone) + ":" + normalize(email) + ":" + birthDate_iso)`. 결과 char(64) hex |
| `crmExternalIdHash` | integrationId + crmExternalId | HMAC-SHA256 | `HMAC(crmExternalIdHashPepperRef, integrationId + ":" + crmExternalId)`. char(64) hex |
| `changeIdentityKey` | integrationId + entity + crmExternalId + providerVersionToken | HMAC-SHA256 | `HMAC(changeIdentityKeyPepperRef, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)`. char(64) hex |
| `rrnFingerprint` | RRN normalized | HMAC-SHA256 | `HMAC(rrnFingerprintPepperRef, rrnNormalized)`. char(64) hex. UI에는 prefix 4 hex만 노출 |
| `credentialFingerprint` | integrationId + secretVersionId | HMAC-SHA256 | `HMAC(auditPepperSecretRef, integrationId + ":" + secretVersionId)`. char(64) hex. UI prefix 8 hex |
| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |

normalize 규칙:
- name: 공백 제거 + lowercase + Unicode NFKC
- phone: 숫자만 추출 (국가코드 +82 포함)
- email: lowercase + 도메인 IDNA-encoded
- birthDate: ISO 8601 YYYY-MM-DD

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command + mode matrix

| 종류 | 함수 | 책임 | 권한 | bi-directional | outbound-only |
|---|---|---|---|---|---|
| 실행 | `runSync(input: RunSyncInput): RunSyncResult` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
| 실행 | `processInboundWebhook` | webhook 수신 | system | 허용 | endpoint 미등록 (HTTP 404). direct invocation → runtime fail |
| 실행 | `pushOutbound(entity, recordId, operation): PushOutboundResult` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
| 실행 | `resolveConflict(input: ResolveConflictInput): ResolveConflictResult` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
| 실행 | `recoverRrnFalsePositive(input: RecoverRrnInput): RecoverRrnResult` | RRN 복구 | super-admin | 허용 | 허용 |
| 실행 | `applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` | 환자 동의 철회 | super-admin | 허용 | 허용 |
| 실행 | `resetCredentialRotation(input: ResetCredentialRotationInput): ResetCredentialRotationResult` (CS4-07) | reverted → stable 명시적 reset | super-admin | 허용 | 허용 |
| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |
| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |
| 운영 | `unregisterIntegration` | § 4.7 정책 | super-admin | 허용 | 허용 |
| 운영 | `rotateCredential` | rotation § 4.5 | super-admin | 허용 | 허용 |

### 3.1.1 audit log contract (7종 AuditAction)

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy·unregisterPolicySnapshot | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprintPrefix·newCredentialFingerprintPrefix·rotationAttemptId·resultState | super-admin |
| `crm-rrn-false-positive-recovered` | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason | super-admin |
| `crm-rrn-rejection-finalized` | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus="rejected-rrn-final"·actorRole·reason | super-admin |
| `crm-consent-withdrawal-applied` | `"crm-consent:" + withdrawalLedgerId` | scope·keyType·keyPrefix(0..8)·matchedRecordCount·tombstoneChangeLogIds·integrationId·dryRun·reason | super-admin |

### 3.2 v1.0 운영 이벤트 canonical schema

```ts
type ReservationSubmission = {
  submissionId: string;
  reservationPageRef: Ref<C-20>;
  ctaConfigRef?: Ref<CT-03>;
  source?: string; campaign?: string;
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "synced-failed";
  piiHash: string;                                       // § 2.3.1 알고리즘
  displayHints: ContactDisplayHints;
  operationalHints: ReservationOperationalHints;
  crmExternalId?: string;
  crmExternalIdHash?: string;                            // crmExternalId 채워지면 동시에 산정
};

type Inquiry = {
  inquiryId: string; source?: string;
  inquiryType: "general" | "appointment-related" | "billing" | "other";
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "responded-on-crm";
  piiHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: InquiryOperationalHints;
  crmExternalId?: string;
  crmExternalIdHash?: string;
};

type ConversionEvent = {                                 // outbound-only entity. PII 없음
  conversionEventId: string;
  eventType: "form-submit" | "phone-click" | "page-view-threshold" | "cta-click";
  occurredAt: Date;
  pageRef?: string;                                      // string ref
  attributionSource?: string;
};

type Contact = {
  contactId: string;
  crmExternalId: string;
  crmExternalIdHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: ContactOperationalHints;
  lastSyncedAt: Date;
  consentWithdrawn: boolean;
};
```

#### 3.2.1 ContactDisplayHints — closed schema 6 column

| 필드 | 타입 | DB CHECK (PostgreSQL) | application validator (canonical) |
|---|---|---|---|
| `nameInitial` | varchar(8) | `length ≤ 8 AND value ~ '^[가-힣A-Za-z]'` | 정규식 `^[\p{L}](O\*?)?$` |
| `phoneLast4` | char(4) | `value ~ '^[0-9]{4}$'` | 동일 |
| `emailDomain` | varchar(64) | `value ~ '^@[a-z0-9.-]+$'` | 동일 |
| `cityName` | varchar(32) | `length ≤ 32 AND value ~ '^[가-힣 ]+$'` | 행정구역 allowlist (CrmAdminRegionAllowlist v1.x — CS-19) |
| `genderHint` | enum(`male`·`female`·`other`·`unknown`) | enum constraint | enum |
| `ageBand` | enum(`teen`·`20s`·`30s`·`40s`·`50s`·`60+`·`unknown`) | enum constraint | enum |

DB CHECK는 PostgreSQL canonical. 타 DB 이식 시 dialect 재정의.

#### 3.2.2 operationalHints — privacy-sensitive metadata (CS4-05)

operationalHints는 raw PII 아니지만 **준식별자 결합 위험** (소규모 의료기관 환경 등):

| 필드 | 분류 | retention | 운영자 화면 접근 | export |
|---|---|---|---|---|
| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
| `inquiryType` | non-sensitive | 동일 | 동일 | 허용 |
| `channelType` | non-sensitive | 동일 | 동일 | 허용 |
| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
| `departmentHint` | **준식별자** (희소 진료과 결합 위험) | operationalHintsRetentionDays | 동일 | masking |
| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
| `relationToInstitution` | **준식별자** | operationalHintsRetentionDays | 동일 | masking |
| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |

**small-cell suppression** (CS4-05·CS5-05):

| 항목 | 정의 |
|---|---|
| threshold | 동일 cell 카운트 < 5 (k-anonymity 보수적 기준 — 개인정보보호법 §28-2 가명정보 처리 가이드라인 참조) |
| cell 정의 | `(locationKey, departmentHint, desiredVisitDate)` 조합 |
| 적용 범위 | (1) queryCrmRecords UI 렌더링, (2) CSV/JSON export, (3) 통계·분석 화면, (4) admin dashboard 집계 |
| 집계 window | 운영 정책: 최근 30일·90일·365일 동시 적용 (가장 작은 cell 기준으로 suppression) |
| drilldown 금지 | suppressed cell의 row-level drilldown 금지. drilldown 시 다른 cell 결합으로 재식별 가능 |
| complementary suppression | suppressed cell 합계가 노출되면 보완 마스킹 필수 — `total - suppressedCount`로 역추론 방지 |
| export 동일 적용 | export도 화면과 동일 룰. raw cell count 절대 export 금지 |
| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |

법무 근거:
- 개인정보보호법 §28-2 (가명정보 처리)
- 통계청 가이드라인: 통계조사 결과 작성 시 단위·세부 집계 cell 5 미만 보호
- 추후 별도 `docs/compliance/PRIVACY_COMMON.md` SoT 신설 시 본 절은 참조로 변경 (CS-23 신규 open)

**nulling 정책** (CS4-06 precedence: legalHold > unregister > expiry > consent withdrawal):
- consent withdrawal scope="all": displayHints + 준식별자/민감 operationalHints (locationKey·departmentHint·desiredVisitDate·guardianInvolved·relationToInstitution) 모두 nulling. non-sensitive는 보존
- consent withdrawal scope="marketing-only": displayHints nulling만. operationalHints 보존
- displayHintsRetentionDays 만료: displayHints만 nulling
- operationalHintsRetentionDays 만료: 준식별자/민감 operationalHints nulling
- unregisterIntegration: § 4.7 표

**CRM 콘솔 raw 접근 (CS5-04 풀 전개)**:
- **SSO**: 의료기관·Glitzy 계정 분리. solution 운영자가 CRM 직접 접근하려면 별도 CRM SSO 필요. solution super-admin 권한 ≠ CRM admin 권한
- **role mapping**: CRM 측 권한은 의료기관 책임. Glitzy 솔루션은 권한 위임 안 함
- **deep link**: queryCrmRecords 결과의 `crmExternalId`로 CRM 콘솔 deep link 생성 가능. config `crmConsoleBaseUrl` v1.x (CS-20). v1.0은 link 미제공 — 운영자가 CRM 콘솔에서 별도 검색
- **audit 책임**: CRM 콘솔 접근은 CRM provider 측 audit log 책임 (Salesforce Login History·HubSpot Audit Trail 등). solution audit log는 CRM 콘솔 접근 추적 불가 — 본 문서 audit scope 외

### 3.3 Command DTO (CS4-10)

#### 3.3.1 `RunSyncInput`·`RunSyncResult`

```ts
type RunSyncInput = {
  instanceId: string;
  manifestVersion: string;
  direction: "inbound" | "outbound" | "both";  // outbound-only mode는 "outbound" 강제
  mode: "scheduled" | "on-demand";
  idempotencyKey: string;                       // UNIQUE per instance
  windowStart?: Date; windowEnd?: Date;
  forceRefresh?: boolean; refreshIntentId?: string;
};

type RunSyncResult = {
  syncLogId: string;
  envelopeState: "succeeded" | "partial" | "failed" | "retried";
  perEntity: Array<{
    entity: "reservation" | "contact" | "inquiry" | "conversion-event";
    direction: "inbound" | "outbound";
    result: SourceAttemptStatus;
    counts: { recordsInbound: number; recordsOutbound: number; conflictsDetected: number };
  }>;
};
```

#### 3.3.2 `PushOutboundResult`

```ts
type PushOutboundResult = {
  status: "pushed" | "queued-retry" | "blocked-rrn" | "blocked-consent-withdrawn" | "cas-conflict-detected";
  crmExternalId?: string;
  crmExternalIdHash?: string;
  conflictRecordId?: string;
};
```

#### 3.3.3 `ResolveConflictInput`·Result

```ts
type ResolveConflictInput = {
  conflictId: string;
  resolution: "crm-wins" | "solution-wins" | "manual-resolved" | "manual-rejected";
  resolvedBy: string;
  reason?: string;
  expectedResolution: "open";                   // CAS — 이미 resolved면 실패
};

type ResolveConflictResult = {
  resolution: ResolveConflictInput["resolution"];
  appliedFieldVersion: number;
  winningVersion: number;
};
```

#### 3.3.4 `RecoverRrnInput`·Result

```ts
type RecoverRrnInput = {
  ledgerId: string;
  action: "override-and-fetch" | "abandon";
  reason: string;                               // ✅ 운영 감사용
  actorNote?: string;
  expectedPriorStatus: "rejected-rrn-recoverable";  // CAS
  dryRun?: boolean;
};

type RecoverRrnResult = {
  finalStatus: "accepted-processed" | "rejected-rrn-final";
  newCrmRecordId?: string;
  rrnFingerprintPrefix: string;                 // 4 hex
};
```

#### 3.3.5 `ApplyConsentWithdrawalInput`·Result (CS4-01·10 — discriminated)

```ts
type ApplyConsentWithdrawalInput =
  | {
      integrationId: string;
      keyType: "piiHash";
      piiHash: string;                          // § 2.3.1 알고리즘으로 산정. canonical 64 hex
      scope: "all" | "marketing-only";
      reason: string;
      idempotencyKey: string;                   // 중복 적용 방지
      dryRun?: boolean;
    }
  | {
      integrationId: string;
      keyType: "crmExternalId";
      crmExternalId: string;                    // raw — 내부에서 crmExternalIdHash로 변환
      scope: "all" | "marketing-only";
      reason: string;
      idempotencyKey: string;
      dryRun?: boolean;
    };

type ApplyConsentWithdrawalResult = {
  withdrawalLedgerId: string;
  keyType: "piiHash" | "crmExternalIdHash";     // canonical hash로 변환 후 저장됨
  keyHashPrefix: string;                        // 8 hex
  scope: "all" | "marketing-only";
  matchedRecordCount: number;
  tombstoneChangeLogIds: string[];
  displayHintsNulled: boolean;
  operationalHintsNulled: { /* 필드별 nulling 여부 */ };
  dryRun: boolean;
};
```

**경로별 매칭 키 (CS4-01)**:

| 경로 | 매칭 키 SoT |
|---|---|
| webhook inbound | rawBody에서 piiHash 산정 (provider별 PII field path는 adapter config) → CrmConsentWithdrawalLedger lookup |
| polling inbound | provider list API 응답에서 piiHash 산정. piiHash 산정 불가능한 record는 crmExternalIdHash로 lookup |
| outbound push | solution record의 piiHash와 crmExternalIdHash 둘 다 lookup |
| applyConsentWithdrawal | input.keyType discriminant |

#### 3.3.6 `ResetCredentialRotationInput`·Result (CS4-07)

```ts
type ResetCredentialRotationInput = {
  integrationId: string;
  revertedVersionId: string;                    // CredentialVersion.state="reverted" row
  reason: string;
  actorNote?: string;
  expectedIntegrationState: "reverted";         // CAS
};

type ResetCredentialRotationResult = {
  integrationState: "stable";
  revokedVersionId: string;                     // 이전 reverted row → state="revoked"
  rotationAttemptId: string;
};
```

audit `crm-credential-rotated` metadata `resultState="reset"` 추가.

### 3.4 webhook 처리

```ts
async function processInboundWebhook(
  integrationId: string,
  headers: Record<string,string>,
  rawBody: Buffer,
  fullUrl: string,
  method: string
): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-stale-timestamp"
        | "rejected-credential-expired" | "rejected-rrn-detected" | "rejected-mode-disallowed"
        | "rejected-consent-withdrawn" | "queued" | "deduped";
  recordsProcessed: number;
  conflicts: number;
  nonceLedgerStatus?: "new" | "duplicate-eventid" | "duplicate-eventid-bucket" | "duplicate-digest";
  changeIdentityStatus?: "new" | "duplicate";
}>;
```

#### 3.4.1 ProviderWebhookVerifier (CS5-04 풀 전개 + providerVersionToken required — CS4-04)

```ts
interface ProviderWebhookVerifier {
  verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
}

type VerifierResult = {
  signatureValid: boolean;
  providerEventId: string | null;
  providerTimestamp: Date | null;
  canonicalDigest: string;
  deliveryKind: "at-least-once" | "exactly-once" | "best-effort";
  retrySemantics: "provider-retries" | "no-retry";
  providerVersionToken: string;                 // CS4-04 — v1.0 required. null이면 build fail
  errorReason?: "signature-mismatch" | "missing-headers" | "malformed-payload";
};
```

#### 3.4.2 provider별 adapter contract

| Provider | payload | signature | timestamp | eventId | canonical | providerVersionToken | v1.0 |
|---|---|---|---|---|---|---|---|
| Salesforce Outbound Messages | XML SOAP | HMAC-SHA256(secret, rawBody) | `Sforce-Send-Time` | XML `Id` | `timestamp + "." + bodySha256` | XML `SystemModstamp` ISO8601 | ✅ |
| Salesforce Platform Events | JSON CometD | HMAC-SHA256 (orgId 기반) | `OrganizationId+ReplayId` | `replayId` | 동일 | `replayId` integer | ✅ |
| HubSpot | JSON | HMAC-SHA256(secret, `method + url + body + ts`) | `X-HubSpot-Request-Timestamp` | header/body `eventId` | provider 정의 | `propertyChange.versionTimestamp` 또는 `updatedAt` | ✅ |
| generic-rest-api | JSON | HMAC-SHA256(secret, canonicalString) | config | config | config | config `versionTokenJsonPath` (✅ — § 2.3) | ✅ |

#### 3.4.3 InboundProcessingContext — **discriminated union** (CS4-03)

```ts
type InboundProcessingContext = WebhookInboundContext | PollingInboundContext;

type WebhookInboundContext = {
  kind: "webhook";
  integrationId: string;
  verifierResult: VerifierResult;
  rawBody: Buffer;
  parsedPayload: ParsedCrmPayload;
  receivedAt: Date;
  nonceLedgerId: string;
  changeIdentityLedgerId: string;
  normalizedChange: NormalizedInboundChange;
};

type PollingInboundContext = {
  kind: "polling";
  integrationId: string;
  pollRunId: string;
  providerCursor: string;                       // 이전 polling 종료점
  parsedPayload: ParsedCrmPayload;
  observedAt: Date;
  changeIdentityLedgerId: string;
  normalizedChange: NormalizedInboundChange;
};

// CAS·FieldMapping·CrmRecord 갱신 단계에서 보는 공통 normalized
type NormalizedInboundChange = {
  entity: "reservation" | "contact" | "inquiry" | "conversion-event";
  crmExternalId: string;
  crmExternalIdHash: string;
  piiHash: string | null;                       // PII 없는 entity는 null
  providerVersionToken: string;
  expectedCrmVersion: number;                   // § 4.3.5 산정 규칙
  proposedDisplayHints: ContactDisplayHints | null;
  proposedOperationalHints: AnyOperationalHints | null;
  changedFieldTokens: string[];
};
```

webhook → polling 공통 처리는 **NormalizedInboundChange만 보는** CAS 단계로 수렴.

### 3.4.4 ChangeIdentityKey (CS4-04 책임 분리)

- **CrmWebhookNonceLedger**: **transport-level dedupe** — webhook delivery 중복(provider retry·재전송). polling 미사용
- **CrmChangeIdentityLedger**: **record-level dedupe** — 같은 CRM 변경이 webhook과 polling 양쪽으로 들어와도 1번만 처리

```
changeIdentityKey = HMAC-SHA256(changeIdentityKeyPepperRef, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)
```

providerVersionToken=null인 provider는 **v1.0 build fail** (CS4-04) — record-level dedupe 보장 불가능하므로 v1.0 운영 불가.

---

## 4. sync 파이프라인

### 4.1 outbound

```
1. pushOutbound(entity, recordId, operation)
2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
3. PII Redaction Validator (closed displayHints + operationalHints schema 검증)
4. RRN 검사 — 검출 시 차단
5. **consent withdrawal lookup** — piiHash·crmExternalIdHash 모두 검사 → 매칭 시 PushOutboundResult.status="blocked-consent-withdrawn"
6. credential state 검사 (§ 4.5.3)
7. rate limit token
8. CRM API call (idempotency-key)
9. CrmRecord CAS — `WHERE id=? AND solution_version=? AND crm_version=?`
   → 0 rows → ConflictRecord
10. CrmRecordChangeLog insert
```

### 4.2 inbound

```
[webhook 경로]
1. mode="outbound-only" → 404
2. ProviderWebhookVerifier.verify → VerifierResult (signatureValid=false → HTTP 401)
3. providerTimestamp 검증 → rejected-stale-timestamp
4. CrmWebhookNonceLedger insert (deliveryKind별 partial unique):
   - exactly-once: `(integrationId, providerEventId)`
   - at-least-once + eventId: `(integrationId, providerEventId, receivedBucket)`
   - at-least-once no-eventId 또는 best-effort: `(integrationId, canonicalDigest, receivedBucket)`
   - 중복 → "duplicate-eventid" / "duplicate-eventid-bucket" / "duplicate-digest" → HTTP 200 deduped
5. RRN 검사 → rejected-rrn-recoverable / rejected-rrn-final
6. payload parsing → NormalizedInboundChange 생성
7. **consent withdrawal lookup** (piiHash·crmExternalIdHash) → 매칭 시 → status="rejected-consent-withdrawn"
8. closed-schema validator
9. **CrmChangeIdentityLedger insert** — UNIQUE(changeIdentityKey). 중복 → "duplicate" → HTTP 200 deduped (polling이 이미 처리)
10. CAS 갱신
11. NonceLedger status "accepted-processed"

[polling 경로]
1. 다음 page provider list API → parsed payload
2. consent withdrawal lookup
3. closed-schema validator
4. **CrmChangeIdentityLedger insert** — UNIQUE 충돌 시 skip (webhook이 이미 처리)
5. CAS 갱신
```

#### 4.2.1 RRN false positive 복구 (CS5-04 풀 전개)

`recoverRrnFalsePositive(input: RecoverRrnInput)` (§ 3.3.4):

```
1. ledger row 조회 — CrmWebhookNonceLedger.status="rejected-rrn-recoverable"만 허용
   - input.expectedPriorStatus CAS 검증 — 일치 안 함 → runtime fail
   - 다른 status → runtime fail
2. action="override-and-fetch":
   a. CRM live pull — provider별 list API 또는 single-record API
      - lookup key: ledger row의 providerEventId 또는 last-known crmExternalId (있을 시)
   b. CRM에서 raw payload 재취득
   c. asset-ingestion § 9.1 RRN checksum 재실행
      - regex `\b\d{6}-?[1-8]\d{6}\b` 후보 추출
      - 생년월일·성별 코드 유효성 검사
      - checksum: 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + (11-(sum%11))%10 검증
   d. 통과 (false positive 확인) → 정상 inbound 처리 (NormalizedInboundChange 생성 + CAS):
      - ledger status → "accepted-processed"
      - newCrmRecordId 채움
      - audit `crm-rrn-false-positive-recovered` metadata (priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason)
   e. 재검출 (RRN 진짜) → ledger status → "rejected-rrn-final"
      - audit `crm-rrn-rejection-finalized`
3. action="abandon":
   - ledger status → "rejected-rrn-final"
   - audit `crm-rrn-rejection-finalized` metadata (priorStatus·finalStatus·actorRole·reason)
4. input.dryRun=true → 1·2c까지만 수행. ledger·CrmRecord 미변경. RecoverRrnResult.finalStatus는 예상값만 반환
5. 동일 ledgerId 두 번째 호출 — ledger status가 이미 final이면 expectedPriorStatus CAS 실패
```

### 4.3 field-level 충돌 해결 + CAS

#### 4.3.1 FieldAuthority

```ts
type FieldAuthority =
  | "crm-authoritative"
  | "solution-authoritative"
  | "last-write-wins-timestamp"
  | "last-write-wins-version";
```

#### 4.3.2 CAS SQL

```sql
-- inbound
UPDATE crm_record
SET display_hints_name_initial=$1, /* ... */,
    operational_hints_department_hint=$N, /* ... */,
    crm_version=$newCrmVersion, last_synced_at=$now
WHERE id=$recordId AND crm_version=$expectedCrmVersion AND solution_version=$expectedSolutionVersion;

-- outbound
UPDATE crm_record
SET solution_version=solution_version+1, crm_external_id=$crmId, crm_external_id_hash=$crmIdHash, last_synced_at=$now
WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$expectedCrmVersion;
```

0 rows → ConflictRecord 생성.

#### 4.3.3 ConflictRecord (field-level)

| 필드 | 의미 |
|---|---|
| `fieldPath` | "displayHints.phoneLast4" 등 |
| `baseVersion` | 충돌 직전 record-level |
| `winningVersion` | resolve 시 적용 |
| `appliedFieldVersion` | 동일 fieldPath·동일 이하 재충돌 차단 |
| `winningSide` | "crm" \| "solution" \| "manual" |

#### 4.3.4 manual escalate 결정표

| 조건 | escalate? |
|---|---|
| FieldAuthority=last-write-wins-timestamp + timestamp 차이 ≤ 5s + version tie | ✅ |
| FieldAuthority=last-write-wins-version + version tie | ✅ |
| FieldAuthority=last-write-wins-timestamp + provider timestamp 누락 | ✅ |
| 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 | ✅ |
| FieldAuthority=crm/solution-authoritative | ❌ |

#### 4.3.5 expectedCrmVersion 산정

| provider | providerVersionToken | expectedCrmVersion |
|---|---|---|
| Salesforce Outbound Messages | `SystemModstamp` ISO | epoch ms |
| Salesforce Platform Events | `replayId` | 직접 사용 |
| HubSpot | `versionTimestamp` 또는 `updatedAt` | epoch ms |
| generic-rest-api | config path 추출 | epoch ms 또는 integer (config type) |
| polling | list API `lastModified` 등 | epoch ms |

### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)

### 4.5 credential rotation (CS4-02·07)

#### 4.5.1 CrmCredentialVersion entity — § 13.11

#### 4.5.2 두 enum invariant 표

**CrmIntegration.credentialState** 5상태. **CrmCredentialVersion.state** 6상태.

| Integration state | CredentialVersion rows | 의미 |
|---|---|---|
| stable | 1 row `state=active` (others `revoked`) | 정상 |
| rotating | 1 `active`(이전) + 1 `rotating-target`(신규) | rotation 진행. outbound new 우선·old fallback. inbound active + rotating-target 병행 |
| committed | 1 `committed`(이전·graceUntil) + 1 `active`(신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil) |
| grace-expired | 1 `active`(신규) (others `revoked`/`grace-expired`) | committed graceUntil 도래. outbound/inbound active만 |
| reverted | 1 `active`(원래) + 1 `reverted`(신규 실패) | rotation 실패 |

#### 4.5.3 outbound/inbound 사용 matrix

| Integration state | outbound 사용 | inbound verifier 허용 |
|---|---|---|
| stable | active | active만 |
| rotating | rotating-target 우선·active fallback | active + rotating-target 병행 |
| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |
| grace-expired | active(신규) only | active만 |
| reverted | active(원래) | active만 |

#### 4.5.4 rotateCredential — DB-level concurrency 강제 (CS4-02)

```sql
BEGIN;
-- 1. integration row LOCK
SELECT * FROM crm_integration WHERE id=$integrationId FOR UPDATE;
-- 2. 현재 state 확인 (stable만 허용 — CAS)
-- 3. 새 CredentialVersion insert (state='rotating-target')
INSERT INTO crm_credential_version (id, integration_id, secret_ref, secret_version_id, state, activated_at, ...) VALUES (...);
-- 4. integration state → 'rotating'
UPDATE crm_integration SET credential_state='rotating' WHERE id=$integrationId AND credential_state='stable';
-- 5 rows affected 검증 (CAS)
COMMIT;
```

**DB partial unique 강제** (§ 13.11):
- `UNIQUE(integration_id) WHERE state='active'` — active row 1개만
- `UNIQUE(integration_id) WHERE state='rotating-target'` — rotating-target 1개만
- `UNIQUE(integration_id) WHERE state='committed'` — committed 1개만

→ 두 동시 rotateCredential 호출 시 partial unique 충돌로 두 번째 호출 실패. 첫 번째만 진행.

health check 결과 처리:
- 성공 → BEGIN; SELECT FOR UPDATE → 이전 active → committed (+graceUntil) → 신규 rotating-target → active → integration state 'committed' → currentCredentialVersionId 갱신; COMMIT;
- 실패 → BEGIN; SELECT FOR UPDATE → 신규 rotating-target → reverted → integration state 'reverted'; COMMIT;

#### 4.5.5 resetCredentialRotation (CS4-07)

§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
- reverted CredentialVersion row → state="revoked"
- integration credentialState → "stable"
- audit `crm-credential-rotated` metadata `resultState="reset"·rotationAttemptId·reason`

#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)

cadence: 10분. 매 cycle:

```sql
-- 1. committed credential version (graceUntil 도래) 조회
SELECT integration_id, id AS committed_version_id, grace_until
FROM crm_credential_version
WHERE state='committed' AND grace_until <= now()
FOR UPDATE SKIP LOCKED
LIMIT $batch;

-- 2. integration row LOCK
SELECT * FROM crm_integration WHERE id=$integration_id FOR UPDATE;

-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
UPDATE crm_credential_version SET state='grace-expired', revoked_at=now()
WHERE id=$committed_version_id;

-- 4. integration credentialState → 'grace-expired' (단일 transaction)
UPDATE crm_integration SET credential_state='grace-expired'
WHERE id=$integration_id AND credential_state='committed';

-- 5. audit CrmCredentialAuditLog event='grace-expired' insert

COMMIT;

-- 후속 (별도 cycle): 운영자 검토 후 또는 일정 지연 후 grace-expired → revoked로 정리
-- v1.0은 grace-expired에서 운영자 개입 없이 정리할지 별도 정책 (CS-22 신규 open)
```

실패 시: sink alert + 다음 cycle 재시도. 3회 실패 → super-admin alert + integration manual review 큐.

**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.

### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개

```sql
-- claim
WITH next AS (
  SELECT id FROM crm_sync_notification_outbox
  WHERE status='pending' AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;

-- transient fail
UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;

-- exhausted
UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
```

### 4.7 unregister 정책 표 (CS4-06 precedence 추가)

`unregisterIntegration(integrationId, options)`:

**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.

| 대상 | 즉시 액션 | 보존 | legalHold default | FK ON DELETE |
|---|---|---|---|---|
| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
| CrmCredentialVersion (모든 row) | state="revoked" | 7년 (audit) | true | RESTRICT |
| CrmRecord.displayHints* | nulling (option `keepDisplayHints=false` 기본) | row 유지 | false | — |
| CrmRecord.operationalHints* | non-sensitive 유지·sensitive nulling (§ 3.2.2) | row 유지 | false | — |
| CrmRecordChangeLog | row 유지 (audit) | retentionDays.changeLog | false (tombstone는 true) | RESTRICT |
| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecord | false | RESTRICT |
| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.retryQueueCompleted | false | RESTRICT |
| CrmSyncNotificationOutbox (pending) | status="permanent" | retentionDays.notificationOutbox | false | RESTRICT |
| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | false | RESTRICT |
| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog | false | RESTRICT |
| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
| webhook endpoint | 미등록 (HTTP 404) | — | — | — |
| inbound polling | 중단 | — | — | — |

audit `crm-integration-unregistered` metadata `unregisterPolicySnapshot` (options) 포함.

`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).

### 4.8 consent withdrawal (CS4-01 강화)

`applyConsentWithdrawal(input: ApplyConsentWithdrawalInput): ApplyConsentWithdrawalResult` (§ 3.3.5):

```
1. input.keyType discriminant 확인. piiHash → § 2.3.1 canonical algorithm. crmExternalId → crmExternalIdHash로 변환
2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
3. `(integrationId, idempotencyKey)` lookup:
   - **존재 + requestFingerprint 일치** → same-request replay → 기존 ledger 결과 반환 (no-op)
   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
   - **미존재** → 다음 단계
4. dryRun=true → matchedRecordCount만 산정·반환. DB 미변경 (ledger 미insert)
5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
6. CrmRecord(s) 매칭 (keyType별):
   - piiHash: WHERE pii_hash = $piiHash
   - crmExternalIdHash: WHERE crm_external_id_hash = $crmExternalIdHash
7. scope="all": displayHints + 준식별자/민감 operationalHints nulling. consentWithdrawn=true. CrmRecordChangeLog tombstone insert
8. scope="marketing-only": displayHints nulling만
9. 향후 inbound — § 4.2 step 7에서 piiHash·crmExternalIdHash 둘 다 lookup → rejected-consent-withdrawn
10. 향후 outbound — § 4.1 step 5에서 둘 다 lookup → blocked-consent-withdrawn
11. audit `crm-consent-withdrawal-applied`
```

v1.x에서 patientConsentEvidenceRef 도입 시 record-level evidence 연결 (CS-07).

---

## 5. provider 어댑터 (v1.0 — 3종)

§ 3.4.2 contract. korean-emr v1.x (CS-13).

### 5.1 rate limit (CrmRateLimitState — § 13.10)

---

## 6. 알림

### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `crm-sync-batch-failed` | high | email + inApp | operator |
| `crm-sync-conflict-detected` | high | email + inApp | operator |
| `crm-sync-credential-expired` | critical | email + inApp | operator + super-admin |
| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |

### 6.2 outbox — § 4.6 SQL

### 6.3 매핑

| eventType | sourceKind | sourceId | contentRef |
|---|---|---|---|
| `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` |
| `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` |
| `crm-sync-credential-expired` | `credential-version` | `integrationId:credentialVersionId` | `"crm-integration:" + integrationId` |
| `crm-sync-credential-expiring-soon` | `credential-version` | 동일 | 동일 |

`sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`.

---

## 7. PII 처리 (CS4-05 강화)

### 7.1 closed schema + privacy-sensitive operational hints

- displayHints: 6 column closed schema (§ 3.2.1)
- operationalHints: entity별 column + privacy classification 표 (§ 3.2.2)
- changedFields/snapshot: allowlisted field token + masked value/enum
- DB CHECK + application validator 양층

### 7.2 RRN deny (CS5-04 풀 전개)

- `pii.ssnRrnHandling="deny"` 강제 — build fail if other value (§ 10.1)
- RRN 검사 알고리즘 (asset-ingestion § 9.1 재사용 — 본 문서 stand-alone 위해 알고리즘 명시):
  1. 후보 추출 정규식: `\b\d{6}-?[1-8]\d{6}\b`
  2. 생년월일·성별 코드 유효성 검사 (6자리 YYMMDD + 7번째 자리 1-8)
  3. checksum: 가중치 `[2,3,4,5,6,7,8,9,2,3,4,5]` × 각 자리 합 → `(11-(sum%11))%10`이 마지막 자리와 일치
- 검출 시 (inbound webhook·polling):
  - payload 폐기. CrmRecord 미생성·미갱신
  - CrmWebhookNonceLedger row 보존 + rrnFingerprint (§ 2.3.1) + status="rejected-rrn-recoverable" 또는 "rejected-rrn-final"
  - 운영자 alert + sink alert
- 검출 시 (outbound push):
  - push 차단. solution record는 그대로 유지
  - 운영자 alert + sink alert
- false positive 복구: § 4.2.1 `recoverRrnFalsePositive`

### 7.3 raw PII 실시간 조회 — v1.x (CS-14)

### 7.4 DPA vs patient consent

- DPA: `dpaEvidenceRef` 필수
- consent withdrawal: § 4.8 + CrmConsentWithdrawalLedger
- patientConsentEvidenceRef record-level: v1.x (CS-07)

### 7.5 displayHints expiry + operationalHints expiry (CS4-05)

precedence: legalHold > unregister > expiry > consent withdrawal.

- displayHintsRetentionDays 만료 → displayHints 6 column nulling. ChangeLog tombstone
- operationalHintsRetentionDays 만료 → 준식별자/민감 operationalHints nulling. non-sensitive 유지
- legalHold=true row는 skip

---

## 8. 운영 지표 + acceptance test (CS4-09 — invariant 별 fixture 재편)

### 8.1 핵심 지표 (§ 8.1)

| 지표 | 정의 | 목표 |
|---|---|---|
| sync 성공율 | > 99% | |
| outbound push 지연 p95 | < 5s | |
| inbound webhook 지연 p95 | < 10s | |
| 충돌 발생율 | < 1% | |
| credential 만료 알림 SLA | 7일 | > 95% |
| RRN deny | baseline | |
| RRN false positive 복구 SLA | 24h | > 90% |
| webhook signature reject율 | < 0.1% | |
| nonce ledger dedupe | baseline | |
| changeIdentity ledger dedupe | baseline | |
| outbox 성공율 | > 99% | |
| CAS lost-update 감지율 | baseline | |
| operationalHints small-cell suppression 적중률 | baseline | |
| consent withdrawal 적용 누계 | baseline | |

### 8.2 acceptance test (CS4-09 — invariant 별 fixture)

invariant 별 fixture 구조 (개수보다 invariant coverage):

#### INV-MANIFEST (build-time)
- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)

#### INV-WEBHOOK-DEDUPE (transport-level)
- provider별 valid/invalid signature·rawBody integrity
- timestamp window
- exactly-once 재전송 → duplicate-eventid
- at-least-once + eventId 재전송 → duplicate-eventid-bucket (same bucket)
- at-least-once + eventId 다른 bucket → 정상 처리
- at-least-once + no-eventId → duplicate-digest
- best-effort → duplicate-digest

#### INV-CHANGE-IDENTITY (record-level)
- webhook + polling 동일 변경 → CrmChangeIdentityLedger UNIQUE → 1번만 처리
- 동시 webhook×2 → CrmWebhookNonceLedger 1차로 차단

#### INV-RRN
- regex + checksum 통과 RRN → 폐기 + ledger recoverable
- recoverRrnFalsePositive(override-and-fetch) → accepted-processed
- recoverRrnFalsePositive(abandon) → rejected-rrn-final
- invalid expectedPriorStatus → runtime fail
- dryRun → DB 미변경

#### INV-OUTBOUND-ONLY
- processInboundWebhook direct → runtime fail
- runSync direction=inbound → runtime fail
- webhook endpoint → 404
- CrmFieldMapping direction=inbound → build fail

#### INV-RETRY
- maxAttempts 도달 → exhausted + sink alert
- permanent error class → failed-permanent 즉시
- stale processing (locked_at > 10분) → pending 복귀

#### INV-CREDENTIAL-ROTATION (CS4-02 동시성)
- stable → rotating → committed (성공)
- stable → rotating → reverted (실패)
- **두 rotateCredential 동시 호출 → 두 번째 partial unique 충돌 실패**
- committed → grace-expired (worker)
- grace-expired worker 3회 실패 → super-admin alert
- reverted + resetCredentialRotation → stable (CS4-07)
- resetCredentialRotation invalid expectedIntegrationState → CAS 실패
- rotating 중 outbound + inbound 동시 → 모두 성공 (active·rotating-target 병행 verifier)

#### INV-CAS
- 동시 inbound + outbound 같은 record → 1 성공 + 1 ConflictRecord
- field-level manual resolve 후 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 차단
- providerVersionToken=null → build fail (사전 차단)

#### INV-PII (closed schema)
- 자유 JSON insert → DB CHECK reject
- 정규식 위반 insert → validator reject
- ContactDisplayHints 6 column 외 필드 추가 시도 → 거부
- changedFields allowlist 위반 → 거부

#### INV-OPERATIONAL-HINTS (CS4-05)
- desiredVisitDate + locationKey + departmentHint 결합 small-cell (<5) → masking
- export 시 desiredVisitDate·guardianInvolved 제거
- queryCrmRecords 권한 검사 — operator는 sensitive operationalHints 미반환

#### INV-CONSENT-WITHDRAWAL (CS4-01)
- applyConsentWithdrawal(keyType=piiHash) → matched record displayHints nulling
- applyConsentWithdrawal(keyType=crmExternalId) → crmExternalIdHash로 변환 + matching
- scope=all → displayHints + 준식별자/민감 operationalHints nulling. non-sensitive 보존
- scope=marketing-only → displayHints nulling만
- dryRun → matchedRecordCount만 반환
- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
- 향후 inbound webhook 매칭 → rejected-consent-withdrawn
- 향후 polling 매칭 → skip
- 향후 outbound push 매칭 → blocked-consent-withdrawn

#### INV-UNREGISTER (CS4-06 precedence)
- displayHints nulling·queue cancel·ledger 보존
- legalHold=true row 보존 (audit·credentialAuditLog·ConsentWithdrawalLedger)
- legalHold > unregister snapshot > retention purge

#### INV-PURGE
- retentionDays.changeLog → delete
- retentionDays.syncLog → delete
- retentionDays.conflictRecord → delete (non-open만)
- retentionDays.notificationOutbox → delete (sent·permanent만)
- webhookNonceLedgerRetentionMinutes → delete
- retentionDays.consentWithdrawalLedger + legalHold=false → delete
- legalHold=true → skip
- displayHintsRetentionDays → nulling
- operationalHintsRetentionDays → 준식별자/민감 nulling
- failure → sink alert + 다음 cycle 재시도

#### INV-MIGRATION (CS4-09)
- v0.4 → v0.5 운영 데이터 부재 전제. existing row 0건 cycle
- 만약 운영 데이터 발생 후 column 추가 — backward-compatible (nullable default)

#### INV-CASCADE
- 7종 AuditAction insert 성공
- 4종 NotificationEventType emit 성공
- DATA_MODEL C-08 v0.20 `genericRestApiAdapter` 5필드 + `versionTokenType` cascade 동기화 build validator
- DATA_MODEL C-08 v0.20 `versionTokenJsonPath` 누락 → build fail (CS5-01)

### 8.3 § 10 rule → § 8.2 fixture traceability 표 (CS5-06)

§ 10 build-time / runtime / migration / invariant rule 각각이 INV fixture group에 매핑됨을 보장:

| § 10 rule (build/runtime/invariant) | INV fixture group |
|---|---|
| § 10.1 legalApproved=false | INV-MANIFEST |
| § 10.1 korean-emr provider | INV-MANIFEST |
| § 10.1 appointment enabled | INV-MANIFEST |
| § 10.1 rawPiiStorageAllowed=true | INV-MANIFEST |
| § 10.1 ssnRrnHandling≠deny | INV-MANIFEST |
| § 10.1 dpaEvidenceRef 누락 | INV-MANIFEST |
| § 10.1 outbound-only + 부정합 conflictResolution | INV-MANIFEST + INV-OUTBOUND-ONLY |
| § 10.1 generic-rest-api 5필드 누락 (CS5-01) | INV-MANIFEST |
| § 10.1 versionTokenType ∉ enum (CS5-01) | INV-MANIFEST |
| § 10.1 providerVersionToken=null provider | INV-MANIFEST + INV-CHANGE-IDENTITY |
| § 10.1 liveReadEnabled=true | INV-MANIFEST |
| § 10.1 fieldMappingPolicyVersion 누락 | INV-MANIFEST |
| § 10.1 hashSecrets.* 5종 누락 | INV-MANIFEST |
| § 10.2 webhook signature 실패 | INV-WEBHOOK-DEDUPE |
| § 10.2 replay window 초과 | INV-WEBHOOK-DEDUPE |
| § 10.2 inbound RRN 검출 | INV-RRN |
| § 10.2 outbound RRN 검출 | INV-RRN |
| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
| § 10.2 outbound-only direct invocation | INV-OUTBOUND-ONLY |
| § 10.2 CAS WHERE 0 rows | INV-CAS |
| § 10.2 displayHints closed schema 위반 | INV-PII |
| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
| § 10.2 applyConsentWithdrawal same-request replay (CS5-02) | INV-CONSENT-WITHDRAWAL |
| § 10.2 applyConsentWithdrawal mismatched collision 409 (CS5-02) | INV-CONSENT-WITHDRAWAL |
| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
| § 10.2 rotateCredential row LOCK state≠stable | INV-CREDENTIAL-ROTATION |
| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
| § 10.3 v0.6 migration | INV-MIGRATION |
| § 10.4 RetryQueue stale reclaim | INV-RETRY |
| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
| § 10.4 credential expiry 임박/만료 | INV-CREDENTIAL-ROTATION |
| § 10.4 PII drift 감지 | INV-PII |
| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
| § 10.4 graceExpiry worker 3회 실패 | INV-CREDENTIAL-ROTATION |
| § 10.4 NonceLedger RRN recoverable 24h 무처리 | INV-RRN |
| § 10.4 purge worker — 모든 retention 대상 | INV-PURGE |
| § 10.4 small-cell suppression 적용 (CS5-05) | INV-OPERATIONAL-HINTS |

이 표가 v1.0 안정판의 회귀 방지 traceability matrix.

---

## 9. 설치·설정 — DB 15 tables 마이그레이션 (§ 13)

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

- `enabled=true` + `crmSyncConfig`/`integrations[]` 빈
- `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- integration `legalApproved !== true` 또는 승인자/시각 누락
- integration `dpaEvidenceRef` 누락
- integration `apiKeySecretRef`·`apiUrl` 누락
- bi-directional + `webhookSecret` 누락
- integration `provider` ∉ {salesforce, hubspot, generic-rest-api}
- `provider="generic-rest-api"` + `genericRestApiAdapter` **5필드** 중 누락 (`webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`) — DATA_MODEL C-08 v0.20 SoT
- `provider="generic-rest-api"` + `versionTokenType` ∉ {`epoch-ms`, `integer`, `string`} (CS5-01)
- `requiresFeature: notifications` 충족 안 됨
- `pii.rawPiiStorageAllowed=true`
- `pii.ssnRrnHandling !== "deny"`
- `pii.liveReadEnabled=true`
- `entities.*` 모두 disabled
- `entities.appointment.enabled=true`
- outbound-only mode + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"`
- outbound-only mode + CrmFieldMapping `direction IN (inbound, both)` 존재
- `fieldMappingPolicyVersion` 누락
- `retentionDays.consentWithdrawalLedger`·`operationalHintsRetentionDays`·`purgeWorker.cadenceMinutes` 누락
- `hashSecrets.*` 4개 중 누락
- **provider VerifierResult `providerVersionToken=null` 정의** (v1.0 build validator가 adapter 등록 시점에 검사 — CS4-04)

### 10.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- webhook signature 실패 → HTTP 401
- replay window 초과 → rejected-stale-timestamp
- credential 만료 후 sync 시도 → skipped-credential-expired
- inbound RRN 검출 → 폐기 + sink alert + ledger
- outbound RRN 검출 → 차단 + alert
- `resolveConflict` 시 conflictId 이미 resolved (`expectedResolution` CAS 실패)
- outbound-only + processInboundWebhook direct → runtime fail
- outbound-only + runSync inbound/both → runtime fail
- CAS WHERE 0 rows → ConflictRecord + alert
- displayHints closed schema 위반 → DB CHECK reject + validator alert
- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님 (또는 expectedPriorStatus CAS 실패)
- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
- `resetCredentialRotation` expectedIntegrationState CAS 실패 → runtime fail
- `rotateCredential` 시 integration row LOCK 후 state ≠ stable → runtime fail (이미 rotating 중)
- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)

### 10.3 migration-time validation

- v0.5 cascade 신규:
  - CrmRecord에 operationalHints* column 추가 (nullable)
  - CrmCredentialVersion partial unique 3종 추가 (active·rotating-target·committed 각 1개)
  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
  - CrmChangeIdentityLedger UNIQUE + FK + ON DELETE 정책 (CS4-08)
  - hashSecrets 4종 manifest 누락 시 build fail
- 운영 데이터 부재 전제. 만약 row 존재 시 nullable default로 backward-compatible

### 10.4 runtime invariant·reconcile

- CrmSyncRetryQueue stale (locked_at > 10분) → pending 복귀
- CrmConflictRecord open + slaDeadline 초과 → SLA 미달 알림
- credential expiry 임박 → expiring-soon
- credential 만료 → expired + integration 자동 비활성화
- PII drift 감지 → sink alert + 운영자 정리
- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert
- **CrmCredentialVersion invariant 위반** (active 2개 등) → runtime fail (partial unique로 사전 차단·문서적 fallback alert)
- **purge worker (CS4-06 precedence)**:
  - 우선순위: legalHold > unregister snapshot > retention purge
  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)
  - batch: `purgeWorker.batchSize` (기본 500)
  - 테이블별 액션:
    | 테이블 | action | legal hold default |
    |---|---|---|
    | CrmSyncLog | delete | × |
    | CrmSyncSourceAttempt | delete | × |
    | CrmSyncRetryQueue (status=completed) | delete | × |
    | CrmRecordChangeLog | delete (tombstone 예외) | × (tombstone는 true) |
    | CrmConflictRecord (non-open) | delete | × |
    | CrmCredentialAuditLog | 7년 (audit) | true |
    | CrmWebhookNonceLedger | delete | × |
    | CrmChangeIdentityLedger | delete | × |
    | CrmConsentWithdrawalLedger | legalHold=false 시 delete | **true** (CS4-06) |
    | CrmRecord.displayHints* | nulling | × |
    | CrmRecord.operationalHints* (sensitive) | nulling at operationalHintsRetentionDays | × |
    | CrmSyncNotificationOutbox (sent·permanent) | delete | × |
  - failure → sink alert + 다음 cycle 재시도

### 10.5 warning

- integration `credentialExpiresAt` null
- `pollIntervalMinutes` > 60
- conflict open ≥ 5건 누적
- ledger `duplicate-digest` 비율 > 5%
- outbound-only + webhookSecret 설정됨
- operationalHints small-cell suppression 적중률 > 10%

---

## 11. 미결정 사항

### 11.1 open

| ID | 항목 |
|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 |
| CS-03 | 다중 CRM 통합 우선순위 |
| CS-04 | webhook endpoint 보안 (IP allowlist) |
| CS-05 | OAuth refresh token rotation 자동화 |
| CS-06 | provider별 quota 운영 가이드 |
| CS-08 | LLM 기반 field auto-mapping |
| CS-09 | CrmFieldMapping bulk import/export |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 |
| CS-15 | CONTENT_STANDARDS submission/event cascade — v1.0은 § 3.2 canonical |
| CS-18 | `@provenanceCrmRecordId` 공통 메타 |
| CS-19 | CrmAdminRegionAllowlist 행정구역 lookup table |
| CS-20 | `crmConsoleBaseUrl` config + deep link |
| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
| CS-22 | grace-expired → revoked 자동 정리 정책 (CS5-03) — v1.0은 grace-expired row 보존 |
| CS-23 | `docs/compliance/PRIVACY_COMMON.md` SoT 신설 (CS5-05) — 의료광고 외 일반 privacy 가이드 |

### 11.2 deferred-v1.x

| ID | 항목 | v1.0 영향 |
|---|---|---|
| CS-07 | patientConsentEvidenceRef record-level evidence | v1.0은 § 4.8 + ConsentWithdrawalLedger 최소 범위 |
| CS-11 | CRM → Core 자동 promote | 수동 |
| CS-12 | appointment entity | build fail로 차단 |
| CS-13 | korean-emr provider | build fail로 차단 |
| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |

### 11.3 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CS-01~~ | RRN deny — v0.2 + checksum 재사용 |
| ~~CS-14 v1.0 cascade~~ | liveRead v1.x로 내림 |

### 11.4 known limitations (CS4-09)

- providerVersionToken=null provider는 v1.0 build fail (CS4-04) — record-level dedupe 보장 불가능
- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 21 지적 반영 |
| 2026-05-14 | v0.3 | codex 2차 17 지적 반영 |
| 2026-05-14 | v0.4 | codex 3차 17 지적 반영 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-14 | v0.5 | codex 4차 비평 13 지적 전건 수용 + stand-alone SoT 강화 |
| 2026-05-14 | v0.6 | codex 5차 비평 6 지적 전건 수용 |
| 2026-05-14 | v0.7 | codex 6차 비평 1 지적 정정 (CS6-01) |
| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB **15 tables**)

### 13.1 `CrmIntegration`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationKey` | string | ✅ |
| `provider` | enum (salesforce·hubspot·generic-rest-api) | ✅ |
| `apiKeySecretRef` | secretRef | ✅ |
| `apiUrl` | string | ✅ |
| `webhookSecret` | secretRef | optional |
| `credentialExpiresAt` | Date | optional |
| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
| `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
| `dpaEvidenceRef` | secretRef | ✅ |
| `genericRestApiAdapter` | JSON | optional (provider=generic-rest-api 시 ✅) |
| `mode` | enum (bi-directional·outbound-only) | ✅ |
| `active` | boolean | ✅ |
| `createdAt`·`updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.

### 13.2 `CrmSyncLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `manifestVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `envelopeState` | enum (running·succeeded·partial·failed·retried) | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.syncLog |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.

### 13.3 `CrmSyncSourceAttempt`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `direction` | enum | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
| `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
| `error`·`errorClass` | string·enum | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`.
**Index**: `(expiresAt)`, `(integrationId, status)`.

### 13.4 `CrmSyncRetryQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId`·`entity`·`direction` | various | ✅ |
| `attemptNumber`·`maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum | optional |
| `payloadSnapshot` | JSON (closed-schema field tokens만) | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
**Index**: `(status, nextAttemptAt, lockedAt) WHERE status IN (pending, processing)`.

#### 13.4.1 worker SoT 풀 SQL (search-visibility § 13.5 패턴 9단계)

```sql
-- 1. claim (FOR UPDATE SKIP LOCKED)
WITH next AS (
  SELECT id FROM crm_sync_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempt_number=attempt_number+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- 2. per-integration advisory lock
SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));

-- 3. SourceAttempt insert (transaction 내)
INSERT INTO crm_sync_source_attempt (sync_log_id, integration_id, entity, direction, attempt_number, status, started_at, expires_at)
VALUES ($sl, $int, $ent, $dir, $att, 'processing', now(), now() + $retention);
-- UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber) — 중복 시 race detected

-- 4. provider call (long-running — transaction 밖)

-- 5. SourceAttempt finalize
UPDATE crm_sync_source_attempt SET status=$status, completed_at=now(), error=$err, error_class=$ec, records_inbound=$ri, records_outbound=$ro, conflicts_detected=$cd
WHERE sync_log_id=$sl AND integration_id=$int AND entity=$ent AND direction=$dir AND attempt_number=$att;

-- 6. envelopeState 재계산
WITH agg AS (
  SELECT bool_and(status='success') AS all_success,
         bool_or(status IN ('failed-permanent','failed-credential','failed-quota')) AS any_failed,
         bool_or(status='in-retry-queue') AS any_retry
  FROM crm_sync_source_attempt WHERE sync_log_id=$sl
)
UPDATE crm_sync_log SET envelope_state=CASE
  WHEN (SELECT all_success FROM agg) THEN 'succeeded'
  WHEN (SELECT any_retry FROM agg) THEN 'retried'
  WHEN (SELECT any_failed FROM agg) THEN 'failed'
  ELSE 'partial' END, completed_at=now()
WHERE id=$sl;

-- 7. queue 완료/재등록
UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null WHERE id=$qid;

-- 8. stale reclaim (별도 worker — cadence 1분)
UPDATE crm_sync_retry_queue SET status='pending', locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';

-- 9. exhausted/permanent
UPDATE crm_sync_retry_queue SET status='exhausted'
WHERE id=$id AND attempt_number >= max_attempts;
UPDATE crm_sync_retry_queue SET status='failed-permanent'
WHERE id=$id AND last_error_class='permanent';
-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
```

advisory lock ordering: integration → record.

### 13.5 `CrmRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `crmExternalId` | string | optional |
| `crmExternalIdHash` | char(64) | optional — § 2.3.1 |
| `solutionRecordRef` | string | optional |
| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
| `lastAppliedConflictVersion` | integer | optional |
| `lastSyncedAt` | Date | ✅ |
| `piiHash` | char(64) | optional |
| `displayHintsNameInitial` | varchar(8) | optional — CHECK |
| `displayHintsPhoneLast4` | char(4) | optional — CHECK |
| `displayHintsEmailDomain` | varchar(64) | optional — CHECK |
| `displayHintsCityName` | varchar(32) | optional — CHECK |
| `displayHintsGenderHint` | enum | optional |
| `displayHintsAgeBand` | enum | optional |
| `operationalHintsEntityStatus` | varchar(32) | optional |
| `operationalHintsInquiryType` | varchar(32) | optional |
| `operationalHintsChannelType` | varchar(32) | optional |
| `operationalHintsLocationKey` | varchar(32) | optional |
| `operationalHintsDepartmentHint` | varchar(32) | optional |
| `operationalHintsDesiredVisitDate` | Date | optional |
| `operationalHintsGuardianInvolved` | boolean | optional |
| `operationalHintsRelationToInstitution` | varchar(32) | optional |
| `operationalHintsPreferredChannelType` | varchar(32) | optional |
| `consentWithdrawn` | boolean | ✅ default false |
| `piiRetentionExpiresAt` | Date | optional |
| `operationalHintsRetentionExpiresAt` | Date | optional |

**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`. `UNIQUE(instanceId, integrationId, entity, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`.
**CHECK**: PostgreSQL canonical 정규식 (§ 3.2.1).
**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiHash) WHERE piiHash IS NOT NULL`, `(crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(consentWithdrawn) WHERE consentWithdrawn=true`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`, `(operationalHintsRetentionExpiresAt) WHERE operationalHintsRetentionExpiresAt IS NOT NULL`.

### 13.6 `CrmRecordChangeLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `direction` | enum | ✅ |
| `changedFields` | JSON (allowlisted token + masked value) | ✅ |
| `priorSnapshot`·`newSnapshot` | JSON (동일 제약) | optional |
| `tombstone` | boolean | ✅ default false |
| `appliedAt`·`appliedBy` | Date·string | ✅ |
| `expiresAt` | Date | ✅ |

**Index**: `(crmRecordId, appliedAt DESC)`, `(expiresAt)`, `(tombstone) WHERE tombstone=true`.

### 13.7 `CrmFieldMapping`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `entity` | enum | ✅ |
| `solutionFieldPath`·`crmFieldPath` | string | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `authority` | FieldAuthority | ✅ |
| `transformerRef` | string | optional |
| `policyVersion` | string | ✅ |
| `active` | boolean | ✅ |

**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.

build-time: instance mode="outbound-only" + 본 테이블 `direction IN (inbound, both)` 존재 → build fail.

### 13.8 `CrmConflictRecord`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `fieldPath` | string | ✅ |
| `baseVersion` | integer | ✅ |
| `observedCrmVersion`·`observedSolutionVersion` | integer | ✅ |
| `crmProposedValue`·`solutionProposedValue` | masked field token + value | ✅ |
| `resolution` | enum (open·crm-wins·solution-wins·manual-resolved·manual-rejected) | ✅ |
| `winningVersion`·`appliedFieldVersion` | integer | optional |
| `resolvedBy`·`resolvedAt` | string·Date | optional |
| `slaDeadline` | Date | ✅ — open 기준 7일 |
| `expiresAt` | Date | ✅ |

**Index**: `(crmRecordId, fieldPath, appliedFieldVersion)`, `(resolution, slaDeadline) WHERE resolution='open'`, `(expiresAt)`.

### 13.9 `CrmCredentialAuditLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `event` | enum (rotated·rotation-failed·grace-expired·expired·expiring-soon·reset) | ✅ |
| `rotationAttemptId` | UUID | optional |
| `priorCredentialFingerprintPrefix`·`newCredentialFingerprintPrefix` | char(16) | optional |
| `actor` | string | ✅ |
| `occurredAt` | Date | ✅ |

**Index**: `(integrationId, occurredAt DESC)`.

### 13.10 `CrmRateLimitState`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
| `tokensRemaining` | number | ✅ |
| `quotaResetAt` | Date | ✅ |
| `nextAllowedAt` | Date | optional |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `secretRef` | secretRef | ✅ |
| `secretVersionId` | string | ✅ |
| `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
| `credentialFingerprint` | char(64) | ✅ |
| `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
| `activatedAt` | Date | ✅ |
| `graceUntil` | Date | optional |
| `revokedAt` | Date | optional |
| `expiresAt` | Date | optional |
| `rotationAttemptId` | UUID | optional |

**Constraints (CS4-02 강제)**:
- `UNIQUE(integrationId, secretVersionId)`
- `UNIQUE(integrationId) WHERE state='active'` — partial unique
- `UNIQUE(integrationId) WHERE state='rotating-target'` — partial unique
- `UNIQUE(integrationId) WHERE state='committed'` — partial unique

→ 동시 rotateCredential 시 partial unique 충돌로 두 번째 호출 자동 실패.

**Index**: `(integrationId, state)`, `(expiresAt)`, `(graceUntil) WHERE state='committed'`.

### 13.12 `CrmWebhookNonceLedger` — **transport-level dedupe (CS4-04)**

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `providerEventId` | string | optional |
| `canonicalDigest` | char(64) | ✅ |
| `receivedBucket` | bigint | ✅ |
| `signatureDigest` | char(64) | ✅ |
| `deliveryKind` | enum | ✅ |
| `receivedAt` | Date | ✅ |
| `status` | enum (accepted-pending·accepted-processed·rejected-rrn-recoverable·rejected-rrn-final·rejected-parse-recoverable) | ✅ |
| `rrnFingerprint` | char(64) | optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL AND deliveryKind='exactly-once'`
- `UNIQUE(integrationId, providerEventId, receivedBucket) WHERE providerEventId IS NOT NULL AND deliveryKind='at-least-once'`
- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL OR deliveryKind='best-effort'`

**Index**: `(expiresAt)`, `(integrationId, status, receivedAt DESC)`, `(status, receivedAt) WHERE status='rejected-rrn-recoverable'`.

### 13.13 `CrmChangeIdentityLedger` — **record-level dedupe (CS4-04·08)**

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `entity` | enum | ✅ |
| `crmExternalId` | string | ✅ |
| `providerVersionToken` | string | ✅ — v1.0 required (CS4-04) |
| `changeIdentityKey` | char(64) | ✅ |
| `source` | enum (webhook·polling) | ✅ |
| `receivedAt` | Date | ✅ |
| `processedSyncLogId` | UUID | optional — FK § 13.2 ON DELETE SET NULL (CS4-08) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(changeIdentityKey)`. `FK integrationId ON DELETE RESTRICT`. `FK processedSyncLogId → crm_sync_log.id ON DELETE SET NULL`.
**Index**: `(integrationId, entity, crmExternalId, receivedAt DESC)`, `(expiresAt)`.

### 13.14 `CrmConsentWithdrawalLedger` (CS4-01·08)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `keyType` | enum (`piiHash`·`crmExternalIdHash`) | ✅ |
| `piiHash` | char(64) | optional |
| `crmExternalIdHash` | char(64) | optional |
| `scope` | enum (`all`·`marketing-only`) | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ — § 2.3.1 (CS5-02) |
| `appliedBy` | string | ✅ |
| `appliedAt` | Date | ✅ |
| `displayHintsNulled` | boolean | ✅ |
| `operationalHintsNulledMap` | JSON (field별 boolean) | ✅ |
| `tombstoneChangeLogIds` | UUID[] | ✅ |
| `matchedRecordCount` | integer | ✅ |
| `dryRun` | boolean | ✅ |
| `reason` | string | ✅ |
| `legalHold` | boolean | ✅ default true (CS4-06) |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints (CS4-08)**:
- `CHECK ((key_type='piiHash' AND pii_hash IS NOT NULL AND crm_external_id_hash IS NULL) OR (key_type='crmExternalIdHash' AND crm_external_id_hash IS NOT NULL AND pii_hash IS NULL))`
- `UNIQUE(integration_id, pii_hash, scope) WHERE pii_hash IS NOT NULL`
- `UNIQUE(integration_id, crm_external_id_hash, scope) WHERE crm_external_id_hash IS NOT NULL`
- `UNIQUE(integration_id, idempotency_key)`
- `FK integrationId ON DELETE RESTRICT`

**Index**: `(integration_id, pii_hash) WHERE pii_hash IS NOT NULL`, `(integration_id, crm_external_id_hash) WHERE crm_external_id_hash IS NOT NULL`, `(expires_at) WHERE legal_hold=false`.

### 13.15 `CrmSyncNotificationOutbox`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (sync-log·conflict·credential-version) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·failed·permanent) | ✅ |
| `attempts` | integer | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt`·`sentAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, createdAt) WHERE status='pending'`, `(expiresAt)`.

---

**총 15개 admin DB 테이블** — 각 절 stand-alone schema:

| § | 테이블 | 핵심 invariant |
|---|---|---|
| 13.1 | CrmIntegration | partial unique active+integrationKey |
| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
| 13.3 | CrmSyncSourceAttempt | UNIQUE(syncLog, integration, entity, direction, attempt) |
| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
| 13.6 | CrmRecordChangeLog | FK RESTRICT + tombstone flag |
| 13.7 | CrmFieldMapping | mode outbound-only inbound direction build fail |
| 13.8 | CrmConflictRecord | resolution open 7일 SLA |
| 13.9 | CrmCredentialAuditLog | 7년 audit retention |
| 13.10 | CrmRateLimitState | bucketKey UNIQUE |
| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
| 13.12 | CrmWebhookNonceLedger | deliveryKind별 3분기 partial unique |
| 13.13 | CrmChangeIdentityLedger | UNIQUE changeIdentityKey + processedSyncLogId FK SET NULL |
| 13.14 | CrmConsentWithdrawalLedger | CHECK XOR + 3종 UNIQUE + legalHold default true |
| 13.15 | CrmSyncNotificationOutbox | UNIQUE(sourceKind, sourceId, eventType) |


 succeeded in 743ms:
# Feature — content-migration

> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외 — anchor residue 정정 완료)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (**6종** NotificationEventType + **15종** AuditAction cascade 완료)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff → § 1.3
> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
- **vs DB DDL**: DDL은 인프라. 본 Feature는 데이터 backfill만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
- **DB 인벤토리 (CM5-01 정정)**: **12 tables** (§ 12.1 ~ § 12.12 — PolicyReevaluateRecord 별도 table 승격·ActiveTargetLock 신설)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM3-18 catalog 추가)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| reportingMode default 변경 | **MAJOR** | policyVersion 신규 | |
| read-only window writeClass 세분화·정책 변경 | **MAJOR** | policyVersion 신규 | |
| irreversible skip 정책 변경 | **MAJOR** | policyVersion 신규 | |
| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
| Run status enum·substate 변경 | **MAJOR** | policyVersion 신규 | |
| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |

### 1.3 본 문서가 다루지 않는 영역

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
| DB DDL | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW (policy-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 6종 NotificationEventType (CM6-01) |
| REVIEW_WORKFLOW § 10.2.1 | 15종 AuditAction (CM6-01) |
| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() + cacheKey |
| asset-ingestion | promote handoff + body MV 보호 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
  featureLegalApproved: true
  featureLegalApprovedBy: "legal@glitzy.kr"
  featureLegalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"
  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "1.0.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
            # derived rule: criticality ∈ {high, critical} (REVIEW_WORKFLOW § 9.1.1 SoT)
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
          dispatchOtherEventsQueueUntilWindowEnd: true
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"
        impactSamplingSize: 100
        criticalClassFullDiff: true
        digest:
          chunkSize: 10000
          maxRowsBeforeSnapshot: 1000000
      policyVersionReevaluate:
        concurrencyLimit: 10
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true
        defaultReportingMode: "risk-based"
        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
        staleFlagsOnlyOverrideConditions:
          maxRiskLevel: "low"
          requiresNoLegalSensitiveEntityChange: true     # CM4-08
          requiresNoLegalEntityIdentityChange: true      # CM4-08
          requiresNoPriorReviewRequiredChange: true
      retentionDays:
        plan: 1095; run: 730; step: 730; dryRunReport: 30
        legalApproval: 2555; rollbackLog: 1095; readOnlyWindow: 730
        stepRetryQueueCompleted: 30; notificationOutbox: 30
        policyReevaluateBatch: 730
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

### 2.4 CAS digest 알고리즘 SoT

| digest | 정의 |
|---|---|
| `planFingerprint` | HMAC-SHA256(planFingerprintPepperRef, canonical(plan body)). char(64) |
| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
| `contentHashDigest` | step별 read-set field projection canonical JSON → chunked Merkle |
| `sourceSnapshotWatermark` | source table별 MAX(updated_at) + deletion ledger high watermark + version vector. canonical digest |
| `policyVersionSnapshot` | (contentMigrationPolicyVersion + complianceAssistantPolicyVersion + ruleCatalogVersion + ruleFileHashes + REVIEW_WORKFLOW version + piiFieldCatalogRef + entityFieldProjectionCatalogRef) canonical digest |
| `stepRegistryVersion` | step type registry 카탈로그 hash |
| `legalImpactClassificationDigest` | classifierVersion + classes[] canonical digest |
| `requestFingerprint` | command별 (§ 3.4) |
| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |

dry-run/apply preflight 동일 함수. 비용 상한 § 2.3 `digest`.

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CM3-19 metadata 일관화)

| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
|---|---|---|---|---|---|
| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
| read | `queryRuns` (privacy class) | | 동일 | — | — |
| read | `queryStepResults` (closed schema masking) | | 동일 | — | — |

### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)

**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.

| AuditAction (canonical) | 추가 metadata |
|---|---|
| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |

### 3.2 plan kind 6종 (CM3-16 — 풀 전개)

#### 3.2.1 `application-data-version-upgrade`
DATA_MODEL 버전 업그레이드 시 **데이터 backfill·정규화만**. column add/rename DDL은 인프라 책임. 본 plan kind는 column 존재·nullable·default를 read-only 검증 후 데이터만 채움.

#### 3.2.2 `feature-activation-backfill`
신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).

#### 3.2.3 `instance-to-instance-copy`
분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.

#### 3.2.4 `content-bulk-transform`
design token 변경·brand 변경 시 콘텐츠 일괄 재생성. **asset-ingestion body MV는 변경 금지** (mutableFieldDenylist).

#### 3.2.5 `policy-version-reevaluate`
CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 — § 4.8 batch contract.

#### 3.2.6 `routing-slug-preservation`
asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계. step 필수: `redirect-map-apply`·`slug-preserve`·`compliance-history-link`.

### 3.3 DTO

```ts
type MigrationPlanKind = /* 6종 */;
type RollbackClass = "reversible" | "compensating" | "irreversible";

type DefinePlanInput = {
  planKind: MigrationPlanKind;
  title: string; description: string;
  targetSelector: TargetSelector;
  steps: MigrationStep[];
  scheduledStart?: Date;
  readOnlyWindowMinutes?: number;
  idempotencyKey: string;
};

type MigrationStep = {
  stepKey: string;
  stepType: string;                                      // step registry 등록
  inputs: Record<string, unknown>;                       // registry inputSchema strict
  rollbackClass: RollbackClass;
  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
  blastRadiusCap?: number;                              // irreversible 필수
  backupSnapshotRequired?: boolean;                     // irreversible 필수
  retryable: boolean;
};

type LegalImpactClassification = {
  legalGateRequired: boolean;
  classes: LegalImpactClass[];
  classifierVersion: string;
  unknownClassesEncountered: boolean;                    // true → fail-closed
};

type LegalImpactClass =
  | "pii" | "legal-document" | "review-policy" | "pricing-page"
  | "before-after-media" | "testimonial-review" | "prior-review-required" | "cross-entity-copy";

// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
type RunApplyInput = {
  planId: string;
  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
  applyPreflightToken: string;                          // server에서 dry-run 후 발급 (§ 3.5)
  forceProceedDespiteWarnings?: boolean;                // legal/critical warning에는 적용 안 됨
  idempotencyKey: string;
};

type RunApplyResult = {
  runId: string;
  status: "running";
  digestBundleVerified: { /* 8필드 + 일치 여부 */ };
};

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
  expectedStatus: RunPrimaryStatus;                     // CAS
  idempotencyKey: string;
};

type SkipStepInput = {
  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
  idempotencyKey: string;
};

// CM4-05 신규
type MarkStepCompensatedInput = {
  stepResultId: string;
  compensationDescription: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  idempotencyKey: string;
};

// CM4-05 신규
type AbortRunInput = {
  runId: string;
  reason: string;
  approver: string;
  operationalTicketRef: string;
  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
  idempotencyKey: string;
};

// CM3-04 + CM4-08 — legalEntityChanged 분해
type PolicyReevaluateResult = {
  complianceRecordId: string;
  previousRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  newRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  riskDelta: "decreased" | "unchanged" | "increased";
  priorReviewRequiredChanged: boolean;
  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
  forcedReportingMode: "stale-flags-only" | "new-record-version";
  forcedReportingModeReason?: string;
};

// CM3-11 — Run status decomposition
type RunPrimaryStatus =
  | "pending" | "running" | "paused"
  | "completed" | "failed" | "cancelled"
  | "rolling-back" | "rolled-back";

type RunRemediationStatus =
  | "none"
  | "blocked-manual-remediation-required"
  | "cancellation-timeout-manual-review";

type RunRollbackOutcome =
  | "none" | "full" | "partial" | "failed";
```

### 3.4 idempotencyKey + requestFingerprint (CM3-19)

| command | scope | requestFingerprint |
|---|---|---|
| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64) opaque
3. client에 (dryRunReportId, applyPreflightToken) 둘 다 반환

runApply(input) — server:
1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
2. token 재계산 비교 — 불일치 시 → 401/CAS fail
3. expiresAt(retentionDays.dryRunReport) 초과 시 → re-dry-run 강제 (CAS fail)
4. **digestComputationMode별 invalidation precheck** (CM4-02):
   - mode="full": 8필드 모두 server-side 재계산 → 비교
   - mode="snapshot": targetSetDigest·contentHashDigest는 snapshot 사용 (재계산 skip). policyVersionSnapshot·classifierVersion·catalog refs만 재계산
   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
```

### 3.6 step type registry 최소 계약 (CM2-17 + CM3-02·CM3-10)

```ts
type StepTypeContract = {
  stepType: string;
  inputSchema: JsonSchema;                              // strict — additionalProperties=false
  outputSchema: JsonSchema;
  targetEntityTypes: EntityTypeEnum[];                  // CM3-05 — DATA_MODEL entity enum
  readSetProjection: FieldProjection[];                 // entityFieldProjectionCatalogRef 통과
  writeSetProjection: FieldProjection[];                // 동일
  rollbackClassDefault: RollbackClass;
  legalClassHints: LegalImpactClass[];
  cancellationSupport: {
    supportsCooperativeCancellation: boolean;
    cancellationCheckInterval: number;
    maxUninterruptibleSeconds: number;
    transactionBoundary: "per-row" | "per-chunk" | "per-step";
  };
  partialWriteDetector: PartialWriteStrategy;           // CM3-10
  dryRunCostEstimateSecondsPerThousandRows: number;
  mutableFieldAllowlist?: string[];
  mutableFieldDenylist?: string[];                      // asset-ingestion body MV 포함
};

// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }
  | { kind: "chunked-returning"; chunkSize: number }
  | { kind: "append-only-watermark";
      watermarkField: string;
      lowerBound: string;                                // CM4-03 — 시작 watermark
      exclusiveUpperBound: string;                       // CM4-03
      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
      expectedInsertedCount: number;                     // CM4-03
      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
    }
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };
```

asset-ingestion `ExtractedContent.body` MV는 default `mutableFieldDenylist`.

### 3.7 writeSetManifest (CM2-06 + CM3-10)

각 step 실행 시 StepResult에 기록:

```ts
type WriteSetManifest = {
  strategy: PartialWriteStrategy["kind"];
  expectedAffectedRows: number;
  actualAffectedRows: number;
  beforeDigest?: string;                                // small-rowid-merkle만 사용
  afterDigest?: string;
  committedRowIds?: string[];                            // small
  chunkIds?: string[];                                   // chunked-returning
  highWatermark?: { before: string; after: string };    // append-only-watermark
  expectedAfterProjectionHash?: string;                  // deterministic-transform
  actualAfterProjectionHash?: string;
  transactionBoundary: "per-row" | "per-chunk" | "per-step";
  compensationStatus: "not-needed" | "pending" | "applied" | "failed";
  invariantQueryResults: Array<{ name: string; passed: boolean }>;
  isolationLevel: "read-committed" | "repeatable-read" | "serializable";
};
```

partial write 감지 트리거 (strategy별):
- `small-rowid-merkle`: beforeDigest + expected → afterDigest 불일치
- `chunked-returning`: actualAffectedRows ≠ expectedAffectedRows 또는 invariantQueryResults에 fail
- `append-only-watermark` (CM4-03):
  - watermark 역행
  - actualInsertedCount ≠ expectedInsertedCount
  - `[lowerBound, exclusiveUpperBound)` 범위에 writerId ≠ 본 run row 발견 (phantom row)
  - concurrencyMode=serializable일 때 isolation level 미적용 → step abort
  - concurrencyMode=advisory-lock-range일 때 `pg_advisory_xact_lock(hashtext('cm:append:' + watermarkField + ':' + lowerBound))` 미획득 → step abort
- `deterministic-transform`: actualAfterProjectionHash ≠ expectedAfterProjectionHash

### 3.8 read API privacy class (CM3-20 — StepResult schema)

```ts
type StepResultRow = {
  id: string;
  runId: string;
  stepKey: string;
  status: StepResultStatus;
  inputSummary: ClosedSchemaSummary;                    // PII 미포함 요약 (필드 token + masked value)
  outputSummary: ClosedSchemaSummary;
  diffDisplayHints: ClosedSchemaSummary;                // crm-sync § 3.2.1 패턴
  rawArtifactRef?: string;                              // S3·blob ref (rawArtifactRef 권한 별도)
  rawArtifactRetentionExpiresAt?: Date;
  privacyClass: "non-pii" | "pii" | "legal-sensitive";
  containsPii: boolean;
  exportAllowed: boolean;                               // PII step은 false 강제
  writeSetManifest: WriteSetManifest;
  startedAt: Date; completedAt?: Date;
};
```

| field | operator | super-admin | legal-reviewer | export |
|---|---|---|---|---|
| inputSummary·outputSummary·diffDisplayHints (non-pii) | 허용 | 허용 | 허용 | 허용 |
| inputSummary·outputSummary·diffDisplayHints (pii·legal-sensitive) | masked | masked | full | export 금지 |
| rawArtifactRef (containsPii=true) | 차단 | 허용 (audit 기록) | 허용 (audit 기록) | export 금지 |
| writeSetManifest.beforeDigest/afterDigest | 허용 (hash) | 허용 | 허용 | 허용 |

---

## 4. 실행 파이프라인

### 4.1 정의 → validate → dry-run → legal 게이트 → apply

```
1. definePlan: ContentMigrationPlan row insert (status=draft·planFingerprint)
2. validatePlan:
   - step type registry 등록 + inputSchema strict
   - rollbackClass별 reverse/compensating/blastRadius 검증
   - cooperativeCancellation 미지원 + transactionBoundary != per-chunk → **validate fail (CM3-02 승격)**
   - maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes 초과 → validate fail
   - legalImpactClassifier 실행 (§ 4.7)
   - writeSetProjection·mutableFieldAllowlist를 piiFieldCatalogRef·entityFieldProjectionCatalogRef로 catalog-against validation
   - unknownClassesEncountered=true → fail-closed
   - audit plan-validated
3. runDryRun:
   - 8필드 digest 산정 + sampling (deterministic-stratified, legal/PII full diff)
   - DryRunReport insert
   - applyPreflightToken 발급 (§ 3.5)
   - audit dry-run-completed
4. legalGateRequired=true → approvePlanLegalGate:
   - ContentMigrationLegalApproval insert (dryRunReportId·8필드 snapshot·approvedDigestBundleHash — CM3-13)
   - audit plan-legal-approved + 알림 plan-legal-approved
5. runApply(input):
   - input.applyPreflightToken으로 server-side 8필드 재계산·비교 (§ 3.5)
   - DryRunReport expiresAt CAS
   - legalGateRequired=true 시 expectedLegalApprovalId 필요 — DryRunReport 일치 확인
   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
   - ContentMigrationRun insert (primaryStatus=running)
   - read-only window 적용 (§ 4.5)
   - step 순차 — writeSetManifest 기록
   - 알림 run-completed/run-failed
```

### 4.2 rollback

```
rollbackRun:
1. expectedStatus CAS
2. audit rollback-triggered + 알림 rollback-triggered
3. step 역순 처리:
   - reversible: reverseStep
   - compensating: compensatingStep
   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
5. rollback 실패 → rollbackOutcome=failed + super-admin alert
6. audit rollback-applied
```

### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)

#### 4.3.1 명령별 transition

| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point | paused·none·none |
| resumeRun | paused·none·none | 다음 step | running·none·none |
| cancelRun | pending | step 미진행 | cancelled·none·none |
| cancelRun | running·none | cooperative cancellation 요청. 종료 후 partial commit 검사. partial 발견 시 자동 rollback | cancelled·none·none / rolling-back·none·none |
| cancelRun | paused·none·none | 동일 partial commit 검사 | cancelled·none·none / rolling-back·none·none |
| rollbackRun | completed·failed·cancelled·paused (none·none) | reverse 시작 | rolling-back·none·none |
| (rollback 완료) | rolling-back·none | 모든 step reversible → full | rolled-back·none·**full** |
| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
| pause + cooperative 미지원 timeout (§ 4.5 stepTimeoutSeconds 초과) | running·none | step row lock 해제 | running·**cancellation-timeout-manual-review**·none |
| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |

#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)

```sql
CHECK (
  (primary_status='pending'      AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='running'      AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome='none') OR
  (primary_status='paused'       AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='completed'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='failed'       AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome IN ('none','failed')) OR
  (primary_status='cancelled'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='rolling-back' AND remediation_status IN ('none','blocked-manual-remediation-required') AND rollback_outcome='none') OR
  (primary_status='rolled-back'  AND remediation_status='none' AND rollback_outcome IN ('full','partial'))
)
```

**partial-rollback은 별도 primaryStatus 아님** — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)

| 조건 | 동작 |
|---|---|
| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |

### 4.5 read-only window writeClass (CM3-03 dispatch 정정)

| writeClass | 정의 | 정책 |
|---|---|---|
| `content-mutating` | Core 콘텐츠 row 변경 | 차단 |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 | 큐잉 |
| `feature-operational` | asset promote·crm conflict resolve 등 | 차단 |
| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
| `notification-read-receipt` | inApp 읽음 표시 | 큐잉 |
| `notification-digest-state` | digest 집계 | 큐잉 |
| `audit-append` | append-only audit | 허용 |

`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).

### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1, last_attempt_at=now()
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE content_migration_notification_outbox
SET status='sent', sent_at=now(), locked_at=null
WHERE id=$id;

-- transient fail (backoff 적용)
UPDATE content_migration_notification_outbox
SET status='pending', locked_at=null, last_error=$err,
    next_attempt_at = now() + (interval '1 second' * (CASE attempts
      WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800 WHEN 4 THEN 7200 ELSE 21600 END))
WHERE id=$id;

-- exhausted (attempts >= 5)
UPDATE content_migration_notification_outbox
SET status='permanent', locked_at=null
WHERE id=$id AND attempts >= 5;
-- + sink alert

-- stale reclaim (별도 worker — cadence 1분)
UPDATE content_migration_notification_outbox
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '5 minutes';
```

status enum: `pending`·`processing`·`sent`·`permanent`. (CM3-14 — `failed` 제거)

### 4.7 legalImpactClassifier (CM3-05 — catalog input)

| class | deterministic rule |
|---|---|
| `pii` | step.readSetProjection ∩ piiFieldCatalogRef 또는 writeSetProjection ∩ piiFieldCatalogRef ≠ ∅ |
| `legal-document` | targetEntityTypes에 `LegalDocument` ∈ entityFieldProjectionCatalogRef |
| `review-policy` | targetEntityTypes에 `ReviewPolicy` |
| `pricing-page` | targetEntityTypes에 `PricingPage` 또는 `PricingPolicy` |
| `before-after-media` | readSet/writeSet에 priorReviewRequired trigger catalog의 before/after media field |
| `testimonial-review` | targetEntityTypes에 `Testimonial`·`Review` |
| `prior-review-required` | priorReviewRequired trigger catalog 영향 field |
| `cross-entity-copy` | planKind=instance-to-instance-copy 또는 sourceInstance != targetInstance |

unknown step type 또는 catalog 매칭 실패 → `unknownClassesEncountered=true` → fail-closed.

step의 self-declared `legalClassHints`만 신뢰하지 않음 — `writeSetProjection`·`mutableFieldAllowlist`를 catalog로 cross-validate (CM3-05).

**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.

retroactive audit — false-negative 발견 시 영향 plan 재평가 절차는 CM-09 v1.x (운영 정책).

### 4.8 policy-version-reevaluate batch (CM3-04·CM3-15)

```
config.defaultReportingMode="risk-based":
1. 대상 ComplianceRecord 조회
2. cacheKey 산정 (compliance-assistant § 8) — durable cache hit:
   - check() 호출 skip
   - cachedResultRef 기록
3. concurrencyLimit·rateLimitPerSecond 적용
4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04 + CM4-08·CM5-06):
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·**legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff** 산정 (CM4-08·CM5-06 — legalEntityChanged 단일 boolean 폐기)
5. forcedReportingMode 결정 (CM4-08):
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.10)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — 6종)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |

---

## 6. 운영 지표 + acceptance test invariant

### 6.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| ApplyPreflightToken mismatch 차단율 | 100% | |
| legalImpactClassifier unknown fail-closed 비율 | baseline | |
| skip irreversible 발생율 | baseline (운영 review) | |
| partial write → rollback 트리거 비율 | baseline | |
| read-only window 차단 write | baseline | |
| policy-reevaluate risk-based new-record-version 비율 | baseline | |
| dry-run targetSetDigest match | 100% | |
| dry-run changedRowCount delta | < 1% | |
| dry-run fieldDiff delta | < 5% | |
| dry-run blockedDriftCount | baseline | |
| rollback 성공율 | > 99% | |
| outbox 발송 성공율 | > 99% | |

### 6.2 invariant ↔ § 9 fail/invariant rule 1:1 traceability (CM3-17)

| Invariant ID | § 9 rule | 영역 |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
| INV-LEGAL-UNKNOWN-CLASS | § 9.2 unknownClassesEncountered | legal-classifier |
| INV-LEGAL-OVERRIDE | § 9.2 forceProceedDespiteWarnings legal/critical 시도 | legal override |
| INV-LEGAL-APPROVAL-LINK | § 9.2 expectedLegalApprovalId 누락 (legalGateRequired) | legal-approval |
| INV-ROLLBACK-IRREVERSIBLE | § 9.2 irreversible encountered | rollback |
| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
| INV-READONLY-CONTENT | § 9.2 content-mutating 차단 | read-only-window |
| INV-READONLY-DISPATCH | § 9.2 dispatchAllowlist 외 즉시 dispatch 차단 | read-only-window |
| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
| INV-POLICY-REEVAL-RISK | § 9.2 priorReview·legalEntity·Critical → new-record-version 강제 | policy |
| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
| INV-COOP-CANCEL-FAIL | § 9.3 cooperativeCancellation 미지원 + non-per-chunk → validate fail | step-registry |
| INV-CANCEL-TIMEOUT | § 9.2 cancellation-timeout-manual-review 진입 | state-machine |
| INV-STEP-REGISTRY | § 9.3 inputSchema strict | step-registry |
| INV-PRIVACY-EXPORT | § 9.2 PII step exportAllowed=false | privacy |
| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
| INV-RUN-ACTIVE-UNIQUE | § 9.2 partial unique (planId WHERE active) | concurrency |
| INV-CATALOG-VALIDATION | § 9.3 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate | classifier |
| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |

### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)

| INV ID | happy fixture | violation fixture |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
| INV-LEGAL-UNKNOWN-CLASS | 등록 step + catalog 매칭 → classification 완료 | unknown step type → fail-closed (legalGateRequired=true) |
| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings + low risk warning → 진행 | forceProceedDespiteWarnings + legal-required warning → 거부 |
| INV-LEGAL-APPROVAL-LINK | legalGateRequired=true + 일치 LegalApproval → 200 | 일치 LegalApproval 없음 → fail |
| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
| INV-ROLLBACK-SKIP | super-admin + remediationTicketRef 제공 → skipped | remediationTicketRef 누락 → runtime fail |
| INV-PARTIAL-WRITE | actualAffectedRows = expected → 정상 | invariantQueryResults에 fail → rollback 우선 |
| INV-READONLY-CONTENT | window 종료 후 write → 정상 | window 중 content-mutating write → rejected |
| INV-READONLY-DISPATCH | allowlist 이벤트 즉시 dispatch → 정상 | 외 이벤트 즉시 dispatch → queued |
| INV-IDEMPOTENCY-REPLAY | 동일 fingerprint 재요청 → 기존 결과 (no-op) | mismatched fingerprint → 409 |
| INV-IDEMPOTENCY-COLLISION | 동일 → ok | 다른 input → 409 |
| INV-OUTBOX-SOURCE-EVENT | 신규 sourceEventId → row insert | 동일 sourceEventId → unique violation |
| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
| INV-POLICY-REEVAL-RISK | low + no legal/priorReview → stale-flags-only | priorReview true → new-record-version 강제 |
| INV-POLICY-REEVAL-OVERRIDE | low + no legal·priorReview 변화 + stale-flags-only override → 허용 | high risk + stale-flags-only override 시도 → 거부 |
| INV-COOP-CANCEL-FAIL | supportsCooperativeCancellation=true 또는 transactionBoundary=per-chunk → validate ok | supportsCooperativeCancellation=false + non-per-chunk → validate fail |
| INV-CANCEL-TIMEOUT | timeout 이전 cancel → cancelled | timeout 도달 → cancellation-timeout-manual-review |
| INV-STEP-REGISTRY | inputSchema strict 통과 → validate ok | additionalProperties=true → validate fail |
| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |

---

## 7. compliance-assistant 예외

ContentMigrationPlan·DryRunReport·StepResult는 `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.

`policy-version-reevaluate` 실행 결과로 ComplianceRecord 재생성 시 새 record는 REVIEW_WORKFLOW § 8 lifecycle 진입 (개별 콘텐츠 contentType 유지). `contentType` 예외 cascade 불필요.

---

## 8. 설치·설정 — DB 10 tables (§ 12)

---

## 9. 빌드·런타임·migration·invariant 검증

### 9.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- **`featureLegalApproved !== true`** + 승인자/시각 누락 (CM3-08)
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `policyVersionReevaluate.defaultReportingMode` ∉ enum
- `policyVersionReevaluate.overrideAllowed` ∉ {`new-record-version`, `stale-flags-only`}
- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
- `policyVersionReevaluate.staleFlagsOnlyOverrideConditions.maxRiskLevel` ∉ enum
- `hashSecrets.*` 4종 누락 (CM3-09 applyPreflightTokenPepperRef 포함)
- `retentionDays.*` 누락
- `dryRun.digest.chunkSize` ≤ 0
- step registry inputSchema.additionalProperties != false
- step registry cancellationSupport.supportsCooperativeCancellation=false + transactionBoundary != "per-chunk" → **validate fail** (CM3-02)

### 9.2 runtime fail

- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
- step timeout 초과 → failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
- policy-reevaluate concurrencyLimit 초과 → 대기 큐
- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
- skipStep 대상 stepResult.rollbackClass ≠ "irreversible" → runtime fail (CM6-03 — `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason)
- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)

### 9.3 migration-time validation

- targetSelector 0건 → warning
- targetSelector 임계 초과 → warning 또는 fail
- DryRunReport expiresAt 만료 후 apply → fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail
- stale policyVersionSnapshot → CAS fail
- targetSelector row lock 불가 → runtime fail
- orphan Core row → warning
- step type registry 미등록 stepType → validate fail [INV-STEP-REGISTRY]
- step writeSetProjection·mutableFieldAllowlist가 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate 실패 → validate fail [INV-CATALOG-VALIDATION]
- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
- maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes → validate fail
- DDL precondition 검증 외 DDL 실행 시도 → validate fail [INV-DDL-BOUNDARY]
- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]

### 9.4 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → § 4.4
- ContentMigrationRun stale processing (lockedAt > 10분) → reconcile
- DryRunReport expiresAt 도래 → purge
- legalHold > unregister > retention purge precedence
- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
- purge worker — 테이블별:
  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
  - ContentMigrationPlan (legalApproved 포함): legalHold true
  - DryRunReport: expiresAt 시 delete
  - Run (status=완료): retentionDays.run
  - StepResult: retentionDays.step
  - StepRetryQueue (status=completed): retentionDays.stepRetryQueueCompleted
  - RollbackLog: retentionDays.rollbackLog
  - ReadOnlyWindow: retentionDays.readOnlyWindow
  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible 비율 > 10%
- impactSamplingMode=random + legal/PII step 포함
- cooperativeCancellation 미지원 step 1개 이상 (validate fail 전제이지만 manifest 단계 사전 경고)

---

## 10. 미결정 사항

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 |
|---|---|
| CM-01 | 외부 cluster cross-region copy |
| CM-02 | partial cutover |
| CM-03 | sampling stratified 알고리즘 (v1.0 deterministic-stratified default·v1.x per-cluster) |
| CM-04 | read-only window 우회 권한 |
| CM-05 | rollback 부분 적용 안전성 |
| CM-09 | legalImpactClassifier false-negative retroactive 절차 (운영 정책) |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application — § 1.3 |
| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |

### 10.3 v0.6 잔여 리스크 (CM5-08)

| 영역 | 상태 |
|---|---|
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |
| ~~§ 6.3 fixture violation path~~ | ~~resolved (v0.5 28 INV happy + violation)~~ |
| ~~§ 12 인벤토리·PolicyReevaluateRecord~~ | ~~resolved (v0.6 § 12.10 별도 table 승격 — 12 tables)~~ |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 24 지적 + cascade |
| 2026-05-15 | v0.3 | codex 2차 23 지적 |
| 2026-05-15 | v0.4 | codex 3차 21 지적 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
| 2026-05-15 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 86건 (24+23+21+14+8+3+1) 전건 수용. blocking 0·major 0·minor 1 (CM7-01 anchor residue — 정정 완료). SoT cascade 완료: REVIEW_WORKFLOW (6종 NotificationEventType + 15종 AuditAction), DATA_MODEL v0.22 (contentMigrationConfig·piiFieldCatalogRef·entityFieldProjectionCatalogRef). 의료법·개인정보보호법 운영 가능. **8 Feature 마지막 — 전체 spec 완료** |
| 2026-05-15 | v0.7 | **codex 6차 비평 3 지적 정정**: (1) NotificationEventType **4종→6종**·AuditAction **13종→15종** 상단 SoT 카운트 정정 + NotificationOutbox `eventType` enum 6종 정정 (CM6-01), (2) § 12 heading 번호 총괄 인벤토리와 정합 (12.10 PolicyReevaluateRecord·12.11 NotificationOutbox·12.12 ActiveTargetLock) (CM6-02), (3) § 9.2 skipStep fail rule에서 제거된 `rollbackClass` 입력 참조 삭제 — `skipStep 대상 stepResult.rollbackClass ≠ "irreversible"` 으로 정정 (CM6-03) |
| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

---

## 12. DB 인벤토리 (12 tables — executable schema)

### 12.1 `ContentMigrationPlan`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ |
| `planKind` | enum (6종) | ✅ |
| `planFingerprint` | char(64) | ✅ |
| `title`·`description` | string | ✅ |
| `targetSelector` | JSON | ✅ |
| `legalImpactClassification` | JSON (closed) | ✅ |
| `classifierVersion` | string | ✅ |
| `status` | enum (draft·validated·dry-run-completed·legal-approved·apply-ready·archived) | ✅ |
| `definedBy`·`definedAt` | string·Date | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.plan |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
**Index**: `(instanceId, status)`, `(expiresAt)`.

### 12.2 `ContentMigrationDryRunReport`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planFingerprint`·`targetSetDigest`·`contentHashDigest`·`sourceSnapshotWatermark`·`policyVersionSnapshot`·`stepRegistryVersion`·`legalImpactClassificationDigest`·`classifierVersion` | char(64)/string | ✅ (8필드) |
| `applyPreflightToken` | char(64) | ✅ |
| `samplingStats` | JSON | ✅ |
| `blockedDriftCount` | integer | ✅ |
| `digestComputationMode` (CM5-05) | enum (`full`·`snapshot`·`cache`) | ✅ |
| `invalidationInputs` (CM5-05) | JSONB closed (policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) | ✅ |
| `cacheSourceRef` (CM5-05) | string | optional (mode=`cache`/`snapshot` 시 ref) |
| `generatedAt` (CM5-05) | Date | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — § 12.12 lock 산정에 재사용 (CM5-04) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(planId, applyPreflightToken)`. `UNIQUE(applyPreflightToken)`.
**Index**: `(planId, generatedAt DESC)`, `(expiresAt)`.

### 12.3 `ContentMigrationLegalApproval` (CM3-13)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `classificationSnapshot` | JSON | ✅ |
| `classificationSnapshotDigest` | char(64) | ✅ |
| `approvedDigestBundleHash` | char(64) | ✅ — 8필드 bundle |
| `policyVersionSnapshot` | string | ✅ |
| `classifierVersion` | string | ✅ |
| `approvedBy`·`approvedAt` | string·Date | ✅ |
| `legalHold` | boolean | ✅ default true |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints**: `UNIQUE(planId, classificationSnapshotDigest)`. `UNIQUE(planId, dryRunReportId)`.
**Index**: `(planId, approvedAt DESC)`.

### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `expectedLegalApprovalId` | UUID | optional (legalGateRequired=true 시 ✅) — FK |
| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
| `primaryStatus` | enum (pending·running·paused·completed·failed·cancelled·rolling-back·rolled-back) | ✅ |
| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
| `solutionVersion` | integer | ✅ — CAS |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `mode` | enum (dry-run·apply) | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(planId, idempotencyKey)`
- `UNIQUE(planId) WHERE primary_status IN ('pending','running','paused','rolling-back') OR remediation_status != 'none'` (CM3-12)
**Index**: `(primary_status, started_at DESC)`, `(expiresAt)`.

### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `stepKey` | string | ✅ |
| `stepType` | string | ✅ |
| `status` | enum (pending·processing·success·failed-transient·failed-permanent·skipped·rolled-back) | ✅ |
| `inputSummary` | JSON (closed — § 3.8) | ✅ |
| `outputSummary` | JSON (closed) | optional |
| `diffDisplayHints` | JSON (closed) | optional |
| `rawArtifactRef` | string | optional |
| `rawArtifactRetentionExpiresAt` | Date | optional |
| `privacyClass` | enum (non-pii·pii·legal-sensitive) | ✅ |
| `containsPii` | boolean | ✅ |
| `exportAllowed` | boolean | ✅ |
| `writeSetManifest` | JSON (§ 3.7) | optional |
| `rollbackClass` | enum | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints (CM4-10 SQL canonical 정정)**:
- `UNIQUE(runId, stepKey)`
- `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`
- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
**Index**: `(runId, started_at DESC)`, `(expiresAt)`, `(privacy_class) WHERE privacy_class IN ('pii','legal-sensitive')`.

### 12.6 `ContentMigrationStepRetryQueue` (CM3-07 worker SQL)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `stepResultId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `attempts` | integer | ✅ |
| `maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum (transient·permanent) | optional |
| `exhaustedAt` | Date | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(stepResultId) WHERE status IN ('pending','processing')`.
**Index**: `(status, next_attempt_at, locked_at) WHERE status IN ('pending','processing')`.

**worker SoT SQL** (CM3-07 자체 전개):

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_step_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_step_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- transient fail (backoff)
UPDATE content_migration_step_retry_queue
SET status='pending', locked_at=null, last_error=$err, last_error_class='transient',
    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
WHERE id=$id;

-- permanent
UPDATE content_migration_step_retry_queue
SET status='failed-permanent', locked_at=null, last_error_class='permanent'
WHERE id=$id;

-- success
UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;

-- exhausted
UPDATE content_migration_step_retry_queue
SET status='exhausted', exhausted_at=now(), locked_at=null
WHERE id=$id AND attempts >= max_attempts;
-- + sink alert + run.retryExhaustedAction trigger

-- stale reclaim
UPDATE content_migration_step_retry_queue
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';
```

### 12.7 `ContentMigrationRollbackLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `rolledBackStepKey` | string | ✅ |
| `rollbackClass` | enum | ✅ |
| `scope` | enum (full·from-step) | ✅ |
| `skippedIrreversibleSteps` | JSON ({stepKey, remediationTicketRef}[]) | ✅ |
| `result` | enum (success·partial·failed) | ✅ |
| `executedAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId, rolledBackStepKey)`.
**Index**: `(runId, executedAt DESC)`.

### 12.8 `ContentMigrationReadOnlyWindow`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `startedAt`·`endedAt` | Date | ✅·optional |
| `blockedWriteAttempts` | integer | ✅ default 0 |
| `queuedDispatchCount` | integer | ✅ default 0 |
| `active` | boolean | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId) WHERE active=true`.
**Index**: `(active, started_at DESC)`.

### 12.9 `ContentMigrationPolicyReevaluateBatch`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planId` | UUID | ✅ — FK |
| `checked`·`cacheHit`·`skippedNoChange`·`changed`·`error` | integer | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId)`.

### 12.10 `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table 승격)

batch row 1개당 per-ComplianceRecord N row. 별도 물리 table. PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged` | boolean | ✅ |
| `legalSensitiveEntityChanged` (CM5-06) | boolean | ✅ |
| `legalEntityIdentityChanged` (CM5-06) | boolean | ✅ |
| `fieldProjectionDiff` (CM5-06) | JSON (string[]) | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.11 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType **6종** — § 5.1 SoT — CM6-01) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·permanent) | ✅ |
| `attempts` | integer | ✅ default 0 |
| `nextAttemptAt` | Date | ✅ |
| `lastAttemptAt`·`sentAt` | Date | optional |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceEventId)`. `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, next_attempt_at) WHERE status='pending'`, `(expiresAt)`.

---

### 12.12 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `targetSetDigest` | char(64) | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
| `runId` | UUID | optional — apply Run 진행 중일 때 채움. FK § 12.4 |
| `dryRunPlanId` | UUID | optional — dry-run 진행 중일 때 채움. FK § 12.1 |
| `kind` | enum (`apply`·`dry-run`) | ✅ |
| `acquiredAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — heartbeat 갱신. cleanup worker가 stale 회수 |

**Constraints**:
- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`
- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`

**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.

**획득·해제 protocol**:
- runDryRun·runApply 시작 시 lock 획득 (timeout 60초). 실패 → 409 conflict
- run 완료/cancelled/rolled-back/aborted 또는 dry-run 완료 시 lock 해제
- heartbeat: 진행 중인 worker가 expiresAt을 5분 단위로 갱신
- stale (expiresAt 도래) → cleanup worker가 해제 + sink alert

`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.

---

**총 12개 admin DB 테이블** (CM5-01 정정):

| § | 테이블 |
|---|---|
| 12.1 | `ContentMigrationPlan` |
| 12.2 | `ContentMigrationDryRunReport` |
| 12.3 | `ContentMigrationLegalApproval` |
| 12.4 | `ContentMigrationRun` |
| 12.5 | `ContentMigrationStepResult` |
| 12.6 | `ContentMigrationStepRetryQueue` |
| 12.7 | `ContentMigrationRollbackLog` |
| 12.8 | `ContentMigrationReadOnlyWindow` |
| 12.9 | `ContentMigrationPolicyReevaluateBatch` |
| 12.10 | `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table) |
| 12.11 | `ContentMigrationNotificationOutbox` |
| 12.12 | `ContentMigrationActiveTargetLock` |


 succeeded in 761ms:
docs/compliance\RISK_LEVELS.md:100:  steps: Array<{                     // 등급 산정 출처 추적 (audit·triggeredBy 판정용)
docs/admin\REVIEW_WORKFLOW.md:25:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
docs/admin\REVIEW_WORKFLOW.md:295:| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |
docs/admin\REVIEW_WORKFLOW.md:302:- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
docs/admin\REVIEW_WORKFLOW.md:332:- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
docs/admin\REVIEW_WORKFLOW.md:334:- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
docs/admin\REVIEW_WORKFLOW.md:418:  instanceId: Slug;
docs/admin\REVIEW_WORKFLOW.md:432:   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
docs/admin\REVIEW_WORKFLOW.md:638:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
docs/admin\REVIEW_WORKFLOW.md:640:### 10.2 audit log 페이로드
docs/admin\REVIEW_WORKFLOW.md:666:  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
docs/admin\REVIEW_WORKFLOW.md:669:  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
docs/admin\REVIEW_WORKFLOW.md:674:  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
docs/admin\REVIEW_WORKFLOW.md:709:> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
docs/admin\REVIEW_WORKFLOW.md:713:- audit log는 **append-only** — 수정·삭제 불가
docs/admin\REVIEW_WORKFLOW.md:730:  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
docs/admin\REVIEW_WORKFLOW.md:746:| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |
docs/admin\REVIEW_WORKFLOW.md:769:| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
docs/admin\REVIEW_WORKFLOW.md:784:| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
docs/admin\REVIEW_WORKFLOW.md:803:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin\REVIEW_WORKFLOW.md:806:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
docs/core\DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
docs/core\DATA_MODEL.md:571:| `instanceId` | `Slug` | ✅ | |
docs/core\DATA_MODEL.md:584:| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
docs/core\DATA_MODEL.md:596:| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
docs/core\DATA_MODEL.md:630:| `email` | `{enabled: boolean, transport: "smtp" \| "ses" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | 이메일 활성화·트랜스포트·발신자·시간당 발송 한도. `secretRef`는 API 키 또는 SMTP 자격 (예: `secretRef://EMAIL_TRANSPORT_KEY`) |
docs/core\DATA_MODEL.md:631:| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
docs/core\DATA_MODEL.md:634:> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
docs/core\DATA_MODEL.md:652:> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).
docs/core\DATA_MODEL.md:658:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
docs/core\DATA_MODEL.md:667:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core\DATA_MODEL.md:675:| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
docs/core\DATA_MODEL.md:676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
docs/core\DATA_MODEL.md:712:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
docs/core\DATA_MODEL.md:713:| `legalApprovedBy` | string | ✅ | |
docs/core\DATA_MODEL.md:714:| `legalApprovedAt` | Date | ✅ | |
docs/core\DATA_MODEL.md:715:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs/core\DATA_MODEL.md:718:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
docs/core\DATA_MODEL.md:722:솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
docs/core\DATA_MODEL.md:726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
docs/core\DATA_MODEL.md:728:| `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
docs/core\DATA_MODEL.md:730:| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
docs/core\DATA_MODEL.md:768:| `instanceId` | `Slug` | ✅ | |
docs/core\DATA_MODEL.md:968:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
docs/core\DATA_MODEL.md:974:| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date}>` | ✅ | 사용자가 접근 가능한 인스턴스 목록 (multi-tenant) |
docs/core\DATA_MODEL.md:996:| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
docs/core\DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
docs/core\DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs/core\DATA_MODEL.md:1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
docs/core\DATA_MODEL.md:1103:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
docs/core\DATA_MODEL.md:1106:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
docs/features\asset-ingestion.md:45:- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
docs/features\asset-ingestion.md:50:### 1.2.1 공통 retry taxonomy (search-visibility § 1.2.1 동일)
docs/features\asset-ingestion.md:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
docs/features\asset-ingestion.md:104:v0.1 § 3.1 유지 + audit log contract (§ 3.1.1 신설).
docs/features\asset-ingestion.md:106:### 3.1.1 audit log contract (F-4)
docs/features\asset-ingestion.md:134:- `UNIQUE(instanceId, normalizedTextHash)` — duplicate 차단 기본
docs/features\asset-ingestion.md:135:- `(instanceId, sourceId, sourceCanonicalKey)` index — provenance 조회
docs/features\asset-ingestion.md:139:### 4.3 retry queue worker — search-visibility § 13.5 패턴 동일
docs/features\asset-ingestion.md:147:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
docs/features\asset-ingestion.md:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
docs/features\asset-ingestion.md:336:### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)
docs/features\asset-ingestion.md:359:3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
docs/features\asset-ingestion.md:360:   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
docs/features\asset-ingestion.md:362:   c. **게이트 재평가** (AI3-03): § 7.2 모든 게이트 재검증 + AssetReviewRecord.reviewVersion compare-and-set
docs/features\asset-ingestion.md:371:   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
docs/features\asset-ingestion.md:372:   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
docs/features\asset-ingestion.md:383:  - status="committed" + audit log 미존재 (24시간 내) → 재기록 시도. 재시도 3회 후 sink alert
docs/features\asset-ingestion.md:425:## 10. 알림 (outbox 패턴)
docs/features\asset-ingestion.md:437:### 10.2 outbox 패턴
docs/features\asset-ingestion.md:443:| eventType | outbox sourceKind | outbox sourceId | contentRef | contentTitle | metadata |
docs/features\asset-ingestion.md:453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
docs/features\asset-ingestion.md:472:| outbox 발송 성공율 | dispatched / enqueue 대상 | > 99% |
docs/features\asset-ingestion.md:501:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
docs/features\asset-ingestion.md:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
docs/features\asset-ingestion.md:528:  - blobRef path가 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}` 패턴 일치 → `blobKeyVersion="v0.2"`
docs/features\asset-ingestion.md:529:  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
docs/features\asset-ingestion.md:534:- v0.2 key: `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`
docs/features\asset-ingestion.md:535:- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
docs/features\asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
docs/features\asset-ingestion.md:555:  - status="committed" + audit log 미존재 (24h) → audit 재기록 3회. 실패 시 sink alert
docs/features\asset-ingestion.md:556:- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
docs/features\asset-ingestion.md:585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
docs/features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs/features\asset-ingestion.md:619:**Constraints**: `UNIQUE(instanceId, normalizedTextHash)` (duplicate 차단).
docs/features\asset-ingestion.md:620:**Index**: `(instanceId, sourceId, sourceCanonicalKey)`, `(expiresAt)`.
docs/features\asset-ingestion.md:646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
docs/features\asset-ingestion.md:661:- promote transaction의 CAS 입력 (§ 8.2 3.a)
docs/features\asset-ingestion.md:705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
docs/features\asset-ingestion.md:718:| `reviewVersionSnapshot` | integer | ✅ | promote 시점 AssetReviewRecord.reviewVersion (CAS 입력) |
docs/features\asset-ingestion.md:741:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
docs/features\asset-ingestion.md:753:object key format: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind=`raw`·`redacted`·`thumbnail`) — AI2-08 정정: kind를 path prefix로 두어 IAM condition `s3:prefix=asset-ingestion/{instanceId}/raw/*` 적용 가능.
docs/features\compliance-assistant.md:286:   d. 매칭 성공 시 본 finding은 결과에서 제거 (로그·audit에는 보존)
docs/features\compliance-assistant.md:354:  - 동일 본문·동일 위치·동일 카테고리·동일 순번은 항상 같은 ID 생성 (LLM 비결정성 영향 없음). audit·warning acknowledgement·검수자 수락 등의 finding 참조 안정성 보장
docs/features\compliance-assistant.md:365:- LLM 출력 자체는 audit log에 기록 (prompt·response·model·timestamp)
docs/features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
docs/features\compliance-assistant.md:507:- LLM 호출 — 모델·토큰·비용·결과 audit log
docs/features\compliance-assistant.md:561:   - 비활성 모드 finalRoles는 운영자/검수자가 수동 결정·기록 (audit log)
docs/features\compliance-assistant.md:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
docs/core\DESIGN_TOKENS.md:50:- Preset·Instance override 토큰 파일은 동일 4파일 구조를 따른다 (`presets/<presetSlug>/design-tokens/*.json`·`instances/<instanceId>/design-tokens/*.json`)
docs/core\DESIGN_TOKENS.md:829:Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/features\crm-sync.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
docs/features\crm-sync.md:12:> - retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
docs/features\crm-sync.md:19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
docs/features\crm-sync.md:25:- **RRN deny**: v1.0 강제. false positive 복구 + audit cascade
docs/features\crm-sync.md:64:- 알림 발송·audit canonical → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
docs/features\crm-sync.md:65:- 자격증명·DPA·policyVersion → DATA_MODEL C-08 v0.20
docs/features\crm-sync.md:67:- retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
docs/features\crm-sync.md:68:- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT
docs/features\crm-sync.md:70:### 1.2.1 retry taxonomy
docs/features\crm-sync.md:109:| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |
docs/features\crm-sync.md:120:      apiKeySecretRef: "secretRef://..."
docs/features\crm-sync.md:122:      webhookSecret: "secretRef://..."
docs/features\crm-sync.md:124:      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
docs/features\crm-sync.md:125:      dpaEvidenceRef: "secretRef://..."
docs/features\crm-sync.md:150:      retryQueue: { maxAttempts: 5, backoffSeconds: [60,300,1800,7200,21600], workerPollIntervalSeconds: 30 }
docs/features\crm-sync.md:152:      rateLimit:
docs/features\crm-sync.md:157:        retryAfterRespected: true
docs/features\crm-sync.md:162:        retryQueueCompleted: 30; notificationOutbox: 30; consentWithdrawalLedger: 1095
docs/features\crm-sync.md:164:      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
docs/features\crm-sync.md:166:        piiHashPepperRef: "secretRef://CRM_PII_HASH_PEPPER"
docs/features\crm-sync.md:167:        crmExternalIdHashPepperRef: "secretRef://CRM_EXT_ID_HASH_PEPPER"
docs/features\crm-sync.md:168:        changeIdentityKeyPepperRef: "secretRef://CRM_CHANGE_IDENTITY_PEPPER"
docs/features\crm-sync.md:169:        rrnFingerprintPepperRef: "secretRef://CRM_RRN_FINGERPRINT_PEPPER"
docs/features\crm-sync.md:170:        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
docs/features\crm-sync.md:171:      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://..." }
docs/features\crm-sync.md:182:| `credentialFingerprint` | integrationId + secretVersionId | HMAC-SHA256 | `HMAC(auditPepperSecretRef, integrationId + ":" + secretVersionId)`. char(64) hex. UI prefix 8 hex |
docs/features\crm-sync.md:212:### 3.1.1 audit log contract (7종 AuditAction)
docs/features\crm-sync.md:216:| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
docs/features\crm-sync.md:330:- **audit 책임**: CRM 콘솔 접근은 CRM provider 측 audit log 책임 (Salesforce Login History·HubSpot Audit Trail 등). solution audit log는 CRM 콘솔 접근 추적 불가 — 본 문서 audit scope 외
docs/features\crm-sync.md:338:  instanceId: string;
docs/features\crm-sync.md:363:  status: "pushed" | "queued-retry" | "blocked-rrn" | "blocked-consent-withdrawn" | "cas-conflict-detected";
docs/features\crm-sync.md:378:  expectedResolution: "open";                   // CAS — 이미 resolved면 실패
docs/features\crm-sync.md:396:  expectedPriorStatus: "rejected-rrn-recoverable";  // CAS
docs/features\crm-sync.md:460:  expectedIntegrationState: "reverted";         // CAS
docs/features\crm-sync.md:470:audit `crm-credential-rotated` metadata `resultState="reset"` 추가.
docs/features\crm-sync.md:505:  retrySemantics: "provider-retries" | "no-retry";
docs/features\crm-sync.md:548:// CAS·FieldMapping·CrmRecord 갱신 단계에서 보는 공통 normalized
docs/features\crm-sync.md:562:webhook → polling 공통 처리는 **NormalizedInboundChange만 보는** CAS 단계로 수렴.
docs/features\crm-sync.md:566:- **CrmWebhookNonceLedger**: **transport-level dedupe** — webhook delivery 중복(provider retry·재전송). polling 미사용
docs/features\crm-sync.md:590:9. CrmRecord CAS — `WHERE id=? AND solution_version=? AND crm_version=?`
docs/features\crm-sync.md:612:10. CAS 갱신
docs/features\crm-sync.md:620:5. CAS 갱신
docs/features\crm-sync.md:629:   - input.expectedPriorStatus CAS 검증 — 일치 안 함 → runtime fail
docs/features\crm-sync.md:639:   d. 통과 (false positive 확인) → 정상 inbound 처리 (NormalizedInboundChange 생성 + CAS):
docs/features\crm-sync.md:642:      - audit `crm-rrn-false-positive-recovered` metadata (priorStatus·finalStatus·rrnFingerprintPrefix·actorRole·crmExternalIdHashPrefix·reason)
docs/features\crm-sync.md:644:      - audit `crm-rrn-rejection-finalized`
docs/features\crm-sync.md:647:   - audit `crm-rrn-rejection-finalized` metadata (priorStatus·finalStatus·actorRole·reason)
docs/features\crm-sync.md:649:5. 동일 ledgerId 두 번째 호출 — ledger status가 이미 final이면 expectedPriorStatus CAS 실패
docs/features\crm-sync.md:652:### 4.3 field-level 충돌 해결 + CAS
docs/features\crm-sync.md:664:#### 4.3.2 CAS SQL
docs/features\crm-sync.md:712:### 4.4 retry queue (§ 13.4.1 풀 SQL 9단계)
docs/features\crm-sync.md:726:| committed | 1 `committed`(이전·graceUntil) + 1 `active`(신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil) |
docs/features\crm-sync.md:727:| grace-expired | 1 `active`(신규) (others `revoked`/`grace-expired`) | committed graceUntil 도래. outbound/inbound active만 |
docs/features\crm-sync.md:736:| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |
docs/features\crm-sync.md:737:| grace-expired | active(신규) only | active만 |
docs/features\crm-sync.md:746:-- 2. 현재 state 확인 (stable만 허용 — CAS)
docs/features\crm-sync.md:751:-- 5 rows affected 검증 (CAS)
docs/features\crm-sync.md:763:- 성공 → BEGIN; SELECT FOR UPDATE → 이전 active → committed (+graceUntil) → 신규 rotating-target → active → integration state 'committed' → currentCredentialVersionId 갱신; COMMIT;
docs/features\crm-sync.md:768:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
docs/features\crm-sync.md:771:- audit `crm-credential-rotated` metadata `resultState="reset"·rotationAttemptId·reason`
docs/features\crm-sync.md:773:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
docs/features\crm-sync.md:778:-- 1. committed credential version (graceUntil 도래) 조회
docs/features\crm-sync.md:779:SELECT integration_id, id AS committed_version_id, grace_until
docs/features\crm-sync.md:781:WHERE state='committed' AND grace_until <= now()
docs/features\crm-sync.md:788:-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
docs/features\crm-sync.md:789:-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
docs/features\crm-sync.md:790:UPDATE crm_credential_version SET state='grace-expired', revoked_at=now()
docs/features\crm-sync.md:793:-- 4. integration credentialState → 'grace-expired' (단일 transaction)
docs/features\crm-sync.md:794:UPDATE crm_integration SET credential_state='grace-expired'
docs/features\crm-sync.md:797:-- 5. audit CrmCredentialAuditLog event='grace-expired' insert
docs/features\crm-sync.md:801:-- 후속 (별도 cycle): 운영자 검토 후 또는 일정 지연 후 grace-expired → revoked로 정리
docs/features\crm-sync.md:802:-- v1.0은 grace-expired에서 운영자 개입 없이 정리할지 별도 정책 (CS-22 신규 open)
docs/features\crm-sync.md:807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
docs/features\crm-sync.md:809:### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개
docs/features\crm-sync.md:814:  SELECT id FROM crm_sync_notification_outbox
docs/features\crm-sync.md:818:UPDATE crm_sync_notification_outbox o
docs/features\crm-sync.md:823:UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;
docs/features\crm-sync.md:826:UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;
docs/features\crm-sync.md:829:UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
docs/features\crm-sync.md:836:**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.
docs/features\crm-sync.md:840:| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
docs/features\crm-sync.md:841:| CrmCredentialVersion (모든 row) | state="revoked" | 7년 (audit) | true | RESTRICT |
docs/features\crm-sync.md:844:| CrmRecordChangeLog | row 유지 (audit) | retentionDays.changeLog | false (tombstone는 true) | RESTRICT |
docs/features\crm-sync.md:846:| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.retryQueueCompleted | false | RESTRICT |
docs/features\crm-sync.md:850:| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
docs/features\crm-sync.md:854:audit `crm-integration-unregistered` metadata `unregisterPolicySnapshot` (options) 포함.
docs/features\crm-sync.md:856:`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).
docs/features\crm-sync.md:867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
docs/features\crm-sync.md:878:11. audit `crm-consent-withdrawal-applied`
docs/features\crm-sync.md:904:### 6.2 outbox — § 4.6 SQL
docs/features\crm-sync.md:946:### 7.4 DPA vs patient consent
docs/features\crm-sync.md:948:- DPA: `dpaEvidenceRef` 필수
docs/features\crm-sync.md:978:| outbox 성공율 | > 99% | |
docs/features\crm-sync.md:979:| CAS lost-update 감지율 | baseline | |
docs/features\crm-sync.md:988:- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)
docs/features\crm-sync.md:1025:- committed → grace-expired (worker)
docs/features\crm-sync.md:1026:- grace-expired worker 3회 실패 → super-admin alert
docs/features\crm-sync.md:1028:- resetCredentialRotation invalid expectedIntegrationState → CAS 실패
docs/features\crm-sync.md:1031:#### INV-CAS
docs/features\crm-sync.md:1060:- legalHold=true row 보존 (audit·credentialAuditLog·ConsentWithdrawalLedger)
docs/features\crm-sync.md:1061:- legalHold > unregister snapshot > retention purge
docs/features\crm-sync.md:1079:#### INV-CASCADE
docs/features\crm-sync.md:1091:| § 10.1 legalApproved=false | INV-MANIFEST |
docs/features\crm-sync.md:1108:| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
docs/features\crm-sync.md:1110:| § 10.2 CAS WHERE 0 rows | INV-CAS |
docs/features\crm-sync.md:1112:| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
docs/features\crm-sync.md:1115:| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
docs/features\crm-sync.md:1120:| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
docs/features\crm-sync.md:1123:| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
docs/features\crm-sync.md:1124:| § 10.4 graceExpiry worker 3회 실패 | INV-CREDENTIAL-ROTATION |
docs/features\crm-sync.md:1126:| § 10.4 purge worker — 모든 retention 대상 | INV-PURGE |
docs/features\crm-sync.md:1143:- integration `legalApproved !== true` 또는 승인자/시각 누락
docs/features\crm-sync.md:1159:- `retentionDays.consentWithdrawalLedger`·`operationalHintsRetentionDays`·`purgeWorker.cadenceMinutes` 누락
docs/features\crm-sync.md:1171:- `resolveConflict` 시 conflictId 이미 resolved (`expectedResolution` CAS 실패)
docs/features\crm-sync.md:1174:- CAS WHERE 0 rows → ConflictRecord + alert
docs/features\crm-sync.md:1176:- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님 (또는 expectedPriorStatus CAS 실패)
docs/features\crm-sync.md:1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
docs/features\crm-sync.md:1179:- `resetCredentialRotation` expectedIntegrationState CAS 실패 → runtime fail
docs/features\crm-sync.md:1200:- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
docs/features\crm-sync.md:1203:- **purge worker (CS4-06 precedence)**:
docs/features\crm-sync.md:1204:  - 우선순위: legalHold > unregister snapshot > retention purge
docs/features\crm-sync.md:1205:  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)
docs/features\crm-sync.md:1206:  - batch: `purgeWorker.batchSize` (기본 500)
docs/features\crm-sync.md:1208:    | 테이블 | action | legal hold default |
docs/features\crm-sync.md:1215:    | CrmCredentialAuditLog | 7년 (audit) | true |
docs/features\crm-sync.md:1253:| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
docs/features\crm-sync.md:1254:| CS-22 | grace-expired → revoked 자동 정리 정책 (CS5-03) — v1.0은 grace-expired row 보존 |
docs/features\crm-sync.md:1265:| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |
docs/features\crm-sync.md:1303:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1306:| `apiKeySecretRef` | secretRef | ✅ |
docs/features\crm-sync.md:1308:| `webhookSecret` | secretRef | optional |
docs/features\crm-sync.md:1311:| `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
docs/features\crm-sync.md:1312:| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
docs/features\crm-sync.md:1313:| `dpaEvidenceRef` | secretRef | ✅ |
docs/features\crm-sync.md:1319:**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → crm_credential_version.id ON DELETE RESTRICT`.
docs/features\crm-sync.md:1320:**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.
docs/features\crm-sync.md:1328:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1339:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\crm-sync.md:1340:**Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.
docs/features\crm-sync.md:1352:| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
docs/features\crm-sync.md:1385:  SELECT id FROM crm_sync_retry_queue
docs/features\crm-sync.md:1390:UPDATE crm_sync_retry_queue q
docs/features\crm-sync.md:1412:         bool_or(status='in-retry-queue') AS any_retry
docs/features\crm-sync.md:1415:UPDATE crm_sync_log SET envelope_state=CASE
docs/features\crm-sync.md:1417:  WHEN (SELECT any_retry FROM agg) THEN 'retried'
docs/features\crm-sync.md:1423:UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null WHERE id=$qid;
docs/features\crm-sync.md:1426:UPDATE crm_sync_retry_queue SET status='pending', locked_at=null, locked_by=null
docs/features\crm-sync.md:1430:UPDATE crm_sync_retry_queue SET status='exhausted'
docs/features\crm-sync.md:1432:UPDATE crm_sync_retry_queue SET status='failed-permanent'
docs/features\crm-sync.md:1434:-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
docs/features\crm-sync.md:1444:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1450:| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
docs/features\crm-sync.md:1473:**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`. `UNIQUE(instanceId, integrationId, entity, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`.
docs/features\crm-sync.md:1475:**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiHash) WHERE piiHash IS NOT NULL`, `(crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(consentWithdrawn) WHERE consentWithdrawn=true`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`, `(operationalHintsRetentionExpiresAt) WHERE operationalHintsRetentionExpiresAt IS NOT NULL`.
docs/features\crm-sync.md:1497:| `instanceId` | Slug | ✅ |
docs/features\crm-sync.md:1506:**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.
docs/features\crm-sync.md:1534:| `event` | enum (rotated·rotation-failed·grace-expired·expired·expiring-soon·reset) | ✅ |
docs/features\crm-sync.md:1561:| `secretRef` | secretRef | ✅ |
docs/features\crm-sync.md:1563:| `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
docs/features\crm-sync.md:1565:| `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
docs/features\crm-sync.md:1567:| `graceUntil` | Date | optional |
docs/features\crm-sync.md:1580:**Index**: `(integrationId, state)`, `(expiresAt)`, `(graceUntil) WHERE state='committed'`.
docs/features\crm-sync.md:1685:| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
docs/features\crm-sync.md:1689:| 13.9 | CrmCredentialAuditLog | 7년 audit retention |
docs/features\analytics-reporting.md:63:### 1.2.1 공통 retry taxonomy (AR4-07)
docs/features\analytics-reporting.md:65:본 Feature는 3종 retry 구조를 가진다 — CollectionRetryQueue·ReportInstance outbox·MediaThresholdReassessmentDispatchOutbox. 공통 의미 통일:
docs/features\analytics-reporting.md:72:| `*-retryable` | 자동 재시도 큐 대상 (attempts < maxAttempts) |
docs/features\analytics-reporting.md:83:| ReportInstance outbox | **상수 5** (configurable 아님 — 운영 단순성) |
docs/features\analytics-reporting.md:86:두 outbox의 maxAttempts는 상수 고정 (config 슬롯 없음). build validation은 maxAttempts 설정 누락이 아닌 `claim` enum 값·`attempts` 컬럼 존재만 검사.
docs/features\analytics-reporting.md:129:    gsc: { enabled: true, serviceAccountSecretRef: "secretRef://...", propertyUrl: "sc-domain:..." }
docs/features\analytics-reporting.md:130:    naverSearchAdvisor: { enabled: true, apiKeySecretRef: "secretRef://...", siteUrl: "..." }
docs/features\analytics-reporting.md:131:    ga4: { enabled: true, propertyId: "G-...", serviceAccountSecretRef: "secretRef://..." }
docs/features\analytics-reporting.md:188:        measurementAlgorithmVersion: "v1"              # AR2-07 audit 추적
docs/features\analytics-reporting.md:189:      rateLimit:                                       # bucket scope 명시
docs/features\analytics-reporting.md:193:        #   instance-isolated: `ar:quota:{provider}:{instanceId}`
docs/features\analytics-reporting.md:194:        # credentialHash = SHA-256(secretRef 참조값) 8자 prefix. secretRef rotation 시 새 hash → 새 bucket
docs/features\analytics-reporting.md:203:        retryAfterRespected: true                      # 429 Retry-After ≥ backoff 시 Retry-After 우선
docs/features\analytics-reporting.md:235:  instanceId: Slug;
docs/features\analytics-reporting.md:251://     - sourceConfigSnapshot (자격증명 secretRef 포함 — secret 자체는 아님)
docs/features\analytics-reporting.md:254://       → source 설정(secretRef·propertyId·siteUrl·bucket strategy 등) 변경 시 새 lineage 보장 (AR5-02 정정)
docs/features\analytics-reporting.md:257://   retry: CollectionLog.manifestVersion을 끝까지 따름 — 현재 manifest 변경 무시
docs/features\analytics-reporting.md:258://   → manifest 변경(ga4 비활성화·secretRef rotation 등) 시 새 scheduled job부터 새 lineage. 기존 in-flight job은 freeze 값 유지
docs/features\analytics-reporting.md:266://     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion + "force:" + refreshIntentId)
docs/features\analytics-reporting.md:268://     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion)
docs/features\analytics-reporting.md:279:  instanceId: Slug;
docs/features\analytics-reporting.md:307:  | "failed-transient"      // 재시도 가능 (retry queue로 이동)
docs/features\analytics-reporting.md:311:  | "in-retry-queue";       // CollectionRetryQueue에 enqueue됨
docs/features\analytics-reporting.md:318:  instanceId: Slug;
docs/features\analytics-reporting.md:329:// 기본 idempotencyKey: hash(instanceId + reportTemplateId + windowStart + windowEnd + mode [+ "force:" + refreshIntentId])
docs/features\analytics-reporting.md:358:  instanceId: Slug;
docs/features\analytics-reporting.md:454:   - CollectionLog UNIQUE(instanceId, idempotencyKey) insert 시도
docs/features\analytics-reporting.md:464:   d. rate limit token bucket consume (bucketKeyStrategy 적용)
docs/features\analytics-reporting.md:468:      - 429 → max(Retry-After, backoffSeconds[attemptNumber-1]) → retry queue
docs/features\analytics-reporting.md:469:      - 5xx·timeout → failed-transient → retry queue
docs/features\analytics-reporting.md:474:   | 1+ attempt가 in-retry-queue 또는 processing | **processing** (우선) |
docs/features\analytics-reporting.md:478:5. retry 성공 후 envelope 재계산 (AR3-03):
docs/features\analytics-reporting.md:492:- catch-up idempotencyKey = `hash(instanceId + canonicalSources + scheduledForDate + manifestVersion)` — date별 멱등
docs/features\analytics-reporting.md:498:### 4.3 retry queue worker (AR2-15)
docs/features\analytics-reporting.md:504:UPDATE collection_retry_queue
docs/features\analytics-reporting.md:507:  SELECT id FROM collection_retry_queue
docs/features\analytics-reporting.md:522:- worker 처리 후 status="completed" 또는 retry 반복
docs/features\analytics-reporting.md:589:  - reconcile worker (stale processing >10분 감지): attempt status="failed-transient"로 마킹 후 retry queue enqueue
docs/features\analytics-reporting.md:591:  - RawRecord: `retentionDays.raw` 만료 자동 purge (rawPayloadStorage.enabled=true인 경우만)
docs/features\analytics-reporting.md:592:  - **AnalyticsRedactionAudit**: `AnalyticsRedactionAudit.processedAt + retentionDays.rawRedactionAuditTrail`(기본 3년) 만료 자동 purge — rawPayloadStorage.enabled 무관 모든 인스턴스 적용
docs/features\analytics-reporting.md:604:  instanceId: Slug;
docs/features\analytics-reporting.md:621:- Raw: 90일, redaction audit trail 3년
docs/features\analytics-reporting.md:642:4. ReportInstance insert (UNIQUE(instanceId, idempotencyKey)):
docs/features\analytics-reporting.md:647:       - `claimed-pending`·`dispatch-failed` → outbox 재발송 worker가 처리 (resultOrigin="reconstructed-from-existing")
docs/features\analytics-reporting.md:649:5. delivery.enabled=true 시 **outbox 패턴** (AR3-08):
docs/features\analytics-reporting.md:652:        sourceEventId = hash(instanceId + reportInstanceId)
docs/features\analytics-reporting.md:656:   d. notify() 실패 또는 c 단계 commit 실패 → notificationDispatchClaim="dispatch-failed-retryable" + attempts++ + 외부 sink alert
docs/features\analytics-reporting.md:657:   e. **outbox reconcile worker** (1분 주기 — AR4-04·06 SoT 쿼리):
docs/features\analytics-reporting.md:667:            OR notification_dispatch_claim = 'dispatch-failed-retryable'
docs/features\analytics-reporting.md:680:   f. 재시도 후 성공 → "dispatched", 5회 초과 실패 → "dispatch-failed-permanent" + 운영자 수동 개입 alert (AR4-04 retryable vs permanent 분리)
docs/features\analytics-reporting.md:690:1. DailyUserMeasurement insert (UNIQUE(instanceId, date, basisKey))
docs/features\analytics-reporting.md:693:3. MediaThresholdState 갱신 — UPDATE ... WHERE instanceId=? RETURNING *
docs/features\analytics-reporting.md:711:      transitionEventId = hash("media-threshold:" + instanceId + newState + assessmentBasisDate + basisKey + thresholdDailyUsers)
docs/features\analytics-reporting.md:713:   c. **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment()** 호출 — outbox 패턴 (§ 7.3.2 재시도 정책)
docs/features\analytics-reporting.md:742:#### 7.3.2 enqueueMediaThresholdReassessment 재시도 정책 (AR3-12 — outbox)
docs/features\analytics-reporting.md:747:- worker가 1분 주기로 outbox 처리 (AR4-05·06 SoT 쿼리):
docs/features\analytics-reporting.md:750:UPDATE media_threshold_reassessment_dispatch_outbox
docs/features\analytics-reporting.md:753:  SELECT id FROM media_threshold_reassessment_dispatch_outbox
docs/features\analytics-reporting.md:757:      OR claim IN ('not-claimed', 'dispatch-failed-retryable')
docs/features\analytics-reporting.md:764:UPDATE media_threshold_reassessment_dispatch_outbox
docs/features\analytics-reporting.md:775:  4. 실패 → claim="dispatch-failed-retryable" + 외부 sink alert
docs/features\analytics-reporting.md:815:  instanceId: Slug;
docs/features\analytics-reporting.md:857:| retry queue 처리율 | exhausted / total | < 5% |
docs/features\analytics-reporting.md:868:- retry queue stale processing > 10분
docs/features\analytics-reporting.md:880:# 3. secretRef 등록
docs/features\analytics-reporting.md:898:- 활성 source의 secretRef 누락
docs/features\analytics-reporting.md:905:- outbox 테이블 schema에 `claim` enum·`attempts`·`claimedAt` 컬럼 누락 (maxAttempts는 상수 5 — § 1.2.1)
docs/features\analytics-reporting.md:955:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) **§ 1.1 변경 정책에 build/runtime/warning 룰 변경 항목 추가** (AR5-01), (2) **manifestSnapshotVersion에 sourceConfigSnapshotHash 포함** — secretRef·propertyId·siteUrl·bucket strategy 변경 시 새 lineage 보장 (AR5-02), (3) **outbox maxAttempts 상수 5 고정** + § 1.2.1 큐별 표 추가. § 11 build fail은 schema 필드 검증만 (AR5-03), (4) **outbox SQL stale 검사 강화** — attempts<5 항상 적용 + 별도 reconcile step으로 attempts>=5 → permanent 전이 (AR5-04), (5) **REVIEW_WORKFLOW § 8.1 본문 v0.15 cascade 정합** — operational/calendar 슬롯 분리 명시 (AR5-05), (6) **`queryDailyUserMeasurements()` calendar 산정 API** — legal 검수자용 read API. primarySource·botFilteringPolicy override 가능 (AR5-06), (7) **`ComplianceRecord.legalCounsel`·`legalCounselAt` top-level 필드 명시** — `mediaThresholdAssessment` nested 아님 (AR5-07), (8) **AnalyticsRedactionAudit.expiresAt 필드 + retention purge worker** — `processedAt + retentionDays.rawRedactionAuditTrail` 기준 (AR5-08): (1) **C-08 `analyticsPolicyVersion` cascade** — 패키지 병렬 보관 + manifest opt-in (AR4-01), (2) scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze (AR4-02), (3) lock ordering invariant — attempt lock 보유 중 envelope lock 금지 (AR4-03), (4) ReportInstance outbox dispatch-failed-retryable vs -permanent 분리 + 5회 한도 (AR4-04), (5) MediaThresholdReassessmentDispatchOutbox 동일 분리 (AR4-05), (6) outbox worker SoT claim SQL — SKIP LOCKED (AR4-06), (7) 공통 retry taxonomy § 1.2.1 (AR4-07), (8) **C-10 v0.15 cascade — mediaThresholdOperationalInput 슬롯 신설** + REVIEW_WORKFLOW § 8.1.1 정정. rolling은 operational 슬롯, calendar는 assessment 슬롯 (AR4-08), (9) sourceCompleteness 산식 — dailyUsers 존재 + dataCompleteness >= 0.9 일자만 (AR4-09), (10) AnalyticsRedactionAudit 모든 projection마다 생성 (AR4-10), (11) projection + DB writes 단일 transaction + crash recovery (AR4-11), (12) date QueryFilter window intersection + `YYYY-MM` startsWith 허용 (AR4-12), (13) joinMode="metric-columns" opt-in cross-source join (AR4-13), (14) status 명칭 cross-Feature 분리 가이드 (AR4-14), (15) § 0·§ 10.1 12 tables 정정 (AR4-15), (16) § 11 build/runtime/warning 3분리 (AR4-16): (1) CollectionSourceAttempt.status enum SoT — `processing` 포함 (AR3-01), (2) **retry worker attemptNumber 동시성 advisory lock** — (collectionLogId, source) 범위 (AR3-02), (3) retry exhausted → `failed-permanent` + envelope 재계산 우선순위 표 (AR3-03·04), (4) **canonicalSources + manifestVersion idempotencyKey 포함** — manifest 변경 시 새 lineage 명시 (AR3-05), (5) forceRefresh validation — `=== true` + non-empty refreshIntentId (AR3-06), (6) generateReport force refresh lineage 별도 row 생성 (AR3-07), (7) **ReportInstance outbox 패턴** — notificationDispatchClaim·outbox reconcile worker (AR3-08), (8) MediaThresholdState.currentState enum 통일 — `below-threshold`/`above-threshold` (AR3-09·23), (9) enterStreak/exitStreak reset 규칙 — 반대 streak 0 + 결측·dataCompleteness<0.9는 hold + basisKey 변경 시 reset (AR3-10), (10) transitionEventId hash에 basisKey·threshold 포함 (AR3-11), (11) **enqueueMediaThresholdReassessment outbox 재시도** — MediaThresholdReassessmentDispatchOutbox 신설 + 1분 주기 worker (AR3-12), (12) **measurementSnapshot 필드 매핑표** — DATA_MODEL C-10 MediaThresholdAssessment 필드별 산출 (AR3-13), (13) **multi-metric mixed source validation error** + `metricSourceMap` 응답 필드 (AR3-14), (14) dataCompletenessBreakdown에 `date` 필드 포함 (AR3-15), (15) **QueryFilter dimension별 최대 1개**·op 조합 truth table (AR3-16), (16) DST SoT — Temporal disambiguation `later`/`earlier` 매핑 (AR3-17), (17) missedRunCarryOverMaxDays 초과 → skipped-missed-run-expired + sink alert (AR3-18), (18) rate limit bucketKey 형식 `ar:quota:{provider}:{credentialHash}` (AR3-19), (19) **redaction memory-only projection** — provider 응답 직후 + projection 전 payload 어디에도 저장 금지 (AR3-20), (20) **AnalyticsRedactionAudit** 신설 — rawPayloadStorage.enabled=false 감사 증거 (AR3-21), (21) DSR reasonCode enum + reasonHumanMessage 분리 + subjectIdentifierHash optional (AR3-22), (22) § 14.7 참조 정정 — MediaThresholdState (AR3-23), (23) **CollectionLog manifestVersion 필드 추가**, ReportInstance에 notificationDispatchClaim·attempts 필드: (1) sources canonicalization — undefined는 활성 source sorted 전체 (AR2-01), (2) forceRefresh + refreshIntentId 입력 + 별도 idempotencyKey 산정 (AR2-02), (3) **CollectionSourceAttempt 신설** — envelope 1건 + per-source 상태 분리 (AR2-03), (4) ReportInstance UNIQUE 통일 — `(instanceId, idempotencyKey)` (AR2-04), (5) ReportInstance.notificationDispatchedAt 영구 저장 — notify receipt 만료 후 재발송 차단 (AR2-05), (6) **MediaThresholdState 테이블 신설** — currentState·streak·lastTransitionEventId (AR2-06), (7) DailyUserMeasurement basisKey — primarySource·botPolicy·calendarPolicy·algorithmVersion (AR2-07), (8) **operational vs 법정 분리 명확화** — rolling-90은 priorReviewRequired 산정 금지 (AR2-08), (9) **ComplianceRecord 갱신 주체 분리** — 본 Feature는 snapshot provider only, mutator 아님 (AR2-09), (10) **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade** — notify는 알림용으로만 (AR2-10), (11) ga4CustomFieldAllowlist — customDimensions·customMetrics·eventParameters 명시 등록 (AR2-11), (12) DSR subject-matching not-applicable — aggregated only (AR2-12), (13) rawPayloadStorage.enabled 분리 — allowlist는 항상 required (AR2-13), (14) rateLimit.bucketKeyStrategy — credential-global vs instance-isolated (AR2-14), (15) **CollectionRetryQueue worker claim** — status·lockedAt·lockedBy + SKIP LOCKED (AR2-15), (16) QueryFilter AST + AND/OR semantics (AR2-16), (17) dimensions=[] → single aggregate row (AR2-17), (18) sourceFilter 부재 — metric별 default source + sourceFilter 미지정 + dimensions에 source 없으면 default 단일 사용 (AR2-18), (19) dataCompletenessBreakdown — source/date/metric 단위 (AR2-19), (20) QueryDimension `source` 명칭 통일 (AR2-20), (21) dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21), (22) DST·missed run grammar — dstNonexistentLocalTime·dstAmbiguousLocalTime·missedRunCarryOverMaxDays (AR2-22), (23) reportTemplates schedule grammar — type/dayOfWeek/dayOfMonth/time (AR2-23), (24) § 5.5 참조 정정 (AR2-24) |
docs/features\analytics-reporting.md:966:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:979:§ 6.1 NormalizedMetricRow 스키마 + `UNIQUE(instanceId, date, source, dimensionKey)`.
docs/features\analytics-reporting.md:980:**Index**: `(instanceId, date)`, `(instanceId, page, date)`, `(instanceId, query, date)`, `(instanceId, source, date)`.
docs/features\analytics-reporting.md:988:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:999:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\analytics-reporting.md:1026:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1032:| `notificationDispatchClaim` | enum | ✅ — not-claimed/claimed-pending/dispatched/dispatch-failed-retryable/dispatch-failed-permanent (AR4-04 retryable vs permanent 분리) |
docs/features\analytics-reporting.md:1034:| `notificationDispatchAttempts` | integer | ✅ — outbox reconcile worker 재시도 누적 |
docs/features\analytics-reporting.md:1038:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\analytics-reporting.md:1039:**Index**: `(notificationDispatchClaim, notificationDispatchClaimedAt)` — outbox worker query.
docs/features\analytics-reporting.md:1046:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1059:**Constraints**: `UNIQUE(instanceId, date, basisKey)`. **partial unique index**: `UNIQUE(instanceId, date) WHERE isActiveMeasurement=true` (active 1건/일).
docs/features\analytics-reporting.md:1065:| `instanceId` | Slug | ✅ — PK |
docs/features\analytics-reporting.md:1098:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1114:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1119:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent (AR4-05) |
docs/features\analytics-reporting.md:1128:**Index**: `(claim, claimedAt)` — outbox worker query.
docs/features\analytics-reporting.md:1135:| `instanceId` | Slug | ✅ |
docs/features\analytics-reporting.md:1144:| `expiresAt` | Date | ✅ — `processedAt + retentionDays.rawRedactionAuditTrail`(기본 3년). purge worker 기준 |
docs/features\analytics-reporting.md:1146:**Index**: `(instanceId, processedAt DESC)`, `(expiresAt)`.
docs/features\analytics-reporting.md:1147:**Purge worker**: 일간 `DELETE FROM analytics_redaction_audit WHERE expiresAt < now()`.
docs/features\content-migration.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (**6종** NotificationEventType + **15종** AuditAction cascade 완료)
docs/features\content-migration.md:14:> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개
docs/features\content-migration.md:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
docs/features\content-migration.md:44:| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
docs/features\content-migration.md:45:| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
docs/features\content-migration.md:49:| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
docs/features\content-migration.md:53:| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
docs/features\content-migration.md:56:| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features\content-migration.md:66:- 알림·audit canonical → notifications + REVIEW_WORKFLOW
docs/features\content-migration.md:70:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
docs/features\content-migration.md:72:### 1.2.1 retry taxonomy
docs/features\content-migration.md:131:  legalImpactClassifierRef: "lic-2026-05-15"
docs/features\content-migration.md:148:          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
docs/features\content-migration.md:157:      retry:
docs/features\content-migration.md:163:        retryExhaustedAction: "pause"
docs/features\content-migration.md:174:        rateLimitPerSecond: 50
docs/features\content-migration.md:188:      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
docs/features\content-migration.md:190:        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
docs/features\content-migration.md:191:        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
docs/features\content-migration.md:192:        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
docs/features\content-migration.md:193:        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
docs/features\content-migration.md:194:      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
docs/features\content-migration.md:197:### 2.4 CAS digest 알고리즘 SoT
docs/features\content-migration.md:252:| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
docs/features\content-migration.md:264:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
docs/features\content-migration.md:267:분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.
docs/features\content-migration.md:303:  retryable: boolean;
docs/features\content-migration.md:337:  expectedStatus: RunPrimaryStatus;                     // CAS
docs/features\content-migration.md:367:  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
docs/features\content-migration.md:404:| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
docs/features\content-migration.md:412:same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.
docs/features\content-migration.md:424:2. token 재계산 비교 — 불일치 시 → 401/CAS fail
docs/features\content-migration.md:425:3. expiresAt(retentionDays.dryRunReport) 초과 시 → re-dry-run 강제 (CAS fail)
docs/features\content-migration.md:430:5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
docs/features\content-migration.md:475:### 3.7 writeSetManifest (CM2-06 + CM3-10)
docs/features\content-migration.md:525:  writeSetManifest: WriteSetManifest;
docs/features\content-migration.md:534:| rawArtifactRef (containsPii=true) | 차단 | 허용 (audit 기록) | 허용 (audit 기록) | export 금지 |
docs/features\content-migration.md:535:| writeSetManifest.beforeDigest/afterDigest | 허용 (hash) | 허용 | 허용 | 허용 |
docs/features\content-migration.md:550:   - legalImpactClassifier 실행 (§ 4.7)
docs/features\content-migration.md:553:   - audit plan-validated
docs/features\content-migration.md:558:   - audit dry-run-completed
docs/features\content-migration.md:561:   - audit plan-legal-approved + 알림 plan-legal-approved
docs/features\content-migration.md:564:   - DryRunReport expiresAt CAS
docs/features\content-migration.md:569:   - step 순차 — writeSetManifest 기록
docs/features\content-migration.md:577:1. expectedStatus CAS
docs/features\content-migration.md:578:2. audit rollback-triggered + 알림 rollback-triggered
docs/features\content-migration.md:585:6. audit rollback-applied
docs/features\content-migration.md:624:### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)
docs/features\content-migration.md:628:| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
docs/features\content-migration.md:629:| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
docs/features\content-migration.md:630:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
docs/features\content-migration.md:631:| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
docs/features\content-migration.md:632:| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |
docs/features\content-migration.md:641:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
docs/features\content-migration.md:645:| `audit-append` | append-only audit | 허용 |
docs/features\content-migration.md:649:### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)
docs/features\content-migration.md:654:  SELECT id FROM content_migration_notification_outbox
docs/features\content-migration.md:659:UPDATE content_migration_notification_outbox o
docs/features\content-migration.md:664:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:669:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:671:    next_attempt_at = now() + (interval '1 second' * (CASE attempts
docs/features\content-migration.md:676:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:682:UPDATE content_migration_notification_outbox
docs/features\content-migration.md:689:### 4.7 legalImpactClassifier (CM3-05 — catalog input)
docs/features\content-migration.md:708:retroactive audit — false-negative 발견 시 영향 plan 재평가 절차는 CM-09 v1.x (운영 정책).
docs/features\content-migration.md:718:3. concurrencyLimit·rateLimitPerSecond 적용
docs/features\content-migration.md:752:### 5.2 outbox — § 4.6 SQL
docs/features\content-migration.md:775:| legalImpactClassifier unknown fail-closed 비율 | baseline | |
docs/features\content-migration.md:785:| outbox 발송 성공율 | > 99% | |
docs/features\content-migration.md:791:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
docs/features\content-migration.md:792:| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
docs/features\content-migration.md:798:| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
docs/features\content-migration.md:803:| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
docs/features\content-migration.md:804:| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
docs/features\content-migration.md:825:| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
docs/features\content-migration.md:826:| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
docs/features\content-migration.md:838:| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
docs/features\content-migration.md:878:- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
docs/features\content-migration.md:892:- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
docs/features\content-migration.md:893:- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
docs/features\content-migration.md:897:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
docs/features\content-migration.md:898:- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
docs/features\content-migration.md:900:- rollbackRun expectedStatus CAS 실패
docs/features\content-migration.md:906:- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
docs/features\content-migration.md:912:- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
docs/features\content-migration.md:914:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
docs/features\content-migration.md:915:- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)
docs/features\content-migration.md:925:- stale policyVersionSnapshot → CAS fail
docs/features\content-migration.md:938:- step retry exhausted → § 4.4
docs/features\content-migration.md:940:- DryRunReport expiresAt 도래 → purge
docs/features\content-migration.md:941:- legalHold > unregister > retention purge precedence
docs/features\content-migration.md:942:- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
docs/features\content-migration.md:943:- purge worker — 테이블별:
docs/features\content-migration.md:944:  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
docs/features\content-migration.md:945:  - ContentMigrationPlan (legalApproved 포함): legalHold true
docs/features\content-migration.md:975:| CM-09 | legalImpactClassifier false-negative retroactive 절차 (운영 정책) |
docs/features\content-migration.md:982:| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
docs/features\content-migration.md:1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
docs/features\content-migration.md:1009:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs/features\content-migration.md:1020:| `instanceId` | Slug | ✅ |
docs/features\content-migration.md:1033:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
docs/features\content-migration.md:1034:**Index**: `(instanceId, status)`, `(expiresAt)`.
docs/features\content-migration.md:1088:| `solutionVersion` | integer | ✅ — CAS |
docs/features\content-migration.md:1116:| `writeSetManifest` | JSON (§ 3.7) | optional |
docs/features\content-migration.md:1150:  SELECT id FROM content_migration_step_retry_queue
docs/features\content-migration.md:1155:UPDATE content_migration_step_retry_queue q
docs/features\content-migration.md:1160:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1162:    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
docs/features\content-migration.md:1166:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1171:UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;
docs/features\content-migration.md:1174:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1177:-- + sink alert + run.retryExhaustedAction trigger
docs/features\content-migration.md:1180:UPDATE content_migration_step_retry_queue
docs/features\content-migration.md:1278:dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.
docs/features\content-migration.md:1283:| `instanceId` | Slug | ✅ |
docs/features\content-migration.md:1293:- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
docs/features\content-migration.md:1295:- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`
docs/features\content-migration.md:1305:`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.
docs/features\keyword-monitoring.md:7:> **목적**: 사용자 지정 N개 키워드의 검색 순위·노출·CTR·rank bucket transition 모니터링. analytics-reporting의 queryNormalizedMetrics 데이터 기반. 이상 변동 시 outbox 알림.
docs/features\keyword-monitoring.md:10:> - 알림 발송 SoT → `features/notifications.md` notify() + REVIEW_WORKFLOW § 9.1·§ 9.1.1 (8종 cascade 완료)·§ 10.2.1 (audit 5종 cascade 완료)
docs/features\keyword-monitoring.md:37:  - **매칭 키**: (instanceId, query 또는 page, date, severity 기준) — search-visibility AnomalyRecord 검색
docs/features\keyword-monitoring.md:69:- audit log SoT는 REVIEW_WORKFLOW § 10.2.1 (5종 cascade 완료)
docs/features\keyword-monitoring.md:73:### 1.2.1 공통 retry taxonomy
docs/features\keyword-monitoring.md:75:search-visibility § 1.2.1 동일 — 2종 retry 구조:
docs/features\keyword-monitoring.md:184:        dsnSecretRef: "secretRef://MONITORING_DSN"
docs/features\keyword-monitoring.md:196:| 실행 command | `detectAnomalies(input)` | 이상 변동 감지 + outbox enqueue |
docs/features\keyword-monitoring.md:198:| 운영 command | `registerKeyword(target)` | 키워드 추적 등록. **권한: operator·super-admin**. audit `keyword-tracking-target-registered` (§ 3.1.1) |
docs/features\keyword-monitoring.md:199:| 운영 command | `unregisterKeyword(targetId)` | **soft delete (active=false)**. 기존 snapshot·anomaly 보존. **권한: operator·super-admin**. audit `keyword-tracking-target-unregistered` (§ 3.1.1) |
docs/features\keyword-monitoring.md:200:| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` | retroactive enqueue. **권한: super-admin 전용**. audit `keyword-monitoring-retroactive-enqueue-requested` (§ 3.1.1) |
docs/features\keyword-monitoring.md:202:### 3.1.1 audit log contract (KM2-06)
docs/features\keyword-monitoring.md:209:| `keyword-monitoring-retroactive-enqueue-requested` | `"instance:" + instanceId` (synthetic — search-visibility § 7.5 패턴 동일) | windowStart·windowEnd·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId·actorRole="super-admin" |
docs/features\keyword-monitoring.md:210:| `keyword-tracking-target-migrated-v02-v03` | `"instance:" + instanceId` | § 10.3 migration audit contract metadata 참조 (decompositions[]·conflictResolutions[]·actorRole="super-admin") |
docs/features\keyword-monitoring.md:217:  instanceId: Slug;
docs/features\keyword-monitoring.md:268:    notify: boolean;                                   // KMF3-04 — outbox enqueue 대상 여부
docs/features\keyword-monitoring.md:279:- `notify=false`: ctr-up direction (anomalyRecord 저장만, outbox 미enqueue) → `notificationSuppressionReason="not-enqueue-eligible"`
docs/features\keyword-monitoring.md:280:- `notify=false`: mode="monitor-only" (모든 anomaly outbox 미enqueue) → `notificationSuppressionReason="monitor-only-mode"`
docs/features\keyword-monitoring.md:282:- `notify=true`: outbox enqueue 대상. 발송 완료 시 `notificationEventId` 채움
docs/features\keyword-monitoring.md:329:  instanceId,
docs/features\keyword-monitoring.md:373:## 6. 알림 (outbox 패턴)
docs/features\keyword-monitoring.md:377:| eventType | anomalySeverity | notificationCriticality (REVIEW_WORKFLOW § 9.1.1) | outbox enqueue |
docs/features\keyword-monitoring.md:388:| `keyword-monitoring-monitoring-failed` | (anomaly 아님 — operational) | high | ✅ (별도 outbox sourceKind="monitoring-log") |
docs/features\keyword-monitoring.md:395:- **outbox sourceKind/sourceId 일반화** (F-6 + KM2-03 정정):
docs/features\keyword-monitoring.md:398:  - sourceKind="rank-bucket-transition" + sourceId=**transitionEventId** (KM2-03 — 각 transition별 고유 ID. KeywordRankBucketState.lastTransitionEventId와 동일 식별자. AnomalyRecord 생성과 별개로 outbox row 생성 가능)
docs/features\keyword-monitoring.md:399:- UNIQUE constraint: `UNIQUE(sourceKind, sourceId, eventType)` (단일 source·eventType별 1 outbox 1건. rank-bucket-transition은 transition별 별도 sourceId라 동일 target의 후속 transition도 정상 enqueue)
docs/features\keyword-monitoring.md:406:**원자성** (KMF3-02 — state + outbox 단일 transaction):
docs/features\keyword-monitoring.md:409:   - acquire 실패 시 → **idempotent no-op + early exit** (다른 worker가 이미 처리 중). retryable error 아님 (KMF4-04)
docs/features\keyword-monitoring.md:414:   a. KeywordRankBucketState UPDATE — `WHERE keywordTargetId=? AND lastTransitionEventId IS DISTINCT FROM ?`로 compare-and-set
docs/features\keyword-monitoring.md:421:- 동시 detector 또는 forceRefresh — advisory lock + compare-and-set + UNIQUE 3중 보호로 중복 enqueue 차단
docs/features\keyword-monitoring.md:431:| `keyword-monitoring-monitoring-failed` | `"instance:" + instanceId` (synthetic) | `"키워드 모니터링 cycle 실패 (${date})"` | monitoringLogId·failedSources[]·detectedAt |
docs/features\keyword-monitoring.md:439:§ 3.1 `enqueueOutboxForExistingAnomalies` — super-admin 전용·dryRun 기본 true·audit `keyword-monitoring-retroactive-enqueue-requested`
docs/features\keyword-monitoring.md:451:| keywordRank | **anomaly suppression ledger** | key=hash(instanceId+signal+keywordTargetId+severity+keywordMonitoringPolicyVersion) |
docs/features\keyword-monitoring.md:475:- outbox dispatch-failed-permanent 발생
docs/features\keyword-monitoring.md:481:search-visibility § 9 패턴 동일. resolutionStatus 5종 (open·true-positive·false-positive·resolved·ignored). 권한: operator·super-admin. audit log: `keyword-anomaly-resolution-updated` (REVIEW_WORKFLOW § 10.2.1 cascade 완료).
docs/features\keyword-monitoring.md:504:  - 운영자 명시 액션 `migrateKeywordTrackingTargetsV02toV03(instanceId, dryRun)` (super-admin 전용)
docs/features\keyword-monitoring.md:506:  - dryRun=false: 실제 분해 + audit log `keyword-tracking-target-migrated-v02-v03` (KMF3-01 — **v1.0 cascade 완료**. REVIEW_WORKFLOW § 10.2.1 AuditAction enum 추가)
docs/features\keyword-monitoring.md:507:  - audit contract: contentRef=`"instance:" + instanceId`, metadata={
docs/features\keyword-monitoring.md:553:- **REVIEW_WORKFLOW § 10.2.1 AuditAction enum에 5종(register/unregister/resolution/retroactive/migrated) 모두 포함 검증** (KMF3-07 — runtime audit insert 실패 방지)
docs/features\keyword-monitoring.md:572:- **rank-bucket transition 원자성 invariant**: KeywordRankBucketState.lastTransitionEventId 갱신과 KeywordAnomalyNotificationOutbox(sourceKind="rank-bucket-transition") insert가 단일 transaction 외부에서 발생한 sequence 감지 (예: state만 갱신·outbox row 부재 또는 그 반대) → reconcile job 트리거
docs/features\keyword-monitoring.md:573:- **outbox dispatch-failed-permanent 누적** > 임계 → 운영팀 알림
docs/features\keyword-monitoring.md:576:  - `KeywordAnomalyNotificationOutbox.claimedAt > 5분` (§ 6.2 outbox SQL 정합) → 재claim
docs/features\keyword-monitoring.md:608:| ~~KM-12~~ | `keyword-anomaly-resolution-updated` audit cascade | v0.2 — REVIEW_WORKFLOW § 10.2.1 cascade 완료 |
docs/features\keyword-monitoring.md:609:| ~~KM-13~~ | `keyword-monitoring-retroactive-enqueue-requested` audit cascade | v0.2 — REVIEW_WORKFLOW § 10.2.1 cascade 완료 |
docs/features\keyword-monitoring.md:620:- **partial unique index** — `UNIQUE(instanceId, keyword, country, device, searchEngine) WHERE active=true` (PostgreSQL 기준)
docs/features\keyword-monitoring.md:622:- 다른 DBMS는 generated column `activeKey = CASE WHEN active=true THEN 1 ELSE NULL END` + `UNIQUE(instanceId, keyword, country, device, searchEngine, activeKey)` (notifications DLQ partial unique 패턴 동일)
docs/features\keyword-monitoring.md:627:1. advisory lock acquire (hash(instanceId, keyword, country, device, searchEngine))
docs/features\keyword-monitoring.md:628:2. 동일 (instanceId, keyword, country, device, searchEngine, active=true) 검사:
docs/features\keyword-monitoring.md:641:**Index**: `(instanceId, active)`, `(instanceId, category)`.
docs/features\keyword-monitoring.md:648:| `instanceId` | Slug | ✅ |
docs/features\keyword-monitoring.md:662:**Index**: `(instanceId, signal, date)`, `(keywordTargetId, signal, date)`, `(expiresAt)`.
docs/features\keyword-monitoring.md:693:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
docs/features\keyword-monitoring.md:700:**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)` (F-6 — sourceKind·sourceId·eventType별 1 outbox row).
docs/features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
docs/features\notifications.md:7:> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
docs/features\notifications.md:11:> - audit log enum(`notification-dispatched`·`notification-resend-attempted`·`notification-read`) → `admin/REVIEW_WORKFLOW.md` § 10
docs/features\notifications.md:21:- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
docs/features\notifications.md:22:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
docs/features\notifications.md:55:- audit log enum SoT는 `admin/REVIEW_WORKFLOW.md` § 10.2.1
docs/features\notifications.md:106:  email: { enabled: true, transport: "ses", secretRef: "secretRef://EMAIL_TRANSPORT_KEY", sender: "notice@clinic.example.com", replyTo: "ops@glitzy.kr", rateLimitPerHour: 100 }
docs/features\notifications.md:107:  slack: { enabled: true, webhookUrlSecretRef: "secretRef://SLACK_WEBHOOK_URL", rateLimitPerHour: 60 }
docs/features\notifications.md:118:      retryMaxAttempts: 3
docs/features\notifications.md:119:      retryBackoffSeconds: [30, 300, 1800]
docs/features\notifications.md:132:      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
docs/features\notifications.md:195:  | "failed-retrying"
docs/features\notifications.md:223:  1. NotificationLog insert (UUID 생성)
docs/features\notifications.md:224:  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
docs/features\notifications.md:227:  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
docs/features\notifications.md:228:  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
docs/features\notifications.md:247:   - NotificationLog insert (UUID 생성)
docs/features\notifications.md:248:   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
docs/features\notifications.md:250:     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
docs/features\notifications.md:251:     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음
docs/features\notifications.md:290:   - delivered → NotificationLog summary 갱신
docs/features\notifications.md:291:   - failed-retrying → 재시도 큐
docs/features\notifications.md:292:   - failed-permanent → DLQ 저장 (§ 7.2) + suppression 갱신(§ 7.1) + 외부 sink alert
docs/features\notifications.md:298:7. receiptState="completed" + audit log `notification-dispatched` (envelope 1건)
docs/features\notifications.md:320:  notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}
docs/features\notifications.md:322:    notif:dedupe:{instanceId}:{sourceEventId}:broadcast:{channel}
docs/features\notifications.md:332:  - 발송 시도 직전: SET NX EX "failed-retrying" (dedupeWindowSeconds + 300)
docs/features\notifications.md:342:  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
docs/features\notifications.md:349:- 채널별 시간당 한도: C-08 `rateLimitPerHour`
docs/features\notifications.md:366:- 실패 처리: 6단계 직후 worker 장애 시 attempt status="processing" 그대로 남음. 운영 worker가 stale processing(>SLA) 감지 → status="failed-retrying" 또는 운영 alert로 정리 (NT-17)
docs/features\notifications.md:375:- C-08 `notificationChannels.email` 적용 (transport·secretRef·sender·replyTo)
docs/features\notifications.md:388:- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:slack`
docs/features\notifications.md:398:- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:broadcast:slack` (sentinel "broadcast" 사용)
docs/features\notifications.md:411:- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
docs/features\notifications.md:530:| email | `transient` | SMTP 4xx, network timeout, provider 5xx | 재시도 3회 | **atomic increment** `observedCount`. **compare-and-set**으로 threshold 도달 시 1회만 state=`soft-suppressed` + `autoReleaseAt = lastObservedAt + softSuppressionAutoReleaseDays` 설정 |
docs/features\notifications.md:531:| email | `permanent` (hard bounce) | 5xx 영구·invalid recipient | DLQ + sink alert | 즉시 `hard-suppressed` (자동 해제 없음) |
docs/features\notifications.md:532:| email | `permanent` (config) | provider auth 401/403 | DLQ + sink alert (긴급) | 갱신 없음 |
docs/features\notifications.md:533:| email | `permanent` (spam) | spam complaint | DLQ + sink alert | 즉시 `hard-suppressed` |
docs/features\notifications.md:536:| slack | `permanent` | 4xx (404·403) | DLQ + sink alert | webhook 자체 문제 — webhookUrlSecretRef 점검 alert |
docs/features\notifications.md:537:| slack | `rate-limited` | 429 + Retry-After | header + retryBackoff | 갱신 없음 |
docs/features\notifications.md:538:| inApp | `transient` | DB 일시 | 1회 재시도, 실패 시 DLQ | 갱신 없음 |
docs/features\notifications.md:539:| inApp | `permanent` | DB 스키마·constraint | DLQ + sink alert (긴급) | 갱신 없음 |
docs/features\notifications.md:549:### 7.2 DLQ + resendDeadLetter
docs/features\notifications.md:557:- 발송 성공 → DeadLetter.resolvedAt 마킹 + NotificationLog summary 재계산
docs/features\notifications.md:559:- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)
docs/features\notifications.md:562:- DLQ `expiresAt`: 기본 30일 (NT-12)
docs/features\notifications.md:563:- NotificationLog·PayloadRecord·DeliveryAttempt: DLQ `expiresAt` + `logRetentionDaysAfterDlqExpiry`(기본 90일) 이상 보존
docs/features\notifications.md:570:| `externalMonitoringSink` | permanent 실패, DB 장애, DLQ 누적 임계 초과, rate-limit 발생률 > 30%, fallback 채널도 hard-suppressed | Sentry·Datadog·PagerDuty |
docs/features\notifications.md:571:| `auditLog` | envelope 종결·재발송·읽음 | 어드민 콘솔 |
docs/features\notifications.md:572:| `NotificationLog` | per-payload·per-attempt | 운영 메트릭 SoT |
docs/features\notifications.md:587:- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`
docs/features\notifications.md:646:| transient 재시도율 | failed-retrying / 전체 | < 5% |
docs/features\notifications.md:648:| DLQ 신규 발생 | failed-permanent / 일 | < 10 |
docs/features\notifications.md:656:- NotificationLog·DeliveryAttempt·PayloadRecord가 SoT
docs/features\notifications.md:657:- audit log는 envelope 요약·재발송·읽음만
docs/features\notifications.md:662:- DLQ 신규 > 10/일
docs/features\notifications.md:675:# 3. secretRef 등록 (이메일·Slack·monitoring sink)
docs/features\notifications.md:689:| **fail** | `enabled=true` + 전체 채널 `enabled=false`, email 활성 + secretRef·sender 누락, slack 활성 + webhookUrlSecretRef 누락, `adminBaseUrl`·`timezone` 누락, `ctaRouteTemplates.default` 누락, `externalMonitoringSink.dsnSecretRef` 누락, `notificationPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치, `clientApproverBusinessHoursAware=true` + `holidayCalendar` 누락, **`clientApproverBusinessHoursAware=true` + multi-location 인스턴스 + LocationProfile `@id="main"` 부재** (N4-29 fail 격상) |
docs/features\notifications.md:702:| NT-12 | DLQ 보존 기간 — 기본 30일 vs 운영 | 운영 정책 |
docs/features\notifications.md:710:| ~~NT-01~~ | Slack webhook secretRef | v0.2 |
docs/features\notifications.md:716:| ~~NT-10~~ | NotificationLog vs audit log | v0.2 |
docs/features\notifications.md:717:| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
docs/features\notifications.md:719:| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
docs/features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs/features\notifications.md:743:- 인스턴스 격리: `instanceId` 컬럼 + index. recipient의 AdminUser.instanceMemberships에 본 instanceId 미포함 시 `skipped-missing-user` 처리 (§ 4.1 4.a)
docs/features\notifications.md:750:| `instanceId` | Slug | ✅ | |
docs/features\notifications.md:752:| `notificationLogId` | UUID | ✅ | NotificationLog FK |
docs/features\notifications.md:757:**Constraints**: `UNIQUE(instanceId, sourceEventId)`. **트랜잭션 순서**: 단일 트랜잭션에서 NotificationLog INSERT → Receipt INSERT. abort 시 양쪽 롤백.
docs/features\notifications.md:758:**Index**: `(instanceId, sourceEventId)` unique, `(receiptState, acceptedAt)`.
docs/features\notifications.md:834:### 14.6 `NotificationLog` (envelope 단위 메트릭)
docs/features\notifications.md:839:| `instanceId` | Slug | ✅ | |
docs/features\notifications.md:849:**Constraints**: `UNIQUE(eventId)`, `UNIQUE(instanceId, sourceEventId)`.
docs/features\notifications.md:850:**Index**: `(instanceId, sourceEventId)`, `(eventType, acceptedAt)`, `(completedAt)`.
docs/features\notifications.md:872:| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
docs/features\notifications.md:876:**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
docs/features\notifications.md:899:| `bucketKey` | string | ✅ — `business:{recipientId}:{instanceId}:{locationRef}:{releaseAt}` |
docs/features\notifications.md:913:키: notif:dedupe:{instanceId}:{sourceEventId}:{recipientId|"broadcast"}:{channel}
docs/features\notifications.md:914:값: { state: "failed-retrying" | "delivered" | "failed-permanent", payloadId, attemptedAt }
docs/features\notifications.md:917:  failed-retrying: dedupeWindowSeconds + 300
docs/features\notifications.md:951:| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
docs/features\notifications.md:957:- **`UNIQUE(attemptId)`** — 1개 DeliveryAttempt는 정확히 1개 DLQ에만 속함 (N4-25 정정). 여러 DLQ 연결 의미 모호 회피
docs/features\notifications.md:967:-- 활성 DLQ는 1 (resolved 안 됨), 종결된 DLQ는 NULL (unique 제약 무시) — N5-05 정정
docs/features\notifications.md:968:activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
docs/features\notifications.md:972:--   - activeKey=1 row가 (payloadId, failingChannel)별 0~1건 (active DLQ unique)
docs/features\search-visibility.md:7:> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·outbox 알림. 자체 SERP 크롤링은 법무 승인 게이트(approvedScope 구조화) 필수.
docs/features\search-visibility.md:15:- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지·outbox 알림·대시보드 read API
docs/features\search-visibility.md:48:- 본 문서 = 신호 정의·detector·state·이상 감지·outbox 알림 SoT + 내부 데이터 구조 SoT (§ 13)
docs/features\search-visibility.md:50:### 1.2.1 공통 retry taxonomy (SV2-15 신설)
docs/features\search-visibility.md:52:본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:
docs/features\search-visibility.md:59:| `*-retryable` | attempts < maxAttempts 시 자동 재시도 대상 |
docs/features\search-visibility.md:122:    legalApproved: true
docs/features\search-visibility.md:123:    legalApprovedBy: "legal@glitzy.kr"
docs/features\search-visibility.md:124:    legalApprovedAt: "2026-05-10T00:00:00Z"
docs/features\search-visibility.md:137:    apiKeySecretRef: "secretRef://AHREFS_API_KEY"
docs/features\search-visibility.md:214:        dsnSecretRef: "secretRef://MONITORING_DSN"
docs/features\search-visibility.md:226:| 실행 command | `detectAnomalies(input)` | 이상 감지 + outbox enqueue (alerting 모드) |
docs/features\search-visibility.md:235:- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`
docs/features\search-visibility.md:270:  instanceId,
docs/features\search-visibility.md:302:  - **site-overall target**: `SUM(impressions) WHERE instanceId=this AND date=t` (전체 합산)
docs/features\search-visibility.md:338:- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 outbox enqueue (alerting 모드)
docs/features\search-visibility.md:345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
docs/features\search-visibility.md:373:  - `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → build fail
docs/features\search-visibility.md:409:- **suppression key**: `hash(instanceId + signal + targetKind + targetId + severity + searchVisibilityPolicyVersion)`
docs/features\search-visibility.md:426:## 7. 알림 (outbox 패턴 + eventType 기반 enqueue)
docs/features\search-visibility.md:432:### 7.2 outbox enqueue 조건 — eventType 기반 (SV2-13 정정)
docs/features\search-visibility.md:444:### 7.3 발송 흐름 — outbox SQL
docs/features\search-visibility.md:446:v0.2 § 7.2 outbox SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + attempts<5 + permanent 전이).
docs/features\search-visibility.md:453:| `search-visibility-monitoring-failed` | `"instance:" + instanceId` (synthetic — envelope 단위) | `"Search visibility monitoring failed (${date})"` | monitoringLogId·failedSources[]·detectedAt |
docs/features\search-visibility.md:458:- `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)` (anomaly 연관 이벤트). monitoring-failed는 `hash("search-visibility:" + instanceId + "monitoring-failed:" + dateOfFailure)`로 fallback
docs/features\search-visibility.md:461:- `createdAt`: detectedAt 또는 outbox enqueue 시각
docs/features\search-visibility.md:463:DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.
docs/features\search-visibility.md:465:### 7.5 mode 변경 정책 + retroactive outbox command (SV2-14·SV3-06 closure)
docs/features\search-visibility.md:467:- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive outbox 생성 금지**. 신규 anomaly만 발송
docs/features\search-visibility.md:474:- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
docs/features\search-visibility.md:479:  - `UNIQUE(anomalyRecordId)`로 outbox 측 차단 + sourceEventId hash 안정성으로 양층 보호
docs/features\search-visibility.md:480:- **audit log** (SV5-02): action=`search-visibility-retroactive-enqueue-requested` (REVIEW_WORKFLOW § 10.2.1 cascade 완료):
docs/features\search-visibility.md:481:  - `contentRef = "instance:" + instanceId` (synthetic — batch 단위 액션이라 단일 콘텐츠 ref 없음)
docs/features\search-visibility.md:484:- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications outbox worker 의존)
docs/features\search-visibility.md:520:- **`serpCrawler.enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락)** (SV2-01 정합)
docs/features\search-visibility.md:531:1. `serpCrawler.enabled=true`이면 → approvedScope required 검증·legalApproved 게이트 먼저
docs/features\search-visibility.md:566:| SV-12 | `anomaly-resolution-updated` audit cascade | REVIEW_WORKFLOW § 10.2.1 후속 |
docs/features\search-visibility.md:574:| ~~SV-13~~ | `search-visibility-retroactive-enqueue-requested` audit cascade | v0.5 — REVIEW_WORKFLOW § 10.2.1 AuditAction enum 정식 cascade 완료 (SV4-02) |
docs/features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
docs/features\search-visibility.md:603:| `instanceId` | Slug | ✅ |
docs/features\search-visibility.md:618:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features\search-visibility.md:630:UPDATE search_visibility_collection_retry_queue
docs/features\search-visibility.md:633:  SELECT id FROM search_visibility_collection_retry_queue
docs/features\search-visibility.md:681:| `instanceId` | Slug | ✅ |
docs/features\search-visibility.md:692:**Constraints**: `UNIQUE(instanceId, signal, targetKind, targetId)`.
docs/features\search-visibility.md:699:  - **canonical object key format**: `{blobStorage.keyPrefix}{instanceId}/{YYYY-MM-DD}/{artifactId}.{ext}` (예: `search-visibility/client-01/2026-05-14/abc123.html`)
docs/features\search-visibility.md:700:  - signed URL 발급 API는 호출자 AdminUser.instanceMemberships에 본 instanceId 포함 여부 검증 (미포함 시 403)
docs/features\search-visibility.md:706:      "Resource": "arn:aws:s3:::glitzy-sv-artifacts/search-visibility/${aws:PrincipalTag/instanceId}/*",
docs/features\search-visibility.md:707:      "Condition": { "StringEquals": { "aws:PrincipalTag/instanceId": "${...}" } }
docs/features\search-visibility.md:723:- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 outbox 1건만

codex
feature spec 쪽은 notifications 11테이블, crm-sync 15테이블, content-migration 12테이블처럼 이미 개별 Feature마다 상당한 운영 테이블과 동시성 불변식을 요구합니다. 따라서 infra 문서가 “Week 3 Core 30+ tables, Week 4 공통 패턴 1주”로 묶은 부분은 가장 강하게 일정/범위 재산정이 필요해 보입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "INFRA1-|CM[0-9]+-|CS[0-9]+-|finding_id|findings|severity|recommendation|ready_for_v1_0|blocking" docs -g "*.md" -g "*.json"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "INV-" docs/features/content-migration.md docs/features/crm-sync.md docs/features/notifications.md docs/features/asset-ingestion.md docs/features/analytics-reporting.md docs/features/search-visibility.md docs/features/keyword-monitoring.md docs/features/compliance-assistant.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "Week|Phase 0|Phase 1|M0|16|DPA|legal-reviewer|legalApproved|legal approval|approvalRequired" docs/decisions/INFRA_DECISIONS_DRAFT.md docs/features docs/admin docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
 succeeded in 586ms:
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:147:  - canonical RiskRule: `guarantee-composite-001` (CompositeRiskRule, severity=fail)
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:233:| 단계 | RiskRule (예시 ID) | severity | requiredApproverRoles | 적용 조건 |
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
docs\compliance\RISK_LEVELS.md:169:    severity: "fail"
docs\compliance\RISK_LEVELS.md:184:    severity: "fail"
docs\compliance\RISK_LEVELS.md:222:**severity·scope·roles**
docs\compliance\RISK_LEVELS.md:225:| `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
docs\compliance\RISK_LEVELS.md:236:| `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
docs\compliance\RISK_LEVELS.md:238:| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
docs\compliance\RISK_LEVELS.md:281:#### 3.3.1 severity별 `requiredApproverRoles` 처리 정책
docs\compliance\RISK_LEVELS.md:283:| severity | requiredApproverRoles 처리 |
docs\compliance\RISK_LEVELS.md:342:      severity: "warning"                 # 한의 컨텍스트에서 완화 (단순 예시)
docs\compliance\RISK_LEVELS.md:353:   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
docs\compliance\RISK_LEVELS.md:393:- 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
docs\compliance\RISK_LEVELS.md:589:  severity: "content-gate",
docs\compliance\RISK_LEVELS.md:664:- 빌드 시 룰 충돌(`id` 중복 또는 동일 패턴 + 다른 severity) 검출 시 fail
docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
docs\core\CONTENT_STANDARDS.md:338:RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
docs\core\CONTENT_STANDARDS.md:410:  severity: "content-gate",
docs\core\CONTENT_STANDARDS.md:418:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
docs\core\CONTENT_STANDARDS.md:432:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
docs\core\CONTENT_STANDARDS.md:451:  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
docs\core\CONTENT_STANDARDS.md:452:  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
docs\core\CONTENT_STANDARDS.md:453:  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
docs\core\CONTENT_STANDARDS.md:454:  // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
docs\core\CONTENT_STANDARDS.md:455:  findingsBySeverity: {
docs\core\CONTENT_STANDARDS.md:463:  // 상세 findings
docs\core\CONTENT_STANDARDS.md:464:  findings: Finding[];
docs\core\CONTENT_STANDARDS.md:468:// - findings에 severity="fail" 1개 이상 → "block"
docs\core\CONTENT_STANDARDS.md:469:// - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
docs\core\CONTENT_STANDARDS.md:470:// - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
docs\core\CONTENT_STANDARDS.md:484:  severity: "info" | "warning" | "fail" | "content-gate";
docs\core\CONTENT_STANDARDS.md:512:  severity: "info" | "warning" | "fail" | "content-gate";
docs\core\CONTENT_STANDARDS.md:514:  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
docs\core\CONTENT_STANDARDS.md:536:  severity: "info" | "warning" | "fail" | "content-gate";  // 4종 모두 허용
docs\core\CONTENT_STANDARDS.md:575:- pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선
docs\core\CONTENT_STANDARDS.md:577:#### 7.4.2 severity 우선순위
docs\core\CONTENT_STANDARDS.md:579:같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):
docs\core\CONTENT_STANDARDS.md:585:- 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
docs\core\CONTENT_STANDARDS.md:592:- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
docs\core\CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs\core\CONTENT_STANDARDS.md:645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs\core\CONTENT_STANDARDS.md:647:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
docs\admin\REVIEW_WORKFLOW.md:483:  | "search-visibility-anomaly-critical"     // critical severity anomaly
docs\admin\REVIEW_WORKFLOW.md:484:  | "search-visibility-anomaly-warning"      // warning severity anomaly
docs\admin\REVIEW_WORKFLOW.md:503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
docs\admin\REVIEW_WORKFLOW.md:508:  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
docs\admin\REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs\admin\REVIEW_WORKFLOW.md:513:  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
docs\admin\REVIEW_WORKFLOW.md:514:  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
docs\admin\REVIEW_WORKFLOW.md:682:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
docs\admin\REVIEW_WORKFLOW.md:687:  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
docs\admin\REVIEW_WORKFLOW.md:690:  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
docs\admin\REVIEW_WORKFLOW.md:691:  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
docs\admin\REVIEW_WORKFLOW.md:695:  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
docs\admin\REVIEW_WORKFLOW.md:697:  | "content-migration-run-paused"            // CM3-01
docs\admin\REVIEW_WORKFLOW.md:698:  | "content-migration-run-resumed"           // CM3-01
docs\admin\REVIEW_WORKFLOW.md:699:  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
docs\admin\REVIEW_WORKFLOW.md:705:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs\admin\REVIEW_WORKFLOW.md:706:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs\features\asset-ingestion.md:184:// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
docs\features\asset-ingestion.md:190://   - inferredRiskLevel은 finding severity 기반 보수적 산정 (Medium 기본)
docs\features\asset-ingestion.md:194:- **AssetTag 변환**: result.findings[]의 category·ruleId를 AssetTag.tagKind=`compliance-finding`로 저장
docs\features\asset-ingestion.md:195:- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
docs\features\asset-ingestion.md:196:- **inlineRiskFlags**: result.findings[] metadata에서 추출하여 별도 AssetTag로 저장
docs\core\DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
docs\core\DATA_MODEL.md:712:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
docs\core\DATA_MODEL.md:715:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs\core\DATA_MODEL.md:716:| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
docs\core\DATA_MODEL.md:718:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
docs\core\DATA_MODEL.md:720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
docs\core\DATA_MODEL.md:726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
docs\core\DATA_MODEL.md:730:| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
docs\core\DATA_MODEL.md:731:| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
docs\core\DATA_MODEL.md:732:| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |
docs\core\DATA_MODEL.md:818:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
docs\core\DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
docs\core\DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs\core\DATA_MODEL.md:1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
docs\features\compliance-assistant.md:135:  findingsBySeverity: {
docs\features\compliance-assistant.md:142:  findings: Finding[];
docs\features\compliance-assistant.md:157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
docs\features\compliance-assistant.md:208:   d. Finding[]은 **각 매칭 모두 보존** — 낮은 severity finding도 제거하지 않음 (감사 추적용)
docs\features\compliance-assistant.md:218:   - `severity: "content-gate"`
docs\features\compliance-assistant.md:222:8. severity 집계 → ComplianceCheckResult 산출:
docs\features\compliance-assistant.md:223:   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
docs\features\compliance-assistant.md:224:   - `buildBlocked` = findings 중 fail 1+ 존재
docs\features\compliance-assistant.md:225:   - `gateRequired` = findings 중 content-gate 1+ 존재
docs\features\compliance-assistant.md:226:   - `hasWarnings` = findings 중 warning 1+ 존재
docs\features\compliance-assistant.md:237:  // ... 기존 필드 (ruleId·category·pattern·severity·location·suggestion·requiredApproverRoles)
docs\features\compliance-assistant.md:266:4. severity·requiredApproverRoles·suggestion은 CompositeRiskRule 정의 따름
docs\features\compliance-assistant.md:319:- 정적 룰 검수 결과 (findings[])
docs\features\compliance-assistant.md:324:3. severity 제안 (info | warning | fail | content-gate)
docs\features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
docs\features\compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
docs\features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs\features\content-migration.md:3:> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외 — anchor residue 정정 완료)
docs\features\content-migration.md:26:- **DB 인벤토리 (CM5-01 정정)**: **12 tables** (§ 12.1 ~ § 12.12 — PolicyReevaluateRecord 별도 table 승격·ActiveTargetLock 신설)
docs\features\content-migration.md:32:### 1.1 변경 정책 (CM3-18 catalog 추가)
docs\features\content-migration.md:46:| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
docs\features\content-migration.md:47:| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
docs\features\content-migration.md:48:| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
docs\features\content-migration.md:56:| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
docs\features\content-migration.md:57:| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
docs\features\content-migration.md:58:| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
docs\features\content-migration.md:59:| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
docs\features\content-migration.md:110:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 6종 NotificationEventType (CM6-01) |
docs\features\content-migration.md:111:| REVIEW_WORKFLOW § 10.2.1 | 15종 AuditAction (CM6-01) |
docs\features\content-migration.md:132:  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
docs\features\content-migration.md:133:  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05
docs\features\content-migration.md:148:          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
docs\features\content-migration.md:150:          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
docs\features\content-migration.md:155:          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
docs\features\content-migration.md:177:        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
docs\features\content-migration.md:180:          requiresNoLegalSensitiveEntityChange: true     # CM4-08
docs\features\content-migration.md:181:          requiresNoLegalEntityIdentityChange: true      # CM4-08
docs\features\content-migration.md:193:        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
docs\features\content-migration.md:209:| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |
docs\features\content-migration.md:217:### 3.1 엔트리포인트 + read API + 운영 command (CM3-19 metadata 일관화)
docs\features\content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
docs\features\content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
docs\features\content-migration.md:238:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
docs\features\content-migration.md:258:### 3.2 plan kind 6종 (CM3-16 — 풀 전개)
docs\features\content-migration.md:317:// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
docs\features\content-migration.md:320:  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
docs\features\content-migration.md:342:  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
docs\features\content-migration.md:351:// CM4-05 신규
docs\features\content-migration.md:361:// CM4-05 신규
docs\features\content-migration.md:371:// CM3-04 + CM4-08 — legalEntityChanged 분해
docs\features\content-migration.md:378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
docs\features\content-migration.md:379:  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
docs\features\content-migration.md:380:  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
docs\features\content-migration.md:385:// CM3-11 — Run status decomposition
docs\features\content-migration.md:400:### 3.4 idempotencyKey + requestFingerprint (CM3-19)
docs\features\content-migration.md:405:| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
docs\features\content-migration.md:407:| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
docs\features\content-migration.md:408:| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
docs\features\content-migration.md:409:| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
docs\features\content-migration.md:414:### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)
docs\features\content-migration.md:418:1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
docs\features\content-migration.md:423:1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
docs\features\content-migration.md:426:4. **digestComputationMode별 invalidation precheck** (CM4-02):
docs\features\content-migration.md:433:### 3.6 step type registry 최소 계약 (CM2-17 + CM3-02·CM3-10)
docs\features\content-migration.md:440:  targetEntityTypes: EntityTypeEnum[];                  // CM3-05 — DATA_MODEL entity enum
docs\features\content-migration.md:451:  partialWriteDetector: PartialWriteStrategy;           // CM3-10
docs\features\content-migration.md:457:// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
docs\features\content-migration.md:463:      lowerBound: string;                                // CM4-03 — 시작 watermark
docs\features\content-migration.md:464:      exclusiveUpperBound: string;                       // CM4-03
docs\features\content-migration.md:465:      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
docs\features\content-migration.md:466:      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
docs\features\content-migration.md:467:      expectedInsertedCount: number;                     // CM4-03
docs\features\content-migration.md:468:      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
docs\features\content-migration.md:475:### 3.7 writeSetManifest (CM2-06 + CM3-10)
docs\features\content-migration.md:501:- `append-only-watermark` (CM4-03):
docs\features\content-migration.md:509:### 3.8 read API privacy class (CM3-20 — StepResult schema)
docs\features\content-migration.md:548:   - cooperativeCancellation 미지원 + transactionBoundary != per-chunk → **validate fail (CM3-02 승격)**
docs\features\content-migration.md:560:   - ContentMigrationLegalApproval insert (dryRunReportId·8필드 snapshot·approvedDigestBundleHash — CM3-13)
docs\features\content-migration.md:566:   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
docs\features\content-migration.md:588:### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)
docs\features\content-migration.md:603:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
docs\features\content-migration.md:605:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
docs\features\content-migration.md:607:#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)
docs\features\content-migration.md:624:### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)
docs\features\content-migration.md:634:### 4.5 read-only window writeClass (CM3-03 dispatch 정정)
docs\features\content-migration.md:642:| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
docs\features\content-migration.md:647:`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).
docs\features\content-migration.md:649:### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)
docs\features\content-migration.md:687:status enum: `pending`·`processing`·`sent`·`permanent`. (CM3-14 — `failed` 제거)
docs\features\content-migration.md:689:### 4.7 legalImpactClassifier (CM3-05 — catalog input)
docs\features\content-migration.md:704:step의 self-declared `legalClassHints`만 신뢰하지 않음 — `writeSetProjection`·`mutableFieldAllowlist`를 catalog로 cross-validate (CM3-05).
docs\features\content-migration.md:710:### 4.8 policy-version-reevaluate batch (CM3-04·CM3-15)
docs\features\content-migration.md:719:4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04 + CM4-08·CM5-06):
docs\features\content-migration.md:722:   - riskDelta·priorReviewRequiredChanged·**legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff** 산정 (CM4-08·CM5-06 — legalEntityChanged 단일 boolean 폐기)
docs\features\content-migration.md:723:5. forcedReportingMode 결정 (CM4-08):
docs\features\content-migration.md:731:   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
docs\features\content-migration.md:739:## 5. 알림 (CM3-16 풀 전개)
docs\features\content-migration.md:749:| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
docs\features\content-migration.md:750:| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |
docs\features\content-migration.md:762:| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
docs\features\content-migration.md:763:| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |
docs\features\content-migration.md:787:### 6.2 invariant ↔ § 9 fail/invariant rule 1:1 traceability (CM3-17)
docs\features\content-migration.md:815:| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
docs\features\content-migration.md:816:| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
docs\features\content-migration.md:817:| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
docs\features\content-migration.md:818:| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
docs\features\content-migration.md:819:| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |
docs\features\content-migration.md:821:### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)
docs\features\content-migration.md:849:| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
docs\features\content-migration.md:850:| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
docs\features\content-migration.md:851:| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
docs\features\content-migration.md:852:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
docs\features\content-migration.md:853:| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |
docs\features\content-migration.md:875:- **`featureLegalApproved !== true`** + 승인자/시각 누락 (CM3-08)
docs\features\content-migration.md:878:- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
docs\features\content-migration.md:882:- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
docs\features\content-migration.md:884:- `hashSecrets.*` 4종 누락 (CM3-09 applyPreflightTokenPepperRef 포함)
docs\features\content-migration.md:888:- step registry cancellationSupport.supportsCooperativeCancellation=false + transactionBoundary != "per-chunk" → **validate fail** (CM3-02)
docs\features\content-migration.md:908:- skipStep 대상 stepResult.rollbackClass ≠ "irreversible" → runtime fail (CM6-03 — `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason)
docs\features\content-migration.md:913:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
docs\features\content-migration.md:914:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
docs\features\content-migration.md:915:- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)
docs\features\content-migration.md:930:- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
docs\features\content-migration.md:984:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
docs\features\content-migration.md:985:| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |
docs\features\content-migration.md:987:### 10.3 v0.6 잔여 리스크 (CM5-08)
docs\features\content-migration.md:1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
docs\features\content-migration.md:1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
docs\features\content-migration.md:1007:| 2026-05-15 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 86건 (24+23+21+14+8+3+1) 전건 수용. blocking 0·major 0·minor 1 (CM7-01 anchor residue — 정정 완료). SoT cascade 완료: REVIEW_WORKFLOW (6종 NotificationEventType + 15종 AuditAction), DATA_MODEL v0.22 (contentMigrationConfig·piiFieldCatalogRef·entityFieldProjectionCatalogRef). 의료법·개인정보보호법 운영 가능. **8 Feature 마지막 — 전체 spec 완료** |
docs\features\content-migration.md:1008:| 2026-05-15 | v0.7 | **codex 6차 비평 3 지적 정정**: (1) NotificationEventType **4종→6종**·AuditAction **13종→15종** 상단 SoT 카운트 정정 + NotificationOutbox `eventType` enum 6종 정정 (CM6-01), (2) § 12 heading 번호 총괄 인벤토리와 정합 (12.10 PolicyReevaluateRecord·12.11 NotificationOutbox·12.12 ActiveTargetLock) (CM6-02), (3) § 9.2 skipStep fail rule에서 제거된 `rollbackClass` 입력 참조 삭제 — `skipStep 대상 stepResult.rollbackClass ≠ "irreversible"` 으로 정정 (CM6-03) |
docs\features\content-migration.md:1009:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs\features\content-migration.md:1046:| `digestComputationMode` (CM5-05) | enum (`full`·`snapshot`·`cache`) | ✅ |
docs\features\content-migration.md:1047:| `invalidationInputs` (CM5-05) | JSONB closed (policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) | ✅ |
docs\features\content-migration.md:1048:| `cacheSourceRef` (CM5-05) | string | optional (mode=`cache`/`snapshot` 시 ref) |
docs\features\content-migration.md:1049:| `generatedAt` (CM5-05) | Date | ✅ |
docs\features\content-migration.md:1050:| `writeSetScopeDigest` | char(64) | ✅ — § 12.12 lock 산정에 재사용 (CM5-04) |
docs\features\content-migration.md:1056:### 12.3 `ContentMigrationLegalApproval` (CM3-13)
docs\features\content-migration.md:1075:### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)
docs\features\content-migration.md:1087:| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
docs\features\content-migration.md:1096:- `UNIQUE(planId) WHERE primary_status IN ('pending','running','paused','rolling-back') OR remediation_status != 'none'` (CM3-12)
docs\features\content-migration.md:1099:### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)
docs\features\content-migration.md:1121:**Constraints (CM4-10 SQL canonical 정정)**:
docs\features\content-migration.md:1124:- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
docs\features\content-migration.md:1127:### 12.6 `ContentMigrationStepRetryQueue` (CM3-07 worker SQL)
docs\features\content-migration.md:1145:**worker SoT SQL** (CM3-07 자체 전개):
docs\features\content-migration.md:1230:### 12.10 `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table 승격)
docs\features\content-migration.md:1243:| `legalSensitiveEntityChanged` (CM5-06) | boolean | ✅ |
docs\features\content-migration.md:1244:| `legalEntityIdentityChanged` (CM5-06) | boolean | ✅ |
docs\features\content-migration.md:1245:| `fieldProjectionDiff` (CM5-06) | JSON (string[]) | ✅ |
docs\features\content-migration.md:1252:### 12.11 `ContentMigrationNotificationOutbox` (CM3-14)
docs\features\content-migration.md:1259:| `eventType` | enum (NotificationEventType **6종** — § 5.1 SoT — CM6-01) | ✅ |
docs\features\content-migration.md:1276:### 12.12 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)
docs\features\content-migration.md:1305:`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.
docs\features\content-migration.md:1309:**총 12개 admin DB 테이블** (CM5-01 정정):
docs\features\content-migration.md:1322:| 12.10 | `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table) |
docs\features\crm-sync.md:3:> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
docs\features\crm-sync.md:21:- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x (CS-13). **`providerVersionToken=null` provider build fail (CS4-04)** — record-level dedupe 보장 불가
docs\features\crm-sync.md:24:- **PII 정책**: raw PII 저장 금지. operationalHints는 privacy-sensitive metadata로 분류 (CS4-05). liveRead v1.x (CS-14)
docs\features\crm-sync.md:32:### 1.1 변경 정책 (CS4-13 보강)
docs\features\crm-sync.md:51:| operationalHints column 추가 | MINOR | 별개 | nullable. privacy classification 검토 필수 (CS4-13) |
docs\features\crm-sync.md:57:| **consent withdrawal scope enum 추가·변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 적용 의미 변경은 record-level erasure 영향 |
docs\features\crm-sync.md:58:| **consent withdrawal matching key 알고리즘·hash 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 tombstone 무효화 위험 |
docs\features\crm-sync.md:59:| **ChangeIdentityLedger key 산정 알고리즘 변경** (CS4-13) | **MAJOR** | policyVersion 신규 | 기존 ledger row 무효화 |
docs\features\crm-sync.md:60:| **providerVersionToken requirement 강화** (CS4-13) | **MAJOR** | 별개 | build fail 룰 추가 |
docs\features\crm-sync.md:131:        versionTokenJsonPath: "$.metadata.version"     # CS4-04·CS5-01 — providerVersionToken 추출 path 필수
docs\features\crm-sync.md:132:        versionTokenType: "epoch-ms"                    # CS5-01 — enum: epoch-ms·integer·string
docs\features\crm-sync.md:159:      operationalHintsRetentionDays: 365                # CS4-05 — operationalHints 보존 (privacy-sensitive)
docs\features\crm-sync.md:165:      hashSecrets:                                       # CS4-01·CS5-02 — canonical hash 알고리즘
docs\features\crm-sync.md:170:        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
docs\features\crm-sync.md:174:#### 2.3.1 hash algorithm SoT (CS4-01)
docs\features\crm-sync.md:183:| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |
docs\features\crm-sync.md:205:| 실행 | `resetCredentialRotation(input: ResetCredentialRotationInput): ResetCredentialRotationResult` (CS4-07) | reverted → stable 명시적 reset | super-admin | 허용 | 허용 |
docs\features\crm-sync.md:285:#### 3.2.2 operationalHints — privacy-sensitive metadata (CS4-05)
docs\features\crm-sync.md:301:**small-cell suppression** (CS4-05·CS5-05):
docs\features\crm-sync.md:312:| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |
docs\features\crm-sync.md:319:**nulling 정책** (CS4-06 precedence: legalHold > unregister > expiry > consent withdrawal):
docs\features\crm-sync.md:326:**CRM 콘솔 raw 접근 (CS5-04 풀 전개)**:
docs\features\crm-sync.md:332:### 3.3 Command DTO (CS4-10)
docs\features\crm-sync.md:407:#### 3.3.5 `ApplyConsentWithdrawalInput`·Result (CS4-01·10 — discriminated)
docs\features\crm-sync.md:443:**경로별 매칭 키 (CS4-01)**:
docs\features\crm-sync.md:452:#### 3.3.6 `ResetCredentialRotationInput`·Result (CS4-07)
docs\features\crm-sync.md:492:#### 3.4.1 ProviderWebhookVerifier (CS5-04 풀 전개 + providerVersionToken required — CS4-04)
docs\features\crm-sync.md:506:  providerVersionToken: string;                 // CS4-04 — v1.0 required. null이면 build fail
docs\features\crm-sync.md:520:#### 3.4.3 InboundProcessingContext — **discriminated union** (CS4-03)
docs\features\crm-sync.md:564:### 3.4.4 ChangeIdentityKey (CS4-04 책임 분리)
docs\features\crm-sync.md:573:providerVersionToken=null인 provider는 **v1.0 build fail** (CS4-04) — record-level dedupe 보장 불가능하므로 v1.0 운영 불가.
docs\features\crm-sync.md:623:#### 4.2.1 RRN false positive 복구 (CS5-04 풀 전개)
docs\features\crm-sync.md:714:### 4.5 credential rotation (CS4-02·07)
docs\features\crm-sync.md:740:#### 4.5.4 rotateCredential — DB-level concurrency 강제 (CS4-02)
docs\features\crm-sync.md:766:#### 4.5.5 resetCredentialRotation (CS4-07)
docs\features\crm-sync.md:773:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
docs\features\crm-sync.md:807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
docs\features\crm-sync.md:832:### 4.7 unregister 정책 표 (CS4-06 precedence 추가)
docs\features\crm-sync.md:836:**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.
docs\features\crm-sync.md:850:| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
docs\features\crm-sync.md:856:`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).
docs\features\crm-sync.md:858:### 4.8 consent withdrawal (CS4-01 강화)
docs\features\crm-sync.md:864:2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
docs\features\crm-sync.md:867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
docs\features\crm-sync.md:919:## 7. PII 처리 (CS4-05 강화)
docs\features\crm-sync.md:928:### 7.2 RRN deny (CS5-04 풀 전개)
docs\features\crm-sync.md:952:### 7.5 displayHints expiry + operationalHints expiry (CS4-05)
docs\features\crm-sync.md:962:## 8. 운영 지표 + acceptance test (CS4-09 — invariant 별 fixture 재편)
docs\features\crm-sync.md:983:### 8.2 acceptance test (CS4-09 — invariant 별 fixture)
docs\features\crm-sync.md:988:- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)
docs\features\crm-sync.md:1021:#### INV-CREDENTIAL-ROTATION (CS4-02 동시성)
docs\features\crm-sync.md:1027:- reverted + resetCredentialRotation → stable (CS4-07)
docs\features\crm-sync.md:1042:#### INV-OPERATIONAL-HINTS (CS4-05)
docs\features\crm-sync.md:1047:#### INV-CONSENT-WITHDRAWAL (CS4-01)
docs\features\crm-sync.md:1058:#### INV-UNREGISTER (CS4-06 precedence)
docs\features\crm-sync.md:1075:#### INV-MIGRATION (CS4-09)
docs\features\crm-sync.md:1083:- DATA_MODEL C-08 v0.20 `versionTokenJsonPath` 누락 → build fail (CS5-01)
docs\features\crm-sync.md:1085:### 8.3 § 10 rule → § 8.2 fixture traceability 표 (CS5-06)
docs\features\crm-sync.md:1098:| § 10.1 generic-rest-api 5필드 누락 (CS5-01) | INV-MANIFEST |
docs\features\crm-sync.md:1099:| § 10.1 versionTokenType ∉ enum (CS5-01) | INV-MANIFEST |
docs\features\crm-sync.md:1113:| § 10.2 applyConsentWithdrawal same-request replay (CS5-02) | INV-CONSENT-WITHDRAWAL |
docs\features\crm-sync.md:1114:| § 10.2 applyConsentWithdrawal mismatched collision 409 (CS5-02) | INV-CONSENT-WITHDRAWAL |
docs\features\crm-sync.md:1123:| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
docs\features\crm-sync.md:1127:| § 10.4 small-cell suppression 적용 (CS5-05) | INV-OPERATIONAL-HINTS |
docs\features\crm-sync.md:1149:- `provider="generic-rest-api"` + `versionTokenType` ∉ {`epoch-ms`, `integer`, `string`} (CS5-01)
docs\features\crm-sync.md:1161:- **provider VerifierResult `providerVersionToken=null` 정의** (v1.0 build validator가 adapter 등록 시점에 검사 — CS4-04)
docs\features\crm-sync.md:1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
docs\features\crm-sync.md:1181:- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)
docs\features\crm-sync.md:1188:  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
docs\features\crm-sync.md:1189:  - CrmChangeIdentityLedger UNIQUE + FK + ON DELETE 정책 (CS4-08)
docs\features\crm-sync.md:1200:- **CrmCredentialVersion graceExpiry worker** (§ 4.5.6 SoT — CS5-03·CS6-01): cadence 10분. graceUntil 도래 → committed CredentialVersion row state='grace-expired' + Integration.credentialState='grace-expired' (단일 transaction). 실패 3회 → super-admin alert. **`revoked` 자동 정리는 v1.0 미수행 — CS-22 deferred**
docs\features\crm-sync.md:1203:- **purge worker (CS4-06 precedence)**:
docs\features\crm-sync.md:1218:    | CrmConsentWithdrawalLedger | legalHold=false 시 delete | **true** (CS4-06) |
docs\features\crm-sync.md:1253:| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
docs\features\crm-sync.md:1254:| CS-22 | grace-expired → revoked 자동 정리 정책 (CS5-03) — v1.0은 grace-expired row 보존 |
docs\features\crm-sync.md:1255:| CS-23 | `docs/compliance/PRIVACY_COMMON.md` SoT 신설 (CS5-05) — 의료광고 외 일반 privacy 가이드 |
docs\features\crm-sync.md:1274:### 11.4 known limitations (CS4-09)
docs\features\crm-sync.md:1276:- providerVersionToken=null provider는 v1.0 build fail (CS4-04) — record-level dedupe 보장 불가능
docs\features\crm-sync.md:1291:| 2026-05-14 | v0.7 | codex 6차 비평 1 지적 정정 (CS6-01) |
docs\features\crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
docs\features\crm-sync.md:1555:### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)
docs\features\crm-sync.md:1572:**Constraints (CS4-02 강제)**:
docs\features\crm-sync.md:1582:### 13.12 `CrmWebhookNonceLedger` — **transport-level dedupe (CS4-04)**
docs\features\crm-sync.md:1605:### 13.13 `CrmChangeIdentityLedger` — **record-level dedupe (CS4-04·08)**
docs\features\crm-sync.md:1613:| `providerVersionToken` | string | ✅ — v1.0 required (CS4-04) |
docs\features\crm-sync.md:1617:| `processedSyncLogId` | UUID | optional — FK § 13.2 ON DELETE SET NULL (CS4-08) |
docs\features\crm-sync.md:1623:### 13.14 `CrmConsentWithdrawalLedger` (CS4-01·08)
docs\features\crm-sync.md:1634:| `requestFingerprint` | char(64) | ✅ — § 2.3.1 (CS5-02) |
docs\features\crm-sync.md:1643:| `legalHold` | boolean | ✅ default true (CS4-06) |
docs\features\crm-sync.md:1646:**Constraints (CS4-08)**:
docs\features\keyword-monitoring.md:37:  - **매칭 키**: (instanceId, query 또는 page, date, severity 기준) — search-visibility AnomalyRecord 검색
docs\features\keyword-monitoring.md:38:  - **다건 매칭 시**: 최신 detectedAt + 가장 높은 severity 우선 (critical > warning > info)
docs\features\keyword-monitoring.md:200:| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` | retroactive enqueue. **권한: super-admin 전용**. audit `keyword-monitoring-retroactive-enqueue-requested` (§ 3.1.1) |
docs\features\keyword-monitoring.md:209:| `keyword-monitoring-retroactive-enqueue-requested` | `"instance:" + instanceId` (synthetic — search-visibility § 7.5 패턴 동일) | windowStart·windowEnd·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId·actorRole="super-admin" |
docs\features\keyword-monitoring.md:264:    severity: "info" | "warning" | "critical";
docs\features\keyword-monitoring.md:298:  - `"first-observed"` (기본): baseline=0 + observed ≥ `firstObservedSpikeThresholdImpressions`(기본 100) → `direction="first-observed-spike"` (severity=info). deltaPercentage=null
docs\features\keyword-monitoring.md:308:  - observedCtr > baselineCtr + threshold → `ctr-up` (severity=info)
docs\features\keyword-monitoring.md:309:  - observedCtr < baselineCtr - threshold → `ctr-down` (severity=warning)
docs\features\keyword-monitoring.md:313:- `queryKeywordSignals` 응답의 `anomaliesInWindow[]`에 `direction="ctr-up"` anomaly도 포함 (severity=info)
docs\features\keyword-monitoring.md:315:- 운영자 filter: `severity=info AND signal=keywordCTR AND direction=ctr-up` 별도 필터 권장
docs\features\keyword-monitoring.md:390:> **anomalySeverity vs notificationCriticality 분리** (F-8): anomalySeverity는 AnomalyRecord 내부 severity (info·warning·critical). notificationCriticality는 NotificationEvent.criticality (normal·high·critical — notifications.md SoT). monitoring-failed는 anomaly 없음 — operationalSeverity로 분류
docs\features\keyword-monitoring.md:408:1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
docs\features\keyword-monitoring.md:451:| keywordRank | **anomaly suppression ledger** | key=hash(instanceId+signal+keywordTargetId+severity+keywordMonitoringPolicyVersion) |
docs\features\keyword-monitoring.md:458:- severity escalation (warning → critical)은 별도 anomaly로 처리 (key에 severity 포함)
docs\features\search-visibility.md:228:| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity)` | SV2-14 — mode 변경 후 retroactive enqueue (운영자 명시) |
docs\features\search-visibility.md:313:severity:
docs\features\search-visibility.md:345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
docs\features\search-visibility.md:346:| `bucket:a` → `bucket:b` (개선·악화) | ✅ severity=warning (b가 a보다 worse) / info (better) | `search-visibility-anomaly-warning` (worse일 때만) | ✅ (worse일 때) |
docs\features\search-visibility.md:347:| `bucket:*` → `absent` (SERP 결과에서 제거) | ✅ severity=critical | `search-visibility-anomaly-critical` | ✅ |
docs\features\search-visibility.md:348:| `absent` → `bucket:*` (복귀) | ✅ severity=info, direction="restored" | (없음) | ❌ |
docs\features\search-visibility.md:409:- **suppression key**: `hash(instanceId + signal + targetKind + targetId + severity + searchVisibilityPolicyVersion)`
docs\features\search-visibility.md:411:- **severity escalation 의도** (SV4-06): suppression key에 `severity`가 포함되어 동일 target의 warning → critical 상승 시 별도 anomaly 생성. critical 알림이 warning suppression에 막히지 않도록 한 의도된 동작. false-positive resolve(`resolutionStatus="false-positive"`) 후 재발생도 새 anomaly로 생성됨 (open 조건 미충족)
docs\features\search-visibility.md:436:| eventType | severity 매핑 | mode="alerting" | mode="monitor-only" |
docs\features\search-visibility.md:438:| `search-visibility-anomaly-critical` | severity="critical" anomaly | ✅ enqueue | ❌ |
docs\features\search-visibility.md:439:| `search-visibility-anomaly-warning` | severity="warning" anomaly | ✅ enqueue | ❌ |
docs\features\search-visibility.md:441:| `ai-briefing-citation-first-detected` | first-detected state transition | ✅ enqueue (severity=info여도) | ❌ |
docs\features\search-visibility.md:452:| `search-visibility-anomaly-critical`·`-warning` | `anomalyRecordId` | `"${signal} ${severity} — ${targetKind}/${targetDisplay}"` | signal·targetKind·targetId·detectedAt·detectorOutput·streakDays·qualityTier |
docs\features\search-visibility.md:468:- 운영자 명시 액션 `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` (§ 3.1):
docs\features\search-visibility.md:472:- **입력**: `window: {start, end}`·`severity: ("warning"|"critical")[]`·`dryRun: boolean (default true)`
docs\features\search-visibility.md:474:- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
docs\features\search-visibility.md:482:  - `metadata = { windowStart, windowEnd, severity: ("warning"|"critical")[], dryRun, matchedCount, enqueuedCount, retroactiveBatchId }`
docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |

 succeeded in 576ms:
docs/features/content-migration.md:791:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
docs/features/content-migration.md:792:| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
docs/features/content-migration.md:793:| INV-LEGAL-UNKNOWN-CLASS | § 9.2 unknownClassesEncountered | legal-classifier |
docs/features/content-migration.md:794:| INV-LEGAL-OVERRIDE | § 9.2 forceProceedDespiteWarnings legal/critical 시도 | legal override |
docs/features/content-migration.md:795:| INV-LEGAL-APPROVAL-LINK | § 9.2 expectedLegalApprovalId 누락 (legalGateRequired) | legal-approval |
docs/features/content-migration.md:796:| INV-ROLLBACK-IRREVERSIBLE | § 9.2 irreversible encountered | rollback |
docs/features/content-migration.md:797:| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
docs/features/content-migration.md:798:| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
docs/features/content-migration.md:799:| INV-READONLY-CONTENT | § 9.2 content-mutating 차단 | read-only-window |
docs/features/content-migration.md:800:| INV-READONLY-DISPATCH | § 9.2 dispatchAllowlist 외 즉시 dispatch 차단 | read-only-window |
docs/features/content-migration.md:801:| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
docs/features/content-migration.md:802:| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
docs/features/content-migration.md:803:| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
docs/features/content-migration.md:804:| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
docs/features/content-migration.md:805:| INV-POLICY-REEVAL-RISK | § 9.2 priorReview·legalEntity·Critical → new-record-version 강제 | policy |
docs/features/content-migration.md:806:| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
docs/features/content-migration.md:807:| INV-COOP-CANCEL-FAIL | § 9.3 cooperativeCancellation 미지원 + non-per-chunk → validate fail | step-registry |
docs/features/content-migration.md:808:| INV-CANCEL-TIMEOUT | § 9.2 cancellation-timeout-manual-review 진입 | state-machine |
docs/features/content-migration.md:809:| INV-STEP-REGISTRY | § 9.3 inputSchema strict | step-registry |
docs/features/content-migration.md:810:| INV-PRIVACY-EXPORT | § 9.2 PII step exportAllowed=false | privacy |
docs/features/content-migration.md:811:| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
docs/features/content-migration.md:812:| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
docs/features/content-migration.md:813:| INV-RUN-ACTIVE-UNIQUE | § 9.2 partial unique (planId WHERE active) | concurrency |
docs/features/content-migration.md:814:| INV-CATALOG-VALIDATION | § 9.3 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate | classifier |
docs/features/content-migration.md:815:| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
docs/features/content-migration.md:816:| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
docs/features/content-migration.md:817:| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
docs/features/content-migration.md:818:| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
docs/features/content-migration.md:819:| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |
docs/features/content-migration.md:825:| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
docs/features/content-migration.md:826:| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
docs/features/content-migration.md:827:| INV-LEGAL-UNKNOWN-CLASS | 등록 step + catalog 매칭 → classification 완료 | unknown step type → fail-closed (legalGateRequired=true) |
docs/features/content-migration.md:828:| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings + low risk warning → 진행 | forceProceedDespiteWarnings + legal-required warning → 거부 |
docs/features/content-migration.md:829:| INV-LEGAL-APPROVAL-LINK | legalGateRequired=true + 일치 LegalApproval → 200 | 일치 LegalApproval 없음 → fail |
docs/features/content-migration.md:830:| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
docs/features/content-migration.md:831:| INV-ROLLBACK-SKIP | super-admin + remediationTicketRef 제공 → skipped | remediationTicketRef 누락 → runtime fail |
docs/features/content-migration.md:832:| INV-PARTIAL-WRITE | actualAffectedRows = expected → 정상 | invariantQueryResults에 fail → rollback 우선 |
docs/features/content-migration.md:833:| INV-READONLY-CONTENT | window 종료 후 write → 정상 | window 중 content-mutating write → rejected |
docs/features/content-migration.md:834:| INV-READONLY-DISPATCH | allowlist 이벤트 즉시 dispatch → 정상 | 외 이벤트 즉시 dispatch → queued |
docs/features/content-migration.md:835:| INV-IDEMPOTENCY-REPLAY | 동일 fingerprint 재요청 → 기존 결과 (no-op) | mismatched fingerprint → 409 |
docs/features/content-migration.md:836:| INV-IDEMPOTENCY-COLLISION | 동일 → ok | 다른 input → 409 |
docs/features/content-migration.md:837:| INV-OUTBOX-SOURCE-EVENT | 신규 sourceEventId → row insert | 동일 sourceEventId → unique violation |
docs/features/content-migration.md:838:| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
docs/features/content-migration.md:839:| INV-POLICY-REEVAL-RISK | low + no legal/priorReview → stale-flags-only | priorReview true → new-record-version 강제 |
docs/features/content-migration.md:840:| INV-POLICY-REEVAL-OVERRIDE | low + no legal·priorReview 변화 + stale-flags-only override → 허용 | high risk + stale-flags-only override 시도 → 거부 |
docs/features/content-migration.md:841:| INV-COOP-CANCEL-FAIL | supportsCooperativeCancellation=true 또는 transactionBoundary=per-chunk → validate ok | supportsCooperativeCancellation=false + non-per-chunk → validate fail |
docs/features/content-migration.md:842:| INV-CANCEL-TIMEOUT | timeout 이전 cancel → cancelled | timeout 도달 → cancellation-timeout-manual-review |
docs/features/content-migration.md:843:| INV-STEP-REGISTRY | inputSchema strict 통과 → validate ok | additionalProperties=true → validate fail |
docs/features/content-migration.md:844:| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
docs/features/content-migration.md:845:| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
docs/features/content-migration.md:846:| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
docs/features/content-migration.md:847:| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
docs/features/content-migration.md:848:| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
docs/features/content-migration.md:849:| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
docs/features/content-migration.md:850:| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
docs/features/content-migration.md:851:| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
docs/features/content-migration.md:852:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
docs/features/content-migration.md:853:| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |
docs/features/content-migration.md:892:- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
docs/features/content-migration.md:893:- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
docs/features/content-migration.md:894:- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
docs/features/content-migration.md:895:- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
docs/features/content-migration.md:896:- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
docs/features/content-migration.md:898:- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
docs/features/content-migration.md:901:- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
docs/features/content-migration.md:903:- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
docs/features/content-migration.md:904:- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
docs/features/content-migration.md:906:- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
docs/features/content-migration.md:907:- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
docs/features/content-migration.md:909:- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
docs/features/content-migration.md:910:- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
docs/features/content-migration.md:911:- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
docs/features/content-migration.md:912:- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
docs/features/content-migration.md:913:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
docs/features/content-migration.md:914:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
docs/features/content-migration.md:928:- step type registry 미등록 stepType → validate fail [INV-STEP-REGISTRY]
docs/features/content-migration.md:929:- step writeSetProjection·mutableFieldAllowlist가 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate 실패 → validate fail [INV-CATALOG-VALIDATION]
docs/features/content-migration.md:930:- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
docs/features/content-migration.md:932:- DDL precondition 검증 외 DDL 실행 시도 → validate fail [INV-DDL-BOUNDARY]
docs/features/content-migration.md:933:- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]
docs/features/content-migration.md:942:- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
docs/features/crm-sync.md:987:#### INV-MANIFEST (build-time)
docs/features/crm-sync.md:990:#### INV-WEBHOOK-DEDUPE (transport-level)
docs/features/crm-sync.md:999:#### INV-CHANGE-IDENTITY (record-level)
docs/features/crm-sync.md:1003:#### INV-RRN
docs/features/crm-sync.md:1010:#### INV-OUTBOUND-ONLY
docs/features/crm-sync.md:1016:#### INV-RETRY
docs/features/crm-sync.md:1021:#### INV-CREDENTIAL-ROTATION (CS4-02 동시성)
docs/features/crm-sync.md:1031:#### INV-CAS
docs/features/crm-sync.md:1036:#### INV-PII (closed schema)
docs/features/crm-sync.md:1042:#### INV-OPERATIONAL-HINTS (CS4-05)
docs/features/crm-sync.md:1047:#### INV-CONSENT-WITHDRAWAL (CS4-01)
docs/features/crm-sync.md:1058:#### INV-UNREGISTER (CS4-06 precedence)
docs/features/crm-sync.md:1063:#### INV-PURGE
docs/features/crm-sync.md:1075:#### INV-MIGRATION (CS4-09)
docs/features/crm-sync.md:1079:#### INV-CASCADE
docs/features/crm-sync.md:1091:| § 10.1 legalApproved=false | INV-MANIFEST |
docs/features/crm-sync.md:1092:| § 10.1 korean-emr provider | INV-MANIFEST |
docs/features/crm-sync.md:1093:| § 10.1 appointment enabled | INV-MANIFEST |
docs/features/crm-sync.md:1094:| § 10.1 rawPiiStorageAllowed=true | INV-MANIFEST |
docs/features/crm-sync.md:1095:| § 10.1 ssnRrnHandling≠deny | INV-MANIFEST |
docs/features/crm-sync.md:1096:| § 10.1 dpaEvidenceRef 누락 | INV-MANIFEST |
docs/features/crm-sync.md:1097:| § 10.1 outbound-only + 부정합 conflictResolution | INV-MANIFEST + INV-OUTBOUND-ONLY |
docs/features/crm-sync.md:1098:| § 10.1 generic-rest-api 5필드 누락 (CS5-01) | INV-MANIFEST |
docs/features/crm-sync.md:1099:| § 10.1 versionTokenType ∉ enum (CS5-01) | INV-MANIFEST |
docs/features/crm-sync.md:1100:| § 10.1 providerVersionToken=null provider | INV-MANIFEST + INV-CHANGE-IDENTITY |
docs/features/crm-sync.md:1101:| § 10.1 liveReadEnabled=true | INV-MANIFEST |
docs/features/crm-sync.md:1102:| § 10.1 fieldMappingPolicyVersion 누락 | INV-MANIFEST |
docs/features/crm-sync.md:1103:| § 10.1 hashSecrets.* 5종 누락 | INV-MANIFEST |
docs/features/crm-sync.md:1104:| § 10.2 webhook signature 실패 | INV-WEBHOOK-DEDUPE |
docs/features/crm-sync.md:1105:| § 10.2 replay window 초과 | INV-WEBHOOK-DEDUPE |
docs/features/crm-sync.md:1106:| § 10.2 inbound RRN 검출 | INV-RRN |
docs/features/crm-sync.md:1107:| § 10.2 outbound RRN 검출 | INV-RRN |
docs/features/crm-sync.md:1108:| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
docs/features/crm-sync.md:1109:| § 10.2 outbound-only direct invocation | INV-OUTBOUND-ONLY |
docs/features/crm-sync.md:1110:| § 10.2 CAS WHERE 0 rows | INV-CAS |
docs/features/crm-sync.md:1111:| § 10.2 displayHints closed schema 위반 | INV-PII |
docs/features/crm-sync.md:1112:| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
docs/features/crm-sync.md:1113:| § 10.2 applyConsentWithdrawal same-request replay (CS5-02) | INV-CONSENT-WITHDRAWAL |
docs/features/crm-sync.md:1114:| § 10.2 applyConsentWithdrawal mismatched collision 409 (CS5-02) | INV-CONSENT-WITHDRAWAL |
docs/features/crm-sync.md:1115:| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1116:| § 10.2 rotateCredential row LOCK state≠stable | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1117:| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1118:| § 10.3 v0.6 migration | INV-MIGRATION |
docs/features/crm-sync.md:1119:| § 10.4 RetryQueue stale reclaim | INV-RETRY |
docs/features/crm-sync.md:1120:| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
docs/features/crm-sync.md:1121:| § 10.4 credential expiry 임박/만료 | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1122:| § 10.4 PII drift 감지 | INV-PII |
docs/features/crm-sync.md:1123:| § 10.4 graceExpiry worker transaction (CS5-03) | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1124:| § 10.4 graceExpiry worker 3회 실패 | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1125:| § 10.4 NonceLedger RRN recoverable 24h 무처리 | INV-RRN |
docs/features/crm-sync.md:1126:| § 10.4 purge worker — 모든 retention 대상 | INV-PURGE |
docs/features/crm-sync.md:1127:| § 10.4 small-cell suppression 적용 (CS5-05) | INV-OPERATIONAL-HINTS |

 succeeded in 578ms:
docs/core/DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
docs/core/DATA_MODEL.md:33:| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
docs/core/DATA_MODEL.md:50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
docs/core/DATA_MODEL.md:100:- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.
docs/core/DATA_MODEL.md:169:| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
docs/core/DATA_MODEL.md:178:| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
docs/core/DATA_MODEL.md:211:## 4. 데이터 계약 풀명세 (M0 핵심)
docs/core/DATA_MODEL.md:253:| `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |
docs/core/DATA_MODEL.md:354:| `period` | `string` | optional | 예: `"2010-2016"` |
docs/core/DATA_MODEL.md:378:| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
docs/core/DATA_MODEL.md:539:| `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
docs/core/DATA_MODEL.md:587:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
docs/core/DATA_MODEL.md:590:| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
docs/core/DATA_MODEL.md:591:| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:596:| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
docs/core/DATA_MODEL.md:654:#### `SearchVisibilityConfig` (v0.16 신규)
docs/core/DATA_MODEL.md:658:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
docs/core/DATA_MODEL.md:667:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core/DATA_MODEL.md:675:| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
docs/core/DATA_MODEL.md:676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
docs/core/DATA_MODEL.md:712:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
docs/core/DATA_MODEL.md:713:| `legalApprovedBy` | string | ✅ | |
docs/core/DATA_MODEL.md:714:| `legalApprovedAt` | Date | ✅ | |
docs/core/DATA_MODEL.md:715:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs/core/DATA_MODEL.md:726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
docs/core/DATA_MODEL.md:729:| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
docs/core/DATA_MODEL.md:736:#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
docs/core/DATA_MODEL.md:745:| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
docs/core/DATA_MODEL.md:844:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
docs/core/DATA_MODEL.md:846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:911:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md:930:## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
docs/core/DATA_MODEL.md:968:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
docs/core/DATA_MODEL.md:1074:| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1091:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
docs/core/DATA_MODEL.md:1092:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
docs/core/DATA_MODEL.md:1093:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
docs/core/DATA_MODEL.md:1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
docs/core/DATA_MODEL.md:1103:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:5:> **상위 결정**: 8 Feature spec v1.0 완료·솔로 1명 + AI 보조·9~12개월·Phase 0~4 단계·Vercel+Supabase+Railway 스택·Supabase Storage·next-auth
docs/decisions/INFRA_DECISIONS_DRAFT.md:33:3. Phase 0~M2 (수십 instance) 충분
docs/decisions/INFRA_DECISIONS_DRAFT.md:76:- Phase 1+ 대량 발송 시 비용 검토 (분원·digest 발송 누적)
docs/decisions/INFRA_DECISIONS_DRAFT.md:90:- Phase 1+ 추가로 log 통합 필요 시 BetterStack 또는 Axiom 결합 검토
docs/decisions/INFRA_DECISIONS_DRAFT.md:113:## 영역 3: Phase 0 첫 1~2주 구체 작업 목록
docs/decisions/INFRA_DECISIONS_DRAFT.md:115:### Week 1 — repo·DB·Vercel·CI 기본
docs/decisions/INFRA_DECISIONS_DRAFT.md:127:### Week 2 — worker·webhook·auth·monitoring
docs/decisions/INFRA_DECISIONS_DRAFT.md:139:### Week 3-6 (이후 — Phase 0 나머지)
docs/decisions/INFRA_DECISIONS_DRAFT.md:143:| Week 3 | DATA_MODEL Core schema (페이지·콘텐츠·ComplianceRecord 등) Drizzle 정의·migration | DB schema 30+ tables (Core) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:144:| Week 4 | 공통 패턴 라이브러리: outbox·retry queue·CAS·closed schema validator·hash utils (HMAC·secretRef 추상화) | `packages/core-data-model` + `packages/db` 확장 |
docs/decisions/INFRA_DECISIONS_DRAFT.md:145:| Week 4 | DESIGN_TOKENS Style Dictionary build·ui-tokens 패키지·디자인 system 기본 컴포넌트 (Button·Input·Card 등 10개) | `packages/ui-tokens` + Storybook (선택) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:146:| Week 5 | REVIEW_WORKFLOW 상태 머신 구현 (compliance lifecycle·multi-role gate) | `packages/features/_review-workflow` |
docs/decisions/INFRA_DECISIONS_DRAFT.md:147:| Week 5 | 운영자 UI 골격: navigation·layout·role guard·instance switcher·audit log viewer | Admin shell |
docs/decisions/INFRA_DECISIONS_DRAFT.md:148:| Week 6 | Phase 1 시작 전 Phase 0 검증: 첫 e2e (login → 콘텐츠 작성 dummy → audit log row 확인) | Phase 0 sign-off |
docs/decisions/INFRA_DECISIONS_DRAFT.md:150:### Phase 0 완료 조건
docs/decisions/INFRA_DECISIONS_DRAFT.md:166:- spec의 legalApproved·DPA·legal-reviewer 운영자는 외부 의존
docs/decisions/INFRA_DECISIONS_DRAFT.md:167:- Phase 1 끝(약 Week 14~18) M0 베타 가능 시점
docs/decisions/INFRA_DECISIONS_DRAFT.md:173:| Week 1~6 (Phase 0) | 타겟 의료기관 1~3곳 영업·MVP 가치 제안 정리·NDA·1차 미팅 | Phase 0 구축 |
docs/decisions/INFRA_DECISIONS_DRAFT.md:174:| Week 7~16 (Phase 1) | 베타 1곳 정식 선정·DPA 템플릿 작성·legal-reviewer 후보 결정 (Glitzy 내부 또는 외부 법무 자문) | M0 (notifications + compliance-assistant + 콘텐츠 발행) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:175:| Week 16~18 | 베타 계약 체결·legalApproved=true·DPA 증빙 secretRef 셋업 | M0 deploy + 베타 1곳 운영 시작 |
docs/decisions/INFRA_DECISIONS_DRAFT.md:176:| Week 17~24 (Phase 2) | 베타 피드백·KPI 측정·2번째 베타 의료기관 영업 | M1 (search-visibility + keyword-monitoring) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:177:| Week 25~32 (Phase 3) | 베타 2곳 확장·legal-reviewer 운영 안정화 | M2 (asset-ingestion + analytics-reporting) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:178:| Week 33~48 (Phase 4) | crm-sync 위한 CRM provider 계약 (Salesforce·HubSpot)·DPA 강화·정식 출시 준비 | M3 (crm-sync + content-migration) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:185:| 의료광고법 준수 의지가 명확한 곳 (legal-reviewer 협조 가능) | 높음 |
docs/decisions/INFRA_DECISIONS_DRAFT.md:193:- legal-reviewer 운영자: Glitzy 내부 인력 vs 외부 법무 자문 (의료광고법 전문 변호사) — 비용·전문성 trade-off
docs/decisions/INFRA_DECISIONS_DRAFT.md:194:- DPA 템플릿: Glitzy 자체 작성 vs 외부 법무 자문 작성 — 외부 자문 권장 (개인정보보호법 + 의료법 + 위탁 계약 복합)
docs/decisions/INFRA_DECISIONS_DRAFT.md:206:| 3. Phase 0 작업 | Week 1-2 (repo·DB·worker·webhook·auth·monitoring) + Week 3-6 (Core schema·공통 패턴·UI 골격) |
docs/decisions/INFRA_DECISIONS_DRAFT.md:207:| 4. 베타 일정 | Phase 1 끝 (Week 16~18) 1곳·Phase 2 끝 2곳·Phase 4 정식 출시 |
docs/decisions/INFRA_DECISIONS_DRAFT.md:217:3. **Phase 0 작업 목록**: 누락된 항목·Week 1-2 일정 현실성·솔로 + AI 보조 가정에서 도전적인가?
docs/decisions/INFRA_DECISIONS_DRAFT.md:218:4. **베타 일정**: 외부 의존(DPA·legal-reviewer·의료기관 영업) 일정 buffer 충분한가? legal-reviewer 운영 시작 시점이 M0 deploy 전에 와야 하는가?
docs/decisions/INFRA_DECISIONS_DRAFT.md:219:5. **공통 패턴 라이브러리 (Week 4)**: spec의 closed schema·hash secrets·CAS·outbox·retry·grace expiry·legalImpactClassifier·writeSetManifest 등 cross-cutting 패턴 모두 포괄 가능한가? Week 4 1주 안에 가능한가?
docs/admin\REVIEW_WORKFLOW.md:13:> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
docs/admin\REVIEW_WORKFLOW.md:26:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
docs/admin\REVIEW_WORKFLOW.md:363:           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
docs/admin\REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs/admin\REVIEW_WORKFLOW.md:682:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
docs/admin\REVIEW_WORKFLOW.md:694:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
docs/admin\REVIEW_WORKFLOW.md:728:  | "legal-reviewer"      // legal 역할 검수만
docs/admin\ARCHITECTURE.md:19:- 구축은 **Vertical Slice (M0) → Phase Alpha (M1) → Beta (M2) → GA (M3)** 순으로 점진. Slice가 처음부터 끝까지 동작하면 1호 클라이언트 출시 가능.
docs/admin\ARCHITECTURE.md:86:## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄
docs/admin\ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin\ARCHITECTURE.md:141:| `TreatmentPage` (C-03) | 제목·개요·원리·대상·과정·주의사항 (M0 추가 필드 — `recommendedFor`·`treatmentComponents`·`visitFlow` 등은 선택) | | TreatmentPage 화면 |
docs/admin\ARCHITECTURE.md:215:**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
docs/admin\ARCHITECTURE.md:266:## 4. Phase 로드맵 — M0 → M1 → M2 → M3
docs/admin\ARCHITECTURE.md:268:### 4.1 M0 — Vertical Slice (§ 3 참조)
docs/admin\ARCHITECTURE.md:328:**M0 어드민 화면별 입력·출력 매핑**:
docs/admin\ARCHITECTURE.md:339:**M0 이후 추가 계약**:
docs/admin\ARCHITECTURE.md:341:- `BrandTokens` 입력 (M0 form, M3 비주얼 에디터)
docs/admin\ARCHITECTURE.md:345:- 위험도 분류 (M0 수동, M2 자동 보조)
docs/admin\ARCHITECTURE.md:416:| M0 (Slice) | 단일 운영자 계정. 단순 인증 |
docs/admin\ARCHITECTURE.md:439:| Git 호스팅 (GitHub/GitLab) | 빌드 트리거·커밋·PR API | M0 |
docs/admin\ARCHITECTURE.md:440:| CI/CD | 웹훅·상태 표시 | M0 |
docs/admin\ARCHITECTURE.md:441:| 정적 호스팅 (Vercel·Cloudflare) | Preview URL·배포 상태 | M0 |
docs/admin\ARCHITECTURE.md:473:| A-05 | Git 워크플로우 | M0 Direct push, M2+ PR 옵션 |
docs/admin\ARCHITECTURE.md:485:| 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
docs/features\compliance-assistant.md:260:1. operands[] 각각의 매칭 위치 (start, end) 산출 — character offset 기준 (UTF-16 code unit)
docs/features\compliance-assistant.md:272:- offset 기준 — 원본 본문의 UTF-16 code unit position
docs/features\compliance-assistant.md:556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
docs/features\compliance-assistant.md:577:> **룰 카탈로그 부재 fail 분기**: 본 Feature `enabled=false` (예외 승인 인스턴스, § 10.3) 시 룰 카탈로그 부재는 fail 아님. M0/M1 초기 구현 단계에서는 본 Feature 활성화 + 룰 카탈로그 작성 동시 진행이 표준. MEDICAL_AD_COMPLIANCE_COMMON § 0 "checker 활성화 이후 fail" 조건과 정합.
docs/features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs/features\analytics-reporting.md:166:            dayOfWeek: "MON"                           # weekly 시 (MON|TUE|...|SUN)
docs/features\analytics-reporting.md:361:  filters?: QueryFilter[];               // 명시 AST (AR2-16)
docs/features\analytics-reporting.md:530:- `type: "weekly"` — `dayOfWeek` (`MON`|`TUE`|`WED`|`THU`|`FRI`|`SAT`|`SUN`) + `time`
docs/features\analytics-reporting.md:893:## 11. 빌드 검증·런타임 검증 (AR4-16 분리)
docs/features\analytics-reporting.md:899:- `schedule.type`/`dayOfWeek`/`dayOfMonth` 문법 오류
docs/features\analytics-reporting.md:954:| 2026-05-14 | v0.5 | codex 4차 (16 지적 전건 수용)
docs/features\analytics-reporting.md:955:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) **§ 1.1 변경 정책에 build/runtime/warning 룰 변경 항목 추가** (AR5-01), (2) **manifestSnapshotVersion에 sourceConfigSnapshotHash 포함** — secretRef·propertyId·siteUrl·bucket strategy 변경 시 새 lineage 보장 (AR5-02), (3) **outbox maxAttempts 상수 5 고정** + § 1.2.1 큐별 표 추가. § 11 build fail은 schema 필드 검증만 (AR5-03), (4) **outbox SQL stale 검사 강화** — attempts<5 항상 적용 + 별도 reconcile step으로 attempts>=5 → permanent 전이 (AR5-04), (5) **REVIEW_WORKFLOW § 8.1 본문 v0.15 cascade 정합** — operational/calendar 슬롯 분리 명시 (AR5-05), (6) **`queryDailyUserMeasurements()` calendar 산정 API** — legal 검수자용 read API. primarySource·botFilteringPolicy override 가능 (AR5-06), (7) **`ComplianceRecord.legalCounsel`·`legalCounselAt` top-level 필드 명시** — `mediaThresholdAssessment` nested 아님 (AR5-07), (8) **AnalyticsRedactionAudit.expiresAt 필드 + retention purge worker** — `processedAt + retentionDays.rawRedactionAuditTrail` 기준 (AR5-08): (1) **C-08 `analyticsPolicyVersion` cascade** — 패키지 병렬 보관 + manifest opt-in (AR4-01), (2) scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze (AR4-02), (3) lock ordering invariant — attempt lock 보유 중 envelope lock 금지 (AR4-03), (4) ReportInstance outbox dispatch-failed-retryable vs -permanent 분리 + 5회 한도 (AR4-04), (5) MediaThresholdReassessmentDispatchOutbox 동일 분리 (AR4-05), (6) outbox worker SoT claim SQL — SKIP LOCKED (AR4-06), (7) 공통 retry taxonomy § 1.2.1 (AR4-07), (8) **C-10 v0.15 cascade — mediaThresholdOperationalInput 슬롯 신설** + REVIEW_WORKFLOW § 8.1.1 정정. rolling은 operational 슬롯, calendar는 assessment 슬롯 (AR4-08), (9) sourceCompleteness 산식 — dailyUsers 존재 + dataCompleteness >= 0.9 일자만 (AR4-09), (10) AnalyticsRedactionAudit 모든 projection마다 생성 (AR4-10), (11) projection + DB writes 단일 transaction + crash recovery (AR4-11), (12) date QueryFilter window intersection + `YYYY-MM` startsWith 허용 (AR4-12), (13) joinMode="metric-columns" opt-in cross-source join (AR4-13), (14) status 명칭 cross-Feature 분리 가이드 (AR4-14), (15) § 0·§ 10.1 12 tables 정정 (AR4-15), (16) § 11 build/runtime/warning 3분리 (AR4-16): (1) CollectionSourceAttempt.status enum SoT — `processing` 포함 (AR3-01), (2) **retry worker attemptNumber 동시성 advisory lock** — (collectionLogId, source) 범위 (AR3-02), (3) retry exhausted → `failed-permanent` + envelope 재계산 우선순위 표 (AR3-03·04), (4) **canonicalSources + manifestVersion idempotencyKey 포함** — manifest 변경 시 새 lineage 명시 (AR3-05), (5) forceRefresh validation — `=== true` + non-empty refreshIntentId (AR3-06), (6) generateReport force refresh lineage 별도 row 생성 (AR3-07), (7) **ReportInstance outbox 패턴** — notificationDispatchClaim·outbox reconcile worker (AR3-08), (8) MediaThresholdState.currentState enum 통일 — `below-threshold`/`above-threshold` (AR3-09·23), (9) enterStreak/exitStreak reset 규칙 — 반대 streak 0 + 결측·dataCompleteness<0.9는 hold + basisKey 변경 시 reset (AR3-10), (10) transitionEventId hash에 basisKey·threshold 포함 (AR3-11), (11) **enqueueMediaThresholdReassessment outbox 재시도** — MediaThresholdReassessmentDispatchOutbox 신설 + 1분 주기 worker (AR3-12), (12) **measurementSnapshot 필드 매핑표** — DATA_MODEL C-10 MediaThresholdAssessment 필드별 산출 (AR3-13), (13) **multi-metric mixed source validation error** + `metricSourceMap` 응답 필드 (AR3-14), (14) dataCompletenessBreakdown에 `date` 필드 포함 (AR3-15), (15) **QueryFilter dimension별 최대 1개**·op 조합 truth table (AR3-16), (16) DST SoT — Temporal disambiguation `later`/`earlier` 매핑 (AR3-17), (17) missedRunCarryOverMaxDays 초과 → skipped-missed-run-expired + sink alert (AR3-18), (18) rate limit bucketKey 형식 `ar:quota:{provider}:{credentialHash}` (AR3-19), (19) **redaction memory-only projection** — provider 응답 직후 + projection 전 payload 어디에도 저장 금지 (AR3-20), (20) **AnalyticsRedactionAudit** 신설 — rawPayloadStorage.enabled=false 감사 증거 (AR3-21), (21) DSR reasonCode enum + reasonHumanMessage 분리 + subjectIdentifierHash optional (AR3-22), (22) § 14.7 참조 정정 — MediaThresholdState (AR3-23), (23) **CollectionLog manifestVersion 필드 추가**, ReportInstance에 notificationDispatchClaim·attempts 필드: (1) sources canonicalization — undefined는 활성 source sorted 전체 (AR2-01), (2) forceRefresh + refreshIntentId 입력 + 별도 idempotencyKey 산정 (AR2-02), (3) **CollectionSourceAttempt 신설** — envelope 1건 + per-source 상태 분리 (AR2-03), (4) ReportInstance UNIQUE 통일 — `(instanceId, idempotencyKey)` (AR2-04), (5) ReportInstance.notificationDispatchedAt 영구 저장 — notify receipt 만료 후 재발송 차단 (AR2-05), (6) **MediaThresholdState 테이블 신설** — currentState·streak·lastTransitionEventId (AR2-06), (7) DailyUserMeasurement basisKey — primarySource·botPolicy·calendarPolicy·algorithmVersion (AR2-07), (8) **operational vs 법정 분리 명확화** — rolling-90은 priorReviewRequired 산정 금지 (AR2-08), (9) **ComplianceRecord 갱신 주체 분리** — 본 Feature는 snapshot provider only, mutator 아님 (AR2-09), (10) **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade** — notify는 알림용으로만 (AR2-10), (11) ga4CustomFieldAllowlist — customDimensions·customMetrics·eventParameters 명시 등록 (AR2-11), (12) DSR subject-matching not-applicable — aggregated only (AR2-12), (13) rawPayloadStorage.enabled 분리 — allowlist는 항상 required (AR2-13), (14) rateLimit.bucketKeyStrategy — credential-global vs instance-isolated (AR2-14), (15) **CollectionRetryQueue worker claim** — status·lockedAt·lockedBy + SKIP LOCKED (AR2-15), (16) QueryFilter AST + AND/OR semantics (AR2-16), (17) dimensions=[] → single aggregate row (AR2-17), (18) sourceFilter 부재 — metric별 default source + sourceFilter 미지정 + dimensions에 source 없으면 default 단일 사용 (AR2-18), (19) dataCompletenessBreakdown — source/date/metric 단위 (AR2-19), (20) QueryDimension `source` 명칭 통일 (AR2-20), (21) dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21), (22) DST·missed run grammar — dstNonexistentLocalTime·dstAmbiguousLocalTime·missedRunCarryOverMaxDays (AR2-22), (23) reportTemplates schedule grammar — type/dayOfWeek/dayOfMonth/time (AR2-23), (24) § 5.5 참조 정정 (AR2-24) |
docs/features\keyword-monitoring.md:220:  country: string;                         // ISO3166 alpha-2 — analytics-reporting QueryDimension 정합 (F-3)
docs/features\keyword-monitoring.md:359:  - search-visibility `SerpCrawlerApprovedScope.searchEngines` 허용 enum (DATA_MODEL C-08 v0.16 SoT)
docs/features\keyword-monitoring.md:670:> § 13.8 별도 정의 없음 (F-16 중복 정리 — 본 § 13.4가 유일 정의).
docs/features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
docs/features\search-visibility.md:8:> **연관 문서**: analytics-reporting v1.0 § 3.4, notifications v1.0, REVIEW_WORKFLOW § 9 (5종 cascade 완료), DATA_MODEL C-08 v0.16 (SearchVisibilityConfig + SerpCrawlerApprovedScope), SEARCH_STANDARDIZATION § 3·§ 4·§ 5
docs/features\search-visibility.md:108:| DATA_MODEL C-08 v0.16 | searchVisibilityConfig + searchVisibilityPolicyVersion + SerpCrawlerApprovedScope |
docs/features\search-visibility.md:122:    legalApproved: true
docs/features\search-visibility.md:123:    legalApprovedBy: "legal@glitzy.kr"
docs/features\search-visibility.md:124:    legalApprovedAt: "2026-05-10T00:00:00Z"
docs/features\search-visibility.md:194:        backlinkChange: { minConsecutivePolls: 2, suppressHours: 168 }
docs/features\search-visibility.md:372:- **법무 게이트** (DATA_MODEL C-08 v0.16 SerpCrawlerApprovedScope SoT):
docs/features\search-visibility.md:373:  - `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → build fail
docs/features\search-visibility.md:422:| backlinkChange | minConsecutivePolls 2 | 168h (weekly poll 1회 분량) |
docs/features\search-visibility.md:520:- **`serpCrawler.enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락)** (SV2-01 정합)
docs/features\search-visibility.md:531:1. `serpCrawler.enabled=true`이면 → approvedScope required 검증·legalApproved 게이트 먼저
docs/features\content-migration.md:77:| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |
docs/features\content-migration.md:124:  approvalRequired:
docs/features\content-migration.md:127:    instanceToInstanceCopy: [super-admin, legal-reviewer]
docs/features\content-migration.md:224:| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
docs/features\content-migration.md:234:| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
docs/features\content-migration.md:258:### 3.2 plan kind 6종 (CM3-16 — 풀 전개)
docs/features\content-migration.md:267:분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.
docs/features\content-migration.md:530:| field | operator | super-admin | legal-reviewer | export |
docs/features\content-migration.md:624:### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)
docs/features\content-migration.md:672:      WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800 WHEN 4 THEN 7200 ELSE 21600 END))
docs/features\content-migration.md:739:## 5. 알림 (CM3-16 풀 전개)
docs/features\content-migration.md:877:- `approvalRequired.*` 6종 모두 누락
docs/features\content-migration.md:945:  - ContentMigrationPlan (legalApproved 포함): legalHold true
docs/features\content-migration.md:982:| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
docs/features\content-migration.md:1009:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs/features\asset-ingestion.md:16:- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
docs/features\asset-ingestion.md:48:- 본 문서 = 수집·파싱·PII·태깅·검수·promote SoT + 내부 데이터 구조 SoT (§ 16)
docs/features\asset-ingestion.md:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
docs/features\asset-ingestion.md:147:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
docs/features\asset-ingestion.md:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
docs/features\asset-ingestion.md:212:- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능
docs/features\asset-ingestion.md:419:- **AssetPiiFinding** (§ 16.7): 발견 내역 구조화 저장. offset은 rawBody 기준
docs/features\asset-ingestion.md:501:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
docs/features\asset-ingestion.md:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
docs/features\asset-ingestion.md:581:| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
docs/features\asset-ingestion.md:583:| AI-16 | signed URL refresh client SDK·blob signed URL renewal strategy | 인프라 결정 (search-visibility SV-14 동등) |
docs/features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs/features\asset-ingestion.md:602:## 16. 본 Feature 내부 데이터 구조 (admin DB 11 tables + blob storage)
docs/features\asset-ingestion.md:604:### 16.1 `IngestionSource`·16.2 `IngestionLog`·16.3 `IngestionSourceAttempt`·16.4 `IngestionRetryQueue`
docs/features\asset-ingestion.md:608:### 16.5 `IngestedAsset`
docs/features\asset-ingestion.md:610:v0.1 § 16.4 유지 + canonicalization 필드 추가:
docs/features\asset-ingestion.md:622:### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)
docs/features\asset-ingestion.md:624:v0.1 § 16.5 + 다음 정정:
docs/features\asset-ingestion.md:633:- 상세는 § 16.7
docs/features\asset-ingestion.md:635:### 16.7 `AssetPiiFinding` (신설 — F-14)
docs/features\asset-ingestion.md:656:### 16.8 `AssetTag` — v0.1 § 16.6 유지
docs/features\asset-ingestion.md:658:### 16.9 `AssetReviewRecord` (F-15 rightsReview + AI5-05 reviewVersion)
docs/features\asset-ingestion.md:660:v0.1 § 16.7 + `rightsReview` 객체 + **`reviewVersion: integer required`** (AI5-05):
docs/features\asset-ingestion.md:700:| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
docs/features\asset-ingestion.md:701:| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
docs/features\asset-ingestion.md:702:| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
docs/features\asset-ingestion.md:705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
docs/features\asset-ingestion.md:707:### 16.10 `AssetPromotionRecord` (AI4-01 — 풀 스키마 전개)
docs/features\asset-ingestion.md:731:### 16.11 `AssetIngestionNotificationOutbox` (F-18 구체화 — keyword-monitoring § 13.8 패턴 동일)
docs/features\asset-ingestion.md:751:### 16.12 Blob storage (S3 — F-19)
docs/features\asset-ingestion.md:761:- signed URL TTL 600초 + dashboard refresh client SDK (AI-16 신규 — 인프라 결정)
docs/features\crm-sync.md:19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
docs/features\crm-sync.md:65:- 자격증명·DPA·policyVersion → DATA_MODEL C-08 v0.20
docs/features\crm-sync.md:74:| CrmSyncRetryQueue | 5·configurable | [60, 300, 1800, 7200, 21600]s |
docs/features\crm-sync.md:124:      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
docs/features\crm-sync.md:150:      retryQueue: { maxAttempts: 5, backoffSeconds: [60,300,1800,7200,21600], workerPollIntervalSeconds: 30 }
docs/features\crm-sync.md:206:| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
docs/features\crm-sync.md:216:| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
docs/features\crm-sync.md:291:| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
docs/features\crm-sync.md:294:| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
docs/features\crm-sync.md:296:| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
docs/features\crm-sync.md:297:| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
docs/features\crm-sync.md:299:| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
docs/features\crm-sync.md:312:| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |
docs/features\crm-sync.md:946:### 7.4 DPA vs patient consent
docs/features\crm-sync.md:948:- DPA: `dpaEvidenceRef` 필수
docs/features\crm-sync.md:988:- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)
docs/features\crm-sync.md:1091:| § 10.1 legalApproved=false | INV-MANIFEST |
docs/features\crm-sync.md:1143:- integration `legalApproved !== true` 또는 승인자/시각 누락
docs/features\crm-sync.md:1312:| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
docs/features\crm-sync.md:1536:| `priorCredentialFingerprintPrefix`·`newCredentialFingerprintPrefix` | char(16) | optional |
docs/features\notifications.md:393:- **broadcast 데이터 모델** (N4-14·N4-15·N4-16):
docs/features\notifications.md:412:- **inactive 사용자의 historical inbox**: `active=false` 사용자 inbox는 어드민 UI에서 기본 숨김. 단 DB row는 보존 (감사). 사용자 reactive 시 자동 재노출. 본 정책은 v0.5 기본 운영 결정 — NT-16 해소
docs/features\notifications.md:541:**suppression atomic 갱신 규칙** (N3-16 해소):
docs/features\notifications.md:621:  - `openingHours`/`receptionHours`의 `dayOfWeek` 시간 범위
docs/features\notifications.md:624:  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
docs/features\notifications.md:720:| ~~NT-16~~ | inactive 사용자 historical inbox | v0.5 — 기본 숨김 운영 결정 (§ 5.3). 인스턴스 옵션 override 없음 |
docs/features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs/features\notifications.md:780:> **broadcast 모드 PayloadRecord 생성 규칙** (N4-14): envelope+channel 단위 1건만 생성 (recipientId=NULL, recipientRole=NULL). broadcast-only 추가 recipient들에 대해 별도 PayloadRecord 생성하지 않음. perRecipient[] DeliveryResult의 broadcast-placeholder는 DB row 없는 합성값 (N4-16).
docs/features\notifications.md:794:| `deliveryMode` | enum | ✅ | perRecipient·broadcast (broadcast-placeholder는 DB row 아님 — N4-16: DeliveryResult 합성값) |
docs/features\notifications.md:832:**inactive UI 정책**: § 5.3 (NT-16 운영).

codex
{
  "review": {
    "target": "docs/decisions/INFRA_DECISIONS_DRAFT.md",
    "round": 1,
    "prefix": "INFRA1",
    "ready_for_acceptance": false,
    "summary": {
      "blocking": 5,
      "major": 9,
      "minor": 3,
      "overall_assessment": "현재 draft는 방향성은 합리적이지만, multi-tenant 격리·service_role 정책·Phase 0 일정·공통 패턴 범위·베타 외부 의존 buffer를 과소평가한다. 특히 single DB + instanceId 모델은 MVP 기본값으로 가능하나, RLS 우회와 repository scoping만으로 의료기관 데이터 격리를 설명하면 감사·계약 단계에서 취약하다. Week 1-6 계획도 feature spec의 실제 테이블 수, outbox/CAS/secret/retention/fixture 요구량에 비해 과밀하다."
    },
    "findings": [
      {
        "id": "INFRA1-01",
        "severity": "blocking",
        "area": "multi-tenant",
        "title": "service_role 사용과 RLS 보조 안전망 주장이 서로 충돌한다",
        "issue": "draft는 web·worker가 Supabase service_role key를 사용해 RLS를 bypass한다고 하면서, RLS를 defense in depth로 둔다고 말한다. 하지만 service_role이 기본 경로라면 forgotten WHERE instance_id, SQL injection, repository 우회, raw Drizzle query, migration/admin script 실수에 대해 RLS가 안전망으로 작동하지 않는다.",
        "evidence": [
          "INFRA_DECISIONS_DRAFT.md: backend(web·worker)는 service_role key 사용 → RLS bypass",
          "INFRA_DECISIONS_DRAFT.md: application-level instance scoping은 Drizzle repository에서 강제",
          "features/notifications.md와 crm-sync.md는 모든 운영 테이블에 instanceId 격리와 membership 검증을 전제로 함"
        ],
        "impact": "단일 쿼리 실수로 다른 의료기관 데이터가 노출될 수 있다. 의료기관별 데이터 격리 감사에서 'RLS 보조 안전망' 설명이 사실과 달라진다.",
        "recommendation": "MVP에서도 기본 DB connection은 tenant-scoped DB role + RLS ON으로 두고, service_role은 migration·admin break-glass·서버 내부 batch 중 엄격히 allowlist된 경로에만 제한하라. service_role 사용 시에는 함수 단위 보안 리뷰, audit log, env 분리, runtime guard를 필수 결정으로 추가하라."
      },
      {
        "id": "INFRA1-02",
        "severity": "blocking",
        "area": "multi-tenant",
        "title": "Drizzle repository 자동 scoping의 실패 모드가 정의되지 않았다",
        "issue": "모든 repository 함수가 currentInstanceId를 받는다는 규칙만으로는 누락 방지가 안 된다. raw SQL, join, subquery, aggregate, count, update/delete, background worker, admin super-user view, migration script에서 scope 누락이 가장 흔한 사고 지점이다.",
        "evidence": [
          "INFRA_DECISIONS_DRAFT.md: 모든 repository 함수는 currentInstanceId 파라미터 받아 자동 주입",
          "DATA_MODEL C-23 AdminUser.instanceMemberships와 notifications skipped-missing-user는 instance membership을 강하게 전제"
        ],
        "impact": "tenant isolation이 코드 관례에 의존한다. 70+ table과 feature별 10개 이상 운영 테이블이 붙으면 누락 가능성이 현실적으로 높다.",
        "recommendation": "scopedDb API를 별도 타입으로 만들고 unscoped db 접근을 lint/test에서 금지하라. update/delete에는 instanceId 조건을 타입/헬퍼로 강제하고, 모든 tenant table에 composite FK 또는 CHECK 가능한 instance consistency 규칙을 추가하라. acceptance test에 '다른 instance row가 보이지 않음' fixture를 모든 repository에 자동 생성하라."
      },
      {
        "id": "INFRA1-03",
        "severity": "major",
        "area": "multi-tenant",
        "title": "schema-per-tenant 마이그레이션 path가 실제로 열려 있지 않다",
        "issue": "draft는 Phase 3+에서 schema-per-tenant 전환 가능하다고 하지만, 현재 spec은 UNIQUE(instanceId, ...), cross-feature outbox, audit log, AdminUser membership, notification dedupe key, CRM/change ledger 등 instanceId 기반 글로벌 테이블을 전제로 한다. schema-per-tenant 전환은 단순 DDL 변경이 아니라 control-plane/tenant-plane 분리 재설계다.",
        "evidence": [
          "DATA_MODEL C-08/C-23는 instanceId 기반 multi-tenant",
          "notifications: UNIQUE(instanceId, sourceEventId)",
          "crm-sync: 15 tables 모두 instanceId 또는 integrationId 기반",
          "content-migration: ActiveTargetLock UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)"
        ],
        "impact": "물리 격리 요구 고객이 나오면 Phase 3에서 쉽게 전환할 수 있다는 일정 가정이 깨진다.",
        "recommendation": "Phase 0에서 migration path를 구체화하라. 최소한 control-plane tables와 tenant-owned tables를 분류하고, schema-per-tenant 전환 시 유지/복제/분리될 테이블 목록, FK 금지 규칙, background job routing, backup/restore 단위를 결정해야 한다."
      },
      {
        "id": "INFRA1-04",
        "severity": "major",
        "area": "multi-tenant",
        "title": "noisy neighbor 대응이 slow query alert 수준에 머문다",
        "issue": "single DB는 한 tenant의 content-migration, analytics, crawler artifact processing, CRM polling이 다른 tenant의 admin workflow와 auth 성능을 잠식할 수 있다. draft의 '모니터링 + slow query alert'는 사후 탐지일 뿐 격리 정책이 아니다.",
        "impact": "베타 중 한 의료기관의 대량 이관/분석 작업이 다른 기관의 검수·발행·로그인에 영향을 줄 수 있다.",
        "recommendation": "instance별 job concurrency, rate limit, statement_timeout, queue partitioning, worker pool 분리, heavy job time window를 Phase 0 운영 규칙에 넣어라. 최소한 content-migration/asset-ingestion/analytics 계열은 interactive admin 트래픽과 DB connection pool을 분리해야 한다."
      },
      {
        "id": "INFRA1-05",
        "severity": "major",
        "area": "backup-restore",
        "title": "instance 단위 backup/restore 불가가 MVP 운영 리스크로 축소되어 있다",
        "issue": "backup per instance는 Phase 3 이후 문제가 아니라 content-migration, bulk transform, CRM consent withdrawal, legal hold가 들어오는 순간부터 중요하다. single DB PITR은 전체 DB 복구만 쉽고 특정 의료기관만 복구하기 어렵다.",
        "impact": "한 instance 데이터 손상 시 전체 DB rollback 없이 복구하기 어렵다. 다른 tenant의 최신 변경을 보존하면서 특정 tenant만 복구하려면 export/import tooling이 필요하다.",
        "recommendation": "MVP부터 tenant export/import, logical backup, per-instance restore rehearsal를 결정하라. 최소한 모든 tenant-owned table에 instanceId, createdAt, updatedAt, immutable audit trail을 보장하고, restore dry-run 절차를 Phase 0 acceptance에 추가하라."
      },
      {
        "id": "INFRA1-06",
        "severity": "major",
        "area": "providers",
        "title": "Resend 적합성 판단에 의료/개인정보 계약 조건이 빠져 있다",
        "issue": "Resend의 DX와 DKIM만 평가하고, 의료기관 운영에서 필요한 DPA/BAA 또는 개인정보 처리 위탁 계약, 데이터 보관 위치, bounce/complaint 로그의 개인정보성, PHI/민감정보 포함 금지 템플릿 정책을 결정하지 않았다.",
        "impact": "magic link, 검수 알림, SLA 알림 자체는 가능해도 이메일 본문/메타데이터에 환자·의료기관 민감 맥락이 들어가면 계약·보존·삭제 정책 리스크가 생긴다.",
        "recommendation": "Resend는 MVP 후보로 두되, 이메일 payload에 PHI/환자정보 금지, content title 민감도 정책, provider log retention, DPA 가능 여부, fallback provider(Postmark/SES) 전환 기준을 명시하라. 100/day 무료는 개발·초기 smoke에는 충분하지만 베타 운영 충분성의 근거로 쓰면 안 된다."
      },
      {
        "id": "INFRA1-07",
        "severity": "major",
        "area": "providers",
        "title": "Sentry 5k events/month는 운영 모니터링 요구와 맞지 않을 수 있다",
        "issue": "spec은 notifications DLQ, retry, skipped, suppression, CRM sync, migration, crawler failures 등 많은 operational event를 외부 sink로 보낼 수 있다. Sentry 무료 5k events/month는 에러 폭주나 noisy worker에서 쉽게 소진된다.",
        "impact": "베타 중 quota 소진 후 중요한 critical alert를 놓칠 수 있다. 또한 Sentry breadcrumbs/context에 actorId, instanceId, contentRef를 넣을 때 개인정보·민감정보 마스킹 정책이 필요하다.",
        "recommendation": "Sentry는 error tracking으로 한정하고, operational logs/metrics는 별도 log sink 또는 DB-backed operational tables를 SoT로 삼아라. event sampling, PII scrubbing, alert budget, quota exhaustion alert를 Phase 0에 결정하라."
      },
      {
        "id": "INFRA1-08",
        "severity": "major",
        "area": "providers",
        "title": "Upstash Redis HTTP API와 token bucket 정확도 trade-off가 과소명시됐다",
        "issue": "draft는 Upstash를 token bucket에 적합하다고만 말한다. 하지만 serverless HTTP Redis는 latency, multi-command atomicity, pipeline 실패, region mismatch, provider outage에 따른 rate-limit fail-open/fail-closed 정책을 결정해야 한다.",
        "impact": "CRM provider quota, notification dedupe, rate limit이 부정확해질 수 있다. 특히 token bucket을 여러 worker가 동시에 갱신하면 Lua/atomic script 또는 단일 원자 연산 없이는 초과 발송 가능성이 있다.",
        "recommendation": "Upstash 사용 시 token bucket은 Lua/EVAL 또는 provider가 보장하는 atomic primitive로 제한하라. dedupe SET NX EX는 적합하지만 정밀 quota는 DB row lock 또는 standard Redis가 더 나을 수 있다. feature별로 'dedupe는 Redis, billing/quota는 Postgres' 같은 경계를 결정하라."
      },
      {
        "id": "INFRA1-09",
        "severity": "blocking",
        "area": "phase-0",
        "title": "Week 1-2 일정은 솔로 개발 기준으로 과밀하다",
        "issue": "10 working days 안에 GitHub, pnpm workspace, Next.js, Supabase 3환경, Doppler, Vercel, Railway worker, webhook receiver, Cloudflare DNS, Sentry 3 projects, Resend DKIM, Upstash 3 instances, Auth.js magic link, Drizzle adapter, CI, local docker-compose까지 끝내는 계획은 외부 계정/DNS/환경 이슈를 고려하지 않는다.",
        "impact": "초기 인프라가 반쯤 연결된 상태로 Week 3 schema 작업에 진입할 가능성이 높다. 이후 모든 일정 산정이 밀린다.",
        "recommendation": "Week 1-2를 'single dev/staging path green'으로 축소하고 prod 3환경·Cloudflare custom domain·Doppler propagation 자동화는 Week 3 이후로 분리하라. Phase 0 완료 조건도 smoke-tested dev/staging과 prod readiness를 분리해야 한다."
      },
      {
        "id": "INFRA1-10",
        "severity": "blocking",
        "area": "phase-0",
        "title": "Week 3-4의 schema·공통 패턴 범위가 실제 spec 규모와 맞지 않는다",
        "issue": "Week 3에 Core schema 30+ tables, Week 4에 outbox·retry·CAS·closed schema validator·hash utils·secretRef를 모두 구현한다고 하지만 feature spec은 notifications 11 tables, asset-ingestion 11 tables, crm-sync 15 tables, content-migration 12 tables 등 각 feature가 독립적인 동시성/retention/worker 불변식을 요구한다.",
        "impact": "공통 패턴을 얕게 만들면 후속 feature 구현 시 매번 재작성된다. 반대로 제대로 만들면 1주로는 부족하다.",
        "recommendation": "Week 4를 '패턴 라이브러리 전체 구현'이 아니라 P0 subset으로 재정의하라. P0는 tenant-scoped db, audit append, idempotency key, outbox base table/worker, secretRef resolver interface, HMAC utility, Result/error convention 정도다. writeSetManifest, legalImpactClassifier, purge worker, grace expiry, advanced CAS는 해당 feature 착수 시 구현으로 미뤄라."
      },
      {
        "id": "INFRA1-11",
        "severity": "major",
        "area": "phase-0",
        "title": "개발 품질 표준 결정이 Phase 0에서 빠져 있다",
        "issue": "draft는 biome와 CI만 부분 언급한다. TypeScript strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, test runner, Playwright, fixture generation, Storybook 의무/선택 기준, package boundary lint, migration validation 전략이 결정되지 않았다.",
        "impact": "70+ table과 고위험 workflow에서 타입/테스트 관례가 늦게 정해지면 대량 수정 비용이 커진다.",
        "recommendation": "Phase 0 Day 1-2 산출물에 tsconfig strict profile, Biome/ESLint 선택, formatter, Vitest, Playwright, test DB strategy, fixture directory convention, CI matrix를 추가하라. Storybook은 UI 컴포넌트 개발을 Week 4에 한다면 선택이 아니라 최소 visual smoke로 결정하는 편이 낫다."
      },
      {
        "id": "INFRA1-12",
        "severity": "major",
        "area": "db-migration",
        "title": "DB migration deploy 전략이 위험하게 단순화되어 있다",
        "issue": "Drizzle migrate on deploy라고만 되어 있고, Vercel web·Railway worker·webhook receiver가 동시에 배포될 때 migration ordering, backward compatibility, rollback, long migration, seed/reference data, data backfill 경계가 없다.",
        "impact": "배포 중 worker가 새 코드로 구 schema를 읽거나, web이 migration 도중 장애를 낼 수 있다.",
        "recommendation": "Phase 0에서 expand/contract migration 원칙, migration runner 단일 소유자, deploy lock, dry-run, drift detection, rollback 불가 migration 절차를 결정하라. application data migration은 content-migration feature, DDL은 infra migration으로 분리한다는 경계를 명시하라."
      },
      {
        "id": "INFRA1-13",
        "severity": "blocking",
        "area": "beta",
        "title": "DPA·legal-reviewer·베타 영업이 개발 일정의 critical path로 반영되지 않았다",
        "issue": "draft는 Week 7-16에 DPA 템플릿 작성과 legal-reviewer 후보 결정을 병렬로 둔다. 하지만 M0에는 LegalDocument 법무 검토, content gate, prior review 판단, 의료광고법 운영이 들어가므로 legal-reviewer는 M0 deploy 전이 아니라 M0 workflow 설계·테스트 전부터 필요하다.",
        "evidence": [
          "DATA_MODEL C-16 LegalDocument는 M0 출시 게이트이며 legalCounsel/legalCounselAt required",
          "REVIEW_WORKFLOW는 legal-reviewer 역할과 legal slot을 발행 게이트에 사용",
          "MEDICAL_AD_COMPLIANCE_COMMON은 법무 자문 보완 의무를 명시"
        ],
        "impact": "Week 16에 legal-reviewer가 정해지면 M0 검수 workflow는 실제 검수자 없이 설계된 셈이 된다. 베타 계약 체결 지연 시 M0 deploy도 지연된다.",
        "recommendation": "legal-reviewer 운영자와 DPA 템플릿은 Phase 0 종료 조건 또는 Phase 1 시작 gate로 앞당겨라. 베타 의료기관 영업은 Week 1부터가 아니라 pre-Phase 0 dependency로 관리하고, 계약 미체결 시 dummy/internal beta로 대체하는 fallback을 명시하라."
      },
      {
        "id": "INFRA1-14",
        "severity": "major",
        "area": "common-patterns",
        "title": "공통 패턴의 critical/deferrable 우선순위가 없다",
        "issue": "closed schema, hash secrets, CAS, outbox, retry, grace expiry, legalImpactClassifier, writeSetManifest, purge worker, legal hold precedence, rate limit token bucket이 한 주에 묶여 있다. 이들은 추상화 수준과 구현 시점이 다르다.",
        "impact": "중요한 기반 패턴과 feature-specific 복잡 패턴이 섞여 일정·완료 기준이 불명확하다.",
        "recommendation": "P0 critical: tenant scoping, audit append-only, idempotency, outbox enqueue/dispatch, retry queue skeleton, secretRef resolver, HMAC, DB transaction helper, error taxonomy. P1 critical: review workflow state machine, ComplianceRecord versioning, notification delivery log. Deferrable: legalImpactClassifier, writeSetManifest, purge worker, grace expiry, CRM token bucket, content-migration active target lock."
      },
      {
        "id": "INFRA1-15",
        "severity": "major",
        "area": "logging-observability",
        "title": "logging strategy가 Sentry만으로는 부족하다",
        "issue": "Sentry user context에 actorId·instanceId를 포함한다고만 되어 있다. 그러나 specs는 NotificationLog, audit log, DeliveryAttempt, retry queues, DLQ, CRM sync logs 등 운영 메트릭 SoT를 DB에 둔다. Sentry breadcrumbs와 운영 로그의 경계가 없다.",
        "impact": "장애 분석 시 어떤 정보가 Sentry, DB audit, NotificationLog, provider dashboard에 있는지 불명확해진다. 민감정보가 Sentry로 흘러갈 위험도 있다.",
        "recommendation": "로그 레벨과 저장소를 분리하라. business audit는 DB append-only, delivery/retry metrics는 feature tables, app error는 Sentry, request/access log는 별도 sink 또는 platform log로 둔다. PII scrubber와 correlationId/requestId/sourceEventId 표준을 Phase 0에 추가하라."
      },
      {
        "id": "INFRA1-16",
        "severity": "minor",
        "area": "vendor-lock-in",
        "title": "provider lock-in 평가가 SDK/DX 중심이다",
        "issue": "Resend, Sentry, Upstash 모두 교체 비용이 낮다고 암묵적으로 가정하지만 실제 lock-in은 SDK보다 데이터 모델·webhook event shape·retry semantics·dashboard 운영 절차에서 생긴다.",
        "impact": "provider 교체 시 email suppression, Sentry issue history, Redis key semantics를 이식하기 어렵다.",
        "recommendation": "Phase 0에 provider adapter interface와 provider-neutral DB log를 두라. Resend/Sentry/Upstash 고유 응답은 raw provider metadata로만 저장하고, 내부 상태 enum은 feature spec의 canonical enum을 유지하라."
      },
      {
        "id": "INFRA1-17",
        "severity": "minor",
        "area": "fixtures",
        "title": "INV-* acceptance fixture 자동 생성 전략이 빠져 있다",
        "issue": "content-migration과 crm-sync는 INV-* invariant별 fixture traceability를 이미 갖고 있다. infra draft는 이를 테스트 자산으로 전환하는 전략이 없다.",
        "impact": "명세는 안정판이어도 구현 검증이 수동으로 남는다.",
        "recommendation": "docs/features의 INV-* 표를 파싱하거나 수동 registry로 옮겨 Vitest/Playwright fixture를 생성하는 conventions를 Phase 0에 넣어라. 최소한 build-time fail, runtime 409/CAS, tenant isolation, outbox idempotency fixture부터 시작하라."
      }
    ],
    "recommended_rewrite": {
      "multi_tenant_decision": "A를 유지하되 'service_role everywhere'는 폐기하거나 break-glass로 제한. RLS/tenant-scoped role을 기본값으로 격상. schema-per-tenant는 Phase 3 옵션이 아니라 별도 architecture decision으로 migration feasibility를 정의.",
      "phase_0_schedule": "Week 1-2는 dev/staging vertical infra skeleton으로 축소. Week 3-6은 Core schema 전체가 아니라 M0 vertical slice schema + tenant scoping + audit/outbox/idempotency 기반을 목표로 재작성.",
      "provider_decision": "Resend/Sentry/Upstash는 MVP 기본값 가능. 단 DPA/PII/log retention/quota/fallback/adapter boundary를 acceptance 조건으로 추가.",
      "beta_plan": "legal-reviewer와 DPA 템플릿은 Phase 1 종료가 아니라 Phase 1 시작 gate. 베타 고객 미확정 시 internal beta fallback과 일정 slip buffer를 명시.",
      "common_patterns": "공통 패턴을 P0 foundation과 feature-specific advanced patterns로 분리. 1주 전체 구현 가정 제거."
    }
  }
}
tokens used
149,378
{
  "review": {
    "target": "docs/decisions/INFRA_DECISIONS_DRAFT.md",
    "round": 1,
    "prefix": "INFRA1",
    "ready_for_acceptance": false,
    "summary": {
      "blocking": 5,
      "major": 9,
      "minor": 3,
      "overall_assessment": "현재 draft는 방향성은 합리적이지만, multi-tenant 격리·service_role 정책·Phase 0 일정·공통 패턴 범위·베타 외부 의존 buffer를 과소평가한다. 특히 single DB + instanceId 모델은 MVP 기본값으로 가능하나, RLS 우회와 repository scoping만으로 의료기관 데이터 격리를 설명하면 감사·계약 단계에서 취약하다. Week 1-6 계획도 feature spec의 실제 테이블 수, outbox/CAS/secret/retention/fixture 요구량에 비해 과밀하다."
    },
    "findings": [
      {
        "id": "INFRA1-01",
        "severity": "blocking",
        "area": "multi-tenant",
        "title": "service_role 사용과 RLS 보조 안전망 주장이 서로 충돌한다",
        "issue": "draft는 web·worker가 Supabase service_role key를 사용해 RLS를 bypass한다고 하면서, RLS를 defense in depth로 둔다고 말한다. 하지만 service_role이 기본 경로라면 forgotten WHERE instance_id, SQL injection, repository 우회, raw Drizzle query, migration/admin script 실수에 대해 RLS가 안전망으로 작동하지 않는다.",
        "evidence": [
          "INFRA_DECISIONS_DRAFT.md: backend(web·worker)는 service_role key 사용 → RLS bypass",
          "INFRA_DECISIONS_DRAFT.md: application-level instance scoping은 Drizzle repository에서 강제",
          "features/notifications.md와 crm-sync.md는 모든 운영 테이블에 instanceId 격리와 membership 검증을 전제로 함"
        ],
        "impact": "단일 쿼리 실수로 다른 의료기관 데이터가 노출될 수 있다. 의료기관별 데이터 격리 감사에서 'RLS 보조 안전망' 설명이 사실과 달라진다.",
        "recommendation": "MVP에서도 기본 DB connection은 tenant-scoped DB role + RLS ON으로 두고, service_role은 migration·admin break-glass·서버 내부 batch 중 엄격히 allowlist된 경로에만 제한하라. service_role 사용 시에는 함수 단위 보안 리뷰, audit log, env 분리, runtime guard를 필수 결정으로 추가하라."
      },
      {
        "id": "INFRA1-02",
        "severity": "blocking",
        "area": "multi-tenant",
        "title": "Drizzle repository 자동 scoping의 실패 모드가 정의되지 않았다",
        "issue": "모든 repository 함수가 currentInstanceId를 받는다는 규칙만으로는 누락 방지가 안 된다. raw SQL, join, subquery, aggregate, count, update/delete, background worker, admin super-user view, migration script에서 scope 누락이 가장 흔한 사고 지점이다.",
        "evidence": [
          "INFRA_DECISIONS_DRAFT.md: 모든 repository 함수는 currentInstanceId 파라미터 받아 자동 주입",
          "DATA_MODEL C-23 AdminUser.instanceMemberships와 notifications skipped-missing-user는 instance membership을 강하게 전제"
        ],
        "impact": "tenant isolation이 코드 관례에 의존한다. 70+ table과 feature별 10개 이상 운영 테이블이 붙으면 누락 가능성이 현실적으로 높다.",
        "recommendation": "scopedDb API를 별도 타입으로 만들고 unscoped db 접근을 lint/test에서 금지하라. update/delete에는 instanceId 조건을 타입/헬퍼로 강제하고, 모든 tenant table에 composite FK 또는 CHECK 가능한 instance consistency 규칙을 추가하라. acceptance test에 '다른 instance row가 보이지 않음' fixture를 모든 repository에 자동 생성하라."
      },
      {
        "id": "INFRA1-03",
        "severity": "major",
        "area": "multi-tenant",
        "title": "schema-per-tenant 마이그레이션 path가 실제로 열려 있지 않다",
        "issue": "draft는 Phase 3+에서 schema-per-tenant 전환 가능하다고 하지만, 현재 spec은 UNIQUE(instanceId, ...), cross-feature outbox, audit log, AdminUser membership, notification dedupe key, CRM/change ledger 등 instanceId 기반 글로벌 테이블을 전제로 한다. schema-per-tenant 전환은 단순 DDL 변경이 아니라 control-plane/tenant-plane 분리 재설계다.",
        "evidence": [
          "DATA_MODEL C-08/C-23는 instanceId 기반 multi-tenant",
          "notifications: UNIQUE(instanceId, sourceEventId)",
          "crm-sync: 15 tables 모두 instanceId 또는 integrationId 기반",
          "content-migration: ActiveTargetLock UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)"
        ],
        "impact": "물리 격리 요구 고객이 나오면 Phase 3에서 쉽게 전환할 수 있다는 일정 가정이 깨진다.",
        "recommendation": "Phase 0에서 migration path를 구체화하라. 최소한 control-plane tables와 tenant-owned tables를 분류하고, schema-per-tenant 전환 시 유지/복제/분리될 테이블 목록, FK 금지 규칙, background job routing, backup/restore 단위를 결정해야 한다."
      },
      {
        "id": "INFRA1-04",
        "severity": "major",
        "area": "multi-tenant",
        "title": "noisy neighbor 대응이 slow query alert 수준에 머문다",
        "issue": "single DB는 한 tenant의 content-migration, analytics, crawler artifact processing, CRM polling이 다른 tenant의 admin workflow와 auth 성능을 잠식할 수 있다. draft의 '모니터링 + slow query alert'는 사후 탐지일 뿐 격리 정책이 아니다.",
        "impact": "베타 중 한 의료기관의 대량 이관/분석 작업이 다른 기관의 검수·발행·로그인에 영향을 줄 수 있다.",
        "recommendation": "instance별 job concurrency, rate limit, statement_timeout, queue partitioning, worker pool 분리, heavy job time window를 Phase 0 운영 규칙에 넣어라. 최소한 content-migration/asset-ingestion/analytics 계열은 interactive admin 트래픽과 DB connection pool을 분리해야 한다."
      },
      {
        "id": "INFRA1-05",
        "severity": "major",
        "area": "backup-restore",
        "title": "instance 단위 backup/restore 불가가 MVP 운영 리스크로 축소되어 있다",
        "issue": "backup per instance는 Phase 3 이후 문제가 아니라 content-migration, bulk transform, CRM consent withdrawal, legal hold가 들어오는 순간부터 중요하다. single DB PITR은 전체 DB 복구만 쉽고 특정 의료기관만 복구하기 어렵다.",
        "impact": "한 instance 데이터 손상 시 전체 DB rollback 없이 복구하기 어렵다. 다른 tenant의 최신 변경을 보존하면서 특정 tenant만 복구하려면 export/import tooling이 필요하다.",
        "recommendation": "MVP부터 tenant export/import, logical backup, per-instance restore rehearsal를 결정하라. 최소한 모든 tenant-owned table에 instanceId, createdAt, updatedAt, immutable audit trail을 보장하고, restore dry-run 절차를 Phase 0 acceptance에 추가하라."
      },
      {
        "id": "INFRA1-06",
        "severity": "major",
        "area": "providers",
        "title": "Resend 적합성 판단에 의료/개인정보 계약 조건이 빠져 있다",
        "issue": "Resend의 DX와 DKIM만 평가하고, 의료기관 운영에서 필요한 DPA/BAA 또는 개인정보 처리 위탁 계약, 데이터 보관 위치, bounce/complaint 로그의 개인정보성, PHI/민감정보 포함 금지 템플릿 정책을 결정하지 않았다.",
        "impact": "magic link, 검수 알림, SLA 알림 자체는 가능해도 이메일 본문/메타데이터에 환자·의료기관 민감 맥락이 들어가면 계약·보존·삭제 정책 리스크가 생긴다.",
        "recommendation": "Resend는 MVP 후보로 두되, 이메일 payload에 PHI/환자정보 금지, content title 민감도 정책, provider log retention, DPA 가능 여부, fallback provider(Postmark/SES) 전환 기준을 명시하라. 100/day 무료는 개발·초기 smoke에는 충분하지만 베타 운영 충분성의 근거로 쓰면 안 된다."
      },
      {
        "id": "INFRA1-07",
        "severity": "major",
        "area": "providers",
        "title": "Sentry 5k events/month는 운영 모니터링 요구와 맞지 않을 수 있다",
        "issue": "spec은 notifications DLQ, retry, skipped, suppression, CRM sync, migration, crawler failures 등 많은 operational event를 외부 sink로 보낼 수 있다. Sentry 무료 5k events/month는 에러 폭주나 noisy worker에서 쉽게 소진된다.",
        "impact": "베타 중 quota 소진 후 중요한 critical alert를 놓칠 수 있다. 또한 Sentry breadcrumbs/context에 actorId, instanceId, contentRef를 넣을 때 개인정보·민감정보 마스킹 정책이 필요하다.",
        "recommendation": "Sentry는 error tracking으로 한정하고, operational logs/metrics는 별도 log sink 또는 DB-backed operational tables를 SoT로 삼아라. event sampling, PII scrubbing, alert budget, quota exhaustion alert를 Phase 0에 결정하라."
      },
      {
        "id": "INFRA1-08",
        "severity": "major",
        "area": "providers",
        "title": "Upstash Redis HTTP API와 token bucket 정확도 trade-off가 과소명시됐다",
        "issue": "draft는 Upstash를 token bucket에 적합하다고만 말한다. 하지만 serverless HTTP Redis는 latency, multi-command atomicity, pipeline 실패, region mismatch, provider outage에 따른 rate-limit fail-open/fail-closed 정책을 결정해야 한다.",
        "impact": "CRM provider quota, notification dedupe, rate limit이 부정확해질 수 있다. 특히 token bucket을 여러 worker가 동시에 갱신하면 Lua/atomic script 또는 단일 원자 연산 없이는 초과 발송 가능성이 있다.",
        "recommendation": "Upstash 사용 시 token bucket은 Lua/EVAL 또는 provider가 보장하는 atomic primitive로 제한하라. dedupe SET NX EX는 적합하지만 정밀 quota는 DB row lock 또는 standard Redis가 더 나을 수 있다. feature별로 'dedupe는 Redis, billing/quota는 Postgres' 같은 경계를 결정하라."
      },
      {
        "id": "INFRA1-09",
        "severity": "blocking",
        "area": "phase-0",
        "title": "Week 1-2 일정은 솔로 개발 기준으로 과밀하다",
        "issue": "10 working days 안에 GitHub, pnpm workspace, Next.js, Supabase 3환경, Doppler, Vercel, Railway worker, webhook receiver, Cloudflare DNS, Sentry 3 projects, Resend DKIM, Upstash 3 instances, Auth.js magic link, Drizzle adapter, CI, local docker-compose까지 끝내는 계획은 외부 계정/DNS/환경 이슈를 고려하지 않는다.",
        "impact": "초기 인프라가 반쯤 연결된 상태로 Week 3 schema 작업에 진입할 가능성이 높다. 이후 모든 일정 산정이 밀린다.",
        "recommendation": "Week 1-2를 'single dev/staging path green'으로 축소하고 prod 3환경·Cloudflare custom domain·Doppler propagation 자동화는 Week 3 이후로 분리하라. Phase 0 완료 조건도 smoke-tested dev/staging과 prod readiness를 분리해야 한다."
      },
      {
        "id": "INFRA1-10",
        "severity": "blocking",
        "area": "phase-0",
        "title": "Week 3-4의 schema·공통 패턴 범위가 실제 spec 규모와 맞지 않는다",
        "issue": "Week 3에 Core schema 30+ tables, Week 4에 outbox·retry·CAS·closed schema validator·hash utils·secretRef를 모두 구현한다고 하지만 feature spec은 notifications 11 tables, asset-ingestion 11 tables, crm-sync 15 tables, content-migration 12 tables 등 각 feature가 독립적인 동시성/retention/worker 불변식을 요구한다.",
        "impact": "공통 패턴을 얕게 만들면 후속 feature 구현 시 매번 재작성된다. 반대로 제대로 만들면 1주로는 부족하다.",
        "recommendation": "Week 4를 '패턴 라이브러리 전체 구현'이 아니라 P0 subset으로 재정의하라. P0는 tenant-scoped db, audit append, idempotency key, outbox base table/worker, secretRef resolver interface, HMAC utility, Result/error convention 정도다. writeSetManifest, legalImpactClassifier, purge worker, grace expiry, advanced CAS는 해당 feature 착수 시 구현으로 미뤄라."
      },
      {
        "id": "INFRA1-11",
        "severity": "major",
        "area": "phase-0",
        "title": "개발 품질 표준 결정이 Phase 0에서 빠져 있다",
        "issue": "draft는 biome와 CI만 부분 언급한다. TypeScript strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, test runner, Playwright, fixture generation, Storybook 의무/선택 기준, package boundary lint, migration validation 전략이 결정되지 않았다.",
        "impact": "70+ table과 고위험 workflow에서 타입/테스트 관례가 늦게 정해지면 대량 수정 비용이 커진다.",
        "recommendation": "Phase 0 Day 1-2 산출물에 tsconfig strict profile, Biome/ESLint 선택, formatter, Vitest, Playwright, test DB strategy, fixture directory convention, CI matrix를 추가하라. Storybook은 UI 컴포넌트 개발을 Week 4에 한다면 선택이 아니라 최소 visual smoke로 결정하는 편이 낫다."
      },
      {
        "id": "INFRA1-12",
        "severity": "major",
        "area": "db-migration",
        "title": "DB migration deploy 전략이 위험하게 단순화되어 있다",
        "issue": "Drizzle migrate on deploy라고만 되어 있고, Vercel web·Railway worker·webhook receiver가 동시에 배포될 때 migration ordering, backward compatibility, rollback, long migration, seed/reference data, data backfill 경계가 없다.",
        "impact": "배포 중 worker가 새 코드로 구 schema를 읽거나, web이 migration 도중 장애를 낼 수 있다.",
        "recommendation": "Phase 0에서 expand/contract migration 원칙, migration runner 단일 소유자, deploy lock, dry-run, drift detection, rollback 불가 migration 절차를 결정하라. application data migration은 content-migration feature, DDL은 infra migration으로 분리한다는 경계를 명시하라."
      },
      {
        "id": "INFRA1-13",
        "severity": "blocking",
        "area": "beta",
        "title": "DPA·legal-reviewer·베타 영업이 개발 일정의 critical path로 반영되지 않았다",
        "issue": "draft는 Week 7-16에 DPA 템플릿 작성과 legal-reviewer 후보 결정을 병렬로 둔다. 하지만 M0에는 LegalDocument 법무 검토, content gate, prior review 판단, 의료광고법 운영이 들어가므로 legal-reviewer는 M0 deploy 전이 아니라 M0 workflow 설계·테스트 전부터 필요하다.",
        "evidence": [
          "DATA_MODEL C-16 LegalDocument는 M0 출시 게이트이며 legalCounsel/legalCounselAt required",
          "REVIEW_WORKFLOW는 legal-reviewer 역할과 legal slot을 발행 게이트에 사용",
          "MEDICAL_AD_COMPLIANCE_COMMON은 법무 자문 보완 의무를 명시"
        ],
        "impact": "Week 16에 legal-reviewer가 정해지면 M0 검수 workflow는 실제 검수자 없이 설계된 셈이 된다. 베타 계약 체결 지연 시 M0 deploy도 지연된다.",
        "recommendation": "legal-reviewer 운영자와 DPA 템플릿은 Phase 0 종료 조건 또는 Phase 1 시작 gate로 앞당겨라. 베타 의료기관 영업은 Week 1부터가 아니라 pre-Phase 0 dependency로 관리하고, 계약 미체결 시 dummy/internal beta로 대체하는 fallback을 명시하라."
      },
      {
        "id": "INFRA1-14",
        "severity": "major",
        "area": "common-patterns",
        "title": "공통 패턴의 critical/deferrable 우선순위가 없다",
        "issue": "closed schema, hash secrets, CAS, outbox, retry, grace expiry, legalImpactClassifier, writeSetManifest, purge worker, legal hold precedence, rate limit token bucket이 한 주에 묶여 있다. 이들은 추상화 수준과 구현 시점이 다르다.",
        "impact": "중요한 기반 패턴과 feature-specific 복잡 패턴이 섞여 일정·완료 기준이 불명확하다.",
        "recommendation": "P0 critical: tenant scoping, audit append-only, idempotency, outbox enqueue/dispatch, retry queue skeleton, secretRef resolver, HMAC, DB transaction helper, error taxonomy. P1 critical: review workflow state machine, ComplianceRecord versioning, notification delivery log. Deferrable: legalImpactClassifier, writeSetManifest, purge worker, grace expiry, CRM token bucket, content-migration active target lock."
      },
      {
        "id": "INFRA1-15",
        "severity": "major",
        "area": "logging-observability",
        "title": "logging strategy가 Sentry만으로는 부족하다",
        "issue": "Sentry user context에 actorId·instanceId를 포함한다고만 되어 있다. 그러나 specs는 NotificationLog, audit log, DeliveryAttempt, retry queues, DLQ, CRM sync logs 등 운영 메트릭 SoT를 DB에 둔다. Sentry breadcrumbs와 운영 로그의 경계가 없다.",
        "impact": "장애 분석 시 어떤 정보가 Sentry, DB audit, NotificationLog, provider dashboard에 있는지 불명확해진다. 민감정보가 Sentry로 흘러갈 위험도 있다.",
        "recommendation": "로그 레벨과 저장소를 분리하라. business audit는 DB append-only, delivery/retry metrics는 feature tables, app error는 Sentry, request/access log는 별도 sink 또는 platform log로 둔다. PII scrubber와 correlationId/requestId/sourceEventId 표준을 Phase 0에 추가하라."
      },
      {
        "id": "INFRA1-16",
        "severity": "minor",
        "area": "vendor-lock-in",
        "title": "provider lock-in 평가가 SDK/DX 중심이다",
        "issue": "Resend, Sentry, Upstash 모두 교체 비용이 낮다고 암묵적으로 가정하지만 실제 lock-in은 SDK보다 데이터 모델·webhook event shape·retry semantics·dashboard 운영 절차에서 생긴다.",
        "impact": "provider 교체 시 email suppression, Sentry issue history, Redis key semantics를 이식하기 어렵다.",
        "recommendation": "Phase 0에 provider adapter interface와 provider-neutral DB log를 두라. Resend/Sentry/Upstash 고유 응답은 raw provider metadata로만 저장하고, 내부 상태 enum은 feature spec의 canonical enum을 유지하라."
      },
      {
        "id": "INFRA1-17",
        "severity": "minor",
        "area": "fixtures",
        "title": "INV-* acceptance fixture 자동 생성 전략이 빠져 있다",
        "issue": "content-migration과 crm-sync는 INV-* invariant별 fixture traceability를 이미 갖고 있다. infra draft는 이를 테스트 자산으로 전환하는 전략이 없다.",
        "impact": "명세는 안정판이어도 구현 검증이 수동으로 남는다.",
        "recommendation": "docs/features의 INV-* 표를 파싱하거나 수동 registry로 옮겨 Vitest/Playwright fixture를 생성하는 conventions를 Phase 0에 넣어라. 최소한 build-time fail, runtime 409/CAS, tenant isolation, outbox idempotency fixture부터 시작하라."
      }
    ],
    "recommended_rewrite": {
      "multi_tenant_decision": "A를 유지하되 'service_role everywhere'는 폐기하거나 break-glass로 제한. RLS/tenant-scoped role을 기본값으로 격상. schema-per-tenant는 Phase 3 옵션이 아니라 별도 architecture decision으로 migration feasibility를 정의.",
      "phase_0_schedule": "Week 1-2는 dev/staging vertical infra skeleton으로 축소. Week 3-6은 Core schema 전체가 아니라 M0 vertical slice schema + tenant scoping + audit/outbox/idempotency 기반을 목표로 재작성.",
      "provider_decision": "Resend/Sentry/Upstash는 MVP 기본값 가능. 단 DPA/PII/log retention/quota/fallback/adapter boundary를 acceptance 조건으로 추가.",
      "beta_plan": "legal-reviewer와 DPA 템플릿은 Phase 1 종료가 아니라 Phase 1 시작 gate. 베타 고객 미확정 시 internal beta fallback과 일정 slip buffer를 명시.",
      "common_patterns": "공통 패턴을 P0 foundation과 feature-specific advanced patterns로 분리. 1주 전체 구현 가정 제거."
    }
  }
}
