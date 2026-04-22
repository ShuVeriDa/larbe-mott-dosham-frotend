"use client";

import { usePhraseology } from "@/entities/dictionary";
import type { PhraseologyParams } from "@/entities/dictionary";
import type { PhraseologyUrlState } from "@/features/phraseology-search";
import { useMemo } from "react";

export const usePhraseologyQuery = (url: PhraseologyUrlState) => {
	const params = useMemo<PhraseologyParams>(
		() => ({
			...(url.q ? { q: url.q } : {}),
			...(url.exact ? { exact: true } : {}),
			limit: url.limit,
			offset: url.offset,
		}),
		[url.q, url.exact, url.limit, url.offset],
	);

	return usePhraseology(params);
};
