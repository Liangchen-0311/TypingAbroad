import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const routes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/practice", changeFrequency: "weekly", priority: 0.9 },
  { path: "/words", changeFrequency: "weekly", priority: 0.9 },
  { path: "/library", changeFrequency: "monthly", priority: 0.8 },
  { path: "/progress", changeFrequency: "monthly", priority: 0.5 },
  { path: "/vocabulary", changeFrequency: "monthly", priority: 0.5 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
