import { useDictionaryStats } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { useEffect } from "react";
import { mapStatsToItems, type StatItem } from "./map-stats-to-items";

interface StatsBandModel {
	items: StatItem[];
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export const useStatsBand = (labels: Dictionary["statsBand"]): StatsBandModel => {
	const { stats, isLoading, isError, isSuccess, fetchStats } = useDictionaryStats();

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return {
		items: mapStatsToItems(stats ?? undefined, labels),
		isLoading,
		isError,
		isSuccess,
	};
};
