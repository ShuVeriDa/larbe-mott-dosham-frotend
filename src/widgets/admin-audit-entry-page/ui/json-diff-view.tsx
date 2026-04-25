import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { JsonDiffLine } from "../lib/json-diff-lines";

interface JsonDiffViewProps {
	lines: JsonDiffLine[];
	noTopBorder?: boolean;
	className?: string;
}

const LINE_CLASS = {
	added: "bg-[var(--success-dim)] text-[var(--success)]",
	removed: "bg-[var(--danger-dim)] text-[var(--danger)]",
	context: "text-[var(--text-faint)]",
} as const;

const LINE_SIGN = {
	added: "+",
	removed: "−",
	context: " ",
} as const;

export const JsonDiffView: FC<JsonDiffViewProps> = ({
	lines,
	noTopBorder,
	className,
}) => (
	<pre
		className={cn(
			"font-mono text-[0.7rem] leading-[1.7] px-4 py-3 overflow-x-auto m-0",
			!noTopBorder && "border-t border-[var(--border)]",
			className,
		)}
	>
		{lines.map((line, i) => (
			<div
				// biome-ignore lint/suspicious/noArrayIndexKey: derived from static order
				key={i}
				className={cn("flex gap-2", LINE_CLASS[line.kind])}
			>
				<span
					aria-hidden
					className="w-3 shrink-0 text-center font-bold opacity-60"
				>
					{LINE_SIGN[line.kind]}
				</span>
				<span className="whitespace-pre-wrap break-all">{line.text}</span>
			</div>
		))}
	</pre>
);
