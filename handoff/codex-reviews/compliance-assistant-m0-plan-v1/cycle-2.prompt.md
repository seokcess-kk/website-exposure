Review `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v0.2 — **cycle 2**. cycle 1 28 finding patch 적용 검증 + 새 blocking/major/minor 확인.

## Cycle 1 patch (28 findings, blocking 9 · major 12 · minor 7)

| # | severity | title | patch |
|---|---|---|---|
| CAM-01 | blocking | EC-DEFER-05 해소 주장 정정 | "EC-DEFER-07/12 부분 해소, EC-DEFER-05 미해소" 명시 |
| CAM-02 | blocking | content-gate → manual-review queue | review_queue_type='manual-review' 1종 + content-gate 는 CA-DEFER-15 |
| CAM-03 | blocking | ComplianceCheckResult SoT 정합 | ComplianceCheckEnvelope wrapper · CONTENT_STANDARDS § 7.2 그대로 |
| CAM-04 | blocking | maxRisk MAX 결합 | helper 추가 — 격하 금지 |
| CAM-05 | blocking | High 입력 가상 finding | `m0-stub-risk-level-high-gate` 주입 + gateRequired=true |
| CAM-06 | blocking | publishable 6조건 | evaluatePublishable 전체 평가 + fail closed |
| CAM-07 | blocking | C0016 NOT VALID + backfill | sentinel ComplianceRecord 사전 INSERT + VALIDATE 단계 분리 |
| CAM-08 | blocking | published guard trigger | published_content_compliance_guard BEFORE trigger 신설 |
| CAM-09 | blocking | LegalDocument check() 면제 | check() 우회 + exemptReason envelope |
| CAM-10 | major | enum 풀 17종 + M0 allowlist | DB enum 17종 + app layer ALLOWED_SUBMIT_TYPES |
| CAM-11 | major | featureContentType CA-DEFER | CA-DEFER-16 신설 |
| CAM-12 | major | mediaThresholdOperationalInput CA-DEFER | CA-DEFER-13 에 추가 |
| CAM-13 | major | cancelled 제거 | open/in-progress/resolved 3종 |
| CAM-14 | major | compliance_record_id NOT NULL | manual-review 큐 — 고아 차단 |
| CAM-15 | major | required_roles enum array | approver_role[] enum array |
| CAM-16 | major | requiredApproverRoles 통합 | evaluatePublishable parsing + unknown fail closed |
| CAM-17 | major | approveContent atomic 전이 | open→in-progress + review-queued→in-review 첫 호출 atomic |
| CAM-18 | major | form status select read-only | workflow actions only |
| CAM-19 | major | Publication/Media unlock 표현 | form/zod unlock + compliance_record_id ADD COLUMN |
| CAM-20 | major | audit matrix cascade | REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade |
| CAM-21 | major | NotificationEvent CA-DEFER | CA-DEFER-14 신설 |
| CAM-22 | minor | "역할 3종" 정정 | client 제외 3종 |
| CAM-23 | minor | manifest 19단계 | 16 + C0014/C0015/C0016 = 19 |
| CAM-24 | minor | "6 entity" 정정 | 4 → 6 |
| CAM-25 | minor | C-08 → C-10 | DATA_MODEL § 4 SoT |
| CAM-26 | minor | 표기 규칙 | snake_case vs camelCase |
| CAM-27 | minor | hashtextextended | 64-bit lock key |
| CAM-28 | minor | 시나리오 13 scope | FAQ JSON-LD 별 회귀 테스트 |

## SoT to read (cycle 1 동일)

1. `docs/features/compliance-assistant.md` v1.0
2. `docs/admin/REVIEW_WORKFLOW.md`
3. `docs/core/DATA_MODEL.md` C-10
4. `docs/compliance/RISK_LEVELS.md`
5. `docs/core/CONTENT_STANDARDS.md` § 7
6. `docs/decisions/EAT_CONTENT_PLAN.md` v1.0
7. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1
8. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
9. `packages/core-content/src/schema.ts` v0.4

## Verification

cycle 1 의 28 patch 각각 PASS 검증 + 새 blocking/major/minor 확인. 짧게.

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=28 → cycle2=N

## cycle 1 patch 검증
- CAM-01: PASS/FAIL + 한 줄
... (CAM-01 ~ CAM-28)

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 시작점 147 cycle 1231 → ?
```

cycle 1 의 28건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
