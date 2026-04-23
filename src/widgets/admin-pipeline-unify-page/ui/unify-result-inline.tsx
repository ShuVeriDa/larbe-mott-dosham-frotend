"use client";

import type { UnifyStepResponse } from "@/features/admin-pipeline-unify";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
	lang: Locale;
	result: UnifyStepResponse | null;
	error: string | null;
}

export const UnifyResultInline: FC<Props> = ({
	dict,
	lang,
	result,
	error,
}) => {
	if (!result && !error) return null;

	const text = error
		? `✗ ${error}`
		: result
			? dict.result.template
					.replace("{step}", String(result.step))
					.replace("{slug}", result.slug)
					.replace("{fromDict}", formatNumber(result.entriesFromDict, lang))
					.replace("{newWords}", formatNumber(result.newWords, lang))
					.replace("{enriched}", formatNumber(result.enrichedWords, lang))
					.replace(
						"{total}",
						formatNumber(result.totalUnifiedEntries, lang),
					)
					.replace(
						"{next}",
						result.nextRecommended?.slug ?? dict.result.noNext,
					)
			: "";

	return (
		<div
			className={cn(
				"p-3 px-4 rounded-md text-xs font-mono leading-relaxed mb-6 border",
				error
					? "bg-[var(--danger-dim)] text-[var(--danger)] border-[rgba(248,113,113,0.15)]"
					: "bg-[var(--success-dim)] text-[var(--success)] border-[rgba(52,211,153,0.15)]",
			)}
			role="status"
		>
			{text}
		</div>
	);
};
