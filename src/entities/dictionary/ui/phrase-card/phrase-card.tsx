import type { FC } from "react";
import type { PhraseologyEntry } from "../../types";
import { HighlightMatch, SourceBadge } from "../entry-card";

export interface PhraseCardLabels {
	/** Подпись для индикатора альтернативных форм (`hasVariants === true`). */
	variants: string;
}

interface PhraseCardProps {
	entry: PhraseologyEntry;
	query: string;
	labels: PhraseCardLabels;
}

export const PhraseCard: FC<PhraseCardProps> = ({ entry, query, labels }) => (
	<article className="block bg-surface border border-edge rounded-lg px-5 py-4 transition-[background,border,transform] duration-150 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-surface-hover hover:border-edge-hover hover:translate-x-1">
		<header className="flex items-baseline gap-2 flex-wrap mb-2">
			<h3 className="text-lg font-semibold text-foreground tracking-[-0.01em] leading-snug">
				<HighlightMatch text={entry.canonical} query={query} />
			</h3>
			{entry.hasVariants && (
				<span
					className="inline-flex items-center px-2 py-0.5 rounded-xs text-[0.6rem] font-medium bg-surface-active text-subtle"
					title={labels.variants}
				>
					{labels.variants}
				</span>
			)}
		</header>

		<p className="text-sm text-subtle font-light leading-relaxed mb-3">
			<HighlightMatch text={entry.definitionNah} query={query} />
		</p>

		{entry.definitionRu && (
			<p className="text-sm text-muted font-light italic leading-relaxed mb-3">
				<HighlightMatch text={entry.definitionRu} query={query} />
			</p>
		)}

		<footer className="flex gap-2 flex-wrap items-center pt-3 border-t border-edge">
			<SourceBadge source={entry.source} />
		</footer>
	</article>
);
