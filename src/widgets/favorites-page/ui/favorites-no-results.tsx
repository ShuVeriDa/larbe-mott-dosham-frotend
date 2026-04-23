"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import type { FC } from "react";

interface FavoritesNoResultsProps {
	dict: Dictionary["favoritesPage"]["noResults"];
	onReset: () => void;
}

export const FavoritesNoResults: FC<FavoritesNoResultsProps> = ({
	dict,
	onReset,
}) => (
	<div className="text-center py-12 px-6">
		<div
			className="inline-flex items-center justify-center size-12 rounded-full bg-surface text-muted mb-4"
			aria-hidden
		>
			<SearchIcon className="size-6" />
		</div>
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted">{dict.text}</p>
		<Button variant="secondary" size="md" onClick={onReset}>
			{dict.reset}
		</Button>
	</div>
);
