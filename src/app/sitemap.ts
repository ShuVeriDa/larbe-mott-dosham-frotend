import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/dictionaries";

const BASE_URL = "https://dosham.app";

const ROUTES = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/search", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/phraseology", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/random", changeFrequency: "daily" as const, priority: 0.7 },
  { path: "/stats", changeFrequency: "weekly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}/ru${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ...Object.fromEntries(
          LOCALES.map((lang) => [lang, `${BASE_URL}/${lang}${path}`]),
        ),
        "x-default": `${BASE_URL}/ru${path}`,
      },
    },
  }));
}
