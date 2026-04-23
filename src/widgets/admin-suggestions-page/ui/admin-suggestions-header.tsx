import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface AdminSuggestionsHeaderProps {
	dict: Dictionary["adminSuggestions"]["header"];
}

export const AdminSuggestionsHeader: FC<AdminSuggestionsHeaderProps> = ({
	dict,
}) => (
	<header className="mb-6">
		<h1 className="text-2xl font-bold tracking-tight text-foreground">
			{dict.title}
		</h1>
		<p className="mt-1 max-w-xl text-base text-muted-foreground">
			{dict.subtitle}
		</p>
	</header>
);
