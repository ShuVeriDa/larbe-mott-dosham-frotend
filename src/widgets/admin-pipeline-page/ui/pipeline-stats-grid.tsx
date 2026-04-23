"use client";

import {
	usePipelineFullStatus,
	useUnifiedLog,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import {
	formatNumber,
	formatSize,
} from "../lib/format-relative-time";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
}

interface CardProps {
	icon: string;
	tone: "total" | "success" | "info";
	label: string;
	value: string;
	sub?: string;
	loading?: boolean;
}

const TONE: Record<CardProps["tone"], string> = {
	total: "bg-[var(--accent-dim)] text-[var(--accent)]",
	success: "bg-[var(--success-dim)] text-[var(--success)]",
	info: "bg-[var(--info-dim)] text-[var(--info)]",
};

const StatCard: FC<CardProps> = ({ icon, tone, label, value, sub, loading }) => (
	<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-colors">
		<div
			className={`w-10 h-10 rounded-xl flex items-center justify-center text-base mb-3 ${TONE[tone]}`}
			aria-hidden
		>
			{icon}
		</div>
		<div className="text-xs text-[var(--text-muted)] font-medium mb-2">
			{label}
		</div>
		{loading ? (
			<div className="h-7 w-24 bg-[var(--surface-active)] rounded animate-pulse mb-2" />
		) : (
			<div className="text-2xl font-bold text-[var(--text)] leading-none mb-2 tabular-nums">
				{value}
			</div>
		)}
		{sub ? (
			<div className="text-xs text-[var(--text-muted)]">{sub}</div>
		) : null}
	</div>
);

const PARSED_FILES_TARGET = 14;

export const PipelineStatsGrid: FC<Props> = ({ dict }) => {
	const statusQuery = usePipelineFullStatus();
	const logQuery = useUnifiedLog();

	const status = statusQuery.data;
	const log = logQuery.data;

	const parsedFiles = log ? log.totalSteps : undefined;
	const unifiedEntries = status?.unified.entries ?? undefined;
	const unifiedFile = status?.unified.file ?? "unified.json";
	const unifiedSize = status?.unified.fileSizeMb ?? undefined;
	const dbEntries = status?.database.entries ?? undefined;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
			<StatCard
				icon="📄"
				tone="total"
				label={dict.stats.parsedFiles}
				value={
					parsedFiles !== undefined
						? `${parsedFiles}`
						: dict.stats.notApplicable
				}
				sub={dict.stats.parsedFilesSub.replace(
					"{total}",
					`${PARSED_FILES_TARGET}`,
				)}
				loading={logQuery.isLoading}
			/>
			<StatCard
				icon="📦"
				tone="success"
				label={dict.stats.unifiedRecords}
				value={formatNumber(unifiedEntries)}
				sub={dict.stats.unifiedSub
					.replace("{file}", unifiedFile)
					.replace("{size}", formatSize(unifiedSize))}
				loading={statusQuery.isLoading}
			/>
			<StatCard
				icon="🗄"
				tone="info"
				label={dict.stats.inDb}
				value={formatNumber(dbEntries)}
				sub={dict.stats.dbSub}
				loading={statusQuery.isLoading}
			/>
		</div>
	);
};
