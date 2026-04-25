"use client";

import type {
	AdminEntriesPosFilter,
	AdminEntriesStats,
} from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import { FilterChips } from "@/shared/ui/admin";
import type { FC } from "react";

interface Props {
	value: AdminEntriesPosFilter;
	onChange: (value: AdminEntriesPosFilter) => void;
	stats: AdminEntriesStats | undefined;
	dict: Dictionary["admin"]["entries"]["tabs"];
}

export const EntriesPosTabs: FC<Props> = ({ value, onChange, stats, dict }) => {
	const options: { value: AdminEntriesPosFilter; label: string; count?: number }[] = [
		{ value: "", label: dict.all, count: stats?.total },
		{ value: "noun", label: dict.nouns, count: stats?.nouns },
		{ value: "verb", label: dict.verbs, count: stats?.verbs },
		{ value: "adjective", label: dict.adjectives, count: stats?.adjectives },
		{ value: "adverb", label: dict.adverbs, count: stats?.adverbs },
		{ value: "other", label: dict.other, count: stats?.other },
	];

	return (
		<FilterChips
			className="mb-4 overflow-x-auto"
			options={options}
			value={value}
			onChange={(v) => onChange(v as AdminEntriesPosFilter)}
		/>
	);
};
