# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.2 (2차 사이클)

## 컨텍스트

1차 사이클(21개 지적) 전건 수용 후 v0.2로 전면 재작성. 주요 cascade:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1·§ 10.2.1: 4종 NotificationEventType + 4종 AuditAction 완료
- DATA_MODEL C-08 v0.19: CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion 추가
- ReservationPage/CTAConfig 경계 정리: 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent (CONTENT_STANDARDS 후속 cascade — CS-15 신규)
- provider 3종 한정 (salesforce·hubspot·generic-rest-api). korean-emr build fail
- entity 4종 (appointment v1.x — CS-12 deferred)
- raw PII 저장 금지 강제 (rawPiiStorageAllowed=false build fail) — displayHints만
- RRN deny v1.0 강제 + asset-ingestion § 9.1 checksum 재사용
- ProviderWebhookVerifier 인터페이스 + CrmWebhookNonceLedger (replay 방지)
- field-level FieldAuthority enum + CAS·clock skew·tie-breaker·appliedVersion
- credential rotation 상태 머신 (stable·rotating·committed·reverted + grace period)
- DPA vs patient consent 분리 (dpaEvidenceRef·patientConsentEvidenceRef)
- 미결정 3분류 (open/deferred-v1.x/resolved-in-v1.0)
- audit log contract + credential fingerprint (HMAC non-reversible)
- DB 10 tables (Integration·SyncLog·SourceAttempt·RetryQueue·Record·RecordChangeLog·FieldMapping·ConflictRecord·CredentialAuditLog·RateLimitState·WebhookNonceLedger·NotificationOutbox)
- acceptance test fixture (CS1-21)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.2를 이전과 동일한 강도로 엄정하게 비평하라:

1. **1차 지적 재발 여부**: 21개 지적이 실제로 정정됐는가? 표면만 바뀌고 본질은 남아있지 않은가?

2. **신규 도입 메커니즘의 모순·미진함**:
   - ProviderWebhookVerifier 인터페이스 — provider별 차이(Salesforce Outbound Messages SOAP/XML vs HubSpot v3 vs generic) 추상화 누수
   - CrmWebhookNonceLedger replay 윈도우와 timestampTolerance·retention의 정합성
   - field-level FieldAuthority + CAS의 race condition·tie-breaker manual escalate 트리거 정확성
   - credential rotation 상태 머신 grace period 동시성 (rotating 중 outbound·inbound 동작)
   - rawPiiStorageAllowed=false 강제 시 PII Redaction Validator 구현 가능성·drift 감지 신뢰성
   - liveReadCrmDetail의 audit cascade가 v1.x deferred(CS-14)인데 v1.0에서 운영 가능한가
   - RRN deny — payload 폐기·fingerprint 보존 — 잘못된 false positive 시 운영자 복구 경로

3. **mode 분리 (outbound-only) 일관성**:
   - 모든 command/event/error matrix에서 outbound-only가 제대로 차단되는가
   - conflictResolution=outbound-only-no-conflict 외 값 build fail 정확성
   - inbound runSync/processInboundWebhook 차단의 HTTP 404 vs runtime error 일관성

4. **DB 10 tables 완결성**:
   - 모든 FK·UNIQUE·INDEX·partial unique 누락 없는가
   - retention 필드(expiresAt) cascade 일관성 — purge worker SoT가 본 Feature와 다른 Feature(notifications·analytics-reporting)와 충돌하지 않는가
   - CrmRecord.displayHints만으로 운영자 화면이 충분한 정보를 제공하는가 (UX trade-off)

5. **이전 Feature와의 패턴 정합성**:
   - asset-ingestion AssetPromotionRecord 4-state machine과 본 Feature credential rotation state machine 패턴 일관성
   - search-visibility/keyword-monitoring outbox SQL 재사용 정확성
   - DATA_MODEL § 2.2 `@provenanceAssetId` 같은 공통 메타가 CS-18에서 v1.x deferred로 처리됐는데, 본 Feature inbound CrmRecord에 `@provenanceCrmRecordId` 같은 필드가 v1.0에 필요한가

6. **운영 SLA·acceptance test fixture**:
   - § 8.2 acceptance test 6항목으로 v1.0 회귀 방지가 충분한가
   - § 4.5 credential rotation의 rotationGracePeriodMinutes(30분) 기본값이 운영 현실에 맞는가
   - § 11 미결정 3분류의 v1.x deferred 항목들이 v1.0 운영 차단 요인 아닌가

7. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 10 tables 일관성
   - § 6.1 NotificationEventType 4종 ↔ § 13.11 outbox `UNIQUE(sourceKind, sourceId, eventType)` 정합
   - § 7.1 PII Redaction Validator·§ 13.5 CrmRecord PII 필드 금지 cross-check
   - § 3.1.1 audit log contract 4행 ↔ REVIEW_WORKFLOW § 10.2.1 cascade 정합

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS2-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle1_response.md` (1차 지적)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
