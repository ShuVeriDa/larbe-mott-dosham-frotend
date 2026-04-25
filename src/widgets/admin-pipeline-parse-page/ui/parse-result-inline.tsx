"use client";

import type { PipelineRunResult } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { ParseResult } from "../model/use-parse-page";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["result"];
	result: ParseResult | null;
}

export const ParseResultInline: FC<Props> = ({ dict, result }) => {
	if (!result) return null;

	let text: string;
	if (!result.ok) {
		text = dict.err.replace("{message}", result.message);
	} else if (Array.isArray(result.data)) {
		const total = result.data.reduce(
			(sum, r) => sum + (r.parsedCount ?? 0),
			0,
		);
		text = dict.okAll
			.replace("{count}", `${result.data.length}`)
			.replace("{total}", `${total}`);
	} else {
		const r = result.data as PipelineRunResult;
		text = dict.okOne
			.replace("{slug}", r.slug ?? result.slug ?? "?")
			.replace("{source}", `${r.sourceCount ?? "?"}`)
			.replace("{parsed}", `${r.parsedCount ?? "?"}`)
			.replace("{file}", r.slug ? `dictionaries/parsed/${r.slug}.json` : "—");
	}

	return (
		<div
			className={cn(
				"px-4 py-3 rounded-md font-mono text-xs leading-relaxed mb-6 border",
				result.ok
					? "bg-[var(--success-dim)] text-[var(--success)] border-[rgba(52,211,153,.15)]"
					: "bg-[var(--danger-dim)] text-[var(--danger)] border-[rgba(248,113,113,.15)]",
			)}
			role={result.ok ? "status" : "alert"}
		>
			{text}
		</div>
	);
};
