"use client";

import type { SortOrder } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";

type ResultsDict = Dictionary["search"]["results"];

interface ResultsMetaProps {
	total: number;
	query: string;
	sort: SortOrder;
	onSortChange: (sort: SortOrder) => void;
	dict: ResultsDict;
}

const SORT_OPTIONS: readonly SortOrder[] = [
	"relevance",
	"asc",
	"desc",
	"updatedAt_desc",
	"updatedAt_asc",
	"createdAt_desc",
	"meaningsCount_desc",
];

export const ResultsMeta: FC<ResultsMetaProps> = ({
	total,
	query,
	sort,
	onSortChange,
	dict,
}) => {
	return (
		<div className="flex items-center justify-between flex-wrap gap-3 mb-5">
			<div className="text-sm text-muted">
				{dict.foundPrefix}{" "}
				<strong className="text-foreground font-semibold">{total}</strong>{" "}
				{dict.foundSuffix} «
				<strong className="text-foreground font-semibold">{query}</strong>»
			</div>
			<div className="flex items-center gap-2">
				<span className="text-xs text-faint">{dict.sortLabel}</span>
				<Select
					value={sort}
					onValueChange={value => onSortChange(value as SortOrder)}
				>
					<SelectTrigger
						size="sm"
						aria-label={dict.sortLabel}
						className="text-xs"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map(opt => (
							<SelectItem key={opt} value={opt}>
								{dict.sort[opt as keyof typeof dict.sort] ?? opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
