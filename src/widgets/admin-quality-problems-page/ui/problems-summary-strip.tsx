"use client";

import type {
	QualityProblemFilter,
	QualityStatsResponse,
} from "@/features/admin-quality-problems";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { PROBLEM_DOT_CLASSES, PROBLEM_TYPES } from "../lib/problem-meta";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

interface ProblemsSummaryStripProps {
	value: QualityProblemFilter;
	stats?: QualityStatsResponse;
	isLoading: boolean;
	dict: ProblemsDict;
	onChange: (value: QualityProblemFilter) => void;
}

const nf = new Intl.NumberFormat("ru-RU");

const getCount = (
	type: QualityProblemFilter,
	stats?: QualityStatsResponse,
): number | undefined => {
	if (!stats) return undefined;
	switch (type) {
		case "":
			return stats.problemsUnique;
		case "no-meanings":
			return stats.noMeanings;
		case "no-class":
			return stats.noClass ?? stats.nounsWithoutClass;
		case "no-pos":
			return stats.noPartOfSpeech;
		case "no-examples":
			return stats.noExamples;
	}
};

const getLabel = (
	type: QualityProblemFilter,
	dict: ProblemsDict,
): string => {
	switch (type) {
		case "":
			return dict.summary.all;
		case "no-meanings":
			return dict.summary.noMeanings;
		case "no-class":
			return dict.summary.noClass;
		case "no-pos":
			return dict.summary.noPos;
		case "no-examples":
			return dict.summary.noExamples;
	}
};

export const ProblemsSummaryStrip: FC<ProblemsSummaryStripProps> = ({
	value,
	stats,
	isLoading,
	dict,
	onChange,
}) => {
	const items: QualityProblemFilter[] = ["", ...PROBLEM_TYPES];

	return (
		<div className="flex gap-3 flex-wrap mb-6">
			{items.map((type) => {
				const active = value === type;
				const count = getCount(type, stats);
				return (
					<button
						key={type || "all"}
						type="button"
						onClick={() => onChange(type)}
						aria-pressed={active}
						className={cn(
							"inline-flex items-center gap-2 px-4 py-2 border rounded-full text-xs transition-colors select-none",
							active
								? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]"
								: "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]",
						)}
					>
						{type ? (
							<span
								className={cn(
									"w-2 h-2 rounded-full flex-shrink-0",
									PROBLEM_DOT_CLASSES[type],
								)}
								aria-hidden
							/>
						) : null}
						<span>{getLabel(type, dict)}</span>
						<span
							className={cn(
								"font-mono font-semibold",
								active ? "text-[var(--accent)]" : "text-[var(--text)]",
							)}
						>
							{isLoading || count === undefined ? "—" : nf.format(count)}
						</span>
					</button>
				);
			})}
		</div>
	);
};
