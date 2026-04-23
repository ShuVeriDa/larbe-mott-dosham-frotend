"use client";

import {
	type PipelineLogLevel,
	useClearPipelineOperationLog,
	usePipelineOperationLog,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatTime } from "../lib/format";

interface Props {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineRollback"]["operationLog"];
	levelsDict: Dictionary["admin"]["pipeline"]["log"]["levels"];
}

const LEVEL_CLASS: Record<PipelineLogLevel, string> = {
	info: "text-[var(--accent)]",
	ok: "text-[var(--success)]",
	warn: "text-[var(--warning)]",
	err: "text-[var(--danger)]",
};

export const RollbackLog: FC<Props> = ({ lang, dict, levelsDict }) => {
	const query = usePipelineOperationLog();
	const clear = useClearPipelineOperationLog();
	const items = query.data ?? [];

	return (
		<section className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl overflow-hidden mb-8">
			<header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--border)]">
				<div>
					<h2 className="text-sm font-semibold text-[var(--text)]">
						{dict.title}
					</h2>
					<p className="text-xs text-[var(--text-muted)]">{dict.subtitle}</p>
				</div>
				<button
					type="button"
					onClick={() => clear.mutate()}
					disabled={clear.isPending || !items.length}
					className="btn btn-sm btn-ghost disabled:opacity-40"
				>
					{dict.clear}
				</button>
			</header>
			<div className="max-h-[260px] overflow-y-auto px-5 py-3">
				{!items.length ? (
					<div className="text-sm text-[var(--text-muted)] text-center py-4">
						{dict.empty}
					</div>
				) : (
					<ul className="font-mono text-xs divide-y divide-[var(--border)]">
						{items.map((entry, i) => (
							<li
								key={`${entry.timestamp}-${i}`}
								className="flex items-start gap-3 py-2"
							>
								<span className="text-[var(--text-faint)] shrink-0 min-w-[62px]">
									{formatTime(entry.timestamp, lang)}
								</span>
								<span
									className={cn(
										"font-semibold shrink-0 min-w-[42px]",
										LEVEL_CLASS[entry.level],
									)}
								>
									{levelsDict[entry.level] ?? entry.level.toUpperCase()}
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
