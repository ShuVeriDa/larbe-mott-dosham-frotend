import type { DictionarySource } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";

type DirectionKey = keyof Dictionary["stats"]["sources"]["directions"];

export const resolveDirectionLabel = (
	direction: DictionarySource["direction"],
	labels: Dictionary["stats"]["sources"]["directions"],
): string => {
	if (direction in labels) return labels[direction as DirectionKey];
	return direction;
};
