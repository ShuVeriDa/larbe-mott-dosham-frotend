import type { AdminUserDetailedStats } from "@/features/admin-users";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";
import { formatNumber } from "../lib/format";

interface StatsCardProps {
	stats: AdminUserDetailedStats | undefined;
	isLoading: boolean;
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["stats"];
}

interface StatRowProps {
	label: string;
	children: ReactNode;
	success?: boolean;
}

const StatRow: FC<StatRowProps> = ({ label, children, success }) => (
	<div className="flex justify-between items-center py-3 border-b border-border last:border-b-0 gap-4">
		<span className="text-xs text-muted-foreground font-medium">{label}</span>
		<span
			className={cn(
				"text-sm font-medium tabular-nums",
				success
					? "text-emerald-600 dark:text-emerald-400"
					: "text-foreground",
			)}
		>
			{children}
		</span>
	</div>
);

export const StatsCard: FC<StatsCardProps> = ({
	stats,
	isLoading,
	lang,
	dict,
}) => {
	const show = (value: number | undefined) =>
		isLoading || value === undefined ? "—" : formatNumber(value, lang);
	return (
		<section className="rounded-lg border border-border bg-surface overflow-hidden mb-6">
			<div className="px-5 py-4 border-b border-border">
				<h2 className="text-sm font-semibold text-foreground">{dict.title}</h2>
			</div>
			<div className="px-5 py-2">
				<StatRow label={dict.favorites}>{show(stats?.favoritesCount)}</StatRow>
				<StatRow label={dict.suggestionsTotal}>
					{show(stats?.suggestionsTotal)}
				</StatRow>
				<StatRow label={dict.suggestionsApproved} success>
					{show(stats?.suggestionsApproved)}
				</StatRow>
				<StatRow label={dict.entriesEdited}>
					{show(stats?.entriesEdited)}
				</StatRow>
				<StatRow label={dict.searchCount}>{show(stats?.searchCount)}</StatRow>
				<StatRow label={dict.activeDaysStreak}>
					{stats?.activeDaysStreak !== undefined
						? `${formatNumber(stats.activeDaysStreak, lang)} 🔥`
						: "—"}
				</StatRow>
			</div>
		</section>
	);
};
