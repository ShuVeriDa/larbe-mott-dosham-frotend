"use client";

import type { SortOrder } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ChangeEvent, FC } from "react";

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
];

export const ResultsMeta: FC<ResultsMetaProps> = ({
	total,
	query,
	sort,
	onSortChange,
	dict,
}) => {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onSortChange(e.target.value as SortOrder);
	};

	return (
		<div className="flex items-center justify-between flex-wrap gap-3 mb-5">
			<div className="text-sm text-muted">
				{dict.foundPrefix}{" "}
				<strong className="text-foreground font-semibold">{total}</strong>{" "}
				{dict.foundSuffix} «
				<strong className="text-foreground font-semibold">{query}</strong>»
			</div>
			<label className="flex items-center gap-2">
				<span className="text-xs text-faint">{dict.sortLabel}</span>
				<select
					value={sort}
					onChange={handleChange}
					className="appearance-none px-3 pr-6 py-1 border border-edge rounded-sm text-xs bg-surface text-subtle outline-none cursor-pointer font-body"
				>
					{SORT_OPTIONS.map(opt => (
						<option key={opt} value={opt}>
							{dict.sort[opt as keyof typeof dict.sort] ?? opt}
						</option>
					))}
				</select>
			</label>
		</div>
	);
};
