import { PhraseCard, type PhraseCardLabels } from "@/entities/dictionary";
import type { PhraseologyEntry } from "@/entities/dictionary";
import type { FC } from "react";

interface PhraseListProps {
	entries: readonly PhraseologyEntry[];
	query: string;
	labels: PhraseCardLabels;
}

export const PhraseList: FC<PhraseListProps> = ({ entries, query, labels }) => (
	<div className="flex flex-col gap-3">
		{entries.map(entry => (
			<PhraseCard
				key={entry.id}
				entry={entry}
				query={query}
				labels={labels}
			/>
		))}
	</div>
);
