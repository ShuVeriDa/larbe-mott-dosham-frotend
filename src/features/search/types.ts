import type {
	EntryType,
	SortOrder,
	WordLevel,
} from "@/entities/dictionary";

export type FilterKey =
	| "level"
	| "pos"
	| "nounClass"
	| "entryType"
	| "attested"
	| "source";

/**
 * URL-serialisable filter state. `level` is a multi-select so we keep an array;
 * the other filters are single-select strings (empty string = "no filter").
 */
export interface FilterValues {
	level: WordLevel[];
	pos: string;
	nounClass: string;
	entryType: "" | EntryType;
	attested: "" | "true" | "false";
	source: string;
}

export interface FilterOption {
	value: string;
	label: string;
}

export interface FilterGroup {
	key: FilterKey;
	label: string;
	options: readonly FilterOption[];
	multi?: boolean;
}

export interface ActiveFilter {
	key: FilterKey;
	/** Unique per-filter value (needed because `level` may produce several chips). */
	value: string;
	label: string;
}

export type { SortOrder };
