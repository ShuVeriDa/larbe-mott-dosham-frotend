import type { FC } from "react";

interface PronunciationButtonProps {
	label: string;
	hint: string;
}

export const PronunciationButton: FC<PronunciationButtonProps> = ({
	label,
	hint,
}) => (
	<button
		type="button"
		title={hint}
		disabled
		className="inline-flex items-center gap-2 mt-2 bg-surface border border-edge rounded-full px-3 py-1 text-xs text-muted cursor-not-allowed opacity-70 hover:border-edge-hover hover:text-foreground transition disabled:hover:border-edge disabled:hover:text-muted"
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className="w-3.5 h-3.5"
			aria-hidden="true"
		>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
		</svg>
		{label}
	</button>
);
