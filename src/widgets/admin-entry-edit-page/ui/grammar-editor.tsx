"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { Field, FormGrid, TextInput } from "./form-primitives";

interface GrammarEditorProps {
	value: Record<string, unknown> | undefined;
	onChange: (next: Record<string, unknown>) => void;
	dict: Dictionary["admin"]["entryEdit"]["grammar"];
}

const VERB_BASE_FIELDS = ["verbPresent", "verbPerfect", "masdar"] as const;
const TENSE_FIELDS = [
	"presentSimple",
	"presentCompound",
	"perfect",
	"remotePast",
	"pastImperfective",
	"futurePossible",
	"futureFactual",
] as const;
const IMPERATIVE_FIELDS = [
	"imperative",
	"imperativePolite",
	"negation",
] as const;

type FieldKey =
	| (typeof VERB_BASE_FIELDS)[number]
	| (typeof TENSE_FIELDS)[number]
	| (typeof IMPERATIVE_FIELDS)[number];

export const GrammarEditor: FC<GrammarEditorProps> = ({
	value,
	onChange,
	dict,
}) => {
	const current = value ?? {};
	const setField = (key: FieldKey, raw: string) => {
		const next: Record<string, unknown> = { ...current };
		const trimmed = raw.trim();
		if (trimmed === "") delete next[key];
		else next[key] = raw;
		onChange(next);
	};

	const read = (key: FieldKey): string => {
		const v = current[key];
		return typeof v === "string" ? v : "";
	};

	return (
		<div className="flex flex-col gap-6">
			<section>
				<div className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
					{dict.sections.verbBase}
				</div>
				<FormGrid cols={3}>
					{VERB_BASE_FIELDS.map((key) => (
						<Field key={key} label={dict[key]}>
							<TextInput
								value={read(key)}
								onChange={(e) => setField(key, e.target.value)}
							/>
						</Field>
					))}
				</FormGrid>
			</section>

			<section>
				<div className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
					{dict.sections.tenses}
				</div>
				<FormGrid>
					{TENSE_FIELDS.map((key) => (
						<Field key={key} label={dict[key]}>
							<TextInput
								value={read(key)}
								onChange={(e) => setField(key, e.target.value)}
							/>
						</Field>
					))}
				</FormGrid>
			</section>

			<section>
				<div className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
					{dict.sections.imperativeNegation}
				</div>
				<FormGrid cols={3}>
					{IMPERATIVE_FIELDS.map((key) => (
						<Field key={key} label={dict[key]}>
							<TextInput
								value={read(key)}
								onChange={(e) => setField(key, e.target.value)}
							/>
						</Field>
					))}
				</FormGrid>
			</section>
		</div>
	);
};
