# LOCATION_LEGAL_PLAN v0.4 — codex 자동 비평 cycle 4

당신은 신중한 senior reviewer. v0.3 cycle3 10 findings 가 v0.4 patch 에서 전건 수용되었는지 + 새로 생긴 cascade 결함 + 회귀 여부 + closeableAfterPatch 도달 가능성을 평가하라.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.4 (cycle1 25 + cycle2 12 + cycle3 10 = 47 findings 전건 수용 누계)

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 · `docs/core/DATA_MODEL.md` v0.9 · `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
- 기존 packages (직접 확인):
  - `packages/core-content/migrations/C0001`/`C0002`/`C0004`/`C0005` · `packages/migrations-runner/src/index.ts`
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts`

## cycle3 → v0.4 patch 요약

| ID | patch |
|---|---|
| LL-38 | Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function (`clinic_profile_primary_ctas_validate`) |
| LL-39 | FormData dotted key 회귀 → flat underscore (`legalDocEffective_<documentType>`) + `extractLegalDocEffectiveOverrides()` parser helper |
| LL-40 | CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required |
| LL-41 | LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 |
| LL-42 | LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 |
| LL-43 | audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18) |
| LL-44 | `MainLocationMissingError` named class + errors.ts 별도 분기 |
| LL-45 | LL-ACTION-08 vs LL-SCHEMA-12 충돌 해소 — build-time reference 통일 |
| LL-46 | 자동 재렌더링 운영자 알림 (form (d) 상단 안내문 LL-FORM-15) |
| LL-47 | LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed) |

## 검토 관점

### 1. cycle3 patch 수용 정합

- LL-38~LL-47 각 patch 본문 반영 + 의도된 효과 충족.
- patch 가 cycle1·2 patch (LL-01~LL-37) 의 결정을 회귀시키지 않았는지.

### 2. LL-38 trigger 구현 정합

- `clinic_profile_primary_ctas_validate()` plpgsql function 의 IMMUTABLE 마킹 — `jsonb_typeof`, `jsonb_array_elements` 가 stability 분류상 IMMUTABLE 인가? STABLE 이라면 wrap function 도 STABLE 이어야 마이그레이션이 통과한다. CREATE FUNCTION 의 LANGUAGE plpgsql 함수가 IMMUTABLE 선언 시 의도와 일치하지 않을 가능성?
- `BEFORE INSERT OR UPDATE OF primary_ctas` trigger — UPDATE OF 절은 PostgreSQL에서 column list 가능하지만 `OR` 분리 사용은 syntax 변형. 정확한 문법은 `BEFORE INSERT OR UPDATE OF column ON table`?
- ERRCODE = 'check_violation' — application 단 errors.ts 매핑이 가능 (mapDbErrorToResult 가 check_violation 23514 처리)?

### 3. LL-39 FormData parser

- `extractLegalDocEffectiveOverrides(formData)` helper — 구현 위치 (apps/web/src/lib/clinic-profile-schema.ts) 와 5종 closed key enum 정합?
- helper 가 Record<DocumentType, string | undefined> 반환 — zod 안 `record(z.enum([5종]), z.string().optional())` 의 partial 처리 — 미입력 key 의 record 안 키 부재 vs undefined 명시 처리 차이?
- form 안 name attribute (`<input name="legalDocEffective_privacy">`) 만 명시되어 있는데, 5 record 의 default value (현재 effective_date 또는 policy_effective_date) 가 input value 로 prefill 되는 시점/방법 명시 부재?

### 4. LL-40 CT-03 SoT 정렬

- type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) — DATA_MODEL CT-03 v0.x 의 실제 enum 정의와 일치 확인 필요. plan 본문 의 enum 정의 (`phone, email, kakao-talk, kakao-channel, naver-reservation, naver-talk, line, whatsapp ...`) 가 SoT 그대로?
- targetUrl required (cycle3 LL-40) — phone type 의 `targetUrl` 은 `tel:+82-...` URI scheme? SoT 가 phone type 의 targetUrl 형식을 명시하는지?
- DB trigger 안 elem ->> 'id' = string 검증 — DATA_MODEL CT-03 의 `@id` 가 plan 안 'id' 로 alias. alias 결정의 명시? Git 출력 시 '@id' 변환 책임자 (apps/worker · LL-CASCADE-04)?

### 5. LL-41 LL-CASCADE-04 책임 명시

- LL-CASCADE-04 가 ADMIN_UI_SKELETON_PLAN § 6 build/export 영역 — 그 § 6 본문이 현재 존재하는가? 또는 신설?
- apps/worker · M0 v1.0 build/export 함수의 시그니처 / 인터페이스 정의 — 본 plan v0.4 안 명시 부재 (cascade marker 만)?

### 6. LL-42 LL-CASCADE-05 migrations-runner

- `packages/migrations-runner` 가 placeholder 상태 — acceptance precondition 으로 sequential apply 보장 / depends_on manifest 구현이 정확히 어디 (어느 PR / cycle) 합류?
- v0.4 acceptance 시 packages/migrations-runner 가 미구현이어도 plan 자체는 acceptance? 또는 plan acceptance 차단 (cascade-precondition 의 강도)?

### 7. LL-43 3단계 안전망

- Sentry SDK 통합이 LL-DEFER-18 → M0 v1.0 본 구현. v0.4 단계에서 Sentry 미통합 — 그 사이 fallback 채널 (stdout 만? 별도 log file?) 명시?
- 3단계 안전망의 (3) "Sentry capture + 사용자 return state 는 ok: true 유지" — audit 누락에 대한 운영팀 인지 채널이 Sentry 만으로 충분? slack 알림 (notifications Feature cascade) marker 부재?

### 8. LL-44 MainLocationMissingError

- `MainLocationMissingError` — 신설 named Error class. apps/web/src/lib/errors.ts 안 export?
- 기존 `TenantResolveError` / `AuthDeniedError` 와 같은 패턴 (constructor + name property)?
- 향후 동일 패턴 (다른 invariant 검증 실패) 을 위해 일반화된 base class (`SkeletonInvariantError`)?

### 9. LL-45 build-time reference 통일

- LL-ACTION-08 (DB 안 marker 만) 과 LL-SCHEMA-12 (build-time deep clone) 의 통일된 표현 — 더 이상 충돌 없는가?
- LL-SCHEMA-18 의 표현 "build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone)" — 한 문장 안 reference 와 deep clone 양쪽 사용 — 같은 의미인지 명시?

### 10. LL-46 운영자 알림

- LL-FORM-15 안내문 위치 (form (d) 상단) — UI 의 (c) 정책 변수 섹션 변경 시도 알림 위치? (c) 안에도 동일 안내?
- "본문 직접 수정은 추후 단계에서 합류합니다" — 운영자가 직접 수정 시도 시 차단 메시지? 현재 v0.4 단계에서 LegalDocument body 가 UI 에서 노출 안 됨 (form 에 body 입력 없음) — 충돌 없음 확인?

### 11. LL-47 phase 그룹화

- 9.1 M0 v1.0 합류: LL-DEFER-01·09·11·15·18.
- 9.2 M1 Phase Alpha: LL-DEFER-02·03·06·07·10·12·13·16.
- 9.3 M2 Phase Beta: LL-DEFER-04·05.
- 9.4 Migration / 운영: LL-DEFER-14·17.
- 9.5 Closed: LL-DEFER-08.
- 총 17 개 marker — phase 별 분류 정합? M0 v1.0 의 LL-DEFER-18 (Sentry) 가 INFRA INFR-PROV provider 통합과 정합 (Spike B 단계 통합)?

### 12. 잔존 / 회귀 / closeable 신호

- cycle3 의 LL-37 (migration 의존성) 는 v0.4 의 LL-CASCADE-05 (packages/migrations-runner manifest) 로 보강. 잔존?
- audit shape: 7 row + content-saved-partial/failed = 최대 9 row. Plan v1.0 단일 emit shape 와 같이 가는 SoT?
- v0.4 단계에서 acceptance 신호 (closeableAfterPatch=true) 가능한가? 만약 1~2 minor 만 잔존이면 cycle5 에서 close 신호 가능?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 4,
  "closeableAfterPatch": false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

수렴 추세 25 → 12 → 10. cycle4 5~8 findings 예상. closeableAfterPatch 신호 cycle5 도달 기대.
