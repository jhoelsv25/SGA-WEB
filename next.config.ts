import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
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
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/admin/dashboard",
        permanent: false,
      },
      {
        source: "/dashboard/admin/users",
        destination: "/admin/users",
        permanent: false,
      },
      {
        source: "/dashboard/admin/roles",
        destination: "/admin/roles",
        permanent: false,
      },
      {
        source: "/dashboard/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
