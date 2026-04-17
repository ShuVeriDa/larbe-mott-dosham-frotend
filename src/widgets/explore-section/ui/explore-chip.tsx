import Link from "next/link";
import { FC } from "react";

interface IExploreChipProps {
	word: string;
	hint: string;
	lang: string;
}

export const ExploreChip: FC<IExploreChipProps> = ({ word, hint, lang }) => (
	<Link
		href={`/${lang}/search?q=${encodeURIComponent(word)}`}
		className="inline-flex items-center gap-2 px-4 py-2 border border-edge rounded-full text-sm text-foreground/80 bg-transparent transition-colors hover:border-edge-hover hover:bg-surface hover:text-foreground"
	>
		<span className="font-semibold text-foreground">{word}</span>
		<span className="text-xs text-faint">{hint}</span>
	</Link>
);
