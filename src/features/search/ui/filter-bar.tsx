"use client";

import { forwardRef, type ReactNode } from "react";
import type { FilterGroup, FilterKey, FilterValues } from "../types";
import { FilterChip } from "./filter-chip";

interface FilterBarProps {
	groups: readonly FilterGroup[];
	filters: FilterValues;
	openFilter: FilterKey | null;
	onToggle: (key: FilterKey) => void;
	onSelect: (key: FilterKey, value: string) => void;
	/** Extra controls rendered after the filter chips (e.g. exact-match toggle). */
	trailing?: ReactNode;
}

const selectedValuesFor = (
	key: FilterKey,
	filters: FilterValues,
): readonly string[] => {
	if (key === "level") return filters.level;
	const v = filters[key];
	return v ? [v] : [""];
};

export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
	({ groups, filters, openFilter, onToggle, onSelect, trailing }, ref) => (
		<div
			ref={ref}
			className="flex justify-center items-center gap-2 flex-wrap mb-3 relative z-2"
		>
			{groups.map(group => (
				<FilterChip
					key={group.key}
					group={group}
					selectedValues={selectedValuesFor(group.key, filters)}
					isOpen={openFilter === group.key}
					onToggle={() => onToggle(group.key)}
					onSelect={value => onSelect(group.key, value)}
				/>
			))}
			{trailing}
		</div>
	),
);

FilterBar.displayName = "FilterBar";
