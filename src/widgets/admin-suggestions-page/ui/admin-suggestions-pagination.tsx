"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { FC } from "react";

interface AdminSuggestionsPaginationProps {
	dict: Dictionary["adminSuggestions"]["pagination"];
	page: number;
	totalPages: number;
	totalCount: number;
	pageSize: number;
	onChange: (page: number) => void;
}

const buildPages = (current: number, total: number): (number | "…")[] => {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const pages: (number | "…")[] = [1];
	const start = Math.max(2, current - 1);
	const end = Math.min(total - 1, current + 1);
	if (start > 2) pages.push("…");
	for (let p = start; p <= end; p++) pages.push(p);
	if (end < total - 1) pages.push("…");
	pages.push(total);
	return pages;
};

export const AdminSuggestionsPagination: FC<
	AdminSuggestionsPaginationProps
> = ({ dict, page, totalPages, totalCount, pageSize, onChange }) => {
	if (totalCount === 0) return null;
	const from = (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, totalCount);
	const pages = totalPages > 0 ? buildPages(page, totalPages) : [];

	return (
		<nav
			className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-6"
			aria-label="pagination"
		>
			<p className="text-xs text-muted-foreground">
				{dict.showing
					.replace("{from}", String(from))
					.replace("{to}", String(to))
					.replace("{total}", String(totalCount))}
			</p>
			{totalPages > 1 && (
				<div className="flex items-center gap-1 self-center sm:self-auto">
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onChange(page - 1)}
						disabled={page <= 1}
						aria-label={dict.prev}
					>
						<ChevronLeftIcon />
					</Button>
					{pages.map((p, idx) =>
						p === "…" ? (
							<span
								key={`gap-${idx}`}
								className="px-2 text-xs text-muted-foreground select-none"
								aria-hidden
							>
								…
							</span>
						) : (
							<button
								key={p}
								type="button"
								onClick={() => onChange(p)}
								aria-current={p === page ? "page" : undefined}
								aria-label={dict.page.replace("{page}", String(p))}
								className={cn(
									"size-8 rounded-sm border text-sm font-medium transition-colors",
									p === page
										? "bg-primary text-primary-foreground border-primary"
										: "bg-transparent border-border text-muted-foreground hover:bg-surface hover:text-foreground",
								)}
							>
								{p}
							</button>
						),
					)}
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onChange(page + 1)}
						disabled={page >= totalPages}
						aria-label={dict.next}
					>
						<ChevronRightIcon />
					</Button>
				</div>
			)}
		</nav>
	);
};
