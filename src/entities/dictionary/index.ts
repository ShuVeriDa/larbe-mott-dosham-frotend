export type {
  DictionaryEntry,
  DictionarySearchResult,
  Meaning,
  Example,
  Citation,
  DeclensionResult,
  DeclensionParadigm,
  LemmatizeResult,
  ConjugationResult,
  DictionaryStats,
  DictionaryStatsDomain,
  DictionaryStatsWordLevel,
  DictionaryStatsPos,
  DictionarySource,
  SourceDirection,
  SearchParams,
  SearchResult,
  SearchMeta,
  PhraseologyParams,
  PhraseologyResult,
  PhraseologyMeta,
  PopularQuery,
  UpdateEntryDto,
  BulkUpdateDto,
  BulkUpdateItem,
  BulkUpdateResult,
  BulkUpdateItemResult,
  DeleteEntryResult,
  EntryType,
  NounClass,
  SortOrder,
  PartOfSpeech,
  WordLevel,
  DetectedLanguage,
} from "./types";

export { dictionaryApi } from "./api";

export { WordLevelBadge } from "./ui/word-level-badge";
export type { WordLevelBadgeContent } from "./ui/word-level-badge";

export { EntryCard, HighlightMatch } from "./ui/entry-card";
export type { EntryCardLabels } from "./ui/entry-card";

export { DictionaryDataProvider } from "./ui/dictionary-data-provider";

export { useDictionaryStats, useStatsStore } from "./model/stats";
export { usePosValues, usePosValuesStore } from "./model/pos-values";
export { usePopularQueries, usePopularStore } from "./model/popular";

export {
  CHECHEN_CASE_FORMS_COUNT,
  CHECHEN_TENSE_FORMS_COUNT,
} from "./constants";

export {
  dictionaryKeys,
  useSearch,
  useDictionaryEntry,
  useLookup,
  useDeclension,
  useLemmatize,
  useConjugation,
  useRandomEntry,
  useWordOfDay,
  useSources,
  usePhraseology,
  useUpdateEntry,
  useDeleteEntry,
  useBulkUpdateEntries,
} from "./queries";
