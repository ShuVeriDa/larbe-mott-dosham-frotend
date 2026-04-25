"use client";

import {
	type PipelineLogLevel,
	type PipelineOperationLogEntry,
	useClearPipelineOperationLog,
	usePipelineOperationLog,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"]["log"];
	toastLogCleared: string;
	levelsDict: Dictionary["admin"]["pipeline"]["log"]["levels"];
}

const LEVEL_CLASS: Record<PipelineLogLevel, string> = {
	info: "text-[var(--info)]",
	ok: "text-[var(--success)]",
	warn: "text-[var(--warning)]",
	err: "text-[var(--danger)]",
};

const formatTime = (iso: string): string => {
	try {
		return new Date(iso).toLocaleTimeString("ru-RU", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	} catch {
		return iso;
	}
};

export const ImproveLogPanel: FC<Props> = ({
	dict,
	levelsDict,
	toastLogCleared,
}) => {
	const query = usePipelineOperationLog();
	const clear = useClearPipelineOperationLog();
	const items: PipelineOperationLogEntry[] = (query.data ?? []).filter(
		(e) =>
			e.operation === "improve" ||
			e.operation === "improve-entries" ||
			e.message?.toLowerCase().includes("improve") ||
			e.message?.toLowerCase().includes("очистк") ||
			e.message?.toLowerCase().includes("normaliz") ||
			e.message?.toLowerCase().includes("dedup"),
	);

	const onClear = () => {
		clear.mutate(undefined, {
			onSuccess: () => toast.info(toastLogCleared),
		});
	};

	return (
		<section className="mb-8">
			<header className="flex items-center justify-between gap-4 mb-4">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.title}
				</h2>
				<button
					type="button"
					onClick={onClear}
					disabled={clear.isPending || items.length === 0}
					className="btn btn-sm btn-ghost disabled:opacity-40"
				>
					{dict.clear}
				</button>
			</header>

			<div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<div className="px-5 py-3 border-b border-[var(--border)] text-sm font-semibold text-[var(--text)]">
					{dict.subtitle}
				</div>
				<div className="max-h-[300px] overflow-y-auto px-5 py-3">
					{items.length === 0 ? (
						<div className="text-xs text-[var(--text-muted)] text-center py-6">
							{dict.empty}
						</div>
					) : (
						<div className="font-mono text-xs divide-y divide-[var(--border)]">
							{items.map((entry, i) => (
								<div
									key={`${entry.timestamp}-${i}`}
									className="flex items-start gap-3 py-2"
								>
									<span className="text-[var(--text-faint)] shrink-0 min-w-[62px]">
										{formatTime(entry.timestamp)}
									</span>
									<span
										className={cn(
											"font-semibold shrink-0 min-w-[42px]",
											LEVEL_CLASS[entry.level],
										)}
									>
										{levelsDict[entry.level]}
									</span>
									<span className="text-[var(--text-secondary)] break-words">
										{entry.message}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
