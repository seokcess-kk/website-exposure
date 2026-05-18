# M0 vertical slice schema v0.1 — codex 자동 비평 cycle 1

당신은 신중한 senior reviewer. 본 prompt의 plan·SQL·Drizzle schema를 직접 읽고 결함을 모두 찾아라.

## SoT

- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1 (본 cycle 신규)
- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 § 4.3·4.4 (Week 4 ~15 tables·P0)
- `docs/core/DATA_MODEL.md` C-01·C-02·C-03·C-04·C-08·C-21
- `docs/admin/REVIEW_WORKFLOW.md` (state machine)
- `docs/compliance/{CONTENT_STANDARDS, RISK_LEVELS, MEDICAL_AD_COMPLIANCE_COMMON}.md`
- 기존 Spike A LOCAL_PASS 패턴 (RLS NULLIF·composite FK·CHECK)
- 기존 packages: db·auth·core-content (신규)

## v0.1 산출물

### Plan
- `docs/decisions/M0_SCHEMA_PLAN.md` — DATA_MODEL P0 entity 분류·~15 tables 매핑·packages 분산·migration namespace·SoT cascade

### packages/db extend
- `migrations/D0010_instance.sql` — Instance (multi-tenant root)·slug regex·UNIQUE·active index

### packages/core-content (신규)
- 6 SQL migrations:
  - C0001 clinic_profile (C-01)
  - C0002 location_profile (C-21)
  - C0003 doctor_profile (C-02)
  - C0004 treatment_page (C-03·content_publication_status enum 포함)
  - C0005 article (C-04·composite FK to doctor_profile)
- src/schema.ts — Drizzle schema (6 tables + enum)
- src/index.ts — named exports

### v0.2~ deferred (M0_SCHEMA_PLAN 명시)
- C-14 MedicalSpecialty (global)·C-22 ArticleCategory·C-10 ComplianceRecord
- NotificationEvent (REVIEW_WORKFLOW state machine integration)
- 각 entity의 detail column·sub-table (DoctorEducation·DoctorExperience·Awards 등)

## 검토 관점

### 1. DATA_MODEL 정합성
- ClinicProfile (C-01) v0.4 SoT 변경: 위치·전화·시간 필드 제거·locations[] FK — v0.1은 본 변경 반영? clinic_profile에는 phone·time 컬럼 없음·locations은 별도 location_profile table·FK는 m:n needed? 또는 location_profile에 instance_id로만 연결
- locations[] cardinality: 단지점 1·다지점 N — Optional vs Required 명시
- DoctorProfile (C-02): education·experience·specialty는 v0.2 별도 table·v0.1은 metadata jsonb로 가능?
- TreatmentPage (C-03)·Article (C-04): 모든 필수 column (title·summary·body·status·published_at·risk_level)
- C-08 InstanceManifest는 매우 큰 spec·v0.1 instance table은 핵심 (slug·name·active)만 — 정합?
- C-10 ComplianceRecord deferred·하지만 treatment_page·article에 compliance_record_id placeholder — FK는 v0.2

### 2. Spike A 패턴 적용
- 모든 tenant table: RLS ENABLE·FORCE·NULLIF wrapping·app_tenant_user GRANT
- composite FK (instance_id, parent_id)·same-tenant 강제
- CHECK constraints: slug regex·length·enum·email regex
- partial unique·partial index — 적용 적합?

### 3. Drizzle schema vs SQL 정합
- 7 tables/enum 모두 Drizzle와 raw SQL 정확 일치
- index.where·CHECK definitions·composite FK·unique 모두 매핑
- drizzle-kit generate 결과와 raw SQL byte-equal 가능?

### 4. SoT cascade
- DATA_MODEL → core-content schema 명시
- RISK_LEVELS·CONTENT_STANDARDS → risk_level enum (4종 + null)·compliance_record_id 연결
- REVIEW_WORKFLOW → content_publication_status enum (5종: draft·in-review·approved·published·archived)
- SCHEMA_MAPPING·SEARCH_STANDARDIZATION → 본 v0.1 schema에서 미반영 (deferred)

### 5. 누락·결함
- audit_log 통합 — packages/db에 이미 있으나 core-content는 instance_id FK 추가 필요? 또는 audit_log는 단일 cross-cutting concern
- NotificationEvent 부재 — Phase 0 Week 4 M0의 핵심 (REVIEW_WORKFLOW transition publish 등) — v0.2 deferred 명시 충분?
- migration ordering: D0010 (db) → C0001~C0005 (core-content) 순서·packages/migrations-runner에서 통합 apply할 때 cross-package depends_on 명시 manifest 없음
- RLS policy의 `instance` table 자체는 RLS 없음 — admin이 모든 instance 보는 super-admin path·정합?
- locations[] cardinality (clinic_profile-location_profile m:n)이 schema에 명시 안 됨 — 단순 instance_id FK로만·clinic_profile은 location_profile에 직접 link 없음
- doctor_profile·treatment_page·article에서 location_profile 참조 없음 — 다지점 운영 시 어느 지점·어느 의료진이 어느 시술인가? metadata jsonb로 미루기·또는 별도 join table

### 6. build·typecheck
- 8 packages 모두 PASS
- Drizzle schema strict tsc PASS
- drizzle-orm dependency 추가됨

## 평가 형식

```json
{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [...],
  "new_major_findings": [...],
  "new_minor_findings": [...],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```

v0.1 minimal·blocking·major 결함 다수 발견 자연.
