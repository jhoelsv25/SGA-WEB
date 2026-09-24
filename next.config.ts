import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/login",
        destination: "/login",
      },
      {
        source: "/auth/recover",
        destination: "/recover",
      },
      {
        source: "/auth/forgot-password",
        destination: "/recover",
      },
      {
        source: "/forgot-password",
        destination: "/recover",
      },
    ];
  },
};

export default nextConfig;
