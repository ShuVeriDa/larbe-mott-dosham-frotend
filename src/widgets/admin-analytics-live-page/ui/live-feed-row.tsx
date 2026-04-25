"use client";

import type { AnalyticsLiveEvent } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC, KeyboardEvent, MouseEvent } from "react";
import {
	countryCodeToFlag,
	deviceIcon,
	eventBadgeClass,
	eventDisplayPath,
	formatLiveTime,
} from "../lib/format-live";

interface LiveFeedRowProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsLive"]["table"];
	event: AnalyticsLiveEvent & { just?: boolean };
	onSelect: (event: AnalyticsLiveEvent) => void;
}

const PathOrQuery: FC<{
	event: AnalyticsLiveEvent;
	dict: Dictionary["admin"]["analyticsLive"]["table"];
}> = ({ event, dict }) => {
	if (event.eventType === "search") {
		const m = event.metadata ?? {};
		const query = typeof m.query === "string" ? m.query : "—";
		const count =
			typeof m.resultsCount === "number" ? m.resultsCount : null;
		return (
			<>
				<span className="rounded-[var(--radius-xs)] bg-[var(--surface-active)] px-1.5 py-0.5 font-semibold text-[var(--text)]">
					&quot;{query}&quot;
				</span>{" "}
				<span className="text-[var(--text-faint)]">
					· {count ?? "?"} {dict.searchResultsShort}
				</span>
			</>
		);
	}
	const path = eventDisplayPath(event);
	if (path) return <span>{path}</span>;
	return <span className="text-[var(--text-faint)]">—</span>;
};

export const LiveFeedRow: FC<LiveFeedRowProps> = ({
	lang,
	dict,
	event,
	onSelect,
}) => {
	const handleKey = (e: KeyboardEvent<HTMLTableRowElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelect(event);
		}
	};

	const stop = (e: MouseEvent) => e.stopPropagation();
	const flag = countryCodeToFlag(event.country);

	return (
		<tr
			role="button"
			tabIndex={0}
			aria-label={`${event.eventType} · ${formatLiveTime(event.createdAt, lang)}`}
			onClick={() => onSelect(event)}
			onKeyDown={handleKey}
			className={cn(
				"cursor-pointer border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-hover)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
				event.just && "motion-safe:animate-[flashNew_1.5s_ease-out]",
			)}
		>
			<td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--text-muted)] font-mono">
				{formatLiveTime(event.createdAt, lang)}
			</td>
			<td className="px-4 py-3 w-[140px]">
				<span
					className={cn(
						"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
						eventBadgeClass(event.eventType),
					)}
				>
					{event.eventType}
				</span>
			</td>
			<td className="max-w-[320px] truncate px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
				<PathOrQuery event={event} dict={dict} />
			</td>
			<td className="hidden md:table-cell w-[140px] px-4 py-3 text-xs text-[var(--text-muted)]">
				<span className="mr-1" aria-hidden="true">
					{deviceIcon(event.device)}
				</span>
				{event.device ?? "—"}
				{event.browser ? ` · ${event.browser}` : ""}
			</td>
			<td className="hidden md:table-cell w-[60px] px-4 py-3 text-center">
				<span
					className="text-base leading-none"
					title={event.country ?? "—"}
					aria-label={event.country ?? dict.countryUnknown}
				>
					{flag}
				</span>
			</td>
			<td className="hidden sm:table-cell w-[120px] px-4 py-3">
				{event.userId ? (
					<Link
						href={`/admin/users/${event.userId}`}
						onClick={stop}
						title={event.user?.name ?? event.user?.username ?? event.userId}
						className="inline-flex max-w-[100px] items-center gap-1 truncate rounded-[var(--radius-xs)] bg-[var(--accent-dim)] px-1.5 py-0.5 text-[0.65rem] font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-on)]"
					>
						@{event.user?.username ?? event.user?.name ?? event.userId}
					</Link>
				) : (
					<span className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-[var(--surface-active)] px-1.5 py-0.5 text-[0.65rem] italic text-[var(--text-muted)]">
						{dict.anonymous}
					</span>
				)}
			</td>
		</tr>
	);
};
