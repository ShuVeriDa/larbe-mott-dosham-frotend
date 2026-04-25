"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface LiveBadgeProps {
	count: number | undefined;
	loading?: boolean;
	paused: boolean;
	label: string;
	pausedLabel: string;
}

export const LiveBadge: FC<LiveBadgeProps> = ({
	count,
	loading = false,
	paused,
	label,
	pausedLabel,
}) => {
	const display =
		count === undefined || loading ? "—" : String(Math.max(0, count));
	const colorClasses = paused
		? "bg-[var(--warning-dim)] border-[var(--warning)] text-[var(--warning)]"
		: "bg-[var(--success-dim)] border-[var(--success)] text-[var(--success)]";
	const dotColor = paused ? "bg-[var(--warning)]" : "bg-[var(--success)]";

	return (
		<div
			role="status"
			aria-live="polite"
			className={cn(
				"inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold whitespace-nowrap",
				colorClasses,
			)}
		>
			<span className={cn("relative h-2 w-2 rounded-full", dotColor)}>
				{!paused ? (
					<span
						aria-hidden="true"
						className="absolute -inset-1 rounded-full bg-[var(--success)] opacity-50 motion-safe:animate-ping"
					/>
				) : null}
			</span>
			<span>
				{paused ? pausedLabel : label} ·{" "}
				<span className="tabular-nums">{display}</span>
			</span>
		</div>
	);
};
