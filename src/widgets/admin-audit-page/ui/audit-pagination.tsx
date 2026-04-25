"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

interface AuditPaginationProps {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
	dict: Dictionary["admin"]["audit"]["pagination"];
}

const buildPageList = (page: number, total: number): (number | "…")[] => {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const pages: (number | "…")[] = [1];
	const start = Math.max(2, page - 1);
	const end = Math.min(total - 1, page + 1);
	if (start > 2) pages.push("…");
	for (let i = start; i <= end; i += 1) pages.push(i);
	if (end < total - 1) pages.push("…");
	pages.push(total);
	return pages;
};

const buttonBase =
	"w-8 h-8 flex items-center justify-center rounded-md border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

export const AuditPagination: FC<AuditPaginationProps> = ({
	page,
	totalPages,
	onChange,
	dict,
}) => {
	if (totalPages <= 1) return null;
	const pages = buildPageList(page, totalPages);

	return (
		<nav
			className="flex items-center justify-center gap-2 mt-6"
			aria-label={dict.pageLabel
				.replace("{page}", String(page))
				.replace("{total}", String(totalPages))}
		>
			<button
				type="button"
				onClick={() => onChange(page - 1)}
				disabled={page <= 1}
				className={cn(
					buttonBase,
					"bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
				)}
				aria-label={dict.prev}
			>
				{dict.prev}
			</button>
			{pages.map((p, i) =>
				p === "…" ? (
					<span
						key={`ellipsis-${i}`}
						className="text-xs text-[var(--text-faint)] px-1"
					>
						…
					</span>
				) : (
					<button
						key={p}
						type="button"
						onClick={() => onChange(p)}
						className={cn(
							buttonBase,
							p === page
								? "bg-[var(--accent)] text-[var(--accent-on)] border-[var(--accent)]"
								: "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
						)}
						aria-current={p === page ? "page" : undefined}
					>
						{p}
					</button>
				),
			)}
			<button
				type="button"
				onClick={() => onChange(page + 1)}
				disabled={page >= totalPages}
				className={cn(
					buttonBase,
					"bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
				)}
				aria-label={dict.next}
			>
				{dict.next}
			</button>
		</nav>
	);
};
