# Glitzy 홈페이지 SEO/AEO/GEO 진단 보고서

> **인계 문서** — Glitzy 홈페이지(glitzy.kr) 관리 프로젝트로 이관 예정
> 진단 일자: 2026-05-13
> 진단 방법: 외부 관찰(WebFetch)
> 진단 기준: 2025년 11월 네이버 "신뢰도 중심 통합 랭킹 모델" + AI 사이트 브리핑 + AI 스니펫

---

## 1. 한 줄 요약

**포지셔닝은 정확한데, 기계가 읽어야 할 정보가 거의 다 누락된 상태.**
마케팅 에이전시 자체 사이트로서는 가장 위험한 미스매치 — "병원 마케팅 잘한다는 회사가 자기 사이트 schema도 안 깔아놓음".

---

## 2. 현재 자산 (이미 잘 잡혀 있는 것)

| 영역 | 발견 사항 |
|---|---|
| 포지셔닝 | H1: "**병원·중소기업 마케팅 대행사 Glitzy — Structure Defines Growth**" — 1차 타겟이 H1 레벨로 명시 |
| 콘텐츠 분류 | 3-Pillar: 마케팅 구조 / AI 검색·GEO / 업종별 마케팅 — **GEO 콘텐츠 이미 보유** |
| URL 구조 | `/insight/[카테고리]/[슬러그]` — 깔끔하고 의미 있음 |
| AI 크롤러 정책 | robots.txt에 GPTBot · ClaudeBot · anthropic-ai · PerplexityBot · Google-Extended · CCBot 모두 명시 허용 |
| sitemap.xml | 27개 URL, lastmod 2026-05-06까지 갱신 |
| 시맨틱 HTML | header / main / footer / section 구조 사용 |
| 언어 선언 | `lang="ko"` |

## 3. 치명적 GAP — 즉시 수정 필요

| # | GAP | 영향 | 우선순위 |
|---|---|---|---|
| 1 | JSON-LD Schema 전무 (Organization, Article, BreadcrumbList, FAQPage 모두 없음) | 통합 랭킹·AI 브리핑·AI 스니펫 인식 실패 | P0 |
| 2 | 메타 description · og:* · canonical 누락 | 검색 미리보기·SNS 공유·스니펫 채택률 ↓ | P0 |
| 3 | 글 발행일(datePublished) · 수정일 누락 | Article schema 핵심 필드 부재, 최신성 평가 불가 | P0 |
| 4 | 저자 정보 부재 | E-E-A-T의 Expertise/Authority 신호 0 | P0 |
| 5 | 회사 메타 정보 부실 (주소·대표자명·연혁·팀 정보 없음, 이메일·사업자번호만 있음) | AI 사이트 브리핑 자동 생성 원천 데이터 부족 | P0 |
| 6 | 소셜 채널 링크 0개 | sameAs schema 누락, 외부 권위 신호 단절 | P1 |

## 4. 중요 GAP — 단계적 개선

- 사이트 내 검색 기능 없음
- RSS 피드 없음
- 태그 시스템 없음 (카테고리만)
- 인사이트 페이지 발행일 노출 안 됨 (UX 신뢰도 ↓)
- 27개 URL은 적은 편 — 콘텐츠 볼륨 누적 필요

---

## 5. Quick Wins 우선순위 작업 리스트

### P0 — 1~2주 내

#### ① 메타 태그 풀세트 추가 (전 페이지)

```html
<!-- 페이지별 동적 생성 -->
<title>{page_title} | Glitzy 병원·중소기업 마케팅 대행사</title>
<meta name="description" content="{page-specific 120~160자}">
<link rel="canonical" href="https://glitzy.kr{path}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">

<!-- Open Graph -->
<meta property="og:type" content="{website|article}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="https://glitzy.kr{path}">
<meta property="og:site_name" content="Glitzy">
<meta property="og:image" content="https://glitzy.kr/og/{slug}.png">
<meta property="og:locale" content="ko_KR">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="https://glitzy.kr/og/{slug}.png">

<!-- Article (인사이트 페이지 한정) -->
<meta property="article:published_time" content="{ISO8601}">
<meta property="article:modified_time" content="{ISO8601}">
<meta property="article:author" content="{author}">
<meta property="article:section" content="{pillar_category}">
```

#### ② JSON-LD Schema 적용

**(A) 모든 페이지 공통 — Organization + WebSite**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://glitzy.kr/#organization",
  "name": "Glitzy",
  "alternateName": "주식회사 글리치",
  "url": "https://glitzy.kr",
  "logo": "https://glitzy.kr/logo.png",
  "email": "inner@glitzy.kr",
  "description": "병원·중소기업 마케팅 대행사. 마케팅 구조 설계를 통한 성장 솔루션 제공.",
  "founder": {
    "@type": "Person",
    "name": "{대표자명}"
  },
  "foundingDate": "{YYYY-MM-DD}",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KR",
    "addressLocality": "{시}",
    "addressRegion": "{도}",
    "streetAddress": "{주소}"
  },
  "sameAs": [
    "https://www.instagram.com/glitzy_kr",
    "https://www.linkedin.com/company/glitzy",
    "https://blog.naver.com/glitzy"
  ],
  "knowsAbout": [
    "병원 마케팅", "의료 마케팅", "퍼포먼스 마케팅",
    "브랜딩", "GEO", "AEO", "SEO"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://glitzy.kr/#website",
  "url": "https://glitzy.kr",
  "name": "Glitzy",
  "publisher": { "@id": "https://glitzy.kr/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://glitzy.kr/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "ko-KR"
}
```

**(B) 인사이트 글 — Article + BreadcrumbList**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{summary}",
  "image": "https://glitzy.kr/og/{slug}.png",
  "datePublished": "{ISO8601}",
  "dateModified": "{ISO8601}",
  "author": {
    "@type": "Person",
    "name": "{author_name}",
    "url": "https://glitzy.kr/team/{author_slug}",
    "jobTitle": "{직책}"
  },
  "publisher": { "@id": "https://glitzy.kr/#organization" },
  "mainEntityOfPage": "https://glitzy.kr/insight/{cat}/{slug}",
  "articleSection": "{pillar_name}",
  "inLanguage": "ko-KR",
  "wordCount": {wordCount}
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://glitzy.kr" },
    { "@type": "ListItem", "position": 2, "name": "Insight", "item": "https://glitzy.kr/insight" },
    { "@type": "ListItem", "position": 3, "name": "{카테고리}", "item": "https://glitzy.kr/insight/{cat}" },
    { "@type": "ListItem", "position": 4, "name": "{글 제목}" }
  ]
}
```

**(C) Q&A 형식 글 — FAQPage 추가**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "GEO란 무엇인가?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GEO(Generative Engine Optimization)는 ..."
      }
    }
  ]
}
```

**(D) 서비스 페이지 — Service**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "병원 마케팅 대행",
  "provider": { "@id": "https://glitzy.kr/#organization" },
  "areaServed": { "@type": "Country", "name": "KR" }
}
```

#### ③ 인사이트 글 표면 UI에 발행 메타 노출

각 글 카드와 상세 페이지에 다음을 시각적으로 표시:
- 발행일 / 최종 수정일
- 저자 이름 + 프로필 링크
- 읽기 예상 시간 (이미 있음)
- 카테고리 배지
- 관련 글 3개 (Pillar 내)

#### ④ 회사 정보 페이지 보강 (`/why-glitzy` 또는 `/about`)

AI 사이트 브리핑 자동 생성에 활용되는 핵심 메타 데이터 — **풍부할수록 좋음**:

- [ ] 회사 정식 명칭 + 영문명
- [ ] 설립일 / 연혁 타임라인
- [ ] 대표자명
- [ ] 사업장 주소 (지도 임베드)
- [ ] 사업자등록번호 (이미 있음)
- [ ] 통신판매업 신고번호 (해당 시)
- [ ] 사업 분야 상세 설명
- [ ] 팀 구성 / 핵심 인력 프로필 (저자 페이지로도 활용)
- [ ] 주요 클라이언트 / 케이스 스터디
- [ ] 보유 자격 · 인증 · 수상 내역
- [ ] 미디어 노출 / 기고 / 인터뷰 이력
- [ ] 위키피디아 등재 (가능하면)

#### ⑤ 소셜 채널 정리 + sameAs 적용

운영 중인 소셜 채널을 푸터에 노출 + Organization schema의 sameAs 배열에 명시:
- 네이버 블로그 (있다면)
- 인스타그램
- 링크드인
- 유튜브 (있다면)
- 브런치 (있다면)

### P1 — 한 달 내

- 인사이트 글 본문에 의도적 구조 적용 (Q&A 블록 + 리스트 + 표) → **AI 스니펫 채택률 향상**
- FAQ 페이지 신설 (병원 마케팅 자주 묻는 질문)
- 사이트 내 검색 기능
- 케이스 스터디 섹션 (`/work` 강화) — 자체 사이트 재정비 과정 1호 케이스로 공개
- 위키피디아 한국어 등재 검토

---

## 6. 추가 권장사항 — VLM 대응 (디자인 영역)

네이버는 VLM(시각-언어 모델)으로 **사이트 디자인 자체를 신뢰도 평가에 반영**한다. 다음 항목 점검:

- [ ] 광고 배너·팝업 최소화 또는 제거
- [ ] 일관된 타이포그래피 시스템 (디자인 시스템 토큰화)
- [ ] 깔끔한 여백 · 그리드
- [ ] 고품질 자체 제작 이미지 (스톡 이미지 남발 금지)
- [ ] 페이지 로딩 속도 (LCP < 2.5s)
- [ ] 모바일 반응형 정상 동작
- [ ] 다크모드 대응 (선택)
- [ ] 접근성 (alt 텍스트, ARIA, 색 대비)

---

## 7. 검증 방법

작업 완료 후 다음으로 검증:
- Google Search Console: 구조화 데이터 보고서
- 구조화 데이터 테스트 도구 (validator.schema.org)
- Lighthouse: SEO 점수 90+ 목표
- 네이버 서치어드바이저: 사이트 등록 및 색인 상태
- 검색 결과 직접 모니터링: 핵심 키워드 노출 추이

---

## 8. 이 진단의 한계

- 외부 관찰 진단이므로 소스 코드 · 빌드 결과물 · 서버 헤더 · 실제 검색 노출 상태는 확인 못 함
- WebFetch가 HTML을 마크다운으로 변환하면서 일부 hidden 메타 태그가 누락됐을 가능성 있음 → 실제 페이지 소스 보기로 재확인 필요
- 트래픽 데이터 · GSC · GA 등 운영 데이터 없이 정성적 진단만 수행

---

## 9. 솔루션 프로젝트와의 연결

이 진단에서 도출된 **표준 패턴**(메타 태그 템플릿, JSON-LD 스니펫, 회사 정보 체크리스트, VLM 대응 가이드)은
`C:\Users\assag\solution\website-exposure` 프로젝트의 **병원 클라이언트 솔루션 Core 모듈**로 그대로 재사용된다.

병원 특화 모듈은 여기에 다음을 추가:
- MedicalOrganization / Physician / MedicalProcedure / MedicalCondition schema
- 진료과 · 의료진 · 증상 · 시술 IA 표준
- 의료광고심의 회피 콘텐츠 가이드라인
- 의료기관 디자인 시스템 (병원 톤)
