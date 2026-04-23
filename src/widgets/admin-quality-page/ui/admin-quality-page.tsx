"use client";

import {
	type QualityProblemType,
	useExportQualityProblems,
	useQualityProblems,
	useQualityStats,
	useQualityStatsBySource,
	useRefreshQuality,
} from "@/features/admin-quality";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useDebounce } from "@/shared/lib";
import { PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useQualityFilters } from "../model/use-quality-filters";
import { QualityActionsBar } from "./quality-actions-bar";
import { QualityOverview } from "./quality-overview";
import { QualityProblemsSection } from "./quality-problems-section";
import { QualitySourceBreakdown } from "./quality-source-breakdown";
import { QualityStatsGrid } from "./quality-stats-grid";

interface AdminQualityPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["quality"];
	commonDict: Dictionary["admin"]["common"];
}

const PAGE_LIMIT = 10;

export const AdminQualityPage: FC<AdminQualityPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const filters = useQualityFilters();
	const debouncedSearch = useDebounce(filters.searchInput, 300);

	const statsQuery = useQualityStats();
	const sourcesQuery = useQualityStatsBySource();

	const problemsQueryArgs = useMemo(
		() => ({
			type: filters.type || undefined,
			q: debouncedSearch || undefined,
			source: filters.source || undefined,
			page: filters.page,
			limit: PAGE_LIMIT,
		}),
		[filters.type, debouncedSearch, filters.source, filters.page],
	);

	const problemsQuery = useQualityProblems(problemsQueryArgs);

	const refreshQuality = useRefreshQuality();
	const exportMutation = useExportQualityProblems();

	const handleRefresh = async () => {
		await refreshQuality();
		toast.success(dict.toasts.refreshSuccess);
	};

	const handleExport = () => {
		exportMutation.mutate(
			{
				type: filters.type || undefined,
				q: debouncedSearch || undefined,
				source: filters.source || undefined,
			},
			{
				onSuccess: () => toast.success(dict.toasts.exportSuccess),
				onError: () => toast.error(dict.toasts.exportError),
			},
		);
	};

	const handleJumpToFilter = (type: QualityProblemType) => {
		filters.setType(type);
		if (typeof window !== "undefined") {
			document.getElementById("problems")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	return (
		<article className="max-w-[1200px] w-full mx-auto pb-16">
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />
			<QualityActionsBar
				lang={lang}
				dict={dict.actions}
				onRefresh={handleRefresh}
				onExport={handleExport}
				isRefreshing={statsQuery.isFetching || sourcesQuery.isFetching}
				isExporting={exportMutation.isPending}
			/>

			<div className="mt-8">
				<QualityStatsGrid
					stats={statsQuery.data}
					sourcesCount={sourcesQuery.data?.length}
					loading={statsQuery.isLoading}
					dict={dict.stats}
				/>
			</div>

			<QualityOverview
				stats={statsQuery.data}
				loading={statsQuery.isLoading}
				onJump={handleJumpToFilter}
				dict={dict}
			/>

			<QualitySourceBreakdown
				sources={sourcesQuery.data}
				loading={sourcesQuery.isLoading}
				error={sourcesQuery.isError}
				onRetry={() => sourcesQuery.refetch()}
				dict={dict.sources}
				commonDict={commonDict}
			/>

			<QualityProblemsSection
				lang={lang}
				type={filters.type}
				onTypeChange={filters.setType}
				search={filters.searchInput}
				onSearchChange={filters.setSearchInput}
				source={filters.source}
				onSourceChange={filters.setSource}
				sources={sourcesQuery.data}
				stats={statsQuery.data}
				page={filters.page}
				onPageChange={filters.setPage}
				problems={problemsQuery.data}
				isLoading={problemsQuery.isLoading}
				isError={problemsQuery.isError}
				onRetry={() => problemsQuery.refetch()}
				dict={dict.problems}
				commonDict={commonDict}
			/>
		</article>
	);
};
