import type { ReviewDecision, Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { JsonDiff } from "./json-diff";
import { ReviewForm } from "./review-form";
import { ReviewResult } from "./review-result";
import { TextDiff } from "./text-diff";
import { UserComment } from "./user-comment";

interface DiffCardProps {
	suggestion: Suggestion;
	dict: Dictionary["adminSuggestionDetail"];
	lang: Locale;
	canReview: boolean;
	reviewComment: string;
	onReviewCommentChange: (value: string) => void;
	confirmAction: ReviewDecision | null;
	onOpenConfirm: (action: ReviewDecision) => void;
	onCloseConfirm: () => void;
	onSubmitReview: () => void;
	isReviewing: boolean;
}

const fieldLabel = (
	field: string,
	dict: Dictionary["adminSuggestionDetail"]["diff"]["fields"],
): string => (field in dict ? dict[field as keyof typeof dict] : field);

export const DiffCard: FC<DiffCardProps> = ({
	suggestion,
	dict,
	lang,
	canReview,
	reviewComment,
	onReviewCommentChange,
	confirmAction,
	onOpenConfirm,
	onCloseConfirm,
	onSubmitReview,
	isReviewing,
}) => {
	const isPending = suggestion.status === "PENDING";

	return (
		<>
			<section className="rounded-lg border border-edge bg-surface overflow-hidden">
				<header className="px-5 py-4 border-b border-edge flex items-center justify-between gap-3">
					<h2 className="text-sm font-semibold text-foreground">
						{dict.diff.cardTitle}
					</h2>
					<span className="inline-block font-mono text-sm text-primary bg-primary-dim px-3 py-1 rounded-sm">
						{fieldLabel(suggestion.field, dict.diff.fields)}
					</span>
				</header>

				<div className="px-5 py-5">
					<TextDiff
						oldValue={suggestion.oldValue}
						newValue={suggestion.newValue}
						dict={dict.diff}
					/>

					<JsonDiff
						oldValue={suggestion.oldValue}
						newValue={suggestion.newValue}
						dict={dict.diff}
					/>

					{suggestion.comment ? (
						<UserComment comment={suggestion.comment} dict={dict.diff} />
					) : null}

					{isPending && canReview ? (
						<ReviewForm
							dict={dict.review}
							comment={reviewComment}
							onCommentChange={onReviewCommentChange}
							onSubmit={onOpenConfirm}
							disabled={isReviewing}
						/>
					) : null}

					{!isPending ? (
						<ReviewResult
							suggestion={suggestion}
							dict={dict.result}
							lang={lang}
						/>
					) : null}
				</div>
			</section>

			<ConfirmDialog
				action={confirmAction}
				suggestion={suggestion}
				comment={reviewComment}
				dict={dict.confirm}
				fieldsDict={dict.diff.fields}
				onClose={onCloseConfirm}
				onConfirm={onSubmitReview}
				isSubmitting={isReviewing}
			/>
		</>
	);
};
