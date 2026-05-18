// Spike D — drift check (definition-aware)
// SPIKED1-004 cycle2: pg_get_constraintdef·pg_get_indexdef·pg_policies.qual/with_check·pg_get_viewdef·enum labels 추가
// SPIKED1-011 cycle2: shadow freshness 검증 (runDeploy wrapper에 통합)

import postgres from "postgres";

import { getDatabaseUrl, type DbTarget } from "./env.js";
import { SchemaDriftError } from "./errors.js";

export type SchemaSnapshot = {
  readonly tables: ReadonlyArray<{
    readonly name: string;
    readonly columns: ReadonlyArray<{ name: string; dataType: string; isNullable: boolean; defaultExpr: string | null }>;
  }>;
  readonly constraints: ReadonlyArray<{ table: string; name: string; type: string; definition: string }>;
  readonly indexes: ReadonlyArray<{ table: string; name: string; definition: string }>;
  readonly policies: ReadonlyArray<{ table: string; name: string; cmd: string; roles: string; qual: string | null; withCheck: string | null; permissive: string }>;
  readonly views: ReadonlyArray<{ name: string; definition: string; reloptions: string }>;
  readonly enums: ReadonlyArray<{ name: string; labels: string[] }>;
};

async function snapshotSchema(url: string): Promise<SchemaSnapshot> {
  const sql = postgres(url, { max: 1, prepare: false });
  try {
    // Columns
    const colsRaw = await sql<{ table_name: string; column_name: string; data_type: string; is_nullable: string; column_default: string | null }[]>`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;
    const tableMap = new Map<string, { name: string; dataType: string; isNullable: boolean; defaultExpr: string | null }[]>();
    for (const r of colsRaw) {
      if (!tableMap.has(r.table_name)) tableMap.set(r.table_name, []);
      tableMap.get(r.table_name)!.push({
        name: r.column_name,
        dataType: r.data_type,
        isNullable: r.is_nullable === "YES",
        defaultExpr: r.column_default,
      });
    }
    const tables = Array.from(tableMap.entries()).map(([name, columns]) => ({ name, columns }));

    // Constraints with definition (pg_get_constraintdef)
    const constraints = await sql<{ table: string; name: string; type: string; definition: string }[]>`
      SELECT
        c.relname AS table,
        con.conname AS name,
        con.contype::text AS type,
        pg_get_constraintdef(con.oid, true) AS definition
      FROM pg_constraint con
      JOIN pg_class c ON con.conrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public'
      ORDER BY c.relname, con.conname
    `;

    // Indexes with definition (pg_get_indexdef)
    const indexes = await sql<{ table: string; name: string; definition: string }[]>`
      SELECT
        tablename AS table,
        indexname AS name,
        indexdef AS definition
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `;

    // Policies with qual/with_check
    const policies = await sql<{ table: string; name: string; cmd: string; roles: string; qual: string | null; withCheck: string | null; permissive: string }[]>`
      SELECT
        tablename AS table,
        policyname AS name,
        cmd,
        array_to_string(roles, ',') AS roles,
        qual,
        with_check AS "withCheck",
        permissive::text AS permissive
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname
    `;

    // Views with reloptions (security_invoker·security_barrier 포함)
    const views = await sql<{ name: string; definition: string; reloptions: string }[]>`
      SELECT
        c.relname AS name,
        COALESCE(pg_get_viewdef(c.oid, true), '') AS definition,
        COALESCE(array_to_string(c.reloptions, ','), '') AS reloptions
      FROM pg_class c
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public' AND c.relkind IN ('v', 'm')
      ORDER BY c.relname
    `;

    // Enums (labels)
    const enumsRaw = await sql<{ name: string; label: string; ordinal: number }[]>`
      SELECT t.typname AS name, e.enumlabel AS label, e.enumsortorder AS ordinal
      FROM pg_type t
      JOIN pg_enum e ON e.enumtypid = t.oid
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder
    `;
    const enumMap = new Map<string, string[]>();
    for (const r of enumsRaw) {
      if (!enumMap.has(r.name)) enumMap.set(r.name, []);
      enumMap.get(r.name)!.push(r.label);
    }
    const enums = Array.from(enumMap.entries()).map(([name, labels]) => ({ name, labels }));

    return { tables, constraints, indexes, policies, views, enums };
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export function diffSnapshots(left: SchemaSnapshot, right: SchemaSnapshot): string[] {
  const diffs: string[] = [];

  // Tables·columns
  const tableMap = (snap: SchemaSnapshot) => new Map(snap.tables.map((t) => [t.name, t]));
  const lT = tableMap(left);
  const rT = tableMap(right);
  for (const name of new Set([...lT.keys(), ...rT.keys()])) {
    const l = lT.get(name);
    const r = rT.get(name);
    if (!l) { diffs.push(`+ table ${name} (only right)`); continue; }
    if (!r) { diffs.push(`- table ${name} (only left)`); continue; }
    const lC = new Map(l.columns.map((c) => [c.name, c]));
    const rC = new Map(r.columns.map((c) => [c.name, c]));
    for (const col of new Set([...lC.keys(), ...rC.keys()])) {
      const lc = lC.get(col);
      const rc = rC.get(col);
      if (!lc) diffs.push(`+ ${name}.${col} (only right)`);
      else if (!rc) diffs.push(`- ${name}.${col} (only left)`);
      else {
        if (lc.dataType !== rc.dataType) diffs.push(`~ ${name}.${col} type: ${lc.dataType} vs ${rc.dataType}`);
        if (lc.isNullable !== rc.isNullable) diffs.push(`~ ${name}.${col} nullable: ${lc.isNullable} vs ${rc.isNullable}`);
        if (lc.defaultExpr !== rc.defaultExpr) diffs.push(`~ ${name}.${col} default: ${lc.defaultExpr} vs ${rc.defaultExpr}`);
      }
    }
  }

  // Constraints (definition 비교)
  const lC = new Map(left.constraints.map((c) => [`${c.table}.${c.name}`, c]));
  const rC = new Map(right.constraints.map((c) => [`${c.table}.${c.name}`, c]));
  for (const k of new Set([...lC.keys(), ...rC.keys()])) {
    const l = lC.get(k);
    const r = rC.get(k);
    if (!l) diffs.push(`+ constraint ${k}: ${r!.definition}`);
    else if (!r) diffs.push(`- constraint ${k}: ${l.definition}`);
    else if (l.definition !== r.definition) diffs.push(`~ constraint ${k} definition: ${l.definition} vs ${r.definition}`);
  }

  // Indexes (definition 비교)
  const lI = new Map(left.indexes.map((i) => [`${i.table}.${i.name}`, i]));
  const rI = new Map(right.indexes.map((i) => [`${i.table}.${i.name}`, i]));
  for (const k of new Set([...lI.keys(), ...rI.keys()])) {
    const l = lI.get(k);
    const r = rI.get(k);
    if (!l) diffs.push(`+ index ${k}: ${r!.definition}`);
    else if (!r) diffs.push(`- index ${k}: ${l.definition}`);
    else if (l.definition !== r.definition) diffs.push(`~ index ${k} definition: ${l.definition} vs ${r.definition}`);
  }

  // Policies (qual·withCheck·roles·cmd 비교)
  const lP = new Map(left.policies.map((p) => [`${p.table}.${p.name}`, p]));
  const rP = new Map(right.policies.map((p) => [`${p.table}.${p.name}`, p]));
  for (const k of new Set([...lP.keys(), ...rP.keys()])) {
    const l = lP.get(k);
    const r = rP.get(k);
    if (!l) diffs.push(`+ policy ${k}`);
    else if (!r) diffs.push(`- policy ${k}`);
    else {
      if (l.cmd !== r.cmd) diffs.push(`~ policy ${k} cmd: ${l.cmd} vs ${r.cmd}`);
      if (l.roles !== r.roles) diffs.push(`~ policy ${k} roles: ${l.roles} vs ${r.roles}`);
      if (l.qual !== r.qual) diffs.push(`~ policy ${k} qual: ${l.qual} vs ${r.qual}`);
      if (l.withCheck !== r.withCheck) diffs.push(`~ policy ${k} with_check: ${l.withCheck} vs ${r.withCheck}`);
      if (l.permissive !== r.permissive) diffs.push(`~ policy ${k} permissive: ${l.permissive} vs ${r.permissive}`);
    }
  }

  // Views (definition + reloptions)
  const lV = new Map(left.views.map((v) => [v.name, v]));
  const rV = new Map(right.views.map((v) => [v.name, v]));
  for (const k of new Set([...lV.keys(), ...rV.keys()])) {
    const l = lV.get(k);
    const r = rV.get(k);
    if (!l) diffs.push(`+ view ${k}`);
    else if (!r) diffs.push(`- view ${k}`);
    else {
      if (l.definition !== r.definition) diffs.push(`~ view ${k} definition diff`);
      if (l.reloptions !== r.reloptions) diffs.push(`~ view ${k} reloptions: ${l.reloptions} vs ${r.reloptions}`);
    }
  }

  // Enums
  const lE = new Map(left.enums.map((e) => [e.name, e.labels.join(",")]));
  const rE = new Map(right.enums.map((e) => [e.name, e.labels.join(",")]));
  for (const k of new Set([...lE.keys(), ...rE.keys()])) {
    const l = lE.get(k);
    const r = rE.get(k);
    if (!l) diffs.push(`+ enum ${k}: ${r}`);
    else if (!r) diffs.push(`- enum ${k}: ${l}`);
    else if (l !== r) diffs.push(`~ enum ${k} labels: ${l} vs ${r}`);
  }

  return diffs;
}

export async function checkDriftAgainstShadow(target: DbTarget): Promise<void> {
  if (target === "shadow") throw new Error("cannot check drift of shadow against itself");
  const [targetSnap, shadowSnap] = await Promise.all([
    snapshotSchema(getDatabaseUrl(target)),
    snapshotSchema(getDatabaseUrl("shadow")),
  ]);
  if (shadowSnap.tables.length === 0) {
    throw new SchemaDriftError(target, "shadow DB has no tables — shadow apply not run");
  }
  const diffs = diffSnapshots(shadowSnap, targetSnap);
  if (diffs.length > 0) {
    throw new SchemaDriftError(target, diffs.join("\n"));
  }
}

export async function snapshotForDebug(target: DbTarget): Promise<SchemaSnapshot> {
  return snapshotSchema(getDatabaseUrl(target));
}
