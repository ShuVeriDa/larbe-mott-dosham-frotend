"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import { Trash2Icon } from "lucide-react";
import type { FC } from "react";
import { formatCount } from "../lib/format-count";

interface HistoryHeaderProps {
	dict: Dictionary["history"]["header"];
	lang: Locale;
	count: number;
	disabled: boolean;
	onClearAll: () => void;
}

export const HistoryHeader: FC<HistoryHeaderProps> = ({
	dict,
	lang,
	count,
	disabled,
	onClearAll,
}) => (
	<div className="flex flex-col items-start justify-between gap-3 mb-8 sm:flex-row sm:items-start sm:gap-4">
		<div>
			<h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
				{dict.title}
			</h1>
			<p className="text-base text-muted font-light">
				<span className="text-primary font-semibold">
					{formatCount(count, dict, lang)}
				</span>
			</p>
		</div>
		<Button
			variant="danger"
			size="sm"
			disabled={disabled}
			onClick={onClearAll}
		>
			<Trash2Icon />
			<span>{dict.clearAll}</span>
		</Button>
	</div>
);
