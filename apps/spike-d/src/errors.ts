// Spike D — domain errors

export class MigrationChecksumMismatchError extends Error {
  override readonly name = "MigrationChecksumMismatchError";
  constructor(public readonly filename: string, public readonly expected: string, public readonly actual: string) {
    super(`migration '${filename}' checksum mismatch: expected ${expected}, got ${actual}`);
  }
}

export class AdvisoryLockNotAcquiredError extends Error {
  override readonly name = "AdvisoryLockNotAcquiredError";
  constructor(public readonly lockKey: string) {
    super(`advisory lock ${lockKey} already held by another process`);
  }
}

export class SchemaDriftError extends Error {
  override readonly name = "SchemaDriftError";
  constructor(public readonly target: string, public readonly diff: string) {
    super(`schema drift detected on ${target}:\n${diff}`);
  }
}

export class ForwardOnlyHotfixRejectedError extends Error {
  override readonly name = "ForwardOnlyHotfixRejectedError";
  constructor(public readonly filename: string, public readonly reason: string) {
    super(`forward-only hotfix '${filename}' rejected: ${reason}`);
  }
}

export class MigrationAuditError extends Error {
  override readonly name = "MigrationAuditError";
  constructor(message: string) {
    super(message);
  }
}

export class ServiceRoleGuardError extends Error {
  override readonly name = "ServiceRoleGuardError";
  constructor(public readonly attemptedFunction: string, public readonly allowedFunctions: readonly string[]) {
    super(`service_role function '${attemptedFunction}' not in allowed list: ${allowedFunctions.join(", ")}`);
  }
}
