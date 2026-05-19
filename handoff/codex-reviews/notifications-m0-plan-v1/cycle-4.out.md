# NOTIFICATIONS_M0_PLAN v0.4 — cycle 4 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=1 major=0 minor=5 (총 6)
- closeableAfterPatch: false (blocking 1 잔존 — cycle 5 안 closeable 가능성 높음)
- 수렴 추세: cycle 1 = 16 → cycle 2 = 12 → cycle 3 = 11 → cycle 4 = **6** (감소 5 — 빠른 수렴)

## cycle 3 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| NFM3-01 (blocking) | § 5.3 NF-API-10 위치 이동 | **PASS** — § 5.2 직후 § 6 server-action 앞 (line 526~654) |
| NFM3-02 (blocking) | § 6.5 NF-INTEGRATION-05 예시 코드 | **PASS** — tx 안 산정 + tx 외부 반환 패턴 정합 |
| NFM3-03 (major) | § 7 시나리오 1·2·4·6·7·9·10 fixture marker | **PASS** |
| NFM3-04 (major) | § 7 시나리오 10 emit timing 별 검증 | **PASS** |
| NFM3-05 (major) | § 6.5 하단 주석 정정 | **PASS** |
| NFM3-06 (minor) | § 7 시나리오 11 표현 정정 | **PASS** |
| NFM3-07 (minor) | § 5.3 MatrixNotRegisteredError 완성 | **PASS** |
| NFM3-08 (minor) | § 5.1 zod enum marker | **PASS** |
| NFM3-09 (minor) | § 7 시나리오 15 신설 | **PASS** — 단 실 발생 가능성 안 무효 (NFM4-01 신설) |
| NFM3-10 (minor) | § 6.2 XSS marker | **PASS** |
| NFM3-11 (minor) | § 5.2 UPDATE SET 절 완성 + 분기 marker | **PASS** |

## blocking

- **NFM4-01**: § 7 시나리오 15 (cycle3 NFM3-09 신설) 실 발생 불가능 — sentinel ComplianceRecord 는 `record_phase='published'` (C0016 backfill) 상태로 시작 · 후속 워크플로 전이 (reviewer-approved/rejected) 자체 발생 안 함
  - 위치: plan § 7 시나리오 15
  - 근거(SoT): compliance-assistant M0 § 2.3 C0016 sentinel backfill 안 모든 sentinel row 가 `record_phase='published'` insert. server action 안 approveContent · rejectContent 는 `record_phase='pre-publish'` 만 처리 (publishContent 안 `record_phase='pre-publish' → 'published'` 전이). sentinel record 는 이미 published 상태 — 후속 workflow 진입 불가.
  - 문제: 시나리오 15 가 검증 불가능한 case — vitest 안 setup 시 sentinel record 안 reviewer-approved 시점 자체 없음. 시나리오 의도 (author 가 admin_user 안 row 부재 또는 deactivated 시 envelope 처리) 와 실제 검증 가능 case 불일치.
  - 권장 patch 옵션:
    - **(a) 시나리오 15 제거** — sentinel 시나리오 자체 invalid · 본 plan scope 외
    - **(b) 시나리오 15 의미 정정** — "submitter user 가 submit 후 deactivated 된 일반 (non-sentinel) ComplianceRecord 안 후속 reviewer-approved/rejected 발송 시 author skip + console.warn · 다른 recipient 만 발송 (또는 envelope 자체 skip · reviewer-rejected case)". sentinel 키워드 제거.
    - 본 plan 채택 = (b) — 시나리오 8 (rejectEntryAction author skip) 와 의미 분리 (시나리오 8 = rejectContent only · 시나리오 15 = approveContent 안 author skip 시 operator 만 발송). 시나리오 15 정정 권장.

## minor

- **NFM4-02**: § 1.3 비범위 표 안 "recipients[] dedup 부재 (동일 user 다중 role 보존)" 명시 부재 — NF-RECIP-07 정합 marker
  - 위치: plan § 1.3 비범위 표
  - 근거(SoT): NF-RECIP-07 (cycle 2 NFM2-06 정정) 안 "(recipientId, recipientRole) 페어 단위 보존 · dedup 안 함" 결정. UI level 의 per-user dedup 은 NF-DEFER-04 worker 합류 시.
  - 권장 patch: § 1.3 비범위 표 안 항목 추가 — "recipients[] per-user dedup (동일 user 가 다중 role 보유 시 1건 통합) | NF-DEFER-04 worker 합류 시 | NF-DEFER-23 (신설)".

- **NFM4-03**: § 5.1 helper 안 `setTimeout` polling 안 AbortSignal 지원 부재 — server action timeout 시 dangling promise risk
  - 위치: plan § 5.1 NF-API-05 (line 482~486)
  - 근거(SoT): Node.js setTimeout 안 AbortController 지원 (Node 15+). server action 안 request abort 시 polling 안 dangling.
  - 권장 patch: § 5.1 marker — "100ms polling 안 AbortSignal 미지원 (M0 v0.1 단순화). server action timeout 시 dangling promise 발생 가능 — 운영 impact 미미 (100ms 단일 retry). NF-DEFER-04 worker 합류 시 AbortController 통합 검토".

- **NFM4-04**: § 5.1 helper 안 `tx.json(validated.recipients as any)` 안 `as any` 강제 — 타입 안전성
  - 위치: plan § 5.1 NF-API-01 (line 466~467)
  - 근거(SoT): postgres.js `tx.json()` 안 입력 타입 정합성. zod 안 검증된 객체 그대로 입력 시 타입 안전.
  - 권장 patch: § 5.1 marker — "postgres.js tx.json() 안 generic type narrow 부재 — `as any` 강제 (postgres 5.x 타입 정의 한계 · 운영 안전 — zod 검증 후 입력)".

- **NFM4-05**: NF-CASCADE-04 안 DATA_MODEL C-10 metadata 슬롯 schema 실 SoT 존재 검증 marker — cycle 안 marker 만
  - 위치: plan § 10 NF-CASCADE-04
  - 근거(SoT): DATA_MODEL C-10 안 metadata 슬롯 schema 명시 부재 (compliance_record.metadata 안 freeform JSONB). 본 plan 안 `submitterUserId` 키 명세 추가 marker.
  - 권장 patch: NF-CASCADE-04 marker 강화 — "DATA_MODEL C-10 안 metadata 슬롯 schema 명시 안 본 plan 안 `submitterUserId` 키 추가 marker. CA-DEFER-13 매핑 표 안 풀 컬럼 화 시 entity 모델 작성자 추적 cycle (NF-DEFER-14) 동반".

- **NFM4-06**: § 7 시나리오 11 안 fixture "instance_membership 안 active=true 사용자 0건 (모든 role)" — submitter 자체 active=true 인 경우 author recipient 1건 잔존 가능
  - 위치: plan § 7 시나리오 11
  - 근거(SoT): 시나리오 11 의도 = "recipients=[] 입력 시 helper 가 envelope 생성 전 skipped 분기" 검증. 그러나 author recipient 는 별도 산정 (resolveAuthorRecipient) — submitter 가 active=true 인 reviewer-approved 시 author 1건 산정 → recipients=[author] · skipped 분기 안 됨.
  - 권장 patch: § 7 시나리오 11 안 fixture 정정 — "(시나리오 11 = `content-gate-queued` 발송 case 한정 — finalRoles 매칭 사용자 0건. author recipient 는 본 시나리오 외)" 또는 "submitter 도 active=false 로 fixture 설정 (모든 active=true 사용자 0건)". 본 plan 채택 = 전자 (content-gate-queued case 한정 — author 미산정 이벤트).

## acceptance precondition 점검

- NF-DEFER 매핑 완비성 (22종 + 41 NotificationEventType cascade 매핑): **PASS** — NF-DEFER-23 (per-user dedup) 신설 patch 시 23종
- envelope shape REVIEW_WORKFLOW § 9.2 SoT 정합: **PASS**
- sourceEventId 결정 함수 idempotency 계약 정합: **PASS**
- recipients 산정 (finalRoles + author) DATA_MODEL C-23 정합: **PASS**
- 4 server action emit 시점 (tx commit 후 base role) compliance-assistant M0 § 6.2 정합: **PASS**
- LL-DEFER-01 완전 해소 marker 정합: **PASS**
- CA-DEFER-14 부분 해소 marker (11 tables · channel · digest · suppression · DLQ · broadcast NF-DEFER-01 cascade) 정합: **PASS**
- plan 문서 구조 정합 (§ 번호 순서): **PASS** — § 1·2·3·4·5·6·7·8·9·10 순서 정합
- 시나리오 14건 + 1 신설 시나리오 정합: **CONDITIONAL** — 시나리오 15 의 sentinel 의미 invalid (NFM4-01 blocking)

## 후속 cycle 권장 진행

cycle-5 patch sweep:
1. NFM4-01 (blocking): 시나리오 15 의미 정정 — sentinel 키워드 제거 + 일반 user deactivation case 로 변경
2. NFM4-02 (minor): § 1.3 NF-DEFER-23 (per-user dedup) 신설
3. NFM4-03·04·05·06 (minor) 동반 patch

cycle-5 입력 = 본 cycle 6 finding 전건 수용 patch + v0.5 변경 이력. cycle 5 안 closeableAfterPatch=true 달성 목표.
