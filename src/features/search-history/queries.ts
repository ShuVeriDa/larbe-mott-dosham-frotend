import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchHistoryApi } from "./api";
import type { SearchHistoryParams } from "./types";

export const searchHistoryKeys = {
  all: ["search-history"] as const,
  list: (params?: SearchHistoryParams) =>
    [...searchHistoryKeys.all, "list", params] as const,
};

export function useSearchHistory(
  params?: SearchHistoryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: searchHistoryKeys.list(params),
    queryFn: () => searchHistoryApi.getAll(params),
    enabled,
  });
}

export function useDeleteSearchHistoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => searchHistoryApi.deleteOne(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: searchHistoryKeys.all });
    },
  });
}

export function useClearSearchHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: searchHistoryApi.clearAll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: searchHistoryKeys.all });
    },
  });
}
