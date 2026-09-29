import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";

if (isStaticExport) {
  const requiredPublicConfig = [
    "NEXT_PUBLIC_CLOUDBASE_ENV_ID",
    "NEXT_PUBLIC_CLOUDBASE_ACCESS_KEY",
    "NEXT_PUBLIC_ACCOUNT_API_BASE",
    "NEXT_PUBLIC_PAYMENT_API_BASE",
  ];
  const missingConfig = requiredPublicConfig.filter((name) => !process.env[name]?.trim());

  if (missingConfig.length > 0) {
    throw new Error(`Static export is missing public configuration: ${missingConfig.join(", ")}`);
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export" as const } : {}),
};

export default nextConfig;
