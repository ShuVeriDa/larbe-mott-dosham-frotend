"use client";

import type { QualityProblemType } from "@/features/admin-quality-problems";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { PROBLEM_TAG_CLASSES } from "../lib/problem-meta";

interface ProblemTagProps {
	type: QualityProblemType;
	label: string;
}

export const ProblemTag: FC<ProblemTagProps> = ({ type, label }) => (
	<span
		className={cn(
			"inline-flex items-center gap-1 text-[0.65rem] font-medium px-2 py-[2px] rounded-full whitespace-nowrap",
			PROBLEM_TAG_CLASSES[type],
		)}
	>
		{label}
	</span>
);
