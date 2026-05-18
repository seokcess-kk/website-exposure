# Spike D local prototype 코드 — codex 자동 비평 cycle 5

동일 reviewer. cycle 4 결과 (closed: 4·remaining: 2·신규 blocking: 1·major: 1·minor: 1) 에 대한 v0.5 patch.

## cycle 4 결과 (SoT)

closed (4): SPIKED2-001·SPIKED3-002·003·SPIKED1-010.
remaining (2 — 둘 다 empty target 관련): SPIKED3-001·SPIKED1-005.
new blocking (1): SPIKED4-001 (empty target guard 부족).
new major (1): SPIKED4-002 (D.3 byte-equal 표현 vs 실제 검증 갭).
new minor (1): SPIKED4-003 (case-5 assertion 부족).

## cycle 5 v0.5 patch

### 1. SPIKED4-001 + SPIKED3-001 + SPIKED1-005: empty target guard 강화

```ts
if (targetCurrent === 0) {
  // 모든 public schema user-visible object 검사 (BASE TABLE만 아니라):
  // table·view·sequence·enum/composite type·function·policy·trigger
  const counts = await sql`
    SELECT 'table', COUNT(*) FROM pg_class WHERE ... relkind IN ('r','p')
    UNION ALL SELECT 'view', COUNT(*) FROM pg_class WHERE relkind IN ('v','m')
    UNION ALL SELECT 'sequence', ...
    UNION ALL SELECT 'type', COUNT(*) FROM pg_type WHERE typtype IN ('e','c') AND NOT (table-implicit type)
    UNION ALL SELECT 'function', ...
    UNION ALL SELECT 'policy', ...
    UNION ALL SELECT 'trigger', ... NOT tgisinternal
  `;
  const leftover = counts.filter(r => r.count > 0);
  if (leftover.length > 0) throw new Error("public schema has leftover objects: ${summary}");
}
```

target이 진짜로 empty임을 multi-class object 검사로 강제·partial poison 회피.

### 2. SPIKED4-002: D.3 byte-equal 표현 정정

```diff
- LOCAL은 regex pattern + raw file existence + schema.ts byte-equal raw SQL
+ LOCAL은 (a) drizzle-kit generate 결과의 11 canonical regex pattern·(b) 5 raw mixin file existence·(c) schema.ts table/column 명시 일치만 검증 (full byte-equal은 PROVIDER_GATE)
```

LOCAL acceptance 기준을 실제 구현과 정합.

### 3. SPIKED4-003: case-5 assertion 강화

```ts
// before: /reloptions|tenant_audit_log_view/.test(err.diff)  (OR — view name만 일치해도 PASS)
// after: AND — view name AND reloptions 양쪽 명시
if (/tenant_audit_log_view/.test(err.diff) && /reloptions/.test(err.diff)) {
  viewDriftDetected = true;
}
```

definition-only view drift regression 시 fail.

## cycle 5 검토 관점

1. **empty target guard 7-class object 검사 완전성**: extension·collation·schema·grant·role 등 누락 영역?
2. **pg_type filter 정확성**: implicit type (table-relname 같은 type)은 제외해야 함. NOT EXISTS clause 정확?
3. **D.3 표현 정합**: LOCAL은 정말 (a)(b)(c) 세 검증만? schema.ts table/column 명시 일치는 어떻게? test-canonical-generation에서 schema.ts import sanity·실제 column count·name 검증 추가 필요?
4. **case-5 assertion**: AND 조건이 false positive 회피·하지만 future diff format 변경 시 regression 위험
5. **post-drift 검증**: Stage 6 post-migrate drift는 empty target deploy에서도 정확히 동작?
6. **target이 manifest 없지만 public schema 변경 case**: 사용자가 manual ALTER 시 — 본 guard로 reject·운영 가이드?
7. **누적 22개 결함 close 상태**: cycle 1·2·3·4 결함 모두 v0.5에서 close 가능?

## 평가 형식

```json
{
  "cycle": 5,
  "closeable_after_patch": true | false,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "next_cycle_focus": "..."
}
```

신규 0이면 closeable_after_patch true·acceptance 가능.
