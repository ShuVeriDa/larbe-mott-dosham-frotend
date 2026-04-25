"use client";

import type { PipelineStatusDictionary } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { AdminErrorState, AdminTableSkeleton } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatNumber } from "../lib/format-bytes";

type RowStatus = "parsed" | "pending" | "running" | "error" | "merged";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["dictionaries"];
	commonDict: Dictionary["admin"]["common"];
	dictionaries: PipelineStatusDictionary[];
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
	onRefresh: () => void;
	onRun: (slug: string) => void;
	runningSlug: string | null;
	disabled: boolean;
}

const STATUS_CLASS: Record<RowStatus, { dot: string; text: string }> = {
	parsed: { dot: "bg-[var(--success)]", text: "text-[var(--success)]" },
	merged: { dot: "bg-[var(--success)]", text: "text-[var(--success)]" },
	pending: { dot: "bg-[var(--text-muted)]", text: "text-[var(--text-muted)]" },
	running: {
		dot: "bg-[var(--accent)] animate-pulse",
		text: "text-[var(--accent)]",
	},
	error: { dot: "bg-[var(--danger)]", text: "text-[var(--danger)]" },
};

const statusKey = (
	status: PipelineStatusDictionary["status"],
	isRunning: boolean,
): RowStatus => (isRunning ? "running" : status);

export const ParseDictTable: FC<Props> = ({
	dict,
	commonDict,
	dictionaries,
	isLoading,
	isError,
	onRetry,
	onRefresh,
	onRun,
	runningSlug,
	disabled,
}) => (
	<section aria-labelledby="parse-dict-heading" className="mb-8">
		<header className="flex items-center justify-between gap-4 mb-4 flex-wrap">
			<h2
				id="parse-dict-heading"
				className="text-lg font-semibold text-[var(--text)]"
			>
				{dict.title}
			</h2>
			<button
				type="button"
				onClick={onRefresh}
				className="btn btn-ghost btn-sm"
			>
				{dict.refresh}
			</button>
		</header>

		{isLoading ? (
			<AdminTableSkeleton rows={8} />
		) : isError ? (
			<AdminErrorState
				title={commonDict.error}
				retryLabel={commonDict.retry}
				onRetry={onRetry}
			/>
		) : !dictionaries.length ? (
			<div className="text-sm text-[var(--text-muted)] text-center py-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
				{dict.empty}
			</div>
		) : (
			<div
				role="table"
				className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg)]"
			>
				<div
					role="row"
					className="grid grid-cols-[40px_1fr_96px_100px_96px_96px] gap-3 px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)]"
				>
					<div role="columnheader" className="text-center">
						{dict.columns.number}
					</div>
					<div role="columnheader">{dict.columns.name}</div>
					<div role="columnheader" className="hidden sm:block text-center">
						{dict.columns.direction}
					</div>
					<div role="columnheader" className="text-right">
						{dict.columns.records}
					</div>
					<div role="columnheader">{dict.columns.status}</div>
					<div role="columnheader" className="text-right hidden sm:block">
						{dict.columns.actions}
					</div>
				</div>

				{dictionaries.map((item, index) => {
					const isRunning = runningSlug === item.slug;
					const s = statusKey(item.status, isRunning);
					return (
						<div
							key={item.slug}
							role="row"
							className="grid grid-cols-[40px_1fr_96px_100px_96px_96px] gap-3 items-center px-4 py-3 text-sm border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors"
						>
							<div
								role="cell"
								className="text-xs text-[var(--text-faint)] tabular-nums text-center"
							>
								{index + 1}
							</div>
							<div role="cell" className="min-w-0">
								<div className="font-medium text-[var(--text)] truncate">
									{item.title}
								</div>
								<div className="text-xs text-[var(--text-muted)] font-mono truncate">
									{item.slug}
								</div>
							</div>
							<div
								role="cell"
								className="hidden sm:block text-center text-xs"
							>
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[var(--surface-active)] text-[var(--text-muted)] font-medium">
									{dict.directions[item.direction] ?? item.direction}
								</span>
							</div>
							<div
								role="cell"
								className="text-right tabular-nums font-medium text-[var(--text)]"
							>
								{item.count !== null && item.count > 0
									? formatNumber(item.count)
									: "—"}
							</div>
							<div role="cell">
								<span
									className={cn(
										"inline-flex items-center gap-1 text-xs font-medium",
										STATUS_CLASS[s].text,
									)}
								>
									<span
										className={cn("w-1.5 h-1.5 rounded-full", STATUS_CLASS[s].dot)}
										aria-hidden
									/>
									{dict.statuses[s]}
								</span>
							</div>
							<div role="cell" className="justify-self-end">
								<button
									type="button"
									onClick={() => onRun(item.slug)}
									disabled={disabled}
									className={cn(
										"btn btn-sm disabled:opacity-40 h-7 px-3 text-xs",
										s === "pending" ? "btn-primary" : "btn-secondary",
									)}
									aria-label={`${dict.action} ${item.slug}`}
								>
									{dict.action}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		)}
	</section>
);
