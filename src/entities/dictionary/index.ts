export type {
  DictionaryEntry,
  DictionarySearchResult,
  Meaning,
  Phrase,
  Citation,
  DeclensionResult,
  DeclensionCaseSet,
  LemmatizeResult,
  ConjugationResult,
  ConjugationBaseForms,
  ConjugationTenses,
  ConjugationParticiples,
  ConjugationImperative,
  ConjugationNegation,
  DictionaryStats,
  DictionaryStatsDomain,
  DictionaryStatsWordLevel,
  DictionaryStatsPos,
  DictionaryStatsAttested,
  DictionarySource,
  SourceDirection,
  SearchParams,
  SearchResult,
  SearchMeta,
  PhraseologyEntry,
  PhraseologyParams,
  PhraseologyResult,
  PhraseologyMeta,
  PopularPhraseologyQuery,
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
  EntryCard,
  HighlightMatch,
  NounClassBadge,
  SourceBadge,
  WordLevelTag,
  NeologismBadge,
} from "./ui/entry-card";
export type { EntryCardLabels } from "./ui/entry-card";

export { PhraseCard } from "./ui/phrase-card";
export type { PhraseCardLabels } from "./ui/phrase-card";

export { useDictionaryStats, useStatsStore } from "./model/stats";
export { usePosValues, usePosValuesStore } from "./model/pos-values";
export { usePopularQueries, usePopularStore } from "./model/popular";
export {
  usePopularPhraseologyQueries,
  usePopularPhraseologyStore,
} from "./model/popular-phraseology";
export { useSourcesValues, useSourcesStore } from "./model/sources";

export {
  CHECHEN_CASE_FORMS_COUNT,
  CHECHEN_TENSE_FORMS_COUNT,
} from "./constants";

export { isVerbPos, isNounPos } from "./lib/pos";

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
