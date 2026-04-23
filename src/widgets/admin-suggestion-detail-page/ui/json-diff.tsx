import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { buildJsonDiff } from "../lib/format-json-diff";

interface JsonDiffProps {
	oldValue: string | null;
	newValue: string;
	dict: Dictionary["adminSuggestionDetail"]["diff"];
}

export const JsonDiff: FC<JsonDiffProps> = ({ oldValue, newValue, dict }) => {
	const lines = buildJsonDiff(oldValue, newValue);
	if (lines.length === 0) return null;

	return (
		<div className="mb-4">
			<div className="text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
				{dict.jsonLabel}
			</div>
			<pre className="font-mono text-xs p-4 bg-surface border border-edge rounded-md overflow-x-auto whitespace-pre-wrap leading-[1.7] text-subtle">
				{lines.map((line, idx) => (
					<div
						key={idx}
						className={cn(
							"rounded-[2px] px-0.5",
							line.type === "added" && "bg-success-dim text-success",
							line.type === "removed" && "bg-danger-dim text-danger line-through",
						)}
					>
						{line.text || " "}
					</div>
				))}
			</pre>
		</div>
	);
};
