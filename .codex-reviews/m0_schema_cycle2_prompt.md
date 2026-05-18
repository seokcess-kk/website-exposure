# M0 vertical slice schema v0.2 — codex 자동 비평 cycle 2

동일 reviewer. cycle 1 (blocking 7·major 8·minor 5) 에 대한 v0.2 patch.

## cycle 1 결과

closeable: false.
blocking 7: M0-01·02·03·04·05·06·07.
major 8: M0-08~15.
minor 5: M0-16~20.

## v0.2 patch (SoT cascade·5 blocking + 3 minor)

### M0-01: NotificationEvent table 명시 제거
M0_SCHEMA_PLAN.md cascade:
- "NotificationEvent는 DB table 아님·notify() input envelope (INFRA v1.0 정정)"
- 15번 entry: "Notification P0 subset (Receipt·Log·PayloadRecord·DeliveryAttempt)" (notifications-outbox v0.3+)
- v0.3 deferred: NotificationEvent → "Notification P0 subset + REVIEW_WORKFLOW state machine"

### M0-02: content_publication_status 9-state
```sql
CREATE TYPE content_publication_status AS ENUM (
  'draft', 'review-queued', 'in-review', 'approved', 'publishable',
  'published', 'blocked', 'rejected', 'stale'
);
```
SoT: REVIEW_WORKFLOW v1.0 § 1·§ 7.1.

### M0-03: risk_level enum 3종·대문자
```sql
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High');
```
SoT: RISK_LEVELS § 4·DATA_MODEL C-05.
treatment_page·article·`risk_level risk_level` column.
이전 text + CHECK constraint 4종 ('low','medium','high','critical') 제거.

### M0-05: composite FK ON DELETE NO ACTION
```sql
CONSTRAINT article_author_fk FOREIGN KEY (instance_id, author_doctor_id)
  REFERENCES doctor_profile(instance_id, id) ON DELETE NO ACTION
```
SET NULL이 instance_id NOT NULL과 충돌·NO ACTION으로 변경·doctor 삭제 시 article은 application layer orphan 처리.

### M0-06 partial: Drizzle 정합
- `instance_slug_active_idx` Drizzle에 추가
- `ON DELETE NO ACTION` Drizzle은 onDelete 미명시 (기본)
- DEFERRABLE INITIALLY DEFERRED는 raw SQL에서 제거 (Drizzle 미지원)
- 양쪽 검사·여전히 byte-equal 100% 보장 안 됨 (drizzle-kit generate 결과 확인 필요·deferred·cycle 3+)

### M0-15: instance table RLS·GRANT
```sql
ALTER TABLE instance ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance FORCE ROW LEVEL SECURITY;

CREATE POLICY instance_tenant_read ON instance
  FOR SELECT TO app_tenant_user
  USING (id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT ON instance TO app_tenant_user;
```
control-plane scope·tenant role SELECT only.

### M0-16: slug regex 3~64자 (DATA_MODEL @id)
모든 table: `'^[a-z0-9][a-z0-9-]{2,63}$'` (instance·clinic·location·doctor)
treatment_page·article은 longer slug 허용 (`{2,99}`) — content 특성

### M0-17: TreatmentPage summary 50~160
CHECK 추가·이전 80~200 → 50~160 (DATA_MODEL C-03 정합)

### M0-18: address_country ISO 대문자
`address_country ~ '^[A-Z]{2}$'`

## v0.2 deferred (cycle 3+)

- M0-04: clinic-location FK·m:n 또는 location.clinic_id (P0 contact 마스터·아키텍처 결정 필요·v0.3)
- M0-07: migrations-runner manifest·depends_on (separate cycle·packages/migrations-runner v0.2)
- M0-08·09·10·11·12: 각 entity typed field detail·M0 v0.3 scope (Phase 0 Week 4 schema migration green)
- M0-13: instance vs InstanceManifest 경계 (C-08 별도 entity·v0.4+)
- M0-14: audit_log M0 extension (v0.3)
- M0-19: updated_at trigger (post-hardening)
- M0-20: SQL apply·RLS behavior·Drizzle diff 실측 (Phase 0 Week 4 acceptance gate)

## v0.2 build + typecheck PASS

`pnpm pkg:typecheck` 8 packages 모두 PASS.

## cycle 2 검토 관점

1. **enum 정합**: content_publication_status 9·risk_level 3·대문자·REVIEW_WORKFLOW/RISK_LEVELS SoT 정확 매핑
2. **composite FK 정정**: ON DELETE NO ACTION이 instance_id NOT NULL과 호환·orphan 처리는 명시
3. **instance RLS**: control-plane vs tenant scope·정책 명확
4. **slug regex**: instance·content table 양쪽 3~64자 (또는 content는 더 긴 길이 허용 가능)
5. **NotificationEvent 정정**: plan에서 모든 references 제거·envelope marker로 cascade
6. **deferred 명시**: M0-04·07·08~14·19·20 모두 cycle 3+ scope 명시

cycle 1 20개 결함 중·v0.2에서 close 가능한 8 (M0-01·02·03·05·06 partial·15·16·17·18)·deferred 12 (M0-04·07·08~14·19·20).

## 평가 형식

```json
{
  "cycle": 2,
  "closeable_after_patch": false | true,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```
