# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.4 (4차 사이클)

## 컨텍스트

3차 비평(17 지적: blocking 6 + major 9 + minor 2) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.4 핵심 변경:
- DB 인벤토리 **15 tables** 정정 (CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설)
- CrmCredentialVersion·CrmIntegration state invariant 표 + rotating-revoked 잔재 제거
- NonceLedger key deliveryKind별 3분기 partial unique (exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort)
- InboundProcessingContext + providerVersionToken + provider별 expectedCrmVersion 산정 표
- outbound CAS WHERE도 crm_version 포함
- CrmChangeIdentityLedger 신설 — webhook + polling idempotency 통합
- CrmConsentWithdrawalLedger + applyConsentWithdrawal command + AuditAction
- non-PII operational hints entity별 column 분리 (CrmRecord.operationalHints*)
- DB CHECK PostgreSQL dialect 명시 + 행정구역 allowlist는 application validator
- § 4.7 unregister 정책 표 + FK ON DELETE 정책
- purge worker SoT § 10.4 — cadence·batch·legal hold·failure reconcile + 테이블별 액션
- REVIEW_WORKFLOW § 10.2.1: 7종 AuditAction (RRN 2종 + consent 1종 추가)
- DATA_MODEL C-08 v0.20: genericRestApiAdapter + CredentialVersion 경계
- retry queue worker SQL 9단계 풀 전개
- § 1.1 변경 정책 + 7행 추가 (displayHints column·state enum·table 추가)
- § 8.2 acceptance test 49 cases + traceability 표
- § 11.4 잔여 리스크

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.4를 이전과 동일한 강도로 엄정하게 비평하라:

1. **3차 지적 재발 여부**: 17개가 실제로 정정됐는가?
2. **v0.4 신규 도입 메커니즘 모순**:
   - CrmChangeIdentityLedger와 CrmWebhookNonceLedger의 책임 분리 — 같은 inbound webhook이 두 ledger를 모두 통과해야 하는가? 중복인가?
   - CrmConsentWithdrawalLedger 매칭 키(piiHash·crmExternalIdHash) — webhook payload에는 raw PII가 있으므로 piiHash 산정 가능, 그러나 polling/outbound 시 piiHash가 있는가?
   - InboundProcessingContext가 verifier→parser→validator→CAS 전 단계로 전달되지만 polling 경로에서는 verifier가 없는데 동일 context로 처리되는가?
   - CrmCredentialVersion `state=active` row 1개·`rotating-target` row 1개 application invariant — DB로 강제 불가능. 동시 rotate 호출 race 어떻게 막는가?
   - operational hints column이 PII 아니라고 했지만 desiredVisitDate·guardianInvolved 등은 일부 환경에서 식별성 위험 — 의료법 시점에서 안전한가?
   - § 10.4 purge worker 테이블별 액션과 § 4.7 unregister 정책 표의 액션이 충돌하지 않는가?
   - § 8.2 49 acceptance test 중 일부 (AT-35 migration backward-compatible)는 v0.3→v0.4 운영 데이터 부재 전제와 모순되지 않는가?
3. **DB schema 정합**:
   - § 13.1-§ 13.15가 정확히 15개 테이블인지
   - § 0과 § 13 헤더와 최하단 표가 모두 15로 정합한지
   - FK·UNIQUE·INDEX·partial unique·CHECK가 새 ledger 2개에 충분히 정의됐는지
4. **state machine 정합**:
   - CrmIntegration.credentialState 5상태와 CrmCredentialVersion.state 6상태 invariant 표가 모든 transition을 커버하는가?
   - reverted → stable의 "운영자 명시적 reset"이 운영 command로 정의됐는가?
5. **운영 사용성**:
   - 49 acceptance test로 v1.0 회귀 충분한가?
   - applyConsentWithdrawal·recoverRrnFalsePositive의 입력 형식이 OpenAPI/admin UI 관점에서 명확한가?
   - operational hints가 의료기관 운영자가 실제 화면에서 채울 정보 출처와 정합한가?
6. **cascade 무결성**:
   - REVIEW_WORKFLOW § 10.2.1에 3종 AuditAction (`crm-rrn-false-positive-recovered`·`crm-rrn-rejection-finalized`·`crm-consent-withdrawal-applied`)이 추가됐는가?
   - DATA_MODEL C-08 CrmIntegrationEntry에 genericRestApiAdapter가 추가됐는가? CrmCredentialVersion 경계 문구가 적절한가?
7. **문서 정합성**:
   - § 1.1 변경 정책 표에 새 메커니즘(ChangeIdentityLedger·ConsentWithdrawalLedger·operational hints) 추가가 SemVer 룰로 명확한가?
   - § 11 미결정 분류와 § 11.4 잔여 리스크의 경계가 명확한가?
   - 잔재 표현(예: "v0.3 § X 동일"이 너무 많아 본 문서가 v1.0 안정판으로 stand-alone하기 어려운지)이 있는가?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS4-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.4)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle3_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
