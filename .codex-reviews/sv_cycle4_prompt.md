# 자동 비평 의뢰 — `docs/features/search-visibility.md` v0.4 (4차 사이클)

## 컨텍스트

v0.3의 10개 지적 전건 수용 → v0.4. 3차 cycle codex 평가: `closeableAfterPatch` + `needs-fourth-cycle`. 4차에서 마감 후보 점검.

이번 cycle 주요 도입:
- exposureTrend score 산식 + actualPercentile/thresholdPercentile detectorOutput
- exposureTrend target aggregation SoT (page = SUM impressions over universe / site-overall = 전체)
- SerpCrawlerApprovedScope boolean optional + default false (DATA_MODEL cascade)
- crawlerArtifact retention 평가 순서 (serpCrawler.enabled=false 시 skip)
- SearchVisibilityCollectionRetryQueue worker SoT SQL (SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant)
- retroactive outbox command — super-admin/operations 권한·dryRun·sourceEventId hash·audit cascade SV-13
- unifiedRankingPresence state transition 6종 전이 표
- anomaly suppression ledger (exposureTrend·backlinkChange)
- blob isolation IAM·S3 condition 예시·signed URL refresh SV-14
- SV-10 해소·SV-06b 부분 분리·SV-13·SV-14 신규

## 의뢰

v0.4를 다시 엄정하게 비평하라. 3차 정정의 새 모순과 5차 마감 점검:

1. **v0.3 정정의 새 모순**:
   - exposureTrend `target=page`이지만 `query universe`가 SERP crawler용 monitored set만으로 정의 — analytics-derived 호출에서 query dimension이 여전히 사용되는데 target=page와의 정합성 (query→page mapping은 monitored universe 산출용, exposureTrend는 page 단위 별도 호출?)
   - SerpCrawlerApprovedScope allowLoginState/allowCaptchaBypass는 optional + default false인데 `allowCaptchaBypass===true` build fail이 있음 — true 설정 가능하지만 fail (모순 없음 확인)
   - unifiedRankingPresence state transition 표에서 `unknown → bucket:*` 첫 관측은 info severity로 outbox 미enqueue. 그러나 `ai-briefing-citation-first-detected`는 매트릭스에서 outbox enqueue 됨 — 둘이 다른 정책 운영 이유 명세 부재

2. **retroactive outbox command 정합**:
   - sourceEventId hash가 `anomalyRecordId + eventType + searchVisibilityPolicyVersion` 포함인데 policyVersion 변경 시 동일 anomaly 재발송 가능 (의도된 동작인가)
   - audit cascade SV-13이 REVIEW_WORKFLOW § 10.2.1 추가 필요 — 본 cycle에서 cascade해야 마감 가능

3. **anomaly suppression ledger 정합**:
   - state machine 미사용 signal (exposureTrend·backlinkChange) suppression key에 `severity`가 포함되는데 동일 anomaly가 시간 경과로 severity 변동(warning → critical) 시 새 anomaly로 처리되는지 (key가 다르면 별개)
   - resolutionStatus="open" 조건 — operator가 false-positive로 분류한 후에는 suppression 해제. 다시 발생 시 새 anomaly 생성 정상 동작

4. **blob IAM 구체화**:
   - PrincipalTag 기반 IAM은 AWS 전용. Azure Blob/GCS 변환 정책 부재 — SV-06b 미결정 유지 명시 필요
   - signed URL refresh client SDK가 SV-14로 별도 미결정 — v1.0 도달 가능한가 (대시보드 UX 영향이지만 본 명세 핵심 아님)

5. **5차 마감 가능성 점검**:
   - v1.0 도달 직전 안정성 — 모든 fail 룰·신호별 detector·outbox 정합
   - 잔류 미결정 (SV-01~14) 분류 — 모두 운영·인프라·v1.x 후속으로 적절히 분리
   - cascade 동반 변경 (DATA_MODEL C-08·REVIEW_WORKFLOW § 9.1·§ 9.1.1) 정합
   - status 평가에 `readyForV1` 또는 `closeableAfterPatch` 포함 권장

## 출력 형식

이전과 동일 JSON 스키마.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (v0.4)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
