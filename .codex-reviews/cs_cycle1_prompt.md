# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.1

## 컨텍스트

이전에 compliance-assistant·notifications·analytics-reporting·search-visibility·keyword-monitoring·asset-ingestion 6 Feature가 각각 5사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 7번째 Feature `crm-sync`의 v0.1 초안 1차 사이클.

본 Feature는 클라이언트 의료기관 CRM·환자관리 시스템과 솔루션 사이의 양방향 데이터 동기화. provider 4종(salesforce·hubspot·generic-rest-api·korean-emr v1.x), entity 5종(reservation·contact·inquiry·conversion-event·appointment v1.x), 운영 모드 2종, 충돌 해결 5종.

특징:
- 외부 시스템 의존 (8 Feature 중 외부 의존도 최대)
- 의료법·개인정보보호법 PII 처리 (특히 한국 RRN)
- webhook(실시간) + polling(배치) 두 가지
- 충돌 해결 (양방향 sync)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.1을 엄정하게 비평하라:

1. **SoT 정합**:
   - notifications v1.0 notify() + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 4종 이벤트 추가)
   - REVIEW_WORKFLOW § 10.2.1 AuditAction cascade (4종)
   - DATA_MODEL C-08 v0.19 cascade — `crmSyncConfig`·`crmSyncPolicyVersion`
   - DATA_MODEL CT-03 CTAConfig·C-20 ReservationPage — sync 대상 호환성

2. **외부 시스템 연동 안정성**:
   - provider 어댑터 4종 (Salesforce·HubSpot·generic-rest-api·korean-emr) 추상화 정합
   - webhook signature 검증·replay 방지 + provider별 차이 처리
   - OAuth refresh token rotation (Salesforce)·API Key 갱신
   - rate limit per provider·quota 운영
   - bi-directional vs outbound-only 모드 분리

3. **PII·의료법 도메인**:
   - 최소 저장 원칙 (minimalRetention) — displayHints 마스킹·raw PII는 CRM 측 책임
   - RRN deny 정책 (v1.0 강제·CS-01)
   - DPA (Data Processing Agreement)·legalApproved·consentEvidenceRef 게이트
   - asset-ingestion § 9.1 RRN checksum 알고리즘 재사용 정합

4. **충돌 해결**:
   - entity별 conflictResolution 5종 (last-write-wins·crm-authoritative·solution-authoritative·outbound-only-no-conflict·manual)
   - field-level solutionSideAuthoritative
   - CrmConflictRecord 운영자 검수 큐·SLA 7일

5. **운영 안정성**:
   - retry queue maxAttempts 5회·backoff 1m→5m→30m→2h→6h
   - credential rotation·만료 알림 (warnDaysBeforeExpiry 14일)
   - reconcile worker·invariant
   - sync log·change log retention (730·1095일)

6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 (10 tables) 일관성
   - § 1.1 변경 정책 cascade 컬럼 ↔ 실제 변경 영향
   - 미결정 (CS-01~CS-13) 분류

7. **이전 Feature와 패턴 정합**:
   - asset-ingestion·search-visibility·keyword-monitoring의 outbox·retry queue·legal gate 패턴 재사용 정확성
   - DATA_MODEL § 2.2 `@provenanceAssetId` 같은 공통 메타 cascade 필요 여부

## 출력 형식

이전과 동일 JSON 스키마.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (패턴 차용)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
