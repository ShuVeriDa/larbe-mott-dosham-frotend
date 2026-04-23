import type { DictionaryEntry, NounClass } from "@/entities/dictionary";
import type { WordLevel } from "@/shared/types";

export type AdminEntriesPosFilter =
	| ""
	| "noun"
	| "verb"
	| "adjective"
	| "adverb"
	| "other";

export type AdminEntriesSortBy =
	| "relevance"
	| "word"
	| "updatedAt"
	| "createdAt";
export type AdminEntriesSortDir = "asc" | "desc";

export interface AdminEntriesQuery {
	q?: string;
	pos?: AdminEntriesPosFilter;
	source?: string;
	cefr?: WordLevel | "";
	nounClass?: NounClass | "";
	problem?: string;
	page?: number;
	limit?: number;
	sortBy?: AdminEntriesSortBy;
	sortDir?: AdminEntriesSortDir;
}

export interface AdminEntryListItem {
	id: number;
	word: string;
	wordAccented?: string;
	partOfSpeech?: string;
	partOfSpeechNah?: string;
	nounClass?: NounClass;
	cefrLevel?: WordLevel;
	entryType?: "standard" | "neologism";
	translationPreview?: string;
	meaningsCount: number;
	sources: string[];
	updatedAt: string;
}

export interface AdminEntriesResponse {
	data: AdminEntryListItem[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

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

export interface BulkOperation {
	field: string;
	value: unknown;
}

export interface BulkUpdatePayload {
	entryIds: number[];
	operations: BulkOperation[];
}

export interface BulkUpdateResponse {
	updated: number;
	fieldsChanged: number;
	skipped: number;
	elapsedMs: number;
}

export interface AdminEntryFullResponse extends DictionaryEntry {}
