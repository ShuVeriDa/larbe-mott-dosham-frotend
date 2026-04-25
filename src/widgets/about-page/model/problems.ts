import type { Dictionary } from "@/i18n/dictionaries";

export type ProblemKey = keyof Dictionary["about"]["problems"]["items"];

export const PROBLEM_ENTRIES: ReadonlyArray<{
	key: ProblemKey;
	icon: string;
}> = [
	{ key: "noSingleDictionary", icon: "📖" },
	{ key: "scatteredData", icon: "🧩" },
	{ key: "noTools", icon: "🔤" },
	{ key: "noApi", icon: "🔌" },
];
