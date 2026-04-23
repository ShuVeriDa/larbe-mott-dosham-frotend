"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface HistoryNoResultsProps {
	dict: Dictionary["history"]["noResults"];
	onReset: () => void;
}

export const HistoryNoResults: FC<HistoryNoResultsProps> = ({
	dict,
	onReset,
}) => (
	<div className="text-center py-12 px-6">
		<p className="text-base text-muted">{dict.text}</p>
		<Button variant="ghost" size="sm" onClick={onReset} className="mt-4">
			{dict.reset}
		</Button>
	</div>
);
