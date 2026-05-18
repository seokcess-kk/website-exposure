# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.3 (3차 사이클)

## 컨텍스트

2차 비평(17 지적: blocking 7 + major 8 + minor 2) 전건 수용. v0.3 핵심 변경:
- DB 인벤토리 12 tables 정정 + 모든 테이블 풀 schema (FK·UNIQUE·INDEX·partial unique·CHECK·expiresAt)
- liveReadCrmDetail을 v1.x로 내림 — v1.0 raw PII 실시간 조회 미제공
- ProviderWebhookVerifier 결과 타입 고정 (VerifierResult shape + deliveryKind·retrySemantics)
- provider별 adapter contract 표 (Salesforce SOAP/Platform Events·HubSpot v3·generic-rest-api)
- nonce ledger key 정책 deliveryKind 분기 + retention SoT 단일화 (webhookNonceLedgerRetentionMinutes)
- displayHints **6 column closed schema** + DB CHECK + application validator
- outbound-only mode matrix 별도 + CrmFieldMapping direction inbound build fail
- CrmRecord CAS WHERE 조건 + ConflictRecord field-level (fieldPath·baseVersion·appliedFieldVersion)
- manual escalate 결정표
- CrmCredentialVersion entity 신설 + 5상태 머신 + outbound/inbound 사용 matrix
- RRN false positive 복구 command (recoverRrnFalsePositive) + ledger recoverable/final
- outbox sourceId에 credentialVersionId 포함 (lifecycle 반복 안전)
- retry queue worker SQL search-visibility § 13.5 복제
- credential fingerprint HMAC-SHA256(auditPepper, integrationId:secretVersionId)
- v1.0 운영 이벤트 canonical schema 본 문서 § 3.2 정의 (CONTENT_STANDARDS cascade 회피)
- acceptance test 27 cases
- § 11.4 잔여 리스크 분리

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.3을 이전과 동일한 강도로 엄정하게 비평하라:

1. **2차 지적 재발 여부**: 17개 지적이 실제로 정정됐는가? 표면만 바뀌고 본질이 남아있지 않은가?

2. **v0.3 신규 메커니즘의 모순**:
   - CrmCredentialVersion state(active·rotating-target·committed·grace-expired·reverted·revoked) 6개 vs § 4.5 상태 머신 5상태(stable·rotating·committed·grace-expired·reverted) — CrmIntegration.credentialState와 CrmCredentialVersion.state의 다른 enum 사용이 일관적인가
   - ProviderWebhookVerifier가 verifier 단계에서 providerEventId/Timestamp를 반환하지만 CrmFieldMapping의 inbound 처리 시점에는 verifier 결과가 어떻게 전달되는가
   - displayHints 6 column 분리 후 향후 column 추가가 MAJOR vs MINOR인지 § 1.1에 명확한 룰이 있는가
   - CAS WHERE 조건은 inbound CRM과 outbound solution 양방향에서 어떻게 race를 보장하는가 — 더 정밀하게는 CRM webhook과 polling이 동시에 발생할 때 nonce ledger와 CAS가 어떻게 협력하는가
   - § 13.13이 § 13.12 다음 절인데 인벤토리는 12 tables(§ 13.1-§ 13.13에서 § 13.10이 1개 테이블만)이고 마지막 문장은 "12개 admin DB 테이블"이라 함 — 실제 테이블 수와 절 번호 매핑이 정합한가
   - acceptance test 27개에서 ledger dedupe `duplicate-digest` 적용은 best-effort/at-least-once 케이스 둘 다 가능한데 케이스 분리가 됐는가

3. **PII closed schema 운영성**:
   - 6 column이 한국 의료기관 실제 운영자 화면에 충분한 정보를 제공하는가
   - ageBand·genderHint enum이 의료기관 표시 요구(예: 보호자 정보·진료과 hint 등)에 부족하지 않은가
   - 운영자가 raw PII 필요 시 "CRM 콘솔 직접 접근"이 v1.0 실제 운영 가능한 경로인가 — 권한 매핑·SSO 어떻게 되는가
   - displayHints의 piiRetentionExpiresAt 30일이 도래해도 CRM 자체는 raw PII 보유. solution 측 displayHints만 nulling vs delete로 처리해야 하는가

4. **legal·DPA·동의 차단 충분성**:
   - DPA만으로 record-level 처리가 v1.0에서 legally sound한가
   - patientConsentEvidenceRef·right to erasure가 v1.x인데, v1.0 운영 중 환자 동의 철회 요청 발생 시 어떻게 대응하는가
   - integration unregister 시 기존 CrmRecord·displayHints는 어떻게 처리되는가 (purge/orphan)

5. **운영 SLA·worker·purge**:
   - 27개 acceptance test로 v1.0 회귀가 충분한가
   - purge worker가 12개 테이블 중 어디 책임이고 어떤 cadence로 실행되는가 — 본 Feature 내부인가 공통 인프라인가
   - § 4.5.2 grace-expired worker 동작 cadence·실패 시 reconcile 명시됐는가

6. **이전 Feature와 패턴 정합성 / cascade 무결성**:
   - search-visibility § 13.5 SQL 복제는 정합한가 — 실제 SQL이 본 문서에 있으니 cross-check
   - DATA_MODEL C-08 v0.19가 CrmIntegrationEntry 3종 provider로 정의됐는데 본 문서 v0.3과 동기화됐는가
   - REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 cascade 4종이 본 문서 표와 정합한가
   - CredentialVersion entity 추가가 DATA_MODEL이나 다른 Feature cascade 영향 없는가

7. **문서 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 12 tables 일관성
   - § 1.1 변경 정책 표가 v0.3 신규 도입(CredentialVersion·closed schema 등)을 모두 다루는가
   - § 11 미결정 사항 분류와 § 11.4 잔여 리스크의 경계가 명확한가
   - § 13.5 CrmRecord의 `displayHintsCityName` CHECK가 "시·도·구·군 명만"이라 추상적 — DB CHECK로 구현 가능한가
   - acceptance test fixture와 § 10 build/runtime/migration fail이 대응되는가

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS3-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle2_response.md` (2차 지적)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
