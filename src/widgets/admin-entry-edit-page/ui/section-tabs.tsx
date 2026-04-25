"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { EntryTab } from "../model";

interface TabDef {
	value: EntryTab;
	label: string;
	dot?: boolean;
}

interface SectionTabsProps {
	tabs: TabDef[];
	active: EntryTab;
	onSelect: (tab: EntryTab) => void;
}

export const SectionTabs: FC<SectionTabsProps> = ({
	tabs,
	active,
	onSelect,
}) => (
	<nav
		className="flex gap-1 mb-6 border-b border-[var(--border)] overflow-x-auto"
		aria-label="Sections"
	>
		{tabs.map((tab) => {
			const isActive = tab.value === active;
			return (
				<button
					key={tab.value}
					type="button"
					onClick={() => onSelect(tab.value)}
					className={cn(
						"px-5 py-3 text-sm font-medium whitespace-nowrap relative -mb-px",
						"border-b-2 transition-colors",
						isActive
							? "text-[var(--accent)] border-[var(--accent)]"
							: "text-[var(--text-muted)] border-transparent hover:text-[var(--text)]",
					)}
				>
					{tab.label}
					{tab.dot ? (
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--danger)] ml-1 align-middle" />
					) : null}
				</button>
			);
		})}
	</nav>
);
