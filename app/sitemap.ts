import type { MetadataRoute } from "next";
import { siteUrl, indexable } from "@/lib/site";
import { CLUBS } from "@/lib/clubs";
import { STORIES } from "@/lib/stories";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl || !indexable) return [];
  const paths = [
    "",
    "/matches",
    "/table",
    "/stats",
    "/clubs",
    "/stories",
    "/about",
    "/credits",
    ...CLUBS.map((club) => `/club/${club.slug}`),
    ...STORIES.map((story) => `/stories/${story.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
