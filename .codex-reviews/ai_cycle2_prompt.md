# 자동 비평 의뢰 — `docs/features/asset-ingestion.md` v0.2 (2차 사이클)

## 컨텍스트

v0.1의 22개 지적 전건 수용 → v0.2. 주요 cascade·도입:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1 — 5종 NotificationEventType + 매트릭스 5행 (PII critical·bypass)
- REVIEW_WORKFLOW § 10.2.1 — 5종 AuditAction + § 3.1.1 contract 표
- DATA_MODEL C-08 v0.18 — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설
- compliance-assistant check() 입력 정확화 (contentType="Feature"·featureContentType·body·metadata)
- promote closed union TargetMapping + Core 계약 필수 필드 검증
- promote 흐름 — Core row + ComplianceRecord pre-publish + review-queued 진입
- autoApproveRiskLevel·auto-promote v1.0 null 강제
- AssetIngestionApprovedScope 별도 정의 (SerpCrawler SERP 필드 제거·자산 특화)
- webCrawl·snsApi 법무 게이트 build fail
- rrn 정밀화 (checksum 검증)
- AssetPiiFinding 테이블 신설 (10 → 11 tables)
- promote 게이트 — rightsReview·PII 처리·증빙
- content-migration 경계 명시 (promote는 본 Feature)
- contentHash canonicalization (rawBlobHash·normalizedTextHash·sourceCanonicalKey)
- AssetIngestionNotificationOutbox sourceKind/sourceId 구체화

## 의뢰

v0.2를 다시 엄정하게 비평하라. 1차 정정의 새 모순·잔재 빈틈:

1. **v0.1 정정의 새 모순**:
   - § 6.2 compliance-assistant check() 호출 — contentType="Feature" + featureContentType="feature:asset-ingestion" 사용은 DATA_MODEL C-10 v0.5 `Feature` enum 정합인지
   - § 8 promote 흐름 — 단일 transaction에 Core row + AssetPromotionRecord + ComplianceRecord + state="review-queued" 묶음의 트랜잭션 안정성
   - § 7.2 promote 게이트 — `RightsReviewRecord` 신설 대신 `AssetReviewRecord.rightsReview` 객체 필드. 충분한지·별도 테이블 필요한지
   - closed union TargetMapping — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 5종만 v1.0 지원. 다른 contentType(예: ReviewPolicy·PricingPage·LocationProfile)은 promote 불가 명시 부재

2. **PII 처리 정합**:
   - § 9.1 RRN checksum 검증 알고리즘 명시 (한국 주민등록번호 체크 디지트 공식)
   - § 16.7 AssetPiiFinding `detector` enum (regex·checksum·llm·manual) — LLM 활성화 시 호출 흐름·prompt·permission 정합
   - PII raw blob `raw/` prefix legal 검수자만 read — search-visibility § 13.7 패턴 적용 정합

3. **법무 게이트 정합**:
   - AssetIngestionApprovedScope vs SerpCrawlerApprovedScope — search-visibility와 cross-Feature drift 방지 (canonical enum SoT 정합)
   - SNS API `approvedAccountIds` runtime 검증 — 크롤링 결과 account가 허용 목록 외인지 (manual-upload·csv-import는 무관)

4. **알림·outbox 정합**:
   - PII critical event — quietHours bypass·optOutPolicy mandatory. 새벽 발생 시도 즉시 발송 정합
   - outbox sourceKind 3종 (ingestion-log·asset·pii-finding) — § 10.3 매핑 표와 정합
   - notifications 비활성 build fail (§ 13.1) — monitor-only 모드 별도 정의 부재

5. **promote 흐름의 트랜잭션·실패 처리**:
   - § 8.2 단일 transaction이 4종 작업(Core row + AssetPromotionRecord + check() 호출 + ComplianceRecord) 묶음. check()가 외부 LLM 호출 포함 시 transaction 길어짐 — 외부 호출은 transaction 밖 정합
   - promote 실패 시 Core row rollback 정합

6. **cascade 정합 (외부 문서)**:
   - REVIEW_WORKFLOW § 9.1 enum 5종 추가 검증
   - § 9.1.1 매트릭스 5행 검증
   - § 10.2.1 audit 5종 검증
   - DATA_MODEL C-08 v0.18 검증

7. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 16 인벤토리 (11 tables) 일관성
   - § 1.1 변경 정책 cascade 컬럼 ↔ 실제 변경 영향
   - 미결정 분류 (AI-01~AI-16)

## 출력 형식

이전과 동일 JSON 스키마.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (v0.2)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
