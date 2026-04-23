"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface QualityProblemsPaginationProps {
	page: number;
	pages: number;
	total: number;
	limit: number;
	onPageChange: (page: number) => void;
	pageInfoTemplate: string;
}

const nf = new Intl.NumberFormat("ru-RU");

const buildPageList = (current: number, pages: number): (number | "…")[] => {
	if (pages <= 7) {
		return Array.from({ length: pages }, (_, i) => i + 1);
	}

	const list: (number | "…")[] = [1];
	const start = Math.max(2, current - 1);
	const end = Math.min(pages - 1, current + 1);

	if (start > 2) list.push("…");
	for (let i = start; i <= end; i += 1) list.push(i);
	if (end < pages - 1) list.push("…");
	list.push(pages);

	return list;
};

export const QualityProblemsPagination: FC<QualityProblemsPaginationProps> = ({
	page,
	pages,
	total,
	limit,
	onPageChange,
	pageInfoTemplate,
}) => {
	if (pages <= 1) return null;

	const items = buildPageList(page, pages);
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	return (
		<div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
			<button
				type="button"
				onClick={() => onPageChange(Math.max(1, page - 1))}
				disabled={page <= 1}
				className={cn(
					"w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] font-medium hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
				)}
				aria-label="previous"
			>
				←
			</button>
			{items.map((it, idx) =>
				it === "…" ? (
					<span
						key={`dots-${idx}`}
						className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)]"
					>
						…
					</span>
				) : (
					<button
						key={it}
						type="button"
						onClick={() => onPageChange(it)}
						className={cn(
							"w-9 h-9 rounded-xl border text-sm font-medium transition-colors",
							it === page
								? "bg-[var(--accent)] text-[var(--accent-on)] border-[var(--accent)]"
								: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]",
						)}
						aria-current={it === page ? "page" : undefined}
					>
						{it}
					</button>
				),
			)}
			<button
				type="button"
				onClick={() => onPageChange(Math.min(pages, page + 1))}
				disabled={page >= pages}
				className={cn(
					"w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] font-medium hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
				)}
				aria-label="next"
			>
				→
			</button>
			<span className="text-xs text-[var(--text-muted)] mx-3">
				{pageInfoTemplate
					.replace("{from}", nf.format(from))
					.replace("{to}", nf.format(to))
					.replace("{total}", nf.format(total))}
			</span>
		</div>
	);
};
