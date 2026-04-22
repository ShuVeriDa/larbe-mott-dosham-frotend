import type { PaginationParams } from "@/shared/types";

/** Раздел сайта, в котором пользователь искал. */
export type SearchHistoryKind = "search" | "phraseology";

export interface SearchHistoryRecord {
  id: string;
  query: string;
  lang?: string;
  kind?: SearchHistoryKind;
  createdAt: string;
}

export interface SearchHistoryParams extends PaginationParams {
  limit?: number;
  kind?: SearchHistoryKind;
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
