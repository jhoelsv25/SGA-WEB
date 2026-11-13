import type { NextConfig } from "next";

// Origen del backend para next/image (logos y fotos en /uploads)
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        ...(apiUrl.port ? { port: apiUrl.port } : {}),
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
