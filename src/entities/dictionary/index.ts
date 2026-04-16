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
  useDictionaryStats,
  useRandomEntry,
  useWordOfDay,
  usePopularQueries,
  usePosValues,
  useSources,
  usePhraseology,
  useUpdateEntry,
  useDeleteEntry,
  useBulkUpdateEntries,
} from "./queries";
