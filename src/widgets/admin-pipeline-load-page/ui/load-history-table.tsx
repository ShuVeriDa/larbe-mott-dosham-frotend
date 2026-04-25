"use client";

import { useLoadHistory } from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatHistoryDate, formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"];
	lang: Locale;
}

export const LoadHistoryTable: FC<Props> = ({ dict, lang }) => {
	const query = useLoadHistory(20);
	const items = query.data ?? [];

	return (
		<section className="mb-8">
			<header className="mb-4">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.history.title}
				</h2>
			</header>
			<div className="grid grid-cols-1 gap-px bg-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<div
					className={cn(
						"grid items-center gap-3 px-4 py-2 bg-[var(--surface)] text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider",
						"grid-cols-[120px_80px_70px_1fr] sm:grid-cols-[160px_90px_80px_90px_1fr]",
					)}
				>
					<div>{dict.history.cols.date}</div>
					<div className="tabular-nums">{dict.history.cols.loaded}</div>
					<div className="tabular-nums">{dict.history.cols.skipped}</div>
					<div className="hidden sm:block">{dict.history.cols.elapsed}</div>
					<div>{dict.history.cols.status}</div>
				</div>

				{query.isLoading && items.length === 0 ? (
					<div className="px-4 py-8 bg-[var(--bg)] text-sm text-[var(--text-muted)] text-center">
						…
					</div>
				) : items.length === 0 ? (
					<div className="px-4 py-8 bg-[var(--bg)] text-sm text-[var(--text-muted)] text-center">
						{dict.history.empty}
					</div>
				) : (
					items.map((row) => {
						const isOk = row.status === "ok";
						const statusText = isOk
							? dict.history.statusOk
							: row.errorMessage
								? dict.history.errorPrefix.replace(
										"{message}",
										row.errorMessage,
									)
								: dict.history.statusErr;
						return (
							<div
								key={row.id}
								className={cn(
									"grid items-center gap-3 px-4 py-3 bg-[var(--bg)] text-sm hover:bg-[var(--surface-hover)]",
									"grid-cols-[120px_80px_70px_1fr] sm:grid-cols-[160px_90px_80px_90px_1fr]",
								)}
							>
								<div className="text-xs text-[var(--text-muted)] truncate">
									{formatHistoryDate(row.createdAt, lang)}
								</div>
								<div
									className={cn(
										"text-xs font-semibold tabular-nums",
										isOk ? "text-[var(--success)]" : "text-[var(--text-muted)]",
									)}
								>
									{formatNumber(row.loaded, lang)}
								</div>
								<div className="text-xs font-medium tabular-nums text-[var(--warning)]">
									{formatNumber(row.skipped, lang)}
								</div>
								<div className="hidden sm:block text-xs text-[var(--text-muted)] font-mono">
									{row.elapsedSeconds.toFixed(1)} {dict.units.sec}
								</div>
								<div>
									<span
										className={cn(
											"inline-flex items-center gap-1 text-xs font-medium",
											isOk ? "text-[var(--success)]" : "text-[var(--danger)]",
										)}
									>
										<span
											className={cn(
												"w-1.5 h-1.5 rounded-full",
												isOk ? "bg-[var(--success)]" : "bg-[var(--danger)]",
											)}
											aria-hidden
										/>
										<span className="truncate">{statusText}</span>
									</span>
								</div>
							</div>
						);
					})
				)}
			</div>
		</section>
	);
};
