# CONTENT_CALENDAR_PLAN (v1.0·acceptance·2026-05-26)

> **상태**: **v1.0 (acceptance)** — cycle 1 (15건) + cycle 2 (9건) + cycle 3 (7건) + cycle 4 (3건) + cycle 5 (0건 · 수렴) self-critique 전건 흡수. **누계 34건 · 5 cycle 수렴**. acceptance 근거: (a) v1 scope = read-only 일정 시각화 (DB 변경 X) · (b) 7 entity (Article·Treatment·Condition·FAQ·Publication·Media·LegalDocument) UNION ALL + KST date slice · (c) stale-threshold = updated_at + 30일 (freshness evaluator 정합) · (d) 월 grid (일요일 시작 · 7 entity icon · count+emoji dot) + EventListView (7 chip filter) · (e) CCAL-CASCADE 4건 (CIQ-DEFER-05 흡수 · NavMenu · SVO Phase 6 완주 · CLAUDE milestone).

> **cycle 4 흡수 (3건 · minor)** + **cycle 5 (0건 · 수렴)**:
> (a) **#32** "오늘 = today" 판정 = KST 기준 (formatKstDate(new Date()) vs cell date 비교) ·
> (b) **#33** entity filter 7 chip 순서 = NavMenu 의 entity 순서 답습 (Article → Treatment → Condition → FAQ → Publication → Media → LegalDocument) ·
> (c) **#34** month navigation limit 미적용 (먼 미래/과거 navigate 가능) — v1 simple ·
> **cycle 5 수렴** — plan 변경 0건. § 10.2 acceptance criteria #1 충족.

> **cycle 3 흡수 (7건 · 수렴기)**:
> (a) **#25** admin `/admin/<slug>/conditions/<slug>` 경로 존재 확인 (NavMenu 정합) ·
> (b) **#26** improvement-queue.ts stale category (이미 30일+ stale) vs 본 plan stale-threshold (30일 도래 예고) 시점 차이 명시 ·
> (c) **#27** entity filter 6 chip = all selected default · 일부 deselect 시 그 entity 만 제외 ·
> (d) **#28** CCAL-V09 padding day click → month navigation 시나리오 추가 ·
> (e) **#29** LegalDocument stale 비범위 — CCAL-DEFER-10 ·
> (f) **#30** vitest 안 KST 자정 경계 시나리오 (MEANINGFUL_TRAFFIC 답습) ·
> (g) **#31** v1.0 acceptance — dev DB 안 published 1+ row 필요 명시.

> **cycle 2 흡수 (9건)**:
> (a) **#16** FAQ slug column 있음 — `slug` 사용 (id 기반 link 가정 오류) ·
> (b) **#17** LegalDocument slug column 있음 — `type::text` 대신 `slug` 사용 ·
> (c) **#18** entity link path mapping — LegalDocument 는 `/clinic-profile` (통합 form · slug 무관) ·
> (d) **#19** cell dot 표시 = count + emoji 형식 (예 "🟢2 🟡1") ·
> (e) **#20** padding day click → `?month=YYYY-MM` navigation KST 정합 ·
> (f) **#21** `effective_date` (date 타입) KST 변환 불요 ·
> (g) **#22** SQL `(timestamp AT TIME ZONE 'Asia/Seoul')::date` semantic 정확 ·
> (h) **#23** v1.0 acceptance 시 SEO_VISIBILITY_OPS Phase 6 권장 순서 완주 marker (CCAL-CASCADE-03) ·
> (i) **#24** **stale-threshold base 정정 — `updated_at` 기반** (freshness evaluator FRESHNESS_DAYS=30 + updatedAt 정합 · v0.2 안 `published_at` 가정 오류). 적용 entity = Article · Treatment · Condition · FAQ · Publication · Media (6 entity — LegalDocument 미적용). v1 acceptance scope = **read-only 일정 시각화** (DB 변경 X · scheduling X · alert X). 기존 **7 entity** (Article · TreatmentPage · **MedicalConditionPage** · FAQ · Publication · MediaAppearance · LegalDocument) 의 `published_at` · `effective_date` 만 시각화. stale-threshold (published_at + 30일) 도 별 event type 으로 합류. CIQ-DEFER-05 ("캘린더 view (stale 날짜별)") 본 cycle 안 흡수.

> **cycle 1 흡수 (15건)**:
> (a) **#1** `medical_condition_page` (Conditions) 합류 — 7 entity 로 확장 (Article·Treatment·**Condition**·FAQ·Publication·Media·LegalDocument) ·
> (b) **#2** NavMenu mount 위치 — "검색 노출" 다음 자리 (Phase 6 = SVO 권장 순서 마지막 정합) ·
> (c) **#3** `policy_effective_date` (ClinicProfile metadata) 비범위 명시 — legal_document.effective_date 만 ·
> (d) **#4** 월 grid 시작 요일 = 일요일 (한국 default) ·
> (e) **#5** stale-threshold 30일 = improvement-queue.ts 의 freshness evaluator 와 정합 — 동일 임계값 사용 ·
> (f) **#6** month query zod regex (`^\d{4}-(0[1-9]|1[0-2])$`) + invalid 시 KST 이번 달 fallback ·
> (g) **#7** accessibility — `<th scope="col">` + `aria-label` + keyboard navigation 명시 ·
> (h) **#8** padding day 클릭 = 다음/이전 월 navigation (cell 자체 dim · 일정 dot 만 표시 · 클릭 시 그 월로 이동) ·
> (i) **#9** legal_document type 라벨 한글 mapping (privacy → "개인정보처리방침" 등) ·
> (j) **#10** EventListView entity filter = local React state · URL persistance 미적용 (CCAL-DEFER-09 신설) ·
> (k) **#11** padding day event fetch — startDate/endDate 안 padding 포함 (grid 안 padding cell 의 dot 정확) ·
> (l) **#12** 데이터 0건 dev 환경 fallback — "이번 달 일정 없음" 안내 명시 ·
> (m) **#13** 동일 날 published + effective 2 dot — LegalDocument 의 published_at == effective_date 시 2 row OK ·
> (n) **#14** 요일 column header 한글 (일·월·화·수·목·금·토) ·
> (o) **#15** 본 plan = DB 변경 X · 마이그레이션 X 명시.

## SoT

- 사용자 의견 (2026-05-21) 항목 6 — "콘텐츠 캘린더 (발행 일정 가시화)" · SVO Phase 6 권장 순서 마지막.
- `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 — Phase 6 권장 순서 마지막 단계로 본 plan.
- `docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md` v1.0 CIQ-DEFER-05 — "캘린더 view (stale 날짜별)" 본 cycle 흡수.
- 기존 packages 시그니처:
  - `packages/core-content/src/schema.ts` 7 entity 의 `published_at` (Article/Treatment/FAQ/Publication/Media) + `effective_date` (LegalDocument)
  - `apps/web/src/lib/admin/improvement-queue.ts` — stale 카테고리의 freshness check 정합
  - `apps/web/src/components/admin/NavMenu.tsx` — "캘린더" 메뉴 추가 (실 NAV_ITEMS 안 "검색 노출" 다음 자리 · cycle 1 #2)
  - `apps/web/src/lib/seo-readiness/evaluators/freshness.ts` (또는 동등) — 30일+ stale 임계

> **표기 규칙**: 사용자 표시 = "콘텐츠 캘린더", 내부 키 = "content calendar" · "calendar event".

## 1. 목적과 범위

### 1.1 목적

- 운영자 단일 "발행 일정 view" — 7 entity 의 published_at + LegalDocument effective_date + stale 임계 도래일.
- DB 변경 X — 기존 column 만 사용. scheduled_publish_at 등 신규 column 추가 비범위 (CCAL-DEFER-01).
- 운영자가 "지난 주 발행" · "다음 주 stale 임박" · "이번 달 활동 밀도" 시각화. 마감 임박 alert 는 in-app 합류 시점 (CCAL-DEFER-04).

### 1.2 범위 (v1 — 포함)

| § | 항목 | 비고 |
|---|---|---|
| 2 | 데이터 source 매핑 catalog | 7 entity + readiness stale → CalendarEvent normalize |
| 3 | `loadCalendarEvents` helper | 단일 SQL polymorphic UNION ALL (7 entity 의 published_at + LegalDocument effective_date 추가 + readiness stale 임계) · zod 방어 |
| 4 | `/admin/<slug>/calendar` 페이지 | `?month=YYYY-MM` query string · 월 navigation 화살표 · 이번 달 default |
| 5 | UI — `MonthGridView` + `EventListView` 분할 | 좌측 월 grid (7×6) + 우측 list (날짜순 + entity filter) |
| 6 | NavMenu 안 "캘린더" 메뉴 추가 | "개선 큐" 다음 자리 |
| 7 | 검증 시나리오 CCAL-V01~V08 | 월 navigation · 데이터 source · entity filter · stale 표시 · 빈 월 · 권한 |
| 8 | 작업 manifest 5 task | helper · page · 2 view 컴포넌트 · NavMenu · vitest |
| 9 | CCAL-CASCADE 4건 | CIQ-DEFER-05 흡수 · NavMenu · seo_readiness 정합 · CLAUDE milestone |

### 1.3 비범위 (defer · CCAL-DEFER)

| 항목 | Defer | marker |
|---|---|---|
| scheduled_publish_at 컬럼 + 예약 발행 cron | 별 cycle — 사용자 확인 후 ("예약 발행" UX 요구 시점) | CCAL-DEFER-01 |
| content_calendar_event 신규 entity (사용자 추가 schedule) | v2+ — 운영 패턴 안정화 후 | CCAL-DEFER-02 |
| week/day view (월만 v1) | v2+ — 사용자 사용 패턴 관찰 후 | CCAL-DEFER-03 |
| 마감 임박 alert (3일/7일 전) | NF-DEFER-01 (notifications NotificationInbox UI) 본 구현 후 | CCAL-DEFER-04 |
| .ics 파일 export (iCal 호환) | v2+ — 외부 캘린더 통합 요구 시 | CCAL-DEFER-05 |
| 마케팅 burst / holiday block 일정 | v2+ — content_calendar_event 합류 시 | CCAL-DEFER-06 |
| drag-and-drop 일정 변경 | scheduled_publish_at 합류 후 | CCAL-DEFER-07 |
| 색 customization (entity type 별 color) | v1 hardcode · 운영자 customization 은 v2+ | CCAL-DEFER-08 |
| EventListView entity filter 의 URL persistance | v1 = local React state · 새로고침 시 reset (cycle 1 #10) | CCAL-DEFER-09 |
| LegalDocument stale-threshold | 운영적 의미 미세 (법적 문서 1년 1회 갱신) — v2+ 사용자 요구 시 (cycle 3 #29) | CCAL-DEFER-10 |

## 2. 데이터 source 매핑

### 2.1 CalendarEvent normalize 타입

```ts
export type CalendarEventType =
  | "published"        // entity 의 published_at 도달
  | "effective"        // LegalDocument 의 effective_date 도달
  | "stale-threshold"; // readiness freshness 임계 도래 (published_at + 30일)

export type CalendarEntityType =
  | "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ"
  | "Publication" | "MediaAppearance" | "LegalDocument";

export type CalendarEvent = {
  id: string;                  // "<entityType>:<entityId>:<eventType>"
  date: string;                // KST YYYY-MM-DD
  eventType: CalendarEventType;
  entityType: CalendarEntityType;
  entityId: string;
  slug: string | null;
  title: string;
};
```

### 2.2 source → event 매핑

| Entity | column | eventType | 비고 |
|---|---|---|---|
| Article (status='published') | `published_at` | `published` | KST date slice |
| TreatmentPage (status='published') | `published_at` | `published` | 동일 |
| MedicalConditionPage (status='published') | `published_at` | `published` | cycle 1 #1 |
| FAQ (status='published') | `published_at` | `published` | 동일 |
| Publication (status='published') | `published_at` | `published` | 동일 |
| MediaAppearance (status='published') | `published_at` | `published` | 동일 |
| LegalDocument (status='published') | `published_at` | `published` | 동일 |
| LegalDocument (status='published') | `effective_date` | `effective` | published_at 과 같은 날 OK (cycle 1 #13 — 같은 cell 안 🟢+🟦 2 dot) |
| Article/Treatment/Condition/FAQ/Publication/Media (status='published') | `updated_at + INTERVAL '30 days'` | `stale-threshold` | freshness evaluator (`shared.ts FRESHNESS_DAYS=30` + `updatedAt` base) 정합 (cycle 2 #24). LegalDocument 미적용 (운영적 의미 미세) |

> v1 안 ClinicProfile · DoctorProfile · Conditions · etc 미포함 (status column 부재 또는 항상 fresh — `improvement-queue.ts` 의 stale 카테고리 정합).

### 2.3 색 + icon (CCAL-DEFER-08 hardcode v1)

```
published     🟢 발행
effective     🟦 발효 (LegalDocument)
stale-threshold 🟡 stale 도달 임박 (30일+)
```

entity icon (list view 안):
- Article: 📝 · TreatmentPage: 🏥 · MedicalConditionPage: 🩺 · FAQ: 💬 · Publication: 📚 · MediaAppearance: 🎬 · LegalDocument: ⚖️

LegalDocument type 라벨 한글 mapping (cycle 1 #9):
- privacy → "개인정보처리방침"
- terms → "이용약관"
- non-covered → "비급여 안내"
- refund → "환불 약관"
- complaint → "민원 처리"
- cookie → "쿠키 정책"
- other → "기타"

## 3. `loadCalendarEvents` helper

### 3.1 시그니처

```ts
// apps/web/src/lib/admin/calendar-events.ts
export async function loadCalendarEvents(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { startDate: string; endDate: string },  // KST YYYY-MM-DD inclusive
): Promise<CalendarEvent[]>;
```

### 3.2 단일 SQL (polymorphic UNION ALL)

```sql
-- 7 entity 의 published_at 안 KST date slice (`AT TIME ZONE 'Asia/Seoul'`).
-- LegalDocument 만 effective_date 추가 row.
-- stale-threshold 는 published_at + INTERVAL '30 days' 안 (Article/Treatment/FAQ 만).
SELECT * FROM (
  SELECT 'Article' AS entity_type, id, slug, title,
         (published_at AT TIME ZONE 'Asia/Seoul')::date AS event_date,
         'published' AS event_type
    FROM article WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
  UNION ALL
  SELECT 'Article' AS entity_type, id, slug, title,
         ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date AS event_date,
         'stale-threshold' AS event_type
    FROM article WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL
  UNION ALL
  -- TreatmentPage · MedicalConditionPage · FAQ · Publication · MediaAppearance 의 published_at + stale-threshold (updated_at+30d) 동일 패턴
  -- ... LegalDocument 는 published 만 (stale-threshold 미적용 · cycle 2 #24)
  UNION ALL
  -- LegalDocument 의 effective_date 추가 (date 타입 라 KST 변환 불요 · cycle 2 #21)
  SELECT 'LegalDocument', id, slug, title,
         effective_date AS event_date,
         'effective' AS event_type
    FROM legal_document WHERE instance_id = ${instanceId}::uuid AND status='published' AND effective_date IS NOT NULL
) all_events
WHERE event_date BETWEEN ${startDate}::date AND ${endDate}::date
ORDER BY event_date ASC
```

### 3.2.1 padding range — 월 grid 안 첫 주/마지막 주 cell 정합 (cycle 1 #11)

`startDate` = 표시 월 1일 의 KST 요일 → 일요일 시작 시 그 주의 일요일 (이전 달 padding day 포함).
`endDate` = 표시 월 말일 의 KST 요일 → 그 주의 토요일 (다음 달 padding day 포함).
이렇게 fetch 시 padding cell 안 dot 도 정확. 한 SQL 호출 안 모든 event.

### 3.3 zod 방어

```ts
const calendarEventSchema = z.object({
  entity_type: z.enum(["Article","TreatmentPage","FAQ","Publication","MediaAppearance","LegalDocument"]),
  id: z.string().uuid(),
  slug: z.string().nullable(),
  title: z.string(),
  event_date: z.union([z.string(), z.date()]),  // postgres.js Date | string 정합
  event_type: z.enum(["published","effective","stale-threshold"]),
});
```

## 4. `/admin/<slug>/calendar` 페이지

### 4.1 URL + searchParams

- 경로: `/admin/<instanceSlug>/calendar`
- query: `?month=YYYY-MM` (default = KST 오늘 기준 이번 달)
- navigation: `← 이전 달` / `다음 달 →` (Link href 안 month 변경)

**month query 검증 (cycle 1 #6)**:

```ts
const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
function parseMonth(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (typeof v === "string" && MONTH_REGEX.test(v)) return v;
  // KST 이번 달 fallback
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit",
  }).format(new Date()).slice(0, 7);
}
```

### 4.2 데이터 범위

- startDate = 표시 월 1일 - (월 grid 첫 주 안 이전 달 padding 일수) — 보통 0~6일
- endDate = 표시 월 말일 + (월 grid 마지막 주 안 다음 달 padding 일수)
- 한 번 SQL 호출 안 모든 event fetch

### 4.3 권한

- operator · legal-reviewer · physician-reviewer · client-approver · super-admin 모두 가시 (다른 admin 페이지 기본 동일).

## 5. UI — MonthGridView + EventListView 분할

### 5.1 layout

```
┌─────────────────────────────────────────────────────────────┐
│ "콘텐츠 캘린더"             [← 이전] 2026년 5월 [다음 →]    │
├─────────────────────────────────────────────────────────────┤
│                                       │                     │
│   ┌─────┬─────┬─────┬─────┬─────┐    │ "이번 달 일정"      │
│   │ 일  │ 월  │ 화  │ 수  │ 목  │ ...│ ────────────────    │
│   ├─────┼─────┼─────┼─────┼─────┤    │ 5/26 · 📝 Article 5│
│   │ 28  │ 29  │ 30  │ 1   │ 2   │    │   "다이어트 한약   │
│   │     │     │     │ 🟢2 │     │    │   요요 방지법"     │
│   ├─────┼─────┼─────┼─────┼─────┤    │ 5/27 · 🟡 stale 1  │
│   │ 3   │ 4   │ 5   │ 6   │ 7   │    │   "출산 후 한약"   │
│   │     │ 🟢1 │     │     │ 🟦1 │    │ 5/30 · ⚖️ Legal 1 │
│   └─────┴─────┴─────┴─────┴─────┘    │ ...                 │
│                                       │                     │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 MonthGridView

- 7×6 grid · 첫 column = **일요일** (한국 default · cycle 1 #4)
- 요일 column header 한글 (일·월·화·수·목·금·토 · cycle 1 #14)
- 각 cell 안: 날짜 (오늘 = `bg-brand-primary-soft`) + count + emoji 형식 dot summary (예 "🟢2 🟡1" · cycle 2 #19)
- cell 클릭 시 — 우측 list 의 해당 날짜 highlight + scroll
- 이전/다음 달 padding day = `text-fg-muted` (dim) · dot 도 표시 (data 있을 때 · cycle 1 #11)
- padding day cell 클릭 시 — 그 월 (`?month=YYYY-MM`) 로 navigation (cycle 1 #8)
- accessibility (cycle 1 #7): `<table>` semantic + `<th scope="col">` 요일 + `<td>` 안 `aria-label="2026-05-26 · 일정 N건"` + `tabIndex={0}` keyboard navigation

### 5.3 EventListView

- 날짜 오름차순 그룹화 (날짜 header + 그 날의 event 목록)
- 각 event row: `<entity icon> <eventType color dot> <title>` + entity link mapping (cycle 2 #18):
  - Article → `/admin/<slug>/articles/<slug>`
  - TreatmentPage → `/admin/<slug>/treatments/<slug>`
  - MedicalConditionPage → `/admin/<slug>/conditions/<slug>`
  - FAQ → `/admin/<slug>/faqs/<slug>` (slug 사용 · cycle 2 #16)
  - Publication → `/admin/<slug>/publications/<slug>`
  - MediaAppearance → `/admin/<slug>/media-appearances/<slug>`
  - LegalDocument → `/admin/<slug>/clinic-profile#legal` (통합 form · slug 무관 · cycle 2 #17·#18)
- entity type filter (Article·Treatment·Condition·FAQ·Publication·Media·LegalDocument · 7 chip · v1 hardcode)
- v1 안 filter state = local React state (URL persistance 미적용 · CCAL-DEFER-09)
- 동작 (cycle 3 #27): all selected = default · 일부 deselect 시 그 entity 만 제외 · 모두 deselect 시 "필터로 모든 entity 제외 — 표시 결과 없음" 안내

### 5.4 빈 월 처리

- event 0건 시: list 안 "이번 달 일정 없음 · 콘텐츠 발행 시 자동 표시됩니다" 안내
- grid 는 항상 표시 (날짜 cell 만)

## 6. NavMenu 안 "캘린더" 메뉴

- `apps/web/src/components/admin/NavMenu.tsx` 안 NAV_ITEMS 안 "검색 노출" 다음 자리 (cycle 1 #2):

```ts
{
  href: (slug) => `/admin/${slug}/calendar`,
  label: "캘린더",
  match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/calendar`),
},
```

## 7. 검증 시나리오 (v1 — 8건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| CCAL-V01 | `/admin/demo/calendar` 첫 진입 (month 미지정) | KST 오늘 기준 이번 달 default 표시 + 월 grid + list |
| CCAL-V02 | "다음 달 →" 클릭 | URL `?month=YYYY-MM` 변경 + 새 월 데이터 fetch |
| CCAL-V03 | 데이터 source — Article 발행 | 그 날 grid cell 안 🟢 dot + list 안 "📝 Article" + title |
| CCAL-V04 | LegalDocument effective_date ≠ published_at | 같은 entity 가 published(🟢) + effective(🟦) 2 event 안 표시 |
| CCAL-V05 | stale-threshold — published_at + 30일 | 그 날 grid cell 안 🟡 dot + list 안 "stale 임박" |
| CCAL-V06 | entity filter (list 안 FAQ chip 클릭) | list 안 FAQ event 만 표시 · grid dot count 정합 |
| CCAL-V07 | 빈 월 (데이터 0건) | grid 정상 + list 안 "이번 달 일정 없음" 안내 |
| CCAL-V08 | 권한 — operator 가 캘린더 진입 | 정상 표시 (super-admin 외 권한 모두 가시) |
| CCAL-V09 | padding day click → month navigation (cycle 3 #28) | 표시 월의 이전 달 padding 일 (예 5월 grid 안 4월 28일) click → `?month=2026-04` 변경 + 4월 데이터 fetch |

vitest fixture (v1):
- `apps/web/src/lib/admin/__tests__/calendar-events.test.ts` — KST window (자정 경계 · cycle 3 #30) · 7 entity UNION ALL · stale-threshold updated_at+30d · zod 방어 · 빈 결과 · parseMonth (invalid → KST fallback)

## 8. 작업 manifest (v1 — 5 task)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | `loadCalendarEvents` helper — `lib/admin/calendar-events.ts` (단일 SQL UNION ALL + zod) | helper lib | — |
| 2 | `/admin/<slug>/calendar/page.tsx` — searchParams.month + loadCalendarEvents 호출 + layout | page | 1 |
| 3 | `MonthGridView` + `EventListView` 컴포넌트 — `components/admin/calendar/{MonthGridView,EventListView,EntityIcon}.tsx` | 3 컴포넌트 | 1 |
| 4 | NavMenu 안 "캘린더" 메뉴 추가 (개선 큐 다음 자리) | NavMenu | — |
| 5 | vitest fixture (calendar-events.test.ts) + typecheck + 시각 검수 CCAL-V01~V08 + commit | — | 1·2·3·4 |

**추정**: 1~1.5일 (DB 변경 X · 단일 SQL + 단순 UI).

## 9. CCAL-CASCADE markers

| marker | 대상 | patch 디테일 |
|---|---|---|
| CCAL-CASCADE-01 | `docs/decisions/CONTENT_IMPROVEMENT_QUEUE_PLAN.md` | CIQ-DEFER-05 ("캘린더 view (stale 날짜별)") 해소 marker. 본 plan 안 stale-threshold event type 으로 흡수 |
| CCAL-CASCADE-02 | `apps/web/src/components/admin/NavMenu.tsx` | "개선 큐" 다음 자리 "캘린더" 추가 |
| CCAL-CASCADE-03 | `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` | Phase 6 권장 순서 마지막 단계 완료 marker (v1.0 acceptance 시 · cycle 2 #23). SVO 권장 순서 (3 evidence → 2 keyword → 4 improvement-queue → 5 search-console → 5.1 NSA → 6.5 traffic → 6 calendar) 완주 |
| CCAL-CASCADE-04 | `CLAUDE.md` 안 "현재 milestone" 행 | Phase 6 — CONTENT_CALENDAR v1.0 acceptance 시 추가 |

## 10. v1 acceptance criteria

본 plan 의 v1.0 도달은 아래 모두 충족 시점.

### 10.1 plan + code 같은 cycle 합류

- CONTENT_IMPROVEMENT_QUEUE_PLAN v1.0 패턴 답습 (MEANINGFUL_TRAFFIC v1.0 도 동일) — plan acceptance 와 code acceptance 같은 cycle 안 진행
- self-critique 수렴 cycle 1회 도달 시 acceptance

### 10.2 acceptance 충족 조건

1. self-critique 안 추가 변경 X (수렴) 인 cycle 1회 도달
2. § 8 manifest 5 task 완료 (helper · page · 3 components · NavMenu · vitest)
3. 검증 시나리오 CCAL-V01~V08 사용자 환경 안 시각 검수
4. typecheck PASS · vitest 전체 PASS (신규 calendar-events.test.ts 포함)
5. dev 안 `/admin/demo/calendar` 실 데이터 표시 확인 — dev DB 안 published 1+ row 필요 (cycle 3 #31). 데이터 0건 시 안내만 표시되어 시각 검수 의의 부족

### 10.3 v1.0 milestone marker

acceptance 시 — `memory/milestone_content_calendar_v1.md` 작성 + `CLAUDE.md` 안 "현재 milestone" 한 줄 + 변경 이력 추가 (CCAL-CASCADE-04).

## 12. v1.1 — CCAL-DEFER-02 (content_calendar_event · 2026-06-01)

> read-only v1(발행 역사 시각화)에 **forward 기획**을 보강. 운영자가 "계획된 콘텐츠"를 캘린더에 직접 추가. 사용자 결정: 범위 = **계획 marker + done 토글** (full lifecycle 미채택).

### 12.1 entity (C0050 · manifest 외)

`content_calendar_event` — `title` · `planned_date` · `entity_type`(nullable · 아이콘/필터용 7 type) · `note`(nullable · ≤500) · `done`(boolean) · `created_by`(uuid · triggered_by 패턴 · FK 없음) · timestamps. RLS tenant_isolation (keyword_target C0031 패턴) · index (instance_id, planned_date) + 미완료 부분 index.

### 12.2 구현

- `lib/admin/calendar-planned-events.ts` — `PlannedCalendarEvent` 타입 + `loadPlannedEvents(tx, instanceId, {startDate, endDate})` (zod 방어).
- `calendar/actions.ts` — create · update · delete · toggleDone (operator-edit-content + withSkeletonTx + SaveResult + revalidatePath).
- `components/admin/calendar/CalendarPlannerPanel.tsx` (client) — 추가 폼(title·date·entityType·note) + 목록(date 정렬 · done 체크 토글 · 수정 · 삭제).
- MonthGridView 에 `plannedEvents` prop → 📌 dot (done = ✅). page.tsx 에서 `Promise.all` 로 events + plannedEvents 동시 로드 + aside 에 panel mount.

### 12.3 범위/defer

- 채택: marker + done. **미채택**(CCALE-DEFER): full status lifecycle · scheduled auto-publish(CCAL-DEFER-01 별도) · linked entity 자동 해소 · 반복 일정.
- 계획 일정은 published 파생 event 와 별 source — 기존 7 entity 필터와 독립. grid 에는 📌 dot 합류, list 관리는 전용 panel.

### 12.4 검증

- CCALE-V01 loadPlannedEvents range 필터 + zod · V02 create/update/delete/toggleDone SaveResult · V03 RLS cross-tenant 차단 · V04 typecheck·vitest·web:build.

## 11. 변경 이력

- **2026-05-26**: v0.1 draft 작성 — Phase 6 SVO 권장 순서 마지막. scope 결정 사용자 확인 (read-only · 월 grid+list · alert 미포함). 6 entity + LegalDocument effective_date + stale-threshold UNION ALL. DB 변경 X. CIQ-DEFER-05 흡수.
- **2026-05-26**: **v1.0 acceptance** — cycle 4 (3건) + cycle 5 (0건 수렴) 흡수:
  - **#32** today 판정 KST · **#33** entity filter 순서 = NavMenu 답습 · **#34** month navigation limit 미적용 simple · **cycle 5 수렴** acceptance.

- **2026-05-26**: v0.4 draft — cycle 3 self-critique (7건) 전건 흡수 (수렴기):
  - **#25** conditions admin 경로 정합 · **#26** improvement-queue stale vs 본 plan stale-threshold 시점 차이 · **#27** entity filter 7 chip 동작 명세 (all deselect 안내 포함) · **#28** CCAL-V09 padding day month navigation · **#29** CCAL-DEFER-10 LegalDocument stale 비범위 · **#30** vitest KST 자정 경계 · **#31** dev DB published 1+ row 필요 명시

- **2026-05-26**: v0.3 draft — cycle 2 self-critique (9건) 전건 흡수:
  - **#16~#17** FAQ + LegalDocument slug column 활용 · **#18** entity link path mapping (LegalDocument → clinic-profile) · **#19** count + emoji dot 형식 · **#20** padding day month navigation KST · **#21** effective_date date 타입 KST 변환 불요 · **#22** SQL semantic 정확 · **#23** CCAL-CASCADE-03 SVO 권장 순서 완주 marker · **#24** **stale-threshold base 정정 updated_at** (FRESHNESS_DAYS=30 + updatedAt freshness evaluator 정합) · 적용 entity = 6 (LegalDocument 제외)

- **2026-05-26**: v0.2 draft — cycle 1 self-critique (15건) 전건 흡수:
  - **#1** MedicalConditionPage 합류 → 7 entity · **#2** NavMenu "검색 노출" 다음 자리 · **#3** policy_effective_date 비범위 · **#4** 일요일 시작 (한국) · **#5** stale-threshold = improvement-queue freshness 정합 · **#6** month query zod regex + KST fallback · **#7** accessibility (table semantic + aria-label + tabIndex) · **#8** padding day 클릭 = 월 navigation · **#9** legal_document type 한글 mapping · **#10** filter URL persistance CCAL-DEFER-09 · **#11** padding range fetch 정합 (§ 3.2.1 신규) · **#12** 데이터 0건 안내 · **#13** 같은 날 published+effective 2 dot OK · **#14** 요일 한글 column · **#15** DB 변경 X 명시
