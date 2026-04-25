"use client";

import {
	adminAnalyticsApi,
	adminAnalyticsKeys,
	useAdminAnalyticsOverview,
	useAdminAnalyticsTimeseries,
	useAdminAnalyticsTimeseriesSummary,
	useAnalyticsRange,
	type AnalyticsTimeseriesCompareResponse,
	type AnalyticsTimeseriesPoint,
	type AnalyticsTimeseriesQuery,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminAuthGate,
	AdminErrorState,
	AdminTableSkeleton,
	PageHeader,
} from "@/shared/ui/admin";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, type FC } from "react";
import { computeDeltaPct } from "../lib/format";
import { useTimeseriesState } from "../model/use-timeseries-state";
import { AnalyticsTabs } from "./analytics-tabs";
import { CompareToggle } from "./compare-toggle";
import { GranularityToggle } from "./granularity-toggle";
import { MetricTabs } from "./metric-tabs";
import { RangeToolbar } from "./range-toolbar";
import { RealtimeBadge } from "./realtime-badge";
import { SummaryRow } from "./summary-row";
import { TimeseriesChart } from "./timeseries-chart";

interface AdminAnalyticsTimeseriesPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["analytics"];
	commonDict: Dictionary["admin"]["common"];
}

const DURATION_LABELS = { minutes: "м", seconds: "с" };

const isCompareResponse = (
	v:
		| AnalyticsTimeseriesPoint[]
		| AnalyticsTimeseriesCompareResponse
		| undefined,
): v is AnalyticsTimeseriesCompareResponse =>
	!!v && typeof v === "object" && !Array.isArray(v) && "current" in v;

export const AdminAnalyticsTimeseriesPage: FC<
	AdminAnalyticsTimeseriesPageProps
> = ({ lang, dict, commonDict }) => {
	const tDict = dict.timeseries;
	const range = useAnalyticsRange();
	const view = useTimeseriesState();
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);

	const tsQuery = useMemo<AnalyticsTimeseriesQuery>(
		() => ({
			metric: view.metric,
			granularity: view.granularity,
			from: range.range.from,
			to: range.range.to,
		}),
		[view.metric, view.granularity, range.range.from, range.range.to],
	);

	const enabled = range.error === null;

	const seriesQuery = useAdminAnalyticsTimeseries(
		tsQuery,
		view.compare,
		{ enabled },
	);
	const summaryQuery = useAdminAnalyticsTimeseriesSummary(tsQuery, {
		enabled,
	});
	const overviewQuery = useAdminAnalyticsOverview(
		range.range.from,
		range.range.to,
		{ enabled },
	);

	const seriesData = seriesQuery.data;
	const current = isCompareResponse(seriesData)
		? seriesData.current
		: (seriesData as AnalyticsTimeseriesPoint[] | undefined) ?? [];
	const previous = isCompareResponse(seriesData)
		? seriesData.previous
		: undefined;

	const totalDelta = useMemo<number | null>(() => {
		const overview = overviewQuery.data;
		if (!overview) return null;
		return computeDeltaPct(
			overview.current[view.metric],
			overview.previous[view.metric],
		);
	}, [overviewQuery.data, view.metric]);

	const avgDelta = useMemo<number | null>(() => {
		if (!previous || previous.length === 0) return null;
		const sum = (arr: AnalyticsTimeseriesPoint[]) =>
			arr.reduce((acc, p) => acc + p.value, 0);
		const isRate =
			view.metric === "bounceRate" || view.metric === "avgSessionSec";
		const cur = isRate ? sum(current) / current.length : sum(current);
		const prev = isRate ? sum(previous) / previous.length : sum(previous);
		return computeDeltaPct(cur, prev);
	}, [current, previous, view.metric]);

	const inverseDelta = view.metric === "bounceRate";

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await queryClient.invalidateQueries({
				queryKey: adminAnalyticsKeys.all,
			});
		} finally {
			setRefreshing(false);
		}
	}, [queryClient]);

	const handleExport = useCallback(() => {
		if (!enabled) return;
		const url = adminAnalyticsApi.buildTimeseriesExportUrl(tsQuery);
		const link = document.createElement("a");
		link.href = url;
		link.rel = "noopener";
		link.target = "_blank";
		document.body.appendChild(link);
		link.click();
		link.remove();
	}, [enabled, tsQuery]);

	const subtitleParts = [
		`${range.range.from} — ${range.range.to}`,
		tDict.granularity[view.granularity],
	];

	const isLoading = seriesQuery.isLoading || summaryQuery.isLoading;
	const hasError =
		seriesQuery.isError || summaryQuery.isError || overviewQuery.isError;

	return (
		<AdminAuthGate lang={lang} dict={commonDict}>
			<article className="max-w-[1280px] mx-auto">
				<PageHeader
					title={tDict.header.title}
					subtitle={tDict.header.subtitle}
					actions={
						<RealtimeBadge
							label={dict.realtime.label}
							tooltip={dict.realtime.tooltip}
						/>
					}
				/>

				<AnalyticsTabs
					lang={lang}
					dict={dict.tabs}
					activeKey="timeseries"
				/>

				<RangeToolbar
					dict={dict.toolbar}
					rangeState={range}
					onRefresh={handleRefresh}
					refreshing={refreshing}
				/>

				<div className="flex flex-wrap items-center justify-between gap-4 mb-5">
					<MetricTabs
						dict={tDict.metrics}
						value={view.metric}
						onChange={view.setMetric}
					/>
					<GranularityToggle
						dict={tDict.granularity}
						value={view.granularity}
						onChange={view.setGranularity}
					/>
				</div>

				{hasError ? (
					<AdminErrorState
						title={commonDict.error}
						retryLabel={commonDict.retry}
						onRetry={handleRefresh}
						className="mb-6"
					/>
				) : null}

				<SummaryRow
					dict={tDict.summary}
					durationDict={DURATION_LABELS}
					lang={lang}
					metric={view.metric}
					summary={summaryQuery.data}
					loading={summaryQuery.isLoading}
					deltaPct={totalDelta}
					avgDeltaPct={avgDelta ?? totalDelta}
					inverseDelta={inverseDelta}
				/>

				<section
					className={cn(
						"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-5",
					)}
				>
					<header className="flex flex-wrap items-center justify-between gap-3 mb-4">
						<div>
							<h2 className="text-md font-semibold text-[var(--text)]">
								{tDict.metrics[view.metric]}
							</h2>
							<p className="text-xs text-[var(--text-muted)] mt-1">
								{subtitleParts.join(" · ")}
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
								<span className="inline-flex items-center gap-1">
									<span
										aria-hidden="true"
										className="inline-block w-2 h-2 rounded-sm bg-[var(--accent)]"
									/>
									{tDict.chart.legendCurrent}
								</span>
								<span className="inline-flex items-center gap-1">
									<span
										aria-hidden="true"
										className="inline-block w-2 h-2 rounded-sm bg-[var(--warning)]"
									/>
									{tDict.chart.legendPrevious}
								</span>
							</div>
							<CompareToggle
								label={tDict.chart.compare}
								value={view.compare}
								onChange={view.setCompare}
							/>
							<button
								type="button"
								onClick={handleExport}
								disabled={!enabled}
								className={cn(
									"inline-flex items-center gap-2 px-3 py-2 h-8 rounded-md",
									"bg-[var(--surface)] border border-[var(--border)]",
									"text-xs font-semibold text-[var(--text)]",
									"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]",
									"disabled:opacity-50 disabled:cursor-not-allowed",
								)}
							>
								{tDict.actions.export}
							</button>
						</div>
					</header>

					{isLoading && current.length === 0 ? (
						<AdminTableSkeleton rows={6} />
					) : (
						<TimeseriesChart
							dict={tDict.chart}
							durationDict={DURATION_LABELS}
							lang={lang}
							metric={view.metric}
							current={current}
							previous={previous}
							showCompare={view.compare}
						/>
					)}
				</section>
			</article>
		</AdminAuthGate>
	);
};
