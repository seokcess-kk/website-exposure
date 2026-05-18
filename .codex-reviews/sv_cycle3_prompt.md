# 자동 비평 의뢰 — `docs/features/search-visibility.md` v0.3 (3차 사이클)

## 컨텍스트

v0.2의 22개 지적 전건 수용 → v0.3. 주요 도입:
- DATA_MODEL C-08 SerpCrawlerApprovedScope 구조화 + legalApproved 조건식 정정
- 9 tables (SearchVisibilityCollectionRetryQueue 신설)
- 공통 retry taxonomy § 1.2.1
- analyticsCustomFieldAllowlist·query set 산출 표준 호출 + clusterBy 알고리즘
- exposureTrend EWMA·percentile 산식 closure (ewmaAlpha·baselineWindowDays·percentileLookbackDays 등)
- VisibilityState signal별 enum 표 + transition형 한정
- AnomalyRecord detectorOutput shape (signal별 필수 필드)
- outbox enqueue 조건 eventType 기반 shouldNotify 표
- monitor-only → alerting 모드 변경 retroactive 정책 (운영자 명시 액션)
- MonitoringLog 풀 스키마 (canonicalSignals·sourceConfigSnapshotHash·signalConfigSnapshotHash)
- blob isolation IAM 정책·signed URL 발급 검증
- normalizedAuthorityScore optional (SV-09 후속)
- backlinkChange providerSeriesSeparated=true 기본 + baselineWarmupPolls
- sitemap-derived universe 재산출 정책 (per-cycle·weekly·on-publish-event)
- build/runtime fail 룰 정정

## 의뢰

v0.3을 다시 엄정하게 비평하라. 2차 정정의 새 모순·잔재 빈틈 점검:

1. **v0.2 정정의 새 모순**:
   - `signals.exposureTrend` config의 `percentileLowCritical: 1`·`percentileLowWarning: 5`와 § 4.1 산식의 P1/P5/normal 정합
   - § 4.0 top-N 호출에 `query` dimension이 포함되는데 analytics-reporting `queryNormalizedMetrics` 측 source별 호환성 (gsc는 query 지원, naver-search-advisor도 query 지원, joinMode 의미 확인)
   - exposureTrend는 page 단위인데 query 단위로 분리한 정책과의 정합 (exposureTrend target = page, query set은 별도 universe로 사용?)
   - SearchVisibilityCollectionRetryQueue 신설 후 § 0 인벤토리 9 tables와 본문 일치

2. **법무 게이트 (SV2-01·02 정정 후)**:
   - DATA_MODEL C-08 SerpCrawlerApprovedScope 구조 — `allowLoginState`·`allowCaptchaBypass` boolean이 default 어떻게 되는지 (build fail vs 자동 false)
   - approvedScope.artifactRetentionDaysMax vs config.retentionDays.crawlerArtifact 검증 — § 11.1 build fail 룰의 비교 정확성

3. **detector + state 정합**:
   - § 6.1 VisibilityState 사용 분리표가 명확하지만, exposureTrend·backlinkChange의 anomaly가 streak hysteresis만으로 충분한지 (state 없이 anomaly suppress 윈도우만 사용)
   - unifiedRankingPresence는 VisibilityState 사용한다고 정의됐는데 enum에 `absent`·`unknown`이 있어 transition 흐름 명확화 필요

4. **outbox·운영 액션**:
   - § 3.1 `enqueueOutboxForExistingAnomalies(window, severity)` 권한·SLA·audit log 미정의
   - § 7.5 retroactive enqueue 시 sourceEventId 결정 규칙 (동일 anomaly에 새 outbox 만들면 sourceEventId 중복 위험)

5. **9 tables RetryQueue 통합**:
   - SearchVisibilityCollectionRetryQueue worker가 § 4.3 retry queue worker SoT 쿼리와 어떻게 매핑되는지 (analytics-reporting 패턴 재사용)
   - 본 큐의 attemptNumber 동시성 — analytics-reporting CollectionSourceAttempt와 동일 advisory lock 메커니즘 필요

6. **blob storage 운영 (SV2-16·17 정합)**:
   - `config.blobStorage.provider="s3"`·`bucket`·`keyPrefix` 외 인스턴스별 prefix는 worker가 append라고만 — IAM policy 예시 부재
   - blob signed URL TTL 기본 600초 운영 적합성 (대시보드 read 시 만료 발생 가능성)

7. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 (9 tables) 일관성
   - § 11 build fail 룰 다수 추가 — § 1.1 변경 정책 row와 정합
   - § 12 미결정 항목 분류 (SV-06a/SV-06b·SV-08·SV-09·SV-10) v1.0 도달 가능성

## 출력 형식

이전과 동일 JSON 스키마. 5차 마감 사이클이 가까우므로 `verdict` 또는 `status` 필드에 `closeableAfterPatch` 또는 `needs-fourth-cycle` 평가 포함 권장.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (대상 — v0.3)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
