import type { FC } from "react";

interface Props {
	message: string;
}

export const WarningBanner: FC<Props> = ({ message }) => (
	<div
		role="note"
		className="flex items-start gap-3 px-5 py-4 bg-[var(--warning-dim)] border border-[var(--warning)] rounded-2xl mb-8 text-sm text-[var(--text-secondary)] leading-relaxed"
	>
		<span className="text-xl shrink-0 mt-[1px]" aria-hidden>
			⚠️
		</span>
		<p>{message}</p>
	</div>
);
