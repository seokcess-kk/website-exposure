// Spike D — Drizzle schema (raw SQL과 byte-for-byte 동기)
// SPIKED1-006 cycle2: metadata JSONB·migration_ledger 전 필드·published_at·partial index·CHECK constraint 모두 반영

import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
  foreignKey,
  unique,
  check,
  pgEnum,
} from "drizzle-orm/pg-core";

export const contentStatusEnum = pgEnum("content_status", ["draft", "published", "archived"]);

// 1. content_test — RLS + CHECK + composite FK + published_at (post 008~010)
export const contentTest = pgTable(
  "content_test",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull(),
    parentId: uuid("parent_id"),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    status: contentStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    instanceIdIdx: index("content_test_instance_id_idx").on(t.instanceId),
    publishedAtIdx: index("content_test_published_at_idx")
      .on(t.publishedAt)
      .where(sql`${t.publishedAt} IS NOT NULL`),
    instanceIdIdUnique: unique("content_test_instance_id_id_unique").on(t.instanceId, t.id),
    parentFk: foreignKey({
      columns: [t.instanceId, t.parentId],
      foreignColumns: [t.instanceId, t.id],
      name: "content_test_parent_fk",
    }),
    slugRegexCheck: check("content_test_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{0,99}$'`),
    titleNonEmptyCheck: check("content_test_title_nonempty", sql`length(${t.title}) > 0`),
    publishedRequiresAt: check(
      "content_test_published_requires_published_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`,
    ),
  }),
);

// 2. instance_user — partial unique
export const instanceUser = pgTable(
  "instance_user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull(),
    userId: uuid("user_id").notNull(),
    role: text("role").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    activeUserUnique: uniqueIndex("instance_user_active_unique")
      .on(t.instanceId, t.userId)
      .where(sql`${t.active} = true`),
    instanceIdIdx: index("instance_user_instance_id_idx").on(t.instanceId),
  }),
);

// 3. audit_log — append-only·JSONB metadata
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull(),
    actorId: text("actor_id").notNull(),
    actorRole: text("actor_role").notNull(),
    action: text("action").notNull(),
    contentRef: text("content_ref"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    instanceTimeIdx: index("audit_log_instance_time_idx").on(t.instanceId, t.occurredAt.desc()),
  }),
);

// 4. migration_ledger — 005 SQL과 정확히 동기
export const migrationLedger = pgTable(
  "migration_ledger",
  {
    id: integer("id").primaryKey(),
    filename: text("filename").notNull().unique(),
    checksum: text("checksum").notNull(),
    appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
    appliedBy: text("applied_by").notNull(),
    serviceRoleFunction: text("service_role_function").notNull(),
    targetDb: text("target_db").notNull(),
    durationMs: integer("duration_ms"),
  },
  (t) => ({
    appliedAtIdx: index("migration_ledger_applied_at_idx").on(t.appliedAt.desc()),
  }),
);

// 5. audit_event — service-role-invoked
export const auditEvent = pgTable(
  "audit_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: text("event_type").notNull(),
    actorId: text("actor_id").notNull(),
    actorRole: text("actor_role").notNull(),
    serviceRoleFunction: text("service_role_function"),
    targetDb: text("target_db"),
    payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    typeTimeIdx: index("audit_event_type_time_idx").on(t.eventType, t.occurredAt.desc()),
  }),
);
