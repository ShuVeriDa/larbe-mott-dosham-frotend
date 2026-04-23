import type { DictionaryStats } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";

export interface HeroStatItem {
	key: "entries" | "sources" | "domains" | "levels";
	value: number;
	label: string;
	highlight?: boolean;
}

export const mapHeroItems = (
	stats: DictionaryStats,
	labels: Dictionary["stats"]["hero"],
): HeroStatItem[] => [
	{ key: "entries", value: stats.total, label: labels.entries, highlight: true },
	{ key: "sources", value: stats.totalSources, label: labels.sources },
	{ key: "domains", value: stats.domains.length, label: labels.domains },
	{ key: "levels", value: stats.wordLevels.length, label: labels.levels },
];
