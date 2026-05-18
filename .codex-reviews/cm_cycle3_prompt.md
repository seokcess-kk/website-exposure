# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.3 (3차 사이클)

## 컨텍스트

2차 비평(23 지적: blocking 7 + major 11 + minor 5) 전건 수용. v0.3 핵심 변경:
- § 2.4 CAS digest 알고리즘 SoT — Merkle/chunked·snapshot fallback (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·requestFingerprint)
- irreversible 자동 skip 금지 — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep
- § 4.7 legalImpactClassifier deterministic rule SoT + LLM v1.0 금지 + fail-closed
- 8필드 CAS (6필드 + legalImpactClassificationDigest + classifierVersion)
- § 3.6 writeSetManifest partial write 감지 (expectedAffectedRows·beforeDigest·afterDigest·committedRowIds·invariantQueryResults)
- § 3.5 step type registry 최소 계약 + cooperativeCancellation 강제 + mutableFieldDenylist (body MV 보호)
- § 4.8 policyReevaluate defaultReportingMode=risk-based + LegalDocument·ReviewPolicy·priorReviewRequired·Critical은 new-record-version 강제
- § 4.5 writeClass 7종 세분화 (notification-emit-outbox·dispatch·read-receipt·digest-state 분리)
- § 3.1 command-audit-event 매핑 표 + 4종 AuditAction 본문 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered)
- § 3.4 idempotency unique scope 명시 + 8필드 fingerprint
- § 3.7 read API privacy class 표
- § 4.6 outbox SQL 자체 전개
- featureLegalApproved (Feature 활성화) vs ContentMigrationLegalApproval (plan-level) 분리
- § 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true
- § 3.1.1 AuditAction metadata 표 (actorRole·policy snapshot)
- § 6.2 INV-* invariant 매핑 (15종)
- § 12 10 tables 최소 constraints

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.3을 이전과 동일한 강도로 엄정하게 비평하라:

1. **2차 지적 재발 여부**: 23개가 실제로 정정됐는가?
2. **v0.3 신규 메커니즘 모순·미진함**:
   - 8필드 CAS — 운영 현실에서 모든 8필드를 매번 산정·전달 가능한가? UI/API client 부담?
   - writeSetManifest beforeDigest/afterDigest 산정 비용 (대량 row의 hash) — 대안?
   - legalImpactClassifier deterministic rule이 8 class를 모두 fail-closed로 닫을 수 있는가? rule input(PII 필드 카탈로그·targetEntityTypes)이 정확한가?
   - cooperativeCancellation 미지원 step + transactionBoundary != "per-chunk" → warning인데 fail이 되어야 하지 않나?
   - § 4.5 writeClass 7종에서 `notification-dispatch`가 read-only window 중 허용되지만, dispatch가 외부 채널 (email·slack·webhook) write를 트리거하는데 이게 안전한가?
   - cancellation-timeout-manual-review 상태 진입 후 복구 경로
   - policy-reevaluate `risk-based`에서 "Critical risk 상승" 판정 누구가 — compliance-assistant check() 응답에 risk 필드?
3. **DB 10 tables 최소 constraints 완결성**:
   - § 12.1-§ 12.10 각 테이블의 FK·CHECK·partial unique·CAS column이 운영상 충돌 없이 동시 실행 가능한가
   - ContentMigrationRun status enum 12종이 너무 많지 않은가
   - § 12.6 ContentMigrationStepRetryQueue worker SQL "v0.4에서 풀 전개" — v0.3에서도 핵심 SoT SQL은 명시되어야 함
4. **REVIEW_WORKFLOW cascade 부족 (CM2-12 잔여)**:
   - v0.3 § 3.1.1에 audit 13종 정의했지만 REVIEW_WORKFLOW § 10.2.1에는 9종만 cascade됨 — dry-run-completed·run-paused·run-resumed·run-failed·rollback-triggered 4종 cascade 필요
5. **이전 Feature와 패턴 정합성**:
   - crm-sync v1.0의 partial unique 3종(active·rotating-target·committed) 패턴 — ContentMigrationCredentialVersion 같은 신설 없는데 본 Feature의 ContentMigrationRun status에 비슷한 invariant가 필요한가?
   - asset-ingestion v1.0 body materialized view denylist 패턴 — 본 Feature § 3.5 mutableFieldDenylist 적정한가
   - compliance-assistant v1.0 cacheKey·durable cache — § 3.2.5·§ 4.8 정확한 재사용
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 일관성
   - § 1.1 SemVer 표가 v0.3 신규를 모두 다루는가
   - § 6.2 INV-* 15종과 § 9 fail/invariant 1:1 매핑 traceability 추가 필요?
   - 잔여 "v0.2 동일" 표현 (plan kind 6종·NotificationEventType·NotificationEvent 매핑·retry 우선순위 표)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM3-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle2_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
