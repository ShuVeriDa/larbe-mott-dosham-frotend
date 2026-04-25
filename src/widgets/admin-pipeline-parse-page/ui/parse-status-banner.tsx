"use client";

import { usePipelineFullStatus } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";
import { formatRelativeTime } from "../lib/format-relative";

interface Props {
	pipelineDict: Dictionary["admin"]["pipeline"];
	commonDict: Dictionary["admin"]["common"];
}

type Tone = "idle" | "running" | "done" | "error";

const CONTAINER: Record<Tone, string> = {
	idle: "bg-[var(--surface)] border-[var(--border)]",
	running: "bg-[var(--accent-dim)] border-[var(--border-accent)] animate-[pulse_2s_ease-in-out_infinite]",
	done: "bg-[var(--success-dim)] border-[var(--success)]",
	error: "bg-[var(--danger-dim)] border-[var(--danger)]",
};

const DOT: Record<Tone, string> = {
	idle: "bg-[var(--text-muted)]",
	running: "bg-[var(--accent)] animate-pulse",
	done: "bg-[var(--success)]",
	error: "bg-[var(--danger)]",
};

const formatDuration = (seconds: number | null | undefined): string => {
	if (seconds === null || seconds === undefined) return "—";
	if (seconds < 10) return `${seconds.toFixed(1)}s`;
	return `${Math.round(seconds)}s`;
};

export const ParseStatusBanner: FC<Props> = ({ pipelineDict, commonDict }) => {
	const query = usePipelineFullStatus();
	const status = query.data;

	const isRunning = status?.isRunning === true;
	const lastRun = status?.lastRun ?? null;
	const tone: Tone = isRunning ? "running" : lastRun ? "done" : "idle";

	const currentOperation = status?.currentOperation ?? undefined;

	const label = isRunning
		? pipelineDict.status.running.replace("{action}", currentOperation ?? "…")
		: pipelineDict.status.idle;

	const detail =
		!isRunning && lastRun
			? pipelineDict.status.lastRun
					.replace("{action}", lastRun.operation)
					.replace(
						"{time}",
						formatRelativeTime(lastRun.timestamp, pipelineDict.status),
					)
					.replace("{duration}", formatDuration(lastRun.durationSeconds))
			: undefined;

	const onRefresh = () => {
		void query.refetch();
		toast.info(pipelineDict.toasts.statusRefreshed);
	};

	if (query.isLoading && !status) {
		return (
			<div className="h-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse mb-8" />
		);
	}

	return (
		<div
			className={cn(
				"border rounded-2xl p-4 flex items-center justify-between gap-4 mb-8 flex-wrap",
				CONTAINER[tone],
			)}
			role="status"
			aria-live="polite"
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				<span
					className={cn("w-2.5 h-2.5 rounded-full shrink-0", DOT[tone])}
					aria-hidden
				/>
				<div className="min-w-0">
					<div className="text-sm font-semibold text-[var(--text)] truncate">
						{label}
					</div>
					{detail ? (
						<div className="text-xs text-[var(--text-muted)] truncate">
							{detail}
						</div>
					) : null}
				</div>
			</div>
			<button
				type="button"
				onClick={onRefresh}
				className="btn btn-sm btn-secondary"
			>
				⟳ {commonDict.refresh}
			</button>
		</div>
	);
};
