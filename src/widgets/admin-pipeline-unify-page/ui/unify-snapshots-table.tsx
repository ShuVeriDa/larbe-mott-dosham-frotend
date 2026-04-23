"use client";

import { useUnifiedLog } from "@/features/admin-pipeline-unify";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminEmptyState, AdminTableSkeleton } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatNumber, formatSize } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	lang: Locale;
	onRollback: (step: number) => void;
	disabled?: boolean;
}

export const UnifySnapshotsTable: FC<Props> = ({
	dict,
	lang,
	onRollback,
	disabled,
}) => {
	const query = useUnifiedLog();
	const steps = query.data?.steps ?? [];
	const reversed = [...steps].reverse();
	const currentStep = reversed[0]?.step;

	return (
		<section className="mb-8">
			<div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.snapshotsSection.title}
				</h2>
				<span className="text-xs text-[var(--text-muted)]">
					{dict.snapshotsSection.hint}
				</span>
			</div>

			{query.isLoading ? (
				<AdminTableSkeleton rows={4} />
			) : reversed.length === 0 ? (
				<AdminEmptyState
					icon="📦"
					description={dict.snapshotsSection.empty}
				/>
			) : (
				<div className="overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border)]">
								<th scope="col" className="text-center px-3 py-2 w-16">
									{dict.snapshotsSection.cols.step}
								</th>
								<th scope="col" className="text-left px-3 py-2">
									{dict.snapshotsSection.cols.op}
								</th>
								<th scope="col" className="text-right px-3 py-2">
									{dict.snapshotsSection.cols.count}
								</th>
								<th
									scope="col"
									className="text-right px-3 py-2 hidden sm:table-cell"
								>
									{dict.snapshotsSection.cols.size}
								</th>
								<th
									scope="col"
									className="text-right px-3 py-2 hidden md:table-cell"
								>
									{dict.snapshotsSection.cols.action}
								</th>
							</tr>
						</thead>
						<tbody>
							{reversed.map((s) => {
								const isCurrent = s.step === currentStep;
								return (
									<tr
										key={s.step}
										className="border-t border-[var(--border)] hover:bg-[var(--surface-hover)]"
									>
										<td className="text-center px-3 py-3 font-semibold text-[var(--text)] tabular-nums">
											{s.step}
										</td>
										<td className="px-3 py-3 min-w-0">
											<div className="text-sm text-[var(--text)] truncate">
												unify-step{" "}
												<span className="font-mono text-xs text-[var(--text-muted)]">
													{s.slug}
												</span>
											</div>
											{!s.snapshotExists ? (
												<div className="text-[0.65rem] text-[var(--danger)]">
													{dict.snapshotsSection.missing}
												</div>
											) : null}
										</td>
										<td className="px-3 py-3 text-right tabular-nums text-xs text-[var(--text)]">
											{formatNumber(s.totalUnifiedEntries, lang)}
										</td>
										<td className="px-3 py-3 text-right text-xs text-[var(--text-muted)] hidden sm:table-cell">
											{formatSize(s.snapshotSizeMb)} MB
										</td>
										<td className="px-3 py-3 text-right hidden md:table-cell">
											{isCurrent ? (
												<span className="text-xs text-[var(--accent)] font-medium">
													{dict.snapshotsSection.current}
												</span>
											) : (
												<button
													type="button"
													disabled={disabled || !s.snapshotExists}
													onClick={() => onRollback(s.step)}
													className="btn btn-sm btn-ghost disabled:opacity-40"
													aria-label={dict.snapshotsSection.rollback}
												>
													{dict.snapshotsSection.rollback}
												</button>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};
