# SEO_VISIBILITY_OPS_PLAN (v1.0·acceptance·2026-05-21)

> **상태**: **v1.0 (acceptance)** — Phase 0+1 코드 구현 + 시각 검수 (SVO-V01~V09) prod 데이터 통과. cycle 1 critique 4건 전건 수용 + cycle 2 시각 검수에서 추가 비평 0건. acceptance 근거: (a) Phase 0 4 entity 마이그레이션 prod 적용 완료 · (b) Phase 1 readiness lib + 6 카드 대시보드 + keywords placeholder UI 구현 완료 · (c) typecheck 통과 (compliance-rules pre-existing 제외) · (d) prod 데이터로 RLS 격리 · readiness 재계산 · 6 카드 표시 모두 정상 동작 확인.

> **acceptance commit 구성**: Phase 0+1 단일 deliverable — (1) migrations C0031~C0034 (4건) · (2) drizzle schema 4 entity + index re-export · (3) `apps/web/src/lib/seo-readiness/` (9 file) · (4) `lib/admin/visibility-overview.ts` · (5) `(admin)/.../visibility-actions.ts` · (6) `components/admin/visibility/` 2 component · (7) `(admin)/.../page.tsx` 갱신 · (8) `(admin)/.../keywords/page.tsx` placeholder. 후속 phase (Phase 2~6) 는 별 plan.

> **다음 cycle**: 후속 phase 진행 — 권장 순서 Phase 3 (근거 연결 UI · EVIDENCE_LINKING_PLAN) → Phase 2 (SEO_KEYWORD_STRATEGY_PLAN) → Phase 4 (검수 큐 재활성화) → Phase 5 (Search Console 연동) → Phase 6 (콘텐츠 캘린더). 이유: Phase 3 가 본 plan 안 `content_entity_link` 의 실제 활용 시작 → readiness 점수가 실제로 오르는 첫 가시적 ROI.

> **본 plan 의 위상**: 어드민 패러다임을 **“콘텐츠 발행 CMS”** 에서 **“키워드 점유율·근거·노출 운영 콘솔”** 로 전환. ADMIN_UX_REDESIGN v1.0 의 “운영자 출시 워크스페이스” 다음 단계 — 출시된 콘텐츠가 *실제로 노출되도록 운영* 하는 도구. Phase 0 (스키마 4 entity) + Phase 1 (대시보드 v1) 만 본 plan 의 acceptance 범위. Phase 2~6 은 marker 만 명시.

## SoT

- 사용자 의견 (2026-05-21 메시지 2건) — 본 plan 의 우선순위·구조 SoT (7개 항목 + 통합 검토 + 4가지 결론)
- `CLAUDE.md` § 프로젝트 개요 — “네이버 검색 신뢰도 (2025-2026 AI 브리핑·통합 랭킹) 정합” 본 plan 의 1차 타깃
- `CLAUDE.md` § 3-Layer — Preset Feature Modules 안 `search-visibility` · `keyword-monitoring` · `analytics-reporting` 본 plan 이 핵심 진입점
- `docs/decisions/ADMIN_UX_REDESIGN_PLAN.md` v1.0 — “출시 워크스페이스” 의 후속 단계 marker
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — `compliance_record.content_type` + `content_ref` polymorphic 패턴 정합 (본 plan 안 `content_entity_link`·`seo_readiness_snapshot` 도 동일 패턴)
- 기존 packages 시그니처:
  - `packages/core-content/src/schema.ts` — drizzle entity 정의 (본 plan 안 4 entity 추가)
  - `packages/core-content/migrations/C0001~C0030_*.sql` — manifest 외 패턴 (`migrate-late.ts` 경로) 답습
  - `apps/web/src/lib/admin/dashboard-data.ts` — `loadDashboardSummary` 재사용 (Phase 1 안 “콘텐츠 재고” 하위 섹션)
  - `apps/web/src/lib/json-ld/builders.ts` — readiness check 안 JSON-LD 결함 검증 재사용
  - `apps/web/src/lib/compliance/publishable-check.ts` — publishable evaluator 재사용
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx` — Phase 1 안 카드 grid 교체 대상

> **표기 규칙**: ADMIN_UX_REDESIGN 정합 — SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase. 동일 개념 매핑: `seo_readiness` (DB) ↔ `seoReadiness` (TS) ↔ "노출 준비도" (운영자 표시).

## 1. 목적과 범위

### 1.1 목적 — 사용자 의견 정합

- **패러다임 전환**: “병원 홈페이지 CMS” → “키워드 점유율·콘텐츠 근거·내부 링크·색인·성과 개선을 관리하는 SEO/GEO 운영 콘솔”.
- **노출 현황 우선**: 대시보드 첫 카드를 “아티클 N건” 이 아니라 “이 사이트는 어떤 키워드에서 이길 준비가 됐는가” 시그널로 교체.
- **근거 연결을 1급 시민으로**: `article` ↔ `doctor_profile` · `publication` · `media_appearance` · `faq` · `treatment_page` 다대다 link 를 폴리모픽 구조로 도입. 공개 사이트의 JSON-LD `citation` · `author` enrichment 자동.
- **키워드/토픽 클러스터 도입**: 콘텐츠를 *개별 글 단위* 가 아니라 *키워드 점유율* 관점에서 관리. 발행 랜덤성 → 점유율 전략.
- **내부 시그널 우선**: Search Console 외부 API 없이도 계산 가능한 readiness 부터 노출. 외부 API 데이터는 Phase 5 합류 시 추가 (스키마는 그때 확장).

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| **§ 2 데이터 모델 (Phase 0)** | 4 entity 신규 — `keyword_target` · `keyword_content_link` · `content_entity_link` · `seo_readiness_snapshot`. 모두 폴리모픽 패턴 (compliance_record 답습). RLS tenant_isolation + same-tenant invariant 검증 |
| **§ 3 readiness 계산 lib (v1)** | `apps/web/src/lib/seo-readiness/` 신규. entity 별 score (0~100) · grade (A~F) · checks · blocking_issues · recommendations 산출. JSON-LD 결함·근거 미연결·30일 stale·키워드 매핑 등 7~10 체크 항목 |
| **§ 4 대시보드 v1 (Phase 1)** | `apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx` 카드 영역 교체. 상단 6 운영 카드 + 하단 “콘텐츠 재고” (기존 count 카드 축소 유지) |
| **§ 5 server actions** | `recomputeAllReadinessAction` (전체 재계산) · `recomputeEntityReadinessAction` (entity 별) · on-save 자동 갱신 hook (compliance auto-check 와 동일 위치) |
| **§ 6 UI 컴포넌트** | `apps/web/src/components/admin/dashboard/` 신규 — 6 카드 컴포넌트 + ContentInventoryCollapsed |
| **§ 7 작업 manifest** | Phase 0 (4 migration + drizzle) → Phase 1 (lib + UI) 순서 |
| **§ 8 검증 시나리오** | (a) 기존 demo 사이트 대시보드 로드 + 6 카드 표시 (b) 신규 복제 instance 의 readiness 빈 상태 → 재계산 → 채워짐 (c) 근거 연결 시 readiness 자동 갱신 (d) JSON-LD 결함 가짜 inject → 카드 카운트 +1 |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| 키워드 작성 UI (`/admin/<slug>/keywords`) · 키워드 ↔ 콘텐츠 매핑 UI | Phase 2 (별 plan: `SEO_KEYWORD_STRATEGY_PLAN`) | SVO-DEFER-01 |
| 작성 폼 안 inline SEO/GEO 점수 표시 (article/treatment/faq form 내 readiness widget) | Phase 3 (별 plan: `SEO_INLINE_SCORING_PLAN`) | SVO-DEFER-02 |
| 근거 연결 UI (작성 폼 안 selector + site SSR inverse 표시 + JSON-LD enrichment) | Phase 3 의 일부 (또는 별 plan: `EVIDENCE_LINKING_PLAN`) — Phase 1 안에서는 *스키마만* 도입, *UI 와 site 자동 inverse 는 별 plan* | SVO-DEFER-03 |
| 검수 큐 재활성화 (콘텐츠 품질/리스크 큐) | Phase 4 — Phase 3 readiness widget 합류 후 review_queue_entry 재배치 | SVO-DEFER-04 |
| Google Search Console / 네이버 서치어드바이저 API 연동 | Phase 5 (별 plan: `SEARCH_VISIBILITY_INGEST_PLAN`). 본 plan 안 스키마는 **만들지 않음** — Phase 5 합류 시 `search_visibility_snapshot` 등 추가 | SVO-DEFER-05 |
| 콘텐츠 캘린더 · 리프레시 큐 (30/60/90일 갱신 알림 · 성과 하락 감지 · 계절성 추천) | Phase 6 (Phase 5 데이터 의존) | SVO-DEFER-06 |
| readiness 시계열 보존 (snapshot 가 최신 1건이 아니라 시계열로 누적) | Phase 5 합류 시 — 시계열 데이터가 필요한 시점은 외부 API 데이터와 결합할 때 | SVO-DEFER-07 |
| cross-instance 비교 · 학습 (가장 노출 잘되는 instance 패턴 → 다른 instance 추천) | M2+ | SVO-DEFER-08 |
| AI 콘텐츠 작성 보조 (키워드 → article draft · 갱신 추천) | Phase Beta (LLM 통합 cycle) — ADMIN_UX_REDESIGN UX-DEFER-08 정합 | SVO-DEFER-09 |
| polymorphic link 의 DB trigger 안 same-tenant 검증 (CHECK 강제) | Phase 0 v2 — v1 은 app-level (server action) 검증만 | SVO-DEFER-10 |

## 2. 데이터 모델 (Phase 0)

### 2.1 `keyword_target` (C0031)

타깃 키워드 entity. 대표/보조 계층 + intent · priority · difficulty · status.

```sql
CREATE TABLE keyword_target (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,                    -- '인천-피부과' · URL 미사용 (내부 식별만)
  label TEXT NOT NULL,                   -- '인천 피부과' (사람 가독)
  keyword_type TEXT NOT NULL,            -- 'primary' | 'secondary'
  parent_id UUID,                        -- secondary → primary 참조 (self-FK)
  intent TEXT NOT NULL,                  -- 'informational' | 'comparison' | 'pre-booking' | 'local'
  priority TEXT NOT NULL DEFAULT 'P1',   -- 'P0' | 'P1' | 'P2'
  difficulty INTEGER,                    -- 0~100 (수기 입력 또는 Phase 5 자동)
  region_scope TEXT,                     -- '인천' · '인천 부평구' (지역 키워드)
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'paused' | 'won' | 'dropped'
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT keyword_target_slug_regex CHECK (slug ~ '^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$'),
  CONSTRAINT keyword_target_keyword_type_check CHECK (keyword_type IN ('primary', 'secondary')),
  CONSTRAINT keyword_target_intent_check CHECK (intent IN ('informational', 'comparison', 'pre-booking', 'local')),
  CONSTRAINT keyword_target_priority_check CHECK (priority IN ('P0', 'P1', 'P2')),
  CONSTRAINT keyword_target_status_check CHECK (status IN ('active', 'paused', 'won', 'dropped')),
  CONSTRAINT keyword_target_difficulty_range CHECK (difficulty IS NULL OR difficulty BETWEEN 0 AND 100),
  CONSTRAINT keyword_target_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT keyword_target_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT keyword_target_parent_fk FOREIGN KEY (instance_id, parent_id)
    REFERENCES keyword_target (instance_id, id) ON DELETE SET NULL
);

CREATE INDEX keyword_target_instance_idx ON keyword_target (instance_id);
CREATE INDEX keyword_target_status_idx ON keyword_target (instance_id, status, priority);
CREATE INDEX keyword_target_parent_idx ON keyword_target (instance_id, parent_id) WHERE parent_id IS NOT NULL;

ALTER TABLE keyword_target ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_target FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON keyword_target
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON keyword_target TO app_tenant_user;
```

**slug regex 변경**: 한글 허용 (`가-힣`) — 키워드는 한글 입력이 자연스러움. instance.slug 규칙 (영문만) 과 의도적 분리. (별 cycle 안 critique 시 “키워드는 한글 허용” 결정 marker SVO-CRITIQUE-01).

### 2.2 `keyword_content_link` (C0032)

키워드 ↔ 콘텐츠 (`article` · `treatment_page` · `faq` · `publication` · `media_appearance`) 다대다 link. 폴리모픽.

```sql
CREATE TABLE keyword_content_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  keyword_id UUID NOT NULL,
  entity_type TEXT NOT NULL,             -- 'Article' | 'TreatmentPage' | 'FAQ' | 'Publication' | 'MediaAppearance'
  entity_id UUID NOT NULL,
  relevance_score INTEGER NOT NULL DEFAULT 50,  -- 1~100 (수기 또는 자동)
  is_primary BOOLEAN NOT NULL DEFAULT false,    -- 이 콘텐츠가 이 키워드의 primary target 인가
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT keyword_content_link_entity_type_check CHECK (
    entity_type IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance')
  ),
  CONSTRAINT keyword_content_link_relevance_range CHECK (relevance_score BETWEEN 1 AND 100),
  CONSTRAINT keyword_content_link_unique UNIQUE (instance_id, keyword_id, entity_type, entity_id),
  CONSTRAINT keyword_content_link_keyword_fk FOREIGN KEY (instance_id, keyword_id)
    REFERENCES keyword_target (instance_id, id) ON DELETE CASCADE
);

CREATE INDEX keyword_content_link_instance_idx ON keyword_content_link (instance_id);
CREATE INDEX keyword_content_link_keyword_idx ON keyword_content_link (instance_id, keyword_id);
CREATE INDEX keyword_content_link_entity_idx ON keyword_content_link (instance_id, entity_type, entity_id);
CREATE INDEX keyword_content_link_primary_idx ON keyword_content_link (instance_id, keyword_id)
  WHERE is_primary = true;

ALTER TABLE keyword_content_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_content_link FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON keyword_content_link
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON keyword_content_link TO app_tenant_user;
```

**same-tenant 정합**: `keyword_id` 는 composite FK 로 강제됨. `entity_id` 는 폴리모픽이라 DB FK 불가 — app-level 검증 (server action 안 source/target 의 instance_id 매치 체크).

### 2.3 `content_entity_link` (C0033) — **최우선 entity (사용자 강조)**

콘텐츠 ↔ 콘텐츠/엔티티 폴리모픽 link. 근거 연결의 1급 시민.

```sql
CREATE TABLE content_entity_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,             -- 'Article' | 'TreatmentPage' | 'FAQ' (콘텐츠 entity)
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL,             -- 'Publication' | 'MediaAppearance' | 'FAQ' | 'TreatmentPage' | 'Article'
  target_id UUID NOT NULL,
  relation_type TEXT NOT NULL,           -- whitelist: 'cites' · 'related-to' · 'derived-from' (v1 — 3종)
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_entity_link_source_type_check CHECK (
    source_type IN ('Article', 'TreatmentPage', 'FAQ')
  ),
  CONSTRAINT content_entity_link_target_type_check CHECK (
    target_type IN ('Publication', 'MediaAppearance', 'FAQ', 'TreatmentPage', 'Article')
  ),
  CONSTRAINT content_entity_link_relation_type_check CHECK (
    relation_type IN ('cites', 'related-to', 'derived-from')
  ),
  CONSTRAINT content_entity_link_unique UNIQUE (
    instance_id, source_type, source_id, target_type, target_id, relation_type
  ),
  CONSTRAINT content_entity_link_not_self CHECK (
    NOT (source_type = target_type AND source_id = target_id)
  )
);

CREATE INDEX content_entity_link_instance_idx ON content_entity_link (instance_id);
CREATE INDEX content_entity_link_source_idx ON content_entity_link (instance_id, source_type, source_id, relation_type);
CREATE INDEX content_entity_link_target_idx ON content_entity_link (instance_id, target_type, target_id, relation_type);

ALTER TABLE content_entity_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_entity_link FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON content_entity_link
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON content_entity_link TO app_tenant_user;
```

**`source_type` 안 `Publication`·`MediaAppearance`·`DoctorProfile` 제외**: 이들은 *target 만 됨* (논문이 article 을 cite 하지 않음). v1 vocabulary 확정. Phase 3+ 확장 가능.

**`target_type` 안 `DoctorProfile` 제외 (v1)** — 콘텐츠 ↔ doctor 연결은 이미 `article.author_doctor_id` · `treatment_page` 의 author FK 가 SoT (SVO-CASCADE-05). 이중 SoT 회피. v1 안 content_entity_link 는 *보강용 근거/관련 layer* 로 제한.

**vocabulary 초기 3종 (cycle 1 cycle 안 5종 → 3종 축소)**:
- `cites` — `Article` cites `Publication`/`MediaAppearance` (학술 인용 + 미디어 출연 인용)
- `related-to` — generic 관련 콘텐츠 (`FAQ` related-to `TreatmentPage` · `Article` related-to `Article` 등)
- `derived-from` — `TreatmentPage` derived-from `Publication` (clinical evidence — protocol 기반)

**v1 안 미포함 vocabulary (SVO-DEFER-03 합류 시 확장)**:
- `authored-by` — 기존 `author_doctor_id` FK SoT 와 이중 SoT 회피 위해 v1 미도입. readiness check `has-author-doctor` 는 FK 직접 검사로 (§ 3.1).
- `appears-in` — doctor↔media 직접 link · source_type 제한 (콘텐츠 entity 3종) 안 자연스럽지 않음. doctor 가 source 가 되는 vocabulary 가 필요해질 때 별 cycle 합류.

### 2.4 `seo_readiness_snapshot` (C0034)

entity 별 readiness 캐시. 최신 1건만 보존 (UNIQUE).

```sql
CREATE TABLE seo_readiness_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,             -- 'Article' | 'TreatmentPage' | 'FAQ' | 'Publication' | 'MediaAppearance' | 'DoctorProfile' | 'ClinicProfile'
  entity_id UUID NOT NULL,
  score INTEGER NOT NULL,                -- 0~100
  grade TEXT NOT NULL,                   -- 'A' | 'B' | 'C' | 'D' | 'F'
  checks JSONB NOT NULL DEFAULT '[]',         -- [{key, label, status: 'pass'|'fail'|'warn', detail?}]
  blocking_issues JSONB NOT NULL DEFAULT '[]', -- [{key, label, severity}]
  recommendations JSONB NOT NULL DEFAULT '[]', -- [{key, label, action_hint?}]
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT seo_readiness_snapshot_entity_type_check CHECK (
    entity_type IN ('Article', 'TreatmentPage', 'FAQ', 'Publication', 'MediaAppearance', 'DoctorProfile', 'ClinicProfile')
  ),
  CONSTRAINT seo_readiness_snapshot_score_range CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT seo_readiness_snapshot_grade_check CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
  CONSTRAINT seo_readiness_snapshot_checks_array CHECK (jsonb_typeof(checks) = 'array'),
  CONSTRAINT seo_readiness_snapshot_blocking_array CHECK (jsonb_typeof(blocking_issues) = 'array'),
  CONSTRAINT seo_readiness_snapshot_recommendations_array CHECK (jsonb_typeof(recommendations) = 'array'),
  CONSTRAINT seo_readiness_snapshot_unique UNIQUE (instance_id, entity_type, entity_id)
);

CREATE INDEX seo_readiness_snapshot_instance_idx ON seo_readiness_snapshot (instance_id);
CREATE INDEX seo_readiness_snapshot_grade_idx ON seo_readiness_snapshot (instance_id, grade);
CREATE INDEX seo_readiness_snapshot_score_idx ON seo_readiness_snapshot (instance_id, score);
CREATE INDEX seo_readiness_snapshot_stale_idx ON seo_readiness_snapshot (instance_id, computed_at);

ALTER TABLE seo_readiness_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_readiness_snapshot FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON seo_readiness_snapshot
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON seo_readiness_snapshot TO app_tenant_user;
```

**최신 1건 보존**: UPSERT 패턴 (`ON CONFLICT (instance_id, entity_type, entity_id) DO UPDATE`). 시계열은 SVO-DEFER-07.

### 2.5 drizzle schema 갱신

`packages/core-content/src/schema.ts` 안 4 entity 추가. enum 은 `pgEnum` 미사용 (CHECK 으로 통일) — 후속 ADD VALUE 부담 회피. types 는 TS literal union 으로:

```ts
export type KeywordType = 'primary' | 'secondary';
export type KeywordIntent = 'informational' | 'comparison' | 'pre-booking' | 'local';
export type KeywordPriority = 'P0' | 'P1' | 'P2';
export type KeywordStatus = 'active' | 'paused' | 'won' | 'dropped';
export type LinkRelationType = 'cites' | 'related-to' | 'derived-from';
export type SeoEntityType = 'Article' | 'TreatmentPage' | 'FAQ' | 'Publication' | 'MediaAppearance' | 'DoctorProfile' | 'ClinicProfile';
export type SeoGrade = 'A' | 'B' | 'C' | 'D' | 'F';
```

### 2.6 manifest 정합

C0021~C0030 패턴 답습 — **manifest 외 (`migrate-late.ts`)** 로 운영. CLAUDE.md `LL-DEFER-20` 본 구현 시 통합.

## 3. readiness 계산 lib (v1)

`apps/web/src/lib/seo-readiness/` 신규.

```
seo-readiness/
├─ index.ts                 — public API
├─ catalog.ts               — check 항목 catalog (key · label · weight · 평가 fn 시그니처)
├─ evaluators/
│  ├─ article.ts            — Article 전용 평가 7~10 check
│  ├─ treatment.ts          — TreatmentPage 전용
│  ├─ faq.ts                — FAQ 전용
│  └─ shared.ts             — entity-agnostic check (JSON-LD 결함·30일 stale 등)
├─ score.ts                 — score 산출 (weighted sum) + grade 매핑
└─ persist.ts               — seo_readiness_snapshot UPSERT
```

### 3.1 check 항목 catalog (v1 — 약 7~10종)

| key | label | 적용 entity | 평가 |
|---|---|---|---|
| `title-has-target-keyword` | 제목에 타깃 키워드 포함 | Article · Treatment | `keyword_content_link.is_primary=true` 인 keyword.label 이 title 안 substring |
| `summary-length-ok` | 메타 설명 길이 적정 (80~200자) | Article · Treatment · FAQ | DB CHECK 와 별개 — site OG description 노출 길이 검증 |
| `answer-first-paragraph` | 첫 문단 answer-first | Article · FAQ | body_markdown 첫 문단 안 question 형태 회피 + 결론 문장 ≤ 200자 |
| `has-author-doctor` | 의료진 저자 연결 | Article · Treatment | `entity.author_doctor_id IS NOT NULL` (기존 FK 직접 검사 — SVO-CASCADE-05) |
| `has-evidence-link` | 논문/미디어 근거 연결 | Article · Treatment | `content_entity_link.relation_type IN ('cites', 'derived-from')` 존재 |
| `has-related-faq` | 관련 FAQ 연결 | Article · Treatment | `relation_type = 'related-to'` + target_type='FAQ' 존재 |
| `internal-links-min` | 내부 링크 최소 3개 | Article · Treatment | body_markdown 안 `/[^)]+\)` markdown link → instance slug 매칭 ≥ 3 |
| `image-alt-coverage` | 이미지 alt 텍스트 100% | Article · Treatment | body_markdown 안 `![alt](url)` 의 alt 비율 |
| `json-ld-validatable` | JSON-LD 생성 가능 | All | `json-ld/builders.ts` 호출 → throw 안 됨 + required field 모두 채워짐 |
| `freshness-ok` | 30일 이내 업데이트 | All | `updated_at` > NOW() - 30 days |

### 3.2 score 산출

각 check 의 weight 합 = 100. score = 100 × Σ(weight × pass) / Σ(weight). grade 매핑:
- A: 90~100
- B: 75~89
- C: 60~74
- D: 40~59
- F: 0~39

### 3.3 blocking_issues vs recommendations

- **blocking_issues**: 발행 차단 후보 (예: JSON-LD 결함, body 누락). 운영자가 무시 가능하지만 강한 경고.
- **recommendations**: 개선 가능 항목 (예: 의료진 미연결, 내부 링크 부족). C/D 등급 entity 안 노출.

### 3.4 trigger 시점

- **on-save**: 작성 폼 server action 안 `recomputeEntityReadiness` 호출 (compliance auto-check 와 같은 자리). 트랜잭션 안 — 저장 실패 시 readiness 도 rollback.
- **manual**: 대시보드 “전체 재계산” 버튼 → `recomputeAllReadinessAction` (server action) → 모든 entity loop. 100+ entity 인 instance 안 비동기 처리 필요할 수 있음 (Phase 1 v1 은 sync, 100+ 안 timeout 발견 시 Phase 1 v1.1 안 cron 도입).
- **on-link-change**: `content_entity_link` 추가/삭제 시 source entity 의 readiness 재계산. SVO-DEFER-03 합류 시.

## 4. 대시보드 v1 (Phase 1)

### 4.1 카드 6종 명세

| # | 카드 제목 | 데이터 | 표시 |
|---|---|---|---|
| 1 | **타깃 키워드 커버리지** | `keyword_target.count` · `keyword_content_link.count` 안 `is_primary=true` distinct keyword | "5/12 키워드에 primary 콘텐츠 연결됨" + 미연결 키워드 목록 (top 3) → `/admin/<slug>/keywords` link (SVO-DEFER-01 까지는 빈 페이지 또는 안내) |
| 2 | **평균 SEO readiness** | `AVG(score) FROM seo_readiness_snapshot WHERE entity_type IN ('Article','TreatmentPage','FAQ')` | "78점 / 100 (B)" + grade 분포 stacked bar (A/B/C/D/F 카운트) |
| 3 | **근거 미연결 콘텐츠** | `Article`·`TreatmentPage` 중 `content_entity_link.relation_type='authored-by'` 또는 `'cites'`/`'derived-from'` 0건 | "12건 — 의료진 또는 논문/미디어 미연결" + 상위 5건 link |
| 4 | **30일+ 미업데이트** | `entity.updated_at < NOW() - 30 days AND status='published'` (Article·Treatment·FAQ) | "8건 — 최근 한달 갱신 없음" + 가장 오래된 5건 link |
| 5 | **JSON-LD 결함 의심** | `seo_readiness_snapshot.blocking_issues @> '[{"key":"json-ld-validatable","severity":"high"}]'` | "3건 — schema.org 검증 실패 가능" + 해당 entity link |
| 6 | **발행 중 품질 개선 대상** | `status='published'` AND `seo_readiness_snapshot.grade IN ('C','D','F')` (Article·Treatment·FAQ) | "12건 — 발행됐지만 readiness 낮음 (C/D/F)" + 점수 낮은 순 상위 5건 link. **이전 cycle '발행 가능 콘텐츠' 정의에서 변경 (cycle 1 critique 정합)** — 현 codebase 가 즉시 발행 모드라 `status='publishable'`/`'approved'` row 가 거의 0건. 운영 가치 우선 — 이미 발행된 콘텐츠의 품질 개선이 *발행 가능 큐* 보다 actionable. Phase 6 콘텐츠 리프레시 큐의 v0 역할 (SVO-DEFER-06 합류 시 확장) |

### 4.2 카드별 query 전략

- 6개 카드 모두 단일 SQL 쿼리 또는 `Promise.all` 병렬 (CLAUDE.md “Server Component 안 독립 query 는 Promise.all 병렬화” 정합).
- query helper: `apps/web/src/lib/admin/visibility-overview.ts` 신규.

### 4.3 UI 영역 분할

```
/admin/<slug>
├─ 헤더 (clinic.name + 병원 정보 편집 link)
├─ 빠른 작업 (기존 유지)
├─ ─── 신규 ───
├─ 노출 운영 현황 (h2)
│   └─ 카드 grid (1 → 2 → 3 column, 반응형) — 6 카드
├─ ─── 신규 끝 ───
├─ ─── 신규 ───
├─ 콘텐츠 재고 (h2, collapsed 가능 · v1 은 항상 노출)
│   └─ 기존 EntityCountCard 6개 (의료진/시술/아티클/FAQ/논문/미디어/공개정책)
├─ ─── 신규 끝 ───
└─ 이 사이트 복제 섹션 (기존 유지)
```

## 5. server actions

### 5.1 `recomputeAllReadinessAction(instanceSlug)`

- `requirePageContext(instanceSlug)` 인증
- 모든 entity (`Article`·`TreatmentPage`·`FAQ`·`Publication`·`MediaAppearance`·`DoctorProfile`·`ClinicProfile`) loop
- 각 entity 별 `evaluators/<type>.ts` 호출 → `persist.ts` 의 UPSERT
- 대시보드 revalidate

### 5.2 `recomputeEntityReadinessAction(instanceSlug, entityType, entityId)`

- 단일 entity. 작성 폼 저장 직후 호출 (단순화: 일단 v1 안 explicit 호출 안 하고 manual 만 — Phase 3 합류 시 작성 폼 cycle 안 통합).

### 5.3 server actions 위치

- `apps/web/src/app/(admin)/admin/[instanceSlug]/visibility-actions.ts` 신규

## 6. UI 컴포넌트

`apps/web/src/components/admin/visibility/` 신규:

- `VisibilityOverviewSection.tsx` — 6 카드 wrapping section (server component)
- `KeywordCoverageCard.tsx` (client — collapse/expand)
- `AverageReadinessCard.tsx`
- `UnlinkedEvidenceCard.tsx`
- `StaleContentCard.tsx`
- `JsonLdDefectCard.tsx`
- `LowReadinessPublishedCard.tsx` (cycle 1 cycle 안 `PublishableContentCard` 에서 rename — § 4.1 #6 정합)
- `RecomputeReadinessButton.tsx` (client — `useTransition` 안 server action 호출)

기존 `EntityCountCard` 는 그대로 — `ContentInventorySection.tsx` 안 wrapping 만.

## 7. 작업 manifest

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | C0031 keyword_target migration + drizzle | sql + schema.ts | — |
| 2 | C0032 keyword_content_link migration + drizzle | sql + schema.ts | 1 |
| 3 | C0033 content_entity_link migration + drizzle | sql + schema.ts | — |
| 4 | C0034 seo_readiness_snapshot migration + drizzle | sql + schema.ts | — |
| 5 | seo-readiness lib v1 (catalog · evaluators · score · persist) | lib/seo-readiness/* | 4 |
| 6 | visibility-overview query helper | lib/admin/visibility-overview.ts | 1·2·3·4·5 |
| 7 | server actions (recomputeAll · recomputeEntity) | (admin)/.../visibility-actions.ts | 5 |
| 8 | 6 카드 컴포넌트 + section + 재계산 버튼 | components/admin/visibility/* | 6·7 |
| 9 | page.tsx 카드 grid 교체 + ContentInventorySection 도입 | (admin)/.../page.tsx | 8 |
| 9.5 | **keywords placeholder page (404 회피)** — KeywordCoverageCard 의 link 가 가는 곳. "Phase 2 예정" 안내 + 빈 상태 표시. cycle 1 critique 반영 | (admin)/.../keywords/page.tsx | — |
| 10 | typecheck + 시각 검수 가이드 | — | 9·9.5 |

추정 작업량: **1.5~3일** (사용자 추정 정합).

## 8. 검증 시나리오 (v1)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| SVO-V01 | 기존 demo 사이트 `/admin/demo` 진입 | 6 신규 카드 + 하단 콘텐츠 재고 모두 렌더 |
| SVO-V02 | 신규 복제 instance `/admin/clone-test-1` 진입 | readiness 카드 “데이터 없음” fallback + “전체 재계산” 버튼 prominent |
| SVO-V03 | “전체 재계산” 버튼 클릭 | readiness 가 DB 안 채워지고 카드 카운트 갱신 |
| SVO-V04 | 의료진 한 명에 article 한 건 `content_entity_link.relation_type='authored-by'` 수기 INSERT 후 재계산 | `UnlinkedEvidenceCard` 카운트 1 감소 |
| SVO-V05 | keyword_target 1건 INSERT + `keyword_content_link.is_primary=true` 연결 | `KeywordCoverageCard` 1/1 표시 |
| SVO-V06 | article 의 updated_at 을 35일 전으로 강제 UPDATE 후 재계산 | `StaleContentCard` 카운트 +1 |
| SVO-V07 | JSON-LD 결함 fake fixture inject | `JsonLdDefectCard` 카운트 +1 |
| SVO-V08 | RLS 정합 — instance A 의 admin 가 instance B 의 readiness 조회 시 | 0건 (다른 instance 데이터 미노출) |
| SVO-V09 | typecheck `pnpm -w run typecheck:all` | 통과 (compliance-rules pre-existing 제외) |

## 9. SVO-DEFER markers (재정리)

| marker | 항목 | Defer to |
|---|---|---|
| SVO-DEFER-01 | 키워드 관리 UI · `/admin/<slug>/keywords` 페이지 · 키워드 ↔ 콘텐츠 매핑 UI | Phase 2 (`SEO_KEYWORD_STRATEGY_PLAN`) |
| SVO-DEFER-02 | 작성 폼 안 inline SEO/GEO 점수 widget | Phase 3 (`SEO_INLINE_SCORING_PLAN`) |
| SVO-DEFER-03 | 근거 연결 UI + site SSR inverse + JSON-LD enrichment | Phase 3 의 일부 (또는 `EVIDENCE_LINKING_PLAN`) |
| SVO-DEFER-04 | 검수 큐 재활성화 (콘텐츠 품질/리스크 큐) | Phase 4 |
| SVO-DEFER-05 | Google Search Console / 네이버 서치어드바이저 연동 | Phase 5 (`SEARCH_VISIBILITY_INGEST_PLAN`) |
| SVO-DEFER-06 | 콘텐츠 캘린더 · 리프레시 큐 | Phase 6 |
| SVO-DEFER-07 | readiness 시계열 보존 | Phase 5 합류 시 |
| SVO-DEFER-08 | cross-instance 비교·학습 | M2+ |
| SVO-DEFER-09 | AI 콘텐츠 작성 보조 | Phase Beta (UX-DEFER-08 정합) |
| SVO-DEFER-10 | polymorphic link 의 DB trigger same-tenant 검증 | Phase 0 v2 (v1 은 app-level) |

## 10. SVO-CASCADE markers

| marker | 항목 | 영향 |
|---|---|---|
| SVO-CASCADE-01 | `compliance_record.content_type` polymorphic 패턴 답습 | 본 plan 안 `content_entity_link.source_type`·`target_type` · `keyword_content_link.entity_type` · `seo_readiness_snapshot.entity_type` 모두 동일 패턴 |
| SVO-CASCADE-02 | CLAUDE.md Feature Modules 안 `search-visibility` · `keyword-monitoring` · `analytics-reporting` 본 plan 안 정의 시작 | docs/features/ 에 별 cycle 안 marker 정리 |
| SVO-CASCADE-03 | `dashboard-data.loadDashboardSummary` 재사용 (콘텐츠 재고 하단) | 폐기 X, 위치 이동만 |
| SVO-CASCADE-04 | `json-ld/builders.ts` readiness check 안 재사용 | 본 plan 안 `evaluators/shared.ts` 에서 import |
| SVO-CASCADE-05 | 콘텐츠 ↔ doctor 연결은 기존 `author_doctor_id` FK 가 SoT — content_entity_link 안 `authored-by` relation 도입 X | 이중 SoT 회피. readiness `has-author-doctor` 는 FK 직접 검사 |

## 11. 변경 이력

- **2026-05-21**: v0.1 draft 작성. 사용자 의견 2건 (7항목 + 통합 검토 4결론) 정합.
- **2026-05-21**: v0.2 draft — Codex critique cycle 1 (4건) 전건 수용:
  - cycle1-#1 `content_entity_link` 의 `authored-by` relation 제거 → 기존 `author_doctor_id` FK 가 SoT (SVO-CASCADE-05). vocabulary 5종 → 3종 (`cites` · `related-to` · `derived-from`). `target_type` 안 `DoctorProfile` 제외.
  - cycle1-#2 `appears-in` relation 제거 (방향성 모호 — source_type 제한과 충돌). SVO-DEFER-03 정의 강화.
  - cycle1-#3 `/admin/<slug>/keywords` placeholder page 추가 (404 회피). 작업 manifest § 7 안 task #9.5 신규.
  - cycle1-#4 "발행 가능 콘텐츠" → "발행 중 품질 개선 대상" 재정의 (즉시 발행 모드 정합). 컴포넌트 `PublishableContentCard` → `LowReadinessPublishedCard` rename. 카드 의미 = `status='published'` AND `grade IN ('C','D','F')`.
- **2026-05-21**: v1.0 acceptance — Phase 0+1 코드 구현 완료 + prod 데이터 시각 검수 통과 (SVO-V01~V09):
  - Migration 4건 prod 적용 (manifest 외 — `migrate-late` 경로)
  - readiness lib (catalog 7 check · 3 evaluators · score · persist) prod 동작 확인 — 평균 readiness 점수·grade 분포 정상 산출
  - 6 카드 (키워드 커버리지 · 평균 readiness · 근거 미연결 · 30일+ stale · JSON-LD 결함 · 발행 중 품질 개선 대상) prod 데이터 렌더 정상
  - "전체 재계산" 버튼 → recomputeAllReadinessAction → tx 안 모든 entity loop + UPSERT + router.refresh 정상
  - keywords placeholder page (`/admin/<slug>/keywords`) 404 회피 정상
  - RLS 격리: instance 간 readiness 분리 확인
  - cycle 2 추가 critique 0건 — v1.0 격상
