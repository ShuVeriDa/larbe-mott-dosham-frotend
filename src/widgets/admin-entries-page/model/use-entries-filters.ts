"use client";

import type {
	AdminEntriesPosFilter,
	AdminEntriesQuery,
	AdminEntriesSort,
} from "@/features/admin-entries";
import type { NounClass } from "@/entities/dictionary";
import type { WordLevel } from "@/shared/types";
import { useCallback, useState } from "react";

export interface EntriesFiltersState {
	q: string;
	pos: AdminEntriesPosFilter;
	source: string;
	cefr: WordLevel | "";
	nounClass: NounClass | "";
	entryType: "standard" | "neologism" | "";
	sort: AdminEntriesSort;
	page: number;
	limit: number;
}

const INITIAL_STATE: EntriesFiltersState = {
	q: "",
	pos: "",
	source: "",
	cefr: "",
	nounClass: "",
	entryType: "",
	sort: "relevance",
	page: 1,
	limit: 10,
};

export const useEntriesFilters = () => {
	const [state, setState] = useState<EntriesFiltersState>(INITIAL_STATE);

	const patch = useCallback(
		<K extends keyof EntriesFiltersState>(
			key: K,
			value: EntriesFiltersState[K],
		) => {
			setState((prev) => ({ ...prev, [key]: value, page: 1 }));
		},
		[],
	);

	const setQ = useCallback((q: string) => patch("q", q), [patch]);
	const setPos = useCallback(
		(pos: AdminEntriesPosFilter) => patch("pos", pos),
		[patch],
	);
	const setSource = useCallback(
		(source: string) => patch("source", source),
		[patch],
	);
	const setCefr = useCallback(
		(cefr: WordLevel | "") => patch("cefr", cefr),
		[patch],
	);
	const setNounClass = useCallback(
		(nounClass: NounClass | "") => patch("nounClass", nounClass),
		[patch],
	);
	const setEntryType = useCallback(
		(entryType: "standard" | "neologism" | "") => patch("entryType", entryType),
		[patch],
	);
	const setSort = useCallback(
		(sort: AdminEntriesSort) => patch("sort", sort),
		[patch],
	);
	const setPage = useCallback((page: number) => {
		setState((prev) => ({ ...prev, page }));
	}, []);
	const setLimit = useCallback((limit: number) => {
		setState((prev) => ({ ...prev, limit, page: 1 }));
	}, []);
	const reset = useCallback(() => setState(INITIAL_STATE), []);

	const toQuery = (debouncedQ: string): AdminEntriesQuery => ({
		q: debouncedQ,
		pos: state.pos || undefined,
		source: state.source || undefined,
		cefr: state.cefr || undefined,
		nounClass: state.nounClass || undefined,
		entryType: state.entryType || undefined,
		sort: state.sort,
		page: state.page,
		limit: state.limit,
	});

	return {
		state,
		setQ,
		setPos,
		setSource,
		setCefr,
		setNounClass,
		setEntryType,
		setSort,
		setPage,
		setLimit,
		reset,
		toQuery,
	};
};
