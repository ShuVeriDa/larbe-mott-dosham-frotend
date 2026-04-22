import type { FC } from "react";
import { PhraseologyExploreChip } from "./phraseology-explore-chip";

interface PhraseologyExploreChipsItem {
	expression: string;
	meaning?: string | null;
}

interface PhraseologyExploreChipsProps {
	items: readonly PhraseologyExploreChipsItem[];
	lang: string;
}

export const PhraseologyExploreChips: FC<PhraseologyExploreChipsProps> = ({
	items,
	lang,
}) => (
	<ul className="flex flex-wrap gap-2 list-none p-0 m-0">
		{items.map(({ expression, meaning }) => (
			<li key={expression}>
				<PhraseologyExploreChip
					expression={expression}
					meaning={meaning}
					lang={lang}
				/>
			</li>
		))}
	</ul>
);
