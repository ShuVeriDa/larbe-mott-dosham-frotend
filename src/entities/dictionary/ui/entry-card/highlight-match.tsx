import type { FC, ReactNode } from "react";

interface HighlightMatchProps {
	text: string;
	query: string;
}

/**
 * Splits `text` on case-insensitive occurrences of `query` and wraps the matches
 * in `<mark>`. Backend does not return highlighted fragments — we do it client-side
 * per the search spec.
 */
export const HighlightMatch: FC<HighlightMatchProps> = ({ text, query }) => {
	if (!query) return <>{text}</>;

	const needle = query.toLocaleLowerCase();
	const haystack = text.toLocaleLowerCase();

	const parts: ReactNode[] = [];
	let cursor = 0;

	while (cursor < text.length) {
		const idx = haystack.indexOf(needle, cursor);
		if (idx === -1) {
			parts.push(text.slice(cursor));
			break;
		}
		if (idx > cursor) parts.push(text.slice(cursor, idx));
		parts.push(
			<mark
				key={`${idx}-${cursor}`}
				className="bg-transparent text-primary font-inherit"
			>
				{text.slice(idx, idx + needle.length)}
			</mark>,
		);
		cursor = idx + needle.length;
	}

	return <>{parts}</>;
};
