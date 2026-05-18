// @glitzy/notifications-outbox — domain errors

import { AppError } from "@glitzy/shared-errors";

export class OutboxAlreadyEnqueuedError extends AppError {
  override readonly code = "OUTBOX_ALREADY_ENQUEUED";
  override readonly httpStatus = 409;
  override readonly name = "OutboxAlreadyEnqueuedError";
  constructor(public readonly instanceId: string, public readonly sourceEventId: string) {
    super(`outbox row already exists for (${instanceId}, ${sourceEventId})`);
  }
}

export class OutboxClaimRaceError extends AppError {
  override readonly code = "OUTBOX_CLAIM_RACE";
  override readonly httpStatus = 409;
  override readonly name = "OutboxClaimRaceError";
}

export class ProviderTransientError extends AppError {
  override readonly code = "PROVIDER_TRANSIENT";
  override readonly httpStatus = 503;
  override readonly name = "ProviderTransientError";
}

export class ProviderPermanentError extends AppError {
  override readonly code = "PROVIDER_PERMANENT";
  override readonly httpStatus = 422;
  override readonly name = "ProviderPermanentError";
}
