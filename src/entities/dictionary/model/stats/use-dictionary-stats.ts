import type { DictionaryStats } from "../../types";
import { useStatsStore } from "./stats-store";

interface UseDictionaryStatsResult {
	stats: DictionaryStats | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export const useDictionaryStats = (): UseDictionaryStatsResult => {
	const stats = useStatsStore(s => s.stats);
	const isLoading = useStatsStore(s => s.isLoading);
	const isError = useStatsStore(s => s.isError);

	return {
		stats,
		isLoading,
		isError,
		isSuccess: stats !== null,
	};
};
