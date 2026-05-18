# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.2 (2차 사이클)

## 컨텍스트

1차 비평(24 지적: blocking 9 + major 10 + minor 5) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.2 핵심 변경:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1: 4종 NotificationEventType cascade 완료
- REVIEW_WORKFLOW § 10.2.1: 9종 AuditAction cascade 완료
- DATA_MODEL C-08 v0.21: ContentMigrationConfig 신설·legalImpactClassifierRef·contentMigrationPolicyVersion
- policy-version-reevaluate batch contract (concurrencyLimit·rateLimit·cacheDedupe·reportingMode)
- schema-version-upgrade → application-data-version-upgrade로 좁힘 + DDL 책임 분리
- rollbackClass 3종 (reversible·compensating·irreversible) 강제
- dry-run/apply drift 6필드 CAS (planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest)
- legalImpactClassifier + 8 class
- read-only window writeClass 5종 표
- pause/resume/cancel state transition + cooperative cancellation
- retry exhausted vs autoRollbackOnFailure 우선순위 표
- idempotencyKey + requestFingerprint (crm-sync 패턴)
- routing-slug-preservation plan kind 추가 (6종)
- handoff boundary asset-ingestion vs DDL
- § 9 migration-time validation 분리
- DB 10 tables 인벤토리 (풀 schema는 v0.3 cycle에서 전개)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.2를 이전과 동일한 강도로 엄정하게 비평하라:

1. **1차 지적 재발 여부**: 24개가 실제로 정정됐는가? 표면만 바뀌고 본질이 남아있지 않은가?
2. **v0.2 신규 메커니즘의 모순·미진함**:
   - dry-run 6필드 CAS — 어떤 알고리즘으로 targetSetDigest·contentHashDigest를 산정하는가? 대량 row의 hash 계산 비용은?
   - rollbackClass=irreversible step + 자동 skip (§ 4.2 step 3) 의미 — runtime fail 후 운영자 수동? 자동 skip은 위험
   - legalImpactClassifier 8 class — 분류 알고리즘 (규칙 기반 vs LLM)·false negative 위험·class 추가/제거 정책
   - policy-version-reevaluate `reportingMode=stale-flags-only` vs `new-record-version` 선택 기준 — 운영상 어느 정책이 default인가?
   - read-only window 중 `notification-operational` 허용 — content-migration-run-completed 알림 자체가 emit되지만 inApp 발송이 운영자에게 즉시 전달되어야 하는가?
   - § 4.4 partial write 감지 알고리즘 — step별로 어떻게 감지? checksum? row count diff?
   - pause/resume 중 timeout·partial commit 추적 — running step이 cooperative cancellation 미지원이면?
3. **DB schema 풀 전개 (v0.3 예고지만 v0.2 검증)**:
   - § 12 10 tables가 인벤토리만 있고 schema 없음 — v0.2 단계에서도 핵심 unique·CAS·partial unique는 명시되어야 하지 않는가?
   - ContentMigrationStepRetryQueue·NotificationOutbox SQL이 search-visibility § 13.5·§ 13.10 패턴 동일이라는 참조만 — v1.0 후보 단계에서는 풀 SQL 전개 필요
4. **legal 게이트 강제력**:
   - legalImpactClassifier 분류 결과를 운영자가 무시할 수 있는가? `forceProceedDespiteWarnings`만으로 legal-reviewer 우회 가능?
   - classifierVersion mismatch 시 (apply 시점 분류기 업데이트 됐을 때) 어떻게 처리?
5. **이전 Feature 패턴 정합성**:
   - crm-sync v1.0의 CrmCredentialVersion partial unique 강제·CAS WHERE·closed schema·displayHints 패턴 재사용 정확성
   - asset-ingestion v1.0의 4상태 머신·body materialized view 패턴 적용
   - compliance-assistant v1.0의 cacheKey·durable cache 정확한 재사용
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 (10 tables) 일관성
   - § 1.1 변경 정책 표가 모든 v0.2 신규를 다루는가
   - § 3.1 command 11종 ↔ § 3.1.1 audit 9종 ↔ § 4.7 NotificationEvent 매핑 4종 정합
   - § 9.1-§ 9.5 fail/invariant ↔ § 6 지표 ↔ 향후 acceptance test traceability

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM2-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle1_response.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
