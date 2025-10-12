import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: false,
  experimental: { viewTransition: true },
  images: {
    remotePatterns: [new URL("https://static.goee.net/**")],
  },
};

export default nextConfig;
