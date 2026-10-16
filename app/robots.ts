import type { MetadataRoute } from "next";
import { siteUrl, indexable } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return indexable && siteUrl
    ? {
        rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/my-club"] },
        sitemap: `${siteUrl}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
