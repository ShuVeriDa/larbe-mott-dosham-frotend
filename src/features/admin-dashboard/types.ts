export type AdminProblemType =
	| "no-meanings"
	| "no-class"
	| "no-pos"
	| "no-examples";

export interface AdminProblemBreakdown {
	count: number;
	pct: number;
}

export interface AdminQualityBreakdown {
	noMeanings: AdminProblemBreakdown;
	noClass: AdminProblemBreakdown;
	noPos: AdminProblemBreakdown;
	noExamples: AdminProblemBreakdown;
}

export interface AdminDashboardStats {
	totalEntries: number;
	sourcesCount: number;
	problemsCount: number;
	completenessPct: number;
	entriesWithoutProblems: number;
	byProblem: AdminQualityBreakdown;
	sidebar: {
		entries: number;
		suggestions: number;
		users: number;
	};
	updatedToday?: number;
}

export interface AdminProblemRow {
	entryId: number;
	word: string;
	source: string;
	problems: AdminProblemType[];
	updatedAt: string;
}

export interface AdminProblemsQuery {
	type?: AdminProblemType;
	source?: string;
	q?: string;
	page?: number;
	limit?: number;
	sortBy?: "updatedAt" | "word";
	sortDir?: "asc" | "desc";
}

export interface AdminProblemsResponse {
	data: AdminProblemRow[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}
