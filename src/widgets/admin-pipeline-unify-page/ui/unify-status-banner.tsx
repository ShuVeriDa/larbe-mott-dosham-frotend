"use client";

import { useUnifyStatus } from "@/features/admin-pipeline-unify";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";
import { formatRelativeTime } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
}

export const UnifyStatusBanner: FC<Props> = ({ dict }) => {
	const query = useUnifyStatus();
	const status = query.data;

	if (!status) {
		return (
			<div className="h-[72px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse mb-8" />
		);
	}

	const isRunning = status.isRunning;
	const lastRun = status.lastRun;

	const stateKey = isRunning ? "running" : lastRun ? "done" : "idle";
	const label = isRunning
		? dict.status.running.replace(
				"{operation}",
				status.currentOperation ?? "",
			)
		: lastRun
			? dict.status.done.replace("{operation}", lastRun.operation)
			: dict.status.idle;

	const detail = lastRun
		? dict.status.lastRun
				.replace("{operation}", lastRun.operation)
				.replace(
					"{time}",
					formatRelativeTime(lastRun.timestamp, dict.time),
				)
				.replace("{duration}", lastRun.durationSeconds.toFixed(1))
		: dict.status.never;

	const tone: Record<typeof stateKey, string> = {
		idle: "bg-[var(--surface)] border-[var(--border)]",
		running: "bg-[var(--accent-dim)] border-[var(--accent)] animate-pulse",
		done: "bg-[var(--success-dim)] border-[var(--success)]",
	};
	const dot: Record<typeof stateKey, string> = {
		idle: "bg-[var(--text-muted)]",
		running: "bg-[var(--accent)] animate-pulse",
		done: "bg-[var(--success)]",
	};

	return (
		<div
			className={cn(
				"flex items-center gap-4 p-4 rounded-2xl border mb-8 flex-wrap",
				tone[stateKey],
			)}
			role="status"
			aria-live="polite"
		>
			<span
				className={cn("w-2.5 h-2.5 rounded-full shrink-0", dot[stateKey])}
				aria-hidden
			/>
			<div className="flex-1 min-w-0">
				<div className="text-sm font-semibold text-[var(--text)]">{label}</div>
				<div className="text-xs text-[var(--text-muted)]">{detail}</div>
			</div>
			<button
				type="button"
				onClick={() => {
					void query.refetch();
					toast.info(dict.status.refreshed);
				}}
				className="btn btn-sm btn-secondary"
			>
				{dict.status.refresh}
			</button>
		</div>
	);
};
