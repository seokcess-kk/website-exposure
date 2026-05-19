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
