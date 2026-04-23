import type { AdjacentSuggestions } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface AdjacentNavProps {
	adjacent: AdjacentSuggestions | undefined;
	dict: Dictionary["adminSuggestionDetail"]["nav"];
	lang: Locale;
}

export const AdjacentNav: FC<AdjacentNavProps> = ({ adjacent, dict, lang }) => {
	if (!adjacent || (!adjacent.prev && !adjacent.next)) return null;

	return (
		<nav className="flex justify-between items-center mt-8 pt-5 border-t border-edge gap-3 flex-wrap">
			{adjacent.prev ? (
				<Link
					href={`/${lang}/admin/suggestions/${adjacent.prev.id}`}
					className="flex items-center gap-2 text-sm text-muted px-3 py-2 rounded-md transition-colors hover:text-primary hover:bg-surface-hover"
				>
					<span aria-hidden>←</span>
					<span>
						<span className="block text-xs text-faint">{dict.prev}</span>
						<span className="block font-semibold text-foreground" lang="ce">
							{adjacent.prev.entry.word} #{adjacent.prev.id.slice(0, 8)}
						</span>
					</span>
				</Link>
			) : (
				<span />
			)}
			{adjacent.next ? (
				<Link
					href={`/${lang}/admin/suggestions/${adjacent.next.id}`}
					className="flex items-center gap-2 text-sm text-muted px-3 py-2 rounded-md transition-colors hover:text-primary hover:bg-surface-hover text-right"
				>
					<span>
						<span className="block text-xs text-faint">{dict.next}</span>
						<span className="block font-semibold text-foreground" lang="ce">
							{adjacent.next.entry.word} #{adjacent.next.id.slice(0, 8)}
						</span>
					</span>
					<span aria-hidden>→</span>
				</Link>
			) : (
				<span />
			)}
		</nav>
	);
};
