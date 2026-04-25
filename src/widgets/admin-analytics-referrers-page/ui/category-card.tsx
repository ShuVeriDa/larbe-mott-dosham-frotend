"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";
import { categoryIcon, type ReferrerCategoryFilter } from "../lib/categorize";

interface CategoryCardProps {
	category: ReferrerCategoryFilter;
	label: string;
	value: string;
	share: string;
	sub?: string;
	active: boolean;
	onSelect: (category: ReferrerCategoryFilter) => void;
	loading?: boolean;
}

const ACCENT_BAR_BY_CAT: Record<ReferrerCategoryFilter, string> = {
	all: "bg-[var(--accent)]",
	search: "bg-[var(--info)]",
	direct: "bg-[var(--text-muted)]",
	social: "bg-[var(--purple)]",
	other: "bg-[var(--warning)]",
};

const ICON_TONE_BY_CAT: Record<ReferrerCategoryFilter, string> = {
	all: "bg-[var(--accent-dim)] text-[var(--accent)]",
	search: "bg-[var(--info-dim)] text-[var(--info)]",
	direct: "bg-[var(--surface-active)] text-[var(--text-muted)]",
	social: "bg-[var(--purple-dim)] text-[var(--purple)]",
	other: "bg-[var(--warning-dim)] text-[var(--warning)]",
};

export const CategoryCard: FC<CategoryCardProps> = ({
	category,
	label,
	value,
	share,
	sub,
	active,
	onSelect,
	loading,
}) => (
	<button
		type="button"
		onClick={() => onSelect(category)}
		aria-pressed={active}
		className={cn(
			"relative flex flex-col gap-2 overflow-hidden text-left cursor-pointer",
			"bg-[var(--surface)] border rounded-2xl p-5",
			"transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md",
			"hover:bg-[var(--surface-hover)]",
			active
				? "border-[var(--accent)] bg-[var(--accent-dim)]"
				: "border-[var(--border)] hover:border-[var(--border-hover)]",
		)}
	>
		<span
			aria-hidden="true"
			className={cn(
				"absolute top-0 left-0 right-0 h-[3px]",
				ACCENT_BAR_BY_CAT[category],
			)}
		/>

		<div className="flex justify-between items-center">
			<span
				aria-hidden="true"
				className={cn(
					"w-8 h-8 rounded-md flex items-center justify-center text-base",
					ICON_TONE_BY_CAT[category],
				)}
			>
				{categoryIcon(category)}
			</span>
			<span className="text-xs font-semibold tabular-nums text-[var(--text-muted)]">
				{share}
			</span>
		</div>

		<span className="text-xs uppercase tracking-wider font-medium text-[var(--text-muted)]">
			{label}
		</span>

		<span
			className={cn(
				"text-xl font-bold tabular-nums tracking-tight text-[var(--text)]",
				loading && "opacity-50",
			)}
		>
			{value}
		</span>

		{sub ? (
			<span className="text-xs text-[var(--text-muted)] truncate">{sub}</span>
		) : null}
	</button>
);
