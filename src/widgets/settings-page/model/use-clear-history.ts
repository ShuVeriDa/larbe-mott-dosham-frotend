"use client";

import { useClearSearchHistory } from "@/features/search-history";
import { toast } from "sonner";

interface UseClearHistoryOptions {
	successMessage: string;
	errorMessage: string;
}

export const useClearHistory = ({
	successMessage,
	errorMessage,
}: UseClearHistoryOptions) => {
	const { mutateAsync, isPending } = useClearSearchHistory();

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
