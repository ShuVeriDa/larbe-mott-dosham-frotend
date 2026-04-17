"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface PaginationProps {
	page: number;
	total: number;
	limit: number;
	prevLabel: string;
	nextLabel: string;
	pageOfTemplate: string;
	onPageChange: (page: number) => void;
}

const MAX_NUMBERED_BUTTONS = 5;

const buildPageNumbers = (current: number, totalPages: number): number[] => {
	if (totalPages <= MAX_NUMBERED_BUTTONS) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const half = Math.floor(MAX_NUMBERED_BUTTONS / 2);
	let start = Math.max(1, current - half);
	let end = start + MAX_NUMBERED_BUTTONS - 1;
	if (end > totalPages) {
		end = totalPages;
		start = end - MAX_NUMBERED_BUTTONS + 1;
	}
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const Pagination: FC<PaginationProps> = ({
	page,
	total,
	limit,
	prevLabel,
	nextLabel,
	pageOfTemplate,
	onPageChange,
}) => {
	const totalPages = Math.max(1, Math.ceil(total / limit));
	if (totalPages <= 1) return null;

	const pages = buildPageNumbers(page, totalPages);
	const prevDisabled = page <= 1;
	const nextDisabled = page >= totalPages;

	const btn =
		"min-w-9 h-9 inline-flex items-center justify-center border border-edge rounded-md text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-surface hover:text-foreground hover:border-edge-hover disabled:opacity-30 disabled:cursor-not-allowed";

	return (
		<nav
			aria-label={pageOfTemplate
				.replace("{page}", String(page))
				.replace("{total}", String(totalPages))}
			className="flex justify-center gap-1 pt-10 pb-16 flex-wrap"
		>
			<button
				type="button"
				className={cn(btn, "bg-transparent text-muted px-3")}
				onClick={() => onPageChange(page - 1)}
				disabled={prevDisabled}
				aria-label={prevLabel}
			>
				←
			</button>
			{pages.map(p => (
				<button
					key={p}
					type="button"
					aria-current={p === page ? "page" : undefined}
					className={cn(
						btn,
						p === page
							? "bg-primary text-primary-foreground border-primary"
							: "bg-transparent text-muted",
					)}
					onClick={() => onPageChange(p)}
				>
					{p}
				</button>
			))}
			<button
				type="button"
				className={cn(btn, "bg-transparent text-muted px-3")}
				onClick={() => onPageChange(page + 1)}
				disabled={nextDisabled}
				aria-label={nextLabel}
			>
				→
			</button>
		</nav>
	);
};
