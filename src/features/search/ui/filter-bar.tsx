"use client";

import { forwardRef } from "react";
import { FILTER_GROUPS } from "../lib/filter-config";
import type { FilterKey, FilterValues } from "../types";
import { FilterChip } from "./filter-chip";

interface FilterBarProps {
	filters: FilterValues;
	openFilter: FilterKey | null;
	onToggle: (key: FilterKey) => void;
	onSelect: (key: FilterKey, value: string) => void;
}

export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
	({ filters, openFilter, onToggle, onSelect }, ref) => (
		<div
			ref={ref}
			className="flex justify-center gap-2 flex-wrap mb-3 relative z-2"
		>
			{FILTER_GROUPS.map(group => (
				<FilterChip
					key={group.key}
					group={group}
					selectedValue={filters[group.key]}
					isOpen={openFilter === group.key}
					onToggle={() => onToggle(group.key)}
					onSelect={value => onSelect(group.key, value)}
				/>
			))}
		</div>
	),
);

FilterBar.displayName = "FilterBar";
