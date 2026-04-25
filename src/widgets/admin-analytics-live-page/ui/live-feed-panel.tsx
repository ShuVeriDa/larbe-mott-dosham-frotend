"use client";

import type { AnalyticsLiveEvent } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatLiveTime } from "../lib/format-live";
import { LiveFeedRow } from "./live-feed-row";

interface LiveFeedPanelProps {
	lang: Locale;
	dict: Dictionary["admin"]["analyticsLive"];
	events: Array<AnalyticsLiveEvent & { just?: boolean }>;
	visibleCount: number;
	paused: boolean;
	lastUpdate: Date | null;
	isInitialLoading: boolean;
	hasError: boolean;
	onSelect: (event: AnalyticsLiveEvent) => void;
	onRetry: () => void;
}

const interpolate = (template: string, values: Record<string, string>) =>
	template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

export const LiveFeedPanel: FC<LiveFeedPanelProps> = ({
	lang,
	dict,
	events,
	visibleCount,
	paused,
	lastUpdate,
	isInitialLoading,
	hasError,
	onSelect,
	onRetry,
}) => {
	const visible = events;
	const lastUpdateLabel = lastUpdate ? formatLiveTime(lastUpdate.toISOString(), lang) : "—";
	const streamStatus = paused ? dict.footer.streamPaused : dict.footer.streamActive;
	const showEmpty = !isInitialLoading && !hasError && visible.length === 0;

	return (
		<section
			aria-label={dict.header.title}
			className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
		>
			<header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
				<span>
					<span className="text-[var(--accent)]" aria-hidden="true">
						●
					</span>{" "}
					{dict.footer.streamLabel}: {streamStatus} · {dict.footer.lastUpdate}{" "}
					<span className="tabular-nums text-[var(--text)]">{lastUpdateLabel}</span>
				</span>
				<span>
					{dict.footer.shownLabel}:{" "}
					<span className="tabular-nums text-[var(--text)]">{visibleCount}</span>
				</span>
			</header>

			<div className="max-h-[70vh] overflow-y-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr>
							<th
								scope="col"
								className="sticky top-0 z-[2] whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
							>
								{dict.table.time}
							</th>
							<th
								scope="col"
								className="sticky top-0 z-[2] whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
							>
								{dict.table.event}
							</th>
							<th
								scope="col"
								className="sticky top-0 z-[2] whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
							>
								{dict.table.path}
							</th>
							<th
								scope="col"
								className="sticky top-0 z-[2] hidden md:table-cell whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
							>
								{dict.table.device}
							</th>
							<th
								scope="col"
								className="sticky top-0 z-[2] hidden md:table-cell whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
							>
								{dict.table.country}
							</th>
							<th
								scope="col"
								className="sticky top-0 z-[2] hidden sm:table-cell whitespace-nowrap border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
							>
								{dict.table.user}
							</th>
						</tr>
					</thead>
					<tbody role="log" aria-live={paused ? "off" : "polite"}>
						{visible.map((ev) => (
							<LiveFeedRow
								key={ev.id}
								lang={lang}
								dict={dict.table}
								event={ev}
								onSelect={onSelect}
							/>
						))}
					</tbody>
				</table>

				{isInitialLoading ? (
					<div className="px-12 py-12 text-center text-sm text-[var(--text-muted)]">
						{dict.states.loading}
					</div>
				) : null}

				{hasError ? (
					<div className="px-12 py-12 text-center">
						<div className="mb-3 text-3xl opacity-40" aria-hidden="true">
							⚠
						</div>
						<div className="mb-1 font-semibold text-[var(--text)]">
							{dict.states.errorTitle}
						</div>
						<div className="mb-4 text-sm text-[var(--text-muted)]">
							{dict.states.errorText}
						</div>
						<button
							type="button"
							onClick={onRetry}
							className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--text)] hover:border-[var(--border-hover)]"
						>
							{dict.states.retry}
						</button>
					</div>
				) : null}

				{showEmpty ? (
					<div className="px-12 py-12 text-center text-[var(--text-muted)]">
						<div className="mb-3 text-3xl opacity-40" aria-hidden="true">
							⏸
						</div>
						<div className="mb-1 font-semibold text-[var(--text)]">
							{dict.states.emptyTitle}
						</div>
						<div className="text-sm">{dict.states.emptyText}</div>
					</div>
				) : null}
			</div>
		</section>
	);
};

LiveFeedPanel.displayName = "LiveFeedPanel";

export { interpolate };
