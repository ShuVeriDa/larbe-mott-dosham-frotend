import type { Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";
import { formatCardDate, formatShortDate } from "../lib/format-date";
import { formatSuggestionValue } from "../lib/format-value";

interface SuggestionCardProps {
	suggestion: Suggestion;
	dict: Dictionary["suggestions"]["card"];
	groupsDict: Dictionary["history"]["groups"];
	lang: Locale;
}

type CardFieldKey = keyof Dictionary["suggestions"]["card"]["fields"];

const isKnownField = (
	field: string,
	dict: Dictionary["suggestions"]["card"]["fields"],
): field is CardFieldKey => field in dict;

const fieldLabel = (
	field: string,
	dict: Dictionary["suggestions"]["card"]["fields"],
): string => (isKnownField(field, dict) ? dict[field] : field);

const statusBorderClass: Record<Suggestion["status"], string> = {
	PENDING: "border-l-warning",
	APPROVED: "border-l-success",
	REJECTED: "border-l-danger",
};

const statusBadgeClass: Record<Suggestion["status"], string> = {
	PENDING: "bg-warning-dim text-warning",
	APPROVED: "bg-success-dim text-success",
	REJECTED: "bg-danger-dim text-danger",
};

const StatusBadge: FC<{ status: Suggestion["status"]; label: string }> = ({
	status,
	label,
}) => (
	<span
		className={cn(
			"inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-semibold tracking-[0.02em]",
			statusBadgeClass[status],
		)}
	>
		{label}
	</span>
);

export const SuggestionCard: FC<SuggestionCardProps> = ({
	suggestion,
	dict,
	groupsDict,
	lang,
}) => {
	const { status } = suggestion;
	const oldValue = formatSuggestionValue(suggestion.oldValue);
	const newValue = formatSuggestionValue(suggestion.newValue);

	const shortStatusLabel =
		status === "PENDING"
			? dict.statusPending
			: status === "APPROVED"
				? dict.statusApproved
				: dict.statusRejected;

	const createdAt = formatCardDate(
		suggestion.createdAt,
		lang,
		groupsDict.today,
		groupsDict.yesterday,
	);

	const reviewedAt = suggestion.reviewedAt
		? formatShortDate(suggestion.reviewedAt, lang)
		: null;

	const reviewerName = suggestion.reviewer?.name;

	const fullStatusLabel =
		status === "PENDING"
			? dict.statusPendingFull
			: status === "APPROVED"
				? dict.statusApprovedFull.replace("{date}", reviewedAt ?? "")
				: dict.statusRejectedFull.replace("{date}", reviewedAt ?? "");

	const entryId = suggestion.entry?.id ?? suggestion.entryId;
	const word = suggestion.entry?.word ?? "";

	return (
		<article
			className={cn(
				"relative rounded-lg border border-edge bg-surface px-5 py-5 border-l-[3px] transition-colors duration-150",
				"hover:bg-surface-hover hover:border-edge-hover",
				statusBorderClass[status],
			)}
		>
			<header className="flex flex-wrap items-center gap-2 mb-3 sm:gap-3">
				<Link
					href={`/${lang}/entry/${entryId}`}
					aria-label={dict.wordAriaLabel.replace("{word}", word)}
					lang="ce"
					className="text-lg font-semibold text-foreground tracking-[-0.01em] hover:text-primary"
				>
					{word}
				</Link>
				<span className="inline-flex items-center px-2 py-0.5 rounded-xs border border-edge bg-surface font-mono text-xs text-muted">
					{fieldLabel(suggestion.field, dict.fields)}
				</span>
				<StatusBadge status={status} label={shortStatusLabel} />
				<span className="ml-auto text-xs text-faint whitespace-nowrap">
					{createdAt}
				</span>
			</header>

			<div className="mb-3 overflow-hidden rounded-md border border-edge">
				<div className="flex items-stretch min-h-9 text-sm bg-danger-dim">
					<span className="w-9 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-danger">
						−
					</span>
					<span className="flex-1 px-3 py-2 break-words leading-normal text-subtle">
						{oldValue ? (
							<del className="no-underline line-through opacity-70">
								{oldValue}
							</del>
						) : (
							<span className="italic text-faint">{dict.emptyValue}</span>
						)}
					</span>
				</div>
				<div className="flex items-stretch min-h-9 text-sm bg-success-dim">
					<span className="w-9 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-success">
						+
					</span>
					<span className="flex-1 px-3 py-2 break-words leading-normal text-foreground">
						{newValue}
					</span>
				</div>
			</div>

			{suggestion.comment && (
				<p className="mb-3 px-4 py-3 rounded-md bg-surface border-l-[3px] border-edge-hover text-sm text-subtle leading-normal">
					<span className="opacity-60 mr-1" aria-hidden>
						💬
					</span>
					{suggestion.comment}
				</p>
			)}

			{status !== "PENDING" && suggestion.reviewComment && (
				<div
					className={cn(
						"mb-3 px-4 py-3 rounded-md border-l-[3px] text-sm leading-normal text-subtle",
						status === "APPROVED"
							? "bg-success-dim border-success"
							: "bg-danger-dim border-danger",
					)}
				>
					<div className="text-xs text-muted mb-1">
						{(reviewerName
							? dict.reviewMeta
							: dict.reviewMetaModerator
						)
							.replace("{name}", reviewerName ?? "")
							.replace("{date}", reviewedAt ?? "")}
					</div>
					{suggestion.reviewComment}
				</div>
			)}

			<footer className="flex flex-wrap items-center gap-2">
				<StatusBadge status={status} label={fullStatusLabel} />
			</footer>
		</article>
	);
};
