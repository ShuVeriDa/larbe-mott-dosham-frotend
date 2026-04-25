import type { Dictionary } from "@/i18n/dictionaries";

export type AboutSourceSlug = keyof Dictionary["about"]["sources"]["items"];
export type AboutSourceDirection =
	keyof Dictionary["about"]["sources"]["directions"];
export type AboutSourceDomain = keyof Dictionary["about"]["sources"]["domains"];

export interface AboutSourceEntry {
	slug: AboutSourceSlug;
	direction: AboutSourceDirection;
	domain: AboutSourceDomain;
}

export const ABOUT_SOURCE_ENTRIES: ReadonlyArray<AboutSourceEntry> = [
	{ slug: "maciev", direction: "nah-ru", domain: "general" },
	{ slug: "baisultanov", direction: "nah-ru", domain: "general" },
	{ slug: "karasaev-maciev", direction: "ru-nah", domain: "general" },
	{ slug: "aslahanov", direction: "ru-nah", domain: "general" },
	{ slug: "ismailov", direction: "both", domain: "general" },
	{ slug: "daukaev", direction: "ru-nah", domain: "geology" },
	{ slug: "abdurashidov", direction: "both", domain: "law" },
	{ slug: "umarhadjiev", direction: "both", domain: "math" },
	{ slug: "anatomy", direction: "both", domain: "anatomy" },
	{ slug: "computer", direction: "both", domain: "it" },
	{ slug: "collected", direction: "both", domain: "misc" },
	{ slug: "neologisms", direction: "original", domain: "misc" },
];
