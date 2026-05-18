// @glitzy/shared-errors — base error classes

/**
 * AppError: base class for all domain errors.
 * 모든 production error는 본 class 또는 하위를 throw — type narrowing·error code 기반 처리.
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
  constructor(message: string, public readonly details: Record<string, unknown> = {}) {
    super(message);
  }
}

export class InvariantViolationError extends AppError {
  override readonly code = "INVARIANT_VIOLATION";
  override readonly httpStatus = 500;
  override readonly name = "InvariantViolationError";
}

export class ConfigurationError extends AppError {
  override readonly code = "CONFIGURATION_ERROR";
  override readonly httpStatus = 500;
  override readonly name = "ConfigurationError";
}

export class ConcurrencyConflictError extends AppError {
  override readonly code = "CONCURRENCY_CONFLICT";
  override readonly httpStatus = 409;
  override readonly name = "ConcurrencyConflictError";
}

export class ValidationError extends AppError {
  override readonly code = "VALIDATION_ERROR";
  override readonly httpStatus = 400;
  override readonly name = "ValidationError";
}
