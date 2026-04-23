"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface AdminSuggestionsEmptyProps {
	dict: Dictionary["adminSuggestions"]["empty"];
}

export const AdminSuggestionsEmpty: FC<AdminSuggestionsEmptyProps> = ({
	dict,
}) => (
	<div className="text-center py-16 px-6 bg-surface border border-border rounded-xl">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto text-base text-muted-foreground">
			{dict.text}
		</p>
	</div>
);

interface AdminSuggestionsNoResultsProps {
	dict: Dictionary["adminSuggestions"]["noResults"];
	onReset: () => void;
}

export const AdminSuggestionsNoResults: FC<AdminSuggestionsNoResultsProps> = ({
	dict,
	onReset,
}) => (
	<div className="text-center py-12 px-6 bg-surface border border-border rounded-xl">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted-foreground">
			{dict.text}
		</p>
		<Button variant="outline" size="sm" onClick={onReset}>
			{dict.reset}
		</Button>
	</div>
);
