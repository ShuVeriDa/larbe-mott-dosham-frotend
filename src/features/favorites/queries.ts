import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "./api";

export const favoritesKeys = {
  all: ["favorites"] as const,
  list: () => [...favoritesKeys.all, "list"] as const,
  check: (entryId: number) =>
    [...favoritesKeys.all, "check", entryId] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoritesKeys.list(),
    queryFn: favoritesApi.getAll,
  });
}

export function useFavoriteCheck(entryId: number) {
  return useQuery({
    queryKey: favoritesKeys.check(entryId),
    queryFn: () => favoritesApi.check(entryId),
    enabled: !!entryId,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: number) => favoritesApi.toggle(entryId),
    onSuccess: (data, entryId) => {
      qc.setQueryData(favoritesKeys.check(entryId), data);
      qc.invalidateQueries({ queryKey: favoritesKeys.list() });
    },
  });
}

export function useClearFavorites() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.clearAll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: favoritesKeys.all });
    },
  });
}
