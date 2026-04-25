"use client";

import type { AnalyticsTopItem } from "@/features/admin-analytics";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { colorForKey, formatNumber, initialFor } from "../lib/format";

import type { Locale } from "@/i18n/dictionaries";

export type TopListVariant = "pages" | "referrers";

interface TopListProps {
	title: string;
	viewAllLabel: string;
	viewAllHref: string;
	emptyLabel: string;
	items: AnalyticsTopItem[];
	totalForPercent: number;
	variant: TopListVariant;
	directLabel?: string;
	loading?: boolean;
	skeleton?: ReactNode;
	lang: Locale;
}

const cleanHost = (host: string) =>
	host.replace(/^https?:\/\//i, "").replace(/^www\./i, "");

const buildHref = (variant: TopListVariant, key: string): string => {
	if (variant === "referrers") {
		if (!key || key === "(direct)") return "#";
		return `https://${cleanHost(key)}`;
	}
	return key.startsWith("/") ? key : `/${key}`;
};

const isExternal = (variant: TopListVariant, key: string): boolean =>
	variant === "referrers" && key !== "(direct)" && key.length > 0;

export const TopList: FC<TopListProps> = ({
	title,
	viewAllLabel,
	viewAllHref,
	emptyLabel,
	items,
	totalForPercent,
	variant,
	directLabel,
	loading,
	skeleton,
	lang,
}) => {
	const maxCount = items.reduce((m, r) => Math.max(m, r.count), 0) || 1;

	return (
		<div
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5",
			)}
		>
			<div className="flex justify-between items-center gap-3 mb-4">
				<div className="text-base font-semibold text-[var(--text)]">
					{title}
				</div>
				<Link
					href={viewAllHref}
					className="text-xs font-medium text-[var(--accent)] hover:underline"
				>
					{viewAllLabel}
				</Link>
			</div>

			{loading && items.length === 0 ? (
				skeleton ?? (
					<div className="flex flex-col gap-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="h-9 rounded-md bg-[var(--surface-hover)] animate-pulse"
							/>
						))}
					</div>
				)
			) : items.length === 0 ? (
				<div className="text-sm text-[var(--text-muted)] py-6 text-center">
					{emptyLabel}
				</div>
			) : (
				<ul className="flex flex-col gap-1">
					{items.map((row) => {
						const isDirect = variant === "referrers" && row.key === "(direct)";
						const displayKey = isDirect && directLabel ? directLabel : row.key;
						const widthPct = Math.max(
							2,
							Math.round((row.count / maxCount) * 100),
						);
						const pct =
							totalForPercent > 0
								? Math.round((row.count / totalForPercent) * 100)
								: 0;
						const href = buildHref(variant, row.key);
						const external = isExternal(variant, row.key);

						const inner = (
							<>
								<div
									className="absolute top-0 bottom-0 left-0 bg-[var(--accent-dim)] border-r-2 border-[var(--accent)] rounded-md transition-[width] duration-700"
									style={{ width: `${widthPct}%` }}
									aria-hidden="true"
								/>
								<div className="relative z-10 flex items-center gap-2 min-w-0 text-sm font-medium text-[var(--text)] truncate">
									{variant === "referrers" ? (
										<FaviconCell host={isDirect ? "" : row.key} />
									) : null}
									<span className="truncate">{displayKey}</span>
								</div>
								<div className="relative z-10 flex items-baseline gap-2 text-xs font-semibold text-[var(--text-secondary)] tabular-nums">
									<span>{formatNumber(row.count, lang)}</span>
									<span className="text-[0.65rem] font-normal text-[var(--text-muted)]">
										{pct}%
									</span>
								</div>
							</>
						);

						const className = cn(
							"relative grid grid-cols-[1fr_auto] items-center gap-3",
							"px-3 py-2 rounded-md overflow-hidden",
							"hover:bg-[var(--surface-hover)] transition-colors",
						);

						return (
							<li key={`${row.key}-${row.count}`}>
								{external ? (
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer nofollow"
										className={className}
									>
										{inner}
									</a>
								) : variant === "referrers" && isDirect ? (
									<div className={className}>{inner}</div>
								) : (
									<Link href={href} className={className}>
										{inner}
									</Link>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

interface FaviconCellProps {
	host: string;
}

const FaviconCell: FC<FaviconCellProps> = ({ host }) => {
	if (!host) {
		return (
			<span
				aria-hidden="true"
				className="w-4 h-4 rounded-sm flex items-center justify-center text-[0.7rem] font-semibold text-[var(--text-muted)] bg-[var(--surface-active)] flex-shrink-0"
			>
				⇣
			</span>
		);
	}
	const cleaned = cleanHost(host);
	const initial = initialFor(cleaned);
	const color = colorForKey(cleaned);
	return (
		<span
			aria-hidden="true"
			className="w-4 h-4 rounded-sm flex items-center justify-center text-[0.65rem] font-semibold text-white flex-shrink-0"
			style={{ background: color }}
		>
			{initial}
		</span>
	);
};
