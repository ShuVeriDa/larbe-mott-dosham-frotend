import { apiClient } from "@/shared/api";
import type {
  SearchHistoryClearResult,
  SearchHistoryDeleteResult,
  SearchHistoryParams,
  SearchHistoryResponse,
} from "./types";

export const searchHistoryApi = {
  async getAll(params?: SearchHistoryParams): Promise<SearchHistoryResponse> {
    const { data } = await apiClient.get<SearchHistoryResponse>(
      "/search-history",
      { params },
    );
    return data;
  },

  async deleteOne(id: string): Promise<SearchHistoryDeleteResult> {
    const { data } = await apiClient.delete<SearchHistoryDeleteResult>(
      `/search-history/${id}`,
    );
    return data;
  },

  async clearAll(): Promise<SearchHistoryClearResult> {
    const { data } = await apiClient.delete<SearchHistoryClearResult>(
      "/search-history",
    );
    return data;
  },
};
