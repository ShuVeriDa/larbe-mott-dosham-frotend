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
// API error shape returned by the backend
// ---------------------------------------------------------------------------

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  correlationId?: string;
}
