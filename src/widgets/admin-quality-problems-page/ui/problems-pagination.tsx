"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { ChangeEvent, FC } from "react";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemsPaginationProps {
	page: number;
	pages: number;
	total: number;
	limit: number;
	rowsOnPage: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	dict: ProblemsDict;
}

const LIMIT_OPTIONS = [10, 25, 50, 100];

const nf = new Intl.NumberFormat("ru-RU");

const getPageNumbers = (page: number, pages: number): (number | "…")[] => {
	if (pages <= 7)
		return Array.from({ length: pages }, (_, i) => i + 1);

	const result: (number | "…")[] = [1];
	if (page > 3) result.push("…");
	const start = Math.max(2, page - 1);
	const end = Math.min(pages - 1, page + 1);
	for (let p = start; p <= end; p++) result.push(p);
	if (page < pages - 2) result.push("…");
	result.push(pages);
	return result;
};

export const ProblemsPagination: FC<ProblemsPaginationProps> = ({
	page,
	pages,
	total,
	limit,
	rowsOnPage,
	onPageChange,
	onLimitChange,
	dict,
}) => {
	const from = total === 0 ? 0 : (page - 1) * limit + 1;
	const to = Math.min(total, from + rowsOnPage - 1);
	const pageNumbers = getPageNumbers(page, Math.max(1, pages));

	const handleLimit = (e: ChangeEvent<HTMLSelectElement>) => {
		onLimitChange(Number(e.target.value));
	};

	return (
		<div className="flex items-center justify-between mt-5 gap-3 flex-wrap">
			<div className="text-xs text-[var(--text-muted)]">
				{dict.pagination.info
					.replace("{from}", nf.format(from))
					.replace("{to}", nf.format(to))
					.replace("{total}", nf.format(total))}
			</div>
			<nav
				aria-label="pagination"
				className="flex gap-1 items-center"
			>
				<button
					type="button"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1}
					aria-label={dict.pagination.previous}
					className="w-9 h-9 border border-[var(--border)] bg-[var(--surface)] rounded-md text-sm font-medium text-[var(--text-muted)] flex items-center justify-center hover:bg-[var(--surface-hover)] hover:text-[var(--text)] hover:border-[var(--border-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					←
				</button>
				{pageNumbers.map((p, i) =>
					p === "…" ? (
						<span
							key={`ellipsis-${i}`}
							className="w-9 h-9 flex items-center justify-center text-sm text-[var(--text-muted)]"
						>
							…
						</span>
					) : (
						<button
							key={p}
							type="button"
							onClick={() => onPageChange(p)}
							aria-current={p === page ? "page" : undefined}
							className={cn(
								"w-9 h-9 border rounded-md text-sm font-medium flex items-center justify-center transition-colors",
								p === page
									? "bg-[var(--accent)] text-[var(--accent-on)] border-[var(--accent)]"
									: "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] hover:border-[var(--border-hover)]",
							)}
						>
							{p}
						</button>
					),
				)}
				<button
					type="button"
					onClick={() => onPageChange(page + 1)}
					disabled={page >= pages}
					aria-label={dict.pagination.next}
					className="w-9 h-9 border border-[var(--border)] bg-[var(--surface)] rounded-md text-sm font-medium text-[var(--text-muted)] flex items-center justify-center hover:bg-[var(--surface-hover)] hover:text-[var(--text)] hover:border-[var(--border-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					→
				</button>
			</nav>
			<label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
				<span>{dict.pagination.rows}</span>
				<select
					value={limit}
					onChange={handleLimit}
					className="px-3 py-1 pr-6 border border-[var(--border)] rounded-md bg-[var(--surface)] text-xs text-[var(--text)] outline-none cursor-pointer focus:border-[var(--accent)]"
				>
					{LIMIT_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</label>
		</div>
	);
};
