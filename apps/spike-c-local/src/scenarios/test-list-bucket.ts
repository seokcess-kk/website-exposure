// Spike C — test-list-bucket: application-layer + minio per-instance policy 검증
// SPIKEC1-003 cycle2: minio instance principal로 credential-level deny 실측
//   - C-local PARTIAL: minio policy로 ListBucket prefix 조건 실측 가능
//   - C-provider REQUIRED: R2 IAM Condition 동등성·credential rotation·STS는 PROVIDER_PASS gate

import { ListObjectsV2Command } from "@aws-sdk/client-s3";

import { env } from "../env.js";
import { createInstanceClient, createServiceRoleClient } from "../storage-client.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, INSTANCE_B_ID, SERVICE_ROLE_ACTOR } from "../fixtures.js";
import { instancePrefix } from "../tenant-context.js";
import { auditLog } from "../audit-log.js";
import type { TenantContext } from "../tenant-context.js";

type ListResult = { keys: string[]; httpStatus: number | null };

async function listWithClient(
  client: ReturnType<typeof createInstanceClient>,
  prefix: string,
): Promise<ListResult> {
  try {
    const result: any = await client.send(new ListObjectsV2Command({
      Bucket: env.S3_BUCKET,
      Prefix: prefix,
    }));
    return {
      keys: (result.Contents ?? []).map((c: any) => c.Key as string),
      httpStatus: result.$metadata?.httpStatusCode ?? null,
    };
  } catch (err: any) {
    return { keys: [], httpStatus: err?.$metadata?.httpStatusCode ?? null };
  }
}

async function tenantListObjects(ctx: TenantContext, requestedPrefix?: string): Promise<string[]> {
  if (ctx.actorRole !== "service_role") {
    const enforced = instancePrefix(ctx.instanceId);
    if (requestedPrefix && !requestedPrefix.startsWith(enforced)) {
      auditLog.append({
        timestamp: Date.now(),
        instanceId: ctx.instanceId,
        actorId: ctx.actorId,
        actorRole: ctx.actorRole,
        action: "signed-url-rejected",
        objectKey: requestedPrefix,
        method: "GET",
        contentType: null,
        ttlSeconds: null,
        result: "denied",
        reason: "TenantPrefixMismatchError",
      });
      throw new Error(`prefix '${requestedPrefix}' does not belong to instance '${ctx.instanceId}'`);
    }
  }
  const effective = ctx.actorRole === "service_role" ? requestedPrefix : instancePrefix(ctx.instanceId);
  // production helper에서는 instance principal 사용·여기서는 service-role 으로 통합 list (audit 위주)
  const client = createServiceRoleClient();
  const r = await listWithClient(client, effective ?? "");
  auditLog.append({
    timestamp: Date.now(),
    instanceId: ctx.instanceId,
    actorId: ctx.actorId,
    actorRole: ctx.actorRole,
    action: "object-listed",
    objectKey: effective ?? null,
    method: null,
    contentType: null,
    ttlSeconds: null,
    result: "success",
    reason: null,
  });
  return r.keys;
}

async function main(): Promise<void> {
  auditLog.clear();

  // === Application-layer (helper 강제) ===
  // Case 1: A operator lists own prefix — seed/ subpath만 5개 명시
  // (다른 시나리오에서 instance-a 아래 ct-test 등 추가 가능)
  const aOwn = await tenantListObjects(ACTOR_A_OPERATOR);
  const aSeedOnly = aOwn.filter((k) => k.startsWith(`${instancePrefix(INSTANCE_A_ID)}seed/`));
  if (aSeedOnly.length !== 5) throw new Error(`A seed/ should have 5 objects, got ${aSeedOnly.length}. all=${aOwn.length}`);
  for (const key of aOwn) {
    if (!key.startsWith(instancePrefix(INSTANCE_A_ID))) {
      throw new Error(`leaked object outside A prefix: ${key}`);
    }
  }
  console.log(`[list-bucket] app-1 A own prefix: total=${aOwn.length}, seed/=${aSeedOnly.length} (PASS)`);

  // Case 2: A operator requests B prefix → helper denied
  let denied = false;
  try {
    await tenantListObjects(ACTOR_A_OPERATOR, instancePrefix(INSTANCE_B_ID));
  } catch {
    denied = true;
  }
  if (!denied) throw new Error("A→B prefix list should be denied");
  console.log("[list-bucket] app-2 cross-instance helper denied (PASS)");

  // Case 3: service_role bypass + audit — seed/ subpath만 명시
  const svcAll = await tenantListObjects(SERVICE_ROLE_ACTOR, instancePrefix(INSTANCE_B_ID));
  const svcSeedOnly = svcAll.filter((k) => k.startsWith(`${instancePrefix(INSTANCE_B_ID)}seed/`));
  if (svcSeedOnly.length !== 5) throw new Error(`service_role B seed/ should have 5 objects, got ${svcSeedOnly.length}`);
  console.log(`[list-bucket] app-3 service_role bypass: total=${svcAll.length}, seed/=${svcSeedOnly.length} (PASS)`);

  // === Credential-level (minio per-instance user policy 실측) ===
  const clientA = createInstanceClient("a");
  const clientB = createInstanceClient("b");

  // Case 4: instance-a credential → ListBucket prefix=instances/A/* → 200·≥5 keys (seed/ 5)
  const a4 = await listWithClient(clientA, instancePrefix(INSTANCE_A_ID));
  if (a4.httpStatus !== 200) throw new Error(`cred-A own prefix list: expected 200, got ${a4.httpStatus}`);
  const a4Seed = a4.keys.filter((k) => k.startsWith(`${instancePrefix(INSTANCE_A_ID)}seed/`));
  if (a4Seed.length !== 5) throw new Error(`cred-A seed/: expected 5 keys, got ${a4Seed.length}. total=${a4.keys.length}`);
  console.log(`[list-bucket] cred-4 instance-a own prefix: 200·total=${a4.keys.length}, seed/=${a4Seed.length} (PASS)`);

  // Case 5: instance-a credential → ListBucket prefix=instances/B/* → 403 (Condition mismatch)
  const a5 = await listWithClient(clientA, instancePrefix(INSTANCE_B_ID));
  if (a5.httpStatus !== 403) {
    throw new Error(`cred-A cross prefix list: expected 403 (Condition StringLike mismatch), got httpStatus=${a5.httpStatus}, keys=${a5.keys.length}`);
  }
  console.log(`[list-bucket] cred-5 instance-a → B prefix: 403 (PASS — minio policy condition)`);

  // Case 6: instance-b credential → ListBucket prefix=instances/B/* → 200·≥5 keys (seed/ 5)
  const b6 = await listWithClient(clientB, instancePrefix(INSTANCE_B_ID));
  if (b6.httpStatus !== 200) throw new Error(`cred-B own prefix list: expected 200, got ${b6.httpStatus}`);
  const b6Seed = b6.keys.filter((k) => k.startsWith(`${instancePrefix(INSTANCE_B_ID)}seed/`));
  if (b6Seed.length !== 5) throw new Error(`cred-B seed/: expected 5 keys, got ${b6Seed.length}. total=${b6.keys.length}`);
  console.log(`[list-bucket] cred-6 instance-b own prefix: 200·total=${b6.keys.length}, seed/=${b6Seed.length} (PASS)`);

  // === SPIKEC2-005 cycle3: empty/missing/root prefix credential deny ===

  type CredNegativeCase = {
    readonly label: string;
    readonly prefix: string;  // undefined·empty·root·partial 모두 string화
  };

  const CRED_NEGATIVE_CASES: ReadonlyArray<CredNegativeCase> = [
    { label: "prefix empty ''", prefix: "" },
    { label: "prefix root 'instances/'", prefix: "instances/" },
    { label: "prefix partial 'instances/aaa'", prefix: "instances/aaaaaaaa" },
    { label: "prefix other namespace 'other/'", prefix: "other/" },
    { label: "prefix B without trailing slash", prefix: `instances/${INSTANCE_B_ID}` },
  ];

  let credNegativeCount = 0;
  for (const c of CRED_NEGATIVE_CASES) {
    const result = await listWithClient(clientA, c.prefix);
    if (result.httpStatus !== 403) {
      throw new Error(`[list-bucket] cred-A ${c.label}: expected 403, got httpStatus=${result.httpStatus} keys=${result.keys.length}`);
    }
    if (result.keys.length !== 0) {
      throw new Error(`[list-bucket] cred-A ${c.label}: leaked ${result.keys.length} keys`);
    }
    credNegativeCount += 1;
    console.log(`[list-bucket] cred-neg '${c.label}': 403·0 keys (PASS)`);
  }

  console.log(`\n✅ test-list-bucket: app-layer 3 + cred-layer 3 + cred-neg ${credNegativeCount} = ${3 + 3 + credNegativeCount} cases PASS`);
  console.log("ℹ️  C-provider gate: R2 IAM Condition 동등성·STS·credential rotation은 Day 8 R2 staging 실측 필수");
}

main().catch((err) => {
  console.error("[list-bucket] FAIL:", err);
  process.exit(1);
});
