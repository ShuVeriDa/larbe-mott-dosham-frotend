import {
	CHECHEN_CASE_FORMS_COUNT,
	CHECHEN_TENSE_FORMS_COUNT,
	type DictionaryStats,
} from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";

export interface StatItem {
	label: string;
	value: number;
}

export const mapStatsToItems = (
	stats: DictionaryStats | undefined,
	labels: Dictionary["statsBand"],
): StatItem[] => [
	{ label: labels.entries, value: stats?.total ?? 0 },
	{ label: labels.sources, value: stats?.totalSources ?? 0 },
	{ label: labels.caseForms, value: CHECHEN_CASE_FORMS_COUNT },
	{ label: labels.tenseForms, value: CHECHEN_TENSE_FORMS_COUNT },
];
