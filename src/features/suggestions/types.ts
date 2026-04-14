import type { DictionaryEntry } from "@/entities/dictionary";
import type { User } from "@/entities/user";
import type { PaginationParams } from "@/shared/types";

export type SuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ReviewDecision = "approve" | "reject";

export interface Suggestion {
  id: string;
  userId: string;
  entryId: number;
  field: string;
  oldValue?: string;
  newValue: string;
  comment?: string;
  status: SuggestionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
  user: User;
  reviewer?: User;
  entry: DictionaryEntry;
  createdAt: string;
}

export interface AdjacentSuggestions {
  prev: Suggestion | null;
  current: Suggestion;
  next: Suggestion | null;
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

export interface GetMySuggestionsParams extends PaginationParams {}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface SuggestionStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}
