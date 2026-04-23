"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Input } from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import { type ChangeEvent, type FC, useId } from "react";
import type { HistoryLangFilter } from "../model/use-history-page";

interface HistoryToolbarProps {
	dict: Dictionary["history"]["toolbar"];
	searchQuery: string;
	onSearchChange: (value: string) => void;
	langFilter: HistoryLangFilter;
	onLangFilterChange: (filter: HistoryLangFilter) => void;
	disabled?: boolean;
}

const FILTERS: {
	value: HistoryLangFilter;
	labelKey: keyof Pick<
		Dictionary["history"]["toolbar"],
		"filterAll" | "filterNah" | "filterRu"
	>;
}[] = [
	{ value: "all", labelKey: "filterAll" },
	{ value: "nah", labelKey: "filterNah" },
	{ value: "ru", labelKey: "filterRu" },
];

export const HistoryToolbar: FC<HistoryToolbarProps> = ({
	dict,
	searchQuery,
	onSearchChange,
	langFilter,
	onLangFilterChange,
	disabled,
}) => {
	const inputId = useId();
	const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
		onSearchChange(e.target.value);

	return (
		<div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:flex-wrap">
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
					onChange={handleChange}
					placeholder={dict.searchPlaceholder}
					aria-label={dict.searchAriaLabel}
					disabled={disabled}
					className="h-[38px] pl-11 text-sm"
				/>
			</div>

			<div
				role="radiogroup"
				aria-label={dict.searchAriaLabel}
				className="flex flex-wrap items-center gap-2"
			>
				{FILTERS.map(({ value, labelKey }) => {
					const isActive = langFilter === value;
					return (
						<button
							key={value}
							type="button"
							role="radio"
							aria-checked={isActive}
							disabled={disabled}
							onClick={() => onLangFilterChange(value)}
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
		</div>
	);
};
