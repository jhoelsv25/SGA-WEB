import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sga.carmelitas.edu.pe";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/api/", "/dashboard/", "/admin/", "/recover"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
