import type { FC } from "react";

interface SourceBadgeProps {
	slug: string;
}

export const SourceBadge: FC<SourceBadgeProps> = ({ slug }) => (
	<span className="font-mono text-[0.65rem] text-[var(--text-faint)] bg-[var(--surface)] border border-[var(--border)] px-1.5 py-[2px] rounded">
		{slug}
	</span>
);
