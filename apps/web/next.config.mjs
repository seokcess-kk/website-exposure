// @glitzy/web — Next.js config
// Plan v1.0 § 7: serverActions.bodySizeLimit 명시 (ADMIN-UI-39)
// Plan v1.0 § 4: monorepo workspace package import 위해 transpilePackages

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: process.env.NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT ?? "2mb",
    },
  },
  transpilePackages: [
    "@glitzy/auth",
    "@glitzy/core-content",
    "@glitzy/db",
    "@glitzy/shared-errors",
    "@glitzy/shared-types",
  ],
  reactStrictMode: true,
};

export default nextConfig;
