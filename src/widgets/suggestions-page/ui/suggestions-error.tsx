"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface SuggestionsErrorProps {
	dict: Dictionary["suggestions"]["error"];
	onRetry: () => void;
}

export const SuggestionsError: FC<SuggestionsErrorProps> = ({
	dict,
	onRetry,
}) => (
	<div
		role="alert"
		className="text-center py-12 px-6 bg-raised border border-edge rounded-xl"
	>
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted">{dict.text}</p>
		<Button variant="outline" size="sm" onClick={onRetry}>
			{dict.retry}
		</Button>
	</div>
);
