"use client";

import type {
	AnalyticsRangePreset,
	AnalyticsRangeState,
} from "@/features/admin-analytics";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface RangeToolbarProps {
	dict: Dictionary["admin"]["analytics"]["toolbar"];
	rangeState: AnalyticsRangeState;
	onRefresh: () => void;
	refreshing?: boolean;
}

const PRESETS: ReadonlyArray<AnalyticsRangePreset> = [
	"today",
	"7d",
	"30d",
	"90d",
	"custom",
];

export const RangeToolbar: FC<RangeToolbarProps> = ({
	dict,
	rangeState,
	onRefresh,
	refreshing,
}) => {
	const { range, preset, setPreset, setCustomRange, error } = rangeState;
	const customDisabled = preset !== "custom";

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-3 p-3 mb-6",
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl",
			)}
		>
			<div
				role="tablist"
				aria-label={dict.presets.custom}
				className={cn(
					"flex flex-wrap gap-[2px] p-[3px] rounded-md",
					"bg-[var(--bg-raised)] border border-[var(--border)]",
				)}
			>
				{PRESETS.map((p) => {
					const isActive = preset === p;
					return (
						<button
							key={p}
							type="button"
							role="tab"
							aria-selected={isActive}
							onClick={() => setPreset(p)}
							className={cn(
								"px-3 py-2 text-xs font-medium rounded-sm transition-colors",
								isActive
									? "bg-[var(--accent)] text-[var(--accent-on)]"
									: "text-[var(--text-muted)] hover:text-[var(--text)]",
							)}
						>
							{dict.presets[p]}
						</button>
					);
				})}
			</div>

			<div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
				<input
					type="date"
					aria-label={dict.from}
					disabled={customDisabled}
					value={range.from}
					onChange={(e) => setCustomRange({ from: e.target.value })}
					className={cn(
						"bg-[var(--surface)] border border-[var(--border)] rounded-sm",
						"px-3 py-2 text-xs text-[var(--text)]",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				/>
				<span className="text-[var(--text-muted)] text-xs">—</span>
				<input
					type="date"
					aria-label={dict.to}
					disabled={customDisabled}
					value={range.to}
					onChange={(e) => setCustomRange({ to: e.target.value })}
					className={cn(
						"bg-[var(--surface)] border border-[var(--border)] rounded-sm",
						"px-3 py-2 text-xs text-[var(--text)]",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				/>
			</div>

			{error === "fromAfterTo" ? (
				<div className="text-xs text-[var(--danger)]">{dict.invalidRange}</div>
			) : null}

			<div className="flex-1 min-w-0" />

			<button
				type="button"
				onClick={onRefresh}
				disabled={refreshing}
				className={cn(
					"inline-flex items-center gap-2 px-3 py-2 h-8",
					"bg-[var(--surface)] border border-[var(--border)] rounded-md",
					"text-xs font-semibold text-[var(--text)]",
					"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]",
					"disabled:opacity-50 disabled:cursor-not-allowed",
				)}
			>
				<span
					aria-hidden="true"
					className={cn(refreshing && "motion-safe:animate-spin")}
				>
					↻
				</span>
				{refreshing ? dict.refreshing : dict.refresh}
			</button>
		</div>
	);
};
