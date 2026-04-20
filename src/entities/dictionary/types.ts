import type { PaginationParams, WordLevel } from "@/shared/types";

export type { WordLevel };

// ---------------------------------------------------------------------------
// Core models
// ---------------------------------------------------------------------------

export type PartOfSpeech = string;
export type NounClass = "vu" | "yu" | "du" | "bu";
export type EntryType = "standard" | "neologism";
export type SortOrder =
	| "relevance"
	| "asc"
	| "desc"
	| "updatedAt_desc"
	| "updatedAt_asc"
	| "createdAt_desc"
	| "meaningsCount_desc";

export type DetectedLanguage = "ru" | "nah" | "unknown";

export type SourceDirection = "nah→ru" | "ru→nah" | "оба";

export interface Example {
	nah: string;
	ru: string;
}

export interface Meaning {
	translation: string;
	note?: string;
	label?: string;
	partOfSpeech?: PartOfSpeech;
	partOfSpeechNah?: string;
	examples?: Example[];
}

export interface Citation {
	text: string;
	source?: string;
}

/** Full UnifiedEntry — returned by `/dictionary/:id` and `/dictionary/lookup/:word`. */
export interface DictionaryEntry {
	id: number;
	word: string;
	wordAccented?: string;
	wordNormalized?: string;
	partOfSpeech?: PartOfSpeech;
	partOfSpeechNah?: string;
	nounClass?: NounClass;
	nounClassPlural?: NounClass;
	homonymIndex?: number;
	grammar?: Record<string, unknown>;
	meanings: Meaning[];
	phraseology?: Example[];
	citations?: Citation[];
	latinName?: string;
	styleLabel?: string;
	variants?: string[];
	domain?: string;
	wordLevel?: WordLevel;
	/** Встретилось ли слово в корпусе текстов (Википедия и др.). */
	attested?: boolean;
	entryType: EntryType;
	sources: string[];
	createdAt: string;
	updatedAt: string;
}

/** Reduced shape returned by raw-SQL endpoints (search, random, word-of-day, phraseology). */
export interface DictionarySearchResult {
	id: number;
	word: string;
	wordAccented?: string;
	partOfSpeech?: PartOfSpeech;
	partOfSpeechNah?: string;
	nounClass?: NounClass;
	entryType?: EntryType;
	variants: string[];
	grammar?: Record<string, unknown>;
	meanings: Meaning[];
	phraseology?: Example[];
	domain?: string;
	wordLevel?: WordLevel;
	attested?: boolean;
	sources: string[];
	updatedAt?: string;
	createdAt?: string;
	score?: number;
}

export interface DeclensionParadigm {
	nomSg?: string;
	genSg?: string;
	datSg?: string;
	ergSg?: string;
	instSg?: string;
	locSg?: string;
	nomPl?: string;
	[key: string]: string | undefined;
}

export interface DeclensionResult {
	word: string;
	paradigm: DeclensionParadigm;
}

export interface LemmatizeResult {
	baseForm: string;
	[key: string]: unknown;
}

export interface ConjugationResult {
	word: string;
	conjugations: Record<string, Record<string, string>>;
}

export interface DictionaryStatsDomain {
	domain: string;
	count: number;
	percentage: number;
}

export interface DictionaryStatsWordLevel {
	level: string;
	count: number;
	percentage: number;
}

export interface DictionaryStatsPos {
	pos: string;
	count: number;
}

export interface DictionaryStats {
	total: number;
	totalSources: number;
	domains: DictionaryStatsDomain[];
	wordLevels: DictionaryStatsWordLevel[];
	levelsUnclassified: number;
	posDistribution: DictionaryStatsPos[];
}

export interface DictionarySource {
	slug: string;
	name: string;
	direction: SourceDirection;
	count: number;
}

export interface PopularQuery {
	query: string;
	count: number;
	lang: DetectedLanguage;
	/** First translation looked up by the query (only for `lang=nah`/`unknown`); `null` otherwise. */
	meaning: string | null;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchParams extends PaginationParams {
	q: string;
	level?: WordLevel[];
	pos?: string;
	nounClass?: NounClass;
	entryType?: EntryType;
	source?: string;
	sort?: SortOrder;
	/** Only attested (`true`) or only unattested (`false`) entries. */
	attested?: boolean;
	/** Exact-match mode — backend matches the query as a whole word/translation. */
	exact?: boolean;
}

export interface SearchMeta {
	total: number;
	limit: number;
	offset: number;
	q: string;
	level?: WordLevel[];
	lang: DetectedLanguage;
	exact?: boolean;
	lemmaHint?: string[];
}

export interface SearchResult {
	data: DictionarySearchResult[];
	meta: SearchMeta;
}

export interface PhraseologyParams extends PaginationParams {
	q?: string;
}

export interface PhraseologyMeta {
	total: number;
	limit: number;
	offset: number;
	q: string | null;
}

export interface PhraseologyResult {
	data: DictionarySearchResult[];
	meta: PhraseologyMeta;
}

// ---------------------------------------------------------------------------
// Update DTOs (admin / editor)
// ---------------------------------------------------------------------------

export interface UpdateEntryDto {
	word?: string;
	wordAccented?: string;
	partOfSpeech?: string;
	partOfSpeechNah?: string;
	nounClass?: NounClass;
	nounClassPlural?: NounClass;
	grammar?: Record<string, unknown>;
	meanings?: Meaning[];
	phraseology?: Example[];
	citations?: Citation[];
	latinName?: string;
	styleLabel?: string;
	variants?: string[];
	domain?: string;
	wordLevel?: WordLevel;
	entryType?: EntryType;
	sources?: string[];
	homonymIndex?: number;
}

export interface BulkUpdateItem {
	id: number;
	data: UpdateEntryDto;
}

export interface BulkUpdateDto {
	entries: BulkUpdateItem[];
}

export interface BulkUpdateItemResult {
	id: number;
	success: boolean;
	error?: string;
}

export interface BulkUpdateResult {
	total: number;
	updated: number;
	failed: number;
	results: BulkUpdateItemResult[];
	durationMs: number;
}

export interface DeleteEntryResult {
	deleted: true;
	id: number;
}
