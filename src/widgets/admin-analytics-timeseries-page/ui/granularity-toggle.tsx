"use client";

import type { AnalyticsGranularity } from "@/features/admin-analytics";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface GranularityToggleProps {
	dict: Dictionary["admin"]["analytics"]["timeseries"]["granularity"];
	value: AnalyticsGranularity;
	onChange: (next: AnalyticsGranularity) => void;
}

const GRANULARITIES: ReadonlyArray<AnalyticsGranularity> = [
	"day",
	"week",
	"month",
];

export const GranularityToggle: FC<GranularityToggleProps> = ({
	dict,
	value,
	onChange,
}) => (
	<div
		role="tablist"
		aria-label={dict.label}
		className={cn(
			"inline-flex p-[3px] gap-[2px] rounded-md",
			"bg-[var(--surface)] border border-[var(--border)]",
		)}
	>
		{GRANULARITIES.map((g) => {
			const isActive = value === g;
			return (
				<button
					key={g}
					type="button"
					role="tab"
					aria-selected={isActive}
					onClick={() => onChange(g)}
					className={cn(
						"px-4 py-2 rounded-sm text-xs font-semibold tracking-wide transition-colors",
						isActive
							? "bg-[var(--accent)] text-[var(--accent-on)]"
							: "text-[var(--text-muted)] hover:text-[var(--text)]",
					)}
				>
					{dict[g]}
				</button>
			);
		})}
	</div>
);
