"use client";

import type {
	QualityProblemType,
	QualityStats,
} from "@/features/admin-quality";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import {
	type BreakdownTone,
	QualityBreakdownRow,
} from "./quality-breakdown-row";

interface QualityBreakdownProps {
	stats?: QualityStats;
	onJump: (type: QualityProblemType) => void;
	dict: Dictionary["admin"]["quality"]["breakdown"];
}

type Row = {
	type: QualityProblemType;
	tone: BreakdownTone;
	icon: string;
	count: number;
};

export const QualityBreakdown: FC<QualityBreakdownProps> = ({
	stats,
	onJump,
	dict,
}) => {
	const rows: Row[] = [
		{
			type: "no-meanings",
			tone: "danger",
			icon: "⊘",
			count: stats?.noMeanings ?? 0,
		},
		{
			type: "no-class",
			tone: "warning",
			icon: "◇",
			count: stats?.nounsWithoutClass ?? 0,
		},
		{
			type: "no-pos",
			tone: "info",
			icon: "◎",
			count: stats?.noPartOfSpeech ?? 0,
		},
		{
			type: "no-examples",
			tone: "muted",
			icon: "…",
			count: stats?.noExamples ?? 0,
		},
	];

	const total = stats?.total ?? 0;

	const keyFor: Record<QualityProblemType, keyof typeof dict.rows> = {
		"no-meanings": "noMeanings",
		"no-class": "noClass",
		"no-pos": "noPos",
		"no-examples": "noExamples",
	};

	return (
		<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
			<div className="text-sm font-semibold text-[var(--text)] mb-5">
				{dict.title}
			</div>
			{rows.map((row) => {
				const rowDict = dict.rows[keyFor[row.type]];
				return (
					<QualityBreakdownRow
						key={row.type}
						tone={row.tone}
						icon={row.icon}
						name={rowDict.name}
						description={rowDict.description}
						count={row.count}
						total={total}
						jumpLabel={dict.jumpTo}
						onJump={() => onJump(row.type)}
					/>
				);
			})}
		</div>
	);
};
