import type { DictionaryStats } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { FC } from "react";
import { mapHeroItems } from "../model/map-hero-items";
import { HeroStatCard } from "./hero-stat-card";

interface IStatsHeroProps {
	stats: DictionaryStats;
	labels: Dictionary["stats"]["hero"];
}

export const StatsHero: FC<IStatsHeroProps> = ({ stats, labels }) => {
	const items = mapHeroItems(stats, labels);

	return (
		<section
			aria-label={labels.entries}
			className="max-w-[1020px] w-full mx-auto px-6 pb-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
		>
			{items.map(item => (
				<HeroStatCard
					key={item.key}
					label={item.label}
					value={item.value}
					highlight={item.highlight}
				/>
			))}
		</section>
	);
};
