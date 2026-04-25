"use client";

import type { AnalyticsMetric } from "@/features/admin-analytics";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface MetricTabsProps {
	dict: Dictionary["admin"]["analytics"]["timeseries"]["metrics"];
	value: AnalyticsMetric;
	onChange: (next: AnalyticsMetric) => void;
}

const METRICS: ReadonlyArray<AnalyticsMetric> = [
	"pageviews",
	"uniqueVisitors",
	"sessions",
	"totalEvents",
	"bounceRate",
	"avgSessionSec",
];

export const MetricTabs: FC<MetricTabsProps> = ({ dict, value, onChange }) => (
	<div
		role="tablist"
		aria-label={dict.label}
		className="flex flex-wrap gap-2"
	>
		{METRICS.map((metric) => {
			const isActive = value === metric;
			return (
				<button
					key={metric}
					type="button"
					role="tab"
					aria-selected={isActive}
					onClick={() => onChange(metric)}
					className={cn(
						"inline-flex items-center gap-2 px-4 py-2 rounded-full",
						"text-sm font-medium border transition-colors",
						isActive
							? "bg-[var(--accent)] text-[var(--accent-on)] border-[var(--accent)]"
							: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-hover)]",
					)}
				>
					<span
						aria-hidden="true"
						className={cn(
							"w-4 h-4 rounded-sm",
							isActive
								? "bg-[var(--accent-on)] opacity-70"
								: "bg-current opacity-30",
						)}
					/>
					{dict[metric]}
				</button>
			);
		})}
	</div>
);
