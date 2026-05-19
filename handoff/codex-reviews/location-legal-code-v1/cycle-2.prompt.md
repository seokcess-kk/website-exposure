You are reviewing the **code implementation** of `docs/decisions/LOCATION_LEGAL_PLAN.md v1.0`. This is **cycle 2** — cycle 1 had 14 findings (blocking=4, major=8, minor=2). All findings were patched. Verify convergence and surface remaining issues.

## Cycle 1 findings recap

| # | severity | title | patch summary |
|---|---|---|---|
| LLC-01 | blocking | ARCH § 3.8.2 변수 화이트리스트 11개 cascade | ARCH § 3.8.2 body 행 + 별도 화이트리스트 표 추가 (clinic 4 + location 3 + policy 4) |
| LLC-02 | blocking | ADMIN_UI § 5.5 audit matrix cascade | LocationProfile/LegalDocument/content-saved-partial/content-saved-failed 4 row 추가 |
| LLC-03 | blocking | CONTENT_STANDARDS § 7 LegalDocument 면제 | § 7.1.1.1 신설 — answer-first AST · 표현 검사 · RiskRule · RiskInference 면제 표 + 변수 화이트리스트 별도 룰 |
| LLC-04 | blocking | migrations-runner manifest spec | `packages/migrations-runner/src/manifest.ts` 신설 — 9-step ordered migrations (D0010 → C0001 → C0002 → C0003 → C0004 → C0005 → C0006 → C0007 → C0008) + dependsOn + validateManifest |
| LLC-05 | major | effectiveDate override 가 body 에 미반영 | `actions.ts` 의 docType 루프 안에서 override 적용 후 doc 별 renderCtx 생성 → renderTemplate 호출 |
| LLC-06 | major | LegalDocument upsert ON CONFLICT slug 만 | `ON CONFLICT (instance_id, document_type) WHERE document_type IN (5종) DO UPDATE` 로 변경 |
| LLC-07 | major | build-time template 검증 build gate 미연결 | `packages/core-content/package.json` build script 끝에 `node dist/templates/__tests__.js` 체이닝 |
| LLC-08 | major | businessHours/details a11y | businessHours row 의 휴진 checkbox `aria-controls`/`aria-expanded`, input `aria-describedby`, 에러 메시지 `role="alert"`. LegalDocument details summary `aria-controls`, 본문 group `role="group"` + `aria-labelledby` |
| LLC-09 | major | fallback audit payload reason 누락 | `failedDetails[]` 와 `reason` (첫 실패 code/name) 추가 |
| LLC-10 | major | LocationProfile.phone DB CHECK 없음 | C0002 에 `location_profile_phone_format` CHECK + drizzle schema + errors.ts 매핑 |
| LLC-11 | major | effective_date DB default Asia/Seoul | C0006 에 `DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date)` + drizzle schema 주석 |
| LLC-12 | major | tenant B 403 보장 불명확 | 명시적 `ForbiddenAccessPage` 컴포넌트 분리 + Next 14 한계 + LL-DEFER-21 marker (Next 15 unauthorized()/forbidden() cascade) |
| LLC-13 | minor | C0008 backfill preflight 명시 | C0008 주석에 preflight UPDATE 쿼리 + fail-fast 의도 명시 |
| LLC-14 | minor | Drizzle FK deferrable marker | `schema.ts` 의 clinicFk 주석 강화 (Drizzle 미지원 + raw SQL SoT + migrations-runner 책임) |

## Re-review scope

다음 파일과 docs 를 다시 읽고 cycle 1 patch 가 제대로 적용됐는지 + 새 finding 이 생기지 않았는지 검증하라.

### Code
1. `packages/core-content/migrations/C0002_location_profile.sql`
2. `packages/core-content/migrations/C0006_legal_document.sql`
3. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql`
4. `packages/core-content/src/schema.ts`
5. `packages/core-content/src/templates/{index.ts, render.ts, bodies.ts, __tests__.ts}`
6. `packages/core-content/package.json`
7. `packages/migrations-runner/src/index.ts`
8. `packages/migrations-runner/src/manifest.ts` (신규)
9. `apps/web/src/lib/clinic-profile-schema.ts`
10. `apps/web/src/lib/errors.ts`
11. `apps/web/src/components/forms/ClinicProfileForm.tsx`
12. `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx`
13. `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts`

### Docs
14. `docs/admin/ARCHITECTURE.md` § 3.8.2 (LL-CASCADE-01)
15. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 (LL-CASCADE-02)
16. `docs/core/CONTENT_STANDARDS.md` § 7.1.1.1 (LL-CASCADE-03)
17. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` (LL-CASCADE-04 — cycle 1 통과)
18. `docs/decisions/LOCATION_LEGAL_PLAN.md` (plan v1.0 SoT — patch 가 본 plan 의 결정과 충돌하지 않는지)

## What to check (cycle 2)

1. **cycle 1 patch 가 plan SoT 와 일관**한지 — 특히:
   - LLC-05 patch: doc 별 renderCtx 분리 후 `policy.effectiveDate` 값이 DB `effective_date` 와 정확히 일치
   - LLC-06 patch: `ON CONFLICT (instance_id, document_type) WHERE ...` 의 partial UNIQUE constraint syntax 가 Postgres syntax 정확성
   - LLC-08 patch: 새로 추가한 ARIA 속성이 WCAG 2.1 / WAI-ARIA 표준 정합
   - LLC-09 patch: `failedDetails[]` 구조가 추후 Sentry breadcrumb 으로 직렬화 가능
   - LLC-11 patch: DB default 의 `(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date` syntax 가 Postgres 13+ 호환
   - LLC-12 patch: `LL-DEFER-21` 신설은 plan 변경이지만 plan 자체 patch 가 안 된 상태 — 새 finding 가능
   - LLC-04 manifest: `validateManifest` 가 dependsOn 검증 sound 한지, C0003 추가가 plan § 6 (8단계) 와 어긋나는 의도가 있는지

2. **회귀 (regression)**:
   - LLC-05 patch 후 `RenderContext` 타입 호환 (policy.effectiveDate 가 doc 별 dynamic 으로 변경됨)
   - form a11y patch 후 기존 시각적 레이아웃 깨짐 가능성
   - LLC-12 의 ForbiddenAccessPage 가 server component 안 호출 OK 한지

3. **새 cascade 결정 (LL-DEFER-21)**:
   - LLC-12 patch 의 LL-DEFER-21 marker 가 plan 본문에 반영 안 됨 — plan v1.0 patch 가 acceptance commit 안에 동반되어야 하는지 (cycle 7 patch?)

4. **plan acceptance precondition cascade (LL-CASCADE-01~05)** 전수 점검:
   - LL-CASCADE-01: docs/admin/ARCHITECTURE.md § 3.8.2 — patch 후 11개 변수 화이트리스트 보존?
   - LL-CASCADE-02: docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 — 4 row 추가 보존?
   - LL-CASCADE-03: docs/core/CONTENT_STANDARDS.md — § 7.1.1.1 새로 신설된 위치가 적절한가?
   - LL-CASCADE-04: docs/decisions/M0_BUILD_EXPORT_PLAN.md — 통과 (cycle 1)
   - LL-CASCADE-05: packages/migrations-runner — manifest 작성 완료. validateManifest call site 가 있는가? 없으면 spec 만으로 acceptance 충분한가 (LL-DEFER-20 cascade)?

## Output format

```
# LOCATION_LEGAL code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=14 (4+8+2) → cycle2=N (B+M+m)

## cycle 1 patch 검증
- LLC-01 ~ LLC-14 각각 PASS / FAIL / PARTIAL 판정 + 근거 한 줄

## new blocking / major / minor
(있을 경우 LLC-15+ 부터 번호 부여)

## acceptance precondition (LL-CASCADE-01~05) 재점검
- LL-CASCADE-01: <PASS|FAIL>
- LL-CASCADE-02: <PASS|FAIL>
- LL-CASCADE-03: <PASS|FAIL>
- LL-CASCADE-04: <PASS|FAIL>
- LL-CASCADE-05: <PASS|FAIL>
```

cycle 1 의 14 findings 가 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. minor 만 잔존하면 다음 cycle 에서 마무리.

가능한 한 광범위하게 보고, 추측이 아니라 파일을 실제로 읽고 line 단위로 인용하라. 한국어로 응답.
