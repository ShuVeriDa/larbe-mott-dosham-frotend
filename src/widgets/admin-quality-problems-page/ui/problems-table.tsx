"use client";

import type {
	QualityProblemRow,
	QualitySortDir,
	QualitySortField,
} from "@/features/admin-quality-problems";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { Checkbox } from "./checkbox";
import { ProblemRow } from "./problem-row";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemsTableProps {
	lang: Locale;
	dict: ProblemsDict;
	rows: QualityProblemRow[];
	selectedIds: Set<number>;
	expandedIds: Set<number>;
	onToggleSelect: (id: number) => void;
	onToggleExpand: (id: number) => void;
	onToggleSelectAll: () => void;
	sortBy: QualitySortField;
	sortDir: QualitySortDir;
	onSortChange: (field: QualitySortField) => void;
}

interface HeaderCol {
	key: QualitySortField | null;
	label: string;
	className?: string;
}

const SortArrow: FC<{ active: boolean; dir: QualitySortDir }> = ({
	active,
	dir,
}) => (
	<span
		className={cn(
			"ml-1 text-[0.6rem] transition-opacity",
			active ? "opacity-100" : "opacity-40",
		)}
		aria-hidden
	>
		{active && dir === "asc" ? "▲" : "▼"}
	</span>
);

export const ProblemsTable: FC<ProblemsTableProps> = ({
	lang,
	dict,
	rows,
	selectedIds,
	expandedIds,
	onToggleSelect,
	onToggleExpand,
	onToggleSelectAll,
	sortBy,
	sortDir,
	onSortChange,
}) => {
	const cols: HeaderCol[] = [
		{ key: "word", label: dict.table.columns.word },
		{ key: "source", label: dict.table.columns.source },
		{ key: "problems", label: dict.table.columns.problems },
		{ key: "updated", label: dict.table.columns.updated },
	];

	const allSelected =
		rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

	return (
		<div className="overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-[14px]">
			<table className="w-full border-collapse min-w-[700px]">
				<thead>
					<tr>
						<th className="w-9 px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-[2]">
							<Checkbox
								checked={allSelected}
								onChange={onToggleSelectAll}
								ariaLabel={dict.table.columns.select}
							/>
						</th>
						<th
							className="w-7 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-[2]"
							aria-label={dict.table.columns.expand}
						/>
						{cols.map((col) => {
							const active = col.key === sortBy;
							return (
								<th
									key={col.label}
									className={cn(
										"px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-[2] whitespace-nowrap select-none cursor-pointer",
										active
											? "text-[var(--accent)]"
											: "text-[var(--text-muted)] hover:text-[var(--text)]",
									)}
									aria-sort={
										active
											? sortDir === "asc"
												? "ascending"
												: "descending"
											: "none"
									}
								>
									<button
										type="button"
										onClick={() => col.key && onSortChange(col.key)}
										className="inline-flex items-center"
									>
										{col.label}
										<SortArrow active={active} dir={sortDir} />
									</button>
								</th>
							);
						})}
						<th
							className="w-20 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-[2]"
							aria-label={dict.table.columns.actions}
						/>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<ProblemRow
							key={row.id}
							row={row}
							lang={lang}
							dict={dict}
							isSelected={selectedIds.has(row.id)}
							isExpanded={expandedIds.has(row.id)}
							onToggleSelect={() => onToggleSelect(row.id)}
							onToggleExpand={() => onToggleExpand(row.id)}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};
