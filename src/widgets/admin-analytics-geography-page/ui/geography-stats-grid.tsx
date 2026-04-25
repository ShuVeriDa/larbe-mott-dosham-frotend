"use client";

import type { AnalyticsGeographyStats } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { StatCard } from "@/shared/ui/admin";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { countryName, isValidIso } from "../lib/country";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";

interface GeographyStatsGridProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["stats"];
	lang: Locale;
	data: AnalyticsGeographyStats | undefined;
	loading?: boolean;
}

const formatCoverage = (
	withCountry: number,
	total: number,
	coverageLabel: string,
): string => {
	if (total <= 0) return "—";
	const pct = Math.round((withCountry / total) * 100);
	return `${pct}% ${coverageLabel}`;
};

export const GeographyStatsGrid: FC<GeographyStatsGridProps> = ({
	dict,
	lang,
	data,
	loading,
}) => {
	const topCountryDisplay = data?.topCountry
		? isValidIso(data.topCountry)
			? countryName(data.topCountry, lang)
			: data.topCountry
		: "—";

	return (
		<section
			aria-label={dict.title}
			className={cn(
				"mb-6 grid gap-3",
				"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
			)}
		>
			<StatCard
				icon="📊"
				tone="info"
				label={dict.totalEvents}
				value={data ? formatNumber(data.totalEvents, lang) : "—"}
				loading={loading}
			/>
			<StatCard
				icon="🌍"
				tone="success"
				label={dict.eventsWithCountry}
				value={data ? formatNumber(data.eventsWithCountry, lang) : "—"}
				sub={
					data
						? formatCoverage(
								data.eventsWithCountry,
								data.totalEvents,
								dict.coverage,
							)
						: undefined
				}
				loading={loading}
			/>
			<StatCard
				icon="🏳"
				tone="total"
				label={dict.uniqueCountries}
				value={data ? formatNumber(data.uniqueCountries, lang) : "—"}
				sub={topCountryDisplay !== "—" ? `${dict.topCountry}: ${topCountryDisplay}` : undefined}
				loading={loading}
			/>
			<StatCard
				icon="🏙️"
				tone="warning"
				label={dict.uniqueCities}
				value={data ? formatNumber(data.uniqueCities, lang) : "—"}
				sub={data?.topCity ? `${dict.topCity}: ${data.topCity}` : undefined}
				loading={loading}
			/>
		</section>
	);
};
