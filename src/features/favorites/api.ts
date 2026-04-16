import { apiClient } from "@/shared/api";
import type {
  FavoriteCheckResult,
  FavoriteClearResult,
  FavoriteRecord,
  FavoriteToggleResult,
} from "./types";

export const favoritesApi = {
  async getAll(): Promise<FavoriteRecord[]> {
    const { data } = await apiClient.get<FavoriteRecord[]>("/favorites");
    return data;
  },

  async toggle(entryId: number): Promise<FavoriteToggleResult> {
    const { data } = await apiClient.post<FavoriteToggleResult>(
      `/favorites/${entryId}`,
    );
    return data;
  },

  async check(entryId: number): Promise<FavoriteCheckResult> {
    const { data } = await apiClient.get<FavoriteCheckResult>(
      `/favorites/${entryId}/check`,
    );
    return data;
  },

  async clearAll(): Promise<FavoriteClearResult> {
    const { data } = await apiClient.delete<FavoriteClearResult>("/favorites");
    return data;
  },
};
