import type { Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatDateTime } from "../lib/format-date";

interface ReviewResultProps {
	suggestion: Suggestion;
	dict: Dictionary["adminSuggestionDetail"]["result"];
	lang: Locale;
}

export const ReviewResult: FC<ReviewResultProps> = ({
	suggestion,
	dict,
	lang,
}) => {
	if (suggestion.status === "PENDING") return null;

	const isApproved = suggestion.status === "APPROVED";
	const icon = isApproved ? "✓" : "✕";
	const label = isApproved ? dict.approved : dict.rejected;
	const reviewerName = suggestion.reviewer?.name ?? dict.byModerator;
	const reviewedAt = suggestion.reviewedAt
		? formatDateTime(suggestion.reviewedAt, lang)
		: "";
	const metaLine = dict.metaLine
		.replace("{date}", reviewedAt)
		.replace("{name}", reviewerName);

	return (
		<div
			className={cn(
				"mt-5 px-5 py-5 rounded-md border-l-[3px]",
				isApproved
					? "bg-success-dim border-success"
					: "bg-danger-dim border-danger",
			)}
		>
			<div className="flex items-center gap-3 mb-2 flex-wrap">
				<span className="text-sm font-semibold text-foreground">
					{icon} {label}
				</span>
				<span className="text-xs text-muted">{metaLine}</span>
			</div>
			{suggestion.reviewComment ? (
				<p className="text-base text-subtle leading-normal whitespace-pre-line">
					{suggestion.reviewComment}
				</p>
			) : (
				<p className="text-base text-muted italic">{dict.noComment}</p>
			)}
		</div>
	);
};
