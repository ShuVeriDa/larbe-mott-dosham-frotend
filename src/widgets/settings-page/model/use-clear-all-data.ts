"use client";

import { favoritesApi, favoritesKeys } from "@/features/favorites";
import { searchHistoryApi, searchHistoryKeys } from "@/features/search-history";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseClearAllDataOptions {
	successMessage: string;
	errorMessage: string;
}

export const useClearAllData = ({
	successMessage,
	errorMessage,
}: UseClearAllDataOptions) => {
	const qc = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async () => {
			await Promise.all([
				searchHistoryApi.clearAll(),
				favoritesApi.clearAll(),
			]);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: favoritesKeys.all });
			qc.invalidateQueries({ queryKey: searchHistoryKeys.all });
		},
	});

	const clear = async () => {
		try {
			await mutateAsync();
			toast.success(successMessage);
		} catch {
			toast.error(errorMessage);
		}
	};

	return { clear, isPending };
};
