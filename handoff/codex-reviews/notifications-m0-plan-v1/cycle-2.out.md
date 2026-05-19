# NOTIFICATIONS_M0_PLAN v0.2 — cycle 2 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=1 major=4 minor=7 (총 12)
- closeableAfterPatch: false (blocking 1 잔존)
- 수렴 추세: cycle 1 = 16 → cycle 2 = **12** (감소 4)

## cycle 1 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| NFM-01 (blocking) | § 4 도입 + § 5.2 NF-API-08 예시 코드 | **PASS** — helper signature ScopedTx 통일 + tx 안 산정 + tx 외부 반환 + § 5.2 예시 정합 |
| NFM-02 (blocking) | § 5.1 NF-API-05 | **PASS** — 100ms × 1회 polling + EnvelopeEnqueueRaceError throw |
| NFM-03 (blocking) | § 3.2 NF-EVENT-03 표 | **PASS** — 4 server action 별 timestamp 출처 표 |
| NFM-04 (blocking) | § 1.3 NF-DEFER-16/17/18 description + § 2.3 NF-SCHEMA-05c 41종 매핑 | **PASS** — 41종 누적 매핑 정확 |
| NFM-05 (major) | § 3.2 NF-EVENT-02b | **PASS** — sourceEventId instanceId 추가 결정 marker |
| NFM-06 (major) | § 5.1 NF-API-06 + zod schema | **PASS** — InvalidEnvelopeInputError throw |
| NFM-07 (major) | § 1.2 (audit_event 행) + NF-CASCADE-06 | **PASS** — audit_event.event_type=TEXT 명시 |
| NFM-08 (major) | § 4.2 NF-RECIP-08 | **PARTIAL** — recipientStateAt 메타 추가 명시 OK. **그러나 § 3.1 NotificationRecipient 타입 안 미반영** (NFM2-01 신설) |
| NFM-09 (major) | § 2.1 NF-SCHEMA-06 | **PASS** — outbox.id = NotificationEvent.eventId 명시 |
| NFM-10 (minor) | § 2.3 NF-SCHEMA-05c | **PASS** — 41종 정합 |
| NFM-11 (minor) | § 3.3 NF-EVENT-07 + NF-DEFER-20 | **PASS** — manual-review-queued NotificationEventType cascade |
| NFM-12 (minor) | § 5.1 NF-API-07 | **PASS** — zod schema 안 통합 |
| NFM-13 (minor) | § 10 NF-CASCADE-02 | **PASS** — admin scope vs build/export scope 분리 명시 |
| NFM-14 (minor) | § 2.3 NF-SCHEMA-05b | **PASS** — PostgreSQL 12+ marker |
| NFM-15 (minor) | § 5.2 NF-API-08 예시 코드 | **PASS** — 완전 코드 |
| NFM-16 (minor) | § 10 NF-CASCADE-07 | **PASS** — Spike B 패턴 통합 전략 marker |

## blocking

- **NFM2-01**: § 3.1 NotificationRecipient TypeScript 타입 안 `recipientStateAt` 필드 누락 — § 5.1 zod schema vs typescript 타입 정의 분기
  - 위치: plan § 3.1 NF-EVENT-01 (`type NotificationRecipient = { recipientId; recipientRole };`) vs plan § 5.1 NF-API-06 (`recipientSchema = z.object({ recipientId, recipientRole, recipientStateAt })`)
  - 근거(SoT): NFM-08 patch 안 NF-RECIP-08 정정 — recipients[] 안 각 row 안 `recipientStateAt=<ISO>` 메타 추가 (drift audit). 그러나 § 3.1 TypeScript 타입 안 반영 누락.
  - 문제: TypeScript 타입 정의 vs zod schema 분기 → 컴파일 시점 안 NotificationRecipient 타입 사용 안에서 recipientStateAt 강제 안 됨. 호출자 (resolveRoleRecipients · resolveAuthorRecipient) 가 recipientStateAt 누락 시 zod 검증 안 catch (runtime).
  - 권장 patch: § 3.1 NotificationRecipient 타입 안 `recipientStateAt: string` 필드 추가 — zod schema 와 타입 정의 통일.

## major

- **NFM2-02**: § 4.1 resolveRoleRecipients · § 4.2 resolveAuthorRecipient 반환 타입 안 `recipientStateAt` 누락 — 호출자 분기 코드 안 매 row .map 안 recipientStateAt 추가하는 책임 전가
  - 위치: plan § 4.1 (`Promise<Array<{ recipientId: string; recipientRole: ApproverRole }>>`) · plan § 4.2 (`Promise<{ recipientId: string; recipientRole: "author" } | null>`) · plan § 5.2 예시 코드 안 `roleRecipients.map((r) => ({ ...r, recipientStateAt }))`
  - 근거(SoT): NFM-08 patch (NF-RECIP-08) 안 recipientStateAt 메타 추가 결정. 그러나 helper 반환 타입 안 누락.
  - 문제: 호출자 매 callsite 안 .map 추가 책임 — DRY 위반 + 누락 위험. helper 안 산정 시점 안 recipientStateAt = `new Date().toISOString()` 자동 부착 가능.
  - 권장 patch: § 4.1·4.2 helper 시그니처 안 반환 타입 안 recipientStateAt 추가 + 산정 시점 안 `new Date().toISOString()` 자동 부착. § 5.2 예시 코드 안 .map 제거.

- **NFM2-03**: super-admin (`admin_user.is_super_admin=true`) recipient 산정 부재 — instance_membership row 부재로 매칭 안 됨 + 본 plan 안 marker 부재
  - 위치: plan § 4.1·4.2 recipients 산정 helper · plan § 1.3 비범위 표
  - 근거(SoT): `apps/spike-e/migrations/002_admin_user.sql` 안 "super-admin은 admin_user.is_super_admin flag로 별도 표현·membership row 부재" comment. 즉 super-admin 은 instance_membership 안 row 가 없으므로 resolveRoleRecipients 안 매칭 안 됨. 운영적으로 super-admin 도 critical 이벤트 알림 필요 (예: `content-gate-queued` · `crm-sync-credential-expired`).
  - 문제: 본 plan 안 super-admin 알림 정책 marker 부재. notifications spec § 9.1.1 매트릭스 안 일부 이벤트 (예: `content-migration-*`) 수신자 = "super-admin" 명시 — 본 Feature cascade 시 super-admin 산정 필요. M0 v1.0 안 super-admin 수신자 이벤트 없음 (M0 4 active 이벤트 모두 super-admin 부재) — defer 정합.
  - 권장 patch: NF-DEFER-21 신설 — "super-admin (admin_user.is_super_admin=true) 안 recipient 산정 — instance_membership row 부재 안전 fallback (admin_user 직접 SELECT). M0 v1.0 안 super-admin 수신자 이벤트 부재 → defer. Phase Alpha 안 다른 Feature cascade 합류 시 합류 (content-migration · crm-sync 등)".

- **NFM2-04**: § 8 작업 11 안 docs cascade 표기 — 6 NF-CASCADE marker 명시 vs § 10 안 7 NF-CASCADE (NF-CASCADE-07 신설 · cycle 1 NFM-16 patch) 분기
  - 위치: plan § 8 작업 11 ("docs cascade ... 6 NF-CASCADE marker") vs plan § 10 (NF-CASCADE-01~07 총 7 markers)
  - 근거(SoT): cycle 1 NFM-16 patch 안 NF-CASCADE-07 신설 OK. 그러나 § 8 작업 11 표현 patch 누락.
  - 권장 patch: § 8 작업 11 안 "docs cascade ... 7 NF-CASCADE marker (NF-CASCADE-01~07 — 본 plan 안 § 10 매핑 참조)" 정정.

- **NFM2-05**: § 6.1 표 안 publishContentAction operator 0건 시 envelope skip 명시 부재 — NF-RECIP-03 일관성
  - 위치: plan § 6.1 (publishContentAction 행) · plan § 4.3 NF-RECIP-07 (publish 행 안 "operator 0건 → envelope skip" 명시 부재)
  - 근거(SoT): NF-RECIP-03 안 "finalRoles 안 결과 0건 → 본 plan 에서 발송 자체 skip + console.warn 로그". publishContent 안 operator recipient 0건 시 동일 처리 필요. 그러나 § 4.3 NF-RECIP-07 표 안 publish 행 명시 부재.
  - 권장 patch: § 4.3 NF-RECIP-07 표 안 publish 행 정정 — "operator 0건 → envelope skip + console.warn (NF-RECIP-03 정합)". § 6.1 표 안 동일 명시.

## minor

- **NFM2-06**: § 4.3 NF-RECIP-07 표 하단 주석 안 "합집합 시 ... 페어 dedup" 표현 모순 — 실제로는 "dedup 안 함" (두 row 보존) 가 본 plan 결정
  - 위치: plan § 4.3 표 하단 ("recipients[] 합집합 시 (recipientId, recipientRole) 페어 dedup")
  - 근거(SoT): 본 plan 결정 안 동일 user 의 (operator + author) 두 row 보존 명시. "dedup" 표현 부정확.
  - 권장 patch: "dedup" → "(recipientId, recipientRole) 페어 단위 보존 (동일 user 의 다중 role 은 각 row 별도 보존 · UI dedup 은 NF-DEFER-04)" 표현 정정.

- **NFM2-07**: publish 액션 actor 가 operator role 보유 + recipients 안 operator 포함 시 actor 자기 자신 알림 — 운영 risk marker 부재
  - 위치: plan § 6.1 (publishContentAction 행 recipients) · plan § 4.3 (publish 행 recipients)
  - 근거(SoT): publishContent action actor = ctx.userId (operator role 보유 가정 — assertReviewerEligibility operator 검증). recipients 산정 안 operator role 의 활성 사용자 모두 포함 → actor 자기 자신 포함.
  - 문제: 자기 자신 알림 → 알림 노이즈. notifications spec § 5.3 안 in-app inbox 안 self-notification 일반적 허용 (마킹 후 dismiss). 그러나 운영 정책 결정 marker 필요.
  - 권장 patch: NF-DEFER-22 신설 — "action actor self-suppression — recipients 산정 안 actor.userId 제외 옵션 (Phase Alpha 안 운영 결정). M0 v0.1 안 actor 자기 자신 포함 (notifications spec § 5.3 in-app self-notification 허용 정합)".

- **NFM2-08**: § 8 작업 9 표현 — "audit_event eventType `notification-envelope-enqueued` 추가" → DB 마이그레이션 없음 명시 patch
  - 위치: plan § 8 작업 9
  - 근거(SoT): cycle 1 NFM-07 patch 안 `audit_event.event_type=TEXT` 명시 (마이그레이션 불필요).
  - 권장 patch: § 8 작업 9 안 "audit_event eventType `notification-envelope-enqueued` 추가 + REVIEW_WORKFLOW § 10.2.1 cascade marker (audit_event.event_type=TEXT 컬럼 정합 — DB 마이그레이션 불필요 · 문서 cascade 만)" 표현.

- **NFM2-09**: § 5.1 안 `resolveMatrixSnapshot(eventType)` helper 시그니처 명시 부재 — `apps/web/src/lib/notifications/matrix.ts` 안 함수 SoT
  - 위치: plan § 5.1 NF-API-01 (`resolveMatrixSnapshot(input.eventType)`)
  - 근거(SoT): notifications spec § 9.1.1 매트릭스 안 6 필드 (criticality · immediateChannels · fallbackChannels · digestCadence · quietHoursPolicy · optOutPolicy).
  - 권장 patch: § 5.1 안 추가 표 — `resolveMatrixSnapshot` 시그니처: `(eventType: NotificationEventType) => { criticality, immediateChannels[], fallbackChannels[], digestCadence | null, quietHoursPolicy, optOutPolicy }`. 매트릭스 안 본 plan 4 active eventType 만 매핑 (5종 등록 만 blocked-correction-required 포함). 다른 41종 - 5종 = 36종 미합류 시 throw `MatrixNotRegisteredError` (NF-DEFER cascade marker).

- **NFM2-10**: § 6.2 안 entity row title 컬럼 — 6 entity 실 schema 안 존재 검증 marker 부재 (cycle 3 안 실 검증 필요)
  - 위치: plan § 6.2 NF-INTEGRATION-02 표 (Article.title · TreatmentPage.title · LegalDocument.title · FAQ.question · Publication.title · MediaAppearance.title)
  - 근거(SoT): packages/core-content/migrations/C0001~C0006/C0010~C0012 안 실 컬럼명 검증 필요.
  - 권장 patch: cycle 3 안 실 컬럼명 grep 검증 — schema.ts 또는 migration SQL 안 컬럼명 정합 검증 marker 추가. M0 v0.1 안 marker 만 (실 검증은 code cycle).

- **NFM2-11**: § 5.1 helper 안 `setTimeout` 사용 — Next.js Edge runtime 호환성 marker 부재
  - 위치: plan § 5.1 NF-API-05 (`new Promise<void>((resolve) => setTimeout(resolve, 100))`)
  - 근거(SoT): Next.js 14+ Edge runtime 안 `setTimeout` 일부 제약 (Vercel Edge Functions 안 60s 한계). server action 안 Node runtime 가정.
  - 권장 patch: § 5.1 안 marker — "enqueueNotificationEnvelope 은 Node runtime 안 호출 (server action default Node runtime · Edge runtime 미사용)" 명시.

- **NFM2-12**: NF-CASCADE-XX 안 NF-DEFER-20·21·22 신설에 따른 § 9.1·9.2 NF-DEFER 표 patch 누락 — cycle 1·2 신설 marker 정합
  - 위치: plan § 9.1·9.2 (NF-DEFER 19종 만 명시 · 신규 NF-DEFER-20~22 누락)
  - 근거(SoT): cycle 1 NFM-11 안 NF-DEFER-20 (manual-review-queued) 신설 + cycle 2 NFM2-03/07 안 NF-DEFER-21·22 신설.
  - 권장 patch: § 9.1·9.2 안 NF-DEFER-20~22 신설 행 추가 + § 1.3 비범위 표 안 동일 cascade.

## acceptance precondition 점검

- NF-DEFER 매핑 완비성 (19 → 22종 + 41 NotificationEventType cascade 매핑): **FAIL** — NF-DEFER-20·21·22 신설 미반영 (NFM2-12)
- envelope shape REVIEW_WORKFLOW § 9.2 SoT 정합: **PARTIAL** — NotificationRecipient 타입 안 recipientStateAt 누락 (NFM2-01 blocking)
- sourceEventId 결정 함수 idempotency 계약 정합: **PASS**
- recipients 산정 (finalRoles + author) DATA_MODEL C-23 정합: **PARTIAL** — super-admin marker 부재 (NFM2-03)
- 4 server action emit 시점 (tx commit 후 base role) compliance-assistant M0 § 6.2 정합: **PASS**
- LL-DEFER-01 완전 해소 marker 정합: **PASS**
- CA-DEFER-14 부분 해소 marker (11 tables · channel · digest · suppression · DLQ · broadcast NF-DEFER-01 cascade) 정합: **PASS**

## 후속 cycle 권장 진행

cycle-3 patch sweep:
1. NFM2-01 (blocking): § 3.1 NotificationRecipient 타입 안 recipientStateAt 추가
2. NFM2-02 (major): § 4.1·4.2 helper 시그니처 반환 타입 안 recipientStateAt 추가 + § 5.2 예시 코드 .map 제거
3. NFM2-03 (major): NF-DEFER-21 신설 (super-admin recipient 산정 defer)
4. NFM2-04 (major): § 8 작업 11 안 7 NF-CASCADE marker 정정
5. NFM2-05 (major): § 4.3 publish 행 안 operator 0건 skip 명시
6. NFM2-06~12 (minor) 동반 patch

cycle-3 입력 = 본 cycle 12 finding 전건 수용 patch + v0.3 변경 이력.
