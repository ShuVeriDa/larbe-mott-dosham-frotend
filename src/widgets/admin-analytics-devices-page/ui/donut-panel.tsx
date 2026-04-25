"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type {
	AnalyticsUaBreakdown,
	AnalyticsUaKind,
} from "@/features/admin-analytics";
import { AdminErrorState } from "@/shared/ui/admin";
import type { FC } from "react";
import { useMemo, useState } from "react";
import {
	buildSegments,
	formatShareCenter,
	formatVisitors,
} from "../lib/segments";
import { DonutChart } from "./donut-chart";
import { DonutLegend } from "./donut-legend";
import { DonutSkeleton } from "./donut-skeleton";

type DevicesDict = Dictionary["admin"]["analyticsDevices"];

interface DonutPanelProps {
	kind: AnalyticsUaKind;
	titleIcon: string;
	title: string;
	data: AnalyticsUaBreakdown | undefined;
	loading: boolean;
	error: boolean;
	onRetry: () => void;
	dict: DevicesDict;
	lang: Locale;
	className?: string;
}

export const DonutPanel: FC<DonutPanelProps> = ({
	kind,
	titleIcon,
	title,
	data,
	loading,
	error,
	onRetry,
	dict,
	lang,
	className,
}) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const segments = useMemo(
		() => (data ? buildSegments(kind, data.items, dict) : []),
		[data, kind, dict],
	);

	const maxValue = useMemo(
		() => segments.reduce((m, s) => Math.max(m, s.value), 0),
		[segments],
	);

	const totalEvents = data?.totalEvents ?? 0;
	const totalVisitors = data?.totalVisitors ?? 0;
	const isEmpty = !loading && !error && totalEvents === 0;

	const visibleSegments = useMemo(() => {
		const top = segments.reduce<{ idx: number; value: number } | null>(
			(acc, s, i) => (acc && acc.value >= s.value ? acc : { idx: i, value: s.value }),
			null,
		);
		return { top };
	}, [segments]);

	const activeSegment =
		hoveredIndex !== null
			? segments[hoveredIndex]
			: visibleSegments.top
				? segments[visibleSegments.top.idx]
				: undefined;

	const centerValue =
		isEmpty || !activeSegment
			? dict.center.emptyValue
			: formatShareCenter(activeSegment.share);
	const centerLabel =
		isEmpty || !activeSegment ? dict.center.emptyLabel : activeSegment.name;

	const summaryText = dict.summary.visitors.replace(
		"{count}",
		formatVisitors(totalVisitors, lang),
	);
	const eventsText = dict.summary.events.replace(
		"{count}",
		formatVisitors(totalEvents, lang),
	);

	return (
		<section
			aria-label={title}
			className={[
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5",
				"flex flex-col gap-5",
				className ?? "",
			].join(" ")}
		>
			<header className="flex justify-between items-center gap-3">
				<h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
					<span aria-hidden="true">{titleIcon}</span>
					{title}
				</h2>
				<div className="text-xs text-[var(--text-muted)] tabular-nums text-right leading-tight">
					<div>{summaryText}</div>
					<div className="opacity-70">{eventsText}</div>
				</div>
			</header>

			{error ? (
				<AdminErrorState
					title={dict.states.errorTitle}
					retryLabel={dict.states.retry}
					onRetry={onRetry}
				/>
			) : loading && !data ? (
				<DonutSkeleton />
			) : (
				<>
					<div className="relative flex justify-center items-center">
						<DonutChart
							segments={segments}
							total={totalEvents}
							hoveredIndex={hoveredIndex}
							onHover={setHoveredIndex}
							ariaLabel={title}
						/>
						<div
							aria-live="polite"
							className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
						>
							<div className="text-xl font-bold tabular-nums tracking-tight text-[var(--text)] leading-none">
								{centerValue}
							</div>
							<div className="text-[0.65rem] text-[var(--text-muted)] uppercase tracking-wider font-medium mt-1">
								{centerLabel}
							</div>
						</div>
					</div>

					{!isEmpty && (
						<DonutLegend
							segments={segments}
							maxValue={maxValue}
							hoveredIndex={hoveredIndex}
							onHover={setHoveredIndex}
							lang={lang}
						/>
					)}
				</>
			)}
		</section>
	);
};
