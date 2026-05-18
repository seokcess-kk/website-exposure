# M0 vertical slice schema plan (v0.1·2026-05-15)

본 문서는 Phase 0 Week 4 M0 vertical slice schema (~15 tables) 의 plan이다.

## SoT

- `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 § 4.3 "Week 4 M0 vertical slice schema (~15 tables)"
- `docs/core/DATA_MODEL.md` C-01~C-23
- `docs/admin/REVIEW_WORKFLOW.md` (state machine·multi-role AND gate)
- `docs/compliance/RISK_LEVELS.md`·`MEDICAL_AD_COMPLIANCE_COMMON.md`·`CONTENT_STANDARDS.md`

## P0 entity 분류 (M0 vertical slice — ~15 tables)

| # | DATA_MODEL | Entity | Package | Priority |
|---|---|---|---|---|
| 1 | C-08 | Instance (multi-tenant root) | db | P0 |
| 2 | C-01 | ClinicProfile | core-content (신규·Phase 0) | P0 |
| 3 | C-21 | LocationProfile | core-content | P0 |
| 4 | C-02 | DoctorProfile | core-content | P0 |
| 5 | C-14 | MedicalSpecialty (global·instance scope 없음) | core-content | P0 |
| 6 | C-22 | ArticleCategory | core-content | P0 |
| 7 | C-03 | TreatmentPage | core-content | P0 |
| 8 | C-04 | Article | core-content | P0 |
| 9 | C-10 | ComplianceRecord | core-content | P0 |
| 10 | — | AuditLog (이미 db에 base — M0 extend) | db | P0 (이미) |
| 11 | C-23 | AdminUser (이미 auth) | auth | P0 (이미) |
| 12 | — | InstanceMembership (이미 auth) | auth | P0 (이미) |
| 13 | — | Session (이미 auth) | auth | P0 (이미) |
| 14 | — | VerificationToken (이미 auth) | auth | P0 (이미) |
| 15 | — | **Notification P0 subset** (INFRA v1.0 정정): Receipt·Log·PayloadRecord·DeliveryAttempt tables. **NotificationEvent는 DB table 아님 — notify() input envelope** | notifications-outbox v0.3+ | P0 (확장·v0.2~) |

**기존 packages 재사용**: 11~14 (auth)·10 (db audit_log)·15 placeholder (notifications-outbox)
**M0 신규 작성**: 1~9 = 9 tables (1 db Instance·8 core-content)

## packages/db extend (Instance·M0 audit_log)

- Instance table 신규 — multi-tenant root·`packages/db/migrations/D0010_instance.sql`
- audit_log v1 → v2 — content_ref column 확장 등 (cycle 이후)

## packages/core-content (Phase 0 신규)

새 package 생성:
- `packages/core-content/src/`
- migration D0011~D0018 (8 tables): clinic_profile·location_profile·doctor_profile·medical_specialty·article_category·treatment_page·article·compliance_record
- 의존성: `@glitzy/db`·`@glitzy/shared-types`·`@glitzy/shared-errors`

## packages/notifications-outbox extend

- Notification P0 subset tables — `packages/notifications-outbox/migrations/N0010_receipt.sql·N0011_log.sql·N0012_payload_record.sql·N0013_delivery_attempt.sql` (INFRA v1.0 정정 — NotificationEvent는 DB table 아님)
- REVIEW_WORKFLOW state transition 기록·outbox enqueue 대상

## v0.1 scope (본 cycle)

**core 6 tables만 v0.1**:
1. Instance (db extend)
2. ClinicProfile
3. LocationProfile
4. DoctorProfile
5. TreatmentPage
6. Article

**v0.2~ deferred**:
- MedicalSpecialty (global·각 instance 공유)
- ArticleCategory (Pillar 분류)
- ComplianceRecord (compliance gate)
- Notification P0 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) — NotificationEvent는 envelope (DB table 아님)

이유: DATA_MODEL의 각 entity가 50~100 필드·M0 vertical slice는 핵심 column만 (id·name·slug·body·created/updated·FK·RLS)·이후 cycle에서 detail 확장.

## Migration namespace

| Package | Prefix | Range |
|---|---|---|
| @glitzy/db | D | D0001 base (이미 LOCAL_PASS 검증)·D0010+ M0 |
| @glitzy/auth | A | A0001~A0004 (이미 spike-e LOCAL_PASS 검증) |
| @glitzy/core-content | C | C0001~C0008 (M0 core) |
| @glitzy/notifications-outbox | N | N0001 (이미)·N0010+ M0 |
| @glitzy/storage | S | S0001 (필요 시) |

## 공통 패턴 (모든 M0 table)

- UUID PK (gen_random_uuid)
- `instance_id UUID NOT NULL` (Instance·global table 제외)
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` (또는 trigger)
- RLS ENABLE + FORCE·tenant_isolation policy (Spike A 패턴)
- composite FK `(instance_id, parent_id)` (cross-tenant FK 차단)
- CHECK constraints (slug regex·length·status enum)
- 의료법 SoT cascade (RiskLevel·complianceStatus 등 enum)

## SoT cascade

- DATA_MODEL v0.24 → core-content schema
- REVIEW_WORKFLOW v1.0 → ComplianceRecord status·content_publication_status 9 states (cycle2 정합)
- CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON → ComplianceRecord·column metadata
- SCHEMA_MAPPING → JSON-LD output (M0 read-only·Week 4+ 본 구현)
- SEARCH_STANDARDIZATION → AI crawler·search visibility (M0 schema·Week 4+ 실 구현)

## acceptance gate v0.1

- `pnpm pkg:typecheck` PASS (신규 core-content package 포함)
- `pnpm pkg:build` PASS
- migration SQL valid·LOCAL postgres apply 가능
- Drizzle schema와 raw SQL byte-equal (drizzle-kit generate 비교)
- RLS policy 모든 tenant table에 적용
- CHECK constraints 명시 (DATA_MODEL의 기본 validation 만)

## v0.2~ deferred

- v0.2: MedicalSpecialty·ArticleCategory·ComplianceRecord 추가 (9 tables)
- v0.3: Notification P0 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) + REVIEW_WORKFLOW state machine integration
- v0.4: 모든 entity의 detail column·FK·index·partial unique 추가
- v0.5: BrandTokens·PageMeta·InstanceManifest 등 P1 entity

## Deferred 11 findings 개별 SoT cascade markers (M0-23 cycle4)

codex 비평 cycle 1·2에서 deferred·M0 v0.3 acceptance scope 외 항목·각 항 별도 cycle 또는 milestone에서 close:

| Finding | Defer to | Reason |
|---|---|---|
| **M0-04** clinic-location FK·m:n cardinality | Phase 0 Week 4 본 구현 (M0 v1.0) | architecture decision required (m:n join table vs location.clinic_id FK)·DATA_MODEL C-01 v0.4 spec과 정합 별도 분석 필요 |
| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
| **M0-08** P0 ~15 tables count vs v0.x 6 tables | M0 v1.0 Phase 0 Week 4 schema migration green | 본 v0.x는 minimum scope·detail은 Phase 0 Week 4 본 구현 시점 |
| **M0-09** TreatmentPage typed fields (overview·mechanism·targetAudience·process·precautions·pageRiskLevel) | M0 v1.0 Phase 0 Week 4 | DATA_MODEL C-03 detail·M0 v0.x는 body_markdown·metadata jsonb로 minimal·typed sub-table은 Phase 0 본 구현 |
| **M0-10** DoctorProfile credentials·education·experience·specialty | M0 v1.0 Phase 0 Week 4 | DATA_MODEL C-02 detail·M0 v0.x는 metadata jsonb·typed sub-table (DoctorEducation·DoctorExperience·Award·Affiliation) 별도 |
| **M0-11** ClinicProfile medicalSpecialty·locations FK·URL validation | M0 v1.0 Phase 0 Week 4 | M0-04와 함께 archi 결정 후 진행·URL CHECK constraint은 v0.4 |
| **M0-12** LocationProfile phone format·businessHours·reservationChannels | M0 v1.0 Phase 0 Week 4 | DATA_MODEL C-21 master spec·typed sub-table BusinessHours·ReservationChannel 별도 |
| **M0-13** instance vs InstanceManifest 경계 | C-08 InstanceManifest 별도 entity (M0 v0.5+) | C-08은 적용 SoT·정책·featurePolicyVersion·notificationChannels 등 매우 큰 spec·instance는 minimal projection (id·slug·active) 명시 marker |
| **M0-14** audit_log M0 extension | packages/db v0.2 separate scope | content_ref·action cascade는 REVIEW_WORKFLOW transition publish 시점·M0 schema와 독립 |
| **M0-19** updated_at trigger | post-hardening (Phase 0 Week 5+) | DEFAULT now() + application layer touch로 v0.x 충분·trigger는 부수 효과 검증 후 |
| **M0-20** SQL apply·RLS·drizzle-kit diff empirical gate | M0 v1.0 Phase 0 Week 4 LOCAL_PASS 실측 | docker postgres apply·RLS scenario 실 검증·drizzle-kit generate diff 0·본 v0.x는 static typecheck·byte-equal 시점 별도 |

본 marker로 deferred 11항 모두 추적 가능·M0 v0.x acceptance scope 외 명시.
