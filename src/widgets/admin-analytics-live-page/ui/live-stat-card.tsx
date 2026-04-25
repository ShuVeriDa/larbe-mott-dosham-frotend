"use client";

import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

export type LiveStatTone =
	| "accent"
	| "success"
	| "warning"
	| "purple"
	| "info";

const TONE_CLASS: Record<LiveStatTone, string> = {
	accent: "bg-[var(--accent-dim)] text-[var(--accent)]",
	success: "bg-[var(--success-dim)] text-[var(--success)]",
	warning: "bg-[var(--warning-dim)] text-[var(--warning)]",
	purple: "bg-[var(--purple-dim)] text-[var(--purple)]",
	info: "bg-[var(--info-dim)] text-[var(--info)]",
};

interface LiveStatCardProps {
	icon: ReactNode;
	value: ReactNode;
	label: string;
	tone?: LiveStatTone;
}

export const LiveStatCard: FC<LiveStatCardProps> = ({
	icon,
	value,
	label,
	tone = "accent",
}) => (
	<div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
		<div
			aria-hidden="true"
			className={cn(
				"flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-base",
				TONE_CLASS[tone],
			)}
		>
			{icon}
		</div>
		<div className="min-w-0">
			<div className="text-lg font-bold leading-tight tracking-tight tabular-nums text-[var(--text)]">
				{value}
			</div>
			<div className="mt-0.5 text-xs text-[var(--text-muted)]">{label}</div>
		</div>
	</div>
);
