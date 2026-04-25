"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminErrorState, PageHeader } from "@/shared/ui/admin";
import {
	AnalyticsTabs,
	AnalyticsToolbar,
	RealtimeBadge,
} from "@/widgets/admin-analytics-overview-page";
import type { FC } from "react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useReferrersPage } from "../model/use-referrers-page";
import { CategoryCards } from "./category-cards";
import { ReferrersPanel } from "./referrers-panel";

interface AdminAnalyticsReferrersPageProps {
	lang: Locale;
	analyticsDict: Dictionary["admin"]["analytics"];
	dict: Dictionary["admin"]["analytics"]["referrers"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminAnalyticsReferrersPage: FC<
	AdminAnalyticsReferrersPageProps
> = ({ lang, analyticsDict, dict, commonDict }) => {
	const page = useReferrersPage();

	const handleRefresh = async () => {
		try {
			await page.refresh();
			toast.success(dict.toasts.refreshed);
		} catch {
			toast.error(dict.toasts.refreshError);
		}
	};

	const maxCount = useMemo(
		() => page.items.reduce((m, r) => Math.max(m, r.count), 0) || 1,
		[page.items],
	);

	const breakdownError = page.breakdownQuery.isError;
	const listError = page.listQuery.isError;

	return (
		<article className="max-w-[1280px] mx-auto">
			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<RealtimeBadge
						label={analyticsDict.realtime.label}
						tooltip={analyticsDict.realtime.tooltip}
					/>
				}
			/>

			<AnalyticsTabs
				lang={lang}
				dict={analyticsDict.tabs}
				activeKey="referrers"
			/>

			<AnalyticsToolbar
				dict={analyticsDict.toolbar}
				rangeState={page.range}
				onRefresh={handleRefresh}
				refreshing={page.refreshing || page.listQuery.isFetching}
			/>

			{breakdownError ? (
				<AdminErrorState
					title={dict.errors.breakdownTitle}
					retryLabel={commonDict.retry}
					onRetry={() => page.breakdownQuery.refetch()}
					className="mb-6"
				/>
			) : (
				<CategoryCards
					dict={dict.categories}
					lang={lang}
					breakdown={page.breakdownQuery.data}
					activeCategory={page.activeCategory}
					onSelect={page.setActiveCategory}
					loading={page.breakdownQuery.isLoading}
				/>
			)}

			<ReferrersPanel
				dict={dict}
				lang={lang}
				items={page.visibleItems}
				loadedCount={page.loadedCount}
				totalForRange={page.totalForRange}
				uniqueHostsForRange={page.uniqueHostsForRange}
				maxCount={maxCount}
				search={page.search}
				onSearchChange={page.setSearch}
				hasMore={page.hasMore}
				onLoadMore={page.loadMore}
				loading={page.listQuery.isLoading}
				loadingMore={page.listQuery.isFetchingNextPage}
				error={listError}
				onRetry={() => page.listQuery.refetch()}
			/>
		</article>
	);
};
