"use client";

import type { ReviewDecision, Suggestion } from "@/features/suggestions";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";
import { type FC, type FormEvent, useId, useState } from "react";

interface AdminSuggestionsReviewDialogProps {
	target: { suggestion: Suggestion; decision: ReviewDecision } | null;
	dict: Dictionary["adminSuggestions"]["reviewDialog"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (comment: string) => void;
}

interface ReviewDialogFormProps {
	decision: ReviewDecision;
	dict: Dictionary["adminSuggestions"]["reviewDialog"];
	saving: boolean;
	onClose: () => void;
	onSubmit: (comment: string) => void;
}

const ReviewDialogForm: FC<ReviewDialogFormProps> = ({
	decision,
	dict,
	saving,
	onClose,
	onSubmit,
}) => {
	const textareaId = useId();
	const [comment, setComment] = useState("");

	const isApprove = decision === "approve";
	const title = isApprove ? dict.titleApprove : dict.titleReject;
	const confirmLabel = isApprove
		? saving
			? dict.savingApprove
			: dict.confirmApprove
		: saving
			? dict.savingReject
			: dict.confirmReject;

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(comment);
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>

			<div className="flex flex-col gap-2">
				<label
					htmlFor={textareaId}
					className="text-sm font-medium text-muted-foreground"
				>
					{dict.commentLabel}
				</label>
				<textarea
					id={textareaId}
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder={dict.commentPlaceholder}
					rows={3}
					disabled={saving}
					className={cn(
						"w-full resize-y min-h-[80px] px-4 py-3 rounded-md border border-border bg-surface text-foreground text-sm outline-none",
						"placeholder:text-faint",
						"focus:border-primary focus:shadow-focus",
						"disabled:opacity-60 disabled:cursor-not-allowed",
					)}
				/>
			</div>

			<DialogFooter>
				<Button
					type="button"
					variant="secondary"
					onClick={onClose}
					disabled={saving}
				>
					{dict.cancel}
				</Button>
				<Button
					type="submit"
					disabled={saving}
					className={cn(
						isApprove
							? "border-transparent bg-success-dim text-success hover:border-success"
							: "border-transparent bg-danger-dim text-danger hover:border-danger",
					)}
				>
					{confirmLabel}
				</Button>
			</DialogFooter>
		</form>
	);
};

export const AdminSuggestionsReviewDialog: FC<
	AdminSuggestionsReviewDialogProps
> = ({ target, dict, saving, onClose, onSubmit }) => (
	<Dialog
		open={!!target}
		onOpenChange={(open) => {
			if (!open && !saving) onClose();
		}}
	>
		<DialogContent>
			{target && (
				<ReviewDialogForm
					key={target.suggestion.id + target.decision}
					decision={target.decision}
					dict={dict}
					saving={saving}
					onClose={onClose}
					onSubmit={onSubmit}
				/>
			)}
		</DialogContent>
	</Dialog>
);
