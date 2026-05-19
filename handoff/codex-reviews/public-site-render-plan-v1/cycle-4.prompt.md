You are reviewing **cycle 4** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4. Cycle 3 had 2 findings (0 blocking + 1 major + 1 minor):

| # | severity | title | patch summary |
|---|---|---|---|
| PSR-29 | major | acceptance scenario #21 themeColor stale | `#2563eb` (light) / `#60a5fa` (dark) — BrandTokens.colors.light/dark.primary default |
| PSR-30 | minor | robots.txt SoT line-by-line 정합 | 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap `{domain}` placeholder 통일 |

추가 cascade 실 적용:
- `docs/admin/ARCHITECTURE.md` § 3.12 신설 — PSR-CASCADE-01a `apps/web` route group `(admin)` + `(site)` 분리 + `/admin/<slug>` prefix 격상 marker
- `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader app_public_reader_pw` 추가 (PSR-CASCADE-05)

## Re-review scope (cycle 4)

### Patch 가 적용된 파일
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4 (scenario #21 + robots.txt 본문 + 변경 이력 v0.4 entry)
- `docs/admin/ARCHITECTURE.md` § 3.12 (신규)
- `apps/spike-a/pgbouncer/userlist.txt` (1줄 추가)

### 기존 검증 SoT
- `docs/core/SEARCH_STANDARDIZATION.md` § 3.3 (robots.txt 출력 예시 SoT)
- `docs/core/DESIGN_TOKENS.md` § 3.2 + § 6 BrandTokens
- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02 path-based 표 PASS)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 (PSR-CASCADE-03 SSR 재사용 표 PASS)
- `packages/migrations-runner/src/manifest.ts` (D0011 entry PASS)

## What to check (cycle 4)

1. **cycle 3 patch 완전성**:
   - PSR-29: scenario #21 의 themeColor 기대값 `#2563eb` / `#60a5fa` 가 SoT (DESIGN_TOKENS § 3.2 `color.brand.primary` light=`blue.600` (#2563eb) · dark=`blue.400` (#60a5fa)) 정합
   - PSR-30: PUBLIC_SITE_RENDER_PLAN robots.txt starter 가 SEARCH_STANDARDIZATION § 3.3 출력 예시와 entry-by-entry + comment-by-comment 정합
   - PSR-CASCADE-01a: ARCH § 3.12 신설 → PSR-CASCADE-01a PASS 판정 가능한가
   - PSR-CASCADE-05: userlist.txt 에 `app_public_reader` 항목 추가 → PSR-CASCADE-05 PASS 판정 가능한가

2. **closeableAfterPatch 신호**:
   - 본 cycle blocking=0 + major=0 + minor=0 잔존 → closeableAfterPatch=true (acceptance 신호)
   - minor 1건 잔존 시 다음 cycle 짧게

3. **acceptance precondition (PSR-CASCADE-01~05) 최종**:
   - PSR-CASCADE-01a (docs · plan acceptance commit): 적용?
   - PSR-CASCADE-01b (코드 · 별 code v1.0 cycle): plan acceptance precondition 외 — code v1.0 milestone 의 작업
   - PSR-CASCADE-02 (SCHEMA_MAPPING § 1.2): cycle 3 에서 PASS
   - PSR-CASCADE-03 (M0_BUILD_EXPORT_PLAN § 2.1): cycle 3 에서 PASS
   - PSR-CASCADE-04 (manifest D0011): cycle 3 에서 PASS
   - PSR-CASCADE-05 (pgbouncer userlist): 적용?

4. **새 finding** (있을 경우 PSR-31+ 부터 — 짧게)

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=N

## cycle 3 patch 검증
- PSR-29: PASS / FAIL / PARTIAL — 근거
- PSR-30: 동일
- PSR-CASCADE-01a (ARCH § 3.12): 동일
- PSR-CASCADE-05 (pgbouncer): 동일

## new blocking / major / minor (PSR-31+)

## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
- 01a: <PASS|FAIL>
- 01b: <plan acceptance 외 — code v1.0 milestone>
- 02: PASS
- 03: PASS
- 04: PASS
- 05: <PASS|FAIL>

## acceptance 판정
- closeableAfterPatch=true: yes/no
- 누계 통계 + plan v1.0 acceptance commit 권고
```

cycle 3 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true. 한국어로 응답.
