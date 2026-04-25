"use client";

import type { AdminEntryFullResponse } from "@/features/admin-entries";
import type { Meaning } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { JsonEditor } from "@/shared/ui";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { EditorCard, ModeToggle } from "../form-primitives";
import { MeaningsEditor } from "../meanings-editor";

type EditDict = Dictionary["admin"]["entryEdit"];
type Mode = "visual" | "json";

interface MeaningsTabProps {
	draft: AdminEntryFullResponse;
	onPatch: (key: "meanings", value: Meaning[]) => void;
	dict: EditDict;
	onJsonValidityChange: (valid: boolean) => void;
}

export const MeaningsTab: FC<MeaningsTabProps> = ({
	draft,
	onPatch,
	dict,
	onJsonValidityChange,
}) => {
	const [mode, setMode] = useState<Mode>("visual");
	const meanings = draft.meanings ?? [];
	const serialized = useMemo(
		() => JSON.stringify(meanings, null, 2),
		[meanings],
	);
	const [jsonDraft, setJsonDraft] = useState(serialized);

	useEffect(() => {
		if (mode === "visual") setJsonDraft(serialized);
	}, [mode, serialized]);

	const onJsonChange = useCallback(
		(raw: string) => {
			setJsonDraft(raw);
			try {
				const parsed = JSON.parse(raw) as Meaning[];
				if (Array.isArray(parsed)) {
					onPatch("meanings", parsed);
					onJsonValidityChange(true);
				} else {
					onJsonValidityChange(false);
				}
			} catch {
				onJsonValidityChange(false);
			}
		},
		[onJsonValidityChange, onPatch],
	);

	return (
		<EditorCard
			icon="📖"
			title={dict.cards.meanings.title}
			description={dict.cards.meanings.desc}
			actions={
				<ModeToggle<Mode>
					mode={mode}
					onChange={setMode}
					options={[
						{ value: "visual", label: dict.meanings.visual },
						{ value: "json", label: dict.meanings.json },
					]}
				/>
			}
		>
			{mode === "visual" ? (
				<MeaningsEditor
					meanings={meanings}
					onChange={(next) => onPatch("meanings", next)}
					dict={dict.meanings}
					placeholders={dict.placeholders}
				/>
			) : (
				<JsonEditor
					value={jsonDraft}
					onChange={onJsonChange}
					labels={dict.json}
					onValidityChange={onJsonValidityChange}
				/>
			)}
		</EditorCard>
	);
};
