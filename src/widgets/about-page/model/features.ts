import type { Dictionary } from "@/i18n/dictionaries";

export type AboutFeatureKey = keyof Dictionary["about"]["features"]["items"];

export const ABOUT_FEATURE_ENTRIES: ReadonlyArray<{
	key: AboutFeatureKey;
	icon: string;
}> = [
	{ key: "bilingualSearch", icon: "🔍" },
	{ key: "declensionConjugation", icon: "🔄" },
	{ key: "phraseology", icon: "💬" },
	{ key: "cefr", icon: "🏷" },
	{ key: "favoritesHistory", icon: "⭐" },
	{ key: "api", icon: "🔗" },
];
