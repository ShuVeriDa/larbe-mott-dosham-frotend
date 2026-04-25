"use client";

import { type QualityStats, useQualityStats } from "@/features/admin-quality";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { SectionCard } from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"]["quality"];
	lang: Locale;
}

type Tone = "danger" | "warning" | "info" | "muted";

interface Row {
	key: keyof Omit<
		Dictionary["admin"]["pipelineImprove"]["quality"],
		"title" | "details" | "empty"
	>;
	icon: string;
	tone: Tone;
	count: (s: QualityStats) => number;
}

const ROWS: Row[] = [
	{
		key: "noMeanings",
		icon: "✕",
		tone: "danger",
		count: (s) => s.noMeanings,
	},
	{
		key: "nounsWithoutClass",
		icon: "◇",
		tone: "warning",
		count: (s) => s.nounsWithoutClass,
	},
	{
		key: "noPartOfSpeech",
		icon: "◎",
		tone: "info",
		count: (s) => s.noPartOfSpeech,
	},
	{
		key: "noExamples",
		icon: "…",
		tone: "muted",
		count: (s) => s.noExamples,
	},
];

const ICON: Record<Tone, string> = {
	danger: "bg-[var(--danger-dim)] text-[var(--danger)]",
	warning: "bg-[var(--warning-dim)] text-[var(--warning)]",
	info: "bg-[var(--info-dim)] text-[var(--info)]",
	muted: "bg-[var(--surface-active)] text-[var(--text-muted)]",
};

const FILL: Record<Tone, string> = {
	danger: "bg-[var(--danger)]",
	warning: "bg-[var(--warning)]",
	info: "bg-[var(--info)]",
	muted: "bg-[var(--text-muted)]",
};

const nf = new Intl.NumberFormat("ru-RU");
const pctFmt = new Intl.NumberFormat("ru-RU", {
	maximumFractionDigits: 1,
	minimumFractionDigits: 1,
});

export const ImproveQualityPanel: FC<Props> = ({ dict, lang }) => {
	const query = useQualityStats();
	const stats = query.data;

	return (
		<section className="mb-8">
			<header className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.title}
				</h2>
				<Link
					href={`/${lang}/admin/quality`}
					className="btn btn-sm btn-ghost"
				>
					{dict.details}
				</Link>
			</header>
			<SectionCard className="mb-0">
				{!stats ? (
					<div className="text-sm text-[var(--text-muted)] py-6 text-center">
						{dict.empty}
					</div>
				) : (
					<div className="divide-y divide-[var(--border)]">
						{ROWS.map((row) => {
							const count = row.count(stats);
							const pct = stats.total > 0
								? (count / stats.total) * 100
								: 0;
							return (
								<div
									key={row.key}
									className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
								>
									<div
										className={cn(
											"w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0",
											ICON[row.tone],
										)}
										aria-hidden
									>
										{row.icon}
									</div>
									<div className="flex-1 min-w-[120px] text-sm font-medium text-[var(--text)]">
										{dict[row.key]}
									</div>
									<div className="flex-[2] min-w-[80px] hidden md:block">
										<div className="h-1.5 bg-[var(--surface-active)] rounded-full overflow-hidden">
											<div
												className={cn(
													"h-full rounded-full transition-[width] duration-500",
													FILL[row.tone],
												)}
												style={{ width: `${Math.min(100, pct)}%` }}
											/>
										</div>
									</div>
									<div className="flex items-center gap-3 shrink-0 tabular-nums">
										<span className="text-sm font-semibold text-[var(--text)] min-w-[50px] text-right">
											{nf.format(count)}
										</span>
										<span className="text-xs text-[var(--text-muted)] min-w-[40px] text-right">
											{pctFmt.format(pct)}%
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</SectionCard>
		</section>
	);
};
