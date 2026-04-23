import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface UserCommentProps {
	comment: string;
	dict: Dictionary["adminSuggestionDetail"]["diff"];
}

export const UserComment: FC<UserCommentProps> = ({ comment, dict }) => (
	<div className="mb-5 px-4 py-3 rounded-md bg-surface border-l-[3px] border-edge-hover">
		<div className="text-xs text-muted mb-2 flex items-center gap-2">
			<span aria-hidden>💬</span>
			<span>{dict.commentLabel}</span>
		</div>
		<p className="text-base text-subtle leading-normal whitespace-pre-line">
			{comment}
		</p>
	</div>
);
