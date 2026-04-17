"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface ExactToggleProps {
	active: boolean;
	label: string;
	hint: string;
	onToggle: () => void;
}

export const ExactToggle: FC<ExactToggleProps> = ({
	active,
	label,
	hint,
	onToggle,
}) => (
	<button
		type="button"
		role="switch"
		aria-checked={active}
		aria-label={hint}
		title={hint}
		onClick={onToggle}
		className={cn(
			"inline-flex items-center gap-1 px-3 py-1",
			"rounded-[100px] border text-xs font-normal",
			"cursor-pointer select-none whitespace-nowrap",
			"transition-all duration-150 ease-[cubic-bezier(.16,1,.3,1)]",
			"outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
			active
				? "border-primary text-primary bg-primary-dim"
				: "border-edge text-muted bg-transparent hover:border-edge-hover hover:text-subtle",
		)}
	>
		<span
			aria-hidden
			className={cn(
				"inline-block size-3.5 rounded-full border transition-colors",
				active
					? "border-primary bg-primary"
					: "border-edge-hover bg-transparent",
			)}
		/>
		{label}
	</button>
);
