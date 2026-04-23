"use client";

import {
	type ResetLogLevel,
	useClearResetLog,
	useResetLog,
} from "@/features/admin-pipeline-reset";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";
import { formatTimeHms } from "../lib";

interface ResetLogPanelProps {
	dict: Dictionary["admin"]["pipelineReset"]["log"];
	toastsDict: Dictionary["admin"]["pipelineReset"]["toasts"];
}

const LEVEL_CLASS: Record<ResetLogLevel, string> = {
	info: "text-[var(--info)]",
	ok: "text-[var(--success)]",
	warn: "text-[var(--warning)]",
	error: "text-[var(--danger)]",
};

export const ResetLogPanel: FC<ResetLogPanelProps> = ({
	dict,
	toastsDict,
}) => {
	const logQuery = useResetLog();
	const clearMutation = useClearResetLog();

	const onClear = async () => {
		try {
			await clearMutation.mutateAsync();
			toast.info(toastsDict.logCleared);
		} catch {
			toast.error(toastsDict.error);
		}
	};

	const entries = logQuery.data ?? [];

	return (
		<section className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl overflow-hidden mb-8">
			<header className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
				<div>
					<h2 className="text-sm font-semibold text-[var(--text)]">
						{dict.title}
					</h2>
					<p className="text-xs text-[var(--text-muted)] mt-0.5">
						{dict.subtitle}
					</p>
				</div>
				<button
					type="button"
					onClick={onClear}
					disabled={clearMutation.isPending || !entries.length}
					className="btn btn-sm btn-ghost disabled:opacity-40"
				>
					{dict.clear}
				</button>
			</header>

			<div className="max-h-[240px] overflow-y-auto px-5 py-3">
				{!entries.length ? (
					<div className="text-sm text-[var(--text-faint)] text-center py-6">
						{dict.empty}
					</div>
				) : (
					<ul className="font-mono text-xs divide-y divide-[var(--border)]">
						{entries.map((entry, i) => (
							<li
								key={`${entry.timestamp}-${i}`}
								className="flex items-start gap-3 py-2"
							>
								<span className="text-[var(--text-faint)] shrink-0 min-w-[62px]">
									{formatTimeHms(entry.timestamp)}
								</span>
								<span
									className={cn(
										"shrink-0 min-w-[42px] font-semibold",
										LEVEL_CLASS[entry.level],
									)}
								>
									{dict.levels[entry.level].toUpperCase()}
								</span>
								<span className="text-[var(--text-secondary)] break-words">
									{entry.message}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
};
