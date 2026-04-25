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
				<Select
					value={sortMode}
					onValueChange={(value) =>
						onSortModeChange(value as FavoritesSortMode)
					}
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
						<SelectItem value="alpha">{dict.sortAlpha}</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
