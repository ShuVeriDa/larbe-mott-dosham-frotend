import type { PaginationParams } from "@/shared/types";

export interface SearchHistoryRecord {
  id: string;
  userId: string;
  query: string;
  createdAt: string;
}

export interface SearchHistoryParams extends PaginationParams {
  limit?: number; // max 100
}

export interface SearchHistoryResponse {
  records: SearchHistoryRecord[];
  total: number;
}
