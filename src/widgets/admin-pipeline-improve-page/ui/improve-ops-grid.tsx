"use client";

import type { ImproveResult } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"]["operations"];
	result: ImproveResult | null;
}

type Tone = "clean" | "fix" | "remove" | "style" | "trim" | "dedup";

interface Op {
	key: "normalizeStyles" | "fixExamples" | "removeEmpty" | "normalizeWords" | "trimLong" | "dedupMeanings";
	icon: string;
	tone: Tone;
	count: (r: ImproveResult) => number;
	unit: keyof Dictionary["admin"]["pipelineImprove"]["operations"]["units"];
}

const OPS: Op[] = [
	{
		key: "normalizeStyles",
		icon: "🧹",
		tone: "clean",
		count: (r) => r.normalizedStyleLabels,
		unit: "entries",
	},
	{
		key: "fixExamples",
		icon: "🔧",
		tone: "fix",
		count: (r) => r.removedBrokenExamples,
		unit: "examples",
	},
	{
		key: "removeEmpty",
		icon: "🗑",
		tone: "remove",
		count: (r) => r.removedEmptyMeanings,
		unit: "removed",
	},
	{
		key: "normalizeWords",
		icon: "✏️",
		tone: "style",
		count: (r) => r.normalizedWords,
		unit: "entries",
	},
	{
		key: "trimLong",
		icon: "📐",
		tone: "trim",
		count: (r) => r.truncatedFields,
		unit: "entries",
	},
	{
		key: "dedupMeanings",
		icon: "🔄",
		tone: "dedup",
		count: (r) => r.deduplicatedMeanings,
		unit: "duplicates",
	},
];

const TONE: Record<Tone, string> = {
	clean: "bg-[var(--success-dim)] text-[var(--success)]",
	fix: "bg-[var(--info-dim)] text-[var(--info)]",
	remove: "bg-[var(--danger-dim)] text-[var(--danger)]",
	style: "bg-[var(--warning-dim)] text-[var(--warning)]",
	trim: "bg-[var(--accent-dim)] text-[var(--accent)]",
	dedup: "bg-[var(--surface-active)] text-[var(--text-muted)]",
};

export const ImproveOpsGrid: FC<Props> = ({ dict, result }) => (
	<section className="mb-8">
		<header className="flex items-center justify-between gap-4 mb-4">
			<h2 className="text-lg font-semibold text-[var(--text)]">
				{dict.title}
			</h2>
		</header>
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{OPS.map((op) => {
				const count = result ? op.count(result) : null;
				return (
					<div
						key={op.key}
						className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
					>
						<div
							className={cn(
								"w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3",
								TONE[op.tone],
							)}
							aria-hidden
						>
							{op.icon}
						</div>
						<div className="text-sm font-semibold text-[var(--text)] mb-1">
							{dict[op.key].title}
						</div>
						<p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
							{dict[op.key].description}
						</p>
						<div className="text-xs font-mono text-[var(--text-secondary)]">
							{dict.lastRun
								.replace("{count}", count === null ? "—" : String(count))
								.replace("{unit}", dict.units[op.unit])}
						</div>
					</div>
				);
			})}
		</div>
	</section>
);
