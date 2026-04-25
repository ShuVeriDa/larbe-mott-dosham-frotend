"use client";

import {
	type AnalyticsCounters,
	type AnalyticsMetric,
	useAdminAnalyticsMultiTimeseries,
	useAdminAnalyticsOverview,
	useAdminAnalyticsTopPages,
	useAdminAnalyticsTopReferrers,
	useAggregateAnalytics,
	useAnalyticsRange,
	useExportAnalyticsOverviewCsv,
	useInvalidateAdminAnalytics,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminErrorState,
	PageHeader,
} from "@/shared/ui/admin";
import { type FC, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	SPARKLINE_METRICS,
	computeDelta,
	formatDuration,
	formatNumber,
	formatPercent,
	granularityForRange,
} from "../lib/format";
import { AnalyticsTabs } from "./analytics-tabs";
import { AnalyticsToolbar } from "./analytics-toolbar";
import { FooterDebug } from "./footer-debug";
import { MetricCard, type MetricTone } from "./metric-card";
import { RealtimeBadge } from "./realtime-badge";
import { TopList } from "./top-list";
import { TrafficChart } from "./traffic-chart";

interface AdminAnalyticsOverviewPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["analytics"];
	commonDict: Dictionary["admin"]["common"];
}

const TOP_LIMIT = 6;

const triggerCsvDownload = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};

const durationDictFor = (
	lang: Locale,
): { minutesShort: string; secondsShort: string } => {
	if (lang === "en") return { minutesShort: "m", secondsShort: "s" };
	return { minutesShort: "м", secondsShort: "с" };
};

export const AdminAnalyticsOverviewPage: FC<
	AdminAnalyticsOverviewPageProps
> = ({ lang, dict, commonDict }) => {
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;

	const overviewQuery = useAdminAnalyticsOverview(range.from, range.to);
	const topPagesQuery = useAdminAnalyticsTopPages({
		...range,
		limit: TOP_LIMIT,
	});
	const topReferrersQuery = useAdminAnalyticsTopReferrers({
		...range,
		limit: TOP_LIMIT,
	});
	const sparkQuery = useAdminAnalyticsMultiTimeseries({
		...range,
		metrics: [...SPARKLINE_METRICS],
		granularity: granularityForRange(range.from, range.to),
	});

	const aggregateMutation = useAggregateAnalytics();
	const exportMutation = useExportAnalyticsOverviewCsv();
	const invalidate = useInvalidateAdminAnalytics();

	const [refreshing, setRefreshing] = useState(false);

	const overview = overviewQuery.data;
	const sparklines = sparkQuery.data;
	const durationDict = durationDictFor(lang);

	const hasOverviewError = overviewQuery.isError;

	const sparklineFor = (metric: AnalyticsMetric): number[] =>
		sparklines?.[metric]?.map((p: { value: number }) => p.value) ?? [];

	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await invalidate();
			toast.success(dict.toasts.refreshed);
		} catch {
			toast.error(dict.toasts.refreshError);
		} finally {
			setRefreshing(false);
		}
	};

	const handleExport = async () => {
		try {
			toast.info(dict.toasts.exportStarted);
			const blob = await exportMutation.mutateAsync(range);
			triggerCsvDownload(
				blob,
				`analytics-overview-${range.from}-to-${range.to}.csv`,
			);
		} catch {
			toast.error(dict.toasts.exportError);
		}
	};

	const handleRecompute = async () => {
		try {
			await aggregateMutation.mutateAsync(undefined);
			toast.success(dict.toasts.recomputeStarted);
		} catch {
			toast.error(dict.toasts.recomputeError);
		}
	};

	const metricCards = useMemo(() => {
		const current = overview?.current;
		const previous = overview?.previous;
		const card = (
			tone: MetricTone,
			icon: string,
			label: string,
			metric: AnalyticsMetric,
			valueFormatter: (n: number) => string,
			inverseDelta = false,
		) => ({
			tone,
			icon,
			label,
			metric,
			value:
				current === undefined ? "—" : valueFormatter(metricValue(current, metric)),
			delta: computeDelta(
				current ? metricValue(current, metric) : 0,
				previous ? metricValue(previous, metric) : 0,
			),
			inverseDelta,
			sparkline: sparklineFor(metric),
		});

		return [
			card(
				"accent",
				"👤",
				dict.metrics.visitors,
				"uniqueVisitors",
				(n) => formatNumber(n, lang),
			),
			card("info", "◯", dict.metrics.sessions, "sessions", (n) =>
				formatNumber(n, lang),
			),
			card("success", "📄", dict.metrics.pageviews, "pageviews", (n) =>
				formatNumber(n, lang),
			),
			card("warning", "⚡", dict.metrics.events, "totalEvents", (n) =>
				formatNumber(n, lang),
			),
			card("accent", "⏱", dict.metrics.avgSession, "avgSessionSec", (n) =>
				formatDuration(n, durationDict),
			),
			card(
				"danger",
				"↺",
				dict.metrics.bounceRate,
				"bounceRate",
				(n) => formatPercent(n),
				true,
			),
		];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [overview, sparklines, lang, dict]);

	return (
		<article className="max-w-[1280px] mx-auto">
			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<RealtimeBadge
						label={dict.realtime.label}
						tooltip={dict.realtime.tooltip}
					/>
				}
			/>

			<AnalyticsTabs lang={lang} dict={dict.tabs} activeKey="overview" />

			<AnalyticsToolbar
				dict={dict.toolbar}
				rangeState={rangeState}
				onRefresh={handleRefresh}
				onExport={handleExport}
				refreshing={refreshing || overviewQuery.isFetching}
				exporting={exportMutation.isPending}
			/>

			{hasOverviewError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => overviewQuery.refetch()}
				/>
			) : (
				<>
					<div
						className={cn(
							"grid gap-4 mb-8",
							"grid-cols-1 sm:grid-cols-2",
							"min-[1024px]:grid-cols-3",
							"min-[1280px]:grid-cols-6",
						)}
					>
						{metricCards.map((card) => (
							<MetricCard
								key={card.metric}
								tone={card.tone}
								icon={card.icon}
								label={card.label}
								value={card.value}
								delta={card.delta}
								vsLabel={dict.metrics.vsPrevious}
								inverseDelta={card.inverseDelta}
								sparkline={card.sparkline}
								loading={overviewQuery.isLoading}
							/>
						))}
					</div>

					<TrafficChart
						dict={dict.chart}
						pageviews={sparklines?.pageviews ?? []}
						visitors={sparklines?.uniqueVisitors ?? []}
						loading={sparkQuery.isLoading}
						lang={lang}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
						<TopList
							title={dict.topPages.title}
							viewAllLabel={dict.topPages.viewAll}
							viewAllHref={`/${lang}/admin/analytics/pages`}
							emptyLabel={dict.topPages.empty}
							items={topPagesQuery.data ?? []}
							totalForPercent={overview?.current.pageviews ?? 0}
							variant="pages"
							loading={topPagesQuery.isLoading}
							lang={lang}
						/>
						<TopList
							title={dict.topReferrers.title}
							viewAllLabel={dict.topReferrers.viewAll}
							viewAllHref={`/${lang}/admin/analytics/referrers`}
							emptyLabel={dict.topReferrers.empty}
							items={topReferrersQuery.data ?? []}
							totalForPercent={overview?.current.pageviews ?? 0}
							variant="referrers"
							directLabel={dict.topReferrers.direct}
							loading={topReferrersQuery.isLoading}
							lang={lang}
						/>
					</div>

					<FooterDebug
						dict={dict.footer}
						queueSize={overview?.queueSize}
						aggregator={overview?.aggregator}
						daysWithData={overview?.current.daysWithData}
						onRecompute={handleRecompute}
						recomputing={aggregateMutation.isPending}
						lang={lang}
					/>
				</>
			)}
		</article>
	);
};

const metricValue = (
	counters: AnalyticsCounters,
	metric: AnalyticsMetric,
): number => {
	switch (metric) {
		case "uniqueVisitors":
			return counters.uniqueVisitors;
		case "sessions":
			return counters.sessions;
		case "pageviews":
			return counters.pageviews;
		case "totalEvents":
			return counters.totalEvents;
		case "avgSessionSec":
			return counters.avgSessionSec;
		case "bounceRate":
			return counters.bounceRate;
	}
};
