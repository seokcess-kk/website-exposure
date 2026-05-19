Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3a67-c621-7a72-a306-46834a7f3779
--------
user
Review code of `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — **cycle 2**. cycle 1 13 finding (blocking 3·major 6·minor 4) patch 검증 + 새 finding 확인.

## Cycle 1 patches

| # | severity | title | patch |
|---|---|---|---|
| CAMC-01 | blocking | publishContentAction publish 흐름 막힘 | entity.compliance_record_id 선행 요구 제거 — publish 시 채움 |
| CAMC-02 | blocking | C0016 sentinel backfill 6 entity | LegalDocument · FAQ 도 sentinel INSERT/UPDATE 추가 |
| CAMC-03 | blocking | approveContent required_roles 검증 | entry.required_roles 잠금 조회 + 본인 role 포함 검증 |
| CAMC-04 | major | submitForReviewAction FOR UPDATE | SELECT 안 FOR UPDATE 추가 |
| CAMC-05 | major | UPDATE row count 검증 | publish UPDATE WHERE status='publishable' AND_clause + row count 1 검증 |
| CAMC-06 | major | assertTransitionAllowed 일관 | publish 안 entity current status assert |
| CAMC-07 | major | audit payload shape | finalRoles·pageRiskLevel·recordVersion 포함 |
| CAMC-08 | major | exempt envelope maxRisk | buildLegalDocumentExemptEnvelope 안 maxRisk |
| CAMC-09 | major | review detail content preview | PREVIEW_QUERIES allowlist · title/summary/body read-only |
| CAMC-10 | minor | SubmitForReviewResult shape | finalRoles · pageRiskLevel return |
| CAMC-11 | minor | publishContent recordVersion return | PublishContentResult.recordVersion |
| CAMC-12 | minor | saveArticle audit current status | locked row.status 사용 (form 변조 방지) |
| CAMC-13 | minor | vitest spawn EPERM | (codex 환경 — 우리 환경 vitest 72/72 PASS) |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=13 → cycle2=N

## cycle 1 patch 검증
- CAMC-01: PASS/FAIL + 한 줄
... (CAMC-01 ~ CAMC-13)

## new findings

## acceptance 판정
```

cycle 1 13건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
검토 범위를 문서 버전과 현재 패치 상태로 맞춰서 확인하겠습니다. 먼저 관련 파일과 변경 이력, 테스트/코드 위치를 빠르게 찾겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "publishContentAction|approveContent|required_roles|submitForReviewAction|assertTransitionAllowed|buildLegalDocumentExemptEnvelope|PREVIEW_QUERIES|PublishContentResult|SubmitForReviewResult|C0016|compliance_record_id" -S .' in C:\Users\assag\solution\website-exposure
 succeeded in 787ms:
 M .claude/scheduled_tasks.lock
 M apps/spike-a/package.json
 M apps/spike-a/pgbouncer/userlist.txt
 M apps/web/.env.example
 M apps/web/package.json
 D apps/web/src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M apps/web/src/app/layout.tsx
 M apps/web/src/app/page.tsx
 M apps/web/src/app/sign-in/consume/route.ts
 M apps/web/src/components/forms/ArticleForm.tsx
 M apps/web/src/lib/env.ts
 M apps/web/src/seed.ts
 M apps/web/src/styles/globals.css
 M apps/web/tailwind.config.ts
 M docs/core/DATA_MODEL.md
 M docs/core/PAGE_TYPES.md
 M docs/core/SCHEMA_MAPPING.md
 M docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M packages/core-content/src/index.ts
 M pnpm-lock.yaml
?? apps/web/scripts/admin-qa-token.ts
?? apps/web/scripts/seed-fixture-eat.sql
?? apps/web/scripts/seed-fixture.sql
?? apps/web/scripts/site-scenarios.md
?? apps/web/src/app/(admin)/admin/
?? apps/web/src/app/(site)/
?? apps/web/src/components/forms/ArticleCategoryForm.tsx
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/components/forms/FaqForm.tsx
?? apps/web/src/components/forms/MediaAppearanceForm.tsx
?? apps/web/src/components/forms/PublicationForm.tsx
?? apps/web/src/components/forms/ReviewEntryActionForm.tsx
?? apps/web/src/components/forms/WorkflowActionButtons.tsx
?? apps/web/src/components/site/
?? apps/web/src/lib/compliance/
?? apps/web/src/lib/db-projection.test.ts
?? apps/web/src/lib/db-projection.ts
?? apps/web/src/lib/eat-content-schema.ts
?? apps/web/src/lib/errors.ts
?? apps/web/src/lib/json-ld/
?? apps/web/src/lib/markdown.test.ts
?? apps/web/src/lib/markdown.ts
?? apps/web/src/lib/public-db.ts
?? apps/web/src/lib/public-tenant.ts
?? apps/web/src/lib/site-initial.ts
?? apps/web/src/lib/site-metadata.test.ts
?? apps/web/src/lib/site-metadata.ts
?? apps/web/src/lib/site-url.ts
?? apps/web/vitest.config.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md
?? docs/decisions/EAT_CONTENT_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/PROJECT_OVERVIEW.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/migrations/C0009_article_category.sql
?? packages/core-content/migrations/C0010_publication.sql
?? packages/core-content/migrations/C0011_media_appearance.sql
?? packages/core-content/migrations/C0012_faq.sql
?? packages/core-content/migrations/C0013_article_category_fk.sql
?? packages/core-content/migrations/C0014_compliance_record.sql
?? packages/core-content/migrations/C0015_review_queue_entry.sql
?? packages/core-content/migrations/C0016_status_unlock.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/db/migrations/D0011_public_reader.sql
?? packages/db/migrations/D0014_public_reader_eat.sql
?? packages/migrations-runner/src/

 succeeded in 829ms:
.\docs\decisions\EAT_CONTENT_PLAN.md:327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1757:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1792:    complianceRecordId: uuid("compliance_record_id"),
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:44:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:170:-- CAM-15 정정: required_roles enum array 운영
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:180:  compliance_record_id UUID NOT NULL,
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:184:  required_roles approver_role[] NOT NULL,
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:194:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:201:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:225:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:226:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:232:-- packages/core-content/migrations/C0016_status_unlock.sql
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:244:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:245:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:246:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:250:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:252:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:254:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:256:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:258:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:260:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:263:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:278:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:279:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:282:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:295:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:296:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:299:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:313:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:314:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:317:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:329:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:330:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:333:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:335:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:339:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:340:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:341:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:342:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:343:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:344:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:345:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:346:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:347:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:348:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:349:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:350:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:354:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:356:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:358:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:360:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:362:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:364:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:375:  IF NEW.compliance_record_id IS NULL THEN
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:376:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:378:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:380:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:582:      "Use buildLegalDocumentExemptEnvelope() instead."
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:637:  ? buildLegalDocumentExemptEnvelope(input)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:674:- assertTransitionAllowed 검증은 workflow action 안 수행
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:699:export async function approveContent(
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:722:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:731:// approveContent 안 race 차단
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:755:REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:761:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:762:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:764:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:765:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:769:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:775:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:776:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:784:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:785:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:789:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:794:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:829:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:840:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8529: 181:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8564: 216:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:53:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:65:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:66:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:67:42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:69:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:102:180:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:104:201:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:106:225:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:107:229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:110:243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:111:244:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:112:245:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:113:246:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:114:250:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:115:252:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:116:254:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:117:256:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:118:258:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:119:260:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:120:263:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:126:278:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:127:279:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:129:282:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:135:295:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:136:296:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:138:299:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:145:313:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:146:314:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:148:317:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:154:329:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:155:330:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:157:333:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:158:335:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:159:339:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:160:340:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:161:341:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:162:342:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:163:343:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:164:344:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:165:345:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:166:346:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:167:347:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:168:348:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:169:349:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:170:350:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:171:354:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:172:356:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:173:358:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:174:360:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:175:362:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:176:364:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:180:375:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:181:376:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:182:378:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:183:380:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:187:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:202:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:205:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:210:582:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:217:637:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:229:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:232:769:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:234:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:236:784:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:237:785:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:245:839:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:246:840:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:335:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:370:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:371:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:372:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:374:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:376:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:377:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:500:-- CAM-15 정정: required_roles enum array 운영
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:510:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:514:  required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:524:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:531:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:555:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:556:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:559:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:562:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:573:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:574:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:575:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:576:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:580:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:582:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:584:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:586:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:588:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:590:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:593:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:608:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:609:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:612:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:625:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:626:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:629:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:643:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:644:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:647:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:659:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:660:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:663:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:665:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:669:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:670:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:671:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:672:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:673:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:674:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:675:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:676:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:677:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:678:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:679:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:680:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:684:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:686:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:688:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:690:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:692:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:694:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:705:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:706:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:708:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:710:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:736:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:876:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:900:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:912:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:967:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1004:- assertTransitionAllowed 검증은 workflow action 안 수행
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1029:export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1052:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1061:// approveContent 안 race 차단
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1085:REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1091:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1092:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1093:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1094:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1095:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1099:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1103:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1105:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1106:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1114:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1115:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1119:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1124:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1159:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1169:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1170:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1173:cycle 4 패치는 §1.1, §4.3, 시나리오 #3/#13 쪽에서 일관되게 반영되어 있습니다. 새 blocking/major 후보가 있는지 C0016/검수 흐름의 남은 모순만 빠르게 훑고 있습니다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1182:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1184:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1186:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1187:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1196:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1197:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1200:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1203:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1214:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1215:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1216:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1217:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1221:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1223:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1225:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1227:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1229:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1231:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1234:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1249:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1250:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1253:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1266:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1267:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1270:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1284:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1285:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1288:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1300:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1301:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1304:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1306:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1310:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1311:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1312:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1313:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1314:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1315:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1316:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1317:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1318:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1319:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1320:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1321:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1325:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1327:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1329:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1331:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1333:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1335:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1346:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1347:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1349:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1351:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1377:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1516:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "compliance_record_id|CREATE TABLE (article|treatment_page|faq|legal_document|publication|media_appearance)|export const (article|treatment|faq|legal|publication|media)" packages/core-content docs/core/DATA_MODEL.md docs/core/SCHEMA_MAPPING.md' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1522:packages/core-content\src\schema.ts:182:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1524:packages/core-content\src\schema.ts:217:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1531:packages/core-content\src\schema.ts:489:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1533:packages/core-content\migrations\C0004_treatment_page.sql:22:  compliance_record_id UUID,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1535:packages/core-content\migrations\C0005_article.sql:14:  compliance_record_id UUID,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1541:packages/core-content\migrations\C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1553:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1577:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1589:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-5.out.md:1644:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:59:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:60:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:61:42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:63:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:88:180:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:90:201:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:92:225:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:93:229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:94:243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:95:244:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:96:245:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:97:246:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:98:250:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:99:252:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:100:254:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:101:256:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:102:258:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:103:260:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:104:263:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:110:278:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:111:279:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:113:282:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:119:295:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:120:296:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:122:299:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:128:313:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:129:314:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:131:317:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:137:329:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:138:330:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:140:333:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:141:335:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:142:339:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:143:340:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:144:341:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:145:342:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:146:343:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:147:344:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:148:345:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:149:346:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:150:347:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:151:348:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:152:349:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:153:350:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:154:354:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:155:356:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:156:358:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:157:360:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:158:362:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:159:364:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:162:375:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:163:376:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:164:378:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:165:380:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:168:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:193:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:209:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:212:769:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:215:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:217:784:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:218:785:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:224:838:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:225:839:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:233:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:268:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:269:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:270:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:272:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:274:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:275:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:398:-- CAM-15 정정: required_roles enum array 운영
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:408:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:412:  required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:422:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:429:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:453:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:454:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:457:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:460:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:471:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:472:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:473:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:474:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:478:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:480:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:482:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:484:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:486:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:488:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:491:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:506:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:507:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:510:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:523:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:524:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:527:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:541:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:542:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:545:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:557:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:558:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:561:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:563:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:567:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:568:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:569:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:570:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:571:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:572:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:573:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:574:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:575:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:576:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:577:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:578:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:582:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:584:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:586:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:588:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:590:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:592:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:603:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:604:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:606:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:608:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:634:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:774:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:798:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:810:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:865:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:902:- assertTransitionAllowed 검증은 workflow action 안 수행
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:927:export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:950:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:959:// approveContent 안 race 차단
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:983:REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:989:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:990:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:991:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:992:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:993:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:997:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1001:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1003:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1004:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1012:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1013:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1017:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1022:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1057:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1066:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1067:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1081:761:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1082:762:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1083:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1084:764:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1085:765:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1089:769:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1093:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1095:775:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1113:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1114:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1115:42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1117:44:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1119:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1120:47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1152:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1176:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1188:582:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-4.out.md:1243:637:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.prompt.md:8:| CAM2-02 | blocking | LegalDocument check() 우회 일관 | submitForReview 분기에서 buildLegalDocumentExemptEnvelope() 호출 + check() 내부 LegalDocument 진입 시 throw |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.prompt.md:9:| CAM2-03 | blocking | C0016 sentinel backfill 6 entity | Article · TreatmentPage · LegalDocument(no-op) · FAQ(no-op) · Publication · MediaAppearance 모두 명시 + NULL 검증 6건 + VALIDATE 6건 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:21:| CAM2-02 | blocking | LegalDocument check() 우회 일관 | submitForReview 분기에서 buildLegalDocumentExemptEnvelope() 호출 + check() 내부 LegalDocument 진입 시 throw |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:22:| CAM2-03 | blocking | C0016 sentinel backfill 6 entity | Article · TreatmentPage · LegalDocument(no-op) · FAQ(no-op) · Publication · MediaAppearance 모두 명시 + NULL 검증 6건 + VALIDATE 6건 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2089:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2124:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2125:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2126:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2128:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2131:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2254:-- CAM-15 정정: required_roles enum array 운영
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2264:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2268:  required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2278:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2285:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2309:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2310:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2313:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2316:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2327:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2328:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2329:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2330:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2334:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2336:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2338:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2340:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2342:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2344:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2347:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2362:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2363:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2366:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2379:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2380:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2383:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2397:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2398:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2401:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2413:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2414:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2417:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2419:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2423:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2424:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2425:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2426:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2427:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2428:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2429:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2430:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2431:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2432:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2433:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2434:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2438:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2440:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2442:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2444:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2446:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2448:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2459:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2460:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2462:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2464:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2490:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2630:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2654:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2666:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2721:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2758:- assertTransitionAllowed 검증은 workflow action 안 수행
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2783:export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2806:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2815:// approveContent 안 race 차단
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2839:REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2845:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2846:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2848:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2849:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2853:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2859:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2860:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2868:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2869:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2873:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2878:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2913:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2921:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:2922:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4269:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"C0016|sentinel|backfill|VALIDATE|LegalDocument\\(no-op\\)|FAQ\\(no-op\\)|Article|TreatmentPage|Publication|MediaAppearance|calculateFinalRoles|unknown|ComplianceConfigError|evaluatePublishable|configError|manual-review 큐 1종\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4271:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"scenario|시나리오|check\\(\\) stub LegalDocument|LegalDocument.*check|buildLegalDocumentExemptEnvelope|auto_check_result\\.exemptReason|ComplianceCheckResult SoT|summary|catalogVersion|catalogHash\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4551:docs/decisions/EAT_CONTENT_PLAN.md:327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4582:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4585:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4586:42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4593:229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4594:232:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4596:243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4598:263:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4621:340:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4622:342:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4623:344:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4624:346:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4625:348:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4626:350:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4636:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4653:761:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4654:762:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4655:764:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4656:765:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4658:784:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4660:794:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4662:829:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4663:837:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4664:838:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4681:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4684:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4685:582:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4688:637:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4696:837:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4697:838:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4711:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4713:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4715:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4717:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4719:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4722:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4737:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4738:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4741:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4754:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4755:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4758:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4772:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4773:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4776:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4788:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4789:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4792:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4794:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4798:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4799:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4800:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4801:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4802:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4803:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4804:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4805:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4806:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4807:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4808:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4809:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4813:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4815:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4817:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4819:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4821:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4823:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4834:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4835:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4837:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4839:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4867:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4891:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4903:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:4958:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:5144:- CAM3-02 major — `buildLegalDocumentExemptEnvelope()`의 `pageRiskLevel`이 `explicit ?? inferred ?? Low`라 격하 가능. SoT MAX 결합 원칙에 맞게 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`로 통일 필요.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-3.out.md:5167:- CAM3-02 major — `buildLegalDocumentExemptEnvelope()`의 `pageRiskLevel`이 `explicit ?? inferred ?? Low`라 격하 가능. SoT MAX 결합 원칙에 맞게 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`로 통일 필요.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md:13:| CAM-07 | blocking | C0016 NOT VALID + backfill | sentinel ComplianceRecord 사전 INSERT + VALIDATE 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md:20:| CAM-14 | major | compliance_record_id NOT NULL | manual-review 큐 — 고아 차단 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md:21:| CAM-15 | major | required_roles enum array | approver_role[] enum array |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md:23:| CAM-17 | major | approveContent atomic 전이 | open→in-progress + review-queued→in-review 첫 호출 atomic |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md:25:| CAM-19 | major | Publication/Media unlock 표현 | form/zod unlock + compliance_record_id ADD COLUMN |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.prompt.md:29:| CAM-23 | minor | manifest 19단계 | 16 + C0014/C0015/C0016 = 19 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:26:| CAM-07 | blocking | C0016 NOT VALID + backfill | sentinel ComplianceRecord 사전 INSERT + VALIDATE 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:33:| CAM-14 | major | compliance_record_id NOT NULL | manual-review 큐 — 고아 차단 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:34:| CAM-15 | major | required_roles enum array | approver_role[] enum array |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:36:| CAM-17 | major | approveContent atomic 전이 | open→in-progress + review-queued→in-review 첫 호출 atomic |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:38:| CAM-19 | major | Publication/Media unlock 표현 | form/zod unlock + compliance_record_id ADD COLUMN |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:42:| CAM-23 | minor | manifest 19단계 | 16 + C0014/C0015/C0016 = 19 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:105:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (content-gate 큐 1종·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:140:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:141:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:142:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:144:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:147:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:270:-- CAM-15 정정: required_roles enum array 운영
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:280:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:284:  required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:294:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:301:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:325:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:326:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:329:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:332:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:343:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:344:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:345:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:346:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:350:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:352:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:354:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:356:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:358:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:360:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:363:--   기존 published article row 가 있는 instance 별로 sentinel ComplianceRecord(record_phase='published') 1행 + entity.compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:382:WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:385:SET compliance_record_id = cr.id
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:391:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:393:-- (Step 5) NULL 잔존 검증 — published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:398:    FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:399:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:406:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:419:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:420:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:422:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:424:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:450:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:657:- assertTransitionAllowed 검증은 workflow action 안 수행
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:682:export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:705:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:714:// approveContent 안 race 차단
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:738:REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:744:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:745:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:747:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:748:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:752:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:758:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:759:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:767:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:768:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:772:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:777:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:812:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:820:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:4166:초기 대조에서 plan 본문은 cycle 1 패치 대부분을 명시적으로 반영했습니다. 지금은 출력 타입·LegalDocument 면제·C0016/trigger 같은 세부 모순 가능성이 있는 지점만 추가로 좁혀서 확인합니다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:5183:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7110:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7145:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7417:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7462:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"LegalDocument|check\\(\\)|exempt|manualReview|auto_check_result|risk-level-high|m0-stub|maxRisk|requiredApproverRoles|evaluatePublishable|published_content_compliance_guard|C0016|sentinel|NOT VALID|ALLOWED_SUBMIT_TYPES|review_queue_type|content-gate|manual-review|cancelled|required_roles|compliance_record_id|Publication|MediaAppearance|NotificationEvent|CA-DEFER|manifest|hashtext|hashtextextended|scenario|시나리오\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7501:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (content-gate 큐 1종·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7512:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7513:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7514:42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7551:170:-- CAM-15 정정: required_roles enum array 운영
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7555:180:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7556:184:  required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7557:194:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7558:201:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7560:225:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7561:226:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7563:229:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7564:232:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7568:243:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7569:244:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7570:245:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7571:246:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7572:250:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7573:252:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7574:254:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7575:256:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7576:258:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7577:260:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7578:263:--   기존 published article row 가 있는 instance 별로 sentinel ComplianceRecord(record_phase='published') 1행 + entity.compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7583:282:WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7584:285:SET compliance_record_id = cr.id
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7586:291:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7587:293:-- (Step 5) NULL 잔존 검증 — published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7588:298:    FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7589:299:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7592:306:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7596:319:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7597:320:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7598:322:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7599:324:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7604:350:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7649:644:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7650:645:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7653:652:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7658:659:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7659:667:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7660:668:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7664:677:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7686:712:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7688:720:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7887:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7890:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7901:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7902:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7903:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7904:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7908:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7910:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7912:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7914:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7916:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7918:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7921:--   기존 published article row 가 있는 instance 별로 sentinel ComplianceRecord(record_phase='published') 1행 + entity.compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7940:WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7943:SET compliance_record_id = cr.id
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7949:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7951:-- (Step 5) NULL 잔존 검증 — published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7956:    FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7957:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7964:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7977:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7978:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7980:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:7982:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:8444:- CAM-07: FAIL — C0016 sentinel backfill이 실제 예시는 Article만 처리, 6 entity VALIDATE와 불일치.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:8451:- CAM-14: PASS — `compliance_record_id NOT NULL`.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:8470:- CAM2-03 blocking — C0016 backfill 범위 불완전: all 6 entity constraint/trigger를 추가하면서 sentinel backfill은 Article만 구체화.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:8493:- CAM-07: FAIL — C0016 sentinel backfill이 실제 예시는 Article만 처리, 6 entity VALIDATE와 불일치.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:8500:- CAM-14: PASS — `compliance_record_id NOT NULL`.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-2.out.md:8519:- CAM2-03 blocking — C0016 backfill 범위 불완전: all 6 entity constraint/trigger를 추가하면서 sentinel backfill은 Article만 구체화.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:21:- CA-SCHEMA-04·05·06 ReviewQueueEntry (content-gate 만 · required_roles · partial UNIQUE)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:22:- CA-SCHEMA-07 6 entity status unlock + compliance_record_id FK + published_requires_record CHECK
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:47:- C0016 6 entity status unlock + compliance_record_id FK — Article/TreatmentPage 의 기존 nullable column 정합 (C0004/C0005 안 이미 존재) · Publication/Media는 ADD COLUMN 필요 정합
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.prompt.md:48:- C0016 기존 article published 1행 backfill 부재 — 운영 영향 명시 (개발자 수동 republish marker)
.\packages\core-content\migrations\C0016_status_unlock.sql:1:-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
.\packages\core-content\migrations\C0016_status_unlock.sql:13:-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
.\packages\core-content\migrations\C0016_status_unlock.sql:14:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\packages\core-content\migrations\C0016_status_unlock.sql:15:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\packages\core-content\migrations\C0016_status_unlock.sql:16:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\packages\core-content\migrations\C0016_status_unlock.sql:22:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\packages\core-content\migrations\C0016_status_unlock.sql:26:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\packages\core-content\migrations\C0016_status_unlock.sql:30:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\packages\core-content\migrations\C0016_status_unlock.sql:34:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\packages\core-content\migrations\C0016_status_unlock.sql:38:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\packages\core-content\migrations\C0016_status_unlock.sql:42:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\packages\core-content\migrations\C0016_status_unlock.sql:62:WHERE a.status = 'published' AND a.compliance_record_id IS NULL
.\packages\core-content\migrations\C0016_status_unlock.sql:71:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\packages\core-content\migrations\C0016_status_unlock.sql:76:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:90:WHERE t.status = 'published' AND t.compliance_record_id IS NULL
.\packages\core-content\migrations\C0016_status_unlock.sql:99:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\packages\core-content\migrations\C0016_status_unlock.sql:104:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:118:WHERE l.status = 'published' AND l.compliance_record_id IS NULL
.\packages\core-content\migrations\C0016_status_unlock.sql:127:UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
.\packages\core-content\migrations\C0016_status_unlock.sql:132:  AND l.status = 'published' AND l.compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:145:WHERE f.status = 'published' AND f.compliance_record_id IS NULL
.\packages\core-content\migrations\C0016_status_unlock.sql:154:UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
.\packages\core-content\migrations\C0016_status_unlock.sql:159:  AND f.status = 'published' AND f.compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:172:WHERE p.status = 'published' AND p.compliance_record_id IS NULL
.\packages\core-content\migrations\C0016_status_unlock.sql:181:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\packages\core-content\migrations\C0016_status_unlock.sql:186:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:198:WHERE m.status = 'published' AND m.compliance_record_id IS NULL
.\packages\core-content\migrations\C0016_status_unlock.sql:207:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\packages\core-content\migrations\C0016_status_unlock.sql:212:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:218:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:219:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\packages\core-content\migrations\C0016_status_unlock.sql:220:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:221:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\packages\core-content\migrations\C0016_status_unlock.sql:222:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:223:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\packages\core-content\migrations\C0016_status_unlock.sql:224:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:225:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\packages\core-content\migrations\C0016_status_unlock.sql:226:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:227:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\packages\core-content\migrations\C0016_status_unlock.sql:228:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\packages\core-content\migrations\C0016_status_unlock.sql:229:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\packages\core-content\migrations\C0016_status_unlock.sql:235:    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\packages\core-content\migrations\C0016_status_unlock.sql:239:    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\packages\core-content\migrations\C0016_status_unlock.sql:243:    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\packages\core-content\migrations\C0016_status_unlock.sql:247:    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\packages\core-content\migrations\C0016_status_unlock.sql:251:    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\packages\core-content\migrations\C0016_status_unlock.sql:255:    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\packages\core-content\migrations\C0016_status_unlock.sql:269:  IF NEW.compliance_record_id IS NULL THEN
.\packages\core-content\migrations\C0016_status_unlock.sql:270:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\packages\core-content\migrations\C0016_status_unlock.sql:273:   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\packages\core-content\migrations\C0016_status_unlock.sql:275:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\packages\core-content\src\schema.ts:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
.\packages\core-content\src\schema.ts:196:    complianceRecordId: uuid("compliance_record_id"),
.\packages\core-content\src\schema.ts:231:    complianceRecordId: uuid("compliance_record_id"),
.\packages\core-content\src\schema.ts:290:    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\packages\core-content\src\schema.ts:291:    complianceRecordId: uuid("compliance_record_id"),
.\packages\core-content\src\schema.ts:304:    // v0.5 (COMPLIANCE_ASSISTANT_M0): skeleton-limit CHECK 3건 제거 — C0016 안 DROP CONSTRAINT.
.\packages\core-content\src\schema.ts:305:    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\packages\core-content\src\schema.ts:391:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\packages\core-content\src\schema.ts:392:    complianceRecordId: uuid("compliance_record_id"),
.\packages\core-content\src\schema.ts:451:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\packages\core-content\src\schema.ts:452:    complianceRecordId: uuid("compliance_record_id"),
.\packages\core-content\src\schema.ts:506:    complianceRecordId: uuid("compliance_record_id"),
.\packages\core-content\src\schema.ts:516:    // v0.5 (COMPLIANCE_ASSISTANT_M0): EC-SCHEMA-14 v01 CHECK 2건 제거 — C0016 안 DROP CONSTRAINT.
.\packages\core-content\src\schema.ts:517:    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\packages\core-content\src\schema.ts:606:    complianceRecordId: uuid("compliance_record_id").notNull(),
.\packages\core-content\src\schema.ts:611:    requiredRoles: text("required_roles").array().notNull(),
.\packages\core-content\src\schema.ts:623:    requiredRolesNonempty: check("review_queue_entry_required_roles_nonempty", sql`array_length(${t.requiredRoles}, 1) >= 1`),
.\packages\core-content\migrations\C0015_review_queue_entry.sql:16:  compliance_record_id UUID NOT NULL,
.\packages\core-content\migrations\C0015_review_queue_entry.sql:19:  required_roles approver_role[] NOT NULL,
.\packages\core-content\migrations\C0015_review_queue_entry.sql:29:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\packages\core-content\migrations\C0015_review_queue_entry.sql:36:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\eat-content-plan-v1\cycle-4.out.md:535:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\packages\core-content\migrations\C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:34:- CA-SCHEMA-04·05·06 ReviewQueueEntry (content-gate 만 · required_roles · partial UNIQUE)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:35:- CA-SCHEMA-07 6 entity status unlock + compliance_record_id FK + published_requires_record CHECK
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:60:- C0016 6 entity status unlock + compliance_record_id FK — Article/TreatmentPage 의 기존 nullable column 정합 (C0004/C0005 안 이미 존재) · Publication/Media는 ADD COLUMN 필요 정합
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:61:- C0016 기존 article published 1행 backfill 부재 — 운영 영향 명시 (개발자 수동 republish marker)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:688:| 6 entity compliance_record_id FK | 모든 published 콘텐츠는 published ComplianceRecord 참조. DB CHECK: status='published' → compliance_record_id IS NOT NULL |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:690:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:696:| compliance_record 발행 게이트 CHECK | LegalDocument: status='published' → legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL. 모든 contentType: status='published' → compliance_record_id IS NOT NULL · recordPhase='published' (별 RAISE: app layer) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:822:  compliance_record_id UUID,                                -- pre-publish ComplianceRecord 참조
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:825:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:841:  CONSTRAINT review_queue_entry_required_roles_array CHECK (jsonb_typeof(required_roles) = 'array' AND jsonb_array_length(required_roles) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:842:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:867:- (CA-SCHEMA-05) `required_roles` JSONB array — finalRoles 매핑. 룰 추가 역할은 CA-DEFER-01.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:870:### 2.3 6 entity status CHECK 해제 + compliance_record_id 추가 (CA-SCHEMA-07)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:873:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:879:ALTER TABLE legal_document ADD COLUMN compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:881:  FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:883:-- published 시 compliance_record_id required
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:885:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:892:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:894:-- compliance_record_id 는 C0012 안 이미 nullable column 정의됨 (compliance-assistant 합류 시 ref) — FK constraint 만 추가
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:896:  FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:899:-- Article + TreatmentPage 는 이미 nullable compliance_record_id 정의됨 (C0004·C0005) — FK + published_requires CHECK 만 추가
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:901:  FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:904:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:907:  FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:910:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:923:-- Publication + MediaAppearance — compliance_record_id 컬럼 추가 (C0010/C0011 안 미존재 — 본 migration 안 ADD COLUMN)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:924:ALTER TABLE publication ADD COLUMN compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:926:  FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:929:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:931:ALTER TABLE media_appearance ADD COLUMN compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:933:  FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:936:  status <> 'published' OR compliance_record_id IS NOT NULL
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:941:- (CA-SCHEMA-07) 6 entity 의 published 시 compliance_record_id IS NOT NULL CHECK — 검수 우회 차단 게이트.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1108:export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1148:- (CA-ACTION-06) 검증 함수 `assertTransitionAllowed(from, to)`. 모든 server action 의 첫 줄.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1155:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1156:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1158:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='approved' → automated publishable 전이 | record.peer_reviewer + entity.status='publishable' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1159:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 | record.peer_reviewer 채움 · entity 변화 없음 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1166:| 12 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1168:| 14 | concurrent approveContent (same record · same role) → advisory_xact_lock 직렬화 → 마지막 호출 idempotent | pg_advisory_xact_lock |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1176:| 3 | C0016 6 entity status unlock + compliance_record_id FK migration | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1177:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1181:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts (entity별 wrapper from each actions.ts) |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1186:| 13 | manifest 18단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1218:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — 18 단계 (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1881:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"CA-DEFER|check\\(|evaluatePublishable|TRANSITIONS|review_queue_type|review_queue_status|required_roles|compliance_content_type|C0016|published_requires_record|status enum|9-state|EC-DEFER-05|LL-DEFER-01|Audit|audit|manualReview|catalogVersion|pageRiskLevel|priorReviewRequired|client_approver|attachments|staleFlags|warning|mediaThreshold\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1958:174:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1959:190:  CONSTRAINT review_queue_entry_required_roles_array CHECK (jsonb_typeof(required_roles) = 'array' AND jsonb_array_length(required_roles) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1961:216:- (CA-SCHEMA-05) `required_roles` JSONB array — finalRoles 매핑. 룰 추가 역할은 CA-DEFER-01.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1962:222:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1993:494:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1994:495:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1997:515:| 3 | C0016 6 entity status unlock + compliance_record_id FK migration | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2000:525:| 13 | manifest 18단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2019:557:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — 18 단계 (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2056:182:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2063:217:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2128:489:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:2284:327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3637:.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:174:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3645:.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:494:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3646:.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:495:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3648:.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:497:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='approved' → automated publishable 전이 | record.peer_reviewer + entity.status='publishable' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3649:.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:498:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 | record.peer_reviewer 채움 · entity 변화 없음 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3650:.\docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:505:| 12 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3710:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:825:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3718:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1155:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3719:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1156:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3721:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1158:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='approved' → automated publishable 전이 | record.peer_reviewer + entity.status='publishable' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3722:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1159:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 | record.peer_reviewer 채움 · entity 변화 없음 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3723:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1166:| 12 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3745:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1958:174:  required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,        -- finalRoles[] 매핑 — operator/medical/legal
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3747:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1993:494:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(open, finalRoles=['operator']) 1행 생성 | record.record_phase='pre-publish' · entry.required_roles=['operator'] · entry.priority='P0' |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:3748:.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:1994:495:| 2 | Article (Medium) draft → submitForReview → finalRoles=['operator', 'medical'] | required_roles 2개 |
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5052:- **CAM-07**: C0016 migration은 기존 published row 때문에 즉시 실패 가능
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5055:  - 문제: `article_published_requires_record`를 바로 ADD하면 기존 `status='published' AND compliance_record_id IS NULL` row에서 migration이 실패한다. “개발자가 수동 republish”는 migration 이후 조치라 순서가 맞지 않는다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5061:  - 문제: entity CHECK는 `compliance_record_id IS NOT NULL`만 본다. pre-publish record를 참조한 상태로 entity `status='published'`가 될 수 있다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5079:- **CAM-14**: ReviewQueueEntry `compliance_record_id`가 nullable이다. content-gate M0 큐는 ComplianceRecord pre-publish 참조가 핵심인데 nullable이면 고아 큐가 가능하다. 위치: line 171~190. 권장 patch: M0 `content-gate`에서는 NOT NULL로 두거나 queue_type별 partial CHECK를 둔다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5081:- **CAM-15**: `required_roles` JSONB는 순서/중복/enum 검증이 없다. 위치: line 174, 190. 근거: RISK_LEVELS ApproverRole enum medical/legal/operator/client. 권장 patch: text[] enum array 또는 JSONB CHECK로 `operator|medical|legal`만, 중복 없음, canonical sort를 보장한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5085:- **CAM-17**: `approveContent()`가 entity row 상태를 어떻게 `review-queued → in-review`로 전환하는지 불명확하다. 위치: line 448~463, 474~482. 근거: REVIEW_WORKFLOW § 2.3 line 134~136. 권장 patch: assign/pickup 액션을 추가하거나 approve 첫 호출이 atomic하게 open entry를 in-progress/in-review로 전환한다고 명시한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5087:- **CAM-18**: form status select 9-state 활성화는 직접 상태 우회 위험이 크다. 위치: line 422~423. 기존 save actions는 `operator-edit-content`로 status를 저장한다. 권장 patch: status select에서 `published`/`approved`/`publishable` 직접 선택을 제거하고 workflow actions로만 전이한다. 최소한 기존 save actions를 `assertTransitionAllowed` 경유로 전면 교체해야 한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5089:- **CAM-19**: Publication/MediaAppearance에는 DB status skeleton CHECK가 원래 없는데 “published unlock”으로 묶어 설명한다. 위치: line 43, 263~276. 근거: EAT_CONTENT line 443 — DB CHECK 없이 form schema만 draft. 권장 patch: 두 entity는 “form/zod unlock + compliance_record_id ADD”로 표현을 정정한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5098:- **CAM-23**: manifest 단계 수가 틀렸다. 기존 16 + C0014/C0015/C0016 = 19인데 line 5와 525는 18로 쓴다. `CA-CASCADE-05`도 19단계로 정정.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5160:- **CAM-07**: C0016 migration은 기존 published row 때문에 즉시 실패 가능
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5163:  - 문제: `article_published_requires_record`를 바로 ADD하면 기존 `status='published' AND compliance_record_id IS NULL` row에서 migration이 실패한다. “개발자가 수동 republish”는 migration 이후 조치라 순서가 맞지 않는다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5169:  - 문제: entity CHECK는 `compliance_record_id IS NOT NULL`만 본다. pre-publish record를 참조한 상태로 entity `status='published'`가 될 수 있다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5187:- **CAM-14**: ReviewQueueEntry `compliance_record_id`가 nullable이다. content-gate M0 큐는 ComplianceRecord pre-publish 참조가 핵심인데 nullable이면 고아 큐가 가능하다. 위치: line 171~190. 권장 patch: M0 `content-gate`에서는 NOT NULL로 두거나 queue_type별 partial CHECK를 둔다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5189:- **CAM-15**: `required_roles` JSONB는 순서/중복/enum 검증이 없다. 위치: line 174, 190. 근거: RISK_LEVELS ApproverRole enum medical/legal/operator/client. 권장 patch: text[] enum array 또는 JSONB CHECK로 `operator|medical|legal`만, 중복 없음, canonical sort를 보장한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5193:- **CAM-17**: `approveContent()`가 entity row 상태를 어떻게 `review-queued → in-review`로 전환하는지 불명확하다. 위치: line 448~463, 474~482. 근거: REVIEW_WORKFLOW § 2.3 line 134~136. 권장 patch: assign/pickup 액션을 추가하거나 approve 첫 호출이 atomic하게 open entry를 in-progress/in-review로 전환한다고 명시한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5195:- **CAM-18**: form status select 9-state 활성화는 직접 상태 우회 위험이 크다. 위치: line 422~423. 기존 save actions는 `operator-edit-content`로 status를 저장한다. 권장 patch: status select에서 `published`/`approved`/`publishable` 직접 선택을 제거하고 workflow actions로만 전이한다. 최소한 기존 save actions를 `assertTransitionAllowed` 경유로 전면 교체해야 한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5197:- **CAM-19**: Publication/MediaAppearance에는 DB status skeleton CHECK가 원래 없는데 “published unlock”으로 묶어 설명한다. 위치: line 43, 263~276. 근거: EAT_CONTENT line 443 — DB CHECK 없이 form schema만 draft. 권장 patch: 두 entity는 “form/zod unlock + compliance_record_id ADD”로 표현을 정정한다.
.\handoff\codex-reviews\compliance-assistant-m0-plan-v1\cycle-1.out.md:5206:- **CAM-23**: manifest 단계 수가 틀렸다. 기존 16 + C0014/C0015/C0016 = 19인데 line 5와 525는 18로 쓴다. `CA-CASCADE-05`도 19단계로 정정.
.\packages\core-content\migrations\C0005_article.sql:14:  compliance_record_id UUID,
.\packages\core-content\migrations\C0004_treatment_page.sql:22:  compliance_record_id UUID,
.\handoff\codex-reviews\eat-content-plan-v1\cycle-2.out.md:458:321:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\eat-content-plan-v1\cycle-3b.out.md:461:  325:   compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\eat-content-plan-v1\cycle-1.out.md:1093:248:  compliance_record_id UUID,                      -- 향후 compliance-assistant 합류 시 ComplianceRecord ref
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:16:- `packages/core-content/migrations/C0016_status_unlock.sql` — 6 entity status unlock · sentinel backfill · NOT VALID + VALIDATE · published_content_compliance_guard trigger
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:19:- `packages/core-content/src/schema.ts` — + complianceRecord · reviewQueueEntry · 6 entity compliance_record_id · skeleton-limit CHECK 해제 (legal_document · faq)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:28:- `check.ts` — check() stub · buildLegalDocumentExemptEnvelope
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:29:- `transitions.ts` — assertTransitionAllowed (status 전이 table)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:31:- `server-actions.ts` — submitForReview · approveContent · rejectContent · publishContent helpers
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:32:- `entity-actions.ts` — submitForReviewAction · publishContentAction (entity edit page wrapper)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:54:- CA-SCHEMA-04~06 ReviewQueueEntry · partial UNIQUE · approver_role[] · NOT NULL compliance_record_id
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:57:- CA-CHECK-01·02·03 ComplianceCheckEnvelope · result 7 필드 SoT · check() 안 LegalDocument throw · buildLegalDocumentExemptEnvelope
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:64:- C0016 sentinel backfill — 6 entity 모두 idempotent (재실행 안전 — NOT EXISTS guard)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:65:- C0016 published_content_compliance_guard trigger — content_type/content_ref/instance_id 매칭
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:66:- approveContent — advisory lock + FOR UPDATE + AND 게이트 atomic 전이
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.prompt.md:67:- publishContent — record_phase 전환 + entity status 변경 + compliance_record_id 채움
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:7:| CAMC-01 | blocking | publishContentAction publish 흐름 막힘 | entity.compliance_record_id 선행 요구 제거 — publish 시 채움 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:8:| CAMC-02 | blocking | C0016 sentinel backfill 6 entity | LegalDocument · FAQ 도 sentinel INSERT/UPDATE 추가 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:9:| CAMC-03 | blocking | approveContent required_roles 검증 | entry.required_roles 잠금 조회 + 본인 role 포함 검증 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:10:| CAMC-04 | major | submitForReviewAction FOR UPDATE | SELECT 안 FOR UPDATE 추가 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:12:| CAMC-06 | major | assertTransitionAllowed 일관 | publish 안 entity current status assert |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:14:| CAMC-08 | major | exempt envelope maxRisk | buildLegalDocumentExemptEnvelope 안 maxRisk |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:15:| CAMC-09 | major | review detail content preview | PREVIEW_QUERIES allowlist · title/summary/body read-only |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:16:| CAMC-10 | minor | SubmitForReviewResult shape | finalRoles · pageRiskLevel return |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.prompt.md:17:| CAMC-11 | minor | publishContent recordVersion return | PublishContentResult.recordVersion |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:20:| CAMC-01 | blocking | publishContentAction publish 흐름 막힘 | entity.compliance_record_id 선행 요구 제거 — publish 시 채움 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:21:| CAMC-02 | blocking | C0016 sentinel backfill 6 entity | LegalDocument · FAQ 도 sentinel INSERT/UPDATE 추가 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:22:| CAMC-03 | blocking | approveContent required_roles 검증 | entry.required_roles 잠금 조회 + 본인 role 포함 검증 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:23:| CAMC-04 | major | submitForReviewAction FOR UPDATE | SELECT 안 FOR UPDATE 추가 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:25:| CAMC-06 | major | assertTransitionAllowed 일관 | publish 안 entity current status assert |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:27:| CAMC-08 | major | exempt envelope maxRisk | buildLegalDocumentExemptEnvelope 안 maxRisk |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:28:| CAMC-09 | major | review detail content preview | PREVIEW_QUERIES allowlist · title/summary/body read-only |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:29:| CAMC-10 | minor | SubmitForReviewResult shape | finalRoles · pageRiskLevel return |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:30:| CAMC-11 | minor | publishContent recordVersion return | PublishContentResult.recordVersion |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-2.out.md:62:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "publishContentAction|approveContent|required_roles|submitForReviewAction|assertTransitionAllowed|buildLegalDocumentExemptEnvelope|PREVIEW_QUERIES|PublishContentResult|SubmitForReviewResult|C0016|compliance_record_id" -S .' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3271: 178:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3306: 213:     complianceRecordId: uuid("compliance_record_id"),
.\packages\migrations-runner\src\manifest.ts:206:  // (19) C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger (CA-SCHEMA-07~10)
.\packages\migrations-runner\src\manifest.ts:208:    file: "packages/core-content/migrations/C0016_status_unlock.sql",
.\packages\migrations-runner\src\manifest.ts:211:      "article.compliance_record_id",
.\packages\migrations-runner\src\manifest.ts:212:      "treatment_page.compliance_record_id",
.\packages\migrations-runner\src\manifest.ts:213:      "legal_document.compliance_record_id",
.\packages\migrations-runner\src\manifest.ts:214:      "publication.compliance_record_id",
.\packages\migrations-runner\src\manifest.ts:215:      "media_appearance.compliance_record_id",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:29:- `packages/core-content/migrations/C0016_status_unlock.sql` — 6 entity status unlock · sentinel backfill · NOT VALID + VALIDATE · published_content_compliance_guard trigger
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:32:- `packages/core-content/src/schema.ts` — + complianceRecord · reviewQueueEntry · 6 entity compliance_record_id · skeleton-limit CHECK 해제 (legal_document · faq)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:41:- `check.ts` — check() stub · buildLegalDocumentExemptEnvelope
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:42:- `transitions.ts` — assertTransitionAllowed (status 전이 table)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:44:- `server-actions.ts` — submitForReview · approveContent · rejectContent · publishContent helpers
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:45:- `entity-actions.ts` — submitForReviewAction · publishContentAction (entity edit page wrapper)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:67:- CA-SCHEMA-04~06 ReviewQueueEntry · partial UNIQUE · approver_role[] · NOT NULL compliance_record_id
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:70:- CA-CHECK-01·02·03 ComplianceCheckEnvelope · result 7 필드 SoT · check() 안 LegalDocument throw · buildLegalDocumentExemptEnvelope
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:77:- C0016 sentinel backfill — 6 entity 모두 idempotent (재실행 안전 — NOT EXISTS guard)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:78:- C0016 published_content_compliance_guard trigger — content_type/content_ref/instance_id 매칭
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:79:- approveContent — advisory lock + FOR UPDATE + AND 게이트 atomic 전이
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:80:- publishContent — record_phase 전환 + entity status 변경 + compliance_record_id 채움
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:152:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:187:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:188:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:189:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:191:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:193:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:194:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:317:-- CAM-15 정정: required_roles enum array 운영
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:327:  compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:331:  required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:341:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:348:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:372:- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:373:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:376:### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:379:-- packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:390:-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:391:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:392:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:393:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:397:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:399:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:401:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:403:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:405:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:407:  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:410:--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:425:FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:426:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:429:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:442:FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:443:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:446:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:460:FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:461:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:464:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:476:FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:477:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:480:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:482:-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:486:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:487:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:488:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:489:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:490:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:491:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:492:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:493:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:494:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:495:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:496:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:497:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:501:ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:503:ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:505:ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:507:ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:509:ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:511:ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:522:  IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:523:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:525:  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:527:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:553:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:693:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:717:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:729:      "Use buildLegalDocumentExemptEnvelope() instead."
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:784:  ? buildLegalDocumentExemptEnvelope(input)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:821:- assertTransitionAllowed 검증은 workflow action 안 수행
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:846:export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:869:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:878:// approveContent 안 race 차단
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:902:REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:908:| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:909:| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:910:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:911:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:912:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:916:| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:920:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:922:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:923:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:931:| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:932:| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:936:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:941:| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:976:- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:987:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:988:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4288:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'packages/core-content/migrations/C0014_compliance_record.sql','packages/core-content/migrations/C0015_review_queue_entry.sql','packages/core-content/migrations/C0016_status_unlock.sql'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ } }' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4387:   16:   compliance_record_id UUID NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4390:   19:   required_roles approver_role[] NOT NULL,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4400:   29:   CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4407:   36:   CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4430:### packages/core-content/migrations/C0016_status_unlock.sql
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4431:    1: -- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4443:   13: -- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4444:   14: ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4445:   15: ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4446:   16: ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4452:   22:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4456:   26:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4460:   30:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4464:   34:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4468:   38:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4472:   42:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4492:   62: WHERE a.status = 'published' AND a.compliance_record_id IS NULL
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4501:   71: UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4506:   76:   AND a.status = 'published' AND a.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4520:   90: WHERE t.status = 'published' AND t.compliance_record_id IS NULL
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4529:   99: UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4534:  104:   AND t.status = 'published' AND t.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4548:  118: WHERE p.status = 'published' AND p.compliance_record_id IS NULL
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4557:  127: UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4562:  132:   AND p.status = 'published' AND p.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4574:  144: WHERE m.status = 'published' AND m.compliance_record_id IS NULL
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4583:  153: UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4588:  158:   AND m.status = 'published' AND m.compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4594:  164:   SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4595:  165:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4596:  166:   SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4597:  167:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4598:  168:   SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4599:  169:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4600:  170:   SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4601:  171:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4602:  172:   SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4603:  173:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4604:  174:   SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4605:  175:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4611:  181:     ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4615:  185:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4619:  189:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4623:  193:     ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4627:  197:     ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4631:  201:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4645:  215:   IF NEW.compliance_record_id IS NULL THEN
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4646:  216:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4649:  219:    WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4651:  221:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4705:    5: // v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4896:  196:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4931:  231:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4990:  290:     // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:4991:  291:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5004:  304:     // v0.5 (COMPLIANCE_ASSISTANT_M0): skeleton-limit CHECK 3건 제거 — C0016 안 DROP CONSTRAINT.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5005:  305:     //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5091:  391:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5092:  392:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5151:  451:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5152:  452:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5206:  506:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5216:  516:     // v0.5 (COMPLIANCE_ASSISTANT_M0): EC-SCHEMA-14 v01 CHECK 2건 제거 — C0016 안 DROP CONSTRAINT.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5217:  517:     //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5306:  606:     complianceRecordId: uuid("compliance_record_id").notNull(),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5311:  611:     requiredRoles: text("required_roles").array().notNull(),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5323:  623:     requiredRolesNonempty: check("review_queue_entry_required_roles_nonempty", sql`array_length(${t.requiredRoles}, 1) >= 1`),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5595:  206:   // (19) C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger (CA-SCHEMA-07~10)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5597:  208:     file: "packages/core-content/migrations/C0016_status_unlock.sql",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5600:  211:       "article.compliance_record_id",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5601:  212:       "treatment_page.compliance_record_id",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5602:  213:       "legal_document.compliance_record_id",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5603:  214:       "publication.compliance_record_id",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5604:  215:       "media_appearance.compliance_record_id",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5699:   17:   compliance_record_id: string;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5702:   20:   required_roles: string[];
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5731:   49:                  e.compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5733:   51:                  e.required_roles::text[] AS required_roles,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5738:   56:             JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5799:  117:                   <td className="px-3 py-2 text-xs">{r.required_roles.join(", ")}</td>
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5832:   14: import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5864:   46:         const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5865:   47:           SELECT compliance_record_id, content_type::text AS content_type, content_ref
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5876:   58:         const out = await approveContent(tx, ctx, {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5877:   59:           recordId: entry.compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5900:   82:             recordId: result.entry.compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5950:  132:         const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5951:  133:           SELECT compliance_record_id, content_type::text AS content_type, content_ref
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5963:  145:           recordId: entry.compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:5987:  169:             recordId: result.entry.compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6036:   18:   compliance_record_id: string;
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6039:   21:   required_roles: string[];
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6077:   59:                  e.compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6080:   62:                  e.required_roles::text[] AS required_roles,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6091:   73:             JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6119:  101:   // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6124:  106:   const required = new Set(entry.required_roles as ApproverRole[]);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6140:  122:           <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6279:    5: import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6325:   51:   const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:6345:   71:   const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7180:    7: import { check, buildLegalDocumentExemptEnvelope } from "../check";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7181:    8: import { assertTransitionAllowed, listAllowedTransitions } from "../transitions";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7254:   81:   it("buildLegalDocumentExemptEnvelope → exemptReason + manualReview=false", () => {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7255:   82:     const env = buildLegalDocumentExemptEnvelope({
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7280:  107:     expect(() => assertTransitionAllowed("draft", "review-queued")).not.toThrow();
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7283:  110:     expect(() => assertTransitionAllowed("draft", "published")).toThrow(ComplianceTransitionError);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7286:  113:     expect(() => assertTransitionAllowed("publishable", "published")).not.toThrow();
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7387:   22: export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7412:   47:  * - LegalDocument 입력 시 throw — CONTENT_STANDARDS § 7.1.1.1 호출 자체 우회 (호출자가 buildLegalDocumentExemptEnvelope 사용)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7422:   57:       "Use buildLegalDocumentExemptEnvelope() instead.",
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7543:   42: export async function submitForReviewAction(
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7592:   91:         console.error("[submitForReviewAction] audit emit failed", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7612:  111:     console.error("[submitForReviewAction] unexpected", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7617:  116: export async function publishContentAction(
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7631:  130:         // 현재 entity row FOR UPDATE + compliance_record_id 추출
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7632:  131:         const rows = await tx.unsafe<{ compliance_record_id: string | null; status: string }[]>(`
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7633:  132:           SELECT compliance_record_id, status::text AS status FROM ${table}
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7642:  141:         if (!row.compliance_record_id) {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7680:  179:         console.error("[publishContentAction] audit emit failed", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7699:  198:     console.error("[publishContentAction] unexpected", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7832:    2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7845:   15: import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7846:   16: import { check, buildLegalDocumentExemptEnvelope } from "./check";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7871:   41: export type SubmitForReviewResult = { recordId: string; entryId: string };
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7880:   50: ): Promise<SubmitForReviewResult> {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7884:   54:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7895:   65:     ? buildLegalDocumentExemptEnvelope(checkInput)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7929:   99:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7930:  100:       status, priority, required_roles, sla_due_at
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7962:  132: export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:7974:  144:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8096:  266:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8171:  341:   // (2) entity status → published + published_at + compliance_record_id 채움
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8176:  346:            compliance_record_id = '${args.recordId}',
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8203:   22: export function assertTransitionAllowed(from: ContentWorkflowState, to: ContentWorkflowState): void {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8299:서버 액션 출력이 중간에서 잘려 핵심 일부를 다시 좁혀서 보겠습니다. 현재까지 보이는 위험 신호는 C0016의 일부 엔티티 컬럼 추가 누락 가능성, `unsafe` SQL 조립, 승인/발행 전이의 상태 검증 약화입니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8305:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "compliance_record_id|faq = pgTable|publication = pgTable|mediaAppearance|article = pgTable|treatmentPage = pgTable" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8307:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE (article|treatment_page|faq|publication|media_appearance)|compliance_record_id|status .*published|risk_level|published_at" packages/core-content/migrations/C0004_treatment_page.sql packages/core-content/migrations/C0005_article.sql packages/core-content/migrations/C0010_publication.sql packages/core-content/migrations/C0011_media_appearance.sql packages/core-content/migrations/C0012_faq.sql' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8309:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8311:196:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8313:231:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8314:290:    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8315:291:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8316:305:    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8318:391:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8319:392:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8321:451:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8322:452:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8324:506:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8325:517:    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8326:606:    complianceRecordId: uuid("compliance_record_id").notNull(),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8334:packages/core-content/migrations/C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8358:packages/core-content/migrations/C0005_article.sql:14:  compliance_record_id UUID,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8367:packages/core-content/migrations/C0004_treatment_page.sql:22:  compliance_record_id UUID,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8504:    2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8517:   15: import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8518:   16: import { check, buildLegalDocumentExemptEnvelope } from "./check";
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8543:   41: export type SubmitForReviewResult = { recordId: string; entryId: string };
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8552:   50: ): Promise<SubmitForReviewResult> {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8556:   54:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8567:   65:     ? buildLegalDocumentExemptEnvelope(checkInput)
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8601:   99:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8602:  100:       status, priority, required_roles, sla_due_at
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8634:  132: export async function approveContent(
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8646:  144:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8768:  266:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8843:  341:   // (2) entity status → published + published_at + compliance_record_id 채움
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8848:  346:            compliance_record_id = '${args.recordId}',
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8872:   91:         console.error("[submitForReviewAction] audit emit failed", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8892:  111:     console.error("[submitForReviewAction] unexpected", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8897:  116: export async function publishContentAction(
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8911:  130:         // 현재 entity row FOR UPDATE + compliance_record_id 추출
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8912:  131:         const rows = await tx.unsafe<{ compliance_record_id: string | null; status: string }[]>(`
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8913:  132:           SELECT compliance_record_id, status::text AS status FROM ${table}
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8922:  141:         if (!row.compliance_record_id) {
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8960:  179:         console.error("[publishContentAction] audit emit failed", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:8979:  198:     console.error("[publishContentAction] unexpected", err);
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9016:  391:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9017:  392:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9076:  451:     // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9077:  452:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9131:  506:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9141:  516:     // v0.5 (COMPLIANCE_ASSISTANT_M0): EC-SCHEMA-14 v01 CHECK 2건 제거 — C0016 안 DROP CONSTRAINT.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9142:  517:     //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9217:  606:     complianceRecordId: uuid("compliance_record_id").notNull(),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9222:  611:     requiredRoles: text("required_roles").array().notNull(),
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9438:  - 문제: `submitForReviewAction`은 entity에 `compliance_record_id`를 채우지 않고 status만 `review-queued`로 바꿉니다. 그런데 `publishContentAction`은 발행 전 `row.compliance_record_id`가 없으면 즉시 실패합니다. 실제 `compliance_record_id`는 `publishContent()` 내부에서 발행 시 채우도록 되어 있어, submit→approve→publish 정상 경로가 `publishable`까지 가도 발행 불가입니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9439:  - 권장 patch: `publishContentAction`의 `row.compliance_record_id` 선행 요구를 제거하고, 이미 조회한 latest pre-publish record를 사용하거나, submit 시 entity에 pre-publish `compliance_record_id`를 채우는 정책으로 통일하세요. Plan 문구상 M0는 publish 시 채움이므로 전자가 더 작습니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9441:- **CAMC-02**: C0016 sentinel backfill이 6 entity가 아님
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9442:  - 위치: `packages/core-content/migrations/C0016_status_unlock.sql`:50-158, 160-175
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9445:  - 권장 patch: LegalDocument와 FAQ도 동일 패턴의 `INSERT ... WHERE status='published' AND compliance_record_id IS NULL AND NOT EXISTS` 및 UPDATE backfill을 추가하세요.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9447:- **CAMC-03**: `approveContent`가 required role 외 역할 승인도 서버에서 허용
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9450:  - 문제: UI는 `required_roles`로 필터하지만 서버 액션은 전달받은 `role`이 해당 queue의 `required_roles`에 포함되는지 검증하지 않습니다. 예를 들어 Low Article의 operator-only 큐에 medical 사용자가 직접 action 호출하면 physician slot이 채워집니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9451:  - 권장 patch: `approveContent`/`rejectContent`에서 locked `review_queue_entry.required_roles`를 함께 조회하고, `args.role` 미포함이면 403성 `ReviewerEligibilityError` 또는 transition error로 차단하세요.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9466:- **CAMC-06**: server actions가 `assertTransitionAllowed`를 일관 적용하지 않음
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9482:  - 권장 patch: `buildLegalDocumentExemptEnvelope`도 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`를 사용하세요.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9495:  - 권장 patch: `SubmitForReviewResult`에 `finalRoles`, `pageRiskLevel` 추가.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9534:  - 문제: `submitForReviewAction`은 entity에 `compliance_record_id`를 채우지 않고 status만 `review-queued`로 바꿉니다. 그런데 `publishContentAction`은 발행 전 `row.compliance_record_id`가 없으면 즉시 실패합니다. 실제 `compliance_record_id`는 `publishContent()` 내부에서 발행 시 채우도록 되어 있어, submit→approve→publish 정상 경로가 `publishable`까지 가도 발행 불가입니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9535:  - 권장 patch: `publishContentAction`의 `row.compliance_record_id` 선행 요구를 제거하고, 이미 조회한 latest pre-publish record를 사용하거나, submit 시 entity에 pre-publish `compliance_record_id`를 채우는 정책으로 통일하세요. Plan 문구상 M0는 publish 시 채움이므로 전자가 더 작습니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9537:- **CAMC-02**: C0016 sentinel backfill이 6 entity가 아님
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9538:  - 위치: `packages/core-content/migrations/C0016_status_unlock.sql`:50-158, 160-175
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9541:  - 권장 patch: LegalDocument와 FAQ도 동일 패턴의 `INSERT ... WHERE status='published' AND compliance_record_id IS NULL AND NOT EXISTS` 및 UPDATE backfill을 추가하세요.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9543:- **CAMC-03**: `approveContent`가 required role 외 역할 승인도 서버에서 허용
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9546:  - 문제: UI는 `required_roles`로 필터하지만 서버 액션은 전달받은 `role`이 해당 queue의 `required_roles`에 포함되는지 검증하지 않습니다. 예를 들어 Low Article의 operator-only 큐에 medical 사용자가 직접 action 호출하면 physician slot이 채워집니다.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9547:  - 권장 patch: `approveContent`/`rejectContent`에서 locked `review_queue_entry.required_roles`를 함께 조회하고, `args.role` 미포함이면 403성 `ReviewerEligibilityError` 또는 transition error로 차단하세요.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9562:- **CAMC-06**: server actions가 `assertTransitionAllowed`를 일관 적용하지 않음
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9578:  - 권장 patch: `buildLegalDocumentExemptEnvelope`도 `maxRisk(explicit ?? "Low", inferred ?? "Low", "Low")`를 사용하세요.
.\handoff\codex-reviews\compliance-assistant-m0-code-v1\cycle-1.out.md:9591:  - 권장 patch: `SubmitForReviewResult`에 `finalRoles`, `pageRiskLevel` 추가.
.\apps\web\src\lib\compliance\entity-actions.ts:42:export async function submitForReviewAction(
.\apps\web\src\lib\compliance\entity-actions.ts:99:        console.error("[submitForReviewAction] audit emit failed", err);
.\apps\web\src\lib\compliance\entity-actions.ts:119:    console.error("[submitForReviewAction] unexpected", err);
.\apps\web\src\lib\compliance\entity-actions.ts:124:export async function publishContentAction(
.\apps\web\src\lib\compliance\entity-actions.ts:138:        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
.\apps\web\src\lib\compliance\entity-actions.ts:186:        console.error("[publishContentAction] audit emit failed", err);
.\apps\web\src\lib\compliance\entity-actions.ts:205:    console.error("[publishContentAction] unexpected", err);
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:724:  181:     complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:759:  216:     complianceRecordId: uuid("compliance_record_id"),
.\apps\web\src\lib\compliance\check.ts:22:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
.\apps\web\src\lib\compliance\check.ts:53: * - LegalDocument 입력 시 throw — CONTENT_STANDARDS § 7.1.1.1 호출 자체 우회 (호출자가 buildLegalDocumentExemptEnvelope 사용)
.\apps\web\src\lib\compliance\check.ts:63:      "Use buildLegalDocumentExemptEnvelope() instead.",
.\apps\web\src\lib\compliance\server-actions.ts:2:// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
.\apps\web\src\lib\compliance\server-actions.ts:15:import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
.\apps\web\src\lib\compliance\server-actions.ts:16:import { check, buildLegalDocumentExemptEnvelope } from "./check";
.\apps\web\src\lib\compliance\server-actions.ts:41:export type SubmitForReviewResult = {
.\apps\web\src\lib\compliance\server-actions.ts:55:): Promise<SubmitForReviewResult> {
.\apps\web\src\lib\compliance\server-actions.ts:59:  assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
.\apps\web\src\lib\compliance\server-actions.ts:70:    ? buildLegalDocumentExemptEnvelope(checkInput)
.\apps\web\src\lib\compliance\server-actions.ts:104:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
.\apps\web\src\lib\compliance\server-actions.ts:105:      status, priority, required_roles, sla_due_at
.\apps\web\src\lib\compliance\server-actions.ts:137:export async function approveContent(
.\apps\web\src\lib\compliance\server-actions.ts:146:  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
.\apps\web\src\lib\compliance\server-actions.ts:147:  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[] }[]>`
.\apps\web\src\lib\compliance\server-actions.ts:148:    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles
.\apps\web\src\lib\compliance\server-actions.ts:150:     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
.\apps\web\src\lib\compliance\server-actions.ts:156:  if (!entry.required_roles.includes(args.role)) {
.\apps\web\src\lib\compliance\server-actions.ts:158:      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
.\apps\web\src\lib\compliance\server-actions.ts:277:     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
.\apps\web\src\lib\compliance\server-actions.ts:309:export type PublishContentResult = { recordVersion: number };
.\apps\web\src\lib\compliance\server-actions.ts:320:): Promise<PublishContentResult> {
.\apps\web\src\lib\compliance\server-actions.ts:351:  assertTransitionAllowed(entityStatusRows[0]!.status as ContentWorkflowState, "published");
.\apps\web\src\lib\compliance\server-actions.ts:363:  // (2) entity status → published + published_at + compliance_record_id 채움.
.\apps\web\src\lib\compliance\server-actions.ts:369:           compliance_record_id = '${args.recordId}',
.\apps\web\src\lib\compliance\transitions.ts:22:export function assertTransitionAllowed(from: ContentWorkflowState, to: ContentWorkflowState): void {
.\handoff\codex-reviews\eat-content-code-v1\cycle-3.out.md:251: 217:     complianceRecordId: uuid("compliance_record_id"),
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:7:import { check, buildLegalDocumentExemptEnvelope } from "../check";
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:8:import { assertTransitionAllowed, listAllowedTransitions } from "../transitions";
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:81:  it("buildLegalDocumentExemptEnvelope → exemptReason + manualReview=false", () => {
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:82:    const env = buildLegalDocumentExemptEnvelope({
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:107:    expect(() => assertTransitionAllowed("draft", "review-queued")).not.toThrow();
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:110:    expect(() => assertTransitionAllowed("draft", "published")).toThrow(ComplianceTransitionError);
.\apps\web\src\lib\compliance\__tests__\compliance.test.ts:113:    expect(() => assertTransitionAllowed("publishable", "published")).not.toThrow();
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:608:docs/decisions/EAT_CONTENT_PLAN.md:327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:1098:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\handoff\codex-reviews\eat-content-code-v1\cycle-1.out.md:1665:    complianceRecordId: uuid("compliance_record_id"),
.\handoff\codex-reviews\eat-content-code-v1\cycle-2.out.md:1040:  327:   compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
.\apps\web\src\components\forms\WorkflowActionButtons.tsx:5:import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
.\apps\web\src\components\forms\WorkflowActionButtons.tsx:51:  const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
.\apps\web\src\components\forms\WorkflowActionButtons.tsx:71:  const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:14:import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:46:        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:47:          SELECT compliance_record_id, content_type::text AS content_type, content_ref
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:58:        const out = await approveContent(tx, ctx, {
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:59:          recordId: entry.compliance_record_id,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:82:            recordId: result.entry.compliance_record_id,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:132:        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:133:          SELECT compliance_record_id, content_type::text AS content_type, content_ref
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:145:          recordId: entry.compliance_record_id,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:169:            recordId: result.entry.compliance_record_id,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:17:  compliance_record_id: string;
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:20:  required_roles: string[];
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:49:                 e.compliance_record_id,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:51:                 e.required_roles::text[] AS required_roles,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:56:            JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\page.tsx:117:                  <td className="px-3 py-2 text-xs">{r.required_roles.join(", ")}</td>
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:18:  compliance_record_id: string;
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:21:  required_roles: string[];
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:37:const PREVIEW_QUERIES: Record<string, { table: string; titleCol?: string; summaryCol?: string; bodyCol?: string }> = {
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:72:                 e.compliance_record_id,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:75:                 e.required_roles::text[] AS required_roles,
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:86:            JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:100:          const q = PREVIEW_QUERIES[e.content_type];
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:134:  // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:139:  const required = new Set(entry.required_roles as ApproverRole[]);
.\apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\[entryId]\page.tsx:155:          <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>

 succeeded in 860ms:
# compliance-assistant M0 vertical slice plan (v1.0·acceptance·2026-05-18)

> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **5 cycle 36 findings 전건 수용** · cycle 5 closeableAfterPatch=true 확정. 수렴 추세 **28 → 5 → 2 → 1 → 0**. EAT_CONTENT code v1.0 acceptance 직후 진입하는 첫 Feature 본 plan (M0 vertical slice scope).

> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
- `docs/admin/REVIEW_WORKFLOW.md` — § 2 상태 머신 9종 · § 3 큐 3종 · § 4 multi-role AND 게이트 · § 5 ComplianceRecord 슬롯 · § 7.1 publishable 6조건 · § 9.1.1 알림 정책
- `docs/core/DATA_MODEL.md` C-10 ComplianceRecord — 풀명세 (recordPhase · recordVersion · mediaThresholdAssessment · mediaThresholdOperationalInput · staleFlags · warningAck · llmAssist · attachments · featureContentType · priorReviewSubmissionId)
- `docs/compliance/RISK_LEVELS.md` — § 2 RiskInference (MAX 결합) · § 3 RiskRule · § 4 finalRoles · § 6 High 강제 검수
- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-07/12 부분 해소 대상 (EC-DEFER-05 미해소)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 발행 게이트 부분 해소 대상 (NotificationEvent 분리)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit_event matrix · emit 위치 정책 · base role
- 기존 packages 실 시그니처:
  - `packages/core-content/src/schema.ts` v0.4 (Drizzle SoT)
  - `apps/web/src/components/forms/{ArticleForm, FaqForm, ...}.tsx` (status select)
  - `apps/web/src/lib/action-context.ts` (assertActionEligibility 패턴)

> **표기 규칙 (cycle 1 CAM-26 정정)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `record_phase` (DB) ↔ `recordPhase` (TS).

## 1. 목적과 범위

### 1.1 목적 — cycle 1 CAM-01·09·21 정정

- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
- **EC-DEFER-12 부분 해소**: 6 entity published 발행 unlock — **수동 검수 게이트 통과 시 만**. EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) 는 **미해소** — CA-DEFER-01/02 동반 합류 시. M0 stub 의 manualReview 기반 발행은 자동 룰 검수 부재 risk 인지.
- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
- **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + manual-review queue 활성화 + multi-role AND 게이트 (operator·medical·legal — client 미합류 CA-DEFER-10).
- **자동 검수(룰) 미합류 marker**: check() stub — 항상 manualReview 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass · 단 High 입력 시 가상 finding). 실 ruleCatalog/composite/LLM은 CA-DEFER-01·02·03.
- **LegalDocument 자동 검수 면제 (CAM-09 정정, CAM4-01 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. `auto_check_result` 슬롯에는 SoT 7 필드만 (automatedDecision='pass' · 모든 finding 카운터 0). `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"` 은 `compliance_record.metadata` 슬롯에 저장 (auto_check_result 안 아님).

### 1.2 범위 (포함) — cycle 1 CAM-02·10·14·15·17·18·19 정정

| 항목 | 비고 |
|---|---|
| C-10 `ComplianceRecord` skeleton DB table (CA-CASCADE-01) | DATA_MODEL C-10 풀명세 subset. CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication/audit columns 모두 phase 분류) |
| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
| 어드민 /review-queue 화면 | list (manual-review 큐) + detail page (entry approve/reject) |
| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
| admin_user role flags 활용 | `physician_reviewer_eligible` · `legal_reviewer_eligible` 검수 권한 분기 |
| `assertReviewerEligibility` helper | role 별 admin_user flag 검증 |
| `published_content_compliance_guard` 트리거 (CAM-08 정정) | BEFORE INSERT/UPDATE ON each entity (article·treatment_page·legal_document·faq·publication·media_appearance) — `NEW.status='published'` 시 referenced compliance_record.record_phase='published' + content_type 일치 + content_ref 매칭 (slug) + instance_id 일치 검증. 위반 시 RAISE EXCEPTION |
| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
| vitest scenarios 16건 (CAM-28 정합) | finalRoles 평가 (5 case) · ComplianceRecord lifecycle (3 case) · publishable 게이트 (4 case) · status 전이 안전성 (3 case) · transition table 무결성 (1 case) |

### 1.3 비범위 (defer) — CAM-11·12·21 정정

| 항목 | Defer to | marker |
|---|---|---|
| RuleCatalog yaml 파일 (data/compliance-rules/) + composite KSS v3+ · contextExceptions | Phase Alpha (compliance-assistant Phase A plan) | CA-DEFER-01 |
| RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX 결합) — M0 stub은 입력 결합 MAX만 처리 | CA-DEFER-01 동반 | CA-DEFER-02 |
| LLM 보조 (synthetic ruleId · llmAssist invocations[] · human-in-loop) | M1 Phase Beta | CA-DEFER-03 |
| 캐시 2종 (영속 결과 캐시 · TTL 캐시) · cacheKey | CA-DEFER-01 동반 | CA-DEFER-04 |
| warning 큐 + warningAcknowledgements + finding action (acknowledged/resolved) | CA-DEFER-01 동반 | CA-DEFER-05 |
| stale 큐 + StaleFlags 발생 트리거 + medical-law-revision 자동 큐 진입 | M1 Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 (in-review 유지 · 위임) | CA-DEFER-01 동반 | CA-DEFER-07 |
| priorReviewRequired 산정 · 사전심의 외부 시스템 연동 · priorReviewSubmissionId | M2 (외부 연동) | CA-DEFER-08 |
| MediaThresholdAssessment · mediaThresholdOperationalInput · 일평균 10만 매체 분류 · analytics-reporting 통합 | analytics-reporting Feature 본 구현 | CA-DEFER-09 |
| client 검수자 (clientApprover) · client 역할 admin_user flag | M1 Phase Beta | CA-DEFER-10 |
| autoCheckResult.findings · llmAssist.invocations[] 풀명세 영속 | CA-DEFER-01 + CA-DEFER-03 동반 | CA-DEFER-11 |
| 정책 문서 attachments[] 법무 의견서 업로드 | M1 Phase Beta + storage Feature | CA-DEFER-12 |
| ComplianceRecord 풀 컬럼 (mediaThresholdAssessment · mediaThresholdOperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · **featureContentType** · client 슬롯) — 각 CA-DEFER phase 매핑 | 각 CA-DEFER phase | CA-DEFER-13 |
| **NotificationEvent envelope** (REVIEW_WORKFLOW § 9.1.1 알림 정책 · LL-DEFER-01 의 알림 부분) | notifications Feature 본 구현 (별 cycle) | CA-DEFER-14 |
| content-gate 자동 큐 진입 (ComplianceCheckResult.gateRequired=true 시) — M0 manual-review 큐 vs content-gate 큐 분리 운영 | CA-DEFER-01 동반 (룰 합류 시 content-gate 큐 활성화) | CA-DEFER-15 |
| Feature contentType (DATA_MODEL C-10 v0.5 `Feature` 토큰 + featureContentType) | CA-DEFER-01 + Feature 합류 시 | CA-DEFER-16 |

## 2. 데이터 모델 결정

### 2.1 C0014 `compliance_record` 신규 table (CA-SCHEMA-01) — CAM-10·11·12·25 정정

```sql
-- packages/core-content/migrations/C0014_compliance_record.sql
-- SoT: DATA_MODEL § 4 C-10 ComplianceRecord (v0.6+ 17종 contentType enum)
-- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조

CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');

-- DATA_MODEL C-10 v0.6 17종 풀 enum (CAM-10 정정 — M0 active 6종 만 submit 가능, 나머지는 allowlist app layer 검증).
CREATE TYPE compliance_content_type AS ENUM (
  'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
  'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
  'Feature', 'Publication', 'MediaAppearance'
);

CREATE TABLE compliance_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  page_risk_level risk_level NOT NULL,
  article_type TEXT,
  inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  auto_check_result JSONB NOT NULL,
  peer_reviewer UUID,                          -- admin_user.id (operator)
  peer_reviewed_at TIMESTAMPTZ,
  physician_approver UUID,                      -- admin_user.id (medical)
  physician_approved_at TIMESTAMPTZ,
  legal_counsel UUID,                           -- admin_user.id (legal)
  legal_counsel_at TIMESTAMPTZ,
  client_approver UUID,                         -- M0 미사용 (CA-DEFER-10)
  client_approved_at TIMESTAMPTZ,
  prior_review_required BOOLEAN NOT NULL DEFAULT false,  -- M0 false fixed
  prior_review_submission_id TEXT,              -- CA-DEFER-08
  prior_review_passed BOOLEAN,                  -- CA-DEFER-08
  published_at TIMESTAMPTZ,
  published_by UUID,                            -- admin_user.id
  record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
  record_version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
  CONSTRAINT compliance_record_published_requires_at CHECK (
    record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
  ),
  CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
    record_phase <> 'published' OR content_type <> 'LegalDocument'
    OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_med_high_requires_physician CHECK (
    record_phase <> 'published' OR page_risk_level = 'Low'
    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_published_requires_peer CHECK (
    record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';

ALTER TABLE compliance_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_record FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON compliance_record FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_record TO app_tenant_user;
```

**결정 (CA-SCHEMA-01·02·03)**:
- (CAM-25 정정) C0014 = C-**10** ComplianceRecord (DATA_MODEL § 4 SoT). 잘못 표기된 C-08 → C-10 정정.
- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
- (CAM-13 정정) ReviewQueueEntry status `cancelled` 제거 — open/in-progress/resolved 3종 만.
- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.

### 2.2 C0015 `review_queue_entry` 신규 table (CA-SCHEMA-04) — CAM-02·13·14·15 정정

```sql
-- packages/core-content/migrations/C0015_review_queue_entry.sql
-- SoT: REVIEW_WORKFLOW § 3 큐 3종. M0 v0.1 manual-review 1종 활성

-- CAM-02 정정: manual-review queue type 신설 (수동 검수 큐). content-gate (ruleCatalog gateRequired) · warning · stale 은 ADD VALUE cascade.
CREATE TYPE review_queue_type AS ENUM ('manual-review');
-- CAM-13 정정: cancelled 제거. open/in-progress/resolved 3종 만.
CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
-- CAM-15 정정: required_roles enum array 운영
CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)

CREATE TABLE review_queue_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  queue_type review_queue_type NOT NULL,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  -- CAM-14 정정: M0 manual-review 는 ComplianceRecord pre-publish 참조 필수. NOT NULL.
  compliance_record_id UUID NOT NULL,
  status review_queue_status NOT NULL DEFAULT 'open',
  priority review_queue_priority NOT NULL DEFAULT 'P0',
  -- CAM-15 정정: text[]도 enum 검증이 어려워 approver_role[] array 운영
  required_roles approver_role[] NOT NULL,
  assigned_to UUID,
  assigned_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_type TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
    status <> 'resolved' OR resolved_at IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
    status <> 'resolved' OR resolution_type IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
    REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
  WHERE status IN ('open', 'in-progress');
CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref)
  WHERE status IN ('open', 'in-progress');

ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON review_queue_entry FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;
```

**결정 (CA-SCHEMA-04~06)**:
- (CAM-02) `manual-review` queue type — 운영자 명시 submitForReview 트리거. content-gate 큐는 CA-DEFER-15 (ruleCatalog 합류 시 ADD VALUE).
- (CAM-14) `compliance_record_id NOT NULL` — 고아 큐 차단.
- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
- (CAM-13) `cancelled` 제거 — open/in-progress/resolved 3종.

### 2.3 C0016 6 entity status unlock + compliance_record_id + guard trigger (CA-SCHEMA-07~10) — CAM-07·08·19 정정

```sql
-- packages/core-content/migrations/C0016_status_unlock.sql
-- CAM-07 정정: NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리.
-- CAM-08 정정: published_content_compliance_guard trigger 추가 — entity.status='published' 시 record_phase 매칭 검증.

-- (Step 1) LegalDocument · FAQ CHECK 해제
ALTER TABLE legal_document DROP CONSTRAINT legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT legal_document_risk_level_skeleton_limit;
ALTER TABLE faq DROP CONSTRAINT faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT faq_published_at_null_v01;

-- (Step 2) Publication / MediaAppearance compliance_record_id 컬럼 ADD (form/zod unlock 만 — DB CHECK 없음 · CAM-19)
ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;

-- (Step 3) 6 entity FK constraint
ALTER TABLE article ADD CONSTRAINT article_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity 모두 (CAM2-03 정정).
--   기존 published row 가 있는 entity 별로 sentinel ComplianceRecord(record_phase='published') 생성 + compliance_record_id 채움.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   page_risk_level = entity.risk_level ?? 'Low' (Article/TreatmentPage 만 risk_level 컬럼 존재 · 나머지는 'Low' fixed).

-- (4-a) Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a WHERE a.status = 'published' AND a.compliance_record_id IS NULL;
UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- (4-b) TreatmentPage — risk_level 컬럼 존재
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  COALESCE(t.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t WHERE t.status = 'published' AND t.compliance_record_id IS NULL;
UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
-- (4-d) FAQ — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op).
-- (4-e) Publication — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p WHERE p.status = 'published' AND p.compliance_record_id IS NULL;
UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

-- (4-f) MediaAppearance — risk_level 'Low' fixed CHECK
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m WHERE m.status = 'published' AND m.compliance_record_id IS NULL;
UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity 모두 published row 중 compliance_record_id NULL 0건 확인.
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
END $$;

-- (Step 6) NOT VALID 패턴 + 즉시 VALIDATE — 6 entity 모두.
ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;

-- (Step 7) published_content_compliance_guard trigger — CAM-08 정정.
--   BEFORE INSERT/UPDATE ON each entity. status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 일치 검증.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  END IF;
  IF record_row.record_phase <> 'published' THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  END IF;
  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  IF TG_TABLE_NAME = 'article' AND record_row.content_type <> 'Article' THEN
    RAISE EXCEPTION 'content_type mismatch: % vs %', TG_TABLE_NAME, record_row.content_type;
  END IF;
  -- treatment_page · legal_document · faq · publication · media_appearance 동일 매핑 (반복 생략)
  -- content_ref 일치 (slug)
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'content_ref mismatch: % vs %', record_row.content_ref, NEW.slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
-- treatment_page · legal_document · faq · publication · media_appearance 동일 trigger (반복 생략)
```

**결정 (CA-SCHEMA-07~10)**:
- (CAM-07) NOT VALID + sentinel backfill + VALIDATE 단계 분리 — 기존 published row 우회 안전. 운영 시 sentinel ComplianceRecord 식별자 `metadata @> '{"sentinel":true}'` 로 추후 republish 흐름 가이드 marker.
- (CAM-08) `published_content_compliance_guard` BEFORE trigger — DB level 발행 게이트 검증. CHECK constraint 로는 cross-table reference 검증 불가하므로 trigger 사용 명시.
- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.

## 3. AND 게이트 평가 결정 — CAM-04·05·06·16 정정

### 3.1 finalRoles 계산 (CA-GATE-01) — CAM2-04 정정

```typescript
// apps/web/src/lib/compliance/final-roles.ts
export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

const KNOWN_ROLES = new Set<string>(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력. unknown role 감지 시
 *   silently drop 하지 않고 ComplianceConfigError throw — server action 안 form-level
 *   error 변환 → 운영자가 룰 카탈로그 정정. M0 v0.1 stub 은 빈 array 보장이므로 effective no-op.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
    if (r === "client") {
      // M0 v0.1: client 역할 미합류 (CA-DEFER-10). 룰이 client 를 요구하면 fail closed.
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);  // 위 검증으로 narrow safe
  }
  return Array.from(roles).sort();  // canonical sort
}
```

### 3.2 maxRisk MAX 결합 (CA-GATE-02) — CAM-04 정정

```typescript
// apps/web/src/lib/compliance/risk.ts
const ORDER: Record<RiskLevel, number> = { "Low": 0, "Medium": 1, "High": 2 };
export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  let max: RiskLevel = "Low";
  for (const l of levels) if (ORDER[l] > ORDER[max]) max = l;
  return max;
}
```

### 3.3 publishable 게이트 (CA-GATE-03) — CAM-06·16 정정, CAM2-04 추가 정정

REVIEW_WORKFLOW § 7.1 6조건 모두 평가:

```typescript
// apps/web/src/lib/compliance/publishable-check.ts
export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; configError: string };  // CAM2-04: unknown role fail closed

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] };
  // CAM2-04 정정: unknown role 은 silently filter 가 아닌 throw → form-level error.
  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(
      contentType, record.page_risk_level, record.prior_review_required,
      autoCheck.requiredApproverRoles ?? [],
    );
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }
  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck.automatedDecision === "block") reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  // (2) finalRoles 슬롯 모두 기록
  for (const role of finalRoles) {
    if (!isRoleSatisfied(record, role)) {
      missingRoles.push(role);
      reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
    }
  }
  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  if (record.prior_review_required && record.prior_review_passed !== true) {
    reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  }
  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
  // (6) warning 강제 처리 정책 — M0 stub: warningAck 미구현 (CA-DEFER-05 · 항상 충족 가정)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}
```

**결정**:
- (CAM-06) publishable evaluator 가 REVIEW_WORKFLOW § 7.1 6조건 모두 evaluate. M0 stub 미구현 영역 (priorReview·staleFlags·warningAck) 은 안전 방향 fail closed — priorReviewRequired=true 면 publish 금지. M0 v0.1 priorReviewRequired=false fixed 라 effective no-op.
- (CAM-16) `auto_check_result.requiredApproverRoles[]` parsing — finalRoles 통합. unknown role은 fail closed.

## 4. check() stub 결정 — CAM-03·04·05·09 정정, CAM2-01·02 정정

### 4.1 ComplianceCheckEnvelope wrapper (CA-CHECK-01) — CAM2-01 정정

CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:

```typescript
// apps/web/src/lib/compliance/types.ts
import type { ComplianceCheckInput, ComplianceCheckResult } from "@glitzy/core-content";

// ComplianceCheckResult 는 CONTENT_STANDARDS § 7.2 SoT 그대로 import — 7 필드만.
//   summary · catalogVersion · catalogHash · exemptReason 은 result 안 들어가지 않음.

export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;   // "m0-stub-v0.1"
    catalogHash: string;      // "stub"
    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
  };
};

// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
//   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel: input.metadata.explicitRiskLevel ?? input.metadata.inferredRiskLevel ?? "Low",
      catalogVersion: "m0-stub-v0.1",
      catalogHash: "stub",
      manualReview: false,
      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
    },
  };
}
```

### 4.2 check() stub 시그니처 (CA-CHECK-02·03·04·05) — CAM2-02 정정

**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.

```typescript
// apps/web/src/lib/compliance/check.ts
import type { Finding } from "@glitzy/core-content";

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
      "Use buildLegalDocumentExemptEnvelope() instead."
    );
  }

  // MAX 결합 (격하 금지 — CAM-04)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  // High 입력 시 가상 finding (CAM-05). Finding shape 는 CONTENT_STANDARDS § 7.2 Finding SoT.
  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      category: "risk-level-virtual",
      pattern: "",
      severity: "content-gate",
      location: { start: 0, end: 0 },
      requiredApproverRoles: ["medical"],
      triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  // ComplianceCheckResult SoT — 7 필드만. summary/catalogVersion/catalogHash 등 추가 필드 없음.
  return {
    result: {
      automatedDecision,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      findingsBySeverity: {
        fail: 0,
        "content-gate": gateRequired ? 1 : 0,
        warning: 0,
        info: 0,
      },
      requiredApproverRoles: gateRequired ? ["medical"] : [],
      findings,
    },
    meta: { pageRiskLevel, catalogVersion: "m0-stub-v0.1", catalogHash: "stub", manualReview: true },
  };
}
```

### 4.3 호출 시점 (CA-CHECK-06)

```typescript
// submitForReview 안 호출 흐름:
const envelope = contentType === "LegalDocument"
  ? buildLegalDocumentExemptEnvelope(input)
  : await check(input);

// compliance_record INSERT
INSERT INTO compliance_record (..., page_risk_level, auto_check_result, metadata, ...)
VALUES (..., envelope.meta.pageRiskLevel, envelope.result, jsonb_build_object(
  'manualReview', envelope.meta.manualReview,
  'catalogVersion', envelope.meta.catalogVersion,
  'catalogHash', envelope.meta.catalogHash,
  ...(envelope.meta.exemptReason ? { 'exemptReason': envelope.meta.exemptReason } : {})
), ...)
```

- `compliance_record.auto_check_result` = `envelope.result` (CONTENT_STANDARDS § 7.2 SoT 그대로)
- `compliance_record.metadata` = envelope.meta 의 추가 영역 (pageRiskLevel 은 별도 컬럼 + metadata 양쪽 기록 권장)
- M0 stub 의 High 가상 finding 시 gateRequired=true — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.

## 5. 어드민 UI 결정 — CAM-18 정정

### 5.1 /admin/{slug}/review-queue 화면 (CA-UI-01)

list page:
- queue_type='manual-review' + status IN ('open', 'in-progress') row
- columns: 콘텐츠 유형 · 콘텐츠 ref · pageRiskLevel · finalRoles · status · priority · SLA 마감 · assigned

detail page:
- 콘텐츠 본문 미리보기 (read-only)
- ComplianceRecord 슬롯 표시 (operator·medical·legal — 각 슬롯의 reviewer 이름 + timestamp)
- 본인 역할에 한해 approve/reject 폼 노출 (assertReviewerEligibility flag 확인)
- 거부 사유 textarea (50자 이상 required)

### 5.2 6 entity form status select — read-only display (CA-UI-02) — CAM-18 정정

form 안 `status` field 는:
- 현재 row 의 status 표시 만 (read-only badge — `<span>` 또는 disabled `<select>`)
- 사용자 직접 status 변경 불가 — 모든 status 전이는 workflow action 버튼 통해서만
- 기존 save action (`saveArticle` 등) 안 status field 무시 — 서버 측에서 current row.status 보존 (form FormData 안 status 값 무시)
- assertTransitionAllowed 검증은 workflow action 안 수행

### 5.3 entity edit page 안 액션 버튼 (CA-UI-03)

각 edit page 안 추가 버튼:
- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
- "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
- "검수 큐 진입" 후에는 form 자체 read-only — 검수자 액션은 /review-queue/{entryId} 에서

## 6. server action 결정 — CAM-17·20 정정

### 6.1 4 server action 시그니처 (CA-ACTION-01)

`apps/web/src/lib/compliance/transitions.ts` (helper) + entity별 actions.ts 안 thin wrapper.

```typescript
// transitions.ts
export async function submitForReview(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string,
  contentRow: { id: string; status: string; risk_level?: string | null },
): Promise<{ recordId: string; entryId: string }>;

// CAM-17 정정 — approve 첫 호출이 atomic open→in-progress + status review-queued→in-review 동시 전이.
//   재approve 시 status=in-review 유지.
export async function approveContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, role: ApproverRole, actorUserId: string,
): Promise<{ allApproved: boolean; entryStatus: "in-progress" | "resolved" }>;

export async function rejectContent(
  tx: TransactionSql, ctx: TenantContext,
  recordId: string, reason: string, role: ApproverRole, actorUserId: string,
): Promise<void>;

export async function publishContent(
  tx: TransactionSql, ctx: TenantContext,
  contentType: ContentType, contentRef: string, recordId: string, actorUserId: string,
): Promise<void>;
```

### 6.2 audit emit (CA-CASCADE-06) — CAM-20 정정

REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade:

| eventType | trigger | payload shape |
|---|---|---|
| `content-submitted-for-review` | submitForReview action 성공 | `{contentType, contentRef, recordId, entryId, finalRoles, pageRiskLevel}` |
| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
| `content-published` | publishContent action 성공 | `{contentType, contentRef, recordId, recordVersion}` |

emit 위치 (ADMIN_UI_SKELETON_PLAN 정합): **tx commit 후 base role** (sqlBase) 안에서 `emitAuditEvent` 호출. tx 안 emit 시 RLS scope 충돌 회피. 실패 정책: try/catch + console.error (action 성공 자체에 영향 없음 — 기존 saveArticle 패턴 정합).

### 6.3 advisory lock (CA-ACTION-02) — CAM-27 정정

```typescript
// approveContent 안 race 차단
const key = hashUuidTo64Bit(recordId);  // CAM-27 정정 — hashtextextended(uuid::text) 또는 UUID 의 16바이트를 2개 int8 로 분할
await tx`SELECT pg_advisory_xact_lock(${key})`;
```

CAM-27 정정 — `hashtext()` 32-bit 충돌 가능성 → `hashtextextended()` (64-bit) 또는 UUID 자체를 2개 int 로 분리 사용 (`pg_advisory_xact_lock(int1, int2)`). M0 v0.1 채택 = `hashtextextended('compliance:' || record_id, 0)`.

### 6.4 status 전이 table (CA-ACTION-06)

```typescript
// transitions.ts
const TRANSITIONS: Record<string, string[]> = {
  "draft": ["review-queued"],
  "review-queued": ["in-review", "draft"],
  "in-review": ["approved", "rejected", "in-review"],
  "approved": ["publishable"],
  "publishable": ["published"],
  "rejected": ["draft", "review-queued"],
  "blocked": ["draft"],
  "published": ["stale", "blocked"],
  "stale": ["review-queued"],
};
```

REVIEW_WORKFLOW § 2.3 트리거 표 정합. `assertTransitionAllowed(from, to)` 모든 server action 의 첫 줄.

## 7. § 8.1 시나리오 cascade — CAM-28 정정

| # | 시나리오 | 통과 기준 | 검증 방식 |
|---|---|---|---|
| 1 | Article (Low) draft → submitForReview → ComplianceRecord(pre-publish, peer_reviewer=null) 1행 + ReviewQueueEntry(manual-review, open, required_roles={operator}) 1행 | record.record_phase='pre-publish' · entry.queue_type='manual-review' · entry.required_roles={operator} · entry.priority='P0' | vitest |
| 2 | Article (Medium) draft → submitForReview → finalRoles={operator, medical} | required_roles 2개 enum array | vitest |
| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
| 9 | publish 액션 → record.record_phase='pre-publish' → 'published' UPDATE (record ID 보존) + entity.compliance_record_id 채워짐 | record.id 동일 · record.published_at IS NOT NULL · entity.published_at IS NOT NULL | vitest + e2e |
| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK | e2e |
| 11 | check() stub Low 입력 → findings=[]·gateRequired=false·automatedDecision='pass'·manualReview=true | input.metadata.explicitRiskLevel MAX 결합 | vitest |
| 12 | check() stub High 입력 (explicit or inferred) → 가상 finding `m0-stub-risk-level-high-gate` 주입 · gateRequired=true · automatedDecision='gate' | M0 High 가상 finding | vitest |
| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
| 14 | published entity가 record_phase='pre-publish' record 참조 시도 → trigger `published_content_compliance_guard` RAISE | DB level 발행 게이트 무결성 | e2e |
| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |

## 8. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0014 compliance_record migration | packages/core-content/migrations/C0014_compliance_record.sql |
| 2 | C0015 review_queue_entry migration | C0015_review_queue_entry.sql |
| 3 | C0016 6 entity status unlock + compliance_record_id + sentinel backfill + guard trigger | C0016_status_unlock.sql |
| 4 | Drizzle schema v0.5 — 2 신규 table + 6 entity compliance_record_id 추가 + skeleton-limit 해제 | packages/core-content/src/schema.ts |
| 5 | Compliance types + check() stub + envelope wrapper | apps/web/src/lib/compliance/types.ts + check.ts |
| 6 | maxRisk + final-roles + publishable-check + transitions helper | apps/web/src/lib/compliance/{risk, final-roles, publishable-check, transitions}.ts |
| 7 | assertReviewerEligibility helper | apps/web/src/lib/compliance/eligibility.ts |
| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
| 9 | /admin/{slug}/review-queue/page.tsx (list) | (admin) route |
| 10 | /admin/{slug}/review-queue/[entryId]/page.tsx (detail) + actions.ts | (admin) route + ReviewEntryApprovalForm component |
| 11 | 6 entity form status select read-only display + zod schema 정정 | ArticleForm · FaqForm · TreatmentPageForm · LegalDocumentForm · PublicationForm · MediaAppearanceForm + clinic-profile-schema / eat-content-schema |
| 12 | 6 entity edit page 안 "검수 요청" / "발행" 액션 버튼 + 기존 save action 안 status field 무시 | edit pages |
| 13 | manifest 19단계 patch (16 + C0014 + C0015 + C0016) | packages/migrations-runner/src/manifest.ts |
| 14 | audit emit 4종 (REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN audit matrix cascade) | (각 server action 안 emitAuditEvent + CA-CASCADE-06 doc patch) |
| 15 | vitest scenarios 1~16 | apps/web/src/lib/compliance/__tests__/transitions.test.ts |
| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 부분 해소 marker · audit matrix cascade (CA-CASCADE-06) | doc patches |

## 9. M0 v1.0 cascade markers (defer 정리)

### 9.1 Phase Alpha 합류
- `CA-DEFER-01`: RuleCatalog yaml + check() 9단계 + composite/contextExceptions
- `CA-DEFER-02`: RiskInference 자동 추론 (inlineRiskFlags 매칭 · pageType·articleType·slot MAX) — M0 stub 은 입력 MAX 만
- `CA-DEFER-04`: 캐시 2종 + cacheKey
- `CA-DEFER-05`: warning 큐 + warningAcknowledgements
- `CA-DEFER-07`: request-changes / delegate 액션
- `CA-DEFER-11`: autoCheckResult.findings 풀명세
- `CA-DEFER-15` (CAM-02 신설): content-gate 자동 큐 진입 (ruleCatalog 합류 시)
- `CA-DEFER-16` (CAM-11 신설): Feature contentType + featureContentType

### 9.2 M1 Phase Beta 합류
- `CA-DEFER-03`: LLM 보조 (synthetic ruleId · llmAssist invocations)
- `CA-DEFER-06`: stale 큐 + StaleFlags 발생 트리거
- `CA-DEFER-10`: client 검수자
- `CA-DEFER-12`: attachments[] 법무 의견서
- `CA-DEFER-14` (CAM-21 신설): NotificationEvent envelope (notifications Feature 합류)

### 9.3 M2+ 합류
- `CA-DEFER-08`: priorReviewRequired · 사전심의 외부 연동
- `CA-DEFER-09`: MediaThresholdAssessment + mediaThresholdOperationalInput · analytics-reporting 통합
- `CA-DEFER-13`: ComplianceRecord 풀 컬럼 (mediaThreshold · attachments · staleFlags · warning · llmAssist · priorReviewSubmissionId · featureContentType · client 슬롯) — 각 CA-DEFER phase 매핑

## 10. Cascade markers (다른 SoT 문서로 전파)

- `CA-CASCADE-01`: `docs/core/DATA_MODEL.md` C-10 M0 컬럼 marker — subset 명시 + CA-DEFER-13 매핑 표 (mediaThresholdAssessment/OperationalInput · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns 분리)
- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
- `CA-CASCADE-03`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반)
- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14)
- `CA-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **19 단계** (16 + C0014/C0015/C0016)
- `CA-CASCADE-06`: `docs/admin/REVIEW_WORKFLOW.md` § 9.1.1 + `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` audit matrix cascade — eventType 4종 · payload shape · emit 시점 (tx commit 후 base role) · 실패 정책

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. M0 vertical slice scope — ComplianceRecord skeleton + ReviewQueueEntry + 6 entity 전이 + /review-queue 화면 + check() stub + DB CHECK 해제. 13 CA-DEFER marker. |
| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 finding 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 28 → 5 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 5 cycle 36 findings 전건 수용. acceptance commit 7 cascade docs 동시 포함 marker (CA-CASCADE-01~06 + plan 본문). 실 SQL 코드 cascade 는 별 cycle (compliance-assistant M0 code v1.0). |
| 2026-05-18 | v0.5 | **Codex 자동 비평 cycle 4 1 finding (CAM4-01 = CAM3-02 잔재 정정) 전건 수용 patch**: § 1.1 LegalDocument 면제 항목 안 `auto_check_result 슬롯에 envelope 저장` 표현 정정 → result 슬롯은 SoT 7 필드만 · exemptReason 은 `compliance_record.metadata` 슬롯. 누계 cycle 1~4 = 36 findings 전건 수용. |
| 2026-05-18 | v0.4 | **Codex 자동 비평 cycle 3 2 finding (blocking 0·major 2·minor 0) 전건 수용 patch**: (CAM3-01) § 1.2 check() stub 요약 안 "summary 등 모두 포함" 잔재 → result 7 필드만 명시 + envelope.meta 안 추가 메타 분리. (CAM3-02) § 7 시나리오 #3 + #13 정정 — `auto_check_result.exemptReason` 잔재 → `compliance_record.metadata` 슬롯 + check() throw 검증. 누계 cycle 1+2+3 = 35 findings 전건 수용. |
| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

codex
핵심 구현 파일은 `apps/web/src/lib/compliance/*`, review queue route, C0016 migration 쪽입니다. cycle 1 항목별로 패치가 실제 동작까지 닫히는지 먼저 대조하고, 그 다음 새 결함을 찾겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/entity-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/check.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0016_status_unlock.sql' in C:\Users\assag\solution\website-exposure
 succeeded in 773ms:
// @glitzy/web/lib/compliance/entity-actions — entity별 server action thin wrapper
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — submitForReview · publishContent.
// 모든 6 entity edit page 가 사용.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { submitForReview, publishContent } from "./server-actions";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
  type SubmitContentType,
} from "./types";
import type { SaveResult } from "@/lib/save-result";

const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  Article: "article",
  TreatmentPage: "treatment_page",
  LegalDocument: "legal_document",
  FAQ: "faq",
  Publication: "publication",
  MediaAppearance: "media_appearance",
};

const ENTITY_ROUTES: Record<SubmitContentType, string> = {
  Article: "articles",
  TreatmentPage: "treatments",
  LegalDocument: "legal-documents",
  FAQ: "faqs",
  Publication: "publications",
  MediaAppearance: "media-appearances",
};

export async function submitForReviewAction(
  instanceSlug: string,
  contentType: SubmitContentType,
  contentRef: string,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const table = ENTITY_TABLES[contentType];
        // CAMC-04 정정: FOR UPDATE 로 잠금 + draft/rejected status assert.
        const rows = await tx.unsafe<{ status: string; risk_level: string | null }[]>(`
          SELECT status::text AS status,
                 ${contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance" ? "NULL::text" : "risk_level::text"} AS risk_level
            FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const out = await submitForReview(tx, ctx, {
          contentType,
          contentRef,
          contentRow: { status: rows[0]!.status, risk_level: rows[0]!.risk_level },
        });
        // entity status draft → review-queued
        await tx.unsafe(`
          UPDATE ${table}
             SET status = 'review-queued'::content_publication_status, updated_at = now()
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
        `);
        return { ok: true as const, ctx, out };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-submitted-for-review",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          // CAMC-07/10 정정: finalRoles · pageRiskLevel 포함
          payload: {
            contentType,
            contentRef,
            recordId: result.out.recordId,
            entryId: result.out.entryId,
            finalRoles: result.out.finalRoles,
            pageRiskLevel: result.out.pageRiskLevel,
          },
        });
      } catch (err) {
        console.error("[submitForReviewAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}`);
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[submitForReviewAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
  }
}

export async function publishContentAction(
  instanceSlug: string,
  contentType: SubmitContentType,
  contentRef: string,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const table = ENTITY_TABLES[contentType];
        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
        //   현재 row status 만 FOR UPDATE 잠금 + 검증 후 latest pre-publish record 사용.
        const rows = await tx.unsafe<{ status: string }[]>(`
          SELECT status::text AS status FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const row = rows[0]!;
        if (row.status !== "publishable") {
          return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
        }
        // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
        const recRows = await tx<{ id: string; record_version: number }[]>`
          SELECT id, record_version FROM compliance_record
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND content_type = ${contentType}::compliance_content_type
             AND content_ref = ${contentRef}
             AND record_phase = 'pre-publish'::compliance_record_phase
           ORDER BY record_version DESC
           LIMIT 1
        `;
        if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
        await publishContent(tx, ctx, {
          contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
        });
        return { ok: true as const, ctx, recordId: recRows[0]!.id, recordVersion: recRows[0]!.record_version };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "no-record") {
      return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
    }
    if (result.ok === false && result.action === "not-publishable") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-published",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          // CAMC-11 정정: recordVersion 포함
          payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
        });
      } catch (err) {
        console.error("[publishContentAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      revalidatePath(`/admin/${instanceSlug}`);
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[publishContentAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
  }
}

 succeeded in 801ms:
-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
-- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
-- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
-- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.

-- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;

-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;

-- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
    ALTER TABLE article ADD CONSTRAINT article_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
    ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
    ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
    ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  END IF;
END $$;

-- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
--   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
--   기존 published row 사전 마이그레이션 회피용.

-- Article
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  COALESCE(a.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM article a
WHERE a.status = 'published' AND a.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = a.instance_id
      AND cr.content_type = 'Article'::compliance_content_type
      AND cr.content_ref = a.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
WHERE a.instance_id = cr.instance_id
  AND cr.content_type = 'Article'::compliance_content_type
  AND cr.content_ref = a.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND a.status = 'published' AND a.compliance_record_id IS NULL;

-- TreatmentPage
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  COALESCE(t.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM treatment_page t
WHERE t.status = 'published' AND t.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = t.instance_id
      AND cr.content_type = 'TreatmentPage'::compliance_content_type
      AND cr.content_ref = t.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
WHERE t.instance_id = cr.instance_id
  AND cr.content_type = 'TreatmentPage'::compliance_content_type
  AND cr.content_ref = t.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND t.status = 'published' AND t.compliance_record_id IS NULL;

-- LegalDocument — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상. 안전 backfill 추가 (CAMC-02 정정).
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
  published_at, published_by, record_phase, record_version, metadata)
SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
  '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
  l.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
FROM legal_document l
WHERE l.status = 'published' AND l.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = l.instance_id
      AND cr.content_type = 'LegalDocument'::compliance_content_type
      AND cr.content_ref = l.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
WHERE l.instance_id = cr.instance_id
  AND cr.content_type = 'LegalDocument'::compliance_content_type
  AND cr.content_ref = l.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND l.status = 'published' AND l.compliance_record_id IS NULL;

-- FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상.
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, COALESCE(f.risk_level, 'Low')::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, f.published_at,
  f.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM faq f
WHERE f.status = 'published' AND f.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = f.instance_id
      AND cr.content_type = 'FAQ'::compliance_content_type
      AND cr.content_ref = f.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
WHERE f.instance_id = cr.instance_id
  AND cr.content_type = 'FAQ'::compliance_content_type
  AND cr.content_ref = f.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND f.status = 'published' AND f.compliance_record_id IS NULL;

-- Publication · MediaAppearance — risk_level 'Low' fixed
INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
  p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM publication p
WHERE p.status = 'published' AND p.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = p.instance_id
      AND cr.content_type = 'Publication'::compliance_content_type
      AND cr.content_ref = p.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
WHERE p.instance_id = cr.instance_id
  AND cr.content_type = 'Publication'::compliance_content_type
  AND cr.content_ref = p.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND p.status = 'published' AND p.compliance_record_id IS NULL;

INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  record_phase, record_version, metadata)
SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
  m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  'published'::compliance_record_phase, 1,
  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
FROM media_appearance m
WHERE m.status = 'published' AND m.compliance_record_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM compliance_record cr
    WHERE cr.instance_id = m.instance_id
      AND cr.content_type = 'MediaAppearance'::compliance_content_type
      AND cr.content_ref = m.slug
      AND cr.metadata @> '{"sentinel":true}'::jsonb
  );

UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
WHERE m.instance_id = cr.instance_id
  AND cr.content_type = 'MediaAppearance'::compliance_content_type
  AND cr.content_ref = m.slug
  AND cr.metadata @> '{"sentinel":true}'::jsonb
  AND m.status = 'published' AND m.compliance_record_id IS NULL;

-- (Step 5) NULL 잔존 검증 — 6 entity
DO $$
DECLARE null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
END $$;

-- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
    ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
  END IF;
END $$;

-- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
--   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
CREATE OR REPLACE FUNCTION published_content_compliance_guard()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  record_row compliance_record%ROWTYPE;
  expected_content_type compliance_content_type;
BEGIN
  IF NEW.status <> 'published' THEN RETURN NEW; END IF;
  IF NEW.compliance_record_id IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
  END IF;
  SELECT * INTO record_row FROM compliance_record
   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
  END IF;
  IF record_row.record_phase <> 'published' THEN
    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
  END IF;
  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
  expected_content_type := CASE TG_TABLE_NAME
    WHEN 'article' THEN 'Article'
    WHEN 'treatment_page' THEN 'TreatmentPage'
    WHEN 'legal_document' THEN 'LegalDocument'
    WHEN 'faq' THEN 'FAQ'
    WHEN 'publication' THEN 'Publication'
    WHEN 'media_appearance' THEN 'MediaAppearance'
    ELSE NULL
  END;
  IF expected_content_type IS NULL THEN
    RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
  END IF;
  IF record_row.content_type <> expected_content_type THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
  END IF;
  -- content_ref 일치 (slug)
  IF record_row.content_ref <> NEW.slug THEN
    RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS article_published_guard ON article;
CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS faq_published_guard ON faq;
CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS publication_published_guard ON publication;
CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
  FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

 succeeded in 810ms:
// @glitzy/web/lib/compliance/check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4 (CAM-03·04·05·09 + CAM2-01·02)
// check() M0 stub — manualReview only · ruleCatalog 미합류 (CA-DEFER-01·02·03·04).

import type {
  ComplianceCheckInput,
  ComplianceCheckResult,
  ComplianceCheckEnvelope,
  Finding,
} from "./types";
import { ComplianceConfigError } from "./types";
import { maxRisk } from "./risk";

const CATALOG_VERSION = "m0-stub-v0.1";
const CATALOG_HASH = "stub";

/**
 * LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
 *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
 *   result 는 SoT 7 필드만 (automatedDecision='pass' · 모든 카운터 0).
 *   exemptReason 은 meta 안.
 */
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  // CAMC-08 정정: maxRisk MAX 결합 (격하 금지)
  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );
  return {
    result: {
      automatedDecision: "pass",
      buildBlocked: false,
      gateRequired: false,
      hasWarnings: false,
      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
      requiredApproverRoles: [],
      findings: [],
    },
    meta: {
      pageRiskLevel,
      catalogVersion: CATALOG_VERSION,
      catalogHash: CATALOG_HASH,
      manualReview: false,
      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
    },
  };
}

/**
 * compliance-assistant Feature spec § 3.3 check() 단일 엔트리포인트 — M0 stub.
 *
 * **M0 v0.1 동작**:
 * - LegalDocument 입력 시 throw — CONTENT_STANDARDS § 7.1.1.1 호출 자체 우회 (호출자가 buildLegalDocumentExemptEnvelope 사용)
 * - pageRiskLevel = maxRisk(explicitRiskLevel ?? Low, inferredRiskLevel ?? Low, Low) — 격하 금지 (CAM-04)
 * - High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true (CAM-05)
 * - 그 외 입력 시 findings=[]·gateRequired=false·automatedDecision='pass'
 * - ruleCatalog 미합류 — CA-DEFER-01·02 marker · LLM CA-DEFER-03 · 캐시 CA-DEFER-04
 */
export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
      "Use buildLegalDocumentExemptEnvelope() instead.",
    );
  }

  const pageRiskLevel = maxRisk(
    input.metadata.explicitRiskLevel ?? "Low",
    input.metadata.inferredRiskLevel ?? "Low",
    "Low",
  );

  const findings: Finding[] = [];
  let gateRequired = false;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";

  if (pageRiskLevel === "High") {
    findings.push({
      ruleId: "m0-stub-risk-level-high-gate",
      category: "risk-level-virtual",
      pattern: "",
      severity: "content-gate",
      location: { start: 0, end: 0 },
      requiredApproverRoles: ["medical"],
      triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
    });
    gateRequired = true;
    automatedDecision = "gate";
  }

  return {
    result: {
      automatedDecision,
      buildBlocked: false,
      gateRequired,
      hasWarnings: false,
      findingsBySeverity: {
        fail: 0,
        "content-gate": gateRequired ? 1 : 0,
        warning: 0,
        info: 0,
      },
      requiredApproverRoles: gateRequired ? ["medical"] : [],
      findings,
    },
    meta: { pageRiskLevel, catalogVersion: CATALOG_VERSION, catalogHash: CATALOG_HASH, manualReview: true },
  };
}

 succeeded in 834ms:
// @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
// 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.

import type { ScopedTx } from "@glitzy/db";
import type { TenantContext } from "@glitzy/auth";

import type {
  ApproverRole,
  ComplianceCheckEnvelope,
  ContentType,
  SubmitContentType,
} from "./types";
import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
import { check, buildLegalDocumentExemptEnvelope } from "./check";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
import { evaluatePublishable } from "./publishable-check";
import { assertReviewerEligibility } from "./eligibility";

const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };

/**
 * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
 *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
 */
async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
}

function isAllowedSubmitType(t: string): t is SubmitContentType {
  return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
}

export type SubmitForReviewArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  contentRow: { status: string; risk_level?: string | null; body?: string };
};

export type SubmitForReviewResult = {
  recordId: string;
  entryId: string;
  finalRoles: ApproverRole[];   // CAMC-07/10
  pageRiskLevel: "Low" | "Medium" | "High";
};

/**
 * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
 */
export async function submitForReview(
  tx: ScopedTx,
  ctx: TenantContext,
  args: SubmitForReviewArgs,
): Promise<SubmitForReviewResult> {
  if (!isAllowedSubmitType(args.contentType)) {
    throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
  }
  assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");

  const checkInput = {
    contentType: args.contentType,
    contentRef: args.contentRef,
    body: args.contentRow.body ?? "",
    metadata: {
      explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
    },
  };
  const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
    ? buildLegalDocumentExemptEnvelope(checkInput)
    : await check(checkInput);

  const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);

  // ComplianceRecord INSERT (pre-publish)
  const slaHours = SLA_DUE_HOURS.P0;
  const recordRows = await tx<{ id: string }[]>`
    INSERT INTO compliance_record (
      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
      record_phase, record_version, metadata
    ) VALUES (
      ${ctx.instanceId}::uuid,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${envelope.meta.pageRiskLevel}::risk_level,
      ${JSON.stringify(envelope.result)}::jsonb,
      'pre-publish'::compliance_record_phase,
      1,
      ${JSON.stringify({
        manualReview: envelope.meta.manualReview,
        catalogVersion: envelope.meta.catalogVersion,
        catalogHash: envelope.meta.catalogHash,
        ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
      })}::jsonb
    )
    RETURNING id
  `;
  const recordId = recordRows[0]!.id;

  // ReviewQueueEntry INSERT (open)
  const entryRows = await tx<{ id: string }[]>`
    INSERT INTO review_queue_entry (
      instance_id, queue_type, content_type, content_ref, compliance_record_id,
      status, priority, required_roles, sla_due_at
    ) VALUES (
      ${ctx.instanceId}::uuid,
      'manual-review'::review_queue_type,
      ${args.contentType}::compliance_content_type,
      ${args.contentRef},
      ${recordId}::uuid,
      'open'::review_queue_status,
      'P0'::review_queue_priority,
      ${finalRoles}::approver_role[],
      ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
    )
    RETURNING id
  `;
  const entryId = entryRows[0]!.id;

  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
}

export type ApproveContentArgs = {
  recordId: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
};

export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };

/**
 * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
 * AND 게이트 충족 시 in-review → approved 자동 전이.
 */
export async function approveContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: ApproveContentArgs,
): Promise<ApproveContentResult> {
  assertReviewerEligibility(ctx, args.role);
  await acquireRecordLock(tx, args.recordId);

  // entry + record FOR UPDATE
  // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[] }[]>`
    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  const entry = entryRows[0]!;
  if (!entry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
    );
  }

  const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string }[]>`
    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]! as ComplianceRecordRow & { id: string; content_type: string };

  // 중복 approve idempotent
  if (isRoleSatisfied(record, args.role)) {
    return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
  }

  // 슬롯 채움 + entity 전이
  const now = new Date();
  if (args.role === "operator") {
    await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
  } else if (args.role === "medical") {
    await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.physician_approver = ctx.userId; record.physician_approved_at = now;
  } else if (args.role === "legal") {
    await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
    record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
  }

  // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
  if (entry.status === "open") {
    await tx`
      UPDATE review_queue_entry
         SET status = 'in-progress'::review_queue_status,
             assigned_to = ${ctx.userId}::uuid,
             assigned_at = ${now.toISOString()}::timestamptz,
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
  }

  // entity status 전이 review-queued → in-review (첫 approve)
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = CASE
         WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
         ELSE status
       END,
       updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);

  // AND 게이트 평가
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));

  let entryStatus: "in-progress" | "resolved" = "in-progress";
  if (allApproved) {
    // entity in-review → approved → publishable (publishable evaluator pass 시)
    const publishable = evaluatePublishable(record, record.content_type as ContentType);
    const targetStatus = publishable.publishable ? "publishable" : "approved";
    await tx.unsafe(`
      UPDATE ${args.contentTable}
         SET status = '${targetStatus}'::content_publication_status,
             updated_at = now()
       WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
    `);
    // entry resolved
    await tx`
      UPDATE review_queue_entry
         SET status = 'resolved'::review_queue_status,
             resolved_at = ${now.toISOString()}::timestamptz,
             resolved_by = ${ctx.userId}::uuid,
             resolution_type = 'approved',
             updated_at = now()
       WHERE id = ${entry.id}::uuid
    `;
    entryStatus = "resolved";
  }

  return { allApproved, entryStatus };
}

function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
  const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
  return finalRoles.every((r) => isRoleSatisfied(record, r));
}

export type RejectContentArgs = {
  recordId: string;
  reason: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
};

/**
 * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
 */
export async function rejectContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: RejectContentArgs,
): Promise<void> {
  assertReviewerEligibility(ctx, args.role);
  if (args.reason.trim().length < 50) {
    throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
  }
  await acquireRecordLock(tx, args.recordId);

  const entryRows = await tx<{ id: string }[]>`
    SELECT id FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");

  const now = new Date();
  await tx`
    UPDATE review_queue_entry
       SET status = 'resolved'::review_queue_status,
           resolved_at = ${now.toISOString()}::timestamptz,
           resolved_by = ${ctx.userId}::uuid,
           resolution_type = 'rejected',
           metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
           updated_at = now()
     WHERE id = ${entryRows[0]!.id}::uuid
  `;
  await tx.unsafe(`
    UPDATE ${args.contentTable}
       SET status = 'rejected'::content_publication_status,
           updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
  `);
}

export type PublishContentArgs = {
  contentType: SubmitContentType;
  contentRef: string;
  recordId: string;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
};

export type PublishContentResult = { recordVersion: number };

/**
 * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
 *   entity.status → published + published_at 채움.
 *   publishable evaluator 통과 검증.
 */
export async function publishContent(
  tx: ScopedTx,
  ctx: TenantContext,
  args: PublishContentArgs,
): Promise<PublishContentResult> {
  assertReviewerEligibility(ctx, "operator");
  await acquireRecordLock(tx, args.recordId);

  // record FOR UPDATE
  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; record_phase: string; record_version: number })[]>`
    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
           record_phase::text AS record_phase, record_version,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");

  const publishable = evaluatePublishable(record, args.contentType);
  if (!publishable.publishable) {
    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
  }

  // CAMC-06 정정: entity 현 status='publishable' assert
  const entityStatusRows = await tx.unsafe<{ status: string }[]>(`
    SELECT status::text AS status FROM ${args.contentTable}
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
     FOR UPDATE
  `);
  if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
  assertTransitionAllowed(entityStatusRows[0]!.status as ContentWorkflowState, "published");

  const now = new Date();
  // (1) compliance_record record_phase 전환 (record ID 보존)
  await tx`
    UPDATE compliance_record
       SET record_phase = 'published'::compliance_record_phase,
           published_at = ${now.toISOString()}::timestamptz,
           published_by = ${ctx.userId}::uuid,
           updated_at = now()
     WHERE id = ${args.recordId}::uuid
  `;
  // (2) entity status → published + published_at + compliance_record_id 채움.
  //   CAMC-05 정정: row count 검증 — current status='publishable' AND_clause.
  const updated = await tx.unsafe<{ id: string }[]>(`
    UPDATE ${args.contentTable}
       SET status = 'published'::content_publication_status,
           published_at = '${now.toISOString()}'::timestamptz,
           compliance_record_id = '${args.recordId}',
           updated_at = now()
     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
       AND status = 'publishable'::content_publication_status
     RETURNING id
  `);
  if (updated.length !== 1) {
    throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);
  }
  return { recordVersion: record.record_version };
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/__tests__/compliance.test.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/publishable-check.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 700ms:
// @glitzy/web/lib/compliance/publishable-check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.3 CA-GATE-03 (CAM-06·16, CAM2-04)
// REVIEW_WORKFLOW § 7.1 publishable 6조건 평가.

import type { ApproverRole, ContentType } from "./types";
import { ComplianceConfigError } from "./types";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";

export type PublishableResult =
  | { publishable: true; finalRoles: ApproverRole[] }
  | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[]; configError?: undefined }
  | { publishable: false; reasons: string[]; configError: string; finalRoles?: undefined; missingRoles?: undefined };

export function evaluatePublishable(
  record: ComplianceRecordRow,
  contentType: ContentType,
): PublishableResult {
  const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] } | null;
  const required = autoCheck?.requiredApproverRoles ?? [];

  let finalRoles: ApproverRole[];
  try {
    finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
  } catch (err) {
    if (err instanceof ComplianceConfigError) {
      return { publishable: false, reasons: [err.message], configError: err.message };
    }
    throw err;
  }

  const reasons: string[] = [];
  const missingRoles: ApproverRole[] = [];

  // (1) automatedDecision !== "block"
  if (autoCheck?.automatedDecision === "block") {
    reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  }
  // (2) finalRoles 슬롯 모두 기록
  for (const role of finalRoles) {
    if (!isRoleSatisfied(record, role)) {
      missingRoles.push(role);
      reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
    }
  }
  // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  if (record.prior_review_required && record.prior_review_passed !== true) {
    reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  }
  // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  // (5) LegalDocument legal 슬롯 — finalRoles 검증으로 동시 충족
  // (6) warning 정책 — M0 stub: 항상 충족 (CA-DEFER-05)

  if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  return { publishable: true, finalRoles };
}

 succeeded in 742ms:
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 7 scenarios — vitest scope (자동 검증 가능 부분)

import { describe, it, expect } from "vitest";
import { calculateFinalRoles, isRoleSatisfied } from "../final-roles";
import { evaluatePublishable } from "../publishable-check";
import { maxRisk } from "../risk";
import { check, buildLegalDocumentExemptEnvelope } from "../check";
import { assertTransitionAllowed, listAllowedTransitions } from "../transitions";
import { ComplianceConfigError, ComplianceTransitionError } from "../types";

describe("calculateFinalRoles — 시나리오 1·2·3·12 일부", () => {
  it("Article Low → {operator}", () => {
    expect(calculateFinalRoles("Article", "Low")).toEqual(["operator"]);
  });
  it("Article Medium → {operator, medical}", () => {
    expect(calculateFinalRoles("Article", "Medium")).toEqual(["medical", "operator"]);
  });
  it("LegalDocument Low → {operator, legal}", () => {
    expect(calculateFinalRoles("LegalDocument", "Low")).toEqual(["legal", "operator"]);
  });
  it("Article High + priorReview → {operator, medical, legal}", () => {
    expect(calculateFinalRoles("Article", "High", true)).toEqual(["legal", "medical", "operator"]);
  });
  it("unknown role throw (CAM2-04 fail closed)", () => {
    expect(() => calculateFinalRoles("Article", "Low", false, ["alien"])).toThrow(ComplianceConfigError);
  });
  it("client role throw (CA-DEFER-10)", () => {
    expect(() => calculateFinalRoles("Article", "Low", false, ["client"])).toThrow(ComplianceConfigError);
  });
});

describe("maxRisk — CAM-04 격하 금지", () => {
  it("Low + High → High", () => {
    expect(maxRisk("Low", "High")).toBe("High");
  });
  it("Medium + Low + Low → Medium", () => {
    expect(maxRisk("Medium", "Low", "Low")).toBe("Medium");
  });
  it("Low + Low → Low", () => {
    expect(maxRisk("Low", "Low")).toBe("Low");
  });
});

describe("check() M0 stub — 시나리오 11·12·13", () => {
  it("Low 입력 → findings=[]·gateRequired=false·automatedDecision=pass", async () => {
    const env = await check({
      contentType: "Article",
      contentRef: "test",
      body: "",
      metadata: { explicitRiskLevel: "Low" },
    });
    expect(env.result.findings).toEqual([]);
    expect(env.result.gateRequired).toBe(false);
    expect(env.result.automatedDecision).toBe("pass");
    expect(env.meta.manualReview).toBe(true);
    expect(env.meta.pageRiskLevel).toBe("Low");
    expect(env.result.findingsBySeverity.info).toBe(0);
  });
  it("High 입력 → 가상 finding `m0-stub-risk-level-high-gate` + gateRequired=true", async () => {
    const env = await check({
      contentType: "Article",
      contentRef: "test",
      body: "",
      metadata: { explicitRiskLevel: "High" },
    });
    expect(env.result.findings).toHaveLength(1);
    expect(env.result.findings[0]!.ruleId).toBe("m0-stub-risk-level-high-gate");
    expect(env.result.gateRequired).toBe(true);
    expect(env.result.automatedDecision).toBe("gate");
    expect(env.result.findingsBySeverity["content-gate"]).toBe(1);
    expect(env.meta.pageRiskLevel).toBe("High");
  });
  it("LegalDocument 입력 → throw (CAM2-02)", async () => {
    await expect(check({
      contentType: "LegalDocument",
      contentRef: "privacy",
      body: "",
      metadata: {},
    })).rejects.toThrow(ComplianceConfigError);
  });
  it("buildLegalDocumentExemptEnvelope → exemptReason + manualReview=false", () => {
    const env = buildLegalDocumentExemptEnvelope({
      contentType: "LegalDocument",
      contentRef: "privacy",
      body: "",
      metadata: {},
    });
    expect(env.meta.exemptReason).toBe("LegalDocument-CONTENT_STANDARDS-7.1.1.1");
    expect(env.meta.manualReview).toBe(false);
    expect(env.result.automatedDecision).toBe("pass");
    expect(env.result.findingsBySeverity.info).toBe(0);
  });
  it("Low explicit + High inferred → High (격하 금지)", async () => {
    const env = await check({
      contentType: "Article",
      contentRef: "test",
      body: "",
      metadata: { explicitRiskLevel: "Low", inferredRiskLevel: "High" },
    });
    expect(env.meta.pageRiskLevel).toBe("High");
    expect(env.result.gateRequired).toBe(true);
  });
});

describe("status 전이 table — 시나리오 14 일부", () => {
  it("draft → review-queued 허용", () => {
    expect(() => assertTransitionAllowed("draft", "review-queued")).not.toThrow();
  });
  it("draft → published 차단", () => {
    expect(() => assertTransitionAllowed("draft", "published")).toThrow(ComplianceTransitionError);
  });
  it("publishable → published 허용", () => {
    expect(() => assertTransitionAllowed("publishable", "published")).not.toThrow();
  });
  it("listAllowedTransitions", () => {
    expect(listAllowedTransitions("review-queued")).toContain("in-review");
  });
});

describe("evaluatePublishable — 시나리오 4·5", () => {
  const baseRecord = {
    peer_reviewer: null,
    peer_reviewed_at: null,
    physician_approver: null,
    physician_approved_at: null,
    legal_counsel: null,
    legal_counsel_at: null,
    page_risk_level: "Low" as const,
    prior_review_required: false,
    prior_review_passed: null,
    auto_check_result: { automatedDecision: "pass", requiredApproverRoles: [] },
  };
  it("Low Article + operator 충족 → publishable=true", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date() },
      "Article",
    );
    expect(result.publishable).toBe(true);
  });
  it("Medium Article + operator only → missing medical", () => {
    const result = evaluatePublishable(
      { ...baseRecord, page_risk_level: "Medium", peer_reviewer: "u1", peer_reviewed_at: new Date() },
      "Article",
    );
    expect(result.publishable).toBe(false);
    if (result.publishable === false && "missingRoles" in result) {
      expect(result.missingRoles).toContain("medical");
    }
  });
  it("LegalDocument + operator only → missing legal", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date() },
      "LegalDocument",
    );
    expect(result.publishable).toBe(false);
    if (result.publishable === false && "missingRoles" in result) {
      expect(result.missingRoles).toContain("legal");
    }
  });
  it("automatedDecision=block → publishable=false (CAM-06)", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date(), auto_check_result: { automatedDecision: "block" } },
      "Article",
    );
    expect(result.publishable).toBe(false);
  });
  it("unknown role in requiredApproverRoles → configError (CAM2-04)", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date(), auto_check_result: { automatedDecision: "pass", requiredApproverRoles: ["alien"] } },
      "Article",
    );
    expect(result.publishable).toBe(false);
    if (result.publishable === false && "configError" in result && result.configError) {
      expect(result.configError).toContain("Unknown ApproverRole");
    }
  });
});

describe("isRoleSatisfied", () => {
  const r = {
    peer_reviewer: "u1", peer_reviewed_at: new Date(),
    physician_approver: null, physician_approved_at: null,
    legal_counsel: null, legal_counsel_at: null,
    page_risk_level: "Low" as const,
    prior_review_required: false,
    prior_review_passed: null,
    auto_check_result: null,
  };
  it("operator 충족", () => expect(isRoleSatisfied(r, "operator")).toBe(true));
  it("medical 미충족", () => expect(isRoleSatisfied(r, "medical")).toBe(false));
});

2026-05-18T09:26:03.376813Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m Get-Content -Path apps/web/src/app/([36;1madmin[0m)/admin/[instanceSlug]/revie …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                     ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 851ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m Get-Content -Path apps/web/src/app/([36;1madmin[0m)/admin/[instanceSlug]/revie …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                     ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

2026-05-18T09:26:03.393439Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m Get-Content -Path apps/web/src/app/([36;1madmin[0m)/admin/[instanceSlug]/revie …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                     ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 873ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m Get-Content -Path apps/web/src/app/([36;1madmin[0m)/admin/[instanceSlug]/revie …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                     ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/final-roles.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"status.*FormData|formData.get\\(\\\"status\\\"\\)|status:\" apps/web/src/app apps/web/src/lib apps/web/src/components/forms -S" in C:\Users\assag\solution\website-exposure
 succeeded in 659ms:
// @glitzy/web/(admin)/[instanceSlug]/review-queue/actions
// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — approveEntry · rejectEntry

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
  type ApproverRole,
  type SubmitContentType,
} from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  Article: "article",
  TreatmentPage: "treatment_page",
  LegalDocument: "legal_document",
  FAQ: "faq",
  Publication: "publication",
  MediaAppearance: "media_appearance",
};

export async function approveEntryAction(
  instanceSlug: string,
  entryId: string,
  role: ApproverRole,
  _prev: SaveResult | null,
  _formData: FormData,
): Promise<SaveResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
          SELECT compliance_record_id, content_type::text AS content_type, content_ref
            FROM review_queue_entry
           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const entry = rows[0]!;
        const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
        if (!table) {
          return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
        }
        const out = await approveContent(tx, ctx, {
          recordId: entry.compliance_record_id,
          role,
          contentTable: table,
          contentRef: entry.content_ref,
        });
        return { ok: true as const, ctx, entry, out };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "unsupported") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-approved",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: result.entry.content_type,
            contentRef: result.entry.content_ref,
            recordId: result.entry.compliance_record_id,
            role,
            allApproved: result.out.allApproved,
            entryStatus: result.out.entryStatus,
          },
        });
      } catch (err) {
        console.error("[approveEntryAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
      return { ok: true, slug: entryId };
    }
    return { ok: false, fieldErrors: {}, formError: "승인에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) {
      return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
    }
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[approveEntryAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "승인 중 오류가 발생했습니다." };
  }
}

export async function rejectEntryAction(
  instanceSlug: string,
  entryId: string,
  role: ApproverRole,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 50) {
    return { ok: false, fieldErrors: { reason: ["거부 사유는 50자 이상이어야 합니다."] } };
  }
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();
  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx) => {
        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
          SELECT compliance_record_id, content_type::text AS content_type, content_ref
            FROM review_queue_entry
           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        const entry = rows[0]!;
        const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
        if (!table) {
          return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
        }
        await rejectContent(tx, ctx, {
          recordId: entry.compliance_record_id,
          reason,
          role,
          contentTable: table,
          contentRef: entry.content_ref,
        });
        return { ok: true as const, ctx, entry };
      },
    );

    if (result.ok === false && result.action === "notfound") notFound();
    if (result.ok === false && result.action === "unsupported") {
      return { ok: false, fieldErrors: {}, formError: result.message };
    }
    if (result.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-rejected",
          actorUserId: result.ctx.userId,
          targetUserId: result.ctx.userId,
          toInstanceId: result.ctx.instanceId,
          payload: {
            contentType: result.entry.content_type,
            contentRef: result.entry.content_ref,
            recordId: result.entry.compliance_record_id,
            role,
            reason,
          },
        });
      } catch (err) {
        console.error("[rejectEntryAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
      redirect(`/admin/${instanceSlug}/review-queue`);
    }
    return { ok: false, fieldErrors: {}, formError: "거부 처리에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof ReviewerEligibilityError) {
      return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
    }
    if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[rejectEntryAction] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "거부 처리 중 오류가 발생했습니다." };
  }
}

 succeeded in 691ms:
// @glitzy/web/(admin)/[instanceSlug]/review-queue/[entryId] — detail · approve/reject
// SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { ReviewEntryActionForm } from "@/components/forms/ReviewEntryActionForm";
import type { ApproverRole } from "@/lib/compliance/types";

type EntryRow = {
  id: string;
  content_type: string;
  content_ref: string;
  compliance_record_id: string;
  status: string;
  priority: string;
  required_roles: string[];
  sla_due_at: Date;
  page_risk_level: string;
  // record slots
  peer_reviewer_name: string | null;
  peer_reviewed_at: Date | null;
  physician_approver_name: string | null;
  physician_approved_at: Date | null;
  legal_counsel_name: string | null;
  legal_counsel_at: Date | null;
  auto_check_result: unknown;
};

type ContentPreview = { title: string | null; summary: string | null; body: string | null };

// CAMC-09 정정: content_type 별 read-only preview (table/column allowlist)
const PREVIEW_QUERIES: Record<string, { table: string; titleCol?: string; summaryCol?: string; bodyCol?: string }> = {
  Article: { table: "article", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  TreatmentPage: { table: "treatment_page", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  LegalDocument: { table: "legal_document", titleCol: "title", bodyCol: "body" },
  FAQ: { table: "faq", titleCol: "question", bodyCol: "answer" },
  Publication: { table: "publication", titleCol: "title", summaryCol: "summary" },
  MediaAppearance: { table: "media_appearance", titleCol: "title", summaryCol: "summary" },
};

export default async function ReviewEntryDetailPage({ params }: { params: { instanceSlug: string; entryId: string } }) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  let entry: EntryRow | null;
  let eligibleRoles: ApproverRole[] = [];
  let preview: ContentPreview | null = null;
  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<EntryRow[]>`
          SELECT e.id,
                 e.content_type::text AS content_type,
                 e.content_ref,
                 e.compliance_record_id,
                 e.status::text AS status,
                 e.priority::text AS priority,
                 e.required_roles::text[] AS required_roles,
                 e.sla_due_at,
                 cr.page_risk_level::text AS page_risk_level,
                 cr.auto_check_result,
                 cr.peer_reviewed_at,
                 cr.physician_approved_at,
                 cr.legal_counsel_at,
                 (SELECT display_name FROM admin_user WHERE id = cr.peer_reviewer) AS peer_reviewer_name,
                 (SELECT display_name FROM admin_user WHERE id = cr.physician_approver) AS physician_approver_name,
                 (SELECT display_name FROM admin_user WHERE id = cr.legal_counsel) AS legal_counsel_name
            FROM review_queue_entry e
            JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
           WHERE e.id = ${params.entryId}::uuid AND e.instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        const e = rows[0] ?? null;
        // 본인 가능 role 산정 — instance_membership.role 우선
        const roles: ApproverRole[] = [];
        if (ctx.role === "operator" || ctx.role === "super-admin") roles.push("operator");
        if (ctx.user.physician_reviewer_eligible) roles.push("medical");
        if (ctx.user.legal_reviewer_eligible) roles.push("legal");

        // CAMC-09 정정: content_type 별 preview 조회 (allowlist)
        let preview: ContentPreview | null = null;
        if (e) {
          const q = PREVIEW_QUERIES[e.content_type];
          if (q) {
            const titleSel = q.titleCol ?? "NULL";
            const summarySel = q.summaryCol ?? "NULL";
            const bodySel = q.bodyCol ?? "NULL";
            const previewRows = await tx.unsafe<{ title: string | null; summary: string | null; body: string | null }[]>(`
              SELECT ${titleSel} AS title, ${summarySel} AS summary, ${bodySel} AS body
                FROM ${q.table}
               WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${e.content_ref.replace(/'/g, "''")}'
               LIMIT 1
            `);
            preview = previewRows[0] ?? null;
          }
        }

        return { entry: e, eligibleRoles: roles, preview };
      },
    );
    entry = result.entry;
    eligibleRoles = result.eligibleRoles;
    preview = result.preview;
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }
  if (entry === null) notFound();

  // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
  const filledRoles = new Set<ApproverRole>();
  if (entry.peer_reviewed_at !== null) filledRoles.add("operator");
  if (entry.physician_approved_at !== null) filledRoles.add("medical");
  if (entry.legal_counsel_at !== null) filledRoles.add("legal");
  const required = new Set(entry.required_roles as ApproverRole[]);
  const actionableRoles = eligibleRoles.filter((r) => required.has(r) && !filledRoles.has(r));

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">검수 — {entry.content_type} · {entry.content_ref}</h1>
        <Link href={`/admin/${params.instanceSlug}/review-queue`} className="text-sm text-slate-600 hover:underline">← 큐 목록</Link>
      </header>

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <h2 className="mb-2 text-base font-medium">콘텐츠 메타</h2>
        <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
          <dt className="text-slate-500">유형</dt><dd>{entry.content_type}</dd>
          <dt className="text-slate-500">slug</dt><dd className="font-mono text-xs">{entry.content_ref}</dd>
          <dt className="text-slate-500">위험도</dt><dd>{entry.page_risk_level}</dd>
          <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>
          <dt className="text-slate-500">우선순위</dt><dd>{entry.priority}</dd>
          <dt className="text-slate-500">SLA 마감</dt><dd className="text-xs">{new Date(entry.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}</dd>
          <dt className="text-slate-500">상태</dt><dd>{entry.status}</dd>
        </dl>
      </section>

      {preview ? (
        <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-2 text-base font-medium">콘텐츠 미리보기 (read-only)</h2>
          {preview.title && (
            <h3 className="mb-2 text-base font-semibold text-fg-default">{preview.title}</h3>
          )}
          {preview.summary && (
            <p className="mb-3 text-sm text-fg-muted">{preview.summary}</p>
          )}
          {preview.body && (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-100 bg-slate-50 p-3 text-xs text-fg-default">{preview.body}</pre>
          )}
        </section>
      ) : null}

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <h2 className="mb-2 text-base font-medium">검수 슬롯</h2>
        <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
          <dt className="text-slate-500">operator (peer)</dt>
          <dd>{entry.peer_reviewer_name ? `${entry.peer_reviewer_name} · ${entry.peer_reviewed_at ? new Date(entry.peer_reviewed_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
          <dt className="text-slate-500">medical</dt>
          <dd>{entry.physician_approver_name ? `${entry.physician_approver_name} · ${entry.physician_approved_at ? new Date(entry.physician_approved_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
          <dt className="text-slate-500">legal</dt>
          <dd>{entry.legal_counsel_name ? `${entry.legal_counsel_name} · ${entry.legal_counsel_at ? new Date(entry.legal_counsel_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
        </dl>
      </section>

      {actionableRoles.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">
          본인이 수행 가능한 검수 역할이 없습니다.
        </div>
      ) : (
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-base font-medium">검수 액션</h2>
          <p className="mb-3 text-xs text-slate-500">본인 가능 역할: {actionableRoles.join(", ")}</p>
          {actionableRoles.map((role) => (
            <ReviewEntryActionForm
              key={role}
              instanceSlug={params.instanceSlug}
              entryId={params.entryId}
              role={role}
            />
          ))}
        </section>
      )}
    </main>
  );
}

2026-05-18T09:26:10.501611Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:status.*FormData|formData.get\(\)
    ^
error: unclosed group

 exited 1 in 630ms:
rg: regex parse error:
    (?:status.*FormData|formData.get\(\)
    ^
error: unclosed group

 succeeded in 655ms:
// @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
// REVIEW_WORKFLOW § 4.1 SoT.

import type { ApproverRole, ContentType, RiskLevel } from "./types";
import { ComplianceConfigError } from "./types";

const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);

/**
 * unknown role fail closed (CAM-16 + CAM2-04 정정):
 *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
 *   server action 안 try/catch 로 form-level error 변환.
 */
export function calculateFinalRoles(
  contentType: ContentType,
  pageRiskLevel: RiskLevel,
  priorReviewRequired: boolean = false,
  requiredApproverRoles: readonly string[] = [],
): ApproverRole[] {
  for (const r of requiredApproverRoles) {
    if (r === "client") {
      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
    }
    if (!KNOWN_ROLES.has(r)) {
      throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
    }
  }
  const roles = new Set<ApproverRole>(["operator"]);
  if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  if (contentType === "LegalDocument") roles.add("legal");
  if (priorReviewRequired) roles.add("legal");
  for (const r of requiredApproverRoles) {
    roles.add(r as ApproverRole);
  }
  return Array.from(roles).sort();
}

export type ComplianceRecordRow = {
  peer_reviewer: string | null;
  peer_reviewed_at: Date | null;
  physician_approver: string | null;
  physician_approved_at: Date | null;
  legal_counsel: string | null;
  legal_counsel_at: Date | null;
  page_risk_level: RiskLevel;
  prior_review_required: boolean;
  prior_review_passed: boolean | null;
  auto_check_result: unknown;
};

export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
  if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
  if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
  if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
  return false;
}

codex
cycle 1 패치 대부분은 코드상 반영되어 있습니다. 다만 검토 중 `rejectContent` 쪽이 approve와 다르게 required role 검증을 공유하지 않는 점이 보여서, 이것이 cycle 1 CAMC-03의 잔여 실패인지 확인하고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"function save|export async function save|formData\\.get\\('status'|formData\\.get\\(\\\"status\\\"|status =|status:\" apps/web/src/app apps/web/src/lib apps/web/src/components/forms -S" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -Path apps/web/src/lib/compliance/server-actions.ts | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -Path apps/web/src/lib/compliance/entity-actions.ts | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -Path packages/core-content/migrations/C0016_status_unlock.sql | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
2026-05-18T09:26:20.557106Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: regex parse error:
    (?:function save|export async function save|formData\.get\('status'|formData\.get\(\)
    ^
error: unclosed group

 exited 1 in 680ms:
rg: regex parse error:
    (?:function save|export async function save|formData\.get\('status'|formData\.get\(\)
    ^
error: unclosed group

 succeeded in 731ms:
   1: // @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
   2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
   3: // 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.
   4: 
   5: import type { ScopedTx } from "@glitzy/db";
   6: import type { TenantContext } from "@glitzy/auth";
   7: 
   8: import type {
   9:   ApproverRole,
  10:   ComplianceCheckEnvelope,
  11:   ContentType,
  12:   SubmitContentType,
  13: } from "./types";
  14: import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
  15: import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
  16: import { check, buildLegalDocumentExemptEnvelope } from "./check";
  17: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
  18: import { evaluatePublishable } from "./publishable-check";
  19: import { assertReviewerEligibility } from "./eligibility";
  20: 
  21: const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };
  22: 
  23: /**
  24:  * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
  25:  *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
  26:  */
  27: async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
  28:   await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
  29: }
  30: 
  31: function isAllowedSubmitType(t: string): t is SubmitContentType {
  32:   return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
  33: }
  34: 
  35: export type SubmitForReviewArgs = {
  36:   contentType: SubmitContentType;
  37:   contentRef: string;
  38:   contentRow: { status: string; risk_level?: string | null; body?: string };
  39: };
  40: 
  41: export type SubmitForReviewResult = {
  42:   recordId: string;
  43:   entryId: string;
  44:   finalRoles: ApproverRole[];   // CAMC-07/10
  45:   pageRiskLevel: "Low" | "Medium" | "High";
  46: };
  47: 
  48: /**
  49:  * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
  50:  */
  51: export async function submitForReview(
  52:   tx: ScopedTx,
  53:   ctx: TenantContext,
  54:   args: SubmitForReviewArgs,
  55: ): Promise<SubmitForReviewResult> {
  56:   if (!isAllowedSubmitType(args.contentType)) {
  57:     throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
  58:   }
  59:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
  60: 
  61:   const checkInput = {
  62:     contentType: args.contentType,
  63:     contentRef: args.contentRef,
  64:     body: args.contentRow.body ?? "",
  65:     metadata: {
  66:       explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
  67:     },
  68:   };
  69:   const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
  70:     ? buildLegalDocumentExemptEnvelope(checkInput)
  71:     : await check(checkInput);
  72: 
  73:   const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
  74:   const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
  75: 
  76:   // ComplianceRecord INSERT (pre-publish)
  77:   const slaHours = SLA_DUE_HOURS.P0;
  78:   const recordRows = await tx<{ id: string }[]>`
  79:     INSERT INTO compliance_record (
  80:       instance_id, content_type, content_ref, page_risk_level, auto_check_result,
  81:       record_phase, record_version, metadata
  82:     ) VALUES (
  83:       ${ctx.instanceId}::uuid,
  84:       ${args.contentType}::compliance_content_type,
  85:       ${args.contentRef},
  86:       ${envelope.meta.pageRiskLevel}::risk_level,
  87:       ${JSON.stringify(envelope.result)}::jsonb,
  88:       'pre-publish'::compliance_record_phase,
  89:       1,
  90:       ${JSON.stringify({
  91:         manualReview: envelope.meta.manualReview,
  92:         catalogVersion: envelope.meta.catalogVersion,
  93:         catalogHash: envelope.meta.catalogHash,
  94:         ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
  95:       })}::jsonb
  96:     )
  97:     RETURNING id
  98:   `;
  99:   const recordId = recordRows[0]!.id;
 100: 
 101:   // ReviewQueueEntry INSERT (open)
 102:   const entryRows = await tx<{ id: string }[]>`
 103:     INSERT INTO review_queue_entry (
 104:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
 105:       status, priority, required_roles, sla_due_at
 106:     ) VALUES (
 107:       ${ctx.instanceId}::uuid,
 108:       'manual-review'::review_queue_type,
 109:       ${args.contentType}::compliance_content_type,
 110:       ${args.contentRef},
 111:       ${recordId}::uuid,
 112:       'open'::review_queue_status,
 113:       'P0'::review_queue_priority,
 114:       ${finalRoles}::approver_role[],
 115:       ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
 116:     )
 117:     RETURNING id
 118:   `;
 119:   const entryId = entryRows[0]!.id;
 120: 
 121:   return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
 122: }
 123: 
 124: export type ApproveContentArgs = {
 125:   recordId: string;
 126:   role: ApproverRole;
 127:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
 128:   contentRef: string;
 129: };
 130: 
 131: export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };
 132: 
 133: /**
 134:  * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
 135:  * AND 게이트 충족 시 in-review → approved 자동 전이.
 136:  */
 137: export async function approveContent(
 138:   tx: ScopedTx,
 139:   ctx: TenantContext,
 140:   args: ApproveContentArgs,
 141: ): Promise<ApproveContentResult> {
 142:   assertReviewerEligibility(ctx, args.role);
 143:   await acquireRecordLock(tx, args.recordId);
 144: 
 145:   // entry + record FOR UPDATE
 146:   // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
 147:   const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[] }[]>`
 148:     SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles
 149:       FROM review_queue_entry
 150:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
 151:        AND status IN ('open', 'in-progress')
 152:      FOR UPDATE
 153:   `;
 154:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
 155:   const entry = entryRows[0]!;
 156:   if (!entry.required_roles.includes(args.role)) {
 157:     throw new ComplianceTransitionError(
 158:       `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
 159:     );
 160:   }
 161: 
 162:   const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string }[]>`
 163:     SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
 164:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
 165:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
 166:            auto_check_result
 167:       FROM compliance_record
 168:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
 169:      FOR UPDATE
 170:   `;
 171:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
 172:   const record = recordRows[0]! as ComplianceRecordRow & { id: string; content_type: string };
 173: 
 174:   // 중복 approve idempotent
 175:   if (isRoleSatisfied(record, args.role)) {
 176:     return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
 177:   }
 178: 
 179:   // 슬롯 채움 + entity 전이
 180:   const now = new Date();
 181:   if (args.role === "operator") {
 182:     await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
 183:     record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
 184:   } else if (args.role === "medical") {
 185:     await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
 186:     record.physician_approver = ctx.userId; record.physician_approved_at = now;
 187:   } else if (args.role === "legal") {
 188:     await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
 189:     record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
 190:   }
 191: 
 192:   // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
 193:   if (entry.status === "open") {
 194:     await tx`
 195:       UPDATE review_queue_entry
 196:          SET status = 'in-progress'::review_queue_status,
 197:              assigned_to = ${ctx.userId}::uuid,
 198:              assigned_at = ${now.toISOString()}::timestamptz,
 199:              updated_at = now()
 200:        WHERE id = ${entry.id}::uuid
 201:     `;
 202:   }
 203: 
 204:   // entity status 전이 review-queued → in-review (첫 approve)
 205:   await tx.unsafe(`
 206:     UPDATE ${args.contentTable}
 207:        SET status = CASE
 208:          WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
 209:          ELSE status
 210:        END,
 211:        updated_at = now()
 212:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 213:   `);
 214: 
 215:   // AND 게이트 평가
 216:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
 217:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
 218:   const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
 219: 
 220:   let entryStatus: "in-progress" | "resolved" = "in-progress";
 221:   if (allApproved) {
 222:     // entity in-review → approved → publishable (publishable evaluator pass 시)
 223:     const publishable = evaluatePublishable(record, record.content_type as ContentType);
 224:     const targetStatus = publishable.publishable ? "publishable" : "approved";
 225:     await tx.unsafe(`
 226:       UPDATE ${args.contentTable}
 227:          SET status = '${targetStatus}'::content_publication_status,
 228:              updated_at = now()
 229:        WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 230:     `);
 231:     // entry resolved
 232:     await tx`
 233:       UPDATE review_queue_entry
 234:          SET status = 'resolved'::review_queue_status,
 235:              resolved_at = ${now.toISOString()}::timestamptz,
 236:              resolved_by = ${ctx.userId}::uuid,
 237:              resolution_type = 'approved',
 238:              updated_at = now()
 239:        WHERE id = ${entry.id}::uuid
 240:     `;
 241:     entryStatus = "resolved";
 242:   }
 243: 
 244:   return { allApproved, entryStatus };
 245: }
 246: 
 247: function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
 248:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
 249:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
 250:   return finalRoles.every((r) => isRoleSatisfied(record, r));
 251: }
 252: 
 253: export type RejectContentArgs = {
 254:   recordId: string;
 255:   reason: string;
 256:   role: ApproverRole;
 257:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
 258:   contentRef: string;
 259: };
 260: 
 261: /**
 262:  * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
 263:  */
 264: export async function rejectContent(
 265:   tx: ScopedTx,
 266:   ctx: TenantContext,
 267:   args: RejectContentArgs,
 268: ): Promise<void> {
 269:   assertReviewerEligibility(ctx, args.role);
 270:   if (args.reason.trim().length < 50) {
 271:     throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
 272:   }
 273:   await acquireRecordLock(tx, args.recordId);
 274: 
 275:   const entryRows = await tx<{ id: string }[]>`
 276:     SELECT id FROM review_queue_entry
 277:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
 278:        AND status IN ('open', 'in-progress')
 279:      FOR UPDATE
 280:   `;
 281:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
 282: 
 283:   const now = new Date();
 284:   await tx`
 285:     UPDATE review_queue_entry
 286:        SET status = 'resolved'::review_queue_status,
 287:            resolved_at = ${now.toISOString()}::timestamptz,
 288:            resolved_by = ${ctx.userId}::uuid,
 289:            resolution_type = 'rejected',
 290:            metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
 291:            updated_at = now()
 292:      WHERE id = ${entryRows[0]!.id}::uuid
 293:   `;
 294:   await tx.unsafe(`
 295:     UPDATE ${args.contentTable}
 296:        SET status = 'rejected'::content_publication_status,
 297:            updated_at = now()
 298:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 299:   `);
 300: }
 301: 
 302: export type PublishContentArgs = {
 303:   contentType: SubmitContentType;
 304:   contentRef: string;
 305:   recordId: string;
 306:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
 307: };
 308: 
 309: export type PublishContentResult = { recordVersion: number };
 310: 
 311: /**
 312:  * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
 313:  *   entity.status → published + published_at 채움.
 314:  *   publishable evaluator 통과 검증.
 315:  */
 316: export async function publishContent(
 317:   tx: ScopedTx,
 318:   ctx: TenantContext,
 319:   args: PublishContentArgs,
 320: ): Promise<PublishContentResult> {
 321:   assertReviewerEligibility(ctx, "operator");
 322:   await acquireRecordLock(tx, args.recordId);
 323: 
 324:   // record FOR UPDATE
 325:   const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; record_phase: string; record_version: number })[]>`
 326:     SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
 327:            record_phase::text AS record_phase, record_version,
 328:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
 329:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
 330:            auto_check_result
 331:       FROM compliance_record
 332:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
 333:      FOR UPDATE
 334:   `;
 335:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
 336:   const record = recordRows[0]!;
 337:   if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
 338: 
 339:   const publishable = evaluatePublishable(record, args.contentType);
 340:   if (!publishable.publishable) {
 341:     throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
 342:   }
 343: 
 344:   // CAMC-06 정정: entity 현 status='publishable' assert
 345:   const entityStatusRows = await tx.unsafe<{ status: string }[]>(`
 346:     SELECT status::text AS status FROM ${args.contentTable}
 347:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 348:      FOR UPDATE
 349:   `);
 350:   if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
 351:   assertTransitionAllowed(entityStatusRows[0]!.status as ContentWorkflowState, "published");
 352: 
 353:   const now = new Date();
 354:   // (1) compliance_record record_phase 전환 (record ID 보존)
 355:   await tx`
 356:     UPDATE compliance_record
 357:        SET record_phase = 'published'::compliance_record_phase,
 358:            published_at = ${now.toISOString()}::timestamptz,
 359:            published_by = ${ctx.userId}::uuid,
 360:            updated_at = now()
 361:      WHERE id = ${args.recordId}::uuid
 362:   `;
 363:   // (2) entity status → published + published_at + compliance_record_id 채움.
 364:   //   CAMC-05 정정: row count 검증 — current status='publishable' AND_clause.
 365:   const updated = await tx.unsafe<{ id: string }[]>(`
 366:     UPDATE ${args.contentTable}
 367:        SET status = 'published'::content_publication_status,
 368:            published_at = '${now.toISOString()}'::timestamptz,
 369:            compliance_record_id = '${args.recordId}',
 370:            updated_at = now()
 371:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 372:        AND status = 'publishable'::content_publication_status
 373:      RETURNING id
 374:   `);
 375:   if (updated.length !== 1) {
 376:     throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);
 377:   }
 378:   return { recordVersion: record.record_version };
 379: }

 succeeded in 705ms:
   1: // @glitzy/web/lib/compliance/entity-actions — entity별 server action thin wrapper
   2: // COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — submitForReview · publishContent.
   3: // 모든 6 entity edit page 가 사용.
   4: 
   5: "use server";
   6: 
   7: import { revalidatePath } from "next/cache";
   8: import { notFound, redirect } from "next/navigation";
   9: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
  10: 
  11: import { getSqlBase } from "@/lib/db";
  12: import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
  13: import { withSkeletonTx } from "@/lib/tenant";
  14: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
  15: import { submitForReview, publishContent } from "./server-actions";
  16: import {
  17:   ComplianceConfigError,
  18:   ComplianceTransitionError,
  19:   ReviewerEligibilityError,
  20:   type SubmitContentType,
  21: } from "./types";
  22: import type { SaveResult } from "@/lib/save-result";
  23: 
  24: const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  25:   Article: "article",
  26:   TreatmentPage: "treatment_page",
  27:   LegalDocument: "legal_document",
  28:   FAQ: "faq",
  29:   Publication: "publication",
  30:   MediaAppearance: "media_appearance",
  31: };
  32: 
  33: const ENTITY_ROUTES: Record<SubmitContentType, string> = {
  34:   Article: "articles",
  35:   TreatmentPage: "treatments",
  36:   LegalDocument: "legal-documents",
  37:   FAQ: "faqs",
  38:   Publication: "publications",
  39:   MediaAppearance: "media-appearances",
  40: };
  41: 
  42: export async function submitForReviewAction(
  43:   instanceSlug: string,
  44:   contentType: SubmitContentType,
  45:   contentRef: string,
  46:   _prev: SaveResult | null,
  47:   _formData: FormData,
  48: ): Promise<SaveResult> {
  49:   const aCtx = await resolveActionContext(instanceSlug);
  50:   const sqlBase = getSqlBase();
  51:   try {
  52:     const result = await withSkeletonTx(
  53:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  54:       async (tx, ctx) => {
  55:         const table = ENTITY_TABLES[contentType];
  56:         // CAMC-04 정정: FOR UPDATE 로 잠금 + draft/rejected status assert.
  57:         const rows = await tx.unsafe<{ status: string; risk_level: string | null }[]>(`
  58:           SELECT status::text AS status,
  59:                  ${contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance" ? "NULL::text" : "risk_level::text"} AS risk_level
  60:             FROM ${table}
  61:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
  62:            FOR UPDATE
  63:         `);
  64:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
  65:         const out = await submitForReview(tx, ctx, {
  66:           contentType,
  67:           contentRef,
  68:           contentRow: { status: rows[0]!.status, risk_level: rows[0]!.risk_level },
  69:         });
  70:         // entity status draft → review-queued
  71:         await tx.unsafe(`
  72:           UPDATE ${table}
  73:              SET status = 'review-queued'::content_publication_status, updated_at = now()
  74:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
  75:         `);
  76:         return { ok: true as const, ctx, out };
  77:       },
  78:     );
  79: 
  80:     if (result.ok === false && result.action === "notfound") notFound();
  81:     if (result.ok === true) {
  82:       try {
  83:         await emitAuditEvent(sqlBase, {
  84:           eventType: "content-submitted-for-review",
  85:           actorUserId: result.ctx.userId,
  86:           targetUserId: result.ctx.userId,
  87:           toInstanceId: result.ctx.instanceId,
  88:           // CAMC-07/10 정정: finalRoles · pageRiskLevel 포함
  89:           payload: {
  90:             contentType,
  91:             contentRef,
  92:             recordId: result.out.recordId,
  93:             entryId: result.out.entryId,
  94:             finalRoles: result.out.finalRoles,
  95:             pageRiskLevel: result.out.pageRiskLevel,
  96:           },
  97:         });
  98:       } catch (err) {
  99:         console.error("[submitForReviewAction] audit emit failed", err);
 100:       }
 101:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
 102:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
 103:       revalidatePath(`/admin/${instanceSlug}`);
 104:       return { ok: true, slug: contentRef };
 105:     }
 106:     return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
 107:   } catch (err) {
 108:     if (isNextControlFlowError(err)) throw err;
 109:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
 110:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
 111:       return { ok: false, fieldErrors: {}, formError: err.message };
 112:     }
 113:     if (err instanceof TenantResolveError) {
 114:       const action = mapAuthDenyReasonToUi(err.reason);
 115:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 116:       if (action.kind === "not-found") notFound();
 117:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 118:     }
 119:     console.error("[submitForReviewAction] unexpected", err);
 120:     return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
 121:   }
 122: }
 123: 
 124: export async function publishContentAction(
 125:   instanceSlug: string,
 126:   contentType: SubmitContentType,
 127:   contentRef: string,
 128:   _prev: SaveResult | null,
 129:   _formData: FormData,
 130: ): Promise<SaveResult> {
 131:   const aCtx = await resolveActionContext(instanceSlug);
 132:   const sqlBase = getSqlBase();
 133:   try {
 134:     const result = await withSkeletonTx(
 135:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 136:       async (tx, ctx) => {
 137:         const table = ENTITY_TABLES[contentType];
 138:         // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
 139:         //   현재 row status 만 FOR UPDATE 잠금 + 검증 후 latest pre-publish record 사용.
 140:         const rows = await tx.unsafe<{ status: string }[]>(`
 141:           SELECT status::text AS status FROM ${table}
 142:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
 143:            FOR UPDATE
 144:         `);
 145:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
 146:         const row = rows[0]!;
 147:         if (row.status !== "publishable") {
 148:           return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
 149:         }
 150:         // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
 151:         const recRows = await tx<{ id: string; record_version: number }[]>`
 152:           SELECT id, record_version FROM compliance_record
 153:            WHERE instance_id = ${ctx.instanceId}::uuid
 154:              AND content_type = ${contentType}::compliance_content_type
 155:              AND content_ref = ${contentRef}
 156:              AND record_phase = 'pre-publish'::compliance_record_phase
 157:            ORDER BY record_version DESC
 158:            LIMIT 1
 159:         `;
 160:         if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
 161:         await publishContent(tx, ctx, {
 162:           contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
 163:         });
 164:         return { ok: true as const, ctx, recordId: recRows[0]!.id, recordVersion: recRows[0]!.record_version };
 165:       },
 166:     );
 167: 
 168:     if (result.ok === false && result.action === "notfound") notFound();
 169:     if (result.ok === false && result.action === "no-record") {
 170:       return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
 171:     }
 172:     if (result.ok === false && result.action === "not-publishable") {
 173:       return { ok: false, fieldErrors: {}, formError: result.message };
 174:     }
 175:     if (result.ok === true) {
 176:       try {
 177:         await emitAuditEvent(sqlBase, {
 178:           eventType: "content-published",
 179:           actorUserId: result.ctx.userId,
 180:           targetUserId: result.ctx.userId,
 181:           toInstanceId: result.ctx.instanceId,
 182:           // CAMC-11 정정: recordVersion 포함
 183:           payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
 184:         });
 185:       } catch (err) {
 186:         console.error("[publishContentAction] audit emit failed", err);
 187:       }
 188:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
 189:       revalidatePath(`/admin/${instanceSlug}`);
 190:       return { ok: true, slug: contentRef };
 191:     }
 192:     return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
 193:   } catch (err) {
 194:     if (isNextControlFlowError(err)) throw err;
 195:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
 196:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
 197:       return { ok: false, fieldErrors: {}, formError: err.message };
 198:     }
 199:     if (err instanceof TenantResolveError) {
 200:       const action = mapAuthDenyReasonToUi(err.reason);
 201:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 202:       if (action.kind === "not-found") notFound();
 203:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 204:     }
 205:     console.error("[publishContentAction] unexpected", err);
 206:     return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
 207:   }
 208: }

 succeeded in 698ms:
   1: -- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
   2: -- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
   3: -- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
   4: -- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.
   5: 
   6: -- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
   7: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
   8: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
   9: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
  10: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
  11: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;
  12: 
  13: -- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
  14: ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
  15: ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
  16: ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
  17: 
  18: -- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
  19: DO $$ BEGIN
  20:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
  21:     ALTER TABLE article ADD CONSTRAINT article_compliance_fk
  22:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  23:   END IF;
  24:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
  25:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  26:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  27:   END IF;
  28:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
  29:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  30:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  31:   END IF;
  32:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
  33:     ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  34:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  35:   END IF;
  36:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
  37:     ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  38:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  39:   END IF;
  40:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
  41:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  42:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  43:   END IF;
  44: END $$;
  45: 
  46: -- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
  47: --   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
  48: --   기존 published row 사전 마이그레이션 회피용.
  49: 
  50: -- Article
  51: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  52:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  53:   record_phase, record_version, metadata)
  54: SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  55:   COALESCE(a.risk_level, 'Low')::risk_level,
  56:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  57:   '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  58:   a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  59:   'published'::compliance_record_phase, 1,
  60:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
  61: FROM article a
  62: WHERE a.status = 'published' AND a.compliance_record_id IS NULL
  63:   AND NOT EXISTS (
  64:     SELECT 1 FROM compliance_record cr
  65:     WHERE cr.instance_id = a.instance_id
  66:       AND cr.content_type = 'Article'::compliance_content_type
  67:       AND cr.content_ref = a.slug
  68:       AND cr.metadata @> '{"sentinel":true}'::jsonb
  69:   );
  70: 
  71: UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
  72: WHERE a.instance_id = cr.instance_id
  73:   AND cr.content_type = 'Article'::compliance_content_type
  74:   AND cr.content_ref = a.slug
  75:   AND cr.metadata @> '{"sentinel":true}'::jsonb
  76:   AND a.status = 'published' AND a.compliance_record_id IS NULL;
  77: 
  78: -- TreatmentPage
  79: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  80:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  81:   record_phase, record_version, metadata)
  82: SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  83:   COALESCE(t.risk_level, 'Low')::risk_level,
  84:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  85:   '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  86:   t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  87:   'published'::compliance_record_phase, 1,
  88:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
  89: FROM treatment_page t
  90: WHERE t.status = 'published' AND t.compliance_record_id IS NULL
  91:   AND NOT EXISTS (
  92:     SELECT 1 FROM compliance_record cr
  93:     WHERE cr.instance_id = t.instance_id
  94:       AND cr.content_type = 'TreatmentPage'::compliance_content_type
  95:       AND cr.content_ref = t.slug
  96:       AND cr.metadata @> '{"sentinel":true}'::jsonb
  97:   );
  98: 
  99: UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
 100: WHERE t.instance_id = cr.instance_id
 101:   AND cr.content_type = 'TreatmentPage'::compliance_content_type
 102:   AND cr.content_ref = t.slug
 103:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 104:   AND t.status = 'published' AND t.compliance_record_id IS NULL;
 105: 
 106: -- LegalDocument — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상. 안전 backfill 추가 (CAMC-02 정정).
 107: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 108:   auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
 109:   published_at, published_by, record_phase, record_version, metadata)
 110: SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
 111:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 112:   '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
 113:   '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
 114:   l.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 115:   'published'::compliance_record_phase, 1,
 116:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
 117: FROM legal_document l
 118: WHERE l.status = 'published' AND l.compliance_record_id IS NULL
 119:   AND NOT EXISTS (
 120:     SELECT 1 FROM compliance_record cr
 121:     WHERE cr.instance_id = l.instance_id
 122:       AND cr.content_type = 'LegalDocument'::compliance_content_type
 123:       AND cr.content_ref = l.slug
 124:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 125:   );
 126: 
 127: UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
 128: WHERE l.instance_id = cr.instance_id
 129:   AND cr.content_type = 'LegalDocument'::compliance_content_type
 130:   AND cr.content_ref = l.slug
 131:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 132:   AND l.status = 'published' AND l.compliance_record_id IS NULL;
 133: 
 134: -- FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상.
 135: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 136:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
 137:   record_phase, record_version, metadata)
 138: SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, COALESCE(f.risk_level, 'Low')::risk_level,
 139:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 140:   '00000000-0000-4000-8000-000000000001'::uuid, f.published_at,
 141:   f.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 142:   'published'::compliance_record_phase, 1,
 143:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
 144: FROM faq f
 145: WHERE f.status = 'published' AND f.compliance_record_id IS NULL
 146:   AND NOT EXISTS (
 147:     SELECT 1 FROM compliance_record cr
 148:     WHERE cr.instance_id = f.instance_id
 149:       AND cr.content_type = 'FAQ'::compliance_content_type
 150:       AND cr.content_ref = f.slug
 151:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 152:   );
 153: 
 154: UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
 155: WHERE f.instance_id = cr.instance_id
 156:   AND cr.content_type = 'FAQ'::compliance_content_type
 157:   AND cr.content_ref = f.slug
 158:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 159:   AND f.status = 'published' AND f.compliance_record_id IS NULL;
 160: 
 161: -- Publication · MediaAppearance — risk_level 'Low' fixed
 162: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 163:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
 164:   record_phase, record_version, metadata)
 165: SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
 166:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 167:   '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
 168:   p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 169:   'published'::compliance_record_phase, 1,
 170:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
 171: FROM publication p
 172: WHERE p.status = 'published' AND p.compliance_record_id IS NULL
 173:   AND NOT EXISTS (
 174:     SELECT 1 FROM compliance_record cr
 175:     WHERE cr.instance_id = p.instance_id
 176:       AND cr.content_type = 'Publication'::compliance_content_type
 177:       AND cr.content_ref = p.slug
 178:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 179:   );
 180: 
 181: UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
 182: WHERE p.instance_id = cr.instance_id
 183:   AND cr.content_type = 'Publication'::compliance_content_type
 184:   AND cr.content_ref = p.slug
 185:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 186:   AND p.status = 'published' AND p.compliance_record_id IS NULL;
 187: 
 188: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 189:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
 190:   record_phase, record_version, metadata)
 191: SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
 192:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 193:   '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
 194:   m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 195:   'published'::compliance_record_phase, 1,
 196:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
 197: FROM media_appearance m
 198: WHERE m.status = 'published' AND m.compliance_record_id IS NULL
 199:   AND NOT EXISTS (
 200:     SELECT 1 FROM compliance_record cr
 201:     WHERE cr.instance_id = m.instance_id
 202:       AND cr.content_type = 'MediaAppearance'::compliance_content_type
 203:       AND cr.content_ref = m.slug
 204:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 205:   );
 206: 
 207: UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
 208: WHERE m.instance_id = cr.instance_id
 209:   AND cr.content_type = 'MediaAppearance'::compliance_content_type
 210:   AND cr.content_ref = m.slug
 211:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 212:   AND m.status = 'published' AND m.compliance_record_id IS NULL;
 213: 
 214: -- (Step 5) NULL 잔존 검증 — 6 entity
 215: DO $$
 216: DECLARE null_count INTEGER;
 217: BEGIN
 218:   SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
 219:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
 220:   SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
 221:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
 222:   SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
 223:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
 224:   SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
 225:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
 226:   SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
 227:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
 228:   SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
 229:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
 230: END $$;
 231: 
 232: -- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
 233: DO $$ BEGIN
 234:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
 235:     ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 236:     ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
 237:   END IF;
 238:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
 239:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 240:     ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
 241:   END IF;
 242:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
 243:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 244:     ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
 245:   END IF;
 246:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
 247:     ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 248:     ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
 249:   END IF;
 250:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
 251:     ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 252:     ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
 253:   END IF;
 254:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
 255:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 256:     ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
 257:   END IF;
 258: END $$;
 259: 
 260: -- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
 261: --   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
 262: CREATE OR REPLACE FUNCTION published_content_compliance_guard()
 263: RETURNS TRIGGER LANGUAGE plpgsql AS $$
 264: DECLARE
 265:   record_row compliance_record%ROWTYPE;
 266:   expected_content_type compliance_content_type;
 267: BEGIN
 268:   IF NEW.status <> 'published' THEN RETURN NEW; END IF;
 269:   IF NEW.compliance_record_id IS NULL THEN
 270:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
 271:   END IF;
 272:   SELECT * INTO record_row FROM compliance_record
 273:    WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
 274:   IF NOT FOUND THEN
 275:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
 276:   END IF;
 277:   IF record_row.record_phase <> 'published' THEN
 278:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
 279:   END IF;
 280:   -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
 281:   expected_content_type := CASE TG_TABLE_NAME
 282:     WHEN 'article' THEN 'Article'
 283:     WHEN 'treatment_page' THEN 'TreatmentPage'
 284:     WHEN 'legal_document' THEN 'LegalDocument'
 285:     WHEN 'faq' THEN 'FAQ'
 286:     WHEN 'publication' THEN 'Publication'
 287:     WHEN 'media_appearance' THEN 'MediaAppearance'
 288:     ELSE NULL
 289:   END;
 290:   IF expected_content_type IS NULL THEN
 291:     RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
 292:   END IF;
 293:   IF record_row.content_type <> expected_content_type THEN
 294:     RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
 295:   END IF;
 296:   -- content_ref 일치 (slug)
 297:   IF record_row.content_ref <> NEW.slug THEN
 298:     RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
 299:   END IF;
 300:   RETURN NEW;
 301: END;
 302: $$;
 303: 
 304: DROP TRIGGER IF EXISTS article_published_guard ON article;
 305: CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
 306:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 307: DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
 308: CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
 309:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 310: DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
 311: CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
 312:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 313: DROP TRIGGER IF EXISTS faq_published_guard ON faq;
 314: CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
 315:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 316: DROP TRIGGER IF EXISTS publication_published_guard ON publication;
 317: CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
 318:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 319: DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
 320: CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
 321:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE (article|treatment_page|faq)|compliance_record_id" packages/core-content/migrations packages/core-content/src/schema.ts -S' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "export async function save|saveArticle|saveFaq|saveTreatment|saveLegal|savePublication|saveMedia|FormData" apps/web/src -S' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/types.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0014_compliance_record.sql; Get-Content -Path packages/core-content/migrations/C0015_review_queue_entry.sql' in C:\Users\assag\solution\website-exposure
 succeeded in 696ms:
packages/core-content/src/schema.ts:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
packages/core-content/src/schema.ts:196:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:231:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:290:    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages/core-content/src/schema.ts:291:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:305:    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
packages/core-content/src/schema.ts:391:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages/core-content/src/schema.ts:392:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:451:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages/core-content/src/schema.ts:452:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:506:    complianceRecordId: uuid("compliance_record_id"),
packages/core-content/src/schema.ts:517:    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
packages/core-content/src/schema.ts:606:    complianceRecordId: uuid("compliance_record_id").notNull(),
packages/core-content/migrations\C0005_article.sql:5:CREATE TABLE article (
packages/core-content/migrations\C0005_article.sql:14:  compliance_record_id UUID,
packages/core-content/migrations\C0004_treatment_page.sql:13:CREATE TABLE treatment_page (
packages/core-content/migrations\C0004_treatment_page.sql:22:  compliance_record_id UUID,
packages/core-content/migrations\C0009_article_category.sql:6:CREATE TABLE article_category (
packages/core-content/migrations\C0012_faq.sql:7:CREATE TABLE faq (
packages/core-content/migrations\C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
packages/core-content/migrations\C0015_review_queue_entry.sql:16:  compliance_record_id UUID NOT NULL,
packages/core-content/migrations\C0015_review_queue_entry.sql:36:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
packages/core-content/migrations\C0016_status_unlock.sql:1:-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
packages/core-content/migrations\C0016_status_unlock.sql:13:-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
packages/core-content/migrations\C0016_status_unlock.sql:14:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations\C0016_status_unlock.sql:15:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations\C0016_status_unlock.sql:16:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages/core-content/migrations\C0016_status_unlock.sql:22:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:26:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:30:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:34:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:38:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:42:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages/core-content/migrations\C0016_status_unlock.sql:62:WHERE a.status = 'published' AND a.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:71:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:76:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:90:WHERE t.status = 'published' AND t.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:99:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:104:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:118:WHERE l.status = 'published' AND l.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:127:UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:132:  AND l.status = 'published' AND l.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:145:WHERE f.status = 'published' AND f.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:154:UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:159:  AND f.status = 'published' AND f.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:172:WHERE p.status = 'published' AND p.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:181:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:186:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:198:WHERE m.status = 'published' AND m.compliance_record_id IS NULL
packages/core-content/migrations\C0016_status_unlock.sql:207:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
packages/core-content/migrations\C0016_status_unlock.sql:212:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:218:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:219:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:220:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:221:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:222:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:223:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:224:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:225:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:226:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:227:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:228:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
packages/core-content/migrations\C0016_status_unlock.sql:229:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
packages/core-content/migrations\C0016_status_unlock.sql:235:    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:239:    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:243:    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:247:    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:251:    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:255:    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages/core-content/migrations\C0016_status_unlock.sql:269:  IF NEW.compliance_record_id IS NULL THEN
packages/core-content/migrations\C0016_status_unlock.sql:270:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
packages/core-content/migrations\C0016_status_unlock.sql:273:   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
packages/core-content/migrations\C0016_status_unlock.sql:275:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;

 succeeded in 713ms:
apps/web/src\lib\clinic-profile-schema.ts:299:// === FormData parser helpers (cycle3 LL-39 flat key → nested object) ===
apps/web/src\lib\clinic-profile-schema.ts:303: * FormData 의 flat key `legalDocEffective_<documentType>` → Record<DocumentType, string|undefined>
apps/web/src\lib\clinic-profile-schema.ts:306:  formData: FormData,
apps/web/src\lib\clinic-profile-schema.ts:317: * extractBusinessHours — 7요일 dayInput FormData → BusinessHoursInput
apps/web/src\lib\clinic-profile-schema.ts:318: * FormData key: businessHours_<day>_<field> (예: businessHours_monday_open=09:30)
apps/web/src\lib\clinic-profile-schema.ts:320:export function extractBusinessHours(formData: FormData): unknown {
apps/web/src\lib\clinic-profile-schema.ts:336: * extractPrimaryCtas — 3종 type 별 입력 FormData → PrimaryCtaInput[]
apps/web/src\lib\clinic-profile-schema.ts:337: * FormData key: cta_<type>_label / cta_<type>_targetUrl (입력 없으면 제외)
apps/web/src\lib\clinic-profile-schema.ts:339:export function extractPrimaryCtas(formData: FormData): unknown {
apps/web/src\types\react-dom-stable.d.ts:20:    data: FormData | null;
apps/web/src\types\react-dom-stable.d.ts:22:    action: ((formData: FormData) => void | Promise<void>) | string | null;
apps/web/src\components\forms\ArticleForm.tsx:58:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\ArticleForm.tsx:64:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\lib\compliance\entity-actions.ts:47:  _formData: FormData,
apps/web/src\lib\compliance\entity-actions.ts:129:  _formData: FormData,
apps/web/src\components\forms\ArticleCategoryForm.tsx:30:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\ArticleCategoryForm.tsx:35:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\DeleteForm.tsx:18:  // FormData payload 무시 · 결과만 inline 에러 표시
apps/web/src\components\forms\DeleteForm.tsx:19:  const wrapped = async (_prev: DeleteResult | null, _form: FormData): Promise<DeleteResult> => action();
apps/web/src\components\forms\DeleteForm.tsx:20:  const [state, formAction] = useFormState<DeleteResult | null, FormData>(wrapped, null);
apps/web/src\components\forms\DoctorProfileForm.tsx:38:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\DoctorProfileForm.tsx:42:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\FaqForm.tsx:42:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\FaqForm.tsx:49:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\ClinicProfileForm.tsx:138:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\ClinicProfileForm.tsx:142:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\MediaAppearanceForm.tsx:52:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\MediaAppearanceForm.tsx:57:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\PublicationForm.tsx:48:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\PublicationForm.tsx:53:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\ReviewEntryActionForm.tsx:27:  const [approveState, approveAction] = useFormState<SaveResult | null, FormData>(boundApprove, null);
apps/web/src\components\forms\ReviewEntryActionForm.tsx:28:  const [rejectState, rejectAction] = useFormState<SaveResult | null, FormData>(boundReject, null);
apps/web/src\components\forms\TreatmentPageForm.tsx:52:  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
apps/web/src\components\forms\TreatmentPageForm.tsx:56:  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
apps/web/src\components\forms\WorkflowActionButtons.tsx:52:  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
apps/web/src\components\forms\WorkflowActionButtons.tsx:72:  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
apps/web/src\app\sign-in\actions.ts:19:export async function issueMagicLinkAction(formData: FormData): Promise<void> {
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:90:export async function saveArticle(
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:94:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:177:        //   saveArticle 은 본문 / metadata 만 갱신 — 현재 row status 보존.
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:240:        console.error("[saveArticle] audit emit failed", auditErr);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:269:    console.error("[saveArticle] unexpected", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:13:import { saveArticle } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:64:  const bound = saveArticle.bind(null, params.instanceSlug, null);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:13:import { deleteArticle, saveArticle } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:112:  const boundSave = saveArticle.bind(null, params.instanceSlug, params.slug);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:45:  // cycle5-3entity WEB-53: enum value mismatch (FormData 변조) 도 한국어 메시지
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:71:export async function saveTreatmentPage(
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:75:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:154:        console.error("[saveTreatmentPage] audit emit failed", auditErr);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:182:    console.error("[saveTreatmentPage] unexpected", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:71:export async function saveClinicProfile(
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:74:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:20:export async function saveFaq(
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:24:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:100:        console.error("[saveFaq] audit emit failed", auditErr);
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts:127:    console.error("[saveFaq] unexpected", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:19:export async function saveCategory(
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:23:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts:54:          //   Article saveArticle fallback (slug='general') · C0013 backfill · seed.ts ON CONFLICT 모두 'general' 문자열 의존.
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:19:export async function savePublication(
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:23:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:108:        console.error("[savePublication] audit emit failed", auditErr);
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\actions.ts:135:    console.error("[savePublication] unexpected", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:10:import { deleteFaq, saveFaq } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:104:  const boundSave = saveFaq.bind(null, params.instanceSlug, params.slug);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:12:import { deleteTreatmentPage, saveTreatmentPage } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:78:  const boundSave = saveTreatmentPage.bind(null, params.instanceSlug, params.slug);
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx:9:import { saveFaq } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx:69:  const bound = saveFaq.bind(null, params.instanceSlug, null);
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:38:  _formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:120:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\new\page.tsx:9:import { savePublication } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\new\page.tsx:51:  const bound = savePublication.bind(null, params.instanceSlug, null);
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:19:export async function saveMediaAppearance(
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:23:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:107:        console.error("[saveMediaAppearance] audit emit failed", auditErr);
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts:134:    console.error("[saveMediaAppearance] unexpected", err);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:82:export async function saveDoctorProfile(
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:86:  formData: FormData,
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx:10:import { deletePublication, savePublication } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx:101:  const boundSave = savePublication.bind(null, params.instanceSlug, params.slug);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx:8:import { saveTreatmentPage } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx:23:  const bound = saveTreatmentPage.bind(null, params.instanceSlug, null);
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\new\page.tsx:9:import { saveMediaAppearance } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\new\page.tsx:51:  const bound = saveMediaAppearance.bind(null, params.instanceSlug, null);
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx:10:import { deleteMediaAppearance, saveMediaAppearance } from "../actions";
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx:99:  const boundSave = saveMediaAppearance.bind(null, params.instanceSlug, params.slug);

 succeeded in 630ms:
// @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4.1
// SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result

export type RiskLevel = "Low" | "Medium" | "High";

export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

// 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
export const ALLOWED_SUBMIT_TYPES = [
  "Article", "TreatmentPage", "LegalDocument",
  "FAQ", "Publication", "MediaAppearance",
] as const;
export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];

export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";

// CONTENT_STANDARDS § 7.1 ComplianceCheckInput — M0 v0.1 subset
export type ComplianceCheckInput = {
  contentType: ContentType;
  contentRef: string;
  body: string;  // Markdown
  metadata: {
    pageTypeId?: string;
    articleType?: string;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;
  };
  riskRules?: unknown[];  // M0 stub — 미사용
};

// CONTENT_STANDARDS § 7.2 Finding shape
export type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만 (CAM2-01 정정)
export type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    fail: number;
    "content-gate": number;
    warning: number;
    info: number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};

// M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;
    catalogHash: string;
    manualReview: boolean;
    exemptReason?: string;
  };
};

// 에러 type — fail closed
export class ComplianceConfigError extends Error {
  override readonly name = "ComplianceConfigError";
}
export class ComplianceTransitionError extends Error {
  override readonly name = "ComplianceTransitionError";
}
export class ReviewerEligibilityError extends Error {
  override readonly name = "ReviewerEligibilityError";
}

 succeeded in 664ms:
-- @glitzy/core-content — C0014 ComplianceRecord (DATA_MODEL § 4 C-10·COMPLIANCE_ASSISTANT_M0_PLAN v1.0)
-- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조 (mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns)
-- Precondition: D0010 instance · C0005 risk_level enum

-- recordPhase enum — DATA_MODEL C-10 v0.8
CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');

-- DATA_MODEL C-10 v0.6 17종 풀 enum (CAM-10 정정 — M0 active 6종 만 submit · app layer ALLOWED_SUBMIT_TYPES)
CREATE TYPE compliance_content_type AS ENUM (
  'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
  'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
  'Feature', 'Publication', 'MediaAppearance'
);

CREATE TABLE compliance_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  page_risk_level risk_level NOT NULL,
  article_type TEXT,
  inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  auto_check_result JSONB NOT NULL,
  -- 슬롯 4종 (M0 active 3종 · client CA-DEFER-10)
  peer_reviewer UUID,
  peer_reviewed_at TIMESTAMPTZ,
  physician_approver UUID,
  physician_approved_at TIMESTAMPTZ,
  legal_counsel UUID,
  legal_counsel_at TIMESTAMPTZ,
  client_approver UUID,
  client_approved_at TIMESTAMPTZ,
  prior_review_required BOOLEAN NOT NULL DEFAULT false,
  prior_review_submission_id TEXT,
  prior_review_passed BOOLEAN,
  published_at TIMESTAMPTZ,
  published_by UUID,
  record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
  record_version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
  CONSTRAINT compliance_record_published_requires_at CHECK (
    record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
  ),
  CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
    record_phase <> 'published' OR content_type <> 'LegalDocument'
    OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_med_high_requires_physician CHECK (
    record_phase <> 'published' OR page_risk_level = 'Low'
    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_published_requires_peer CHECK (
    record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
  ),
  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';

ALTER TABLE compliance_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_record FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON compliance_record
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_record TO app_tenant_user;
-- @glitzy/core-content — C0015 ReviewQueueEntry (REVIEW_WORKFLOW § 3 · COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.2)
-- M0 v0.1: manual-review queue 1종 만. warning/stale 은 ADD VALUE cascade (CA-DEFER-05/06).
-- Precondition: D0010 instance · C0014 compliance_record + compliance_content_type enum

CREATE TYPE review_queue_type AS ENUM ('manual-review');
CREATE TYPE review_queue_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE review_queue_priority AS ENUM ('P0', 'P1', 'P2');
CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)

CREATE TABLE review_queue_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  queue_type review_queue_type NOT NULL,
  content_type compliance_content_type NOT NULL,
  content_ref TEXT NOT NULL,
  compliance_record_id UUID NOT NULL,
  status review_queue_status NOT NULL DEFAULT 'open',
  priority review_queue_priority NOT NULL DEFAULT 'P0',
  required_roles approver_role[] NOT NULL,
  assigned_to UUID,
  assigned_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_type TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
    status <> 'resolved' OR resolved_at IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
    status <> 'resolved' OR resolution_type IS NOT NULL
  ),
  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
    REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
);

CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
  WHERE status IN ('open', 'in-progress');
CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref)
  WHERE status IN ('open', 'in-progress');

ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON review_queue_entry
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;

codex
새 결함 후보가 두 개로 좁혀졌습니다. 하나는 `rejectContent`가 required role 검증을 빠뜨린 권한 문제이고, 다른 하나는 C0016 sentinel이 기존 Medium/High published Article/TreatmentPage에서 DB CHECK를 직접 위반할 수 있는 마이그레이션 문제입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/package.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path package.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -Path apps/web/src/lib/compliance/check.ts | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/[entryId]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 673ms:
{
  "name": "@glitzy/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "seed": "tsx --env-file=.env src/seed.ts",
    "test:scenarios": "vitest run"
  },
  "dependencies": {
    "@glitzy/auth": "workspace:*",
    "@glitzy/core-content": "workspace:*",
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "drizzle-orm": "^0.36.4",
    "next": "^14.2.0",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "cheerio": "^1.0.0",
    "ipaddr.js": "^2.2.0",
    "undici": "^6.21.0",
    "sanitize-html": "^2.13.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/sanitize-html": "^2.13.0",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.8",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}

 succeeded in 670ms:
{
  "name": "website-exposure",
  "version": "0.1.0",
  "private": true,
  "description": "Glitzy 의료기관 웹사이트 노출 솔루션 — monorepo root",
  "engines": {
    "node": ">=20.10.0",
    "pnpm": ">=10.0.0"
  },
  "scripts": {
    "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
    "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
    "web:dev": "pnpm --filter @glitzy/web dev",
    "web:build": "pnpm --filter @glitzy/web build",
    "web:seed": "pnpm --filter @glitzy/web seed",
    "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
    "build:all": "pnpm pkg:build && pnpm --filter @glitzy/web build",
    "spike-a": "pnpm --filter @glitzy/spike-a",
    "spike-a:up": "pnpm --filter @glitzy/spike-a up",
    "spike-a:down": "pnpm --filter @glitzy/spike-a down",
    "spike-a:migrate": "pnpm --filter @glitzy/spike-a migrate",
    "spike-a:seed": "pnpm --filter @glitzy/spike-a seed",
    "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
    "spike-b": "pnpm --filter @glitzy/spike-b",
    "spike-b:up": "pnpm --filter @glitzy/spike-b up",
    "spike-b:down": "pnpm --filter @glitzy/spike-b down",
    "spike-b:migrate": "pnpm --filter @glitzy/spike-b migrate",
    "spike-b:seed": "pnpm --filter @glitzy/spike-b seed",
    "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
    "spike-c": "pnpm --filter @glitzy/spike-c-local",
    "spike-c:up": "pnpm --filter @glitzy/spike-c-local up",
    "spike-c:down": "pnpm --filter @glitzy/spike-c-local down",
    "spike-c:seed": "pnpm --filter @glitzy/spike-c-local seed",
    "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
    "spike-d": "pnpm --filter @glitzy/spike-d",
    "spike-d:up": "pnpm --filter @glitzy/spike-d up",
    "spike-d:down": "pnpm --filter @glitzy/spike-d down",
    "spike-d:migrate": "pnpm --filter @glitzy/spike-d migrate:dev",
    "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
    "spike-e": "pnpm --filter @glitzy/spike-e",
    "spike-e:up": "pnpm --filter @glitzy/spike-e up",
    "spike-e:down": "pnpm --filter @glitzy/spike-e down",
    "spike-e:migrate": "pnpm --filter @glitzy/spike-e migrate",
    "spike-e:seed": "pnpm --filter @glitzy/spike-e seed",
    "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
  },
  "packageManager": "pnpm@10.28.2"
}

 succeeded in 680ms:
   1: // @glitzy/web/lib/compliance/check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4 (CAM-03·04·05·09 + CAM2-01·02)
   2: // check() M0 stub — manualReview only · ruleCatalog 미합류 (CA-DEFER-01·02·03·04).
   3: 
   4: import type {
   5:   ComplianceCheckInput,
   6:   ComplianceCheckResult,
   7:   ComplianceCheckEnvelope,
   8:   Finding,
   9: } from "./types";
  10: import { ComplianceConfigError } from "./types";
  11: import { maxRisk } from "./risk";
  12: 
  13: const CATALOG_VERSION = "m0-stub-v0.1";
  14: const CATALOG_HASH = "stub";
  15: 
  16: /**
  17:  * LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
  18:  *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
  19:  *   result 는 SoT 7 필드만 (automatedDecision='pass' · 모든 카운터 0).
  20:  *   exemptReason 은 meta 안.
  21:  */
  22: export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  23:   // CAMC-08 정정: maxRisk MAX 결합 (격하 금지)
  24:   const pageRiskLevel = maxRisk(
  25:     input.metadata.explicitRiskLevel ?? "Low",
  26:     input.metadata.inferredRiskLevel ?? "Low",
  27:     "Low",
  28:   );
  29:   return {
  30:     result: {
  31:       automatedDecision: "pass",
  32:       buildBlocked: false,
  33:       gateRequired: false,
  34:       hasWarnings: false,
  35:       findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
  36:       requiredApproverRoles: [],
  37:       findings: [],
  38:     },
  39:     meta: {
  40:       pageRiskLevel,
  41:       catalogVersion: CATALOG_VERSION,
  42:       catalogHash: CATALOG_HASH,
  43:       manualReview: false,
  44:       exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
  45:     },
  46:   };
  47: }
  48: 
  49: /**
  50:  * compliance-assistant Feature spec § 3.3 check() 단일 엔트리포인트 — M0 stub.
  51:  *
  52:  * **M0 v0.1 동작**:
  53:  * - LegalDocument 입력 시 throw — CONTENT_STANDARDS § 7.1.1.1 호출 자체 우회 (호출자가 buildLegalDocumentExemptEnvelope 사용)
  54:  * - pageRiskLevel = maxRisk(explicitRiskLevel ?? Low, inferredRiskLevel ?? Low, Low) — 격하 금지 (CAM-04)
  55:  * - High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true (CAM-05)
  56:  * - 그 외 입력 시 findings=[]·gateRequired=false·automatedDecision='pass'
  57:  * - ruleCatalog 미합류 — CA-DEFER-01·02 marker · LLM CA-DEFER-03 · 캐시 CA-DEFER-04
  58:  */
  59: export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  60:   if (input.contentType === "LegalDocument") {
  61:     throw new ComplianceConfigError(
  62:       "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
  63:       "Use buildLegalDocumentExemptEnvelope() instead.",
  64:     );
  65:   }
  66: 
  67:   const pageRiskLevel = maxRisk(
  68:     input.metadata.explicitRiskLevel ?? "Low",
  69:     input.metadata.inferredRiskLevel ?? "Low",
  70:     "Low",
  71:   );
  72: 
  73:   const findings: Finding[] = [];
  74:   let gateRequired = false;
  75:   let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  76: 
  77:   if (pageRiskLevel === "High") {
  78:     findings.push({
  79:       ruleId: "m0-stub-risk-level-high-gate",
  80:       category: "risk-level-virtual",
  81:       pattern: "",
  82:       severity: "content-gate",
  83:       location: { start: 0, end: 0 },
  84:       requiredApproverRoles: ["medical"],
  85:       triggeredBy: input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred",
  86:     });
  87:     gateRequired = true;
  88:     automatedDecision = "gate";
  89:   }
  90: 
  91:   return {
  92:     result: {
  93:       automatedDecision,
  94:       buildBlocked: false,
  95:       gateRequired,
  96:       hasWarnings: false,
  97:       findingsBySeverity: {
  98:         fail: 0,
  99:         "content-gate": gateRequired ? 1 : 0,
 100:         warning: 0,
 101:         info: 0,
 102:       },
 103:       requiredApproverRoles: gateRequired ? ["medical"] : [],
 104:       findings,
 105:     },
 106:     meta: { pageRiskLevel, catalogVersion: CATALOG_VERSION, catalogHash: CATALOG_HASH, manualReview: true },
 107:   };
 108: }

 succeeded in 693ms:
   1: // @glitzy/web/(admin)/[instanceSlug]/review-queue/[entryId] — detail · approve/reject
   2: // SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01
   3: 
   4: import Link from "next/link";
   5: import { notFound, redirect } from "next/navigation";
   6: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
   7: 
   8: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   9: import { requirePageContext } from "@/lib/page-context";
  10: import { withSkeletonTx } from "@/lib/tenant";
  11: import { ReviewEntryActionForm } from "@/components/forms/ReviewEntryActionForm";
  12: import type { ApproverRole } from "@/lib/compliance/types";
  13: 
  14: type EntryRow = {
  15:   id: string;
  16:   content_type: string;
  17:   content_ref: string;
  18:   compliance_record_id: string;
  19:   status: string;
  20:   priority: string;
  21:   required_roles: string[];
  22:   sla_due_at: Date;
  23:   page_risk_level: string;
  24:   // record slots
  25:   peer_reviewer_name: string | null;
  26:   peer_reviewed_at: Date | null;
  27:   physician_approver_name: string | null;
  28:   physician_approved_at: Date | null;
  29:   legal_counsel_name: string | null;
  30:   legal_counsel_at: Date | null;
  31:   auto_check_result: unknown;
  32: };
  33: 
  34: type ContentPreview = { title: string | null; summary: string | null; body: string | null };
  35: 
  36: // CAMC-09 정정: content_type 별 read-only preview (table/column allowlist)
  37: const PREVIEW_QUERIES: Record<string, { table: string; titleCol?: string; summaryCol?: string; bodyCol?: string }> = {
  38:   Article: { table: "article", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  39:   TreatmentPage: { table: "treatment_page", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  40:   LegalDocument: { table: "legal_document", titleCol: "title", bodyCol: "body" },
  41:   FAQ: { table: "faq", titleCol: "question", bodyCol: "answer" },
  42:   Publication: { table: "publication", titleCol: "title", summaryCol: "summary" },
  43:   MediaAppearance: { table: "media_appearance", titleCol: "title", summaryCol: "summary" },
  44: };
  45: 
  46: export default async function ReviewEntryDetailPage({ params }: { params: { instanceSlug: string; entryId: string } }) {
  47:   let pageCtx;
  48:   try {
  49:     pageCtx = await requirePageContext(params.instanceSlug);
  50:   } catch (err) {
  51:     if (err instanceof TenantResolveError) {
  52:       const a = mapAuthDenyReasonToUi(err.reason);
  53:       if (a.kind === "forbidden" || a.kind === "info") {
  54:         return <main className="p-6"><p>{a.message}</p></main>;
  55:       }
  56:     }
  57:     throw err;
  58:   }
  59: 
  60:   let entry: EntryRow | null;
  61:   let eligibleRoles: ApproverRole[] = [];
  62:   let preview: ContentPreview | null = null;
  63:   try {
  64:     const result = await withSkeletonTx(
  65:       { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
  66:       async (tx, ctx) => {
  67:         assertActionEligibility(ctx, "operator-edit-content");
  68:         const rows = await tx<EntryRow[]>`
  69:           SELECT e.id,
  70:                  e.content_type::text AS content_type,
  71:                  e.content_ref,
  72:                  e.compliance_record_id,
  73:                  e.status::text AS status,
  74:                  e.priority::text AS priority,
  75:                  e.required_roles::text[] AS required_roles,
  76:                  e.sla_due_at,
  77:                  cr.page_risk_level::text AS page_risk_level,
  78:                  cr.auto_check_result,
  79:                  cr.peer_reviewed_at,
  80:                  cr.physician_approved_at,
  81:                  cr.legal_counsel_at,
  82:                  (SELECT display_name FROM admin_user WHERE id = cr.peer_reviewer) AS peer_reviewer_name,
  83:                  (SELECT display_name FROM admin_user WHERE id = cr.physician_approver) AS physician_approver_name,
  84:                  (SELECT display_name FROM admin_user WHERE id = cr.legal_counsel) AS legal_counsel_name
  85:             FROM review_queue_entry e
  86:             JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
  87:            WHERE e.id = ${params.entryId}::uuid AND e.instance_id = ${ctx.instanceId}::uuid
  88:            LIMIT 1
  89:         `;
  90:         const e = rows[0] ?? null;
  91:         // 본인 가능 role 산정 — instance_membership.role 우선
  92:         const roles: ApproverRole[] = [];
  93:         if (ctx.role === "operator" || ctx.role === "super-admin") roles.push("operator");
  94:         if (ctx.user.physician_reviewer_eligible) roles.push("medical");
  95:         if (ctx.user.legal_reviewer_eligible) roles.push("legal");
  96: 
  97:         // CAMC-09 정정: content_type 별 preview 조회 (allowlist)
  98:         let preview: ContentPreview | null = null;
  99:         if (e) {
 100:           const q = PREVIEW_QUERIES[e.content_type];
 101:           if (q) {
 102:             const titleSel = q.titleCol ?? "NULL";
 103:             const summarySel = q.summaryCol ?? "NULL";
 104:             const bodySel = q.bodyCol ?? "NULL";
 105:             const previewRows = await tx.unsafe<{ title: string | null; summary: string | null; body: string | null }[]>(`
 106:               SELECT ${titleSel} AS title, ${summarySel} AS summary, ${bodySel} AS body
 107:                 FROM ${q.table}
 108:                WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${e.content_ref.replace(/'/g, "''")}'
 109:                LIMIT 1
 110:             `);
 111:             preview = previewRows[0] ?? null;
 112:           }
 113:         }
 114: 
 115:         return { entry: e, eligibleRoles: roles, preview };
 116:       },
 117:     );
 118:     entry = result.entry;
 119:     eligibleRoles = result.eligibleRoles;
 120:     preview = result.preview;
 121:   } catch (err) {
 122:     if (err instanceof TenantResolveError) {
 123:       const a = mapAuthDenyReasonToUi(err.reason);
 124:       if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
 125:       if (a.kind === "not-found") notFound();
 126:       if (a.kind === "forbidden" || a.kind === "info") {
 127:         return <main className="p-6"><p>{a.message}</p></main>;
 128:       }
 129:     }
 130:     throw err;
 131:   }
 132:   if (entry === null) notFound();
 133: 
 134:   // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
 135:   const filledRoles = new Set<ApproverRole>();
 136:   if (entry.peer_reviewed_at !== null) filledRoles.add("operator");
 137:   if (entry.physician_approved_at !== null) filledRoles.add("medical");
 138:   if (entry.legal_counsel_at !== null) filledRoles.add("legal");
 139:   const required = new Set(entry.required_roles as ApproverRole[]);
 140:   const actionableRoles = eligibleRoles.filter((r) => required.has(r) && !filledRoles.has(r));
 141: 
 142:   return (
 143:     <main className="flex flex-col gap-6">
 144:       <header className="flex items-center justify-between">
 145:         <h1 className="text-2xl font-semibold">검수 — {entry.content_type} · {entry.content_ref}</h1>
 146:         <Link href={`/admin/${params.instanceSlug}/review-queue`} className="text-sm text-slate-600 hover:underline">← 큐 목록</Link>
 147:       </header>
 148: 
 149:       <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
 150:         <h2 className="mb-2 text-base font-medium">콘텐츠 메타</h2>
 151:         <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
 152:           <dt className="text-slate-500">유형</dt><dd>{entry.content_type}</dd>
 153:           <dt className="text-slate-500">slug</dt><dd className="font-mono text-xs">{entry.content_ref}</dd>
 154:           <dt className="text-slate-500">위험도</dt><dd>{entry.page_risk_level}</dd>
 155:           <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>
 156:           <dt className="text-slate-500">우선순위</dt><dd>{entry.priority}</dd>
 157:           <dt className="text-slate-500">SLA 마감</dt><dd className="text-xs">{new Date(entry.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}</dd>
 158:           <dt className="text-slate-500">상태</dt><dd>{entry.status}</dd>
 159:         </dl>
 160:       </section>
 161: 
 162:       {preview ? (
 163:         <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
 164:           <h2 className="mb-2 text-base font-medium">콘텐츠 미리보기 (read-only)</h2>
 165:           {preview.title && (
 166:             <h3 className="mb-2 text-base font-semibold text-fg-default">{preview.title}</h3>
 167:           )}
 168:           {preview.summary && (
 169:             <p className="mb-3 text-sm text-fg-muted">{preview.summary}</p>
 170:           )}
 171:           {preview.body && (
 172:             <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-100 bg-slate-50 p-3 text-xs text-fg-default">{preview.body}</pre>
 173:           )}
 174:         </section>
 175:       ) : null}
 176: 
 177:       <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
 178:         <h2 className="mb-2 text-base font-medium">검수 슬롯</h2>
 179:         <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
 180:           <dt className="text-slate-500">operator (peer)</dt>
 181:           <dd>{entry.peer_reviewer_name ? `${entry.peer_reviewer_name} · ${entry.peer_reviewed_at ? new Date(entry.peer_reviewed_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
 182:           <dt className="text-slate-500">medical</dt>
 183:           <dd>{entry.physician_approver_name ? `${entry.physician_approver_name} · ${entry.physician_approved_at ? new Date(entry.physician_approved_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
 184:           <dt className="text-slate-500">legal</dt>
 185:           <dd>{entry.legal_counsel_name ? `${entry.legal_counsel_name} · ${entry.legal_counsel_at ? new Date(entry.legal_counsel_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
 186:         </dl>
 187:       </section>
 188: 
 189:       {actionableRoles.length === 0 ? (
 190:         <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">
 191:           본인이 수행 가능한 검수 역할이 없습니다.
 192:         </div>
 193:       ) : (
 194:         <section className="rounded-md border border-slate-200 bg-white p-4">
 195:           <h2 className="mb-2 text-base font-medium">검수 액션</h2>
 196:           <p className="mb-3 text-xs text-slate-500">본인 가능 역할: {actionableRoles.join(", ")}</p>
 197:           {actionableRoles.map((role) => (
 198:             <ReviewEntryActionForm
 199:               key={role}
 200:               instanceSlug={params.instanceSlug}
 201:               entryId={params.entryId}
 202:               role={role}
 203:             />
 204:           ))}
 205:         </section>
 206:       )}
 207:     </main>
 208:   );
 209: }

codex
현재 발견 사항은 문서 계획과 코드 간의 정책 불일치라 단위 테스트로 전부 잡히지는 않습니다. 그래도 현재 compliance vitest가 패치 이후 기본 행위를 깨지 않는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web test:scenarios' in C:\Users\assag\solution\website-exposure
2026-05-18T09:26:52.737308Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.3 seconds
Output:

> @glitzy/web@0.1.0 test:scenarios C:\Users\assag\solution\website-exposure\apps\web
> vitest run

C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 test:scenarios: `vitest run`
Exit status 1
[31mfailed to load config from C:\Users\assag\solution\website-exposure\apps\web\vitest.config.ts[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Startup Error [27m[22m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1975:29)
    at build (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1873:26)
    at bundleConfigFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
    at loadConfigFromFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
    at resolveConfig (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
    at _createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
    at createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
    at createViteServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.19/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn'
}




 exited 1 in 1286ms:

> @glitzy/web@0.1.0 test:scenarios C:\Users\assag\solution\website-exposure\apps\web
> vitest run

C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @glitzy/web@0.1.0 test:scenarios: `vitest run`
Exit status 1
[31mfailed to load config from C:\Users\assag\solution\website-exposure\apps\web\vitest.config.ts[39m

[31m⎯⎯⎯⎯⎯⎯⎯[1m[7m Startup Error [27m[22m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1975:29)
    at build (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.21.5\node_modules\esbuild\lib\main.js:1873:26)
    at bundleConfigFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
    at loadConfigFromFile (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
    at resolveConfig (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
    at _createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
    at createServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.19/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
    at createViteServer (file:///C:/Users/assag/solution/website-exposure/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.19/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn'
}




exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -Path packages/core-content/migrations/C0014_compliance_record.sql | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 716ms:
   1: -- @glitzy/core-content — C0014 ComplianceRecord (DATA_MODEL § 4 C-10·COMPLIANCE_ASSISTANT_M0_PLAN v1.0)
   2: -- M0 v0.1 컬럼 subset — CA-DEFER-13 풀 컬럼 매핑 표 참조 (mediaThreshold · attachments · staleFlags · warningAck · llmAssist · priorReviewSubmissionId · featureContentType · authentication columns)
   3: -- Precondition: D0010 instance · C0005 risk_level enum
   4: 
   5: -- recordPhase enum — DATA_MODEL C-10 v0.8
   6: CREATE TYPE compliance_record_phase AS ENUM ('pre-publish', 'published');
   7: 
   8: -- DATA_MODEL C-10 v0.6 17종 풀 enum (CAM-10 정정 — M0 active 6종 만 submit · app layer ALLOWED_SUBMIT_TYPES)
   9: CREATE TYPE compliance_content_type AS ENUM (
  10:   'ClinicProfile', 'DoctorProfile', 'TreatmentPage', 'MedicalConditionPage',
  11:   'Article', 'FAQ', 'ReviewPolicy', 'PricingPage', 'FacilitiesPage', 'NewsItem',
  12:   'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
  13:   'Feature', 'Publication', 'MediaAppearance'
  14: );
  15: 
  16: CREATE TABLE compliance_record (
  17:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  18:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  19:   content_type compliance_content_type NOT NULL,
  20:   content_ref TEXT NOT NULL,
  21:   page_risk_level risk_level NOT NULL,
  22:   article_type TEXT,
  23:   inline_risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  24:   auto_check_result JSONB NOT NULL,
  25:   -- 슬롯 4종 (M0 active 3종 · client CA-DEFER-10)
  26:   peer_reviewer UUID,
  27:   peer_reviewed_at TIMESTAMPTZ,
  28:   physician_approver UUID,
  29:   physician_approved_at TIMESTAMPTZ,
  30:   legal_counsel UUID,
  31:   legal_counsel_at TIMESTAMPTZ,
  32:   client_approver UUID,
  33:   client_approved_at TIMESTAMPTZ,
  34:   prior_review_required BOOLEAN NOT NULL DEFAULT false,
  35:   prior_review_submission_id TEXT,
  36:   prior_review_passed BOOLEAN,
  37:   published_at TIMESTAMPTZ,
  38:   published_by UUID,
  39:   record_phase compliance_record_phase NOT NULL DEFAULT 'pre-publish',
  40:   record_version INTEGER NOT NULL DEFAULT 1,
  41:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  42:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  43:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  44:   CONSTRAINT compliance_record_version_positive CHECK (record_version >= 1),
  45:   CONSTRAINT compliance_record_published_requires_at CHECK (
  46:     record_phase <> 'published' OR (published_at IS NOT NULL AND published_by IS NOT NULL)
  47:   ),
  48:   CONSTRAINT compliance_record_legal_doc_requires_legal CHECK (
  49:     record_phase <> 'published' OR content_type <> 'LegalDocument'
  50:     OR (legal_counsel IS NOT NULL AND legal_counsel_at IS NOT NULL)
  51:   ),
  52:   CONSTRAINT compliance_record_med_high_requires_physician CHECK (
  53:     record_phase <> 'published' OR page_risk_level = 'Low'
  54:     OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
  55:   ),
  56:   CONSTRAINT compliance_record_published_requires_peer CHECK (
  57:     record_phase <> 'published' OR (peer_reviewer IS NOT NULL AND peer_reviewed_at IS NOT NULL)
  58:   ),
  59:   CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
  60:   CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
  61: );
  62: 
  63: CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
  64: CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
  65: CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
  66: CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';
  67: 
  68: ALTER TABLE compliance_record ENABLE ROW LEVEL SECURITY;
  69: ALTER TABLE compliance_record FORCE ROW LEVEL SECURITY;
  70: 
  71: CREATE POLICY tenant_isolation ON compliance_record
  72:   FOR ALL TO app_tenant_user
  73:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  74:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  75: 
  76: GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_record TO app_tenant_user;

 succeeded in 719ms:
   1: // @glitzy/web/(admin)/[instanceSlug]/review-queue/actions
   2: // COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — approveEntry · rejectEntry
   3: 
   4: "use server";
   5: 
   6: import { revalidatePath } from "next/cache";
   7: import { notFound, redirect } from "next/navigation";
   8: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
   9: 
  10: import { getSqlBase } from "@/lib/db";
  11: import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
  12: import { withSkeletonTx } from "@/lib/tenant";
  13: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
  14: import { approveContent, rejectContent } from "@/lib/compliance/server-actions";
  15: import {
  16:   ComplianceConfigError,
  17:   ComplianceTransitionError,
  18:   ReviewerEligibilityError,
  19:   type ApproverRole,
  20:   type SubmitContentType,
  21: } from "@/lib/compliance/types";
  22: import type { SaveResult } from "@/lib/save-result";
  23: 
  24: const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  25:   Article: "article",
  26:   TreatmentPage: "treatment_page",
  27:   LegalDocument: "legal_document",
  28:   FAQ: "faq",
  29:   Publication: "publication",
  30:   MediaAppearance: "media_appearance",
  31: };
  32: 
  33: export async function approveEntryAction(
  34:   instanceSlug: string,
  35:   entryId: string,
  36:   role: ApproverRole,
  37:   _prev: SaveResult | null,
  38:   _formData: FormData,
  39: ): Promise<SaveResult> {
  40:   const aCtx = await resolveActionContext(instanceSlug);
  41:   const sqlBase = getSqlBase();
  42:   try {
  43:     const result = await withSkeletonTx(
  44:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  45:       async (tx, ctx) => {
  46:         const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
  47:           SELECT compliance_record_id, content_type::text AS content_type, content_ref
  48:             FROM review_queue_entry
  49:            WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  50:            LIMIT 1
  51:         `;
  52:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
  53:         const entry = rows[0]!;
  54:         const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
  55:         if (!table) {
  56:           return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
  57:         }
  58:         const out = await approveContent(tx, ctx, {
  59:           recordId: entry.compliance_record_id,
  60:           role,
  61:           contentTable: table,
  62:           contentRef: entry.content_ref,
  63:         });
  64:         return { ok: true as const, ctx, entry, out };
  65:       },
  66:     );
  67: 
  68:     if (result.ok === false && result.action === "notfound") notFound();
  69:     if (result.ok === false && result.action === "unsupported") {
  70:       return { ok: false, fieldErrors: {}, formError: result.message };
  71:     }
  72:     if (result.ok === true) {
  73:       try {
  74:         await emitAuditEvent(sqlBase, {
  75:           eventType: "content-approved",
  76:           actorUserId: result.ctx.userId,
  77:           targetUserId: result.ctx.userId,
  78:           toInstanceId: result.ctx.instanceId,
  79:           payload: {
  80:             contentType: result.entry.content_type,
  81:             contentRef: result.entry.content_ref,
  82:             recordId: result.entry.compliance_record_id,
  83:             role,
  84:             allApproved: result.out.allApproved,
  85:             entryStatus: result.out.entryStatus,
  86:           },
  87:         });
  88:       } catch (err) {
  89:         console.error("[approveEntryAction] audit emit failed", err);
  90:       }
  91:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
  92:       revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
  93:       return { ok: true, slug: entryId };
  94:     }
  95:     return { ok: false, fieldErrors: {}, formError: "승인에 실패했습니다." };
  96:   } catch (err) {
  97:     if (isNextControlFlowError(err)) throw err;
  98:     if (err instanceof ReviewerEligibilityError) {
  99:       return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
 100:     }
 101:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
 102:       return { ok: false, fieldErrors: {}, formError: err.message };
 103:     }
 104:     if (err instanceof TenantResolveError) {
 105:       const action = mapAuthDenyReasonToUi(err.reason);
 106:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 107:       if (action.kind === "not-found") notFound();
 108:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 109:     }
 110:     console.error("[approveEntryAction] unexpected", err);
 111:     return { ok: false, fieldErrors: {}, formError: "승인 중 오류가 발생했습니다." };
 112:   }
 113: }
 114: 
 115: export async function rejectEntryAction(
 116:   instanceSlug: string,
 117:   entryId: string,
 118:   role: ApproverRole,
 119:   _prev: SaveResult | null,
 120:   formData: FormData,
 121: ): Promise<SaveResult> {
 122:   const reason = String(formData.get("reason") ?? "").trim();
 123:   if (reason.length < 50) {
 124:     return { ok: false, fieldErrors: { reason: ["거부 사유는 50자 이상이어야 합니다."] } };
 125:   }
 126:   const aCtx = await resolveActionContext(instanceSlug);
 127:   const sqlBase = getSqlBase();
 128:   try {
 129:     const result = await withSkeletonTx(
 130:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 131:       async (tx, ctx) => {
 132:         const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
 133:           SELECT compliance_record_id, content_type::text AS content_type, content_ref
 134:             FROM review_queue_entry
 135:            WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
 136:            LIMIT 1
 137:         `;
 138:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
 139:         const entry = rows[0]!;
 140:         const table = ENTITY_TABLES[entry.content_type as SubmitContentType];
 141:         if (!table) {
 142:           return { ok: false as const, action: "unsupported" as const, message: `Unsupported contentType: ${entry.content_type}` };
 143:         }
 144:         await rejectContent(tx, ctx, {
 145:           recordId: entry.compliance_record_id,
 146:           reason,
 147:           role,
 148:           contentTable: table,
 149:           contentRef: entry.content_ref,
 150:         });
 151:         return { ok: true as const, ctx, entry };
 152:       },
 153:     );
 154: 
 155:     if (result.ok === false && result.action === "notfound") notFound();
 156:     if (result.ok === false && result.action === "unsupported") {
 157:       return { ok: false, fieldErrors: {}, formError: result.message };
 158:     }
 159:     if (result.ok === true) {
 160:       try {
 161:         await emitAuditEvent(sqlBase, {
 162:           eventType: "content-rejected",
 163:           actorUserId: result.ctx.userId,
 164:           targetUserId: result.ctx.userId,
 165:           toInstanceId: result.ctx.instanceId,
 166:           payload: {
 167:             contentType: result.entry.content_type,
 168:             contentRef: result.entry.content_ref,
 169:             recordId: result.entry.compliance_record_id,
 170:             role,
 171:             reason,
 172:           },
 173:         });
 174:       } catch (err) {
 175:         console.error("[rejectEntryAction] audit emit failed", err);
 176:       }
 177:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
 178:       revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
 179:       redirect(`/admin/${instanceSlug}/review-queue`);
 180:     }
 181:     return { ok: false, fieldErrors: {}, formError: "거부 처리에 실패했습니다." };
 182:   } catch (err) {
 183:     if (isNextControlFlowError(err)) throw err;
 184:     if (err instanceof ReviewerEligibilityError) {
 185:       return { ok: false, fieldErrors: {}, formError: `검수 권한 없음: ${err.message}` };
 186:     }
 187:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
 188:       return { ok: false, fieldErrors: {}, formError: err.message };
 189:     }
 190:     if (err instanceof TenantResolveError) {
 191:       const action = mapAuthDenyReasonToUi(err.reason);
 192:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 193:       if (action.kind === "not-found") notFound();
 194:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 195:     }
 196:     console.error("[rejectEntryAction] unexpected", err);
 197:     return { ok: false, fieldErrors: {}, formError: "거부 처리 중 오류가 발생했습니다." };
 198:   }
 199: }

codex
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=0 (총 2)
- closeableAfterPatch: false
- 수렴 추세: cycle1=13 → cycle2=2

## cycle 1 patch 검증
- CAMC-01: PASS — publish wrapper가 `compliance_record_id` 선행 요구 제거 후 pre-publish record를 조회함.
- CAMC-02: PASS — C0016에 LegalDocument·FAQ sentinel INSERT/UPDATE 추가됨.
- CAMC-03: PASS — `approveContent`는 locked `required_roles` 조회 후 role 포함 여부 검증.
- CAMC-04: PASS — submit row 조회에 `FOR UPDATE` 적용.
- CAMC-05: PASS — publish entity UPDATE가 `status='publishable'` 조건 + row count 검증.
- CAMC-06: PASS — publish 전 entity current status에 `assertTransitionAllowed(..., "published")` 적용.
- CAMC-07: PASS — submit audit payload에 `finalRoles`, `pageRiskLevel` 포함.
- CAMC-08: PASS — LegalDocument exempt envelope가 `maxRisk()` 사용.
- CAMC-09: PASS — preview가 `PREVIEW_QUERIES` allowlist 기반 read-only 조회.
- CAMC-10: PASS — `SubmitForReviewResult`에 `finalRoles`, `pageRiskLevel` 추가.
- CAMC-11: PASS — `PublishContentResult.recordVersion` 및 audit payload 포함.
- CAMC-12: PASS — saveArticle은 current row status 보존 주석/흐름 확인.
- CAMC-13: PASS — 현 Codex 환경은 동일하게 vitest `spawn EPERM`; 사용자 환경 PASS 전제 유지.

## new findings
- **CAMC2-01 blocking** — C0016 sentinel backfill이 기존 published Medium/High Article/TreatmentPage에서 migration 실패 가능  
  [C0016_status_unlock.sql](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0016_status_unlock.sql:54), [C0016_status_unlock.sql](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0016_status_unlock.sql:82)는 `COALESCE(risk_level,'Low')`로 published sentinel을 만들지만 physician slot을 채우지 않습니다. [C0014_compliance_record.sql](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0014_compliance_record.sql:52)의 `compliance_record_med_high_requires_physician` 때문에 기존 published Medium/High row가 있으면 INSERT 자체가 실패합니다. sentinel에는 system `physician_approver/physician_approved_at`을 채우거나 page_risk_level을 명시적으로 Low sentinel 정책으로 고정해야 합니다.

- **CAMC2-02 major** — `rejectContent`는 `required_roles` 미포함 role도 큐 reject 가능  
  [server-actions.ts](C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:275)는 reject 시 entry `id`만 잠그고 `required_roles`를 검증하지 않습니다. 따라서 Low Article operator-only 큐를 medical eligible 사용자가 직접 action 호출로 `rejected` 처리할 수 있습니다. approve와 동일하게 locked `required_roles::text[]` 조회 후 `args.role` 포함 여부를 fail closed 해야 합니다.

## acceptance 판정
- close 불가: 새 blocking 1, major 1 존재.
- 검증: `pnpm --filter @glitzy/web test:scenarios`는 Codex 환경 `spawn EPERM`으로 실행 불가.
tokens used
95,589
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=0 (총 2)
- closeableAfterPatch: false
- 수렴 추세: cycle1=13 → cycle2=2

## cycle 1 patch 검증
- CAMC-01: PASS — publish wrapper가 `compliance_record_id` 선행 요구 제거 후 pre-publish record를 조회함.
- CAMC-02: PASS — C0016에 LegalDocument·FAQ sentinel INSERT/UPDATE 추가됨.
- CAMC-03: PASS — `approveContent`는 locked `required_roles` 조회 후 role 포함 여부 검증.
- CAMC-04: PASS — submit row 조회에 `FOR UPDATE` 적용.
- CAMC-05: PASS — publish entity UPDATE가 `status='publishable'` 조건 + row count 검증.
- CAMC-06: PASS — publish 전 entity current status에 `assertTransitionAllowed(..., "published")` 적용.
- CAMC-07: PASS — submit audit payload에 `finalRoles`, `pageRiskLevel` 포함.
- CAMC-08: PASS — LegalDocument exempt envelope가 `maxRisk()` 사용.
- CAMC-09: PASS — preview가 `PREVIEW_QUERIES` allowlist 기반 read-only 조회.
- CAMC-10: PASS — `SubmitForReviewResult`에 `finalRoles`, `pageRiskLevel` 추가.
- CAMC-11: PASS — `PublishContentResult.recordVersion` 및 audit payload 포함.
- CAMC-12: PASS — saveArticle은 current row status 보존 주석/흐름 확인.
- CAMC-13: PASS — 현 Codex 환경은 동일하게 vitest `spawn EPERM`; 사용자 환경 PASS 전제 유지.

## new findings
- **CAMC2-01 blocking** — C0016 sentinel backfill이 기존 published Medium/High Article/TreatmentPage에서 migration 실패 가능  
  [C0016_status_unlock.sql](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0016_status_unlock.sql:54), [C0016_status_unlock.sql](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0016_status_unlock.sql:82)는 `COALESCE(risk_level,'Low')`로 published sentinel을 만들지만 physician slot을 채우지 않습니다. [C0014_compliance_record.sql](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0014_compliance_record.sql:52)의 `compliance_record_med_high_requires_physician` 때문에 기존 published Medium/High row가 있으면 INSERT 자체가 실패합니다. sentinel에는 system `physician_approver/physician_approved_at`을 채우거나 page_risk_level을 명시적으로 Low sentinel 정책으로 고정해야 합니다.

- **CAMC2-02 major** — `rejectContent`는 `required_roles` 미포함 role도 큐 reject 가능  
  [server-actions.ts](C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:275)는 reject 시 entry `id`만 잠그고 `required_roles`를 검증하지 않습니다. 따라서 Low Article operator-only 큐를 medical eligible 사용자가 직접 action 호출로 `rejected` 처리할 수 있습니다. approve와 동일하게 locked `required_roles::text[]` 조회 후 `args.role` 포함 여부를 fail closed 해야 합니다.

## acceptance 판정
- close 불가: 새 blocking 1, major 1 존재.
- 검증: `pnpm --filter @glitzy/web test:scenarios`는 Codex 환경 `spawn EPERM`으로 실행 불가.
