import type { MetadataRoute } from "next";

const BASE_URL = "https://dosham.app";

const ROUTES = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/search", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/phraseology", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/random", changeFrequency: "daily" as const, priority: 0.7 },
  { path: "/stats", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}/ru${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ru: `${BASE_URL}/ru${path}`,
        en: `${BASE_URL}/en${path}`,
        "ce-RU": `${BASE_URL}/che${path}`,
        "x-default": `${BASE_URL}/ru${path}`,
      },
    },
  }));
}
