"use client";

import {
	useResetPipelineStatus,
	useUnifiedLog,
} from "@/features/admin-pipeline-reset";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";
import { formatNumber, formatSizeMb } from "../lib";

interface StateCardProps {
	icon: ReactNode;
	tone: "unified" | "snaps" | "log";
	label: string;
	value: string;
	sub: string;
	loading?: boolean;
}

const TONE_CLASS: Record<StateCardProps["tone"], string> = {
	unified: "bg-[var(--accent-dim)] text-[var(--accent)]",
	snaps: "bg-[var(--info-dim)] text-[var(--info)]",
	log: "bg-[var(--warning-dim)] text-[var(--warning)]",
};

const StateCard: FC<StateCardProps> = ({
	icon,
	tone,
	label,
	value,
	sub,
	loading,
}) => (
	<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-all">
		<div
			className={cn(
				"w-10 h-10 rounded-md flex items-center justify-center text-lg mb-3",
				TONE_CLASS[tone],
			)}
			aria-hidden
		>
			{icon}
		</div>
		<div className="text-xs text-[var(--text-muted)] font-medium mb-2">
			{label}
		</div>
		<div
			className={cn(
				"text-2xl font-bold text-[var(--text)] leading-none mb-2 tabular-nums",
				loading && "opacity-40 animate-pulse",
			)}
		>
			{value}
		</div>
		<div className="text-xs text-[var(--text-muted)]">{sub}</div>
	</div>
);

interface StateCardsProps {
	dict: Dictionary["admin"]["pipelineReset"]["stateCards"];
	reset: boolean;
	resetDict: Dictionary["admin"]["pipelineReset"]["resetDone"];
}

export const StateCards: FC<StateCardsProps> = ({ dict, reset, resetDict }) => {
	const statusQuery = useResetPipelineStatus();
	const unifiedLogQuery = useUnifiedLog();

	if (reset) {
		return (
			<section
				aria-label={resetDict.title}
				className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8 text-center"
			>
				<div className="text-4xl mb-3" aria-hidden>
					💥
				</div>
				<h2 className="text-lg font-bold text-[var(--danger)] mb-2">
					{resetDict.title}
				</h2>
				<p className="text-sm text-[var(--text-muted)]">{resetDict.subtitle}</p>
			</section>
		);
	}

	const loading = statusQuery.isLoading || unifiedLogQuery.isLoading;

	const unifiedEntries = statusQuery.data?.unified.entries ?? 0;
	const unifiedSizeMb = statusQuery.data?.unified.fileSizeMb ?? null;
	const totalSteps = unifiedLogQuery.data?.totalSteps ?? 0;
	const totalSnapshotSizeMb =
		unifiedLogQuery.data?.totalSnapshotSizeMb ?? null;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<StateCard
				icon="📦"
				tone="unified"
				label={dict.unified.label}
				value={formatNumber(unifiedEntries)}
				sub={dict.unified.sub
					.replace("{size}", formatSizeMb(unifiedSizeMb))
					.replace("{steps}", String(totalSteps))}
				loading={loading}
			/>
			<StateCard
				icon="📸"
				tone="snaps"
				label={dict.snapshots.label}
				value={formatNumber(totalSteps)}
				sub={dict.snapshots.sub.replace(
					"{size}",
					formatSizeMb(totalSnapshotSizeMb),
				)}
				loading={loading}
			/>
			<StateCard
				icon="📝"
				tone="log"
				label={dict.log.label}
				value={formatNumber(totalSteps)}
				sub={dict.log.sub}
				loading={loading}
			/>
		</div>
	);
};
