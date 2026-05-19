Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.3 cycle 3.

## Context

Cycle 2 had 8 findings — all patched in v0.3 by **applying docs cascade in plan acceptance commit** (LOCATION_LEGAL/PUBLIC_SITE_RENDER pattern):

Files patched:
- `docs/decisions/EAT_CONTENT_PLAN.md` v0.3 — plan v1.0 acceptance vs code v1.0 cycle 분리 marker + 변경 이력
- `docs/core/DATA_MODEL.md` — § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세
- `docs/core/PAGE_TYPES.md` — § 1.1 P-011 M0 ✅ · § 6 11페이지
- `docs/core/SCHEMA_MAPPING.md` — § 2 ScholarlyArticle/VideoObject 카탈로그
- `docs/core/CONTENT_STANDARDS.md` — § 7.1.1.2 ContentType 예외 표
- `docs/admin/ARCHITECTURE.md` — § 3.11 11페이지
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` — § 2.2 EAT 4 entity 변환 표
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — § 9.3 PSR-DEFER-11/15 ✅ 해소
- `packages/migrations-runner/src/manifest.ts` — orderedMigrations 16 entry

ECP-26 (Article detail SQL JOIN) 는 **EAT_CONTENT code v1.0 cycle 분리** — plan acceptance commit 외.

## Task

cycle 2 의 8개 patch 각각 검증 + 새 finding 발견. 짧게 line 단위 인용.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=N

## cycle 2 patch 검증
- ECP-23 / 24 / 25 / 26 (code v1.0 cycle 분리) / 27 / 28 / 29 / 30 각각 PASS/FAIL/PARTIAL + 한 줄 근거

## new findings (있을 경우 ECP-31+)

## acceptance 판정
- plan v1.0 acceptance commit 진행 가능 여부
```

cycle 2 의 8건이 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. minor 만 잔존이면 다음 cycle 짧게.
