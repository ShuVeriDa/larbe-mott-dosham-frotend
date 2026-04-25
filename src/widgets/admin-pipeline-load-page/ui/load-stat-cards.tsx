"use client";

import {
	type LoadHistoryItem,
	type PipelineRunResult,
	useLoadHistory,
	usePipelineFullStatus,
	useUnifiedLog,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { StatCard } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatNumber, formatSizeMb } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"];
	lang: Locale;
	lastResult: PipelineRunResult | null;
}

const pickLatestOk = (items: LoadHistoryItem[] | undefined) =>
	items?.find((it) => it.status === "ok") ?? null;

export const LoadStatCards: FC<Props> = ({ dict, lang, lastResult }) => {
	const statusQuery = usePipelineFullStatus();
	const unifiedLogQuery = useUnifiedLog();
	const historyQuery = useLoadHistory(20);

	const isLoading = statusQuery.isLoading || historyQuery.isLoading;

	const unified = statusQuery.data?.unified;
	const dbEntries = statusQuery.data?.database.entries ?? null;
	const mergeSteps = unifiedLogQuery.data?.totalSteps ?? null;

	const fallbackHistory = pickLatestOk(historyQuery.data);

	const skipped = lastResult?.skipped ?? fallbackHistory?.skipped ?? null;
	const elapsed =
		lastResult?.elapsedSeconds ?? fallbackHistory?.elapsedSeconds ?? null;

	const unifiedSub =
		unified && unified.entries > 0
			? dict.stats.unifiedSub
					.replace("{size}", formatSizeMb(unified.fileSizeMb))
					.replace("{steps}", String(mergeSteps ?? 0))
			: dict.stats.unifiedSubEmpty;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
			<StatCard
				icon="📦"
				tone="total"
				label={dict.stats.unifiedTitle}
				value={formatNumber(unified?.entries ?? null, lang)}
				sub={unifiedSub}
				loading={isLoading}
			/>
			<StatCard
				icon="🗄"
				tone="success"
				label={dict.stats.loadedTitle}
				value={formatNumber(dbEntries, lang)}
				sub={dict.stats.loadedSub}
				loading={isLoading}
			/>
			<StatCard
				icon="⏭"
				tone="warning"
				label={dict.stats.skippedTitle}
				value={formatNumber(skipped, lang)}
				sub={skipped === null ? dict.stats.skippedSubEmpty : dict.stats.skippedSub}
				loading={isLoading}
			/>
			<StatCard
				icon="⏱"
				tone="info"
				label={dict.stats.elapsedTitle}
				value={
					elapsed === null ? (
						"—"
					) : (
						<>
							{elapsed.toFixed(1)}
							<span className="text-sm font-normal text-[var(--text-muted)]">
								{" "}
								{dict.stats.elapsedUnit}
							</span>
						</>
					)
				}
				sub={
					elapsed === null ? dict.stats.elapsedSubEmpty : dict.stats.elapsedSub
				}
				loading={isLoading}
			/>
		</div>
	);
};
