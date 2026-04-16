// ---------------------------------------------------------------------------
// Primitive helpers
// ---------------------------------------------------------------------------

export type ID = string | number;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// ---------------------------------------------------------------------------
// Domain enums shared across layers
// ---------------------------------------------------------------------------

/**
 * Уровень владения языком, на котором слово становится актуальным (CEFR-подобная шкала):
 *   A — базовая лексика (топ-2000)
 *   B — повседневная / литературная (топ-15k)
 *   C — редкая / специализированная
 * null означает, что слово не встретилось в корпусе (см. поле `attested`).
 */
export type WordLevel = "A" | "B" | "C";

// ---------------------------------------------------------------------------
// API error shape returned by the backend
// ---------------------------------------------------------------------------

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  correlationId?: string;
}
