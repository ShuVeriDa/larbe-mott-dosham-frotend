"use client";

import type { ReviewDecision, Suggestion } from "@/features/suggestions";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";
import type { FC } from "react";

interface ConfirmDialogProps {
	action: ReviewDecision | null;
	suggestion: Suggestion;
	comment: string;
	dict: Dictionary["adminSuggestionDetail"]["confirm"];
	fieldsDict: Dictionary["adminSuggestionDetail"]["diff"]["fields"];
	onClose: () => void;
	onConfirm: () => void;
	isSubmitting: boolean;
}

const fieldLabel = (
	field: string,
	dict: Dictionary["adminSuggestionDetail"]["diff"]["fields"],
): string => (field in dict ? dict[field as keyof typeof dict] : field);

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
	action,
	suggestion,
	comment,
	dict,
	fieldsDict,
	onClose,
	onConfirm,
	isSubmitting,
}) => {
	const isApprove = action === "approve";
	const entryId = suggestion.entry?.id ?? suggestion.entryId;
	const word = suggestion.entry?.word ?? "";

	const title = isApprove ? dict.approveTitle : dict.rejectTitle;
	const bodyTemplate = isApprove ? dict.approveBody : dict.rejectBody;
	const body = bodyTemplate
		.replace("{word}", word)
		.replace("{entryId}", String(entryId))
		.replace("{field}", fieldLabel(suggestion.field, fieldsDict));

	const trimmedComment = comment.trim();
	const commentLine = trimmedComment
		? dict.commentNote.replace("{comment}", trimmedComment)
		: null;

	return (
		<Dialog
			open={action !== null}
			onOpenChange={(open) => {
				if (!open && !isSubmitting) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{body}
						{commentLine ? (
							<>
								<br />
								<span>{commentLine}</span>
							</>
						) : null}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="secondary"
						size="md"
						onClick={onClose}
						disabled={isSubmitting}
					>
						{dict.cancel}
					</Button>
					<Button
						type="button"
						variant="primary"
						size="md"
						onClick={onConfirm}
						disabled={isSubmitting}
						className={
							isApprove
								? "!bg-success !text-white hover:brightness-110"
								: "!bg-danger !text-white hover:brightness-110"
						}
					>
						{isApprove ? dict.approveConfirm : dict.rejectConfirm}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
