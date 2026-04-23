import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

export type StatCardTone = "total" | "danger" | "warning" | "info" | "success";

interface StatCardProps {
	icon?: ReactNode;
	tone?: StatCardTone;
	label: string;
	value: ReactNode;
	sub?: ReactNode;
	loading?: boolean;
	className?: string;
}

const toneClass: Record<StatCardTone, string> = {
	total: "bg-[var(--accent-dim)] text-[var(--accent)]",
	danger: "bg-[var(--danger-dim)] text-[var(--danger)]",
	warning: "bg-[var(--warning-dim)] text-[var(--warning)]",
	info: "bg-[var(--info-dim)] text-[var(--info)]",
	success: "bg-[var(--success-dim)] text-[var(--success)]",
};

const nf = new Intl.NumberFormat("ru-RU");

export const formatStatValue = (value: number | string | undefined): string => {
	if (value === undefined || value === null) return "—";
	if (typeof value === "number") return nf.format(value);
	return value;
};

export const StatCard: FC<StatCardProps> = ({
	icon,
	tone = "total",
	label,
	value,
	sub,
	loading,
	className,
}) => (
	<div
		className={cn(
			"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5",
			"transition-all hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]",
			className,
		)}
	>
		{icon ? (
			<div
				className={cn(
					"w-10 h-10 rounded-xl flex items-center justify-center text-[1.1rem] mb-3",
					toneClass[tone],
				)}
			>
				{icon}
			</div>
		) : null}
		<div className="text-xs text-[var(--text-muted)] font-medium mb-2">
			{label}
		</div>
		<div
			className={cn(
				"text-2xl font-bold text-[var(--text)] leading-none mb-2 tabular-nums",
				loading && "opacity-40",
			)}
		>
			{loading ? "…" : value}
		</div>
		{sub ? (
			<div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
				{sub}
			</div>
		) : null}
	</div>
);
