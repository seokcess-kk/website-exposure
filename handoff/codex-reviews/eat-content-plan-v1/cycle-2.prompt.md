You are reviewing **cycle 2** of `docs/decisions/EAT_CONTENT_PLAN.md` v0.2. Cycle 1 had 22 findings (7 blocking + 10 major + 5 minor). All 22 patched.

## Cycle 1 patch summary

| # | severity | title | patch |
|---|---|---|---|
| ECP-01 | blocking | C-25/26/27 번호 충돌 | C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 · 25 contracts |
| ECP-02 | blocking | C-22 풀명세 컬럼 누락 | C-22 풀명세 전체 컬럼 DB 추가 (v0.1 UI minimal · EC-DEFER-10) |
| ECP-03 | blocking | Article.category_id nullable | staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL + FK) |
| ECP-04 | blocking | manifest 14단계 산술 오류 | 16단계 + 각 dependsOn 명시 |
| ECP-05 | blocking | MediaAppearance JSON-LD 분기 충돌 | 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 |
| ECP-06 | blocking | allowlist vs inline graph 모순 | graph self-contained · 풀 entity inline · cross-page allowlist 미사용 |
| ECP-07 | blocking | C-10 ContentType enum cascade 누락 | +Publication +MediaAppearance · 17종 v0.6 |
| ECP-08 | major | DOI regex DB·zod 다름 | zod 도 동일 anchored regex |
| ECP-09 | major | default seed 위치 불명확 | seed.ts + C0013 backfill |
| ECP-10·11 | major | FAQ v0.1 published 차단 + zod status subset | DB CHECK status='draft' + zod enum subset + EC-DEFER-12 신설 |
| ECP-12 | major | P-011 M0 cascade | EC-CASCADE-08 acceptance precondition 격상 |
| ECP-13 | major | Publication @id dereferenceable | fragment-scoped @id (Doctor/About page URL + fragment) |
| ECP-14 | major | allowlist fragment | graph self-contained 결정 — allowlist 변경 X |
| ECP-15 | major | About subjectOf 결정 | MedicalClinic.subjectOf 단일 결정 |
| ECP-16 | major | article_category public policy | taxonomy public 의도 명시 + EC-DEFER-10 |
| ECP-17 | major | scenario #33 query 작업 단위 | Article detail SQL JOIN article_category 명시 |
| ECP-18 | minor | authors DEFAULT 충돌 | DEFAULT 제거 |
| ECP-19 | minor | FAQ helper 2종 | renderMarkdownToPlainText 신규 |
| ECP-20 | minor | rel 통일 | nofollow noopener noreferrer |
| ECP-21 | minor | sitemap empty FAQ | 빈 페이지 200 + sitemap 포함 + lastmod fallback |
| ECP-22 | minor | 12페이지 산정 불명확 | 11 페이지 (기존 9 + P-010 + P-011) |

## Re-review scope (cycle 2)

`docs/decisions/EAT_CONTENT_PLAN.md` v0.2 (대규모 재작성) + SoT 정합 재검증:
- `docs/core/DATA_MODEL.md` § 1.1 인벤토리 + § 4 C-10/C-12/C-22 + C-04 Article category
- `docs/core/PAGE_TYPES.md` § 1.1 P-011 M0 · § 3 P-011 본문
- `docs/core/SCHEMA_MAPPING.md` § 2 entity 카탈로그 · § 3 P-011 graph
- `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x
- `docs/compliance/RISK_LEVELS.md` § 2 자동 추론
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 LegalDocument 패턴 (status='draft' + RLS published only)
- `packages/db/migrations/D0011_public_reader.sql` D0014 cascade target
- `packages/migrations-runner/src/manifest.ts` 10 → 16단계 cascade
- `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` SQL JOIN target
- `apps/web/src/lib/json-ld/__tests__/validate.ts` (cycle 1 cascade — graph self-contained 결정 후 변경 불필요)

## What to check (cycle 2)

1. cycle 1 patch 가 SoT 와 일관
2. 회귀 — manifest 16단계 / 각 dependsOn 정합 / C0013 staged 4-step 안 conflict (예: seed 시점)
3. 신규 결정 (graph self-contained / fragment-scoped @id / VideoObject 단일화 / FAQ v0.1 차단)
4. 새 finding (ECP-23+)
5. closeableAfterPatch=true 신호 — blocking 0 + major 0 시

## Output format

```
# EAT_CONTENT_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=N

## cycle 1 patch 검증
- ECP-01 ~ ECP-22 각각 PASS / FAIL / PARTIAL + 한 줄 근거

## new findings (ECP-23+)

## cascade marker / acceptance precondition (EC-CASCADE-01~09) 점검
```

가능한 한 광범위하게 보고, SoT 파일을 line 단위로 인용. 한국어로 응답.
