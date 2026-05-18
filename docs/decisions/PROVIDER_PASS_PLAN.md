# Day 8~10 PROVIDER_PASS 통합 plan (v0.1·2026-05-15)

본 문서는 Phase 0 Week 1 5 Spike (A·B·C·D·E)의 LOCAL_PASS 완료 후 진행하는 PROVIDER_PASS gate 통합 계획이다. **모든 spike의 LOCAL_PASS 검증이 통과되었으나, 실 cloud provider 환경에서의 동등성·차이를 검증해야 production 진입이 가능**.

## SoT

- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § A·B·C·E의 PROVIDER_PASS 항목
- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 — provider 선정 (Supabase Postgres·Cloudflare R2·Vercel·Resend·Sentry·Upstash)
- 각 Spike의 milestone (`memory/milestone_spike_{a,b,c,d,e}_local_pass.md`)

## Day별 매핑

| Day | Spike | Provider | 핵심 검증 |
|---|---|---|---|
| Day 8 | C (R2 storage) | Cloudflare R2 staging | IAM Condition·prefix isolation credential-level·content-type/length server-side·signed URL TTL·method confusion (S3 표준 status) |
| Day 9 | A (Multi-tenant RLS) | Supabase Pooler | withTenantTransaction·service_role audit·advisory lock·pgbouncer transaction mode 동등성·prepare:false·max 5 connection limit |
| Day 9 | B (Outbox worker) | Supabase Pooler | SKIP LOCKED·idempotent at-least-once·permanent_alert UNIQUE·invariant 1000 jobs·Pooler에서 advisory lock·SKIP LOCKED 동작 |
| Day 9 (선택) | D (Migration deploy) | Supabase staging DB | drizzle-kit + raw SQL·advisory lock·drift check·pending N-1 deploy·shadow reset DROP SCHEMA·forward-only hotfix |
| Day 10 | E (Auth.js + tenant) | Vercel preview + next-auth + Supabase | magic link callback round-trip·secure cookie·SameSite=Strict·CSRF·DrizzleAdapter 실 호출·session DB persistence·membership invalidation |

## 작업 산출물 (각 spike별)

1. `apps/spike-{x}/.env.provider.example` — provider URL·credential·secret template
2. `apps/spike-{x}/PROVIDER_RUNBOOK.md` — provider 환경 setup runbook
   - account 생성·project 생성·credential 발급
   - migration apply
   - smoke 실행 명령
   - acceptance checklist
3. `apps/spike-{x}/src/scenarios/provider-smoke.ts` — provider 환경에서 LOCAL_PASS 핵심 시나리오 압축 재실행
4. `apps/spike-{x}/src/provider/*.ts` (Spike E·C 필요 시) — 실 provider integration code (next-auth config·R2 SDK)

## 공통 acceptance gate

- LOCAL_PASS와의 동등성: 동일 시나리오에서 PASS·status code·error body가 provider 표준 (S3·next-auth·postgres-pooler) 정합
- LOCAL_PASS와의 차이: provider-specific 차이는 명시·SoT cascade
  - 예: minio→R2 (400 → 403 SignatureDoesNotMatch)
  - 예: docker pg → Supabase Pooler (transaction pool mode·prepare:false 강제)
  - 예: Auth.js DrizzleAdapter 호출 — schema shape는 LOCAL이 PASS·실 호출은 PROVIDER에서만
- credential·secret 누설 검증: audit log·환경 변수·deploy log에 secret 직접 노출 없음
- acceptance checklist 모든 항목 PASS

## Provider 환경별 setup 요약

### Cloudflare R2 (Day 8)
1. Cloudflare 계정 생성 + R2 활성화
2. bucket 생성 (`spike-c-staging`)
3. R2 API token 발급 (object read/write 권한)
4. IAM PolicyDocument 작성 (prefix `instances/{instanceId}/` 조건부) — Workers PolicyDocument 또는 R2 API token scope
5. 두 개 instance principal token 발급 (instance-a-key·instance-b-key)
6. AWS SDK endpoint = `https://<account-id>.r2.cloudflarestorage.com`·forcePathStyle false
7. smoke 실행

### Supabase (Day 9)
1. Supabase 프로젝트 생성 (free tier OK·region: ap-northeast-2 권장)
2. Project Settings → Database → Connection pooling URL (transaction mode·port 6543)
3. Project Settings → Database → Connection string (session mode·port 5432·migration용)
4. `app_tenant_user` role 생성 (psql 직접 또는 migration)
5. migration apply (Spike A·B의 migrations/*.sql)
6. smoke 실행

### Vercel + Auth.js (Day 10)
1. Vercel 계정 + GitHub 연동
2. spike-e Next.js skeleton repo 생성 (또는 본 monorepo 내 Next.js app)
3. Vercel project 생성·env 설정 (NEXTAUTH_URL·NEXTAUTH_SECRET·DATABASE_URL·RESEND_API_KEY)
4. Resend 계정 생성·domain 인증·API key 발급
5. preview deploy
6. magic link round-trip smoke (curl 시리즈 또는 Playwright)

## 진행 순서 (권장)

1. **Day 8 (Spike C·R2)** — 비교적 독립적·계정 1개로 검증 가능
2. **Day 9 (Spike A·B·D Supabase)** — 동일 Supabase project 재활용·migration·worker invariant 일괄
3. **Day 10 (Spike E·Vercel+Auth.js)** — Supabase project 재활용·Vercel preview·Resend·next-auth integration

## acceptance 후 cascade

- 모든 PROVIDER_PASS → Phase 0 Week 2 진입 (packages/{auth,storage,db,...} 추출)
- 부분 FAIL → SoT cascade (예: R2 → R2 Workers binding·next-auth → Lucia·Pooler → 별도 pgbouncer)
- INFRA v1.0 reversal 필요 시 별도 ADR

## reversal blast radius (이전 spike에서 명시)

- Spike C R2 FAIL → Supabase Storage reversal (INFRA3-03·3 feature blob storage 계약 재작성)
- Spike B Pooler 차이 큼 → outbox 별도 connection pool 분리
- Spike E Auth.js 호환 안 됨 → Lucia·Better-Auth reversal (INFRA §2 stack reversal)
