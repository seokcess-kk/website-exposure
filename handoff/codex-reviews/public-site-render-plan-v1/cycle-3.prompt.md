You are reviewing **cycle 3** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3. Cycle 2 had **7 findings** (2 blocking + 4 major + 1 minor). All were patched. Verify convergence and surface remaining issues.

## Cycle 2 findings recap

| # | severity | title | patch summary |
|---|---|---|---|
| PSR-22 | blocking | robots.txt SoT 불일치 | starter 가 SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot B Allow, Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allow` 정정 |
| PSR-23 | major | themeColor 출처 | `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화) — SEARCH_STANDARDIZATION § 2.1 정합 |
| PSR-24 | blocking | admin URL cascade 미적용 | PSR-CASCADE-01 a/b 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴 |
| PSR-25 | major | manifest D0011 미적용 | `packages/migrations-runner/src/manifest.ts` 에 D0011 entry 추가 (10단계) |
| PSR-26 | major | Footer 법적 링크 broken | v0.1 단계 숨김 + 합류 후 동적 추가 |
| PSR-27 | minor | pgbouncer 경로 stale | `apps/spike-a/pgbouncer/userlist.txt` 정확 경로 |
| PSR-28 | major | root layout className 불일치 | plan acceptance precondition 명시 — Tailwind v0.2 + globals.css + root layout className 변경 동시 적용 |

추가 cascade 실 적용:
- `docs/core/SCHEMA_MAPPING.md` § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03)

## Re-review scope (cycle 3)

### Patch 가 적용된 파일
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3
- `docs/core/SCHEMA_MAPPING.md` § 1.2 (신규 path-based 표 + entity continuity)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 (신규 SSR 재사용 표)
- `packages/migrations-runner/src/manifest.ts` (D0011 entry 추가)

### 기존 검증 SoT
- `docs/core/PAGE_TYPES.md`, `docs/core/SCHEMA_MAPPING.md` (§ 2.5 + § 3), `docs/core/SEARCH_STANDARDIZATION.md` (§ 3.1 4계열 + § 3.3 출력), `docs/core/DESIGN_TOKENS.md`, `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1, `packages/core-content/src/schema.ts`

## What to check (cycle 3)

1. **cycle 2 patch 가 SoT 와 일관**한지:
   - PSR-22 robots.txt starter 가 SEARCH_STANDARDIZATION § 3.3 출력 예시 정확 일치 (line-by-line)
   - PSR-23 themeColor 출처가 SEARCH_STANDARDIZATION § 2.1 + DESIGN_TOKENS § 6 BrandTokens 정합
   - PSR-24 CASCADE-01 a/b 분리 의도 — LOCATION_LEGAL plan/code 분리 패턴과 정합 (LOCATION_LEGAL_PLAN.md acceptance commit 안 docs cascade 만 포함, 코드 cascade 는 별 milestone code v1.0)
   - PSR-25 manifest.ts D0011 entry 의 dependsOn / creates 정합 — validateManifest() 가 dependency 검증 PASS
   - PSR-26 Footer 법적 링크 숨김 결정의 시나리오 영향 (시나리오 8 LegalDocument 404 정합)
   - PSR-27 pgbouncer 경로 정확
   - PSR-28 root layout className acceptance precondition 명시 — § 8 작업 #14 안 명시
   - PSR-CASCADE-02 SCHEMA_MAPPING § 1.2 path-based 표 — entity continuity 전환 룰 sound
   - PSR-CASCADE-03 M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표 — apps/worker 구현 시 컴포넌트 재사용 정합

2. **회귀 (regression)**:
   - manifest.ts validateManifest 안 D0011 의 dependsOn ["instance", "clinic_profile", ...] 가 이전 entries 의 creates 안 모두 존재
   - SCHEMA_MAPPING § 1.2 의 v0.1 임시 표가 SoT 표 (도메인 매핑 후) 와 entity-by-entity 정합 (Organization, MedicalClinic, Physician, MedicalProcedure, Article, WebSite, WebPage 7개)
   - M0_BUILD_EXPORT_PLAN § 2.1 의 컴포넌트 위치가 plan v0.3 § 8 작업 단위와 정확히 정합

3. **acceptance precondition (PSR-CASCADE-01~05) 최종 점검**:
   - PSR-CASCADE-01a: docs/admin/ARCHITECTURE.md § 3 patch — 아직 적용 안 됨 (TBD/FAIL)
   - PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 — PASS (적용)
   - PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2.1 — PASS (적용)
   - PSR-CASCADE-04: manifest.ts D0011 — PASS (적용)
   - PSR-CASCADE-05: pgbouncer userlist.txt — 아직 미적용 (코드 cascade) — TBD/FAIL
   - PSR-CASCADE-01b: code v1.0 cycle 분리 marker — 본 plan acceptance 의 acceptance precondition 외

4. **새 finding** (있을 경우 PSR-29+ 부터)

5. **closeableAfterPatch 신호**:
   - blocking 0 + major 0 → closeableAfterPatch=true (acceptance 신호)
   - minor 잔존이면 다음 cycle 짧게

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=7 (2+4+1) → cycle3=N (B+M+m)

## cycle 2 patch 검증
- PSR-22 ~ PSR-28 + 추가 cascade 02·03 각각 PASS / FAIL / PARTIAL + 근거 한 줄

## new blocking / major / minor (PSR-29+)

## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
- PSR-CASCADE-01a: <PASS|FAIL|TBD>
- PSR-CASCADE-01b: <plan acceptance 외 — code v1.0 cycle marker>
- PSR-CASCADE-02: <PASS|FAIL|TBD>
- PSR-CASCADE-03: <PASS|FAIL|TBD>
- PSR-CASCADE-04: <PASS|FAIL|TBD>
- PSR-CASCADE-05: <PASS|FAIL|TBD>

## 누계 통계 + acceptance 권고
- cycle 1·2·3 합산 findings: <N>
- 본 cycle 결과 plan v1.0 acceptance 가능 여부
```

cycle 2 7건이 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. 한국어로 응답.
