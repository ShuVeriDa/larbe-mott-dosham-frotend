"use client";

import type { AdminEntryFullResponse } from "@/features/admin-entries";
import type { Citation, Phrase } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { CitationsEditor } from "../citations-editor";
import { EditorCard } from "../form-primitives";
import { PhrasesEditor } from "../phrases-editor";

type EditDict = Dictionary["admin"]["entryEdit"];

interface PhraseologyTabProps {
	draft: AdminEntryFullResponse;
	onPhrasesChange: (next: Phrase[]) => void;
	onCitationsChange: (next: Citation[]) => void;
	dict: EditDict;
}

export const PhraseologyTab: FC<PhraseologyTabProps> = ({
	draft,
	onPhrasesChange,
	onCitationsChange,
	dict,
}) => (
	<>
		<EditorCard
			icon="💬"
			title={dict.cards.phraseology.title}
			description={dict.cards.phraseology.desc}
		>
			<PhrasesEditor
				value={draft.setPhrases ?? []}
				onChange={onPhrasesChange}
				placeholders={dict.placeholders}
				addLabel={dict.phraseology.addPhrase}
				removeLabel={dict.meanings.remove}
			/>
		</EditorCard>

		<EditorCard
			icon="📜"
			title={dict.cards.citations.title}
			description={dict.cards.citations.desc}
		>
			<CitationsEditor
				value={draft.citations ?? []}
				onChange={onCitationsChange}
				placeholders={dict.placeholders}
				addLabel={dict.phraseology.addCitation}
				removeLabel={dict.meanings.remove}
			/>
		</EditorCard>
	</>
);
