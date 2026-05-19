You are reviewing **cycle 2** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md`. Cycle 1 had **21 findings** (6 blocking + 11 major + 4 minor). All were patched in v0.2. Verify convergence and surface remaining issues.

## Cycle 1 findings recap (PSR-01~21)

| # | severity | title | patch summary |
|---|---|---|---|
| PSR-01 | blocking | M0 페이지 선택 오류 | P-009 미합류 + P-014 합류 + P-010 1샘플. § 1.2/§ 2.1 표 정정 |
| PSR-02 | blocking | admin URL 충돌 | `/admin/<slug>/...` prefix 격상. § 2.1 PSR-ROUTE-02 + § 8 작업 #15 + PSR-CASCADE-01 격상 |
| PSR-03 | blocking | nested `<html>/<body>` 중복 | site layout = fragment only. § 4.1 PSR-COMP-01·02 정정 |
| PSR-04 | blocking | robots.txt aiCrawlerPolicy 미반영 | SEARCH_STANDARDIZATION § 3 `disallowTraining` starter + 학습 봇 Disallow + 답변/검색 봇 Allow + Naver Yeti. § 5.3 PSR-SEO-08·09 |
| PSR-05 | blocking | app_public_reader instance slug resolve 불가 | D0011 안 instance lookup policy + content table per-table policy 7개. LOGIN 결정 + production NOLOGIN marker PSR-DEFER-16 |
| PSR-06 | blocking | LegalDocument draft 공개 노출 | v0.1 단계 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 = LL-DEFER-01 alias. § 3.2 PSR-DATA-07 정정 |
| PSR-07 | major | JSON-LD graph SoT 불일치 | § 5.4 표 SoT 그대로 (P-012 WebPage+MedicalClinic 풀, P-014 합류) |
| PSR-08 | major | @id path-based cascade detail | PSR-CASCADE-02 보강 — entity continuity migration note |
| PSR-09 | major | sitemap changefreq/priority/lastmod | SEARCH_STANDARDIZATION § 4.3·§ 4.4 표 그대로 반영 |
| PSR-10 | major | theme-color + og:type 누락 | themeColor 2값 + P-004 profile · P-006/P-010 article. § 5.1 PSR-SEO-01·02·03 |
| PSR-11 | major | Article URL 패턴 | `/insights/[category]/[slug]` · v0.1 single fallback `general` · PSR-DEFER-15 |
| PSR-12 | major | Drizzle ↔ contract mapping 부재 | § 4.2 PSR-COMP-05 표 추가 (TreatmentPage.title=name, Article.title=headline 등) |
| PSR-13 | major | Tailwind alias semantic 22 매핑 부재 | § 4.5 PSR-COMP-10 표 추가 (round-trip 보장) |
| PSR-14 | major | dark mode "light only" 모순 | CSS vars light + dark 둘 다 출력 · UI toggle 만 PSR-DEFER-03 |
| PSR-15 | major | per-table policy 미명시 | D0011 안 CREATE POLICY 7개 명시 |
| PSR-16 | major | LegalDocument DB CHECK 충돌 | RLS published만 SELECT — DB CHECK draft만 허용과 정합 → 404 자동 |
| PSR-17 | major | 외부 JSON-LD validator 게이트 | 자체 rule checker LOCAL_PASS · 외부 validator manual QA · PSR-DEFER-14 |
| PSR-18 | minor | scenario #1 문구 반대 | "보임" 정정 |
| PSR-19 | minor | DOMPurify SSR 문제 | `sanitize-html` 채택 + `rehype-sanitize` 전환 marker PSR-DEFER-17 |
| PSR-20 | minor | rel noreferrer 결정 | `nofollow noopener noreferrer` |
| PSR-21 | minor | env/pgbouncer/role cascade | § 6 PSR-ENV-01 acceptance checklist 12 항목 |

## Re-review scope (cycle 2)

### Patch 가 적용된 파일
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.2 (대규모 재작성)

### Cascade target docs (변경 없음 — 본 plan 의 cascade marker reference)
- `docs/admin/ARCHITECTURE.md` (PSR-CASCADE-01)
- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 (PSR-CASCADE-03)
- `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04)
- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)

### 검증 추가 SoT
- `docs/core/PAGE_TYPES.md` — P-014 추가 정합
- `docs/core/SCHEMA_MAPPING.md` — § 2.5 + § 3 entity 풀/참조 정합
- `docs/core/SEARCH_STANDARDIZATION.md` — § 3 robots + § 4.3 sitemap + § 2.1 메타
- `docs/core/DESIGN_TOKENS.md` — § 3.2 semantic 22 + § 3.3 light/dark
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument DB CHECK
- `packages/core-content/src/schema.ts` — Drizzle SoT 실 column 명

## What to check (cycle 2)

1. **cycle 1 patch 가 SoT 와 일관**한지:
   - PSR-01 의 10페이지 (P-001/002/003/004/005/006/010/012/013/014) 가 PAGE_TYPES.md M0 column 정합
   - PSR-04 의 robots starter 가 SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시와 entry-by-entry 정합
   - PSR-09 의 sitemap 표가 SEARCH_STANDARDIZATION § 4.3 표와 cell-by-cell 정합
   - PSR-12 의 DB field mapping 표가 schema.ts 실 column 명과 entry-by-entry 정합
   - PSR-13 의 Tailwind alias 표가 DESIGN_TOKENS § 3.2 semantic 22 round-trip
   - PSR-15 의 D0011 per-table policy 가 모든 6 content table + instance 포함 (총 7개)
   - PSR-16 LegalDocument RLS USING `status='published'` 가 LL-SCHEMA-03 의 CHECK `status='draft'` 와 정합 (=400 자동 충돌 없음)

2. **회귀 (regression)**:
   - PSR-02 admin URL 변경의 회귀 영향 — sign-in/sign-out/cleanup/api/seed.ts/forms revalidatePath/dashboard route 모두 패치 영향
   - PSR-03 root layout 은 변경 없음 — site layout fragment 만의 영향이 root layout 의 className conflict 없는지
   - PSR-06 LegalDocument 의 footer 링크 — Footer 가 5종 정책 페이지 링크를 표시하면 404 link 표시 (운영자에 혼란 가능)

3. **새 cascade marker (PSR-DEFER-13~17, PSR-CASCADE-01 격상)**:
   - PSR-DEFER-13 = LL-DEFER-01 alias 의 phase 분류 (§ 9.1 M0 v1.0)
   - PSR-DEFER-14 (외부 validator manual QA) 의 phase (§ 9.4)
   - PSR-DEFER-15 (Article category) 의 phase 합류 시점
   - PSR-DEFER-16 (NOLOGIN/MEMBERSHIP production)
   - PSR-DEFER-17 (sanitize-html → rehype-sanitize 전환)
   - PSR-CASCADE-01 격상 — acceptance precondition 코드 cascade 가 LOCATION_LEGAL code v1.1 + ADMIN_UI_SKELETON code v1.1 patch 동반 필요

4. **acceptance precondition (PSR-CASCADE-01~05)** 최종 점검

5. **새 finding** (만약 있다면 PSR-22+ 부터)

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=N (B+M+m)

## cycle 1 patch 검증
- PSR-01 ~ PSR-21 각각 PASS / FAIL / PARTIAL + 근거 한 줄

## new blocking / major / minor (PSR-22+)

## acceptance precondition (PSR-CASCADE-01~05) 재점검
- PSR-CASCADE-01: <PASS|FAIL|TBD>
- ...
```

cycle 1 21 findings 가 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. minor 잔존이면 다음 cycle 짧게.

가능한 한 광범위하게 보고, 파일을 직접 line 단위로 인용하라. 한국어로 응답.
