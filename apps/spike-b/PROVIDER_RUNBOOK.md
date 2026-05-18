# Spike B PROVIDER_PASS Runbook — Supabase Pooler (Day 9)

## 사전 조건

- Spike A의 Supabase project (또는 별도 staging project)
- LOCAL_PASS 완료 (`pnpm spike-b:all` PASS)
- `apps/spike-a/PROVIDER_RUNBOOK.md` 의 Step 1~3 완료 (Supabase setup·app_tenant_user 옵션 A)

## Step 1: migration apply

```bash
cd apps/spike-b
cp .env.provider.example .env.provider
# DATABASE_URL_SUPER 채우기

pnpm migrate
```

migration: roles·outbox·inbox·external_call_log·invariant_log·permanent_alert·provider_attempt_log.

## Step 2: PROVIDER smoke 실행

```bash
pnpm provider:smoke
```

본 smoke는 LOCAL 8 시나리오의 핵심을 압축 (Pooler 환경 비용 고려·LOCAL의 1/5 scale):
1. outbox SKIP LOCKED claim (5 worker concurrent·duplicate 0)
2. permanent_alert UNIQUE(outbox_id, alert_type) — race 검증
3. provider_attempt_log accepted-success UNIQUE — at-least-once with exactly-once observable
4. invariant — 200 jobs × 5 workers·foreign 0·duplicate 0

## acceptance checklist

| 검증 | 기준 | LOCAL 비교 |
|---|---|---|
| outbox SKIP LOCKED in Pooler tx mode | 5 worker concurrent claim·duplicate 0·foreign 0 | LOCAL 1000×10 → PROVIDER 200×5 |
| permanent_alert UNIQUE race | 동시 INSERT 시도·1만 성공·duplicate 0 | 동등 |
| provider_attempt_log UNIQUE accepted-success | 동일 idempotency-key·1 accepted만 | 동등 |
| Pooler transaction mode 호환 | postgres-js prepare:false·SKIP LOCKED·advisory lock 모두 정상 | LOCAL은 강제 안 됨 |
| latency | LOCAL p50 + 네트워크 latency | 측정·기록 |

## PROVIDER 특이 사항

### SKIP LOCKED in Pooler transaction mode
pgBouncer transaction pool에서도 row-level locking은 정상 동작. 그러나 transaction이 짧아야 다른 client에 connection share 가능. worker가 long-running task 처리 시 별도 connection 사용 권장 (transaction mode 비추천·session mode 사용).

본 spike PROVIDER smoke는 짧은 transaction만 사용해 transaction mode에서도 정상 동작.

### Connection limit
worker N개 동시 실행 시 max=N (Pooler free tier 60). 본 smoke는 5 worker·max=10으로 안전.

## 비용 estimate

- 본 smoke: <50 MB DB IO·<50 MB egress
- Free tier 충분

## acceptance 후 cleanup

```bash
pnpm migrate:reset   # 또는 psql로 DROP TABLE outbox, inbox, ...
```
