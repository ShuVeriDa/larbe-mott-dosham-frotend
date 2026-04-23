export type AuditActionType =
	| "CREATE"
	| "UPDATE"
	| "DELETE"
	| "BULK"
	| "PIPELINE";

export type AuditPeriod = "today" | "week" | "month" | "all";

export interface AuditAuthor {
	id: string;
	name: string;
	avatarUrl?: string;
	kind: "user" | "system" | "api";
}

export interface AuditItem {
	id: string;
	type: AuditActionType;
	word?: string;
	entryId?: number;
	description: string;
	diff?: { field: string; before: unknown; after: unknown }[];
	jsonDiff?: { added?: string[]; removed?: string[]; changed?: string[] };
	at: string;
	author: AuditAuthor;
}

export interface AuditQuery {
	q?: string;
	action?: AuditActionType | "";
	author?: string;
	period?: AuditPeriod;
	page?: number;
	limit?: number;
}

export interface AuditResponse {
	data: AuditItem[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface AuditStats {
	today: number;
	week: number;
	bulk: number;
	pipeline: number;
}

export interface AuditEntrySummary {
	entryId: number;
	word: string;
	partOfSpeech?: string;
	cefrLevel?: string;
	sources: string[];
	changesCount: number;
	authorsCount: number;
	createdAt: string;
}

export interface AuditEntryTimelineResponse {
	summary: AuditEntrySummary;
	items: AuditItem[];
}
