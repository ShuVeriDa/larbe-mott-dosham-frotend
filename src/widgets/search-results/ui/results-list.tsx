import { EntryCard, type EntryCardLabels } from "@/entities/dictionary";
import type { DictionarySearchResult } from "@/entities/dictionary";
import { FavoriteButton } from "@/features/favorites";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface ResultsListProps {
	entries: readonly DictionarySearchResult[];
	query: string;
	lang: string;
	labels: EntryCardLabels;
	favoriteLabel: string;
	compact?: boolean;
}

export const ResultsList: FC<ResultsListProps> = ({
	entries,
	query,
	lang,
	labels,
	favoriteLabel,
	compact = false,
}) => (
	<div className={cn("flex flex-col", compact ? "gap-1.5" : "gap-3")}>
		{entries.map(entry => (
			<EntryCard
				key={entry.id}
				entry={entry}
				query={query}
				lang={lang}
				labels={labels}
				compact={compact}
				trailing={
					<FavoriteButton entryId={entry.id} label={favoriteLabel} />
				}
			/>
		))}
	</div>
);
