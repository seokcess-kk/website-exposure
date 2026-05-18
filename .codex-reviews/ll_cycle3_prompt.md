# LOCATION_LEGAL_PLAN v0.3 — codex 자동 비평 cycle 3

당신은 신중한 senior reviewer. v0.2 cycle2 12 findings 가 v0.3 patch 에서 전건 수용되었는지 + 새로 생긴 cascade 결함 + 잔존 / 회귀 + cycle1 25 findings 의 회귀 여부를 찾아라.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.3

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 · § 3.8.1 · § 3.8.2
- `docs/core/DATA_MODEL.md` v0.9 — C-01 · C-16 · C-21 · CT-02 · CT-03
- `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7
- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 § 5.5
- 기존 packages (cycle1·2 직접 확인):
  - `packages/core-content/migrations/C0001`/`C0002`/`C0004`/`C0005`
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/web/src/lib/*.ts`

## cycle2 → v0.3 patch 요약

| ID | patch |
|---|---|
| LL-26 | primary_ctas CT-03 minimal shape DB CHECK (`{id, type∈3종, label, value?/targetUrl?}`) + zod 양쪽 |
| LL-27 | LocationProfile.reservationChannels Git 출력 구성 = primary_ctas deep clone (build 시) |
| LL-28 | location_profile.clinic_profile_id NOT NULL 전 row (다지점 합류 시에도 정합) + LL-DEFER-14 data migration |
| LL-29 | ClinicProfile.locations[] >=1 = server action assertHasMainLocationAfterTx + LL-DEFER-15 DB trigger |
| LL-30 | receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 |
| LL-31 | FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema |
| LL-32 | audit 7 row sequential + per-row try/catch + `content-saved-partial`/`content-saved-failed` row |
| LL-33 | cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch |
| LL-34 | CHECK 위반 운영자 메시지에 후속 책임/화면/시점 명시 |
| LL-35 | 5 LegalDocument details a11y (LL-FORM-14) |
| LL-36 | LL-DEFER-17 cookie/other 승격 시 partial unique cascade |
| LL-37 | migration 의존성 8단계 명시 |

## 검토 관점

### 1. cycle2 patch 수용 정합

- LL-26~LL-37 각 patch 본문 반영 + 의도된 효과 충족.
- patch 가 cycle1 patch (LL-01~LL-25) 의 결정을 회귀시키지 않았는지.

### 2. LL-26 primary_ctas CT-03 DB CHECK

- `clinic_profile_primary_ctas_shape` CHECK 의 `NOT EXISTS (SELECT 1 FROM jsonb_array_elements(...))` 패턴 — Postgres CHECK constraint 가 subquery 를 허용하는지? CHECK 의 IMMUTABLE 요구사항 위반 가능성 (jsonb_array_elements 의 stability 분류)?
- 만약 CHECK 가 subquery 미지원이라면 → trigger 또는 application-level 검증만으로 fallback? 본 plan v0.3 의 결정 명시?
- enum type='phone'/'kakao'/'naver-booking' — DB 안 또 다른 enum (`cta_config_type`) 신설 vs CHECK 문자열 비교? plan 명시?

### 3. LL-27 Git 출력 구성 규칙

- build 시 LocationProfile.reservationChannels = `clinic_profile.primary_ctas` deep clone — build 측 (apps/worker · M0 v1.0 합류) 의 구현 책임이 LL-CASCADE marker 로 명시되어 있는가? 또는 별도 cascade marker?
- multi-location 시점 (LL-DEFER-04) 의 hybrid 모델 — main 은 자동 상속 + branch 는 override. 본 plan v0.3 의 LocationProfile.metadata 안에 hybrid marker 표현 가능?

### 4. LL-28 NOT NULL 전 row 적용

- 다지점 합류 (LL-DEFER UI · LL-DEFER-04) 시점에도 모든 LocationProfile row 가 clinic_profile_id NOT NULL — same-tenant 안 단일 ClinicProfile 가정 (현재 clinic_profile 의 `instance_id + slug='clinic'` 1 row 패턴) 과 정합? 향후 multi-clinic per instance 합류 시 reversal?

### 5. LL-29 assertHasMainLocationAfterTx

- tx 안에서 SELECT — withSkeletonTx 의 RLS scope (app_tenant_user role · current_instance_id) 안에서 작동? 단일 ClinicProfile.id 기준이면 race 없는가 (같은 tx 안 ClinicProfile UPSERT → SELECT → LocationProfile UPSERT 순서)?
- 0 row 시 throw — 어떤 Error class? mapDbErrorToResult 또는 별도 errors.ts 매핑?

### 6. LL-30 receptionHours/specialClosures 빈 배열

- 빈 배열의 round-trip — DB metadata 에 `"receptionHours": []`/`"specialClosures": []` 명시 저장 vs 키 자체 미저장? form 재로딩 시 빈 배열 vs null 의 차이 처리? 

### 7. LL-31 FormData naming

- `legalDoc.privacy.effectiveDate` — FormData 에 `.` 포함 키. server action 안 `Object.fromEntries(formData)` 가 nested object 자동 생성 안 함. zod 의 `record` 도 flat key 만. parsing helper 가 필요? plan 안에 helper 명시?
- 5 record 가 일부만 입력된 경우 zod Record 의 `partial` semantic 처리 — schema 에서 모든 key 의 `optional` 표현?

### 8. LL-32 audit per-row

- sequential emit + per-row try/catch + 부분 실패 처리 — `content-saved-partial` row 자체의 emit 도 실패할 수 있음 (DB connection 손실 등). 그 경우 server log 가 마지막 안전망?
- per-row try/catch 의 결정성 — emitter 가 batch 실패를 silent 무시할 위험. retry 정책 없는 best-effort 유지가 v0.3 의 명시 결정?

### 9. LL-33 cascade acceptance precondition

- LL-CASCADE-01~03 의 "동시 patch" 가 명시적인 acceptance 게이트 — plan v1.0 acceptance 시 cascade 3 문서 patch 도 acceptance 같은 commit 으로? 본 plan 의 acceptance 정의가 cascade 까지 포함하는 표현으로 정확?

### 10. LL-34 운영자 메시지

- 후속 책임 주체 (compliance-assistant Feature 합류 후 검수 큐) — 본 plan 안에서 일관된 명명? 현재 메시지가 "compliance-assistant Feature 합류" 와 "검수 큐 화면" 두 표현 사용 — 운영자 입장에서 이해 가능한 단일 표현?

### 11. LL-37 migration 의존성

- 의존성 8단계 — 본 plan 안에서 migration runner (`packages/migrations-runner`) 가 sequential apply 보장 한다고 했는데, packages/migrations-runner 가 cross-package depends_on manifest 를 지원하는가? M0_SCHEMA_PLAN cycle1 결정 (M0-07) 의 정합?

### 12. 잔존 / 새 minor

- v0.3 의 LL-FORM-04 (policyContactPhone form required) — DB CHECK 는 NULL 허용 (LL-SCHEMA-10). form 과 DB 정책 차이 명시?
- v0.3 의 LL-ACTION-06 자동 재렌더링 — 운영자가 form 다시 저장 시 모든 LegalDocument body 재렌더링 — 운영자가 의도하지 않은 변수 변경 (예: clinic.name 정정) 시 본문 자동 갱신은 의도? 운영자 알림 marker?
- LL-CASCADE-02 의 audit matrix row 추가 — content-saved-partial · content-saved-failed 도 row 신설인지 또는 기존 content-saved 의 outcome 분기인지?
- LL-DEFER 17개 — 다지점/M0 v1.0/M1/M2/M3 부속 정리 — 본 plan 안에서 phase 별 그룹화로 정리?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 3,
  "closeableAfterPatch": false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

cycle2 12 findings → cycle3 6~10 findings 통상 (수렴 추세). closeableAfterPatch: true 가 5~6 cycle 안에 도달 기대.
