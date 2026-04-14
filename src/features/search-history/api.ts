import { apiClient } from "@/shared/api";
import type { SearchHistoryParams, SearchHistoryResponse } from "./types";

export const searchHistoryApi = {
  async getAll(params?: SearchHistoryParams): Promise<SearchHistoryResponse> {
    const { data } = await apiClient.get<SearchHistoryResponse>("/search-history", { params });
    return data;
  },

  async deleteOne(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/search-history/${id}`);
    return data;
  },

  async clearAll(): Promise<{ count: number }> {
    const { data } = await apiClient.delete<{ count: number }>("/search-history");
    return data;
  },
};
