export type BulkFieldKind =
	| "select"
	| "text"
	| "json";

export interface BulkFieldMeta {
	/** Backend field name */
	key: string;
	/** Translation key under dict.operation.fields */
	labelKey: string;
	kind: BulkFieldKind;
	/** Fixed options for select fields */
	options?: string[];
	/** Placeholder for text/json inputs */
	placeholder?: string;
}

export const FIELD_METAS: BulkFieldMeta[] = [
	{
		key: "partOfSpeech",
		labelKey: "partOfSpeech",
		kind: "text",
		placeholder: "сущ. / гл. / прил.",
	},
	{
		key: "partOfSpeechNah",
		labelKey: "partOfSpeechNah",
		kind: "text",
	},
	{
		key: "nounClass",
		labelKey: "nounClass",
		kind: "select",
		options: ["ву", "йу", "ду", "бу"],
	},
	{
		key: "nounClassPlural",
		labelKey: "nounClassPlural",
		kind: "text",
	},
	{
		key: "cefrLevel",
		labelKey: "cefrLevel",
		kind: "select",
		options: ["A1", "A2", "B1", "B2", "C1", "C2"],
	},
	{
		key: "wordLevel",
		labelKey: "wordLevel",
		kind: "select",
		options: ["A", "B", "C"],
	},
	{
		key: "entryType",
		labelKey: "entryType",
		kind: "select",
		options: ["standard", "neologism"],
	},
	{
		key: "domain",
		labelKey: "domain",
		kind: "text",
	},
	{
		key: "styleLabel",
		labelKey: "styleLabel",
		kind: "text",
	},
	{
		key: "latinName",
		labelKey: "latinName",
		kind: "text",
	},
	{
		key: "meanings",
		labelKey: "meanings",
		kind: "json",
	},
	{
		key: "grammar",
		labelKey: "grammar",
		kind: "json",
	},
	{
		key: "phraseology",
		labelKey: "phraseology",
		kind: "json",
	},
];

export const getFieldMeta = (key: string): BulkFieldMeta | undefined =>
	FIELD_METAS.find((f) => f.key === key);

/** Parse a raw input to the value that should be sent to the backend. */
export const parseFieldValue = (
	meta: BulkFieldMeta,
	raw: string,
): { ok: true; value: unknown } | { ok: false; error: string } => {
	if (meta.kind === "json") {
		const trimmed = raw.trim();
		if (!trimmed) return { ok: true, value: null };
		try {
			return { ok: true, value: JSON.parse(trimmed) };
		} catch (e) {
			return {
				ok: false,
				error: e instanceof Error ? e.message : String(e),
			};
		}
	}
	return { ok: true, value: raw };
};
