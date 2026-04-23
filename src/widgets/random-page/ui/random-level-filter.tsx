"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { Level } from "../lib/parse-level";

interface RandomLevelFilterProps {
	labels: Dictionary["random"]["filter"];
	active: Level;
	onChange: (level: Level) => void;
	disabled?: boolean;
}

const LEVEL_OPTIONS: { value: Level; labelKey: keyof Dictionary["random"]["filter"] }[] = [
	{ value: "ALL", labelKey: "all" },
	{ value: "A", labelKey: "A" },
	{ value: "B", labelKey: "B" },
	{ value: "C", labelKey: "C" },
];

export const RandomLevelFilter: FC<RandomLevelFilterProps> = ({
	labels,
	active,
	onChange,
	disabled,
}) => (
	<div
		role="radiogroup"
		aria-label={labels.ariaLabel}
		className="relative z-10 flex flex-wrap justify-center gap-2 mb-8 px-6"
	>
		{LEVEL_OPTIONS.map(({ value, labelKey }) => {
			const isActive = active === value;
			return (
				<button
					key={value}
					type="button"
					role="radio"
					aria-checked={isActive}
					disabled={disabled}
					onClick={() => onChange(value)}
					className={cn(
						"inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs select-none transition-colors duration-150 cursor-pointer",
						"disabled:opacity-60 disabled:cursor-not-allowed",
						isActive
							? "border-primary text-primary bg-[var(--accent-dim)]"
							: "border-edge text-muted hover:border-[var(--border-hover)] hover:text-subtle bg-transparent",
					)}
				>
					{labels[labelKey]}
				</button>
			);
		})}
	</div>
);
