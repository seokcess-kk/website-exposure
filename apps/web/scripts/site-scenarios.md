# PUBLIC_SITE_RENDER code v1.0 — 시나리오 LOCAL_PASS 매트릭스

> SoT: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 7 시나리오 1~23.
> 본 문서는 unit test 로 자동화하지 않은 e2e 시나리오를 사용자가 직접 검증할 수 있도록 정리합니다.

## A. 자동화 완료 (vitest)

`pnpm --filter @glitzy/web test:scenarios` 로 한 번에 검증. **33 tests PASS**.

| 시나리오 | 검증 위치 |
|---|---|
| #10 JSON-LD `@graph` 페이지별 entity 풀/참조 정합 | `src/lib/json-ld/__tests__/validate.test.ts` |
| #13 XSS payload escape (execution 불가) | `src/lib/markdown.test.ts` |
| #18 자체 JSON-LD rule checker 통과 | `src/lib/json-ld/__tests__/validate.test.ts` |
| #20 외부 링크 `rel="nofollow noopener noreferrer"` + 내부/external/protocol-relative | `src/lib/markdown.test.ts` |
| #21 themeColor 2값 (`#2563eb` light · `#60a5fa` dark) | `src/lib/site-metadata.test.ts` |
| #22 og:type P-004 profile / P-006·P-010 article | `src/lib/site-metadata.test.ts` |
| #23 P-013 Legal noindex | `src/lib/site-metadata.test.ts` |
| (보조) businessHours strict narrowing | `src/lib/db-projection.test.ts` |
| (보조) PSRC-21 cross-tenant ref forbidden | `src/lib/json-ld/__tests__/validate.test.ts` |
| (보조) PSRC-09 PUBLIC_SITE_ORIGIN env 우선 | `src/lib/site-metadata.test.ts` |

## B. e2e 수동 검증 (Docker + DB + 어드민 입력)

### 환경 준비

```bash
# 1) Postgres + pgbouncer 컨테이너 (spike-a 환경 재사용)
pnpm spike-a:up

# 2) glitzy_dev database 생성 + 마이그레이션 sequential apply
#    apps/spike-a 의 docker compose 안 spike_a DB 와 별개로 glitzy_dev 생성:
docker exec -it spike-a-postgres psql -U postgres -c "CREATE DATABASE glitzy_dev;"

# 3) packages/migrations-runner manifest 순서대로 apply (manifest.ts orderedMigrations 10단계)
#    수동 apply (M0 v1.0 runner 코드 합류 전):
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/db/migrations/D0010_instance.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0001_clinic_profile.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0002_location_profile.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0003_doctor_profile.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0004_treatment_page.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0005_article.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0006_legal_document.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
docker exec -i spike-a-postgres psql -U postgres -d glitzy_dev < packages/db/migrations/D0011_public_reader.sql

# 4) D0011 password 별도 설정 (PSRC-04 patch — migration 안 하드코딩 제거)
docker exec spike-a-postgres psql -U postgres -d glitzy_dev -c "ALTER ROLE app_public_reader PASSWORD 'app_public_reader_pw';"

# 5) apps/web/.env 작성 (.env.example 복사)
cp apps/web/.env.example apps/web/.env
# WEB_DATABASE_URL, WEB_PUBLIC_DATABASE_URL, SEED_DATABASE_URL 세 값을 5435 포트로 적당히 (postgres password 도 postgres)

# 6) seed 실행 — 인스턴스 + admin 계정 생성
pnpm web:seed --email=test@glitzy.kr --display-name=테스터 --instance-slug=glitzy-clinic --instance-name="Glitzy 한의원"

# 7) Next 개발 서버
pnpm web:dev
```

### 시나리오 매트릭스

| # | 시나리오 | 통과 기준 | 검증 방법 |
|---|---|---|---|
| 1 | ClinicProfile 저장 → P-001 Home 표시 | `/glitzy-clinic` 응답 안 clinic.name · description · primaryCtas[0].label 가시 | 어드민 `/admin/glitzy-clinic/clinic-profile` 에서 저장 후 `/glitzy-clinic` 진입 |
| 2 | DoctorProfile 3건 등록 → `/<slug>/doctors` 3 card | 3개 카드 displayOrder ASC 순서 | 어드민 doctors 추가 3 row → public `/glitzy-clinic/doctors` |
| 3 | active=false 한 row 제외 | 2 card 만 노출 | doctor 편집에서 active 토글 |
| 4 | TreatmentPage status=draft → 리스트 미노출 | 0건 | 어드민 treatments draft 저장 → public `/glitzy-clinic/treatments` |
| 5 | TreatmentPage published + publishedAt now() → 노출 | 1건 | 어드민 status=published + publishedAt 입력 |
| 6 | Treatment Detail body_markdown 렌더 | `<h1>`/`<h2>`/`<p>` 표준 출력 | `/glitzy-clinic/treatments/<slug>` |
| 7 | Article published 5건 + draft 3건 → 5건만 | published only | seed 안 article fixture 또는 어드민 articles |
| 8 | LegalDocument 5종 draft → `/legal/<type>` 항상 404 | Next `notFound()` (DB CHECK status=draft + RLS published only) | `curl -I http://localhost:3000/glitzy-clinic/legal/privacy` → 404 |
| 9 | tenant A 가 `/<tenantB>` 접근 → B 콘텐츠만 | RLS app_public_reader USING instance_id 정합 | seed 로 2 instance 생성 후 cross-access |
| 11 | sitemap.xml 응답 | XML 응답 200 + 9 페이지 + 동적 slug + SEARCH_STANDARDIZATION § 4.3 changefreq/priority | `curl http://localhost:3000/glitzy-clinic/sitemap.xml` |
| 12 | robots.txt 응답 | text/plain 200 + AI 크롤러 4계열 정합 (§ 3.3 disallowTraining) | `curl http://localhost:3000/glitzy-clinic/robots.txt` |
| 14 | active=false instance → `/<slug>` 404 | `notFound()` (instance lookup policy USING active=true) | `UPDATE instance SET active=false WHERE slug='glitzy-clinic';` 후 진입 |
| 15 | admin `/admin/<slug>/...` 와 public `/<slug>/...` 분리 | 충돌 없음 + sign-in/consume redirect `/admin/<firstSlug>` | sign-in flow + 어드민/공개 동시 접근 |
| 17 | sitemap lastmod ISO 8601 형식 | YYYY-MM-DDTHH:mm:ss.sssZ | `curl .../sitemap.xml` grep lastmod |
| 19 | LocationProfile.metadata.businessHours CT-02 SoT → contact/locations 7요일 + 점심 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표 | 어드민 ClinicProfile 안 businessHours 입력 → `/glitzy-clinic/contact` + `/glitzy-clinic/locations/main` |

### 검증 명령 예시

```bash
# Home + JSON-LD inline 확인
curl -s http://localhost:3000/glitzy-clinic | grep -A 50 'application/ld+json'

# sitemap.xml 확인
curl -s http://localhost:3000/glitzy-clinic/sitemap.xml | head -40

# robots.txt SoT 정합 확인
curl -s http://localhost:3000/glitzy-clinic/robots.txt

# tenant isolation: cross-instance 접근
curl -I http://localhost:3000/non-existent-slug    # → 404

# LegalDocument 항상 404 (v0.1 — PSR-DEFER-13 합류 전)
curl -I http://localhost:3000/glitzy-clinic/legal/privacy   # → 404
```

## C. 검증 한계 + 다음 단계

- **자동화 누락 시나리오** = #1~9 (RLS · status filter · instance lookup) · #14 (active=false) · #15 (admin/site 분리) · #19 (businessHours UI 렌더 e2e). 모두 실 DB + 어드민 세션 필요.
- **추후 cascade** = M0 v1.0 본 구현 단계에서 Playwright/Cypress e2e + `apps/web/scripts/site-scenarios.ts` 자동 fixture seed + 통과 매트릭스 자동 보고.
- **PROVIDER_PASS** 와 통합 — 실 Vercel/Cloud Run deployment 후 production smoke (sitemap submission · OG validator · Google Rich Results Test).
