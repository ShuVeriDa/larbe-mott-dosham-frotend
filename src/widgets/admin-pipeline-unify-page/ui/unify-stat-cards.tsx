"use client";

import {
	useUnifiedLog,
	useUnifyStatus,
} from "@/features/admin-pipeline-unify";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { StatCard } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatNumber, formatSize } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	lang: Locale;
}

export const UnifyStatCards: FC<Props> = ({ dict, lang }) => {
	const statusQuery = useUnifyStatus();
	const logQuery = useUnifiedLog();

	const isLoading = statusQuery.isLoading || logQuery.isLoading;

	const unified = statusQuery.data?.unified;
	const steps = logQuery.data?.steps ?? [];
	const totalDicts = logQuery.data
		? steps.length + logQuery.data.remaining.length
		: 14;

	const totalNew = steps.reduce((sum, s) => sum + s.newWords, 0);
	const totalEnriched = steps.reduce((sum, s) => sum + s.enrichedWords, 0);

	const fileSub =
		unified && unified.entries > 0 && unified.file
			? dict.stats.unifiedFileSub
					.replace("{file}", unified.file.split("/").pop() ?? unified.file)
					.replace("{size}", formatSize(unified.fileSizeMb))
			: dict.stats.unifiedNotCreated;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
			<StatCard
				icon="📦"
				tone="total"
				label={dict.stats.unifiedEntries}
				value={unified ? formatNumber(unified.entries, lang) : "—"}
				sub={fileSub}
				loading={isLoading}
			/>
			<StatCard
				icon="🆕"
				tone="success"
				label={dict.stats.newWords}
				value={formatNumber(totalNew, lang)}
				sub={dict.stats.newWordsSub}
				loading={isLoading}
			/>
			<StatCard
				icon="✨"
				tone="info"
				label={dict.stats.enriched}
				value={formatNumber(totalEnriched, lang)}
				sub={dict.stats.enrichedSub}
				loading={isLoading}
			/>
			<StatCard
				icon="🔄"
				tone="warning"
				label={dict.stats.mergeSteps}
				value={formatNumber(steps.length, lang)}
				sub={dict.stats.mergeStepsSub.replace(
					"{total}",
					String(totalDicts),
				)}
				loading={isLoading}
			/>
		</div>
	);
};
