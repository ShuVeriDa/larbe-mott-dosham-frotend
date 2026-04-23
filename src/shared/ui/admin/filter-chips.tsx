"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

export interface FilterChipOption<T extends string = string> {
	value: T;
	label: string;
	count?: number;
}

interface FilterChipsProps<T extends string = string> {
	options: FilterChipOption<T>[];
	value: T;
	onChange: (value: T) => void;
	className?: string;
}

export const FilterChips: FC<FilterChipsProps> = ({
	options,
	value,
	onChange,
	className,
}) => (
	<div className={cn("flex gap-2 flex-wrap", className)}>
		{options.map((opt) => {
			const active = opt.value === value;
			return (
				<button
					key={opt.value}
					type="button"
					onClick={() => onChange(opt.value)}
					className={cn(
						"inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium transition-colors",
						active
							? "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent)]"
							: "bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)]",
					)}
					aria-pressed={active}
				>
					{opt.label}
					{typeof opt.count === "number" ? (
						<span
							className={cn(
								"text-[0.65rem] px-1.5 py-[1px] rounded-full ml-1",
								active
									? "bg-[var(--accent-dim)]"
									: "bg-[var(--surface-active)]",
							)}
						>
							{opt.count}
						</span>
					) : null}
				</button>
			);
		})}
	</div>
);
