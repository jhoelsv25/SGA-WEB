import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          siteConfig.routes.home,
          siteConfig.routes.login,
          siteConfig.routes.privacy,
          siteConfig.routes.terms,
        ],
        disallow: [
          "/api/",
          `${siteConfig.routes.dashboard}/`,
          "/admin/",
          siteConfig.routes.recover,
          siteConfig.routes.changePassword,
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
