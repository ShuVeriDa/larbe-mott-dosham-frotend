"use client";

import type { Language, User } from "@/entities/user";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch,
} from "@/shared/ui";
import type { FC } from "react";
import { useLanguagePreference } from "../model/use-language-preference";
import { usePreference } from "../model/use-preference";
import { useThemePreference } from "../model/use-theme-preference";
import { RadioPillGroup } from "./radio-pill-group";
import { SettingRow } from "./setting-row";
import { SettingsGroup } from "./settings-group";
import { SettingsSection } from "./settings-section";

interface GeneralSectionProps {
	user: User;
	lang: Locale;
	dict: Dictionary["settings"]["general"];
	toasts: Dictionary["settings"]["toasts"];
}

export const GeneralSection: FC<GeneralSectionProps> = ({
	user,
	lang,
	dict,
	toasts,
}) => {
	const toastOpts = {
		savedMessage: toasts.saved,
		errorMessage: toasts.saveError,
	};

	const theme = useThemePreference(user, toastOpts);
	const language = useLanguagePreference(user, lang, toastOpts);
	const hotkeys = usePreference(user, "prefHotkeys", toastOpts);

	const themeOptions = [
		{ value: "light" as const, label: dict.themeLight },
		{ value: "dark" as const, label: dict.themeDark },
		{ value: "system" as const, label: dict.themeSystem },
	];

	const languageOptions: { value: Language; label: string }[] = [
		{ value: "ru", label: dict.languageRu },
		{ value: "ce", label: dict.languageCe },
		{ value: "en", label: dict.languageEn },
	];

	return (
		<SettingsSection title={dict.title}>
			<SettingsGroup title={dict.appearance}>
				<SettingRow title={dict.theme} description={dict.themeDesc}>
					<RadioPillGroup
						name={dict.theme}
						value={theme.value}
						options={themeOptions}
						onChange={theme.setValue}
						disabled={theme.isPending}
					/>
				</SettingRow>
			</SettingsGroup>

			<SettingsGroup title={dict.languageGroup}>
				<SettingRow title={dict.language} description={dict.languageDesc}>
					<Select
						value={language.value}
						onValueChange={(next: Language) => language.setValue(next)}
						disabled={language.isPending}
					>
						<SelectTrigger className="w-[160px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{languageOptions.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</SettingRow>
			</SettingsGroup>

			<SettingsGroup title={dict.hotkeysGroup}>
				<SettingRow title={dict.hotkeys} description={dict.hotkeysDesc}>
					<Switch
						checked={hotkeys.value ?? true}
						onCheckedChange={checked => hotkeys.setValue(checked)}
						disabled={hotkeys.isPending}
						aria-label={dict.hotkeys}
					/>
				</SettingRow>
			</SettingsGroup>
		</SettingsSection>
	);
};
