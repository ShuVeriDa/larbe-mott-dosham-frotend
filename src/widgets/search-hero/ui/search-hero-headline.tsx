"use client";

import { useDictionaryStats } from "@/entities/dictionary";
import { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";

interface ISearchHeroHeadlineProps {
	hero: Dictionary["search"]["hero"];
}

export const SearchHeroHeadline: FC<ISearchHeroHeadlineProps> = ({ hero }) => {
	const { stats } = useDictionaryStats();
	const total = stats?.total ?? 0;
	return (
		<>
			<Typography
				tag="h1"
				id="search-hero-heading"
				className="text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-2 font-extrabold tracking-[-0.04em]"
			>
				{hero.title}
			</Typography>
			<Typography tag="p" className="text-base text-muted font-light mb-10">
				{total} слов · {hero.subtitle}
			</Typography>
		</>
	);
};
