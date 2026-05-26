# MEANINGFUL_TRAFFIC_LOOP_PLAN (v1.0·acceptance·2026-05-26)

> **상태**: **v1.0 (acceptance)** — cycle 1 (20건) + cycle 2 (14건) + cycle 3 (12건) + cycle 4 (8건) + cycle 5 (7건) + cycle 6 (3건) + cycle 7 (0건 · 수렴) self-critique 전건 흡수. **누계 64건 · 7 cycle 수렴**. acceptance 근거: (a) plan 격상 메타 + scope 결정 (v1 = Conversion Tracking 1종 · 4 product MTL-DEFER) · (b) 데이터 모델 (C0042 + 2 policy + 3 index + C0026 답습 정확) · (c) PIPA 정합 (anonymized session_token + date-derived dailySalt + 가명정보 정합) · (d) Origin allowlist + dev fallback + CSRF 미적용 사유 · (e) 검증 시나리오 MTL-V01~V18 + vitest fixture 4종 + acceptance criteria § 13 7 조건 · (f) MTL-CASCADE 7건 patch 디테일. v1 acceptance scope 는 **Conversion Tracking 1종 으로 한정** — 5 product (Traffic Seed Kit · Local Topic Pack · Naver Distribution Checklist · Conversion Tracking · Content Improvement Queue 확장) 중 4종은 MTL-DEFER. 본 plan 의 큰 전략 (배경 · 원칙 · 5 실행 레버 · 측정 루프) 는 SoT 로 유지 — v1 코드는 그 안 1 step (측정 루프 2번 — 실 의도 측정) 만 구현.

> **cycle 1 흡수 (20건 · v0.2)**: 격상 메타 (헤더·SoT·Phase 6.5) · v1 scope 축소 · 자체 beacon · conversion_event 데이터 모델 · PIPA anonymized session_token · 4 product MTL-DEFER · 검증 시나리오 · task manifest · CASCADE 7건.

> **cycle 6 흡수 (3건)** + **cycle 7 (0건 — 수렴 acceptance)**:
> (a) **#62** § 번호 자리 정합 — § 11 (after-v1) + § 13 (acceptance) 그대로 유지 (markdown reader 안 anchor 깨짐 회피 · trivial cosmetic only) ·
> (b) **#63** C0042 down migration 패턴 명시 — § 3.2 신규 (drop policy → index → table 순서) ·
> (c) **#64** `docs/runbooks/SEARCH_CONSOLE_SETUP.md` 사전례 확인 — MEANINGFUL_TRAFFIC_OPERATIONS.md 동일 디렉토리 정합 OK.
> **cycle 7 수렴** — 본 cycle 안 plan 변경 0건 (markdown trivial 만). § 13.2 acceptance criteria #1 ("self-critique 수렴 cycle 1회 도달") 충족.

> **cycle 5 흡수 (7건)**:
> (a) **#55** Origin allowlist dev fallback — `NODE_ENV='development'` 안 `localhost:*` auto-allow (§ 4.2.0 보강) ·
> (b) **#56** referrer_host (CHECK ≤ 255) + ua_family (CHECK ≤ 64) 길이 제한 추가 ·
> (c) **#57** `loadVisibilitySummary({propertyId: undefined})` = 전체 합산 path (이미 v0.4 시그니처 안 명시 — 본 plan 안 재확인 OK) ·
> (d) **#58** search_visibility 비어 있을 때 카드 UX — 분모 null 라도 절대값 (전화 N건 등) 의미 있음. UI label "외부 검색 미연결 — 절대값 카운트만" ·
> (e) **#59** vitest server.test.ts 안 KST 자정 경계 시나리오 — `2026-05-26 23:59:59 KST` vs `2026-05-27 00:00:00 KST` 의 dailySalt 다름 검증 ·
> (f) **#60** v1.0 acceptance criteria 명시 — § 13 신규 ·
> (g) **#61** 본 plan = plan + code 같은 cycle 안 합류 (CONTENT_IMPROVEMENT_QUEUE 패턴 답습) — § 13.1 명시.

> **cycle 4 흡수 (8건)**:
> (a) **#47** Origin allowlist 실 구현 — `parseOriginAllowlist(env)` (PUBLIC_SITE_ORIGIN + `*.glitzy.kr` wildcard parsing) 명시 ·
> (b) **#48** SESSION_SALT_SECRET env 미설정 시 fail-fast — `/api/track` 첫 요청 시 throw + 500 (404/204 silent 미해당) ·
> (c) **#49** admin route 자체 navigation 발사 분리 — site CTA only mount 명시 (`/admin/*` 안 beacon 미사용) ·
> (d) **#50** admin operator 본인 발사 분리 v1 미적용 — MTL-DEFER-14 ·
> (e) **#51** dedupe (5초 동일 발사) v1 미적용 — MTL-DEFER-15 ·
> (f) **#52** runbook outline 명시 — 5 채널 안내 문구 · 5 Naver 체크리스트 · 5 인용 자산 · 개인정보처리방침 추가 권장 문구 4 part ·
> (g) **#53** ConversionTrafficCard grid index — VisibilityOverviewSection 6 카드 grid 안 위치 (3행 2열 grid 안 r4c1 또는 별 행) · v1 = grid 끝 신규 행 ·
> (h) **#54** sendBeacon Origin handling — simple request (text/plain) 안 자동 Origin set · CORS preflight X · § 4.2 정합 OK.

> **cycle 3 흡수 (12건)**:
> (a) **#35** `withPublicTenantTransaction` 실 위치 = `apps/web/src/lib/public-tenant.ts` (packages/db 가 아님) — import path 정정 + helper 시그니처 안 호출 패턴 단순화 ·
> (b) **#36** page_path 첫 segment slug regex 검증 (`^[a-z0-9][a-z0-9-]{2,63}$`) D0010 정합 ·
> (c) **#37** C0026 답습 정확 — policy 명명 (`conversion_event_tenant_policy`·`conversion_event_public_insert_policy`) + `FORCE ROW LEVEL SECURITY` + `NULLIF(current_setting(..., true), '')::uuid` safe-fetch + conversion_event = immutable 라 UPDATE/DELETE 권한 제외 ·
> (d) **#38** ConversionTrafficCard visibility — operator+ 4 role 모두 가시 명시 ·
> (e) **#39** formatKstDate = `Intl.DateTimeFormat("en-CA", {timeZone: "Asia/Seoul"})` 명세 ·
> (f) **#40** utm_source normalize (lowercase + trim) marker ·
> (g) **#41** referrer_host 자체사이트 제외 (`referrer_host == request_host → null`) ·
> (h) **#42** CSRF 미적용 사유 명시 (INSERT only · state-changing X · 데이터 오염뿐) ·
> (i) **#43** cross-origin POST 차단 — Origin header allowlist (instance host 매칭) + sendBeacon Origin handling 검증 ·
> (j) **#44** C0042 manifest 외 분류 — `pnpm migrate-late` 안 실행 명시 ·
> (k) **#45** conversion_event 크기 추정 — 1 instance · 일 1000 event ≈ 180 MB/year · partitioning 비범위 v2+ marker ·
> (l) **#46** prod migration 적용 절차 task #7 안 명시.

> **cycle 2 흡수 (14건)**:
> (a) **#21** `app_public_reader` INSERT 패턴은 C0026 (`consultation_request`) 사전례 답습 — Blocker 해소 ·
> (b) **#22·#23** admin tenant_isolation ALL 안 SELECT 자동 보장 · super-admin cross-instance 집계 MTL-DEFER-12 ·
> (c) **#24·#25** host → instance mapping 결정 변경 — `instance.publicHost` 컬럼 부재 확인 → `page_path` 첫 segment 의 instance.slug mapping 채택 (host header 무시 · staging/preview cross-domain 자유) ·
> (d) **#26** visitor_seed cookie 발급 — server 가 첫 발사 응답 안 `Set-Cookie` · 첫 event 의 session_token 는 server 안 신규 발급 visitor_seed 로 즉시 산출 ·
> (e) **#27** dailySalt date-derived — `dailySalt = sha256(SECRET || YYYY-MM-DD KST)`. env 매일 수동 변경 불요 ·
> (f) **#28** session_token index 안 운영자 session journey 회수 = 의도된 운영 정합 명시 ·
> (g) **#29·#30** search_property 0 instance 의 UI label = "외부 검색 미연결 — 절대값만" · 분모 = organic search clicks 의 의도 한정 명시 ·
> (h) **#31** cta_id whitelist v1 = 5 anchor hardcode (`hero-call`·`hero-booking`·`footer-call`·`treatment-detail-call`·`consult-form-default`) ·
> (i) **#32** `ua-parser-js` workspace dep 추가 회피 — 자체 mini parser (정규식 4줄) ·
> (j) **#33** TZ Asia/Seoul 안 7일 window — `loadConversionSummary` 시그니처 안 endDate (KST YYYY-MM-DD) 옵션 + `loadVisibilitySummary` 의 endDate 와 동일 windowing ·
> (k) **#34** rate limit in-memory Map 한계 (Vercel serverless cold start) 명시 + Upstash 합류 MTL-DEFER-13.

## SoT

- 사용자 의견 (2026-05-22 · NSA acceptance 직후 작성한 본 draft v0.1) — "측정-실행 루프 비대칭" 진단. NAVER_SEARCH_INGEST · SEARCH_VISIBILITY_INGEST 는 측정 루프, 본 plan 은 실 수요 발생 루프 (distribution / activation).
- `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 — Phase 6 권장 순서 안 캘린더 직전 단계로 본 plan 삽입.
- `docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md` v1.0 CIQ-DEFER-06 — Search Console 기반 큐 확장 marker. 본 plan 의 conversion data 가 향후 CIQ 신규 카테고리 input.
- `docs/decisions/NAVER_SEARCH_INGEST_PLAN.md` v1.0 — 네이버 측정은 traffic generation 아닌 feedback loop 임을 명시 (본 plan cascade NSI-1).
- `docs/features/notifications.md` Feature spec — NF-DEFER-02 (SMS/카카오 채널 adapter) 가 Traffic Seed Kit 의존성.
- PIPA (개인정보보호법) 제15조·22조·39조 — 본 plan 안 anonymized session_token 정책 (§ 5) 의 근거.
- 의료광고법 제56조제2항 — Traffic Seed Kit · 광고 시안 작성 시 compliance-assistant 검수 합류 (MTL-DEFER-05).
- 기존 packages 시그니처:
  - `apps/web/src/app/(site)/[instanceSlug]/layout.tsx` — 본 plan 의 client beacon mount 위치
  - `packages/core-content/src/schema.ts` — 본 plan 의 conversion_event 추가
  - `packages/core-content/migrations/C0026_consultation_request.sql` — `app_public_reader` INSERT + FORCE RLS + NULLIF safe-fetch 사전례 (본 plan policy 답습 · cycle 2 #21 · cycle 3 #37)
  - `apps/web/src/lib/public-tenant.ts` — `withPublicTenantTransaction(instanceSlug, fn(tx, ctx)) → T | null` helper (본 plan `/api/track` 안 사용 · cycle 3 #35)
  - `packages/db/migrations/D0010_instance.sql` — `instance.slug TEXT NOT NULL UNIQUE` + slug_regex CHECK (본 plan page_path 첫 segment 정합 · cycle 3 #36)
  - `apps/web/src/lib/admin/search-visibility.ts` — `loadVisibilitySummary` 의 `endDate = MAX(snapshot_date)` 패턴 (본 plan window 정합 · cycle 2 #33)
  - `apps/web/src/lib/seo-readiness/` — v2+ 안 conversion 기반 readiness check (예 `has-conversion-7d`) 추가 후보
  - `docs/runbooks/SEARCH_CONSOLE_SETUP.md` — runbook 사전례 (NSA Phase 5.1 산출물). 본 plan `MEANINGFUL_TRAFFIC_OPERATIONS.md` 가 동일 디렉토리 합류 (cycle 6 #64)

> **표기 규칙**: 사용자 표시 = "유입·전환 측정", 내부 키 = "conversion tracking" · "meaningful traffic loop".

## 1. 목적과 범위

### 1.1 목적

- "의미 있는 트래픽" 의 1차 시그널 (CTA 클릭 · 폼 시작/완료 · 전화 · 카카오 · 예약 클릭) 을 본 솔루션 안 자체 측정.
- v1 의 결정 (단순) — **외부 의존 X · GA X · 광고 attribution X · 6개 운영자 매뉴얼 4종 모두 MTL-DEFER**. multi-tenant RLS 정합 자체 beacon endpoint 만.
- 본 plan 의 큰 전략 (5 실행 레버 · 측정 루프 5 step) 은 § 2 안 유지 — 향후 cycle 의 점진 흡수 roadmap.

### 1.2 범위 (v1 — 포함)

| § | 항목 | 비고 |
|---|---|---|
| 3 | `conversion_event` table (C0042) | instance_id RLS + 5 event whitelist + utm jsonb + anonymized session_token + 2 policy (C0026 패턴 답습) |
| 4 | `/api/track` POST endpoint | page_path 첫 segment slug mapping · zod 검증 · rate limit |
| 5 | PIPA 정합 session_token 정책 | sha256(instance_id ‖ visitor_seed ‖ date-derived dailySalt) · IP/raw UA 미저장 · 180일 보관 후 raw 컬럼 NULL update |
| 6 | client lib `lib/site-tracking/beacon.ts` | `trackEvent(name, metadata)` mini lib + 5 site CTA 안 onClick mount + 5 cta_id whitelist hardcode |
| 7 | 대시보드 `ConversionTrafficCard` | 7일 5 event count + 외부 검색 click 분모 conversion rate · search_property 0 instance 안 "외부 검색 미연결" label |
| 8 | 검증 시나리오 MTL-V01~V12 | beacon · zod · RLS · PIPA hash · rate limit · 카드 표시 · UTM · sendBeacon unload · cross-instance 격리 · search_property 0 분모 · CTA whitelist · TZ window |
| 9 | 작업 manifest 7 task | C0042 · endpoint · beacon · 5 CTA mount · 카드 · vitest · runbook |
| 10 | MTL-CASCADE 7건 | cascade plan 별 patch 디테일 |

### 1.3 비범위 (defer · MTL-DEFER)

| 항목 | Defer | marker |
|---|---|---|
| Local Topic Pack 자동 생성 (long-tail 키워드 set · `topic_seed` table) | 별 plan — Phase 6 후 cycle | MTL-DEFER-02 |
| Traffic Seed Kit (5 채널 안내 문구 + 자동 발송) | NF-DEFER-02 (SMS/카카오 채널 adapter) 본 구현 후 별 cycle | MTL-DEFER-03 |
| Naver Distribution Checklist UI (`/admin/<slug>/distribution-checklist`) | 별 cycle · runbook 먼저 (`docs/runbooks/NAVER_DISTRIBUTION_CHECKLIST.md`) | MTL-DEFER-07 |
| Content Improvement Queue 확장 (`low-conversion-traffic` · `low-ctr` · `naver-only-weak` 카테고리) | 본 plan v2 — conversion 데이터 누적 후 readiness check + improvement-queue 합류 | MTL-DEFER-04 |
| 광고 click → conversion mapping (네이버 검색광고 · Meta · Instagram OAuth/API) | v1 이후 별 plan — UTM/gclid landing 만 v1 안 metadata 기록 | MTL-DEFER-01 |
| 광고 시안 / Seed Kit 문구 의료광고법 검수 합류 | compliance-assistant Phase Beta 본 구현 후 | MTL-DEFER-05 |
| analytics-reporting Feature 의 `queryNormalizedMetrics` 안 conversion_event 합류 | 본 Feature 본 구현 cycle 안 통합 — 본 plan v1 raw 만 | MTL-DEFER-06 |
| page_view event 자동 트래킹 | v1 미포함 (데이터 크기 폭증 회피). conversion rate 분모는 GSC/NSA clicks 로 대체 | MTL-DEFER-08 |
| consent banner / 쿠키 동의 UI | v1 은 anonymized session_token 정책으로 동의 게이트 회피. raw cookie 기록 시점 (v2+) 필요 | MTL-DEFER-09 |
| A/B test variant key | v2+ — variant 별 conversion rate 비교 | MTL-DEFER-10 |
| 운영자 매뉴얼 (5 채널 안내 문구 · 5 Naver 체크리스트 · 5 인용 자산) | `docs/runbooks/MEANINGFUL_TRAFFIC_OPERATIONS.md` 신규 — v1 안 코드 비범위지만 runbook 동시 작성 | MTL-DEFER-11 |
| super-admin cross-instance 집계 view (회사 차원 회수) | 별 cycle | MTL-DEFER-12 |
| 분산 rate limit (Upstash Redis) | Vercel multi-instance edge 안 strict 보장 | MTL-DEFER-13 |
| admin operator 본인 발사 분리 (preview cookie · ?glitzy_preview=1 등) | v2+ — operator self-noise 누적 제외 | MTL-DEFER-14 |
| dedupe (동일 session_token + event 5초 안 중복) — 더블 클릭 정리 | v2+ — count 정밀도 향상 | MTL-DEFER-15 |

## 2. 전략 SoT — 5 실행 레버 · 측정 루프

> 본 섹션은 v1 코드와 별개로 본 plan 의 전략 SoT. 후속 cycle 점진 흡수 roadmap.

### 2.1 핵심 가정

- 의미 있는 트래픽 = 실제 잠재 환자가 문제 해결 목적으로 방문 + CTA · 폼 · 전화 · 카카오 · 예약 안 행동
- 무의미한 트래픽 = 봇 · 구매 트래픽 · 검색 클릭 조작 · 링크 팜
- 검색엔진 밖 수요 → 검색·재방문·링크·브랜드 언급 으로 환류되는 구조

### 2.2 원칙

1. **검색 순위보다 상담/예약 의도 검증을 먼저** — 초반 목표 = "이 페이지가 랭킹되는가" 아닌 "이 주제가 실 문의로 이어지는가"
2. **웹사이트는 단독 채널 아닌 hub** — 네이버 블로그·플레이스·카카오 채널·문자·광고·오프라인 안내 → 공식 사이트 상세 페이지 유입
3. **트래픽은 콘텐츠 개선 큐로 환류** — 유입 있는데 전환 X · 노출 있는데 CTR 낮음 · 네이버 약함 → CIQ 안 큐잉
4. **조작 신호 제외** — fake traffic · bot click · paid link · 검색 클릭 조작 = 측정 데이터 + 검색 신뢰도 양쪽 오염

### 2.3 5 실행 레버 (전략 — 본 plan 안 단계적 흡수)

| # | 레버 | v1 코드 영향 | 점진 흡수 cycle |
|---|---|---|---|
| 1 | 기존 고객 접점 (상담 후 문자·카카오·진료 후 안내) | Conversion Tracking 으로 측정 가능 (5 event) | MTL-DEFER-03 (Seed Kit) |
| 2 | 네이버 생태계 진입로 (플레이스·블로그·서치어드바이저) | NSA Phase 5.1 안 일부 측정 (avg_position·CTR) | MTL-DEFER-07 (Checklist UI) |
| 3 | 문제 해결형 long-tail 페이지 | 기존 entity (Article·FAQ) 안 작성 가능 | MTL-DEFER-02 (Topic Pack) |
| 4 | 광고 = 데이터 수집용 (랭킹 조작 X) | UTM/gclid landing 기록 만 v1 안 | MTL-DEFER-01 (광고 ingestion) |
| 5 | 인용될 만한 자산 (체크리스트·가이드·비교표) | 기존 entity 안 작성 가능 | 별 plan |

### 2.4 측정 루프 5 step (v1 안 일부 구현)

1. **Traffic Seed Kit** 으로 초기 유입 생성 → MTL-DEFER-03
2. **Conversion Tracking** 으로 실 의도 측정 → **v1 acceptance scope**
3. **Search Visibility / NSA** 노출·클릭 측정 → Phase 5 + 5.1 완료
4. **Content Improvement Queue** 개선 작업 생성 → Phase 4 완료 (conversion 카테고리 = MTL-DEFER-04)
5. 개선된 페이지 네이버·카카오·문자·광고 재배포 → MTL-DEFER-03

## 3. `conversion_event` 데이터 모델 (C0042)

### 3.1 schema (C0026 답습 정확 · cycle 2 #21 · cycle 3 #37)

```sql
CREATE TABLE IF NOT EXISTS conversion_event (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id     UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  event_name      TEXT NOT NULL,
  page_path       TEXT NOT NULL,
  session_token   TEXT NOT NULL,
  utm             JSONB NOT NULL DEFAULT '{}'::jsonb,
  referrer_host   TEXT,  -- ≤255 (cycle 5 #56)
  ua_family       TEXT,  -- ≤64 (cycle 5 #56)
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversion_event_event_name_enum CHECK (event_name IN (
    'phone_click','kakao_click','booking_click',
    'consult_form_start','consult_form_complete'
  )),
  CONSTRAINT conversion_event_page_path_length CHECK (char_length(page_path) BETWEEN 2 AND 512),
  CONSTRAINT conversion_event_session_token_length CHECK (char_length(session_token) = 64),
  CONSTRAINT conversion_event_referrer_host_length CHECK (referrer_host IS NULL OR char_length(referrer_host) <= 255),
  CONSTRAINT conversion_event_ua_family_length CHECK (ua_family IS NULL OR char_length(ua_family) <= 64)
);

CREATE INDEX IF NOT EXISTS conversion_event_instance_event_ts_idx
  ON conversion_event (instance_id, event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS conversion_event_instance_path_ts_idx
  ON conversion_event (instance_id, page_path, created_at DESC);
-- session journey 회수 — 운영자 의도 정합 (cycle 2 #28)
CREATE INDEX IF NOT EXISTS conversion_event_session_ts_idx
  ON conversion_event (instance_id, session_token, created_at DESC);

ALTER TABLE conversion_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_event FORCE ROW LEVEL SECURITY;  -- cycle 3 #37

-- (a) admin tenant_isolation — C0026 답습 명명 + NULLIF safe-fetch
DROP POLICY IF EXISTS conversion_event_tenant_policy ON conversion_event;
CREATE POLICY conversion_event_tenant_policy ON conversion_event
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- (b) public INSERT — C0026 답습
DROP POLICY IF EXISTS conversion_event_public_insert_policy ON conversion_event;
CREATE POLICY conversion_event_public_insert_policy ON conversion_event
  FOR INSERT TO app_public_reader
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- conversion_event = immutable — app_tenant_user 안 SELECT 만 (UPDATE/DELETE 미부여 · cycle 3 #37).
-- 추후 raw 컬럼 NULL update (보관 정책 § 5.6) 가 필요해지면 별도 service-role helper 안 직접 SQL.
GRANT SELECT ON conversion_event TO app_tenant_user;
GRANT INSERT ON conversion_event TO app_public_reader;
```

**conversion_event = immutable** (cycle 3 #37) — UPDATE/DELETE 의도 X. 180일 raw 컬럼 NULL update (§ 5.6) 가 v2+ 합류 시 service-role bypass 안 처리.

### 3.2 down migration 패턴 (cycle 6 #63)

```sql
-- C0042_conversion_event.down.sql (선택 · v1 안 작성 권장)
DROP POLICY IF EXISTS conversion_event_public_insert_policy ON conversion_event;
DROP POLICY IF EXISTS conversion_event_tenant_policy ON conversion_event;
DROP INDEX IF EXISTS conversion_event_session_ts_idx;
DROP INDEX IF EXISTS conversion_event_instance_path_ts_idx;
DROP INDEX IF EXISTS conversion_event_instance_event_ts_idx;
DROP TABLE IF EXISTS conversion_event;
```

migrations-runner LL-DEFER-20 본 구현 cycle 안 정식 down migration 합류. v1 안 commit 안 함께 작성만 (실 실행은 운영자 수동).

### 3.2 컬럼 의미

| 컬럼 | 형식 | 의미 |
|---|---|---|
| `event_name` | CHECK whitelist 5종 | 운영자 표시 = "전화 클릭" 등. CTA 의 종류는 metadata.cta_id 안 |
| `page_path` | text ≤512 | host 제외 path (`/demo/treatments/diet-herbs` 등). 첫 segment = instance.slug (cycle 2 #24) · query string · fragment 제거 |
| `session_token` | sha256 64 hex | § 5 참조. visitor 식별자 IP/cookie 직접 저장 X |
| `utm` | jsonb | `{utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid}` whitelist — MTL-DEFER-01 미만 v1 안 기록만 |
| `referrer_host` | text · nullable | `https://naver.com/...` → `naver.com`. path 미저장 (PIPA) |
| `ua_family` | text · nullable | `Chrome/120` 형식 (raw UA 미저장 — § 5) |
| `metadata` | jsonb | event-specific. 예 `{cta_id: "hero-booking"}` · `{form_step: "phone-input"}` |

### 3.3 5 event + 5 cta_id whitelist (cycle 2 #31)

| event_name | 발사 위치 | 운영자 표시 |
|---|---|---|
| `phone_click` | 사이트 안 `<a href="tel:...">` onClick | 전화 클릭 |
| `kakao_click` | 사이트 안 카카오 채널/문의 link onClick | 카카오 클릭 |
| `booking_click` | 예약 외부 link / 예약 모달 open 버튼 onClick | 예약 클릭 |
| `consult_form_start` | 상담 폼 첫 input focus | 상담 폼 시작 |
| `consult_form_complete` | 상담 폼 submit success response | 상담 폼 완료 |

**cta_id whitelist (v1 hardcode · 5종)**:

```ts
export const CTA_ID_WHITELIST = [
  "hero-call",                // hero CTA 안 전화
  "hero-booking",              // hero CTA 안 예약
  "footer-call",               // footer 전화
  "treatment-detail-call",     // 시술 상세 안 전화
  "consult-form-default",      // 상담 폼 (단일)
] as const;
```

운영자 자유 추가는 v2+ (MTL-DEFER 미정의 — 추후).

## 4. `/api/track` POST endpoint

### 4.1 위치 + 시그니처

- 위치: `apps/web/src/app/api/track/route.ts`
- 메서드: POST · Content-Type: `application/json` 또는 `text/plain` (sendBeacon 정합)
- request body zod schema:

```ts
const trackRequestSchema = z.object({
  event_name: z.enum([
    "phone_click", "kakao_click", "booking_click",
    "consult_form_start", "consult_form_complete",
  ]),
  page_path: z.string().min(2).max(512).regex(/^\/[a-zA-Z0-9_\-/.]*$/),
  utm: z.object({
    utm_source: z.string().max(128).optional(),
    utm_medium: z.string().max(64).optional(),
    utm_campaign: z.string().max(128).optional(),
    utm_term: z.string().max(128).optional(),
    utm_content: z.string().max(128).optional(),
    gclid: z.string().max(256).optional(),
    fbclid: z.string().max(256).optional(),
  }).default({}),
  referrer: z.string().url().optional(),
  metadata: z.object({
    cta_id: z.enum(CTA_ID_WHITELIST).optional(),
    form_step: z.string().max(64).optional(),
  }).default({}),
});
```

### 4.2 흐름 — page_path 첫 segment slug mapping (cycle 2 #24 · cycle 3 #35·#36·#41·#43)

1. zod safeParse — 실패 시 204 silent drop. error log 만
2. `page_path` 의 첫 segment 추출 — `page_path.match(/^\/([a-z0-9][a-z0-9-]{2,63})(\/|$)/)?.[1]` — D0010 의 `instance_slug_regex` 동일 (cycle 3 #36). 매칭 실패 시 204 silent
3. Origin/Referer header 안 host 검증 (cycle 3 #43 · cycle 4 #47·#54) — `parseOriginAllowlist()` 안 instance host 매칭 검사. sendBeacon 은 simple request (text/plain) 안 자동 Origin set + CORS preflight X → 정상 동작. 매칭 실패 시 204 silent
4. visitor_seed cookie 회수 — 없으면 server 안 즉시 발급 (`crypto.randomBytes(16).toString("hex")`) + 응답 안 `Set-Cookie: glitzy_visitor=<seed>; HttpOnly; SameSite=Lax; Max-Age=2592000; Path=/`
5. raw User-Agent → mini parser → `ua_family` (정규식 4줄 · cycle 2 #32)
6. raw Referer → URL parse → host. `host == request_host` → null (자체사이트 navigation · cycle 3 #41). invalid URL → null
7. rate limit 체크 (§ 4.4) — 통과 시 진행 · 차단 시 204 silent
8. `withPublicTenantTransaction(slug, async (tx, ctx) => {...})` (cycle 3 #35) — helper 안 instance lookup + SET LOCAL 자동. ctx.instanceId 도출 + `session_token = deriveSessionToken({ instanceId: ctx.instanceId, visitorSeed, date: new Date() })` (§ 5) + INSERT
9. helper return null (instance inactive/미존재) → 204 silent
10. 응답 204 (No Content)

### 4.2.0 Origin allowlist 실 구현 (cycle 4 #47)

```ts
// apps/web/src/lib/site-tracking/server.ts
export function parseOriginAllowlist(): { hosts: string[]; wildcards: string[] } {
  const raw = process.env.PUBLIC_SITE_ORIGIN || "";  // 예 "https://glitzy.kr"
  const extra = process.env.TRACK_ORIGIN_ALLOWLIST || "";  // 예 "*.glitzy.kr,localhost:3000"
  const all = [raw, ...extra.split(",")].map((s) => s.trim()).filter(Boolean);
  const hosts: string[] = [];
  const wildcards: string[] = [];
  for (const entry of all) {
    // URL 또는 host 형식
    const host = entry.startsWith("http") ? new URL(entry).host : entry;
    if (host.startsWith("*.")) wildcards.push(host.slice(2));  // ".glitzy.kr"
    else hosts.push(host);
  }
  return { hosts, wildcards };
}

export function isOriginAllowed(originHost: string, allowlist: ReturnType<typeof parseOriginAllowlist>): boolean {
  if (allowlist.hosts.includes(originHost)) return true;
  return allowlist.wildcards.some((suffix) => originHost.endsWith(`.${suffix}`) || originHost === suffix);
}
```

dev 안 `localhost:3000` · prod 안 `glitzy.kr` + `*.glitzy.kr` (서브도메인 instance) + 커스텀 도메인 (env 안 추가).

**dev fallback (cycle 5 #55)** — `process.env.NODE_ENV === "development"` 안 `PUBLIC_SITE_ORIGIN` 미설정 시 자동으로 `localhost:*` allowlist. prod 안 fallback X (env 미설정 시 모두 차단 → 명시적 secret setup 강제).

### 4.2.1 fail-fast — SESSION_SALT_SECRET 검증 (cycle 4 #48)

- `/api/track` route module-level 안 `if (!process.env.SESSION_SALT_SECRET) throw new Error("SESSION_SALT_SECRET required")` — 첫 요청 시 500 (silent 204 X)
- 본 fail-fast 는 prod 안 secret 누락 incident 회피 + dev 안 명시적 setup 강제

### 4.2.2 CSRF 미적용 사유 (cycle 3 #42)

- 본 endpoint = INSERT only · state-changing X (트래픽 누적뿐 · 운영자 가시 데이터에 직접 영향 X)
- attacker 가 victim browser 안 본 endpoint 발사 시점 = victim 의 cookie 로 가짜 conversion 누적 = 데이터 오염 (보안 침해 X)
- utm spoofing risk = 무시 가능 수준 (광고 attribution 은 MTL-DEFER-01)
- 따라서 CSRF token 미적용. 단 Origin allowlist (§ 4.2 step 3) 안 cross-origin 차단

### 4.3 host header 미사용 사유

- staging/preview 안 Vercel `<branch>.vercel.app` host 변동 + 다중 도메인 (`glitzy.kr` · `<slug>.glitzy.kr` · 커스텀) 대응이 복잡
- `instance.publicHost` 컬럼 부재 (cycle 2 #24 grep 결과 — 본 plan 안 추가 회피)
- page_path 의 첫 segment 가 이미 instance routing 의 권원 (`apps/web/src/app/(site)/[instanceSlug]/`) — 동일 권원 활용

### 4.4 rate limit (cycle 2 #34)

- in-memory `Map<string, number[]>` 안 `(instance_id, session_token)` 키 → 최근 60s timestamp 배열
- 60s 안 회수 ≥ 30 회 시 silent drop (204)
- **한계 명시**: Vercel serverless 안 hot 함수 cold start 시 Map 초기화 — strict cross-instance 보장 X. v1 안 효과 = 동일 process 안 단기 spike 방지 (전체 bot 차단 X)
- 강력한 분산 rate limit (Upstash Redis · `@upstash/ratelimit`) 합류는 MTL-DEFER-13

### 4.5 audit

- 본 endpoint 는 audit_event 미기록 (트래픽 양 클 수 있음 · audit 부담)
- 대신 conversion_event 자체가 1:1 audit
- super-admin 안 raw 조회 권한 — admin tenant_isolation 안 자동 (cycle 2 #22). cross-instance 집계는 MTL-DEFER-12

## 5. PIPA 정합 session_token 정책 (cycle 1 #11 · cycle 2 #26~#28)

### 5.1 anonymized 산출

```ts
// apps/web/src/lib/site-tracking/server.ts
export function formatKstDate(date: Date): string {
  // cycle 3 #39 — "en-CA" + Asia/Seoul → "2026-05-26" 형식 안정
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export function deriveSessionToken(input: {
  instanceId: string;
  visitorSeed: string;   // server 발급 16 bytes hex (§ 4.2 step 4)
  date: Date;            // event 발사 시점
}): string {
  const kstYmd = formatKstDate(input.date);  // "2026-05-26"
  const dailySalt = crypto
    .createHash("sha256")
    .update(`${process.env.SESSION_SALT_SECRET}|${kstYmd}`)
    .digest("hex");
  return crypto
    .createHash("sha256")
    .update(`${input.instanceId}|${input.visitorSeed}|${dailySalt}`)
    .digest("hex");
}

export function normalizeUtmSource(raw: string | undefined): string | undefined {
  // cycle 3 #40 — 'naver_search' · 'Naver Search' · 'NAVER-SEARCH' 통일
  if (!raw) return undefined;
  return raw.trim().toLowerCase().replace(/[_\s]+/g, "-");
}
```

### 5.2 visitor_seed cookie 발급 흐름 (cycle 2 #26)

1. 첫 event 도착 — 요청 안 `glitzy_visitor` cookie 없음
2. server 안 `crypto.randomBytes(16).toString("hex")` → 32 hex visitor_seed 즉시 발급
3. 같은 요청 안 session_token 산출 + INSERT
4. 응답 안 `Set-Cookie` (HttpOnly · SameSite=Lax · Max-Age=30d · Path=/)
5. 후속 event 는 cookie 회수 → 동일 visitor_seed → 동일 dailySalt 조합 안 동일 session_token

### 5.3 dailySalt date-derived 운영 (cycle 2 #27)

- `SESSION_SALT_SECRET` env (24 bytes hex 권장) — 1회 set + 무기한 보관
- dailySalt = `sha256(SECRET || KST YYYY-MM-DD)` — 매 자정 (KST) 자동 rotation 효과
- cross-day 추적 불가 — daily salt 변경 시 같은 visitor_seed 도 다른 session_token
- env 수동 변경 불요 · `cron` 불요

### 5.4 PIPA 정합 원칙

- IP · raw cookie 값 (visitor_seed 자체) · raw User-Agent 미저장
- visitor_seed = client cookie 만 (DB 저장 X)
- 가명정보 정합 (PIPA 제2조제1호) — 본인 확인 불가능 + cross-day 추적 불가
- `ua_family` = family/major 만 (`Chrome/120` · `Safari/17` · `Mobile Safari/17`) — fingerprinting risk 회피
- `referrer_host` 는 path/query 제외 — `naver.com` · `google.com` · `m.search.naver.com`

### 5.5 session_token index 정합 (cycle 2 #28)

- `conversion_event_session_ts_idx (instance_id, session_token, created_at DESC)` 는 운영자 안 동일 visitor 의 5 event 발사 순서 회수 (예 "이 사용자는 검색 click → 전화 클릭 → 상담 폼 시작 안 이동") 가능
- PIPA 정합 안 의도된 운영 trace — visitor 본인 확인 불가 (sha256 + dailySalt rotation) 라 가명정보 분석 정합
- 운영자 UI 안 session journey view 표시는 v2+ (현재 분석은 server 안 ad-hoc SQL)

### 5.6 보관 정책

- raw 컬럼 (referrer_host · ua_family · utm · metadata 안 식별 가능 값) 은 **180일 이후 NULL update** — 별 cycle 안 cron 또는 `pg_partman` (MTL-DEFER 미정의)
- session_token · event_name · page_path · created_at · instance_id 는 무기한 보관 (집계 통계 용도)

### 5.7 개인정보처리방침 cascade

- `legal_document` 안 `privacy-policy` template 안 본 plan 트래킹 항목 (전화 클릭·예약 클릭 등 행위 데이터 수집) 명시. anonymized session_token 정책 명시. → MTL-CASCADE-04
- v1 안 본 항목 자동 추가 X (운영자 수동). 자동 통합은 v2+

## 6. client lib `lib/site-tracking/beacon.ts`

### 6.1 시그니처

```ts
// apps/web/src/lib/site-tracking/beacon.ts
"use client";

export type TrackableEvent =
  | "phone_click" | "kakao_click" | "booking_click"
  | "consult_form_start" | "consult_form_complete";

export type TrackableCtaId =
  | "hero-call" | "hero-booking" | "footer-call"
  | "treatment-detail-call" | "consult-form-default";

export function trackEvent(
  name: TrackableEvent,
  metadata: { cta_id?: TrackableCtaId; form_step?: string } = {},
): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    event_name: name,
    page_path: window.location.pathname,
    utm: readUtmFromUrl(),
    referrer: document.referrer || undefined,
    metadata,
  });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "text/plain" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true });
    }
  } catch {
    // silent — 트래킹 실패가 사용자 경험 영향 X
  }
}
```

### 6.1.1 admin route 분리 (cycle 4 #49)

- beacon mount 위치 = `apps/web/src/app/(site)/[instanceSlug]/...` 의 site CTA 만
- `apps/web/src/app/(admin)/admin/...` 안 어떤 onClick 도 beacon 미사용
- 따라서 운영자 자체 admin 안 navigation 발사 X — conversion_event 안 admin operator self-noise 없음
- 단 admin operator 가 (admin 외) 공개 사이트 안 직접 방문 시 → 일반 사용자처럼 발사. v2+ preview cookie/?glitzy_preview=1 안 분리 (MTL-DEFER-14)

### 6.2 5 site CTA mount

| CTA | 위치 | event | cta_id |
|---|---|---|---|
| `tel:` link | hero | `phone_click` | `hero-call` |
| 예약 link | hero | `booking_click` | `hero-booking` |
| `tel:` link | footer | `phone_click` | `footer-call` |
| `tel:` link | treatment detail | `phone_click` | `treatment-detail-call` |
| 카카오 channel link | site footer | `kakao_click` | — (metadata 없음) |
| 상담 폼 첫 input focus | consult form | `consult_form_start` | `consult-form-default` |
| 상담 폼 submit success | consult form action result | `consult_form_complete` | `consult-form-default` |

### 6.3 utm 첫 방문 cookie

- `readUtmFromUrl()` 안 `window.location.search` parse → `utm_*` · `gclid` · `fbclid` extract
- 첫 발사 시 cookie `glitzy_utm` 안 30일 저장
- subsequent 발사 시 cookie 값 우선 사용 — landing utm 보존

### 6.4 ua mini parser (cycle 2 #32)

```ts
// apps/web/src/lib/site-tracking/server.ts
export function parseUserAgentFamily(ua: string | null | undefined): string | null {
  if (!ua) return null;
  // Mobile Safari/<major>  ·  Chrome/<major>  ·  Safari/<major>  ·  Firefox/<major>  ·  Edg/<major>
  const m =
    ua.match(/(Mobile Safari|Chrome|Edg|Firefox|Safari)\/(\d+)/);
  return m ? `${m[1]}/${m[2]}` : null;
}
```

`ua-parser-js` workspace dep 미추가.

## 7. 대시보드 `ConversionTrafficCard` (SEO_VISIBILITY 안 합류)

### 7.0 권한 visibility + grid 위치 (cycle 3 #38 · cycle 4 #53)

- ConversionTrafficCard 의 가시 권한 = operator · legal-reviewer · physician-reviewer · client-approver · super-admin (대시보드 6 카드 기본 가시 동일). 별도 RBAC 미적용.
- grid 위치 = `VisibilityOverviewSection` 안 기존 6 카드 (AverageReadinessCard · KeywordCoverageCard · UnlinkedEvidenceCard · StaleContentCard · LowReadinessPublishedCard · JsonLdDefectCard) 다음 7번째. v1 = 3행 2열 grid 안 4행 추가 또는 grid-cols 안 7번째 자리.

### 7.1 위치 + 표시 (cycle 2 #29·#30·#33)

- `apps/web/src/components/admin/visibility/VisibilityOverviewSection.tsx` 안 신규 7번째 카드 (또는 그리드 정렬 재배치)

```
"유입·전환 (지난 7일)"
─────────────────────────
전화 클릭    : N
카카오 클릭  : N
예약 클릭    : N
상담 시작    : N
상담 완료    : N
─────────────────────────
[search_property ≥ 1]
전환률 = (전체 전환 / 외부 검색 click 합산) × 100%
  · 분모 = GSC clicks + NSA clicks (metadata.positionUnavailable skip)
  · 분자 0 OR 분모 0 → "—"
  · 분모 정의 = organic search 한정 (의도된 한정 · MTL-DEFER-08 page_view 합류 후 직접 트래픽 포함)

[search_property == 0]
"외부 검색 미연결 — 절대값만 표시"
[Search Console 연결] link → /visibility-metrics
```

### 7.2 helper 시그니처 (cycle 2 #33)

```ts
// apps/web/src/lib/admin/conversion-summary.ts
export async function loadConversionSummary(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { endDate?: string; days?: number } = {},  // endDate 미지정 시 KST 오늘
): Promise<{
  byEvent: Record<TrackableEvent, number>;
  totalConversions: number;
  searchClicks: number | null;   // search_property 0 시 null
  conversionRate: number | null;
  windowStart: string;            // "2026-05-20"
  windowEnd: string;              // "2026-05-26"
}>;
```

- options.endDate (KST YYYY-MM-DD) 미지정 시 → `loadVisibilitySummary` 의 `endDate = MAX(snapshot_date)` 값 그대로 사용 (window 정합)
- 분모 산출 — `loadVisibilitySummary({propertyId: undefined, days, endDate})` 의 totalClicks 그대로 (이미 positionUnavailable skip 됨)
- 분모 산출 결과 search_property 0 인 instance 안 `null`
- conversionRate = (searchClicks > 0 ? totalConversions / searchClicks * 100 : null)

### 7.3 SQL

```sql
SELECT
  event_name,
  COUNT(*)::int AS cnt
FROM conversion_event
WHERE instance_id = ${instanceId}::uuid
  AND created_at >= ${windowStart}::date AT TIME ZONE 'Asia/Seoul'
  AND created_at <  (${windowEnd}::date + INTERVAL '1 day') AT TIME ZONE 'Asia/Seoul'
GROUP BY event_name
```

## 8. 검증 시나리오 (v1 — 12건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| MTL-V01 | 사이트 안 `tel:` link click | `/api/track` POST 발사 (Network 탭 안 204) · `conversion_event` 1 row INSERT (event_name=phone_click · cta_id=hero-call 등) |
| MTL-V02 | RLS 격리 | 다른 instance 의 page_path (`/clinic-b/...`) POST → instance B 의 instance_id INSERT. tenant_isolation 안 cross-instance SELECT 차단 |
| MTL-V03 | zod 검증 실패 | event_name 미정의 값 (`bogus`) POST → 204 silent · DB 0 row · 서버 log error 만 |
| MTL-V04 | session_token PIPA | 동일 visitor (cookie 동일) · 동일 day → session_token 동일. 다른 day → 다른 token (date-derived dailySalt). raw IP / cookie value DB 안 부재 |
| MTL-V05 | rate limit | 동일 (instance_id, session_token) 60s 안 31 발사 → 마지막 1 발사 silent drop (DB 30 row 까지만 INSERT) |
| MTL-V06 | 카드 표시 (search_property ≥ 1) | `/admin/demo` 안 ConversionTrafficCard — 7일 5 event count + 전환률. 데이터 0 시 모두 "0" · 전환률 "—" |
| MTL-V07 | UTM 보존 | 첫 방문 `?utm_source=naver&utm_campaign=foo` → cookie 저장. 사이트 내부 navigation 후 발사 시 utm 값 보존 (DB row 안 utm jsonb 안 포함) |
| MTL-V08 | sendBeacon unload | 사용자 페이지 이탈 (window unload) 시점 발사 → DB 안 1 row 정상 기록 (sendBeacon path) |
| MTL-V09 | page_path 첫 segment slug mapping (cycle 2 #24) | `page_path = "/demo/treatments/foo"` → `slug='demo'` → instance_id 도출 정상. `page_path = "/nonexistent/..."` → 204 silent |
| MTL-V10 | search_property 0 instance 분모 (cycle 2 #29) | search_property 0 인 instance 안 ConversionTrafficCard — 전환률 영역 미표시 + "외부 검색 미연결" message + `/visibility-metrics` link |
| MTL-V11 | cta_id whitelist 검증 (cycle 2 #31) | metadata.cta_id 안 whitelist 외 값 (`bogus-cta`) → zod 실패 → 204 silent |
| MTL-V12 | TZ KST 7일 window (cycle 2 #33) | `loadConversionSummary` 의 endDate 가 `loadVisibilitySummary` 의 `MAX(snapshot_date)` 와 동일. window 안 7 KST 일 (KST 자정 기준 inclusive) |
| MTL-V13 | page_path slug regex 검증 (cycle 3 #36) | `page_path = "/demo/treatments/foo"` → slug="demo" OK. `page_path = "/_admin/..."` 또는 `page_path = "/123/..."` → regex 실패 → 204 silent |
| MTL-V14 | Origin allowlist 차단 (cycle 3 #43) | Origin header 안 `attacker.com` → 204 silent. Origin 안 `PUBLIC_SITE_ORIGIN` 또는 `*.glitzy.kr` → 정상 |
| MTL-V15 | referrer 자체사이트 제외 (cycle 3 #41) | referrer host = request host → `referrer_host=null`. 외부 (naver.com) → `naver.com` 저장 |
| MTL-V16 | UPDATE/DELETE 차단 (cycle 3 #37) | admin 안 `UPDATE conversion_event` 시도 → permission denied (GRANT SELECT 만) |
| MTL-V17 | utm_source normalize (cycle 3 #40) | `?utm_source=Naver+Search` → DB `utm.utm_source = "naver-search"` |
| MTL-V18 | CSRF endpoint 비차단 / Origin 차단 (cycle 3 #42·#43) | 동일 출처 fetch (Origin 정합) → 204 정상. cross-origin attacker fetch → 204 silent (Origin 검증 안 차단) |

vitest fixture (v1):
- `apps/web/src/lib/site-tracking/__tests__/beacon.test.ts` — readUtmFromUrl · trackEvent (sendBeacon mock)
- `apps/web/src/app/api/track/__tests__/route.test.ts` — zod 검증 · page_path 첫 segment slug mapping · session_token 산출 · 5 event whitelist · 5 cta_id whitelist · referrer host parse · rate limit
- `apps/web/src/lib/admin/__tests__/conversion-summary.test.ts` — 5 event count · 전환률 산출 · 분모 null 처리 · TZ KST window
- `apps/web/src/lib/site-tracking/__tests__/server.test.ts` — deriveSessionToken (visitor_seed/dailySalt 조합 검증) · parseUserAgentFamily (5 family) · formatKstDate · **KST 자정 경계** (cycle 5 #59 — `2026-05-26 23:59:59 KST` 와 `2026-05-27 00:00:00 KST` 의 dailySalt 다른지 검증) · normalizeUtmSource · parseOriginAllowlist · isOriginAllowed

## 9. 작업 manifest (v1 — 7 task)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | C0042 migration — `conversion_event` table + 2 policy (C0026 답습) + 3 index + schema.ts conversionEvent. manifest 외 entries 안 추가 | `packages/core-content/migrations/C0042_conversion_event.sql` + `schema.ts` | — |
| 2 | `/api/track` POST endpoint — zod + page_path 첫 segment slug mapping + session_token derive + rate limit + INSERT | `apps/web/src/app/api/track/route.ts` + `apps/web/src/lib/site-tracking/server.ts` (deriveSessionToken·parseReferrerHost·parseUserAgentFamily·formatKstDate) | 1 |
| 3 | client lib + 5 CTA mount + utm cookie | `apps/web/src/lib/site-tracking/beacon.ts` + site layout/CTA 안 onClick handler 6곳 (hero-call·hero-booking·footer-call·treatment-detail-call·kakao·consult-form) | 2 |
| 4 | `loadConversionSummary` helper + `ConversionTrafficCard` mount + search_property 0 분기 | `lib/admin/conversion-summary.ts` + `components/admin/visibility/ConversionTrafficCard.tsx` + `VisibilityOverviewSection.tsx` 안 7번째 카드 | 1·2 |
| 5 | vitest fixture 4종 (MTL-V01~V12 안 unit 부) | beacon.test.ts · route.test.ts · conversion-summary.test.ts · server.test.ts | 2·3·4 |
| 6 | `docs/runbooks/MEANINGFUL_TRAFFIC_OPERATIONS.md` 신규 — outline 4 part (cycle 4 #52): (a) 5 채널 안내 문구 (문자·카카오·블로그·플레이스·상담 후) (b) 5 Naver 체크리스트 (서치어드바이저·플레이스·블로그·robots·색인) (c) 5 인용 자산 (체크리스트·비교표·관리표·부작용·FAQ) (d) 개인정보처리방침 추가 권장 문구 (anonymized session_token · 180일 raw NULL · IP/raw UA 미저장) | runbook 1 파일 | — |
| 7 | typecheck + vitest 전체 + 시각 검수 MTL-V01~V18 + prod migration 적용 + commit | manifest 외 → `pnpm --filter @glitzy/web migrate-late` (cycle 3 #44·#46) | 1·2·3·4·5·6 |

**추정**: 2~3일.

### 9.1 conversion_event 용량 추정 (cycle 3 #45)

- 1 instance · 일 1000 event (보수적) · row size ≈ 500 bytes (utm/metadata jsonb 평균)
- 일 = 500 KB · 월 = 15 MB · 년 = 180 MB / instance
- 10 instance 시 1.8 GB / year — Supabase free tier (500 MB) 안 1 instance 한정 운영 권장 · paid tier 안 무문제
- v1 안 partitioning 미적용 — index DESC 안 충분. monthly partition (pg_partman) 합류 = v2+ (MTL-DEFER 미정의 — 추후)

## 10. MTL-CASCADE markers (cycle 1 #20)

| marker | 대상 | patch 디테일 |
|---|---|---|
| MTL-CASCADE-01 | `docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md` | CIQ-DEFER-06 의 "Search Console 기반 큐" → conversion_event 도 큐 input 확장 (v2+). 본 plan v2 안 신규 카테고리 (`low-conversion-traffic` · `low-ctr` · `naver-only-weak`) seed 정합 |
| MTL-CASCADE-02 | `docs/decisions/SEARCH_VISIBILITY_INGEST_PLAN.md` | "검색 노출 metric 과 conversion event 연결 marker" — `loadVisibilitySummary` + `loadConversionSummary` 가 같은 endDate window 안 합산되어 ConversionTrafficCard 안 전환률 계산. NSI source filter tab (v1.x) 안 conversion source dimension 합류 |
| MTL-CASCADE-03 | `docs/decisions/NAVER_SEARCH_INGEST_PLAN.md` | "네이버 측정은 traffic generation 아닌 feedback loop" 본 plan 명시 marker. NSA clicks → 본 plan conversion rate 분모 |
| MTL-CASCADE-04 | `legal_document` 안 `privacy-policy` 안 트래킹 항목 (자동 생성 X · v1 운영자 수동 추가) | 본 plan 안 anonymized session_token · 180일 raw 컬럼 NULL update · IP/raw UA 미저장 명시 권장 문구 runbook 안 |
| MTL-CASCADE-05 | `docs/decisions/SEO_KEYWORD_STRATEGY_PLAN.md` | KWS-DEFER 안 "광고/상담/네이버 유입 기반 keyword backlog" — conversion_event.utm 의 utm_term · `cta_id` 기반 후보 추출 marker (v2+) |
| MTL-CASCADE-06 | `docs/features/analytics-reporting.md` | trafficSource · eventName dimension 안 본 plan 의 5 event_name 합류 marker (Feature 본 구현 cycle) |
| MTL-CASCADE-07 | `CLAUDE.md` 안 "현재 milestone" 행 | Phase 6.5 — MEANINGFUL_TRAFFIC_LOOP v1.0 acceptance 시 추가 |

## 13. v1.0 acceptance criteria (cycle 5 #60·#61)

본 plan 의 v1.0 도달은 아래 모두 충족 시점.

### 13.1 plan + code 같은 cycle 합류 (cycle 5 #61)

- CONTENT_IMPROVEMENT_QUEUE_PLAN v1.0 패턴 답습 — plan acceptance 와 code acceptance 같은 cycle 안 진행
- 다른 plan (LOCATION_LEGAL · PUBLIC_SITE_RENDER · ADMIN_UX_REDESIGN · EAT_CONTENT) 처럼 plan + code 분리 cycle 가 아님
- 본 plan 의 작업 manifest § 9 의 7 task 모두 완료 + 본 self-critique 5+ cycle 수렴 시 v1.0 격상

### 13.2 acceptance 충족 조건

1. **self-critique 수렴**: 본 cycle 안 plan 변경 X (또는 trivial markdown fix 만) 인 cycle 1회 도달 — 본 plan 안 cycle 6 또는 cycle 7 안 자동 도달 예상
2. **코드 작업 § 9 7 task 완료**:
   - C0042 migration prod 적용 (manifest 외 — `pnpm migrate-late`)
   - `/api/track` endpoint 동작 (MTL-V01 발사 → DB row INSERT 시각 검수)
   - client beacon mount 5 + 1 위치 (cycle 4 #49 안 site only)
   - `ConversionTrafficCard` 대시보드 마운트 + 7번째 grid 자리
   - vitest fixture 4종 PASS (총 추정 12~18 케이스)
   - `docs/runbooks/MEANINGFUL_TRAFFIC_OPERATIONS.md` outline 4 part 작성
3. **검증 시나리오**: MTL-V01~V18 시각 검수 — 사용자 환경 안 dev 또는 prod
4. **typecheck**: `cd apps/web && pnpm exec tsc --noEmit` exit 0 (production code · pre-existing __tests__/ 제외)
5. **vitest 전체 PASS**: `pnpm --filter @glitzy/web test:scenarios` (기존 147 + 신규 vitest fixture 4종 = 추정 12~18 신규 케이스)
6. **prod migration 적용**: C0042 (manifest 외) — Supabase prod 안 적용 완료. ON CONFLICT 없는 conversion_event 0 row 시점.
7. **시각 검수 commit**: 사용자가 prod ConversionTrafficCard 실제 표시 확인 후 acceptance commit.

### 13.3 v1.0 milestone marker

acceptance 시 — `memory/milestone_meaningful_traffic_loop_v1.md` 작성 + `CLAUDE.md` 안 "현재 milestone" 한 줄 + 변경 이력 추가 (MTL-CASCADE-07).

## 11. v1 acceptance 후 잔존 (v2+ 또는 별 plan)

- **v2 (Conversion v2)**: page_view event 자동 트래킹 (MTL-DEFER-08) · A/B variant key (MTL-DEFER-10) · improvement-queue 신규 카테고리 3종 (MTL-DEFER-04) · CIQ-CASCADE-MTL 흡수
- **v3 (Traffic Seed Kit)**: NF-DEFER-02 본 구현 후 — 5 채널 안내 문구 자동 발송 (MTL-DEFER-03)
- **v4 (Local Topic Pack)**: `topic_seed` table + 키워드 set 자동 생성 (MTL-DEFER-02)
- **v5 (Naver Distribution Checklist UI)**: `/admin/<slug>/distribution-checklist` (MTL-DEFER-07)
- **별 plan (광고 ingestion)**: 네이버 검색광고 · Meta Marketing API OAuth + UTM attribution (MTL-DEFER-01)
- **compliance-assistant Phase Beta 합류 후**: Seed Kit 문구 의료광고법 자동 검수 (MTL-DEFER-05)
- **analytics-reporting Feature 본 구현 cycle**: conversion_event 의 queryNormalizedMetrics 합류 (MTL-DEFER-06)
- **consent banner**: raw cookie 기록 시점 (v2+ 또는 광고 ingestion 합류 시점 · MTL-DEFER-09)
- **super-admin cross-instance 집계 view**: 회사 차원 회수 (MTL-DEFER-12)
- **분산 rate limit**: Upstash Redis (MTL-DEFER-13)

## 12. 변경 이력

- **2026-05-22**: v0.1 draft 작성 (사용자 NSA acceptance 직후 측정-실행 루프 비대칭 진단 메모).
- **2026-05-26**: v0.2 draft — cycle 1 self-critique (20건) 전건 흡수:
  - **#1~#3** 격상 메타 · **#4~#5** v1 scope = Conversion Tracking 1종 · **#6·#15** 광고 ingestion MTL-DEFER-01 · **#7** 자체 beacon · **#8** conversion_event table · **#9·#10·#16·#17** 4 product MTL-DEFER · **#11** PIPA anonymized session_token · **#12** 의료광고법 MTL-DEFER-05 · **#13** NF-DEFER-02 의존 · **#14** analytics-reporting MTL-DEFER-06 · **#18·#19** 검증 시나리오 + manifest · **#20** Cascade 7건.
- **2026-05-26**: **v1.0 acceptance code cycle 진입 시 발견 추가 patch** — `C0040_medical_condition_page.sql` + `C0041_publication_type.sql` 이미 prod 적용 확인 → 본 plan 의 마이그레이션 번호 **C0040 → C0042** 전체 replace. CASCADE-08 신설.

- **2026-05-26**: **v1.0 acceptance** — cycle 6 (3건) + cycle 7 (0건 수렴) 흡수:
  - **#62** § 번호 자리 — markdown anchor 호환 유지 (cosmetic only)
  - **#63** C0042 down migration 패턴 § 3.2 신규
  - **#64** docs/runbooks/ 사전례 (SEARCH_CONSOLE_SETUP.md) 마커 추가
  - **cycle 7 수렴** — 추가 critique 0건. § 13.2 acceptance criteria #1 충족 → v1.0 격상.

- **2026-05-26**: v0.6 draft — cycle 5 self-critique (7건) 전건 흡수 (수렴기):
  - **#55** Origin allowlist dev fallback — `NODE_ENV='development'` 안 `localhost:*` auto-allow
  - **#56** referrer_host CHECK ≤ 255 + ua_family CHECK ≤ 64
  - **#57** `loadVisibilitySummary({propertyId: undefined})` 전체 합산 path 명시 (v0.4 시그니처 안 이미 정합 — 재확인 OK)
  - **#58** search_visibility 0 + conversion_event > 0 시 카드 UX — 절대값 카운트만 의미
  - **#59** vitest server.test.ts 안 KST 자정 경계 시나리오 추가
  - **#60** v1.0 acceptance criteria 명시 — § 13 신규 7 조건
  - **#61** plan + code 같은 cycle 합류 (CONTENT_IMPROVEMENT_QUEUE 패턴 답습) — § 13.1 명시

- **2026-05-26**: v0.5 draft — cycle 4 self-critique (8건) 전건 흡수:
  - **#47** Origin allowlist 실 구현 — `parseOriginAllowlist()` + `isOriginAllowed()` (§ 4.2.0)
  - **#48** SESSION_SALT_SECRET 미설정 시 module-level fail-fast (§ 4.2.1)
  - **#49** admin route 자체 navigation 발사 분리 — site CTA only mount 명시 (§ 6.1.1)
  - **#50** admin operator preview 분리 MTL-DEFER-14
  - **#51** dedupe MTL-DEFER-15
  - **#52** runbook outline 4 part (task #6)
  - **#53** ConversionTrafficCard grid 위치 — VisibilityOverviewSection 7번째 (§ 7.0)
  - **#54** sendBeacon Origin handling 명시 — simple request · 자동 Origin set · CORS preflight X

- **2026-05-26**: v0.4 draft — cycle 3 self-critique (12건) 전건 흡수:
  - **#35** `withPublicTenantTransaction` 실 위치 = `apps/web/src/lib/public-tenant.ts` (packages/db 가 아님). § 4.2 흐름 안 helper 호출 패턴으로 단순화
  - **#36** page_path 첫 segment slug regex 검증 (`^[a-z0-9][a-z0-9-]{2,63}$`) D0010 정합
  - **#37** C0026 답습 정확 — policy 명명 (`conversion_event_tenant_policy`·`conversion_event_public_insert_policy`) + `FORCE ROW LEVEL SECURITY` + `NULLIF(current_setting(..., true), '')::uuid` safe-fetch + UPDATE/DELETE 권한 제외 (immutable)
  - **#38** ConversionTrafficCard visibility — operator+ 4 role 모두 가시 명시 (§ 7.0 신규)
  - **#39** formatKstDate = `Intl.DateTimeFormat("en-CA", {timeZone: "Asia/Seoul"})` 명세 (§ 5.1)
  - **#40** normalizeUtmSource helper — lowercase + trim + `[_\s]+` → `-` 통일 (§ 5.1)
  - **#41** referrer_host 자체사이트 제외 (`host == request_host → null`) (§ 4.2 step 6)
  - **#42** CSRF 미적용 사유 명시 (§ 4.2.1)
  - **#43** Origin allowlist 검증 (§ 4.2 step 3) + sendBeacon Origin handling
  - **#44** C0042 manifest 외 분류 — `migrate-late` (§ 9 task #7)
  - **#45** conversion_event 용량 추정 — 1 instance · 180 MB/year · partitioning v2+ (§ 9.1 신규)
  - **#46** prod migration 적용 절차 task #7 안 명시

- **2026-05-26**: v0.3 draft — cycle 2 self-critique (14건) 전건 흡수:
  - **#21** `app_public_reader` INSERT 패턴 = C0026 답습 (사전례 확인 — Blocker 해소)
  - **#22** admin tenant_isolation ALL 안 SELECT 자동 보장 · **#23** super-admin cross-instance 집계 MTL-DEFER-12
  - **#24·#25** host header 미사용 + page_path 첫 segment slug mapping 채택 (instance.publicHost 컬럼 부재 확인)
  - **#26** visitor_seed cookie 발급 흐름 명시 — server 안 즉시 발급 + 응답 안 Set-Cookie
  - **#27** dailySalt date-derived (`sha256(SECRET || KST YYYY-MM-DD)`) — env 매일 수동 변경 불요
  - **#28** session_token index 운영자 trace 의도 정합 명시
  - **#29·#30** search_property 0 instance UI label "외부 검색 미연결" · 분모 organic 한정 의도 명시
  - **#31** cta_id whitelist v1 = 5 anchor hardcode (`hero-call` 등)
  - **#32** ua-parser-js 워크스페이스 dep 회피 — 자체 mini parser 정규식 4줄
  - **#33** TZ Asia/Seoul + endDate 옵션 `loadVisibilitySummary` 와 정합
  - **#34** rate limit in-memory Map 한계 명시 + Upstash MTL-DEFER-13
