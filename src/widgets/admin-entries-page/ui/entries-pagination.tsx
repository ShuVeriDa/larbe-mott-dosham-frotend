"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";
import { formatNumber, interpolate } from "../lib/format";

interface Props {
	page: number;
	pages: number;
	total: number;
	limit: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	dict: Dictionary["admin"]["entries"]["pagination"];
}

const PAGE_SIZES = [10, 25, 50, 100];

const buildPages = (page: number, pages: number): (number | "dots")[] => {
	if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
	const result: (number | "dots")[] = [1];
	if (page > 3) result.push("dots");
	const start = Math.max(2, page - 1);
	const end = Math.min(pages - 1, page + 1);
	for (let i = start; i <= end; i += 1) result.push(i);
	if (page < pages - 2) result.push("dots");
	result.push(pages);
	return result;
};

export const EntriesPagination: FC<Props> = ({
	page,
	pages,
	total,
	limit,
	onPageChange,
	onLimitChange,
	dict,
}) => {
	const from = total === 0 ? 0 : (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);
	const pageList = buildPages(page, pages);

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 mt-5">
			<div className="text-xs text-[var(--text-muted)]">
				{interpolate(dict.showing, {
					from: formatNumber(from),
					to: formatNumber(to),
					total: formatNumber(total),
				})}
			</div>

			<div className="flex gap-1">
				<PageButton
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
					label={dict.prev}
				/>
				{pageList.map((p, i) =>
					p === "dots" ? (
						<span
							key={`dots-${i}`}
							className="w-8 h-8 flex items-center justify-center text-sm text-[var(--text-muted)]"
						>
							…
						</span>
					) : (
						<PageButton
							key={p}
							active={p === page}
							onClick={() => onPageChange(p)}
							label={String(p)}
						/>
					),
				)}
				<PageButton
					disabled={page >= pages}
					onClick={() => onPageChange(page + 1)}
					label={dict.next}
				/>
			</div>

			<div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
				<span>{dict.rowsPerPage}</span>
				<Select
					value={String(limit)}
					onValueChange={(value) => onLimitChange(Number(value))}
				>
					<SelectTrigger
						size="sm"
						aria-label={dict.rowsPerPage}
						className="text-xs"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZES.map((s) => (
							<SelectItem key={s} value={String(s)}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

interface PageButtonProps {
	label: string;
	active?: boolean;
	disabled?: boolean;
	onClick: () => void;
}

const PageButton: FC<PageButtonProps> = ({
	label,
	active,
	disabled,
	onClick,
}) => (
	<button
		type="button"
		disabled={disabled}
		onClick={onClick}
		className={cn(
			"w-8 h-8 rounded-md border text-sm font-medium flex items-center justify-center transition-colors",
			active
				? "bg-[var(--accent)] text-[var(--accent-on)] border-[var(--accent)]"
				: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] hover:border-[var(--border-hover)]",
			disabled && "opacity-40 cursor-not-allowed",
		)}
	>
		{label}
	</button>
);
