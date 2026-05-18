{
  "verdict": "closeableAfterPatch",
  "readyForV1": false,
  "summary": "v0.5는 v1.0 직전 수준까지 수렴했지만, policy/version lineage, outbox retry SoT, REVIEW_WORKFLOW 잔재, legal calendar 산정 책임 경계에 아직 구현자가 갈라질 수 있는 지점이 남아 있다. 지적 8건을 반영하면 v1.0 안정판 마감 가능으로 판단한다.",
  "findings": [
    {
      "id": "AR5-01",
      "severity": "major",
      "category": "versioning-policy",
      "location": "docs/features/analytics-reporting.md:36-47, docs/features/analytics-reporting.md:832-845",
      "issue": "§ 11에서 build/runtime/warning 검증 체계를 새로 분리했지만 § 1.1 변경 정책에는 검증 룰의 추가·강화·완화가 MAJOR/MINOR/PATCH 중 어디인지 없다.",
      "impact": "analyticsPolicyVersion 누락, outbox worker 설정, rawPayloadStorage retention 같은 신규 build fail이 인스턴스 배포를 차단하는데도 버전 영향 기준이 없어 패키지 SemVer와 manifest opt-in 정책이 흔들린다.",
      "recommendation": "§ 1.1에 `build-time fail 조건 추가/강화`, `runtime validation fail 추가/강화`, `warning 추가`, `warning→fail 승격` 행을 추가하라. 권장: build/runtime fail 강화는 MAJOR, warning 추가는 PATCH 또는 MINOR, warning→fail 승격은 MAJOR."
    },
    {
      "id": "AR5-02",
      "severity": "major",
      "category": "idempotency",
      "location": "docs/features/analytics-reporting.md:237-241, docs/features/analytics-reporting.md:932",
      "issue": "manifestSnapshotVersion이 `analyticsConfig.sources enabled set + analyticsPolicyVersion`만 해시한다고 되어 있어 sourceConfigSnapshot 변경이 idempotencyKey 변경을 유발하는지 불명확하다.",
      "impact": "secretRef, GA4 propertyId, siteUrl, bucket strategy 등 source 설정이 바뀌어 실제 수집 대상이 달라져도 enabled set과 analyticsPolicyVersion이 같으면 같은 idempotencyKey로 충돌하거나 기존 CollectionLog lineage에 섞일 수 있다.",
      "recommendation": "manifestSnapshotVersion 산식에 `sourceConfigSnapshotVersion/hash`를 포함하라. 또는 sourceConfig 변경은 반드시 analyticsPolicyVersion bump 또는 별도 manifestSnapshotVersion bump를 요구한다고 명시하라."
    },
    {
      "id": "AR5-03",
      "severity": "major",
      "category": "retry-sot",
      "location": "docs/features/analytics-reporting.md:61-70, docs/features/analytics-reporting.md:190-193, docs/features/analytics-reporting.md:647-654, docs/features/analytics-reporting.md:727-740, docs/features/analytics-reporting.md:843-844",
      "issue": "3종 retry 구조의 maxAttempts SoT가 분산되어 있다. CollectionRetryQueue는 config에 `maxAttempts: 3`, 두 outbox는 SQL에 `attempts < 5` 하드코딩, § 11은 outbox worker maxAttempts 설정 누락을 build fail로 규정하지만 § 2.3에는 outbox maxAttempts 설정 슬롯이 없다.",
      "impact": "구현자는 outbox maxAttempts를 설정값으로 둘지 상수 5로 둘지 판단할 수 없고, build validation도 무엇을 검사해야 하는지 모호하다.",
      "recommendation": "§ 2.3에 `reportOutbox.maxAttempts`와 `mediaThresholdReassessmentOutbox.maxAttempts`를 추가하거나, § 11의 '설정 누락' 문구를 제거하고 `5`를 명시 상수로 고정하라. § 1.2.1에는 큐별 기본값 표를 추가하라."
    },
    {
      "id": "AR5-04",
      "severity": "major",
      "category": "retry-sql",
      "location": "docs/features/analytics-reporting.md:641-654, docs/features/analytics-reporting.md:719-740",
      "issue": "outbox claim SQL이 stale `claimed-pending` row를 재claim할 때 attempts 상한을 검사하지 않는다.",
      "impact": "`claimed-pending` 상태에서 worker가 반복 crash하면 attempts가 이미 5 이상이어도 계속 claim될 수 있다. 본문은 5회 초과 시 permanent라고 하지만 SQL SoT는 이를 보장하지 않는다.",
      "recommendation": "두 outbox SQL 모두 stale `claimed-pending` 조건에도 `attempts < maxAttempts`를 적용하고, `attempts >= maxAttempts` row를 `dispatch-failed-permanent`로 전이하는 reconcile step을 명시하라."
    },
    {
      "id": "AR5-05",
      "severity": "major",
      "category": "cross-doc-cascade",
      "location": "docs/admin/REVIEW_WORKFLOW.md:403-406, docs/admin/REVIEW_WORKFLOW.md:427-431, docs/features/analytics-reporting.md:710-712",
      "issue": "REVIEW_WORKFLOW § 8.1 본문에는 아직 `MediaThresholdAssessment`와 `mediaThresholdAssessment` 슬롯을 측정 데이터 참조·기록 대상으로 설명하는 v0.14 잔재가 남아 있다. § 8.1.1과 analytics-reporting v0.5는 rolling 값은 `mediaThresholdOperationalInput`, calendar 확정값은 `mediaThresholdAssessment`라고 분리한다.",
      "impact": "구현자가 § 8.1만 보고 rolling 측정값을 `mediaThresholdAssessment`에 저장할 수 있다. 이는 v0.15 cascade의 핵심 정정과 충돌한다.",
      "recommendation": "REVIEW_WORKFLOW § 8.1의 판정 기준과 결과 기록 문장을 v0.15 용어로 정정하라. 측정 입력은 `mediaThresholdOperationalInput`, 법무 확정 판정은 `mediaThresholdAssessment(calendarPolicy='previous-3-months-calendar')`로 명시."
    },
    {
      "id": "AR5-06",
      "severity": "major",
      "category": "legal-calendar-source",
      "location": "docs/features/analytics-reporting.md:710-744, docs/features/analytics-reporting.md:763-771, docs/admin/REVIEW_WORKFLOW.md:429-436",
      "issue": "legal 검수자가 previous-3-months-calendar 산정 시 어떤 데이터 소스를 쓰는지 구현 수준으로 닫혀 있지 않다. analytics-reporting은 '별도 DailyUserMeasurement aggregated 결과'라고만 하고, REVIEW_WORKFLOW는 legal 검수자가 채운다고만 한다.",
      "impact": "analytics-reporting이 calendar window용 DailyUserMeasurement를 생성·조회 API로 제공하는지, legal 검수자가 외부 산정값을 수동 입력하는지, rolling primarySource/botPolicy를 calendar에도 그대로 적용하는지 결정되지 않는다.",
      "recommendation": "§ 7.3.1 또는 § 8.2에 calendar 산정 입력을 추가하라. 최소한 `queryDailyUserMeasurements(calendarPolicy='previous-3-months-calendar')` 제공 여부, window 산식, primarySource/botFilteringPolicy 재사용 여부, 수동 override 허용 여부를 명시해야 한다."
    },
    {
      "id": "AR5-07",
      "severity": "major",
      "category": "data-model-consistency",
      "location": "docs/features/analytics-reporting.md:771, docs/admin/REVIEW_WORKFLOW.md:430, docs/core/DATA_MODEL.md:686-703",
      "issue": "analytics-reporting과 REVIEW_WORKFLOW가 `mediaThresholdAssessment.legalCounsel`·`legalCounselAt`을 언급하지만 DATA_MODEL C-10의 `MediaThresholdAssessment` 타입에는 해당 필드가 없다. `legalCounsel`과 `legalCounselAt`은 ComplianceRecord top-level 필드다.",
      "impact": "DB schema와 UI form binding이 갈라질 수 있다. 구현자가 nested field를 만들면 DATA_MODEL과 불일치하고, top-level에 쓰면 analytics-reporting § 8.2 문구와 불일치한다.",
      "recommendation": "모든 문서를 `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` + `mediaThresholdAssessment.legalBasisNote`로 정정하라. nested legalCounsel 필드를 의도했다면 DATA_MODEL C-10에 타입을 추가해야 한다."
    },
    {
      "id": "AR5-08",
      "severity": "minor",
      "category": "retention",
      "location": "docs/features/analytics-reporting.md:140-143, docs/features/analytics-reporting.md:562-574, docs/features/analytics-reporting.md:601-606, docs/features/analytics-reporting.md:1068-1083",
      "issue": "AnalyticsRedactionAudit은 모든 projection마다 생성되며 config에는 `rawRedactionAuditTrail: 1095`가 있지만, § 5.5의 purge 문장은 `retentionDays.raw`만 언급하고 § 14.11 테이블 정의에도 retention 기준 컬럼·purge 기준이 없다.",
      "impact": "rawPayloadStorage=false 인스턴스에서도 audit row가 대량 생성되는데, 보존·삭제 worker가 RawRecord 기준인지 AnalyticsRedactionAudit 기준인지 불명확하다.",
      "recommendation": "§ 5.5와 § 14.11에 `AnalyticsRedactionAudit.processedAt + retentionDays.rawRedactionAuditTrail` 기준 purge를 명시하라. § 11 build fail도 rawPayloadStorage 값과 무관하게 `rawRedactionAuditTrail` 필수로 바꾸는 편이 정합적이다."
    }
  ],
  "checks": {
    "v04FixRegression": "부분 회귀 있음: version policy, retry maxAttempts SoT, manifest idempotency trigger, redaction audit retention purge가 보강 필요.",
    "reviewWorkflowCascade": "핵심 § 8.1.1 흐름은 대체로 정합하나 § 8.1 본문 잔재와 legal calendar 데이터 소스가 남은 blocker다.",
    "standaloneImplementability": "대부분 단독 구현 가능하지만 calendar 산정 API/책임, outbox maxAttempts 설정, sourceConfigSnapshot lineage는 구현자가 임의 결정해야 한다.",
    "inventoryConsistency": "§ 0과 § 10.1 및 § 14의 12 tables 인벤토리는 일관적이다.",
    "unresolvedItems": "AR-01~AR-08은 M2+/M3+/운영/인프라 후속으로 적절히 분류되어 v1.0 blocker는 아니다.",
    "buildRuntimeWarning": "§ 11 자체는 신규 사유를 포함하지만, § 1.1 변경 정책 및 outbox 설정 슬롯과 맞물리는 정합성 보강이 필요하다."
  },
  "recommendedDisposition": "8건 패치 후 v1.0 승격 가능. 재검토 시에는 AR5-02, AR5-03, AR5-05, AR5-06, AR5-07만 blocker로 재확인하면 충분하다."
}