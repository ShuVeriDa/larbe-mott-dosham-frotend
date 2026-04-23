"use client";

import type {
	QualitySortField,
} from "@/features/admin-quality-problems";
import type { DictionarySource } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ChangeEvent, FC } from "react";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemsToolbarProps {
	q: string;
	onQChange: (value: string) => void;
	source: string;
	sources: DictionarySource[];
	onSourceChange: (slug: string) => void;
	sortBy: QualitySortField;
	onSortByChange: (value: QualitySortField) => void;
	onExport: () => void;
	onRefresh: () => void;
	isExporting: boolean;
	dict: ProblemsDict;
}

const SORT_OPTIONS: QualitySortField[] = [
	"updated",
	"word",
	"problems",
	"source",
];

const SEARCH_ICON = (
	<svg
		width="15"
		height="15"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		aria-hidden
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
);

export const ProblemsToolbar: FC<ProblemsToolbarProps> = ({
	q,
	onQChange,
	source,
	sources,
	onSourceChange,
	sortBy,
	onSortByChange,
	onExport,
	onRefresh,
	isExporting,
	dict,
}) => {
	const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
		onSortByChange(e.target.value as QualitySortField);
	};

	return (
		<div className="flex items-center gap-3 mb-4 flex-wrap">
			<label className="relative flex-1 min-w-[180px] max-w-xs">
				<span className="sr-only">{dict.toolbar.searchPlaceholder}</span>
				<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
					{SEARCH_ICON}
				</span>
				<input
					type="search"
					value={q}
					onChange={(e) => onQChange(e.target.value)}
					placeholder={dict.toolbar.searchPlaceholder}
					className="w-full pl-9 pr-3 py-2 border border-[var(--border)] rounded-[10px] bg-[var(--surface)] text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]"
				/>
			</label>

			<div className="hidden md:block w-px h-6 bg-[var(--border)] mx-2" />

			<select
				aria-label={dict.toolbar.allSources}
				value={source}
				onChange={(e) => onSourceChange(e.target.value)}
				className="px-3 py-2 pr-8 border border-[var(--border)] rounded-[10px] bg-[var(--surface)] text-sm text-[var(--text)] outline-none cursor-pointer focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]"
			>
				<option value="">{dict.toolbar.allSources}</option>
				{sources.map((s) => (
					<option key={s.slug} value={s.slug}>
						{s.slug}
					</option>
				))}
			</select>

			<select
				aria-label="sort"
				value={sortBy}
				onChange={handleSort}
				className="px-3 py-2 pr-8 border border-[var(--border)] rounded-[10px] bg-[var(--surface)] text-sm text-[var(--text)] outline-none cursor-pointer focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]"
			>
				{SORT_OPTIONS.map((opt) => (
					<option key={opt} value={opt}>
						{dict.toolbar.sort[opt]}
					</option>
				))}
			</select>

			<div className="hidden md:block w-px h-6 bg-[var(--border)] mx-2" />

			<div className="flex items-center gap-2 md:ml-auto">
				<button
					type="button"
					onClick={onExport}
					disabled={isExporting}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs font-semibold rounded-md h-8 hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{isExporting ? dict.toolbar.exporting : dict.toolbar.export}
				</button>
				<button
					type="button"
					onClick={onRefresh}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-on)] text-xs font-semibold rounded-md h-8 hover:brightness-110 transition-all"
				>
					{dict.toolbar.refresh}
				</button>
			</div>
		</div>
	);
};
