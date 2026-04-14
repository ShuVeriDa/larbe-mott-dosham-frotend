import type { CefrLevel } from "@/entities/user";
import type { PaginationParams } from "@/shared/types";

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

export interface Example {
  nah: string;
  ru: string;
}

export interface Meaning {
  translation: string;
  note?: string;
  label?: string;
  examples?: Example[];
}

export interface Citation {
  text: string;
  source?: string;
}

export interface DictionaryEntry {
  id: number;
  word: string;
  wordAccented?: string;
  wordNormalized: string;
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
  cefrLevel?: CefrLevel;
  entryType: EntryType;
  sources: string[];
  createdAt: string;
  updatedAt: string;
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

export interface DictionaryStats {
  totalEntries: number;
  byPOS: Record<string, number>;
  sourcesCount: number;
}

export interface PhraseologyEntry {
  nah: string;
  ru: string;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchParams extends PaginationParams {
  q: string;
  cefr?: CefrLevel[];
  pos?: string;
  nounClass?: NounClass;
  entryType?: EntryType;
  source?: string;
  sort?: SortOrder;
}

export interface SearchResult {
  entries: DictionaryEntry[];
  total: number;
}

export interface PhraseologyParams extends PaginationParams {
  q?: string;
}

export interface PhraseologyResult {
  entries: PhraseologyEntry[];
  total: number;
}

export interface PopularQuery {
  query: string;
  count: number;
}

// ---------------------------------------------------------------------------
// Update DTOs (admin / editor)
// ---------------------------------------------------------------------------

export interface UpdateEntryDto {
  word?: string;
  wordAccented?: string;
  partOfSpeech?: string;
  nounClass?: NounClass;
  meanings?: Meaning[];
  phraseology?: Example[];
  cefrLevel?: CefrLevel;
  entryType?: EntryType;
  styleLabel?: string;
  variants?: string[];
  domain?: string;
}

export interface BulkUpdateItem {
  id: number;
  data: UpdateEntryDto;
}

export interface BulkUpdateDto {
  entries: BulkUpdateItem[];
}

export interface BulkUpdateResult {
  updated: number;
  failed: number;
  results: unknown[];
}
