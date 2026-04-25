"use client";

import type { AdminEntryFullResponse } from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import { JsonEditor } from "@/shared/ui";
import { type FC, useEffect, useMemo, useState } from "react";
import { EditorCard, ModeToggle } from "../form-primitives";
import { GrammarEditor } from "../grammar-editor";

type EditDict = Dictionary["admin"]["entryEdit"];
type Mode = "visual" | "json";

interface GrammarTabProps {
	draft: AdminEntryFullResponse;
	onPatch: (key: "grammar", value: Record<string, unknown>) => void;
	dict: EditDict;
}

export const GrammarTab: FC<GrammarTabProps> = ({ draft, onPatch, dict }) => {
	const [mode, setMode] = useState<Mode>("visual");
	const current = draft.grammar ?? {};
	const serialized = useMemo(
		() => JSON.stringify(current, null, 2),
		[current],
	);
	const [jsonDraft, setJsonDraft] = useState(serialized);

	useEffect(() => {
		if (mode === "visual") setJsonDraft(serialized);
	}, [mode, serialized]);

	const onJsonChange = (raw: string) => {
		setJsonDraft(raw);
		try {
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				onPatch("grammar", parsed as Record<string, unknown>);
			}
		} catch {
			// invalid — keep draft
		}
	};

	return (
		<EditorCard
			icon="📐"
			title={dict.cards.grammar.title}
			description={dict.cards.grammar.desc}
			actions={
				<ModeToggle<Mode>
					mode={mode}
					onChange={setMode}
					options={[
						{ value: "visual", label: dict.grammar.visual },
						{ value: "json", label: dict.grammar.json },
					]}
				/>
			}
		>
			{mode === "visual" ? (
				<GrammarEditor
					value={current}
					onChange={(next) => onPatch("grammar", next)}
					dict={dict.grammar}
				/>
			) : (
				<JsonEditor
					value={jsonDraft}
					onChange={onJsonChange}
					labels={dict.json}
				/>
			)}
		</EditorCard>
	);
};
