import type {
  DictionaryEntry,
  NounClass,
  WordLevel,
} from "@/entities/dictionary";

/** Reduced entry shape included in favorites list. */
export type FavoriteEntryPreview = Pick<
  DictionaryEntry,
  "id" | "word" | "wordAccented" | "partOfSpeech" | "meanings" | "sources"
> & {
  nounClass?: NounClass;
  wordLevel?: WordLevel;
  domain?: string;
};

export interface FavoriteRecord {
  id: string;
  userId: string;
  entryId: number;
  createdAt: string;
  entry: FavoriteEntryPreview;
}

export interface FavoriteToggleResult {
  favorited: boolean;
  entryId: number;
}

export type FavoriteCheckResult = FavoriteToggleResult;

export interface FavoriteClearResult {
  cleared: number;
}
