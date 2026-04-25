"use client";

import {
	adminAnalyticsKeys,
	useAdminAnalyticsSearchQueries,
	useAdminAnalyticsSearchQueriesStats,
	useAnalyticsRange,
	useExportAdminAnalyticsSearchQueries,
} from "@/features/admin-analytics";
import { useDebounce } from "@/shared/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

const LIMIT_OPTIONS = [50, 100, 200, 500] as const;
export type SearchQueriesLimit = (typeof LIMIT_OPTIONS)[number];

export const SEARCH_QUERIES_LIMIT_OPTIONS = LIMIT_OPTIONS;

export const useSearchQueriesPageState = () => {
	const range = useAnalyticsRange();
	const [search, setSearch] = useState("");
	const [limit, setLimit] = useState<SearchQueriesLimit>(50);
	const [onlyZeroResults, setOnlyZeroResults] = useState(false);
	const debouncedSearch = useDebounce(search, 300);
	const queryClient = useQueryClient();

	const baseQuery = useMemo(
		() => ({
			from: range.range.from,
			to: range.range.to,
		}),
		[range.range.from, range.range.to],
	);

	const listQueryArg = useMemo(
		() => ({
			...baseQuery,
			search: debouncedSearch.trim() || undefined,
			limit,
			onlyZeroResults: onlyZeroResults || undefined,
		}),
		[baseQuery, debouncedSearch, limit, onlyZeroResults],
	);

	const stats = useAdminAnalyticsSearchQueriesStats(baseQuery, {
		enabled: range.error === null,
	});

	const queries = useAdminAnalyticsSearchQueries(listQueryArg, {
		enabled: range.error === null,
	});

	const exportMutation = useExportAdminAnalyticsSearchQueries();

	// Sticky maxCount so the bars don't jump on filter/search changes.
	const maxCountRef = useRef<number | null>(null);
	const lastKeyRef = useRef<string>("");
	const stableKey = `${debouncedSearch}|${onlyZeroResults}`;

	useEffect(() => {
		if (lastKeyRef.current !== stableKey) {
			lastKeyRef.current = stableKey;
			maxCountRef.current = null;
		}
	}, [stableKey]);

	useEffect(() => {
		const first = queries.data?.pages?.[0]?.items?.[0]?.count;
		if (typeof first === "number" && maxCountRef.current === null) {
			maxCountRef.current = first;
		}
	}, [queries.data]);

	const items = useMemo(
		() => queries.data?.pages.flatMap((p) => p.items) ?? [],
		[queries.data],
	);
	const total = queries.data?.pages.at(-1)?.total ?? 0;
	const maxCount = maxCountRef.current ?? items[0]?.count ?? 1;
	const hasFilter = debouncedSearch.trim().length > 0;

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: adminAnalyticsKeys.all });
	};

	const exportCsv = async () => {
		const blob = await exportMutation.mutateAsync({
			...baseQuery,
			search: debouncedSearch.trim() || undefined,
			onlyZeroResults: onlyZeroResults || undefined,
		});
		const url = URL.createObjectURL(blob);
		const filename = `dosham-search-queries-${baseQuery.from}_${baseQuery.to}${
			onlyZeroResults ? "-zero-results" : ""
		}${hasFilter ? "-filtered" : ""}.csv`;
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	};

	return {
		range,
		search,
		setSearch,
		debouncedSearch,
		limit,
		setLimit,
		onlyZeroResults,
		setOnlyZeroResults,
		stats,
		queries,
		items,
		total,
		maxCount,
		hasFilter,
		refresh,
		exportCsv,
		isExporting: exportMutation.isPending,
	};
};
