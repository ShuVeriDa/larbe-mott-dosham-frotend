"use client";

import type { Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { useGlobalHotkeys } from "../model/use-global-hotkeys";
import { useLanguageSync } from "../model/use-language-sync";
import { useThemeSync } from "../model/use-theme-sync";

interface PreferencesSyncProps {
	lang: Locale;
}

/**
 * Headless client component mounted in the main layout. Applies the stored
 * user preferences (`prefTheme`, `prefLanguage`, `prefHotkeys`) to the live
 * app — save nothing, just react to loaded user data.
 */
export const PreferencesSync: FC<PreferencesSyncProps> = ({ lang }) => {
	useThemeSync();
	useLanguageSync(lang);
	useGlobalHotkeys(lang);
	return null;
};
