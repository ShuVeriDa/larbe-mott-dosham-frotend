"use client";

import type {
	QualityProblemFilter,
	QualitySortDir,
	QualitySortField,
} from "@/features/admin-quality-problems";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface PageState {
	type: QualityProblemFilter;
	q: string;
	source: string;
	sortBy: QualitySortField;
	sortDir: QualitySortDir;
	page: number;
	limit: number;
}

const DEFAULT: PageState = {
	type: "",
	q: "",
	source: "",
	sortBy: "updated",
	sortDir: "desc",
	page: 1,
	limit: 50,
};

const VALID_TYPES = new Set<QualityProblemFilter>([
	"",
	"no-meanings",
	"no-class",
	"no-pos",
	"no-examples",
]);
const VALID_SORT_BY = new Set<QualitySortField>([
	"updated",
	"word",
	"source",
	"problems",
]);
const VALID_SORT_DIR = new Set<QualitySortDir>(["asc", "desc"]);
const VALID_LIMITS = new Set([10, 25, 50, 100]);

const parseState = (params: URLSearchParams): PageState => {
	const rawType = (params.get("type") ?? "") as QualityProblemFilter;
	const rawSortBy = (params.get("sortBy") ?? "updated") as QualitySortField;
	const rawSortDir = (params.get("sortDir") ?? "desc") as QualitySortDir;
	const pageNum = Number(params.get("page"));
	const limitNum = Number(params.get("limit"));

	return {
		type: VALID_TYPES.has(rawType) ? rawType : DEFAULT.type,
		q: params.get("q") ?? "",
		source: params.get("source") ?? "",
		sortBy: VALID_SORT_BY.has(rawSortBy) ? rawSortBy : DEFAULT.sortBy,
		sortDir: VALID_SORT_DIR.has(rawSortDir) ? rawSortDir : DEFAULT.sortDir,
		page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : DEFAULT.page,
		limit:
			Number.isFinite(limitNum) && VALID_LIMITS.has(limitNum)
				? limitNum
				: DEFAULT.limit,
	};
};

const serializeState = (state: PageState): string => {
	const params = new URLSearchParams();
	if (state.type) params.set("type", state.type);
	if (state.q) params.set("q", state.q);
	if (state.source) params.set("source", state.source);
	if (state.sortBy !== DEFAULT.sortBy) params.set("sortBy", state.sortBy);
	if (state.sortDir !== DEFAULT.sortDir) params.set("sortDir", state.sortDir);
	if (state.page !== DEFAULT.page) params.set("page", String(state.page));
	if (state.limit !== DEFAULT.limit) params.set("limit", String(state.limit));
	return params.toString();
};

export const usePageState = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const state = useMemo(
		() => parseState(new URLSearchParams(searchParams.toString())),
		[searchParams],
	);

	const update = useCallback(
		(patch: Partial<PageState>, options: { resetPage?: boolean } = {}) => {
			const next: PageState = {
				...state,
				...patch,
				page: options.resetPage ? 1 : (patch.page ?? state.page),
			};
			const qs = serializeState(next);
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router, state],
	);

	return { state, update };
};
