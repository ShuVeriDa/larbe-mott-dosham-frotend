import type { Citation } from "@/entities/dictionary";
import type { FC } from "react";

interface CitationsPanelProps {
	citations: Citation[];
	emptyLabel: string;
}

export const CitationsPanel: FC<CitationsPanelProps> = ({
	citations,
	emptyLabel,
}) => {
	if (citations.length === 0) {
		return <p className="text-sm text-muted py-4">{emptyLabel}</p>;
	}

	return (
		<div>
			{citations.map((c, i) => (
				<blockquote
					key={i}
					className="p-4 bg-surface rounded-md mb-3 border-l-[3px] border-primary-dim"
				>
					<p className="text-base text-subtle italic leading-relaxed mb-2">
						{c.text}
					</p>
					{c.source && (
						<footer className="text-xs text-faint font-medium">
							— {c.source}
						</footer>
					)}
				</blockquote>
			))}
		</div>
	);
};
