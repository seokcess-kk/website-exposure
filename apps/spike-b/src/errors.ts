// Spike B — error helpers (Spike A 동일)

export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export class TenantContextError extends Error {
  override readonly name = "TenantContextError";
}

export class PermanentProviderError extends Error {
  override readonly name = "PermanentProviderError";
}

export class TransientProviderError extends Error {
  override readonly name = "TransientProviderError";
}
