"use client";

import type { User } from "@/entities/user";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { type FC, useState } from "react";
import { useBooleanPreference } from "../model/use-preferences";
import { DangerZone } from "./danger-zone";
import { DeleteAccountModal } from "./delete-account-modal";
import { SettingRow } from "./setting-row";

interface SettingsTabProps {
	user: User;
	lang: Locale;
	dict: Dictionary["profile"]["settings"];
	deleteDict: Dictionary["profile"]["delete"];
}

export const SettingsTab: FC<SettingsTabProps> = ({
	user,
	lang,
	dict,
	deleteDict,
}) => {
	const [deleteOpen, setDeleteOpen] = useState(false);

	const saveHistory = useBooleanPreference(user, "prefSaveHistory", dict.updateError);
	const showExamples = useBooleanPreference(user, "prefShowExamples", dict.updateError);
	const compactView = useBooleanPreference(user, "prefCompactView", dict.updateError);

	return (
		<div className="flex flex-col gap-8">
			<section>
				<h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-edge">
					{dict.preferencesTitle}
				</h2>
				<SettingRow
					title={dict.saveHistory}
					description={dict.saveHistoryDesc}
					checked={saveHistory.value}
					onToggle={saveHistory.toggle}
					disabled={saveHistory.isPending}
				/>
				<SettingRow
					title={dict.showExamples}
					description={dict.showExamplesDesc}
					checked={showExamples.value}
					onToggle={showExamples.toggle}
					disabled={showExamples.isPending}
				/>
				<SettingRow
					title={dict.compactView}
					description={dict.compactViewDesc}
					checked={compactView.value}
					onToggle={compactView.toggle}
					disabled={compactView.isPending}
				/>
			</section>

			<DangerZone dict={dict} onDelete={() => setDeleteOpen(true)} />

			<DeleteAccountModal
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				lang={lang}
				dict={deleteDict}
			/>
		</div>
	);
};
