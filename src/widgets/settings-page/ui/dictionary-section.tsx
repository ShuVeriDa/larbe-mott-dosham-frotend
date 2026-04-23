"use client";

import type { PerPage, User } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import type { WordLevel } from "@/shared/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch,
} from "@/shared/ui";
import type { FC } from "react";
import { usePreference } from "../model/use-preference";
import { RadioPillGroup } from "./radio-pill-group";
import { SettingRow } from "./setting-row";
import { SettingsGroup } from "./settings-group";
import { SettingsSection } from "./settings-section";

const ALL_LEVELS = "__all__";

interface DictionarySectionProps {
	user: User;
	dict: Dictionary["settings"]["dictionary"];
	toasts: Dictionary["settings"]["toasts"];
}

export const DictionarySection: FC<DictionarySectionProps> = ({
	user,
	dict,
	toasts,
}) => {
	const toastOpts = {
		savedMessage: toasts.saved,
		errorMessage: toasts.saveError,
	};

	const showExamples = usePreference(user, "prefShowExamples", toastOpts);
	const showGrammar = usePreference(user, "prefShowGrammar", toastOpts);
	const compactView = usePreference(user, "prefCompactView", toastOpts);
	const perPage = usePreference(user, "prefPerPage", toastOpts);
	const defaultCefr = usePreference(user, "prefDefaultCefr", toastOpts);

	const perPageOptions = [
		{ value: "10" as const, label: "10" },
		{ value: "20" as const, label: "20" },
		{ value: "50" as const, label: "50" },
	];

	const levelOptions: { value: WordLevel; label: string }[] = [
		{ value: "A", label: dict.levelA },
		{ value: "B", label: dict.levelB },
		{ value: "C", label: dict.levelC },
	];

	return (
		<SettingsSection title={dict.title}>
			<SettingsGroup title={dict.display}>
				<SettingRow title={dict.showExamples} description={dict.showExamplesDesc}>
					<Switch
						checked={showExamples.value ?? false}
						onCheckedChange={checked => showExamples.setValue(checked)}
						disabled={showExamples.isPending}
						aria-label={dict.showExamples}
					/>
				</SettingRow>
				<SettingRow title={dict.showGrammar} description={dict.showGrammarDesc}>
					<Switch
						checked={showGrammar.value ?? false}
						onCheckedChange={checked => showGrammar.setValue(checked)}
						disabled={showGrammar.isPending}
						aria-label={dict.showGrammar}
					/>
				</SettingRow>
				<SettingRow title={dict.compactView} description={dict.compactViewDesc}>
					<Switch
						checked={compactView.value ?? false}
						onCheckedChange={checked => compactView.setValue(checked)}
						disabled={compactView.isPending}
						aria-label={dict.compactView}
					/>
				</SettingRow>
				<SettingRow title={dict.perPage} description={dict.perPageDesc}>
					<RadioPillGroup
						name={dict.perPage}
						value={String(perPage.value ?? 20) as "10" | "20" | "50"}
						options={perPageOptions}
						onChange={next => perPage.setValue(Number(next) as PerPage)}
						disabled={perPage.isPending}
					/>
				</SettingRow>
			</SettingsGroup>

			<SettingsGroup title={dict.defaultLevelGroup}>
				<SettingRow title={dict.defaultLevel} description={dict.defaultLevelDesc}>
					<Select
						value={defaultCefr.value ?? ALL_LEVELS}
						onValueChange={next =>
							defaultCefr.setValue(
								next === ALL_LEVELS ? undefined : (next as WordLevel),
							)
						}
						disabled={defaultCefr.isPending}
					>
						<SelectTrigger className="w-[160px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL_LEVELS}>{dict.allLevels}</SelectItem>
							{levelOptions.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</SettingRow>
			</SettingsGroup>
		</SettingsSection>
	);
};
