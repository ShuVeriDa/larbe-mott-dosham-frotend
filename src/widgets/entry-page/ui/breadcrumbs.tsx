import Link from "next/link";
import type { FC } from "react";

interface BreadcrumbsDict {
	home: string;
	dictionary: string;
}

interface BreadcrumbsProps {
	lang: string;
	word: string;
	dict: BreadcrumbsDict;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ lang, word, dict }) => (
	<nav
		aria-label="Breadcrumb"
		className="flex items-center gap-2 text-sm flex-wrap py-4"
	>
		<Link
			href={`/${lang}`}
			className="text-muted hover:text-foreground transition-colors"
		>
			{dict.home}
		</Link>
		<span aria-hidden className="text-faint text-xs">
			›
		</span>
		<Link
			href={`/${lang}/search`}
			className="text-muted hover:text-foreground transition-colors"
		>
			{dict.dictionary}
		</Link>
		<span aria-hidden className="text-faint text-xs">
			›
		</span>
		<span className="text-foreground font-medium">{word}</span>
	</nav>
);
