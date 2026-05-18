# 자동 비평 의뢰 — `docs/features/asset-ingestion.md` v0.1

## 컨텍스트

이전에 compliance-assistant·notifications·analytics-reporting·search-visibility·keyword-monitoring 5 Feature가 각각 5사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 6번째 Feature `asset-ingestion`의 v0.1 초안에 대한 1차 사이클.

본 Feature는 클라이언트 기존 자료(웹사이트·SNS·업로드·CSV)를 수집·파싱·태깅·검수·promote(Core 데이터 계약 변환)하는 Feature Module. 의료기관 신규 인스턴스 onboarding 첫 단계.

특징:
- source 4종 (web-crawl 법무 게이트 필수·sns-api·manual-upload·csv-import)
- 의료 도메인 특화 PII (rrn=주민등록번호)
- compliance-assistant `check()` 호출로 자동 태깅
- promote 명시 액션으로 Core 데이터 계약(Article·TreatmentPage 등) 변환
- search-visibility 패턴 재사용 (법무 게이트·outbox·blob storage IAM)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` v0.1을 엄정하게 비평하라:

1. **SoT 정합** — 상위/Core/Feature 문서와의 일관성:
   - compliance-assistant v1.0 `check()` 호출 — 본 Feature가 자동 태깅에 활용. 입력 계약 정확화
   - notifications v1.0 notify() + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 5종 이벤트)
   - REVIEW_WORKFLOW § 10.2.1 — AuditAction cascade (asset-ingestion-source-registered/unregistered·asset-promoted·asset-rejected·pii-redacted 등)
   - DATA_MODEL C-08 v0.18 cascade — `assetIngestionConfig`·`assetIngestionPolicyVersion`
   - DATA_MODEL C-01~C-22 — promote 대상 Core 데이터 계약 호환성

2. **vs content-migration 경계**:
   - asset-ingestion은 외부 raw 자료 수집·정형화
   - content-migration은 기존 솔루션 내 콘텐츠 이전 (후속 Feature)
   - 두 Feature 책임 분리 명확성

3. **법무 게이트 (search-visibility 패턴 재사용)**:
   - web-crawl SerpCrawlerApprovedScope 재사용 + asset-ingestion 추가 fields(`allowedDomains[]`·`maxPagesPerCrawl`·`maxAssetSizeMb`)
   - sns-api platform별 ToS 위험 (AI-01)

4. **PII·의료법 도메인**:
   - rrn(주민등록번호) regex 탐지 정확도·의료법상 처리 의무
   - 의료 콘텐츠 자체의 의료광고법 위반 가능성 — compliance-assistant 검수 흐름
   - 외부 사이트 인용 저작권·SNS 동의 (AI-02·AI-03)

5. **promote 워크플로**:
   - `promoteAsset(assetId, targetContentType, targetMapping)` — 운영자 명시 액션
   - Core 데이터 계약(Article·TreatmentPage 등) 필드 매핑 — 누락 시 build/runtime fail
   - 자동 매핑 (autoMappingEnabled) v1.0 미지원 — v1.x AI-11
   - promote 후 일반 REVIEW_WORKFLOW 진입 (compliance-assistant 자동 검수)

6. **구현 안정성**:
   - duplicate 감지 (contentHash UNIQUE) — exact hash만 vs fuzzy matching
   - LLM 태깅 — compliance-assistant llmAssist 패턴 차용 시 정합성
   - blob storage IAM 정책 (search-visibility § 13.7 재사용)
   - retry queue·outbox worker (search-visibility·analytics-reporting 패턴)

7. **운영 모드**:
   - mode="staged" (v1.0 기본·모든 asset 검수 필수)
   - mode="auto-promote" (v1.x — Low risk 자동 promote)
   - autoApproveRiskLevel null → v1.0 안전 기본값

8. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 16 인벤토리 (10 tables) 일관성
   - § 1.1 변경 정책 ↔ 다른 절 변경 영향
   - 미결정 13종 분류

## 출력 형식

다음 JSON 스키마:

```json
{
  "summary": "전체 평가 한 문단",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail | major | minor | critical | high | medium | low",
      "section": "§ 번호",
      "location_quote": "지적 대상 원문 1~2줄",
      "issue": "무엇이 문제인가",
      "rationale": "왜 문제인가",
      "suggested_fix": "구체적 정정 방향"
    }
  ]
}
```

타당한 지적은 모두 제기하라.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (의존)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (의존)
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (패턴 차용)
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` (패턴 차용)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
