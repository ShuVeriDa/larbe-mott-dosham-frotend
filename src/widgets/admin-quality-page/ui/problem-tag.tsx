import type { QualityProblemType } from "@/features/admin-quality";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface ProblemTagProps {
	type: QualityProblemType;
	dict: Dictionary["admin"]["quality"]["problems"]["tags"];
}

const TAG_CLASS: Record<QualityProblemType, string> = {
	"no-meanings": "bg-[var(--danger-dim)] text-[var(--danger)]",
	"no-class": "bg-[var(--warning-dim)] text-[var(--warning)]",
	"no-pos": "bg-[var(--info-dim)] text-[var(--info)]",
	"no-examples": "bg-[var(--surface-active)] text-[var(--text-muted)]",
};

const TAG_KEY: Record<QualityProblemType, keyof ProblemTagProps["dict"]> = {
	"no-meanings": "noMeanings",
	"no-class": "noClass",
	"no-pos": "noPos",
	"no-examples": "noExamples",
};

export const ProblemTag: FC<ProblemTagProps> = ({ type, dict }) => (
	<span
		className={cn(
			"text-[0.65rem] font-medium px-2 py-[2px] rounded-full whitespace-nowrap",
			TAG_CLASS[type],
		)}
	>
		{dict[TAG_KEY[type]]}
	</span>
);
