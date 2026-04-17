import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { NounClass, WordLevel } from "../../types";

const NOUN_CLASS_COLORS: Record<string, string> = {
	ву: "bg-[var(--class-vu-bg)] text-[var(--class-vu)]",
	йу: "bg-[var(--class-yu-bg)] text-[var(--class-yu)]",
	ду: "bg-[var(--class-du-bg)] text-[var(--class-du)]",
	бу: "bg-[var(--class-bu-bg)] text-[var(--class-bu)]",
};

const WORD_LEVEL_COLORS: Record<WordLevel, string> = {
	A: "bg-[var(--cefr-a1-bg)] text-[var(--cefr-a1)]",
	B: "bg-[var(--cefr-b1-bg)] text-[var(--cefr-b1)]",
	C: "bg-[var(--cefr-c1-bg)] text-[var(--cefr-c1)]",
};

const BASE =
	"inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-semibold tracking-[0.02em]";

export const NounClassBadge: FC<{ nounClass: NounClass | string }> = ({
	nounClass,
}) => (
	<span className={cn(BASE, NOUN_CLASS_COLORS[nounClass] ?? "bg-surface text-subtle")}>
		{nounClass}
	</span>
);

export const WordLevelTag: FC<{ level: WordLevel }> = ({ level }) => (
	<span className={cn(BASE, WORD_LEVEL_COLORS[level])}>{level}</span>
);

export const SourceBadge: FC<{ source: string }> = ({ source }) => (
	<span className="inline-flex items-center px-2 py-px rounded-xs text-[0.6rem] font-mono font-normal text-faint border border-edge bg-transparent">
		{source}
	</span>
);

export const NeologismBadge: FC<{ label: string }> = ({ label }) => (
	<span
		className={cn(
			"inline-flex items-center px-2 py-0.5 rounded-xs",
			"text-[0.6rem] font-medium",
			"bg-[var(--warning-dim)] text-[var(--warning)]",
		)}
	>
		{label}
	</span>
);
