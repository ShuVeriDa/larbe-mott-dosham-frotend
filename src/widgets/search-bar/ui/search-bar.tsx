"use client";

import {
	ActiveFilters,
	FilterBar,
	useSearchFilters,
	useSearchSubmit,
} from "@/features/search";
import type { Dictionary } from "@/i18n/dictionaries";
import { SearchHints } from "./search-hints";
import { SearchInput } from "./search-input";

interface SearchBarProps {
	search: Dictionary["search"];
}

export const SearchBar = ({ search }: SearchBarProps) => {
	const {
		filters,
		openFilter,
		filtersRef,
		activeFilters,
		toggleFilter,
		selectOption,
		removeFilter,
		clearAll,
	} = useSearchFilters();

	const { inputRef, submit, handleKeyDown } = useSearchSubmit(filters);

	return (
		<>
			<SearchInput
				ref={inputRef}
				onSubmit={submit}
				onKeyDown={handleKeyDown}
				placeholder={search.placeholder}
				buttonText={search.button}
			/>

			<FilterBar
				ref={filtersRef}
				filters={filters}
				openFilter={openFilter}
				onToggle={toggleFilter}
				onSelect={selectOption}
			/>

			<ActiveFilters
				activeFilters={activeFilters}
				onRemove={removeFilter}
				onClearAll={clearAll}
			/>

			<SearchHints />

			<div
				className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-faint text-xs"
				aria-hidden="true"
			>
				<div className="scroll-cue-line" />
			</div>
		</>
	);
};
