import type { Dictionary } from "@/i18n/dictionaries";

type MorphCaseKey = keyof Dictionary["morphology"]["cases"];
type MorphTenseKey = keyof Dictionary["morphology"]["tenses"];
type MorphClassKey = keyof Dictionary["morphology"]["classes"];

export interface MorphDeclensionEntry {
	kind: "declension";
	word: string;
	classKey: MorphClassKey;
	rows: ReadonlyArray<{ caseKey: MorphCaseKey; form: string; highlight?: boolean }>;
}

export interface MorphConjugationEntry {
	kind: "conjugation";
	word: string;
	rows: ReadonlyArray<{ tenseKey: MorphTenseKey; form: string; highlight?: boolean }>;
}

export type MorphEntry = MorphDeclensionEntry | MorphConjugationEntry;

export const MORPH_ENTRIES: ReadonlyArray<MorphEntry> = [
	{
		kind: "declension",
		word: "стаг",
		classKey: "vu",
		rows: [
			{ caseKey: "nominative", form: "стаг", highlight: true },
			{ caseKey: "genitive", form: "стаган" },
			{ caseKey: "dative", form: "стагна" },
			{ caseKey: "ergative", form: "стаго" },
			{ caseKey: "instrumental", form: "стагаца" },
			{ caseKey: "material", form: "стагах" },
			{ caseKey: "locative", form: "стаге" },
			{ caseKey: "comparative", form: "стагал" },
		],
	},
	{
		kind: "conjugation",
		word: "лаха",
		rows: [
			{ tenseKey: "present", form: "лоху", highlight: true },
			{ tenseKey: "presentCompound", form: "лохуш ву" },
			{ tenseKey: "perfect", form: "лехна" },
			{ tenseKey: "pluperfect", form: "лехнера" },
			{ tenseKey: "imperfect", form: "лохура" },
			{ tenseKey: "futurePossible", form: "лахар ду" },
			{ tenseKey: "futureFactual", form: "лоху ду" },
			{ tenseKey: "imperative", form: "лахал" },
		],
	},
];
