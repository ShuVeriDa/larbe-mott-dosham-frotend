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

export interface DeclensionCaseSet {
	nominative: string;
	genitive: string;
	dative: string;
	ergative: string;
	instrumental: string;
	substantive: string;
	locative: string;
	comparative: string;
}

export interface DeclensionResult {
	word: string;
	declensionType: number;
	singular: DeclensionCaseSet;
	plural: DeclensionCaseSet | null;
}

export interface LemmatizeResult {
	baseForm: string;
	[key: string]: unknown;
}

export interface ConjugationBaseForms {
	present: string | null;
	recentPast: string | null;
	perfect: string | null;
}

export interface ConjugationTenses {
	presentSimple: string | null;
	presentCompound: string | null;
	recentPast: string | null;
	evidentialPast: string | null;
	perfect: string | null;
	remotePast: string | null;
	pastImperfective: string | null;
	futurePossible: string | null;
	futureFactual: string | null;
}

export interface ConjugationParticiples {
	present: string | null;
	past: string | null;
	gerundPresent: string | null;
	gerundPast: string | null;
	masdar: string | null;
}

export interface ConjugationImperative {
	basic: string | null;
	polite: string | null;
	politePlural: string | null;
}

export interface ConjugationNegation {
	present: string | null;
	imperative: string | null;
}

export interface ConjugationResult {
	word: string;
	conjugationType: string;
	baseForms: ConjugationBaseForms;
	tenses: ConjugationTenses;
	participles: ConjugationParticiples;
	imperative: ConjugationImperative;
	negation: ConjugationNegation;
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

/**
 * Top phraseology query (без `lang` — все запросы по фразеологии чеченские).
 * `meaning` — `definitionNah` первой PhraseologyEntry, чей `canonicalNormalized`
 * совпадает с нормализованным запросом (или `null`).
 */
export interface PopularPhraseologyQuery {
	query: string;
	count: number;
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
	source?: string;
	/** Точный поиск — строгое совпадение по `canonicalNormalized`. */
	exact?: boolean;
}

export interface PhraseologyMeta {
	total: number;
	limit: number;
	offset: number;
	q: string | null;
	source: string | null;
	exact: boolean;
}

/**
 * Standalone phraseology entry — `PhraseologyEntry` table on the backend.
 * Отдельная сущность, не связана с `DictionaryEntry.phraseology` (JSONB).
 */
export interface PhraseologyEntry {
	id: number;
	/** Человекочитаемая форма со скобками: "Болатан (тIулган; дог) дегнаш". */
	canonical: string;
	/** Lowercase без диакритики и скобок — используется для поиска на бэке. */
	canonicalNormalized: string;
	/** Толкование на чеченском. */
	definitionNah: string;
	/** Опциональный русский перевод. */
	definitionRu?: string | null;
	/** Оригинальная строка со слешами (`/.../`) — для reference. */
	raw: string;
	/** `true` если в canonical/definition есть альтернативы (нужна ревизия). */
	hasVariants: boolean;
	/** Редактор прошёлся и проверил запись вручную. */
	reviewed: boolean;
	/** Slug источника — напр. "ibragimov-phraseology". */
	source: string;
	manuallyEdited?: boolean;
	createdAt?: string;
	updatedAt?: string;
	/** trigram similarity score (только при поиске с `q`). */
	score?: number;
}

export interface PhraseologyResult {
	data: PhraseologyEntry[];
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
