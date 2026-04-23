import type { DictionaryEntry } from "@/entities/dictionary";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface EntryPreviewCardProps {
	entry: DictionaryEntry | undefined;
	entryId: number;
	entryLoading: boolean;
	entryError: boolean;
	dict: Dictionary["adminSuggestionDetail"]["entryPreview"];
	lang: Locale;
}

const formatPos = (
	pos: string | undefined,
	dict: Dictionary["adminSuggestionDetail"]["entryPreview"],
): string | null => {
	if (!pos) return null;
	const normalized = pos.toLowerCase();
	if (normalized.startsWith("noun")) return dict.posNoun;
	if (normalized.startsWith("verb")) return dict.posVerb;
	if (normalized.startsWith("adj")) return dict.posAdjective;
	if (normalized.startsWith("adv")) return dict.posAdverb;
	return pos;
};

export const EntryPreviewCard: FC<EntryPreviewCardProps> = ({
	entry,
	entryId,
	entryLoading,
	entryError,
	dict,
	lang,
}) => (
	<section className="rounded-lg border border-edge bg-surface overflow-hidden mb-4">
		<header className="px-5 py-4 border-b border-edge flex items-center justify-between gap-3">
			<h3 className="text-sm font-semibold text-foreground">{dict.title}</h3>
			{entryId ? (
				<Link
					href={`/${lang}/entry/${entryId}`}
					className="text-subtle hover:text-foreground transition-colors text-sm"
					aria-label={`${dict.title} ↗`}
				>
					↗
				</Link>
			) : null}
		</header>
		<div className="px-5 py-4">
			{entryLoading ? (
				<EntryPreviewSkeleton />
			) : entryError || !entry ? (
				<p className="text-sm text-muted">{dict.error}</p>
			) : (
				<>
					<div className="text-lg font-bold text-foreground mb-1" lang="ce">
						{entry.word}
					</div>
					<div className="text-xs text-muted mb-2">
						{[
							formatPos(entry.partOfSpeech, dict),
							entry.nounClass
								? `${dict.nounClassPrefix} ${entry.nounClass}`
								: null,
						]
							.filter(Boolean)
							.join(" · ")}
					</div>
					{entry.meanings[0] ? (
						<div className="text-sm text-subtle leading-snug">
							<strong>1.</strong> {entry.meanings[0].translation}
							{entry.meanings[0].examples?.[0] ? (
								<>
									<br />
									<span className="text-muted text-xs">
										{entry.meanings[0].examples[0].nah} —{" "}
										{entry.meanings[0].examples[0].ru}
									</span>
								</>
							) : null}
						</div>
					) : null}
					{entry.sources.length > 0 ? (
						<div className="flex gap-2 mt-3 flex-wrap">
							{entry.sources.map((src) => (
								<span
									key={src}
									className="text-xs px-2 py-0.5 rounded-xs border border-edge text-muted font-mono"
								>
									{src}
								</span>
							))}
						</div>
					) : null}
				</>
			)}
		</div>
	</section>
);

const EntryPreviewSkeleton: FC = () => (
	<div className="animate-pulse space-y-2">
		<div className="h-5 w-24 rounded bg-surface-hover" />
		<div className="h-3 w-32 rounded bg-surface-hover" />
		<div className="h-4 w-full rounded bg-surface-hover" />
		<div className="h-4 w-3/4 rounded bg-surface-hover" />
	</div>
);
