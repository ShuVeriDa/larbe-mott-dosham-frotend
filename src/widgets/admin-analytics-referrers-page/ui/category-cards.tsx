"use client";

import type {
	AnalyticsReferrerCategory,
	AnalyticsReferrersBreakdown,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";
import type { FC } from "react";
import {
	CATEGORY_CARDS,
	formatShare,
	interpolate,
	type ReferrerCategoryFilter,
} from "../lib/categorize";
import { CategoryCard } from "./category-card";

interface CategoryCardsProps {
	dict: Dictionary["admin"]["analytics"]["referrers"]["categories"];
	lang: Locale;
	breakdown?: AnalyticsReferrersBreakdown;
	activeCategory: ReferrerCategoryFilter;
	onSelect: (next: ReferrerCategoryFilter) => void;
	loading?: boolean;
}

const NO_VALUE = "—";

export const CategoryCards: FC<CategoryCardsProps> = ({
	dict,
	lang,
	breakdown,
	activeCategory,
	onSelect,
	loading,
}) => (
	<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
		{CATEGORY_CARDS.map((cat) => {
			if (cat === "all") {
				const total = breakdown?.total;
				const uniqueHosts = breakdown?.uniqueHosts;
				return (
					<CategoryCard
						key={cat}
						category={cat}
						label={dict.all.label}
						value={total === undefined ? NO_VALUE : formatNumber(total, lang)}
						share="100%"
						sub={
							uniqueHosts === undefined
								? undefined
								: interpolate(dict.all.sub, {
										count: formatNumber(uniqueHosts, lang),
									})
						}
						active={activeCategory === cat}
						onSelect={onSelect}
						loading={loading}
					/>
				);
			}

			const stats = breakdown?.byCategory?.[cat as AnalyticsReferrerCategory];
			const sample = stats?.sampleHosts.slice(0, 3).join(", ");
			const sub =
				sample && sample.length > 0
					? sample
					: dict[cat as AnalyticsReferrerCategory].emptySub;
			return (
				<CategoryCard
					key={cat}
					category={cat}
					label={dict[cat as AnalyticsReferrerCategory].label}
					value={
						stats === undefined ? NO_VALUE : formatNumber(stats.count, lang)
					}
					share={stats === undefined ? NO_VALUE : formatShare(stats.share)}
					sub={sub}
					active={activeCategory === cat}
					onSelect={onSelect}
					loading={loading}
				/>
			);
		})}
	</div>
);
