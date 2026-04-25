import type { DictionaryStats } from "../../types";
import { useStatsStore } from "./stats-store";

interface UseDictionaryStatsResult {
	stats: DictionaryStats | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	fetchStats: () => Promise<void>;
}

export const useDictionaryStats = (): UseDictionaryStatsResult => {
	const stats = useStatsStore(s => s.stats);
	const isLoading = useStatsStore(s => s.isLoading);
	const isError = useStatsStore(s => s.isError);
	const fetchStats = useStatsStore(s => s.fetchStats);

	return {
		stats,
		isLoading,
		isError,
		isSuccess: stats !== null,
		fetchStats,
	};
};
