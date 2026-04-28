import type { Dictionary } from "@/i18n/dictionaries";

type PosKey = keyof Dictionary["search"]["filters"]["posValues"];

// Backend sends canonical abbreviated keys (e.g. "сущ.", "гл.").
// resolvePosLabel maps them to the localized full name via the posValues dict.
export const resolvePosLabel = (
	pos: string,
	values: Dictionary["search"]["filters"]["posValues"],
): string => {
	if (pos in values) return values[pos as PosKey];
	return pos;
};

// Capitalize the first letter of the abbreviation for display (сущ. → Сущ.).
export const resolvePosShort = (pos: string): string =>
	pos.charAt(0).toUpperCase() + pos.slice(1);
