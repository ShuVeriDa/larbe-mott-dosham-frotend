import { useDictionaryStats } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { mapStatsToItems, type StatItem } from "./map-stats-to-items";

interface StatsBandModel {
	items: StatItem[];
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export const useStatsBand = (labels: Dictionary["statsBand"]): StatsBandModel => {
	const { data: stats, isLoading, isError, isSuccess } = useDictionaryStats();

	return {
		items: mapStatsToItems(stats, labels),
		isLoading,
		isError,
		isSuccess,
	};
};
