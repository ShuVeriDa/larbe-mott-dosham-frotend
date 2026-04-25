"use client";

import type { AuditStats } from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import { StatCard, formatStatValue } from "@/shared/ui/admin";
import type { FC } from "react";

interface AuditStatsRowProps {
	stats: AuditStats | undefined;
	loading: boolean;
	dict: Dictionary["admin"]["audit"]["stats"];
}

const formatDelta = (
	percent: number,
	dict: AuditStatsRowProps["dict"],
): string => {
	if (percent > 0) return dict.deltaUp.replace("{value}", String(percent));
	if (percent < 0)
		return dict.deltaDown.replace("{value}", String(percent));
	return dict.deltaZero;
};

export const AuditStatsRow: FC<AuditStatsRowProps> = ({
	stats,
	loading,
	dict,
}) => (
	<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
		<StatCard
			tone="info"
			label={dict.today}
			value={formatStatValue(stats?.today.total)}
			sub={
				stats
					? formatDelta(stats.today.deltaPercent, dict)
					: undefined
			}
			loading={loading}
		/>
		<StatCard
			tone="total"
			label={dict.week}
			value={formatStatValue(stats?.week.total)}
			sub={
				stats
					? dict.weekAuthors.replace(
							"{count}",
							String(stats.week.uniqueAuthors),
						)
					: undefined
			}
			loading={loading}
		/>
		<StatCard
			tone="warning"
			label={dict.bulk}
			value={formatStatValue(stats?.weekBulk.total)}
			sub={
				stats
					? dict.bulkAffected.replace(
							"{count}",
							String(stats.weekBulk.affectedEntries),
						)
					: undefined
			}
			loading={loading}
		/>
		<StatCard
			tone="success"
			label={dict.pipeline}
			value={formatStatValue(stats?.weekPipeline.total)}
			sub={
				stats
					? stats.weekPipeline.commands.length
						? dict.pipelineCommands.replace(
								"{commands}",
								stats.weekPipeline.commands.join(", "),
							)
						: dict.pipelineEmpty
					: undefined
			}
			loading={loading}
		/>
	</div>
);
