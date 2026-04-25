"use client";

import {
	type PipelineLogLevel,
	useClearPipelineOperationLog,
	usePipelineLog,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";
import { formatTime } from "../lib/format-relative";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["log"];
	toastsDict: Dictionary["admin"]["pipelineParse"]["toasts"];
}

const LEVEL_CLASS: Record<PipelineLogLevel, string> = {
	info: "text-[var(--info)]",
	ok: "text-[var(--success)]",
	warn: "text-[var(--warning)]",
	err: "text-[var(--danger)]",
};

export const ParseLogPanel: FC<Props> = ({ dict, toastsDict }) => {
	const query = usePipelineLog("parse");
	const clear = useClearPipelineOperationLog();

	const items = query.data ?? [];

	const handleClear = async () => {
		try {
			await clear.mutateAsync();
			toast.info(toastsDict.logCleared);
		} catch {
			// swallow — toast from mutation if needed
		}
	};

	return (
		<section aria-labelledby="parse-log-heading" className="mb-8">
			<header className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2
					id="parse-log-heading"
					className="text-lg font-semibold text-[var(--text)]"
				>
					{dict.title}
				</h2>
				<button
					type="button"
					onClick={handleClear}
					disabled={clear.isPending || !items.length}
					className="btn btn-ghost btn-sm disabled:opacity-40"
				>
					{dict.clear}
				</button>
			</header>

			<div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<header className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
					<span className="text-sm font-semibold text-[var(--text)]">
						{dict.subtitle}
					</span>
					<span className="text-xs text-[var(--text-muted)]">
						{dict.count.replace("{count}", `${items.length}`)}
					</span>
				</header>
				<div className="px-5 py-3 max-h-[320px] overflow-y-auto">
					{!items.length ? (
						<div className="py-8 text-center text-sm text-[var(--text-faint)]">
							{dict.empty}
						</div>
					) : (
						<ul className="font-mono text-xs">
							{items.map((entry, i) => (
								<li
									key={entry.id}
									className={cn(
										"flex items-start gap-3 py-2",
										i > 0 && "border-t border-[var(--border)]",
									)}
								>
									<span className="text-[var(--text-faint)] shrink-0 min-w-[62px]">
										{formatTime(entry.at)}
									</span>
									<span
										className={cn(
											"shrink-0 font-semibold min-w-[42px]",
											LEVEL_CLASS[entry.level],
										)}
									>
										{dict.levels[entry.level]}
									</span>
									<span className="text-[var(--text-secondary)] break-words">
										{entry.message}
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
