"use client";

import {
	useUnifiedLog,
	useUnifyStatus,
} from "@/features/admin-pipeline-unify";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { AdminErrorState, AdminTableSkeleton } from "@/shared/ui/admin";
import type { FC } from "react";
import { toast } from "sonner";
import { formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	commonDict: Dictionary["admin"]["common"];
	lang: Locale;
	runningSlug: string | null;
	onRun: (slug: string) => void;
}

type RowStatus = "merged" | "pending" | "notParsed" | "running";

const STATUS_TONE: Record<RowStatus, string> = {
	merged: "text-[var(--success)]",
	pending: "text-[var(--text-muted)]",
	notParsed: "text-[var(--text-muted)]",
	running: "text-[var(--accent)]",
};
const DOT_TONE: Record<RowStatus, string> = {
	merged: "bg-[var(--success)]",
	pending: "bg-[var(--text-muted)]",
	notParsed: "bg-[var(--text-faint)]",
	running: "bg-[var(--accent)] animate-pulse",
};

export const UnifyDictTable: FC<Props> = ({
	dict,
	commonDict,
	lang,
	runningSlug,
	onRun,
}) => {
	const statusQuery = useUnifyStatus();
	const logQuery = useUnifiedLog();

	const isLoading = statusQuery.isLoading || logQuery.isLoading;
	const isError = statusQuery.isError || logQuery.isError;

	const parsedBySlug = new Map(
		statusQuery.data?.parsed.bySlug.map((d) => [d.slug, d]) ?? [],
	);
	const stepsBySlug = new Map(
		logQuery.data?.steps.map((s) => [s.slug, s]) ?? [],
	);
	const orderedSlugs = [
		...(logQuery.data?.steps.map((s) => ({ slug: s.slug, title: s.title })) ??
			[]),
		...(logQuery.data?.remaining ?? []),
	];

	return (
		<section className="mb-8">
			<div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.table.title}
				</h2>
				<button
					type="button"
					onClick={() => {
						void statusQuery.refetch();
						void logQuery.refetch();
						toast.info(dict.toast.logRefreshed);
					}}
					className="btn btn-sm btn-ghost"
				>
					{dict.table.refresh}
				</button>
			</div>

			{isLoading ? (
				<AdminTableSkeleton rows={8} />
			) : isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => {
						void statusQuery.refetch();
						void logQuery.refetch();
					}}
				/>
			) : (
				<div className="overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border)]">
								<th scope="col" className="text-center px-3 py-2 w-10">
									{dict.table.cols.num}
								</th>
								<th scope="col" className="text-left px-3 py-2">
									{dict.table.cols.dictionary}
								</th>
								<th scope="col" className="text-right px-3 py-2">
									{dict.table.cols.fromDict}
								</th>
								<th scope="col" className="text-right px-3 py-2">
									{dict.table.cols.new}
								</th>
								<th
									scope="col"
									className="text-right px-3 py-2 hidden lg:table-cell"
								>
									{dict.table.cols.enriched}
								</th>
								<th
									scope="col"
									className="text-right px-3 py-2 hidden lg:table-cell"
								>
									{dict.table.cols.dup}
								</th>
								<th scope="col" className="text-left px-3 py-2">
									{dict.table.cols.status}
								</th>
								<th
									scope="col"
									className="text-right px-3 py-2 hidden md:table-cell"
								>
									{dict.table.cols.action}
								</th>
							</tr>
						</thead>
						<tbody>
							{orderedSlugs.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="text-center text-sm text-[var(--text-muted)] py-6"
									>
										{dict.table.empty}
									</td>
								</tr>
							) : (
								orderedSlugs.map((item, idx) => {
									const step = stepsBySlug.get(item.slug);
									const parsed = parsedBySlug.get(item.slug);
									const isRunning = runningSlug === item.slug;
									const rowStatus: RowStatus = isRunning
										? "running"
										: step
											? "merged"
											: parsed && parsed.count !== null
												? "pending"
												: "notParsed";

									const dupes =
										step && step.entriesFromDict
											? step.entriesFromDict - step.newWords - step.enrichedWords
											: null;

									const canRun =
										!step &&
										rowStatus !== "notParsed" &&
										rowStatus !== "running";

									return (
										<tr
											key={item.slug}
											className="border-t border-[var(--border)] hover:bg-[var(--surface-hover)]"
										>
											<td className="text-center px-3 py-3 text-xs text-[var(--text-faint)] tabular-nums">
												{idx + 1}
											</td>
											<td className="px-3 py-3 min-w-0">
												<div className="text-sm font-medium text-[var(--text)] truncate">
													{item.title}
												</div>
												<div className="text-xs text-[var(--text-muted)] font-mono">
													{item.slug}
												</div>
											</td>
											<td className="px-3 py-3 text-right text-xs text-[var(--text-muted)] tabular-nums">
												{step
													? formatNumber(step.entriesFromDict, lang)
													: parsed?.count !== null && parsed?.count !== undefined
														? formatNumber(parsed.count, lang)
														: "—"}
											</td>
											<td className="px-3 py-3 text-right text-xs tabular-nums text-[var(--success)] font-semibold">
												{step ? formatNumber(step.newWords, lang) : "—"}
											</td>
											<td className="px-3 py-3 text-right text-xs tabular-nums text-[var(--info)] hidden lg:table-cell">
												{step ? formatNumber(step.enrichedWords, lang) : "—"}
											</td>
											<td className="px-3 py-3 text-right text-xs tabular-nums text-[var(--warning)] hidden lg:table-cell">
												{dupes !== null ? formatNumber(Math.max(0, dupes), lang) : "—"}
											</td>
											<td className="px-3 py-3">
												<span
													className={cn(
														"inline-flex items-center gap-1.5 text-xs font-medium",
														STATUS_TONE[rowStatus],
													)}
												>
													<span
														className={cn(
															"w-1.5 h-1.5 rounded-full",
															DOT_TONE[rowStatus],
														)}
														aria-hidden
													/>
													{rowStatus === "merged"
														? dict.table.status.merged.replace(
																"{step}",
																String(step?.step ?? "?"),
															)
														: rowStatus === "running"
															? dict.table.status.running
															: rowStatus === "notParsed"
																? dict.table.status.notParsed
																: dict.table.status.pending}
												</span>
											</td>
											<td className="px-3 py-3 text-right hidden md:table-cell">
												{step ? (
													<span
														className="text-xs text-[var(--text-faint)]"
														title={dict.table.reUnifyHint}
													>
														✓
													</span>
												) : canRun ? (
													<button
														type="button"
														onClick={() => onRun(item.slug)}
														disabled={runningSlug !== null}
														className="btn btn-sm btn-primary disabled:opacity-40"
													>
														{dict.table.merge}
													</button>
												) : (
													<button
														type="button"
														disabled
														className="btn btn-sm btn-secondary opacity-40"
													>
														{dict.table.merge}
													</button>
												)}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};
