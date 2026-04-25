"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AnalyticsTabs } from "@/widgets/admin-analytics-overview-page/ui/analytics-tabs";
import { AnalyticsToolbar } from "@/widgets/admin-analytics-overview-page/ui/analytics-toolbar";
import { RealtimeBadge } from "@/widgets/admin-analytics-overview-page/ui/realtime-badge";
import type { FC } from "react";
import { usePagesPageState } from "../model/use-pages-page-state";
import { PagesStatsRow } from "./pages-stats-row";
import { PagesToplist } from "./pages-toplist";

interface AdminAnalyticsPagesPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsPages"];
	tabsDict: Dictionary["admin"]["analytics"]["tabs"];
	toolbarDict: Dictionary["admin"]["analytics"]["toolbar"];
	realtimeDict: Dictionary["admin"]["analytics"]["realtime"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminAnalyticsPagesPage: FC<AdminAnalyticsPagesPageProps> = ({
	lang,
	dict,
	tabsDict,
	toolbarDict,
	realtimeDict,
	commonDict,
}) => {
	const state = usePagesPageState();

	const totalPageviews = state.stats.data?.totalPageviews ?? 0;
	const topItem = state.items[0];

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

			<AnalyticsTabs lang={lang} dict={tabsDict} activeKey="pages" />

			<AnalyticsToolbar
				dict={toolbarDict}
				rangeState={state.range}
				onRefresh={state.refresh}
				onExport={() => {
					void state.exportCsv();
				}}
				exporting={state.isExporting}
			/>

			<PagesStatsRow
				lang={lang}
				dict={dict.stats}
				stats={state.stats.data}
				topItem={topItem}
				loading={state.stats.isLoading}
			/>

			<PagesToplist
				lang={lang}
				dict={dict.toplist}
				commonDict={commonDict}
				items={state.items}
				total={state.total}
				maxCount={state.maxCount}
				totalPageviews={totalPageviews}
				search={state.search}
				onSearchChange={state.setSearch}
				debouncedSearch={state.debouncedSearch}
				limit={state.limit}
				onLimitChange={state.setLimit}
				onLoadMore={() => {
					void state.pages.fetchNextPage();
				}}
				hasNextPage={state.pages.hasNextPage ?? false}
				isFetchingNextPage={state.pages.isFetchingNextPage}
				isLoading={state.pages.isLoading}
				isError={state.pages.isError}
				onRetry={() => {
					void state.pages.refetch();
				}}
			/>
		</article>
	);
};
