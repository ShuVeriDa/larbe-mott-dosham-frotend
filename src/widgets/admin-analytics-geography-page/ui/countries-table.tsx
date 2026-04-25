"use client";

import type { AnalyticsTopCountryItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminEmptyState, AdminTableSkeleton } from "@/shared/ui/admin";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { countryName, isoToFlag } from "../lib/country";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";

interface CountriesTableProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["countries"];
	lang: Locale;
	items: AnalyticsTopCountryItem[];
	activeIso: string | null;
	onSelect: (iso: string | null) => void;
	loading?: boolean;
}

export const CountriesTable: FC<CountriesTableProps> = ({
	dict,
	lang,
	items,
	activeIso,
	onSelect,
	loading,
}) => {
	if (loading && items.length === 0) {
		return <AdminTableSkeleton rows={8} className="mb-6" />;
	}

	if (items.length === 0) {
		return (
			<AdminEmptyState
				icon="🗺️"
				title={dict.empty}
				className="mb-6"
			/>
		);
	}

	const max = items[0]?.count ?? 1;
	const total = items.reduce((acc, i) => acc + i.count, 0);

	return (
		<section
			aria-label={dict.title}
			className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6"
		>
			<h2 className="text-base font-semibold text-[var(--text)] mb-4">
				{dict.title}
			</h2>
			<ul className="flex flex-col gap-2">
				{items.map((item) => {
					const widthPct = Math.round((item.count / max) * 100);
					const sharePct = total > 0 ? (item.count / total) * 100 : 0;
					const isActive = activeIso === item.key.toUpperCase();
					const name = countryName(item.key, lang);
					return (
						<li key={item.key}>
							<button
								type="button"
								onClick={() => onSelect(isActive ? null : item.key)}
								aria-pressed={isActive}
								className={cn(
									"relative w-full overflow-hidden rounded-md text-left",
									"grid items-center gap-3 px-3 py-2",
									"grid-cols-[24px_minmax(0,1fr)_auto_auto]",
									"bg-[var(--bg-raised)] border transition-colors",
									isActive
										? "border-[var(--accent)]"
										: "border-[var(--border)] hover:border-[var(--border-hover)]",
								)}
							>
								<span
									aria-hidden="true"
									className={cn(
										"absolute inset-y-0 left-0 transition-all",
										isActive
											? "bg-[var(--accent-glow)]"
											: "bg-[var(--accent-dim)]",
									)}
									style={{ width: `${widthPct}%` }}
								/>
								<span
									className="relative z-[1] text-base"
									aria-label={dict.flagAlt.replace("{country}", name)}
								>
									{isoToFlag(item.key)}
								</span>
								<span className="relative z-[1] text-sm font-medium text-[var(--text)] truncate">
									{name}
								</span>
								<span className="relative z-[1] text-xs text-[var(--text-muted)] tabular-nums">
									{dict.shareLabel.replace(
										"{percent}",
										sharePct.toFixed(1),
									)}
								</span>
								<span className="relative z-[1] text-sm font-semibold text-[var(--text)] tabular-nums">
									{formatNumber(item.count, lang)}
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</section>
	);
};
