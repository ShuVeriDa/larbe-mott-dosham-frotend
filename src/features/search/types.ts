export type FilterKey = "cefr" | "pos" | "nounClass" | "entryType";
export type FilterValues = Record<FilterKey, string>;

export interface FilterOption {
	value: string;
	label: string;
}

export interface FilterGroup {
	key: FilterKey;
	label: string;
	options: readonly FilterOption[];
}

export interface ActiveFilter {
	key: FilterKey;
	label: string;
}
