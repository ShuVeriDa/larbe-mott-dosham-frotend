"use client";

import type {
	AnalyticsMetric,
	AnalyticsTimeseriesPoint,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { useId, useMemo, useState, type FC } from "react";
import {
	computeDeltaPct,
	formatDateShort,
	formatMetricCompact,
	formatMetricValue,
} from "../lib/format";

interface TimeseriesChartProps {
	dict: Dictionary["admin"]["analytics"]["timeseries"]["chart"];
	durationDict: { minutes: string; seconds: string };
	lang: Locale;
	metric: AnalyticsMetric;
	current: AnalyticsTimeseriesPoint[];
	previous?: AnalyticsTimeseriesPoint[];
	showCompare: boolean;
}

const VIEW_W = 840;
const VIEW_H = 380;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 40;
const PAD_B = 60;
const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;

interface PlotPoint {
	x: number;
	y: number;
	value: number;
	date: string;
}

const buildPath = (points: PlotPoint[]): string =>
	points
		.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
		.join(" ");

const buildArea = (points: PlotPoint[]): string => {
	if (points.length === 0) return "";
	const baseY = VIEW_H - PAD_B;
	const last = points[points.length - 1];
	const first = points[0];
	return `${buildPath(points)} L${last.x.toFixed(1)},${baseY} L${first.x.toFixed(1)},${baseY} Z`;
};

export const TimeseriesChart: FC<TimeseriesChartProps> = ({
	dict,
	durationDict,
	lang,
	metric,
	current,
	previous,
	showCompare,
}) => {
	const gradientId = useId();
	const [hover, setHover] = useState<{
		index: number;
		x: number;
		y: number;
	} | null>(null);

	const { currentPts, previousPts, yLabels } = useMemo(() => {
		if (current.length === 0) {
			return { currentPts: [], previousPts: [], yLabels: [] };
		}
		const all = [
			...current.map((p) => p.value),
			...(previous?.map((p) => p.value) ?? []),
		];
		const rawMax = Math.max(...all);
		const max = rawMax > 0 ? rawMax * 1.15 : 1;
		const stepX =
			current.length > 1 ? PLOT_W / (current.length - 1) : 0;

		const project = (
			pts: AnalyticsTimeseriesPoint[],
		): PlotPoint[] =>
			pts.map((p, i) => ({
				x: PAD_L + i * stepX,
				y: PAD_T + (1 - p.value / max) * PLOT_H,
				value: p.value,
				date: p.date,
			}));

		const labels = [1, 0.75, 0.5, 0.25, 0].map(
			(frac) => max * frac,
		);

		return {
			currentPts: project(current),
			previousPts: previous ? project(previous) : [],
			yLabels: labels,
		};
	}, [current, previous]);

	if (current.length === 0) {
		return (
			<div className="flex items-center justify-center h-[280px] text-sm text-[var(--text-muted)]">
				{dict.empty}
			</div>
		);
	}

	const xTickEvery = Math.max(1, Math.ceil(current.length / 8));
	const path = buildPath(currentPts);
	const area = buildArea(currentPts);
	const prevPath = previousPts.length > 0 ? buildPath(previousPts) : "";

	const hovered =
		hover && currentPts[hover.index] ? currentPts[hover.index] : null;
	const hoveredPrev =
		hover && previousPts[hover.index] ? previousPts[hover.index] : null;
	const hoveredDelta =
		hovered && hoveredPrev
			? computeDeltaPct(hovered.value, hoveredPrev.value)
			: null;

	return (
		<div className="relative">
			{hovered ? (
				<div
					role="presentation"
					aria-hidden="true"
					className={cn(
						"absolute pointer-events-none whitespace-nowrap z-10",
						"bg-[var(--bg-raised)] border border-[var(--border)] rounded-md",
						"px-3 py-2 text-xs text-[var(--text)] shadow-lg",
					)}
					style={{
						left: `${(hovered.x / VIEW_W) * 100}%`,
						top: `${(hovered.y / VIEW_H) * 100}%`,
						transform: "translate(-50%, -120%)",
					}}
				>
					<div className="text-[var(--text-muted)] font-mono text-[10px]">
						{formatDateShort(hovered.date, lang)}
					</div>
					<div className="font-semibold tabular-nums">
						{formatMetricValue(metric, hovered.value, lang, durationDict)}
					</div>
					{hoveredDelta !== null ? (
						<div
							className={cn(
								"text-[10px] tabular-nums mt-0.5",
								hoveredDelta >= 0
									? "text-[var(--success)]"
									: "text-[var(--danger)]",
							)}
						>
							{hoveredDelta >= 0 ? "↑ +" : "↓ "}
							{Math.abs(hoveredDelta).toFixed(1)}% {dict.tooltipDelta}
						</div>
					) : null}
				</div>
			) : null}

			<svg
				viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
				className="w-full h-[260px] md:h-[380px] block overflow-visible"
				role="img"
				aria-label={dict.legendCurrent}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="0%"
							stopColor="var(--accent)"
							stopOpacity="0.35"
						/>
						<stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
					</linearGradient>
				</defs>

				<g>
					{[0, 0.25, 0.5, 0.75, 1].map((frac) => {
						const y = PAD_T + frac * PLOT_H;
						return (
							<line
								key={frac}
								x1={PAD_L}
								y1={y}
								x2={VIEW_W - PAD_R}
								y2={y}
								stroke="var(--border)"
								strokeWidth={1}
							/>
						);
					})}
				</g>

				<g>
					{yLabels.map((value, i) => {
						const y = PAD_T + (i / (yLabels.length - 1)) * PLOT_H;
						return (
							<text
								key={i}
								x={PAD_L - 8}
								y={y + 4}
								textAnchor="end"
								className="fill-[var(--text-muted)]"
								style={{
									fontSize: "11px",
									fontFamily: "var(--font-mono, monospace)",
								}}
							>
								{formatMetricCompact(metric, value, lang, durationDict)}
							</text>
						);
					})}
				</g>

				{showCompare && prevPath ? (
					<path
						d={prevPath}
						fill="none"
						stroke="var(--warning)"
						strokeWidth={1.5}
						strokeDasharray="4,4"
						strokeLinejoin="round"
						strokeLinecap="round"
					/>
				) : null}

				<path d={area} fill={`url(#${gradientId})`} />
				<path
					d={path}
					fill="none"
					stroke="var(--accent)"
					strokeWidth={2}
					strokeLinejoin="round"
					strokeLinecap="round"
				/>

				<g>
					{currentPts.map((p, i) => (
						<circle
							key={`${p.date}-${i}`}
							cx={p.x}
							cy={p.y}
							r={3}
							className="fill-[var(--accent)] cursor-pointer transition-[r]"
							onMouseEnter={() => setHover({ index: i, x: p.x, y: p.y })}
							onMouseLeave={() => setHover(null)}
						>
							<title>{`${formatDateShort(p.date, lang)} — ${formatMetricValue(
								metric,
								p.value,
								lang,
								durationDict,
							)}`}</title>
						</circle>
					))}
				</g>

				<g>
					{currentPts.map((p, i) => {
						if (i % xTickEvery !== 0 && i !== currentPts.length - 1) {
							return null;
						}
						return (
							<text
								key={`x-${i}`}
								x={p.x}
								y={VIEW_H - PAD_B + 24}
								textAnchor="middle"
								className="fill-[var(--text-muted)]"
								style={{
									fontSize: "11px",
									fontFamily: "var(--font-mono, monospace)",
								}}
							>
								{formatDateShort(p.date, lang)}
							</text>
						);
					})}
				</g>
			</svg>
		</div>
	);
};
