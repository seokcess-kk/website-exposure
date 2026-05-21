# SEARCH_VISIBILITY_INGEST_PLAN (v1.0·accepted·2026-05-21)

> **상태**: **v1.0 accepted** — Phase 5 v1 본 구현 완료 (2026-05-21). 8 task (C0035~C0037 + drizzle · env · GSC client · helper · sync actions · /visibility-metrics 페이지 · NavMenu/errors · typecheck) 모두 통과. dev 시각 검수 — super-admin 진입 → property form 노출 확인. vitest fixture (§ 10) 는 별 cycle 합류 시 (SVI-DEFER-FIXTURE).

> **v0.3 draft 시점 마커**: cycle 1 (12건) + cycle 2 (10건) 전건 수용. 핵심 cycle 2 보강: (a) sync_state UPSERT lock 획득 (§ 4.4) · (b) 실패 시 try/finally unlock 보장 (§ 4.7 신규) · (c) v1 source whitelist (§ 4.2) — google-search-console 만 · (d) 첫 sync 90일 vs 일반 7일 분리 (§ 4.4) · (e) malformed row 처리 정책 통일 (§ 10) · (f) helper v1 작성 → v1.2 defer (§ 11 task 4 제거) · (g) property_url normalization (§ 2.1) · (h) avg_position CHECK 상한 1000 · (i) sc-domain test case.

> **본 plan 의 위상**: 외부 검색 노출 데이터 ingestion 시작. v1 = schema + GSC client + manual sync + 새 어드민 페이지 한 곳 ("/visibility-metrics") 만. 대시보드 카드 / keyword metric / entity edit mini card 는 v1.1·v1.2 (separate cycle). 작은 단위 출시 + 점진 확장 전략.

> **cycle 1 critique 12건 흡수 marker**:
> (a) Service Account key 보안 원칙 (§ 5.3) — server-only import · 일부 로그 · prod/preview env 분리 · Workload Identity 검토 marker ·
> (b) property verify 2단계 — GSC 접근 + instance domain 매칭 (§ 4.3 + § 3.3) ·
> (c) raw row 보존 정책 — 최근 90일 default · backfill 180일 제한 · 오래된 row cleanup 정책 marker (§ 2.2 신규 절) ·
> (d) ctr NUMERIC(6,5) 저장 OK 확인 + 반올림 정책 명시 (§ 2.2) ·
> (e) avg_position impression-weighted average 공식 명시 (§ 6.1 신규 절) ·
> (f) page_url ↔ entity 매핑 정책 (§ 6.2 신규) — canonical path · trailing slash · query string · sc-domain ·
> (g) query ↔ keyword.label 매칭 정책 명시 (§ 6.3 신규) — exact match 우선 · normalized contains 보조 ·
> (h) sync 동시 실행 락 — running 상태 · lock_token · stale 자동 해제 (§ 2.3 + § 4.4) ·
> (i) partial 상태 정의 + 부분 복구 — metadata 안 success/fail dates (§ 4.5 신규) ·
> (j) 권한 분리 — property CRUD = super-admin · sync = operator · 조회 = operator (§ 4.6) ·
> (k) **v1 scope 축소** — `/visibility-metrics` 만 v1 acceptance · dashboard card·keyword metric·entity mini card 는 v1.1·v1.2 (§ 1.2·1.3) ·
> (l) fixture/mock 테스트 전략 — pagination · 429 · malformed · no rows (§ 10).

## SoT

- 사용자 의견 (2026-05-21) 항목 6 — "Search Console / Bing / 인덱싱 연동". 본 plan 의 의도 SoT.
- `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 — SVO-DEFER-05
- `docs/decisions/SEO_KEYWORD_STRATEGY_PLAN.md` v1.0 KWS-DEFER-01·05 — 본 plan 데이터 의존
- `docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md` v1.0 CIQ-DEFER-06 — 본 plan 합류 시
- 기존 packages 시그니처:
  - `apps/web/src/lib/site-meta-fetch.ts` — SSRF guard + timeout 패턴 (GSC 안 hostname fixed 라 SSRF 위험 없으나 timeout/error 처리 답습)
  - `apps/web/src/lib/db.ts` · `tenant.ts` — `withSkeletonTx`
  - `apps/web/src/lib/env.ts` — env zod 검증
  - 기존 entity actions — server action / errors.ts 매핑

> **표기 규칙**: DB column = snake_case · TS = camelCase. GSC 표기 = "Search Console", 사용자 표시 = "검색 노출".

## 1. 목적과 범위

### 1.1 목적

- 운영자에게 "실제 검색 노출" 답 — 추측 → 데이터.
- 페이지·키워드별 시계열 보존 (Phase 6 의존).
- keyword 매핑의 실효성 검증 — registered keyword 가 실제 노출되는지.
- 후속 cycle (Phase 6 캘린더 · CIQ-DEFER-06 신규 카테고리 · KWS-DEFER-01 difficulty 자동) 의 데이터 토대.

### 1.2 범위 (포함 — v1 acceptance)

| 항목 | 비고 |
|---|---|
| **§ 2 DB schema (3 migration)** | search_property · search_visibility_snapshot · search_sync_state. 보존 정책 marker (cycle 1 #3) · sync lock 컬럼 (cycle 1 #8) |
| **§ 3 GSC API client** | `lib/integrations/google-search-console.ts` — Service Account JWT + searchanalytics.query + pagination + 429 retry · zod 응답 검증 |
| **§ 4 sync server action + 권한 분리** | property CRUD = super-admin · sync = operator (cycle 1 #10) · running lock (cycle 1 #8) · partial 복구 metadata (cycle 1 #9) |
| **§ 5 env + Service Account 보안 원칙** | server-only import · 일부 로그 · sensitive 마킹 · prod/preview 분리 · runbook (cycle 1 #1) |
| **§ 6 매핑/집계 정책** | weighted avg position (cycle 1 #5) · page_url canonical normalization (cycle 1 #6) · query exact + normalized contains (cycle 1 #7) |
| **§ 7 새 어드민 페이지 `/visibility-metrics`** | 헤더 + property 목록 + 7일 요약 + 페이지별 표 + 키워드별 표 + sparkline (외부 라이브러리 없음) |
| **§ 8 errors.ts + NavMenu** | 새 constraint 매핑 + "검색 노출" 메뉴 |
| **§ 9 검증 시나리오 8건** | env disabled · property verify 2단계 · sync · pagination · 429 · partial · cross-tenant · typecheck |
| **§ 10 fixture/mock 테스트** (cycle 1 #12) | mock response parser · pagination · 429 retry · malformed · no rows · unit test |
| **§ 11 작업 manifest** | 약 8 task (v1 scope 축소 — cycle 1 #11) |

### 1.3 비범위 (defer — v1 후속 cycle)

| 항목 | Defer to | marker |
|---|---|---|
| **대시보드 카드 "지난 7일 검색 노출 요약"** | v1.1 (별 cycle) — visibility-overview.ts 안 새 query + Section 새 카드 | SVI-DEFER-V1-1 |
| **keyword 편집 페이지 안 metric 섹션** | v1.2 (별 cycle) — keyword.label ↔ query 매칭 (§ 6.3 정책 활용) | SVI-DEFER-V1-2 |
| **entity 편집 페이지 안 metric mini card** | v1.2 (별 cycle) — page_url ↔ entity 매핑 (§ 6.2 정책 활용) | SVI-DEFER-V1-3 |
| 네이버 서치어드바이저 (Naver) API 통합 | 별 cycle (SVI-CASCADE-01 합류 시) | SVI-DEFER-01 |
| Bing Webmaster Tools API | 별 cycle | SVI-DEFER-02 |
| Vercel Cron 자동 일별 sync | v1.3 — manual 안정성 검증 후 | SVI-DEFER-03 |
| keyword difficulty 자동 산정 (impressions 기반) | KWS-DEFER-01 합류 | SVI-DEFER-04 |
| 캐니발리제이션 감지 (같은 query 에 여러 page) | CIQ-DEFER-04 합류 | SVI-DEFER-05 |
| GSC URL Inspection API (색인 상태) | M1 Phase Beta | SVI-DEFER-06 |
| Sitemap 자동 제출 / robots.txt 검증 | M1 Phase Beta | SVI-DEFER-07 |
| 시계열 차트 라이브러리 (recharts 등) | M1 Phase Alpha — v1 안 단순 svg sparkline | SVI-DEFER-08 |
| anomaly detection 알림 (노출 급감 등) | Phase 6 + notifications-outbox 합류 | SVI-DEFER-09 |
| 운영자별 GSC view 분리 (multi-user) | M2+ | SVI-DEFER-10 |
| 월별 aggregate (raw row 압축) | 보존 정책 v1.1 합류 시 (cycle 1 #3) | SVI-DEFER-11 |
| **장기적 Workload Identity / OAuth 계정 연결** | M2+ (Service Account JSON 의 운영 부담 누적 시) — cycle 1 #1 권장 | SVI-DEFER-12 |
| **queryAliases (keyword 안 normalized variants 저장)** | v1.2 합류 — 정확 일치/normalized contains 의 한계 시 | SVI-DEFER-13 |

## 2. 데이터 모델 (3 migration · C0035~C0037)

### 2.1 `search_property` (C0035)

```sql
CREATE TABLE search_property (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  property_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT search_property_source_check CHECK (source IN ('google-search-console', 'naver-searchadvisor', 'bing-webmaster')),
  CONSTRAINT search_property_verification_check CHECK (verification_status IN ('pending', 'verified', 'failed')),
  CONSTRAINT search_property_url_format CHECK (property_url ~ '^(https?://|sc-domain:)'),
  CONSTRAINT search_property_instance_source_url_unique UNIQUE (instance_id, source, property_url)
);
CREATE INDEX search_property_instance_idx ON search_property (instance_id);
-- RLS tenant_isolation 정합 (다른 schema 동일 패턴) — 생략 표시
```

#### 2.1.1 property_url normalization (cycle 2 #9)

INSERT 전 normalization — UNIQUE 정합:
- URL-prefix: trailing slash 통일 (있으면 그대로 · 없으면 추가). scheme/host lowercase. `www.` 제거 정책 (instance domain 매칭 시).
- sc-domain: prefix `sc-domain:` 다음 host lowercase.
- 예시 매핑:
  - `https://Example.COM` → `https://example.com/`
  - `https://www.example.com/` → `https://example.com/` (단 GSC property 안 www 가 별도 property 인 경우는 보존 — § 4.2 안 source 별 정책)
  - `sc-domain:Example.COM` → `sc-domain:example.com`

helper `normalizeSearchPropertyUrl(url, source)` — `lib/integrations/google-search-console.ts` 안에 inline 위치 (v1 안 사용 — DEFER 안 됨).

### 2.2 `search_visibility_snapshot` (C0036) + 보존 정책 (cycle 1 #3)

```sql
CREATE TABLE search_visibility_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  source TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  page_url TEXT NOT NULL,
  query TEXT NOT NULL,
  impressions INTEGER NOT NULL,
  clicks INTEGER NOT NULL,
  ctr NUMERIC(6, 5) NOT NULL,  -- 1.00000 저장 가능 (cycle 1 #4 확인)
  avg_position NUMERIC(6, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT svs_impressions_nonneg CHECK (impressions >= 0),
  CONSTRAINT svs_clicks_nonneg CHECK (clicks >= 0),
  CONSTRAINT svs_clicks_le_impressions CHECK (clicks <= impressions),
  CONSTRAINT svs_ctr_range CHECK (ctr >= 0 AND ctr <= 1),
  CONSTRAINT svs_position_range CHECK (avg_position > 0 AND avg_position <= 1000),  -- cycle 2 #7
  CONSTRAINT svs_property_fk FOREIGN KEY (instance_id, property_id)
    REFERENCES search_property (instance_id, id) ON DELETE CASCADE,
  CONSTRAINT svs_unique_dimensions UNIQUE (instance_id, property_id, snapshot_date, page_url, query)
);
CREATE INDEX svs_instance_date_idx ON search_visibility_snapshot (instance_id, snapshot_date DESC);
CREATE INDEX svs_page_idx ON search_visibility_snapshot (instance_id, page_url, snapshot_date DESC);
CREATE INDEX svs_query_idx ON search_visibility_snapshot (instance_id, query, snapshot_date DESC);
```

#### 2.2.1 보존 정책 (cycle 1 #3)

- **기본 sync**: 최근 90일 — GSC 의 default backlog 2~3일 고려 (`today - 92 ~ today - 2`).
- **manual backfill 최대 180일** — UI 안 단일 sync 호출 시 180일 한도. 초과 입력은 거부.
- **오래된 row cleanup**: v1 안 자동 cleanup *미도입* — `WHERE snapshot_date < CURRENT_DATE - INTERVAL '180 days'` 안 데이터는 그대로 유지. v1.1 안 cron job `cleanupStaleVisibilitySnapshots(retentionDays)` 도입 marker (SVI-DEFER-11).
- **월별 aggregate**: 별 entity (`search_visibility_monthly_aggregate`) — SVI-DEFER-11 합류 시. raw row 압축 효과 큼.

#### 2.2.2 반올림 정책 (cycle 1 #4)

GSC API 의 ctr · position 은 float — 저장 전 반올림:
- `ctr` → `Math.round(value * 100000) / 100000` (5 자리 — NUMERIC(6,5) 매칭)
- `avg_position` → `Math.round(value * 100) / 100` (2 자리)

저장 후 1.00000 / 9999.99 같은 edge value 도 CHECK 통과.

### 2.3 `search_sync_state` (C0037) + sync lock (cycle 1 #8)

```sql
CREATE TABLE search_sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  last_sync_at TIMESTAMPTZ,
  last_synced_date DATE,
  last_status TEXT NOT NULL DEFAULT 'never-synced',
  last_error TEXT,
  -- cycle 1 #8: 동시 실행 락
  sync_started_at TIMESTAMPTZ,            -- last_status='running' 시 set · 완료 시 NULL reset
  lock_token TEXT,                        -- random per-attempt token · stale lock cleanup 용
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- cycle 1 #9: partial 안 success/fail date 목록
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sss_status_check CHECK (last_status IN ('never-synced', 'running', 'success', 'partial', 'failed')),
  CONSTRAINT sss_running_requires_lock CHECK (
    last_status <> 'running' OR (sync_started_at IS NOT NULL AND lock_token IS NOT NULL)
  ),
  CONSTRAINT sss_property_fk FOREIGN KEY (instance_id, property_id)
    REFERENCES search_property (instance_id, id) ON DELETE CASCADE,
  CONSTRAINT sss_property_unique UNIQUE (instance_id, property_id)
);
```

**stale lock 자동 해제** — `sync_started_at < NOW() - INTERVAL '30 minutes'` 인 running 상태는 다음 sync 시도 시 강제 해제 (server action 안 검사 + reset → running 으로 새 lock_token).

## 3. GSC API client

`apps/web/src/lib/integrations/google-search-console.ts` 신규.

### 3.1 인증 — Service Account JWT

`google-auth-library` 가벼운 의존성. 또는 직접 JWT (`node:crypto`) — 의존성 회피.

JWT 생성 → Google OAuth 2.0 `oauth2.googleapis.com/token` 안 access token 교환. token 1시간 캐시 (in-memory · 모듈 scope).

### 3.2 `queryAnalytics({ siteUrl, startDate, endDate, startRow })`

POST `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`. dimensions = `["date", "page", "query"]`. rowLimit = 25000.

zod 응답 검증:
```ts
const gscRowSchema = z.object({
  keys: z.tuple([z.string(), z.string(), z.string()]),
  clicks: z.number().nonnegative(),
  impressions: z.number().nonnegative(),
  ctr: z.number().min(0).max(1),
  position: z.number().positive(),
});
const gscResponseSchema = z.object({ rows: z.array(gscRowSchema).optional() });
```

### 3.3 property verify 2단계 (cycle 1 #2)

#### 단계 1 — GSC 접근 검증
- `sites.list` 호출 — 403/404 시 "Service Account 가 property 안 권한 없음"
- 또는 `searchanalytics.query` dry-run (1행 fetch) — 정상 응답 시 접근 OK

#### 단계 2 — instance domain 매칭
- instance 의 공개 URL 산정 — `siteBaseUrl(instanceSlug)` 또는 `clinic.metadata.canonicalHost`
- property_url 과 host 비교 — `sc-domain:example.com` 은 `example.com` host 매칭 · URL-prefix property 는 origin (https://example.com/) 매칭
- 불일치 시 `verification_status='failed'` + 친화 메시지

운영자가 다른 instance 의 GSC property 잘못 연결 회피.

### 3.4 SSRF / timeout / retry

- GSC host 는 fixed (`www.googleapis.com` · `oauth2.googleapis.com`) — SSRF 위험 없음
- timeout 30s + abort signal
- 429 → exponential backoff (1s · 2s · 4s · 3 retries) → 그래도 fail 시 `partial` 상태로
- 401 → access token 만료 (재발급 1회 · 그래도 fail 시 `failed`)
- 403 → permission 부족 (재발급 의미 없음 → `failed`)
- 500/503 → transient retry

### 3.5 pagination

`startRow` 0부터 25000씩 — `rows.length < 25000` 이면 종료. 일주일 데이터가 50000 row 초과 시 일별 분할 (date range 를 day 단위로 쪼개 호출).

## 4. sync server action + 권한 분리 (cycle 1 #10)

`/admin/<slug>/visibility-metrics/sync-actions.ts` 신규.

### 4.1 권한 매트릭스 (cycle 1 #10)

| 액션 | 권한 |
|---|---|
| property 추가/삭제/verify | super-admin 만 |
| manual sync | operator 가능 |
| metrics 조회 | operator 가능 |

`assertActionEligibility` 또는 별도 `assertSuperAdmin` helper. v1 안 simple: super-admin 권한 = `ctx.isSuperAdmin === true`.

### 4.2 `addSearchProperty(instanceSlug, propertyUrl, source)` — super-admin

**v1 source whitelist** (cycle 2 #3·#4): `source !== 'google-search-console'` 입력은 server action 안 reject — DB CHECK 가 enum 안 naver/bing 허용해도 v1 안 GSC 만 동작.

```ts
if (source !== "google-search-console") {
  return { ok: false, formError: "v1 안 Google Search Console 만 지원 — 네이버/Bing 은 별 cycle 합류 시" };
}
```

1. `requirePageContext` + super-admin 검증
2. v1 source whitelist (위)
3. property url normalization (§ 2.1.1) + 형식 검증 (`https://` 또는 `sc-domain:`)
4. instance domain 매칭 (§ 3.3 단계 2) — source 별 정책: `google-search-console` 안 URL-prefix 와 sc-domain 둘 다 가능. www 제거 후 host 비교 (단 www-only property 도 가능하므로 운영자 명시 확인 후 OK)
5. verification_status='pending' INSERT
6. audit_event

### 4.3 `verifySearchProperty(instanceSlug, propertyId)` — super-admin

1. requirePageContext + super-admin
2. GSC sites.list 호출 (§ 3.3 단계 1)
3. instance domain 재매칭 (단계 2)
4. UPDATE `verification_status` ('verified' / 'failed' + metadata 안 error)

### 4.4 `syncSearchVisibility(instanceSlug, propertyId, dateRange, mode)` — operator (cycle 1 #8 + cycle 2 #1)

`mode`: `"initial"` | `"recent"` | `"custom"` (default `"recent"`).

**date range 분리 (cycle 2 #8)**:
- `"initial"` (첫 sync) → 최근 **90일** (`today - 92 ~ today - 2`). UI 안 "초기 동기화" 버튼.
- `"recent"` (일반 quick sync) → 최근 **7일** (`today - 9 ~ today - 2`). UI default + "지금 sync" 버튼.
- `"custom"` → 운영자 입력 dateRange — 최대 180일 한도 (§ 2.2.1).

**lock 획득 — UPSERT (cycle 2 #1)** — `search_sync_state` row 가 없을 수도 있어 INSERT ON CONFLICT 패턴:

```sql
INSERT INTO search_sync_state (instance_id, property_id, last_status, sync_started_at, lock_token, updated_at)
VALUES (${ctx.instanceId}::uuid, ${propertyId}::uuid, 'running', NOW(), ${lockToken}, NOW())
ON CONFLICT (instance_id, property_id) DO UPDATE
   SET last_status = 'running',
       sync_started_at = NOW(),
       lock_token = ${lockToken},
       updated_at = NOW()
 WHERE search_sync_state.last_status <> 'running'
    OR search_sync_state.sync_started_at < NOW() - INTERVAL '30 minutes'
RETURNING lock_token
```

row 미반환 시 → 다른 sync 진행 중 (또는 stale lock 30분 안). formError "sync 가 이미 진행 중입니다 — 잠시 후 다시 시도".

순서:
1. requirePageContext + operator 가능
2. **lock 획득** (위 UPSERT) — 실패 시 즉시 formError
3. **try/catch/finally 구조 (cycle 2 #2)** — 모든 path 안 unlock 보장:
   ```ts
   const lockToken = crypto.randomUUID();
   const acquired = await acquireLock(tx, ..., lockToken);
   if (!acquired) return { ok: false, formError: "sync 가 이미 진행 중..." };
   try {
     // (a) property verified 확인 — 아니면 throw (catch 안 잡힘)
     // (b) GSC client → queryAnalytics (pagination loop)
     // (c) snapshot UPSERT (ON CONFLICT DO UPDATE)
     // (d) success 상태로 unlock — last_status='success' or 'partial'
     await releaseLock(tx, ..., lockToken, { status: 'success' | 'partial', metadata });
     return { ok: true, ... };
   } catch (err) {
     // (e) 실패 시 강제 unlock — last_status='failed' + last_error
     await releaseLock(tx, ..., lockToken, { status: 'failed', errorMessage: String(err) });
     throw err;  // 또는 friendly formError 반환
   }
   ```
4. audit_event (success/failure 모두)
5. revalidatePath: `/admin/<slug>/visibility-metrics`

### 4.4.1 `releaseLock` helper

```ts
async function releaseLock(tx, instanceId, propertyId, lockToken, { status, errorMessage, metadata }) {
  // lock_token 일치 시에만 unlock — 다른 attempt 가 stale lock cleanup 한 후 새 lock 잡았을 경우 보호
  await tx`
    UPDATE search_sync_state
       SET last_status = ${status},
           last_sync_at = NOW(),
           sync_started_at = NULL,
           lock_token = NULL,
           last_error = ${errorMessage ?? null},
           metadata = ${tx.json(metadata ?? {})}::jsonb,
           updated_at = NOW()
     WHERE instance_id = ${instanceId}::uuid
       AND property_id = ${propertyId}::uuid
       AND lock_token = ${lockToken}
  `;
}
```

### 4.5 partial 상태 정의 (cycle 1 #9)

`last_status='partial'` 케이스:
- 날짜 범위 중 일부 날짜만 성공 (다른 날짜는 429 후 retry 실패)
- pagination 중 일부 startRow 가 zod 검증 실패 (malformed row · 매우 드뭄)

`metadata` jsonb 안 저장:
```json
{
  "syncedDates": ["2026-05-14", "2026-05-15", ...],
  "failedDates": ["2026-05-16"],
  "failedReason": "rate-limit-exceeded",
  "rowsIngested": 3245,
  "paginationCalls": 2
}
```

부분 복구 — 다음 sync 시 failedDates 만 재시도 (운영자가 동일 dateRange 로 다시 클릭하면 ON CONFLICT 로 successfulDates 는 중복 INSERT 안 되고 failedDates 만 새로 시도).

### 4.6 cross-tenant 검증

`property_id` 가 같은 instance 안 row 인지 검증 — `addSearchProperty` 호출 시 server action 안 instance_id 매칭. EVIDENCE_LINKING 의 verifySameTenant 패턴 답습.

## 5. env + Service Account 보안 원칙 (cycle 1 #1)

### 5.1 env 변수

```bash
# .env.example 추가
GSC_ENABLED=false
# Service Account JSON — sensitive · production env 안 paste · preview env 분리
GSC_SERVICE_ACCOUNT_JSON=
```

### 5.2 env.ts zod 검증

```ts
GSC_ENABLED: z.enum(["true", "false"]).default("false"),
GSC_SERVICE_ACCOUNT_JSON: z.string().optional()
  .refine((v) => v === undefined || v === "" || v.startsWith("{"),
    "Service Account JSON must start with '{'"),
```

GSC_ENABLED=true 인데 JSON 부재 시 — env validation fail (Phase 5 활성 안 됨).

### 5.3 보안 원칙 (cycle 1 #1)

- **server-only import**: `lib/integrations/google-search-console.ts` 의 모든 import 가 server (no client bundle). Next.js 의 `"use server"` 또는 server-only module path.
- **로그 정책**: env validation 안 JSON 의 일부 (예: `client_email` 만) 로그. 원문 logger 입력 금지. JWT 의 private_key 절대 로그 X.
- **prod/preview env 분리**: Vercel env 안 production scope 에만 GSC_SERVICE_ACCOUNT_JSON · preview 는 미설정 (preview deploy 안 GSC 비활성).
- **sensitive 마킹**: Vercel env 안 GSC_SERVICE_ACCOUNT_JSON 을 "Sensitive" 토글 활성 → CLI pull 안 가려짐.
- **장기적**: Workload Identity / OAuth 계정 연결 검토 (SVI-DEFER-12) — Service Account JSON 의 운영 부담 누적 시 cycle.

### 5.4 runbook (`docs/runbook/search-console-setup.md` 신규)

1. Google Cloud Console 안 project 생성 + Search Console API 활성화
2. Service Account 생성 + JSON key 다운로드 (1회만 · 보관 안전)
3. Search Console property 안 service account email (예: gsc-sync@<project>.iam.gserviceaccount.com) 을 "user" (read-only) 로 추가
4. Vercel project Settings → Environment Variables 안 `GSC_SERVICE_ACCOUNT_JSON` paste + Sensitive 토글 ON · scope=Production · Preview 분리
5. `GSC_ENABLED=true` (Production scope) → redeploy
6. admin 안 `/visibility-metrics` 진입 → super-admin 권한으로 property 추가 → "verify" → 첫 sync

## 6. 매핑/집계 정책 (cycle 1 #5·6·7)

### 6.1 weighted avg position 집계 (cycle 1 #5)

여러 row 합칠 때 (페이지별 요약 · 키워드별 요약 · 7일 합계 등):

```ts
function aggregate(rows: VisibilitySnapshot[]): { impressions: number; clicks: number; ctr: number; avgPosition: number } {
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const avgPosition = impressions > 0
    ? rows.reduce((s, r) => s + r.avgPosition * r.impressions, 0) / impressions
    : 0;
  return { impressions, clicks, ctr, avgPosition };
}
```

**중요**: 단순 평균 (rows.length 나눔) 사용 금지 — impression-weighted average 만.

### 6.2 page_url ↔ entity 매핑 정책 (cycle 1 #6)

GSC 의 page_url 은 absolute URL 그대로 (예: `https://example.com/instanceSlug/insights/general/yoyo-prevention/`). 내부 entity 와 매핑하려면 normalization 필요. v1 안 정책:

#### 6.2.1 GSC page_url → canonical 변환

1. **trailing slash 제거** — `/path/` → `/path`
2. **query string 제거** — `?utm_source=...` 제거
3. **fragment 제거** — `#anchor` 제거
4. **www 제거** + scheme 정규화 — `http://www.example.com` → `https://example.com`
5. **sc-domain property 처리** — `sc-domain:example.com` property 의 page_url 은 보통 absolute URL 그대로
6. **path 만 추출** — `/instanceSlug/insights/general/<slug>` 형태로

#### 6.2.2 entity 매핑 — v1 안 SVI-DEFER-V1-3 (entity edit mini card) 합류 시

v1 acceptance 의 새 페이지 `/visibility-metrics` 는 GSC page_url 그대로 표시 (변환 안 함 · 사용자 식별 쉬움). entity ↔ url 매핑은 v1.2 합류 시 작성 — 이 plan 의 § 6.2.1 정책 활용.

#### 6.2.3 정규화 helper 위치 (cycle 2 #5 — v1 안 미작성)

`lib/integrations/page-url-canonical.ts` — **v1 안 작성하지 않음**. v1.2 (entity edit mini card · SVI-DEFER-V1-3) 합류 시 작성. 정책 문서화 (§ 6.2.1) 만 v1.

이유: v1 페이지 (`/visibility-metrics`) 안 GSC page_url 그대로 표시 → helper 없이 동작. 미리 helper 작성하면 unit test 부담 + 미사용 dead code 검출 회피 (cycle 2 #5).

### 6.3 query ↔ keyword.label 매칭 정책 (cycle 1 #7)

v1 안 keyword 페이지 metric 표시 (SVI-DEFER-V1-2) 까지 적용 안 함. 단 정책 명시:

#### 6.3.1 매칭 우선순위

1. **exact match** — `keyword.label === query` (대소문자 무관 · normalize 후)
2. **normalized contains** — `query.toLowerCase().includes(keyword.label.toLowerCase())` 또는 그 반대 (보조)
3. **표시 안 명시** — "정확 일치 기준" / "포함 기준 확장" toggle (v1.2 의 UI)

#### 6.3.2 normalize 정책

- 양쪽 trim
- 다중 공백 1개로
- 대소문자 무관 (toLowerCase)
- 띄어쓰기 차이 (한국어 "인천피부과" vs "인천 피부과") — v1 안 별도 처리 X (queryAliases — SVI-DEFER-13)

#### 6.3.3 helper 위치 (cycle 2 #5 — v1 안 미작성)

`lib/integrations/keyword-query-match.ts` — **v1 안 작성하지 않음** (정책 문서화만). v1.2 (keyword metric · SVI-DEFER-V1-2) 합류 시 작성.

## 7. 새 어드민 페이지 `/visibility-metrics`

`apps/web/src/app/(admin)/admin/[instanceSlug]/visibility-metrics/page.tsx` 신규.

### 7.1 UI 구조

```
헤더: "검색 노출 분석"
  · 마지막 sync: 2026-05-21 15:30 (또는 "아직 sync 안 됨")
  · 등록 property: 1개 · 데이터 누적 30일
  + "지금 sync" 버튼 (operator+)
  + "property 추가" link (super-admin 만)

(GSC_ENABLED=false 시 disabled view)

[등록 property 표]
  | source | URL | verification | last sync | actions |
  | google-search-console | https://example.com/ | verified | 2026-05-21 15:30 | [재verify] [삭제] |

[지난 7일 요약] (impression-weighted average — cycle 1 #5)
  노출 12,345 · 클릭 245 · CTR 1.98% · 평균 순위 8.4

[페이지별 표]
  | page_url | 노출 | 클릭 | CTR | 평균 순위 | sparkline (7일) |
  | /instanceSlug/insights/.../yoyo-prevention | 1,234 | 32 | 2.6% | 6.5 | ~~~ |
  ORDER BY impressions DESC · LIMIT 50

[키워드별 표]
  | query | 노출 | 클릭 | CTR | 평균 순위 | sparkline |
  | 다이어트 한약 부작용 | ... | ... | ... | ... | ... |
  ORDER BY impressions DESC · LIMIT 50

푸터: SVI-DEFER 안내 (v1.1/1.2 합류 예정 항목)
```

sparkline — inline svg (SVI-DEFER-08 까지 외부 라이브러리 회피).

## 8. errors.ts + NavMenu

### 8.1 NavMenu 안 "검색 노출" 메뉴 추가 (개선 큐 다음)

```ts
{
  href: (slug) => `/admin/${slug}/visibility-metrics`,
  label: "검색 노출",
  match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/visibility-metrics`),
},
```

### 8.2 errors.ts constraint 매핑

`search_property_*` · `search_visibility_snapshot_*` · `sss_*` 신규 constraint 모두 매핑.

## 9. 검증 시나리오 (v1 — 8건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| SVI-V01 | `GSC_ENABLED=false` 진입 | disabled view + runbook link |
| SVI-V02 | property 추가 (super-admin) → 잘못된 도메인 입력 | "이 instance domain 과 매칭 안 됩니다" formError (cycle 1 #2) |
| SVI-V03 | property verify (정상 접근) | verification_status='verified' + 사이트별 검증 통과 |
| SVI-V04 | manual sync 첫 시도 | sync_state.last_status='running' → 'success' · snapshot rows 생성 |
| SVI-V05 | sync 동시 시도 (두 번 빠르게) | 두 번째 호출 "sync 가 이미 진행 중" — running 락 (cycle 1 #8) |
| SVI-V06 | 429 응답 시뮬 (mock) | exponential backoff 후 partial 또는 failed · metadata 안 failedDates (cycle 1 #9) |
| SVI-V07 | cross-tenant — 다른 instance property_id 직접 form submit | "property not found" 거부 (same-tenant 검증) |
| SVI-V08 | typecheck + 기존 시각 검수 무회귀 | 통과 |

## 10. fixture / mock 테스트 (cycle 1 #12 + cycle 2 #6·#10)

`apps/web/src/lib/integrations/__tests__/google-search-console.test.ts` (vitest):

### 10.1 malformed 정책 통일 (cycle 2 #6)

- **response 전체 shape 위반** (예: top-level `rows` 가 array 아닌 object · keys 누락) → **fail 전체** · `last_status='failed'` + last_error 안 zod 메시지
- **개별 row shape 위반** (예: keys 길이 ≠ 3 · clicks 가 string) → **그 row 만 skip** · warning count 누적 · metadata.skippedRows += 1
- skipped row 가 0건이면 success · 1+ 면 partial 또는 success (운영자에게 metadata 안 표시)

### 10.2 test cases

- **mock response parser**: 정상 응답 (rows 3건) → zod 통과 + parse 정합
- **pagination**: 25000+ row mock — startRow 0/25000/50000 호출 3회 + 자동 종료
- **429 retry**: 1·2·4초 backoff 후 4번째 호출 성공 → partial 미발생
- **malformed top-level**: zod 실패 → 전체 fail (cycle 2 #6)
- **malformed individual row**: row skip + metadata.skippedRows 누적 (cycle 2 #6)
- **no rows**: 빈 응답 → 정상 sync 완료 (snapshot 0개)
- **JWT 인증 mock**: token 발급 1회 + 1시간 캐시 hit
- **sc-domain property** (cycle 2 #10): `siteUrl="sc-domain:example.com"` → `encodeURIComponent` 정합 + API 호출 정상
- **stale lock recovery**: sync_state row 안 `sync_started_at = NOW() - 31 minutes` + lock_token 존재 → 새 sync 시도 시 lock 강제 해제 + 새 token 발급
- **unlock on failure**: GSC API throw 시 try/catch/finally 안 last_status='failed' + lock_token=NULL 확정 (cycle 2 #2)

## 11. 작업 manifest (v1 — 8 task · cycle 1 #11 축소)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | C0035~C0037 migration + drizzle schema (search_property · search_visibility_snapshot · search_sync_state 안 sync lock 컬럼) | sql + schema.ts | — |
| 2 | env.ts 안 GSC_ENABLED · GSC_SERVICE_ACCOUNT_JSON 추가 + .env.example + 보안 원칙 명시 (cycle 1 #1) | env · doc | — |
| 3 | `lib/integrations/google-search-console.ts` — JWT 인증 + queryAnalytics + pagination + 429 retry + zod 응답 검증 | client lib | — |
| 4 | `lib/admin/search-visibility.ts` helper — load snapshots (페이지별·키워드별·시계열) + weighted aggregate (cycle 1 #5) | helper | 1 |
| 5 | `/visibility-metrics/sync-actions.ts` server action — addSearchProperty (v1 source whitelist · cycle 2 #3·4) · verifySearchProperty (super-admin · cycle 1 #2) · syncSearchVisibility (UPSERT lock · try/finally unlock · 첫 sync 90일 vs 일반 7일 분리 · cycle 2 #1·2·8) + 권한 분리 (cycle 1 #10) | server actions | 3·4 |
| 6 | `/visibility-metrics/page.tsx` — 헤더 + property 표 + "초기 동기화" / "최근 7일 동기화" 버튼 분리 (cycle 2 #8) + 7일 요약 (weighted aggregate · cycle 1 #5) + 페이지별/키워드별 표 + sparkline (외부 라이브러리 X) | page | 4·5 |
| 7 | NavMenu + errors.ts + runbook (`docs/runbook/search-console-setup.md`) | misc | — |
| 8 | vitest fixture (cycle 1 #12 + cycle 2 #6·#10): malformed 분리 (전체 fail vs row skip) + sc-domain + stale lock recovery + unlock on failure + typecheck + commit | test · commit | 5·6·7 |

추정: **3~5일** — cycle 2 #5 의 helper defer 로 v1 작업량 살짝 감소 + scope 명확화.

(cycle 1 v0.2 안 helper 사전 작성 (task 4) 제거 — `page-url-canonical.ts`·`keyword-query-match.ts` 는 정책 문서화만 v1, 코드는 v1.2 합류 시.)

## 12. SVI-CASCADE markers

| marker | 항목 | 영향 |
|---|---|---|
| SVI-CASCADE-01 | 네이버 서치어드바이저 · Bing 등 multi-source 합류 시 | search_property.source enum 확장 (CHECK 위반 회피 위해 별도 DDL · v1 안 enum 미사용 TEXT) |
| SVI-CASCADE-02 | SEO_KEYWORD_STRATEGY_PLAN KWS-DEFER-01·05 본 데이터 source | keyword difficulty 자동 산정 · 순위 추적 — § 6.3 정책 활용 |
| SVI-CASCADE-03 | CONTENT_IMPROVEMENT_QUEUE_PLAN CIQ-DEFER-06 합류 시 | "CTR 급락" · "노출 급증인데 클릭 안 늘어남" 같은 새 카테고리 도입 |
| SVI-CASCADE-04 | Phase 6 (콘텐츠 캘린더) 의 "성과 하락 감지" | 본 plan 데이터 누적 후 가능 |
| SVI-CASCADE-05 | v1.1 (대시보드 카드) · v1.2 (keyword metric · entity mini card) 후속 cycle | 본 plan 의 § 6 매핑 정책을 그때 활용 — 정책은 v1 안 미리 정의 |

## 13. 변경 이력

- **2026-05-21**: v0.1 draft 작성.
- **2026-05-21**: v0.2 draft — cycle 1 critique (12건) 전건 수용:
  - cycle1-#1 Service Account 보안 원칙 추가 (§ 5.3) — server-only · 일부 로그 · prod/preview 분리 · Workload Identity 검토 marker (SVI-DEFER-12).
  - cycle1-#2 property verify 2단계 — GSC 접근 + instance domain 매칭 (§ 3.3 + § 4.3).
  - cycle1-#3 raw row 보존 정책 (§ 2.2.1) — 기본 90일 · backfill 180일 · 월별 aggregate marker (SVI-DEFER-11).
  - cycle1-#4 ctr NUMERIC(6,5) 1.00000 저장 OK 확인 + 반올림 정책 (§ 2.2.2).
  - cycle1-#5 weighted avg position 공식 명시 (§ 6.1) — 단순 평균 금지.
  - cycle1-#6 page_url canonical normalization 정책 (§ 6.2) + helper `page-url-canonical.ts` v1 안 미리 작성.
  - cycle1-#7 query ↔ keyword.label 매칭 정책 (§ 6.3) + helper `keyword-query-match.ts` v1 안 미리 작성. queryAliases marker (SVI-DEFER-13).
  - cycle1-#8 sync running lock 컬럼 + stale lock 자동 해제 (§ 2.3 + § 4.4).
  - cycle1-#9 partial 상태 정의 + metadata 안 success/fail dates (§ 4.5).
  - cycle1-#10 권한 분리 (§ 4.1) — property CRUD super-admin · sync/조회 operator.
  - cycle1-#11 **v1 scope 축소** (§ 1.2·1.3) — `/visibility-metrics` 만 v1 acceptance · 대시보드 카드 v1.1 (SVI-DEFER-V1-1) · keyword metric v1.2 (SVI-DEFER-V1-2) · entity mini card v1.2 (SVI-DEFER-V1-3). 작업량 5~7일 → 3~5일.
  - cycle1-#12 fixture/mock 테스트 (§ 10) — mock parser · pagination · 429 · malformed · no rows · JWT.
- **2026-05-21**: v0.3 draft — cycle 2 critique (10건) 전건 수용:
  - cycle2-#1 sync_state 최초 row UPSERT lock 획득 (§ 4.4) — INSERT ON CONFLICT 패턴 명시.
  - cycle2-#2 실패 시 try/catch/finally unlock 보장 (§ 4.4·4.4.1) — last_status='failed' + lock_token=NULL 확정.
  - cycle2-#3 v1 source whitelist (§ 4.2) — server action 안 'google-search-console' 외 reject.
  - cycle2-#4 source CHECK 안 naver/bing 미리 허용 신중 — DB schema 는 그대로 (확장성) · v1 server action 안 reject 명시.
  - cycle2-#5 helper 사전 작성 → v1.2 defer (§ 6.2.3·6.3.3) — `page-url-canonical.ts` · `keyword-query-match.ts` 코드는 미작성, 정책만 v1 안 문서화. § 11 task 4 제거.
  - cycle2-#6 malformed 정책 통일 (§ 10.1) — response top-level shape 위반은 전체 fail · individual row 위반은 skip + metadata.skippedRows. partial 처리와 정합.
  - cycle2-#7 avg_position CHECK 상한 1000 추가 (§ 2.2) — 운영 데이터 품질 방어.
  - cycle2-#8 첫 sync 90일 vs 일반 7일 분리 (§ 4.4) — `mode: "initial" | "recent" | "custom"`. UI 안 "초기 동기화" / "최근 7일 동기화" 분리 (§ 11 task 6).
  - cycle2-#9 property_url normalization (§ 2.1.1) — trailing slash · scheme/host lowercase · www 처리. sc-domain prefix lower-case. UNIQUE 정합.
  - cycle2-#10 sc-domain test case 추가 (§ 10.2) — siteUrl="sc-domain:example.com" 의 encodeURIComponent 정합 검증.
