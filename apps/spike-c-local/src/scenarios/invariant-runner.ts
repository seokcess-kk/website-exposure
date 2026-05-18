// Spike C — invariant runner
// SPIKEC1-009 cycle2: TenantPrefixMismatchError만 deny 카운트·MalformedObjectKeyError·기타 error 즉시 fail

import { env } from "../env.js";
import { createRootS3Client } from "../storage-client.js";
import { issueSignedUrl } from "../sign-url.js";
import { auditLog } from "../audit-log.js";
import { instancePrefix } from "../tenant-context.js";
import { InvariantViolationError, TenantPrefixMismatchError } from "../errors.js";

import { randomUUID } from "node:crypto";

function generateInstanceId(): string {
  // node 19+ crypto.randomUUID returns RFC 4122 v4 (lowercase canonical)
  return randomUUID();
}

async function main(): Promise<void> {
  const client = createRootS3Client();
  const instanceIds = Array.from({ length: env.INVARIANT_INSTANCES }, generateInstanceId);
  console.log(`[invariant] generated ${instanceIds.length} instance ids`);

  auditLog.clear();
  const start = Date.now();

  // Phase 1: self-prefix sign (M per instance)
  let selfSuccess = 0;
  for (const id of instanceIds) {
    for (let i = 0; i < env.INVARIANT_OBJECTS_PER_INSTANCE; i += 1) {
      await issueSignedUrl(client, {
        ctx: { instanceId: id, actorId: `actor-${id}`, actorRole: "operator" },
        objectKey: `instances/${id}/inv/${i}.txt`,
        method: "GET",
      });
      selfSuccess += 1;
    }
  }

  // Phase 2: cross-instance attempts — TenantPrefixMismatchError만 deny로 인정
  let crossDenied = 0;
  let unexpectedError = 0;
  let unexpectedErrors: string[] = [];
  for (let attempt = 0; attempt < env.INVARIANT_CROSS_ATTEMPTS; attempt += 1) {
    if (instanceIds.length < 2) break;
    let aIdx = Math.floor(Math.random() * instanceIds.length);
    let bIdx = Math.floor(Math.random() * instanceIds.length);
    while (bIdx === aIdx) bIdx = Math.floor(Math.random() * instanceIds.length);
    const a = instanceIds[aIdx]!;
    const b = instanceIds[bIdx]!;
    try {
      await issueSignedUrl(client, {
        ctx: { instanceId: a, actorId: `actor-${a}`, actorRole: "operator" },
        objectKey: `instances/${b}/inv/0.txt`,
        method: "GET",
      });
      throw new InvariantViolationError("cross-instance sign did NOT deny", { a, b });
    } catch (err) {
      if (err instanceof InvariantViolationError) throw err;
      if (err instanceof TenantPrefixMismatchError) {
        crossDenied += 1;
      } else {
        unexpectedError += 1;
        if (unexpectedErrors.length < 5) {
          unexpectedErrors.push(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
        }
      }
    }
  }

  const elapsed = Date.now() - start;

  if (unexpectedError > 0) {
    throw new InvariantViolationError(
      `cross attempts had ${unexpectedError} unexpected errors (must be 0). samples=${unexpectedErrors.join(" | ")}`,
      { unexpectedError, samples: unexpectedErrors },
    );
  }

  // Audit invariants
  const auditEntries = auditLog.list();
  const successAudit = auditLog.countByResult("success");
  const deniedAudit = auditLog.countByResult("denied");

  if (successAudit !== selfSuccess) {
    throw new InvariantViolationError("audit success count mismatch", { successAudit, selfSuccess });
  }
  if (deniedAudit !== crossDenied) {
    throw new InvariantViolationError("audit denied count mismatch", { deniedAudit, crossDenied });
  }

  // Leak scan
  const forbidden = ["x-amz-signature", "x-amz-credential", "x-amz-security-token"];
  for (const e of auditEntries) {
    const blob = JSON.stringify(e).toLowerCase();
    for (const f of forbidden) {
      if (blob.includes(f)) {
        throw new InvariantViolationError("audit leak", { pattern: f, entry: e });
      }
    }
  }

  // Prefix invariant — success audit objectKey가 own prefix로 시작
  for (const e of auditEntries) {
    if (e.result === "success" && e.action === "signed-url-issued" && typeof e.objectKey === "string") {
      const expected = instancePrefix(e.instanceId);
      if (!e.objectKey.startsWith(expected)) {
        throw new InvariantViolationError("success audit prefix mismatch", { entry: e, expected });
      }
    }
  }

  console.log(`[invariant] selfSuccess=${selfSuccess} crossDenied=${crossDenied} unexpectedError=${unexpectedError} audit.success=${successAudit} audit.denied=${deniedAudit} time=${elapsed}ms`);
  console.log("\n✅ invariant: ALL CHECKS PASS");
}

main().catch((err) => {
  console.error("[invariant] FAIL:", err);
  process.exit(1);
});
