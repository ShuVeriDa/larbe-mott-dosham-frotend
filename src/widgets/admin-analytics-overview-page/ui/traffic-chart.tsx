"use client";

import type {
	AnalyticsTimeseriesPoint,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { useId, useMemo } from "react";
import { formatNumber } from "../lib/format";

interface TrafficChartProps {
	dict: Dictionary["admin"]["analytics"]["chart"];
	pageviews: AnalyticsTimeseriesPoint[];
	visitors: AnalyticsTimeseriesPoint[];
	loading?: boolean;
	lang: Locale;
}

const VIEW_W = 800;
const VIEW_H = 240;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 24;

const buildPath = (
	points: number[],
	max: number,
	withFill: boolean,
): string => {
	if (points.length === 0) return "";
	const innerH = VIEW_H - PADDING_TOP - PADDING_BOTTOM;
	const stepX = points.length === 1 ? VIEW_W : VIEW_W / (points.length - 1);
	const safeMax = max || 1;
	const coords = points.map((v, i) => {
		const x = (i * stepX).toFixed(2);
		const y = (PADDING_TOP + innerH - (v / safeMax) * innerH).toFixed(2);
		return { x, y };
	});
	const linePath = coords
		.map(({ x, y }, i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
		.join(" ");
	if (!withFill) return linePath;
	const last = coords[coords.length - 1];
	const first = coords[0];
	return `${linePath} L${last.x},${VIEW_H} L${first.x},${VIEW_H} Z`;
};

export const TrafficChart: FC<TrafficChartProps> = ({
	dict,
	pageviews,
	visitors,
	loading,
	lang,
}) => {
	const gradientId = useId();

	const data = useMemo(() => {
		const pv = pageviews.map((p) => p.value);
		const uv = visitors.map((p) => p.value);
		const max = Math.max(1, ...pv, ...uv);
		return { pv, uv, max };
	}, [pageviews, visitors]);

	const isEmpty = data.pv.length === 0 && data.uv.length === 0;

	return (
		<div
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-8",
			)}
		>
			<div className="flex flex-wrap justify-between items-center gap-3 mb-5">
				<div className="text-base font-semibold text-[var(--text)]">
					{dict.title}
				</div>
				<div className="flex gap-4 text-xs text-[var(--text-muted)]">
					<span className="inline-flex items-center gap-1">
						<span
							aria-hidden="true"
							className="w-2 h-2 rounded-sm bg-[var(--accent)]"
						/>
						{dict.legend.pageviews}
					</span>
					<span className="inline-flex items-center gap-1">
						<span
							aria-hidden="true"
							className="w-2 h-2 rounded-sm bg-[var(--text-muted)]"
						/>
						{dict.legend.visitors}
					</span>
				</div>
			</div>

			{isEmpty && !loading ? (
				<div
					className="flex items-center justify-center text-sm text-[var(--text-muted)]"
					style={{ height: VIEW_H }}
				>
					{dict.empty}
				</div>
			) : (
				<svg
					className={cn(
						"w-full h-[240px] block",
						loading && "opacity-40 transition-opacity",
					)}
					viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
					preserveAspectRatio="none"
					aria-label={dict.title}
					role="img"
				>
					<title>{`${dict.title}. ${dict.legend.pageviews}: ${formatNumber(
						data.pv.reduce((a, b) => a + b, 0),
						lang,
					)}. ${dict.legend.visitors}: ${formatNumber(
						data.uv.reduce((a, b) => a + b, 0),
						lang,
					)}.`}</title>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
							<stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
						</linearGradient>
					</defs>
					<g stroke="var(--border)" strokeWidth="1" opacity="0.7">
						<line x1="0" y1={VIEW_H * 0.25} x2={VIEW_W} y2={VIEW_H * 0.25} />
						<line x1="0" y1={VIEW_H * 0.5} x2={VIEW_W} y2={VIEW_H * 0.5} />
						<line x1="0" y1={VIEW_H * 0.75} x2={VIEW_W} y2={VIEW_H * 0.75} />
					</g>
					{data.pv.length > 0 ? (
						<>
							<path
								d={buildPath(data.pv, data.max, true)}
								fill={`url(#${gradientId})`}
								stroke="none"
							/>
							<path
								d={buildPath(data.pv, data.max, false)}
								fill="none"
								stroke="var(--accent)"
								strokeWidth={2}
								strokeLinejoin="round"
							/>
						</>
					) : null}
					{data.uv.length > 0 ? (
						<path
							d={buildPath(data.uv, data.max, false)}
							fill="none"
							stroke="var(--text-muted)"
							strokeWidth={1.5}
							strokeDasharray="3 3"
						/>
					) : null}
				</svg>
			)}
		</div>
	);
};
