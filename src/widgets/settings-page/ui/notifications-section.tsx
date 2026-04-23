"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Switch } from "@/shared/ui";
import type { FC } from "react";
import { SettingRow } from "./setting-row";
import { SettingsGroup } from "./settings-group";
import { SettingsSection } from "./settings-section";

interface NotificationsSectionProps {
	dict: Dictionary["settings"]["notifications"];
}

export const NotificationsSection: FC<NotificationsSectionProps> = ({
	dict,
}) => (
	<SettingsSection title={dict.title}>
		<SettingsGroup title={dict.emailGroup}>
			<div
				role="status"
				className="mb-4 rounded-md border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground"
			>
				<strong className="text-foreground">{dict.comingSoon}.</strong>{" "}
				{dict.comingSoonDesc}
			</div>

			<SettingRow
				title={dict.notifySuggestions}
				description={dict.notifySuggestionsDesc}
			>
				<Switch
					checked={false}
					disabled
					aria-label={dict.notifySuggestions}
					onCheckedChange={() => {}}
				/>
			</SettingRow>
			<SettingRow
				title={dict.notifyWordOfDay}
				description={dict.notifyWordOfDayDesc}
			>
				<Switch
					checked={false}
					disabled
					aria-label={dict.notifyWordOfDay}
					onCheckedChange={() => {}}
				/>
			</SettingRow>
			<SettingRow
				title={dict.notifyDictUpdates}
				description={dict.notifyDictUpdatesDesc}
			>
				<Switch
					checked={false}
					disabled
					aria-label={dict.notifyDictUpdates}
					onCheckedChange={() => {}}
				/>
			</SettingRow>
		</SettingsGroup>
	</SettingsSection>
);
