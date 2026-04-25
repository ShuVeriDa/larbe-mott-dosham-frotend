export type AuditAction =
	| "create"
	| "update"
	| "delete"
	| "bulk"
	| "pipeline"
	| "revert";

export type AuditActorType = "admin" | "pipeline" | "api";

export type AuditPeriod = "today" | "week" | "month" | "all";

export interface AuditUser {
	id: string;
	username: string;
	name: string | null;
}

export interface AuditEntryRef {
	id: number;
	word: string;
}

export interface AuditFieldChange {
	old: unknown;
	new: unknown;
}

export type AuditChanges = Record<string, unknown> & {
	_meta?: { count?: number; ids?: number[]; field?: string };
	command?: string;
	snapshot?: Record<string, unknown>;
	revertOf?: string;
};

export interface AuditItem {
	id: string;
	entryId: number | null;
	userId: string | null;
	apiKeyId: string | null;
	action: AuditAction;
	actorType: AuditActorType | null;
	changes: AuditChanges | null;
	createdAt: string;
	user: AuditUser | null;
	entry: AuditEntryRef | null;
}

export interface AuditQuery {
	q?: string;
	action?: AuditAction | "";
	actorType?: AuditActorType | "";
	period?: AuditPeriod;
	page?: number;
	limit?: number;
}

export interface AuditListResponse {
	items: AuditItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface AuditStatsCounters {
	create: number;
	update: number;
	delete: number;
	bulk: number;
	pipeline: number;
	revert?: number;
}

export interface AuditStats {
	today: { total: number; deltaPercent: number };
	week: { total: number; uniqueAuthors: number };
	weekBulk: { total: number; affectedEntries: number };
	weekPipeline: { total: number; commands: string[] };
	byAction: AuditStatsCounters;
}

export type AuditEntryHistoryItem = AuditItem;

export interface AuditEntrySummary {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	wordLevel: string | null;
	sources: string[];
}

export interface AuditEntryHistoryMeta {
	totalChanges: number;
	uniqueAuthors: number;
	daysSinceCreation: number | null;
}

export interface AuditEntryHistoryResponse {
	entry: AuditEntrySummary;
	meta: AuditEntryHistoryMeta;
	items: AuditEntryHistoryItem[];
}

export interface AuditRevertResponse {
	success: boolean;
	newLogId: string;
	restoredFields: string[];
}
