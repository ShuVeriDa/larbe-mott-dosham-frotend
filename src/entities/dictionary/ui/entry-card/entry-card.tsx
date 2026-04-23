import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC, ReactNode } from "react";
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
}

interface EntryCardProps {
	entry: DictionarySearchResult;
	query: string;
	lang: string;
	labels: EntryCardLabels;
	/** Rendered at the end of the card footer (e.g. favorite toggle). */
	trailing?: ReactNode;
	/** Reduces padding and preview lines (see `prefCompactView`). */
	compact?: boolean;
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
	trailing,
	compact = false,
}) => {
	const displayWord = entry.wordAccented || entry.word;
	const preview = buildPreview(entry);
	const isNeologism = entry.entryType === "neologism";

	return (
		<article
			className={cn(
				"relative bg-surface border border-edge rounded-lg transition-[background,border,transform] duration-150 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-surface-hover hover:border-edge-hover hover:translate-x-1",
				compact ? "px-4 py-2.5" : "px-5 py-4",
			)}
		>
			<Link
				href={`/${lang}/entry/${entry.id}`}
				aria-label={displayWord}
				className="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
			/>

			<header className="relative flex items-baseline gap-2 flex-wrap mb-1">
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
				<p
					className={cn(
						"relative text-subtle font-light leading-normal",
						compact
							? "text-sm mb-1.5 line-clamp-1"
							: "text-base mb-2 line-clamp-2",
					)}
				>
					<HighlightMatch text={preview} query={query} />
				</p>
			)}

			<footer className="relative flex gap-2 flex-wrap items-center">
				{entry.nounClass
					?.split("/")
					.map(c => c.trim())
					.filter(Boolean)
					.map(c => <NounClassBadge key={c} nounClass={c} />)}
				{entry.wordLevel && <WordLevelTag level={entry.wordLevel} />}
				{entry.sources.map(source => (
					<SourceBadge key={source} source={source} />
				))}
				{trailing && <div className="ml-auto relative z-10">{trailing}</div>}
			</footer>
		</article>
	);
};
