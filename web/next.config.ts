import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: false,
  experimental: { viewTransition: true },
  images: {
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_OSS_DOMAIN}/**`)],
  },
};

export default nextConfig;
