# 자동 비평 의뢰 — `docs/features/search-visibility.md` v0.2 (2차 사이클)

## 컨텍스트

v0.1의 20개 지적 전건 수용 → v0.2. 주요 도입:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade — 5종 신규 이벤트 enum·매트릭스
- DATA_MODEL C-08 v0.16 cascade — searchVisibilityConfig + searchVisibilityPolicyVersion + serpCrawler.legalApproved fail-gate
- queryDailyUserMeasurements 의존 제거, queryNormalizedMetrics만 사용
- exposureTrend는 EWMA·percentile, AI citation은 state transition, unified ranking은 rank bucket, backlink는 weekly delta — 신호별 detector 분리
- VisibilityState 신설 (state transition 추적)
- AnomalyNotificationOutbox 패턴 (notifications outbox 동일)
- VisibilitySignalSnapshot targetKind/targetId 분리
- AnomalyRecord resolutionStatus 5종 (open·true-positive·false-positive·resolved·ignored)
- SerpCrawlerArtifact 인스턴스 격리 + parserVersion + blockReason + signed URL
- BacklinkSnapshot provider metric 정규화 (providerMetricName·providerMetricValue·normalizedAuthorityScore)
- mode="alerting" vs "monitor-only" 분리
- query set 자동 산출 (analytics-derived cluster — keyword-monitoring 책임 경계 분리)
- SEARCH_STANDARDIZATION cascade § 3·§ 4·§ 5 입력 사용
- build/runtime/warning 3분리 (analytics-reporting 패턴)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` v0.2를 다시 엄정하게 비평하라. 1차 정정의 새 모순과 잔재 빈틈 점검:

1. **v0.1 정정의 새 모순**:
   - § 7.2 outbox 패턴이 § 13.8 AnomalyNotificationOutbox 스키마와 정합
   - § 3.2 idempotencyKey 산정에 canonicalSignals 추가됐는데 § 13.3 MonitoringLog가 analytics-reporting 패턴 동일 참조 — canonicalSignals 컬럼 별도 필요 여부
   - § 4.1 exposureTrend EWMA + percentile 알고리즘 — config에 `ewma-percentile`이라고만 있고 EWMA α값·percentile band 결합 방식 불명확
   - § 4.2 aiBriefingCitation state machine과 § 13.5 VisibilityState.currentState 매핑 (signal별 enum이 어떻게 정의되는지)
   - § 4.3 unifiedRankingPresence bucket transition이 AnomalyRecord 저장과 어떻게 연결되는지

2. **법무 게이트 정합 (F-8 critical 정정 후)**:
   - DATA_MODEL C-08 SearchVisibilityConfig의 serpCrawler.legalApproved/legalApprovedBy/legalApprovedAt 정의가 본 문서 § 11.1 build fail과 정합
   - approvedScope 자유 텍스트가 운영 시 실제 권한 범위 제한에 어떻게 적용되는지

3. **query set 자동 산출 (F-10 정정)**:
   - § 4.0 query set kind=analytics-derived 시 analytics-reporting의 어떤 dimension·metric을 어떻게 호출해 top-N 산출하는지
   - cluster by page 시 query → page mapping이 어떻게 산출되는지 (GSC 데이터에서 query별 top landing page?)
   - sitemap-derived는 SEARCH_STANDARDIZATION § 4 sitemap.xml 파싱 — 동적 sitemap 변경 시 query set 재산출 주기 미정의

4. **detector·state 정합**:
   - § 6.1 detector 표가 § 13.5 VisibilityState의 currentState enum 정의를 signal별로 어떻게 매핑하는지
   - exposureTrend는 AnomalyRecord만 사용 (state 미사용)인데 § 13.5 VisibilityState는 exposureTrend도 적용 가능한가
   - aiBriefingCitation `unknown → present → missing` 외 backlinkChange는 state machine 없는 이유 (단순 delta detector이므로) — 일관성 명시 필요

5. **AnomalyNotificationOutbox 정합**:
   - § 13.8 UNIQUE(anomalyRecordId) — anomaly 1건당 outbox 1건만. 그러나 § 7.4 monitor-only 모드는 outbox row 미생성. mode 변경 시 일관성?
   - § 7.2 SQL의 dispatch-failed-permanent 전이가 analytics-reporting AnomalyDispatchOutbox 패턴과 동일하지만 본 Feature 자체의 5회 한도가 적절한지

6. **MonitoringLog·MonitoringSourceAttempt analytics-reporting 패턴 참조**:
   - § 13.3가 "analytics-reporting § 14.3·14.4 참조" 한 줄로 처리됐는데 본 Feature 고유 필드(canonicalSignals 등) 명시 부재
   - retry queue 패턴이 본 Feature에도 적용되는지 — analytics-reporting과 별도 CollectionRetryQueue 신설 필요 여부

7. **SerpCrawlerArtifact·blob 운영**:
   - blob storage 인프라 결정 (S3·GCS·Azure Blob) — SV-06 미결정 + 인스턴스 격리 prefix가 어떻게 enforced되는지
   - signed URL TTL 기본 600초의 운영 적합성
   - parserVersion 변경 시 기존 artifact backfill 정책 부재

8. **backlink provider metric 정규화 (F-18)**:
   - normalizedAuthorityScore 변환 함수가 SV-09 미결정 — v1.0 마감 가능한가? (v1.0 도달 시 patch release로 추후 추가 가능)
   - provider 변경 시 baseline reset (SV-10) — series 분리 정책

9. **mode="alerting" vs "monitor-only" 정합**:
   - § 10.2 mode 분리가 § 7.4 monitor-only 동작·§ 11.1 build fail "mode=alerting + notifications 비활성"과 정합
   - mode 변경(monitor-only → alerting) 시 기존 AnomalyRecord에 retroactive outbox 생성 여부 미정의

10. **명세 자체의 정합성·문구**:
    - § 0 한 페이지 요약 ↔ § 13 인벤토리 (8 tables) 일관성
    - § 1.1 변경 정책 ↔ 다른 절 실제 변경 영향

## 출력 형식

이전과 동일 JSON 스키마.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (대상 — v0.2)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
