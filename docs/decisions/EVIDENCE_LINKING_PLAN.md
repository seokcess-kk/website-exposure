# EVIDENCE_LINKING_PLAN (v0.2·draft·2026-05-21)

> **상태**: **v0.2 draft** — Phase 3 acceptance plan. SEO_VISIBILITY_OPS_PLAN v1.0 SVO-DEFER-03 본 구현. cycle 1 critique (9건) 전건 수용. 본 plan 안 **Phase A** (저장 + SSR + readiness — v1.0 acceptance 범위) 와 **Phase B** (JSON-LD `citation`·`mentions` enrichment — 후속 cycle) 두 단계로 분리 (cycle 1 #9 — 작업량 통제).

> **본 plan 의 위상**: Phase 0+1 안 도입한 `content_entity_link` (polymorphic source/target + relation_type 3종) 가 실제로 채워지기 시작하는 cycle. 어드민 작성 폼 안 selector + 공개 사이트의 inverse 자동 표시 (Phase A) → JSON-LD `citation`·`mentions` enrichment (Phase B). Phase A 완료 시 readiness 의 `has-evidence-link`·`has-related-faq` check 가 의미 있게 동작 — 평균 readiness 점수가 실제로 상승하는 첫 가시적 ROI.

> **cycle 1 critique 9건 흡수 marker**: (a) INSERT/UPDATE RETURNING id 필수 (§ 5) · (b) verifySameTenant switch 기반 정적 SQL (§ 5.1) · (c) orphan link cleanup (§ 5.5 신규) · (d) formData.getAll() 패턴 (§ 2.1 · § 4.4) · (e) MultiSelectField v1 범위 축소 — 체크박스 리스트 + chip 요약 (§ 2) · (f) authored-by 미도입 재확인 · (g) FAQ relatedTreatmentId SoT 분리 재확인 · (h) draft/published target 처리 정책 (§ 4 신규 절) · (i) JSON-LD enrichment 를 본 plan 안 Phase B 로 분리 (§ 1.2).

## SoT

- 사용자 의견 (2026-05-21) — “근거 연결을 핵심 기능으로 만들기” 항목 4. 콘텐츠와 의료진/논문/미디어/FAQ/시술 연결 + 공개 사이트 자동 내부 링크·구조화 데이터 생성. 본 plan 의 의도 SoT.
- `docs/decisions/SEO_VISIBILITY_OPS_PLAN.md` v1.0 — SVO-DEFER-03 (본 plan 의 모태) · SVO-CASCADE-05 (`authored-by` 미도입 — `author_doctor_id` FK SoT 단일화) · SVO-DEFER-10 (same-tenant DB trigger 강제는 v2)
- `packages/core-content/migrations/C0033_content_entity_link.sql` — relation_type 3종 (`cites` · `related-to` · `derived-from`) · source_type 3종 (`Article`·`TreatmentPage`·`FAQ`) · target_type 5종 (`Publication`·`MediaAppearance`·`FAQ`·`TreatmentPage`·`Article`)
- 기존 packages 시그니처:
  - `apps/web/src/components/forms/ArticleForm.tsx` · `TreatmentPageForm.tsx` · `FaqForm.tsx` — 본 plan 안 `EvidenceLinkPanel` 통합 대상
  - `apps/web/src/components/forms/Field.tsx` 의 `SelectField` — 단일 select 패턴. 본 plan 안 `MultiSelectField` 신규 (자매 컴포넌트)
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` · `treatments/actions.ts` · `faqs/actions.ts` — `saveArticle`·`saveTreatmentPage`·`saveFaq` 안 link diff 처리 통합
  - `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` — article 상세 SSR · `loadArticleDetail` cached
  - `apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx` — treatment 상세 SSR · `loadTreatmentDetail` cached
  - `apps/web/src/lib/json-ld/builders.ts` · `entities.ts` — `articleDetailGraph`·`treatmentDetailGraph`·`articleEntity`·`medicalProcedureEntity`·`scholarlyArticleEntity`·`videoObjectEntity`
  - `apps/web/src/lib/json-ld/__tests__/validate.ts` — JSON-LD allowlist · cross-page reference rule
  - `apps/web/src/lib/seo-readiness/` — `has-evidence-link`·`has-related-faq` check 가 본 plan 데이터에 의존

> **표기 규칙**: SEO_VISIBILITY_OPS_PLAN 정합 — SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase. 동일 개념 매핑: `content_entity_link.source_type` (DB) ↔ `sourceType` (TS) ↔ "출처 콘텐츠" (운영자 표시) / `target_type` ↔ "근거/관련 대상".

## 1. 목적과 범위

### 1.1 목적 — Phase 0+1 데이터 모델의 실제 활용

- **근거 연결을 1급 시민으로**: 콘텐츠 ↔ 콘텐츠/엔티티 link 가 작성 폼에서 명시적 입력 가능 · 공개 사이트 SSR 안 자동 inverse 표시 · JSON-LD enrichment 자동 합류.
- **readiness 가 실제로 의미 있게 동작**: 현재 `has-evidence-link`·`has-related-faq` check 는 link 데이터가 비어있어 거의 fail. 본 plan 완료 시 운영자가 link 를 채울 수 있고, 채운 만큼 readiness 점수가 오른다 — Phase 0+1 의 가시적 ROI 첫 실현.
- **E-E-A-T 시그널 강화**: 네이버 AI 브리핑 · 구글 SGE 가 인용하기 좋은 구조화 콘텐츠 — `citation` · `mentions` 가 schema.org 정합으로 노출.
- **내부 링크 자동화**: 사이트 SSR 안 inverse 가 자동 표시되면 운영자가 매번 markdown 안 수기 link 안 박아도 됨.

### 1.2 범위 (포함) — Phase A / Phase B 분리 (cycle 1 #9 정합)

본 plan 안 두 단계로 acceptance 단위 분리. **Phase A 의 v1.0 acceptance 가 본 plan 의 v1.0 격상 조건** — Phase B 는 같은 plan 안 후속 cycle (v1.1 또는 v2.0).

#### Phase A — 저장 + SSR + readiness (v1.0 acceptance)

| 항목 | 비고 |
|---|---|
| **§ 2 MultiSelectField 컴포넌트 (v1 — 축소 범위)** | `apps/web/src/components/forms/Field.tsx` 안 `SelectField` 자매. **v1 = 체크박스 리스트 + 선택된 항목 chip 요약**. 검색·combobox·aria-multiselectable keyboard 안 ELI-DEFER-01 (cycle 1.1). hidden input 직렬화 = **동일 name 다중 hidden input** + `formData.getAll()` 패턴 (cycle 1 #4) |
| **§ 3 EvidenceLinkPanel 컴포넌트 신규** | relation_type 별 grouping (`cites` · `related-to` · `derived-from`) 안 3개 multi-select. source 의 entity_type 에 따라 가능한 target_type · relation_type 조합 제한 |
| **§ 4 draft/published target 처리 정책 (cycle 1 #8 신규)** | **admin selector**: draft 포함 가능 (운영자가 사전 연결 가능) · **public SSR**: published/active target 만 표시 · **readiness**: unpublished target 만 연결된 경우 `warn`, published 가 1건이라도 있으면 `pass`. § 6·7·8 모두 이 정합 |
| **§ 4.x Article·Treatment·FAQ form 통합** | 본문 column 하단에 `<EvidenceLinkPanel />` 삽입. server-side prefetch (publication·media·faq·treatment·article options — draft 포함) → readonly props 로 전달 |
| **§ 5 server action link 통합** | `saveArticle`·`saveTreatmentPage`·`saveFaq` 안 entity INSERT/UPDATE + link diff (add/remove) 단일 트랜잭션. **INSERT/UPDATE 모두 RETURNING id 필수** (cycle 1 #1). same-tenant 검증 (app-level, switch 기반 정적 SQL — cycle 1 #2) · revalidatePath 범위 확대 |
| **§ 5.5 orphan link cleanup (cycle 1 #3 — 필수 신규)** | `deleteArticle`·`deleteTreatmentPage`·`deleteFaq`·`deletePublication`·`deleteMediaAppearance` 각각 안 source/target 양방향 link DELETE + 영향 받은 source 의 readiness 재계산 |
| **§ 6 readiness 자동 재계산 hook** | save action 끝에 `computeReadinessForEntity(tx, instance, entityType, entityId)` 호출 — link 변경이 readiness 점수에 즉시 반영. draft target 은 `warn` 처리 |
| **§ 7 article 상세 site SSR inverse** | `(site)/insights/[category]/[slug]/page.tsx` 안 본문 `</article>` 다음에 "이 글의 근거" 섹션 — 연결된 **published** Publication·MediaAppearance 카드 list + 관련 published FAQ mini list (Phase 0+1 의 `has-related-faq` 정합) |
| **§ 8 treatment 상세 site SSR inverse** | `(site)/treatments/[slug]/page.tsx` 안 KEY_EFFECTS 와 본문 사이 "임상 근거" 섹션 — `cites` · `derived-from` 의 **published** Publication·MediaAppearance 카드 |
| **§ 12 data loading 최적화** | `loadArticleDetail`·`loadTreatmentDetail` 안 link JOIN 1회 추가 — N+1 회피. cached 정합. published filter 는 JOIN 안 `AND status='published'` |
| **§ 13 Phase A 검증 시나리오 (8건)** | UI selector · link CRUD · readiness 갱신 (pass vs warn) · site SSR inverse · same-tenant 시도 거부 · 트랜잭션 atomicity · orphan cleanup · 빈 link 상태 fallback |
| **§ 14 Phase A 작업 manifest** | 약 10~12 task |

#### Phase B — JSON-LD enrichment (후속 cycle · 본 plan 안 v1.1)

| 항목 | 비고 |
|---|---|
| **§ 9 JSON-LD articleEntity 확장** | `citation` (cited Publication → ScholarlyArticle inline · cited MediaAppearance → VideoObject inline) + `mentions` (related-to 대상) 필드 추가. `articleDetailGraph` 시그니처 확장 |
| **§ 10 JSON-LD medicalProcedureEntity 확장** | `citation` 필드 추가 (clinical evidence — Publication `derived-from` 우선) |
| **§ 11 JSON-LD validate.ts allowlist 갱신** | cross-page reference 안 새 fragment-scoped @id 등장 시 checker 갱신 (또는 inline 재출력 전략 채택 시 불필요) |
| **§ 13 Phase B 검증 시나리오 (2건)** | view-source 안 JSON-LD `citation` · `mentions` 정합 · validate.ts 통과 |

**Phase B 가 별 plan 이 아닌 본 plan 안 후속 cycle 인 이유**: 데이터 모델과 admin/SSR 통합이 Phase A 의 SoT 라, Phase B 의 JSON-LD builder 시그니처 변경이 Phase A 코드 (`articleDetailGraph` 호출자 등) 와 강하게 cohesive. cascade marker 분리보다 같은 plan 안 후속 cycle 이 자연.

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| `MultiSelectField` 안 검색·페이지네이션 — 100+ 항목 시 합류 | 별 cycle (publication 50+ 누적 시 cycle 1.1) | ELI-DEFER-01 |
| Publication / MediaAppearance 상세 페이지의 inverse "이 자료를 인용한 콘텐츠" 표시 | 별 cycle (Phase 5 합류 시 — Search Console 데이터로 inverse 가치 검증 후) | ELI-DEFER-02 |
| Doctor ↔ MediaAppearance 직접 link (`appears-in` relation_type 도입) | SEO_VISIBILITY_OPS_PLAN SVO-DEFER-03 합류 시 vocabulary 확장 | ELI-DEFER-03 |
| `authored-by` relation 활용 (현재 `author_doctor_id` FK SoT) — 멀티-author 도입 검토 | M2+ (콘텐츠 협업 도입 시) | ELI-DEFER-04 |
| DB trigger 안 same-tenant 강제 (현재 app-level 만) | SEO_VISIBILITY_OPS_PLAN SVO-DEFER-10 정합 | ELI-DEFER-05 |
| 작성 폼 안 inline SEO/GEO 점수 widget — readiness check 결과를 폼 안 inline 표시 | Phase 4 (SEO_INLINE_SCORING_PLAN — SVO-DEFER-02) | ELI-DEFER-06 |
| 검수 큐 재활성화 — 콘텐츠 품질/리스크 큐 | Phase 5 (사용자 의견 #5 · SVO-DEFER-04) | ELI-DEFER-07 |
| TreatmentPage 안 multi-author 또는 author FK 도입 | M1 Phase Beta (현재 `metadata.authorDoctorSlug` 로 단순화) | ELI-DEFER-08 |
| 자동 link 추천 (AI 가 article 본문 분석 후 관련 publication 자동 제안) | Phase Beta (LLM 통합 — UX-DEFER-08 정합) | ELI-DEFER-09 |
| FAQ 의 inverse 노출 정책 (현재 `status='draft'` 강제 — EC-DEFER-12) | EC-DEFER-12 합류 시 | ELI-DEFER-10 |

## 2. MultiSelectField 컴포넌트 (§ 2) — v1 축소 범위 (cycle 1 #5 정합)

`apps/web/src/components/forms/Field.tsx` 안 신규 export. 기존 `SelectField` 자매.

```ts
export type MultiSelectOption = {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;     // draft target 등 — v1 안 단순히 label 안 표시 marker
};

export type MultiSelectFieldProps = {
  name: string;                                  // 동일 name 다중 hidden input — formData.getAll() 패턴
  label: string;
  options: ReadonlyArray<MultiSelectOption>;
  defaultValue?: ReadonlyArray<string>;
  description?: string;
  emptyLabel?: string;
  maxItems?: number;                             // default 20
};
```

### 2.1 UX 결정 (v1 — 축소)

**v1 안 단순화** (cycle 1 #5 정합 — 작업량 통제):
- **표시 방식**: **체크박스 리스트** (전체 옵션 노출) + 상단에 **선택된 항목 chip 요약** (제거 X 버튼). 옵션 < 20개 일 때 충분.
- **a11y**: 표준 `<input type="checkbox">` 의 native a11y 활용. `<fieldset>` + `<legend>` 안 group label.
- **FormData 직렬화**: **동일 name 다중 hidden input** (체크박스 자체가 자연스럽게 다중). server action 안 `formData.getAll(name)` 로 `string[]` 회수. zod `z.array(z.string())` 자연 지원. CSV 미사용 (cycle 1 #4).
- **`maxItems` 초과 시**: 추가 옵션 disabled + 안내 텍스트.
- **draft target 표시**: option label 안 `(미발행)` suffix — 선택 가능하되 운영자에게 사전 정보.
- **재방문 idempotency**: `defaultValue` 로 기존 link 표시.

### 2.2 v1 안 제외 (ELI-DEFER-01 — cycle 1.1 합류)

- 검색 입력 (label substring filter) — 옵션 50+ 일 때 필요
- combobox (입력 + 드롭다운 hybrid)
- `aria-multiselectable` + 키보드 화살표/Enter/Backspace 정합 — v1 의 체크박스 패턴은 native a11y 라 별도 ARIA 불필요
- chip 안 reordering (display_order 변경 UI) — v1 안 선택 순서대로 저장

## 3. EvidenceLinkPanel 컴포넌트 (§ 3)

`apps/web/src/components/admin/EvidenceLinkPanel.tsx` 신규. 작성 폼 본문 column 하단 삽입.

### 3.1 source / target / relation 매트릭스

| source_type | relation_type | 가능 target_type | 비고 |
|---|---|---|---|
| Article | cites | Publication · MediaAppearance | 학술 인용 · 미디어 출연 인용 |
| Article | related-to | Article · TreatmentPage · FAQ | generic 관련 콘텐츠 |
| TreatmentPage | cites | Publication · MediaAppearance | 시술 안 인용 |
| TreatmentPage | derived-from | Publication | clinical evidence (protocol 기반) |
| TreatmentPage | related-to | TreatmentPage · FAQ · Article | generic 관련 |
| FAQ | related-to | TreatmentPage · FAQ · Article | (기존 `relatedTreatmentId` FK 와 중복 가능 — § 4.3 정합) |

(C0033 의 `content_entity_link_source_type_check` · `target_type_check` · `relation_type_check` 정합)

### 3.2 UI 구조

```
┌─ 근거·관련 자료 ─────────────────────┐
│  ▸ 인용 (cites) — 학술/미디어         │
│    [chip] [chip] + 추가...           │
│  ▸ 임상 근거 (derived-from) [Treatment 만] │
│    [chip] + 추가...                  │
│  ▸ 관련 콘텐츠 (related-to)          │
│    [chip] [chip] + 추가...           │
└──────────────────────────────────────┘
```

각 group 별 `<MultiSelectField>` — value 는 `<target_type>:<target_id>` 형태 (예: `Publication:abc-123`) 로 entity_type 정보 함께 직렬화.

### 3.3 server-side prefetch

각 form page (article/treatment/faq) 의 server component 안:
```ts
const [publicationOptions, mediaOptions, faqOptions, treatmentOptions, articleOptions] = await Promise.all([
  loadOptionsFor(tx, instanceId, "Publication"),
  loadOptionsFor(tx, instanceId, "MediaAppearance"),
  loadOptionsFor(tx, instanceId, "FAQ"),
  loadOptionsFor(tx, instanceId, "TreatmentPage"),
  loadOptionsFor(tx, instanceId, "Article"),
]);
```
`loadOptionsFor` 는 `apps/web/src/lib/admin/evidence-link-options.ts` 신규. 비활성/draft 도 포함하되 label 안 표시 (기존 `(active = true OR id = currentAuthor)` 패턴 답습).

또한 현재 entity 의 기존 link 들도 prefetch:
```ts
const existingLinks = await loadContentEntityLinks(tx, instanceId, sourceType, sourceId);
// → ReadonlyArray<{ relationType, targetType, targetId, displayOrder }>
```

## 4. form 통합 (§ 4)

### 4.1 ArticleForm.tsx

본문 column (좌측) 하단 `<HeroImageField>` 와 `<SubmitFooter>` 사이에 `<EvidenceLinkPanel>` 삽입. props:
```ts
<EvidenceLinkPanel
  sourceType="Article"
  options={evidenceOptions}            // 모든 target_type 의 options
  existingLinks={existingLinks}
  allowedRelations={["cites", "related-to"]}  // Article 안 derived-from 없음
/>
```

### 4.2 TreatmentPageForm.tsx

동일 패턴. `allowedRelations={["cites", "derived-from", "related-to"]}`.

### 4.3 FaqForm.tsx — 기존 `relatedTreatmentId` 와 합류 정책

FAQ 는 이미 `relatedTreatmentId` 단일 FK (faq 테이블 직접 컬럼) 가 있음. Phase 3 안 `content_entity_link` 의 `related-to` + `target_type=TreatmentPage` 와 중복.

**결정안**:
- v1: **기존 `relatedTreatmentId` FK 는 1차 SoT 유지** — 기존 데이터 호환. FAQ 폼 안 단일 selector 그대로.
- 추가로 EvidenceLinkPanel 안 **TreatmentPage 외 target** (Article·FAQ) 만 multi-select 노출 — `relatedTreatmentId` 와 의미가 다름. `allowedRelations={["related-to"]}` + 내부적으로 `target_type IN ("Article", "FAQ")` 만 노출.
- v2 합류 시 (ELI-DEFER-04 cycle) `relatedTreatmentId` 를 content_entity_link 로 마이그레이션 검토.

### 4.4 form 안 hidden input 직렬화 (cycle 1 #4 정합)

각 EvidenceLinkPanel group 별 **동일 name 다중 hidden input** — value 는 `<target_type>:<target_id>`:

```html
<input type="hidden" name="evidenceLinks_cites" value="Publication:abc-123" />
<input type="hidden" name="evidenceLinks_cites" value="MediaAppearance:def-456" />
<input type="hidden" name="evidenceLinks_relatedTo" value="Article:xyz-789" />
```

server action:
```ts
const citesRaw = formData.getAll("evidenceLinks_cites").filter((v): v is string => typeof v === "string");
const relatedToRaw = formData.getAll("evidenceLinks_relatedTo")...;
const derivedFromRaw = formData.getAll("evidenceLinks_derivedFrom")...;
// zod 안 z.array(z.string().regex(/^(Publication|MediaAppearance|FAQ|TreatmentPage|Article):[0-9a-f-]{36}$/))
```

빈 array (선택 0건) 도 `getAll` 결과 빈 `[]` 라 자연. CSV 미사용 — 일반화·web standard 정합.

## 5. server action link 통합 (§ 5)

`saveArticle` · `saveTreatmentPage` · `saveFaq` 각각 안 다음 단계 추가 (entity INSERT/UPDATE 직후, 같은 트랜잭션 안). **INSERT/UPDATE 모두 RETURNING id 필수** (cycle 1 #1):

```ts
// 1. entity INSERT or UPDATE — RETURNING id 필수
const rows: Array<{ id: string; slug: string }> =
  isNew
    ? await tx`INSERT INTO article (...) VALUES (...) RETURNING id, slug`
    : await tx`UPDATE article SET ... WHERE id = ${beforeRows[0]!.id}::uuid AND instance_id = ${ctx.instanceId}::uuid RETURNING id, slug`;
const sourceId = rows[0]!.id;

// 2. 기존 link 로드
const existing: Array<{ target_type: string; target_id: string; relation_type: string }> = await tx`
  SELECT target_type, target_id, relation_type
    FROM content_entity_link
   WHERE instance_id = ${ctx.instanceId}::uuid
     AND source_type = ${sourceType}
     AND source_id = ${sourceId}::uuid
`;

// 3. 폼 input 파싱 → desired set
const desired = parseEvidenceLinks(formData, sourceType, allowedRelations);

// 4. diff
const toAdd = desired.filter(d => !existing.some(e => same(d, e)));
const toRemove = existing.filter(e => !desired.some(d => same(d, e)));

// 5. same-tenant 검증 (toAdd 만)
await verifySameTenant(tx, ctx.instanceId, toAdd);

// 6. DELETE toRemove + INSERT toAdd (단일 트랜잭션 안)
// 7. readiness 재계산 (this entity — § 6 정합 안 draft/published target 분기 검증 포함)
await computeReadinessForEntity(tx, ctx.instanceId, sourceType, sourceId);
```

기존 saveArticle/saveTreatmentPage/saveFaq 가 `INSERT ... ON CONFLICT (instance_id, slug) DO ... RETURNING slug` 형태이면 RETURNING 절을 `id, slug` 로 확장. UPDATE 도 마찬가지.

### 5.1 same-tenant 검증 (app-level · switch 기반 정적 SQL — cycle 1 #2 정합)

postgres-js template 안 식별자 동적 삽입 위험 회피 — target_type 별 switch 로 정적 SQL 분기:

```ts
// apps/web/src/lib/admin/content-entity-link.ts 안
export async function verifySameTenant(
  tx: ScopedTx,
  instanceId: string,
  links: ReadonlyArray<{ targetType: SeoLinkTargetType; targetId: string }>,
): Promise<void> {
  for (const link of links) {
    let exists: Array<{ exists: boolean }>;
    switch (link.targetType) {
      case "Publication":
        exists = await tx`SELECT 1 AS exists FROM publication
                           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1`;
        break;
      case "MediaAppearance":
        exists = await tx`SELECT 1 AS exists FROM media_appearance
                           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1`;
        break;
      case "FAQ":
        exists = await tx`SELECT 1 AS exists FROM faq
                           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1`;
        break;
      case "TreatmentPage":
        exists = await tx`SELECT 1 AS exists FROM treatment_page
                           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1`;
        break;
      case "Article":
        exists = await tx`SELECT 1 AS exists FROM article
                           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1`;
        break;
      default:
        throw new EvidenceLinkValidationError("invalid-target-type", `unsupported target_type: ${link.targetType}`);
    }
    if (exists.length === 0) {
      throw new EvidenceLinkValidationError(
        "cross-tenant-or-missing",
        `${link.targetType}/${link.targetId} 가 같은 instance 안 존재 안 함`,
      );
    }
  }
}
```

target_type 추가 시 (ELI-DEFER-03 합류 등) switch 안 case 추가. allowlist 컴파일 타임 보장.

### 5.2 revalidatePath 범위 확대

기존 `/admin/<slug>/articles` 외에:
- source 상세: `/<slug>/insights/<category>/<articleSlug>`
- 추가/제거된 target 별: 해당 entity 의 inverse 표시 페이지 (Phase 3 안 publication/media 상세 inverse 는 ELI-DEFER-02 라 일단 skip)
- 대시보드: `/admin/<slug>` (readiness 카드 갱신)

### 5.5 orphan link cleanup (cycle 1 #3 — 필수 신규)

polymorphic 구조라 DB cascade 없음 → entity 삭제 시 link 가 orphan 으로 남으면 시간이 지나면서 데이터 무결성 깨짐. **모든 delete action 안 source/target 양방향 정리 + 영향 받은 source 의 readiness 재계산 필수**.

#### 5.5.1 영향 받는 delete actions

| Entity | delete action 위치 | source/target 정리 | 영향 받는 source readiness 재계산 |
|---|---|---|---|
| Article | `articles/actions.ts` 안 `deleteArticle` | source_type='Article' DELETE (자체 link) + target_type='Article' DELETE (다른 source 의 link) | target 정리 후 영향 받은 모든 source entity 재계산 |
| TreatmentPage | `treatments/actions.ts` 안 `deleteTreatmentPage` | source + target 양방향 | 동일 |
| FAQ | `faqs/actions.ts` 안 `deleteFaq` | source + target 양방향 | 동일 |
| Publication | `publications/actions.ts` 안 `deletePublication` | target_type='Publication' DELETE 만 (Publication 은 source 안 됨) | 영향 받은 article·treatment readiness 재계산 |
| MediaAppearance | `media-appearances/actions.ts` 안 `deleteMediaAppearance` | target_type='MediaAppearance' DELETE 만 | 동일 |

#### 5.5.2 cleanup 패턴 (helper)

`apps/web/src/lib/admin/content-entity-link.ts` 안:

```ts
export async function cleanupLinksForEntityDelete(
  tx: ScopedTx,
  instanceId: string,
  entityType: SeoLinkSourceType | SeoLinkTargetType,
  entityId: string,
): Promise<{ affectedSources: Array<{ sourceType: string; sourceId: string }> }> {
  // (1) 영향 받는 source 목록 미리 수집 (readiness 재계산 위해)
  const affectedSources: Array<{ source_type: string; source_id: string }> = await tx`
    SELECT DISTINCT source_type, source_id
      FROM content_entity_link
     WHERE instance_id = ${instanceId}::uuid
       AND target_type = ${entityType}
       AND target_id = ${entityId}::uuid
  `;

  // (2) source 로 등장하는 link 삭제 (entity 가 source_type 가능한 경우만)
  if (["Article", "TreatmentPage", "FAQ"].includes(entityType)) {
    await tx`
      DELETE FROM content_entity_link
       WHERE instance_id = ${instanceId}::uuid
         AND source_type = ${entityType}
         AND source_id = ${entityId}::uuid
    `;
  }

  // (3) target 으로 등장하는 link 삭제
  await tx`
    DELETE FROM content_entity_link
     WHERE instance_id = ${instanceId}::uuid
       AND target_type = ${entityType}
       AND target_id = ${entityId}::uuid
  `;

  return {
    affectedSources: affectedSources.map((r) => ({ sourceType: r.source_type, sourceId: r.source_id })),
  };
}
```

#### 5.5.3 delete action 안 호출 패턴

```ts
// deleteArticle (예시)
await withSkeletonTx(..., async (tx, ctx) => {
  const { affectedSources } = await cleanupLinksForEntityDelete(tx, ctx.instanceId, "Article", articleId);

  // entity 본체 삭제
  await tx`DELETE FROM article WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${articleId}::uuid`;

  // 영향 받은 source readiness 재계산 (자신 + 다른 source 둘 다)
  for (const src of affectedSources) {
    await computeReadinessForEntity(tx, ctx.instanceId, src.sourceType as any, src.sourceId);
  }
});
```

**Publication·MediaAppearance 등 source_type 미해당 entity** 의 delete action 도 동일 helper 호출 (step 2 skip · step 3 만 동작).

## 6. readiness on-link-change 자동 재계산 (§ 6)

`apps/web/src/lib/seo-readiness/index.ts` 안 `computeReadinessForEntity` 신규 export (단일 entity — 현재는 `computeAllReadinessForInstance` 만 있음).

save action 끝에 호출:
```ts
await computeReadinessForEntity(tx, instanceId, "Article", articleId);
```

source 만 갱신 — target 의 readiness 는 그 entity 의 source 입장 데이터가 아니라 무관.

### 6.1 draft/published target 처리 정책 (cycle 1 #8 정합)

`has-evidence-link` · `has-related-faq` check 안 link 의 target status 를 고려해서 score 분기:

- `loadLinkCounts` (seo-readiness/index.ts) 안 query 를 확장 — JOIN 후 published count + draft count 둘 다 반환:

```ts
SELECT
  COUNT(*) FILTER (WHERE cel.relation_type IN ('cites','derived-from')
                       AND target_status_published)::int AS evidence_pub,
  COUNT(*) FILTER (WHERE cel.relation_type IN ('cites','derived-from')
                       AND NOT target_status_published)::int AS evidence_draft,
  ...
```
- evaluator (shared.ts 의 `checkHasEvidenceLink`) signature 확장:
  - `publishedCount > 0` → `pass`
  - `publishedCount = 0 AND draftCount > 0` → `warn` (link 자체 있으나 공개 안 됨 — 운영자에게 신호)
  - 둘 다 0 → `fail`
- `has-related-faq` 도 동일 패턴.

**가중치 적용**: warn 은 score 안 `weight × 0.5` (기존 score.ts 패턴 정합).

## 7. article 상세 site SSR inverse (§ 7)

`(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` 변경:

### 7.1 데이터 로드

`loadArticleDetail` 안 (또는 별도 helper `loadArticleEvidence`) 다음 query 추가:
```ts
const links = await tx`
  SELECT cel.relation_type, cel.target_type, cel.target_id, cel.display_order,
         -- target 별 JOIN
         COALESCE(p.title, m.title, f.question, t.title, a.title) AS title,
         COALESCE(p.slug, m.slug, f.slug, t.slug, a.slug) AS slug,
         COALESCE(p.summary, m.summary, f.answer, t.summary, a.summary) AS summary,
         p.url AS pub_url, p.published_date AS pub_date,
         m.channel_name, m.url AS media_url
    FROM content_entity_link cel
    LEFT JOIN publication p ON cel.target_type = 'Publication' AND p.id = cel.target_id AND p.instance_id = cel.instance_id AND p.status = 'published'
    LEFT JOIN media_appearance m ON cel.target_type = 'MediaAppearance' AND m.id = cel.target_id AND m.instance_id = cel.instance_id AND m.status = 'published'
    LEFT JOIN faq f ON cel.target_type = 'FAQ' AND f.id = cel.target_id AND f.instance_id = cel.instance_id
    LEFT JOIN treatment_page t ON cel.target_type = 'TreatmentPage' AND t.id = cel.target_id AND t.instance_id = cel.instance_id AND t.status = 'published'
    LEFT JOIN article a ON cel.target_type = 'Article' AND a.id = cel.target_id AND a.instance_id = cel.instance_id AND a.status = 'published'
   WHERE cel.instance_id = ${instanceId}::uuid
     AND cel.source_type = 'Article'
     AND cel.source_id = ${articleId}::uuid
   ORDER BY cel.relation_type, cel.display_order ASC
`;
```

**cycle 1 #8 정합**: 모든 JOIN 안 `AND <target_table>.status = 'published'` (또는 `active = true` for DoctorProfile) 명시. published 가 아닌 target 은 `null` 로 떨어지고 (LEFT JOIN), 렌더링 시 필터. **public SSR 안 unpublished target 은 절대 표시 안 함** — admin 안 사전 연결은 readiness 의 `warn` 신호로만 노출.

### 7.2 렌더 위치

본문 `</article>` 다음, 같은 카테고리 related grid 직전:

```tsx
{links.cites.length > 0 && (
  <section className="...">
    <SectionHeading eyebrow="Evidence" title="이 글의 근거" />
    <ul className="...">
      {links.cites.map(l => <EvidenceCard key={...} link={l} />)}
    </ul>
  </section>
)}
{links.relatedFaqs.length > 0 && (
  <section className="...">
    <SectionHeading eyebrow="FAQ" title="관련 자주 묻는 질문" />
    <FaqMiniList items={links.relatedFaqs} />
  </section>
)}
```

`<EvidenceCard>` 컴포넌트 신규 (`apps/web/src/components/site/EvidenceCard.tsx`) — Publication / MediaAppearance / TreatmentPage 모두 cover (target_type 별 분기).

## 8. treatment 상세 site SSR inverse (§ 8)

`(site)/treatments/[slug]/page.tsx` 변경.

### 8.1 데이터 로드

`loadTreatmentDetail` 안 동일 패턴 JOIN. `derived-from` 우선 노출 (clinical evidence 가 시술 페이지의 핵심).

### 8.2 렌더 위치

KEY_EFFECTS 3-step row 와 본문 2-col 사이 신규 section:

```tsx
{(links.derivedFrom.length > 0 || links.cites.length > 0) && (
  <section className="...">
    <SectionHeading eyebrow="Clinical Evidence" title="임상 근거" />
    {links.derivedFrom.length > 0 && <SubSection title="기반 연구" items={links.derivedFrom} />}
    {links.cites.length > 0 && <SubSection title="참고 자료" items={links.cites} />}
  </section>
)}
```

## 9. JSON-LD articleEntity 확장 (§ 9)

`apps/web/src/lib/json-ld/entities.ts` 안 `articleEntity` 시그니처 확장:

```ts
export function articleEntity(
  ctx: BuildContext,
  article: ArticleProjection,
  author: DoctorProjection | null,
  evidence: {
    cites: Array<PublicationProjection | MediaAppearanceProjection>;
    mentions: Array<{ type: "Article" | "TreatmentPage" | "FAQ"; ... }>;
  } | null,
): Article {
  return {
    "@type": "Article",
    ...,
    ...(evidence?.cites.length ? {
      citation: evidence.cites.map(c =>
        c.kind === "Publication"
          ? scholarlyArticleEntity(ctx, c, pageBaseUrl)
          : videoObjectEntity(ctx, c, pageBaseUrl)
      ),
    } : {}),
    ...(evidence?.mentions.length ? {
      mentions: evidence.mentions.map(m => ({
        "@type": "WebPage",
        "@id": `${pageBaseUrl}/...`,
        name: m.title,
      })),
    } : {}),
  };
}
```

`scholarlyArticleEntity` · `videoObjectEntity` 의 `pageBaseUrl` 인자 활용 — 현재 article 상세 페이지 base URL 을 그대로 전달 → fragment-scoped @id 가 페이지 안 self-contained.

## 10. JSON-LD medicalProcedureEntity 확장 (§ 10)

동일 패턴 — `citation` 필드 추가. `derived-from` 인 Publication 우선, `cites` 가 그 다음.

## 11. JSON-LD validate.ts allowlist (§ 11)

`apps/web/src/lib/json-ld/__tests__/validate.ts` 안 cross-page reference rule:
- article 안 ScholarlyArticle inline 출력 — 같은 페이지 fragment-scoped @id 라 안전.
- 단 같은 publication 이 doctor 상세 페이지와 article 상세 페이지 양쪽에 등장 시 `@id` 가 page base 별로 달라야 (fragment-scoped). 현 `scholarlyArticleEntity(ctx, pub, pageBaseUrl)` 가 그 패턴 사용 — 호환.
- 따라서 v1 안 validate.ts 변경 거의 불필요. cycle 1 안 사용자가 cross-page reference 채택 결정 시 cycle 1.5 안 추가.

## 12. data loading 최적화 (§ 12)

- `loadArticleDetail` · `loadTreatmentDetail` 안 link JOIN 1회 추가 — 총 query 1회 증가. N+1 회피.
- ISR (revalidate=60s) 정합 — 동일 cache 안에서.

## 13. 검증 시나리오

### Phase A — v1.0 acceptance 범위 (8건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| ELI-V01 | article 작성 폼 진입 | EvidenceLinkPanel 노출 — cites/related-to group + chip + 체크박스 list |
| ELI-V02 | published publication 1건 cites 추가 후 저장 | DB 안 content_entity_link INSERT (RETURNING id 정상) · 폼 재진입 시 chip 표시 |
| ELI-V03 | save 후 article 상세 site 진입 | "이 글의 근거" 섹션 노출 + published publication 카드만 (draft target 미노출) |
| ELI-V04 | readiness 재계산 (자동 hook) | `has-evidence-link` check pass · 점수 +20 (가중치 catalog 정합) |
| ELI-V05 | draft publication 만 연결 + 재계산 | `has-evidence-link` check **warn** (score 0.5 partial) — site SSR 안 미노출 |
| ELI-V06 | cross-tenant 시도 (다른 instance 의 publication_id 직접 form submit) | EvidenceLinkValidationError("cross-tenant-or-missing") + 저장 거부 (switch 기반 검증) |
| ELI-V07 | link 제거 후 저장 | DB DELETE · site SSR 안 섹션 사라짐 · readiness 카운트 환원 |
| ELI-V08 | publication 삭제 (deletePublication) | 연결된 article 의 link 자동 DELETE (orphan cleanup) + 영향 받은 article readiness 재계산 (점수 −20) |

### Phase B — JSON-LD enrichment (후속 cycle, 2건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| ELI-V09 | article 상세 view-source 안 JSON-LD `citation` 배열 | ScholarlyArticle inline (published target) · MediaAppearance 는 VideoObject inline |
| ELI-V10 | validate.ts (`pnpm --filter @glitzy/web test:scenarios` 안) | cross-page reference rule 통과 (또는 inline 전략 채택 시 별도 변경 불필요) |

### Phase A + B 공통

| # | 시나리오 | 기대 결과 |
|---|---|---|
| ELI-V11 | typecheck + 기존 시각 검수 (SVO-V01~V09) 무회귀 | 통과 |

## 14. 작업 manifest — Phase A / Phase B 분리

### Phase A — v1.0 acceptance 범위 (10 task)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| A1 | `MultiSelectField` 신규 (`components/forms/Field.tsx`) — **v1 축소: 체크박스 리스트 + chip 요약 · formData.getAll() 패턴** | export + props | — |
| A2 | `evidence-link-options.ts` 신규 (`lib/admin/`) | target_type 별 options loader (draft·active+inactive 포함, label suffix marker) | — |
| A3 | `EvidenceLinkPanel` 신규 (`components/admin/`) — relation_type 별 group + MultiSelectField 통합 + allowedRelations props | 컴포넌트 | A1·A2 |
| A4 | `content-entity-link.ts` 신규 (`lib/admin/`) — `loadContentEntityLinks` + `parseEvidenceLinks` (zod) + `verifySameTenant` (switch 정적 SQL) + `cleanupLinksForEntityDelete` | helper lib | — |
| A5 | `computeReadinessForEntity` 신규 export (`lib/seo-readiness/index.ts`) + `checkHasEvidenceLink` · `checkHasRelatedFaq` evaluator 의 draft/published 분기 (warn vs pass) | lib 갱신 | — |
| A6 | `saveArticle`·`saveTreatmentPage`·`saveFaq` 안 link diff 통합 — **INSERT/UPDATE RETURNING id 필수** · revalidatePath 확대 · 같은 트랜잭션 안 readiness 재계산 | 3 server action 갱신 | A4·A5 |
| A7 | `deleteArticle`·`deleteTreatmentPage`·`deleteFaq`·`deletePublication`·`deleteMediaAppearance` 안 `cleanupLinksForEntityDelete` 호출 + 영향 받은 source readiness 재계산 | 5 server action 갱신 (cycle 1 #3) | A4·A5 |
| A8 | 6 form page (article·treatment·faq × new+edit) 안 prefetch + `<EvidenceLinkPanel>` 삽입 | 6 page + Form props 확장 | A3·A6 |
| A9 | `<EvidenceCard>` 컴포넌트 신규 (`components/site/`) — Publication/MediaAppearance/TreatmentPage cover · published only | 컴포넌트 | — |
| A10 | article·treatment 상세 SSR inverse — `loadArticleDetail`·`loadTreatmentDetail` 안 link JOIN (published filter) + render 위치 | 2 site page + helper | A9 |
| A11 | typecheck + Phase A 검증 (ELI-V01~V08, V11) | — | A10 |

추정: **2~3일** (UI + 저장 + SSR + readiness — JSON-LD 분리됨).

### Phase B — 후속 cycle (3 task)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| B1 | JSON-LD `articleEntity` 확장 — `citation` (Publication→ScholarlyArticle inline, MediaAppearance→VideoObject inline) + `mentions` | entities.ts 갱신 | Phase A 완료 |
| B2 | JSON-LD `medicalProcedureEntity` 확장 — `citation` (derived-from 우선) | entities.ts 갱신 | B1 |
| B3 | validate.ts allowlist 갱신 (필요 시) + 검증 (ELI-V09~V10) | validate.ts + test 결과 | B2 |

추정: **1~2일**.

**합계**: Phase A 2~3일 + Phase B 1~2일 = **3~5일** (cycle 1 분리 권장 정합).

## 15. ELI-DEFER markers (재정리)

(§ 1.3 와 동일 — 본 절은 다른 plan 에서 link reference 용)

## 16. ELI-CASCADE markers

| marker | 항목 | 영향 |
|---|---|---|
| ELI-CASCADE-01 | SEO_VISIBILITY_OPS_PLAN v1.0 의 `content_entity_link` 데이터 모델 활용 시작 | 본 plan 완료 시 readiness check 4개 (`has-evidence-link`·`has-related-faq` 포함) 가 의미 있는 데이터로 동작 |
| ELI-CASCADE-02 | SEO_VISIBILITY_OPS_PLAN v1.0 SVO-CASCADE-05 (author_doctor_id FK SoT) | 본 plan 안 `authored-by` 관련 vocabulary 미도입 — § 4.3 FAQ 정합 |
| ELI-CASCADE-03 | ADMIN_UX_REDESIGN v1.0 의 공통 UI primitive | `MultiSelectField` 가 향후 `extract` skill 적용 시 ui primitive lib 합류 후보 |
| ELI-CASCADE-04 | `lib/seo-readiness` 의 `computeReadinessForEntity` 신규 export | Phase 4 (작성 폼 inline 점수 — ELI-DEFER-06) 안 재사용 |

## 17. 변경 이력

- **2026-05-21**: v0.1 draft 작성. SEO_VISIBILITY_OPS_PLAN v1.0 SVO-DEFER-03 본 구현 cycle 진입. 사전 조사 (사용자 형식 — 7 영역) 통해 도출된 결정:
  - MultiSelectField 컴포넌트는 codebase 안 부재 → 신규 도입 필요 (기존 `SelectField` 단일 select 만 있음)
  - article 상세·treatment 상세 site SSR 안 "근거 / 관련" 섹션 부재 → 신규 위치 결정 (article 안 본문 다음 · treatment 안 KEY_EFFECTS 다음)
  - JSON-LD `articleEntity` 안 `citation`·`mentions` 부재 + `medicalProcedureEntity` 매우 단순 → builder 확장
  - FAQ 의 기존 `relatedTreatmentId` FK 와 `content_entity_link.related-to` 중복 위험 → § 4.3 SoT 분리 정책 (FK 유지 + 추가 target_type 만 link)
  - same-tenant 검증은 v1 app-level (SVO-DEFER-10 정합)
- **2026-05-21**: v0.2 draft — Codex critique cycle 1 (9건) 전건 수용:
  - cycle1-#1 (필수) `saveArticle` 등 안 `INSERT/UPDATE RETURNING id` 명시 — link diff 시 sourceId 회수. § 5 + 작업 manifest A6 정합.
  - cycle1-#2 `verifySameTenant` 안 동적 table name 제거 → target_type 별 switch 기반 정적 SQL allowlist. § 5.1 코드 예시 명시.
  - cycle1-#3 (필수) orphan link cleanup — § 5.5 신규 절 + 작업 manifest A7 신규 (5 delete action 갱신 + cleanup helper).
  - cycle1-#4 hidden input 직렬화: CSV → 동일 name 다중 hidden input + `formData.getAll()` + zod `z.array(z.string())`. § 2.1 · § 4.4.
  - cycle1-#5 MultiSelectField v1 범위 축소 — 체크박스 리스트 + chip 요약만. 검색·combobox·aria multiselectable 키보드 → ELI-DEFER-01 (cycle 1.1).
  - cycle1-#6 `authored-by` 미도입 재확인 (SVO-CASCADE-05 정합).
  - cycle1-#7 FAQ relatedTreatmentId SoT 분리 재확인 (§ 4.3).
  - cycle1-#8 draft/published target 처리 정책 (§ 4 신규 절 · § 6.1 readiness 분기 · § 7·8 public SSR published filter) — admin selector=draft 포함 / public SSR=published 만 / readiness=draft 만 연결 시 `warn`, published 가 있으면 `pass`.
  - cycle1-#9 JSON-LD enrichment 를 본 plan 안 **Phase B** 로 분리 — Phase A (저장+SSR+readiness) 가 v1.0 acceptance 의 범위. Phase B 는 후속 cycle (v1.1). § 1.2 표 · § 13 검증 시나리오 · § 14 작업 manifest 모두 분리 반영.
