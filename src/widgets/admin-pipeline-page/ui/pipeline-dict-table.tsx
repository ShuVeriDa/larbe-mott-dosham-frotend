"use client";

import {
	type PipelineDictStatus,
	usePipelineDictionaries,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { AdminErrorState, AdminTableSkeleton } from "@/shared/ui/admin";
import type { FC } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { formatNumber } from "../lib/format-relative-time";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
	actions: UsePipelineActions;
}

const STATUS_DOT: Record<PipelineDictStatus, string> = {
	merged: "bg-[var(--accent)] text-[var(--accent)]",
	parsed: "bg-[var(--success)] text-[var(--success)]",
	pending: "bg-[var(--text-muted)] text-[var(--text-muted)]",
	running: "bg-[var(--info)] text-[var(--info)]",
	error: "bg-[var(--danger)] text-[var(--danger)]",
};

export const PipelineDictTable: FC<Props> = ({ dict, commonDict, actions }) => {
	const query = usePipelineDictionaries();

	return (
		<section aria-labelledby="pipeline-dict-heading" className="mb-8">
			<h2
				id="pipeline-dict-heading"
				className="text-lg font-semibold text-[var(--text)] mb-4"
			>
				{dict.sections.dictionaries}
			</h2>

			{query.isLoading ? (
				<AdminTableSkeleton rows={6} />
			) : query.isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => query.refetch()}
				/>
			) : !query.data?.length ? (
				<div className="text-sm text-[var(--text-muted)] text-center py-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
					{dict.dictionaries.empty}
				</div>
			) : (
				<div
					className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface)]"
					role="table"
				>
					<div
						role="row"
						className="grid grid-cols-[40px_1fr_100px_100px_90px_90px] gap-3 px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--surface)]"
					>
						<div role="columnheader">{dict.dictionaries.columns.number}</div>
						<div role="columnheader">{dict.dictionaries.columns.name}</div>
						<div role="columnheader" className="hidden sm:block">
							{dict.dictionaries.columns.direction}
						</div>
						<div role="columnheader" className="text-right">
							{dict.dictionaries.columns.records}
						</div>
						<div role="columnheader">{dict.dictionaries.columns.status}</div>
						<div role="columnheader" className="sr-only">
							{dict.dictionaries.columns.actions || "actions"}
						</div>
					</div>

					{query.data.map((item, index) => (
						<div
							key={item.slug}
							role="row"
							className="grid grid-cols-[40px_1fr_100px_100px_90px_90px] gap-3 items-center px-4 py-3 text-sm border-b border-[var(--border)] last:border-b-0 bg-[var(--bg)] hover:bg-[var(--surface-hover)] transition-colors"
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
								className="text-xs text-[var(--text-muted)] hidden sm:block"
							>
								{dict.dictionaries.directions[item.direction] ??
									item.direction}
							</div>
							<div
								role="cell"
								className="text-right tabular-nums font-medium text-[var(--text)]"
							>
								{item.recordCount > 0
									? formatNumber(item.recordCount)
									: "—"}
							</div>
							<div role="cell">
								<span
									className={cn(
										"inline-flex items-center gap-1 text-xs font-medium",
										STATUS_DOT[item.status].split(" ")[1],
									)}
								>
									<span
										className={cn(
											"w-1.5 h-1.5 rounded-full",
											STATUS_DOT[item.status].split(" ")[0],
										)}
										aria-hidden
									/>
									{dict.dictionaries.statuses[item.status]}
								</span>
							</div>
							<div role="cell" className="justify-self-end">
								<button
									type="button"
									aria-label={dict.dictionaries.actionRun}
									onClick={() => actions.runParse(item.slug)}
									disabled={actions.isRunning}
									className="btn btn-sm btn-ghost disabled:opacity-40"
									title={
										item.status === "pending"
											? dict.dictionaries.actionRun
											: dict.dictionaries.actionReparse
									}
								>
									{item.status === "pending" ? "▶" : "↻"}
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
};
