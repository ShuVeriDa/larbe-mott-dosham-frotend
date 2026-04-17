"use client";

import { usePopularQueries } from "@/entities/dictionary";
import { Dictionary } from "@/i18n/dictionaries";
import { FC, useMemo } from "react";
import { ExploreChips } from "./explore-chips";

interface IExploreSectionProps {
	popularWords: Dictionary["popularWords"];
	lang: string;
}

export const ExploreSection: FC<IExploreSectionProps> = ({
	popularWords,
	lang,
}) => {
	const { popular } = usePopularQueries();

	const items = useMemo(
		() =>
			(popular ?? [])
				.filter(p => p.meaning)
				.map(p => ({ word: p.query, hint: p.meaning as string })),
		[popular],
	);

	if (items.length === 0) return null;

	return (
		<section
			aria-labelledby="explore-section-heading"
			className="relative mt-16 z-1"
		>
			<h2
				id="explore-section-heading"
				className="flex items-center gap-2 mb-4 text-xs font-medium uppercase tracking-[0.08em] text-faint before:content-[''] before:block before:w-[14px] before:h-px before:bg-faint"
			>
				{popularWords.label}
			</h2>
			<ExploreChips items={items} lang={lang} />
		</section>
	);
};
