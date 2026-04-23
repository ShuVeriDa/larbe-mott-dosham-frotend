"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Input } from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import { type ChangeEvent, type FC, useId } from "react";
import type {
	SuggestionSort,
	SuggestionStatusFilter,
} from "../model/use-suggestions-page";

interface SuggestionsToolbarProps {
	dict: Dictionary["suggestions"]["toolbar"];
	searchQuery: string;
	onSearchChange: (value: string) => void;
	statusFilter: SuggestionStatusFilter;
	onStatusFilterChange: (filter: SuggestionStatusFilter) => void;
	sort: SuggestionSort;
	onSortChange: (sort: SuggestionSort) => void;
	disabled?: boolean;
}

const FILTERS: {
	value: SuggestionStatusFilter;
	labelKey: keyof Pick<
		Dictionary["suggestions"]["toolbar"],
		"filterAll" | "filterPending" | "filterApproved" | "filterRejected"
	>;
}[] = [
	{ value: "all", labelKey: "filterAll" },
	{ value: "pending", labelKey: "filterPending" },
	{ value: "approved", labelKey: "filterApproved" },
	{ value: "rejected", labelKey: "filterRejected" },
];

export const SuggestionsToolbar: FC<SuggestionsToolbarProps> = ({
	dict,
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	sort,
	onSortChange,
	disabled,
}) => {
	const inputId = useId();
	const sortId = useId();

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
		onSearchChange(e.target.value);

	const handleSort = (e: ChangeEvent<HTMLSelectElement>) =>
		onSortChange(e.target.value as SuggestionSort);

	return (
		<div className="flex flex-col gap-3 mb-5 sm:flex-row sm:flex-wrap sm:items-center">
			<div className="relative flex-1 min-w-0 sm:max-w-[400px]">
				<SearchIcon
					className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none size-4"
					aria-hidden
				/>
				<label htmlFor={inputId} className="sr-only">
					{dict.searchAriaLabel}
				</label>
				<Input
					id={inputId}
					type="search"
					value={searchQuery}
					onChange={handleSearch}
					placeholder={dict.searchPlaceholder}
					aria-label={dict.searchAriaLabel}
					disabled={disabled}
					className="h-[38px] pl-11 text-sm"
				/>
			</div>

			<div
				role="radiogroup"
				aria-label={dict.filterLabel}
				className="flex flex-wrap items-center gap-2"
			>
				{FILTERS.map(({ value, labelKey }) => {
					const isActive = statusFilter === value;
					return (
						<button
							key={value}
							type="button"
							role="radio"
							aria-checked={isActive}
							disabled={disabled}
							onClick={() => onStatusFilterChange(value)}
							className={cn(
								"inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-normal select-none transition-colors duration-150 cursor-pointer",
								"disabled:opacity-60 disabled:cursor-not-allowed",
								isActive
									? "border-primary text-primary bg-primary-dim"
									: "border-edge text-muted hover:border-edge-hover hover:text-subtle bg-transparent",
							)}
						>
							{dict[labelKey]}
						</button>
					);
				})}
			</div>

			<div className="flex items-center gap-2 sm:ml-auto">
				<label
					htmlFor={sortId}
					className="text-xs text-muted whitespace-nowrap"
				>
					{dict.sortLabel}
				</label>
				<select
					id={sortId}
					value={sort}
					onChange={handleSort}
					disabled={disabled}
					className={cn(
						"appearance-none cursor-pointer outline-none",
						"py-1.5 pl-3 pr-8 rounded-sm border border-edge bg-surface text-foreground text-xs",
						"focus:border-primary focus:shadow-focus",
						"disabled:opacity-60 disabled:cursor-not-allowed",
						"bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%3E%3Cpath%20d%3D%22M3%204.5%206%207.5%209%204.5%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_8px_center]",
					)}
				>
					<option value="date-desc">{dict.sortNewest}</option>
					<option value="date-asc">{dict.sortOldest}</option>
				</select>
			</div>
		</div>
	);
};
