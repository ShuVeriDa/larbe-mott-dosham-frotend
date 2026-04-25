"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { StatCard } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatPercent } from "../lib/format-bytes";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["stats"];
	total: number;
	parsed: number;
	pendingSlugs: string[];
	loading?: boolean;
}

export const ParseStatsGrid: FC<Props> = ({
	dict,
	total,
	parsed,
	pendingSlugs,
	loading,
}) => {
	const percent = formatPercent(parsed, total);
	const pendingCount = pendingSlugs.length;
	const pendingSub = pendingCount
		? dict.pending.sub.replace("{slugs}", pendingSlugs.slice(0, 3).join(", "))
		: dict.pending.empty;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
			<StatCard
				icon="📄"
				tone="total"
				label={dict.total.label}
				value={total}
				sub={dict.total.sub}
				loading={loading}
			/>
			<StatCard
				icon="✓"
				tone="success"
				label={dict.parsed.label}
				value={parsed}
				sub={dict.parsed.sub
					.replace("{total}", `${total}`)
					.replace("{percent}", `${percent}`)}
				loading={loading}
			/>
			<StatCard
				icon="⏳"
				tone="warning"
				label={dict.pending.label}
				value={pendingCount}
				sub={pendingSub}
				loading={loading}
			/>
		</div>
	);
};
