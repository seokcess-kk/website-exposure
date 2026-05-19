OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e3eb0-c383-7b83-8031-ddc45749583a
--------
user
# Codex 자동 비평 요청 — compliance-assistant Phase Alpha code cycle 3

cycle 1 (20) + cycle 2 (6) = 누계 26 finding 전건 수용 patch 완료. typecheck PASS · vitest 104/104 PASS. 수렴 추세 20 → 6.

## cycle 2 patch 요약

- **CAP-CODE2-01**: entity-actions.ts 안 실 schema 정합 — Article = `summary + body_markdown` 결합 · LegalDocument/Publication/MediaAppearance = exempt 분기 (NULL body) · TreatmentPage = `body_markdown` · FAQ = `question + answer`. Article articleType v0.1 default `"general-medical-info"` (CA-DEFER-35 운영자 명시 Phase Beta)
- **CAP-CODE2-02**: approveContent 안 role slot 이미 채워져 있어도 본 entry resolve + AND 게이트 재평가
- **CAP-CODE2-03**: rejectContent 안 sibling open queue 동반 resolve
- **CAP-CODE2-04**: auto-gate.ts existing 조회 안 `compliance_record_id` 절 추가
- **CAP-CODE2-05**: schema compile/validator 누락 시 fail closed (throw)
- **CAP-CODE2-06**: phase-alpha.test.ts 안 server-action helper unit 회귀 3 scenarios 추가

## 본 cycle 검증 우선순위

cycle 2 patch 정합성 + 잔여 / 신규 결함. normal: cycle 3 = 1~5 finding · 0 도달 시 acceptance.

### cycle 2 patch 재검증
1. **CAP-CODE2-01**: entity-actions.ts:65~74 안 isExempt 분기 + bodySelect · faqQuestionSelect · article default articleType 정합
2. **CAP-CODE2-02**: server-actions.ts:228~261 안 isRoleSatisfied early exit 안 sibling resolve + openSiblings2 카운트 + entity 전이
3. **CAP-CODE2-03**: server-actions.ts:417~432 안 `compliance_record_id = ${args.recordId}` 안 sibling open/in-progress 모두 resolve (WHERE id = entry.id 가 아닌 record_id 단위)
4. **CAP-CODE2-04**: auto-gate.ts:42~51 안 `AND compliance_record_id = ${recordId}::uuid` 절 추가
5. **CAP-CODE2-05**: loader.ts:107~131 안 schema compile/validator 누락 모두 throw
6. **CAP-CODE2-06**: phase-alpha.test.ts:280~320 안 server-action helper unit 회귀 scenarios

### 새로운 검증 영역

- **Article articleType v0.1 default**: 운영자가 명시 설정 안 하는 한 항상 "general-medical-info" (Medium 자동 추론). v0.1 안 모든 Article 안 동일 → 위험도 자동 추론 완전 활용 불가 - CA-DEFER-35 marker Phase Beta
- **rejectContent sibling resolve metadata**: metadata payload 안 rejectReason · rejectedBy · rejectedRole 모두 동일 적용 (현재 ✓)
- **approveContent AND 게이트 정합**: open record 단위 카운트 vs entry 단위 - sibling queue 모두 resolved 시 entity 전이 정합
- **publishContent open 큐 부재 assert**: cycle 1 CAP-CODE-15 정합
- **exempt envelope vs check() 분기**: LegalDocument · Publication · MediaAppearance 모두 buildXxxExemptEnvelope 호출 분기 정합 (server-actions.ts:79~88)

### Codex 비평 운영 원칙
- cycle 3 안 누계 지적 수 추가 감소 권장
- 0 finding 도달 시 acceptance 권장 + recommendation 명시
- 잔존 시 cycle 4 진입 권장
- 새로운 결함 ID prefix = **CAP-CODE3** (cycle 3 신규)

## SoT (cycle 1·2 동일)

본 monorepo working root 에서 직접 파일을 읽어 코드와 대조. 특히:
- `apps/web/src/lib/compliance/entity-actions.ts` (cycle 2 schema 정합 patch)
- `apps/web/src/lib/compliance/server-actions.ts` (cycle 2 approve/reject sibling patch)
- `apps/web/src/lib/compliance/auto-gate.ts` (cycle 2 compliance_record_id 절)
- `packages/compliance-rules/src/loader.ts` (cycle 2 fail closed)
- `apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts` (cycle 2 3 추가 scenarios)
- 실 schema 확인: `packages/core-content/migrations/C0005_article.sql` (Article 안 article_type 컬럼 없음 · summary + body_markdown) · `C0006_legal_document.sql` (body) · `C0010_publication.sql`/`C0011_media_appearance.sql` (summary)

## Output format

```
# COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: major=N minor=N nit=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle 1 = 20 → cycle 2 = 6 → cycle 3 = N

## major
## minor
## nit

=== CYCLE SIGNAL ===
cycle: 3
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "isExempt|bodySelect|faqQuestionSelect|articleType|build.*ExemptEnvelope" apps/web/src/lib/compliance/entity-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "compliance_record_id|existing" apps/web/src/lib/compliance/auto-gate.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "server-action|approveContent|rejectContent|openSiblings|sibling|CAP-CODE2|articleType|validator" apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "isRoleSatisfied|openSiblings2|compliance_record_id|rejectContent|publishContent|build.*ExemptEnvelope" apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "compile|validator|throw|undefined|null" packages/compliance-rules/src/loader.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 736ms:
63:        const isExempt = contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance";
64:        const bodySelect = isExempt ? "NULL::text"
69:        const riskLevelSelect = isExempt || contentType === "FAQ" ? "NULL::text" : "risk_level::text";
70:        const faqQuestionSelect = contentType === "FAQ" ? "question::text" : "NULL::text";
74:                 ${bodySelect} AS body,
75:                 ${faqQuestionSelect} AS faq_question
89:        // CAP-CODE2-01 - Article 안 articleType 실 schema 미존재 → v0.1 default
90:        const articleType = contentType === "Article" ? "general-medical-info" : undefined;
98:            articleType,

 succeeded in 736ms:
2:// 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
16:import { check, buildLegalDocumentExemptEnvelope, buildExternalCitationExemptEnvelope } from "./check";
17:import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
85:    envelope = buildLegalDocumentExemptEnvelope(checkInput);
87:    envelope = buildExternalCitationExemptEnvelope(checkInput);
123:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
179:       AND compliance_record_id = ${args.recordId}::uuid
230:  if (isRoleSatisfied(record, args.role)) {
243:      const openSiblings2 = await tx<{ cnt: string }[]>`
246:           AND compliance_record_id = ${args.recordId}::uuid
249:      if (Number(openSiblings2[0]?.cnt ?? "0") === 0) {
302:  const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
324:         AND compliance_record_id = ${args.recordId}::uuid
348:  return finalRoles.every((r) => isRoleSatisfied(record, r));
363:export async function rejectContent(
374:  // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
382:       AND compliance_record_id = ${args.recordId}::uuid
428:       AND compliance_record_id = ${args.recordId}::uuid
453:export async function publishContent(
494:       AND compliance_record_id = ${args.recordId}::uuid
521:  // (2) entity status → published + published_at + compliance_record_id 채움.
527:           compliance_record_id = '${args.recordId}',

 succeeded in 746ms:
39:  // CAP-CODE2-04 정정 - compliance_record_id 도 함께 매칭. 이전 record 안 stale entry 잘못 반환 회피.
40:  const existing = await tx<{ id: string }[]>`
46:      AND compliance_record_id = ${recordId}::uuid
49:  if (existing.length > 0) return { entryId: existing[0]!.id };
56:      instance_id, queue_type, content_type, content_ref, compliance_record_id,

 succeeded in 753ms:
28:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
39:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
50:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
56:  it("시나리오 6 - event-fact-statement allowlist pre-check (Article articleType=event-price → skip)", () => {
61:      { contentType: "Article", pageTypeId: "P-010", articleType: "event-price" },
67:  it("시나리오 7 - event-fact-statement-001 매칭 (Article articleType=general-medical-info → content-gate)", () => {
72:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
86:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
97:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
110:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
123:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
134:      { contentType: "Article", pageTypeId: "P-010", articleType: "general-medical-info" },
157:      articleType: "general-medical-info",
176:      articleType: "general-medical-info",
185:      articleType: "review-case",
195:      articleType: "notice",
203:  it("시나리오 29 - P-010 + effect-result-related → High (articleType MAX)", () => {
206:      articleType: "effect-result-related",
229:      articleType: "notice",
233:    // evaluatedSteps: pageType (Low) + articleType (Low) + inlineRiskFlag (High) = 3
234:    // contributingSteps: pageType (Low) + inlineRiskFlag (High) = 2 (articleType Low 는 base 갱신 안 함)
276:      metadata: { explicitRiskLevel: "High", articleType: "effect-result-related" },
280:    // auto-gate 안 block 콘텐츠 큐 진입 안 함 (server-actions 통합 흐름 안 검증)
281:    // 본 단위 테스트는 server-actions 까지 실행하지 않음 - enqueueContentGateIfNeeded 직접 호출 단위 테스트는 별도 필요
290:      metadata: { articleType: "general-medical-info", explicitRiskLevel: "Low" },
299:  it("CAP-CODE-07 - notice articleType 안 includes-event flag 보존 + RiskLevel 격상 제외", async () => {
305:      metadata: { articleType: "notice" },
315:describe("Phase Alpha v1.0 — server-action helper 단위 회귀 (CAP-CODE2-06 추가)", () => {
316:  it("CAP-CODE2-04 - enqueueContentGateIfNeeded existing 조회 안 compliance_record_id 매칭 (auto-gate.ts:48 정정)", async () => {
324:  it("CAP-CODE2-02·03 - ApproveContentArgs · RejectContentArgs 안 entryId required (compile-time type assertion)", () => {
326:    // 본 case 안 server-actions.ts:147 안 ApproveContentArgs.entryId 가 required string 인지 확인.
344:  it("CAP-CODE2-05 - schema validator fail closed (loader.ts:114 정정)", async () => {

 succeeded in 774ms:
24:  throw new ComplianceCatalogError(`catalog root not found - searched from ${startDir}`);
101:    throw new ComplianceCatalogError(`schema.json parse failed: ${(e as Error).message}`);
104:  // CAP-CODE-01 - 각 파일 sub-schema 안 $id 부여 + root schema 안 definitions 통합 후 compile
105:  const validators = new Map<string, ReturnType<typeof ajv.compile>>();
113:      validators.set(key, ajv.compile(combined));
115:      throw new ComplianceCatalogError(`schema ${key} compile failed: ${(e as Error).message}`);
119:    const validate = validators.get(schemaKey);
121:      // CAP-CODE2-05 - validator 누락 시 fail closed (schema.json 안 sub-schema key 미정의)
122:      throw new ComplianceCatalogError(`${filename}: validator for schema "${schemaKey}" not found`);
126:      throw new ComplianceCatalogError(`${filename} schema validation failed: ${errors}`);
181:      throw new ComplianceCatalogError(`duplicate RiskRule.id: ${r.id}`);
238:      throw new ComplianceCatalogError(`duplicate override for: ${ov.targetRuleId}`);
257:    throw new ComplianceCatalogError(`override target not found: ${targetId}`);
263:let cachedCatalog: LoadedCatalog | null = null;
264:let cachedRootDir: string | null = null;
275:  cachedCatalog = null;
276:  cachedRootDir = null;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/entity-actions.ts | Select-Object -Skip 45 -First 75' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 60 -First 120' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 210 -First 115' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 360 -First 95' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 453 -First 95' in C:\Users\assag\solution\website-exposure
 succeeded in 795ms:
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
  // CAP-CODE2-03 정정 - 선택된 entry resolve + 동일 record 의 sibling open/in-progress 큐 모두 동반 resolve.
  //   reject 시 manual-review · content-gate 양 큐 정리 (stale entry 회피).
  await tx`
    UPDATE review_queue_entry
       SET status = 'resolved'::review_queue_status,
           resolved_at = ${now.toISOString()}::timestamptz,
           resolved_by = ${ctx.userId}::uuid,
           resolution_type = 'rejected',
           metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
           updated_at = now()
     WHERE instance_id = ${ctx.instanceId}::uuid
       AND compliance_record_id = ${args.recordId}::uuid
       AND status IN ('open', 'in-progress')
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

 succeeded in 798ms:
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
  // CAP-CODE2-02 정정 - role slot 이미 채워져 있어도 본 entry 가 open/in-progress 면 resolve 처리.
  //   manual-review + content-gate 동시 open 시 - 두 번째 큐 approve 시 record slot 이미 만족 → entry resolve + AND 게이트 평가.
  if (isRoleSatisfied(record, args.role)) {
    // 현 entry 가 open/in-progress 이면 resolved 처리 (idempotent 안전 - 같은 role 인 sibling entry resolve)
    if (entry.status !== "resolved") {
      await tx`
        UPDATE review_queue_entry
           SET status = 'resolved'::review_queue_status,
               resolved_at = now(),
               resolved_by = ${ctx.userId}::uuid,
               resolution_type = 'approved',
               updated_at = now()
         WHERE id = ${entry.id}::uuid
      `;
      // CAP-CODE2-02 - AND 게이트 재평가 - 모든 큐 resolved 시 entity 전이
      const openSiblings2 = await tx<{ cnt: string }[]>`
        SELECT count(*)::text AS cnt FROM review_queue_entry
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND compliance_record_id = ${args.recordId}::uuid
           AND status IN ('open', 'in-progress')
      `;
      if (Number(openSiblings2[0]?.cnt ?? "0") === 0) {
        const publishable2 = evaluatePublishable(record, record.content_type as ContentType);
        const targetStatus2 = publishable2.publishable ? "publishable" : "approved";
        await tx.unsafe(`
          UPDATE ${args.contentTable}
             SET status = '${targetStatus2}'::content_publication_status,
                 updated_at = now()
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
        `);
      }
    }
    return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: "resolved" };
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

 succeeded in 806ms:
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
        // CAP-CODE-02·03·04 + CAP-CODE2-01 정정 - 실 schema 안 entity별 body 컬럼 명 정정:
        //   Article = summary + body_markdown (article_type 컬럼 없음 - v0.1 default 'general-medical-info' · CA-DEFER-35 운영자 명시 Phase Beta)
        //   TreatmentPage = body_markdown
        //   FAQ = question + answer
        //   LegalDocument/Publication/MediaAppearance = exempt envelope 분기 - body select 불필요 (NULL)
        const isExempt = contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance";
        const bodySelect = isExempt ? "NULL::text"
          : contentType === "Article" ? "(summary || E'\\n\\n' || body_markdown)::text"
          : contentType === "TreatmentPage" ? "body_markdown::text"
          : contentType === "FAQ" ? "answer::text"
          : "NULL::text";
        const riskLevelSelect = isExempt || contentType === "FAQ" ? "NULL::text" : "risk_level::text";
        const faqQuestionSelect = contentType === "FAQ" ? "question::text" : "NULL::text";
        const rows = await tx.unsafe<{ status: string; risk_level: string | null; body: string | null; faq_question: string | null }[]>(`
          SELECT status::text AS status,
                 ${riskLevelSelect} AS risk_level,
                 ${bodySelect} AS body,
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
        // CAP-CODE2-01 - Article 안 articleType 실 schema 미존재 → v0.1 default
        const articleType = contentType === "Article" ? "general-medical-info" : undefined;
        const out = await submitForReview(tx, ctx, {
          contentType,
          contentRef,
          contentRow: {
            status: row.status,
            risk_level: row.risk_level,
            body,
            articleType,
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

 succeeded in 823ms:
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

 succeeded in 791ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 170 -First 190' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/auto-gate.ts | Select-Object -Skip 1 -First 95' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/compliance-rules/src/loader.ts | Select-Object -Skip 95 -First 45' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts | Select-Object -Skip 315 -First 55' in C:\Users\assag\solution\website-exposure
 succeeded in 780ms:
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
  // CAP-CODE2-04 정정 - compliance_record_id 도 함께 매칭. 이전 record 안 stale entry 잘못 반환 회피.
  const existing = await tx<{ id: string }[]>`
    SELECT id FROM review_queue_entry
    WHERE instance_id = ${ctx.instanceId}::uuid
      AND content_type = ${contentType}::compliance_content_type
      AND content_ref = ${contentRef}
      AND queue_type = 'content-gate'::review_queue_type
      AND compliance_record_id = ${recordId}::uuid
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

 succeeded in 787ms:
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
  // CAP-CODE2-05 정정 - schema 컴파일 실패 시 fail closed (catalog 로드 중단).
  for (const [key, schemaDef] of Object.entries(schemaFiles)) {
    try {
      const combined = {
        ...(schemaDef as object),
        definitions: schemaJson.definitions ?? {},
      };
      validators.set(key, ajv.compile(combined));
    } catch (e) {
      throw new ComplianceCatalogError(`schema ${key} compile failed: ${(e as Error).message}`);
    }
  }
  function validateAgainstSchema(filename: string, schemaKey: string, data: unknown): void {
    const validate = validators.get(schemaKey);
    if (!validate) {
      // CAP-CODE2-05 - validator 누락 시 fail closed (schema.json 안 sub-schema key 미정의)
      throw new ComplianceCatalogError(`${filename}: validator for schema "${schemaKey}" not found`);
    }
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

 succeeded in 794ms:
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
  // CAP-CODE2-02 정정 - role slot 이미 채워져 있어도 본 entry 가 open/in-progress 면 resolve 처리.
  //   manual-review + content-gate 동시 open 시 - 두 번째 큐 approve 시 record slot 이미 만족 → entry resolve + AND 게이트 평가.
  if (isRoleSatisfied(record, args.role)) {
    // 현 entry 가 open/in-progress 이면 resolved 처리 (idempotent 안전 - 같은 role 인 sibling entry resolve)
    if (entry.status !== "resolved") {
      await tx`
        UPDATE review_queue_entry
           SET status = 'resolved'::review_queue_status,
               resolved_at = now(),
               resolved_by = ${ctx.userId}::uuid,
               resolution_type = 'approved',
               updated_at = now()
         WHERE id = ${entry.id}::uuid
      `;
      // CAP-CODE2-02 - AND 게이트 재평가 - 모든 큐 resolved 시 entity 전이
      const openSiblings2 = await tx<{ cnt: string }[]>`
        SELECT count(*)::text AS cnt FROM review_queue_entry
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND compliance_record_id = ${args.recordId}::uuid
           AND status IN ('open', 'in-progress')
      `;
      if (Number(openSiblings2[0]?.cnt ?? "0") === 0) {
        const publishable2 = evaluatePublishable(record, record.content_type as ContentType);
        const targetStatus2 = publishable2.publishable ? "publishable" : "approved";
        await tx.unsafe(`
          UPDATE ${args.contentTable}
             SET status = '${targetStatus2}'::content_publication_status,
                 updated_at = now()
           WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
        `);
      }
    }
    return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: "resolved" };
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

 succeeded in 758ms:
  it("CAP-CODE2-04 - enqueueContentGateIfNeeded existing 조회 안 compliance_record_id 매칭 (auto-gate.ts:48 정정)", async () => {
    // 본 케이스는 DB 의존성 - mock 없이 unit test 불가. SQL 안 compliance_record_id 추가 검증은 docs assert.
    // auto-gate.ts:44~52 안 `AND compliance_record_id = ${recordId}::uuid` 절 확인 (read-only assertion · 회귀 marker).
    const { enqueueContentGateIfNeeded } = await import("../auto-gate");
    expect(typeof enqueueContentGateIfNeeded).toBe("function");
    // 실 DB 회귀는 e2e cycle 안 (Phase Beta - vitest db harness).
  });

  it("CAP-CODE2-02·03 - ApproveContentArgs · RejectContentArgs 안 entryId required (compile-time type assertion)", () => {
    // type 안 entryId required 검증 - TypeScript compile 자체가 type assertion.
    // 본 case 안 server-actions.ts:147 안 ApproveContentArgs.entryId 가 required string 인지 확인.
    type Args = {
      recordId: string;
      role: "operator" | "medical" | "legal";
      contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
      contentRef: string;
      entryId: string;   // CAP-CODE-13 - required
    };
    const sample: Args = {
      recordId: "00000000-0000-0000-0000-000000000000",
      role: "operator",
      contentTable: "article",
      contentRef: "test-slug",
      entryId: "00000000-0000-0000-0000-000000000001",
    };
    expect(sample.entryId).toBeDefined();
  });

  it("CAP-CODE2-05 - schema validator fail closed (loader.ts:114 정정)", async () => {
    // loadCatalog 안 schema compile/validation 실패 → ComplianceCatalogError throw.
    // 현 catalog 안 정상 데이터이므로 throw 발생 안 함 - 정상 load PASS 만 검증.
    const { loadCatalog } = await import("@glitzy/compliance-rules");
    const c = await loadCatalog();
    expect(c.catalogVersion).toBeDefined();
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


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "review_queue_entry|content-gate|UNIQUE|unique|idx" packages apps -g "*.sql"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "review_queue_entry|content-gate|queue_type" packages apps -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "article_type|body_markdown|summary|risk_level|CREATE TABLE.*article|legal_document|publication|media_appearance" packages/core-content/migrations/C0005_article.sql packages/core-content/migrations/C0006_legal_document.sql packages/core-content/migrations/C0010_publication.sql packages/core-content/migrations/C0011_media_appearance.sql' in C:\Users\assag\solution\website-exposure
 succeeded in 692ms:
packages/core-content/migrations/C0010_publication.sql:2:-- EC-SCHEMA-08·09·10: 외부 학술 인용 entity · authors[] min 1 NOT NULL (DEFAULT 제거) · risk_level Low fixed CHECK.
packages/core-content/migrations/C0010_publication.sql:4:-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level
packages/core-content/migrations/C0010_publication.sql:6:CREATE TABLE publication (
packages/core-content/migrations/C0010_publication.sql:18:  summary TEXT NOT NULL,
packages/core-content/migrations/C0010_publication.sql:20:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0010_publication.sql:21:  risk_level risk_level NOT NULL DEFAULT 'Low',
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
packages/core-content/migrations/C0011_media_appearance.sql:22:  risk_level risk_level NOT NULL DEFAULT 'Low',
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
packages/core-content/migrations/C0006_legal_document.sql:2:-- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum
packages/core-content/migrations/C0006_legal_document.sql:5:CREATE TYPE legal_document_type AS ENUM (
packages/core-content/migrations/C0006_legal_document.sql:9:CREATE TABLE legal_document (
packages/core-content/migrations/C0006_legal_document.sql:13:  document_type legal_document_type NOT NULL,
packages/core-content/migrations/C0006_legal_document.sql:24:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0006_legal_document.sql:25:  risk_level risk_level NOT NULL DEFAULT 'Low',
packages/core-content/migrations/C0006_legal_document.sql:30:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
packages/core-content/migrations/C0006_legal_document.sql:31:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
packages/core-content/migrations/C0006_legal_document.sql:32:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
packages/core-content/migrations/C0006_legal_document.sql:33:  CONSTRAINT legal_document_email_regex CHECK (
packages/core-content/migrations/C0006_legal_document.sql:37:  CONSTRAINT legal_document_template_version_format CHECK (
packages/core-content/migrations/C0006_legal_document.sql:40:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
packages/core-content/migrations/C0006_legal_document.sql:44:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
packages/core-content/migrations/C0006_legal_document.sql:46:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
packages/core-content/migrations/C0006_legal_document.sql:47:  -- LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
packages/core-content/migrations/C0006_legal_document.sql:48:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
packages/core-content/migrations/C0006_legal_document.sql:49:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
packages/core-content/migrations/C0006_legal_document.sql:50:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
packages/core-content/migrations/C0006_legal_document.sql:54:CREATE UNIQUE INDEX legal_document_instance_5type_unique
packages/core-content/migrations/C0006_legal_document.sql:55:  ON legal_document (instance_id, document_type)
packages/core-content/migrations/C0006_legal_document.sql:58:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
packages/core-content/migrations/C0006_legal_document.sql:60:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
packages/core-content/migrations/C0006_legal_document.sql:61:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
packages/core-content/migrations/C0006_legal_document.sql:63:CREATE POLICY tenant_isolation ON legal_document
packages/core-content/migrations/C0006_legal_document.sql:68:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
packages/core-content/migrations/C0005_article.sql:5:CREATE TABLE article (
packages/core-content/migrations/C0005_article.sql:10:  summary TEXT NOT NULL,
packages/core-content/migrations/C0005_article.sql:11:  body_markdown TEXT NOT NULL,
packages/core-content/migrations/C0005_article.sql:12:  status content_publication_status NOT NULL DEFAULT 'draft',
packages/core-content/migrations/C0005_article.sql:13:  risk_level risk_level,
packages/core-content/migrations/C0005_article.sql:24:  CONSTRAINT article_summary_length CHECK (length(summary) BETWEEN 80 AND 200),

 succeeded in 720ms:
packages\migrations-runner\src\manifest.ts:193:  // (18) C0015 review_queue_entry (CA-SCHEMA-04)
packages\migrations-runner\src\manifest.ts:195:    file: "packages/core-content/migrations/C0015_review_queue_entry.sql",
packages\migrations-runner\src\manifest.ts:198:      "review_queue_entry",
packages\migrations-runner\src\manifest.ts:199:      "review_queue_type",
packages\migrations-runner\src\manifest.ts:247:  // (20) C0017 review_queue_type enum 안 'content-gate' ADD VALUE 단독
packages\migrations-runner\src\manifest.ts:253:    creates: ["review_queue_type.content-gate"],
packages\migrations-runner\src\manifest.ts:254:    dependsOn: ["review_queue_type"],
packages\migrations-runner\src\manifest.ts:256:  // (21) C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
packages\migrations-runner\src\manifest.ts:258:  //   기존: (instance_id, content_type, content_ref) · 변경: (instance_id, content_type, content_ref, queue_type)
packages\migrations-runner\src\manifest.ts:262:    creates: ["review_queue_entry_open_unique"],
packages\migrations-runner\src\manifest.ts:263:    dependsOn: ["review_queue_entry", "review_queue_type.content-gate"],
packages\core-content\src\schema.ts:5:// v0.5: + compliance_record (C-10 skeleton subset) + review_queue_entry (REVIEW_WORKFLOW § 3) + 6 entity compliance_record_id FK + skeleton-limit CHECK 해제 (legal_document · faq)
packages\core-content\src\schema.ts:54:// v0.6 - COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.3 - 'content-gate' ADD VALUE (CAP-10)
packages\core-content\src\schema.ts:55:export const reviewQueueTypeEnum = pgEnum("review_queue_type", ["manual-review", "content-gate"]);
packages\core-content\src\schema.ts:600:  "review_queue_entry",
packages\core-content\src\schema.ts:604:    queueType: reviewQueueTypeEnum("queue_type").notNull(),
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
apps\web\src\lib\compliance\auto-gate.ts:4:// CAP2-06 - event id 'content-gate-queued' + source: "auto"
apps\web\src\lib\compliance\auto-gate.ts:38:  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
apps\web\src\lib\compliance\auto-gate.ts:41:    SELECT id FROM review_queue_entry
apps\web\src\lib\compliance\auto-gate.ts:45:      AND queue_type = 'content-gate'::review_queue_type
apps\web\src\lib\compliance\auto-gate.ts:55:    INSERT INTO review_queue_entry (
apps\web\src\lib\compliance\auto-gate.ts:56:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
apps\web\src\lib\compliance\auto-gate.ts:60:      'content-gate'::review_queue_type,
apps\web\src\lib\compliance\check.ts:51:      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
apps\web\src\lib\compliance\check.ts:82:      findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
apps\web\src\lib\compliance\check.ts:151:    severity: "content-gate",
apps\web\src\lib\compliance\check.ts:178:  const counts = { fail: 0, "content-gate": 0, warning: 0, info: 0 };
apps\web\src\lib\compliance\check.ts:181:  const gateRequired = counts["content-gate"] > 0;
apps\web\src\lib\compliance\entity-actions.ts:130:        // CAP-CODE-10 정정 - content-gate 큐 진입 시 별도 audit emit (REVIEW_WORKFLOW § 9.1.1 정합 · source:"auto")
apps\web\src\lib\compliance\entity-actions.ts:133:            eventType: "content-gate-queued",
apps\web\src\lib\compliance\server-actions.ts:122:    INSERT INTO review_queue_entry (
apps\web\src\lib\compliance\server-actions.ts:123:      instance_id, queue_type, content_type, content_ref, compliance_record_id,
apps\web\src\lib\compliance\server-actions.ts:127:      'manual-review'::review_queue_type,
apps\web\src\lib\compliance\server-actions.ts:140:  // CAP-CODE-09·10·11 정정 - auto-gate helper 단일 경로 통합 (server-actions 중복 SQL 제거 · 영업일 3일 SLA · content-gate-queued audit emit 별도 wrapper)
apps\web\src\lib\compliance\server-actions.ts:152:  // CAP-CODE-13 정정 - 호출자가 선택한 entry 만 잠금 + 처리. manual-review · content-gate 동시 open 가능.
apps\web\src\lib\compliance\server-actions.ts:173:  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 호출자가 잠금 entry 결정.
apps\web\src\lib\compliance\server-actions.ts:174:  const entryRows = await tx<{ id: string; status: string; queue_type: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
apps\web\src\lib\compliance\server-actions.ts:175:    SELECT id, status::text AS status, queue_type::text AS queue_type, assigned_to, required_roles::text[] AS required_roles,
apps\web\src\lib\compliance\server-actions.ts:177:      FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:229:  //   manual-review + content-gate 동시 open 시 - 두 번째 큐 approve 시 record slot 이미 만족 → entry resolve + AND 게이트 평가.
apps\web\src\lib\compliance\server-actions.ts:234:        UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:244:        SELECT count(*)::text AS cnt FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:279:      UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:308:      UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:319:    //   manual-review + content-gate 동시 open 시 둘 다 resolved 후 publishable.
apps\web\src\lib\compliance\server-actions.ts:322:        FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:376:  // CAP-CODE-13 정정: args.entryId 명시 선택 - manual-review · content-gate 동시 open 시 엉뚱한 큐 처리 회피.
apps\web\src\lib\compliance\server-actions.ts:380:      FROM review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:418:  //   reject 시 manual-review · content-gate 양 큐 정리 (stale entry 회피).
apps\web\src\lib\compliance\server-actions.ts:420:    UPDATE review_queue_entry
apps\web\src\lib\compliance\server-actions.ts:489:  //   manual-review · content-gate 큐 중 1+ 가 open 이면 publish 차단.
apps\web\src\lib\compliance\server-actions.ts:492:      FROM review_queue_entry
apps\web\src\lib\compliance\types.ts:45:  severity: "info" | "warning" | "fail" | "content-gate";
apps\web\src\lib\compliance\types.ts:62:    "content-gate": number;
apps\web\src\lib\compliance\__tests__\compliance.test.ts:70:    expect(env.result.findingsBySeverity["content-gate"]).toBeGreaterThanOrEqual(1);
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:67:  it("시나리오 7 - event-fact-statement-001 매칭 (Article articleType=general-medical-info → content-gate)", () => {
apps\web\src\lib\compliance\__tests__\phase-alpha.test.ts:76:    expect(f?.severity).toBe("content-gate");
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:49:            FROM review_queue_entry
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:137:            FROM review_queue_entry

 succeeded in 728ms:
packages\db\migrations\D0010_instance.sql:6:  slug TEXT NOT NULL UNIQUE,  -- subdomain·routing key (예: clinic-abc)
packages\db\migrations\D0010_instance.sql:16:CREATE INDEX instance_active_idx ON instance (active) WHERE active = true;
packages\db\migrations\D0010_instance.sql:17:CREATE INDEX instance_slug_active_idx ON instance (slug) WHERE active = true;
apps\spike-e\migrations\002_admin_user.sql:9:  email TEXT NOT NULL UNIQUE,
apps\spike-e\migrations\002_admin_user.sql:20:CREATE INDEX admin_user_email_idx ON admin_user (email);
apps\spike-e\migrations\002_admin_user.sql:21:CREATE INDEX admin_user_active_super_idx ON admin_user (active, is_super_admin);
apps\spike-e\migrations\002_admin_user.sql:40:CREATE UNIQUE INDEX instance_membership_active_unique
apps\spike-e\migrations\002_admin_user.sql:44:CREATE INDEX instance_membership_user_active_idx ON instance_membership (user_id, active);
apps\spike-e\migrations\002_admin_user.sql:45:CREATE INDEX instance_membership_instance_active_idx ON instance_membership (instance_id, active);
apps\spike-e\migrations\003_auth_session.sql:16:CREATE INDEX session_user_idx ON "session" ("userId");
apps\spike-e\migrations\003_auth_session.sql:17:CREATE INDEX session_expires_idx ON "session" ("expires");
apps\spike-e\migrations\003_auth_session.sql:28:CREATE INDEX "verificationToken_expires_idx" ON "verificationToken" ("expires");
apps\spike-b\migrations\002_outbox.sql:3:-- SPIKEB1-003 정정: full UNIQUE(instance_id, source_event_id) — replay 차단.
apps\spike-b\migrations\002_outbox.sql:26:-- SPIKEB1-003: full UNIQUE — replay 자체 차단 (completed 포함)
apps\spike-b\migrations\002_outbox.sql:27:CREATE UNIQUE INDEX outbox_idempotency
apps\spike-b\migrations\002_outbox.sql:30:CREATE INDEX outbox_claim_idx
apps\spike-b\migrations\002_outbox.sql:34:CREATE INDEX outbox_stale_idx
apps\spike-b\migrations\002_outbox.sql:38:CREATE INDEX outbox_status_idx ON outbox (status, created_at DESC);
apps\spike-e\migrations\004_audit_event.sql:19:CREATE INDEX audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
apps\spike-e\migrations\004_audit_event.sql:20:CREATE INDEX audit_event_actor_time_idx ON audit_event (actor_user_id, occurred_at DESC);
apps\spike-e\migrations\005_rls_test_table.sql:14:CREATE INDEX tenant_data_instance_idx ON tenant_data (instance_id);
apps\spike-b\migrations\004_external_call_log.sql:18:CREATE UNIQUE INDEX external_call_log_idempotency_success
apps\spike-b\migrations\004_external_call_log.sql:22:CREATE INDEX external_call_log_event_idx
apps\spike-b\migrations\003_inbox.sql:5:-- idempotent UNIQUE(instance_id, source_event_id) — 재처리 시 no-op
apps\spike-b\migrations\003_inbox.sql:17:CREATE UNIQUE INDEX inbox_idempotency
apps\spike-b\migrations\003_inbox.sql:20:CREATE INDEX inbox_outbox_idx ON inbox (outbox_id);
apps\spike-b\migrations\005_invariant_log.sql:25:CREATE INDEX invariant_log_run_idx ON invariant_log (run_id, occurred_at DESC);
apps\spike-b\migrations\006_permanent_alert.sql:4:-- UNIQUE(outbox_id) — 동일 outbox에 대해 alert 1건만.
apps\spike-b\migrations\006_permanent_alert.sql:17:CREATE UNIQUE INDEX permanent_alert_idempotency
apps\spike-b\migrations\006_permanent_alert.sql:20:CREATE INDEX permanent_alert_instance_idx ON permanent_alert (instance_id, raised_at DESC);
apps\spike-b\migrations\007_provider_attempt_log.sql:7:-- external_call_log(004)는 DB UNIQUE 기반 사후 dedupe.
apps\spike-b\migrations\007_provider_attempt_log.sql:23:CREATE UNIQUE INDEX provider_attempt_log_accepted_success
apps\spike-b\migrations\007_provider_attempt_log.sql:27:CREATE INDEX provider_attempt_log_event_idx
apps\spike-a\migrations\002_content_test.sql:13:CREATE INDEX content_test_instance_id_idx ON content_test (instance_id);
apps\spike-a\migrations\003_audit_log.sql:18:CREATE INDEX audit_log_instance_id_idx ON audit_log (instance_id, occurred_at DESC);
packages\core-content\migrations\C0005_article.sql:26:  CONSTRAINT article_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0005_article.sql:27:  CONSTRAINT article_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0005_article.sql:33:CREATE INDEX article_instance_idx ON article (instance_id);
packages\core-content\migrations\C0005_article.sql:34:CREATE INDEX article_status_idx ON article (instance_id, status);
packages\core-content\migrations\C0005_article.sql:35:CREATE INDEX article_published_idx ON article (instance_id, published_at)
packages\core-content\migrations\C0005_article.sql:37:CREATE INDEX article_author_idx ON article (instance_id, author_doctor_id) WHERE author_doctor_id IS NOT NULL;
apps\spike-a\migrations\004_invariant_log.sql:8:  worker_idx INT NOT NULL,
apps\spike-a\migrations\004_invariant_log.sql:21:CREATE INDEX invariant_log_run_idx ON invariant_log (run_id, iteration, worker_idx);
apps\spike-a\migrations\004_invariant_log.sql:22:CREATE INDEX invariant_log_failed_idx ON invariant_log (run_id, passed) WHERE passed = false;
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql:2:-- Precondition: C0001 clinic_profile + clinic_profile_instance_id_unique · C0002 location_profile
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql:31:CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);
packages\core-content\migrations\C0004_treatment_page.sql:32:  CONSTRAINT treatment_page_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0004_treatment_page.sql:33:  CONSTRAINT treatment_page_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0004_treatment_page.sql:36:CREATE INDEX treatment_page_instance_idx ON treatment_page (instance_id);
packages\core-content\migrations\C0004_treatment_page.sql:37:CREATE INDEX treatment_page_status_idx ON treatment_page (instance_id, status);
packages\core-content\migrations\C0004_treatment_page.sql:38:CREATE INDEX treatment_page_published_idx ON treatment_page (instance_id, published_at)
packages\core-content\migrations\C0006_legal_document.sql:49:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0006_legal_document.sql:50:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0006_legal_document.sql:53:-- LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제 — LL-DEFER-12)
packages\core-content\migrations\C0006_legal_document.sql:54:CREATE UNIQUE INDEX legal_document_instance_5type_unique
packages\core-content\migrations\C0006_legal_document.sql:58:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
packages\core-content\migrations\C0010_publication.sql:46:  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0010_publication.sql:47:  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0010_publication.sql:52:CREATE INDEX publication_instance_idx ON publication (instance_id);
packages\core-content\migrations\C0010_publication.sql:53:CREATE INDEX publication_status_idx ON publication (instance_id, status);
packages\core-content\migrations\C0010_publication.sql:54:CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
packages\core-content\migrations\C0010_publication.sql:56:CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
packages\core-content\migrations\C0003_doctor_profile.sql:21:  CONSTRAINT doctor_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0003_doctor_profile.sql:22:  CONSTRAINT doctor_profile_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0003_doctor_profile.sql:25:CREATE INDEX doctor_profile_instance_idx ON doctor_profile (instance_id);
packages\core-content\migrations\C0003_doctor_profile.sql:26:CREATE INDEX doctor_profile_active_order_idx ON doctor_profile (instance_id, active, display_order) WHERE active = true;
packages\core-content\migrations\C0009_article_category.sql:29:  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0009_article_category.sql:30:  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0009_article_category.sql:35:CREATE INDEX article_category_instance_idx ON article_category (instance_id);
packages\core-content\migrations\C0009_article_category.sql:36:CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
packages\core-content\migrations\C0009_article_category.sql:37:CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
packages\core-content\migrations\C0011_media_appearance.sql:42:  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0011_media_appearance.sql:43:  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0011_media_appearance.sql:48:CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
packages\core-content\migrations\C0011_media_appearance.sql:49:CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
packages\core-content\migrations\C0011_media_appearance.sql:50:CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
packages\core-content\migrations\C0011_media_appearance.sql:52:CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
packages\core-content\migrations\C0012_faq.sql:31:  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0012_faq.sql:32:  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
packages\core-content\migrations\C0012_faq.sql:42:CREATE INDEX faq_instance_idx ON faq (instance_id);
packages\core-content\migrations\C0012_faq.sql:43:CREATE INDEX faq_status_idx ON faq (instance_id, status);
packages\core-content\migrations\C0012_faq.sql:44:CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
packages\core-content\migrations\C0012_faq.sql:46:CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
packages\core-content\migrations\C0012_faq.sql:48:CREATE INDEX faq_order_idx ON faq (instance_id, display_order, id);
packages\core-content\migrations\C0002_location_profile.sql:34:  CONSTRAINT location_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0002_location_profile.sql:35:  CONSTRAINT location_profile_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0002_location_profile.sql:38:CREATE INDEX location_profile_instance_idx ON location_profile (instance_id);
packages\core-content\migrations\C0013_article_category_fk.sql:59:CREATE INDEX IF NOT EXISTS article_category_idx ON article (instance_id, category_id);
packages\core-content\migrations\C0001_clinic_profile.sql:26:  CONSTRAINT clinic_profile_instance_slug_unique UNIQUE (instance_id, slug),
packages\core-content\migrations\C0001_clinic_profile.sql:27:  CONSTRAINT clinic_profile_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0001_clinic_profile.sql:30:CREATE INDEX clinic_profile_instance_idx ON clinic_profile (instance_id);
packages\core-content\migrations\C0014_compliance_record.sql:59:  CONSTRAINT compliance_record_unique_version UNIQUE (instance_id, content_type, content_ref, record_version),
packages\core-content\migrations\C0014_compliance_record.sql:60:  CONSTRAINT compliance_record_instance_id_unique UNIQUE (instance_id, id)
packages\core-content\migrations\C0014_compliance_record.sql:63:CREATE INDEX compliance_record_instance_idx ON compliance_record (instance_id);
packages\core-content\migrations\C0014_compliance_record.sql:64:CREATE INDEX compliance_record_content_ref_idx ON compliance_record (instance_id, content_type, content_ref);
packages\core-content\migrations\C0014_compliance_record.sql:65:CREATE INDEX compliance_record_phase_idx ON compliance_record (instance_id, record_phase);
packages\core-content\migrations\C0014_compliance_record.sql:66:CREATE INDEX compliance_record_published_at_idx ON compliance_record (instance_id, published_at) WHERE record_phase = 'published';
apps\spike-d\migrations\008_expand_add_nullable.sql:9:CREATE INDEX content_test_published_at_idx ON content_test (published_at)
packages\core-content\migrations\C0015_review_queue_entry.sql:10:CREATE TABLE review_queue_entry (
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
packages\core-content\migrations\C0016_status_unlock.sql:56:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:84:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:111:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:139:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:166:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
packages\core-content\migrations\C0016_status_unlock.sql:192:  '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
apps\spike-d\migrations\006_audit_event.sql:16:CREATE INDEX IF NOT EXISTS audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC);
packages\core-content\migrations\C0017_content_gate_queue_enum.sql:1:-- @glitzy/core-content — C0017 review_queue_type enum 안 'content-gate' ADD VALUE 단독
packages\core-content\migrations\C0017_content_gate_queue_enum.sql:4:-- 본 migration 은 단독 step. C0018 (UNIQUE 재정의) 는 별 step.
packages\core-content\migrations\C0017_content_gate_queue_enum.sql:6:ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:1:-- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:3:-- 기존 C0015 unique: (instance_id, content_type, content_ref) partial WHERE status IN open/in-progress
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:4:-- 변경: (instance_id, content_type, content_ref, queue_type) - content-gate + manual-review 동시 open 가능
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:6:DROP INDEX IF EXISTS review_queue_entry_open_unique;
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:7:CREATE UNIQUE INDEX review_queue_entry_open_unique
packages\core-content\migrations\C0018_review_queue_unique_redefine.sql:8:  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
apps\spike-d\migrations\005_migration_ledger.sql:7:  filename TEXT NOT NULL UNIQUE,
apps\spike-d\migrations\005_migration_ledger.sql:16:CREATE INDEX IF NOT EXISTS migration_ledger_applied_at_idx ON migration_ledger (applied_at DESC);
apps\spike-d\migrations\002_content_test.sql:19:  -- Note: requires (instance_id, id) unique. id가 PK이므로 (instance_id, id) UNIQUE 별도 필요.
apps\spike-d\migrations\002_content_test.sql:20:  CONSTRAINT content_test_instance_id_id_unique UNIQUE (instance_id, id),
apps\spike-d\migrations\002_content_test.sql:25:CREATE INDEX content_test_instance_id_idx ON content_test (instance_id);
apps\spike-d\migrations\003_instance_user_partial_unique.sql:1:-- Spike D — migration 003: instance_user with partial unique
apps\spike-d\migrations\003_instance_user_partial_unique.sql:2:-- SPIKED1-pending: partial unique (WHERE active=true) Drizzle Kit canonical 가능
apps\spike-d\migrations\003_instance_user_partial_unique.sql:13:-- partial unique: 동일 (instance_id, user_id) 조합은 active=true 상태로 1건만
apps\spike-d\migrations\003_instance_user_partial_unique.sql:15:CREATE UNIQUE INDEX instance_user_active_unique
apps\spike-d\migrations\003_instance_user_partial_unique.sql:19:CREATE INDEX instance_user_instance_id_idx ON instance_user (instance_id);
apps\spike-d\migrations\004_audit_log.sql:14:CREATE INDEX audit_log_instance_time_idx ON audit_log (instance_id, occurred_at DESC);

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0018_review_queue_unique_redefine.sql' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0015_review_queue_entry.sql | Select-Object -Skip 1 -First 60' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/src/schema.ts | Select-Object -Skip 596 -First 55' in C:\Users\assag\solution\website-exposure
 succeeded in 645ms:
-- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.2 (CAP-10 acceptance blocker)
-- 기존 C0015 unique: (instance_id, content_type, content_ref) partial WHERE status IN open/in-progress
-- 변경: (instance_id, content_type, content_ref, queue_type) - content-gate + manual-review 동시 open 가능

DROP INDEX IF EXISTS review_queue_entry_open_unique;
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
  WHERE status IN ('open', 'in-progress');

 succeeded in 650ms:
);

export const reviewQueueEntry = pgTable(
  "review_queue_entry",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    queueType: reviewQueueTypeEnum("queue_type").notNull(),
    contentType: complianceContentTypeEnum("content_type").notNull(),
    contentRef: text("content_ref").notNull(),
    complianceRecordId: uuid("compliance_record_id").notNull(),
    status: reviewQueueStatusEnum("status").notNull().default("open"),
    priority: reviewQueuePriorityEnum("priority").notNull().default("P0"),
    // approver_role[] — drizzle 의 array helper 없으므로 raw text 로 표현. raw SQL C0015 에서 enum array 정의.
    //   Drizzle 으로는 jsonb 대용 표현 — drizzle-orm 안 .array() 미지원 시 raw "approver_role[]" 으로 별도 helper.
    requiredRoles: text("required_roles").array().notNull(),
    assignedTo: uuid("assigned_to"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),
    slaDueAt: timestamp("sla_due_at", { withTimezone: true }).notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: uuid("resolved_by"),
    resolutionType: text("resolution_type"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    requiredRolesNonempty: check("review_queue_entry_required_roles_nonempty", sql`array_length(${t.requiredRoles}, 1) >= 1`),
    resolvedRequiresAt: check("review_queue_entry_resolved_requires_at",
      sql`${t.status} <> 'resolved' OR ${t.resolvedAt} IS NOT NULL`),
    resolvedRequiresType: check("review_queue_entry_resolved_requires_type",
      sql`${t.status} <> 'resolved' OR ${t.resolutionType} IS NOT NULL`),
    complianceFk: foreignKey({
      columns: [t.instanceId, t.complianceRecordId],
      foreignColumns: [complianceRecord.instanceId, complianceRecord.id],
      name: "review_queue_entry_compliance_fk",
    }),
    instanceIdUnique: unique("review_queue_entry_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("review_queue_entry_instance_idx").on(t.instanceId),
    statusIdx: index("review_queue_entry_status_idx").on(t.instanceId, t.status),
    openPriorityIdx: index("review_queue_entry_open_priority_idx")
      .on(t.instanceId, t.priority, t.slaDueAt)
      .where(sql`${t.status} IN ('open', 'in-progress')`),
    contentIdx: index("review_queue_entry_content_idx").on(t.instanceId, t.contentType, t.contentRef),
    // v0.6 - CAP-10 정정 - queue_type 포함 4-tuple (content-gate + manual-review 동시 open 가능)
    openUnique: uniqueIndex("review_queue_entry_open_unique")
      .on(t.instanceId, t.contentType, t.contentRef, t.queueType)
      .where(sql`${t.status} IN ('open', 'in-progress')`),
  }),
);

 succeeded in 678ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content "apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts" | Select-Object -Skip 1 -First 210' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"approveContent\\(|rejectContent\\(|publishContent\\(\" apps packages -g \"*.ts\"" in C:\Users\assag\solution\website-exposure
 succeeded in 635ms:
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:59:        const out = await approveContent(tx, ctx, {
apps\web\src\app\(admin)\admin\[instanceSlug]\review-queue\actions.ts:147:        await rejectContent(tx, ctx, {
apps\web\src\lib\compliance\entity-actions.ts:190:        // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
apps\web\src\lib\compliance\entity-actions.ts:213:        await publishContent(tx, ctx, {
apps\web\src\lib\compliance\server-actions.ts:162:export async function approveContent(
apps\web\src\lib\compliance\server-actions.ts:363:export async function rejectContent(
apps\web\src\lib\compliance\server-actions.ts:453:export async function publishContent(

2026-05-19T05:24:44.998543Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content "apps/web/src/app/(admin)/admin/[instanceSlug]/review-que[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 775ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content "apps/web/src/app/(admin)/admin/[instanceSlug]/review-que[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -LiteralPath "apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts" | Select-Object -Skip 1 -First 210' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/entity-actions.ts | Select-Object -Skip 180 -First 60' in C:\Users\assag\solution\website-exposure
 succeeded in 634ms:
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

 succeeded in 658ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/final-roles.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/check.ts | Select-Object -Skip 1 -First 115' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/types.ts | Select-Object -Skip 1 -First 110' in C:\Users\assag\solution\website-exposure
 succeeded in 671ms:
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

 succeeded in 710ms:
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

 succeeded in 711ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "function evaluatePublishable|export function evaluatePublishable|publishable" apps/web/src/lib/compliance/server-actions.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/server-actions.ts | Select-Object -Skip 330 -First 35' in C:\Users\assag\solution\website-exposure
 succeeded in 606ms:
18:import { evaluatePublishable } from "./publishable-check";
250:        const publishable2 = evaluatePublishable(record, record.content_type as ContentType);
251:        const targetStatus2 = publishable2.publishable ? "publishable" : "approved";
318:    // CAP-CODE-14 정정 - AND 게이트 - 동일 record 의 모든 open/in-progress 큐 entry 가 resolved 되어야만 publishable 전이
319:    //   manual-review + content-gate 동시 open 시 둘 다 resolved 후 publishable.
329:      // 모든 큐 resolved - publishable evaluator pass 시 publishable, 아니면 approved
330:      const publishable = evaluatePublishable(record, record.content_type as ContentType);
331:      const targetStatus = publishable.publishable ? "publishable" : "approved";
451: *   publishable evaluator 통과 검증.
483:  const publishable = evaluatePublishable(record, args.contentType);
484:  if (!publishable.publishable) {
485:    throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
502:  // CAMC-06 정정: entity 현 status='publishable' assert
522:  //   CAMC-05 정정: row count 검증 — current status='publishable' AND_clause.
530:       AND status = 'publishable'::content_publication_status

 succeeded in 591ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/compliance/publishable-check.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/compliance/server-actions.ts | ForEach-Object { if ($i -ge 228 -and $i -le 256) { "$i`: $_" }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content packages/core-content/migrations/C0018_review_queue_unique_redefine.sql | ForEach-Object { "$i`: $_"; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/compliance/auto-gate.ts | ForEach-Object { if ($i -ge 38 -and $i -le 70) { "$i`: $_" }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 698ms:
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

 succeeded in 706ms:
1: -- @glitzy/core-content — C0018 review_queue_entry partial UNIQUE 재정의 (queue_type 포함)
2: -- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 15.2 (CAP-10 acceptance blocker)
3: -- 기존 C0015 unique: (instance_id, content_type, content_ref) partial WHERE status IN open/in-progress
4: -- 변경: (instance_id, content_type, content_ref, queue_type) - content-gate + manual-review 동시 open 가능
5: 
6: DROP INDEX IF EXISTS review_queue_entry_open_unique;
7: CREATE UNIQUE INDEX review_queue_entry_open_unique
8:   ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
9:   WHERE status IN ('open', 'in-progress');

 succeeded in 720ms:
38:   // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type)
39:   // CAP-CODE2-04 정정 - compliance_record_id 도 함께 매칭. 이전 record 안 stale entry 잘못 반환 회피.
40:   const existing = await tx<{ id: string }[]>`
41:     SELECT id FROM review_queue_entry
42:     WHERE instance_id = ${ctx.instanceId}::uuid
43:       AND content_type = ${contentType}::compliance_content_type
44:       AND content_ref = ${contentRef}
45:       AND queue_type = 'content-gate'::review_queue_type
46:       AND compliance_record_id = ${recordId}::uuid
47:       AND status IN ('open', 'in-progress')
48:   `;
49:   if (existing.length > 0) return { entryId: existing[0]!.id };
50: 
51:   const requiredRoles = envelope.result.requiredApproverRoles ?? [];
52:   const slaDueAt = calculateContentGateSla();
53: 
54:   const inserted = await tx<{ id: string }[]>`
55:     INSERT INTO review_queue_entry (
56:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
57:       status, priority, required_roles, sla_due_at
58:     ) VALUES (
59:       ${ctx.instanceId}::uuid,
60:       'content-gate'::review_queue_type,
61:       ${contentType}::compliance_content_type,
62:       ${contentRef},
63:       ${recordId}::uuid,
64:       'open'::review_queue_status,
65:       'P0'::review_queue_priority,
66:       ${requiredRoles}::approver_role[],
67:       ${slaDueAt}::timestamptz
68:     )
69:     RETURNING id
70:   `;

 succeeded in 750ms:
228:   // CAP-CODE2-02 정정 - role slot 이미 채워져 있어도 본 entry 가 open/in-progress 면 resolve 처리.
229:   //   manual-review + content-gate 동시 open 시 - 두 번째 큐 approve 시 record slot 이미 만족 → entry resolve + AND 게이트 평가.
230:   if (isRoleSatisfied(record, args.role)) {
231:     // 현 entry 가 open/in-progress 이면 resolved 처리 (idempotent 안전 - 같은 role 인 sibling entry resolve)
232:     if (entry.status !== "resolved") {
233:       await tx`
234:         UPDATE review_queue_entry
235:            SET status = 'resolved'::review_queue_status,
236:                resolved_at = now(),
237:                resolved_by = ${ctx.userId}::uuid,
238:                resolution_type = 'approved',
239:                updated_at = now()
240:          WHERE id = ${entry.id}::uuid
241:       `;
242:       // CAP-CODE2-02 - AND 게이트 재평가 - 모든 큐 resolved 시 entity 전이
243:       const openSiblings2 = await tx<{ cnt: string }[]>`
244:         SELECT count(*)::text AS cnt FROM review_queue_entry
245:          WHERE instance_id = ${ctx.instanceId}::uuid
246:            AND compliance_record_id = ${args.recordId}::uuid
247:            AND status IN ('open', 'in-progress')
248:       `;
249:       if (Number(openSiblings2[0]?.cnt ?? "0") === 0) {
250:         const publishable2 = evaluatePublishable(record, record.content_type as ContentType);
251:         const targetStatus2 = publishable2.publishable ? "publishable" : "approved";
252:         await tx.unsafe(`
253:           UPDATE ${args.contentTable}
254:              SET status = '${targetStatus2}'::content_publication_status,
255:                  updated_at = now()
256:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts | ForEach-Object { if ($i -ge 315 -and $i -le 350) { "$i`: $_" }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/compliance/entity-actions.ts | ForEach-Object { if ($i -ge 63 -and $i -le 91) { "$i`: $_" }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/compliance/server-actions.ts | ForEach-Object { if ($i -ge 79 -and $i -le 88) { "$i`: $_" }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content packages/compliance-rules/src/loader.ts | ForEach-Object { if ($i -ge 107 -and $i -le 124) { "$i`: $_" }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 660ms:
63:         const isExempt = contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance";
64:         const bodySelect = isExempt ? "NULL::text"
65:           : contentType === "Article" ? "(summary || E'\\n\\n' || body_markdown)::text"
66:           : contentType === "TreatmentPage" ? "body_markdown::text"
67:           : contentType === "FAQ" ? "answer::text"
68:           : "NULL::text";
69:         const riskLevelSelect = isExempt || contentType === "FAQ" ? "NULL::text" : "risk_level::text";
70:         const faqQuestionSelect = contentType === "FAQ" ? "question::text" : "NULL::text";
71:         const rows = await tx.unsafe<{ status: string; risk_level: string | null; body: string | null; faq_question: string | null }[]>(`
72:           SELECT status::text AS status,
73:                  ${riskLevelSelect} AS risk_level,
74:                  ${bodySelect} AS body,
75:                  ${faqQuestionSelect} AS faq_question
76:             FROM ${table}
77:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
78:            FOR UPDATE
79:         `);
80:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
81:         // FAQ 안 Q+A 결합 body + qa block scope 입력
82:         const row = rows[0]!;
83:         let body = row.body ?? "";
84:         let qaBlocks: Array<{ question: string; answer: string; offsetStart: number }> | undefined;
85:         if (contentType === "FAQ" && row.faq_question) {
86:           body = `${row.faq_question}\n\n${row.body ?? ""}`;
87:           qaBlocks = [{ question: row.faq_question, answer: row.body ?? "", offsetStart: 0 }];
88:         }
89:         // CAP-CODE2-01 - Article 안 articleType 실 schema 미존재 → v0.1 default
90:         const articleType = contentType === "Article" ? "general-medical-info" : undefined;
91:         const out = await submitForReview(tx, ctx, {

 succeeded in 668ms:
315: describe("Phase Alpha v1.0 — server-action helper 단위 회귀 (CAP-CODE2-06 추가)", () => {
316:   it("CAP-CODE2-04 - enqueueContentGateIfNeeded existing 조회 안 compliance_record_id 매칭 (auto-gate.ts:48 정정)", async () => {
317:     // 본 케이스는 DB 의존성 - mock 없이 unit test 불가. SQL 안 compliance_record_id 추가 검증은 docs assert.
318:     // auto-gate.ts:44~52 안 `AND compliance_record_id = ${recordId}::uuid` 절 확인 (read-only assertion · 회귀 marker).
319:     const { enqueueContentGateIfNeeded } = await import("../auto-gate");
320:     expect(typeof enqueueContentGateIfNeeded).toBe("function");
321:     // 실 DB 회귀는 e2e cycle 안 (Phase Beta - vitest db harness).
322:   });
323: 
324:   it("CAP-CODE2-02·03 - ApproveContentArgs · RejectContentArgs 안 entryId required (compile-time type assertion)", () => {
325:     // type 안 entryId required 검증 - TypeScript compile 자체가 type assertion.
326:     // 본 case 안 server-actions.ts:147 안 ApproveContentArgs.entryId 가 required string 인지 확인.
327:     type Args = {
328:       recordId: string;
329:       role: "operator" | "medical" | "legal";
330:       contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
331:       contentRef: string;
332:       entryId: string;   // CAP-CODE-13 - required
333:     };
334:     const sample: Args = {
335:       recordId: "00000000-0000-0000-0000-000000000000",
336:       role: "operator",
337:       contentTable: "article",
338:       contentRef: "test-slug",
339:       entryId: "00000000-0000-0000-0000-000000000001",
340:     };
341:     expect(sample.entryId).toBeDefined();
342:   });
343: 
344:   it("CAP-CODE2-05 - schema validator fail closed (loader.ts:114 정정)", async () => {
345:     // loadCatalog 안 schema compile/validation 실패 → ComplianceCatalogError throw.
346:     // 현 catalog 안 정상 데이터이므로 throw 발생 안 함 - 정상 load PASS 만 검증.
347:     const { loadCatalog } = await import("@glitzy/compliance-rules");
348:     const c = await loadCatalog();
349:     expect(c.catalogVersion).toBeDefined();
350:   });

 succeeded in 673ms:
107:   for (const [key, schemaDef] of Object.entries(schemaFiles)) {
108:     try {
109:       const combined = {
110:         ...(schemaDef as object),
111:         definitions: schemaJson.definitions ?? {},
112:       };
113:       validators.set(key, ajv.compile(combined));
114:     } catch (e) {
115:       throw new ComplianceCatalogError(`schema ${key} compile failed: ${(e as Error).message}`);
116:     }
117:   }
118:   function validateAgainstSchema(filename: string, schemaKey: string, data: unknown): void {
119:     const validate = validators.get(schemaKey);
120:     if (!validate) {
121:       // CAP-CODE2-05 - validator 누락 시 fail closed (schema.json 안 sub-schema key 미정의)
122:       throw new ComplianceCatalogError(`${filename}: validator for schema "${schemaKey}" not found`);
123:     }
124:     if (!validate(data)) {

 succeeded in 690ms:
79:       qaBlocks: args.contentRow.qaBlocks,
80:     },
81:   };
82:   // CAP-CODE-04 정정 - 외부 인용 entity (Publication / MediaAppearance) exempt 처리
83:   let envelope: ComplianceCheckEnvelope;
84:   if (args.contentType === "LegalDocument") {
85:     envelope = buildLegalDocumentExemptEnvelope(checkInput);
86:   } else if (args.contentType === "Publication" || args.contentType === "MediaAppearance") {
87:     envelope = buildExternalCitationExemptEnvelope(checkInput);
88:   } else {

codex
# COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: major=2 minor=1 nit=0 (총 3)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 20 → cycle 2 = 6 → cycle 3 = 3

## major
- **CAP-CODE3-01** — `approveContent`의 `isRoleSatisfied` early branch가 multi-role entry를 조기 resolved 처리할 수 있음.  
  위치: `apps/web/src/lib/compliance/server-actions.ts:230`  
  `required_roles = ['operator','medical']`인 Medium/High entry에서 operator가 한 번 승인하면 entry는 `in-progress`가 된다. 이후 같은 operator가 다시 approve 호출하면 `isRoleSatisfied(record, 'operator') === true`라서 현재 entry를 `resolved`로 바꾸고, open sibling이 없으면 entity를 `approved`로 전이한다. 이때 medical slot은 아직 비어 있으므로 publishable은 아니지만 queue가 사라져 후속 medical 승인이 불가능해진다.  
  수정 권장: early branch에서 현재 entry를 resolve하기 전에 `finalRoles.every(isRoleSatisfied)`를 재평가해야 한다. 아직 미충족 role이 있으면 no-op 또는 기존 `in-progress` 유지가 맞다.

- **CAP-CODE3-02** — `auto-gate.ts`의 `compliance_record_id` 조회 조건과 DB partial UNIQUE 정의가 불일치함.  
  위치: `apps/web/src/lib/compliance/auto-gate.ts:40`, `packages/core-content/migrations/C0018_review_queue_unique_redefine.sql:7`  
  existing 조회는 `(instance_id, content_type, content_ref, queue_type, compliance_record_id)`로 좁혔지만, 실제 unique index는 `(instance_id, content_type, content_ref, queue_type)`만 포함한다. 이전 record의 stale `content-gate` open/in-progress entry가 남아 있으면 조회는 못 찾고, 새 record용 INSERT는 unique violation으로 실패한다. CAP-CODE2-04의 “stale entry 오반환 회피”는 달성했지만 새 큐 생성 경로가 막힌다.  
  수정 권장: unique index를 `compliance_record_id` 포함 형태로 재정의하거나, stale open entry를 명시적으로 resolve/오류 처리하는 정책을 코드와 schema 중 하나로 일관화해야 한다.

## minor
- **CAP-CODE3-03** — CAP-CODE2-06 회귀 테스트가 실제 회귀 조건을 검증하지 않음.  
  위치: `apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts:315`  
  추가된 3개 scenario는 함수 import, local type sample, 정상 catalog load만 확인한다. CAP-CODE2-02의 sibling approve 상태 전이, CAP-CODE2-03의 record 단위 sibling reject resolve, CAP-CODE2-04의 stale entry/unique 충돌 조건, CAP-CODE2-05의 compile 실패 throw를 실제로 실패시키는 negative path가 없다. 특히 CAP-CODE3-01 같은 조기 resolved 회귀를 현재 테스트가 잡지 못한다.  
  수정 권장: DB harness가 없다면 최소 mock tx 기반으로 status mutation/count query 순서를 검증하고, loader는 임시 catalog fixture로 compile 실패/validator 누락 throw를 직접 assertion해야 한다.

## nit
- 없음

=== CYCLE SIGNAL ===
cycle: 3
total_findings: 3
major: 2
minor: 1
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
tokens used
63,532
# COMPLIANCE_ASSISTANT_PHASE_ALPHA code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: major=2 minor=1 nit=0 (총 3)
- closeableAfterPatch: true
- 수렴 추세 추적: cycle 1 = 20 → cycle 2 = 6 → cycle 3 = 3

## major
- **CAP-CODE3-01** — `approveContent`의 `isRoleSatisfied` early branch가 multi-role entry를 조기 resolved 처리할 수 있음.  
  위치: `apps/web/src/lib/compliance/server-actions.ts:230`  
  `required_roles = ['operator','medical']`인 Medium/High entry에서 operator가 한 번 승인하면 entry는 `in-progress`가 된다. 이후 같은 operator가 다시 approve 호출하면 `isRoleSatisfied(record, 'operator') === true`라서 현재 entry를 `resolved`로 바꾸고, open sibling이 없으면 entity를 `approved`로 전이한다. 이때 medical slot은 아직 비어 있으므로 publishable은 아니지만 queue가 사라져 후속 medical 승인이 불가능해진다.  
  수정 권장: early branch에서 현재 entry를 resolve하기 전에 `finalRoles.every(isRoleSatisfied)`를 재평가해야 한다. 아직 미충족 role이 있으면 no-op 또는 기존 `in-progress` 유지가 맞다.

- **CAP-CODE3-02** — `auto-gate.ts`의 `compliance_record_id` 조회 조건과 DB partial UNIQUE 정의가 불일치함.  
  위치: `apps/web/src/lib/compliance/auto-gate.ts:40`, `packages/core-content/migrations/C0018_review_queue_unique_redefine.sql:7`  
  existing 조회는 `(instance_id, content_type, content_ref, queue_type, compliance_record_id)`로 좁혔지만, 실제 unique index는 `(instance_id, content_type, content_ref, queue_type)`만 포함한다. 이전 record의 stale `content-gate` open/in-progress entry가 남아 있으면 조회는 못 찾고, 새 record용 INSERT는 unique violation으로 실패한다. CAP-CODE2-04의 “stale entry 오반환 회피”는 달성했지만 새 큐 생성 경로가 막힌다.  
  수정 권장: unique index를 `compliance_record_id` 포함 형태로 재정의하거나, stale open entry를 명시적으로 resolve/오류 처리하는 정책을 코드와 schema 중 하나로 일관화해야 한다.

## minor
- **CAP-CODE3-03** — CAP-CODE2-06 회귀 테스트가 실제 회귀 조건을 검증하지 않음.  
  위치: `apps/web/src/lib/compliance/__tests__/phase-alpha.test.ts:315`  
  추가된 3개 scenario는 함수 import, local type sample, 정상 catalog load만 확인한다. CAP-CODE2-02의 sibling approve 상태 전이, CAP-CODE2-03의 record 단위 sibling reject resolve, CAP-CODE2-04의 stale entry/unique 충돌 조건, CAP-CODE2-05의 compile 실패 throw를 실제로 실패시키는 negative path가 없다. 특히 CAP-CODE3-01 같은 조기 resolved 회귀를 현재 테스트가 잡지 못한다.  
  수정 권장: DB harness가 없다면 최소 mock tx 기반으로 status mutation/count query 순서를 검증하고, loader는 임시 catalog fixture로 compile 실패/validator 누락 throw를 직접 assertion해야 한다.

## nit
- 없음

=== CYCLE SIGNAL ===
cycle: 3
total_findings: 3
major: 2
minor: 1
nit: 0
closeable_after_patch_ratio: 100%
ready_for_acceptance: false
scope_narrow_acceptable: true
recommendation: "다음 cycle 진입 권장"
