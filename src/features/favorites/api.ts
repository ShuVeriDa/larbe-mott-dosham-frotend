import { apiClient } from "@/shared/api";
import type { FavoriteCheckResult, FavoriteEntry, FavoriteToggleResult } from "./types";

export const favoritesApi = {
  async getAll(): Promise<FavoriteEntry[]> {
    const { data } = await apiClient.get<FavoriteEntry[]>("/favorites");
    return data;
  },

  async toggle(entryId: number): Promise<FavoriteToggleResult> {
    const { data } = await apiClient.post<FavoriteToggleResult>(`/favorites/${entryId}`);
    return data;
  },

  async check(entryId: number): Promise<FavoriteCheckResult> {
    const { data } = await apiClient.get<FavoriteCheckResult>(`/favorites/${entryId}/check`);
    return data;
  },

  async clearAll(): Promise<{ count: number }> {
    const { data } = await apiClient.delete<{ count: number }>("/favorites");
    return data;
  },
};
