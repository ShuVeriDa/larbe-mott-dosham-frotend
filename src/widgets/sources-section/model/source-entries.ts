import type { Dictionary } from "@/i18n/dictionaries";

export type SourceKey = keyof Dictionary["sources"]["items"];

export type DirKey = keyof Dictionary["sources"]["directions"];
export type DomainKey = keyof Dictionary["sources"]["domains"];

export type SourceTag =
	| { kind: "dir"; dirKey: DirKey }
	| { kind: "domain"; domainKey: DomainKey }
	| null;

export interface SourceEntry {
	key: SourceKey;
	tag: SourceTag;
}

export const SOURCE_ENTRIES: ReadonlyArray<SourceEntry> = [
	{ key: "matsiev", tag: { kind: "dir", dirKey: "nahRu" } },
	{ key: "baysultanov", tag: { kind: "dir", dirKey: "nahRu" } },
	{ key: "karasaevMatsiev", tag: { kind: "dir", dirKey: "ruNah" } },
	{ key: "aslakhanov", tag: { kind: "dir", dirKey: "ruNah" } },
	{ key: "ismailov", tag: { kind: "dir", dirKey: "bidir" } },
	{ key: "daukaev", tag: { kind: "domain", domainKey: "geo" } },
	{ key: "abdurashidov", tag: { kind: "domain", domainKey: "law" } },
	{ key: "umarkhadzhiev", tag: { kind: "domain", domainKey: "math" } },
	{ key: "anatomical", tag: { kind: "domain", domainKey: "anat" } },
	{ key: "computer", tag: { kind: "domain", domainKey: "it" } },
	{ key: "manual", tag: null },
	{ key: "neologisms", tag: null },
];
