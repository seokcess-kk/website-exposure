// Spike C — fixture instances

import type { TenantContext } from "./tenant-context.js";

export const INSTANCE_A_ID = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
export const INSTANCE_B_ID = "bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb";

export const ACTOR_A_OPERATOR: TenantContext = {
  instanceId: INSTANCE_A_ID,
  actorId: "actor-a-operator",
  actorRole: "operator",
};

export const ACTOR_B_OPERATOR: TenantContext = {
  instanceId: INSTANCE_B_ID,
  actorId: "actor-b-operator",
  actorRole: "operator",
};

export const SERVICE_ROLE_ACTOR: TenantContext = {
  instanceId: "00000000-0000-4000-8000-000000000000",
  actorId: "service-role-importer",
  actorRole: "service_role",
};

export function objectKeyFor(instanceId: string, sub: string): string {
  return `instances/${instanceId.toLowerCase()}/${sub}`;
}

export const SEED_OBJECTS_PER_INSTANCE = 5;
