"use client";

import type { AnalyticsTopCountryItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { countryName, isoToFlag } from "../lib/country";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";

interface WorldChoroplethProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["map"];
	lang: Locale;
	items: AnalyticsTopCountryItem[];
	loading?: boolean;
}

export const WorldChoropleth: FC<WorldChoroplethProps> = ({
	dict,
	lang,
	items,
	loading,
}) => {
	const top = items.slice(0, 8);
	const total = items.reduce((acc, i) => acc + i.count, 0);

	return (
		<section
			aria-label={dict.title}
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6",
				"relative overflow-hidden",
			)}
			style={{ aspectRatio: "16 / 9", minHeight: 320 }}
		>
			<div className="text-base font-semibold text-[var(--text)] mb-3">
				{dict.title}
			</div>
			<div
				aria-hidden="true"
				className={cn(
					"absolute inset-0 -z-0 m-5 rounded-md",
					"bg-[var(--bg-raised)] border border-dashed border-[var(--border)]",
					"flex items-center justify-center",
				)}
			>
				<span className="text-7xl opacity-15" aria-hidden="true">
					🗺️
				</span>
			</div>
			<ul
				className={cn(
					"relative z-[1] mt-3 grid gap-2",
					"grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				)}
			>
				{loading
					? Array.from({ length: 8 }).map((_, i) => (
							<li
								key={i}
								className={cn(
									"h-9 rounded-md animate-pulse",
									"bg-[var(--surface-active)]",
								)}
							/>
						))
					: top.map((item) => {
							const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
							const name = countryName(item.key, lang);
							return (
								<li
									key={item.key}
									title={`${name}: ${dict.tooltipVisits.replace(
										"{count}",
										formatNumber(item.count, lang),
									)} (${pct}%)`}
									aria-label={`${name}: ${dict.tooltipVisits.replace(
										"{count}",
										formatNumber(item.count, lang),
									)}`}
									className={cn(
										"flex items-center gap-2 px-3 h-9 rounded-md",
										"bg-[var(--surface-active)] border border-[var(--border)]",
										"text-xs",
									)}
								>
									<span aria-hidden="true">{isoToFlag(item.key)}</span>
									<span className="truncate text-[var(--text)] font-medium">
										{name}
									</span>
									<span className="ml-auto tabular-nums text-[var(--text-muted)]">
										{pct}%
									</span>
								</li>
							);
						})}
			</ul>
		</section>
	);
};
