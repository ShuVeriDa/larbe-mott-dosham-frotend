import type { Dictionary } from "@/i18n/dictionaries";

type PosKey = keyof Dictionary["search"]["filters"]["posValues"];

export const resolvePosLabel = (
	pos: string,
	values: Dictionary["search"]["filters"]["posValues"],
): string => {
	if (pos in values) return values[pos as PosKey];
	return pos;
};
