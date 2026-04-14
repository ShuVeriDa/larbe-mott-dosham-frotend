"use client";

import { useEffect, useRef, useState } from "react";
import { EMPTY_FILTERS, FILTER_GROUPS } from "./filter-config";
import type { ActiveFilter, FilterKey, FilterValues } from "../types";

export function useSearchFilters() {
	const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
	const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
	const filtersRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!openFilter) return;
		const handler = (e: MouseEvent) => {
			if (
				filtersRef.current &&
				!filtersRef.current.contains(e.target as Node)
			) {
				setOpenFilter(null);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [openFilter]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpenFilter(null);
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);

	const toggleFilter = (key: FilterKey) => {
		setOpenFilter(prev => (prev === key ? null : key));
	};

	const selectOption = (key: FilterKey, value: string) => {
		setFilters(prev => ({ ...prev, [key]: value }));
		setOpenFilter(null);
	};

	const removeFilter = (key: FilterKey) => {
		setFilters(prev => ({ ...prev, [key]: "" }));
	};

	const clearAll = () => setFilters(EMPTY_FILTERS);

	const activeFilters: ActiveFilter[] = FILTER_GROUPS.filter(
		g => filters[g.key] !== "",
	).map(g => ({
		key: g.key,
		label:
			g.options.find(o => o.value === filters[g.key])?.label ?? filters[g.key],
	}));

	return {
		filters,
		openFilter,
		filtersRef,
		activeFilters,
		toggleFilter,
		selectOption,
		removeFilter,
		clearAll,
	};
}
