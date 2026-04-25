"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { LiveFilter } from "../model/use-live-page-state";
import { EventFilterChips } from "./event-filter-chips";

interface LiveToolbarProps {
	dict: Dictionary["admin"]["analyticsLive"];
	filter: LiveFilter;
	onFilterChange: (value: LiveFilter) => void;
	paused: boolean;
	onTogglePause: () => void;
	onClear: () => void;
}

export const LiveToolbar: FC<LiveToolbarProps> = ({
	dict,
	filter,
	onFilterChange,
	paused,
	onTogglePause,
	onClear,
}) => (
	<div className="mb-4 flex flex-col flex-wrap items-stretch gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3 md:flex-row md:items-center">
		<EventFilterChips
			value={filter}
			onChange={onFilterChange}
			dict={dict.filters}
		/>
		<div className="ml-auto flex items-center gap-2">
			<button
				type="button"
				onClick={onTogglePause}
				aria-pressed={paused}
				className={cn(
					"inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] border px-4 text-xs font-semibold transition-colors",
					paused
						? "border-[var(--warning)] bg-[var(--warning-dim)] text-[var(--warning)]"
						: "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-hover)]",
				)}
			>
				<span aria-hidden="true">{paused ? "▶" : "⏸"}</span>
				<span>{paused ? dict.actions.resume : dict.actions.pause}</span>
			</button>
			<button
				type="button"
				onClick={onClear}
				className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] bg-transparent px-3 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
			>
				<span aria-hidden="true">⟲</span>
				<span>{dict.actions.clear}</span>
			</button>
		</div>
	</div>
);
