# Spike E PROVIDER_PASS Runbook — Vercel + Auth.js + Supabase + Resend (Day 10)

본 runbook은 LOCAL_PASS 완료된 Spike E를 Vercel preview·Auth.js production-like 환경에서 검증.

## 사전 조건

- LOCAL_PASS 완료 (`pnpm spike-e:all` PASS)
- Spike A·B의 Supabase project (Spike E도 동일 DB 재활용 가능)
- node 20+·pnpm 10+
- Vercel 계정·GitHub 연동
- Resend 계정·domain 인증 (DNS SPF/DKIM)
- 테스트용 email (실 발송 받을 주소)

## Step 1: Next.js skeleton 생성

LOCAL spike는 server-side function 직접 호출. PROVIDER는 Next.js 실 HTTP layer 필요.

옵션 A (권장): 본 monorepo 내 `apps/web` 신규 생성·Next.js 15 + next-auth v5

```bash
cd apps
pnpm create next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*"
cd web
pnpm add next-auth@beta @auth/drizzle-adapter drizzle-orm postgres resend
```

옵션 B: 별도 Vercel preview repo·이후 합치기

본 runbook은 옵션 A 가정.

## Step 2: Spike E schema·resolveTenantContext 재사용

`apps/web/src/lib/auth/` 디렉토리에 Spike E의 `magic-link.ts·session.ts·resolve-tenant-context.ts·audit.ts·errors.ts` 복사.

## Step 3: next-auth v5 config

```ts
// apps/web/src/auth.ts
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Email from "next-auth/providers/email";
import { db } from "@/lib/db";  // drizzle client
import { adminUser, session, verificationToken } from "@/lib/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: adminUser,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }),
  providers: [
    Email({
      server: process.env.RESEND_API_KEY ? undefined : { /* SMTP */ },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // Resend API 직접 호출 (next-auth Email provider의 SMTP transport 대체)
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "Sign in to Glitzy",
            html: `<a href="${url}">Sign in</a>`,
          }),
        });
      },
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
});
```

## Step 4: Vercel deploy

```bash
# GitHub repo 연동
cd apps/web
vercel link
vercel env add NEXTAUTH_URL preview production
vercel env add NEXTAUTH_SECRET preview production
vercel env add DATABASE_URL preview production
vercel env add RESEND_API_KEY preview production
vercel env add EMAIL_FROM preview production
vercel env add AUTH_SECRET preview production

# preview deploy
vercel
```

## Step 5: PROVIDER smoke 실행 (수동 + 자동 혼합)

자동 (HTTP request):
```bash
cd apps/spike-e
cp .env.provider.example .env.provider
# PREVIEW_BASE_URL·NEXTAUTH_SECRET·DATABASE_URL·TEST_EMAIL_ADDRESS 채우기

pnpm provider:smoke
```

수동 (browser):
1. `https://YOUR_PREVIEW.vercel.app/api/auth/signin?email=YOUR_EMAIL` 호출
2. 이메일 수신·magic link click
3. callback 후 session cookie 설정 검증 (DevTools → Application → Cookies)
4. `/protected/instance/<INSTANCE_A>` 접근 시 resolveTenantContext 호출 후 page render
5. 다른 instance 시도 → 403

## acceptance checklist

| 검증 | 기준 | LOCAL 비교 |
|---|---|---|
| Vercel preview deploy | 빌드 성공·preview URL 동작 | N/A |
| magic link callback round-trip | 1회 round-trip (email → callback → session 생성) | LOCAL은 mock mailbox·PROVIDER는 실 Resend·실 callback |
| Auth.js secure cookie | preview에서 `Secure`·`HttpOnly`·`SameSite=Lax` 설정 | LOCAL은 cookie 없음 |
| DrizzleAdapter 실 호출 | createVerificationToken·useVerificationToken·createSession·getSessionAndUser 모두 정상 | LOCAL은 schema shape만 |
| session DB persistence | session row가 Supabase DB에 저장·새 request에서 복원 | 동등 |
| requestedInstanceId tampering | 잘못된 instance UUID로 query string 시도 → 403 | 동등 |
| membership active=false 후 next request | 즉시 403 (session expiry 안 기다림) | 동등 |
| super-admin instance switch | switch API → audit insert | 동등 |
| HTTPS·CSRF·SameSite | preview 환경 next-auth 기본 동작 검증 | PROVIDER only |
| Day artifact | preview screenshot·403 matrix·session DB row SQL dump | 산출물 |

## PROVIDER 특이 사항

### NEXTAUTH_URL
preview URL은 매 deploy마다 변경. `NEXTAUTH_URL`을 동적으로 설정해야 callback URL 정확.
Vercel이 `VERCEL_URL` env var 자동 설정·`NEXTAUTH_URL_INTERNAL`로 처리 가능.

### Resend
- 첫 발송: sandbox 도메인 (`resend.dev`)·verified email만 발송 가능
- production: domain 인증 필요·DNS SPF/DKIM/DMARC

### Supabase Pooler from Vercel
- Vercel serverless function은 short-lived·connection pooling 권장
- session mode (port 5432) over transaction mode (6543) — Auth.js는 prepared statement 사용
- max=2~5 connection 권장

### CSRF
next-auth v5 기본 CSRF protection·POST callback에 csrf_token 자동 포함.

## 비용 estimate

- Vercel preview: free hobby tier 충분
- Supabase: 동일 project 재활용·추가 비용 없음
- Resend: free tier 100 emails/day

## acceptance 후 cleanup

```bash
vercel rm <preview-deployment-id>
# 또는 Vercel dashboard에서 preview deployment 삭제
```

## reversal blast radius (E.4)

- Auth.js DrizzleAdapter 호환 안 됨 → Lucia·Better-Auth로 전환 (INFRA §2 stack reversal·packages/auth 재작성)
- session refresh latency 큼 → session cache + invalidation token (Upstash 활용)
- instanceMembership 검증 query 비용 큼 → scoped index·short-cache
