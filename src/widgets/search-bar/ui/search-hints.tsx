import Link from "next/link";

const HINT_WORDS = ["стаг", "человек", "лаха"] as const;

export const SearchHints = () => (
	<div className="flex items-center justify-center gap-1 flex-wrap text-xs text-faint mt-1 mb-4">
		<span>Попробуйте:</span>
		{HINT_WORDS.map((word, i) => (
			<span key={word} className="inline-flex items-center text-primary gap-1">
				{i > 0 && (
					<span aria-hidden="true" className="text-faint">
						&#8226;
					</span>
				)}
				<Link
					href={`/search?q=${encodeURIComponent(word)}`}
					className="text-primary border-b border-primary/20 hover:border-primary transition-colors"
				>
					{word}
				</Link>
			</span>
		))}
	</div>
);
