"use client";

import type { ImproveResult } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { StatCard, formatStatValue } from "@/shared/ui/admin";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"]["stats"];
	lastResult: ImproveResult | null;
	total: number | undefined;
	loading?: boolean;
}

export const ImproveStatsGrid: FC<Props> = ({
	dict,
	lastResult,
	total,
	loading,
}) => (
	<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
		<StatCard
			icon="🧹"
			tone="success"
			label={dict.cleaned.label}
			value={formatStatValue(lastResult?.cleaned)}
			sub={dict.cleaned.sub}
			loading={loading}
		/>
		<StatCard
			icon="🔧"
			tone="info"
			label={dict.fixedExamples.label}
			value={formatStatValue(lastResult?.fixedExamples)}
			sub={dict.fixedExamples.sub}
			loading={loading}
		/>
		<StatCard
			icon="🗑"
			tone="danger"
			label={dict.removedEmpty.label}
			value={formatStatValue(lastResult?.removedEmpty)}
			sub={dict.removedEmpty.sub}
			loading={loading}
		/>
		<StatCard
			icon="📊"
			tone="warning"
			label={dict.total.label}
			value={formatStatValue(total)}
			sub={dict.total.sub}
			loading={loading}
		/>
	</div>
);
