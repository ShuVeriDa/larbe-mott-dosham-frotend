"use client";

import {
	useAdminAnalyticsPages,
	useAdminAnalyticsPagesStats,
	useAnalyticsRange,
	useExportAdminAnalyticsPages,
} from "@/features/admin-analytics";
import { useDebounce } from "@/shared/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminAnalyticsKeys } from "@/features/admin-analytics";

const LIMIT_OPTIONS = [20, 50, 100, 200] as const;
export type PagesLimit = (typeof LIMIT_OPTIONS)[number];

export const PAGES_LIMIT_OPTIONS = LIMIT_OPTIONS;

export const usePagesPageState = () => {
	const range = useAnalyticsRange();
	const [search, setSearch] = useState("");
	const [limit, setLimit] = useState<PagesLimit>(20);
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
		}),
		[baseQuery, debouncedSearch, limit],
	);

	const stats = useAdminAnalyticsPagesStats(baseQuery, {
		enabled: range.error === null,
	});

	const pages = useAdminAnalyticsPages(listQueryArg, {
		enabled: range.error === null,
	});

	const exportMutation = useExportAdminAnalyticsPages();

	// Sticky maxCount: first page's first item count from the very first
	// successful response after a search change. Keeps bars from "jumping".
	const maxCountRef = useRef<number | null>(null);
	const lastSearchRef = useRef<string>(debouncedSearch);
	useEffect(() => {
		if (lastSearchRef.current !== debouncedSearch) {
			lastSearchRef.current = debouncedSearch;
			maxCountRef.current = null;
		}
	}, [debouncedSearch]);

	useEffect(() => {
		const first = pages.data?.pages?.[0]?.items?.[0]?.count;
		if (typeof first === "number" && maxCountRef.current === null) {
			maxCountRef.current = first;
		}
	}, [pages.data]);

	const items = useMemo(
		() => pages.data?.pages.flatMap((p) => p.items) ?? [],
		[pages.data],
	);
	const total = pages.data?.pages.at(-1)?.total ?? 0;
	const maxCount = maxCountRef.current ?? items[0]?.count ?? 1;
	const hasFilter = debouncedSearch.trim().length > 0;

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: adminAnalyticsKeys.all });
	};

	const exportCsv = async () => {
		const blob = await exportMutation.mutateAsync({
			...baseQuery,
			search: debouncedSearch.trim() || undefined,
		});
		const url = URL.createObjectURL(blob);
		const filename = `dosham-pages-${baseQuery.from}_${baseQuery.to}${
			hasFilter ? "-filtered" : ""
		}.csv`;
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
		stats,
		pages,
		items,
		total,
		maxCount,
		hasFilter,
		refresh,
		exportCsv,
		isExporting: exportMutation.isPending,
	};
};
