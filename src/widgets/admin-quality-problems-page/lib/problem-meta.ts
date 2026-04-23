import type { QualityProblemType } from "@/features/admin-quality-problems";
import type { Dictionary } from "@/i18n/dictionaries";

type ProblemsDict = Dictionary["admin"]["qualityProblems"];

export const PROBLEM_TYPES: QualityProblemType[] = [
	"no-meanings",
	"no-class",
	"no-pos",
	"no-examples",
];

export const PROBLEM_TAG_CLASSES: Record<QualityProblemType, string> = {
	"no-meanings": "bg-[var(--danger-dim)] text-[var(--danger)]",
	"no-class": "bg-[var(--warning-dim)] text-[var(--warning)]",
	"no-pos": "bg-[var(--info-dim)] text-[var(--info)]",
	"no-examples": "bg-[var(--surface-active)] text-[var(--text-muted)]",
};

export const PROBLEM_DOT_CLASSES: Record<QualityProblemType, string> = {
	"no-meanings": "bg-[var(--danger)]",
	"no-class": "bg-[var(--warning)]",
	"no-pos": "bg-[var(--info)]",
	"no-examples": "bg-[var(--text-muted)]",
};

export const getProblemTagLabel = (
	type: QualityProblemType,
	dict: ProblemsDict,
): string => {
	switch (type) {
		case "no-meanings":
			return dict.tags.noMeanings;
		case "no-class":
			return dict.tags.noClass;
		case "no-pos":
			return dict.tags.noPos;
		case "no-examples":
			return dict.tags.noExamples;
	}
};

export const getProblemSummaryLabel = (
	type: QualityProblemType,
	dict: ProblemsDict,
): string => {
	switch (type) {
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
