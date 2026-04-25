"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { JsonEditor } from "@/shared/ui";
import type { FC } from "react";
import { EditorCard } from "../form-primitives";

type EditDict = Dictionary["admin"]["entryEdit"];

interface JsonTabProps {
	value: string;
	onChange: (next: string) => void;
	onValidityChange: (valid: boolean) => void;
	dict: EditDict;
}

export const JsonTab: FC<JsonTabProps> = ({
	value,
	onChange,
	onValidityChange,
	dict,
}) => (
	<EditorCard
		icon="{ }"
		title={dict.cards.fullJson.title}
		description={dict.cards.fullJson.desc}
	>
		<JsonEditor
			value={value}
			onChange={onChange}
			onValidityChange={onValidityChange}
			labels={dict.json}
			showCopy
			minHeight={450}
		/>
	</EditorCard>
);
