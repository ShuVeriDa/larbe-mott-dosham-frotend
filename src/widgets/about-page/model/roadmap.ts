import type { Dictionary } from "@/i18n/dictionaries";

export type RoadmapKey = keyof Dictionary["about"]["roadmap"]["items"];

export const ROADMAP_ENTRIES: ReadonlyArray<{
	key: RoadmapKey;
	icon: string;
}> = [
	{ key: "audio", icon: "🔊" },
	{ key: "dialects", icon: "🗺" },
	{ key: "flashcards", icon: "🃏" },
	{ key: "export", icon: "📤" },
	{ key: "synonyms", icon: "🔗" },
	{ key: "i18n", icon: "🌍" },
];
