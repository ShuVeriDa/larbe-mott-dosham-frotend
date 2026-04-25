"use client";

import type { AdminEntriesStats } from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import { StatCard, formatStatValue } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatPercent, interpolate } from "../lib/format";

interface Props {
	stats: AdminEntriesStats | undefined;
	loading: boolean;
	dict: Dictionary["admin"]["entries"]["stats"];
}

export const EntriesStats: FC<Props> = ({ stats, loading, dict }) => {
	const total = stats?.total ?? 0;
	const nouns = stats?.nouns ?? 0;
	const verbs = stats?.verbs ?? 0;

	const subNouns = stats
		? interpolate(dict.percent, { percent: formatPercent(nouns, total) })
		: undefined;
	const subVerbs = stats
		? interpolate(dict.percent, { percent: formatPercent(verbs, total) })
		: undefined;

	return (
		<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
			<StatCard
				tone="total"
				label={dict.total}
				value={formatStatValue(stats?.total)}
				loading={loading}
			/>
			<StatCard
				tone="info"
				label={dict.nouns}
				value={formatStatValue(stats?.nouns)}
				sub={subNouns}
				loading={loading}
			/>
			<StatCard
				tone="success"
				label={dict.verbs}
				value={formatStatValue(stats?.verbs)}
				sub={subVerbs}
				loading={loading}
			/>
			<StatCard
				tone="warning"
				label={dict.sources}
				value={formatStatValue(stats?.sourcesCount)}
				loading={loading}
			/>
			<StatCard
				tone="danger"
				label={dict.updatedToday}
				value={formatStatValue(stats?.updatedToday)}
				loading={loading}
			/>
		</div>
	);
};
