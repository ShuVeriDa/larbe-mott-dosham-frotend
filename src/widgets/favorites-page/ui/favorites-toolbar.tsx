"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Input } from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import { type ChangeEvent, type FC, useId } from "react";
import type {
	FavoritesLevelFilter,
	FavoritesSortMode,
} from "../model/use-favorites-page";

interface FavoritesToolbarProps {
	dict: Dictionary["favoritesPage"]["toolbar"];
	searchQuery: string;
	onSearchChange: (value: string) => void;
	levelFilter: FavoritesLevelFilter;
	onLevelFilterChange: (filter: FavoritesLevelFilter) => void;
	sortMode: FavoritesSortMode;
	onSortModeChange: (mode: FavoritesSortMode) => void;
	disabled?: boolean;
}

const LEVEL_FILTERS: {
	value: FavoritesLevelFilter;
	labelKey: keyof Pick<
		Dictionary["favoritesPage"]["toolbar"],
		"filterAll" | "filterA" | "filterB" | "filterC"
	>;
}[] = [
	{ value: "all", labelKey: "filterAll" },
	{ value: "A", labelKey: "filterA" },
	{ value: "B", labelKey: "filterB" },
	{ value: "C", labelKey: "filterC" },
];

export const FavoritesToolbar: FC<FavoritesToolbarProps> = ({
	dict,
	searchQuery,
	onSearchChange,
	levelFilter,
	onLevelFilterChange,
	sortMode,
	onSortModeChange,
	disabled,
}) => {
	const searchId = useId();
	const sortId = useId();

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
		onSearchChange(e.target.value);

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) =>
		onSortModeChange(e.target.value as FavoritesSortMode);

	return (
		<div className="flex flex-col gap-3 mb-5 sm:flex-row sm:flex-wrap sm:items-center">
			<div className="relative flex-1 min-w-0 sm:max-w-[400px]">
				<SearchIcon
					className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none size-4"
					aria-hidden
				/>
				<label htmlFor={searchId} className="sr-only">
					{dict.searchAriaLabel}
				</label>
				<Input
					id={searchId}
					type="search"
					value={searchQuery}
					onChange={handleSearchChange}
					placeholder={dict.searchPlaceholder}
					aria-label={dict.searchAriaLabel}
					disabled={disabled}
					className="h-[38px] pl-11 text-sm"
				/>
			</div>

			<div
				role="radiogroup"
				aria-label={dict.filtersLabel}
				className="flex flex-wrap items-center gap-2"
			>
				{LEVEL_FILTERS.map(({ value, labelKey }) => {
					const isActive = levelFilter === value;
					return (
						<button
							key={value}
							type="button"
							role="radio"
							aria-checked={isActive}
							disabled={disabled}
							onClick={() => onLevelFilterChange(value)}
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
					value={sortMode}
					onChange={handleSortChange}
					disabled={disabled}
					className={cn(
						"appearance-none py-2 pl-3 pr-8 rounded-sm border border-edge bg-surface",
						"text-xs text-foreground cursor-pointer outline-none",
						"bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%3E%3Cpath%20d%3D%22M3%204.5%206%207.5%209%204.5%22/%3E%3C/svg%3E')]",
						"bg-no-repeat bg-[right_8px_center]",
						"disabled:opacity-60 disabled:cursor-not-allowed",
					)}
				>
					<option value="date-desc">{dict.sortNewest}</option>
					<option value="date-asc">{dict.sortOldest}</option>
					<option value="alpha">{dict.sortAlpha}</option>
				</select>
			</div>
		</div>
	);
};
