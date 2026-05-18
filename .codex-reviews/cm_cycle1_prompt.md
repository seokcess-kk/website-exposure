# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.1 (1차 사이클)

## 컨텍스트

이전에 compliance-assistant·notifications·analytics-reporting·search-visibility·keyword-monitoring·asset-ingestion·crm-sync 7 Feature가 각각 5~7 사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 **8번째 (마지막)** Feature `content-migration`의 v0.1 초안 1차 사이클.

본 Feature는 **솔루션 내부** 콘텐츠·데이터 마이그레이션:
- migration plan kind 5종: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
- 모드: dry-run / apply
- step별 reverse-step 정의 시 rollback 지원
- legal-reviewer 승인 게이트 (instance-to-instance-copy는 PII 이동 가능)
- read-only window 운영
- compliance-assistant 재호출 (policy-version-reevaluate)

특징:
- application-level data migration (DB DDL은 인프라 책임)
- 영향 큼 — dry-run 강제·legal 게이트·rollback 가능성 필수
- asset-ingestion(외부 → 솔루션)과 경계 명확 — 본 Feature는 솔루션 내부

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.1을 엄정하게 비평하라:

1. **SoT 정합**:
   - notifications v1.0 notify() + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 4종 이벤트)
   - REVIEW_WORKFLOW § 10.2.1 AuditAction cascade (6종)
   - DATA_MODEL C-08 cascade — `contentMigrationConfig`·`contentMigrationPolicyVersion`
   - compliance-assistant § 3.1 check() 호출 — policy-version-reevaluate 시 대량 호출 부하·dedupe

2. **migration plan kind 5종 적정성**:
   - 5종이 운영상 실제 필요한 모든 케이스를 커버하는가?
   - asset-ingestion과 경계가 충분히 명확한가?
   - DB DDL과 application data migration 경계는?

3. **rollback·dry-run·legal 게이트**:
   - reverse-step 강제·검증·실패 처리
   - dry-run 결과와 실제 apply 결과 차이 처리 (CAS expectedDryRunReportId만으로 충분?)
   - legal 게이트가 어떤 planKind에 필요한가? PII 이동 외에도?

4. **운영 안전성**:
   - read-only window 중 다른 Feature 운영 영향
   - 진행 중 pause/resume/cancel의 trade-off
   - retry exhausted 시 자동 pause vs 자동 rollback

5. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 9 인벤토리 (9 tables) 일관성
   - § 1.1 변경 정책 cascade 컬럼 ↔ 실제 변경 영향
   - 미결정 (CM-01~CM-08) 분류
   - 다른 Feature와 패턴 정합 (DTO·DB schema·outbox·retry queue)

6. **이전 Feature와 패턴 정합성**:
   - crm-sync DB CHECK·partial unique·CAS·closed schema 패턴 재사용 정확성
   - notifications outbox·idempotency 패턴
   - compliance-assistant Feature contentType 예외 cascade 필요 여부

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (경계 비교)
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (패턴 참고)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
