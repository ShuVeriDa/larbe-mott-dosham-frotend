import type { ReviewDecision, Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { AdminSuggestionCard } from "./admin-suggestion-card";

interface AdminSuggestionsListProps {
	items: Suggestion[];
	dict: Dictionary["adminSuggestions"]["card"];
	groupsDict: Dictionary["history"]["groups"];
	lang: Locale;
	canReview: boolean;
	onReview: (suggestion: Suggestion, decision: ReviewDecision) => void;
	isFetching?: boolean;
}

export const AdminSuggestionsList: FC<AdminSuggestionsListProps> = ({
	items,
	dict,
	groupsDict,
	lang,
	canReview,
	onReview,
	isFetching,
}) => (
	<div
		className={cn(
			"flex flex-col gap-3 transition-opacity",
			isFetching && "opacity-60",
		)}
	>
		{items.map((suggestion) => (
			<AdminSuggestionCard
				key={suggestion.id}
				suggestion={suggestion}
				dict={dict}
				groupsDict={groupsDict}
				lang={lang}
				canReview={canReview}
				onReview={onReview}
			/>
		))}
	</div>
);
