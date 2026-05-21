# CONTENT_IMPROVEMENT_QUEUE_PLAN (v1.0·acceptance·2026-05-21)

> **상태**: **v1.0 (acceptance)** — Phase 4 acceptance plan. cycle 1 critique (9건) 전건 흡수 + 5 task 코드 구현 완료 + typecheck 통과 (compliance-rules pre-existing 제외). compliance 검수 큐 (`review_queue_entry`) 와 명확히 분리. 즉시 발행 모드 정합. acceptance 근거: (a) improvement-queue helper · /improvement-queue 페이지 · NavMenu 메뉴 · 3 대시보드 카드 deep-link 모두 prod 스키마 정합 코드로 구현 · (b) checks jsonb zod 방어 + status polymorphic JOIN + 5 카테고리 + healthy 요약 모두 plan 명세 통과 · (c) 시각 검수 CIQ-V01~V06 은 사용자 환경에서 ad-hoc 진행.

> **cycle 1 critique 9건 흡수 marker**:
> (a) 파일/페이지 명 변경 — "Review Queue" → "Improvement Queue" (cycle 1 #1) ·
> (b) `publishable` 카테고리 제거 — 즉시 발행 모드 정합 안 의미 부정확 (cycle 1 #2) ·
> (c) `low-readiness` 카테고리 신규 (대시보드 LowReadinessPublishedCard 의 deep-link 정합) ·
> (d) 색/우선순위 재배치 — 근거 부족 (높음 · 🔴) · SEO 개선 (중간 · 🟠) · stale (시간 따라 상승 · 🟡) · 관계성 부족 (낮음 · 🟢) (cycle 1 #3) ·
> (e) `has-author-doctor` 적용 entity 범위 명시 — Article·Treatment(metadata 기반)·FAQ(미적용). Publication/Media/Doctor/Clinic 제외 (cycle 1 #4) ·
> (f) status='published' polymorphic JOIN 안 entity table 별 status fetch 명시 — snapshot 만으로 불가. Clinic/Doctor 은 status 없어 category 적용 X (cycle 1 #5) ·
> (g) 단일 SQL + TS 분류 통일 + zod/type guard 방어 (cycle 1 #6) ·
> (h) 대시보드 deep-link 정정 — LowReadinessPublishedCard → `#low-readiness` (cycle 1 #7) ·
> (i) 헤더 count 분리 — 개선 항목 (중복 포함) + 영향 콘텐츠 (distinct) (cycle 1 #8) ·
> (j) RecomputeReadinessButton 재사용 + router.refresh() 흐름 명시 (cycle 1 #9).

## SoT

- 사용자 의견 (2026-05-21) 항목 5 — "리뷰/검수 큐를 다시 전략적으로 살리기" + 7 카테고리. compliance 2종 (의료 표현 위험 · 법무 검수) 은 본 plan 범위 외.
- `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 — SVO-DEFER-04 + `seo_readiness_snapshot`
- `docs/decisions/EVIDENCE_LINKING_PLAN.md` v1.0 · `SEO_KEYWORD_STRATEGY_PLAN.md` v1.0 — readiness check 의 link/keyword 의존 정합
- 기존 packages 시그니처:
  - `apps/web/src/lib/seo-readiness/{types,catalog,evaluators/*}.ts` — `ReadinessCheck`·`CHECK_CATALOG`
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/{page,actions}.ts` — 기존 compliance 검수 큐 (NavMenu hide). 본 plan 은 별도 `/improvement-queue`
  - `apps/web/src/components/admin/visibility/RecomputeReadinessButton.tsx` — 본 plan 안 재사용 (cycle 1 #9)
  - `apps/web/src/components/admin/NavMenu.tsx` — "개선 큐" 메뉴 추가
  - `apps/web/src/components/admin/visibility/VisibilityOverviewSection.tsx` — 3 카드 deep-link 정정

> **표기 규칙**: 다른 plan 정합. 사용자 표시 = "개선 큐", 내부 키 = "improvement queue".

## 1. 목적과 범위

### 1.1 목적

- 운영자 단일 "오늘 손볼 것" 큐 — readiness fail/warn 결과 카테고리 분류.
- compliance 검수 큐와 명확히 분리 (cycle 1 #1) — `/improvement-queue` 는 SEO/readiness 일상 개선.
- 데이터 source = `seo_readiness_snapshot` + entity status JOIN. DB 변경 없음.
- **카테고리 5종** (publishable 제거 — cycle 1 #2):
  - **🔴 low-readiness** — published + grade C/D/F (대시보드 LowReadinessPublishedCard 의 source · cycle 1 #7)
  - **🔴 evidence-missing** — `has-evidence-link` fail/warn + Article·Treatment 의 `has-author-doctor` fail
  - **🟠 seo-improve** — `title-has-target-keyword` fail/warn + `summary-length-ok` fail/warn
  - **🟡 stale** — `freshness-ok` fail
  - **🟢 relations-thin** — `has-related-faq` fail + `internal-links-min` fail
- **healthy 요약** — 큐 외 별도. grade A/B + published + 모든 check pass — 헤더 footer 안 카운트만 (cycle 1 #2).

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| § 2 카테고리 매핑 catalog | `CHECK_TO_CATEGORY` + entity 적용 범위 (cycle 1 #4) + low-readiness/healthy 별도 분류 |
| § 3 ImprovementQueue 페이지 | `/admin/<slug>/improvement-queue` — 5 카테고리 섹션 + 헤더 count 분리 + RecomputeReadinessButton 재사용 (cycle 1 #8·9) |
| § 4 loadImprovementQueue helper | 단일 SQL + polymorphic LEFT JOIN 안 entity status/slug/title fetch (cycle 1 #5·6) + zod 방어 |
| § 5 NavMenu 안 "개선 큐" 메뉴 추가 | 키워드 메뉴 다음 |
| § 6 대시보드 카드 deep-link 정정 (cycle 1 #7) | UnlinkedEvidenceCard · StaleContentCard · LowReadinessPublishedCard 헤더 옆 "→ 개선 큐" |
| § 7 검증 시나리오 6건 | UI · 카운트 · low-readiness 정확성 · deep-link · zod 방어 |
| § 8 작업 manifest | 약 5 task |

### 1.3 비범위 (defer)

| 항목 | Defer | marker |
|---|---|---|
| compliance 카테고리 (의료 표현 / 법무 검수) | Phase Alpha 본 구현 합류 시 — review_queue_entry 활용 | CIQ-DEFER-01 |
| assignee · SLA · resolved 상태 추적 | review_queue_entry 기능 활용 — 본 plan 미도입 | CIQ-DEFER-02 |
| 자동 알림 (이메일·Slack·toast) | Phase 6 + notifications-outbox 합류 | CIQ-DEFER-03 |
| 캐니발리제이션 감지 | Phase 4 v1.1 (새 readiness check) | CIQ-DEFER-04 |
| 캘린더 view (stale 날짜별) | Phase 6 | CIQ-DEFER-05 |
| Search Console 기반 큐 (CTR · 노출) | Phase 5 합류 | CIQ-DEFER-06 |
| JSON-LD 결함 카테고리 (`#technical-issues`) | JsonLdDefectCard 실 데이터 생기는 시점 (validate.ts 강화) | CIQ-DEFER-07 |
| healthy 요약 클릭 시 list 표시 | M1 | CIQ-DEFER-08 |

## 2. 카테고리 매핑 catalog (cycle 1 #4·#5)

### 2.1 check key → category

```ts
import type { SeoReadinessEntityType } from "@glitzy/core-content";

export type ImprovementCategory =
  | "low-readiness"
  | "evidence-missing"
  | "seo-improve"
  | "stale"
  | "relations-thin";

const CHECK_TO_CATEGORY: Record<string, ImprovementCategory> = {
  "has-evidence-link": "evidence-missing",
  "has-author-doctor": "evidence-missing",
  "title-has-target-keyword": "seo-improve",
  "summary-length-ok": "seo-improve",
  "freshness-ok": "stale",
  "has-related-faq": "relations-thin",
  "internal-links-min": "relations-thin",
};
// low-readiness 는 score/grade/status 기반 별도 (§ 4.4)
```

### 2.2 entity 별 적용 범위 (cycle 1 #4)

| EntityType | status 컬럼 | low-readiness | evidence-missing | seo-improve | stale | relations-thin |
|---|---|---|---|---|---|---|
| Article | ✅ | ✅ | ✅ (author_doctor_id FK) | ✅ | ✅ | ✅ |
| TreatmentPage | ✅ | ✅ | ✅ (metadata.authorDoctorSlug · readiness lib `authorDoctorPresent`) | ✅ | ✅ | ✅ |
| FAQ | ✅ | ✅ | ❌ (simple evaluator 안 has-author-doctor 미적용) | ❌ (simple evaluator 안 summary-length 만) | ✅ | ❌ |
| Publication | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| MediaAppearance | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| DoctorProfile | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| ClinicProfile | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

- low-readiness · seo-improve 는 발행 콘텐츠 (Article/Treatment/FAQ).
- stale 은 모든 entity.
- evidence-missing · relations-thin 은 Article/Treatment 만 (FAQ 의 simple evaluator 미적용).

### 2.3 우선순위 + 색 (cycle 1 #3)

```
🔴 low-readiness     높음  — 발행 중인데 readiness 낮음. 가장 가시 손해
🔴 evidence-missing  높음  — E-E-A-T 시그널 부재. 의료 도메인 핵심
🟠 seo-improve       중간  — 검색 노출 직접 영향
🟡 stale             중간  — 시간 따라 상승 (90일+ 추후 강조 — CIQ-DEFER-05)
🟢 relations-thin    낮음  — 보조 시그널
```

대시보드 deep-link (cycle 1 #7): UnlinkedEvidenceCard→`#evidence-missing` · StaleContentCard→`#stale` · LowReadinessPublishedCard→`#low-readiness` · KeywordCoverageCard→`/keywords` 그대로 · JsonLdDefectCard→미연결 (CIQ-DEFER-07).

## 3. ImprovementQueue 페이지

### 3.1 헤더 + count 분리 (cycle 1 #8)

```
"콘텐츠 개선 큐"
  · 개선 항목 N건 (카테고리 중복 포함)
  · 영향 콘텐츠 M개 (distinct entity)
  · 안정권 콘텐츠 K건 (grade A/B + published)  ← healthy summary
  [전체 재계산] (RecomputeReadinessButton 재사용)
```

### 3.2 카테고리별 섹션 (priority 순)

각 섹션 anchor (`#low-readiness` · `#evidence-missing` · `#seo-improve` · `#stale` · `#relations-thin`). 0건 카테고리는 미표시.

### 3.3 동작

- 빈 상태 (snapshot 0건) → "readiness 계산이 아직 안 됐습니다 — 전체 재계산 누르세요" 안내
- RecomputeReadinessButton 의 `useTransition` 끝 `router.refresh()` 호출 (이미 컴포넌트 안 동일 패턴 — props 변경 없이 재사용 · cycle 1 #9)
- entity card 클릭 → entity 편집 페이지 (Article→articles/<slug> · Treatment→treatments/<slug> · FAQ→faqs/<slug> · Publication→publications/<slug> · Media→media-appearances/<slug> · Doctor→doctors/<slug> · Clinic→clinic-profile)
- 같은 entity 가 여러 카테고리 등장 OK (cycle 1 #8) — 각 섹션 안 해당 카테고리 위반 check 만 표시

## 4. loadImprovementQueue helper (`lib/admin/improvement-queue.ts`)

### 4.1 시그니처

```ts
export type ImprovementQueueItem = {
  entityType: SeoReadinessEntityType;
  entityId: string;
  slug: string;
  title: string;
  status: string | null;  // Clinic/Doctor 은 null
  score: number;
  grade: SeoReadinessGrade;
  failedChecks: Array<{ key: string; label: string; detail?: string; status: "fail" | "warn" }>;
};

export type ImprovementQueueOverview = {
  lowReadiness: ImprovementQueueItem[];
  evidenceMissing: ImprovementQueueItem[];
  seoImprove: ImprovementQueueItem[];
  stale: ImprovementQueueItem[];
  relationsThin: ImprovementQueueItem[];
  totalImprovementItems: number;  // 카테고리 중복 포함
  affectedEntityCount: number;    // distinct
  healthyCount: number;            // grade A/B + published + checks pass
};

export async function loadImprovementQueue(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<ImprovementQueueOverview>;
```

### 4.2 단일 SQL — entity status/slug/title polymorphic JOIN (cycle 1 #5)

```sql
SELECT
  s.entity_type, s.entity_id, s.score, s.grade, s.checks,
  COALESCE(a.slug, t.slug, f.slug, p.slug, m.slug, d.slug, cp.slug) AS slug,
  COALESCE(a.title, t.title, f.question, p.title, m.title, d.name, cp.name) AS title,
  CASE s.entity_type
    WHEN 'Article'         THEN a.status::text
    WHEN 'TreatmentPage'   THEN t.status::text
    WHEN 'FAQ'             THEN f.status::text
    WHEN 'Publication'     THEN p.status::text
    WHEN 'MediaAppearance' THEN m.status::text
    ELSE NULL
  END AS status
FROM seo_readiness_snapshot s
LEFT JOIN article a ON s.entity_type='Article' AND a.id=s.entity_id AND a.instance_id=s.instance_id
LEFT JOIN treatment_page t ON s.entity_type='TreatmentPage' AND t.id=s.entity_id AND t.instance_id=s.instance_id
LEFT JOIN faq f ON s.entity_type='FAQ' AND f.id=s.entity_id AND f.instance_id=s.instance_id
LEFT JOIN publication p ON s.entity_type='Publication' AND p.id=s.entity_id AND p.instance_id=s.instance_id
LEFT JOIN media_appearance m ON s.entity_type='MediaAppearance' AND m.id=s.entity_id AND m.instance_id=s.instance_id
LEFT JOIN doctor_profile d ON s.entity_type='DoctorProfile' AND d.id=s.entity_id AND d.instance_id=s.instance_id
LEFT JOIN clinic_profile cp ON s.entity_type='ClinicProfile' AND cp.id=s.entity_id AND cp.instance_id=s.instance_id
WHERE s.instance_id = ${instanceId}::uuid
ORDER BY s.score ASC, s.computed_at DESC
```

Clinic/Doctor 는 status NULL → low-readiness/seo-improve 자동 제외 (cycle 1 #5).

### 4.3 TS 분류 + zod 방어 (cycle 1 #6)

```ts
const checkItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  weight: z.number(),
  status: z.enum(["pass", "fail", "warn"]),
  detail: z.string().optional(),
});
const checksArraySchema = z.array(checkItemSchema);

function classifyRow(row: RawRow): { failedChecks: ...; isHealthy: boolean; isLowReadiness: boolean } {
  const parsed = checksArraySchema.safeParse(row.checks);
  if (!parsed.success) {
    console.warn("[improvement-queue] invalid checks shape", row.entity_type, row.entity_id);
    return { failedChecks: [], isHealthy: false, isLowReadiness: false };
  }
  const failedChecks = parsed.data.filter((c) => c.status !== "pass");
  const eligibleEntityType = ["Article", "TreatmentPage", "FAQ"].includes(row.entity_type);
  const isLowReadiness =
    eligibleEntityType && row.status === "published" && ["C", "D", "F"].includes(row.grade);
  const isHealthy =
    eligibleEntityType && row.status === "published" && ["A", "B"].includes(row.grade) &&
    failedChecks.length === 0;
  return { failedChecks, isHealthy, isLowReadiness };
}
```

### 4.4 카테고리 buckets 채우기

```ts
for (const row of rows) {
  const { failedChecks, isHealthy, isLowReadiness } = classifyRow(row);
  if (isHealthy) healthyCount += 1;
  const item: ImprovementQueueItem = { ... };
  if (isLowReadiness) buckets.lowReadiness.push(item);
  // failedChecks 안 CHECK_TO_CATEGORY 분류 — entity_type 별 적용 범위 (§ 2.2) 도 추가 필터
  for (const c of failedChecks) {
    const cat = CHECK_TO_CATEGORY[c.key];
    if (!cat) continue;
    if (!isApplicable(row.entity_type, cat)) continue;  // § 2.2 매트릭스
    buckets[cat].push({ ...item, failedChecks: failedChecks.filter((f) => CHECK_TO_CATEGORY[f.key] === cat) });
    break;  // 한 카테고리에 같은 entity 한 번만 (중복 push 회피 — 다른 카테고리에는 별도 push)
  }
}
```

### 4.5 헤더 count (cycle 1 #8)

- `totalImprovementItems` = sum(각 bucket length) — 카테고리 중복 포함
- `affectedEntityCount` = distinct `entity_type:entity_id` 의 union 크기
- `healthyCount` = classifyRow 안 isHealthy true 누적

## 5. NavMenu — "개선 큐" 메뉴 (cycle 1 NavMenu 추가)

`apps/web/src/components/admin/NavMenu.tsx` 의 NAV_ITEMS 안 "키워드" 다음 자리:

```ts
{
  href: (slug) => `/admin/${slug}/improvement-queue`,
  label: "개선 큐",
  match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/improvement-queue`),
},
```

`review-queue` (compliance) 는 그대로 hide.

## 6. 대시보드 카드 deep-link 정정 (cycle 1 #7)

`VisibilityOverviewSection.tsx` 안 3 카드 헤더 옆 secondary link 추가:

```tsx
<CardShell
  title="..."
  primary={...}
  secondary={
    <Link href={`/admin/${instanceSlug}/improvement-queue#<anchor>`} className="...">
      → 개선 큐
    </Link>
  }
>
```

| 카드 | anchor |
|---|---|
| UnlinkedEvidenceCard | `#evidence-missing` |
| StaleContentCard | `#stale` |
| LowReadinessPublishedCard | `#low-readiness` |

KeywordCoverageCard 의 기존 "전체 관리 → `/keywords`" 는 유지 (개선 큐 아님). JsonLdDefectCard · AverageReadinessCard 는 변경 X.

## 7. 검증 시나리오 (v1 — 6건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| CIQ-V01 | `/admin/demo/improvement-queue` 첫 진입 (재계산 전 또는 snapshot 0건) | "readiness 계산이 아직 안 됐습니다 — 전체 재계산 누르세요" 안내 |
| CIQ-V02 | "전체 재계산" 클릭 → router.refresh() | 카테고리별 카운트 + entity list + healthy 요약 footer |
| CIQ-V03 | 헤더 count 검증 | "개선 항목 N (중복 포함)" 과 "영향 콘텐츠 M (distinct)" 가 다르게 표시 (cycle 1 #8) |
| CIQ-V04 | low-readiness 카테고리 검증 | 등장 entity 의 grade ∈ {C,D,F} AND status='published' AND entity_type ∈ {Article,Treatment,FAQ} (cycle 1 #5) |
| CIQ-V05 | 대시보드 LowReadinessPublishedCard 의 "→ 개선 큐" 클릭 | `/improvement-queue#low-readiness` fragment scroll (cycle 1 #7) |
| CIQ-V06 | seo_readiness_snapshot 의 checks corrupted fixture | console.warn + 해당 entity skip · 다른 entity 정상 표시 (cycle 1 #6) |

## 8. 작업 manifest (v1 — 5 task)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | `improvement-queue.ts` helper (`lib/admin/`) — loadImprovementQueue + CHECK_TO_CATEGORY + § 2.2 적용 범위 + 단일 SQL polymorphic JOIN (cycle 1 #5) + zod 방어 (cycle 1 #6) | helper lib | — |
| 2 | `/admin/<slug>/improvement-queue/page.tsx` — 헤더 (count 분리 · cycle 1 #8) + 5 카테고리 섹션 (priority 정렬 · cycle 1 #3) + healthy footer + RecomputeReadinessButton 재사용 (cycle 1 #9) | page | 1 |
| 3 | NavMenu 안 "개선 큐" 메뉴 추가 | NavMenu | — |
| 4 | 3 대시보드 카드 (UnlinkedEvidenceCard·StaleContentCard·LowReadinessPublishedCard) 헤더 옆 "→ 개선 큐" deep-link (cycle 1 #7) | VisibilityOverviewSection | — |
| 5 | typecheck + 시각 검수 CIQ-V01~V06 + commit | — | 2·3·4 |

추정: **1~1.5일** — DB 변경 없음 · 단일 SQL + 단순 TS 분류.

## 9. CIQ-CASCADE markers

| marker | 항목 | 영향 |
|---|---|---|
| CIQ-CASCADE-01 | `seo_readiness_snapshot` 데이터 운영자 view 안 합치기 | DB 변경 없이 새 가치 회수 |
| CIQ-CASCADE-02 | EVIDENCE_LINKING_PLAN · SEO_KEYWORD_STRATEGY_PLAN 의 link/keyword readiness check 가 큐 시드 | 운영 정도가 큐 항목 수에 직접 반영 |
| CIQ-CASCADE-03 | review_queue_entry 와 분리 — compliance 워크플로 Phase Alpha 별 cycle. 파일/페이지 명 "improvement" 통일 (cycle 1 #1) | UI 분리 (`/improvement-queue` vs `/review-queue`) |
| CIQ-CASCADE-04 | RecomputeReadinessButton 재사용 — components/admin/visibility/ 컴포넌트 cross-feature 재사용 시작 | feature boundary 가 명확한 컴포넌트의 자연스러운 확장 |

## 10. 변경 이력

- **2026-05-21**: v0.1 draft 작성 (이전 파일명 `CONTENT_REVIEW_QUEUE_PLAN.md`).
- **2026-05-21**: v0.2 draft — cycle 1 critique (9건) 전건 수용:
  - cycle1-#1 파일/페이지 명 변경 — "Review Queue" → "Improvement Queue". `CONTENT_REVIEW_QUEUE_PLAN.md` → `CONTENT_IMPROVEMENT_QUEUE_PLAN.md` (mv). compliance 검수 큐와 명확 분리.
  - cycle1-#2 publishable 카테고리 제거 — 즉시 발행 모드 충돌. healthy 요약 (grade A/B + published + checks pass) 으로 헤더 footer 안 카운트만.
  - cycle1-#3 색/우선순위 재배치 — low-readiness · evidence-missing 🔴 / seo-improve 🟠 / stale 🟡 / relations-thin 🟢.
  - cycle1-#4 has-author-doctor entity 적용 범위 명시 (§ 2.2 매트릭스). FAQ 안 미적용 (simple evaluator).
  - cycle1-#5 status polymorphic JOIN 안 fetch (CASE WHEN ... ELSE NULL) — Clinic/Doctor 자동 제외.
  - cycle1-#6 단일 SQL + TS 분류 + checks jsonb zod 방어.
  - cycle1-#7 deep-link 정정 — LowReadinessPublishedCard → `#low-readiness` (새 카테고리). JsonLdDefect 미연결 (CIQ-DEFER-07).
  - cycle1-#8 헤더 count 분리 — 개선 항목 (중복 포함) + 영향 콘텐츠 (distinct).
  - cycle1-#9 RecomputeReadinessButton 재사용 — 기존 useTransition + router.refresh() 패턴 그대로.
