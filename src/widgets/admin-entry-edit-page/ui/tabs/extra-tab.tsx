"use client";

import type { AdminEntryFullResponse } from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatDateTime } from "../../lib/format-date";
import {
	EditorCard,
	Field,
	FormGrid,
	TextInput,
} from "../form-primitives";

type EditDict = Dictionary["admin"]["entryEdit"];

interface ExtraTabProps {
	draft: AdminEntryFullResponse;
	onPatch: <K extends keyof AdminEntryFullResponse>(
		key: K,
		value: AdminEntryFullResponse[K],
	) => void;
	dict: EditDict;
	lang: Locale;
}

export const ExtraTab: FC<ExtraTabProps> = ({
	draft,
	onPatch,
	dict,
	lang,
}) => (
	<>
		<EditorCard
			icon="🔍"
			title={dict.cards.searchFields.title}
			description={dict.cards.searchFields.desc}
		>
			<FormGrid>
				<Field
					label={dict.fields.wordNormalized}
					hint={dict.fields.wordNormalizedHint}
				>
					<TextInput
						type="text"
						value={draft.wordNormalized ?? ""}
						readOnly
					/>
				</Field>
				<Field label={dict.fields.homonymIndex}>
					<TextInput
						type="number"
						min={0}
						value={draft.homonymIndex ?? 0}
						onChange={(e) =>
							onPatch(
								"homonymIndex",
								Number.isFinite(Number(e.target.value))
									? Number(e.target.value)
									: 0,
							)
						}
					/>
				</Field>
			</FormGrid>
		</EditorCard>

		<EditorCard icon="⏱" title={dict.cards.timestamps.title}>
			<FormGrid>
				<Field label={dict.fields.createdAt}>
					<TextInput
						type="text"
						value={formatDateTime(draft.createdAt, lang)}
						readOnly
					/>
				</Field>
				<Field label={dict.fields.updatedAt}>
					<TextInput
						type="text"
						value={formatDateTime(draft.updatedAt, lang)}
						readOnly
					/>
				</Field>
			</FormGrid>
		</EditorCard>
	</>
);
