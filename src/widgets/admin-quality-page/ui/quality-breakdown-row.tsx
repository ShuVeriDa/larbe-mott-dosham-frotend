"use client";

import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

export type BreakdownTone = "danger" | "warning" | "info" | "muted";

interface QualityBreakdownRowProps {
	tone: BreakdownTone;
	icon: ReactNode;
	name: string;
	description: string;
	count: number;
	total: number;
	jumpLabel: string;
	onJump: () => void;
}

const iconBg: Record<BreakdownTone, string> = {
	danger: "bg-[var(--danger-dim)] text-[var(--danger)]",
	warning: "bg-[var(--warning-dim)] text-[var(--warning)]",
	info: "bg-[var(--info-dim)] text-[var(--info)]",
	muted: "bg-[var(--surface-active)] text-[var(--text-muted)]",
};

const barFill: Record<BreakdownTone, string> = {
	danger: "bg-[var(--danger)]",
	warning: "bg-[var(--warning)]",
	info: "bg-[var(--info)]",
	muted: "bg-[var(--text-muted)]",
};

const nf = new Intl.NumberFormat("ru-RU");

export const QualityBreakdownRow: FC<QualityBreakdownRowProps> = ({
	tone,
	icon,
	name,
	description,
	count,
	total,
	jumpLabel,
	onJump,
}) => {
	const pct = total > 0 ? (count / total) * 100 : 0;
	const pctText = `${pct.toFixed(pct < 1 ? 2 : 1)}%`;

	return (
		<div className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-b-0 flex-wrap">
			<div
				className={cn(
					"w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0",
					iconBg[tone],
				)}
			>
				{icon}
			</div>
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-[var(--text)]">{name}</div>
				<div className="text-xs text-[var(--text-muted)]">{description}</div>
			</div>
			<div className="w-40 shrink-0 order-last md:order-none w-full md:w-40">
				<div className="h-1.5 bg-[var(--surface-active)] rounded-full overflow-hidden">
					<div
						className={cn("h-full rounded-full transition-all", barFill[tone])}
						style={{ width: `${Math.min(pct, 100)}%` }}
					/>
				</div>
			</div>
			<div className="text-right shrink-0 min-w-[70px]">
				<div className="text-sm font-semibold text-[var(--text)] font-mono tabular-nums">
					{nf.format(count)}
				</div>
				<div className="text-xs text-[var(--text-muted)] font-mono">
					{pctText}
				</div>
			</div>
			<button
				type="button"
				onClick={onJump}
				className="btn btn-sm btn-ghost shrink-0"
			>
				{jumpLabel}
			</button>
		</div>
	);
};
