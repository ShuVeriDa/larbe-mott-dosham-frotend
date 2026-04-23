"use client";

import {
	useUnifiedLog,
	useUnifyStatus,
} from "@/features/admin-pipeline-unify";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatNumber, formatRelativeTime, formatSize } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	lang: Locale;
}

export const UnifiedFileInfo: FC<Props> = ({ dict, lang }) => {
	const statusQuery = useUnifyStatus();
	const logQuery = useUnifiedLog();

	const unified = statusQuery.data?.unified;
	const steps = logQuery.data?.steps.length ?? 0;

	const hasFile = !!unified && unified.entries > 0 && !!unified.file;

	return (
		<section className="mb-8">
			<div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.unifiedFile.title}
				</h2>
			</div>

			<div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex-wrap">
				<div
					aria-hidden
					className="w-12 h-12 rounded-xl bg-[var(--info-dim)] text-[var(--info)] flex items-center justify-center text-2xl shrink-0"
				>
					📦
				</div>
				<div className="flex-1 min-w-0">
					{hasFile ? (
						<>
							<div className="text-sm font-semibold text-[var(--text)] font-mono truncate">
								{unified.file}
							</div>
							<div className="flex gap-4 text-xs text-[var(--text-muted)] mt-1 flex-wrap">
								<span>
									{dict.unifiedFile.entries.replace(
										"{count}",
										formatNumber(unified.entries, lang),
									)}
								</span>
								<span>
									{dict.unifiedFile.size.replace(
										"{size}",
										formatSize(unified.fileSizeMb),
									)}
								</span>
								{statusQuery.data?.lastRun ? (
									<span>
										{dict.unifiedFile.updatedAt.replace(
											"{time}",
											formatRelativeTime(
												statusQuery.data.lastRun.timestamp,
												dict.time,
											),
										)}
									</span>
								) : null}
								<span>
									{dict.unifiedFile.stepsCount.replace(
										"{count}",
										String(steps),
									)}
								</span>
							</div>
						</>
					) : (
						<div className="text-sm text-[var(--text-muted)]">
							{dict.unifiedFile.notCreated}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
