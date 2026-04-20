import { EntryCard, type EntryCardLabels } from "@/entities/dictionary";
import type { DictionarySearchResult } from "@/entities/dictionary";
import { FavoriteButton } from "@/features/favorites";
import type { FC } from "react";

interface ResultsListProps {
	entries: readonly DictionarySearchResult[];
	query: string;
	lang: string;
	labels: EntryCardLabels;
	favoriteLabel: string;
}

export const ResultsList: FC<ResultsListProps> = ({
	entries,
	query,
	lang,
	labels,
	favoriteLabel,
}) => (
	<div className="flex flex-col gap-3">
		{entries.map(entry => (
			<EntryCard
				key={entry.id}
				entry={entry}
				query={query}
				lang={lang}
				labels={labels}
				trailing={
					<FavoriteButton entryId={entry.id} label={favoriteLabel} />
				}
			/>
		))}
	</div>
);
