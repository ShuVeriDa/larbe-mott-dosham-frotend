"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface SuggestionsNoResultsProps {
	dict: Dictionary["suggestions"]["noResults"];
	onReset: () => void;
}

export const SuggestionsNoResults: FC<SuggestionsNoResultsProps> = ({
	dict,
	onReset,
}) => (
	<div className="text-center py-16 px-6">
		<div className="text-5xl mb-4 opacity-40" aria-hidden>
			{dict.icon}
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
