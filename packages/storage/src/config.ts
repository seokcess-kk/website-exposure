// @glitzy/storage — config (env에 직접 의존 안 함)

export type StorageConfig = {
  readonly s3Endpoint: string;
  readonly s3Region: string;
  readonly s3Bucket: string;
  /** signed URL TTL default (seconds) */
  readonly signedUrlTtlSeconds: number;
  /** refresh interval — refresh helper에서 사용 */
  readonly signedUrlRefreshBeforeSeconds: number;
  /** max TTL (seconds) — 24h 권장 */
  readonly signedUrlMaxTtlSeconds: number;
  /** forcePathStyle — minio·R2 path-style 호환 */
  readonly forcePathStyle: boolean;
};

export type S3Credentials = {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
};

export function validateStorageConfig(cfg: StorageConfig): void {
  if (cfg.signedUrlTtlSeconds <= 0) throw new Error("signedUrlTtlSeconds must be positive");
  if (cfg.signedUrlMaxTtlSeconds < cfg.signedUrlTtlSeconds) {
    throw new Error("signedUrlMaxTtlSeconds must be >= signedUrlTtlSeconds");
  }
  if (cfg.signedUrlRefreshBeforeSeconds >= cfg.signedUrlTtlSeconds) {
    throw new Error("signedUrlRefreshBeforeSeconds must be < signedUrlTtlSeconds");
  }
}
