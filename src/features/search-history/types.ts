import type { PaginationParams } from "@/shared/types";

export interface SearchHistoryRecord {
  id: string;
  query: string;
  lang?: string;
  createdAt: string;
}

export interface SearchHistoryParams extends PaginationParams {
  limit?: number;
}

export interface SearchHistoryResponse {
  items: SearchHistoryRecord[];
  total: number;
}

export interface SearchHistoryDeleteResult {
  deleted: true;
}

export interface SearchHistoryClearResult {
  cleared: number;
}
