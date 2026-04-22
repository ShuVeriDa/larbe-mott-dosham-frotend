import Link from "next/link";
import type { FC } from "react";

interface PhraseologyExploreChipProps {
	expression: string;
	meaning?: string | null;
	lang: string;
}

export const PhraseologyExploreChip: FC<PhraseologyExploreChipProps> = ({
	expression,
	meaning,
	lang,
}) => (
	<Link
		href={`/${lang}/phraseology?q=${encodeURIComponent(expression)}`}
		className="inline-flex items-center gap-2 px-4 py-2 border border-edge rounded-full text-sm text-foreground/80 bg-transparent transition-colors hover:border-edge-hover hover:bg-surface hover:text-foreground"
	>
		<span className="font-semibold text-foreground">{expression}</span>
		{meaning ? <span className="text-xs text-faint">— {meaning}</span> : null}
	</Link>
);
