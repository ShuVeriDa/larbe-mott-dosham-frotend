import type { Dictionary } from "@/i18n/dictionaries";

export type FeatureKey = keyof Dictionary["features"]["items"];

export const FEATURE_ENTRIES: ReadonlyArray<{
	key: FeatureKey;
	icon: string;
}> = [
	{ key: "bilingualSearch", icon: "🔍" },
	{ key: "declension", icon: "📐" },
	{ key: "conjugation", icon: "⚡" },
	{ key: "phraseology", icon: "💬" },
	{ key: "wordLevels", icon: "📊" },
	{ key: "favorites", icon: "⭐" },
];
