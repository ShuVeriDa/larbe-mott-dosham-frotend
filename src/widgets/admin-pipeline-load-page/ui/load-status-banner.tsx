"use client";

import { usePipelineFullStatus } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { toast } from "sonner";
import { formatRelativeTime } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"]["status"];
	isLoadRunning: boolean;
	lastError: string | null;
}

type Tone = "idle" | "running" | "done" | "error";

const CONTAINER: Record<Tone, string> = {
	idle: "bg-[var(--surface)] border-[var(--border)]",
	running: "bg-[var(--accent-dim)] border-[var(--border-accent)]",
	done: "bg-[var(--success-dim)] border-[var(--success)]",
	error: "bg-[var(--danger-dim)] border-[var(--danger)]",
};

const DOT: Record<Tone, string> = {
	idle: "bg-[var(--text-muted)]",
	running: "bg-[var(--accent)] animate-pulse",
	done: "bg-[var(--success)]",
	error: "bg-[var(--danger)]",
};

export const LoadStatusBanner: FC<Props> = ({
	dict,
	isLoadRunning,
	lastError,
}) => {
	const query = usePipelineFullStatus();
	const status = query.data;

	if (query.isLoading && !status) {
		return (
			<div className="h-[72px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse mb-8" />
		);
	}

	const isRunning = isLoadRunning || status?.isRunning === true;
	const lastRun = status?.lastRun ?? null;

	const tone: Tone = lastError
		? "error"
		: isRunning
			? "running"
			: lastRun
				? "done"
				: "idle";

	const label =
		tone === "error"
			? dict.error
			: tone === "running"
				? dict.running
				: tone === "done"
					? dict.done
					: dict.idle;

	const detail =
		tone === "error"
			? dict.detailError.replace("{message}", lastError ?? "")
			: tone === "running"
				? dict.detailRunning
				: lastRun
					? dict.lastRun
							.replace("{time}", formatRelativeTime(lastRun.timestamp, dict.time))
							.replace("{duration}", `${lastRun.durationSeconds.toFixed(1)} s`)
							.replace("{loaded}", "—")
					: dict.detailNever;

	const onRefresh = () => {
		void query.refetch();
		toast.info(dict.refreshed);
	};

	return (
		<div
			className={cn(
				"flex items-center gap-4 p-4 rounded-2xl border mb-8 flex-wrap",
				CONTAINER[tone],
			)}
			role="status"
			aria-live="polite"
		>
			<span
				className={cn("w-2.5 h-2.5 rounded-full shrink-0", DOT[tone])}
				aria-hidden
			/>
			<div className="flex-1 min-w-0">
				<div className="text-sm font-semibold text-[var(--text)]">{label}</div>
				<div className="text-xs text-[var(--text-muted)]">{detail}</div>
			</div>
			<button
				type="button"
				onClick={onRefresh}
				className="btn btn-sm btn-secondary"
			>
				{dict.refresh}
			</button>
		</div>
	);
};
