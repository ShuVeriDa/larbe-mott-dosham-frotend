export type QualityProblemType =
	| "no-meanings"
	| "no-class"
	| "no-pos"
	| "no-examples";

export interface QualityStats {
	total: number;
	noMeanings: number;
	nounsWithoutClass: number;
	noClass: number;
	noPartOfSpeech: number;
	noExamples: number;
	neologisms: number;
	problemsUnique: number;
	cleanEntries: number;
	pendingSuggestions: number;
}

export interface QualitySourceStat {
	source: string;
	total: number;
	ok: number;
	warn: number;
	err: number;
	okPct: number;
	warnPct: number;
	errPct: number;
}

export interface QualityProblemRow {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	entryType: string;
	sources: string[];
	updatedAt: string;
	problems: QualityProblemType[];
}

export interface QualityProblemsQuery {
	type?: QualityProblemType;
	q?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: "word" | "updated" | "source" | "problems";
	sortDir?: "asc" | "desc";
}

export interface QualityProblemsResponse {
	data: QualityProblemRow[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}
