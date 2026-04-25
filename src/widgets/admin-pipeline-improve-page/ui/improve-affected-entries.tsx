"use client";

import type { ImproveAffectedEntry } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"]["affected"];
	entries: ImproveAffectedEntry[];
}

const TONE: Record<string, string> = {
	"cleaned style": "text-[var(--success)]",
	"normalized word": "text-[var(--success)]",
	"fixed example": "text-[var(--info)]",
	"fixed encoding": "text-[var(--info)]",
	"removed empty": "text-[var(--danger)]",
	"dedup meanings": "text-[var(--warning)]",
	"truncated field": "text-[var(--accent)]",
};

const actionLabelKey = (
	action: string,
): keyof Dictionary["admin"]["pipelineImprove"]["affected"]["actions"] | null => {
	switch (action) {
		case "cleaned style":
			return "cleanedStyle";
		case "fixed example":
			return "fixedExample";
		case "fixed encoding":
			return "fixedEncoding";
		case "removed empty":
			return "removedEmpty";
		case "dedup meanings":
			return "dedupMeanings";
		case "normalized word":
			return "normalizedWord";
		case "truncated field":
			return "truncatedField";
		default:
			return null;
	}
};

export const ImproveAffectedEntries: FC<Props> = ({ dict, entries }) => (
	<section className="mb-8">
		<header className="flex items-center justify-between gap-4 mb-4">
			<h2 className="text-lg font-semibold text-[var(--text)]">
				{dict.title}
			</h2>
		</header>
		<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
			<div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
				<span aria-hidden>📋</span>
				<span className="text-sm font-semibold text-[var(--text)] flex-1">
					{dict.cardTitle}
				</span>
				<span className="text-xs text-[var(--text-muted)] bg-[var(--surface-active)] px-2 py-0.5 rounded-full">
					{dict.count.replace("{count}", String(entries.length))}
				</span>
			</div>

			{entries.length === 0 ? (
				<div className="text-sm text-[var(--text-muted)] text-center py-8 px-5">
					{dict.empty}
				</div>
			) : (
				<div className="max-h-[320px] overflow-y-auto">
					<div className="grid grid-cols-[1fr_140px_120px] gap-3 px-5 py-2 bg-[var(--surface)] border-b border-[var(--border)] text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
						<div>{dict.cols.word}</div>
						<div>{dict.cols.action}</div>
						<div className="hidden sm:block">{dict.cols.source}</div>
					</div>
					{entries.map((entry, i) => {
						const key = actionLabelKey(entry.action);
						const label = key ? dict.actions[key] : entry.action;
						return (
							<div
								key={`${entry.word}-${i}`}
								className="grid grid-cols-[1fr_140px_120px] gap-3 px-5 py-3 border-b border-[var(--border)] last:border-b-0 text-sm hover:bg-[var(--surface-hover)]"
							>
								<div className="font-medium text-[var(--text)] truncate">
									{entry.word}
								</div>
								<div
									className={cn(
										"text-xs font-mono",
										TONE[entry.action] ?? "text-[var(--text-secondary)]",
									)}
								>
									{label}
								</div>
								<div className="text-xs text-[var(--text-muted)] hidden sm:block truncate">
									{entry.source}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	</section>
);
