import type { PaginationParams } from "@/shared/types";

export type SuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ReviewDecision = "approve" | "reject";

/** Subset of User returned in suggestion relations (select: id, username, name). */
export interface SuggestionUser {
  id: string;
  username: string;
  name: string;
}

/** Subset of UnifiedEntry returned in suggestion relations (select: id, word). */
export interface SuggestionEntry {
  id: number;
  word: string;
}

export interface Suggestion {
  id: string;
  userId: string;
  entryId: number;
  field: string;
  /** JSON-stringified previous value, null if entry had no value. */
  oldValue: string | null;
  /** JSON-stringified new value proposed by user. */
  newValue: string;
  comment?: string;
  status: SuggestionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
  user?: SuggestionUser;
  reviewer?: SuggestionUser;
  entry?: SuggestionEntry;
  createdAt: string;
}

export interface AdjacentSuggestion {
  id: string;
  entry: { word: string };
}

export interface AdjacentSuggestions {
  prev: AdjacentSuggestion | null;
  next: AdjacentSuggestion | null;
}

// ---------------------------------------------------------------------------
// Request DTOs
// ---------------------------------------------------------------------------

export interface CreateSuggestionDto {
  entryId: number;
  field: string;
  newValue: string;
  comment?: string;
}

export interface ReviewSuggestionDto {
  decision: ReviewDecision;
  comment?: string;
}

export interface GetSuggestionsParams extends PaginationParams {
  status?: SuggestionStatus;
  order?: "asc" | "desc";
  q?: string;
}

export type GetMySuggestionsParams = PaginationParams;

// ---------------------------------------------------------------------------
// Response wrappers
// ---------------------------------------------------------------------------

export interface SuggestionsListMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface SuggestionsListResponse {
  data: Suggestion[];
  meta: SuggestionsListMeta;
}

export interface SuggestionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
