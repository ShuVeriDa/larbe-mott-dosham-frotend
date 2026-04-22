"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
	DEFAULT_PHRASEOLOGY_LIMIT,
	MAX_PHRASEOLOGY_LIMIT,
} from "./config";

export interface PhraseologyUrlState {
	q: string;
	exact: boolean;
	limit: number;
	offset: number;
	page: number;
}

export const usePhraseologyUrlState = (): PhraseologyUrlState => {
	const searchParams = useSearchParams();

	return useMemo(() => {
		const q = searchParams.get("q")?.trim() ?? "";
		const exact = searchParams.get("exact") === "1";

		const rawLimit = Number(
			searchParams.get("limit") ?? DEFAULT_PHRASEOLOGY_LIMIT,
		);
		const limit =
			Number.isFinite(rawLimit)
			&& rawLimit > 0
			&& rawLimit <= MAX_PHRASEOLOGY_LIMIT
				? Math.floor(rawLimit)
				: DEFAULT_PHRASEOLOGY_LIMIT;

		const rawPage = Number(searchParams.get("page") ?? 1);
		const page =
			Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
		const offset = (page - 1) * limit;

		return { q, exact, limit, offset, page };
	}, [searchParams]);
};

export interface BuildPhraseologyParamsOptions {
	q?: string;
	exact?: boolean;
	page?: number;
}

export const buildPhraseologyParams = ({
	q,
	exact,
	page,
}: BuildPhraseologyParamsOptions): URLSearchParams => {
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (exact) params.set("exact", "1");
	if (page && page > 1) params.set("page", String(page));
	return params;
};
