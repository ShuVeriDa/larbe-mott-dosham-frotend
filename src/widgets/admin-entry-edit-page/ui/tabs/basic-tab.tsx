"use client";

import type {
	AdminEntryFullResponse,
} from "@/features/admin-entries";
import type { NounClass } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import type { WordLevel } from "@/shared/types";
import { TagInput } from "@/shared/ui";
import type { FC } from "react";
import {
	EditorCard,
	Field,
	FormGrid,
	SelectField,
	TextInput,
} from "../form-primitives";

type EditDict = Dictionary["admin"]["entryEdit"];

interface BasicTabProps {
	draft: AdminEntryFullResponse;
	onPatch: <K extends keyof AdminEntryFullResponse>(
		key: K,
		value: AdminEntryFullResponse[K],
	) => void;
	dict: EditDict;
}

const toNullable = (v: string): string | undefined =>
	v === "" ? undefined : v;

export const BasicTab: FC<BasicTabProps> = ({ draft, onPatch, dict }) => {
	const posOptions = Object.entries(dict.posOptions).map(([, label]) => ({
		value: label,
		label,
	}));
	const posNahOptions = Object.entries(dict.posNahOptions).map(([, label]) => ({
		value: label,
		label,
	}));
	const nounClassOptions: { value: NounClass; label: string }[] = [
		{ value: "vu", label: "ву" },
		{ value: "yu", label: "йу" },
		{ value: "du", label: "ду" },
		{ value: "bu", label: "бу" },
	];
	const levelOptions: { value: WordLevel; label: string }[] = [
		{ value: "A", label: dict.levels.A },
		{ value: "B", label: dict.levels.B },
		{ value: "C", label: dict.levels.C },
	];
	const entryTypeOptions = [
		{ value: "standard", label: dict.entryTypes.standard },
		{ value: "neologism", label: dict.entryTypes.neologism },
	];
	const domainOptions = Object.entries(dict.domains).map(([k, label]) => ({
		value: k,
		label: label as string,
	}));
	const styleOptions = Object.entries(dict.styleLabels).map(([k, label]) => ({
		value: k,
		label: label as string,
	}));

	return (
		<>
			<EditorCard
				icon="📝"
				title={dict.cards.basicFields.title}
				description={dict.cards.basicFields.desc}
			>
				<FormGrid>
					<Field label={dict.fields.word} required>
						<TextInput
							type="text"
							value={draft.word}
							onChange={(e) => onPatch("word", e.target.value)}
						/>
					</Field>
					<Field
						label={dict.fields.wordAccented}
						optional={dict.fields.wordAccentedOptional}
					>
						<TextInput
							type="text"
							value={draft.wordAccented ?? ""}
							onChange={(e) =>
								onPatch("wordAccented", toNullable(e.target.value))
							}
							placeholder={dict.placeholders.wordAccented}
						/>
					</Field>
					<Field label={dict.fields.partOfSpeech}>
						<SelectField
							value={draft.partOfSpeech ?? ""}
							onChange={(v) =>
								onPatch("partOfSpeech", toNullable(v))
							}
							options={posOptions}
							placeholder={dict.fields.notSelected}
						/>
					</Field>
					<Field label={dict.fields.partOfSpeechNah}>
						<SelectField
							value={draft.partOfSpeechNah ?? ""}
							onChange={(v) =>
								onPatch("partOfSpeechNah", toNullable(v))
							}
							options={posNahOptions}
							placeholder={dict.fields.notSelected}
						/>
					</Field>
					<Field label={dict.fields.nounClass}>
						<SelectField
							value={draft.nounClass ?? ""}
							onChange={(v) =>
								onPatch(
									"nounClass",
									(toNullable(v) as NounClass | undefined),
								)
							}
							options={nounClassOptions}
							placeholder={dict.fields.notSet}
						/>
					</Field>
					<Field
						label={dict.fields.nounClassPlural}
						optional={dict.fields.nounClassPluralOptional}
					>
						<SelectField
							value={draft.nounClassPlural ?? ""}
							onChange={(v) =>
								onPatch(
									"nounClassPlural",
									(toNullable(v) as NounClass | undefined),
								)
							}
							options={nounClassOptions}
							placeholder={dict.fields.notSet}
						/>
					</Field>
				</FormGrid>
			</EditorCard>

			<EditorCard
				icon="🏷"
				title={dict.cards.classification.title}
				description={dict.cards.classification.desc}
			>
				<FormGrid>
					<Field label={dict.fields.cefrLevel}>
						<SelectField
							value={draft.wordLevel ?? ""}
							onChange={(v) =>
								onPatch(
									"wordLevel",
									(toNullable(v) as WordLevel | undefined),
								)
							}
							options={levelOptions}
							placeholder={dict.fields.undefined}
						/>
					</Field>
					<Field label={dict.fields.entryType}>
						<SelectField
							value={draft.entryType ?? "standard"}
							onChange={(v) =>
								onPatch(
									"entryType",
									(v || "standard") as AdminEntryFullResponse["entryType"],
								)
							}
							options={entryTypeOptions}
						/>
					</Field>
					<Field label={dict.fields.domain}>
						<SelectField
							value={draft.domain ?? ""}
							onChange={(v) => onPatch("domain", toNullable(v))}
							options={domainOptions}
							placeholder={dict.fields.notSet}
						/>
					</Field>
					<Field label={dict.fields.styleLabel}>
						<SelectField
							value={draft.styleLabel ?? ""}
							onChange={(v) => onPatch("styleLabel", toNullable(v))}
							options={styleOptions}
							placeholder={dict.fields.notSet}
						/>
					</Field>
					<Field
						label={dict.fields.latinName}
						optional={dict.fields.latinNameOptional}
					>
						<TextInput
							type="text"
							value={draft.latinName ?? ""}
							onChange={(e) =>
								onPatch("latinName", toNullable(e.target.value))
							}
							placeholder={dict.placeholders.latinName}
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

			<EditorCard icon="📎" title={dict.cards.variantsSources.title}>
				<FormGrid>
					<Field label={dict.fields.variants} hint={dict.fields.variantsHint} full>
						<TagInput
							value={draft.variants ?? []}
							onChange={(next) => onPatch("variants", next)}
							placeholder={dict.placeholders.variantAdd}
						/>
					</Field>
					<Field label={dict.fields.sources} hint={dict.fields.sourcesHint} full>
						<TagInput
							value={draft.sources ?? []}
							onChange={(next) => onPatch("sources", next)}
							placeholder={dict.placeholders.sourceAdd}
						/>
					</Field>
				</FormGrid>
			</EditorCard>
		</>
	);
};
