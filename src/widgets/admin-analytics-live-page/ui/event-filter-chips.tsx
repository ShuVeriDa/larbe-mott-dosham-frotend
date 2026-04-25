"use client";

import {
	LIVE_EVENT_TYPES,
	type AnalyticsLiveEventType,
} from "@/features/admin-analytics";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { eventDotColor } from "../lib/format-live";
import type { LiveFilter } from "../model/use-live-page-state";

const VISIBLE_TYPES: ReadonlyArray<AnalyticsLiveEventType> = [
	"pageview",
	"search",
	"entry_view",
	"favorite_add",
	"random_word",
	"phraseology_view",
	"suggestion_create",
];

const ALL_TYPES: ReadonlyArray<AnalyticsLiveEventType> = LIVE_EVENT_TYPES;

interface EventFilterChipsProps {
	value: LiveFilter;
	onChange: (value: LiveFilter) => void;
	dict: Dictionary["admin"]["analyticsLive"]["filters"];
	showAll?: boolean;
}

export const EventFilterChips: FC<EventFilterChipsProps> = ({
	value,
	onChange,
	dict,
	showAll = false,
}) => {
	const types = showAll ? ALL_TYPES : VISIBLE_TYPES;

	return (
		<div className="flex flex-wrap gap-1" role="group" aria-label={dict.allLabel}>
			<button
				type="button"
				onClick={() => onChange("all")}
				aria-pressed={value === "all"}
				className={cn(
					"inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
					value === "all"
						? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
						: "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]",
				)}
			>
				{dict.allLabel}
			</button>
			{types.map((type) => {
				const active = value === type;
				return (
					<button
						key={type}
						type="button"
						onClick={() => onChange(type)}
						aria-pressed={active}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
							active
								? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
								: "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]",
						)}
					>
						<span
							aria-hidden="true"
							className="inline-block h-1.5 w-1.5 rounded-full opacity-70"
							style={{ backgroundColor: eventDotColor(type) }}
						/>
						{dict.types[type] ?? type}
					</button>
				);
			})}
		</div>
	);
};
