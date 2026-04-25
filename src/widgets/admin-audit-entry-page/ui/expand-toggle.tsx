"use client";

import { cn } from "@/shared/lib";
import { type FC, useId, useState } from "react";

interface ExpandToggleProps {
	label: string;
	children: React.ReactNode;
}

export const ExpandToggle: FC<ExpandToggleProps> = ({ label, children }) => {
	const [open, setOpen] = useState(false);
	const id = useId();

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={id}
				className="w-full flex items-center justify-center gap-1 py-2 border-t border-[var(--border)] text-xs text-[var(--text-faint)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-muted)] transition-colors"
			>
				<span
					aria-hidden
					className={cn(
						"inline-block transition-transform duration-200",
						open && "rotate-180",
					)}
				>
					▾
				</span>
				{label}
			</button>
			<div id={id} hidden={!open}>
				{open ? children : null}
			</div>
		</>
	);
};
