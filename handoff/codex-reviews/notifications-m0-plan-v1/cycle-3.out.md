# NOTIFICATIONS_M0_PLAN v0.3 — cycle 3 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=2 major=3 minor=6 (총 11)
- closeableAfterPatch: false (blocking 2 잔존)
- 수렴 추세: cycle 1 = 16 → cycle 2 = 12 → cycle 3 = **11** (감소 1 — 신규 발견 우세)

## cycle 2 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| NFM2-01 (blocking) | § 3.1 NotificationRecipient | **PASS** — recipientStateAt 필드 추가 |
| NFM2-02 (major) | § 4.1·4.2 helper 시그니처 + § 5.2 예시 코드 | **PASS** — 자동 부착 + .map 제거 |
| NFM2-03 (major) | NF-DEFER-21 신설 | **PASS** |
| NFM2-04 (major) | § 8 작업 11 안 7 NF-CASCADE | **PASS** |
| NFM2-05 (major) | § 4.3·6.1 publish 행 operator 0건 skip | **PASS** |
| NFM2-06 (minor) | § 4.3 dedup→보존 정정 | **PASS** |
| NFM2-07 (minor) | NF-DEFER-22 신설 + § 6.1 표 아래 marker | **PASS** |
| NFM2-08 (minor) | § 8 작업 9 audit_event TEXT 명시 | **PASS** |
| NFM2-09 (minor) | § 5.3 NF-API-10 신설 (matrix.ts) | **PARTIAL** — 섹션 자체는 추가됐으나 **§ 8 표 뒤에 잘못 위치** (NFM3-01 신설) |
| NFM2-10 (minor) | § 6.2 marker | **PASS** |
| NFM2-11 (minor) | § 5.1 NF-API-07b Node runtime | **PASS** |
| NFM2-12 (minor) | § 9.1.1 신설 + § 1.3 NF-DEFER-20~22 cascade | **PASS** |

## blocking

- **NFM3-01**: § 5.3 NF-API-10 (matrix snapshot) 섹션이 § 8 작업 단위 표 **뒤에** 잘못 위치 — 문서 구조 깨짐
  - 위치: plan 안 § 5.3 NF-API-10 (line 672~772 가량) 가 § 7 시나리오 (line 637~654) 와 § 8 작업 단위 (line 656~670) **뒤에** 위치
  - 근거(SoT): cycle 2 NFM2-09 patch 시 § 5.3 신설 안 § 5 helper 결정 섹션 안 위치 권장. 그러나 patch 시 § 8 표 뒤에 append 됨 (insertion point 잘못).
  - 문제: 문서 구조 안 § 5.3 이 § 7·§ 8 뒤에 있음 — 독자 혼동 + § 9 markers 와 위치 충돌. plan 안 § 번호 순서 깨짐.
  - 권장 patch: § 5.3 NF-API-10 섹션을 § 5.2 NF-API-08 호출 위치 결정 직후 (§ 6. server-action 통합 결정 앞) 로 이동. § 9.x markers 섹션은 § 5.3 뒤로 이동 (현재 § 5.3 다음에 § 9.1 합류 markers 잘못 위치).

- **NFM3-02**: § 6.5 NF-INTEGRATION-05 reviewer-approved 발송 조건 예시 코드 안 `sqlBase` 안 `resolveRoleRecipients` 호출 잔재 — cycle1 NFM-01 patch 누락 (§ 5.2 만 patch · § 6.5 미patch)
  - 위치: plan § 6.5 (line 623~633)
    ```typescript
    if (result.ok === true && result.out.allApproved === true) {
      try {
        const recipients = [
          ...(await resolveRoleRecipients(sqlBase, ctx.instanceId, ["operator"])),  // tx 후 base role 안 호출
          ...((await resolveAuthorRecipient(sqlBase, ctx.instanceId, result.entry.compliance_record_id)) ? [...] : []),
        ];
        await enqueueNotificationEnvelope(sqlBase, { ... });
      } catch (err) { ... }
    }
    ```
    + 하단 주석 "recipients 산정 시 sqlBase 안 호출 — tx 종료 후이므로 별도 짧은 tx 안 ... 또는 tx 안 미리 산정 + tx 종료 후 사용 — 후자 권장"
  - 근거(SoT): cycle 1 NFM-01 정정 결정 = "recipients 산정 helper 는 ScopedTx 만 받는 단일 시그니처. sqlBase 안 산정 미허용." § 5.2 NF-API-08 예시 코드 안 patched 정합. 그러나 § 6.5 예시 코드 안 sqlBase 호출 잔재 + 주석도 "후자 권장" 표현 안 sqlBase 호출 두 path 모두 명시 — 결정 충돌.
  - 문제: cycle 1 NFM-01 결정 정합 위반. § 5.2 의 정합 패턴 (tx 안 산정 + tx 외부 반환) 과 § 6.5 의 잔재 패턴 (sqlBase 안 산정) 분기.
  - 권장 patch: § 6.5 예시 코드 안 § 5.2 와 동일 패턴으로 정정 — recipients 산정 tx 안 + tx 외부 반환 + enqueueNotificationEnvelope 호출 시 recipients 직접 입력. 하단 주석 "sqlBase 안 호출 ... 또는 tx 안 미리 산정 ... 후자 권장" 표현 → "recipients 는 tx 안 산정 (cycle1 NFM-01 결정 정합)" 정정.

## major

- **NFM3-03**: 시나리오 2 안 `recipients={operator, medical}` 표현 — test fixture 안 instance_membership 안 active=true operator·physician-reviewer 사용자 1+ 보장 marker 부재
  - 위치: plan § 7 시나리오 2 (Article (High) submitForReview)
  - 근거(SoT): resolveRoleRecipients 안 instance_membership 안 active=true filter. test 안 setup 시 두 role 안 사용자 fixture 필요.
  - 문제: 시나리오 안 fixture 가정 부재 → 구현 시 test 안 fixture 누락 시 시나리오 통과 안 됨 (recipients=[] 분기). 시나리오 표현 안 "fixture 안 ..." 명시 권장.
  - 권장 patch: § 7 시나리오 2 안 통과 기준 안 "test fixture 안 instance_membership 안 active=true operator 1+ · physician-reviewer 1+ 사용자 setup" 명시. 다른 recipients 산정 시나리오 (4·6·7·9) 도 동상 marker.

- **NFM3-04**: 시나리오 10 LegalDocument 발행 시퀀스 안 envelope count 명시 부족
  - 위치: plan § 7 시나리오 10
  - 근거(SoT): operator approve 시 allApproved=false → `reviewer-approved` emit 없음. legal approve 시 allApproved=true → `reviewer-approved` emit 1건. publish 시 `publish` emit 1건. 총 2건 정합. 그러나 시나리오 표현 안 "operator approve 안 emit 없음" 명시 부재.
  - 문제: 시나리오 verify 시 "총 2건" 만 확인 — operator approve 안 emit timing 미검증.
  - 권장 patch: § 7 시나리오 10 안 통과 기준 정정 — "(1) submit → emit 없음 (manual-review). (2) operator approve → emit 없음 (allApproved=false · legal 잔존). (3) legal approve → `reviewer-approved` emit 1건 (allApproved=true). (4) publish → `publish` emit 1건. 총 2건". 시나리오 안 emit timing 별 검증.

- **NFM3-05**: § 6.5 NF-INTEGRATION-05 하단 주석 안 "recipients 산정 시 sqlBase 안 호출 ... 또는 tx 안 미리 산정 ... 후자 권장" 표현 — cycle1 NFM-01 결정 정합 (tx 안 산정 만 허용) 위반
  - 위치: plan § 6.5 line 635
  - 근거(SoT): cycle 1 NFM-01 patch 결정.
  - 권장 patch: 주석 정정 — "recipients 는 tx 안 산정 후 tx 외부 반환 (cycle1 NFM-01 결정 — sqlBase 안 산정 미허용)". NFM3-02 patch 안 동반.

## minor

- **NFM3-06**: 시나리오 11 안 "recipients=[] envelope" 표현 — envelope 생성 자체 안 되므로 "recipients=[] 입력 시 helper 가 envelope 생성 전 분기" 표현 정합 정정
  - 위치: plan § 7 시나리오 11
  - 권장 patch: 시나리오 11 안 "recipients=[] envelope" → "recipients=[] 입력 (모든 role 활성 사용자 0건 시) → helper 가 envelope 생성 전 `skipped='no-recipients'` 분기" 표현 정정.

- **NFM3-07**: § 5.3 NF-API-10 안 `MatrixNotRegisteredError` constructor 안 `{ ... }` 생략 — 코드 완성도
  - 위치: plan § 5.3 (line 687)
  - 권장 patch: `class MatrixNotRegisteredError extends Error { constructor(message: string) { super(\`MatrixNotRegisteredError: ${"${message}"}\`); this.name = "MatrixNotRegisteredError"; } }` 완성.

- **NFM3-08**: § 5.1 helper 안 zod schema 안 `eventType` enum 5종 hardcode — eventType 추가 시 enum 동기화 필요
  - 위치: plan § 5.1 NF-API-06 (line 391~393)
  - 근거(SoT): `notification_event_type` PostgreSQL enum 과 TypeScript zod schema 동기화.
  - 권장 patch: § 5.1 안 `z.enum([NotificationEventType 5종])` 대신 `z.enum(notificationEventTypeEnumValues)` (core-content 에서 export 된 readonly tuple) 사용 marker. M0 v0.1 안 5종 만 정합 — Phase Alpha 안 ADD VALUE 시 자동 동기화.

- **NFM3-09**: § 6.3 안 sentinel ComplianceRecord (C0016 backfill row) 안 reviewer-approved/rejected 발송 시나리오 — author skip 추가 시나리오 권장
  - 위치: plan § 7 (시나리오 8 author skip 만 있음 · sentinel 시나리오 부재)
  - 권장 patch: 시나리오 15 신설 — "C0016 sentinel ComplianceRecord (metadata 안 submitterUserId 없음) 안 후속 reviewer-approved/rejected 발송 시 author skip + console.warn · 다른 recipient 만 발송".

- **NFM3-10**: § 6.2 fallback "<제목 없음>" 안 XSS 위험 없음 marker — envelope.metadata 저장 만 · UI render NF-DEFER-10
  - 위치: plan § 6.2 (line 593)
  - 권장 patch: § 6.2 안 "(XSS 위험 없음 — envelope.metadata 저장 만 · UI render 안 sanitize 책임 NF-DEFER-10)" 명시.

- **NFM3-11**: § 5.2 예시 코드 안 `UPDATE compliance_record SET ... WHERE id = ${recordId}::uuid RETURNING updated_at` 안 SET 절 placeholder `...` — 실 SQL 안 모호
  - 위치: plan § 5.2 line 516
  - 권장 patch: § 5.2 예시 코드 안 `SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = now(), updated_at = now()` 등 명시 예시. 실 server action 안 다양한 UPDATE pattern 분기 — 본 예시는 medical role approve case 만 (단순 representative example) marker.

## acceptance precondition 점검

- NF-DEFER 매핑 완비성 (22종 + 41 NotificationEventType cascade 매핑): **PASS**
- envelope shape REVIEW_WORKFLOW § 9.2 SoT 정합: **PASS**
- sourceEventId 결정 함수 idempotency 계약 정합: **PASS**
- recipients 산정 (finalRoles + author) DATA_MODEL C-23 정합: **PASS**
- 4 server action emit 시점 (tx commit 후 base role) compliance-assistant M0 § 6.2 정합: **CONDITIONAL** — § 6.5 예시 코드 안 sqlBase 호출 잔재 (NFM3-02 blocking)
- LL-DEFER-01 완전 해소 marker 정합: **PASS**
- CA-DEFER-14 부분 해소 marker (11 tables · channel · digest · suppression · DLQ · broadcast NF-DEFER-01 cascade) 정합: **PASS**
- **plan 문서 구조 정합 (§ 번호 순서)**: **FAIL** — § 5.3 이 § 8 뒤에 잘못 위치 (NFM3-01 blocking)

## 후속 cycle 권장 진행

cycle-4 patch sweep:
1. NFM3-01 (blocking): § 5.3 NF-API-10 섹션을 § 5.2 직후 (§ 6. 앞) 로 이동
2. NFM3-02 (blocking): § 6.5 예시 코드 안 sqlBase 호출 → tx 안 산정 정합 patch
3. NFM3-03·04·05 (major): 시나리오 표현 정정 + § 6.5 주석 정정
4. NFM3-06~11 (minor) 동반 patch

cycle-4 입력 = 본 cycle 11 finding 전건 수용 patch + v0.4 변경 이력.
