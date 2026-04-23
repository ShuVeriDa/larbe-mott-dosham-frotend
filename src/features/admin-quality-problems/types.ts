import type { Meaning } from "@/entities/dictionary";

export type QualityProblemType =
	| "no-meanings"
	| "no-class"
	| "no-pos"
	| "no-examples";

export type QualityProblemFilter = "" | QualityProblemType;

export type QualitySortField = "updated" | "word" | "source" | "problems";
export type QualitySortDir = "asc" | "desc";

export interface QualityProblemsQuery {
	type?: QualityProblemType;
	q?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: QualitySortField;
	sortDir?: QualitySortDir;
	include?: "meanings";
}

export interface QualityProblemRow {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	entryType: "standard" | "neologism";
	sources: string[];
	updatedAt: string;
	problems: QualityProblemType[];
	meanings?: Meaning[];
}

export interface QualityProblemsResponse {
	data: QualityProblemRow[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface QualityStatsResponse {
	total: number;
	noMeanings: number;
	nounsWithoutClass: number;
	noClass?: number;
	noPartOfSpeech: number;
	noExamples: number;
	neologisms: number;
	problemsUnique: number;
	cleanEntries: number;
	pendingSuggestions: number;
}
