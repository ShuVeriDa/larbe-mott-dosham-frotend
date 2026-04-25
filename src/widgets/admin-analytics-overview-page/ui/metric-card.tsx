import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";
import type { MetricDelta } from "../lib/format";
import { DeltaIndicator } from "./delta-indicator";
import { Sparkline } from "./sparkline";

export type MetricTone = "accent" | "info" | "success" | "warning" | "danger";

interface MetricCardProps {
	icon: ReactNode;
	tone?: MetricTone;
	label: string;
	value: string;
	delta: MetricDelta;
	vsLabel: string;
	inverseDelta?: boolean;
	sparkline?: number[];
	loading?: boolean;
}

const toneIconClass: Record<MetricTone, string> = {
	accent: "bg-[var(--accent-dim)] text-[var(--accent)]",
	info: "bg-[var(--info-dim)] text-[var(--info)]",
	success: "bg-[var(--success-dim)] text-[var(--success)]",
	warning: "bg-[var(--warning-dim)] text-[var(--warning)]",
	danger: "bg-[var(--danger-dim)] text-[var(--danger)]",
};

const toneStrokeVar: Record<MetricTone, string> = {
	accent: "var(--accent)",
	info: "var(--info)",
	success: "var(--success)",
	warning: "var(--warning)",
	danger: "var(--danger)",
};

export const MetricCard: FC<MetricCardProps> = ({
	icon,
	tone = "accent",
	label,
	value,
	delta,
	vsLabel,
	inverseDelta,
	sparkline,
	loading,
}) => (
	<div
		className={cn(
			"relative overflow-hidden",
			"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5",
			"flex flex-col gap-2 transition-all",
			"hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]",
		)}
	>
		<div className="text-[0.72rem] uppercase tracking-wider text-[var(--text-muted)] font-medium flex items-center gap-2">
			<span
				className={cn(
					"w-6 h-6 rounded-md flex items-center justify-center text-[0.8rem]",
					toneIconClass[tone],
				)}
			>
				{icon}
			</span>
			{label}
		</div>
		<div
			className={cn(
				"text-2xl font-bold leading-none tabular-nums tracking-tight text-[var(--text)]",
				loading && "opacity-40",
			)}
		>
			{loading ? "…" : value}
		</div>
		<DeltaIndicator delta={delta} vsLabel={vsLabel} inverse={inverseDelta} />
		{sparkline && sparkline.length > 0 ? (
			<Sparkline
				className="absolute right-3 bottom-3 w-[60px] h-6 opacity-50"
				values={sparkline}
				stroke={toneStrokeVar[tone]}
			/>
		) : null}
	</div>
);
