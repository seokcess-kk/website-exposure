# SEO_KEYWORD_STRATEGY_PLAN (v1.0·acceptance·2026-05-21)

> **상태**: **v1.0 (acceptance)** — Phase 2 acceptance plan. SEO_VISIBILITY_OPS_PLAN v1.0 SVO-DEFER-01 본 구현 완료. cycle 1 critique 10건 전건 흡수 + 11 task 모두 typecheck 통과. acceptance 근거: (a) keyword-content-link · keyword-parent-options helper · KeywordTargetForm · KeywordContentLinkPanel · saveKeywordTarget / deleteKeywordTarget server actions · 3 page (list · new · edit) · NavMenu 통합 · errors.ts CHECK 매핑 · 5 entity delete action cleanup · visibility-overview denominator 정정 모두 prod 스키마 정합 코드로 구현 · (b) typecheck 통과 (compliance-rules pre-existing 제외) · (c) cycle 1 의 핵심 안전성 (parent primary 검증 · primary 삭제 차단 · orphan cleanup · affected entity 선조회 · formData.getAll() 직렬화) 모두 반영. 시각 검수 KWS-V01~V10 은 사용자 환경에서 ad-hoc 진행.

> **cycle 1 critique 10건 흡수 marker**:
> (a) parent primary 검증 (§ 3.3) — secondary→secondary 차단 + 자기 자신 parent 금지 + primary 전환 시 parent NULL ·
> (b) primary 삭제 정책 (§ 5.2) — children 있으면 차단 + 안내 ·
> (c) keyword_content_link orphan cleanup (§ 5.5 신규) — 5 entity delete action 안 cleanup helper ·
> (d) deleteKeywordTarget 안 affected entity 선조회 (§ 5.2) — CASCADE 전 SELECT ·
> (e) count subquery 안 instance_id 조건 (§ 2.1) — 명시성 + RLS 정합 ·
> (f) SQL + TS 그룹화 (§ 2.2) — parent 정보 SQL 안 fetch + TS 안 primary→children[] 구조 + "미분류 보조" 섹션 ·
> (g) is_primary 직렬화 정정 (§ 4.3) — `<id>:primary` 대신 `keywordLinks_<type>` + 별도 `primaryKeywordLinks` ·
> (h) multiple primary keyword 시 readiness 정책 (§ 8.1 신규) — OR 매칭 (하나라도 title 안 포함되면 pass) ·
> (i) coverage denominator 정의 (§ 9 신규) — active 키워드 분모 + paused/dropped 제외 + won 은 별도 ·
> (j) audit contentType 정합 (§ 5.6 신규) — `compliance_content_type` enum 미추가 marker.

> **본 plan 의 위상**: Phase 0+1 안 도입된 `keyword_target` · `keyword_content_link` 두 entity 가 실제 운영 콘솔로 노출되는 cycle. 사용자 의견 (2026-05-21) 의 항목 2: "상위 노출 목적이면 콘텐츠를 개별 글 단위로 보면 안 됩니다. 관리자에 키워드 전략 메뉴를 추가". 본 plan 완료 시 readiness 의 `title-has-target-keyword` check 가 의미 있게 동작 (primary keyword 가 등록되어야 평가 가능) + 대시보드 의 "타깃 키워드 커버리지" 카드 가 실 데이터를 가짐. EVIDENCE_LINKING_PLAN v1.0 acceptance 이후 다음 가시적 ROI.

## SoT

- 사용자 의견 (2026-05-21) — "키워드/토픽 클러스터 관리 기능 추가". 본 plan 의 의도 SoT.
- `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 — SVO-DEFER-01 (본 plan 의 모태) · 카드 6 #1 "타깃 키워드 커버리지" 가 본 plan 데이터에 의존
- `packages/core-content/migrations/C0031_keyword_target.sql` · `C0032_keyword_content_link.sql` — schema 이미 도입 (Phase 0)
- `packages/core-content/src/schema.ts` 의 `keywordTarget` · `keywordContentLink` drizzle 정의
- 기존 packages 시그니처:
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/keywords/page.tsx` — 현 placeholder. 본 plan 안 목록 + 액션 페이지로 갱신
  - `apps/web/src/components/forms/Field.tsx` 의 `Field` · `SelectField` · `MultiSelectField` — form primitive 재사용
  - `apps/web/src/components/admin/NavMenu.tsx` — top-nav 안 "키워드" 메뉴 추가
  - `apps/web/src/lib/admin/visibility-overview.ts` 의 `keywordCoverage` — 본 plan 데이터를 카드에 표시 중
  - `apps/web/src/lib/seo-readiness/index.ts` 의 `loadPrimaryKeywordLabels` — primary keyword 가 등록되어야 readiness `title-has-target-keyword` 평가
  - 기존 entity actions 패턴 (`articles/actions.ts` 등) — `saveX`/`deleteX` 분리, zod 검증, audit_event emit, revalidatePath

> **표기 규칙**: 다른 plan 정합 — SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase. 동일 개념 매핑: `keyword_target.label` (DB) ↔ `label` (TS) ↔ "키워드 라벨" (운영자 표시).

## 1. 목적과 범위

### 1.1 목적 — 사용자 의견 정합

- **콘텐츠 발행이 랜덤 → 키워드 점유율 전략**: 어드민에서 타깃 키워드를 명시적으로 선언하고, 각 키워드에 어떤 콘텐츠가 매핑됐는지 일목요연하게 확인. 빈 키워드 (콘텐츠 없음) 가 노출되면 운영자가 즉시 발행 우선순위 산정 가능.
- **대표/보조 클러스터 도입**: primary keyword 한 개 + 그 아래 보조 keyword N 개의 hierarchical 구조. 단 v1 안 시각화는 단순 (parent 그룹화 list) — D3 같은 화려한 시각화는 후속.
- **검색 의도 (intent) 분류**: `informational` · `comparison` · `pre-booking` · `local` 4종. 운영자가 어느 깔때기 단계 콘텐츠가 부족한지 진단.
- **콘텐츠 ↔ 키워드 다대다 매핑**: 한 article 이 여러 키워드 cover 가능, 한 키워드를 여러 article 이 cover 가능. `is_primary` 으로 "이 콘텐츠가 이 키워드의 1차 타깃" 마커.
- **readiness 의 `title-has-target-keyword` 가 의미 있게 동작**: primary keyword 가 등록돼야 article 의 title 안 키워드 포함 여부를 평가. Phase 0+1 안 placeholder 이던 check 가 실 데이터로 채워짐.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| **§ 2 키워드 목록 페이지** | `/admin/<slug>/keywords` 의 placeholder → 실 목록. 표 형태 (label · type · intent · priority · status · 연결 콘텐츠 카운트 · 액션). primary/secondary 그룹화 표시 |
| **§ 3 키워드 신규/편집 form** | `/admin/<slug>/keywords/new` · `/admin/<slug>/keywords/<kid>`. 필드 7~8종 (label · slug · type · parent (secondary 만) · intent · priority · difficulty · region_scope · status). 기존 `Field`·`SelectField` 재사용 |
| **§ 4 키워드 ↔ 콘텐츠 매핑 UI** | 편집 페이지 안 별도 섹션. entity_type 별 `MultiSelectField` (Article · TreatmentPage · FAQ · Publication · MediaAppearance) + 각 link 에 `is_primary` 토글. EVIDENCE_LINKING_PLAN 의 EvidenceLinkPanel 패턴 답습 |
| **§ 5 server actions** | `saveKeywordTarget` · `deleteKeywordTarget` · `syncKeywordContentLinks` (다대다 diff). audit_event emit. revalidatePath 범위 (대시보드 + keywords list + 편집 자체) |
| **§ 6 NavMenu 안 "키워드" 메뉴 추가** | `apps/web/src/components/admin/NavMenu.tsx` 의 NAV_ITEMS 에 항목 추가. 의료진/시술/아티클 등과 같은 레벨 |
| **§ 7 KeywordCoverageCard 의 실 link 활성화** | 현 placeholder link → 실 keywords 페이지로. 카드 안 unlinked top 3 항목도 keywords/<kid> 로 직접 이동 |
| **§ 8 readiness 자동 재계산** | keyword 또는 keyword_content_link 변경 시 영향 받은 콘텐츠의 readiness 재계산 (`title-has-target-keyword` check 영향) |
| **§ 9 검증 시나리오 8건** | UI · CRUD · 매핑 · readiness 갱신 · gap 분석 · NavMenu · cross-tenant 거부 · 빈 상태 |
| **§ 10 작업 manifest** | 약 8 task |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| 외부 SERP / Google Search Console / 네이버 서치어드바이저 API 안 키워드 자동 발굴 + difficulty 자동 산정 + 검색량 (volume) 가져오기 | Phase 5 (SEARCH_VISIBILITY_INGEST_PLAN — SVO-DEFER-05) | KWS-DEFER-01 |
| 클러스터 시각화 (D3 그래프 · 트리뷰 등) | M2+ | KWS-DEFER-02 |
| AI 기반 키워드 제안 (Claude API) — article 본문 분석 후 자동 키워드 추출·매핑 | Phase Beta (LLM 통합 cycle — UX-DEFER-08 정합) | KWS-DEFER-03 |
| 키워드 ↔ keyword 간 관계 (synonym · sibling · supertype) | M2+ | KWS-DEFER-04 |
| 키워드 별 SERP 순위 추적 시계열 | Phase 5 합류 | KWS-DEFER-05 |
| 캐니발리제이션 자동 감지 (같은 키워드에 여러 primary 콘텐츠) | Phase 4 합류 시 — 검수 큐 안 warning | KWS-DEFER-06 |
| CSV import / 일괄 키워드 등록 | M1 Phase Alpha (UX-DEFER-13 정합) | KWS-DEFER-07 |
| `relevance_score` 수동/자동 산정 UX — v1 안 default 50 으로 일괄 (운영자가 신경 안 씀) | M1 Phase Alpha | KWS-DEFER-08 |
| 키워드 검색 (목록 안 검색 입력) — 키워드 50+ 시 합류 | 별 cycle 1.1 | KWS-DEFER-09 |
| 키워드 별 콘텐츠 발행 캘린더 / 일정 | Phase 6 (콘텐츠 캘린더 · SVO-DEFER-06) | KWS-DEFER-10 |

## 2. 키워드 목록 페이지 (§ 2)

`/admin/<slug>/keywords/page.tsx` 의 placeholder 를 실 목록 + 빠른 작업 안내 페이지로 갱신.

### 2.1 데이터 로드

```ts
type KeywordRow = {
  id: string;
  slug: string;
  label: string;
  keyword_type: 'primary' | 'secondary';
  parent_id: string | null;
  parent_label: string | null;  // JOIN keyword_target parent
  intent: string;
  priority: 'P0' | 'P1' | 'P2';
  difficulty: number | null;
  status: 'active' | 'paused' | 'won' | 'dropped';
  linked_content_count: string;  // subquery
  primary_content_count: string;  // is_primary=true 인 link count
  updated_at: Date;
};
```

단일 query (cycle 1 #5 — count subquery 안 instance_id 명시):
```sql
SELECT
  kt.id, kt.slug, kt.label, kt.keyword_type, kt.parent_id,
  parent.label AS parent_label,
  kt.intent, kt.priority, kt.difficulty, kt.status, kt.updated_at,
  (SELECT count(*) FROM keyword_content_link
    WHERE instance_id = kt.instance_id AND keyword_id = kt.id)::text AS linked_content_count,
  (SELECT count(*) FROM keyword_content_link
    WHERE instance_id = kt.instance_id AND keyword_id = kt.id AND is_primary = true)::text AS primary_content_count
FROM keyword_target kt
LEFT JOIN keyword_target parent
  ON parent.id = kt.parent_id AND parent.instance_id = kt.instance_id
WHERE kt.instance_id = ${instanceId}::uuid
ORDER BY
  kt.keyword_type ASC,  -- primary 먼저
  kt.priority ASC,
  kt.created_at ASC
```

### 2.2 그룹화 구조 (cycle 1 #6 정합)

**SQL 만으로는 indent 안정성 부족** — TS 단계 안 primary → children[] 구조로 재구성:

```ts
type KeywordWithChildren = KeywordRow & { children: KeywordRow[] };

function groupKeywords(rows: KeywordRow[]): {
  primaries: KeywordWithChildren[];
  orphanSecondaries: KeywordRow[];  // parent 없거나 parent 가 dropped 인 secondary
} {
  const primaries: Map<string, KeywordWithChildren> = new Map();
  const orphans: KeywordRow[] = [];
  // 1) primary 먼저 모두 등록
  for (const r of rows) if (r.keyword_type === 'primary') primaries.set(r.id, { ...r, children: [] });
  // 2) secondary 를 parent 에 attach (parent active 인 경우만)
  for (const r of rows) {
    if (r.keyword_type !== 'secondary') continue;
    if (r.parent_id && primaries.has(r.parent_id)) {
      primaries.get(r.parent_id)!.children.push(r);
    } else {
      orphans.push(r);
    }
  }
  return { primaries: [...primaries.values()], orphanSecondaries: orphans };
}
```

UI:

```
헤더: "타깃 키워드"
  · 총 N개 (primary M · secondary K)
  · primary 콘텐츠 미연결 X개 (강조)
  + "신규 키워드 추가" 버튼 → /keywords/new

목록 (그룹화):

== 인천 피부과 [primary · P0 · local · active · 5 연결 / primary 3] [편집]
   ⤷ 인천 슈링크 [secondary · P1 · comparison · 2 / 1] [편집]
   ⤷ 인천 울쎄라 [secondary · P1 · comparison · 1 / 0] [편집]

== 인천 리프팅 [primary · P1 · pre-booking · active · 0 / 0]  ← 미연결 강조
   (자식 없음)

== 미분류 보조 키워드 (parent 비활성/삭제됨)
   · 부모 미정 보조 [P2 · ...] [편집]

푸터: 안내 ("Phase 5 합류 시 외부 검색 데이터 자동 발굴 가능" 등)
```

`orphanSecondaries` 가 있으면 "미분류 보조 키워드" 섹션 강조 — primary 삭제 차단 정책 (§ 5.2) 으로 통상 발생 안 하나, parent 가 dropped 인 경우 등 edge case 대비.

## 3. 키워드 신규/편집 form (§ 3)

### 3.1 폼 시그니처 — `KeywordTargetForm.tsx` 신규 (`components/forms/`)

```ts
export type KeywordTargetInitial = {
  slug: string;
  label: string;
  keywordType: 'primary' | 'secondary';
  parentId: string;  // empty if primary
  intent: 'informational' | 'comparison' | 'pre-booking' | 'local';
  priority: 'P0' | 'P1' | 'P2';
  difficulty: string;  // optional · '' or '0'~'100'
  regionScope: string;
  status: 'active' | 'paused' | 'won' | 'dropped';
};
```

### 3.2 필드 구성

| 필드 | UI | 검증 |
|---|---|---|
| `label` | Field text | 1~100자 |
| `slug` | Field text · 자동 생성 (한글 → 한글-슬러그 또는 사용자 수동) · 한글 허용 정규식 (`^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$`) | 3~64자 |
| `keywordType` | radio (primary/secondary) | required |
| `parentId` | SelectField (다른 primary keyword) — secondary 일 때만 활성 | secondary 필수 / primary 비활성 |
| `intent` | SelectField 4종 | required |
| `priority` | SelectField 3종 (P0/P1/P2) | required |
| `difficulty` | Field number 0~100 (optional) | 비어두면 null |
| `regionScope` | Field text (optional) — "인천", "서울 강남" 등 | optional |
| `status` | SelectField 4종 | required |

### 3.3 검증 (cycle 1 #1 정합 — parent primary 검증 필수)

server action 안 `saveKeywordTarget` 의 zod + post-parse 검증:

| 케이스 | 처리 |
|---|---|
| `keywordType === 'secondary'` AND `parentId` 비어있음 | fieldError `parentId`: "보조 키워드는 대표 키워드 (parent) 가 필요합니다" |
| `keywordType === 'secondary'` 인데 parentId 가 자기 자신 (편집 시) | fieldError `parentId`: "자기 자신을 부모로 지정할 수 없습니다" |
| `parentId` row 가 같은 instance 안 존재하지 않음 | fieldError `parentId`: "대표 키워드를 찾을 수 없습니다" (cross-tenant 또는 미존재) |
| `parentId` row 의 `keyword_type !== 'primary'` (cycle 1 #1) | fieldError `parentId`: "대표 키워드만 부모로 지정 가능 — 보조 키워드 끼리의 계층은 v1 안 미지원" |
| `keywordType === 'primary'` 인데 `parentId` 가 채워져있음 | server-side 안 `parentId = null` 로 강제 (사용자 입력 무시) — 안전. UI 안 form 안 keywordType radio 변경 시 parentId 비활성화 + 빈 값 자동 |
| slug 중복 | DB `keyword_target_instance_slug_unique` 위반 — errors.ts 매핑 (Phase 0 안 이미 등록) |
| slug regex 위반 (`^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$`) | DB CHECK · errors.ts 매핑 추가 |
| label 길이 0 또는 100+ | DB CHECK · errors.ts 매핑 추가 |

## 4. 키워드 ↔ 콘텐츠 매핑 UI (§ 4)

편집 페이지 (`/admin/<slug>/keywords/<kid>`) 안 별도 섹션.

### 4.1 데이터 모델

`keyword_content_link` (instance_id, keyword_id, entity_type, entity_id, is_primary, relevance_score).

### 4.2 UI 구조

```
"이 키워드와 연결된 콘텐츠"

[Article]
  ☑ 인천 피부과 추천 5곳 (primary ★)        [primary 토글] [×]
  ☑ 여드름 흉터 치료 후기                                 [×]
  + 추가...

[TreatmentPage]
  ☑ 슈링크                                            [×]
  + 추가...

[FAQ] · [Publication] · [MediaAppearance] 동일 패턴
```

각 entity_type 별 group + `MultiSelectField` (EVIDENCE_LINKING_PLAN 패턴 답습). 추가로 각 link 에 `is_primary` 토글 (chip 또는 별 표시). v1 안 `relevance_score` UI 없음 (KWS-DEFER-08).

### 4.3 FormData 직렬화 (cycle 1 #7 정합 — `<id>:primary` 표기 폐기)

EVIDENCE_LINKING_PLAN 의 `formData.getAll()` 패턴 답습 + **primary marker 는 별도 input 분리**:

```html
<!-- 모든 link (entity_type 별 group) -->
<input type="hidden" name="keywordLinks_Article" value="Article:abc-123" />
<input type="hidden" name="keywordLinks_Article" value="Article:def-456" />
<input type="hidden" name="keywordLinks_TreatmentPage" value="TreatmentPage:xyz-789" />
<input type="hidden" name="keywordLinks_Publication" value="Publication:..." />
<!-- ... -->

<!-- primary marker 만 별도 -->
<input type="hidden" name="primaryKeywordLinks" value="Article:abc-123" />
<input type="hidden" name="primaryKeywordLinks" value="TreatmentPage:xyz-789" />
```

server action 안 zod 파싱:
```ts
const allLinkTokens = [
  ...formData.getAll("keywordLinks_Article"),
  ...formData.getAll("keywordLinks_TreatmentPage"),
  ...formData.getAll("keywordLinks_FAQ"),
  ...formData.getAll("keywordLinks_Publication"),
  ...formData.getAll("keywordLinks_MediaAppearance"),
].filter((v): v is string => typeof v === "string" && v.length > 0);
const primaryTokens = formData.getAll("primaryKeywordLinks").filter(...);

// allowlist 파싱: linkTokenSchema (EVIDENCE_LINKING_PLAN 의 동일 패턴)
const allLinks = linkArraySchema.parse(allLinkTokens);
const primarySet = new Set(linkArraySchema.parse(primaryTokens).map((t) => `${t.targetType}:${t.targetId}`));

// 최종 매핑
const desiredLinks = allLinks.map((l) => ({
  entityType: l.targetType,  // EVIDENCE 의 targetType → keyword 의 entityType 매핑
  entityId: l.targetId,
  isPrimary: primarySet.has(`${l.targetType}:${l.targetId}`),
}));
```

UI 안 `is_primary` 토글은 chip 안 별 아이콘 ★ click — primary set toggle. v1 안 같은 entity_id 가 keywordLinks_<type> 에 있으면서 primaryKeywordLinks 에도 있으면 primary, 없으면 secondary.

## 5. server actions (§ 5)

### 5.1 `saveKeywordTarget(instanceSlug, originalId | null, formData)` 

- INSERT 또는 UPDATE — RETURNING id
- keyword_content_link 동기화 (다대다 diff — apply pattern, EVIDENCE_LINKING_PLAN 의 `processEvidenceLinks` 답습)
- 영향 받은 콘텐츠 의 readiness 재계산 (link 추가/제거 시 `title-has-target-keyword` 영향)
- audit_event 'content-saved' · contentType='KeywordTarget'
- revalidatePath: `/admin/<slug>/keywords` · `/admin/<slug>/keywords/<kid>` · `/admin/<slug>` (대시보드 카드)

### 5.2 `deleteKeywordTarget(instanceSlug, kid)` (cycle 1 #2 · #4 정합)

순서:

1. **삭제 전 children 차단 검사** (cycle 1 #2):
   ```sql
   SELECT count(*)::int AS n FROM keyword_target
    WHERE instance_id = ? AND parent_id = ?::uuid
   ```
   children > 0 이면 `{ ok: false, formError: "이 대표 키워드 아래 보조 키워드가 N개 있습니다. 먼저 보조 키워드의 부모를 변경하거나 보조 키워드를 삭제하세요." }` 반환. 운영 UX 명확.
2. **삭제 전 affected entities 선조회** (cycle 1 #4 — CASCADE 후 정보 회수 불가):
   ```sql
   SELECT entity_type, entity_id FROM keyword_content_link
    WHERE instance_id = ? AND keyword_id = ?::uuid
   ```
   결과를 메모리 보존.
3. `DELETE FROM keyword_target WHERE id=? AND instance_id=?` — `keyword_content_link.keyword_fk` ON DELETE CASCADE 로 자동 정리.
4. `seo_readiness_snapshot` 안 KeywordTarget 행 별도 정리는 불필요 (snapshot 안 entity_type='KeywordTarget' 사용 안 함).
5. affected entities 의 `computeReadinessForEntity` 재계산 (특히 `title-has-target-keyword` check 가 영향 받은 source).
6. audit_event 'content-deleted' (contentType marker § 5.6 정합).
7. revalidatePath: `/admin/<slug>/keywords` · `/admin/<slug>`.

### 5.3 `syncKeywordContentLinks` — 별도 server action

원래는 saveKeywordTarget 안에서 통합. 단 키워드 자체 정보는 그대로 두고 매핑만 변경하는 use case 안 별도 action 도입 검토. v1 안 통합 — saveKeywordTarget 1개 server action.

### 5.4 same-tenant 검증

`keyword_content_link.entity_id` 가 같은 instance 안 존재하는지 — EVIDENCE_LINKING_PLAN 의 `verifySameTenant` 패턴 답습. switch 정적 SQL. SeoKeywordEntityType (`Article` · `TreatmentPage` · `FAQ` · `Publication` · `MediaAppearance`) 5종 case.

### 5.5 entity delete actions 의 keyword_content_link orphan cleanup (cycle 1 #3 — 필수 신규)

polymorphic 이라 DB FK CASCADE 없음. EVIDENCE_LINKING_PLAN 의 `cleanupLinksForEntityDelete` 와 **나란히** 모든 5 delete action 안 추가:

| Entity | delete action | cleanup 범위 | 영향 |
|---|---|---|---|
| Article | `articles/actions.ts` 안 `deleteArticle` | `keyword_content_link` 의 `entity_type='Article' AND entity_id=?` row DELETE | 영향 받은 keyword 별 carry — readiness 재계산 안 함 (keyword 자체는 그대로) |
| TreatmentPage | `treatments/actions.ts` 안 `deleteTreatmentPage` | 동일 | 동일 |
| FAQ | `faqs/actions.ts` 안 `deleteFaq` | 동일 | 동일 |
| Publication | `publications/actions.ts` 안 `deletePublication` | 동일 | 동일 |
| MediaAppearance | `media-appearances/actions.ts` 안 `deleteMediaAppearance` | 동일 | 동일 |

helper: `apps/web/src/lib/admin/keyword-content-link.ts` 안 `cleanupKeywordLinksForEntityDelete(tx, instanceId, entityType, entityId)`. EVIDENCE_LINKING 의 `cleanupLinksForEntityDelete` 와 같은 위치/패턴 — 5 delete action 안 둘 다 호출 (Evidence cleanup + Keyword cleanup).

cleanup 후 keyword 의 dashboard carry 도 갱신 — `revalidatePath('/admin/<slug>')` 가 이미 있어서 추가 작업 없음.

### 5.6 audit payload contentType marker (cycle 1 #10)

audit_event 의 payload 안 `contentType="KeywordTarget"` 으로 marker. **`compliance_content_type` enum 에는 추가하지 않음** — compliance pipeline 과 무관. audit payload 안에서만 사용하는 free-form string. errors.ts · compliance check.ts 의 enum union 에 추가 X.

(만약 향후 keyword 도 compliance 검수 대상이 되면 enum 추가 cascade 필요 — KWS-DEFER-04 검토 시점.)

## 6. NavMenu 안 "키워드" 메뉴 추가 (§ 6)

`apps/web/src/components/admin/NavMenu.tsx` 의 `NAV_ITEMS` 안 "키워드" 항목 추가 — "아티클" 다음 자리.

```ts
{
  href: (slug) => `/admin/${slug}/keywords`,
  label: "키워드",
  match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/keywords`),
},
```

## 7. KeywordCoverageCard 활성화 (§ 7)

현재 대시보드의 KeywordCoverageCard 안 "전체 관리 →" link 가 `/admin/<slug>/keywords` 의 placeholder 로 향함. 본 plan 완료 시 실 페이지로 이동. unlinked top 3 항목은 각 키워드의 편집 페이지 (`/admin/<slug>/keywords/<kid>`) 로 deep-link.

## 8. readiness 자동 재계산 (§ 8)

`saveKeywordTarget` · `deleteKeywordTarget` 안:

- 추가/제거된 `keyword_content_link` 의 영향 받은 entity 별로 `computeReadinessForEntity` 호출
- 특히 `is_primary` 변경은 `title-has-target-keyword` check 결과를 즉시 바꿈

EVIDENCE_LINKING_PLAN Phase A 의 패턴 그대로 답습.

### 8.1 multiple primary keyword 시 readiness 정책 (cycle 1 #8)

같은 entity (예: article) 가 여러 keyword 의 primary 일 수 있음 (DB 안 허용). cycle 1 #8 정합 — `title-has-target-keyword` check 의 매칭 정책:

- **현재 로직 (`checkTitleHasKeyword` in `lib/seo-readiness/evaluators/shared.ts`)**: `primaryKeywordLabels.find((k) => title.includes(k))` — 즉 **하나라도 title 에 포함되면 `pass`**.
- 따라서 multiple primary keyword 의 경우 OR 매칭 = **하나라도 매칭되면 pass** · 모두 미포함이면 `fail`. 정합 OK · 추가 변경 불필요.
- "일부만 포함되면 warn" 정책은 ELI-DEFER-style 후속 cycle (`title-coverage-ratio` 같은 새 check 도입 시) — v1 안 적용 X.
- 캐니발리제이션 위험 (한 콘텐츠가 여러 primary 의 1차 타깃) 은 SVO-DEFER (KWS-DEFER-06 — Phase 4 검수 큐 합류 시 warning) 로 노출.

`loadPrimaryKeywordLabels` (`lib/seo-readiness/index.ts`) 는 source entity 의 모든 primary keyword label 회수 — 이미 multi-keyword 친화. 변경 불필요.

## 9. coverage denominator 정의 (cycle 1 #9 — 신규)

KeywordCoverageCard (대시보드) 의 분자/분모 명확화:

- **분모 (active 키워드 전체)**: `keyword_target WHERE status='active'`. paused·dropped·won 제외.
- **분자 (콘텐츠 연결된 active 키워드)**: 위 분모 중 `keyword_content_link WHERE is_primary=true` 가 1건 이상.
- **표시**: `"M / N 키워드에 primary 콘텐츠 연결됨"` (M ≤ N).
- **`won` 처리**: 별도 "확보 키워드 X건" 으로 카드 안 보조 표시 (선택 — v1 안 카드 footer 한 줄).
- **`paused` 처리**: 카운트 자체에서 제외 — 운영자가 일시 중단한 키워드는 평가 분모에서 빼는 게 의도.
- **`dropped` 처리**: 동일하게 제외.

`lib/admin/visibility-overview.ts` 의 `keywordCoverage` 부분 갱신 — `WHERE status='active'` 조건 추가 (현재 status 무관 count 라 정정).

### 9.1 KeywordCoverageCard label 갱신

UI 안 "5/12 키워드에 primary 콘텐츠 연결됨" + footer "확보 (won) 키워드 X건" — v1 안 footer 노출은 won 카운트 > 0 일 때만.

## 10. 검증 시나리오 (v1 — 9건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| KWS-V01 | `/admin/demo/keywords` 진입 | 헤더 + 신규 추가 버튼 + 빈 목록 + 푸터 안내 |
| KWS-V02 | "신규 키워드 추가" → 폼 작성 (primary 1건) → 저장 | DB INSERT · 목록에 새 row · primary 그룹화 |
| KWS-V03 | 같은 폼에서 secondary 1건 + parentId 선택 → 저장 | DB INSERT · 목록에서 parent 아래 indent 표시 |
| KWS-V04 | secondary 의 parentId 를 다른 secondary 로 지정 시도 | fieldError "대표 키워드만 부모로 지정 가능" — saveKeywordTarget 안 거부 (cycle 1 #1) |
| KWS-V05 | 편집 페이지 안 콘텐츠 매핑 — Article 2건 추가 (1건 primary 토글) → 저장 | `keyword_content_link` 2 row · primary marker 1건 · article 의 readiness `title-has-target-keyword` check pass |
| KWS-V06 | 대시보드 새로고침 후 KeywordCoverageCard 카운트 확인 | denominator = active 키워드만 (paused·dropped·won 제외) · "M/N 키워드에 primary 콘텐츠 연결됨" (cycle 1 #9) |
| KWS-V07 | primary 키워드 삭제 시도 (children 있음) | formError "보조 키워드 N개 있습니다. 먼저..." — 차단 (cycle 1 #2) |
| KWS-V08 | primary 키워드 삭제 시도 (children 없음) | affected entity 선조회 → DELETE → CASCADE → readiness 재계산 (cycle 1 #4) |
| KWS-V09 | article 삭제 시 keyword_content_link 안 entity_type='Article' AND entity_id=? orphan cleanup | cleanupKeywordLinksForEntityDelete 호출 + DB row 사라짐 (cycle 1 #3) |
| KWS-V10 | typecheck + 기존 시각 검수 (SVO-V01~V09, ELI-V01~V08) 무회귀 | 통과 |

## 11. 작업 manifest

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | `keyword-content-link.ts` helper (`lib/admin/`) — load · parseKeywordLinks (formData.getAll + primaryKeywordLinks) · verifySameTenantEntity (switch) · diff · apply · cleanupKeywordLinksForEntityDelete | helper lib | — |
| 2 | `keyword-parent-options.ts` helper (`lib/admin/`) — primary keyword 만 회수 (secondary 부모 후보 select 옵션) | options loader | — |
| 3 | `KeywordTargetForm` 컴포넌트 (`components/forms/`) — Field · SelectField · MultiSelectField 재사용 + 5 entity_type group + primary marker chip | form | 1·2 |
| 4 | `saveKeywordTarget` · `deleteKeywordTarget` server actions (`/admin/<slug>/keywords/actions.ts`) — INSERT/UPDATE RETURNING id + link diff (apply) + parent 검증 + delete 안 children 차단 + affected entity 선조회 + readiness 재계산 | server actions | 1 |
| 5 | `/admin/<slug>/keywords/page.tsx` — placeholder → 실 목록 (단일 SQL · TS 그룹화 + orphanSecondaries 섹션) | page | 1·4 |
| 6 | `/admin/<slug>/keywords/new/page.tsx` — 신규 form | page | 3·4 |
| 7 | `/admin/<slug>/keywords/[kid]/page.tsx` — 편집 + 콘텐츠 매핑 + DeleteForm | page | 3·4 |
| 8 | NavMenu 안 "키워드" 메뉴 추가 + errors.ts 안 추가 CHECK constraint 매핑 (keyword_target_slug_regex · label_length 등) | NavMenu · errors.ts | — |
| 9 | 5 entity delete actions (article/treatment/faq/publication/media) 안 cleanupKeywordLinksForEntityDelete 호출 추가 — Evidence cleanup 과 나란히 | 5 server action 갱신 | 1 |
| 10 | `visibility-overview.ts` 의 keywordCoverage query 안 `WHERE status='active'` 추가 + KeywordCoverageCard footer 안 won 카운트 (선택) | overview + card | — |
| 11 | typecheck + 시각 검수 KWS-V01~V10 + commit | — | 5·6·7·8·9·10 |

추정: **2~3일** — cycle 1 흡수로 1 task 증가 (10) + 5 entity action 패치 (9 추가) 가 작업량 약간 증가.

## 12. KWS-CASCADE markers

| marker | 항목 | 영향 |
|---|---|---|
| KWS-CASCADE-01 | SEO_VISIBILITY_OPS_PLAN v1.0 의 `keyword_target` · `keyword_content_link` schema 활용 시작 | 본 plan 완료 시 KeywordCoverageCard + readiness `title-has-target-keyword` 가 실 데이터 |
| KWS-CASCADE-02 | EVIDENCE_LINKING_PLAN v1.0 의 `MultiSelectField` · `processEvidenceLinks` · `verifySameTenant` 패턴 답습 | helper 코드 중복 회피 — 같은 패턴 재사용 |
| KWS-CASCADE-03 | EVIDENCE_LINKING_PLAN v1.0 의 `computeReadinessForEntity` on-save hook | 본 plan 안에서도 link 변경 시 같은 함수 호출 |

## 13. 변경 이력

- **2026-05-21**: v0.1 draft 작성. SEO_VISIBILITY_OPS_PLAN v1.0 SVO-DEFER-01 본 구현 cycle 진입. 사전 조사:
  - `/admin/<slug>/keywords/page.tsx` 가 이미 placeholder 로 존재 (Phase 0+1 안 도입)
  - NavMenu 안 "키워드" 메뉴 부재 — 본 plan 안 추가
  - keyword_target/keyword_content_link drizzle schema 와 errors.ts 일부 매핑 이미 도입 (Phase 0+1)
  - EVIDENCE_LINKING_PLAN v1.0 의 MultiSelectField/processEvidenceLinks/verifySameTenant/computeReadinessForEntity 모두 재사용 가능
- **2026-05-21**: v0.2 draft — cycle 1 critique (10건) 전건 수용:
  - cycle1-#1 parent primary 검증 — § 3.3 (secondary→secondary 차단 + 자기 자신 parent 금지 + primary 전환 시 parent NULL).
  - cycle1-#2 primary 삭제 정책 — § 5.2 (children 있으면 차단 + 안내 메시지).
  - cycle1-#3 (필수) keyword_content_link orphan cleanup — § 5.5 신규 + 작업 manifest task #9 (5 entity delete action 안 cleanupKeywordLinksForEntityDelete 호출).
  - cycle1-#4 deleteKeywordTarget 안 affected entity 선조회 — § 5.2 (CASCADE 전 SELECT).
  - cycle1-#5 count subquery 안 instance_id 조건 — § 2.1.
  - cycle1-#6 SQL + TS 그룹화 — § 2.2 (primary→children[] 구조 + orphanSecondaries 섹션).
  - cycle1-#7 is_primary 직렬화 — § 4.3 (`<id>:primary` 폐기 · `keywordLinks_<type>` + `primaryKeywordLinks` 분리).
  - cycle1-#8 multiple primary keyword 정책 — § 8.1 (현 OR 매칭 정합 OK · 추가 변경 X).
  - cycle1-#9 coverage denominator — § 9 (active 키워드만 분모 · paused/dropped 제외 · won 별도 footer).
  - cycle1-#10 audit contentType marker — § 5.6 (compliance_content_type enum 미추가 명시).
