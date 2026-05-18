# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.5 (5차 사이클 — 수렴 확인)

## 컨텍스트

4차 비평(13 지적: blocking 3 + major 7 + minor 3) 전건 수용. v0.5 핵심 변경:
- ApplyConsentWithdrawalInput discriminated union (keyType=piiHash·crmExternalId) + canonical hash 알고리즘 § 2.3.1 SoT
- rotateCredential DB-level concurrency 강제 — SELECT FOR UPDATE + CrmCredentialVersion partial unique 3종 (active·rotating-target·committed 각 1개)
- InboundProcessingContext discriminated union (WebhookInboundContext / PollingInboundContext) + 공통 NormalizedInboundChange
- NonceLedger transport-level / ChangeIdentityLedger record-level 책임 분리 + providerVersionToken=null provider v1.0 build fail
- operationalHints privacy-sensitive metadata 재분류 + 필드별 retention·masking·role access·small-cell suppression·export 정책
- legalHold > unregister snapshot > retention purge precedence + CrmConsentWithdrawalLedger legalHold default true
- resetCredentialRotation command
- CrmConsentWithdrawalLedger DB CHECK + partial unique + CrmChangeIdentityLedger FK·ON DELETE
- § 8.2 acceptance test invariant 별 fixture 재편 (INV-MANIFEST·INV-WEBHOOK-DEDUPE 등 13 그룹)
- Command DTO 6종 stand-alone
- DATA_MODEL 헤더 v0.20 갱신
- "v0.3 동일" 잔재 풀 전개 — RunSyncInput/Result·FieldAuthority·ConflictRecord·NotificationEventType 모두 stand-alone
- § 1.1 변경 정책 4행 추가

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.5를 v1.0 안정판 후보로서 엄정하게 비평하라:

1. **4차 지적 재발 여부**: 13개 지적이 실제로 정정됐는가?
2. **stand-alone 충족**: v0.5 단일 문서로 구현자가 작업 가능한가? 외부 의존 references (asset-ingestion § 9.1, search-visibility § 13.5·§ 13.10, REVIEW_WORKFLOW, DATA_MODEL)는 명확히 정의됐는가?
3. **잔여 위험**:
   - providerVersionToken=null build fail의 운영 영향
   - operationalHints small-cell suppression 5건 임계의 의료법 적정성
   - CrmCredentialVersion 6상태와 CrmIntegration 5상태의 invariant 일관성 (transition 누락 없는가)
   - ApplyConsentWithdrawalInput discriminated union의 idempotencyKey 충돌 처리 의미 명확성
   - InboundProcessingContext NormalizedInboundChange가 webhook/polling 양쪽 모두 충분히 충족하는가
4. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 15 tables 일관성
   - § 1.1 변경 정책 표가 모든 v0.5 신규를 다루는가
   - § 13 schema FK·UNIQUE·INDEX·CHECK가 § 3·§ 4 운영과 충돌 없는가
   - § 8.2 invariant 별 fixture 13 그룹이 § 10 build/runtime/migration/invariant fail 룰과 1:1인가
5. **v1.0 안정판 후보 기준**:
   - blocking 지적이 0개인가?
   - SoT cascade가 REVIEW_WORKFLOW·DATA_MODEL 동기화 완료인가?
   - 의료법·개인정보보호법 운영 가능 수준인가?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS5-`. **v1.0 안정판 후보로 판정 가능하면 verdict="ready_for_v1_0"** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.5)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle4_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
