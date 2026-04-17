import { FC } from "react";
import { ExploreChip } from "./explore-chip";

interface IExploreChipsItem {
	word: string;
	hint: string;
}

interface IExploreChipsProps {
	items: readonly IExploreChipsItem[];
	lang: string;
}

export const ExploreChips: FC<IExploreChipsProps> = ({ items, lang }) => (
	<ul className="flex flex-wrap gap-2 list-none p-0 m-0">
		{items.map(({ word, hint }) => (
			<li key={word}>
				<ExploreChip word={word} hint={hint} lang={lang} />
			</li>
		))}
	</ul>
);
