import type { DictionaryEntry } from "@/entities/dictionary";

export interface FavoriteToggleResult {
  isFavorited: boolean;
}

export interface FavoriteCheckResult {
  isFavorited: boolean;
}

export type FavoriteEntry = DictionaryEntry;
