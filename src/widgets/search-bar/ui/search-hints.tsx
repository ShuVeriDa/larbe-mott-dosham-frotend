import Link from "next/link";

interface SearchHintsProps {
	label: string;
	words: readonly string[];
	lang: string;
}

export const SearchHints = ({ label, words, lang }: SearchHintsProps) => (
	<div className="flex items-center justify-center gap-1 flex-wrap text-xs text-faint mt-1 mb-4">
		<span>{label}</span>
		{words.map((word, i) => (
			<span key={word} className="inline-flex items-center text-primary gap-1">
				{i > 0 && (
					<span aria-hidden="true" className="text-faint">
						&#8226;
					</span>
				)}
				<Link
					href={`/${lang}/search?q=${encodeURIComponent(word)}`}
					className="text-primary border-b border-primary/20 hover:border-primary transition-colors"
				>
					{word}
				</Link>
			</span>
		))}
	</div>
);
