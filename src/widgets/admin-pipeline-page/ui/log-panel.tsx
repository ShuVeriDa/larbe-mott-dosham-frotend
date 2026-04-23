"use client";

import {
	type PipelineLogLevel,
	type PipelineStage,
	usePipelineLog,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { SectionCard } from "@/shared/ui/admin";
import type { FC } from "react";

interface LogPanelProps {
	stage?: PipelineStage;
	dict: Dictionary["admin"]["pipeline"]["log"];
}

const LEVEL_CLASS: Record<PipelineLogLevel, string> = {
	info: "text-[var(--info)]",
	ok: "text-[var(--success)]",
	warn: "text-[var(--warning)]",
	err: "text-[var(--danger)]",
};

const formatTime = (iso: string) => {
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

export const PipelineLogPanel: FC<LogPanelProps> = ({ stage, dict }) => {
	const query = usePipelineLog(stage);
	const items = query.data ?? [];

	return (
		<SectionCard title={dict.title}>
			{!items.length ? (
				<div className="text-sm text-[var(--text-muted)] py-6 text-center">
					{dict.empty}
				</div>
			) : (
				<div className="font-mono text-xs space-y-1 max-h-[320px] overflow-auto">
					{items.map((entry) => (
						<div key={entry.id} className="flex gap-3 items-start">
							<span className="text-[var(--text-muted)] shrink-0">
								{formatTime(entry.at)}
							</span>
							<span
								className={cn("shrink-0 font-semibold", LEVEL_CLASS[entry.level])}
							>
								{dict.levels[entry.level]}
							</span>
							<span className="text-[var(--text-secondary)] break-words">
								{entry.message}
							</span>
						</div>
					))}
				</div>
			)}
		</SectionCard>
	);
};
