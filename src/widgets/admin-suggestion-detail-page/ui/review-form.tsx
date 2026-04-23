"use client";

import type { ReviewDecision } from "@/features/suggestions";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface ReviewFormProps {
	dict: Dictionary["adminSuggestionDetail"]["review"];
	comment: string;
	onCommentChange: (value: string) => void;
	onSubmit: (action: ReviewDecision) => void;
	disabled: boolean;
}

export const ReviewForm: FC<ReviewFormProps> = ({
	dict,
	comment,
	onCommentChange,
	onSubmit,
	disabled,
}) => (
	<div className="mt-5 pt-5 border-t border-edge">
		<h2 className="text-sm font-semibold text-foreground mb-3">
			{dict.title}
		</h2>
		<label
			htmlFor="review-comment"
			className="text-sm font-medium text-muted mb-2 block"
		>
			{dict.commentLabel}
		</label>
		<textarea
			id="review-comment"
			rows={3}
			value={comment}
			onChange={(e) => onCommentChange(e.target.value)}
			placeholder={dict.commentPlaceholder}
			disabled={disabled}
			className="w-full px-4 py-3 border border-edge rounded-md text-base bg-surface text-foreground outline-none resize-y min-h-20 leading-normal placeholder:text-faint focus:border-primary focus:ring-3 focus:ring-primary/20 disabled:opacity-50"
		/>
		<div className="flex flex-col sm:flex-row gap-3 mt-4">
			<Button
				type="button"
				variant="danger"
				size="md"
				onClick={() => onSubmit("reject")}
				disabled={disabled}
				className="flex-1"
			>
				{dict.reject}
			</Button>
			<Button
				type="button"
				variant="primary"
				size="md"
				onClick={() => onSubmit("approve")}
				disabled={disabled}
				className="flex-1 !bg-success !text-white hover:brightness-110"
			>
				{dict.approve}
			</Button>
		</div>
	</div>
);
