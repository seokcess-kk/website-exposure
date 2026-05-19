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
session id: 019e3a6e-3b9b-7ac0-8b3e-0619ccd99f29
--------
user
Review code of `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — **cycle 4**. cycle 3 1 finding patch 검증 + 새 finding 확인. 짧게.

## Cycle 3 patch

| # | severity | patch |
|---|---|---|
| CAMC3-01 | major | approveContent · rejectContent 안 entry.content_type / content_ref 와 args 정합 검증 (drift 차단) |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=1 → cycle4=N

## cycle 3 patch 검증
- CAMC3-01: PASS/FAIL + 한 줄

## new findings (있을 경우)

## acceptance 판정
```

cycle 3 1건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
리뷰 대상 문서와 주변 변경 맥락을 먼저 확인하겠습니다. cycle 3 패치가 문서 내 설계/수용 기준에 실제로 반영됐는지 보고, 새 blocking/major만 짧게 판정하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"approveContent|rejectContent|content_type|content_ref|CAMC3|drift|v1\\.0|acceptance|approve|reject\" docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md" in C:\Users\assag\solution\website-exposure
 succeeded in 634ms:
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

 succeeded in 633ms:
1:# compliance-assistant M0 vertical slice plan (v1.0·acceptance·2026-05-18)
3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **5 cycle 36 findings 전건 수용** · cycle 5 closeableAfterPatch=true 확정. 수렴 추세 **28 → 5 → 2 → 1 → 0**. EAT_CONTENT code v1.0 acceptance 직후 진입하는 첫 Feature 본 plan (M0 vertical slice scope).
5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
9:- `docs/features/compliance-assistant.md` v1.0 — Feature spec (§ 3 check() · § 4 빌드 파이프라인 · § 5 LLM · § 6 RiskInference · § 7 룰 카탈로그 · § 8 캐시)
14:- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-07/12 부분 해소 대상 (EC-DEFER-05 미해소)
16:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit_event matrix · emit 위치 정책 · base role
42:| 6 entity compliance_record_id FK + published 게이트 (CAM-07·08 정정) | 모든 published 콘텐츠는 `compliance_record_id IS NOT NULL` (DB CHECK). 추가로 `published_content_compliance_guard` 트리거 (PL/pgSQL · BEFORE UPDATE ON each entity) — entity.status='published' 시 referenced compliance_record.record_phase='published' + content_type 일치 + instance_id 일치 검증. C0016 migration은 NOT VALID 패턴 (기존 published row backfill 우회) — sentinel ComplianceRecord 사전 INSERT + 기존 published article row backfill + VALIDATE CONSTRAINT 단계 분리 |
43:| 어드민 /review-queue 화면 | list (manual-review 큐) + detail page (entry approve/reject) |
44:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
50:| `published_content_compliance_guard` 트리거 (CAM-08 정정) | BEFORE INSERT/UPDATE ON each entity (article·treatment_page·legal_document·faq·publication·media_appearance) — `NEW.status='published'` 시 referenced compliance_record.record_phase='published' + content_type 일치 + content_ref 매칭 (slug) + instance_id 일치 검증. 위반 시 RAISE EXCEPTION |
51:| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
87:CREATE TYPE compliance_content_type AS ENUM (
97:  content_type compliance_content_type NOT NULL,
98:  content_ref TEXT NOT NULL,
105:  physician_approver UUID,                      -- admin_user.id (medical)
106:  physician_approved_at TIMESTAMPTZ,
109:  client_approver UUID,                         -- M0 미사용 (CA-DEFER-10)
110:  client_approved_at TIMESTAMPTZ,
126:    record_phase <> 'published' OR content_type <> 'LegalDocument'
131:    OR (physician_approver IS NOT NULL AND physician_approved_at IS NOT NULL)
136:  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
141:CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
171:CREATE TYPE approver_role AS ENUM ('operator', 'medical', 'legal', 'client');  -- client M0 미사용 (CA-DEFER-10)
177:  content_type compliance_content_type NOT NULL,
178:  content_ref TEXT NOT NULL,
183:  -- CAM-15 정정: text[]도 enum 검증이 어려워 approver_role[] array 운영
184:  required_roles approver_role[] NOT NULL,
210:CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
212:  ON review_queue_entry (instance_id, content_type, content_ref)
226:- (CAM-15) `required_roles approver_role[]` — enum array. 중복은 INSERT 시 app layer 가 canonical sort + dedup.
268:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
271:SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
280:WHERE a.instance_id = cr.instance_id AND cr.content_type = 'Article'::compliance_content_type
281:  AND cr.content_ref = a.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
285:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
288:SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
297:WHERE t.instance_id = cr.instance_id AND cr.content_type = 'TreatmentPage'::compliance_content_type
298:  AND cr.content_ref = t.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
304:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
307:SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
315:WHERE p.instance_id = cr.instance_id AND cr.content_type = 'Publication'::compliance_content_type
316:  AND cr.content_ref = p.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
320:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
323:SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
331:WHERE m.instance_id = cr.instance_id AND cr.content_type = 'MediaAppearance'::compliance_content_type
332:  AND cr.content_ref = m.slug AND cr.metadata @> '{"sentinel":true}'::jsonb
368:--   BEFORE INSERT/UPDATE ON each entity. status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 일치 검증.
385:  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
386:  IF TG_TABLE_NAME = 'article' AND record_row.content_type <> 'Article' THEN
387:    RAISE EXCEPTION 'content_type mismatch: % vs %', TG_TABLE_NAME, record_row.content_type;
390:  -- content_ref 일치 (slug)
391:  IF record_row.content_ref <> NEW.slug THEN
392:    RAISE EXCEPTION 'content_ref mismatch: % vs %', record_row.content_ref, NEW.slug;
436:      throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
665:- 본인 역할에 한해 approve/reject 폼 노출 (assertReviewerEligibility flag 확인)
679:- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
697:// CAM-17 정정 — approve 첫 호출이 atomic open→in-progress + status review-queued→in-review 동시 전이.
698://   재approve 시 status=in-review 유지.
699:export async function approveContent(
704:export async function rejectContent(
722:| `content-approved` | approveContent action 성공 | `{contentType, contentRef, recordId, role, allApproved}` |
723:| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
731:// approveContent 안 race 차단
745:  "in-review": ["approved", "rejected", "in-review"],
746:  "approved": ["publishable"],
748:  "rejected": ["draft", "review-queued"],
764:| 4 | Article Low approveContent(operator) → entry.status='resolved' + AND 게이트 충족 → entity.status='in-review' → 'approved' atomic 전이 | record.peer_reviewer 채움 · entity.status='approved' | vitest + e2e |
765:| 5 | Article Medium approveContent(operator) → AND 게이트 미충족 (medical 누락) → entity.status='in-review' 유지 + entry.status='in-progress' | record.peer_reviewer 채움 · entity.status 변화 없음 | vitest |
766:| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
768:| 8 | Article Medium publish 시 record.physician_approver IS NULL → DB CHECK `compliance_record_med_high_requires_physician` 위반 | published 차단 | e2e |
775:| 15 | 다른 role 의 approveContent 시도 (medical 인데 operator role) → AssertReviewerEligibilityError | 403 | vitest + e2e |
776:| 16 | concurrent approveContent (same record · same role) → hashtextextended advisory_xact_lock 직렬화 → 마지막 호출 idempotent | 64-bit lock key | vitest |
789:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
799:## 9. M0 v1.0 cascade markers (defer 정리)
837:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 finding 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 28 → 5 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 5 cycle 36 findings 전건 수용. acceptance commit 7 cascade docs 동시 포함 marker (CA-CASCADE-01~06 + plan 본문). 실 SQL 코드 cascade 는 별 cycle (compliance-assistant M0 code v1.0). |
840:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |

 succeeded in 694ms:
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
문서만으로는 CAMC3-01의 “code patch” 여부를 판정하기 부족해서 실제 compliance action 구현을 확인합니다. 특히 `approveContent`/`rejectContent`가 `recordId` 기준 조회 뒤 큐 entry와 콘텐츠 args 불일치를 막는지 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"function approveContent|approveContent\\(|function rejectContent|rejectContent\\(|content_type|contentRef|content_ref|recordId|ReviewQueue\" apps/web/src/lib/compliance packages/core-content/migrations/C0015_review_queue_entry.sql packages/core-content/migrations/C0016_status_unlock.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files apps/web/src/lib/compliance' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 648ms:
packages/core-content/migrations/C0016_status_unlock.sql:4:-- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.
packages/core-content/migrations/C0016_status_unlock.sql:51:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:54:SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
packages/core-content/migrations/C0016_status_unlock.sql:66:      AND cr.content_type = 'Article'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:67:      AND cr.content_ref = a.slug
packages/core-content/migrations/C0016_status_unlock.sql:73:  AND cr.content_type = 'Article'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:74:  AND cr.content_ref = a.slug
packages/core-content/migrations/C0016_status_unlock.sql:79:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:82:SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
packages/core-content/migrations/C0016_status_unlock.sql:94:      AND cr.content_type = 'TreatmentPage'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:95:      AND cr.content_ref = t.slug
packages/core-content/migrations/C0016_status_unlock.sql:101:  AND cr.content_type = 'TreatmentPage'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:102:  AND cr.content_ref = t.slug
packages/core-content/migrations/C0016_status_unlock.sql:107:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:110:SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:122:      AND cr.content_type = 'LegalDocument'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:123:      AND cr.content_ref = l.slug
packages/core-content/migrations/C0016_status_unlock.sql:129:  AND cr.content_type = 'LegalDocument'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:130:  AND cr.content_ref = l.slug
packages/core-content/migrations/C0016_status_unlock.sql:135:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:138:SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
packages/core-content/migrations/C0016_status_unlock.sql:149:      AND cr.content_type = 'FAQ'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:150:      AND cr.content_ref = f.slug
packages/core-content/migrations/C0016_status_unlock.sql:156:  AND cr.content_type = 'FAQ'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:157:  AND cr.content_ref = f.slug
packages/core-content/migrations/C0016_status_unlock.sql:162:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:165:SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:176:      AND cr.content_type = 'Publication'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:177:      AND cr.content_ref = p.slug
packages/core-content/migrations/C0016_status_unlock.sql:183:  AND cr.content_type = 'Publication'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:184:  AND cr.content_ref = p.slug
packages/core-content/migrations/C0016_status_unlock.sql:188:INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:191:SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
packages/core-content/migrations/C0016_status_unlock.sql:202:      AND cr.content_type = 'MediaAppearance'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:203:      AND cr.content_ref = m.slug
packages/core-content/migrations/C0016_status_unlock.sql:209:  AND cr.content_type = 'MediaAppearance'::compliance_content_type
packages/core-content/migrations/C0016_status_unlock.sql:210:  AND cr.content_ref = m.slug
packages/core-content/migrations/C0016_status_unlock.sql:261:--   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
packages/core-content/migrations/C0016_status_unlock.sql:266:  expected_content_type compliance_content_type;
packages/core-content/migrations/C0016_status_unlock.sql:280:  -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
packages/core-content/migrations/C0016_status_unlock.sql:281:  expected_content_type := CASE TG_TABLE_NAME
packages/core-content/migrations/C0016_status_unlock.sql:290:  IF expected_content_type IS NULL THEN
packages/core-content/migrations/C0016_status_unlock.sql:293:  IF record_row.content_type <> expected_content_type THEN
packages/core-content/migrations/C0016_status_unlock.sql:294:    RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
packages/core-content/migrations/C0016_status_unlock.sql:296:  -- content_ref 일치 (slug)
packages/core-content/migrations/C0016_status_unlock.sql:297:  IF record_row.content_ref <> NEW.slug THEN
packages/core-content/migrations/C0016_status_unlock.sql:298:    RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
packages/core-content/migrations/C0015_review_queue_entry.sql:1:-- @glitzy/core-content — C0015 ReviewQueueEntry (REVIEW_WORKFLOW § 3 · COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.2)
packages/core-content/migrations/C0015_review_queue_entry.sql:3:-- Precondition: D0010 instance · C0014 compliance_record + compliance_content_type enum
packages/core-content/migrations/C0015_review_queue_entry.sql:14:  content_type compliance_content_type NOT NULL,
packages/core-content/migrations/C0015_review_queue_entry.sql:15:  content_ref TEXT NOT NULL,
packages/core-content/migrations/C0015_review_queue_entry.sql:45:CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
packages/core-content/migrations/C0015_review_queue_entry.sql:47:  ON review_queue_entry (instance_id, content_type, content_ref)
apps/web/src/lib/compliance\types.ts:8:// 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
apps/web/src/lib/compliance\types.ts:20:  contentRef: string;
apps/web/src/lib/compliance\__tests__\compliance.test.ts:48:      contentRef: "test",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:62:      contentRef: "test",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:76:      contentRef: "privacy",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:84:      contentRef: "privacy",
apps/web/src/lib/compliance\__tests__\compliance.test.ts:96:      contentRef: "test",
apps/web/src/lib/compliance\server-actions.ts:27:async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
apps/web/src/lib/compliance\server-actions.ts:28:  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
apps/web/src/lib/compliance\server-actions.ts:37:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:42:  recordId: string;
apps/web/src/lib/compliance\server-actions.ts:49: * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
apps/web/src/lib/compliance\server-actions.ts:63:    contentRef: args.contentRef,
apps/web/src/lib/compliance\server-actions.ts:80:      instance_id, content_type, content_ref, page_risk_level, auto_check_result,
apps/web/src/lib/compliance\server-actions.ts:84:      ${args.contentType}::compliance_content_type,
apps/web/src/lib/compliance\server-actions.ts:85:      ${args.contentRef},
apps/web/src/lib/compliance\server-actions.ts:99:  const recordId = recordRows[0]!.id;
apps/web/src/lib/compliance\server-actions.ts:101:  // ReviewQueueEntry INSERT (open)
apps/web/src/lib/compliance\server-actions.ts:104:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
apps/web/src/lib/compliance\server-actions.ts:109:      ${args.contentType}::compliance_content_type,
apps/web/src/lib/compliance\server-actions.ts:110:      ${args.contentRef},
apps/web/src/lib/compliance\server-actions.ts:111:      ${recordId}::uuid,
apps/web/src/lib/compliance\server-actions.ts:121:  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
apps/web/src/lib/compliance\server-actions.ts:125:  recordId: string;
apps/web/src/lib/compliance\server-actions.ts:128:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:137:export async function approveContent(
apps/web/src/lib/compliance\server-actions.ts:143:  await acquireRecordLock(tx, args.recordId);
apps/web/src/lib/compliance\server-actions.ts:147:  // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
apps/web/src/lib/compliance\server-actions.ts:148:  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
apps/web/src/lib/compliance\server-actions.ts:150:           content_type::text AS content_type, content_ref
apps/web/src/lib/compliance\server-actions.ts:152:     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
apps/web/src/lib/compliance\server-actions.ts:170:  if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
apps/web/src/lib/compliance\server-actions.ts:172:      `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
apps/web/src/lib/compliance\server-actions.ts:176:  const recordRows = await tx<ComplianceRecordRow & { id: string; content_type: string }[]>`
apps/web/src/lib/compliance\server-actions.ts:177:    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
apps/web/src/lib/compliance\server-actions.ts:182:     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
apps/web/src/lib/compliance\server-actions.ts:186:  const record = recordRows[0]! as ComplianceRecordRow & { id: string; content_type: string };
apps/web/src/lib/compliance\server-actions.ts:196:    await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
apps/web/src/lib/compliance\server-actions.ts:199:    await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
apps/web/src/lib/compliance\server-actions.ts:202:    await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
apps/web/src/lib/compliance\server-actions.ts:226:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:231:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\server-actions.ts:237:    const publishable = evaluatePublishable(record, record.content_type as ContentType);
apps/web/src/lib/compliance\server-actions.ts:243:       WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:261:function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
apps/web/src/lib/compliance\server-actions.ts:263:  const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
apps/web/src/lib/compliance\server-actions.ts:268:  recordId: string;
apps/web/src/lib/compliance\server-actions.ts:272:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:278:export async function rejectContent(
apps/web/src/lib/compliance\server-actions.ts:287:  await acquireRecordLock(tx, args.recordId);
apps/web/src/lib/compliance\server-actions.ts:290:  // CAMC3-01 정정: content_type/content_ref drift 검증.
apps/web/src/lib/compliance\server-actions.ts:291:  const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
apps/web/src/lib/compliance\server-actions.ts:293:           content_type::text AS content_type, content_ref
apps/web/src/lib/compliance\server-actions.ts:295:     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
apps/web/src/lib/compliance\server-actions.ts:312:  if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
apps/web/src/lib/compliance\server-actions.ts:314:      `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
apps/web/src/lib/compliance\server-actions.ts:333:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:339:  contentRef: string;
apps/web/src/lib/compliance\server-actions.ts:340:  recordId: string;
apps/web/src/lib/compliance\server-actions.ts:357:  await acquireRecordLock(tx, args.recordId);
apps/web/src/lib/compliance\server-actions.ts:360:  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; record_phase: string; record_version: number })[]>`
apps/web/src/lib/compliance\server-actions.ts:361:    SELECT id, content_type::text AS content_type, page_risk_level::text AS page_risk_level,
apps/web/src/lib/compliance\server-actions.ts:367:     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
apps/web/src/lib/compliance\server-actions.ts:382:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\server-actions.ts:396:     WHERE id = ${args.recordId}::uuid
apps/web/src/lib/compliance\server-actions.ts:404:           compliance_record_id = '${args.recordId}',
apps/web/src/lib/compliance\server-actions.ts:406:     WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:45:  contentRef: string,
apps/web/src/lib/compliance\entity-actions.ts:61:           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:67:          contentRef,
apps/web/src/lib/compliance\entity-actions.ts:74:           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:91:            contentRef,
apps/web/src/lib/compliance\entity-actions.ts:92:            recordId: result.out.recordId,
apps/web/src/lib/compliance\entity-actions.ts:101:      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
apps/web/src/lib/compliance\entity-actions.ts:104:      return { ok: true, slug: contentRef };
apps/web/src/lib/compliance\entity-actions.ts:127:  contentRef: string,
apps/web/src/lib/compliance\entity-actions.ts:142:           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
apps/web/src/lib/compliance\entity-actions.ts:150:        // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
apps/web/src/lib/compliance\entity-actions.ts:154:             AND content_type = ${contentType}::compliance_content_type
apps/web/src/lib/compliance\entity-actions.ts:155:             AND content_ref = ${contentRef}
apps/web/src/lib/compliance\entity-actions.ts:162:          contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
apps/web/src/lib/compliance\entity-actions.ts:164:        return { ok: true as const, ctx, recordId: recRows[0]!.id, recordVersion: recRows[0]!.record_version };
apps/web/src/lib/compliance\entity-actions.ts:183:          payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
apps/web/src/lib/compliance\entity-actions.ts:188:      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
apps/web/src/lib/compliance\entity-actions.ts:190:      return { ok: true, slug: contentRef };

 succeeded in 643ms:
apps/web/src/lib/compliance\publishable-check.ts
apps/web/src/lib/compliance\final-roles.ts
apps/web/src/lib/compliance\entity-actions.ts
apps/web/src/lib/compliance\server-actions.ts
apps/web/src/lib/compliance\risk.ts
apps/web/src/lib/compliance\transitions.ts
apps/web/src/lib/compliance\types.ts
apps/web/src/lib/compliance\check.ts
apps/web/src/lib/compliance\eligibility.ts
apps/web/src/lib/compliance\__tests__\compliance.test.ts

 succeeded in 659ms:
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
  // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
  const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
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
  // CAMC3-01: entry vs args 정합 — drift 차단
  const expectedContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
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

  // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
  // CAMC3-01 정정: content_type/content_ref drift 검증.
  const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
  const rejEntry = entryRows[0]!;
  if (!rejEntry.required_roles.includes(args.role)) {
    throw new ComplianceTransitionError(
      `Role "${args.role}" is not required for this entry (required: ${rejEntry.required_roles.join(", ")})`,
    );
  }
  const expectedRejContentType = args.contentTable === "article" ? "Article"
    : args.contentTable === "treatment_page" ? "TreatmentPage"
    : args.contentTable === "legal_document" ? "LegalDocument"
    : args.contentTable === "faq" ? "FAQ"
    : args.contentTable === "publication" ? "Publication"
    : "MediaAppearance";
  if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
    );
  }

  const now = new Date();
  await tx`
    UPDATE review_queue_entry
       SET status = 'resolved'::review_queue_status,
           resolved_at = ${now.toISOString()}::timestamptz,
           resolved_by = ${ctx.userId}::uuid,
           resolution_type = 'rejected',
           metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
           updated_at = now()
     WHERE id = ${rejEntry.id}::uuid
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
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/publishable-check.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/entity-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/__tests__/compliance.test.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/final-roles.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 638ms:
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

 succeeded in 669ms:
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

 succeeded in 669ms:
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

 succeeded in 651ms:
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
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=1 → cycle4=1

## cycle 3 patch 검증
- CAMC3-01: PASS — `approveContent`/`rejectContent` 모두 entry `content_type/content_ref`와 args 정합 검증 추가됨.

## new findings (있을 경우)
- CAMC4-01 major — [server-actions.ts](/abs/path/C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:147): entry↔args는 검증하지만 `review_queue_entry`↔`compliance_record`의 `content_type/content_ref` 정합은 검증하지 않음. 큐 row drift 시 record A 승인 슬롯을 채우면서 entity B 상태를 변경할 수 있음. approve/reject에서 record `content_ref`도 조회해 entry 및 args와 모두 일치 검증 필요.

## acceptance 판정
- CAMC3-01은 닫힘.
- 새 major 1건으로 아직 close 불가.
tokens used
42,261
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴 추세: cycle1=13 → cycle2=2 → cycle3=1 → cycle4=1

## cycle 3 patch 검증
- CAMC3-01: PASS — `approveContent`/`rejectContent` 모두 entry `content_type/content_ref`와 args 정합 검증 추가됨.

## new findings (있을 경우)
- CAMC4-01 major — [server-actions.ts](/abs/path/C:/Users/assag/solution/website-exposure/apps/web/src/lib/compliance/server-actions.ts:147): entry↔args는 검증하지만 `review_queue_entry`↔`compliance_record`의 `content_type/content_ref` 정합은 검증하지 않음. 큐 row drift 시 record A 승인 슬롯을 채우면서 entity B 상태를 변경할 수 있음. approve/reject에서 record `content_ref`도 조회해 entry 및 args와 모두 일치 검증 필요.

## acceptance 판정
- CAMC3-01은 닫힘.
- 새 major 1건으로 아직 close 불가.
