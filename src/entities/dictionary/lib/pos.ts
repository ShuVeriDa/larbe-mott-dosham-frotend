import type { PartOfSpeech } from "../types";

export const isVerbPos = (pos?: PartOfSpeech | null): boolean => {
	if (!pos) return false;
	const normalized = pos.toLowerCase();
	return (
		normalized.includes("гл.") ||
		normalized.includes("глаг") ||
		normalized.includes("verb") ||
		normalized.includes("хандош") ||
		normalized === "масд."
	);
};

export const isNounPos = (pos?: PartOfSpeech | null): boolean => {
	if (!pos) return false;
	const normalized = pos.toLowerCase();
	return (
		normalized.includes("сущ.") ||
		normalized.includes("noun") ||
		normalized.includes("ц1ердош") ||
		normalized.includes("цIердош")
	);
};
