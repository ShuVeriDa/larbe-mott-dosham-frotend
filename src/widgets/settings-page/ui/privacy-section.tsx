"use client";

import type { User } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Switch } from "@/shared/ui";
import { Trash2Icon } from "lucide-react";
import type { FC } from "react";
import { useClearHistory } from "../model/use-clear-history";
import { usePreference } from "../model/use-preference";
import { SettingRow } from "./setting-row";
import { SettingsGroup } from "./settings-group";
import { SettingsSection } from "./settings-section";

interface PrivacySectionProps {
	user: User;
	dict: Dictionary["settings"]["privacy"];
	toasts: Dictionary["settings"]["toasts"];
}

export const PrivacySection: FC<PrivacySectionProps> = ({
	user,
	dict,
	toasts,
}) => {
	const toastOpts = {
		savedMessage: toasts.saved,
		errorMessage: toasts.saveError,
	};

	const saveHistory = usePreference(user, "prefSaveHistory", toastOpts);
	const publicProfile = usePreference(user, "prefPublicProfile", toastOpts);
	const publicFavorites = usePreference(user, "prefPublicFavorites", toastOpts);

	const clearHistory = useClearHistory({
		successMessage: dict.clearHistorySuccess,
		errorMessage: dict.clearHistoryError,
	});

	return (
		<SettingsSection title={dict.title}>
			<SettingsGroup title={dict.activityGroup}>
				<SettingRow title={dict.saveHistory} description={dict.saveHistoryDesc}>
					<Switch
						checked={saveHistory.value ?? true}
						onCheckedChange={checked => saveHistory.setValue(checked)}
						disabled={saveHistory.isPending}
						aria-label={dict.saveHistory}
					/>
				</SettingRow>
				<SettingRow
					title={dict.publicProfile}
					description={dict.publicProfileDesc}
				>
					<Switch
						checked={publicProfile.value ?? false}
						onCheckedChange={checked => publicProfile.setValue(checked)}
						disabled={publicProfile.isPending}
						aria-label={dict.publicProfile}
					/>
				</SettingRow>
				<SettingRow
					title={dict.publicFavorites}
					description={dict.publicFavoritesDesc}
				>
					<Switch
						checked={publicFavorites.value ?? false}
						onCheckedChange={checked => publicFavorites.setValue(checked)}
						disabled={publicFavorites.isPending}
						aria-label={dict.publicFavorites}
					/>
				</SettingRow>
			</SettingsGroup>

			<SettingsGroup>
				<Button
					variant="secondary"
					size="sm"
					onClick={clearHistory.clear}
					disabled={clearHistory.isPending}
				>
					<Trash2Icon className="size-3.5" />
					{dict.clearHistoryButton}
				</Button>
			</SettingsGroup>
		</SettingsSection>
	);
};
