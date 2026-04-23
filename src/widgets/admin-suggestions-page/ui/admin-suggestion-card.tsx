"use client";

import type { ReviewDecision, Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";
import {
	formatCardDate,
	formatShortDate,
	getUserInitials,
} from "../lib/format-date";
import { formatSuggestionValue } from "../lib/format-value";

interface AdminSuggestionCardProps {
	suggestion: Suggestion;
	dict: Dictionary["adminSuggestions"]["card"];
	groupsDict: Dictionary["history"]["groups"];
	lang: Locale;
	canReview: boolean;
	onReview: (suggestion: Suggestion, decision: ReviewDecision) => void;
}

type CardFieldKey = keyof Dictionary["adminSuggestions"]["card"]["fields"];

const isKnownField = (
	field: string,
	dict: Dictionary["adminSuggestions"]["card"]["fields"],
): field is CardFieldKey => field in dict;

const fieldLabel = (
	field: string,
	dict: Dictionary["adminSuggestions"]["card"]["fields"],
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

export const AdminSuggestionCard: FC<AdminSuggestionCardProps> = ({
	suggestion,
	dict,
	groupsDict,
	lang,
	canReview,
	onReview,
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
	const authorName = suggestion.user?.name ?? suggestion.user?.username ?? "";
	const entryId = suggestion.entry?.id ?? suggestion.entryId;
	const word = suggestion.entry?.word ?? "";

	const fullStatusLabel =
		status === "PENDING"
			? shortStatusLabel
			: status === "APPROVED"
				? dict.statusApprovedAt.replace("{date}", reviewedAt ?? "")
				: dict.statusRejectedAt.replace("{date}", reviewedAt ?? "");

	return (
		<article
			data-status={status.toLowerCase()}
			className={cn(
				"relative rounded-lg border border-border bg-surface px-5 py-5 border-l-[3px] transition-colors duration-150",
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
				<span className="font-mono text-xs text-faint">
					#{entryId}
				</span>
				<span className="inline-flex items-center px-2 py-0.5 rounded-xs border border-border bg-surface font-mono text-xs text-muted-foreground">
					{fieldLabel(suggestion.field, dict.fields)}
				</span>
				<StatusBadge status={status} label={shortStatusLabel} />

				<div className="ml-auto flex items-center gap-3 min-w-0">
					{authorName && (
						<span className="flex items-center gap-2 text-xs text-muted-foreground">
							<span
								aria-hidden
								className="size-5 rounded-full bg-surface-active text-[0.55rem] font-semibold text-muted-foreground flex items-center justify-center"
							>
								{getUserInitials(authorName)}
							</span>
							<span className="truncate">{authorName}</span>
						</span>
					)}
					<span className="text-xs text-faint whitespace-nowrap">
						{createdAt}
					</span>
				</div>
			</header>

			<div className="mb-3 overflow-hidden rounded-md border border-border">
				<div className="flex items-stretch min-h-9 text-sm bg-danger-dim">
					<span className="w-9 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-danger">
						−
					</span>
					<span className="flex-1 px-3 py-2 break-words leading-normal text-muted-foreground">
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
						{newValue || (
							<span className="italic text-faint">{dict.emptyValue}</span>
						)}
					</span>
				</div>
			</div>

			{suggestion.comment && (
				<p className="mb-3 px-4 py-3 rounded-md bg-surface border-l-[3px] border-edge-hover text-sm text-muted-foreground leading-normal">
					<span className="opacity-60 mr-1" aria-hidden>
						💬
					</span>
					{suggestion.comment}
				</p>
			)}

			{status !== "PENDING" && suggestion.reviewComment && (
				<div
					className={cn(
						"mb-3 px-4 py-3 rounded-md border-l-[3px] text-sm leading-normal text-muted-foreground",
						status === "APPROVED"
							? "bg-success-dim border-success"
							: "bg-danger-dim border-danger",
					)}
				>
					<div className="text-xs text-muted-foreground mb-1">
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
				{status === "PENDING" ? (
					<>
						<Button asChild variant="ghost" size="sm">
							<Link href={`/${lang}/entry/${entryId}`}>{dict.entryLink}</Link>
						</Button>
						{canReview && (
							<div className="flex gap-2 ml-auto">
								<Button
									type="button"
									variant="danger"
									size="sm"
									onClick={() => onReview(suggestion, "reject")}
								>
									{dict.reject}
								</Button>
								<Button
									type="button"
									size="sm"
									className="border-transparent bg-success-dim text-success hover:border-success"
									onClick={() => onReview(suggestion, "approve")}
								>
									{dict.approve}
								</Button>
							</div>
						)}
					</>
				) : (
					<>
						<StatusBadge status={status} label={fullStatusLabel} />
						<Button asChild variant="ghost" size="sm" className="ml-auto">
							<Link href={`/${lang}/entry/${entryId}`}>{dict.entryLink}</Link>
						</Button>
					</>
				)}
			</footer>
		</article>
	);
};
