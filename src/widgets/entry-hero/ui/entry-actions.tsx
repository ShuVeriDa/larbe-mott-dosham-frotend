"use client";

import { EntrySuggestModal } from "@/features/entry-suggest";
import type { DictionaryEntry } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { type FC, useState } from "react";
import { FavoriteToggle } from "./favorite-toggle";

interface EntryActionsProps {
	entry: DictionaryEntry;
	lang: string;
	dict: Dictionary["entry"]["hero"];
	suggestDict: Dictionary["entry"]["suggest"];
}

export const EntryActions: FC<EntryActionsProps> = ({
	entry,
	lang,
	dict,
	suggestDict,
}) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex gap-2 shrink-0 items-start pt-2">
			<FavoriteToggle
				entryId={entry.id}
				labelAdd={dict.favoriteAdd}
				labelRemove={dict.favoriteRemove}
			/>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={dict.editAriaLabel}
				className="inline-flex items-center justify-center gap-2 h-8 px-4 text-sm rounded-md border border-edge bg-surface text-foreground hover:bg-surface-hover hover:border-edge-hover transition"
			>
				<span aria-hidden>✎</span> {dict.edit}
			</button>
			<EntrySuggestModal
				open={open}
				onOpenChange={setOpen}
				entryId={entry.id}
				word={entry.word}
				lang={lang}
				dict={suggestDict}
			/>
		</div>
	);
};
