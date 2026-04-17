"use client";

import type { WordLevel } from "@/entities/dictionary";
import { useEffect, useRef, useState } from "react";
import type {
	ActiveFilter,
	FilterGroup,
	FilterKey,
	FilterValues,
} from "../types";
import { EMPTY_FILTERS } from "./filter-config";

interface UseSearchFiltersOptions {
	initial?: FilterValues;
	groups: readonly FilterGroup[];
	filtersDict: {
		level: string;
		pos: string;
		nounClass: string;
		entryType: string;
	};
}

export const useSearchFilters = ({
	initial,
	groups,
	filtersDict,
}: UseSearchFiltersOptions) => {
	const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
	const [filters, setFilters] = useState<FilterValues>(initial ?? EMPTY_FILTERS);
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
		setFilters(prev => {
			if (key === "level") {
				const lvl = value as WordLevel;
				const exists = prev.level.includes(lvl);
				return {
					...prev,
					level: exists
						? prev.level.filter(v => v !== lvl)
						: [...prev.level, lvl],
				};
			}
			if (key === "entryType") {
				return { ...prev, entryType: value as FilterValues["entryType"] };
			}
			return { ...prev, [key]: value };
		});
		if (key !== "level") setOpenFilter(null);
	};

	const removeFilter = (key: FilterKey, value?: string) => {
		setFilters(prev => {
			if (key === "level" && value) {
				return { ...prev, level: prev.level.filter(v => v !== value) };
			}
			if (key === "level") return { ...prev, level: [] };
			if (key === "entryType") return { ...prev, entryType: "" };
			return { ...prev, [key]: "" };
		});
	};

	const clearAll = () => setFilters(EMPTY_FILTERS);

	const activeFilters: ActiveFilter[] = groups.flatMap<ActiveFilter>(g => {
		if (g.key === "level") {
			return filters.level.map<ActiveFilter>(v => ({
				key: g.key,
				value: v,
				label: `${filtersDict.level}: ${
					g.options.find(o => o.value === v)?.label ?? v
				}`,
			}));
		}
		const current = filters[g.key];
		if (!current || current === "") return [];
		const label = g.options.find(o => o.value === current)?.label ?? current;
		return [{ key: g.key, value: current, label }];
	});

	return {
		filters,
		setFilters,
		openFilter,
		filtersRef,
		activeFilters,
		toggleFilter,
		selectOption,
		removeFilter,
		clearAll,
	};
};
