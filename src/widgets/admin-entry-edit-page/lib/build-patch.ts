import type { AdminEntryFullResponse } from "@/features/admin-entries";

const STRIP_KEYS = [
	"id",
	"wordNormalized",
	"createdAt",
	"updatedAt",
	"attested",
] as const;

const normalizeString = (
	value: string | null | undefined,
): string | null | undefined => {
	if (value === undefined) return undefined;
	if (value === null) return null;
	const trimmed = value.trim();
	return trimmed === "" ? null : trimmed;
};

export const buildEntryPatch = (
	draft: AdminEntryFullResponse,
): Partial<AdminEntryFullResponse> => {
	const copy: Record<string, unknown> = { ...draft };
	for (const key of STRIP_KEYS) delete copy[key];

	const stringFields = [
		"wordAccented",
		"partOfSpeech",
		"partOfSpeechNah",
		"latinName",
		"styleLabel",
		"domain",
	] as const;
	for (const key of stringFields) {
		if (key in copy) {
			copy[key] = normalizeString(copy[key] as string | null | undefined);
		}
	}

	if ("word" in copy && typeof copy.word === "string") {
		copy.word = copy.word.trim();
	}

	return copy as Partial<AdminEntryFullResponse>;
};
