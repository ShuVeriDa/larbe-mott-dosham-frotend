import type { FilterKey, FilterValues } from "../types";

/** Canonical keys of each filter group (values sent to the backend as-is). */
export const LEVEL_KEYS = ["A", "B", "C"] as const;

export const POS_KEYS = [
	"сущ.",
	"гл.",
	"прил.",
	"нареч.",
	"послелог",
	"частица",
	"мест.",
	"числ.",
	"межд.",
] as const;

export const NOUN_CLASS_KEYS = ["ву", "йу", "ду", "бу"] as const;

export const ENTRY_TYPE_KEYS = ["standard", "neologism"] as const;

export const ATTESTED_KEYS = ["true", "false"] as const;

export const FILTER_KEYS: readonly FilterKey[] = [
	"level",
	"pos",
	"nounClass",
	"entryType",
	"attested",
	"source",
];

export const EMPTY_FILTERS: FilterValues = {
	level: [],
	pos: "",
	nounClass: "",
	entryType: "",
	attested: "",
	source: "",
};

export const DEFAULT_LIMIT = 20;
