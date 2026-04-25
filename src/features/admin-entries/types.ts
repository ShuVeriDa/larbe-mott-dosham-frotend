import type {
	DictionaryEntry,
	DictionarySearchResult,
	NounClass,
	SortOrder,
} from "@/entities/dictionary";
import type { WordLevel } from "@/shared/types";

// ===== Public filter values (UI layer) =====

export type AdminEntriesPosFilter =
	| ""
	| "noun"
	| "verb"
	| "adjective"
	| "adverb"
	| "other";

export type AdminEntriesSort = SortOrder;

export interface AdminEntriesQuery {
	q?: string;
	pos?: AdminEntriesPosFilter;
	source?: string;
	level?: WordLevel[];
	nounClass?: NounClass | "";
	cefr?: WordLevel | "";
	entryType?: "standard" | "neologism" | "";
	problem?: string;
	sort?: AdminEntriesSort;
	page?: number;
	limit?: number;
}

export interface AdminEntryListItem extends DictionarySearchResult {
	translationPreview?: string;
	meaningsCount: number;
	cefrLevel?: WordLevel;
}

export interface AdminEntriesResponse {
	data: AdminEntryListItem[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

// ===== Stats (GET /admin/entries/stats) =====

export interface AdminEntriesStats {
	total: number;
	nouns: number;
	verbs: number;
	adjectives: number;
	adverbs: number;
	other: number;
	sourcesCount: number;
	updatedToday: number;
}

export interface AdminEntriesStatsRaw {
	total: number;
	byPos: {
		noun: number;
		verb: number;
		adj: number;
		adv: number;
		other: number;
	};
	sourcesCount: number;
	updatedToday: number;
}

// ===== Bulk update (PATCH /dictionary/bulk/update) =====
//
// The UI layer tracks a flat list of IDs + operations. The API layer
// converts it to the backend shape `{ entries: [{ id, data }] }` and
// normalizes the response back to a UI-friendly `BulkUpdateResponse`.

export interface BulkOperation {
	field: string;
	value: unknown;
}

export interface BulkUpdatePayload {
	entryIds: number[];
	operations: BulkOperation[];
}

export interface BulkUpdateResultRow {
	id: number;
	success: boolean;
	error?: string;
}

export interface BulkUpdateResponse {
	total: number;
	updated: number;
	failed: number;
	durationMs: number;
	results: BulkUpdateResultRow[];
}

// ===== Bulk delete (DELETE /admin/entries/bulk) =====

export interface BulkDeletePayload {
	ids: number[];
}

export interface BulkDeleteResponse {
	total: number;
	deleted: number;
	failed: number;
	results: BulkUpdateResultRow[];
}

// ===== Filter entries (GET /admin/entries) =====

export interface AdminEntriesFilterQuery {
	pos?: string;
	nounClass?: string;
	source?: string;
	level?: string;
	limit?: number;
}

export interface AdminEntriesFilterItem {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	wordLevel: string | null;
	entryType: string | null;
}

export interface AdminEntriesFilterResponse {
	data: AdminEntriesFilterItem[];
	total: number;
}

// ===== Batch fetch (POST /admin/entries/batch-fetch) =====

export interface BatchFetchEntry {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	wordLevel: string | null;
	entryType: string | null;
	domain: string | null;
	styleLabel: string | null;
	latinName: string | null;
	nounClassPlural: string | null;
	partOfSpeechNah: string | null;
}

// ===== Search (GET /dictionary/search) — raw shape =====

export interface AdminEntriesSearchItem {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	wordLevel: string | null;
	entryType: string | null;
	meanings?: unknown;
}

export interface AdminEntriesSearchResponse {
	data: AdminEntriesSearchItem[];
	meta: {
		total: number;
		limit: number;
		offset: number;
		q: string;
	};
}

// ===== Quality problems (GET /admin/quality/problems) =====

export interface AdminEntriesProblemItem {
	id: number;
	word: string;
	partOfSpeech: string | null;
	nounClass: string | null;
	entryType: string;
	problems: string[];
}

export interface AdminEntriesProblemsResponse {
	data: AdminEntriesProblemItem[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

// ===== Adjacent entries (GET /admin/entries/:id/adjacent) =====

export interface AdjacentEntries {
	prevId: number | null;
	nextId: number | null;
}

export type ExportFormat = "json" | "csv";

export type AdminEntryFullResponse = DictionaryEntry;
