"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface CompareToggleProps {
	label: string;
	value: boolean;
	onChange: (next: boolean) => void;
}

export const CompareToggle: FC<CompareToggleProps> = ({
	label,
	value,
	onChange,
}) => (
	<button
		type="button"
		role="switch"
		aria-checked={value}
		onClick={() => onChange(!value)}
		className={cn(
			"inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium",
			"border transition-colors",
			value
				? "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent)]"
				: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-hover)]",
		)}
	>
		<span
			aria-hidden="true"
			className={cn(
				"w-4 h-4 flex items-center justify-center rounded-sm border text-[10px]",
				value
					? "bg-[var(--accent)] text-[var(--accent-on)] border-[var(--accent)]"
					: "bg-[var(--bg-raised)] border-[var(--border)] text-transparent",
			)}
		>
			✓
		</span>
		{label}
	</button>
);
