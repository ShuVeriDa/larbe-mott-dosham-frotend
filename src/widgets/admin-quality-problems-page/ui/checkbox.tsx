"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface CheckboxProps {
	checked: boolean;
	onChange: () => void;
	ariaLabel: string;
}

export const Checkbox: FC<CheckboxProps> = ({
	checked,
	onChange,
	ariaLabel,
}) => (
	<button
		type="button"
		role="checkbox"
		aria-checked={checked}
		aria-label={ariaLabel}
		onClick={onChange}
		className={cn(
			"w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-colors flex-shrink-0 text-[0.7rem]",
			checked
				? "bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-on)]"
				: "bg-transparent border-[var(--border-hover)] text-transparent hover:border-[var(--accent)]",
		)}
	>
		✓
	</button>
);
