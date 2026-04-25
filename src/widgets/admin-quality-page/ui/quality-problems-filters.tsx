"use client";

import type {
	QualityProblemType,
	QualitySourceStat,
	QualityStats,
} from "@/features/admin-quality";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import { FilterChips, type FilterChipOption } from "@/shared/ui/admin";
import type { ChangeEvent, FC } from "react";


const ALL = "__all__";

interface QualityProblemsFiltersProps {
	type: QualityProblemType | "";
	onTypeChange: (type: QualityProblemType | "") => void;
	search: string;
	onSearchChange: (value: string) => void;
	source: string;
	onSourceChange: (value: string) => void;
	sources?: QualitySourceStat[];
	stats?: QualityStats;
	dict: Dictionary["admin"]["quality"]["problems"];
}

export const QualityProblemsFilters: FC<QualityProblemsFiltersProps> = ({
	type,
	onTypeChange,
	search,
	onSearchChange,
	source,
	onSourceChange,
	sources,
	stats,
	dict,
}) => {
	const options: FilterChipOption<QualityProblemType | "">[] = [
		{
			value: "",
			label: dict.filters.all,
			count: stats?.problemsUnique,
		},
		{
			value: "no-meanings",
			label: dict.filters.noMeanings,
			count: stats?.noMeanings,
		},
		{
			value: "no-class",
			label: dict.filters.noClass,
			count: stats?.nounsWithoutClass,
		},
		{
			value: "no-pos",
			label: dict.filters.noPos,
			count: stats?.noPartOfSpeech,
		},
		{
			value: "no-examples",
			label: dict.filters.noExamples,
			count: stats?.noExamples,
		},
	];

	return (
		<div className="flex items-center gap-3 mb-4 flex-wrap">
			<FilterChips
				options={options}
				value={type}
				onChange={(v) => onTypeChange(v as QualityProblemType | "")}
			/>
			<div className="flex gap-3 items-center ml-auto">
				<div className="relative">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="search"
						value={search}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							onSearchChange(e.target.value)
						}
						placeholder={dict.searchPlaceholder}
						aria-label={dict.searchPlaceholder}
						className="pl-9 pr-3 py-2 border border-[var(--border)] rounded-xl text-sm bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)] w-[200px]"
					/>
				</div>
				<Select
					value={source === "" ? ALL : source}
					onValueChange={(value) => onSourceChange(value === ALL ? "" : value)}
				>
					<SelectTrigger className="h-[38px] min-w-[160px]" aria-label={dict.sourceAll}>
						<SelectValue placeholder={dict.sourceAll} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.sourceAll}</SelectItem>
						{sources?.map((s) => (
							<SelectItem key={s.source} value={s.source}>
								{s.source}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
