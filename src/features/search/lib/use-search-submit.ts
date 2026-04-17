"use client";

import type { SortOrder } from "@/entities/dictionary";
import { fixPalochka } from "@/shared/lib";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import type { FilterValues } from "../types";
import { buildSearchParams } from "./use-search-params";

interface UseSearchSubmitOptions {
	filters: FilterValues;
	sort?: SortOrder;
	exact?: boolean;
	/** Optional initial value to prefill the input (e.g. from URL `q`). */
	initialQuery?: string;
}

export const useSearchSubmit = ({
	filters,
	sort,
	exact,
	initialQuery,
}: UseSearchSubmitOptions) => {
	const router = useRouter();
	const params = useParams<{ lang: string }>();
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = () => {
		const raw = inputRef.current?.value.trim();
		if (!raw) return;
		const q = fixPalochka(raw);
		// Reflect the normalised value back in the input so the user sees what
		// will actually be queried.
		if (inputRef.current && q !== raw) inputRef.current.value = q;
		const urlParams = buildSearchParams({ q, filters, sort, exact, page: 1 });
		router.push(`/${params.lang}/search?${urlParams.toString()}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") submit();
	};

	return { inputRef, submit, handleKeyDown, initialQuery };
};
