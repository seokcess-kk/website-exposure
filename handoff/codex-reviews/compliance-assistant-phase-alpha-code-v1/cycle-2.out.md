OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3ea8-ef2a-7131-8058-1e7a01c52fcb
--------
user
# Codex 자동 비평 요청 — compliance-assistant Phase Alpha code cycle 2

cycle 1 안 20 finding (major 13 · minor 7 · nit 0) 전건 수용 patch 완료. typecheck PASS · vitest 101/101 PASS. 잔여:
- CAP-CODE-20 spawn EPERM (codex 환경 문제 · closeable=false · 본 환경에선 PASS)

## cycle 1 patch 요약

- **CAP-CODE-01**: Ajv 안 schema validation 활성화 (root #/definitions/* $ref 해소 위해 definitions 통합 후 compile per file)
- **CAP-CODE-02·03·04**: entity-actions.ts 안 body/articleType/qaBlocks SELECT + Article articleType 전달 + Publication/MediaAppearance buildExternalCitationExemptEnvelope helper 신설
- **CAP-CODE-05·06**: exceptions.ts 안 finding span overlap + appliesTo.scopes 검증
- **CAP-CODE-07**: inline-flags.ts 안 false-positive 완화 시 flag 보존 + suppressedLevelUp 별도 추적 → RiskInference 격상 입력 안 제외
- **CAP-CODE-08**: ExtensionsRecord 필드명 SoT 정합 (evaluatedSteps · contributingSteps · suppressedLevelUpFlags 신설)
- **CAP-CODE-09·11**: server-actions.ts 중복 SQL 제거 + auto-gate helper 단일 경로 + 영업일 3일 SLA (auto-gate.ts calculateContentGateSla)
- **CAP-CODE-10**: entity-actions.ts 안 content-gate-queued audit event 추가 (source:"auto" payload)
- **CAP-CODE-12**: 4 wrapper mapComplianceErrorToResult helper 호출 (entity-actions.ts + review-queue/actions.ts)
- **CAP-CODE-13**: ApproveContentArgs · RejectContentArgs 안 entryId required + entry lookup 안 id 매칭
- **CAP-CODE-14·15**: approveContent 안 AND 게이트 (open siblings count == 0 시만 publishable 전이) + publishContent 안 open 큐 부재 assert
- **CAP-CODE-16·17·18**: meta.yaml/rules.medical-ad.yaml "11 신규" → "13 신규" · medical-law-tracking SoT 정합 (2026-Q2-medical-law-2026-04-07 + 시행령 2026-Q1) · MEDICAL_AD cascade marker "27 활성"
- **CAP-CODE-19**: phase-alpha.test.ts 안 auto-gate block 제외 · ExtensionsRecord 필드명 · notice articleType flag 보존 3 추가 scenarios

## 본 cycle 검증 우선순위

cycle 1 patch 정합성 + 잔여 결함 / 신규 결함. 누계 지적 수 cycle 1 (20) 대비 추가 감소 권장 (normal: cycle 2 = 5~10).

### cycle 1 patch 재검증
1. **CAP-CODE-01**: loader.ts:67~95 안 validators map 컴파일 + validateAgainstSchema 호출. schema.json 안 definitions 안 모든 sub-schema 안 정상 컴파일 검증
2. **CAP-CODE-02·03·04**: entity-actions.ts:60~106 안 entity별 body 컬럼 분기 + FAQ Q+A 결합 + qaBlocks + Article articleType + Publication/MediaAppearance buildExternalCitationExemptEnvelope 호출 분기
3. **CAP-CODE-05·06**: exceptions.ts:14~25 (scope 검증) + L60~85 (span overlap + 인접 threshold)
4. **CAP-CODE-07·08**: inline-flags.ts:72 (flagSet 항상 add + suppressedLevelUp 별도) + check.ts:243 (inferenceFlags filter) + types.ts:97 (evaluatedSteps · contributingSteps · suppressedLevelUpFlags)
5. **CAP-CODE-09·11**: server-actions.ts:140~141 안 enqueueContentGateIfNeeded 호출 단일 경로 (중복 SQL 제거)
6. **CAP-CODE-10**: entity-actions.ts:128~143 안 content-gate-queued audit emit
7. **CAP-CODE-12**: entity-actions.ts:159~162 + review-queue/actions.ts:100~103 안 mapComplianceErrorToResult 호출
8. **CAP-CODE-13**: server-actions.ts:172~187 (approveContent entry lookup) + L313~344 (rejectContent entry lookup) 안 args.entryId 매칭
9. **CAP-CODE-14·15**: server-actions.ts:275~298 (AND 게이트 - openSiblings count == 0) + L460~475 (publishContent - remainingOpen assert)
10. **CAP-CODE-16·17**: data/compliance-rules/ 안 13 신규 · MEDICAL_AD § 11.2 SoT 정합 (revisionId·sourceUrl·checkedAt 일치)

### 새로운 검증 영역

- **enqueueContentGateIfNeeded helper signature**: `(tx, ctx, envelope, recordId, contentType, contentRef) → { entryId }` - server-actions.ts 호출 인자 정합
- **buildExternalCitationExemptEnvelope vs buildLegalDocumentExemptEnvelope**: exemptReason 값 분리 (LegalDocument-CONTENT_STANDARDS-7.1.1.1 · ExternalCitation-CONTENT_STANDARDS-7.1.1.2)
- **action-errors.ts mapComplianceErrorToResult**: SaveResult shape `{ ok: false, fieldErrors: {}, formError }` - 호환 정합 (cycle 1 안 추가됨)
- **inline-flags.ts suppressedLevelUp 영향**: includes-event flag 만 v0.1 안 본 처리. 다른 flag 안 적용 안 함 - SoT 정합 (RISK_LEVELS § 5.1.2)
- **AND 게이트 - 동일 record 큐 카운트**: manual-review 1 + content-gate 1 동시 open 시 approve manual-review 안 entity 전이 안 함 + content-gate approve 후 양 큐 모두 resolved 시 entity 전이
- **vitest 101 scenarios**: 본 cycle 안 추가 scenarios 부재 시 cycle 2 안 acceptance 가능 (vitest 안정 통과)

### cycle 1 patch 잔여 영향
- CAP-CODE-18 docs cascade — MEDICAL_AD § 3.0 marker 안 "27 활성" 정합 확인
- CAP-CODE-20 vitest 환경 — 본 환경 안 PASS · codex 환경 안 spawn EPERM 미정 (closeable=false 유지)

## SoT (cycle 1 동일)

본 monorepo working root 에서 직접 파일을 읽어 코드와 대조. 추가 확인:
- `apps/web/src/lib/compliance/server-actions.ts` (전체 - cycle 1 안 4 곳 patch)
- `apps/web/src/lib/compliance/entity-actions.ts` (FAQ Q+A SELECT 안 question 컬럼 정합 · faq 실 schema)
- `apps/web/src/lib/compliance/check.ts` (suppressedLevelUp filter)
- `apps/web/src/lib/compliance/auto-gate.ts` (TenantContext from @glitzy/auth)
- `apps/web/src/lib/compliance/action-errors.ts` (SaveResult shape)
- `packages/compliance-rules/src/loader.ts` (Ajv 검증 활성화)
- `packages/compliance-rules/src/exceptions.ts` (span overlap)
- `packages/compliance-rules/src/inline-flags.ts` (suppressedLevelUp)
- `packages/compliance-rules/src/types.ts` (InlineRiskExtractionResult 안 suppressedLevelUp)
- `data/compliance-rules/medical-law-tracking.yaml` (MEDICAL_AD § 11.2 SoT 정합)

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: major=N minor=N nit=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 20 → cycle 2 = N

## major
## minor
## nit

=== CYCLE SIGNAL ===
cycle: 2
total_findings: <NN>
major: <N>
minor: <N>
nit: <N>
closeable_after_patch_ratio: <NN>%
ready_for_acceptance: true|false
scope_narrow_acceptable: true|false
recommendation: "acceptance 권장" 또는 "다음 cycle 진입 권장"
```

한국어로 응답. 산출물 외 어떤 prose 도 출력하지 말 것.

codex
요청 범위대로 cycle 1 패치가 실제 코드와 SoT에 맞게 닫혔는지 확인하겠습니다. 우선 지정 파일과 관련 테스트/스키마를 직접 읽어 결함 후보를 좁힙니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/check.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/entity-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/auto-gate.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 725ms:
// @glitzy/web/lib/compliance/auto-gate — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 12
// CA-DEFER-15 부분 해소 - submitForReview 트리거 한정 자동 큐 진입
// CAP-06 - block 콘텐츠 큐 진입 안 함
// CAP2-06 - event id 'content-gate-queued' + source: "auto"
// CAP-CODE-09 정정 - server-actions.ts 단일 경로 통합 (TenantContext from @glitzy/auth)

import type { ScopedTx } from "@glitzy/db";
import type { TenantContext } from "@glitzy/auth";
import type { ComplianceCheckEnvelope, ContentType } from "./types";

const SLA_BUSINESS_DAYS = 3; // REVIEW_WORKFLOW § 3.3

function calculateContentGateSla(now: Date = new Date()): Date {
  // 영업일 3일 - 토/일 제외 (간단 구현 · holiday 미고려)
  let added = 0;
  const result = new Date(now);
  while (added < SLA_BUSINESS_DAYS) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

export async function enqueueContentGateIfNeeded(
  tx: ScopedTx,
  ctx: TenantContext,
  envelope: ComplianceCheckEnvelope,
  recordId: string,
  contentType: ContentType,
  contentRef: string,
): Promise<{ entryId: string | null }> {
  // CAP-06 - block 콘텐츠 큐 진입 안 함
  if (!envelope.result.gateRequired || envelope.result.automatedDecision === "block") {
    return { entryId: null };
  }

  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
  const existing = await tx<{ id: string }[]>`
    SELECT id FROM review_queue_entry
    WHERE instance_id = ${ctx.instanceId}::uuid
      AND content_type = ${contentType}::compliance_content_type
      AND content_ref = ${contentRef}
      AND queue_type = 'content-gate'::review_queue_type
      AND status IN ('open', 'in-progress')
  `;
  if (existing.length > 0) return { entryId: existing[0]!.id };

  const requiredRoles = envelope.result.requiredApproverRoles ?? [];
  const slaDueAt = calculateContentGateSla();

  const inserted = await tx<{ id: string }[]>`
    INSERT INTO review_queue_entry (
      instance_id, queue_type, content_type, content_ref, compliance_record_id,
      status, priority, required_roles, sla_due_at
    ) VALUES (
      ${ctx.instanceId}::uuid,
      'content-gate'::review_queue_type,
      ${contentType}::compliance_content_type,
      ${contentRef},
      ${recordId}::uuid,
      'open'::review_queue_status,
      'P0'::review_queue_priority,
      ${requiredRoles}::approver_role[],
      ${slaDueAt}::timestamptz
    )
    RETURNING id
  `;

  return { entryId: inserted[0]!.id };
}

 succeeded in 772ms:
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
import { mapComplianceErrorToResult } from "./action-errors";
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
        // CAP-CODE-02·03 정정 - entity별 body + Article articleType + FAQ qaBlocks 조회.
        //   본 row select 안 contentType별 body 컬럼 명 분기 (body_markdown · question/answer · 등).
        const bodyColumn = (() => {
          if (contentType === "Article" || contentType === "TreatmentPage" || contentType === "LegalDocument") return "body_markdown";
          if (contentType === "FAQ") return "answer";   // FAQ 안 question 별도 조회
          if (contentType === "Publication") return "abstract";
          if (contentType === "MediaAppearance") return "summary";
          return null;
        })();
        const riskLevelSelect = (contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance") ? "NULL::text" : "risk_level::text";
        const articleTypeSelect = contentType === "Article" ? "article_type::text" : "NULL::text";
        const faqQuestionSelect = contentType === "FAQ" ? "question::text" : "NULL::text";
        const bodySelect = bodyColumn ? `${bodyColumn}::text` : "NULL::text";
        const rows = await tx.unsafe<{ status: string; risk_level: string | null; body: string | null; article_type: string | null; faq_question: string | null }[]>(`
          SELECT status::text AS status,
                 ${riskLevelSelect} AS risk_level,
                 ${bodySelect} AS body,
                 ${articleTypeSelect} AS article_type,
                 ${faqQuestionSelect} AS faq_question
            FROM ${table}
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
           FOR UPDATE
        `);
        if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
        // FAQ 안 Q+A 결합 body + qa block scope 입력
        const row = rows[0]!;
        let body = row.body ?? "";
        let qaBlocks: Array<{ question: string; answer: string; offsetStart: number }> | undefined;
        if (contentType === "FAQ" && row.faq_question) {
          body = `${row.faq_question}\n\n${row.body ?? ""}`;
          qaBlocks = [{ question: row.faq_question, answer: row.body ?? "", offsetStart: 0 }];
        }
        const out = await submitForReview(tx, ctx, {
          contentType,
          contentRef,
          contentRow: {
            status: row.status,
            risk_level: row.risk_level,
            body,
            articleType: row.article_type ?? undefined,
            qaBlocks,
          },
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
        // CAP-CODE-10 정정 - content-gate 큐 진입 시 별도 audit emit (REVIEW_WORKFLOW § 9.1.1 정합 · source:"auto")
        if (result.out.contentGateEntryId) {
          await emitAuditEvent(sqlBase, {
            eventType: "content-gate-queued",
            actorUserId: result.ctx.userId,
            targetUserId: result.ctx.userId,
            toInstanceId: result.ctx.instanceId,
            payload: {
              contentType,
              contentRef,
              recordId: result.out.recordId,
              entryId: result.out.contentGateEntryId,
              finalRoles: result.out.finalRoles,
              source: "auto",
            },
          });
        }
      } catch (err) {
        console.error("[submitForReviewAction] audit emit failed", err);
      }
      revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
      // LWI-02 정정: LegalDocument 는 clinic-profile 통합 화면 안에 mount 됨 (별 edit route 없음)
      if (contentType === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      revalidatePath(`/admin/${instanceSlug}/review-queue`);
      revalidatePath(`/admin/${instanceSlug}`);
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로 (3 error type 일관)
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
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
      if (contentType === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      return { ok: true, slug: contentRef };
    }
    return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로 (3 error type 일관)
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
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

 succeeded in 789ms:
// @glitzy/web/lib/compliance/check — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 7 (cycle 1~7 acceptance)
// M0 stub 완전 재작성 - 9단계 풀 흐름 (CA-DEFER-01 부분 해소 + CA-DEFER-02·11·15 해소)

import {
  getCachedCatalog,
  matchRules,
  evaluateInline,
  inferRisk,
  evaluateSlots,
  maxRisk,
} from "@glitzy/compliance-rules";
import type {
  Finding as CrFinding,
  RiskLevel as CrRiskLevel,
  InlineRiskFlag as CrInlineRiskFlag,
} from "@glitzy/compliance-rules";

import type {
  ApproverRole,
  ComplianceCheckEnvelope,
  ComplianceCheckInput,
  ComplianceCheckResult,
  ExtensionsRecord,
  Finding,
  InferenceStep,
  RiskLevel,
} from "./types.js";
import { ComplianceConfigError } from "./types.js";
import { calculateFinalRoles } from "./final-roles.js";

const M0_LEGAL_EXEMPT_REASON = "LegalDocument-CONTENT_STANDARDS-7.1.1.1";
const EXTERNAL_CITATION_EXEMPT_REASON = "ExternalCitation-CONTENT_STANDARDS-7.1.1.2";

/**
 * CAP-CODE-04 정정 - Publication / MediaAppearance 외부 인용 entity 면제 envelope.
 *   CONTENT_STANDARDS § 7.1.1.2 매트릭스 - RiskRule + RiskInference + answer-first + 표현 검사 모두 면제.
 *   submitForReview 안 contentType ∈ {Publication, MediaAppearance} 분기에서 본 helper 호출.
 */
export function buildExternalCitationExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  const pageRiskLevel = maxRiskLevel(
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
      catalogVersion: "exempt",
      catalogHash: "exempt",
      manualReview: false,
      exemptReason: EXTERNAL_CITATION_EXEMPT_REASON,
    },
  };
}

/**
 * LegalDocument 면제 envelope (M0 유지). check() 호출 자체 우회.
 *   submitForReview 가 contentType==='LegalDocument' 분기에서 본 helper 호출.
 *   extensions 영역 부재 (Legal exempt - 룰 매칭 안 함).
 */
export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
  const pageRiskLevel = maxRiskLevel(
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
      catalogVersion: "exempt",
      catalogHash: "exempt",
      manualReview: false,
      exemptReason: M0_LEGAL_EXEMPT_REASON,
    },
  };
}

function maxRiskLevel(a: RiskLevel, b: RiskLevel, c: RiskLevel): RiskLevel {
  const ORDER: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };
  let max: RiskLevel = a;
  if (ORDER[b] > ORDER[max]) max = b;
  if (ORDER[c] > ORDER[max]) max = c;
  return max;
}

function derivePageTypeId(contentType: ComplianceCheckInput["contentType"]): string | undefined {
  const map: Record<string, string | undefined> = {
    Article: "P-010",
    TreatmentPage: "P-006",
    FAQ: "P-011",
    LegalDocument: "P-013",
    Publication: undefined,
    MediaAppearance: undefined,
    ClinicProfile: "P-002",
    DoctorProfile: "P-004",
    LocationProfile: "P-014",
    MedicalConditionPage: "P-008",
    ReviewPolicy: undefined,
    PricingPage: "P-102",
    FacilitiesPage: "P-103",
    NewsItem: "P-104",
    ReservationPage: "P-105",
    ArticleCategory: undefined,
    Feature: undefined,
  };
  return map[contentType];
}

function buildUnreviewedAdFinding(): Finding {
  return {
    ruleId: "unreviewed-ad-001",
    category: "미심의 광고",
    pattern: "(meta:priorReviewRequired)",
    severity: "warning",
    location: { start: 0, end: 0 },
    requiredApproverRoles: ["legal"],
    triggeredBy: "static-rule",
    legalBasis: ["medical-law-art56-para2-no11"],
  };
}

function buildHighGateFinding(input: ComplianceCheckInput): Finding {
  const triggeredBy: "explicit" | "inferred" =
    input.metadata.explicitRiskLevel === "High" ? "explicit" : "inferred";
  const articleType = input.metadata.articleType;
  let requiredApproverRoles: ApproverRole[] = ["medical"];
  if (articleType === "review-case") requiredApproverRoles = ["medical", "legal"];
  else if (articleType === "event-price") requiredApproverRoles = ["legal"];
  return {
    ruleId: "risk-level-high-gate",
    category: "위험도 강제 검수",
    pattern: "(RiskLevel=High)",
    severity: "content-gate",
    location: { start: 0, end: 0 },
    requiredApproverRoles,
    triggeredBy,
    legalBasis: [],
  };
}

function extractFindingRoles(findings: Finding[]): string[] {
  const all: string[] = [];
  for (const f of findings) {
    const roles = f.requiredApproverRoles;
    if (!Array.isArray(roles)) continue;
    for (const r of roles) {
      if (typeof r === "string" && r.length > 0) all.push(r);
    }
  }
  return Array.from(new Set(all));
}

function aggregate(findings: Finding[]): {
  automatedDecision: ComplianceCheckResult["automatedDecision"];
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  bySeverity: ComplianceCheckResult["findingsBySeverity"];
} {
  const counts = { fail: 0, "content-gate": 0, warning: 0, info: 0 };
  for (const f of findings) counts[f.severity]++;
  const buildBlocked = counts.fail > 0;
  const gateRequired = counts["content-gate"] > 0;
  const hasWarnings = counts.warning > 0;
  let automatedDecision: ComplianceCheckResult["automatedDecision"] = "pass";
  if (buildBlocked) automatedDecision = "block";
  else if (gateRequired) automatedDecision = "gate";
  else if (hasWarnings) automatedDecision = "warn";
  return { automatedDecision, buildBlocked, gateRequired, hasWarnings, bySeverity: counts };
}

function adaptCrFinding(f: CrFinding): Finding {
  return {
    ruleId: f.ruleId,
    category: f.category,
    pattern: f.pattern,
    severity: f.severity,
    location: f.location,
    suggestion: f.suggestion,
    requiredApproverRoles: f.requiredApproverRoles?.filter(
      (r): r is ApproverRole => r === "operator" || r === "medical" || r === "legal",
    ),
    triggeredBy: f.triggeredBy,
    legalBasis: f.legalBasis,
    llmAssistMeta: f.llmAssistMeta,
  };
}

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  const startMs = Date.now();

  // 1. LegalDocument 진입 차단 (M0 유지)
  if (input.contentType === "LegalDocument") {
    throw new ComplianceConfigError(
      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
        "Use buildLegalDocumentExemptEnvelope() instead.",
    );
  }

  // 2. pageTypeId 유도
  const pageTypeId = input.metadata.pageTypeId ?? derivePageTypeId(input.contentType);
  if (!pageTypeId) {
    throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);
  }

  // 3. articleType 검증
  if (input.contentType === "Article" && !input.metadata.articleType) {
    throw new ComplianceConfigError("Article 은 articleType required");
  }

  // 4. 카탈로그 로드 (메모리 캐시 · fail closed)
  const catalog = await getCachedCatalog();

  // 5. RiskRule 매칭
  const matchResult = matchRules(
    input.body,
    catalog.rules,
    catalog.contextExceptions,
    {
      contentType: input.contentType,
      pageTypeId,
      articleType: input.metadata.articleType,
      qaBlocks: input.metadata.qaBlocks,
    },
    catalog.kssAvailable,
  );
  const crFindings = matchResult.findings.map(adaptCrFinding);

  // 6. inlineRiskFlags 추출
  const inlineFlagResult = evaluateInline(input.body, matchResult.findings, {
    contentType: input.contentType,
    pageTypeId,
    articleType: input.metadata.articleType,
    legalDocumentType: input.metadata.legalDocumentType,
    locationProfileField: input.metadata.locationProfileField,
    reviewPolicy: input.metadata.reviewPolicy,
    mediaAttachments: input.metadata.mediaAttachments,
  });

  // 7. slotMatches 계산 (v0.1 항상 빈 배열)
  const slotMatches = evaluateSlots(
    { pageTypeId, body: input.body, entityFields: input.metadata.entityFields },
    catalog.slotMatches,
  );

  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
  // CAP-CODE-07 정정 - suppressedLevelUp flag 는 RiskInference 입력 안 제외 (격상만 회피 · evidence 안 보존)
  const inferenceFlags = inlineFlagResult.inlineRiskFlags.filter(
    (f) => !inlineFlagResult.suppressedLevelUp.includes(f),
  ) as CrInlineRiskFlag[];
  const inference = inferRisk({
    pageTypeId,
    articleType: input.metadata.articleType,
    inlineRiskFlags: inferenceFlags,
    slotMatches,
    explicitRiskLevel: input.metadata.explicitRiskLevel as CrRiskLevel | undefined,
  });

  // 9. 외부 inferredRiskLevel 입력 MAX 결합 (CAP-11)
  let finalRiskLevel: RiskLevel = inference.inferredRiskLevel;
  let inferredRiskLevelMismatch: ExtensionsRecord["inferredRiskLevelMismatch"] | undefined;
  if (input.metadata.inferredRiskLevel) {
    finalRiskLevel = maxRisk(inference.inferredRiskLevel, input.metadata.inferredRiskLevel);
    if (input.metadata.inferredRiskLevel !== inference.inferredRiskLevel) {
      inferredRiskLevelMismatch = {
        external: input.metadata.inferredRiskLevel,
        internal: inference.inferredRiskLevel,
        final: finalRiskLevel,
      };
    }
  }

  // 10. High 가상 finding 주입
  const allFindings: Finding[] = [...crFindings];
  if (finalRiskLevel === "High") {
    allFindings.push(buildHighGateFinding(input));
  }

  // 11. priorReviewRequired 메타 검사 (§ 7.3)
  if (input.metadata.priorReviewRequired === true && input.metadata.priorReviewPassed !== true) {
    allFindings.push(buildUnreviewedAdFinding());
  }

  // 12. severity 집계
  const aggregated = aggregate(allFindings);

  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 positional)
  const findingRoles = extractFindingRoles(allFindings);
  const clientRolePresent = findingRoles.includes("client");
  const findingRolesWithoutClient = findingRoles.filter((r) => r !== "client");
  // calculateFinalRoles throw 시 - check() bubble · 호출자 try/catch boundary (CAP3-01 · § 7.1.2)
  const runtimeRoles = calculateFinalRoles(
    input.contentType,
    finalRiskLevel,
    input.metadata.priorReviewRequired ?? false,
    findingRolesWithoutClient,
  );

  const elapsedMs = Date.now() - startMs;
  const categoryCounts: Record<string, number> = {};
  for (const f of crFindings) {
    categoryCounts[f.category] = (categoryCounts[f.category] ?? 0) + 1;
  }

  return {
    result: {
      automatedDecision: aggregated.automatedDecision,
      buildBlocked: aggregated.buildBlocked,
      gateRequired: aggregated.gateRequired,
      hasWarnings: aggregated.hasWarnings,
      findingsBySeverity: aggregated.bySeverity,
      requiredApproverRoles: runtimeRoles,
      findings: allFindings,
    },
    meta: {
      pageRiskLevel: finalRiskLevel,
      catalogVersion: catalog.catalogVersion,
      catalogHash: catalog.catalogHash,
      manualReview: false,
    },
    extensions: {
      suppressedByContextExceptions: matchResult.suppressedFindings.map((sf) => ({
        finding: adaptCrFinding(sf.finding),
        suppressedBy: sf.suppressedBy,
        reason: sf.reason,
      })),
      inlineRiskFlagsEvidence: inlineFlagResult.evidence as ExtensionsRecord["inlineRiskFlagsEvidence"],
      // CAP-CODE-08 정정 - SoT 필드명
      evaluatedSteps: inference.evaluatedSteps as InferenceStep[],
      contributingSteps: inference.contributingSteps as InferenceStep[],
      ruleMatchStats: { categoryCounts, elapsedMs },
      inferredRiskLevelMismatch,
      clientRolePresent,
      // CAP-CODE-07 - false-positive 완화 flag 보존 영역
      suppressedLevelUpFlags: inlineFlagResult.suppressedLevelUp as ExtensionsRecord["suppressedLevelUpFlags"],
      engineMetadata: {
        catalogVersion: catalog.catalogVersion,
        catalogHash: catalog.catalogHash,
        schemaHash: catalog.schemaHash,
        engineVersion: catalog.engineVersion,
        kssAvailable: catalog.kssAvailable,
      },
    },
  };
}

 succeeded in 792ms:
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
import { check, buildLegalDocumentExemptEnvelope, buildExternalCitationExemptEnvelope } from "./check";
import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
import { evaluatePublishable } from "./publishable-check";
import { assertReviewerEligibility } from "./eligibility";
import { enqueueContentGateIfNeeded } from "./auto-gate";

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
  // CAP-CODE-02 정정 - entity별 본문 + FAQ Q/A + Article articleType 전달.
  contentRow: {
    status: string;
    risk_level?: string | null;
    body?: string;
    articleType?: string;   // CAP-CODE-03 - Article 만 사용
    qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;   // CAP-CODE-02 - FAQ 만 사용
  };
};

export type SubmitForReviewResult = {
  recordId: string;
  entryId: string;
  finalRoles: ApproverRole[];   // CAMC-07/10
  pageRiskLevel: "Low" | "Medium" | "High";
  contentGateEntryId: string | null;   // CA-DEFER-15 부분 해소 - Phase Alpha auto-gate (CAP-06·07)
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
      // CAP-CODE-03 정정 - Article 안 articleType 전달
      articleType: args.contentRow.articleType,
      // CAP-CODE-02 정정 - FAQ 안 Q/A 결합 + qa block scope
      qaBlocks: args.contentRow.qaBlocks,
    },
  };
  // CAP-CODE-04 정정 - 외부 인용 entity (Publication / MediaAppearance) exempt 처리
  let envelope: ComplianceCheckEnvelope;
  if (args.contentType === "LegalDocument") {
    envelope = buildLegalDocumentExemptEnvelope(checkInput);
  } else if (args.contentType === "Publication" || args.contentType === "MediaAppearance") {
    envelope = buildExternalCitationExemptEnvelope(checkInput);
  } else {
    envelope = await check(checkInput);
  }

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
      ${JSON.stringify({ ...envelope.result, extensions: envelope.extensions ?? null })}::jsonb,
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

  // CAP-CODE-09·10·11 정정 - auto-gate helper 단일 경로 통합 (server-actions 중복 SQL 제거 · 영업일 3일 SLA · content-gate-queued audit emit 별도 wrapper)
  const gateResult = await enqueueContentGateIfNeeded(tx, ctx, envelope, recordId, args.contentType, args.contentRef);
  const contentGateEntryId: string | null = gateResult.entryId;

  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel, contentGateEntryId };
}

export type ApproveContentArgs = {
  recordId: string;
  role: ApproverRole;
  contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
  contentRef: string;
  // CAP-CODE-13 정정 - 호출자가 선택한 entry 만 잠금 + 처리. manual-review · content-gate 동시 open 가능.
  entryId: string;
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
  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 호출자가 잠금 entry 결정.
  const entryRows = await tx<{ id: string; status: string; queue_type: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, status::text AS status, queue_type::text AS queue_type, assigned_to, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${args.entryId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError(`Queue entry ${args.entryId} not found or already resolved`);
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

  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
           peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
           legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
           auto_check_result
      FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
     FOR UPDATE
  `;
  if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  const record = recordRows[0]!;
  // CAMC4-01 정정: record vs entry vs args 모두 정합 검증 (drift 차단).
  if (record.content_type !== entry.content_type || record.content_ref !== entry.content_ref) {
    throw new ComplianceTransitionError(
      `Record vs entry content mismatch: record=${record.content_type}/${record.content_ref}, entry=${entry.content_type}/${entry.content_ref}`,
    );
  }
  if (record.content_type !== expectedContentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${expectedContentType}/${args.contentRef}`,
    );
  }

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

    // CAP-CODE-14 정정 - AND 게이트 - 동일 record 의 모든 open/in-progress 큐 entry 가 resolved 되어야만 publishable 전이
    //   manual-review + content-gate 동시 open 시 둘 다 resolved 후 publishable.
    const openSiblings = await tx<{ cnt: string }[]>`
      SELECT count(*)::text AS cnt
        FROM review_queue_entry
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND compliance_record_id = ${args.recordId}::uuid
         AND status IN ('open', 'in-progress')
    `;
    const remainingOpen = Number(openSiblings[0]?.cnt ?? "0");
    if (remainingOpen === 0) {
      // 모든 큐 resolved - publishable evaluator pass 시 publishable, 아니면 approved
      const publishable = evaluatePublishable(record, record.content_type as ContentType);
      const targetStatus = publishable.publishable ? "publishable" : "approved";
      await tx.unsafe(`
        UPDATE ${args.contentTable}
           SET status = '${targetStatus}'::content_publication_status,
               updated_at = now()
         WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
      `);
    }
    // remainingOpen > 0 인 경우 - entity status 변경 안 함 (in-review 유지 · 다른 큐 처리 대기)
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
  entryId: string;   // CAP-CODE-13 정정
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
  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 엉뚱한 큐 처리 회피.
  const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
    SELECT id, required_roles::text[] AS required_roles,
           content_type::text AS content_type, content_ref
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${args.entryId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
     FOR UPDATE
  `;
  if (entryRows.length === 0) throw new ComplianceTransitionError(`Queue entry ${args.entryId} not found or already resolved`);
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
  // CAMC4-01 정정: record vs entry vs args 정합 추가 검증.
  const recRejRows = await tx<{ content_type: string; content_ref: string }[]>`
    SELECT content_type::text AS content_type, content_ref FROM compliance_record
     WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
  `;
  if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
  if (recRejRows[0]!.content_type !== expectedRejContentType || recRejRows[0]!.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${recRejRows[0]!.content_type}/${recRejRows[0]!.content_ref}, args=${expectedRejContentType}/${args.contentRef}`,
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
  const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string; record_phase: string; record_version: number })[]>`
    SELECT id, content_type::text AS content_type, content_ref,
           page_risk_level::text AS page_risk_level,
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
  // CAMC4-01 정정: record vs args 정합 검증
  if (record.content_type !== args.contentType || record.content_ref !== args.contentRef) {
    throw new ComplianceTransitionError(
      `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${args.contentType}/${args.contentRef}`,
    );
  }

  const publishable = evaluatePublishable(record, args.contentType);
  if (!publishable.publishable) {
    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
  }

  // CAP-CODE-15 정정 - 발행 전 동일 record 의 open/in-progress 큐 entry 부재 검증.
  //   manual-review · content-gate 큐 중 1+ 가 open 이면 publish 차단.
  const openEntries = await tx<{ cnt: string }[]>`
    SELECT count(*)::text AS cnt
      FROM review_queue_entry
     WHERE instance_id = ${ctx.instanceId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
  `;
  const remainingOpen = Number(openEntries[0]?.cnt ?? "0");
  if (remainingOpen > 0) {
    throw new ComplianceTransitionError(`Cannot publish - ${remainingOpen} open queue entry remaining (AND gate)`);
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

codex
초기 확인에서 AND 게이트와 auto-gate 경로는 실제로 단일화되어 있습니다. 이제 룰 로더/예외/inline flag와 액션 래퍼의 타입 호환성, 데이터 SoT를 대조합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/compliance-rules/src/loader.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/compliance-rules/src/exceptions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/compliance-rules/src/inline-flags.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/compliance-rules/src/types.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/action-errors.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/review-queue/actions.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 871ms:
// @glitzy/compliance-rules — loader
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 3 (CAP-02·26 - catalogHash/schemaHash 분리)

import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";

/**
 * monorepo root 자동 검색 - process.cwd() 부터 상향 데이터/compliance-rules/meta.yaml 존재 확인.
 *   apps/web 안 vitest 실행 시 process.cwd()=apps/web 라서 ../.. 검색 필요.
 */
async function findCatalogRoot(startDir: string): Promise<string> {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    const candidate = resolve(dir, "data", "compliance-rules", "meta.yaml");
    try {
      await access(candidate);
      return resolve(dir, "data", "compliance-rules");
    } catch {
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  throw new ComplianceCatalogError(`catalog root not found - searched from ${startDir}`);
}
import { parse as parseYaml } from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

import type {
  ContentScope,
  ContextException,
  LoadedCatalog,
  MedicalLawRevision,
  RiskRule,
  RiskRuleOverride,
  SlotMatchDefinition,
} from "./types.js";
import { computeCatalogHash, computeSchemaHash, type HashableFile } from "./hash.js";
import { isKssAvailable } from "./kss.js";

const ENGINE_VERSION = "1.0.0";

export class ComplianceCatalogError extends Error {
  override readonly name = "ComplianceCatalogError";
}

type RulesFileShape = {
  version: string;
  sourceDoc?: string;
  sourceDocVersion?: string;
  rules?: RiskRule[];
  overrides?: RiskRuleOverride[];
};

type ContextExceptionsFileShape = {
  version: string;
  exceptions: ContextException[];
};

type MedicalLawTrackingFileShape = {
  version: string;
  revisions: MedicalLawRevision[];
};

type SlotMatchesFileShape = {
  version: string;
  slots: SlotMatchDefinition[];
};

type MetaFileShape = {
  catalogVersion: string;
  medicalLawRevisionRef: string;
  loadOrder: {
    rules: string[];
    contextExceptions: string[];
    tracking: string[];
    slotMatches: string[];
  };
  files?: Record<string, { version: string; description?: string }>;
};

export async function loadCatalog(opts?: { rootDir?: string }): Promise<LoadedCatalog> {
  const rootDir = opts?.rootDir ?? (await findCatalogRoot(process.cwd()));

  // 1. meta.yaml 먼저 로드
  const metaContent = await readFile(resolve(rootDir, "meta.yaml"), "utf-8");
  const meta = parseYaml(metaContent) as MetaFileShape;

  // 2. schema.json 로드
  const schemaContent = await readFile(resolve(rootDir, "schema.json"), "utf-8");

  // 3. AJV 초기화 + schema 컴파일 (CAP-CODE-01 정정 - 실 검증 활성화)
  //   schema.json 안 #/definitions/* 참조 해소 위해 root schema 자체를 addSchema 안 등록 + $id 별 getSchema 호출.
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  let schemaJson: { files?: Record<string, unknown>; definitions?: Record<string, unknown> };
  try {
    schemaJson = JSON.parse(schemaContent) as { files?: Record<string, unknown>; definitions?: Record<string, unknown> };
  } catch (e) {
    throw new ComplianceCatalogError(`schema.json parse failed: ${(e as Error).message}`);
  }
  const schemaFiles = schemaJson.files ?? {};
  // CAP-CODE-01 - 각 파일 sub-schema 안 $id 부여 + root schema 안 definitions 통합 후 compile
  const validators = new Map<string, ReturnType<typeof ajv.compile>>();
  for (const [key, schemaDef] of Object.entries(schemaFiles)) {
    try {
      const combined = {
        ...(schemaDef as object),
        definitions: schemaJson.definitions ?? {},
      };
      validators.set(key, ajv.compile(combined));
    } catch (e) {
      // schema 컴파일 실패 - warning 로깅하되 fail closed 안 함 (v0.1 안 schema 자체 결함 회피)
      console.warn(`[compliance-rules] schema ${key} compile failed: ${(e as Error).message}`);
    }
  }
  function validateAgainstSchema(filename: string, schemaKey: string, data: unknown): void {
    const validate = validators.get(schemaKey);
    if (!validate) return;
    if (!validate(data)) {
      const errors = (validate.errors ?? []).map((err) => `${err.instancePath} ${err.message}`).join(" · ");
      throw new ComplianceCatalogError(`${filename} schema validation failed: ${errors}`);
    }
  }

  // 4. meta.yaml 검증 + 각 파일 로드 + 검증 (CAP-CODE-01)
  validateAgainstSchema("meta.yaml", "metaFile", meta);

  const warnings: string[] = [];
  const hashableFiles: HashableFile[] = [{ name: "meta.yaml", content: metaContent }];
  const allRules: RiskRule[] = [];
  const allOverrides: RiskRuleOverride[] = [];

  for (const ruleFile of meta.loadOrder.rules) {
    const content = await readFile(resolve(rootDir, ruleFile), "utf-8");
    hashableFiles.push({ name: ruleFile, content });
    const data = parseYaml(content) as RulesFileShape;
    validateAgainstSchema(ruleFile, "rulesFile", data);
    if (data.rules) allRules.push(...data.rules);
    if (data.overrides) allOverrides.push(...data.overrides);
  }

  const contextExceptions: ContextException[] = [];
  for (const exFile of meta.loadOrder.contextExceptions) {
    const content = await readFile(resolve(rootDir, exFile), "utf-8");
    hashableFiles.push({ name: exFile, content });
    const data = parseYaml(content) as ContextExceptionsFileShape;
    validateAgainstSchema(exFile, "contextExceptionsFile", data);
    contextExceptions.push(...data.exceptions);
  }

  const medicalLawTracking: MedicalLawRevision[] = [];
  for (const trackingFile of meta.loadOrder.tracking) {
    const content = await readFile(resolve(rootDir, trackingFile), "utf-8");
    hashableFiles.push({ name: trackingFile, content });
    const data = parseYaml(content) as MedicalLawTrackingFileShape;
    validateAgainstSchema(trackingFile, "medicalLawTrackingFile", data);
    medicalLawTracking.push(...data.revisions);
  }

  const slotMatches: SlotMatchDefinition[] = [];
  for (const slotFile of meta.loadOrder.slotMatches) {
    const content = await readFile(resolve(rootDir, slotFile), "utf-8");
    hashableFiles.push({ name: slotFile, content });
    const data = parseYaml(content) as SlotMatchesFileShape;
    validateAgainstSchema(slotFile, "slotMatchesFile", data);
    if (data.slots) slotMatches.push(...data.slots);
  }

  // 5. overrides 머지 (RISK_LEVELS § 3.4.2)
  const mergedRules = mergeOverrides(allRules, allOverrides);

  // 6. id 중복 검증
  const idSet = new Set<string>();
  for (const r of mergedRules) {
    if (idSet.has(r.id)) {
      throw new ComplianceCatalogError(`duplicate RiskRule.id: ${r.id}`);
    }
    idSet.add(r.id);
  }

  // 7. field/block/feature scope 룰 skip + warning (CAP-23·24)
  const filteredRules = mergedRules.filter((rule) => {
    for (const s of rule.scope) {
      if (s.type === "field") {
        warnings.push(`rule ${rule.id} skipped — field scope unsupported (CA-DEFER-20)`);
        return false;
      }
      if (s.type === "block" && s.blockType !== "qa") {
        warnings.push(`rule ${rule.id} skipped — block scope ${s.blockType} unsupported (CA-DEFER-21)`);
        return false;
      }
      if (s.type === "feature") {
        warnings.push(`rule ${rule.id} skipped — feature scope unsupported (CA-DEFER-16)`);
        return false;
      }
    }
    return true;
  });

  // 8. client role 등록 룰 warning (CAP-15)
  for (const rule of filteredRules) {
    if (rule.requiredApproverRoles?.includes("client")) {
      warnings.push(`rule ${rule.id} contains client role (CA-DEFER-10) — runtime queue unavailable`);
    }
  }

  // 9. 해시 산정
  const catalogHash = computeCatalogHash(hashableFiles);
  const schemaHash = computeSchemaHash(schemaContent);
  const kssAvailable = isKssAvailable();

  return {
    rules: filteredRules,
    contextExceptions,
    slotMatches,
    medicalLawTracking,
    catalogVersion: meta.catalogVersion,
    catalogHash,
    schemaHash,
    engineVersion: ENGINE_VERSION,
    kssAvailable,
    warnings,
  };
}

function mergeOverrides(rules: RiskRule[], overrides: RiskRuleOverride[]): RiskRule[] {
  if (overrides.length === 0) return rules;

  // override targetRuleId 중복 검증
  const overrideMap = new Map<string, RiskRuleOverride>();
  for (const ov of overrides) {
    if (overrideMap.has(ov.targetRuleId)) {
      throw new ComplianceCatalogError(`duplicate override for: ${ov.targetRuleId}`);
    }
    overrideMap.set(ov.targetRuleId, ov);
  }

  const result: RiskRule[] = [];
  for (const rule of rules) {
    const ov = overrideMap.get(rule.id);
    if (!ov) {
      result.push(rule);
      continue;
    }
    // patch 적용 - 스칼라/배열 전체 교체 · 객체 deep merge 안 함 (배열 union 아님)
    const merged: RiskRule = { ...rule, ...(ov.patch as Partial<RiskRule>) } as RiskRule;
    result.push(merged);
    overrideMap.delete(rule.id);
  }
  // target 매칭 안 된 override 검증
  for (const [targetId] of overrideMap) {
    throw new ComplianceCatalogError(`override target not found: ${targetId}`);
  }
  return result;
}

// in-memory 캐시
let cachedCatalog: LoadedCatalog | null = null;
let cachedRootDir: string | null = null;

export async function getCachedCatalog(opts?: { rootDir?: string }): Promise<LoadedCatalog> {
  const rootDir = opts?.rootDir ?? (await findCatalogRoot(process.cwd()));
  if (cachedCatalog && cachedRootDir === rootDir) return cachedCatalog;
  cachedCatalog = await loadCatalog({ rootDir });
  cachedRootDir = rootDir;
  return cachedCatalog;
}

export function clearCatalogCache(): void {
  cachedCatalog = null;
  cachedRootDir = null;
}

 succeeded in 806ms:
// @glitzy/compliance-rules — exceptions
// SoT: docs/features/compliance-assistant.md § 4.4 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 5
// CAP-17 정정 - finding span overlap + fail composite 예외 미적용
// CAP-CODE-05·06 정정 - exception span overlap 정확 검사 + appliesTo.scopes 검증

import type { ContentScope, ContextException, Finding, RiskRule, SuppressedFinding } from "./types.js";
import { matchSimple } from "./matcher-simple.js";
import { splitWithOffsets } from "./composite.js";

const SPAN_NEAR_THRESHOLD = 30; // CAP-17 - 같은 문장 + finding span 인접 30 chars

// CAP-CODE-06 정정 - finding scope 가 exception scope 와 일치하는지 검증
function exceptionScopeMatches(exScopes: ContentScope[] | undefined, finding: Finding, ruleScopes: ContentScope[]): boolean {
  if (!exScopes || exScopes.length === 0) return true;   // 미명시 시 전체 적용
  return exScopes.some((exScope) => {
    if (exScope.type === "global") return true;
    return ruleScopes.some((ruleScope) => {
      if (ruleScope.type !== exScope.type) return false;
      if (exScope.type === "pageType" && ruleScope.type === "pageType") return ruleScope.pageTypeId === exScope.pageTypeId;
      if (exScope.type === "articleType" && ruleScope.type === "articleType") return ruleScope.articleType === exScope.articleType;
      return ruleScope.type === exScope.type;   // global · block · field · feature 단순 type 일치
    });
  });
}

export function applyContextExceptions(
  body: string,
  findings: Finding[],
  exceptions: ContextException[],
  kssAvailable: boolean,
  rules: RiskRule[],
): { kept: Finding[]; suppressed: SuppressedFinding[] } {
  const sentences = splitWithOffsets(body, kssAvailable);
  const ruleMap = new Map(rules.map((r) => [r.id, r]));

  const kept: Finding[] = [];
  const suppressed: SuppressedFinding[] = [];

  for (const finding of findings) {
    // CAP-17 - fail composite 룰은 예외 미적용 (안전 보장)
    const rule = ruleMap.get(finding.ruleId);
    if (rule && rule.patternType === "composite" && finding.severity === "fail") {
      kept.push(finding);
      continue;
    }

    // 1. ContextException[] 필터 - category OR ruleId 매칭
    const applicableExceptions = exceptions.filter((ex) => {
      const categoryHit = ex.appliesTo.categories?.includes(finding.category) ?? false;
      const ruleIdHit = ex.appliesTo.ruleIds?.includes(finding.ruleId) ?? false;
      return categoryHit || ruleIdHit;
    });

    if (applicableExceptions.length === 0) {
      kept.push(finding);
      continue;
    }

    // 2. finding 안 포함된 문장 찾기
    const containingSentence = sentences.find(
      (s) => finding.location.start >= s.start && finding.location.end <= s.end,
    );

    let suppressedBy: { ex: ContextException } | null = null;
    for (const ex of applicableExceptions) {
      // CAP-CODE-06 - exception scope 검증
      if (!exceptionScopeMatches(ex.appliesTo.scopes, finding, rule?.scope ?? [])) continue;

      // CAP-CODE-05 정정 - exception span 을 본문 offset 으로 복원 → finding span overlap 또는 인접 threshold 검사
      const searchRange = containingSentence
        ? { offset: containingSentence.start, text: body.slice(containingSentence.start, containingSentence.end) }
        : {
            offset: Math.max(0, finding.location.start - SPAN_NEAR_THRESHOLD),
            text: body.slice(
              Math.max(0, finding.location.start - SPAN_NEAR_THRESHOLD),
              Math.min(body.length, finding.location.end + SPAN_NEAR_THRESHOLD),
            ),
          };
      const matches = matchSimple(searchRange.text, {
        pattern: ex.pattern,
        patternType: ex.patternType,
      });
      // 각 exception match span → 원본 body offset 복원 → finding span overlap/인접 검사
      const matchedSuppressing = matches.some((m) => {
        const exStart = searchRange.offset + m.start;
        const exEnd = searchRange.offset + m.end;
        // overlap - 두 영역이 겹치는 경우
        const overlap = exStart < finding.location.end && exEnd > finding.location.start;
        // 인접 - threshold 안
        const distance = Math.min(
          Math.abs(exStart - finding.location.end),
          Math.abs(exEnd - finding.location.start),
        );
        return overlap || distance <= SPAN_NEAR_THRESHOLD;
      });
      if (matchedSuppressing) {
        suppressedBy = { ex };
        break;
      }
    }

    if (suppressedBy) {
      suppressed.push({
        finding,
        suppressedBy: suppressedBy.ex.id,
        reason: suppressedBy.ex.kind,
      });
    } else {
      kept.push(finding);
    }
  }

  return { kept, suppressed };
}

 succeeded in 811ms:
// @glitzy/compliance-rules — inline-flags
// SoT: docs/compliance/RISK_LEVELS.md § 5.1 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 8

import type {
  Finding,
  InlineRiskExtractionInput,
  InlineRiskExtractionResult,
  InlineRiskFlag,
  InlineRiskFlagEvidence,
  MatchSpan,
} from "./types.js";
import { matchRegex } from "./matcher-simple.js";

// RISK_LEVELS § 5.1.1 SoT 7 카테고리 정확 매칭 (CAP-05)
const EFFECT_CLAIM_CATEGORIES = new Set<string>([
  "효과 단정",
  "전문성 단정 (단독 어휘)",
  "전문성 단정 (효과·결과·보장 결합)",
  "보장 표현",
  "수치·기간 단정 (보장어 없음)",
  "수치·기간 보장",
  "체질·맞춤 과대 표현",
]);

// CAP-21 - SoT regex 전건
const PRICING_REGEX = /[₩$￥]\s*\d|\d{2,}\s*(원|만원|달러)|(가격|비용|수가|비급여|총\s*비용)/gu;
const EVENT_REGEX = /(이벤트|할인|세일|프로모션|기간\s*한정|선착순|특가|프로모)/gu;
const BEFORE_AFTER_REGEX = /(전후|비포어\s*애프터|before\s*\/?\s*after|B\/A)/giu;

function spansFromRegex(body: string, pattern: RegExp): Array<{ location: MatchSpan; matchedText: string }> {
  const result: Array<{ location: MatchSpan; matchedText: string }> = [];
  const regex = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    if (m.index === undefined) break;
    result.push({
      location: { start: m.index, end: m.index + m[0].length },
      matchedText: m[0],
    });
    if (m[0].length === 0) regex.lastIndex++;
  }
  return result;
}

/**
 * CAP-22 - LegalDocument false-positive 완화 표는 dead code marker (check() 진입 차단).
 * 실 적용: LocationProfile + Article articleType=notice 만.
 */
function shouldSkipLevelUp(flag: InlineRiskFlag, input: InlineRiskExtractionInput): boolean {
  if (flag === "includes-event") {
    if (input.contentType === "Article" && input.articleType === "notice") return true;
    if (
      input.contentType === "LocationProfile" &&
      (input.locationProfileField === "branchDescription" ||
        input.locationProfileField === "transportInfo" ||
        input.locationProfileField === "parkingInfo")
    ) {
      return true;
    }
  }
  return false;
}

export function evaluateInline(
  body: string,
  findings: Finding[],
  input: InlineRiskExtractionInput,
): InlineRiskExtractionResult {
  const evidence: InlineRiskFlagEvidence = {};
  const flagSet = new Set<InlineRiskFlag>();
  // CAP-CODE-07 정정 - SoT (RISK_LEVELS § 5.1.2) - flag 자체는 보존 + RiskLevel 격상 제외만
  //   flagSet 안 항상 add · suppressedLevelUp 별도 추적 → RiskInference 입력 안 flag 제외
  const suppressedLevelUp = new Set<InlineRiskFlag>();

  // includes-effect-claim - matchResult.findings 안 SoT 7 카테고리 정확 매칭 (CAP-05)
  const effectClaimEvidence: Array<{ location: MatchSpan; matchedText: string }> = [];
  for (const f of findings) {
    if (EFFECT_CLAIM_CATEGORIES.has(f.category)) {
      effectClaimEvidence.push({ location: f.location, matchedText: f.pattern });
    }
  }
  if (effectClaimEvidence.length > 0) {
    flagSet.add("includes-effect-claim");
    evidence["includes-effect-claim"] = effectClaimEvidence;
  }

  // includes-pricing
  const pricingEv = spansFromRegex(body, PRICING_REGEX);
  if (pricingEv.length > 0) {
    flagSet.add("includes-pricing");
    evidence["includes-pricing"] = pricingEv;
  }

  // includes-event - CAP-CODE-07 정정 - flag 보존 + 격상만 제외
  const eventEv = spansFromRegex(body, EVENT_REGEX);
  if (eventEv.length > 0) {
    flagSet.add("includes-event");   // 항상 add (감사 정보 보존)
    evidence["includes-event"] = eventEv;
    if (shouldSkipLevelUp("includes-event", input)) {
      suppressedLevelUp.add("includes-event");   // RiskInference 격상만 제외
    }
  }

  // includes-before-after
  const baEv: Array<{ location: MatchSpan; matchedText: string }> = [];
  const baMatches = spansFromRegex(body, BEFORE_AFTER_REGEX);
  baEv.push(...baMatches);
  // ReviewPolicy + media attachment 부가 입력
  if (input.reviewPolicy?.beforeAfterPhotoAllowed === true && (input.mediaAttachments?.length ?? 0) > 0) {
    baEv.push({ location: { start: 0, end: 0 }, matchedText: "(meta:beforeAfterPhotoAllowed+mediaAttachments)" });
  }
  if (baEv.length > 0) {
    flagSet.add("includes-before-after");
    evidence["includes-before-after"] = baEv;
  }

  // includes-testimonial - testimonial-001 finding category 기반 (CAP-20)
  for (const f of findings) {
    if (f.ruleId === "testimonial-001") {
      flagSet.add("includes-testimonial");
      const arr = evidence["includes-testimonial"] ?? [];
      arr.push({ location: f.location, matchedText: f.pattern });
      evidence["includes-testimonial"] = arr;
    }
  }

  return {
    inlineRiskFlags: Array.from(flagSet),
    evidence,
    suppressedLevelUp: Array.from(suppressedLevelUp),   // CAP-CODE-07 - RiskInference 안 격상 제외 영역
  };
}

 succeeded in 800ms:
// @glitzy/web/lib/compliance/action-errors — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 17.b
// CAP3-01 boundary 정책 + CAP5-01 action 책임 분리 + CAP6-01 SaveResult 정합

import type { SaveResult } from "@/lib/save-result";
import {
  ComplianceConfigError,
  ComplianceTransitionError,
  ReviewerEligibilityError,
} from "./types.js";

/**
 * 4 action wrapper 공통 boundary - mapComplianceErrorToResult.
 *   3 error type form-level 변환. 매핑 안 되면 null → 호출자 throw bubble (Next.js 500).
 */
export function mapComplianceErrorToResult(e: unknown): SaveResult | null {
  if (e instanceof ComplianceConfigError) {
    return { ok: false, fieldErrors: {}, formError: `compliance config error: ${e.message}` };
  }
  if (e instanceof ComplianceTransitionError) {
    return { ok: false, fieldErrors: {}, formError: `compliance transition error: ${e.message}` };
  }
  if (e instanceof ReviewerEligibilityError) {
    return { ok: false, fieldErrors: {}, formError: `reviewer eligibility error: ${e.message}` };
  }
  return null;
}

 succeeded in 840ms:
// @glitzy/compliance-rules — types
// SoT: docs/core/CONTENT_STANDARDS.md § 7.4 + docs/compliance/RISK_LEVELS.md § 2.3.1·§ 3
// COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 (cycle 1~7 acceptance)

export type RiskLevel = "Low" | "Medium" | "High";
export type Severity = "info" | "warning" | "fail" | "content-gate";
export type PatternType = "regex" | "keyword" | "phrase";
export type CompositePatternType = PatternType | "composite";
export type CompositeLogic = "AND_IN_SENTENCE" | "AND_IN_PARAGRAPH" | "AND_NEAR";
export type ApproverRole = "medical" | "legal" | "operator" | "client";
export type ContextExceptionKind = "safety" | "warning-message" | "administrative";

export type ContentScope =
  | { type: "global" }
  | { type: "pageType"; pageTypeId: string }
  | { type: "articleType"; articleType: string }
  | { type: "block"; blockType: "qa" | "list" | "table" | "callout" | "citation" | "media" }
  | { type: "field"; contractId: string; fieldPath: string }
  | { type: "feature"; featureContentType: string };

export type SimpleOperand = {
  pattern: string;
  patternType: PatternType;
};

export type SimpleRiskRule = {
  id: string;
  category: string;
  pattern: string;
  patternType: PatternType;
  severity: Severity;
  scope: ContentScope[];
  requiredApproverRoles?: ApproverRole[];
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];
  exceptions?: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type CompositeRiskRule = {
  id: string;
  category: string;
  patternType: "composite";
  operands: SimpleOperand[];
  logic: CompositeLogic;
  window?: number;
  severity: Severity;
  scope: ContentScope[];
  requiredApproverRoles?: ApproverRole[];
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type RiskRule = SimpleRiskRule | CompositeRiskRule;

export type ContextException = {
  id: string;
  kind: ContextExceptionKind;
  pattern: string;
  patternType: PatternType;
  appliesTo: {
    categories?: string[];
    ruleIds?: string[];
    scopes?: ContentScope[];
  };
  rationale?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type SlotMatchDefinition = {
  slotId: string;
  pageTypeId: string;
  triggeredLevel: RiskLevel;
  matchCondition:
    | { kind: "field-non-empty"; fieldPath: string }
    | { kind: "field-regex"; fieldPath: string; pattern: string }
    | { kind: "body-regex"; pattern: string };
  rationale?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type SlotMatch = {
  pageTypeId: string;
  slotId: string;
  triggeredLevel: RiskLevel;
};

export type MedicalLawRevision = {
  revisionId: string;
  lawSource: string;
  affectedArticles?: string[];
  revisionEffectiveDate: string;
  revisionType: "amendment" | "reaffirmation" | "new";
  sourceUrl: string;
  checkedAt: string;
  checkedBy: string;
  affectedRuleIds: string[];
  staleScope: {
    kind: "all" | "rule-matched" | "content-type";
    contentTypes?: string[];
  };
  summary?: string;
};

export type RiskRuleOverride = {
  targetRuleId: string;
  patch: Partial<RiskRule>;
  rationale?: string;
  appliedAt: string;
};

export type InlineRiskFlag =
  | "includes-effect-claim"
  | "includes-pricing"
  | "includes-event"
  | "includes-before-after"
  | "includes-testimonial";

export type FindingSource = "static-rule" | "inferred" | "explicit" | "llm-assist";

export type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: Severity;
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy: FindingSource;
  legalBasis?: string[];
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

export type SuppressedFinding = {
  finding: Finding;
  suppressedBy: string;
  reason: ContextExceptionKind;
};

export type InferenceStep = {
  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
  sourceValue: string;
  level: RiskLevel;
};

export type RiskInferenceInput = {
  pageTypeId: string;
  articleType?: string;
  inlineRiskFlags: InlineRiskFlag[];
  slotMatches: SlotMatch[];
  explicitRiskLevel?: RiskLevel;
};

export type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;
  evaluatedSteps: InferenceStep[];
  contributingSteps: InferenceStep[];
};

export type LoadedCatalog = {
  rules: RiskRule[];
  contextExceptions: ContextException[];
  slotMatches: SlotMatchDefinition[];
  medicalLawTracking: MedicalLawRevision[];
  catalogVersion: string;
  catalogHash: string;
  schemaHash: string;
  engineVersion: string;
  kssAvailable: boolean;
  warnings: string[];
};

export type ContentScopeInput = {
  contentType: string;
  pageTypeId: string;
  articleType?: string;
  contractId?: string;
  featureContentType?: string;
  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
};

export type MatchResult = {
  findings: Finding[];
  suppressedFindings: SuppressedFinding[];
};

export type MatchSpan = { start: number; end: number };

export type InlineRiskFlagEvidence = {
  [flag in InlineRiskFlag]?: Array<{ location: MatchSpan; matchedText: string }>;
};

export type InlineRiskExtractionInput = {
  contentType: string;
  pageTypeId: string;
  articleType?: string;
  legalDocumentType?: "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
  locationProfileField?: "branchDescription" | "transportInfo" | "parkingInfo";
  reviewPolicy?: { beforeAfterPhotoAllowed: boolean };
  mediaAttachments?: Array<{ kind: "image" | "video"; ref: string }>;
};

export type InlineRiskExtractionResult = {
  inlineRiskFlags: InlineRiskFlag[];
  evidence: InlineRiskFlagEvidence;
  suppressedLevelUp: InlineRiskFlag[];   // CAP-CODE-07 - false-positive 완화 시 flag 보존 + RiskInference 격상만 제외
};

2026-05-19T05:15:45.810808Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path apps/web/src/lib/compliance/review-queue/actions.ts[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\review-queue\actions.ts' because it does not exist.[0m

 exited 1 in 915ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path apps/web/src/lib/compliance/review-queue/actions.ts[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\src\lib\compliance\review-queue\actions.ts' because it does not exist.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files | rg \"review-queue.*actions\\.ts"'$|actions'"\\.ts"'$"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"approveContent\\(|rejectContent\\(|mapComplianceErrorToResult|entryId\" apps/web/src -g \"*.ts\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path data/compliance-rules/medical-law-tracking.yaml' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path data/compliance-rules/meta.yaml' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"13 신규|11 신규|27 활성|MEDICAL_AD|2026-Q2-medical-law-2026-04-07|2026-Q1|ExternalCitation|LegalDocument-CONTENT|CONTENT_STANDARDS-7\\.1\\.1\" data/compliance-rules docs apps packages" in C:\Users\assag\solution\website-exposure
 succeeded in 754ms:
# @glitzy/data/compliance-rules — medical-law-tracking.yaml
# SoT: docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md § 11.2 (의료법 개정 추적)
# COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 2.8 (CAP-27 2026-04-07 reaffirmation seed)
version: "1.0.0"
sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#11.2"
sourceDocVersion: "1.0"

revisions:
  # CAP-CODE-17 정정 - MEDICAL_AD § 11.2 SoT 와 1:1 일치 (revisionId · sourceUrl · checkedAt 정합)
  - revisionId: "2026-Q2-medical-law-2026-04-07"
    lawSource: "의료법"
    affectedArticles: ["제56조 제2항", "제57조"]
    revisionEffectiveDate: "2026-04-07"
    revisionType: "reaffirmation"
    sourceUrl: "https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681"
    checkedAt: "2026-05-14T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds: []
    staleScope:
      kind: "all"
      contentTypes: []
    summary: "v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4. 7.] 확인. RiskRule 카탈로그는 후속."

  - revisionId: "2026-Q1-enforcement-decree-2026-02-10"
    lawSource: "의료법 시행령"
    affectedArticles: ["제23조", "제24조"]
    revisionEffectiveDate: "2026-02-10"
    revisionType: "reaffirmation"
    sourceUrl: "https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1011395655"
    checkedAt: "2026-05-14T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds: []
    staleScope:
      kind: "all"
      contentTypes: []
    summary: "v0.1 시점 시행령 제23조·제24조 본문 [시행 2026. 2. 10.] 확인."

 succeeded in 776ms:
# @glitzy/data/compliance-rules — meta.yaml
# SoT: docs/compliance/RISK_LEVELS.md § 3.4.1 · COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 2.2
catalogVersion: "1.0.0"
medicalLawRevisionRef: "2026-Q2-medical-law-2026-04-07"
loadOrder:
  rules:
    - rules.core.yaml
    - rules.medical-ad.yaml
  contextExceptions:
    - context-exceptions.yaml
  tracking:
    - medical-law-tracking.yaml
  slotMatches:
    - slot-matches.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (14 canonical 룰)"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "MEDICAL_AD § 3.1~3.14 legalBasis overlay + 의료법 특화 신규 13 룰"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4 (safety 2 · warning-message 2 · administrative 1)"
  medical-law-tracking.yaml:
    version: "1.0.0"
    description: "의료법 개정 추적 — MEDICAL_AD § 11.2 2026-04-07 reaffirmation seed (Phase Beta CA-DEFER-19 실 추적 시작)"
  slot-matches.yaml:
    version: "0.0.0"
    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (Phase Beta CA-DEFER-18)"

 succeeded in 870ms:
apps/web/src\lib\compliance\action-errors.ts:12: * 4 action wrapper 공통 boundary - mapComplianceErrorToResult.
apps/web/src\lib\compliance\action-errors.ts:15:export function mapComplianceErrorToResult(e: unknown): SaveResult | null {
apps/web/src\lib\compliance\auto-gate.ts:32:): Promise<{ entryId: string | null }> {
apps/web/src\lib\compliance\auto-gate.ts:35:    return { entryId: null };
apps/web/src\lib\compliance\auto-gate.ts:47:  if (existing.length > 0) return { entryId: existing[0]!.id };
apps/web/src\lib\compliance\auto-gate.ts:70:  return { entryId: inserted[0]!.id };
apps/web/src\lib\compliance\entity-actions.ts:16:import { mapComplianceErrorToResult } from "./action-errors";
apps/web/src\lib\compliance\entity-actions.ts:124:            entryId: result.out.entryId,
apps/web/src\lib\compliance\entity-actions.ts:140:              entryId: result.out.contentGateEntryId,
apps/web/src\lib\compliance\entity-actions.ts:161:    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로 (3 error type 일관)
apps/web/src\lib\compliance\entity-actions.ts:162:    const mapped = mapComplianceErrorToResult(err);
apps/web/src\lib\compliance\entity-actions.ts:249:    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로 (3 error type 일관)
apps/web/src\lib\compliance\entity-actions.ts:250:    const mapped = mapComplianceErrorToResult(err);
apps/web/src\lib\compliance\server-actions.ts:51:  entryId: string;
apps/web/src\lib\compliance\server-actions.ts:138:  const entryId = entryRows[0]!.id;
apps/web/src\lib\compliance\server-actions.ts:142:  const contentGateEntryId: string | null = gateResult.entryId;
apps/web/src\lib\compliance\server-actions.ts:144:  return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel, contentGateEntryId };
apps/web/src\lib\compliance\server-actions.ts:153:  entryId: string;
apps/web/src\lib\compliance\server-actions.ts:162:export async function approveContent(
apps/web/src\lib\compliance\server-actions.ts:173:  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 호출자가 잠금 entry 결정.
apps/web/src\lib\compliance\server-actions.ts:178:     WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${args.entryId}::uuid
apps/web/src\lib\compliance\server-actions.ts:183:  if (entryRows.length === 0) throw new ComplianceTransitionError(`Queue entry ${args.entryId} not found or already resolved`);
apps/web/src\lib\compliance\server-actions.ts:326:  entryId: string;   // CAP-CODE-13 정정
apps/web/src\lib\compliance\server-actions.ts:332:export async function rejectContent(
apps/web/src\lib\compliance\server-actions.ts:345:  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 엉뚱한 큐 처리 회피.
apps/web/src\lib\compliance\server-actions.ts:350:     WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${args.entryId}::uuid
apps/web/src\lib\compliance\server-actions.ts:355:  if (entryRows.length === 0) throw new ComplianceTransitionError(`Queue entry ${args.entryId} not found or already resolved`);
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:15:import { mapComplianceErrorToResult } from "@/lib/compliance/action-errors";
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:36:  entryId: string,
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:50:           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:59:        const out = await approveContent(tx, ctx, {
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:64:          entryId,   // CAP-CODE-13 정정 - 호출자 명시 선택
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:94:      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:99:      return { ok: true, slug: entryId };
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:104:    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:105:    const mapped = mapComplianceErrorToResult(err);
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:120:  entryId: string,
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:138:           WHERE id = ${entryId}::uuid AND instance_id = ${ctx.instanceId}::uuid
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:147:        await rejectContent(tx, ctx, {
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:153:          entryId,   // CAP-CODE-13 정정 - 호출자 명시 선택
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:182:      revalidatePath(`/admin/${instanceSlug}/review-queue/${entryId}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:192:    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로
apps/web/src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:193:    const mapped = mapComplianceErrorToResult(err);

 succeeded in 893ms:
apps\web\src\app\sign-in\actions.ts
apps\web\src\lib\compliance\entity-actions.ts
apps\web\src\lib\compliance\server-actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\categories\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\publications\actions.ts

 succeeded in 889ms:
docs\ARCHITECTURE.md:405:| Core (L1) | `core/*` (7종) | PAGE_TYPES, DATA_MODEL, SCHEMA_MAPPING, DESIGN_TOKENS, CONTENT_STANDARDS, SEARCH_STANDARDIZATION, MEDICAL_AD_COMPLIANCE_COMMON |
docs\admin\REVIEW_WORKFLOW.md:12:> - 의료법 운영 가이드·사전심의 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
docs\admin\REVIEW_WORKFLOW.md:401:4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)
docs\admin\REVIEW_WORKFLOW.md:403:**판정 기준** (MEDICAL_AD_COMPLIANCE_COMMON § 4 정합):
docs\admin\REVIEW_WORKFLOW.md:810:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
data/compliance-rules\rules.medical-ad.yaml:2:# SoT: docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md § 3.1~3.14
data/compliance-rules\rules.medical-ad.yaml:5:sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#3"
data/compliance-rules\rules.medical-ad.yaml:13:    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
data/compliance-rules\rules.medical-ad.yaml:19:    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
data/compliance-rules\rules.medical-ad.yaml:29:    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
data/compliance-rules\rules.medical-ad.yaml:35:    rationale: "MEDICAL_AD § 3.8 전문성 단정 단독 어휘"
data/compliance-rules\rules.medical-ad.yaml:41:    rationale: "MEDICAL_AD § 3.8 보장 표현"
data/compliance-rules\rules.medical-ad.yaml:47:    rationale: "MEDICAL_AD § 3.4 비교 광고"
data/compliance-rules\rules.medical-ad.yaml:53:    rationale: "MEDICAL_AD § 3.13 비급여 할인 압박형"
data/compliance-rules\rules.medical-ad.yaml:59:    rationale: "MEDICAL_AD § 3.13 비급여 할인 사실 고지 — content-gate"
data/compliance-rules\rules.medical-ad.yaml:65:    rationale: "MEDICAL_AD § 3.8 자가 진단 유도"
data/compliance-rules\rules.medical-ad.yaml:71:    rationale: "MEDICAL_AD § 3.9 법적 근거 없는 자격·명칭"
data/compliance-rules\rules.medical-ad.yaml:77:    rationale: "MEDICAL_AD § 3.8 체질·맞춤 과대 표현"
data/compliance-rules\rules.medical-ad.yaml:91:    rationale: "MEDICAL_AD § 3.1 평가받지 아니한 신의료기술 광고"
data/compliance-rules\rules.medical-ad.yaml:107:    rationale: "MEDICAL_AD § 3.2 환자 치료경험담 광고 (1인칭 + 효과 어휘 결합)"
data/compliance-rules\rules.medical-ad.yaml:120:    rationale: "MEDICAL_AD § 3.2 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
data/compliance-rules\rules.medical-ad.yaml:134:    rationale: "MEDICAL_AD § 3.3 거짓된 내용 표시 (v0.1 단순 regex · CA-DEFER-29 citationAbsence Phase Beta)"
data/compliance-rules\rules.medical-ad.yaml:151:    rationale: "MEDICAL_AD § 3.9 자격/명칭 거짓 표시 (§ 3.3 흡수)"
data/compliance-rules\rules.medical-ad.yaml:165:    rationale: "MEDICAL_AD § 3.5 비방 광고 (v0.1 단순 regex · Phase Beta composite 강화)"
data/compliance-rules\rules.medical-ad.yaml:179:    rationale: "MEDICAL_AD § 3.6 전후사진 (수술 장면/환부 노출 흡수 · CAP-04 canonical)"
data/compliance-rules\rules.medical-ad.yaml:196:    rationale: "MEDICAL_AD § 3.10 기사형 광고"
data/compliance-rules\rules.medical-ad.yaml:212:    rationale: "MEDICAL_AD § 3.12 확정 케이스 (한국어 본문 + 외국인 환자 + 의료관광 결합)"
data/compliance-rules\rules.medical-ad.yaml:226:    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
data/compliance-rules\rules.medical-ad.yaml:242:    rationale: "MEDICAL_AD § 3.13 비급여 할인 압박형"
data/compliance-rules\rules.medical-ad.yaml:256:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
data/compliance-rules\rules.medical-ad.yaml:273:    rationale: "MEDICAL_AD § 3.14 상장·인증·보증·추천 (가~라목 예외 카탈로그 매칭 Phase Beta)"
data/compliance-rules\meta.yaml:4:medicalLawRevisionRef: "2026-Q2-medical-law-2026-04-07"
data/compliance-rules\meta.yaml:21:    description: "MEDICAL_AD § 3.1~3.14 legalBasis overlay + 의료법 특화 신규 13 룰"
data/compliance-rules\meta.yaml:27:    description: "의료법 개정 추적 — MEDICAL_AD § 11.2 2026-04-07 reaffirmation seed (Phase Beta CA-DEFER-19 실 추적 시작)"
data/compliance-rules\medical-law-tracking.yaml:2:# SoT: docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md § 11.2 (의료법 개정 추적)
data/compliance-rules\medical-law-tracking.yaml:5:sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#11.2"
data/compliance-rules\medical-law-tracking.yaml:9:  # CAP-CODE-17 정정 - MEDICAL_AD § 11.2 SoT 와 1:1 일치 (revisionId · sourceUrl · checkedAt 정합)
data/compliance-rules\medical-law-tracking.yaml:10:  - revisionId: "2026-Q2-medical-law-2026-04-07"
data/compliance-rules\medical-law-tracking.yaml:24:  - revisionId: "2026-Q1-enforcement-decree-2026-02-10"
docs\features\content-migration.md:273:CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 — § 4.8 batch contract.
docs\features\content-migration.md:1009:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs\features\compliance-assistant.md:12:> - 의료법 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
docs\features\compliance-assistant.md:46:- 의료법 카탈로그 SoT는 `MEDICAL_AD_COMPLIANCE_COMMON.md` (본 문서는 룰 로드만)
docs\features\compliance-assistant.md:83:| `MEDICAL_AD_COMPLIANCE_COMMON.md` § 8 | 인용 가능 도메인 화이트리스트 |
docs\features\compliance-assistant.md:316:의료법 제56조·제57조 + 시행령 제23조·제24조 + MEDICAL_AD_COMPLIANCE_COMMON.md § 3 카탈로그 기반.
docs\features\compliance-assistant.md:579:> **룰 카탈로그 부재 fail 분기**: 본 Feature `enabled=false` (예외 승인 인스턴스, § 10.3) 시 룰 카탈로그 부재는 fail 아님. M0/M1 초기 구현 단계에서는 본 Feature 활성화 + 룰 카탈로그 작성 동시 진행이 표준. MEDICAL_AD_COMPLIANCE_COMMON § 0 "checker 활성화 이후 fail" 조건과 정합.
docs\features\asset-ingestion.md:8:> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4
docs\features\analytics-reporting.md:122:| `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 4 | MA-02 |
packages\core-content\migrations\C0016_status_unlock.sql:116:  '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
docs\decisions\PACKAGES_STRUCTURE.md:11:- DATA_MODEL v0.24·REVIEW_WORKFLOW·CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON·SCHEMA_MAPPING·SEARCH_STANDARDIZATION·DESIGN_TOKENS — `docs/core/`·`docs/admin/`·`docs/compliance/`
docs\decisions\PACKAGES_STRUCTURE.md:189:- CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON·SCHEMA_MAPPING·SEARCH_STANDARDIZATION → packages/content-standards·packages/compliance·packages/schema-mapping·packages/search (Phase 0 Week 4)
docs\decisions\M0_SCHEMA_PLAN.md:10:- `docs/compliance/RISK_LEVELS.md`·`MEDICAL_AD_COMPLIANCE_COMMON.md`·`CONTENT_STANDARDS.md`
docs\decisions\M0_SCHEMA_PLAN.md:95:- CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON → ComplianceRecord·column metadata
docs\decisions\LOCATION_LEGAL_PLAN.md:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
docs\decisions\EAT_CONTENT_PLAN.md:94:| Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **7 cycle 54 finding 전건 수용** · cycle 7 0 finding 확정 acceptance · `ready_for_acceptance=true` · `recommendation: "acceptance 권장"`. 모든 acceptance precondition PASS (27 SoT 슬롯 + 27 활성 canonical 룰 · 5 inlineRiskFlags · RiskInference evaluatedSteps/contributingSteps · contextExceptions · High triggeredBy · CA-DEFER 5+12 신설 · CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1 → 1 → **0**. M0 stub `check()` → 실 9단계 빌드 파이프라인 + CA-DEFER-01·02·11·15 + EC-DEFER-05 5종 해소. Code cycle 분리 (별 cycle 안 compliance-assistant Phase Alpha code v1.0).
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:5:> **acceptance commit 구성** (M0_PLAN v1.0 패턴 정합) — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan v1.0 · (2) CA-CASCADE-09 cascade (`docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9.4 CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 + CA-CASCADE-09 marker 신설 — cycle 2 안 실 patch 완료). 실 코드 cascade (data/compliance-rules/ 6 YAML + 1 schema.json · packages/compliance-rules/ 신규 + apps/web/src/lib/compliance/check.ts 재작성 + auto-gate.ts 신규 + action-errors.ts 신규 + C0017/C0018 migration + Drizzle schema v0.6 + manifest 21단계 · 7 docs cascade RISK_LEVELS § 3.3·§ 3.4.1·§ 2.3.1 + compliance-assistant § 4.3 + EAT_CONTENT_PLAN § 11 + REVIEW_WORKFLOW § 3·§ 3.3 + CONTENT_STANDARDS § 7.1·§ 7.2 + MEDICAL_AD_COMPLIANCE_COMMON § 3 + manifest)는 별 cycle (compliance-assistant Phase Alpha code v1.0).
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:19:- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 + medical-law-tracking SoT revision (CAP-27 정정)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:43:- **MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 SoT 예시 ID → canonical 매핑** (CAP-04 정정): § 3.1~3.14 각 호의 SoT 예시 ID 17종 → § 2.3 안 "생성 / canonical 흡수 / 의도적 제외" 표 매핑. 흡수 시 대체 ruleId + legalBasis 명시.
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:73:| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 + § 2.3.1 evaluatedSteps/contributingSteps cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 21단계 (M0 19 + C0017 + C0018) · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:91:| `medical-law-tracking.yaml` 안 실 의료법 개정 항목 — sourceUrl · checkedBy · 영향 룰 ID · stale 트리거 | 본 cycle 안 **MEDICAL_AD_COMPLIANCE_COMMON § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27 정정). 추가 revision Phase Beta | CA-DEFER-19 (신설) |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:121:├── rules.medical-ad.yaml             # MEDICAL_AD_COMPLIANCE_COMMON § 3.1~3.14 → legalBasis overlay (CAP-28 정정)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:123:├── medical-law-tracking.yaml         # MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed (CAP-27 정정)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:142:medicalLawRevisionRef: "2026-04-07-reaffirmation"   # CAP-27 정정 — MEDICAL_AD § 11.2 SoT seed
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:159:    description: "MEDICAL_AD § 3.1~3.14 legalBasis overlay + 추가 의료법 룰"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:165:    description: "의료법 개정 추적 — MEDICAL_AD § 11.2 2026-04-07 reaffirmation seed (Phase Beta 추적 시작)"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:176:- **rules.medical-ad.yaml** = MEDICAL_AD § 3.1~3.14 의료법 인용 overlay. `overrides[]` 사용하여 rules.core.yaml 의 canonical 룰에 `legalBasis[]` 정확 매핑 추가. 일부는 신규 룰 (의료법 특화 — 외국인환자·기사형 광고 등)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:179:### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 4 카운트 정확화)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:182:- MEDICAL_AD § 3.0~3.14 안 **명시된 SoT 예시 ID 총 27 슬롯**: § 3.1 (1) · § 3.2 (3) · § 3.3 (2) · § 3.4 (1) · § 3.5 (1) · § 3.6 (2) · § 3.7 (1) · § 3.8 (5) · § 3.9 (2) · § 3.10 (1) · § 3.11 (1) · § 3.12 (2) · § 3.13 (2) · § 3.14 (3) · § 3.15 (0 — 시행령 미존재). 합계 1+3+2+1+1+2+1+5+2+1+1+2+2+3 = **27 슬롯**
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:184:- **표 row = 28**: 27 SoT 슬롯 + plan 추가 row 1 (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 안 생성 룰 · MEDICAL_AD § 3.8 안 명시 ID 아님 · 비-SoT-count display row)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:186:- **Phase Alpha 활성 canonical 룰 = 25** = rules.core.yaml 14 표현 룰 (CONTENT_STANDARDS § 4.1 전건 · 단독 어휘 룰 포함) + rules.medical-ad.yaml 13 신규 룰
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:188:- **acceptance precondition 통일** (CAP-04 cycle 4 정정): "**27 SoT 슬롯 표현 + 26 acceptance count (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 27 활성 canonical 룰 + plan 추가 단독 어휘 1 (비-SoT-count)**" — cycle 3 "생성 16 + 흡수 9 = 25" 산수 오류 정정
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:190:| MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | 대체 canonical ruleId | legalBasis[] |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:195:| § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:221:**SoT 27 슬롯 처리 합계 (cycle 4 정확)**: 생성 15 (직접 매칭 신설 · MEDICAL_AD SoT 안 명시 ID 카탈로그 등록) · canonical 흡수 9 (다른 룰로 대체 · `§ 3.2 treatment-effect-assertion-001` → `guarantee-composite-001` · `§ 3.3 false-credential-001` → `false-credential-001` (§ 3.9 unique 유지) · `§ 3.6 graphic-procedure-001` → `before-after-photo-001` · `§ 3.8 exaggeration-001` · `effect-claim-001` · `guarantee-001` → `guarantee-composite-001` · `§ 3.9 false-title-001` → `false-credential-001` · `§ 3.14 false-award-001` · `false-endorsement-001` → `award-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 26 acceptance count. **duplicate display row 1** (`§ 3.9 false-credential-001` — § 3.3 안 흡수 처리 안 카운트 안 1회만 · 표 안 display row 만) = 27 표현 · **plan 추가 row 1** (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 생성 룰 · 비-SoT-count display row) = 28 표 row. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 13 신규 = **27 활성 canonical 룰**.
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:240:| `celebrity-001` | "유명인 동원" (CAP-05 잔존 정정 — SoT § 4.1 정확 매칭) | fail | regex (`(연예인\|아이돌\|배우)\s*(이\|가)?\s*받은`) | global | 동일. legalBasis = `["medical-law-art27-para3"]` (환자 유인 — MEDICAL_AD § 3.0 cascade Phase Beta 매핑) |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:252:sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#3"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:260:    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:265:    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:274:    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:288:    rationale: "MEDICAL_AD § 3.1"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:302:    rationale: "MEDICAL_AD § 3.2"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:315:    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:327:    rationale: "MEDICAL_AD § 3.3 - 인용/출처 부재 시 거짓 우려"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:342:    rationale: "MEDICAL_AD § 3.9 - 자격/명칭 거짓 표시"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:354:    rationale: "MEDICAL_AD § 3.5"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:366:    rationale: "MEDICAL_AD § 3.6 - 수술 장면/환부 노출 흡수 (CAP-04 canonical 흡수)"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:381:    rationale: "MEDICAL_AD § 3.10"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:395:    rationale: "MEDICAL_AD § 3.12 확정 케이스"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:408:    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:422:    rationale: "MEDICAL_AD § 3.13 압박형"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:436:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:451:    rationale: "MEDICAL_AD § 3.14 - 가~라목 예외 카탈로그 매칭 Phase Beta"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:537:sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#11.2"
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:552:    summary: "MEDICAL_AD § 11.2 SoT - 2026-04-07 의료법 본문 재확인 (변경 없음). Phase Alpha baseline."
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1550:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1562:- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 **27 SoT 슬롯 → canonical 매핑** (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1 + duplicate display 1 = 27 표현 · 26 acceptance count · CAP-04 cycle 4 정정)
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1580:| MA-Q09 | medical-law-tracking baseline | **MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27) |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1590:| 2026-05-19 | **v1.0** | **Codex 비평 cycle 7 0 finding 확정 acceptance** — `ready_for_acceptance=true` · `recommendation: "acceptance 권장"`. closeable 100%. **모든 acceptance precondition PASS** (27 SoT 슬롯 + 27 활성 canonical 룰 + 5 inlineRiskFlags + RiskInference evaluatedSteps/contributingSteps + contextExceptions + High triggeredBy + CA-DEFER 5+12 신설 + CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1 → 1 → **0**. 누계 7 cycle 54 finding 전건 수용. blocking 0 (cycle 4~7) · major 0 (cycle 7) 잔존. acceptance commit 안 docs cascade 동시 포함 marker (CA-CASCADE-09 cycle 2 안 실 cascade 완료). 실 코드 cascade 는 별 cycle (compliance-assistant Phase Alpha code v1.0). |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1594:| 2026-05-19 | v0.4 | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 27 활성 canonical 룰". |
docs\decisions\COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1596:| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:33:- **LegalDocument 자동 검수 면제 (CAM-09 정정, CAM4-01 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. `auto_check_result` 슬롯에는 SoT 7 필드만 (automatedDecision='pass' · 모든 finding 카운터 0). `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"` 은 `compliance_record.metadata` 슬롯에 저장 (auto_check_result 안 아님).
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:540:    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:562:      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:827:- `CA-DEFER-19` (Phase Beta): medical-law-tracking.yaml 실 의료법 개정 추적 — v0.1 안 MEDICAL_AD § 11.2 SoT revision (2026-04-07 reaffirmation) seed 1건. 추가 revision Phase Beta
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:831:- `CA-DEFER-29` (Phase Beta): `citationAbsence` evaluation contract — `false-statement-001` (MEDICAL_AD § 3.3) 본 contract 필요. v0.1 안 단순 regex 한계
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:832:- `CA-DEFER-30` (Phase Beta): `NOT_IN_PARAGRAPH` logic (negative operand) — `side-effect-missing-001` (MEDICAL_AD § 3.7) 본 logic 필요. v0.1 안 룰 자체 미등록 (Phase Beta 합류)
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:833:- `CA-DEFER-31` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): pageMeta composite — `foreign-patient-recruit-domestic-uncertain-001` (MEDICAL_AD § 3.12 불명확) 안 inLanguage/국내매체 evidence. v0.1 안 단순 regex
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:834:- `CA-DEFER-32` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): numeric predicate — `short-clinical-experience-001` (MEDICAL_AD § 3.2 6개월 이하) 안 6 이하 정확 매칭. v0.1 안 1~99 모두 fail 보수 정책
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:835:- `CA-DEFER-33` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): evidence absence — `non-covered-discount-misleading-001` (MEDICAL_AD § 3.13) 안 기간/대상 명시 부재 검사. v0.1 안 모든 % 할인 content-gate 보수 정책
docs\decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:859:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
docs\core\DATA_MODEL.md:606:#### `RobotsOverride` (v0.11 신규)
docs\core\DATA_MODEL.md:615:#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
docs\core\DATA_MODEL.md:641:#### `IANATimezone` (v0.13 신규)
docs\core\DATA_MODEL.md:1038:### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
docs\core\CONTENT_STANDARDS.md:15:> - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)
docs\core\CONTENT_STANDARDS.md:210:  - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
docs\core\CONTENT_STANDARDS.md:213:- 인용 가능 출처 — 학회·정부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 정밀화
docs\core\CONTENT_STANDARDS.md:246:> 본 표는 v0.1 최초 — 운영 누적으로 항목 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 문서에서 사례 풍부화.
docs\core\CONTENT_STANDARDS.md:280:> **운영 정책**: 본 표는 v0.4 최초 — 운영 누적으로 사례 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 풍부화.
docs\core\CONTENT_STANDARDS.md:435:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
docs\core\CONTENT_STANDARDS.md:557:  legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
docs\core\CONTENT_STANDARDS.md:662:| CS-D | § 3.5 인용 가능 외부 도메인 화이트리스트 (학회·정부 도메인 카탈로그) | `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 |
docs\core\CONTENT_STANDARDS.md:682:| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
docs\compliance\RISK_LEVELS.md:14:> - 의료광고 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)
docs\compliance\RISK_LEVELS.md:48:- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속
docs\compliance\RISK_LEVELS.md:150:├── rules.medical-ad.yaml       # 의료법·시행령 기반 룰 (MEDICAL_AD_COMPLIANCE_COMMON 후속)
docs\compliance\RISK_LEVELS.md:251:| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
docs\compliance\RISK_LEVELS.md:314:medicalLawRevisionRef: "2026-Q1"                 # 의료법 개정 추적 (§ 7.1)
docs\compliance\RISK_LEVELS.md:641:  - revisionId: "2026-Q1"                          # 분기 또는 개정 일자 기반 식별자
docs\compliance\RISK_LEVELS.md:660:1. `MEDICAL_AD_COMPLIANCE_COMMON.md` 본문 갱신
docs\compliance\RISK_LEVELS.md:723:| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:316:  it("catalog 27 활성 canonical 룰 (core 14 + medical-ad 13 신규) 로드", () => {
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:328:  it("medical-law-tracking MEDICAL_AD § 11.2 SoT 2건 (의료법 + 시행령)", () => {
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:330:    expect(catalog.medicalLawTracking[0]?.revisionId).toBe("2026-Q2-medical-law-2026-04-07");
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:155:> **Phase Alpha v1.0 cascade (CA-CASCADE-07)**: § 3.1~3.14 안 SoT 예시 ID 27 슬롯 → canonical 매핑 완료 — 생성 15 (직접 매칭) + canonical 흡수 9 (다른 룰로 대체) + 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) + Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 26 acceptance count + duplicate display row 1 (§ 3.9 `false-credential-001` § 3.3 흡수) = 27 표현. **활성 canonical 룰 27** (rules.core.yaml 14 + rules.medical-ad.yaml **13 신규**). 매핑 표 SoT = `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` § 2.4.
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:562:| `2026-Q2-medical-law-2026-04-07` | `의료법` | `["제56조 제2항", "제57조"]` | `2026-04-07` (법령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000916681 | `2026-05-14T00:00:00Z` (본 문서 v0.1 작성 시 본문 확인 일자) | `operator:seokcess@glitzy.kr` | `[]` (v0.1 시점 RiskRule 미작성) | `{ kind: "all" }` | v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4. 7.] 확인. RiskRule 카탈로그는 후속 |
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:563:| `2026-Q1-enforcement-decree-2026-02-10` | `의료법 시행령` | `["제23조", "제24조"]` | `2026-02-10` (시행령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1011395655 | `2026-05-14T00:00:00Z` | `operator:seokcess@glitzy.kr` | `[]` | `{ kind: "all" }` | v0.1 시점 시행령 제23조·제24조 본문 [시행 2026. 2. 10.] 확인 |
apps\web\src\lib\compliance\__tests__\compliance.test.ts:88:    expect(env.meta.exemptReason).toBe("LegalDocument-CONTENT_STANDARDS-7.1.1.1");
apps\web\src\lib\compliance\server-actions.ts:16:import { check, buildLegalDocumentExemptEnvelope, buildExternalCitationExemptEnvelope } from "./check";
apps\web\src\lib\compliance\server-actions.ts:87:    envelope = buildExternalCitationExemptEnvelope(checkInput);
apps\web\src\lib\compliance\check.ts:31:const M0_LEGAL_EXEMPT_REASON = "LegalDocument-CONTENT_STANDARDS-7.1.1.1";
apps\web\src\lib\compliance\check.ts:32:const EXTERNAL_CITATION_EXEMPT_REASON = "ExternalCitation-CONTENT_STANDARDS-7.1.1.2";
apps\web\src\lib\compliance\check.ts:39:export function buildExternalCitationExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/save-result.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "type ComplianceCheckInput|export type ComplianceCheckInput|qaBlocks|articleType|metadata" apps/web/src/lib/compliance/types.ts packages -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/types.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 686ms:
// @glitzy/web/lib/save-result — Server Action 공통 결과 타입

import type { FieldErrors } from "./errors";

export type SaveResult =
  | { ok: true; slug?: string }
  | { ok: false; fieldErrors: FieldErrors; formError?: string };

 succeeded in 698ms:
apps/web/src/lib/compliance/types.ts:17:// CONTENT_STANDARDS § 7.1 ComplianceCheckInput - Phase Alpha 안 metadata 신규 7 필드 (CAP-CASCADE-06)
apps/web/src/lib/compliance/types.ts:18:export type ComplianceCheckInput = {
apps/web/src/lib/compliance/types.ts:22:  metadata: {
apps/web/src/lib/compliance/types.ts:24:    articleType?: string;
apps/web/src/lib/compliance/types.ts:34:    qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
apps/web/src/lib/compliance/types.ts:78:  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
packages\core-content\src\schema.ts:86:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:126:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:166:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:199:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:238:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:293:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:341:    articleTypeDefault: text("article_type_default"),
packages\core-content\src\schema.ts:342:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:394:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:454:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:509:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:559:    articleType: text("article_type"),
packages\core-content\src\schema.ts:577:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\core-content\src\schema.ts:619:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
packages\compliance-rules\src\exceptions.ts:20:      if (exScope.type === "articleType" && ruleScope.type === "articleType") return ruleScope.articleType === exScope.articleType;
packages\compliance-rules\src\inline-flags.ts:47: * 실 적용: LocationProfile + Article articleType=notice 만.
packages\compliance-rules\src\inline-flags.ts:51:    if (input.contentType === "Article" && input.articleType === "notice") return true;
packages\db\src\service-role.ts:56:      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
packages\db\src\service-role.ts:96:          metadata = metadata || ${sql.json(outcomePayload) as any}
packages\compliance-rules\src\matcher.ts:27:    if (scope.articleType === "event-price") return true;
packages\compliance-rules\src\matcher.ts:36:    if (s.type === "articleType") return input.articleType === s.articleType;
packages\compliance-rules\src\risk-inference.ts:71:function articleTypeBaseLevel(articleType: string): RiskLevel {
packages\compliance-rules\src\risk-inference.ts:72:  return ARTICLE_TYPE_BASE[articleType] ?? "Low";
packages\compliance-rules\src\risk-inference.ts:85:  // 단계 2 - articleType
packages\compliance-rules\src\risk-inference.ts:86:  if (input.articleType) {
packages\compliance-rules\src\risk-inference.ts:87:    const articleLevel = articleTypeBaseLevel(input.articleType);
packages\compliance-rules\src\risk-inference.ts:88:    const step: InferenceStep = { source: "articleType", sourceValue: input.articleType, level: articleLevel };
packages\compliance-rules\src\types.ts:16:  | { type: "articleType"; articleType: string }
packages\compliance-rules\src\types.ts:152:  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
packages\compliance-rules\src\types.ts:159:  articleType?: string;
packages\compliance-rules\src\types.ts:187:  articleType?: string;
packages\compliance-rules\src\types.ts:190:  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
packages\compliance-rules\src\types.ts:207:  articleType?: string;

 succeeded in 733ms:
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
import { mapComplianceErrorToResult } from "@/lib/compliance/action-errors";
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
          entryId,   // CAP-CODE-13 정정 - 호출자 명시 선택
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
      // LWI-02 정정: LegalDocument 의 경우 clinic-profile 화면도 revalidate (별 edit route 없음)
      if (result.entry.content_type === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      return { ok: true, slug: entryId };
    }
    return { ok: false, fieldErrors: {}, formError: "승인에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
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
          entryId,   // CAP-CODE-13 정정 - 호출자 명시 선택
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
      // LWI-02 정정: LegalDocument 는 clinic-profile 화면도 revalidate
      if (result.entry.content_type === "LegalDocument") {
        revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
      }
      redirect(`/admin/${instanceSlug}/review-queue`);
    }
    return { ok: false, fieldErrors: {}, formError: "거부 처리에 실패했습니다." };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // CAP-CODE-12 정정 - mapComplianceErrorToResult 단일 helper 경로
    const mapped = mapComplianceErrorToResult(err);
    if (mapped) return mapped;
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

 succeeded in 688ms:
// @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 (cycle 1~7 acceptance)
// SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result + § 14 envelope.extensions (CAP-18·19)

export type RiskLevel = "Low" | "Medium" | "High";

export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)

// 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
export const ALLOWED_SUBMIT_TYPES = [
  "Article", "TreatmentPage", "LegalDocument",
  "FAQ", "Publication", "MediaAppearance",
] as const;
export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];

export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";

// CONTENT_STANDARDS § 7.1 ComplianceCheckInput - Phase Alpha 안 metadata 신규 7 필드 (CAP-CASCADE-06)
export type ComplianceCheckInput = {
  contentType: ContentType;
  contentRef: string;
  body: string;  // Markdown
  metadata: {
    pageTypeId?: string;
    articleType?: string;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;
    // Phase Alpha 신규 - CAP-CASCADE-06
    reviewPolicy?: { beforeAfterPhotoAllowed: boolean };
    mediaAttachments?: Array<{ kind: "image" | "video"; ref: string }>;
    legalDocumentType?: "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
    locationProfileField?: "branchDescription" | "transportInfo" | "parkingInfo";
    priorReviewRequired?: boolean;
    priorReviewPassed?: boolean;
    qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
    entityFields?: Record<string, unknown>;
  };
  riskRules?: unknown[];  // 미사용 (loader 안 catalog 로드)
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
  legalBasis?: string[];
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};

// CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만
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

// Phase Alpha 안 envelope.extensions 신규 영역 (CAP-19 - SoT 7 필드 침해 없음)
export type SuppressedFinding = {
  finding: Finding;
  suppressedBy: string;
  reason: "safety" | "warning-message" | "administrative";
};

export type InferenceStep = {
  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
  sourceValue: string;
  level: RiskLevel;
};

export type InlineRiskFlag =
  | "includes-effect-claim"
  | "includes-pricing"
  | "includes-event"
  | "includes-before-after"
  | "includes-testimonial";

export type ExtensionsRecord = {
  suppressedByContextExceptions: SuppressedFinding[];
  inlineRiskFlagsEvidence: Partial<Record<InlineRiskFlag, Array<{ location: { start: number; end: number }; matchedText: string }>>>;
  // CAP-CODE-08 정정 - SoT (RISK_LEVELS § 2.3.1) 필드명 정합 - evaluatedSteps · contributingSteps
  evaluatedSteps: InferenceStep[];
  contributingSteps: InferenceStep[];
  ruleMatchStats: { categoryCounts: Record<string, number>; elapsedMs: number };
  inferredRiskLevelMismatch?: { external: RiskLevel; internal: RiskLevel; final: RiskLevel };
  clientRolePresent: boolean;
  suppressedLevelUpFlags: InlineRiskFlag[];   // CAP-CODE-07 - false-positive 완화 시 flag 보존 + RiskInference 격상 제외 영역
  engineMetadata: {
    catalogVersion: string;
    catalogHash: string;
    schemaHash: string;
    engineVersion: string;
    kssAvailable: boolean;
  };
};

// M0 wrapper - Phase Alpha 안 extensions 추가 (CAP-19)
export type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;
  meta: {
    pageRiskLevel: RiskLevel;
    catalogVersion: string;
    catalogHash: string;
    manualReview: boolean;
    exemptReason?: string;
  };
  extensions?: ExtensionsRecord;   // CAP-19 - Phase Alpha 안 신규 영역 (Legal exempt 시 undefined 가능)
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "schema compile failed|validators|validateAgainstSchema|isRoleSatisfied|entry status|openSiblings|remainingOpen|SELECT count" packages/compliance-rules/src/loader.ts apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path data/compliance-rules/schema.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "approve|content-gate|manual-review|AND gate|entryId|suppressedLevelUp|ExternalCitation|LegalDocument" apps/web/src/lib/compliance/__tests__ -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 675ms:
apps/web/src/lib/compliance/__tests__\phase-alpha.test.ts:67:  it("시나리오 7 - event-fact-statement-001 매칭 (Article articleType=general-medical-info → content-gate)", () => {
apps/web/src/lib/compliance/__tests__\phase-alpha.test.ts:76:    expect(f?.severity).toBe("content-gate");
apps/web/src/lib/compliance/__tests__\phase-alpha.test.ts:311:    expect(env.extensions?.suppressedLevelUpFlags).toContain("includes-event");
apps/web/src/lib/compliance/__tests__\compliance.test.ts:7:import { check, buildLegalDocumentExemptEnvelope } from "../check";
apps/web/src/lib/compliance/__tests__\compliance.test.ts:18:  it("LegalDocument Low → {operator, legal}", () => {
apps/web/src/lib/compliance/__tests__\compliance.test.ts:19:    expect(calculateFinalRoles("LegalDocument", "Low")).toEqual(["legal", "operator"]);
apps/web/src/lib/compliance/__tests__\compliance.test.ts:70:    expect(env.result.findingsBySeverity["content-gate"]).toBeGreaterThanOrEqual(1);
apps/web/src/lib/compliance/__tests__\compliance.test.ts:73:  it("LegalDocument 입력 → throw (CAM2-02)", async () => {
apps/web/src/lib/compliance/__tests__\compliance.test.ts:75:      contentType: "LegalDocument",
apps/web/src/lib/compliance/__tests__\compliance.test.ts:81:  it("buildLegalDocumentExemptEnvelope → exemptReason + manualReview=false", () => {
apps/web/src/lib/compliance/__tests__\compliance.test.ts:82:    const env = buildLegalDocumentExemptEnvelope({
apps/web/src/lib/compliance/__tests__\compliance.test.ts:83:      contentType: "LegalDocument",
apps/web/src/lib/compliance/__tests__\compliance.test.ts:88:    expect(env.meta.exemptReason).toBe("LegalDocument-CONTENT_STANDARDS-7.1.1.1");
apps/web/src/lib/compliance/__tests__\compliance.test.ts:124:    physician_approver: null,
apps/web/src/lib/compliance/__tests__\compliance.test.ts:125:    physician_approved_at: null,
apps/web/src/lib/compliance/__tests__\compliance.test.ts:150:  it("LegalDocument + operator only → missing legal", () => {
apps/web/src/lib/compliance/__tests__\compliance.test.ts:153:      "LegalDocument",
apps/web/src/lib/compliance/__tests__\compliance.test.ts:182:    physician_approver: null, physician_approved_at: null,

 succeeded in 710ms:
apps/web/src/lib/compliance/server-actions.ts:17:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
apps/web/src/lib/compliance/server-actions.ts:228:  if (isRoleSatisfied(record, args.role)) {
apps/web/src/lib/compliance/server-actions.ts:245:  // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
apps/web/src/lib/compliance/server-actions.ts:271:  const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
apps/web/src/lib/compliance/server-actions.ts:289:    const openSiblings = await tx<{ cnt: string }[]>`
apps/web/src/lib/compliance/server-actions.ts:290:      SELECT count(*)::text AS cnt
apps/web/src/lib/compliance/server-actions.ts:296:    const remainingOpen = Number(openSiblings[0]?.cnt ?? "0");
apps/web/src/lib/compliance/server-actions.ts:297:    if (remainingOpen === 0) {
apps/web/src/lib/compliance/server-actions.ts:308:    // remainingOpen > 0 인 경우 - entity status 변경 안 함 (in-review 유지 · 다른 큐 처리 대기)
apps/web/src/lib/compliance/server-actions.ts:317:  return finalRoles.every((r) => isRoleSatisfied(record, r));
apps/web/src/lib/compliance/server-actions.ts:456:    SELECT count(*)::text AS cnt
apps/web/src/lib/compliance/server-actions.ts:462:  const remainingOpen = Number(openEntries[0]?.cnt ?? "0");
apps/web/src/lib/compliance/server-actions.ts:463:  if (remainingOpen > 0) {
apps/web/src/lib/compliance/server-actions.ts:464:    throw new ComplianceTransitionError(`Cannot publish - ${remainingOpen} open queue entry remaining (AND gate)`);
packages/compliance-rules/src/loader.ts:105:  const validators = new Map<string, ReturnType<typeof ajv.compile>>();
packages/compliance-rules/src/loader.ts:112:      validators.set(key, ajv.compile(combined));
packages/compliance-rules/src/loader.ts:118:  function validateAgainstSchema(filename: string, schemaKey: string, data: unknown): void {
packages/compliance-rules/src/loader.ts:119:    const validate = validators.get(schemaKey);
packages/compliance-rules/src/loader.ts:128:  validateAgainstSchema("meta.yaml", "metaFile", meta);
packages/compliance-rules/src/loader.ts:139:    validateAgainstSchema(ruleFile, "rulesFile", data);
packages/compliance-rules/src/loader.ts:149:    validateAgainstSchema(exFile, "contextExceptionsFile", data);
packages/compliance-rules/src/loader.ts:158:    validateAgainstSchema(trackingFile, "medicalLawTrackingFile", data);
packages/compliance-rules/src/loader.ts:167:    validateAgainstSchema(slotFile, "slotMatchesFile", data);

 succeeded in 737ms:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "compliance-rules catalog schema",
  "description": "SoT: docs/compliance/RISK_LEVELS.md § 3.3 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 2.10",
  "definitions": {
    "kebabCase": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9-]*[a-z0-9]$"
    },
    "semver": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+(-[0-9A-Za-z.-]+)?$"
    },
    "iso8601": {
      "type": "string",
      "format": "date-time"
    },
    "riskLevel": {
      "type": "string",
      "enum": ["Low", "Medium", "High"]
    },
    "severity": {
      "type": "string",
      "enum": ["info", "warning", "fail", "content-gate"]
    },
    "patternType": {
      "type": "string",
      "enum": ["regex", "keyword", "phrase"]
    },
    "compositePatternType": {
      "type": "string",
      "enum": ["regex", "keyword", "phrase", "composite"]
    },
    "compositeLogic": {
      "type": "string",
      "enum": ["AND_IN_SENTENCE", "AND_IN_PARAGRAPH", "AND_NEAR"]
    },
    "approverRole": {
      "type": "string",
      "enum": ["medical", "legal", "operator", "client"]
    },
    "scope": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "type": { "const": "global" }
          },
          "required": ["type"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "pageType" },
            "pageTypeId": { "type": "string" }
          },
          "required": ["type", "pageTypeId"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "articleType" },
            "articleType": { "type": "string" }
          },
          "required": ["type", "articleType"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "block" },
            "blockType": {
              "type": "string",
              "enum": ["qa", "list", "table", "callout", "citation", "media"]
            }
          },
          "required": ["type", "blockType"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "field" },
            "contractId": { "type": "string" },
            "fieldPath": { "type": "string" }
          },
          "required": ["type", "contractId", "fieldPath"],
          "additionalProperties": false
        },
        {
          "properties": {
            "type": { "const": "feature" },
            "featureContentType": {
              "type": "string",
              "pattern": "^feature:[a-z][a-z0-9-]*[a-z0-9]$"
            }
          },
          "required": ["type", "featureContentType"],
          "additionalProperties": false
        }
      ]
    },
    "simpleOperand": {
      "type": "object",
      "properties": {
        "pattern": { "type": "string", "minLength": 1 },
        "patternType": { "$ref": "#/definitions/patternType" }
      },
      "required": ["pattern", "patternType"],
      "additionalProperties": false
    },
    "simpleRiskRule": {
      "type": "object",
      "properties": {
        "id": { "$ref": "#/definitions/kebabCase" },
        "category": { "type": "string", "minLength": 1 },
        "pattern": { "type": "string", "minLength": 1 },
        "patternType": { "$ref": "#/definitions/patternType" },
        "severity": { "$ref": "#/definitions/severity" },
        "scope": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/definitions/scope" }
        },
        "requiredApproverRoles": {
          "type": "array",
          "items": { "$ref": "#/definitions/approverRole" }
        },
        "suggestion": { "type": "string", "maxLength": 1000 },
        "rationale": { "type": "string" },
        "legalBasis": {
          "type": "array",
          "items": { "type": "string" }
        },
        "exceptions": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 }
        },
        "version": { "$ref": "#/definitions/semver" },
        "createdAt": { "$ref": "#/definitions/iso8601" },
        "updatedAt": { "$ref": "#/definitions/iso8601" }
      },
      "required": ["id", "category", "pattern", "patternType", "severity", "scope", "version", "createdAt", "updatedAt"],
      "additionalProperties": false
    },
    "compositeRiskRule": {
      "type": "object",
      "properties": {
        "id": { "$ref": "#/definitions/kebabCase" },
        "category": { "type": "string", "minLength": 1 },
        "patternType": { "const": "composite" },
        "operands": {
          "type": "array",
          "minItems": 2,
          "items": { "$ref": "#/definitions/simpleOperand" }
        },
        "logic": { "$ref": "#/definitions/compositeLogic" },
        "window": { "type": "integer", "minimum": 1 },
        "severity": { "$ref": "#/definitions/severity" },
        "scope": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/definitions/scope" }
        },
        "requiredApproverRoles": {
          "type": "array",
          "items": { "$ref": "#/definitions/approverRole" }
        },
        "suggestion": { "type": "string", "maxLength": 1000 },
        "rationale": { "type": "string" },
        "legalBasis": {
          "type": "array",
          "items": { "type": "string" }
        },
        "version": { "$ref": "#/definitions/semver" },
        "createdAt": { "$ref": "#/definitions/iso8601" },
        "updatedAt": { "$ref": "#/definitions/iso8601" }
      },
      "required": ["id", "category", "patternType", "operands", "logic", "severity", "scope", "version", "createdAt", "updatedAt"],
      "additionalProperties": false
    },
    "riskRule": {
      "oneOf": [
        { "$ref": "#/definitions/simpleRiskRule" },
        { "$ref": "#/definitions/compositeRiskRule" }
      ]
    },
    "override": {
      "type": "object",
      "properties": {
        "targetRuleId": { "$ref": "#/definitions/kebabCase" },
        "patch": { "type": "object" },
        "rationale": { "type": "string" },
        "appliedAt": { "$ref": "#/definitions/iso8601" }
      },
      "required": ["targetRuleId", "patch", "appliedAt"],
      "additionalProperties": false
    },
    "contextException": {
      "type": "object",
      "properties": {
        "id": { "$ref": "#/definitions/kebabCase" },
        "kind": {
          "type": "string",
          "enum": ["safety", "warning-message", "administrative"]
        },
        "pattern": { "type": "string", "minLength": 1 },
        "patternType": { "$ref": "#/definitions/patternType" },
        "appliesTo": {
          "type": "object",
          "properties": {
            "categories": { "type": "array", "items": { "type": "string" } },
            "ruleIds": { "type": "array", "items": { "$ref": "#/definitions/kebabCase" } },
            "scopes": { "type": "array", "items": { "$ref": "#/definitions/scope" } }
          },
          "additionalProperties": false
        },
        "rationale": { "type": "string" },
        "version": { "$ref": "#/definitions/semver" },
        "createdAt": { "$ref": "#/definitions/iso8601" },
        "updatedAt": { "$ref": "#/definitions/iso8601" }
      },
      "required": ["id", "kind", "pattern", "patternType", "appliesTo", "version", "createdAt", "updatedAt"],
      "additionalProperties": false
    },
    "slotMatch": {
      "type": "object",
      "properties": {
        "slotId": { "type": "string", "pattern": "^[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]$" },
        "pageTypeId": { "type": "string" },
        "triggeredLevel": { "$ref": "#/definitions/riskLevel" },
        "matchCondition": {
          "type": "object",
          "oneOf": [
            {
              "properties": {
                "kind": { "const": "field-non-empty" },
                "fieldPath": { "type": "string", "minLength": 1 }
              },
              "required": ["kind", "fieldPath"],
              "additionalProperties": false
            },
            {
              "properties": {
                "kind": { "const": "field-regex" },
                "fieldPath": { "type": "string", "minLength": 1 },
                "pattern": { "type": "string", "minLength": 1 }
              },
              "required": ["kind", "fieldPath", "pattern"],
              "additionalProperties": false
            },
            {
              "properties": {
                "kind": { "const": "body-regex" },
                "pattern": { "type": "string", "minLength": 1 }
              },
              "required": ["kind", "pattern"],
              "additionalProperties": false
            }
          ]
        },
        "rationale": { "type": "string" },
        "version": { "$ref": "#/definitions/semver" },
        "createdAt": { "$ref": "#/definitions/iso8601" },
        "updatedAt": { "$ref": "#/definitions/iso8601" }
      },
      "required": ["slotId", "pageTypeId", "triggeredLevel", "matchCondition", "version", "createdAt", "updatedAt"],
      "additionalProperties": false
    },
    "medicalLawRevision": {
      "type": "object",
      "properties": {
        "revisionId": { "type": "string", "minLength": 1 },
        "lawSource": { "type": "string", "minLength": 1 },
        "affectedArticles": { "type": "array", "items": { "type": "string" } },
        "revisionEffectiveDate": { "type": "string", "format": "date" },
        "revisionType": {
          "type": "string",
          "enum": ["amendment", "reaffirmation", "new"]
        },
        "sourceUrl": { "type": "string", "format": "uri" },
        "checkedAt": { "$ref": "#/definitions/iso8601" },
        "checkedBy": { "type": "string", "minLength": 1 },
        "affectedRuleIds": {
          "type": "array",
          "items": { "$ref": "#/definitions/kebabCase" }
        },
        "staleScope": {
          "type": "object",
          "properties": {
            "kind": {
              "type": "string",
              "enum": ["all", "rule-matched", "content-type"]
            },
            "contentTypes": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["kind"],
          "additionalProperties": false
        },
        "summary": { "type": "string" }
      },
      "required": ["revisionId", "lawSource", "revisionEffectiveDate", "revisionType", "sourceUrl", "checkedAt", "checkedBy", "affectedRuleIds", "staleScope"],
      "additionalProperties": false
    }
  },
  "files": {
    "rulesFile": {
      "type": "object",
      "properties": {
        "version": { "$ref": "#/definitions/semver" },
        "sourceDoc": { "type": "string" },
        "sourceDocVersion": { "type": "string" },
        "rules": {
          "type": "array",
          "items": { "$ref": "#/definitions/riskRule" }
        },
        "overrides": {
          "type": "array",
          "items": { "$ref": "#/definitions/override" }
        }
      },
      "required": ["version"],
      "additionalProperties": false
    },
    "contextExceptionsFile": {
      "type": "object",
      "properties": {
        "version": { "$ref": "#/definitions/semver" },
        "sourceDoc": { "type": "string" },
        "sourceDocVersion": { "type": "string" },
        "exceptions": {
          "type": "array",
          "items": { "$ref": "#/definitions/contextException" }
        }
      },
      "required": ["version", "exceptions"],
      "additionalProperties": false
    },
    "medicalLawTrackingFile": {
      "type": "object",
      "properties": {
        "version": { "$ref": "#/definitions/semver" },
        "sourceDoc": { "type": "string" },
        "sourceDocVersion": { "type": "string" },
        "revisions": {
          "type": "array",
          "items": { "$ref": "#/definitions/medicalLawRevision" }
        }
      },
      "required": ["version", "revisions"],
      "additionalProperties": false
    },
    "slotMatchesFile": {
      "type": "object",
      "properties": {
        "version": { "$ref": "#/definitions/semver" },
        "sourceDoc": { "type": "string" },
        "sourceDocVersion": { "type": "string" },
        "slots": {
          "type": "array",
          "items": { "$ref": "#/definitions/slotMatch" }
        }
      },
      "required": ["version", "slots"],
      "additionalProperties": false
    },
    "metaFile": {
      "type": "object",
      "properties": {
        "catalogVersion": { "$ref": "#/definitions/semver" },
        "medicalLawRevisionRef": { "type": "string" },
        "loadOrder": {
          "type": "object",
          "properties": {
            "rules": { "type": "array", "items": { "type": "string" } },
            "contextExceptions": { "type": "array", "items": { "type": "string" } },
            "tracking": { "type": "array", "items": { "type": "string" } },
            "slotMatches": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["rules", "contextExceptions", "tracking", "slotMatches"],
          "additionalProperties": false
        },
        "files": { "type": "object" }
      },
      "required": ["catalogVersion", "medicalLawRevisionRef", "loadOrder"],
      "additionalProperties": false
    }
  }
}

 succeeded in 754ms:
// COMPLIANCE_ASSISTANT_PHASE_ALPHA v1.0 scenarios — vitest scope (자동 검증 가능 부분)
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 16 (cycle 1~7 acceptance · 20 scenarios)

import { describe, it, expect, beforeAll } from "vitest";
import {
  matchRules,
  evaluateInline,
  inferRisk,
  evaluateSlots,
  loadCatalog,
  type LoadedCatalog,
  type RiskRule,
  type ContextException,
} from "@glitzy/compliance-rules";

let catalog: LoadedCatalog;

beforeAll(async () => {
  catalog = await loadCatalog();
});

describe("Phase Alpha v1.0 — 룰 매칭 (시나리오 1·2·5·6·7)", () => {
  it("시나리오 1 - 최상급 본문 → supremacy-001 fail", () => {
    const r = matchRules(
      "최고의 다이어트 한약 처방을 받아보세요",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "supremacy-001" && f.severity === "fail")).toBe(true);
  });

  it("시나리오 2 - 100% 효과 보장 → guarantee-composite-001 fail (AND_IN_SENTENCE)", () => {
    const r = matchRules(
      "100% 효과 보장합니다.",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "guarantee-composite-001" && f.severity === "fail")).toBe(true);
  });

  it("시나리오 5 - 비교 표현 → comparison-001 fail", () => {
    const r = matchRules(
      "타 병원보다 우수한 시술입니다",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "comparison-001" && f.severity === "fail")).toBe(true);
  });

  it("시나리오 6 - event-fact-statement allowlist pre-check (Article articleType=event-price → skip)", () => {
    const r = matchRules(
      "20% 할인 진행 중",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "event-price" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "event-fact-statement-001")).toBe(false);
  });

  it("시나리오 7 - event-fact-statement-001 매칭 (Article articleType=general-medical-info → content-gate)", () => {
    const r = matchRules(
      "20% 할인 진행 중",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    const f = r.findings.find((f) => f.ruleId === "event-fact-statement-001");
    expect(f?.severity).toBe("content-gate");
  });
});

describe("Phase Alpha v1.0 — composite (시나리오 15·16)", () => {
  it("시나리오 15 - guarantee-composite AND_IN_SENTENCE 단일 문장 안 매칭", () => {
    const r = matchRules(
      "반드시 효과가 있습니다.",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "guarantee-composite-001")).toBe(true);
  });

  it("시나리오 16 - 두 operand 가 다른 문장 안 분리 → 매칭 안 됨", () => {
    const r = matchRules(
      "반드시 따라야 합니다. 그 결과는 좋습니다.",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "guarantee-composite-001")).toBe(false);
  });
});

describe("Phase Alpha v1.0 — contextExceptions (시나리오 19·20·17a/17b)", () => {
  it("시나리오 19 - safety exception 으로 standalone 제거", () => {
    const r = matchRules(
      "반드시 의료진과 상담하세요.",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    // standalone 매칭하나 safety-medical-consult-001 으로 suppress
    expect(r.findings.some((f) => f.ruleId === "professional-assertion-standalone-001")).toBe(false);
    expect(r.suppressedFindings.some((sf) => sf.suppressedBy === "safety-medical-consult-001")).toBe(true);
  });

  it("시나리오 20 - warning-message exception 으로 standalone 제거", () => {
    const r = matchRules(
      "절대 금기입니다.",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    expect(r.suppressedFindings.some((sf) => sf.reason === "warning-message")).toBe(true);
  });

  it("시나리오 17a - fail composite 룰은 contextException 예외 미적용 (CAP-17 안전 보장)", () => {
    const r = matchRules(
      "100% 효과 보장. 반드시 의료진과 상담하세요.",
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
      catalog.kssAvailable,
    );
    // guarantee-composite-001 (fail composite) 안 contextException 적용 안 함 - finding 보존
    expect(r.findings.some((f) => f.ruleId === "guarantee-composite-001")).toBe(true);
  });
});

describe("Phase Alpha v1.0 — inlineRiskFlags (시나리오 23·24·26)", () => {
  it("시나리오 23 - 최상급 매칭만 → includes-effect-claim 미활성 (CAP-05 SoT 7 카테고리 정확 매칭)", () => {
    const findings = [
      {
        ruleId: "supremacy-001",
        category: "최상급",
        pattern: "최고의",
        severity: "fail" as const,
        location: { start: 0, end: 3 },
        triggeredBy: "static-rule" as const,
      },
    ];
    const r = evaluateInline("최고의 시술", findings, {
      contentType: "Article",
      pageTypeId: "P-010",
      articleType: "general-medical-info",
    });
    expect(r.inlineRiskFlags).not.toContain("includes-effect-claim");
  });

  it("시나리오 24 - guarantee-composite-001 매칭 → includes-effect-claim 활성 (전문성 단정 결합 카테고리)", () => {
    const findings = [
      {
        ruleId: "guarantee-composite-001",
        category: "전문성 단정 (효과·결과·보장 결합)",
        pattern: "100% 효과",
        severity: "fail" as const,
        location: { start: 0, end: 7 },
        triggeredBy: "static-rule" as const,
      },
    ];
    const r = evaluateInline("100% 효과 보장합니다", findings, {
      contentType: "Article",
      pageTypeId: "P-010",
      articleType: "general-medical-info",
    });
    expect(r.inlineRiskFlags).toContain("includes-effect-claim");
  });

  it("시나리오 26 - 전후사진 어휘 → includes-before-after 활성", () => {
    const r = evaluateInline("환자분의 전후사진을 보여드립니다", [], {
      contentType: "Article",
      pageTypeId: "P-010",
      articleType: "review-case",
    });
    expect(r.inlineRiskFlags).toContain("includes-before-after");
  });
});

describe("Phase Alpha v1.0 — RiskInference (시나리오 28·29·30·31·32·33·34)", () => {
  it("시나리오 28 - P-010 + notice → Low", () => {
    const r = inferRisk({
      pageTypeId: "P-010",
      articleType: "notice",
      inlineRiskFlags: [],
      slotMatches: [],
    });
    expect(r.inferredRiskLevel).toBe("Low");
    expect(r.contributingSteps.length).toBe(1);
  });

  it("시나리오 29 - P-010 + effect-result-related → High (articleType MAX)", () => {
    const r = inferRisk({
      pageTypeId: "P-010",
      articleType: "effect-result-related",
      inlineRiskFlags: [],
      slotMatches: [],
    });
    expect(r.inferredRiskLevel).toBe("High");
    expect(r.contributingSteps.length).toBe(2);
    expect(r.evaluatedSteps.length).toBe(2);
  });

  it("시나리오 31 - P-002 + explicit High → High (explicit override)", () => {
    const r = inferRisk({
      pageTypeId: "P-002",
      inlineRiskFlags: [],
      slotMatches: [],
      explicitRiskLevel: "High",
    });
    expect(r.inferredRiskLevel).toBe("High");
    expect(r.contributingSteps.find((s) => s.source === "explicitRiskLevel")).toBeDefined();
  });

  it("시나리오 34 - CAP-12 evaluatedSteps + contributingSteps 분리 (P-010 + notice + includes-event flag → High)", () => {
    const r = inferRisk({
      pageTypeId: "P-010",
      articleType: "notice",
      inlineRiskFlags: ["includes-event"],
      slotMatches: [],
    });
    // evaluatedSteps: pageType (Low) + articleType (Low) + inlineRiskFlag (High) = 3
    // contributingSteps: pageType (Low) + inlineRiskFlag (High) = 2 (articleType Low 는 base 갱신 안 함)
    expect(r.evaluatedSteps.length).toBe(3);
    expect(r.contributingSteps.length).toBe(2);
    expect(r.inferredRiskLevel).toBe("High");
  });
});

describe("Phase Alpha v1.0 — FAQ 자동 검수 (시나리오 39·40)", () => {
  it("시나리오 39 - FAQ Q+A 100% 효과 보장 → guarantee-composite-001 매칭 (P-011)", () => {
    const body = "한방 다이어트 효과는 어떻습니까?\n\n100% 효과 보장합니다.";
    const r = matchRules(
      body,
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "FAQ", pageTypeId: "P-011" },
      catalog.kssAvailable,
    );
    expect(r.findings.some((f) => f.ruleId === "guarantee-composite-001")).toBe(true);
  });

  it("시나리오 40 - FAQ 정상 Q+A → findings 비어 있음", () => {
    const body = "진료 시간은 어떻게 됩니까?\n\n주 5일 운영합니다.";
    const r = matchRules(
      body,
      catalog.rules,
      catalog.contextExceptions,
      { contentType: "FAQ", pageTypeId: "P-011" },
      catalog.kssAvailable,
    );
    expect(r.findings.length).toBe(0);
  });
});

describe("Phase Alpha v1.0 — auto-gate + workflow (CAP-CODE-19 추가 시나리오)", () => {
  it("시나리오 38 - automatedDecision='block' (fail) + gateRequired=true (High inferred) → auto-gate enqueue 안 함 (CAP-06)", async () => {
    // check() 호출 - body 안 supremacy-001 fail + explicitRiskLevel High → 가상 finding gate 도 함께 주입.
    //   automatedDecision = 'block' (fail 우선) - enqueueContentGateIfNeeded 안 큐 진입 안 함.
    const { check } = await import("../check");
    const env = await check({
      contentType: "Article",
      contentRef: "scenario-38-test",
      body: "최고의 다이어트 한약",
      metadata: { explicitRiskLevel: "High", articleType: "effect-result-related" },
    });
    expect(env.result.automatedDecision).toBe("block");
    expect(env.result.gateRequired).toBe(true);
    // auto-gate 안 block 콘텐츠 큐 진입 안 함 (server-actions 통합 흐름 안 검증)
    // 본 단위 테스트는 server-actions 까지 실행하지 않음 - enqueueContentGateIfNeeded 직접 호출 단위 테스트는 별도 필요
  });

  it("CAP-CODE-08 - ExtensionsRecord 필드명 SoT 정합 (evaluatedSteps · contributingSteps)", async () => {
    const { check } = await import("../check");
    const env = await check({
      contentType: "Article",
      contentRef: "scenario-extensions-test",
      body: "정상 본문",
      metadata: { articleType: "general-medical-info", explicitRiskLevel: "Low" },
    });
    expect(env.extensions).toBeDefined();
    expect(env.extensions?.evaluatedSteps).toBeDefined();
    expect(env.extensions?.contributingSteps).toBeDefined();
    expect(env.extensions?.engineMetadata.catalogVersion).toBe(catalog.catalogVersion);
    expect(env.extensions?.engineMetadata.kssAvailable).toBe(false);
  });

  it("CAP-CODE-07 - notice articleType 안 includes-event flag 보존 + RiskLevel 격상 제외", async () => {
    const { check } = await import("../check");
    const env = await check({
      contentType: "Article",
      contentRef: "scenario-notice-event-test",
      body: "휴진 이벤트 진행",
      metadata: { articleType: "notice" },
    });
    // includes-event flag 는 RiskInference 격상 입력 안 제외 - pageRiskLevel Low/Medium 유지 (notice base Low)
    expect(env.meta.pageRiskLevel).toBe("Low");
    // evidence 안 includes-event 는 보존 (수정 안 - 감사 정보)
    expect(env.extensions?.inlineRiskFlagsEvidence["includes-event"]).toBeDefined();
    expect(env.extensions?.suppressedLevelUpFlags).toContain("includes-event");
  });
});

describe("Phase Alpha v1.0 — catalog 로드 검증", () => {
  it("catalog 27 활성 canonical 룰 (core 14 + medical-ad 13 신규) 로드", () => {
    expect(catalog.rules.length).toBe(27);
  });

  it("contextExceptions 5종 로드", () => {
    expect(catalog.contextExceptions.length).toBe(5);
  });

  it("slot-matches v0.0 placeholder - 빈 배열", () => {
    expect(catalog.slotMatches.length).toBe(0);
  });

  it("medical-law-tracking MEDICAL_AD § 11.2 SoT 2건 (의료법 + 시행령)", () => {
    expect(catalog.medicalLawTracking.length).toBe(2);
    expect(catalog.medicalLawTracking[0]?.revisionId).toBe("2026-Q2-medical-law-2026-04-07");
  });

  it("catalogHash + schemaHash 분리 - 둘 다 정의 (CAP-26)", () => {
    expect(catalog.catalogHash).toMatch(/^[a-f0-9]{64}$/);
    expect(catalog.schemaHash).toMatch(/^[a-f0-9]{64}$/);
    expect(catalog.catalogHash).not.toBe(catalog.schemaHash);
  });

  it("KSS v0.1 fallback only (CA-DEFER-22)", () => {
    expect(catalog.kssAvailable).toBe(false);
  });

  it("supremacy-001 안 legalBasis overlay 적용 (rules.medical-ad.yaml overrides)", () => {
    const rule = catalog.rules.find((r) => r.id === "supremacy-001");
    expect(rule?.legalBasis).toContain("medical-law-art56-para2-no8");
  });
});

codex
핵심 신규 결함 후보가 하나 보입니다. 같은 record에 manual-review와 content-gate가 같은 역할을 요구하면, 두 번째 entry 승인 경로가 전역 역할 슬롯의 idempotency 분기에 걸려 entry를 resolve하지 못하는 구조입니다. 추가로 스키마 검증과 DB 제약 주변을 확인합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/final-roles.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "review_queue_entry|queue_type|partial UNIQUE|UNIQUE|content-gate|manual-review|compliance_record_id" packages apps -g "*.sql" -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Recurse -Filter C0018*.sql packages apps data | Select-Object -ExpandProperty FullName' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CREATE TABLE review_queue_entry|CREATE TYPE review_queue_type|review_queue_entry" packages/core-content/migrations packages/db -g "*.sql" -g "*.ts"' in C:\Users\assag\solution\website-exposure
 succeeded in 738ms:
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

 succeeded in 775ms:
apps\spike-b\src\worker.ts:49: * UNIQUE(outbox_id, alert_type) 충돌은 no-op (race·재시도 안전)
packages\core-content\src\schema.ts:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
packages\core-content\src\schema.ts:54:// v0.6 - COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.3 - 'content-gate' ADD VALUE (CAP-10)
packages\core-content\src\schema.ts:55:export const reviewQueueTypeEnum = pgEnum("review_queue_type", ["manual-review", "content-gate"]);
packages\core-content\src\schema.ts:197:    complianceRecordId: uuid("compliance_record_id"),
packages\core-content\src\schema.ts:232:    complianceRecordId: uuid("compliance_record_id"),
packages\core-content\src\schema.ts:291:    // v0.5 (CAM-08 정정): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages\core-content\src\schema.ts:292:    complianceRecordId: uuid("compliance_record_id"),
packages\core-content\src\schema.ts:306:    //   (구) statusSkeletonLimit · publishedAtNull · riskLevelSkeletonLimit 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
packages\core-content\src\schema.ts:309:    // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
packages\core-content\src\schema.ts:392:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages\core-content\src\schema.ts:393:    complianceRecordId: uuid("compliance_record_id"),
packages\core-content\src\schema.ts:452:    // v0.5 (CAM-08): C0016 compliance_record_id ADD + published_requires_record CHECK + guard trigger.
packages\core-content\src\schema.ts:453:    complianceRecordId: uuid("compliance_record_id"),
packages\core-content\src\schema.ts:507:    complianceRecordId: uuid("compliance_record_id"),
packages\core-content\src\schema.ts:518:    //   (구) statusV01Limit · publishedAtNullV01 모두 제거. published 시 compliance_record_id IS NOT NULL CHECK 가 C0016 안.
packages\core-content\src\schema.ts:600:  "review_queue_entry",
packages\core-content\src\schema.ts:604:    queueType: reviewQueueTypeEnum("queue_type").notNull(),
packages\core-content\src\schema.ts:607:    complianceRecordId: uuid("compliance_record_id").notNull(),
packages\core-content\src\schema.ts:624:    requiredRolesNonempty: check("review_queue_entry_required_roles_nonempty", sql`array_length(${t.requiredRoles}, 1) >= 1`),
packages\core-content\src\schema.ts:625:    resolvedRequiresAt: check("review_queue_entry_resolved_requires_at",
packages\core-content\src\schema.ts:627:    resolvedRequiresType: check("review_queue_entry_resolved_requires_type",
packages\core-content\src\schema.ts:632:      name: "review_queue_entry_compliance_fk",
packages\core-content\src\schema.ts:634:    instanceIdUnique: unique("review_queue_entry_instance_id_unique").on(t.instanceId, t.id),
packages\core-content\src\schema.ts:635:    instanceIdx: index("review_queue_entry_instance_idx").on(t.instanceId),
packages\core-content\src\schema.ts:636:    statusIdx: index("review_queue_entry_status_idx").on(t.instanceId, t.status),
packages\core-content\src\schema.ts:637:    openPriorityIdx: index("review_queue_entry_open_priority_idx")
packages\core-content\src\schema.ts:640:    contentIdx: index("review_queue_entry_content_idx").on(t.instanceId, t.contentType, t.contentRef),
packages\core-content\src\schema.ts:641:    // v0.6 - CAP-10 정정 - queue_type 포함 4-tuple (content-gate + manual-review 동시 open 가능)
packages\core-content\src\schema.ts:642:    openUnique: uniqueIndex("review_queue_entry_open_unique")
packages\compliance-rules\src\types.ts:6:export type Severity = "info" | "warning" | "fail" | "content-gate";
packages\db\migrations\D0010_instance.sql:6:  slug TEXT NOT NULL UNIQUE,  -- subdomain·routing key (예: clinic-abc)
apps\spike-b\src\scenarios\provider-smoke.ts:90:    // Phase 4: provider_attempt_log accepted-success UNIQUE (race·idempotency-key 동일 시 1만)
apps\spike-b\src\scenarios\provider-smoke.ts:95:    console.log(`[provider-smoke] phase4 accepted-success UNIQUE: ${acceptedCnt[0]!.count} (PASS)`);
apps\spike-b\src\fake-provider.ts:62:    // accepted-permanent는 UNIQUE 없음 — 다수 attempt 가능 (실제 provider도 매번 permanent 응답 가능)
apps\spike-b\src\fake-provider.ts:95:  // 4. success — accepted-success는 UNIQUE
apps\spike-b\src\fake-provider.ts:109:    // race: 동시 worker 둘 다 success insert → UNIQUE 충돌 → idempotent
apps\spike-b\src\scenarios\test-idempotency.ts:3:// - 동일 sourceEventId 2회 enqueue → 1번만 active (full UNIQUE: completed 포함)
apps\spike-b\src\scenarios\test-idempotency.ts:6:// - 동시 worker race — 같은 sourceEventId가 동시에 처리될 수 없음 (UNIQUE 차단)
apps\spike-b\src\scenarios\test-idempotency.ts:23:  // 1. sequential 2회 enqueue → 1번만 성공 (SPIKEB1-003: full UNIQUE)
apps\spike-b\src\scenarios\test-idempotency.ts:68:  // 4. completed 후 same sourceEventId 재enqueue → reject (full UNIQUE)
apps\spike-d\src\scenarios\test-canonical-generation.ts:78:  { label: "partial unique instance_user", regex: /CREATE\s+UNIQUE\s+INDEX\s+["']?instance_user_active_unique["']?[^;]+WHERE/i, canonical: true, note: "uniqueIndex().where()" },
apps\spike-d\src\migrate.ts:85:      filename TEXT NOT NULL UNIQUE,
apps\spike-e\src\migrate.ts:19:      filename TEXT NOT NULL UNIQUE,
packages\notifications-outbox\src\provider-adapter.ts:3:// idempotent at-least-once with exactly-once observable — accepted-success UNIQUE 보장은 caller (provider_attempt_log)·본 interface는 attempt 행위만
apps\spike-b\migrations\004_external_call_log.sql:18:CREATE UNIQUE INDEX external_call_log_idempotency_success
packages\notifications-outbox\src\index.ts:10://   - permanent-alert (recordPermanentAlert·UNIQUE)
packages\notifications-outbox\src\index.ts:11://   - provider_attempt_log (accepted-success UNIQUE·idempotency-key)
apps\spike-b\migrations\007_provider_attempt_log.sql:7:-- external_call_log(004)는 DB UNIQUE 기반 사후 dedupe.
apps\spike-b\migrations\007_provider_attempt_log.sql:23:CREATE UNIQUE INDEX provider_attempt_log_accepted_success
apps\spike-b\migrations\003_inbox.sql:5:-- idempotent UNIQUE(instance_id, source_event_id) — 재처리 시 no-op
apps\spike-b\migrations\003_inbox.sql:17:CREATE UNIQUE INDEX inbox_idempotency
apps\spike-b\migrations\006_permanent_alert.sql:4:-- UNIQUE(outbox_id) — 동일 outbox에 대해 alert 1건만.
apps\spike-b\migrations\006_permanent_alert.sql:17:CREATE UNIQUE INDEX permanent_alert_idempotency
apps\spike-b\migrations\002_outbox.sql:3:-- SPIKEB1-003 정정: full UNIQUE(instance_id, source_event_id) — replay 차단.
apps\spike-b\migrations\002_outbox.sql:26:-- SPIKEB1-003: full UNIQUE — replay 자체 차단 (completed 포함)
apps\spike-b\migrations\002_outbox.sql:27:CREATE UNIQUE INDEX outbox_idempotency
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:1:-- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:4:-- 변경: (instance_id, content_type, content_ref, queue_type) - content-gate + manual-review 동시 open 가능
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:6:DROP INDEX IF EXISTS review_queue_entry_open_unique;
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:7:CREATE UNIQUE INDEX review_queue_entry_open_unique
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:8:  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
apps\spike-d\migrations\002_content_test.sql:19:  -- Note: requires (instance_id, id) unique. id가 PK이므로 (instance_id, id) UNIQUE 별도 필요.
apps\spike-d\migrations\002_content_test.sql:20:  CONSTRAINT content_test_instance_id_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0017_content_gate_queue_enum.sql:1:-- @glitzy/core-content — C0017 review_queue_type enum 안 'content-gate' ADD VALUE 단독
packages\core-content\migrations\C0017_content_gate_queue_enum.sql:4:-- 본 migration 은 단독 step. C0018 (UNIQUE 재정의) 는 별 step.
packages\core-content\migrations\C0017_content_gate_queue_enum.sql:6:ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
apps\spike-d\migrations\003_instance_user_partial_unique.sql:15:CREATE UNIQUE INDEX instance_user_active_unique
packages\core-content\migrations\C0016_status_unlock.sql:1:-- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
packages\core-content\migrations\C0016_status_unlock.sql:13:-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
packages\core-content\migrations\C0016_status_unlock.sql:14:ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages\core-content\migrations\C0016_status_unlock.sql:15:ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages\core-content\migrations\C0016_status_unlock.sql:16:ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
packages\core-content\migrations\C0016_status_unlock.sql:22:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages\core-content\migrations\C0016_status_unlock.sql:26:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages\core-content\migrations\C0016_status_unlock.sql:30:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages\core-content\migrations\C0016_status_unlock.sql:34:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages\core-content\migrations\C0016_status_unlock.sql:38:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages\core-content\migrations\C0016_status_unlock.sql:42:      FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
packages\core-content\migrations\C0016_status_unlock.sql:56:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:62:WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
packages\core-content\migrations\C0016_status_unlock.sql:71:UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
packages\core-content\migrations\C0016_status_unlock.sql:76:  AND a.status = 'published' AND a.compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:84:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:90:WHERE t.status = 'published' AND t.compliance_record_id IS NULL
packages\core-content\migrations\C0016_status_unlock.sql:99:UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
packages\core-content\migrations\C0016_status_unlock.sql:104:  AND t.status = 'published' AND t.compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:111:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:118:WHERE l.status = 'published' AND l.compliance_record_id IS NULL
packages\core-content\migrations\C0016_status_unlock.sql:127:UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
packages\core-content\migrations\C0016_status_unlock.sql:132:  AND l.status = 'published' AND l.compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:139:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:145:WHERE f.status = 'published' AND f.compliance_record_id IS NULL
packages\core-content\migrations\C0016_status_unlock.sql:154:UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
packages\core-content\migrations\C0016_status_unlock.sql:159:  AND f.status = 'published' AND f.compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:166:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:172:WHERE p.status = 'published' AND p.compliance_record_id IS NULL
packages\core-content\migrations\C0016_status_unlock.sql:181:UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
packages\core-content\migrations\C0016_status_unlock.sql:186:  AND p.status = 'published' AND p.compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:192:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:198:WHERE m.status = 'published' AND m.compliance_record_id IS NULL
packages\core-content\migrations\C0016_status_unlock.sql:207:UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
packages\core-content\migrations\C0016_status_unlock.sql:212:  AND m.status = 'published' AND m.compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:218:  SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:219:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
packages\core-content\migrations\C0016_status_unlock.sql:220:  SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:221:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
packages\core-content\migrations\C0016_status_unlock.sql:222:  SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:223:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
packages\core-content\migrations\C0016_status_unlock.sql:224:  SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:225:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
packages\core-content\migrations\C0016_status_unlock.sql:226:  SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:227:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
packages\core-content\migrations\C0016_status_unlock.sql:228:  SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
packages\core-content\migrations\C0016_status_unlock.sql:229:  IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
packages\core-content\migrations\C0016_status_unlock.sql:235:    ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages\core-content\migrations\C0016_status_unlock.sql:239:    ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages\core-content\migrations\C0016_status_unlock.sql:243:    ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages\core-content\migrations\C0016_status_unlock.sql:247:    ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages\core-content\migrations\C0016_status_unlock.sql:251:    ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages\core-content\migrations\C0016_status_unlock.sql:255:    ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
packages\core-content\migrations\C0016_status_unlock.sql:269:  IF NEW.compliance_record_id IS NULL THEN
packages\core-content\migrations\C0016_status_unlock.sql:270:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
packages\core-content\migrations\C0016_status_unlock.sql:273:   WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
packages\core-content\migrations\C0016_status_unlock.sql:275:    RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
apps\spike-d\migrations\005_migration_ledger.sql:7:  filename TEXT NOT NULL UNIQUE,
packages\core-content\migrations\C0015_review_queue_entry.sql:2:-- M0 v0.1: manual-review queue 1종 만. warning/stale 은 ADD VALUE cascade (CA-DEFER-05/06).
packages\core-content\migrations\C0015_review_queue_entry.sql:5:CREATE TYPE review_queue_type AS ENUM ('manual-review');
packages\core-content\migrations\C0015_review_queue_entry.sql:10:CREATE TABLE review_queue_entry (
packages\core-content\migrations\C0015_review_queue_entry.sql:13:  queue_type review_queue_type NOT NULL,
packages\core-content\migrations\C0015_review_queue_entry.sql:16:  compliance_record_id UUID NOT NULL,
packages\core-content\migrations\C0015_review_queue_entry.sql:29:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
packages\core-content\migrations\C0015_review_queue_entry.sql:30:  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
packages\core-content\migrations\C0015_review_queue_entry.sql:33:  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
packages\core-content\migrations\C0015_review_queue_entry.sql:36:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
packages\core-content\migrations\C0015_review_queue_entry.sql:38:  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0015_review_queue_entry.sql:41:CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
packages\core-content\migrations\C0015_review_queue_entry.sql:42:CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
packages\core-content\migrations\C0015_review_queue_entry.sql:43:CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
packages\core-content\migrations\C0015_review_queue_entry.sql:45:CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
packages\core-content\migrations\C0015_review_queue_entry.sql:46:CREATE UNIQUE INDEX review_queue_entry_open_unique
packages\core-content\migrations\C0015_review_queue_entry.sql:47:  ON review_queue_entry (instance_id, content_type, content_ref)
packages\core-content\migrations\C0015_review_queue_entry.sql:50:ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
packages\core-content\migrations\C0015_review_queue_entry.sql:51:ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
packages\core-content\migrations\C0015_review_queue_entry.sql:53:CREATE POLICY tenant_isolation ON review_queue_entry
packages\core-content\migrations\C0015_review_queue_entry.sql:58:GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;
packages\core-content\migrations\C0006_legal_document.sql:49:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0006_legal_document.sql:50:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0006_legal_document.sql:53:-- LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제 — LL-DEFER-12)
packages\core-content\migrations\C0006_legal_document.sql:54:CREATE UNIQUE INDEX legal_document_instance_5type_unique
packages\core-content\migrations\C0014_compliance_record.sql:59:  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
packages\core-content\migrations\C0014_compliance_record.sql:60:  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0005_article.sql:14:  compliance_record_id UUID,
packages\core-content\migrations\C0005_article.sql:26:  CONSTRAINT article_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0005_article.sql:27:  CONSTRAINT article_instance_id_unique UNIQUE (instance_id, id),
apps\spike-e\migrations\002_admin_user.sql:9:  email TEXT NOT NULL UNIQUE,
apps\spike-e\migrations\002_admin_user.sql:40:CREATE UNIQUE INDEX instance_membership_active_unique
packages\core-content\migrations\C0004_treatment_page.sql:22:  compliance_record_id UUID,
packages\core-content\migrations\C0004_treatment_page.sql:32:  CONSTRAINT treatment_page_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0004_treatment_page.sql:33:  CONSTRAINT treatment_page_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0003_doctor_profile.sql:21:  CONSTRAINT doctor_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0003_doctor_profile.sql:22:  CONSTRAINT doctor_profile_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0012_faq.sql:20:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
packages\core-content\migrations\C0012_faq.sql:31:  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0012_faq.sql:32:  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0011_media_appearance.sql:42:  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0011_media_appearance.sql:43:  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0002_location_profile.sql:34:  CONSTRAINT location_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0002_location_profile.sql:35:  CONSTRAINT location_profile_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0001_clinic_profile.sql:26:  CONSTRAINT clinic_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0001_clinic_profile.sql:27:  CONSTRAINT clinic_profile_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0010_publication.sql:46:  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0010_publication.sql:47:  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0009_article_category.sql:29:  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0009_article_category.sql:30:  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
apps\web\src\lib\compliance\auto-gate.ts:4:// CAP2-06 - event id 'content-gate-queued' + source: "auto"
apps\web\src\lib\compliance\auto-gate.ts:38:  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
apps\web\src\lib\compliance\auto-gate.ts:40:    SELECT id FROM review_queue_entry
apps\web\src\lib\compliance\auto-gate.ts:44:      AND queue_type = 'content-gate'::review_queue_type
apps\web\src\lib\compliance\auto-gate.ts:53:    INSERT INTO review_queue_entry (
apps\web\src\lib\compliance\auto-gate.ts:54:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
apps\web\src\lib\compliance\auto-gate.ts:58:      'content-gate'::review_queue_type,
packages\migrations-runner\src\manifest.ts:193:  // (18) C0015 review_queue_entry (CA-SCHEMA-04)
packages\migrations-runner\src\manifest.ts:195:    file: "packages/core-content/migrations/C0015_review_queue_entry.sql",
packages\migrations-runner\src\manifest.ts:198:      "review_queue_entry",
packages\migrations-runner\src\manifest.ts:199:      "review_queue_type",
packages\migrations-runner\src\manifest.ts:206:  // (19) C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger (CA-SCHEMA-07~10)
packages\migrations-runner\src\manifest.ts:211:      "article.compliance_record_id",
packages\migrations-runner\src\manifest.ts:212:      "treatment_page.compliance_record_id",
packages\migrations-runner\src\manifest.ts:213:      "legal_document.compliance_record_id",
packages\migrations-runner\src\manifest.ts:214:      "publication.compliance_record_id",
packages\migrations-runner\src\manifest.ts:215:      "media_appearance.compliance_record_id",
packages\migrations-runner\src\manifest.ts:247:  // (20) C0017 review_queue_type enum 안 'content-gate' ADD VALUE 단독
packages\migrations-runner\src\manifest.ts:253:    creates: ["review_queue_type.content-gate"],
packages\migrations-runner\src\manifest.ts:254:    dependsOn: ["review_queue_type"],
packages\migrations-runner\src\manifest.ts:256:  // (21) C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
packages\migrations-runner\src\manifest.ts:258:  //   기존: (instance_id, content_type, content_ref) · 변경: (instance_id, content_type, content_ref, queue_type)
packages\migrations-runner\src\manifest.ts:262:    creates: ["review_queue_entry_open_unique"],
packages\migrations-runner\src\manifest.ts:263:    dependsOn: ["review_queue_entry", "review_queue_type.content-gate"],
apps\web\src\lib\compliance\check.ts:51:      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
apps\web\src\lib\compliance\check.ts:82:      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
apps\web\src\lib\compliance\check.ts:151:    severity: "content-gate",
apps\web\src\lib\compliance\check.ts:178:  const counts = { fail: 0, "content-gate": 0, warning: 0, info: 0 };
apps\web\src\lib\compliance\check.ts:181:  const gateRequired = counts["content-gate"] > 0;
apps\web\src\lib\compliance\entity-actions.ts:129:        // CAP-CODE-10 정정 - content-gate 큐 진입 시 별도 audit emit (REVIEW_WORKFLOW § 9.1.1 정합 · source:"auto")
apps\web\src\lib\compliance\entity-actions.ts:132:            eventType: "content-gate-queued",
apps\web\src\lib\compliance\entity-actions.ts:189:        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
apps\web\src\lib\compliance\server-actions.ts:122:    INSERT INTO review_queue_entry (
apps\web\src\lib\compliance\server-actions.ts:123:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
apps\web\src\lib\compliance\server-actions.ts:127:      'manual-review'::review_queue_type,
apps\web\src\lib\compliance\server-actions.ts:140:  // CAP-CODE-09·10·11 정정 - auto-gate helper 단일 경로 통합 (server-actions 중복 SQL 제거 · 영업일 3일 SLA · content-gate-queued audit emit 별도 wrapper)
apps\web\src\lib\compliance\server-actions.ts:152:  // CAP-CODE-13 정정 - 호출자가 선택한 entry 만 잠금 + 처리. manual-review · content-gate 동시 open 가능.
apps\web\src\lib\compliance\server-actions.ts:173:  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 호출자가 잠금 entry 결정.
apps\web\src\lib\compliance\server-actions.ts:174:  const entryRows = await tx<{ id: string; status: string; queue_type: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
apps\web\src\lib\compliance\server-actions.ts:175:    SELECT id, status::text AS status, queue_type::text AS queue_type, assigned_to, required_roles::text[] AS required_roles,
apps\web\src\lib\compliance\server-actions.ts:177:      FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:179:       AND compliance_record_id = ${args.recordId}::uuid
apps\web\src\lib\compliance\server-actions.ts:248:      UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:277:      UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:288:    //   manual-review + content-gate 동시 open 시 둘 다 resolved 후 publishable.
apps\web\src\lib\compliance\server-actions.ts:291:        FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:293:         AND compliance_record_id = ${args.recordId}::uuid
apps\web\src\lib\compliance\server-actions.ts:345:  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 엉뚱한 큐 처리 회피.
apps\web\src\lib\compliance\server-actions.ts:349:      FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:351:       AND compliance_record_id = ${args.recordId}::uuid
apps\web\src\lib\compliance\server-actions.ts:387:    UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:454:  //   manual-review · content-gate 큐 중 1+ 가 open 이면 publish 차단.
apps\web\src\lib\compliance\server-actions.ts:457:      FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:459:       AND compliance_record_id = ${args.recordId}::uuid
apps\web\src\lib\compliance\server-actions.ts:486:  // (2) entity status → published + published_at + compliance_record_id 채움.
apps\web\src\lib\compliance\server-actions.ts:492:           compliance_record_id = '${args.recordId}',
apps\web\src\lib\compliance\types.ts:45:  severity: "info" | "warning" | "fail" | "content-gate";
apps\web\src\lib\compliance\types.ts:62:    "content-gate": number;
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:67:  it("시나리오 7 - event-fact-statement-001 매칭 (Article articleType=general-medical-info → content-gate)", () => {
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:76:    expect(f?.severity).toBe("content-gate");
apps\web\src\lib\compliance\__tests__\compliance.test.ts:70:    expect(env.result.findingsBySeverity["content-gate"]).toBeGreaterThanOrEqual(1);
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:289:          // LLC-06 patch: closed 5종 partial UNIQUE 는 (instance_id, document_type) WHERE document_type IN (5종).
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:47:        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:48:          SELECT compliance_record_id, content_type::text AS content_type, content_ref
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:49:            FROM review_queue_entry
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:60:          recordId: entry.compliance_record_id,
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:84:            recordId: result.entry.compliance_record_id,
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:135:        const rows = await tx<{ compliance_record_id: string; content_type: string; content_ref: string }[]>`
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:136:          SELECT compliance_record_id, content_type::text AS content_type, content_ref
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:137:            FROM review_queue_entry
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:148:          recordId: entry.compliance_record_id,
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:173:            recordId: result.entry.compliance_record_id,

 succeeded in 734ms:
packages/core-content/migrations\C0018_review_queue_unique_redefine.sql:1:-- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
packages/core-content/migrations\C0018_review_queue_unique_redefine.sql:6:DROP INDEX IF EXISTS review_queue_entry_open_unique;
packages/core-content/migrations\C0018_review_queue_unique_redefine.sql:7:CREATE UNIQUE INDEX review_queue_entry_open_unique
packages/core-content/migrations\C0018_review_queue_unique_redefine.sql:8:  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
packages/core-content/migrations\C0015_review_queue_entry.sql:5:CREATE TYPE review_queue_type AS ENUM ('manual-review');
packages/core-content/migrations\C0015_review_queue_entry.sql:10:CREATE TABLE review_queue_entry (
packages/core-content/migrations\C0015_review_queue_entry.sql:29:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
packages/core-content/migrations\C0015_review_queue_entry.sql:30:  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
packages/core-content/migrations\C0015_review_queue_entry.sql:33:  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
packages/core-content/migrations\C0015_review_queue_entry.sql:36:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
packages/core-content/migrations\C0015_review_queue_entry.sql:38:  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations\C0015_review_queue_entry.sql:41:CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
packages/core-content/migrations\C0015_review_queue_entry.sql:42:CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
packages/core-content/migrations\C0015_review_queue_entry.sql:43:CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
packages/core-content/migrations\C0015_review_queue_entry.sql:45:CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
packages/core-content/migrations\C0015_review_queue_entry.sql:46:CREATE UNIQUE INDEX review_queue_entry_open_unique
packages/core-content/migrations\C0015_review_queue_entry.sql:47:  ON review_queue_entry (instance_id, content_type, content_ref)
packages/core-content/migrations\C0015_review_queue_entry.sql:50:ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations\C0015_review_queue_entry.sql:51:ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
packages/core-content/migrations\C0015_review_queue_entry.sql:53:CREATE POLICY tenant_isolation ON review_queue_entry
packages/core-content/migrations\C0015_review_queue_entry.sql:58:GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;

2026-05-19T05:16:34.898161Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1mGet-ChildItem: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-ChildItem -Recurse -Filter C0018*.sql packages apps data[0m | Select …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mA positional parameter cannot be found that accepts argument 'apps'.[0m

 exited 1 in 888ms:
[31;1mGet-ChildItem: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-ChildItem -Recurse -Filter C0018*.sql packages apps data[0m | Select …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mA positional parameter cannot be found that accepts argument 'apps'.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"export const faq|faq =|pgTable\\(\\\"faq\\\"|question|answer\" packages/core-content/src/schema.ts packages/core-content/migrations/C0012_faq.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"export const publication|pgTable\\(\\\"publication\\\"|abstract|summary|media_appearance|export const mediaAppearance\" packages/core-content/src/schema.ts packages/core-content/migrations/C0010_publication.sql packages/core-content/migrations/C0011_media_appearance.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "article_type|body_markdown|risk_level" packages/core-content/src/schema.ts packages/core-content/migrations/C0005_article.sql packages/core-content/migrations/C0004_treatment_page.sql' in C:\Users\assag\solution\website-exposure
2026-05-19T05:16:46.746262Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: regex parse error:
    (?:export const faq|faq =|pgTable\(\)
    ^
error: unclosed group

 exited 1 in 679ms:
rg: regex parse error:
    (?:export const faq|faq =|pgTable\(\)
    ^
error: unclosed group

2026-05-19T05:16:46.760263Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: regex parse error:
    (?:export const publication|pgTable\(\)
    ^
error: unclosed group

 exited 1 in 696ms:
rg: regex parse error:
    (?:export const publication|pgTable\(\)
    ^
error: unclosed group

 succeeded in 707ms:
packages/core-content/migrations/C0005_article.sql:11:  body_markdown TEXT NOT NULL,
packages/core-content/migrations/C0005_article.sql:13:  risk_level risk_level,
packages/core-content/migrations/C0004_treatment_page.sql:3:-- M0-03 cycle2: risk_level enum 3종·대문자 (RISK_LEVELS SoT)
packages/core-content/migrations/C0004_treatment_page.sql:11:CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');
packages/core-content/migrations/C0004_treatment_page.sql:19:  body_markdown TEXT NOT NULL,
packages/core-content/migrations/C0004_treatment_page.sql:21:  risk_level risk_level,
packages/core-content/src/schema.ts:39:export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
packages/core-content/src/schema.ts:194:    bodyMarkdown: text("body_markdown").notNull(),
packages/core-content/src/schema.ts:196:    riskLevel: riskLevelEnum("risk_level"),
packages/core-content/src/schema.ts:229:    bodyMarkdown: text("body_markdown").notNull(),
packages/core-content/src/schema.ts:231:    riskLevel: riskLevelEnum("risk_level"),
packages/core-content/src/schema.ts:289:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:327://   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
packages/core-content/src/schema.ts:341:    articleTypeDefault: text("article_type_default"),
packages/core-content/src/schema.ts:371://   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
packages/core-content/src/schema.ts:390:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:411:    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
packages/core-content/src/schema.ts:450:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:468:    riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
packages/core-content/src/schema.ts:506:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:558:    pageRiskLevel: riskLevelEnum("page_risk_level").notNull(),
packages/core-content/src/schema.ts:559:    articleType: text("article_type"),

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'faq|question|answer' packages/core-content/src/schema.ts packages/core-content/migrations/C0012_faq.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'publication|media_appearance|abstract|summary' packages/core-content/src/schema.ts packages/core-content/migrations/C0010_publication.sql packages/core-content/migrations/C0011_media_appearance.sql" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0005_article.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'article_type' packages/core-content/migrations packages/core-content/src/schema.ts" in C:\Users\assag\solution\website-exposure
 succeeded in 710ms:
packages/core-content/migrations/C0010_publication.sql:4:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations/C0010_publication.sql:6:CREATE TABLE publication (
packages/core-content/migrations/C0010_publication.sql:18:  summary TEXT NOT NULL,
packages/core-content/migrations/C0010_publication.sql:20:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0010_publication.sql:26:  CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
packages/core-content/migrations/C0010_publication.sql:27:  CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
packages/core-content/migrations/C0010_publication.sql:28:  CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
packages/core-content/migrations/C0010_publication.sql:29:  CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
packages/core-content/migrations/C0010_publication.sql:30:  CONSTRAINT publication_thumbnail_url_format CHECK (
packages/core-content/migrations/C0010_publication.sql:33:  CONSTRAINT publication_doi_format CHECK (
packages/core-content/migrations/C0010_publication.sql:36:  CONSTRAINT publication_pubmed_id_format CHECK (
packages/core-content/migrations/C0010_publication.sql:39:  CONSTRAINT publication_authors_array CHECK (
packages/core-content/migrations/C0010_publication.sql:42:  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0010_publication.sql:43:  CONSTRAINT publication_published_requires_at CHECK (
packages/core-content/migrations/C0010_publication.sql:46:  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0010_publication.sql:47:  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
packages/core-content/migrations/C0010_publication.sql:48:  CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
packages/core-content/migrations/C0010_publication.sql:52:CREATE INDEX publication_instance_idx ON publication (instance_id);
packages/core-content/migrations/C0010_publication.sql:53:CREATE INDEX publication_status_idx ON publication (instance_id, status);
packages/core-content/migrations/C0010_publication.sql:54:CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
packages/core-content/migrations/C0010_publication.sql:56:CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
packages/core-content/migrations/C0010_publication.sql:59:ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0010_publication.sql:60:ALTER TABLE publication FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0010_publication.sql:62:CREATE POLICY tenant_isolation ON publication
packages/core-content/migrations/C0010_publication.sql:67:GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
packages/core-content/migrations/C0011_media_appearance.sql:4:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations/C0011_media_appearance.sql:8:CREATE TABLE media_appearance (
packages/core-content/migrations/C0011_media_appearance.sql:19:  summary TEXT NOT NULL,
packages/core-content/migrations/C0011_media_appearance.sql:21:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0011_media_appearance.sql:27:  CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
packages/core-content/migrations/C0011_media_appearance.sql:28:  CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
packages/core-content/migrations/C0011_media_appearance.sql:29:  CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
packages/core-content/migrations/C0011_media_appearance.sql:30:  CONSTRAINT media_appearance_channel_name_length CHECK (length(channel_name) BETWEEN 1 AND 100),
packages/core-content/migrations/C0011_media_appearance.sql:31:  CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
packages/core-content/migrations/C0011_media_appearance.sql:32:  CONSTRAINT media_appearance_thumbnail_url_format CHECK (
packages/core-content/migrations/C0011_media_appearance.sql:35:  CONSTRAINT media_appearance_duration_positive CHECK (
packages/core-content/migrations/C0011_media_appearance.sql:38:  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0011_media_appearance.sql:39:  CONSTRAINT media_appearance_published_requires_at CHECK (
packages/core-content/migrations/C0011_media_appearance.sql:42:  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0011_media_appearance.sql:43:  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
packages/core-content/migrations/C0011_media_appearance.sql:44:  CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
packages/core-content/migrations/C0011_media_appearance.sql:48:CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
packages/core-content/migrations/C0011_media_appearance.sql:49:CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
packages/core-content/migrations/C0011_media_appearance.sql:50:CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
packages/core-content/migrations/C0011_media_appearance.sql:52:CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
packages/core-content/migrations/C0011_media_appearance.sql:55:ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0011_media_appearance.sql:56:ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0011_media_appearance.sql:58:CREATE POLICY tenant_isolation ON media_appearance
packages/core-content/migrations/C0011_media_appearance.sql:63:GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
packages/core-content/src/schema.ts:4:// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
packages/core-content/src/schema.ts:34:export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
packages/core-content/src/schema.ts:184:// === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===
packages/core-content/src/schema.ts:193:    summary: text("summary").notNull(),
packages/core-content/src/schema.ts:207:    summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
packages/core-content/src/schema.ts:228:    summary: text("summary").notNull(),
packages/core-content/src/schema.ts:246:    summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
packages/core-content/src/schema.ts:373:export const publication = pgTable(
packages/core-content/src/schema.ts:374:  "publication",
packages/core-content/src/schema.ts:387:    summary: text("summary").notNull(),
packages/core-content/src/schema.ts:399:    slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
packages/core-content/src/schema.ts:400:    titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
packages/core-content/src/schema.ts:401:    summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
packages/core-content/src/schema.ts:402:    urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
packages/core-content/src/schema.ts:403:    thumbnailUrlFormat: check("publication_thumbnail_url_format",
packages/core-content/src/schema.ts:405:    doiFormat: check("publication_doi_format",
packages/core-content/src/schema.ts:407:    pubmedIdFormat: check("publication_pubmed_id_format",
packages/core-content/src/schema.ts:409:    authorsArray: check("publication_authors_array",
packages/core-content/src/schema.ts:411:    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
packages/core-content/src/schema.ts:412:    publishedRequiresAt: check("publication_published_requires_at",
packages/core-content/src/schema.ts:414:    instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
packages/core-content/src/schema.ts:415:    instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
packages/core-content/src/schema.ts:416:    instanceIdx: index("publication_instance_idx").on(t.instanceId),
packages/core-content/src/schema.ts:417:    statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
packages/core-content/src/schema.ts:418:    publishedIdx: index("publication_published_idx")
packages/core-content/src/schema.ts:421:    authorIdx: index("publication_author_idx")
packages/core-content/src/schema.ts:427:      name: "publication_author_doctor_fk",
packages/core-content/src/schema.ts:435:  "media_appearance",
packages/core-content/src/schema.ts:447:    summary: text("summary").notNull(),
packages/core-content/src/schema.ts:459:    slugRegex: check("media_appearance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
packages/core-content/src/schema.ts:460:    titleLen: check("media_appearance_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
packages/core-content/src/schema.ts:461:    summaryLen: check("media_appearance_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
packages/core-content/src/schema.ts:462:    channelNameLen: check("media_appearance_channel_name_length", sql`length(${t.channelName}) BETWEEN 1 AND 100`),
packages/core-content/src/schema.ts:463:    urlFormat: check("media_appearance_url_format", sql`${t.url} ~ '^https?://'`),
packages/core-content/src/schema.ts:464:    thumbnailUrlFormat: check("media_appearance_thumbnail_url_format",
packages/core-content/src/schema.ts:466:    durationPositive: check("media_appearance_duration_positive",
packages/core-content/src/schema.ts:468:    riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
packages/core-content/src/schema.ts:469:    publishedRequiresAt: check("media_appearance_published_requires_at",
packages/core-content/src/schema.ts:471:    instanceSlugUnique: unique("media_appearance_instance_slug_unique").on(t.instanceId, t.slug),
packages/core-content/src/schema.ts:472:    instanceIdUnique: unique("media_appearance_instance_id_unique").on(t.instanceId, t.id),
packages/core-content/src/schema.ts:473:    instanceIdx: index("media_appearance_instance_idx").on(t.instanceId),
packages/core-content/src/schema.ts:474:    statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
packages/core-content/src/schema.ts:475:    publishedIdx: index("media_appearance_published_idx")
packages/core-content/src/schema.ts:478:    authorIdx: index("media_appearance_author_idx")
packages/core-content/src/schema.ts:484:      name: "media_appearance_author_doctor_fk",

 succeeded in 724ms:
packages/core-content/migrations/C0012_faq.sql:7:CREATE TABLE faq (
packages/core-content/migrations/C0012_faq.sql:11:  question TEXT NOT NULL,
packages/core-content/migrations/C0012_faq.sql:12:  answer TEXT NOT NULL,
packages/core-content/migrations/C0012_faq.sql:25:  CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
packages/core-content/migrations/C0012_faq.sql:26:  CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
packages/core-content/migrations/C0012_faq.sql:27:  CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
packages/core-content/migrations/C0012_faq.sql:29:  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),
packages/core-content/migrations/C0012_faq.sql:30:  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),
packages/core-content/migrations/C0012_faq.sql:31:  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0012_faq.sql:32:  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
packages/core-content/migrations/C0012_faq.sql:33:  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
packages/core-content/migrations/C0012_faq.sql:35:  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
packages/core-content/migrations/C0012_faq.sql:37:  CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
packages/core-content/migrations/C0012_faq.sql:42:CREATE INDEX faq_instance_idx ON faq (instance_id);
packages/core-content/migrations/C0012_faq.sql:43:CREATE INDEX faq_status_idx ON faq (instance_id, status);
packages/core-content/migrations/C0012_faq.sql:44:CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
packages/core-content/migrations/C0012_faq.sql:46:CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
packages/core-content/migrations/C0012_faq.sql:48:CREATE INDEX faq_order_idx ON faq (instance_id, display_order, id);
packages/core-content/migrations/C0012_faq.sql:50:ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0012_faq.sql:51:ALTER TABLE faq FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0012_faq.sql:53:CREATE POLICY tenant_isolation ON faq
packages/core-content/migrations/C0012_faq.sql:58:GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
packages/core-content/src/schema.ts:4:// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
packages/core-content/src/schema.ts:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
packages/core-content/src/schema.ts:492:export const faq = pgTable(
packages/core-content/src/schema.ts:493:  "faq",
packages/core-content/src/schema.ts:498:    question: text("question").notNull(),
packages/core-content/src/schema.ts:499:    answer: text("answer").notNull(),
packages/core-content/src/schema.ts:514:    slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
packages/core-content/src/schema.ts:515:    questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
packages/core-content/src/schema.ts:516:    answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
packages/core-content/src/schema.ts:519:    instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
packages/core-content/src/schema.ts:520:    instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
packages/core-content/src/schema.ts:521:    instanceIdx: index("faq_instance_idx").on(t.instanceId),
packages/core-content/src/schema.ts:522:    statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
packages/core-content/src/schema.ts:523:    publishedIdx: index("faq_published_idx")
packages/core-content/src/schema.ts:526:    categoryIdx: index("faq_category_idx")
packages/core-content/src/schema.ts:529:    orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
packages/core-content/src/schema.ts:533:      name: "faq_category_fk",
packages/core-content/src/schema.ts:538:      name: "faq_author_doctor_fk",
packages/core-content/src/schema.ts:543:      name: "faq_related_treatment_fk",

 succeeded in 681ms:
-- @glitzy/core-content — C0005 Article (DATA_MODEL C-04·v0.2 patch)
-- M0-05 cycle2: composite FK ON DELETE NO ACTION — author 삭제는 application layer 처리
-- M0-02·03 cycle2: enum 통합 (C0004에서 정의)

CREATE TABLE article (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level,
  compliance_record_id UUID,
  hero_image_url TEXT,
  author_doctor_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT article_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  CONSTRAINT article_title_length CHECK (length(title) BETWEEN 1 AND 200),
    -- M0-21 cycle3: DATA_MODEL C-04 정합 80~200
  CONSTRAINT article_summary_length CHECK (length(summary) BETWEEN 80 AND 200),
  CONSTRAINT article_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT article_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT article_instance_id_unique UNIQUE (instance_id, id),
  -- M0-05 cycle2: ON DELETE NO ACTION — instance_id NOT NULL과 충돌 회피
  CONSTRAINT article_author_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile(instance_id, id) ON DELETE NO ACTION
);

CREATE INDEX article_instance_idx ON article (instance_id);
CREATE INDEX article_status_idx ON article (instance_id, status);
CREATE INDEX article_published_idx ON article (instance_id, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX article_author_idx ON article (instance_id, author_doctor_id) WHERE author_doctor_id IS NOT NULL;

ALTER TABLE article ENABLE ROW LEVEL SECURITY;
ALTER TABLE article FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON article
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON article TO app_tenant_user;

 succeeded in 687ms:
packages/core-content/src/schema.ts:327://   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
packages/core-content/src/schema.ts:341:    articleTypeDefault: text("article_type_default"),
packages/core-content/src/schema.ts:559:    articleType: text("article_type"),
packages/core-content/migrations\C0009_article_category.sql:17:  article_type_default TEXT,                     -- v0.1 nullable
packages/core-content/migrations\C0014_compliance_record.sql:22:  article_type TEXT,

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'CREATE TABLE legal_document|body_markdown|risk_level|document_type' packages/core-content/migrations/C0006_legal_document.sql packages/core-content/src/schema.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'article_type|abstract|bodyColumn|articleTypeSelect|Publication|bodySelect' apps/web/src/lib/compliance/entity-actions.ts packages/core-content/migrations packages/core-content/src/schema.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'articleType|article_type' apps/web/src/app/(admin) apps/web/src/lib packages/core-content -g '*.ts' -g '*.sql'" in C:\Users\assag\solution\website-exposure
 succeeded in 658ms:
packages/core-content/migrations/C0006_legal_document.sql:2:-- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum
packages/core-content/migrations/C0006_legal_document.sql:5:CREATE TYPE legal_document_type AS ENUM (
packages/core-content/migrations/C0006_legal_document.sql:9:CREATE TABLE legal_document (
packages/core-content/migrations/C0006_legal_document.sql:13:  document_type legal_document_type NOT NULL,
packages/core-content/migrations/C0006_legal_document.sql:25:  risk_level risk_level NOT NULL DEFAULT 'Low',
packages/core-content/migrations/C0006_legal_document.sql:47:  -- LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
packages/core-content/migrations/C0006_legal_document.sql:48:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0006_legal_document.sql:55:  ON legal_document (instance_id, document_type)
packages/core-content/migrations/C0006_legal_document.sql:56:  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
packages/core-content/src/schema.ts:39:export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
packages/core-content/src/schema.ts:41:// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
packages/core-content/src/schema.ts:42:export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
packages/core-content/src/schema.ts:194:    bodyMarkdown: text("body_markdown").notNull(),
packages/core-content/src/schema.ts:196:    riskLevel: riskLevelEnum("risk_level"),
packages/core-content/src/schema.ts:229:    bodyMarkdown: text("body_markdown").notNull(),
packages/core-content/src/schema.ts:231:    riskLevel: riskLevelEnum("risk_level"),
packages/core-content/src/schema.ts:278:    documentType: legalDocumentTypeEnum("document_type").notNull(),
packages/core-content/src/schema.ts:289:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:371://   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
packages/core-content/src/schema.ts:390:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:411:    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
packages/core-content/src/schema.ts:450:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:468:    riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
packages/core-content/src/schema.ts:506:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
packages/core-content/src/schema.ts:558:    pageRiskLevel: riskLevelEnum("page_risk_level").notNull(),

 succeeded in 675ms:
packages/core-content/src/schema.ts:34:export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
packages/core-content/src/schema.ts:52:  "Feature", "Publication", "MediaAppearance",
packages/core-content/src/schema.ts:195:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
packages/core-content/src/schema.ts:230:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
packages/core-content/src/schema.ts:288:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
packages/core-content/src/schema.ts:327://   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
packages/core-content/src/schema.ts:341:    articleTypeDefault: text("article_type_default"),
packages/core-content/src/schema.ts:370:// === Publication (C-24·EC-SCHEMA-08) ===
packages/core-content/src/schema.ts:389:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
packages/core-content/src/schema.ts:449:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
packages/core-content/src/schema.ts:505:    status: contentPublicationStatusEnum("status").notNull().default("draft"),
packages/core-content/src/schema.ts:559:    articleType: text("article_type"),
apps/web/src/lib/compliance/entity-actions.ts:30:  Publication: "publication",
apps/web/src/lib/compliance/entity-actions.ts:39:  Publication: "publications",
apps/web/src/lib/compliance/entity-actions.ts:60:        const bodyColumn = (() => {
apps/web/src/lib/compliance/entity-actions.ts:63:          if (contentType === "Publication") return "abstract";
apps/web/src/lib/compliance/entity-actions.ts:67:        const riskLevelSelect = (contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance") ? "NULL::text" : "risk_level::text";
apps/web/src/lib/compliance/entity-actions.ts:68:        const articleTypeSelect = contentType === "Article" ? "article_type::text" : "NULL::text";
apps/web/src/lib/compliance/entity-actions.ts:70:        const bodySelect = bodyColumn ? `${bodyColumn}::text` : "NULL::text";
apps/web/src/lib/compliance/entity-actions.ts:71:        const rows = await tx.unsafe<{ status: string; risk_level: string | null; body: string | null; article_type: string | null; faq_question: string | null }[]>(`
apps/web/src/lib/compliance/entity-actions.ts:74:                 ${bodySelect} AS body,
apps/web/src/lib/compliance/entity-actions.ts:75:                 ${articleTypeSelect} AS article_type,
apps/web/src/lib/compliance/entity-actions.ts:97:            articleType: row.article_type ?? undefined,
packages/core-content/migrations\C0010_publication.sql:1:-- @glitzy/core-content — C0010 Publication (DATA_MODEL C-24·EAT_CONTENT_PLAN v1.0 § 2.3)
packages/core-content/migrations\C0009_article_category.sql:17:  article_type_default TEXT,                     -- v0.1 nullable
packages/core-content/migrations\C0016_status_unlock.sql:13:-- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
packages/core-content/migrations\C0016_status_unlock.sql:161:-- Publication · MediaAppearance — risk_level 'Low' fixed
packages/core-content/migrations\C0016_status_unlock.sql:165:SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
packages/core-content/migrations\C0016_status_unlock.sql:176:      AND cr.content_type = 'Publication'::compliance_content_type
packages/core-content/migrations\C0016_status_unlock.sql:183:  AND cr.content_type = 'Publication'::compliance_content_type
packages/core-content/migrations\C0016_status_unlock.sql:286:    WHEN 'publication' THEN 'Publication'
packages/core-content/migrations\C0014_compliance_record.sql:13:  'Feature', 'Publication', 'MediaAppearance'
packages/core-content/migrations\C0014_compliance_record.sql:22:  article_type TEXT,

2026-05-19T05:17:04.729100Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n 'articleType|article_type' apps/web/src/app/([36;1madmin[0m) apps/web/sr …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                    ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 752ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n 'articleType|article_type' apps/web/src/app/([36;1madmin[0m) apps/web/sr …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                    ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0006_legal_document.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0018_review_queue_unique_redefine.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/core-content/migrations/C0015_review_queue_entry.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'articleType|article_type' apps/web/src packages/core-content -g '*.ts' -g '*.sql'" in C:\Users\assag\solution\website-exposure
 succeeded in 707ms:
-- @glitzy/core-content — C0006 LegalDocument (DATA_MODEL C-16·LOCATION_LEGAL_PLAN v1.0)
-- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum

-- LL-SCHEMA-01: documentType enum (DATA_MODEL C-16 SoT 7종)
CREATE TYPE legal_document_type AS ENUM (
  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
);

CREATE TABLE legal_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  document_type legal_document_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  auto_generated BOOLEAN NOT NULL DEFAULT true,
  template_version TEXT,
  -- LLC-11 patch (LL-ACTION-07): default 시점 = 'Asia/Seoul' 의 오늘. server new Date() 사용 금지.
  -- form/action 이 항상 값을 넣지만 (zod required) DB default 는 직접 SQL 경로 안전망.
  effective_date DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date),
  last_revised_date DATE,
  contact_person TEXT,
  contact_email TEXT,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
  CONSTRAINT legal_document_email_regex CHECK (
    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- LL-SCHEMA-05 + cycle1 LL-22: autoGenerated=true 시 templateVersion 필수
  CONSTRAINT legal_document_template_version_format CHECK (
    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
  ),
  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
    (auto_generated = false) OR (template_version IS NOT NULL)
  ),
  -- LL-SCHEMA-03 + cycle1 LL-03·LL-19: skeleton 단계 status='draft' 만
  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
  -- LL-SCHEMA-04: 발행 자체 차단
  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
  -- LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
);

-- LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제 — LL-DEFER-12)
CREATE UNIQUE INDEX legal_document_instance_5type_unique
  ON legal_document (instance_id, document_type)
  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');

CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);

ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON legal_document
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;

 succeeded in 745ms:
-- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.2 (CAP-10 acceptance blocker)
-- 기존 C0015 unique: (instance_id, content_type, content_ref) partial WHERE status IN open/in-progress
-- 변경: (instance_id, content_type, content_ref, queue_type) - content-gate + manual-review 동시 open 가능

DROP INDEX IF EXISTS review_queue_entry_open_unique;
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
  WHERE status IN ('open', 'in-progress');

 succeeded in 657ms:
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

 succeeded in 682ms:
packages/core-content\src\schema.ts:327://   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
packages/core-content\src\schema.ts:341:    articleTypeDefault: text("article_type_default"),
packages/core-content\src\schema.ts:559:    articleType: text("article_type"),
packages/core-content\migrations\C0009_article_category.sql:3:-- parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
packages/core-content\migrations\C0009_article_category.sql:17:  article_type_default TEXT,                     -- v0.1 nullable
packages/core-content\migrations\C0014_compliance_record.sql:22:  article_type TEXT,
apps/web/src\lib\compliance\check.ts:143:  const articleType = input.metadata.articleType;
apps/web/src\lib\compliance\check.ts:145:  if (articleType === "review-case") requiredApproverRoles = ["medical", "legal"];
apps/web/src\lib\compliance\check.ts:146:  else if (articleType === "event-price") requiredApproverRoles = ["legal"];
apps/web/src\lib\compliance\check.ts:224:  // 3. articleType 검증
apps/web/src\lib\compliance\check.ts:225:  if (input.contentType === "Article" && !input.metadata.articleType) {
apps/web/src\lib\compliance\check.ts:226:    throw new ComplianceConfigError("Article 은 articleType required");
apps/web/src\lib\compliance\check.ts:240:      articleType: input.metadata.articleType,
apps/web/src\lib\compliance\check.ts:251:    articleType: input.metadata.articleType,
apps/web/src\lib\compliance\check.ts:271:    articleType: input.metadata.articleType,
apps/web/src\lib\compliance\entity-actions.ts:58:        // CAP-CODE-02·03 정정 - entity별 body + Article articleType + FAQ qaBlocks 조회.
apps/web/src\lib\compliance\entity-actions.ts:68:        const articleTypeSelect = contentType === "Article" ? "article_type::text" : "NULL::text";
apps/web/src\lib\compliance\entity-actions.ts:71:        const rows = await tx.unsafe<{ status: string; risk_level: string | null; body: string | null; article_type: string | null; faq_question: string | null }[]>(`
apps/web/src\lib\compliance\entity-actions.ts:75:                 ${articleTypeSelect} AS article_type,
apps/web/src\lib\compliance\entity-actions.ts:97:            articleType: row.article_type ?? undefined,
apps/web/src\lib\compliance\server-actions.ts:39:  // CAP-CODE-02 정정 - entity별 본문 + FAQ Q/A + Article articleType 전달.
apps/web/src\lib\compliance\server-actions.ts:44:    articleType?: string;   // CAP-CODE-03 - Article 만 사용
apps/web/src\lib\compliance\server-actions.ts:76:      // CAP-CODE-03 정정 - Article 안 articleType 전달
apps/web/src\lib\compliance\server-actions.ts:77:      articleType: args.contentRow.articleType,
apps/web/src\lib\compliance\types.ts:24:    articleType?: string;
apps/web/src\lib\compliance\types.ts:78:  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:28:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:39:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:50:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:56:  it("시나리오 6 - event-fact-statement allowlist pre-check (Article articleType=event-price → skip)", () => {
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:61:      { contentType: "Article", pageTypeId: "P-010", articleType: "event-price" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:67:  it("시나리오 7 - event-fact-statement-001 매칭 (Article articleType=general-medical-info → content-gate)", () => {
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:72:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:86:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:97:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:110:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:123:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:134:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:157:      articleType: "general-medical-info",
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:176:      articleType: "general-medical-info",
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:185:      articleType: "review-case",
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:195:      articleType: "notice",
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:203:  it("시나리오 29 - P-010 + effect-result-related → High (articleType MAX)", () => {
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:206:      articleType: "effect-result-related",
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:229:      articleType: "notice",
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:233:    // evaluatedSteps: pageType (Low) + articleType (Low) + inlineRiskFlag (High) = 3
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:234:    // contributingSteps: pageType (Low) + inlineRiskFlag (High) = 2 (articleType Low 는 base 갱신 안 함)
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:276:      metadata: { explicitRiskLevel: "High", articleType: "effect-result-related" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:290:      metadata: { articleType: "general-medical-info", explicitRiskLevel: "Low" },
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:299:  it("CAP-CODE-07 - notice articleType 안 includes-event flag 보존 + RiskLevel 격상 제외", async () => {
apps/web/src\lib\compliance\__tests__\phase-alpha.test.ts:305:      metadata: { articleType: "notice" },
apps/web/src\lib\compliance\__tests__\compliance.test.ts:50:      metadata: { explicitRiskLevel: "Low", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\compliance.test.ts:56:    expect(env.meta.pageRiskLevel).toBe("Medium");   // articleType=general-medical-info → Medium MAX 결합
apps/web/src\lib\compliance\__tests__\compliance.test.ts:64:      metadata: { explicitRiskLevel: "High", articleType: "general-medical-info" },
apps/web/src\lib\compliance\__tests__\compliance.test.ts:98:      metadata: { explicitRiskLevel: "Low", inferredRiskLevel: "High", articleType: "notice" },

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Name' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path package.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path packages/compliance-rules/package.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/package.json' in C:\Users\assag\solution\website-exposure
 succeeded in 690ms:
.agents
.claude
.codex-reviews
.pnpm-store
apps
data
docs
handoff
node_modules
packages
.codex-critic-prompt-code.md
.codex-critic-prompt.md
.gitignore
.npmrc
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
skills-lock.json
tsconfig.base.json

 succeeded in 705ms:
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

 succeeded in 674ms:
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
    "@glitzy/compliance-rules": "workspace:*",
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

 succeeded in 693ms:
{
  "name": "@glitzy/compliance-rules",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  },
  "scripts": {
    "build:catalog": "node scripts/build.mjs",
    "build": "pnpm run build:catalog && tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "@glitzy/shared-errors": "workspace:*",
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "yaml": "^2.6.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "typescript": "^5.7.3"
  }
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/compliance/transitions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'reject|rejected|sibling|content-gate|review_queue_entry' docs/admin/REVIEW_WORKFLOW.md docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md" in C:\Users\assag\solution\website-exposure
 succeeded in 585ms:
// @glitzy/web/lib/compliance/transitions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 (CA-ACTION-06)
// REVIEW_WORKFLOW § 2.3 status 전이 table SoT.

import { ComplianceTransitionError } from "./types";

export type ContentWorkflowState =
  | "draft" | "review-queued" | "in-review" | "approved" | "publishable"
  | "published" | "blocked" | "rejected" | "stale";

const TRANSITIONS: Record<ContentWorkflowState, ContentWorkflowState[]> = {
  "draft": ["review-queued"],
  "review-queued": ["in-review", "draft"],
  "in-review": ["approved", "rejected", "in-review"],  // 후자는 다음 검수자
  "approved": ["publishable"],
  "publishable": ["published"],
  "rejected": ["draft", "review-queued"],
  "blocked": ["draft"],
  "published": ["stale", "blocked"],
  "stale": ["review-queued"],
};

export function assertTransitionAllowed(from: ContentWorkflowState, to: ContentWorkflowState): void {
  const allowed = TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new ComplianceTransitionError(
      `Invalid status transition: ${from} → ${to}. Allowed: ${allowed.join(", ") || "(none)"}`,
    );
  }
}

export function listAllowedTransitions(from: ContentWorkflowState): ContentWorkflowState[] {
  return [...(TRANSITIONS[from] ?? [])];
}

 succeeded in 591ms:
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:7:> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:23:- `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 3.3 priority·SLA 표 (CAP-33 정정) · § 6.2 stale 처리는 Phase Beta · § 9.1.1 알림 정책
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:26:- `packages/core-content/migrations/C0015_review_queue_entry.sql` (실 UNIQUE constraint 확인 — CAP-10 정정)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:42:- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:44:- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:52:| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:58:| High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:63:| content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07 정정) | `review_queue_entry.queue_type` enum `'content-gate'` ADD VALUE. **enqueue 조건** = `gateRequired === true && automatedDecision !== 'block'` (CAP-06). **트리거 위치** = `submitForReview` action 만 (CAP-07). 동일 contentRef content-gate + manual-review 큐 동시 진입 가능. 발행 게이트 = 양 큐 모두 resolved 필요 (AND) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:65:| Drizzle schema v0.6 (CA-SCHEMA-01 · CAP-10 정정) | `reviewQueueType` enum 안 `'content-gate'` ADD VALUE + **partial UNIQUE 재정의** — 실 C0015 constraint `review_queue_entry_open_unique (instance_id, content_type, content_ref)` → `(instance_id, content_type, content_ref, queue_type)` partial UNIQUE (record version별 중복 허용 안 함 — 단일 active record_version 기준) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:66:| C0017 migration (CA-MIGRATION-01) | `ALTER TYPE review_queue_type ADD VALUE 'content-gate'` (single statement · COMMIT 분리) + partial UNIQUE DROP + CREATE (manifest 안 별 step 분리 — Postgres ALTER TYPE 트랜잭션 제약) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:67:| compliance lib 분리 (CA-LIB-01) | `apps/web/src/lib/compliance/` 안 `check.ts` 완전 재작성 + `auto-gate.ts` (content-gate 자동 큐 enqueue). 매칭 엔진·composite·inline-flags·risk-inference·slot-match·loader 는 `packages/compliance-rules/` 패키지 안 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:69:| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:99:| **evidence absence** — `non-covered-discount-misleading-001` (§ 3.13) 안 기간/대상 명시 부재 검사 (v0.1 안 모든 % 할인 content-gate 보수 정책) | Phase Beta | CA-DEFER-33 (cycle 2 CAP2-04 신설) |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:107:4. **content-gate 큐 자동 진입 시 — operator 가 명시 submit 한 manual-review 큐 와 분리 운영**. 두 큐 동시 존재 시 — operator 가 둘 다 resolve 해야 발행 가능 (AND 게이트 정합).
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:231:| `numeric-period-standalone-001` | "수치·기간 단정 (보장어 없음)" | content-gate (`["medical", "legal"]`) | composite (`\d+\s*(일\|주\|개월)` + `(만에\|기간)` AND_NEAR window=15) | global | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:235:| `event-fact-statement-001` | "할인·이벤트 사실 안내" | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)`) | global (CAP2-02 정정 — scope NOT 표현 불가이므로 matcher 안 **allowlist pre-check**: pageTypeId ∈ {P-102, P-104} 또는 articleType='event-price' 시 룰 매칭 skip · § 4.3·§ 4.4 안 명세) | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:238:| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:242:| `body-type-claim-001` | "체질·맞춤 과대 표현" | content-gate (`["medical"]`) | regex (`(당신만의\s*1\s*:\s*1\s*맞춤\|당신의\s*체질에\s*완벽)`) | global | 동일 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:284:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:323:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:338:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:350:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:362:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:377:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:401:    # CAP2-03 정정 - v0.1 안 단순 regex (모든 "foreign patient" 어휘 content-gate). composite pageMeta.inLanguage/국내매체 검사는 Phase Beta CA-DEFER-31
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:404:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:428:    # CAP2-04 정정 - 모든 % 할인 보수적 content-gate. 기간/대상 명시된 정상 케이스도 법무 검수 통과 시 publishable
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:432:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:436:    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:447:    severity: "content-gate"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:762:`fail > content-gate > warning > info` — 집계만 우선순위. Finding[] 모두 보존.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:771:  severity: "info" | "warning" | "fail" | "content-gate";
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1020:- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1195:    severity: 'content-gate',
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1228:## 12. content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07·33 정정)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1234:// CAP2-06 정정 - event id 'content-gate-queued' (REVIEW_WORKFLOW § 9.1.1 정합) + source: "auto"
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1247:    SELECT id FROM review_queue_entry
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1251:      AND queue_type = 'content-gate'
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1258:    INSERT INTO review_queue_entry (id, instance_id, content_type, content_ref, compliance_record_id, queue_type, status,
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1261:      'content-gate', 'open', 'P0', ${envelope.result.requiredApproverRoles ?? []},
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1264:  // CAP2-06 - REVIEW_WORKFLOW § 9.1.1 event id 'content-gate-queued' 정합 + source: "auto" payload
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1265:  await emitAuditEvent('content-gate-queued', {
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1282:- 동일 contentRef 안 manual-review 큐 + content-gate 큐 양쪽 open 가능
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1288:- **content-gate 큐 priority = P0** (REVIEW_WORKFLOW § 3.3)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1291:- 알림 = `content-gate-queued` (REVIEW_WORKFLOW § 9.1.1)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1340:  "findingsBySeverity": { "fail": 0, "content-gate": 1, "warning": 0, "info": 0 },
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1406:## 15. content-gate 큐 enum 확장 (CA-SCHEMA-01 · CAP-10 잔존 정정 — acceptance blocker 명시)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1408:> **CAP-10 잔존 acceptance blocker** (cycle 2): 실 C0015 unique = `(instance_id, content_type, content_ref)` partial. 본 cycle 안 content-gate + manual-review 동시 open 가능하려면 **C0018 unique 재정의 = acceptance blocker** — code cycle 안 manifest 단계 안 반드시 적용. C0017 (enum ADD VALUE) 단독 + C0018 (UNIQUE 재정의) 분리 — 합 manifest 21단계 고정.
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1417:ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1428:DROP INDEX IF EXISTS review_queue_entry_open_unique;
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1429:CREATE UNIQUE INDEX review_queue_entry_open_unique
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1430:  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1439:- `reviewQueueType` enum 안 `'content-gate'` 추가
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1457:| 4 | "절대 효과" → 단독 어휘 + 결합 어휘 동시 매칭 → 우선순위 fail (guarantee-composite-001) + content-gate (standalone) 둘 다 보존 | findings.length=2 · automatedDecision='block' |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1460:| 7 | "20% 할인 진행" + Article articleType=general-medical-info → event-fact-statement-001 매칭 | severity='content-gate' · roles=['legal'] |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1463:| 10 | "전후사진" + ReviewPolicy.beforeAfterPhotoAllowed=false → before-after-photo-001 (content-gate) | severity='content-gate' |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1465:| 12 | 다국어 페이지 메타 + "foreign patient" → foreign-patient-recruit-domestic-uncertain-001 (content-gate · legal) | roles=['legal'] |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1467:| 14 | "당신의 체질에 완벽" → body-type-claim-001 (content-gate · medical) | roles=['medical'] |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1504:| 35 | High 가상 finding 주입 (automatedDecision='gate') + gateRequired=true → content-gate 큐 1행 INSERT | queue_type='content-gate' · priority='P0' |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1547:| 17 | **types.ts cascade 풀명세** (CAP-19 잔존 정정): (a) `ComplianceCheckEnvelope` 안 `extensions: ExtensionsRecord` 신규 영역 추가 — types.ts:59 line 안 type 정정. (b) check.ts:108 안 반환 객체 안 `extensions` 키 채움 (M0 stub 안 미반환). (c) server-actions.ts:87 line 안 `JSON.stringify(envelope.result)` → `JSON.stringify({ ...envelope.result, extensions: envelope.extensions })` 합성 patch (auto_check_result JSONB 안 단일 저장). (d) C0016 sentinel backfill 안 `auto_check_result` JSON 안 `extensions` 키 부재일 뿐 — 어드민 UI 안 기본값 처리 (extensions=undefined 시 빈 객체 fallback). (e) approveContent · publishContent · rejectContent 안 envelope persist 안 자리 동일 (이미 reuse 패턴). ComplianceCheckInput.metadata 안 신규 7 필드 (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields) 동반. | types.ts + check.ts + server-actions.ts |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1548:| **17.b** (CAP4-02 신설 · CAP5-01 정정 · CAP6-01 정정) | **4 server action wrapper 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현 · M0_PLAN § 6.1 action 책임 분리 정합). **실 wrapper 위치** (CAP6-01 정정 — repo 안 실 export 정합): (a) **`submitForReviewAction`** (`apps/web/src/lib/compliance/entity-actions.ts:42`) — `submitForReview()` transitions helper 호출 + envelope persist + `enqueueContentGateIfNeeded` (auto-gate) 흐름 wrap. (b) **`publishContentAction`** (`apps/web/src/lib/compliance/entity-actions.ts:128`) — `publishContent()` transitions helper 호출 + `evaluatePublishable` + publish transition 흐름 wrap. (c) **`approveEntryAction`** (`apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:33`) — `approveContent()` transitions helper 호출 + `assertReviewerEligibility` + `calculateFinalRoles` + AND 게이트 평가 흐름 wrap. (d) **`rejectEntryAction`** (`apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:119`) — `rejectContent()` transitions helper 호출 + `assertTransitionAllowed` + transition validation 흐름 wrap. **공통 try/catch 패턴**: `catch (e: unknown) { const mapped = mapComplianceErrorToResult(e); if (mapped) return mapped; throw e; }` — `mapComplianceErrorToResult` 안 3 error type (ComplianceConfigError · ComplianceTransitionError · ReviewerEligibilityError) 매핑. 매핑 안 되면 throw bubble → Next.js error.tsx (500). **`mapComplianceErrorToResult` helper 위치** (CAP6-01 정정 — plan 시점 결정 · 실 파일 추가는 code cycle 안): `apps/web/src/lib/compliance/action-errors.ts` (신규 helper 파일 · code cycle 안 추가). **shape**: `(e: unknown) => SaveResult \| null` — repo 안 실 type `SaveResult` (`@/lib/save-result`) 사용 (CAP6-01 정정 — ActionResult 표현 폐기). M0_PLAN § 6.2 audit emit 패턴 (tx commit 후 base role) 정합. | entity-actions.ts + review-queue/actions.ts 안 4 wrapper patch + action-errors.ts 신규 |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1550:| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1560:- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1577:| MA-Q06 | content-gate 큐 manual-review 와 분리 vs 통합 | **분리 채택** (CAP-07) — 동시 진입 가능, 발행 게이트 AND |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1591:| 2026-05-19 | v0.7 | **Codex 자동 비평 cycle 6 1 finding (blocking 0·major 1·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3 → 2 → 1 → 1. 누계 cycle 1~6 = 54 finding 전건 수용. 주요 patch: **CAP6-01** § 17.b 4 wrapper 명 정확화 — 실 repo 구조 정합: (a) `submitForReviewAction` `entity-actions.ts:42`, (b) `publishContentAction` `entity-actions.ts:128`, (c) `approveEntryAction` `review-queue/actions.ts:33`, (d) `rejectEntryAction` `review-queue/actions.ts:119`. `SaveResult` type 사용 (`@/lib/save-result`) — ActionResult 표현 폐기. action-errors.ts plan 시점 결정 · 실 파일 추가는 code cycle. mapComplianceErrorToResult shape `(e: unknown) => SaveResult \| null`. |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1592:| 2026-05-19 | v0.6 | **Codex 자동 비평 cycle 5 1 finding (blocking 0·major 1·minor 0·nit 0) 전건 수용**. **모든 acceptance precondition PASS** (27 SoT 슬롯 · 5 inlineRiskFlags · RiskInference evaluatedSteps/contributingSteps · contextExceptions · High triggeredBy · CA-DEFER 12 신설 · CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1. 누계 cycle 1+2+3+4+5 = 53 finding 전건 수용. 주요 patch: **CAP5-01** § 17.b 안 4 action 책임 분리 명시 — M0_PLAN § 6.1 action 책임 정합 (submitForReviewAction = check + persist + auto-gate · approveContentAction = eligibility + calculateFinalRoles + evaluatePublishable · rejectContentAction = transition validation · publishContentAction = evaluatePublishable + publish transition). `mapComplianceErrorToResult` helper 위치 = `apps/web/src/lib/compliance/action-errors.ts` 신규 파일. ComplianceConfigError + ComplianceTransitionError + ReviewerEligibilityError 3 error type form-level 변환. |
docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md:1595:| 2026-05-19 | v0.3 | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:40:| C-XX `ReviewQueueEntry` skeleton DB table (CA-CASCADE-02) | REVIEW_WORKFLOW § 3 SoT. **queue_type enum M0 v0.1 = `manual-review` 1종 만** (CAM-02 정정 — content-gate 는 ruleCatalog 합류 시 결정. plan 본 cycle 의 큐는 운영자 명시 submitForReview 트리거의 수동 검수 큐). warning/stale 등은 enum ADD VALUE cascade (CA-DEFER-05·06). status enum 3종 (open/in-progress/resolved · cancelled 제거 CAM-13) · priority (P0/P1/P2) · required_roles **text[] enum array** (CAM-15 정정 — JSONB → enum array) · sla_due_at · **compliance_record_id NOT NULL** (manual-review queue · CAM-14 정정 — 고아 큐 차단) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:43:| 어드민 /review-queue 화면 | list (manual-review 큐) + detail page (entry approve/reject) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:44:| 4 server action | submitForReview · approveContent · rejectContent · publishContent |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:47:| 4 form status select 9-state (CAM-18 정정) | 풀 enum DB CHECK 해제는 유지. 그러나 **status select 자체는 form 안에서 read-only display 만** (사용자 직접 선택 불가). status 전이는 workflow action 버튼 (submitForReview · approveContent · rejectContent · publishContent) 통해서만. 기존 save action 은 status field 무시 (서버 측에서 현재 row status 보존) |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:51:| audit_event 통합 (CA-CASCADE-06) | content-submitted-for-review · content-approved · content-rejected · content-published 4종. payload shape · emit 시점 (tx commit 후 base role) · 실패 정책 = ADMIN_UI_SKELETON_PLAN audit matrix 정합 cascade |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:72:| content-gate 자동 큐 진입 (ComplianceCheckResult.gateRequired=true 시) — M0 manual-review 큐 vs content-gate 큐 분리 운영 | CA-DEFER-01 동반 (룰 합류 시 content-gate 큐 활성화) | CA-DEFER-15 |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:159:### 2.2 C0015 `review_queue_entry` 신규 table (CA-SCHEMA-04) — CAM-02·13·14·15 정정
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:162:-- packages/core-content/migrations/C0015_review_queue_entry.sql
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:165:-- CAM-02 정정: manual-review queue type 신설 (수동 검수 큐). content-gate (ruleCatalog gateRequired) · warning · stale 은 ADD VALUE cascade.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:173:CREATE TABLE review_queue_entry (
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:194:  CONSTRAINT review_queue_entry_required_roles_nonempty CHECK (array_length(required_roles, 1) >= 1),
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:195:  CONSTRAINT review_queue_entry_resolved_requires_at CHECK (
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:198:  CONSTRAINT review_queue_entry_resolved_requires_type CHECK (
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:201:  CONSTRAINT review_queue_entry_compliance_fk FOREIGN KEY (instance_id, compliance_record_id)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:203:  CONSTRAINT review_queue_entry_instance_id_unique UNIQUE (instance_id, id)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:206:CREATE INDEX review_queue_entry_instance_idx ON review_queue_entry (instance_id);
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:207:CREATE INDEX review_queue_entry_status_idx ON review_queue_entry (instance_id, status);
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:208:CREATE INDEX review_queue_entry_open_priority_idx ON review_queue_entry (instance_id, priority, sla_due_at)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:210:CREATE INDEX review_queue_entry_content_idx ON review_queue_entry (instance_id, content_type, content_ref);
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:211:CREATE UNIQUE INDEX review_queue_entry_open_unique
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:212:  ON review_queue_entry (instance_id, content_type, content_ref)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:215:ALTER TABLE review_queue_entry ENABLE ROW LEVEL SECURITY;
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:216:ALTER TABLE review_queue_entry FORCE ROW LEVEL SECURITY;
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:217:CREATE POLICY tenant_isolation ON review_queue_entry FOR ALL TO app_tenant_user
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:220:GRANT SELECT, INSERT, UPDATE, DELETE ON review_queue_entry TO app_tenant_user;
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:224:- (CAM-02) `manual-review` queue type — 운영자 명시 submitForReview 트리거. content-gate 큐는 CA-DEFER-15 (ruleCatalog 합류 시 ADD VALUE).
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:273:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:290:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:308:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:324:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:524:CONTENT_STANDARDS § 7.2 `ComplianceCheckResult` 7 필드 SoT (`automatedDecision` · `buildBlocked` · `gateRequired` · `hasWarnings` · `findingsBySeverity` 4키 fail/content-gate/warning/**info** · `requiredApproverRoles?` · `findings`) 외 어떤 필드도 result 안에 두지 않는다. M0 stub 추가 메타 (pageRiskLevel · catalogVersion · catalogHash · manualReview · exemptReason) 는 envelope 안 별도 필드:
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:553:      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:602:      severity: "content-gate",
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:620:        "content-gate": gateRequired ? 1 : 0,
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:652:- M0 stub 의 High 가상 finding 시 gateRequired=true — `submitForReview` 흐름은 동일 (manual-review 큐 진입). content-gate 자동 트리거는 CA-DEFER-15.
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:665:- 본인 역할에 한해 approve/reject 폼 노출 (assertReviewerEligibility flag 확인)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:679:- "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:704:export async function rejectContent(
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:723:| `content-rejected` | rejectContent action 성공 | `{contentType, contentRef, recordId, role, reason}` |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:745:  "in-review": ["approved", "rejected", "in-review"],
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:748:  "rejected": ["draft", "review-queued"],
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:766:| 6 | rejectContent(reason, role) → entity.status='rejected' · entry.status='resolved' · entry.resolution_type='rejected' | reason ≥ 50자 | vitest |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:770:| 10 | 같은 contentRef 의 두 번째 open entry 생성 시도 → partial UNIQUE 위반 | review_queue_entry_open_unique CHECK | e2e |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:783:| 2 | C0015 review_queue_entry migration | C0015_review_queue_entry.sql |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:789:| 8 | 4 server action — submitForReview · approveContent · rejectContent · publishContent | apps/web/src/lib/compliance/server-actions.ts |
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:808:- `CA-DEFER-15` (CAM-02 신설): content-gate 자동 큐 진입 (ruleCatalog 합류 시)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:835:- `CA-DEFER-33` (Phase Beta · COMPLIANCE_ASSISTANT_PHASE_ALPHA cycle 2 신설): evidence absence — `non-covered-discount-misleading-001` (MEDICAL_AD § 3.13) 안 기간/대상 명시 부재 검사. v0.1 안 모든 % 할인 content-gate 보수 정책
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:843:- `CA-CASCADE-02`: `docs/admin/REVIEW_WORKFLOW.md` § 2/§ 3/§ 4 M0 활성화 marker — manual-review 큐 1종 + operator·medical·legal 3종 활성 (client CA-DEFER-10 · content-gate/warning/stale CA-DEFER-15·05·06)
docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:859:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
docs/admin/REVIEW_WORKFLOW.md:20:- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
docs/admin/REVIEW_WORKFLOW.md:21:- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
docs/admin/REVIEW_WORKFLOW.md:23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
docs/admin/REVIEW_WORKFLOW.md:71:  | "rejected"        // 검수자가 명시적 거부
docs/admin/REVIEW_WORKFLOW.md:92:              │     reject     │      │ approve (해당 역할)
docs/admin/REVIEW_WORKFLOW.md:122:              │       │   rejected   │
docs/admin/REVIEW_WORKFLOW.md:137:| `in-review → rejected` | 검수자 명시 거부 | 검수자 |
docs/admin/REVIEW_WORKFLOW.md:146:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:147:| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:156:> **Phase Alpha v1.0 cascade (CA-CASCADE-05)**: content-gate 큐 v0.6 안 `review_queue_type` enum 안 `'content-gate'` ADD VALUE 활성화. C0017 + C0018 (UNIQUE 재정의 — `(instance_id, content_type, content_ref, queue_type)`) migration. submitForReview action 안 자동 큐 진입 (CA-DEFER-15 부분 해소 · `automatedDecision !== 'block'` 시). warning 큐 + stale 큐 는 Phase Beta (CA-DEFER-05 · CA-DEFER-06).
docs/admin/REVIEW_WORKFLOW.md:160:| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
docs/admin/REVIEW_WORKFLOW.md:161:| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
docs/admin/REVIEW_WORKFLOW.md:170:#### 3.1.2 content-gate와 warning 동시 발생 처리
docs/admin/REVIEW_WORKFLOW.md:172:ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
docs/admin/REVIEW_WORKFLOW.md:173:- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
docs/admin/REVIEW_WORKFLOW.md:175:- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)
docs/admin/REVIEW_WORKFLOW.md:197:| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
docs/admin/REVIEW_WORKFLOW.md:249:| **reject** | `rejected` 상태로 전이. 거부 사유 메모 필수 (50자 이상) |
docs/admin/REVIEW_WORKFLOW.md:280:- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
docs/admin/REVIEW_WORKFLOW.md:470:  | "content-gate-queued"           // content-gate 큐 진입
docs/admin/REVIEW_WORKFLOW.md:476:  | "reviewer-rejected"             // 검수자 reject
docs/admin/REVIEW_WORKFLOW.md:525:| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
docs/admin/REVIEW_WORKFLOW.md:531:| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:589:  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
docs/admin/REVIEW_WORKFLOW.md:635:- 모든 검수자 액션 (approve·reject·request-changes·delegate)
docs/admin/REVIEW_WORKFLOW.md:654:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
docs/admin/REVIEW_WORKFLOW.md:662:  | "approve" | "reject" | "request-changes" | "delegate"
docs/admin/REVIEW_WORKFLOW.md:682:  | "asset-ingestion-asset-rejected"          // 검수 거부
docs/admin/REVIEW_WORKFLOW.md:691:  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
docs/admin/REVIEW_WORKFLOW.md:778:| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |
docs/admin/REVIEW_WORKFLOW.md:809:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
docs/admin/REVIEW_WORKFLOW.md:811:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin/REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
docs/admin/REVIEW_WORKFLOW.md:813:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
docs/admin/REVIEW_WORKFLOW.md:814:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: major=5 minor=1 nit=0 (총 6)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 20 → cycle 2 = 6

## major
- **CAP-CODE2-01** `entity-actions.ts`의 entity별 SELECT 컬럼이 실제 스키마와 불일치합니다. `apps/web/src/lib/compliance/entity-actions.ts:60~70`은 Article에서 `article_type`, LegalDocument에서 `body_markdown`, Publication에서 `abstract`를 조회하지만 실제 스키마는 Article에 `article_type` 없음, LegalDocument는 `body`, Publication은 `summary`입니다. 결과적으로 Article/LegalDocument/Publication `submitForReviewAction`은 helper/exempt 분기 도달 전 SQL 에러로 실패합니다.
- **CAP-CODE2-02** `approveContent`의 idempotent 분기가 content-gate sibling을 영구 open으로 남길 수 있습니다. `apps/web/src/lib/compliance/server-actions.ts:228~230`에서 record 단위 role slot이 이미 채워져 있으면 선택한 `entryId`를 resolve하지 않고 반환합니다. manual-review와 content-gate가 같은 role을 요구하는 정상 케이스에서 두 번째 큐 approve가 open/in-progress로 남아 AND 게이트가 닫히지 않습니다.
- **CAP-CODE2-03** `rejectContent`가 동일 record의 sibling queue를 정리하지 않습니다. `apps/web/src/lib/compliance/server-actions.ts:387~399`는 선택된 `rejEntry.id`만 resolved 처리하고 entity를 `rejected`로 전이합니다. manual-review reject 시 content-gate가 계속 open으로 남아 큐가 stale해지고, 이후 재제출 흐름도 오염됩니다.
- **CAP-CODE2-04** `enqueueContentGateIfNeeded`의 기존 content-gate 조회가 `compliance_record_id`를 보지 않습니다. `apps/web/src/lib/compliance/auto-gate.ts:40~47`은 `(instance_id, content_type, content_ref, queue_type)`만으로 old open entry를 반환합니다. `rejected → review-queued` 재제출 시 이전 record의 content-gate를 새 record의 `contentGateEntryId`처럼 반환하고 새 record에는 gate entry를 만들지 않을 수 있습니다.
- **CAP-CODE2-05** schema validator compile 실패가 fail-closed가 아닙니다. `packages/compliance-rules/src/loader.ts:107~121`은 sub-schema compile 실패를 `console.warn` 후 validator 누락 상태로 두고, `validateAgainstSchema`는 validator가 없으면 그냥 반환합니다. CAP-CODE-01의 “schema validation 활성화” 목적상 schema 자체 결함 시 카탈로그 로드를 중단해야 합니다.

## minor
- **CAP-CODE2-06** cycle 1에서 핵심으로 패치된 `entryId` 기반 approve/reject, AND gate, auto-gate record binding을 검증하는 server-action/DB 시나리오가 없습니다. 현재 `phase-alpha.test.ts`는 check/matcher 중심이라 `apps/web/src/lib/compliance/server-actions.ts:228~308`, `387~399`, `454~464` 회귀를 잡지 못합니다.

## nit

=== CYCLE SIGNAL ===
cycle: 2
total_findings: 6
major: 5
minor: 1
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
110,167
# COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: major=5 minor=1 nit=0 (총 6)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 20 → cycle 2 = 6

## major
- **CAP-CODE2-01** `entity-actions.ts`의 entity별 SELECT 컬럼이 실제 스키마와 불일치합니다. `apps/web/src/lib/compliance/entity-actions.ts:60~70`은 Article에서 `article_type`, LegalDocument에서 `body_markdown`, Publication에서 `abstract`를 조회하지만 실제 스키마는 Article에 `article_type` 없음, LegalDocument는 `body`, Publication은 `summary`입니다. 결과적으로 Article/LegalDocument/Publication `submitForReviewAction`은 helper/exempt 분기 도달 전 SQL 에러로 실패합니다.
- **CAP-CODE2-02** `approveContent`의 idempotent 분기가 content-gate sibling을 영구 open으로 남길 수 있습니다. `apps/web/src/lib/compliance/server-actions.ts:228~230`에서 record 단위 role slot이 이미 채워져 있으면 선택한 `entryId`를 resolve하지 않고 반환합니다. manual-review와 content-gate가 같은 role을 요구하는 정상 케이스에서 두 번째 큐 approve가 open/in-progress로 남아 AND 게이트가 닫히지 않습니다.
- **CAP-CODE2-03** `rejectContent`가 동일 record의 sibling queue를 정리하지 않습니다. `apps/web/src/lib/compliance/server-actions.ts:387~399`는 선택된 `rejEntry.id`만 resolved 처리하고 entity를 `rejected`로 전이합니다. manual-review reject 시 content-gate가 계속 open으로 남아 큐가 stale해지고, 이후 재제출 흐름도 오염됩니다.
- **CAP-CODE2-04** `enqueueContentGateIfNeeded`의 기존 content-gate 조회가 `compliance_record_id`를 보지 않습니다. `apps/web/src/lib/compliance/auto-gate.ts:40~47`은 `(instance_id, content_type, content_ref, queue_type)`만으로 old open entry를 반환합니다. `rejected → review-queued` 재제출 시 이전 record의 content-gate를 새 record의 `contentGateEntryId`처럼 반환하고 새 record에는 gate entry를 만들지 않을 수 있습니다.
- **CAP-CODE2-05** schema validator compile 실패가 fail-closed가 아닙니다. `packages/compliance-rules/src/loader.ts:107~121`은 sub-schema compile 실패를 `console.warn` 후 validator 누락 상태로 두고, `validateAgainstSchema`는 validator가 없으면 그냥 반환합니다. CAP-CODE-01의 “schema validation 활성화” 목적상 schema 자체 결함 시 카탈로그 로드를 중단해야 합니다.

## minor
- **CAP-CODE2-06** cycle 1에서 핵심으로 패치된 `entryId` 기반 approve/reject, AND gate, auto-gate record binding을 검증하는 server-action/DB 시나리오가 없습니다. 현재 `phase-alpha.test.ts`는 check/matcher 중심이라 `apps/web/src/lib/compliance/server-actions.ts:228~308`, `387~399`, `454~464` 회귀를 잡지 못합니다.

## nit

=== CYCLE SIGNAL ===
cycle: 2
total_findings: 6
major: 5
minor: 1
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
