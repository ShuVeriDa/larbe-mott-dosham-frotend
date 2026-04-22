import Link from "next/link";
import type { FC } from "react";

interface PhraseologySearchHintsProps {
	label: string;
	words: readonly string[];
	lang: string;
}

export const PhraseologySearchHints: FC<PhraseologySearchHintsProps> = ({
	label,
	words,
	lang,
}) => (
	<div className="flex items-center justify-center gap-1 flex-wrap text-xs text-faint mt-1 mb-4">
		<span>{label}</span>
		{words.map((word, i) => (
			<span
				key={`${word}-${i}`}
				className="inline-flex items-center text-primary gap-1"
			>
				{i > 0 && (
					<span aria-hidden="true" className="text-faint">
						&#8226;
					</span>
				)}
				<Link
					href={`/${lang}/phraseology?q=${encodeURIComponent(word)}`}
					className="text-primary border-b border-primary/20 hover:border-primary transition-colors"
				>
					{word}
				</Link>
			</span>
		))}
	</div>
);
