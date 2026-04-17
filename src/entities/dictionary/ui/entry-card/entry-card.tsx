import Link from "next/link";
import type { FC } from "react";
import type { DictionarySearchResult } from "../../types";
import {
	NeologismBadge,
	NounClassBadge,
	SourceBadge,
	WordLevelTag,
} from "./entry-badges";
import { HighlightMatch } from "./highlight-match";

export interface EntryCardLabels {
	neologism: string;
	favorite: string;
}

interface EntryCardProps {
	entry: DictionarySearchResult;
	query: string;
	lang: string;
	labels: EntryCardLabels;
}

const MAX_MEANING_PREVIEW = 2;

const buildPreview = (entry: DictionarySearchResult): string => {
	const translations = entry.meanings
		.slice(0, MAX_MEANING_PREVIEW)
		.map(m => m.translation.trim())
		.filter(Boolean);
	return translations.join("; ");
};

export const EntryCard: FC<EntryCardProps> = ({
	entry,
	query,
	lang,
	labels,
}) => {
	const displayWord = entry.wordAccented || entry.word;
	const preview = buildPreview(entry);
	const isNeologism = entry.entryType === "neologism";

	return (
		<article>
			<Link
				href={`/${lang}/entry/${entry.id}`}
				className="block bg-surface border border-edge rounded-lg px-5 py-4 text-inherit no-underline transition-[background,border,transform] duration-150 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-surface-hover hover:border-edge-hover hover:translate-x-1"
				aria-label={displayWord}
			>
				<header className="flex items-baseline gap-2 flex-wrap mb-1">
					<h3 className="text-lg font-semibold text-foreground tracking-[-0.01em]">
						<HighlightMatch text={displayWord} query={query} />
					</h3>
					{entry.partOfSpeech && (
						<span className="text-xs text-muted font-normal">
							{entry.partOfSpeech}
							{entry.partOfSpeechNah ? ` · ${entry.partOfSpeechNah}` : ""}
						</span>
					)}
					{isNeologism && <NeologismBadge label={labels.neologism} />}
				</header>

				{preview && (
					<p className="text-base text-subtle font-light leading-[1.5] mb-2 line-clamp-2">
						<HighlightMatch text={preview} query={query} />
					</p>
				)}

				<footer className="flex gap-2 flex-wrap items-center">
					{entry.nounClass && <NounClassBadge nounClass={entry.nounClass} />}
					{entry.wordLevel && <WordLevelTag level={entry.wordLevel} />}
					{entry.sources.map(source => (
						<SourceBadge key={source} source={source} />
					))}
					<span className="ml-auto text-faint text-base" aria-hidden>
						☆
					</span>
					<span className="sr-only">{labels.favorite}</span>
				</footer>
			</Link>
		</article>
	);
};
