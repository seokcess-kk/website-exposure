You are reviewing **cycle 3** of `docs/decisions/EAT_CONTENT_PLAN.md` v0.3. Cycle 2 had 8 findings (4 blocking + 4 major). All 8 patched by docs cascade 실 적용 (plan acceptance commit 안 docs cascade — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합).

## Cycle 2 patch summary

| # | severity | title | patch |
|---|---|---|---|
| ECP-23·27 | blocking·major | DATA_MODEL/SCHEMA_MAPPING SoT 미동기화 | DATA_MODEL § 1.1 25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 |
| ECP-24 | blocking | migration cascade 미적용 | manifest.ts orderedMigrations 16 entry (spec only · runner 실 코드는 별 cycle) |
| ECP-25 | blocking | PAGE_TYPES P-011 M0 미합류 | § 1.1 ✅ + § 6 11페이지 |
| ECP-26 | blocking | Article detail SQL JOIN 미적용 | **code v1.0 cycle 로 분리** — plan acceptance commit 외 |
| ECP-28 | major | CONTENT_STANDARDS 미동기화 | § 7.1.1.2 ContentType 예외 표 추가 |
| ECP-29 | major | RISK_LEVELS FAQ 자동 추론 cascade 불완전 | DATA_MODEL § 4 C-12 풀명세 안 명시 |
| ECP-30 | major | D0014 patterns | D0014_public_reader_eat.sql — code v1.0 cycle (실 마이그레이션 파일 작성 분리) |

추가 plan 본문 정정:
- plan v0.3 헤더 — plan acceptance commit (docs only) vs EAT_CONTENT code v1.0 cycle (실 코드) 분리 marker 명시
- ARCH § 3.11 게이트 #1 11 페이지 patch
- M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표 신규
- PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ 해소

## Re-review scope (cycle 3)

### 본 plan
- `docs/decisions/EAT_CONTENT_PLAN.md` v0.3 (헤더 + 변경 이력)

### docs cascade (실 patch 확인)
- `docs/core/DATA_MODEL.md` § 1.1 인벤토리 · § 4 C-04/C-10/C-12/C-22/C-24/C-25
- `docs/core/PAGE_TYPES.md` § 1.1 P-011 · § 6 페이지 합계
- `docs/core/SCHEMA_MAPPING.md` § 2 entity 카탈로그
- `docs/core/CONTENT_STANDARDS.md` § 7.1.1.2 ContentType 예외 표
- `docs/admin/ARCHITECTURE.md` § 3.11 게이트 #1
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.2 EAT 4 entity 변환 표
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` § 9.3 PSR-DEFER-11/15 해소 marker
- `packages/migrations-runner/src/manifest.ts` orderedMigrations 16 entry

## What to check (cycle 3)

1. cycle 2 patch 가 SoT 와 일관
2. plan acceptance commit / code v1.0 cycle 분리 의도 정합 (ECP-26 처리)
3. validateManifest 의 dependsOn 검증 PASS (각 entry 의 dependsOn 이 이전 entries 의 creates 안 모두 존재)
4. PSR-DEFER-11/15 해소 marker — plan acceptance commit 안 함께 patch 정합
5. 새 finding (ECP-31+)
6. closeableAfterPatch=true 신호 — blocking 0 + major 0 잔존 시

## Output format

```
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=8 (4+4+0) → cycle3=N

## cycle 2 patch 검증
- ECP-23 ~ ECP-30 각각 PASS / FAIL / PARTIAL + 한 줄 근거

## new findings (ECP-31+)

## cascade marker (EC-CASCADE-01~09) 점검
```

가능한 한 광범위하게 보고, SoT 파일을 line 단위로 인용. 한국어로 응답.
