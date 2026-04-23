import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { diffWords, type DiffPart } from "../lib/format-text-diff";
import { formatSuggestionText } from "../lib/format-value";

interface TextDiffProps {
	oldValue: string | null;
	newValue: string;
	dict: Dictionary["adminSuggestionDetail"]["diff"];
}

const renderParts = (parts: DiffPart[], kind: "old" | "new") =>
	parts.map((part, idx) => {
		if (part.type === "equal") {
			return <span key={idx}>{part.value}</span>;
		}
		if (kind === "old" && part.type === "removed") {
			return (
				<del
					key={idx}
					className="no-underline line-through opacity-65"
				>
					{part.value}
				</del>
			);
		}
		if (kind === "new" && part.type === "added") {
			return (
				<ins key={idx} className="no-underline font-semibold">
					{part.value}
				</ins>
			);
		}
		return null;
	});

export const TextDiff: FC<TextDiffProps> = ({ oldValue, newValue, dict }) => {
	const oldText = formatSuggestionText(oldValue);
	const newText = formatSuggestionText(newValue);
	const { old: oldParts, next: newParts } = diffWords(oldText, newText);

	return (
		<div className="mb-4">
			<div className="text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">
				{dict.textLabel}
			</div>
			<div className="overflow-hidden rounded-md border border-edge">
				<DiffRow kind="old">
					{oldText ? (
						renderParts(oldParts, "old")
					) : (
						<span className="italic text-faint">{dict.emptyValue}</span>
					)}
				</DiffRow>
				<DiffRow kind="new">{renderParts(newParts, "new")}</DiffRow>
			</div>
		</div>
	);
};

const DiffRow: FC<{ kind: "old" | "new"; children: React.ReactNode }> = ({
	kind,
	children,
}) => (
	<div
		className={cn(
			"flex items-stretch text-base min-h-11",
			kind === "old" ? "bg-danger-dim" : "bg-success-dim",
		)}
	>
		<span
			className={cn(
				"w-11 shrink-0 flex items-center justify-center font-mono font-bold text-sm",
				kind === "old" ? "text-danger" : "text-success",
			)}
			aria-hidden
		>
			{kind === "old" ? "−" : "+"}
		</span>
		<span
			className={cn(
				"flex-1 px-4 py-3 break-words leading-normal",
				kind === "old" ? "text-subtle" : "text-foreground",
			)}
		>
			{children}
		</span>
	</div>
);
