"use client";

import type {
	EntryType,
	SortOrder,
	WordLevel,
} from "@/entities/dictionary";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { FilterValues } from "../types";
import { DEFAULT_LIMIT, LEVEL_KEYS } from "./filter-config";

const isLevel = (v: string): v is WordLevel =>
	(LEVEL_KEYS as readonly string[]).includes(v);

const isEntryType = (v: string): v is EntryType =>
	v === "standard" || v === "neologism";

const isAttested = (v: string): v is "true" | "false" =>
	v === "true" || v === "false";

const SORT_VALUES: readonly SortOrder[] = [
	"relevance",
	"asc",
	"desc",
	"updatedAt_desc",
	"updatedAt_asc",
	"createdAt_desc",
	"meaningsCount_desc",
];

const isSort = (v: string): v is SortOrder =>
	(SORT_VALUES as readonly string[]).includes(v);

export interface SearchUrlState {
	q: string;
	filters: FilterValues;
	sort: SortOrder;
	exact: boolean;
	limit: number;
	offset: number;
	page: number;
}

export const useSearchUrlState = (): SearchUrlState => {
	const searchParams = useSearchParams();

	return useMemo(() => {
		const q = searchParams.get("q")?.trim() ?? "";

		const rawLevels = searchParams.getAll("level");
		const level = rawLevels.filter(isLevel);

		const pos = searchParams.get("pos") ?? "";
		const nounClass = searchParams.get("nounClass") ?? "";
		const rawEntryType = searchParams.get("entryType") ?? "";
		const entryType: FilterValues["entryType"] = isEntryType(rawEntryType)
			? rawEntryType
			: "";

		const rawAttested = searchParams.get("attested") ?? "";
		const attested: FilterValues["attested"] = isAttested(rawAttested)
			? rawAttested
			: "";

		const source = searchParams.get("source") ?? "";

		const rawSort = searchParams.get("sort") ?? "";
		const sort: SortOrder = isSort(rawSort) ? rawSort : "relevance";

		const exact = searchParams.get("exact") === "1";

		const rawLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
		const limit =
			Number.isFinite(rawLimit) && rawLimit > 0 && rawLimit <= 100
				? Math.floor(rawLimit)
				: DEFAULT_LIMIT;

		const rawPage = Number(searchParams.get("page") ?? 1);
		const page =
			Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
		const offset = (page - 1) * limit;

		return {
			q,
			filters: { level, pos, nounClass, entryType, attested, source },
			sort,
			exact,
			limit,
			offset,
			page,
		};
	}, [searchParams]);
};

export interface BuildUrlOptions {
	q?: string;
	filters?: FilterValues;
	sort?: SortOrder;
	exact?: boolean;
	page?: number;
}

/** Serialise search state to URLSearchParams preserving stable key order. */
export const buildSearchParams = ({
	q,
	filters,
	sort,
	exact,
	page,
}: BuildUrlOptions): URLSearchParams => {
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (filters) {
		for (const lvl of filters.level) params.append("level", lvl);
		if (filters.pos) params.set("pos", filters.pos);
		if (filters.nounClass) params.set("nounClass", filters.nounClass);
		if (filters.entryType) params.set("entryType", filters.entryType);
		if (filters.attested) params.set("attested", filters.attested);
		if (filters.source) params.set("source", filters.source);
	}
	if (sort && sort !== "relevance") params.set("sort", sort);
	if (exact) params.set("exact", "1");
	if (page && page > 1) params.set("page", String(page));
	return params;
};
