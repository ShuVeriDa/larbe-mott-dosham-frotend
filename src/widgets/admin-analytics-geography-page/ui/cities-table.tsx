"use client";

import type { AnalyticsTopCityItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminEmptyState, AdminTableSkeleton } from "@/shared/ui/admin";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { countryName, isoToFlag, isValidIso } from "../lib/country";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";

interface CitiesTableProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["cities"];
	lang: Locale;
	items: AnalyticsTopCityItem[];
	activeCountry: string | null;
	onClearFilter: () => void;
	loading?: boolean;
}

export const CitiesTable: FC<CitiesTableProps> = ({
	dict,
	lang,
	items,
	activeCountry,
	onClearFilter,
	loading,
}) => {
	const filterTitle = activeCountry
		? `${dict.title} · ${
				isValidIso(activeCountry)
					? `${isoToFlag(activeCountry)} ${countryName(activeCountry, lang)}`
					: activeCountry
			}`
		: dict.title;

	return (
		<section
			aria-label={dict.title}
			className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6"
		>
			<header className="flex items-center justify-between gap-3 mb-4 flex-wrap">
				<h2 className="text-base font-semibold text-[var(--text)]">
					{filterTitle}
				</h2>
				{activeCountry ? (
					<button
						type="button"
						onClick={onClearFilter}
						className={cn(
							"inline-flex items-center gap-1 px-3 h-8 rounded-md",
							"bg-[var(--surface)] border border-[var(--border)]",
							"text-xs font-semibold text-[var(--text)]",
							"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors",
						)}
					>
						✕ {dict.clearFilter}
					</button>
				) : null}
			</header>

			{loading && items.length === 0 ? (
				<AdminTableSkeleton rows={6} />
			) : items.length === 0 ? (
				<AdminEmptyState icon="🏙️" title={dict.empty} />
			) : (
				<ul className="flex flex-col gap-2">
					{items.map((item, idx) => {
						const max = items[0]?.count ?? 1;
						const widthPct = Math.round((item.count / max) * 100);
						const country = item.country?.toUpperCase() ?? "";
						return (
							<li
								key={`${item.key}-${country}-${idx}`}
								className={cn(
									"relative overflow-hidden rounded-md",
									"grid items-center gap-3 px-3 py-2",
									"grid-cols-[24px_minmax(0,1fr)_auto]",
									"bg-[var(--bg-raised)] border border-[var(--border)]",
								)}
							>
								<span
									aria-hidden="true"
									className="absolute inset-y-0 left-0 bg-[var(--accent-dim)]"
									style={{ width: `${widthPct}%` }}
								/>
								<span
									className="relative z-[1] text-base"
									aria-hidden="true"
								>
									{isValidIso(country) ? isoToFlag(country) : "🏳"}
								</span>
								<span className="relative z-[1] text-sm font-medium text-[var(--text)] truncate">
									{item.key}
									{isValidIso(country) ? (
										<span className="ml-2 text-[var(--text-muted)] text-xs">
											· {countryName(country, lang)}
										</span>
									) : null}
								</span>
								<span className="relative z-[1] text-sm font-semibold text-[var(--text)] tabular-nums">
									{formatNumber(item.count, lang)}
								</span>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
};
