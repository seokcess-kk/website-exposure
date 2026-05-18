# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.4 (4차 사이클)

## 컨텍스트

3차 비평(21 지적) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.4 핵심:
- REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered) — canonical name
- DATA_MODEL C-08 v0.22: featureLegalApproved rename + piiFieldCatalogRef·entityFieldProjectionCatalogRef
- cooperativeCancellation 미지원 + non-per-chunk → validate fail로 승격
- cancellation-timeout-manual-review 허용 command 표 (rollbackRun·skipStep·markStepCompensated·abortRun)
- read-only window notification-dispatch dispatchAllowlist (high/critical operational만)
- PolicyReevaluateResult 타입 (previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingMode)
- § 12 executable schema 10 tables 풀 schema
- § 12.6 StepRetryQueue worker SQL 자체 전개
- ApplyPreflightToken § 3.5 — server-side 8필드 CAS (ETag 스타일)
- writeSetManifest strategy 4종 분기 (small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform)
- Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해
- active run partial unique
- LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash
- NotificationOutbox SQL nextAttemptAt·attempts·exhausted
- stale-flags-only override CHECK (maxRiskLevel=low + no legal/priorReview change)
- v0.2 동일 잔재 풀 전개
- § 6.2 INV ↔ § 9 fail rule 1:1 traceability + § 6.3 happy path fixture
- § 1.1 SemVer catalog 3행 추가
- § 3.1.1 AuditAction metadata 공통 required (actorId·actorRole·idempotencyKey·requestFingerprint)
- § 3.8 StepResultRow closed schema

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.4를 이전과 동일한 강도로 엄정하게 비평하라:

1. **3차 지적 재발 여부**: 21개 지적이 실제로 정정됐는가?
2. **v0.4 신규 메커니즘 모순·미진함**:
   - ApplyPreflightToken — 8필드 재계산이 매번 발생하면 apply 시점 비용 우려. 또는 cache로 처리? legalImpactClassificationDigest와 classifierVersion이 변경되면 server에서 어떻게 감지?
   - writeSetManifest strategy 4종 — append-only-watermark가 watermark 역행 검사로 충분한가? 동시 삽입은?
   - Run status substate 분해 — primaryStatus·remediationStatus·rollbackOutcome 3축이 모든 transition을 닫는가? § 4.3 표가 모든 조합을 다루지 않음
   - cancellation-timeout-manual-review 허용 command 4종 중 markStepCompensated·abortRun은 § 3.1 command 목록에 없음
   - § 12.4 active run partial unique가 동시 dry-run + apply 충돌도 막는가? dry-run은 active run 정의에 포함 안 됨
   - § 4.8 stale-flags-only override CHECK 조건 — maxRiskLevel=low + no legal entity change + no priorReview change. 그런데 legalEntityChanged는 어떻게 정의? `LegalDocument·ReviewPolicy·PricingPage 영향`이 정확한가?
   - § 12.5 StepResultRow CHECK `containsPii = true → export_allowed = false` — application validator인지 DB CHECK인지
3. **DB 10 tables executable schema 완결성**:
   - § 12.1-§ 12.10 schema가 모든 FK·CHECK·partial unique·CAS를 다루는가
   - § 12.4 ContentMigrationRun.expectedLegalApprovalId FK는 legalGateRequired=false일 때 null 허용 — 정합한가
   - § 12.5 status enum에 skipped 포함되었지만 § 9 invariant에서 skipped 처리 path 명확한가
4. **traceability**:
   - § 6.2 INV 23종 ↔ § 9 rule 매핑이 빠진 항목 (예: INV-CATALOG-VALIDATION은 § 9.3에 있지만 § 6.2 표에 매핑됨)
   - § 6.3 fixture violation path가 v0.5 미루어진 영역 — v1.0 후보로서 충분한가?
5. **이전 Feature 패턴 정합성**:
   - crm-sync v1.0 partial unique 3종(active·rotating-target·committed) 패턴 — content-migration의 ContentMigrationRun primaryStatus 다중 active 방지가 정확히 같은 패턴인가
   - asset-ingestion body MV denylist 패턴 적용 정확성
   - notifications outbox SQL 패턴 (nextAttemptAt·attempts·exhausted) 일관성
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 일관성
   - § 1.1 SemVer가 v0.4 신규 (Run status substate·ApplyPreflightToken·writeSetManifest strategy) 모두 다루는가
   - § 4.3 state transition 표 + § 12.4 status enum 정합
   - "v0.3 동일·v0.2 § X 동일" 잔재 (있다면)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM4-`. v1.0 후보 판정 가능하면 `ready_for_v1_0=true`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.4)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle3_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
