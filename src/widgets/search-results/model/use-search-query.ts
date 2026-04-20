"use client";

import { useSearch } from "@/entities/dictionary";
import type { NounClass, SearchParams } from "@/entities/dictionary";
import type { SearchUrlState } from "@/features/search";
import { useMemo } from "react";

export const useSearchQuery = (url: SearchUrlState) => {
	const params = useMemo<SearchParams>(
		() => ({
			q: url.q,
			...(url.filters.level.length ? { level: url.filters.level } : {}),
			...(url.filters.pos ? { pos: url.filters.pos } : {}),
			...(url.filters.nounClass
				? { nounClass: url.filters.nounClass as NounClass }
				: {}),
			...(url.filters.entryType ? { entryType: url.filters.entryType } : {}),
			...(url.filters.attested
				? { attested: url.filters.attested === "true" }
				: {}),
			...(url.filters.source ? { source: url.filters.source } : {}),
			...(url.exact ? { exact: true } : {}),
			sort: url.sort,
			limit: url.limit,
			offset: url.offset,
		}),
		[url],
	);

	return useSearch(params, url.q.length > 0);
};
