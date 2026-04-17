import { create, createJSONStorage, devtools, persist } from "@/shared/lib";
import { dictionaryApi } from "../../api";
import type { DictionaryStats } from "../../types";

const STATS_TTL_MS = 10 * 60 * 1000;

interface StatsState {
	stats: DictionaryStats | null;
	fetchedAt: number | null;
	isLoading: boolean;
	isError: boolean;
	fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>()(
	devtools(
		persist(
			(set, get) => ({
				stats: null,
				fetchedAt: null,
				isLoading: false,
				isError: false,
				fetchStats: async () => {
					const { fetchedAt, stats, isLoading } = get();
					if (isLoading) return;
					if (stats && fetchedAt && Date.now() - fetchedAt < STATS_TTL_MS) {
						return;
					}
					set({ isLoading: true, isError: false }, false, "fetchStats/start");
					try {
						const data = await dictionaryApi.getStats();
						set(
							{ stats: data, fetchedAt: Date.now(), isLoading: false },
							false,
							"fetchStats/success",
						);
					} catch {
						set(
							{ isLoading: false, isError: true },
							false,
							"fetchStats/error",
						);
					}
				},
			}),
			{
				name: "dictionary-stats:v1",
				storage: createJSONStorage(() => localStorage),
				partialize: state => ({
					stats: state.stats,
					fetchedAt: state.fetchedAt,
				}),
			},
		),
		{ name: "DictionaryStatsStore" },
	),
);
