"use client";

import type { ActiveFilter, FilterKey } from "../types";

interface ActiveFiltersProps {
	activeFilters: ActiveFilter[];
	onRemove: (key: FilterKey) => void;
	onClearAll: () => void;
}

export const ActiveFilters = ({
	activeFilters,
	onRemove,
	onClearAll,
}: ActiveFiltersProps) => {
	if (activeFilters.length === 0) return null;

	return (
		<div className="flex flex-wrap justify-center gap-2 mb-5">
			{activeFilters.map(af => (
				<div
					key={af.key}
					className="inline-flex items-center gap-1 pl-3 pr-2 py-0.5 border border-primary rounded-full text-xs text-primary bg-primary-dim"
				>
					<span>{af.label}</span>
					<button
						onClick={() => onRemove(af.key)}
						aria-label={`Удалить фильтр ${af.label}`}
						className="cursor-pointer border-none bg-transparent text-primary text-xs p-0.5 leading-none opacity-60 hover:opacity-100 transition-opacity"
					>
						×
					</button>
				</div>
			))}
			<button
				onClick={onClearAll}
				className="text-xs text-muted cursor-pointer border-none bg-transparent underline underline-offset-2 hover:text-foreground transition-colors"
			>
				Сбросить все
			</button>
		</div>
	);
};
