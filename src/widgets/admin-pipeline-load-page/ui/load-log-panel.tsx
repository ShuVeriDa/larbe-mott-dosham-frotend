"use client";

import {
	type PipelineLogLevel,
	useClearPipelineOperationLog,
	usePipelineOperationLog,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";
import { formatTime } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"]["log"];
	lang: Locale;
}

const LEVEL_CLASS: Record<PipelineLogLevel, string> = {
	info: "text-[var(--info)]",
	ok: "text-[var(--success)]",
	warn: "text-[var(--warning)]",
	err: "text-[var(--danger)]",
};

export const LoadLogPanel: FC<Props> = ({ dict, lang }) => {
	const query = usePipelineOperationLog();
	const clearMutation = useClearPipelineOperationLog();

	const items = (query.data ?? []).filter(
		(entry) => entry.operation === "load" || entry.operation === "load-error",
	);

	const onClear = async () => {
		try {
			await clearMutation.mutateAsync();
			toast.info(dict.cleared);
		} catch {
			/* swallow — toast already not shown */
		}
	};

	return (
		<section className="mb-8">
			<header className="flex items-center justify-between gap-3 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.title}
				</h2>
				<button
					type="button"
					onClick={() => void onClear()}
					disabled={clearMutation.isPending || items.length === 0}
					className="btn btn-sm btn-ghost disabled:opacity-40"
				>
					{dict.clear}
				</button>
			</header>
			<div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<div className="px-5 py-4 border-b border-[var(--border)]">
					<div className="text-sm font-semibold text-[var(--text)]">
						{dict.subtitle}
					</div>
				</div>
				<div className="max-h-[300px] overflow-y-auto px-5 py-3">
					{items.length === 0 ? (
						<div className="py-6 text-center text-sm text-[var(--text-muted)]">
							{dict.empty}
						</div>
					) : (
						<ul className="font-mono text-xs">
							{items.map((entry, idx) => (
								<li
									key={`${entry.timestamp}-${idx}`}
									className="flex items-start gap-3 py-2 border-t border-[var(--border)] first:border-t-0"
								>
									<span className="text-[var(--text-faint)] shrink-0 min-w-[62px]">
										{formatTime(entry.timestamp, lang)}
									</span>
									<span
										className={cn(
											"shrink-0 font-semibold min-w-[42px] uppercase",
											LEVEL_CLASS[entry.level],
										)}
									>
										{entry.level}
									</span>
									<span className="text-[var(--text-secondary)] break-words">
										{entry.message}
										{entry.durationSeconds !== undefined ? (
											<>
												{" "}
												·{" "}
												<span className="text-[var(--text-muted)]">
													{entry.durationSeconds.toFixed(1)}s
												</span>
											</>
										) : null}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
};
