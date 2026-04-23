import type { Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { SuggestionCard } from "./suggestion-card";

interface SuggestionsListProps {
	items: Suggestion[];
	cardDict: Dictionary["suggestions"]["card"];
	groupsDict: Dictionary["history"]["groups"];
	lang: Locale;
}

export const SuggestionsList: FC<SuggestionsListProps> = ({
	items,
	cardDict,
	groupsDict,
	lang,
}) => (
	<ul className="flex flex-col gap-3 list-none p-0 m-0">
		{items.map(item => (
			<li key={item.id}>
				<SuggestionCard
					suggestion={item}
					dict={cardDict}
					groupsDict={groupsDict}
					lang={lang}
				/>
			</li>
		))}
	</ul>
);
