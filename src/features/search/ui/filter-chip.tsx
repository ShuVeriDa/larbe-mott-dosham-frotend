"use client";

import { cn } from "@/shared/lib";
import type { FilterGroup } from "../types";

const Chevron = () => (
	<svg
		width="10"
		height="10"
		viewBox="0 0 10 10"
		aria-hidden="true"
		className="opacity-50 shrink-0"
	>
		<path
			d="M2.5 3.5 5 6.5 7.5 3.5"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
	</svg>
);

interface FilterChipProps {
	group: FilterGroup;
	selectedValue: string;
	isOpen: boolean;
	onToggle: () => void;
	onSelect: (value: string) => void;
}

export const FilterChip = ({
	group,
	selectedValue,
	isOpen,
	onToggle,
	onSelect,
}: FilterChipProps) => {
	const hasValue = selectedValue !== "";
	const selectedLabel = group.options.find(
		o => o.value === selectedValue,
	)?.label;

	return (
		<div className="relative">
			<button
				onClick={onToggle}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				className={cn(
					"inline-flex items-center gap-1 px-3 py-1",
					"rounded-[100px] border text-xs font-normal",
					"cursor-pointer select-none whitespace-nowrap",
					"transition-all duration-150 ease-[cubic-bezier(.16,1,.3,1)]",
					"outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
					hasValue
						? "border-primary text-primary bg-primary-dim"
						: "border-edge text-muted bg-transparent hover:border-edge-hover hover:text-subtle",
				)}
			>
				{hasValue ? selectedLabel : group.label}
				<Chevron />
			</button>

			<div
				role="listbox"
				aria-label={group.label}
				className={cn(
					"absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2",
					"min-w-[160px] p-2",
					"bg-raised border border-edge rounded-lg",
					"shadow-lg z-50",
					"transition-all duration-150 ease-[cubic-bezier(.16,1,.3,1)]",
					isOpen
						? "opacity-100 translate-y-0 pointer-events-auto"
						: "opacity-0 translate-y-1.5 pointer-events-none",
				)}
			>
				{group.options.map(opt => (
					<button
						key={opt.value}
						role="option"
						aria-selected={selectedValue === opt.value}
						onClick={() => onSelect(opt.value)}
						className={cn(
							"block w-full text-left px-3 py-2 rounded-md",
							"text-xs border-none bg-transparent cursor-pointer",
							"transition-colors duration-150",
							"hover:bg-surface hover:text-foreground",
							selectedValue === opt.value ? "text-primary" : "text-subtle",
						)}
					>
						{opt.label}
					</button>
				))}
			</div>
		</div>
	);
};
