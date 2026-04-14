"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import type { FilterKey, FilterValues } from "../types";

export function useSearchSubmit(filters: FilterValues) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = () => {
		const q = inputRef.current?.value.trim();
		if (!q) return;
		const params = new URLSearchParams({ q });
		for (const key of Object.keys(filters) as FilterKey[]) {
			if (filters[key]) params.set(key, filters[key]);
		}
		router.push(`/search?${params.toString()}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") submit();
	};

	return { inputRef, submit, handleKeyDown };
}
