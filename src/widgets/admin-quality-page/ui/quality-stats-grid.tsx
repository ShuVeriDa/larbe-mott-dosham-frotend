"use client";

import type { QualityStats } from "@/features/admin-quality";
import type { Dictionary } from "@/i18n/dictionaries";
import { StatCard, formatStatValue } from "@/shared/ui/admin";
import type { FC } from "react";

interface QualityStatsGridProps {
	stats?: QualityStats;
	sourcesCount?: number;
	loading?: boolean;
	dict: Dictionary["admin"]["quality"]["stats"];
}

const pctOf = (value: number, total: number): string => {
	if (!total) return "0%";
	return `${((value / total) * 100).toFixed(1)}%`;
};

const pctTone = (pct: number): "low" | "mid" | "high" => {
	if (pct >= 10) return "high";
	if (pct >= 5) return "mid";
	return "low";
};

const toneClass: Record<"low" | "mid" | "high", string> = {
	low: "text-[var(--success)]",
	mid: "text-[var(--warning)]",
	high: "text-[var(--danger)]",
};

export const QualityStatsGrid: FC<QualityStatsGridProps> = ({
	stats,
	sourcesCount,
	loading,
	dict,
}) => {
	const total = stats?.total ?? 0;

	const noMeaningsPct = total ? (stats?.noMeanings ?? 0) / total * 100 : 0;
	const noClassPct = total ? (stats?.nounsWithoutClass ?? 0) / total * 100 : 0;
	const noPosPct = total ? (stats?.noPartOfSpeech ?? 0) / total * 100 : 0;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<StatCard
				icon="📚"
				tone="total"
				label={dict.totalEntries.label}
				value={formatStatValue(stats?.total)}
				sub={
					sourcesCount !== undefined
						? dict.totalEntries.sub.replace(
								"{count}",
								String(sourcesCount),
							)
						: undefined
				}
				loading={loading}
			/>
			<StatCard
				icon="⊘"
				tone="danger"
				label={dict.noMeanings.label}
				value={formatStatValue(stats?.noMeanings)}
				sub={
					stats ? (
						<>
							<span
								className={`font-mono font-semibold ${toneClass[pctTone(noMeaningsPct)]}`}
							>
								{pctOf(stats.noMeanings, stats.total)}
							</span>
							<span>{dict.ofTotal}</span>
						</>
					) : undefined
				}
				loading={loading}
			/>
			<StatCard
				icon="◇"
				tone="warning"
				label={dict.noClass.label}
				value={formatStatValue(stats?.nounsWithoutClass)}
				sub={
					stats ? (
						<>
							<span
								className={`font-mono font-semibold ${toneClass[pctTone(noClassPct)]}`}
							>
								{pctOf(stats.nounsWithoutClass, stats.total)}
							</span>
							<span>{dict.ofTotal}</span>
						</>
					) : undefined
				}
				loading={loading}
			/>
			<StatCard
				icon="◎"
				tone="info"
				label={dict.noPos.label}
				value={formatStatValue(stats?.noPartOfSpeech)}
				sub={
					stats ? (
						<>
							<span
								className={`font-mono font-semibold ${toneClass[pctTone(noPosPct)]}`}
							>
								{pctOf(stats.noPartOfSpeech, stats.total)}
							</span>
							<span>{dict.ofTotal}</span>
						</>
					) : undefined
				}
				loading={loading}
			/>
		</div>
	);
};
