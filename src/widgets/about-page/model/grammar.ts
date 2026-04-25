import type { Dictionary } from "@/i18n/dictionaries";

export type GrammarCardKey = keyof Dictionary["about"]["grammar"]["cards"];

export const GRAMMAR_CARD_ORDER: ReadonlyArray<GrammarCardKey> = [
	"classes",
	"cases",
	"declensionTypes",
	"tenses",
];
