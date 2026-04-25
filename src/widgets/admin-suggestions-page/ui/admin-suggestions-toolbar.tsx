"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import { type ChangeEvent, type FC, useId } from "react";
import type {
	AdminSuggestionSort,
	AdminSuggestionStatusFilter,
} from "../model/use-admin-suggestions-page";

interface AdminSuggestionsToolbarProps {
	dict: Dictionary["adminSuggestions"]["toolbar"];
	searchValue: string;
	onSearchChange: (value: string) => void;
	statusFilter: AdminSuggestionStatusFilter;
	onStatusFilterChange: (value: AdminSuggestionStatusFilter) => void;
	sort: AdminSuggestionSort;
	onSortChange: (value: AdminSuggestionSort) => void;
	disabled?: boolean;
}

const FILTERS: {
	value: AdminSuggestionStatusFilter;
	labelKey: keyof Pick<
		Dictionary["adminSuggestions"]["toolbar"],
		"filterAll" | "filterPending" | "filterApproved" | "filterRejected"
	>;
}[] = [
	{ value: "all", labelKey: "filterAll" },
	{ value: "pending", labelKey: "filterPending" },
	{ value: "approved", labelKey: "filterApproved" },
	{ value: "rejected", labelKey: "filterRejected" },
];

export const AdminSuggestionsToolbar: FC<AdminSuggestionsToolbarProps> = ({
	dict,
	searchValue,
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
					value={searchValue}
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
				<Select
					value={sort}
					onValueChange={(value) => onSortChange(value as AdminSuggestionSort)}
					disabled={disabled}
				>
					<SelectTrigger
						id={sortId}
						size="sm"
						aria-label={dict.sortLabel}
						className="text-xs"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="date-desc">{dict.sortNewest}</SelectItem>
						<SelectItem value="date-asc">{dict.sortOldest}</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
