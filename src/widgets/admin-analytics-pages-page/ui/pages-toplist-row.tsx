"use client";

import type { AnalyticsPageItem } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";
import {
	formatPagesNumber,
	formatPagesPct,
	isExternalPath,
} from "../lib/format-pages";

interface PagesToplistRowProps {
	item: AnalyticsPageItem;
	rank: number;
	maxCount: number;
	totalPageviews: number;
	lang: Locale;
	dict: Dictionary["admin"]["analyticsPages"]["toplist"];
}

export const PagesToplistRow: FC<PagesToplistRowProps> = ({
	item,
	rank,
	maxCount,
	totalPageviews,
	lang,
	dict,
}) => {
	const barWidth = Math.max(
		0,
		Math.min(100, (item.count / Math.max(maxCount, 1)) * 100),
	);
	const pct = formatPagesPct(item.count, totalPageviews);
	const count = formatPagesNumber(item.count, lang);
	const external = isExternalPath(item.key);

	return (
		<div
			className={cn(
				"relative grid items-center gap-3 px-3 py-3 rounded-md overflow-hidden",
				"transition-colors hover:bg-[var(--surface-hover)]",
				"grid-cols-[24px_1fr_auto_auto] sm:grid-cols-[32px_1fr_auto_auto_80px]",
			)}
			style={{ minHeight: 44 }}
		>
			<div
				aria-hidden="true"
				className={cn(
					"absolute top-[3px] bottom-[3px] left-[3px] z-0 pointer-events-none",
					"bg-[var(--accent-dim)] border-r-2 border-[var(--accent)]",
					"rounded-l-sm transition-[width] duration-700 ease-out",
				)}
				style={{ width: `${barWidth}%` }}
			/>
			<div
				className={cn(
					"relative z-[1] text-xs font-mono font-semibold tabular-nums",
					"text-[var(--text-faint)]",
				)}
			>
				#{String(rank).padStart(2, "0")}
			</div>
			<div
				className={cn(
					"relative z-[1] text-sm font-medium font-mono",
					"text-[var(--text)] overflow-hidden text-ellipsis whitespace-nowrap",
				)}
				title={item.key}
			>
				{item.key}
			</div>
			<div
				className={cn(
					"relative z-[1] text-xs tabular-nums text-right",
					"text-[var(--text-muted)] hidden sm:block min-w-[48px]",
				)}
			>
				{pct}
			</div>
			<div
				className={cn(
					"relative z-[1] text-sm font-semibold tabular-nums text-right",
					"text-[var(--text)] min-w-[70px]",
				)}
			>
				{count}
			</div>
			<div className="relative z-[1] hidden sm:flex justify-end">
				{external ? (
					<a
						href={item.key}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={dict.openExternal}
						title={dict.openExternal}
						className={cn(
							"inline-flex items-center justify-center w-7 h-7 rounded-sm",
							"bg-transparent border border-[var(--border)] text-[var(--text-muted)]",
							"hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]",
							"transition-all",
						)}
					>
						↗
					</a>
				) : (
					<Link
						href={`/${lang}${item.key.startsWith("/") ? item.key : `/${item.key}`}`}
						target="_blank"
						aria-label={dict.openInternal}
						title={dict.openInternal}
						className={cn(
							"inline-flex items-center justify-center w-7 h-7 rounded-sm",
							"bg-transparent border border-[var(--border)] text-[var(--text-muted)]",
							"hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]",
							"transition-all",
						)}
					>
						↗
					</Link>
				)}
			</div>
		</div>
	);
};
