import type { FC, ReactNode } from "react";

interface HighlightMatchProps {
	text: string;
	query: string;
}

// Chechen composite letters — a match boundary must not fall between the two
// code points of any of these, or we would highlight part of a different letter
// (e.g. the "г" of "гӀ" in "мостагӀийн" when searching for "стаг").
const DIGRAPHS = new Set([
	"аь",
	"гӀ",
	"кх",
	"кӀ",
	"кь",
	"оь",
	"пӀ",
	"тӀ",
	"уь",
	"хӀ",
	"хь",
	"цӀ",
	"чӀ",
	"юь",
	"яь",
]);

// Users and source data write the palochka in several shapes: proper Ӏ/ӏ
// (U+04C0/U+04CF), Latin I/i, digit 1, vertical bar. Collapse them to one form
// before matching so the digraph check is consistent. All replacements are
// single-code-point → single-code-point, so indices stay aligned with the
// original text we render.
const normalize = (s: string): string =>
	s.toLocaleLowerCase().replace(/[iӏ1|]/g, "Ӏ");

const splitsDigraph = (text: string, i: number): boolean => {
	if (i <= 0 || i >= text.length) return false;
	return DIGRAPHS.has(text.slice(i - 1, i + 1));
};

/**
 * Splits `text` on case-insensitive occurrences of `query` and wraps the matches
 * in `<mark>`. Backend does not return highlighted fragments — we do it client-side
 * per the search spec. Respects Chechen digraphs so a match cannot cut one in half.
 */
export const HighlightMatch: FC<HighlightMatchProps> = ({ text, query }) => {
	if (!query) return <>{text}</>;

	const needle = normalize(query);
	const haystack = normalize(text);

	const parts: ReactNode[] = [];
	let cursor = 0;
	let searchFrom = 0;

	while (searchFrom <= text.length) {
		const idx = haystack.indexOf(needle, searchFrom);
		if (idx === -1) break;

		const end = idx + needle.length;
		if (splitsDigraph(haystack, idx) || splitsDigraph(haystack, end)) {
			searchFrom = idx + 1;
			continue;
		}

		if (idx > cursor) parts.push(text.slice(cursor, idx));
		parts.push(
			<mark
				key={`${idx}-${cursor}`}
				className="bg-transparent text-primary font-inherit"
			>
				{text.slice(idx, end)}
			</mark>,
		);
		cursor = end;
		searchFrom = end;
	}

	if (cursor < text.length) parts.push(text.slice(cursor));

	return <>{parts}</>;
};
