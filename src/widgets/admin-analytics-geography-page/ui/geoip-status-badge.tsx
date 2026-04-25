import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface GeoIpStatusBadgeProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["header"];
	configured: boolean | undefined;
	loading?: boolean;
}

export const GeoIpStatusBadge: FC<GeoIpStatusBadgeProps> = ({
	dict,
	configured,
	loading,
}) => {
	if (loading || configured === undefined) {
		return (
			<span
				className={cn(
					"inline-flex items-center gap-2 px-3 h-7 rounded-full text-xs font-semibold",
					"bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]",
				)}
			>
				…
			</span>
		);
	}

	const isOk = configured === true;
	const label = isOk ? dict.badgeConfigured : dict.badgeNotConfigured;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 px-3 h-7 rounded-full",
				"text-xs font-semibold uppercase tracking-wider",
				isOk
					? "bg-[var(--success-dim)] border border-[var(--success)] text-[var(--success)]"
					: "bg-[var(--warning-dim)] border border-[var(--warning)] text-[var(--warning)]",
			)}
		>
			{label}
		</span>
	);
};
