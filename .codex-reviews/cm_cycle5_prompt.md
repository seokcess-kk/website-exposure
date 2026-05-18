# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.5 (5차 사이클)

## 컨텍스트

4차 비평(14 지적) 전건 수용. v0.5 핵심:
- ApplyPreflightToken opaque + dryRunReportId explicit lookup (CM4-01)
- digestComputationMode 3종 (full·snapshot·cache) + invalidationInputs (CM4-02)
- append-only-watermark concurrency 강화 (lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode) (CM4-03)
- Run status 3축 transition matrix + DB CHECK invariant (CM4-04). partial-rollback은 별도 primaryStatus 아님
- markStepCompensated·abortRun v1.0 정식 command + REVIEW_WORKFLOW cascade 추가 (CM4-05)
- ContentMigrationActiveTargetLock § 12.11 신설 (CM4-06·07)
- legalEntityChanged 분해 → legalSensitiveEntityChanged + legalEntityIdentityChanged (CM4-08)
- 인벤토리 11 tables (CM4-09)
- PII export DB CHECK SQL canonical (CM4-10)
- SkipStepInput.rollbackClass 제거 (CM4-11)
- § 6.3 fixture matrix 28 INV × happy + violation (CM4-12)
- dispatchAllowlistPolicySnapshot drift 방지 (CM4-13)
- § 1.1 SemVer 4행 추가 (CM4-14)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.5를 v1.0 안정판 후보로서 엄정하게 비평하라:

1. **4차 지적 재발 여부**: 14개 지적이 실제로 정정됐는가?
2. **v0.5 신규 메커니즘 모순**:
   - REVIEW_WORKFLOW cascade가 `step-compensated`·`run-aborted` AuditAction 2종 추가됐는데 § 9.1.1 매트릭스에는 NotificationEvent 미정의 — 운영 SLA에서 어떻게 처리?
   - § 4.3.2 3축 invariant DB CHECK 표현이 PostgreSQL CASE 문법인데 모든 transition을 포함하지 못함 (cancelled+failed에 rollbackOutcome IN 허용 등)
   - ActiveTargetLock writeSetScopeDigest 산정 — step별 writeSetProjection canonical hash인데 dry-run 시점과 apply 시점 step 변경 가능성?
   - § 12.9.1 embedded child 명시했지만 § 12.9 PolicyReevaluateBatch row 1개당 N record 어떻게 저장? JSON column 또는 별도 table?
3. **누락 cascade**:
   - REVIEW_WORKFLOW § 9.1·§ 10.2.1에 `step-compensated`·`run-aborted` 추가 확인 (방금 본 cycle에서 cascade는 했음 — 확인)
   - § 9.1.1 매트릭스에 `step-compensated`·`run-aborted` 이벤트 추가 필요?
4. **stand-alone readiness**:
   - § 1.1·§ 2.4·§ 3.x·§ 4.x·§ 6.x·§ 9.x·§ 12.x가 단일 문서 SoT로 v1.0 구현 가능한가?
5. **v1.0 안정판 기준**:
   - blocking 0개?
   - SoT cascade 동기화 완료?
   - 의료법·개인정보보호법 운영 가능?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM5-`. **v1.0 안정판 후보로 판정 가능하면 verdict="ready_for_v1_0"** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.5)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle4_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
