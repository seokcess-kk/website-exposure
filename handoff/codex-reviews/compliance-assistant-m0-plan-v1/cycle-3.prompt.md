Review `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.3 — **cycle 3**. cycle 2 5 finding patch + 새 blocking/major/minor 확인.

## Cycle 2 patch (5 findings, blocking 3 · major 1 · minor 1)

| # | severity | title | patch |
|---|---|---|---|
| CAM2-01 | blocking | ComplianceCheckResult SoT 7 필드만 | summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. findingsBySeverity.info 키 포함 |
| CAM2-02 | blocking | LegalDocument check() 우회 일관 | submitForReview 분기에서 buildLegalDocumentExemptEnvelope() 호출 + check() 내부 LegalDocument 진입 시 throw |
| CAM2-03 | blocking | C0016 sentinel backfill 6 entity | Article · TreatmentPage · LegalDocument(no-op) · FAQ(no-op) · Publication · MediaAppearance 모두 명시 + NULL 검증 6건 + VALIDATE 6건 |
| CAM2-04 | major | unknown role throw | calculateFinalRoles 안 silently filter → ComplianceConfigError throw. evaluatePublishable try/catch → configError 반환 |
| CAM2-05 | minor | "manual-review 큐 1종" marker | cycle 1 patch 안 이미 정정 완료 |

## SoT to read (cycle 1·2 동일)

1. `docs/features/compliance-assistant.md` v1.0
2. `docs/admin/REVIEW_WORKFLOW.md`
3. `docs/core/DATA_MODEL.md` C-10
4. `docs/compliance/RISK_LEVELS.md`
5. `docs/core/CONTENT_STANDARDS.md` § 7 (특히 § 7.1.1.1 LegalDocument 면제 · § 7.2 ComplianceCheckResult 7 필드)
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1
8. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0

## Verification

cycle 2 의 5 patch 각각 PASS 검증 + 새 blocking/major/minor 확인. 짧게.

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=28 → cycle2=5 → cycle3=N

## cycle 2 patch 검증
- CAM2-01: PASS/FAIL + 한 줄
- CAM2-02: PASS/FAIL
- CAM2-03: PASS/FAIL
- CAM2-04: PASS/FAIL
- CAM2-05: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 시작점 147 cycle 1231 → ?
```

cycle 2 의 5건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
