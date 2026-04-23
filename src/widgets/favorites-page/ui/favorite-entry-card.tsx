"use client";

import {
	NounClassBadge,
	SourceBadge,
	WordLevelTag,
} from "@/entities/dictionary";
import type { FavoriteRecord } from "@/features/favorites";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { type FC, type MouseEvent, useMemo } from "react";
import { formatAddedDate } from "../lib/format-added-date";

interface FavoriteEntryCardProps {
	record: FavoriteRecord;
	dict: Dictionary["favoritesPage"]["item"];
	lang: Locale;
	isRemoving: boolean;
	onRemove: (record: FavoriteRecord) => void;
}

const firstTranslation = (record: FavoriteRecord): string => {
	const meanings = record.entry.meanings ?? [];
	return meanings
		.slice(0, 2)
		.map(m => m.translation.trim())
		.filter(Boolean)
		.join("; ");
};

export const FavoriteEntryCard: FC<FavoriteEntryCardProps> = ({
	record,
	dict,
	lang,
	isRemoving,
	onRemove,
}) => {
	const { entry } = record;
	const displayWord = entry.wordAccented || entry.word;
	const preview = firstTranslation(record);
	const addedAt = useMemo(
		() =>
			dict.addedAt.replace(
				"{date}",
				formatAddedDate(record.createdAt, lang),
			),
		[dict.addedAt, record.createdAt, lang],
	);

	const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isRemoving) return;
		onRemove(record);
	};

	const nounClasses = entry.nounClass
		? String(entry.nounClass)
				.split("/")
				.map(c => c.trim())
				.filter(Boolean)
		: [];

	return (
		<article
			className={cn(
				"group relative bg-surface border border-edge rounded-lg",
				"transition-[background,border,transform,opacity] duration-150 ease-[cubic-bezier(.16,1,.3,1)]",
				"hover:bg-surface-hover hover:border-edge-hover hover:translate-x-1",
				isRemoving &&
					"pointer-events-none opacity-0 translate-x-10 scale-[0.98] duration-300",
			)}
		>
			<Link
				href={`/${lang}/entry/${entry.id}`}
				aria-label={dict.openAriaLabel.replace("{word}", displayWord)}
				className="block rounded-lg px-5 py-4 pr-14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<div className="flex items-baseline gap-2 flex-wrap mb-1">
					<h2 className="text-lg font-semibold text-foreground tracking-[-0.01em]">
						{displayWord}
					</h2>
					{nounClasses.map(c => (
						<NounClassBadge key={c} nounClass={c} />
					))}
					{entry.partOfSpeech && (
						<span className="text-sm text-muted font-normal">
							{entry.partOfSpeech}
						</span>
					)}
					{entry.wordLevel && (
						<span className="ml-auto">
							<WordLevelTag level={entry.wordLevel} />
						</span>
					)}
				</div>

				{preview && (
					<p className="text-base text-subtle font-light leading-normal mb-2 line-clamp-2">
						{preview}
					</p>
				)}

				<footer className="flex gap-2 flex-wrap items-center">
					{entry.sources.map(source => (
						<SourceBadge key={source} source={source} />
					))}
					<span className="text-xs text-faint">{addedAt}</span>
				</footer>
			</Link>

			<button
				type="button"
				onClick={handleRemove}
				aria-label={dict.removeAriaLabel.replace("{word}", displayWord)}
				className={cn(
					"absolute right-4 top-1/2 -translate-y-1/2",
					"inline-flex items-center justify-center size-8 rounded-sm",
					"bg-transparent border border-transparent text-faint cursor-pointer",
					"transition-colors duration-150",
					"opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
					"hover:bg-danger-dim hover:border-danger hover:text-danger",
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
				)}
			>
				<XIcon className="size-4" />
			</button>
		</article>
	);
};
