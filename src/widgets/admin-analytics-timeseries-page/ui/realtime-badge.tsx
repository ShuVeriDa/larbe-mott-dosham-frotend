"use client";

import { useAdminAnalyticsRealtime } from "@/features/admin-analytics";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface RealtimeBadgeProps {
	label: string;
	tooltip: string;
}

export const RealtimeBadge: FC<RealtimeBadgeProps> = ({ label, tooltip }) => {
	const realtimeQuery = useAdminAnalyticsRealtime();

	if (realtimeQuery.isError) return null;

	const count = realtimeQuery.data?.count;
	const display =
		count === undefined || realtimeQuery.isLoading ? "—" : String(count);

	return (
		<div
			title={tooltip}
			aria-live="polite"
			className={cn(
				"inline-flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap",
				"bg-[var(--success-dim)] border border-[var(--success)] text-[var(--success)]",
				"text-sm font-semibold",
			)}
		>
			<span className="relative w-2 h-2 rounded-full bg-[var(--success)]">
				<span
					className={cn(
						"absolute -inset-1 rounded-full bg-[var(--success)] opacity-50",
						"motion-safe:animate-ping",
					)}
					aria-hidden="true"
				/>
			</span>
			<span>
				<span className="tabular-nums">{display}</span> {label}
			</span>
		</div>
	);
};
