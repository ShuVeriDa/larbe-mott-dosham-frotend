"use client";

import {
	type AnalyticsReferrerCategory,
	type AnalyticsTopReferrerItem,
	useAdminAnalyticsReferrersBreakdown,
	useAdminAnalyticsTopReferrersInfinite,
	useAnalyticsRange,
	useInvalidateAdminAnalytics,
} from "@/features/admin-analytics";
import { useDebounce } from "@/shared/lib";
import { useCallback, useMemo, useState } from "react";
import {
	cleanHost,
	isDirectKey,
	type ReferrerCategoryFilter,
} from "../lib/categorize";

const PAGE_LIMIT = 20;

export interface UseReferrersPageResult {
	range: ReturnType<typeof useAnalyticsRange>;
	breakdownQuery: ReturnType<typeof useAdminAnalyticsReferrersBreakdown>;
	listQuery: ReturnType<typeof useAdminAnalyticsTopReferrersInfinite>;
	activeCategory: ReferrerCategoryFilter;
	setActiveCategory: (next: ReferrerCategoryFilter) => void;
	search: string;
	setSearch: (next: string) => void;
	debouncedSearch: string;
	items: AnalyticsTopReferrerItem[];
	visibleItems: AnalyticsTopReferrerItem[];
	loadedCount: number;
	hasMore: boolean;
	loadMore: () => void;
	refresh: () => Promise<void>;
	refreshing: boolean;
	totalForRange: number | undefined;
	uniqueHostsForRange: number | undefined;
}

const matchesSearch = (
	item: AnalyticsTopReferrerItem,
	needle: string,
): boolean => {
	if (!needle) return true;
	const hay = isDirectKey(item.key) ? "(direct)" : cleanHost(item.key);
	return hay.toLowerCase().includes(needle.toLowerCase());
};

export const useReferrersPage = (): UseReferrersPageResult => {
	const range = useAnalyticsRange();
	const [activeCategory, setActiveCategory] =
		useState<ReferrerCategoryFilter>("all");
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search.trim(), 200);
	const [refreshing, setRefreshing] = useState(false);
	const invalidate = useInvalidateAdminAnalytics();

	const rangeArg = useMemo(
		() => ({ from: range.range.from, to: range.range.to }),
		[range.range.from, range.range.to],
	);

	const enabled = range.error === null;

	const breakdownQuery = useAdminAnalyticsReferrersBreakdown(rangeArg, {
		enabled,
	});

	const listQueryArg = useMemo(
		() => ({
			...rangeArg,
			limit: PAGE_LIMIT,
			category:
				activeCategory === "all"
					? undefined
					: (activeCategory as AnalyticsReferrerCategory),
		}),
		[rangeArg, activeCategory],
	);

	const listQuery = useAdminAnalyticsTopReferrersInfinite(listQueryArg, {
		enabled,
	});

	const items = useMemo<AnalyticsTopReferrerItem[]>(
		() => listQuery.data?.pages.flatMap((p) => p) ?? [],
		[listQuery.data],
	);

	const visibleItems = useMemo(
		() => items.filter((item) => matchesSearch(item, debouncedSearch)),
		[items, debouncedSearch],
	);

	const hasMore = listQuery.hasNextPage ?? false;

	const loadMore = useCallback(() => {
		if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
			void listQuery.fetchNextPage();
		}
	}, [listQuery]);

	const refresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await invalidate();
		} finally {
			setRefreshing(false);
		}
	}, [invalidate]);

	return {
		range,
		breakdownQuery,
		listQuery,
		activeCategory,
		setActiveCategory,
		search,
		setSearch,
		debouncedSearch,
		items,
		visibleItems,
		loadedCount: items.length,
		hasMore,
		loadMore,
		refresh,
		refreshing,
		totalForRange: breakdownQuery.data?.total,
		uniqueHostsForRange: breakdownQuery.data?.uniqueHosts,
	};
};
