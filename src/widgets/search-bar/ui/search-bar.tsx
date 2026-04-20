"use client";

import { usePosValues, useSourcesValues } from "@/entities/dictionary";
import {
	ActiveFilters,
	buildSearchParams,
	EMPTY_FILTERS,
	ExactToggle,
	FilterBar,
	useFilterGroups,
	useSearchFilters,
	useSearchSubmit,
	useSearchUrlState,
} from "@/features/search";
import type { Dictionary } from "@/i18n/dictionaries";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SearchHints } from "./search-hints";
import { SearchInput } from "./search-input";

interface SearchBarProps {
	search: Dictionary["search"];
	lang: string;
	/** When true, the bar syncs its filters from the URL and includes ActiveFilters. */
	syncWithUrl?: boolean;
	/** Hide the search hints row (used in results state). */
	hideHints?: boolean;
}

export const SearchBar = ({
	search,
	lang,
	syncWithUrl = false,
	hideHints = false,
}: SearchBarProps) => {
	const urlState = useSearchUrlState();

	const { posValues } = usePosValues();
	const { sources } = useSourcesValues();

	const groups = useFilterGroups(
		search.filters,
		posValues ?? undefined,
		sources,
	);

	const {
		filters,
		setFilters,
		openFilter,
		filtersRef,
		activeFilters,
		toggleFilter,
		selectOption,
		removeFilter,
		clearAll,
	} = useSearchFilters({
		initial: syncWithUrl ? urlState.filters : undefined,
		groups,
		filtersDict: search.filters,
	});

	// Exact-mode flag is the URL's single source of truth when syncWithUrl.
	// On the landing page (no URL sync) we keep a small local state so the
	// value is preserved while the user crafts their query.
	const [localExact, setLocalExact] = useState(false);
	const exact = syncWithUrl ? urlState.exact : localExact;

	// Keep the editable filter state aligned with browser back/forward.
	useEffect(() => {
		if (!syncWithUrl) return;
		setFilters(urlState.filters);
	}, [syncWithUrl, urlState.filters, setFilters]);

	const { inputRef, submit, handleKeyDown } = useSearchSubmit({
		filters,
		sort: urlState.sort,
		exact,
		initialQuery: urlState.q,
	});

	const pathname = usePathname();
	const params = useParams<{ lang: string }>();
	const router = useRouter();
	const isSearchPage = pathname === `/${lang}/search`;
	const isLandingPage = pathname === `/${lang}`;

	const handleClear = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = "";
			inputRef.current.focus();
		}
		// On the results page also drop `?q=...` and all filters from the URL,
		// so the page returns to its initial (hero + explore) state.
		if (syncWithUrl && urlState.q) {
			setFilters(EMPTY_FILTERS);
			router.push(`/${params.lang}/search`);
		} else {
			setLocalExact(false);
		}
	}, [inputRef, syncWithUrl, urlState.q, router, params.lang, setFilters]);

	const handleExactToggle = useCallback(() => {
		const next = !exact;
		// On /search with an active query we push the new flag straight into the URL
		// so the results refresh and the URL stays shareable. Otherwise we keep a
		// local mirror that `useSearchSubmit` will serialise on the next submit.
		if (syncWithUrl && urlState.q) {
			const urlParams = buildSearchParams({
				q: urlState.q,
				filters,
				sort: urlState.sort,
				exact: next,
				page: 1,
			});
			router.push(`/${params.lang}/search?${urlParams.toString()}`);
		} else {
			setLocalExact(next);
		}
	}, [
		exact,
		syncWithUrl,
		urlState.q,
		urlState.sort,
		filters,
		router,
		params.lang,
	]);

	const hintWords = search.hints.words;

	return (
		<>
			<SearchInput
				ref={inputRef}
				onSubmit={submit}
				onKeyDown={handleKeyDown}
				onClear={handleClear}
				clearLabel={search.clear}
				placeholder={search.placeholder}
				buttonText={search.button}
				isSearchPage={isSearchPage}
				isLandingPage={isLandingPage}
				defaultValue={syncWithUrl ? urlState.q : ""}
			/>

			<FilterBar
				ref={filtersRef}
				groups={groups}
				filters={filters}
				openFilter={openFilter}
				onToggle={toggleFilter}
				onSelect={selectOption}
				trailing={
					<ExactToggle
						active={exact}
						label={search.exact.label}
						hint={search.exact.hint}
						onToggle={handleExactToggle}
					/>
				}
			/>

			{syncWithUrl && (
				<ActiveFilters
					activeFilters={activeFilters}
					clearAllLabel={search.filters.clearAll}
					removeLabel={search.filters.removeFilter}
					onRemove={removeFilter}
					onClearAll={clearAll}
				/>
			)}

			{!hideHints && (
				<SearchHints
					label={search.hints.label}
					words={hintWords}
					lang={lang}
				/>
			)}
		</>
	);
};
