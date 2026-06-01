# NAVER_SEARCH_INGEST_PLAN (v0.4·draft·2026-05-22 / v1.x 패치·2026-06-01)

> **v1.x 갱신 (2026-06-01)**: (1) **NSI-DEFER-01 OpenAPI client 폐기** — 네이버 공식 API 가 키워드 TOP30 분석을 제공하지 않음 확정 → paste 가 영구 유일 경로 (§ 1.3·§ 13). (2) **gap/집계 correctness 패치 3종** — 누적 grain 이중계상·page-gap 거짓 google-only·query 'both' 과소계상 제거 (§ 15 신규). (3) 색인/수집 현황은 별 plan `NAVER_INDEX_HEALTH` 로 분리 검토.

> **상태**: **v0.4 draft** — cycle 3 비평 흡수 (Blocker 1 · High 3 · Medium 3 · Low 1 전건 수용). 핵심 변경: (a) NSA TOP30 = "누적 TOP30 clipboard snapshot" 으로 DB/UI/집계 명확 분리 (metadata.dataGrain 등) · (b) avg_position sentinel 1000 → metadata.positionUnavailable 로 격상 (aggregate 오염 차단) · (c) paste 정합 cleanup (CSV 잔재 제거) · (d) parser 반환 타입 `{ validRows, skippedRows, errors }` 명시 · (e) v1 parser 의 HTML detect demote — plain text fixture 우선. acceptance 는 cycle n 비평 수렴 + typecheck + 시각 검수.

> **cycle 3 비평 흡수 marker** (2026-05-22):
> (a) **Blocker — TOP30 가 일별처럼 오해될 위험** — search_visibility_snapshot 안 metadata 에 `dataGrain='naver-top30-cumulative'`, `collectionDate`, `sourceWindowLabel` 저장. UI 안 "TOP30 누적 스냅샷 / 일별 데이터 아님" 강조 표시 (§ 4.4·§ 7) ·
> (b) **High — avg_position 1000 sentinel 의 aggregate 오염** — sentinel 값 유지하되 **metadata.positionUnavailable=true** 추가. helper 가 metadata 보고 weighted sum 에서 skip (단순 detect 보다 robust). § 7.1 "전체 tab" 시나리오 안 sentinel 제외 acceptance 추가 (§ 4.6·§ 10) ·
> (c) **High — verification_method NOT NULL migration 위험** — 이미 prod 적용 완료 (commit `7c504f5`) — 단계적 패턴 (nullable add → 배포 → backfill → NOT NULL contract) 을 향후 cycle 권장 패턴으로 § 2.2 안 정리 ·
> (d) **High — paste 잔재 CSV 표기** — `uploadNaverCsvAction` → `uploadNaverPasteAction` (§ 5.1) · § 11 fixture · § 12 manifest 전부 Paste 로 정합 ·
> (e) **Medium — malformed row skip pseudocode 미반영** — parser 반환 타입을 `{ validRows: NaverPasteRow[]; skippedRows: number; errors: Array<{ rowIndex: number; reason: string }> }` 로 명시 (§ 4.3·§ 4.4) ·
> (f) **Medium — `<textarea>` paste 형식** — v1 parser primary = plain text (TSV / 줄바꿈+공백). HTML detect 는 secondary fallback (사용자 환경에서 HTML 그대로 paste 시) (§ 4.3) ·
> (g) **Medium — MEANINGFUL_TRAFFIC_LOOP_PLAN cascade** — 측정 루프 (본 plan) + 트래픽 생성 루프 (별 plan) 의 경계 명시. § NSI-CASCADE-06 신규 ·
> (h) **Low — § 4.6/4.7 numbering 중복** — 4.7 → 4.8 (query 매칭) / 4.6 두 번째 → 4.7 (page_url 매핑) 으로 정리 ·

> **v0.3 cycle 2 비평 흡수 marker (archive)** — Blocker (a) CSV export 미제공 → paste · Blocker (b) 시계열 부재 → 스냅샷 모드 · schema 5컬럼 확정 · sentinel `''`·`1000` · CTR /100 · HTML/TSV detect parser · G1·G2·G3 close.

> **cycle 2 비평 흡수 marker** (G1 sample 확보 결과 정합 · 2026-05-22):
> (a) **Blocker — NSA CSV export 미제공** — v0.2 § 4 의 CSV upload path 가 NSA 환경 mismatch. NSA 콘솔의 "콘텐츠 노출/클릭" TOP30 표가 키워드 데이터의 유일 source · export 버튼 없음. v1 main path → **clipboard paste** (§ 4 재작성) ·
> (b) **Blocker — NSA TOP30 가 시계열 아님** — 누적 집계 표. search_visibility_snapshot 의 snapshot_date PK 가정과 mismatch. 옵션 **스냅샷 모드** 채택 — 운영자가 ingestion 시 기준 날짜 입력 (default = 다운로드 일자) (§ 1.2·§ 4.5·§ 8) ·
> (c) **schema 확정 — 5컬럼**: `No · 검색 키워드 · 클릭 · 노출 · CTR(%)`. v0.2 추정의 `날짜·페이지URL·평균순위` 모두 NSA 미제공 (§ 4.2 재작성) ·
> (d) **page_url 모두 sentinel `''`** — NSA TOP30 가 사이트 단위 집계라 페이지별 분해 없음. **G3 충돌 위험 없음 확정** (전부 미제공) ·
> (e) **avg_position NSA 미제공** — sentinel **`1000`** 채택 (`> 0 AND <= 1000` CHECK 정합 + max 값으로 "unknown" 의미). schema 변경 회피 ·
> (f) **CTR 단위 = 정수 %** (25, 50, 0 등) — parser 안 `/ 100` 변환. zod `min(0).max(100)` (§ 4.2) ·
> (g) **HTML / TSV / CSV 자동 detect parser** — 브라우저 paste 가 환경 종속. server-side robust parser 가 양쪽 모두 수용. cheerio 재사용 (site-meta-fetch 패턴) (§ 4.3) ·
> (h) **G1·G2·G3 모두 충족 확정** — § 1.4 gate close.

> **v0.2 cycle 1 비평 흡수 marker (archive)** — Blocker 2 · High 2 · Medium 3 전건 흡수. 실제 코드 정합 패치 + v1 scope 축소 (OpenAPI stub 제거 · sample CSV gate) + atomicity 패턴 정정.

> **본 plan 의 위상**: Phase 5.1 — 네이버 source 합류. CLAUDE.md 핵심 가정 ("네이버 검색 신뢰도 — 2025-2026 AI 브리핑·통합 랭킹 정합") 의 측정 루프 단절 해소. 사용자 의견 (2026-05-22) "측정-실행 루프 비대칭" 진단 직접 대응. SEARCH_VISIBILITY_INGEST_PLAN v1.0 의 `source whitelist v1 google-search-console only` 제약을 확장 — 단 source 값은 이미 schema 안 `'naver-searchadvisor'` 로 reserved (실제 enum 정합).

> **cycle 1 비평 7건 흡수 marker** (전건 수용):
> (a) **Blocker #1** — search_source 값 `'naver-search-advisor'` → `'naver-searchadvisor'` (실 schema CHECK constraint 정합). enum 추가 migration 불필요 — 이미 reserved (§ 2.1) ·
> (b) **Blocker #2** — `date` → `snapshot_date`, `status='completed'` → `last_status='success'`, `completed_at` → `last_sync_at` 등 컬럼명 실 schema 정합 (§ 2.3·4.4) · page_url NOT NULL 충돌 해소 위해 **sentinel `''` 정책 채택** (§ 4.5 신규 절) ·
> (c) **High #1** — UPSERT key = `(instance_id, property_id, snapshot_date, page_url, query)` (source 제거 — property 별 source 고정이라 conflict key 불필요 · § 4.4) ·
> (d) **High #2** — atomicity 정정 — lock 획득 tx · ingestion tx · release tx **3개 별 transaction**. failed sync_state 는 별 tx 라 persist (§ 4.4 재설계 · 기존 GSC `sync-actions.ts:341/392` 패턴 답습) ·
> (e) **Medium #1** — dry-run preview defer 확정 (§ 1.3 NSI-DEFER-06 유지) · § 1.2 범위표·§ 7.4 안 preview 표현 모두 제거 — **v1 = upload 즉시 ingest** ·
> (f) **Medium #2** — source filter 합산 tab 구현은 `loadVisibilitySummary` 시그니처 변경 (`propertyId` → `propertyId | sourceFilter`) — manifest 별 task (§ 12 task #6 신설) ·
> (g) **Medium #3** — property URL 예시 `daiet.example.kr` → `https://daiet.example.kr` 또는 `sc-domain:daiet.example.kr` (실 `search_property_url_format` CHECK 정합 · § 7.2) ·
> (h) **추천 #1** (v0.2 = 실 schema 정합 패치) — 전건 반영 ·
> (i) **추천 #2** (page_url 미제공 케이스) — sentinel `''` 채택 (변경 최소) · § 4.5 정책 · cycle 2 비평 대상 ·
> (j) **추천 #3** (OpenAPI stub 제거) — § 3 통째 제거 · NSI-DEFER-01 marker 만 유지 (v1.x 합류) ·
> (k) **추천 #4** (sample CSV gate) — § 4.3 의 zod schema 는 sample 확보 후 확정 — v1 acceptance 의 명시적 gate (§ 1.4 신규 절).

## SoT

- **사용자 의견 (2026-05-22)** — "측정-실행 루프 비대칭 — Phase 5 가 Google GSC only · 네이버 측정 단절" + (a)(b)(c) 순차 구현 결정 (a 우선). 본 plan 의 의도 SoT.
- **CLAUDE.md** "핵심 가정" — 네이버 검색 신뢰도 (2025-2026 AI 브리핑·통합 랭킹) 정합.
- **docs/decisions/SEARCH_VISIBILITY_INGEST_PLAN.md** v1.0 — source whitelist v1 google-only · 본 plan 으로 source 확장 cascade.
- **docs/decisions/SEO_KEYWORD_STRATEGY_PLAN.md** v1.0 KWS-DEFER-01·05 — query → keyword.label 매칭 정책 (exact + normalized contains) 답습.
- **docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md** v1.0 CIQ-DEFER-06 — search console 기반 큐 합류 시점 정합.
- **실 코드 — 정합 SoT (cycle 1 #1·2·3 정정 후)**:
  - `packages/core-content/src/schema.ts:793` — `SearchSource = "google-search-console" | "naver-searchadvisor" | "bing-webmaster"` (이미 reserved · 본 plan 안 migration 불필요)
  - `:813` — `search_property_source_check` (text + CHECK · pgEnum 아님)
  - `:816` — `search_property_url_format ~ '^(https?://|sc-domain:)'` (bare domain 거부)
  - `:834·835` — `snapshot_date` · `page_url NOT NULL` (sentinel `''` 정책 § 4.5)
  - `:849` — `dimensionsUnique = (instance_id, property_id, snapshot_date, page_url, query)` (source 미포함)
  - `:872` — `last_status IN ('never-synced','running','success','partial','failed')` (`completed` 아님)
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/visibility-metrics/sync-actions.ts:341` — lock 획득 tx (UPSERT + 30분 stale 정책) — 본 plan § 4.4 답습
  - `:392` — ingestion tx (별 try/catch · finally release) — 본 plan § 4.4 답습
  - `apps/web/src/lib/admin/search-visibility.ts:138` — `loadVisibilitySummary(tx, instanceId, propertyId)` 단일 property — § 12 task #6 안 시그니처 확장 대상
  - `apps/web/src/lib/integrations/google-search-console.ts` — Service Account JWT · pagination · 429 retry · zod 응답 검증 (NSA OpenAPI v1.x 합류 시 패턴 답습)
  - `apps/web/src/lib/errors.ts` — constraint 매핑
  - `apps/web/src/lib/env.ts` — env zod 검증
  - `apps/web/src/components/forms/Field.tsx` — `Field`·`SelectField` 재사용

> **표기 규칙**: 다른 plan 정합 — DB column = snake_case · TS = camelCase. 사용자 표시 = "네이버 검색 노출" / "검색 노출" (양 source 통합 view).

## 1. 목적과 범위

### 1.1 목적

- **핵심 가정 측정 루프 닫기** — "네이버 검색 신뢰도" 가 SoT 인데 GSC 만 으론 측정 불가. NSA (Naver Search Advisor) 데이터 ingestion 으로 동일 KPI (impressions·clicks·ctr·avg_position) 를 네이버 측에서도 확인.
- **양 source 통합 view** — 동일 `/admin/<slug>/visibility-metrics` 안 source filter tab. 운영자가 한 화면에서 양 검색엔진 비교.
- **keyword 매핑의 네이버 실효성 검증** — 등록된 "다이어트한의원" 같은 키워드가 네이버에서 실제로 노출되는지 확인. Google ↔ 네이버 gap 시각화는 v1.x defer (NSI-DEFER-07).
- **즉시 ROI 우선 — CSV main path** — NSA 공식 OpenAPI 의 분석 데이터 제공 여부 미검증 (사용자 비평 추천 #3 정합). v1 = CSV 수동 업로드만. v1.1+ 에서 OpenAPI 실가능성 검증 후 합류.

### 1.2 범위 (포함 — v1 acceptance)

| 항목 | 비고 |
|---|---|
| **§ 2 DB schema** (1 migration · C0038) | search_property 안 `verification_method` 컬럼 신규. **search_source enum 추가 migration 불필요** (cycle 1 #1 — 이미 reserved). search_visibility_snapshot 안 sentinel `''` 처리는 application-level (CHECK 변경 없음 — § 4.5) |
| **§ 4 paste ingestion (v1 main path · cycle 2 (a))** | `/visibility-metrics/upload` 신규 페이지 · **textarea paste** + 기준 날짜 입력 · HTML/TSV/CSV robust parser (cheerio · zod) · sentinel `''` · ingestion atomicity (3 tx 분리) · sync_state row 생성 |
| **§ 5 sync action source 분기** | 기존 sync-actions.ts 안 source 별 dispatch. NSA = CSV path · GSC = 기존. lock 동일 |
| **§ 6 env** | NSA 자격증명 v1 안 없음 (CSV path 자격 불필요). v1.x OpenAPI 합류 시 추가 marker |
| **§ 7 visibility-metrics 페이지 source filter** | source 별 tab — "전체 / Google / 네이버" 3 옵션. helper 시그니처 확장 (§ 12 task #6) |
| **§ 8 매핑/집계 정책** | NSA 표기 normalization · sentinel `''` 안 query-only 집계 정합 |
| **§ 9 errors.ts + NavMenu** | NSA constraint 매핑 (CSV schema · property unverified · sync conflict) |
| **§ 10 검증 시나리오 (10건)** | migration · paste valid/malformed/empty · HTML·TSV·CSV detect · sentinel · ingestion atomicity (3 tx) · source filter · cross-tenant · lock · typecheck · 시각 검수 NSI-V01~V10 |
| **§ 11 fixture/mock (NSA paste)** | **G1 sample 정합** — HTML table paste · TSV paste · CSV paste · 한글 키워드 · CTR % 정수 · CTR 0 (no click) · 잘못된 row · empty |
| **§ 12 작업 manifest** | 약 8 task (helper 시그니처 확장 #6 신설) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| ~~NSA 공식 OpenAPI client~~ **폐기 (2026-06-01)** — 네이버 서치어드바이저 공식 API 는 소유확인·사이트맵/웹페이지 수집요청·요약통계만 제공하고 "검색 키워드 TOP30"(query 별 노출·클릭·CTR) 분석 데이터를 **제공하지 않음**. 따라서 OpenAPI 로 paste 경로를 대체 불가 → 키워드 ingestion 목적의 client 는 만들 가치 없음. **paste 가 네이버 키워드 데이터의 영구 유일 경로.** | (폐기 · 별 plan `NAVER_INDEX_HEALTH` 로 색인/수집 현황만 분리 검토) | NSI-DEFER-01 (closed) |
| 자동 sync cron — v1 안 운영자 manual 만 | Phase 6 (캘린더 · CIQ-DEFER-06 정합) | NSI-DEFER-02 |
| Bing Webmaster Tools / 다음 검색 / Zum 등 다른 검색엔진 source | 별 plan (Phase 5.x) | NSI-DEFER-03 |
| 네이버 통합검색 안 스마트블록 (인기글·플레이스·VIEW 등) 노출 시그널 — 비공식 scraping | 법적·이용약관 검토 후 별 cycle | NSI-DEFER-04 |
| 네이버 키워드 광고 (검색량·CPC·제안 키워드) — 별 도구 (네이버 광고 OpenAPI) | 별 plan (paid media) | NSI-DEFER-05 |
| CSV import dry-run preview UI — **v1 안 upload 즉시 ingest 확정** (cycle 1 #5 모순 해소) | v1.1 cycle | NSI-DEFER-06 |
| GSC ↔ NSA gap 분석 view (Google 만 노출 / 네이버 만 노출 / 양쪽) | v1.2 cycle | NSI-DEFER-07 |
| SERP 순위 시계열 추적 — keyword 별 일별 average position 차트 | KWS-DEFER-05 합류 | NSI-DEFER-08 |
| 네이버 AI 브리핑 노출 시그널 — 인용 여부 추정 | M2+ (네이버 측 데이터 형식 공개 시) | NSI-DEFER-09 |
| page_url NULL 허용 (NSA 가 page 별 데이터 미제공 시) — sentinel `''` 의 정직한 재설계 | v2+ (sentinel 운영 누적 후 데이터 사용 패턴 결정) | NSI-DEFER-10 |

### 1.4 v1 acceptance gate (cycle 2 close · 2026-05-22)

본 plan 의 v1.0 acceptance 선조건 — **모두 충족 확정**:

- ✅ **Gate G1** — NSA TOP30 표 sample 확보 (Glitzy 회사 사이트 NSA 데이터 · 10 row + HTML table 형식)
- ✅ **Gate G2** — § 4.2 schema 5컬럼 확정 (`No · 검색 키워드 · 클릭 · 노출 · CTR(%)`) · CTR 단위 = 정수 % · 날짜·page_url·평균순위 미제공
- ✅ **Gate G3** — sentinel `''` 정책 검증 — NSA TOP30 가 사이트 단위 집계라 **모든 row page_url 미제공** = sentinel `''` 충돌 위험 없음 (전부 미제공 시나리오)

> 추가 검증 (실 ingestion 검증) 은 demo 사이트 NSA 데이터 누적 후 (1~2주) — v1.0 acceptance 후 별 시각 검수.

## 2. DB schema 변경 (cycle 1 #1·#2 정정)

### 2.1 search_source — **migration 불필요** (cycle 1 #1)

`packages/core-content/src/schema.ts:793` 안 이미 정의:
```ts
export type SearchSource = "google-search-console" | "naver-searchadvisor" | "bing-webmaster";
```

`:813` CHECK constraint 도 정합:
```sql
search_property_source_check ${t.source} IN ('google-search-console', 'naver-searchadvisor', 'bing-webmaster')
```

> v0.1 의 `'naver-search-advisor'` 표기 오류. **canonical 값은 `'naver-searchadvisor'` (단일 단어 "searchadvisor")**. 본 plan 의 모든 SQL/TS literal 은 이 값 사용.

### 2.2 search_property.verification_method 컬럼 신규 (C0038 · prod 적용 완료)

> **cycle 3 (c) 안전성 점검**: 적용 시점에 dev/prod 모두 non-GSC row 가 없어 backfill + NOT NULL 강제가 fail 없이 통과. 단 향후 cycle (NSA property 등록 후 verification_method 컬럼 변경 등) 시에는 **단계적 패턴** 권장:
>
> 1. nullable column add (NOT NULL 없이)
> 2. 새 코드 배포 (INSERT 시 컬럼 값 set)
> 3. 기존 row backfill 검증 (source 별 default value)
> 4. NOT NULL contract 강제 (`ALTER COLUMN ... SET NOT NULL`)
> 5. CHECK constraint 추가
>
> v0.4 시점에 C0038 은 1단계 + 4단계 + 5단계를 한번에 — non-GSC row 없음 확정 환경 한정 안전. 단계 분리는 향후 cycle 정책.


```sql
-- packages/core-content/migrations/C0038_search_property_verification_method.sql
ALTER TABLE search_property
  ADD COLUMN IF NOT EXISTS verification_method text;

-- 기존 row backfill (모두 GSC SA — Phase 5 v1.0 acceptance 정합)
UPDATE search_property
   SET verification_method = 'gsc-service-account'
 WHERE source = 'google-search-console'
   AND verification_method IS NULL;

ALTER TABLE search_property
  ALTER COLUMN verification_method SET NOT NULL;

ALTER TABLE search_property
  ADD CONSTRAINT search_property_verification_method_check
  CHECK (verification_method IN (
    'gsc-service-account',     -- 기존 (Google)
    'naver-meta-tag',          -- NSA HTML meta tag verification
    'naver-html-file',         -- NSA root HTML file verification
    'naver-dns-record'         -- NSA TXT record verification
  ));
```

> 어드민은 verification 자체를 수행하지 않음 — 운영자가 외부 콘솔에서 완료 후 property 등록 시 method 선택만. NSA 의 실 옵션 정확성은 cycle 2 비평 대상 (G1 sample 확보 시 함께 검증).

### 2.3 search_visibility_snapshot — metadata jsonb 컬럼 신규 (C0039 · cycle 3 (b))

```sql
-- packages/core-content/migrations/C0039_search_visibility_snapshot_metadata.sql
ALTER TABLE search_visibility_snapshot
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
```

> Postgres 11+ 의 ADD COLUMN ... NOT NULL DEFAULT 는 instant (rewrite 없음). storage 영향 미미.

**row 별 metadata 약속** (application-level):
- `dataGrain` — `'gsc-daily'` (GSC row) · `'naver-top30-cumulative'` (NSA row). aggregate helper 가 보고 동작 분기
- `collectionDate` — 운영자가 ingestion 시 입력한 기준 날짜 (NSA 만 · GSC 는 fetch 자동)
- `sourceWindowLabel` — UI 표시용 라벨 ("NSA TOP30 누적" 등)
- `positionUnavailable` — `true` 일 때 avg_position 합산 skip (cycle 3 (b))

### 2.4 search_sync_state — 변경 없음 (cycle 1 #2)

| 컬럼 (실 schema) | v0.1 draft 잘못 표기 | 본 plan v0.2 의 정합 사용 |
|---|---|---|
| `snapshot_date` | `date` | `snapshot_date` |
| `page_url NOT NULL` | nullable 가정 | sentinel `''` (§ 4.5) |
| `last_status` (enum) | `status` | `last_status` |
| enum `'success'` | `'completed'` | `'success'` |
| `last_sync_at` | `completed_at` | `last_sync_at` |
| `sync_started_at` | `started_at` | `sync_started_at` |
| `last_synced_date` | (누락) | `last_synced_date` (date 컬럼 — § 4.4) |
| unique `(instance_id, property_id, snapshot_date, page_url, query)` | source 포함 | source 미포함 (cycle 1 #3) |

## 3. (제거됨 — cycle 1 추천 #3)

v0.1 의 § 3 NSA OpenAPI stub 은 본 plan 에서 **제거**. 호출 경로 없는 stub 은 type/test 비용만 늘림. NSI-DEFER-01 marker 로 v1.x 합류 표기.

## 4. Paste ingestion path (v1 main · cycle 2 (a) 전면 재작성)

### 4.1 운영자 flow

1. NSA 콘솔 (https://searchadvisor.naver.com) → 사이트 → **콘텐츠 노출/클릭** → **검색 키워드 TOP30** 표
2. **표 영역 마우스 드래그** (header 포함) → `Ctrl+C` (또는 우클릭 → 복사)
3. 어드민 `/admin/<slug>/visibility-metrics/upload` (신규 페이지) →
   - property 선택 (source='naver-searchadvisor' 만)
   - **기준 날짜** 입력 (default = 오늘 — 운영자가 NSA 콘솔에서 본 데이터의 기준일)
   - **textarea paste** (`Ctrl+V`)
   - 제출 → server action `uploadNaverPasteAction`
4. server:
   - paste text → HTML/TSV/CSV format 자동 detect → parse (§ 4.3)
   - row 별 zod 검증 (§ 4.2)
   - **lock tx** (별 tx · § 4.4 step 1) → **ingestion tx** (별 tx · UPSERT · § 4.4 step 2) → **release tx** (별 tx · sync_state 기록 · § 4.4 step 3)
5. visibility-metrics 페이지 새로고침 시 NSA source row 합류 표시

### 4.2 paste row schema (G1·G2 확정 · 5컬럼)

```ts
import { z } from "zod";

// cycle 2 G1·G2 confirmed — NSA TOP30 5컬럼 정합
export const NaverPasteRowSchema = z.object({
  // No 컬럼은 parser 단계에서 skip (행 번호 — schema 의미 없음)
  검색키워드: z.string().min(1).max(500),       // "검색 키워드" — 공백 normalize
  클릭: z.coerce.number().int().min(0),
  노출: z.coerce.number().int().min(0),
  CTR: z.coerce.number().min(0).max(100),       // 정수 % (25, 50, 0 등) — parser 안 /100 변환
});

export type NaverPasteRow = z.infer<typeof NaverPasteRowSchema>;

// snapshot insert 단계에서 변환
export type NormalizedNaverRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;             // 0~1 (/100 변환 후)
  pageUrl: "";             // sentinel — NSA 미제공 (§ 4.5)
  avgPosition: 1000;       // sentinel — NSA 미제공 (§ 4.6)
};
```

### 4.3 paste format detect + parse (cycle 3 (e)·(f) 정합)

**v1 primary = plain text** (`<textarea>` 가 보통 HTML 변환). **HTML detect 는 secondary fallback** — 일부 환경에서 HTML 보존하는 textarea 또는 contenteditable 영역 paste 정합.

**반환 타입 — cycle 3 (e) 정합**:

```ts
export type PasteParseResult = {
  validRows: NaverPasteRow[];
  skippedRows: number;
  errors: Array<{ rowIndex: number; reason: string }>;  // 운영자 UI 표시 + audit
};

export function detectAndParse(paste: string): PasteParseResult {
  const trimmed = paste.trim();

  // 1. plain text TSV/공백 우선 — v1 primary path
  const firstLine = trimmed.split(/\r?\n/)[0] ?? "";
  if (firstLine.includes("\t")) {
    return parseDelimited(trimmed, "\t");
  }
  // 공백 (multi-space) 구분 — NSA 표 plain text paste 시 흔한 형식
  if (/\s{2,}/.test(firstLine)) {
    return parseDelimited(trimmed, /\s{2,}/);
  }

  // 2. HTML fallback (secondary — 일부 환경)
  if (/<table|<tr/i.test(trimmed)) {
    return parseHtmlTable(trimmed);  // cheerio (site-meta-fetch.ts 패턴 재사용)
  }

  // 3. CSV last fallback (사용자가 엑셀 거쳐 export 한 경우)
  return parseDelimited(trimmed, ",");
}

function parseDelimited(text: string, delim: string | RegExp): PasteParseResult {
  const rows = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (rows.length === 0) return { validRows: [], skippedRows: 0, errors: [] };

  // 첫 행 = header — skip (검증은 row 단위 zod 가)
  const dataRows = rows.slice(1);

  const validRows: NaverPasteRow[] = [];
  const errors: Array<{ rowIndex: number; reason: string }> = [];

  for (let i = 0; i < dataRows.length; i++) {
    const tokens = dataRows[i]!.split(delim).map(t => t.trim());
    if (tokens.length < 5) {
      errors.push({ rowIndex: i + 1, reason: `토큰 ${tokens.length}개 — 5개 필요 (No · 검색 키워드 · 클릭 · 노출 · CTR)` });
      continue;
    }
    const [, query, clicks, impressions, ctr] = tokens;  // No (tokens[0]) skip
    const parsed = NaverPasteRowSchema.safeParse({
      검색키워드: query,
      클릭: clicks,
      노출: impressions,
      CTR: ctr,
    });
    if (!parsed.success) {
      errors.push({ rowIndex: i + 1, reason: parsed.error.issues.map(iss => iss.message).join("; ") });
      continue;
    }
    validRows.push(parsed.data);
  }

  return { validRows, skippedRows: errors.length, errors };
}

function parseHtmlTable(html: string): PasteParseResult {
  // cheerio load → tbody tr 안 td:nth-child(2..5) 추출 — No 컬럼 (1) skip
  // <div class="url_text_*"> 안 텍스트 추출 (검색 키워드 wrapper)
  // 반환 타입 동일 — { validRows, skippedRows, errors }
}
```

### 4.3.1 parse + validation 정책

- **인코딩** — paste 가 이미 string (UTF-8 HTTP body)
- **malformed row 정책** — **skip + log**. errors[] 에 누적 → sync_state.metadata.skippedRowCount + 운영자 UI 표시
- **duplicate row** — UPSERT (§ 4.4)
- **empty paste** — `NSA_PASTE_EMPTY` · sync_state failed
- **header detect 실패** — 모든 row 가 5 토큰 안 채워지면 `NSA_PASTE_INVALID_SCHEMA`
- **CTR 변환** — ingestion 단계에서 `parsed.CTR / 100` (svs CHECK 정합)

### 4.4 ingestion atomicity (cycle 1 #4 · 3 tx 분리 · 기존 GSC `sync-actions.ts` 패턴 답습)

기존 GSC 구현이 lock 획득 / fetch+insert / release 를 **3개 별 transaction** 으로 운영 — sync_state 의 실패 기록이 ingestion rollback 에 휘말리지 않게. 본 plan 도 동일 패턴. NSA 는 **단일 snapshot_date** (운영자 입력 기준 날짜) 의 row 만 ingest.

```ts
// pseudocode — sync-actions.ts:341/392 패턴 정합
const lockToken = crypto.randomUUID();
const snapshotDate = parsed.referenceDate;  // 운영자 입력 기준 날짜 (§ 4.5)

// === Step 1 — lock 획득 tx (별 tx) ===
try {
  acquired = await withSkeletonTx(ctxInput, async (tx, ctx) => {
    // property 정보 조회 + source='naver-searchadvisor' 검증
    // search_sync_state UPSERT — last_status='running' · lock_token · sync_started_at
    // 기존 GSC sync-actions.ts:353~371 정합 (30분 stale 자동 해제)
    return { ok: true as const, ... };
  });
} catch (err) { /* lock 획득 실패 */ }

// === Step 2 — ingestion tx (별 tx · 실패 시 rollback) ===
//   cycle 3 (a)·(b)·(e) 정합 — metadata.dataGrain·positionUnavailable 추가
let ingestionResult;
try {
  const parsed = detectAndParse(pasteText);  // § 4.3 — { validRows, skippedRows, errors }
  if (parsed.validRows.length === 0) {
    ingestionResult = { ok: false, error: "NSA_PASTE_EMPTY", skippedRows: parsed.skippedRows, errors: parsed.errors };
  } else {
    ingestionResult = await withSkeletonTx(ctxInput, async (tx) => {
      let rowsIngested = 0;
      // cycle 3 (a) — 모든 NSA row 에 동일 dataGrain marker
      const rowMetadata = {
        dataGrain: "naver-top30-cumulative",
        collectionDate: snapshotDate,           // 운영자 입력 기준 날짜
        sourceWindowLabel: "NSA TOP30 누적",     // UI 표시용 라벨
        positionUnavailable: true,              // cycle 3 (b) — helper aggregate skip 신호
      };
      for (const row of parsed.validRows) {
        const ctr = row.CTR / 100;  // § 4.2 % → 0~1
        await tx`
          INSERT INTO search_visibility_snapshot (
            instance_id, property_id, source, snapshot_date,
            page_url, query, impressions, clicks, ctr, avg_position, metadata
          ) VALUES (
            ${ctx.instanceId}::uuid, ${propertyId}::uuid, 'naver-searchadvisor',
            ${snapshotDate}::date,
            '',                                       -- § 4.5 sentinel
            ${row.검색키워드},
            ${row.노출}, ${row.클릭}, ${ctr},
            1000,                                     -- § 4.6 sentinel (NULL 회피)
            ${tx.json(rowMetadata)}::jsonb            -- cycle 3 (a)·(b) marker
          )
          ON CONFLICT (instance_id, property_id, snapshot_date, page_url, query)
          DO UPDATE SET
            impressions = EXCLUDED.impressions,
            clicks = EXCLUDED.clicks,
            ctr = EXCLUDED.ctr,
            metadata = EXCLUDED.metadata
            -- avg_position 은 sentinel 유지 (UPDATE 제외)
        `;
        rowsIngested += 1;
      }
      return {
        ok: true as const,
        rowsIngested,
        skippedRows: parsed.skippedRows,
        errors: parsed.errors,
      };
    });
  }
} catch (err) {
  if (isNextControlFlowError(err)) throw err;
  ingestionResult = { ok: false, error: String(err), skippedRows: 0, errors: [] };
}

// === Step 3 — release tx (별 tx · 항상 실행 · sync_state persist) ===
try {
  await withSkeletonTx(ctxInput, async (tx) => {
    if (ingestionResult.ok) {
      await tx`
        UPDATE search_sync_state
           SET last_status = 'success',
               last_sync_at = NOW(),
               last_synced_date = (SELECT MAX(snapshot_date)
                                    FROM search_visibility_snapshot
                                   WHERE instance_id = ${ctx.instanceId}::uuid
                                     AND property_id = ${propertyId}::uuid),
               last_error = NULL,
               lock_token = NULL,
               metadata = jsonb_set(metadata, '{csvRowCount}', to_jsonb(${ingestionResult.rowsIngested}::int)),
               updated_at = NOW()
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND property_id = ${propertyId}::uuid
           AND lock_token = ${lockToken}  -- 동시 sync race 방어
      `;
    } else {
      await tx`
        UPDATE search_sync_state
           SET last_status = 'failed',
               last_error = ${ingestionResult.error},
               lock_token = NULL,
               updated_at = NOW()
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND property_id = ${propertyId}::uuid
           AND lock_token = ${lockToken}
      `;
    }
  });
} catch (err) {
  console.error("[uploadNaverCsv] release tx failed", err);
  // release 실패 — 30분 stale 정책 안 자동 복구
}

return ingestionResult.ok
  ? { ok: true, rowsIngested: ingestionResult.rowsIngested, skippedRows: ingestionResult.skippedRows }
  : { ok: false, formError: ingestionResult.error };
```

> **핵심** — ingestion tx 가 rollback 되어도 lock 획득 tx 와 release tx 는 영향 없음. sync_state.last_status='failed' 가 persist.

### 4.5 page_url 미제공 + 기준 날짜 — sentinel `''` 정책 (cycle 2 G3 close)

**결정**: NSA TOP30 가 사이트 단위 집계라 **모든 row page_url 미제공**. sentinel `''` 일괄 적용.

**G3 검증 결과 (cycle 2 close)**:
- NSA 가 페이지별 분해 데이터 미제공 — **전부 미제공 시나리오 확정**
- sentinel `''` 과 "실 빈 URL" 의 충돌 위험 **없음** (NSA TOP30 에 page_url 컬럼 자체가 없음)

**snapshot_date 처리 (cycle 2 (b) 신규 — 스냅샷 모드)**:
- NSA TOP30 가 시계열이 아닌 누적 집계 표 — 일별 분해 불가
- **운영자가 ingestion 시 기준 날짜 입력** (default = 다운로드 일자)
- 동일 날짜 + 동일 query → UPSERT (재 paste 시 마지막 값 우선)
- 운영 빈도 = 시계열 해상도 (매주 paste → 7일 해상도)

**규칙**:
- ingestion 안 `page_url = ''` 일괄 (cycle 2 (d) 정합)
- snapshot_date = 운영자 입력 (cycle 2 (b) 정합)
- 집계 helper 안 sentinel 인식 — `WHERE page_url = ''` → query-only row 표시
- UI — NSA source row 는 "(페이지 정보 없음)" label

### 4.6 avg_position 미제공 — sentinel `1000` + metadata.positionUnavailable (cycle 3 (b) 강화)

**결정**: 두 layer 정책 — sentinel 값 (DB CHECK 정합) + metadata flag (aggregate skip 신호).

**이유**:
- svs.avg_position NOT NULL CHECK `> 0 AND <= 1000` — NULL 허용 변경은 GSC 기존 데이터 cascade 위험 (NSI-DEFER-10 v2+)
- **sentinel `1000` 만 으론 부족** — helper 가 magic number detect 필요. cycle 3 (b) 비평: 명시적 metadata flag 가 robust
- **C0039 신규 — search_visibility_snapshot 에 metadata jsonb 컬럼 추가** (§ 2.3 신규 절). row 별 marker 저장

**규칙**:
- ingestion 안 `avg_position = 1000` (NSA source 한정) + `metadata.positionUnavailable = true`
- **aggregate helper 안 `WHERE NOT (metadata->>'positionUnavailable' = 'true')` 필터** — weighted sum 분자·분모 모두에서 NSA row 제외 (§ 7.1 "전체" tab 정합)
- 또는 source 별 합산 — GSC 만 avg_position weighted · NSA 는 표시 안 함
- UI — `metadata.positionUnavailable=true` row 는 "순위 데이터 없음" label · avg_position 컬럼 hidden

### 4.7 CTR 단위 변환 (cycle 2 (f) 신규)

**결정**: NSA TOP30 의 CTR(%) 표기 (25, 50, 0 등 정수) → ingestion 시 `/ 100` 변환 → 0~1 저장 (svs `ctr CHECK >= 0 AND <= 1` 정합).

```ts
// parser 안 변환
const normalizedCtr = parsed.CTR / 100;  // 25 → 0.25
```

zod schema 는 paste 입력 단계에서는 `min(0).max(100)` 으로 검증.

### 4.8 page_url ↔ entity 매핑 (cycle 3 (h) numbering 정리)

sentinel `''` row 는 entity 매핑 skip (페이지 unknown). 일반 row 는 GSC 와 동일 정책 — canonical normalization (trailing slash · query string 제거 · host normalize).

### 4.9 query ↔ keyword.label 매칭 (cycle 3 (h) numbering 정리)

GSC 와 동일 — `query exact match 우선 · normalized contains 보조`. SEO_KEYWORD_STRATEGY_PLAN 정합. 한글 NFC normalize 추가.

## 5. sync action source 분기

### 5.1 기존 sync-actions.ts 수정

```ts
// apps/web/src/app/(admin)/admin/[instanceSlug]/visibility-metrics/sync-actions.ts
export async function syncSearchVisibilityAction(formData: FormData) {
  // ... auth · property 조회

  if (property.source === "naver-searchadvisor") {
    return {
      ok: false,
      formError: "네이버 source 는 클립보드 paste 로 ingestion 합니다 — /visibility-metrics/upload",
    };
  }
  // 기존 GSC 흐름 유지
  return await syncFromGsc(/* ... */);
}

export async function uploadNaverPasteAction(  // cycle 3 (d) — CSV 표기 제거
  instanceSlug: string,
  _prev: SyncActionResult | null,
  formData: FormData,
): Promise<SyncActionResult & { rowsIngested?: number; skippedRows?: number; errors?: Array<{ rowIndex: number; reason: string }> }> {
  // ... auth · property 조회 (source='naver-searchadvisor' 만)
  // ... pasteText·referenceDate 추출 → § 4.3 detectAndParse → § 4.4 3 tx
}
```

### 5.2 권한 분리 (기존 정합)

- property CRUD — super-admin
- sync (GSC) · upload (NSA CSV) — operator
- 조회 — operator

## 6. env

v1 안 NSA 자격증명 없음 — CSV path 만. `.env.example` 변경 없음. v1.x OpenAPI 합류 시 추가 (NSI-DEFER-01).

## 7. visibility-metrics 페이지 source filter

### 7.1 source tab — UI

```
[전체 (5)] [Google (3)] [네이버 (2)]
```

- "전체" = 모든 source 합산 — impressions·clicks 단순 sum · ctr·avg_position 은 weighted (impressions 가중)
- source 별 = 해당 source row 만

### 7.2 property 목록 — 실 CHECK 정합 표기 (cycle 1 #7)

| Property URL (실 형식) | Source | 검증 방식 | 마지막 sync |
|---|---|---|---|
| `https://daiet.example.kr` | Google | gsc-service-account | 2026-05-21 |
| `https://daiet.example.kr` (또는 `sc-domain:daiet.example.kr`) | 네이버 | naver-meta-tag | 2026-05-20 (CSV) |

> 동일 도메인을 양 source 로 등록 시 `(instance_id, source, property_url)` UNIQUE 정합 — 별 row 로 운영.

### 7.3 페이지/키워드 표 — source 컬럼

- source 별 row 분리 표시 (합산 아님 — 동일 (date, page, query) 가 양 source 에 있어도 별 행)
- 합산은 "전체" tab 에서만 (helper 시그니처 § 12 task #6)

### 7.4 신규 페이지 `/visibility-metrics/upload` — paste 방식 (cycle 2 (a))

- property select (source='naver-searchadvisor' 만 노출)
- **기준 날짜 input** (date picker · default = 오늘)
- **textarea paste 영역** (`<textarea>` placeholder = "NSA 콘솔의 검색 키워드 TOP30 표를 드래그·복사 후 여기 붙여넣기")
- 안내 텍스트 — NSA 콘솔 메뉴 경로 + sample HTML 안내 (외부 링크)
- 제출 → 즉시 ingestion (preview 단계 없음 · v1 dry-run defer NSI-DEFER-06)
- 결과 — success row count / skipped row count / parsed format (HTML / TSV / CSV) / 기준 날짜 표시

## 8. 매핑/집계 정책

§ 4.6·4.7 정합. NSA 특수성:

- **avg_position** — NSA 의 "평균순위" 가 GSC 의 impression-weighted average 와 동일 의미인지 미검증 — cycle 2 비평 (G1 sample 안 검증). 일단 동일 가정 — NSI-DEFER-08 합류 시 정정
- **CTR 단위** — NSA CSV 가 0.123 vs 12.3% 어느 표기인지 sample 확보 후 결정 (G2)
- **날짜 — 한국 시간대** vs UTC. NSA 는 Asia/Seoul 가정 — cycle 2
- **검색어 normalize** — 공백·대소문자·NFC normalize

## 9. errors.ts + NavMenu

### 9.1 errors.ts 신규 매핑 (cycle 2 — paste 정합)

```ts
NSA_PASTE_INVALID_SCHEMA: "표 형식을 인식할 수 없습니다. NSA 콘솔의 '검색 키워드 TOP30' 표 전체를 드래그·복사해 붙여넣으세요.",
NSA_PASTE_MALFORMED_ROW: "일부 행이 형식에 맞지 않아 건너뛰었습니다.",
NSA_PASTE_EMPTY: "붙여넣은 데이터가 비어있습니다.",
NSA_PROPERTY_NOT_VERIFIED: "네이버 서치어드바이저에서 사이트 소유 확인이 완료되지 않았습니다.",
NSA_SYNC_CONFLICT: "다른 ingestion 이 진행 중입니다. 완료 후 다시 시도하세요.",
NSA_UPLOAD_TARGET_INVALID: "데이터 업로드는 네이버 source property 에만 가능합니다.",
NSA_REFERENCE_DATE_INVALID: "기준 날짜가 유효하지 않습니다 (YYYY-MM-DD).",
```

### 9.2 NavMenu — 변경 없음

기존 "검색 노출" 메뉴가 양 source 모두 포괄. /visibility-metrics 안 source tab 으로 진입.

## 10. 검증 시나리오 (10건)

| # | marker | 내용 |
|---|---|---|
| NSI-V01 | migration | C0038 적용 후 search_property.verification_method NOT NULL CHECK · 기존 GSC row backfill 정합 |
| NSI-V02 | CSV valid | sample CSV (한글 헤더 · 10행) upload → snapshot 10 row · sync_state last_status='success' · metadata.csvRowCount=10 |
| NSI-V03 | CSV malformed | 정상 8 + malformed 2 → snapshot 8 row · sync_state metadata.skippedRowCount=2 · last_status='success' |
| NSI-V04 | CSV empty | 빈 CSV → NSA_CSV_EMPTY error · sync_state last_status='failed' · last_error 기록 |
| NSI-V05 | sentinel page_url | CSV 안 페이지 미제공 row → snapshot page_url='' · UI 안 "(페이지 정보 없음)" |
| NSI-V06 | atomicity (3 tx) | ingestion tx 안 강제 실패 시 — snapshot rollback · sync_state last_status='failed' persist (lock 획득 tx · release tx 별 tx — cycle 1 #4 정합) |
| NSI-V07 | source filter | /visibility-metrics 안 "네이버" tab 클릭 시 NSA row 만 표시 · "전체" tab 안 합산 (weighted avg position) |
| NSI-V08 | cross-tenant | instance A 의 사용자가 instance B 의 property 에 upload 시도 → ForbiddenError |
| NSI-V09 | lock | 동시 upload 2건 → 한쪽 NSA_SYNC_CONFLICT · 30분 stale 자동 해제 정합 |
| NSI-V10 | typecheck + 시각 검수 | typecheck PASS (compliance-rules pre-existing 제외) · 사용자 환경 upload UI · source tab · 7일 요약 |

## 11. fixture/mock

`apps/web/src/lib/integrations/__tests__/naver-csv-fixture.ts` — **sample 확보 후 cycle 2 안 확정 (G1)**:
- valid-utf8.csv
- valid-euckr.csv
- malformed-row.csv
- empty.csv
- empty-body.csv
- duplicate.csv
- page-url-missing.csv (sentinel `''` 시나리오)

## 12. 작업 manifest (약 8 task · cycle 1 #6 task #6 신설)

| # | depends_on | 작업 | gate |
|---|---|---|---|
| 1 | — | C0038 migration: search_property.verification_method NOT NULL + backfill — **이미 적용 완료 (commit `7c504f5`)** | — |
| 1b | — | **C0039 migration (cycle 3 (b)): search_visibility_snapshot.metadata jsonb 컬럼 신규** | — |
| 2 | 1·1b | packages/core-content/src/schema.ts: SearchPropertyVerificationMethod + searchVisibilitySnapshot.metadata 컬럼 추가 | — |
| 3 | 1b·2 | lib/admin/naver-paste-parser.ts: plain text primary + HTML secondary (cheerio) + zod 5컬럼 + No skip + CTR /100 + `{ validRows, skippedRows, errors }` 반환 | **G1·G2** ✅ |
| 4 | 3 | app/(admin)/admin/[instanceSlug]/visibility-metrics/upload/page.tsx + actions.ts: 기준 날짜 + textarea paste + **uploadNaverPasteAction** (3 tx · metadata jsonb · 결과 errors[] UI) | **G3** ✅ |
| 5 | 4 | sync-actions.ts: source 분기 — task #5 일부 완료 (commit `1fa7959`) — paste 안내 메시지 갱신 ("CSV" → "클립보드 paste") | — |
| 6 | — | lib/admin/search-visibility.ts: loadVisibilitySummary 시그니처 확장 — **task 일부 완료 (commit `70e42b8`)** — **cycle 3 (b) patch 미반영**: aggregate helper 가 `metadata->>'positionUnavailable' = 'true'` row 의 avg_position 합산 skip 처리 추가 필요 | 1b |
| 7 | 6 | visibility-metrics/page.tsx + VisibilityMetricsView: source filter tab UI · NSA row 에 "TOP30 누적 스냅샷 / 일별 데이터 아님" 강조 · verification_method 표시 · errors[] 표시 | — |
| 7 | 6 | visibility-metrics/page.tsx: source filter tab UI + property 목록 verification_method 표시 | — |
| 8 | 1~7 | errors.ts · 시나리오 · typecheck · cascade | — |

> task #1·#2·#5·#6 는 sample 확보 (G1) 의존 없음 — 병렬 진행 가능. #3·#4·#7 (UI side) 는 G1~G3 충족 후 진입.

## NSI-CASCADE (다른 plan/문서 동반 수정)

| # | 대상 | 변경 |
|---|---|---|
| NSI-CASCADE-01 | docs/decisions/SEARCH_VISIBILITY_INGEST_PLAN.md v1.0 | "source whitelist v1 google only" → "v1.x naver-searchadvisor 합류 (NAVER_SEARCH_INGEST_PLAN v0.2)" 마커. § 5.3 fixture cycle 2 안 확장 marker |
| NSI-CASCADE-02 | packages/core-content/src/schema.ts | SearchPropertyVerificationMethod type 신규 + search_property table verificationMethod 컬럼 |
| NSI-CASCADE-03 | CLAUDE.md "현재 milestone" 라인 | Phase 5.1 (네이버 source) 시작 표기 |
| NSI-CASCADE-04 | docs/decisions/SEO_KEYWORD_STRATEGY_PLAN.md KWS-DEFER-01·05 | NSA 합류 시 difficulty 자동 산정 후속 cycle 명시 |
| NSI-CASCADE-05 | docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md CIQ-DEFER-06 | NSA 합류 시 search console 기반 큐 카테고리 v1.x 명시 |
| NSI-CASCADE-06 | docs/decisions/MEANINGFUL_TRAFFIC_LOOP_PLAN.md (cycle 3 (g) 신규) | 본 plan = 측정 루프 · MEANINGFUL_TRAFFIC = 유입 생성 루프. 측정만 있고 유입 없으면 TOP30 paste 가 빈 / 저품질 데이터만 — 양 plan 의 의존 관계 marker 추가 |

## 13. 향후 cycle (본 plan v1.x 또는 별 plan)

- **v1.1 OpenAPI** — ❌ **폐기 (2026-06-01)** — 네이버 공식 API 가 키워드 분석을 제공하지 않음 (§ 1.3 NSI-DEFER-01 closed). paste 가 영구 유일 경로.
- **v1.2** — CSV dry-run preview UI · NSI-DEFER-06 해소
- **v1.3** — ✅ GSC ↔ NSA gap 분석 view · NSI-DEFER-07 **완료** (commit `33133d7`) — 단 2026-06-01 correctness 패치 적용 (§ 15)
- **v2+** — page_url NULL 허용 재설계 · NSI-DEFER-10
- **별 plan `NAVER_INDEX_HEALTH`** — NSA 공식 API 가 실제로 주는 색인/수집 현황(우리 페이지가 네이버에 색인됐는지)만 별도 진단 가치로 분리 검토. 키워드 ingestion 과 무관.
- **별 plan** — 자동 sync cron (NSI-DEFER-02) · Bing/Daum/Zum (NSI-DEFER-03) · 스마트블록 시그널 (NSI-DEFER-04) · 네이버 광고 OpenAPI (NSI-DEFER-05) · 네이버 AI 브리핑 (NSI-DEFER-09)

## 15. v1.x correctness 패치 (2026-06-01 · gap/집계 거짓 신호 3종 제거)

gap 분석 view (NSI-DEFER-07) 와 7일 요약이 머지됐으나 NSA 누적 grain 특성을 집계가 반영 못 해 **거짓 신호 3종** 발생 — 측정 루프 신뢰 훼손. 본 패치로 해소.

| # | 거짓 신호 | 원인 | 수정 |
|---|---|---|---|
| 1 | **누적 grain 이중계상** | NSA TOP30 은 `dataGrain='naver-top30-cumulative'` 누적인데 `loadVisibilitySummary`·`loadVisibilityGap` 이 윈도우 내 모든 snapshot_date 를 `SUM` (GSC 일별 가정). 한 윈도우에 NSA paste 2회 또는 긴 윈도우 시 impressions/clicks 부풀려짐. | NSA source 에 한해 **property 별 윈도우 내 최신 snapshot_date 1개만** 집계 (`WHERE source <> 'naver-searchadvisor' OR snapshot_date = (SELECT MAX(...))`). GSC 는 합산 유지. §14 #2 stale query 문제도 동시 해소. |
| 2 | **page-level gap 강제 google-only** | NSA 는 page_url 항상 sentinel `''` (사이트 단위 집계) → `WHERE page_url <> ''` 로 NSA 가 page 집계에 한 줄도 기여 못 함 → 모든 페이지가 naverImpressions=0 → 거짓 'google-only' + 거짓 "네이버 플레이스 보강" hint. | **page-level gap 제거** — query-level gap 만 유효 차원으로 유지. Google 페이지별 노출은 `loadVisibilitySummary.topPages` 에 이미 존재 (정보 손실 0). |
| 3 | **query gap 'both' 과소계상** | GSC(구글 검색어) ↔ NSA(네이버 검색어) 가 띄어쓰기/대소문자/NFC 차이로 다른 문자열이면 각각 `*-only` 로 분리 → 'both' 누락. raw query GROUP BY. | `normalizeQueryKey` (NFC + 공백 전부 제거 + lowercase) 로 cross-source 병합. 표시는 원본 query 보존. |

**검증**: vitest 326 PASS (gap 테스트 page-gap 제거 + query 정규화 2 시나리오 갱신) · typecheck 0 · web:build PASS. mock tx 가 SQL 미실행이라 패치 1(SQL WHERE)은 단위 테스트 불가 — typecheck·build·실 DB 시각 검수(NSI-V07 재검) 로 보장.

**잔여 (설계 아님 · 운영)**: §14 의 빈도 SLA·운영 runbook·verification_method enum 실 정합·데이터 보존 정책 — 본 패치 무관, 운영 누적 후 별도 결정.

## 14. cycle 4 비평 대상

cycle 3 흡수 후 잔존 불확실성:

1. **paste 의 실 브라우저 형식** — 실 NSA 콘솔에서 어드민 textarea paste 시 plain text TSV 정합 추정 — NSI-V10 시각 검수 안 확인 필요
2. **NSA TOP30 의 30 query rolling** — 매번 최신 30개. 이전 paste 안 있던 query 가 사라지면 시계열 누락. v1 = UPSERT only · 사라진 query 의 old row 보존 (delete X). cycle 4 안 운영 결정 필요 — old row 표시 정책 (visible 유지 vs metadata.stale=true marker)
3. **avg_position metadata.positionUnavailable 의 helper 처리** — task #6 patch (manifest 새 task) 가 실제로 어떻게 metadata jsonb 를 SQL WHERE 안 사용할지 — postgres.js `jsonb_path_exists` 또는 `metadata->>'positionUnavailable'` 안 어떤 인덱스 활용
4. **운영자 paste 빈도 SLA** — 매주? 매월? 권장 빈도 + 누락 시 알람 정책 — v1.x cycle 또는 별 plan
5. **NSA verification_method enum 정합** — § 2.2 의 meta-tag/html-file/dns-record 가 NSA 실 옵션과 일치 (사용자 NSA 콘솔에 등록 시 어떤 method 선택했는지 확인 가능)
6. **paste textarea max length** — `<textarea>` 안 paste max 크기 (브라우저 한계) 와 NSA TOP30 의 typical 크기 (30 row × ~100 byte ≈ 3KB) — 충분 여유
7. **운영자 안내 매뉴얼** — `docs/runbooks/NAVER_SEARCH_ADVISOR_SETUP.md` 신규 — paste 절차 step-by-step
8. **데이터 잔존 정책** — § 2.3 의 raw row 90일/180일 (SEARCH_VISIBILITY_INGEST_PLAN 정합) 이 NSA snapshot 모드와 정합한지 (스냅샷 모드는 sparse 시계열이라 다른 보존 정책 가능)
9. **§ 4.4 UPSERT 의 avg_position UPDATE 정책** — sentinel row 의 UPSERT 시 avg_position 갱신 안 함 (sentinel 유지). 기존 GSC row 가 같은 (date, '', query) 있다면 — 불가능 (GSC 는 page_url 항상 제공)
10. **30분 stale lock 자동 해제 정책** — paste ingestion 시간이 매우 짧음 (30 row 이라 < 1초) — race 위험 없음

---

> **acceptance 기준 (변경 없음)**: cycle n 비평 수렴 + typecheck (compliance-rules pre-existing 제외) + § 10 시나리오 PASS + 시각 검수 NSI-V10. **추가 gate**: G1·G2·G3 (§ 1.4) 충족.
