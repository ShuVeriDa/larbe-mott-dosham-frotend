"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AnalyticsTabs } from "@/widgets/admin-analytics-overview-page/ui/analytics-tabs";
import { AnalyticsToolbar } from "@/widgets/admin-analytics-overview-page/ui/analytics-toolbar";
import { RealtimeBadge } from "@/widgets/admin-analytics-overview-page/ui/realtime-badge";
import type { FC } from "react";
import { useSearchQueriesPageState } from "../model/use-search-queries-page-state";
import { SearchQueriesCallout } from "./search-queries-callout";
import { SearchQueriesStatsRow } from "./search-queries-stats-row";
import { SearchQueriesToplist } from "./search-queries-toplist";

interface AdminAnalyticsSearchQueriesPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsSearchQueries"];
	tabsDict: Dictionary["admin"]["analytics"]["tabs"];
	toolbarDict: Dictionary["admin"]["analytics"]["toolbar"];
	realtimeDict: Dictionary["admin"]["analytics"]["realtime"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminAnalyticsSearchQueriesPage: FC<
	AdminAnalyticsSearchQueriesPageProps
> = ({ lang, dict, tabsDict, toolbarDict, realtimeDict, commonDict }) => {
	const state = useSearchQueriesPageState();
	const totalSearches = state.stats.data?.totalSearches ?? 0;

	return (
		<article className="max-w-[1200px] mx-auto">
			<header className="mb-5 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1">
						{dict.header.title}
					</h1>
					<p className="text-base text-[var(--text-secondary)] max-w-xl">
						{dict.header.subtitle}
					</p>
				</div>
				<RealtimeBadge
					label={realtimeDict.label}
					tooltip={realtimeDict.tooltip}
				/>
			</header>

			<AnalyticsTabs lang={lang} dict={tabsDict} activeKey="searchQueries" />

			<AnalyticsToolbar
				dict={toolbarDict}
				rangeState={state.range}
				onRefresh={state.refresh}
				onExport={() => {
					void state.exportCsv();
				}}
				exporting={state.isExporting}
			/>

			<SearchQueriesCallout dict={dict.callout} />

			<SearchQueriesStatsRow
				lang={lang}
				dict={dict.stats}
				stats={state.stats.data}
				loading={state.stats.isLoading}
			/>

			<SearchQueriesToplist
				lang={lang}
				dict={dict.toplist}
				commonDict={commonDict}
				items={state.items}
				total={state.total}
				maxCount={state.maxCount}
				totalSearches={totalSearches}
				search={state.search}
				onSearchChange={state.setSearch}
				debouncedSearch={state.debouncedSearch}
				limit={state.limit}
				onLimitChange={state.setLimit}
				onlyZeroResults={state.onlyZeroResults}
				onToggleZeroResults={state.setOnlyZeroResults}
				onLoadMore={() => {
					void state.queries.fetchNextPage();
				}}
				hasNextPage={state.queries.hasNextPage ?? false}
				isFetchingNextPage={state.queries.isFetchingNextPage}
				isLoading={state.queries.isLoading}
				isError={state.queries.isError}
				onRetry={() => {
					void state.queries.refetch();
				}}
			/>
		</article>
	);
};
