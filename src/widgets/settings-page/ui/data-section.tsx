"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import { type FC, useState } from "react";
import { useClearAllData } from "../model/use-clear-all-data";
import { useExport } from "../model/use-export";
import { ClearDataDialog } from "./clear-data-dialog";
import { DeleteAccountModal } from "./delete-account-modal";
import { ExportCard } from "./export-card";
import { SettingsGroup } from "./settings-group";
import { SettingsSection } from "./settings-section";

interface DataSectionProps {
	lang: Locale;
	dict: Dictionary["settings"]["data"];
	clearDataDict: Dictionary["settings"]["clearDataDialog"];
	deleteDict: Dictionary["profile"]["delete"];
	toasts: Dictionary["settings"]["toasts"];
}

export const DataSection: FC<DataSectionProps> = ({
	lang,
	dict,
	clearDataDict,
	deleteDict,
}) => {
	const [clearOpen, setClearOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const exportMut = useExport({ errorMessage: dict.exportError });
	const clearAll = useClearAllData({
		successMessage: dict.clearDataSuccess,
		errorMessage: dict.clearDataError,
	});

	const handleClearConfirm = async () => {
		await clearAll.clear();
		setClearOpen(false);
	};

	return (
		<SettingsSection title={dict.title}>
			<SettingsGroup title={dict.exportGroup}>
				<ExportCard
					icon="📄"
					title={dict.exportFavorites}
					description={dict.exportFavoritesDesc}
					buttonLabel={dict.exportDownload}
					onDownload={() => exportMut.run("favorites")}
					disabled={exportMut.pendingKey === "favorites"}
				/>
				<ExportCard
					icon="🕐"
					title={dict.exportHistory}
					description={dict.exportHistoryDesc}
					buttonLabel={dict.exportDownload}
					onDownload={() => exportMut.run("history")}
					disabled={exportMut.pendingKey === "history"}
				/>
				<ExportCard
					icon="📝"
					title={dict.exportSuggestions}
					description={dict.exportSuggestionsDesc}
					buttonLabel={dict.exportDownload}
					onDownload={() => exportMut.run("suggestions")}
					disabled={exportMut.pendingKey === "suggestions"}
				/>
			</SettingsGroup>

			<SettingsGroup title={dict.dangerGroup}>
				<div className="border border-danger/25 rounded-lg p-5">
					<div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
						<div className="flex-1">
							<div className="text-sm">{dict.clearDataTitle}</div>
							<div className="text-xs text-muted-foreground mt-0.5">
								{dict.clearDataDesc}
							</div>
						</div>
						<Button
							variant="danger"
							size="sm"
							onClick={() => setClearOpen(true)}
							disabled={clearAll.isPending}
							className="max-sm:w-full"
						>
							{dict.clearDataButton}
						</Button>
					</div>
					<div className="mt-4 pt-4 border-t border-danger/25 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
						<div className="flex-1">
							<div className="text-sm">{dict.deleteAccountTitle}</div>
							<div className="text-xs text-muted-foreground mt-0.5">
								{dict.deleteAccountDesc}
							</div>
						</div>
						<Button
							variant="danger"
							size="sm"
							onClick={() => setDeleteOpen(true)}
							className="max-sm:w-full"
						>
							{dict.deleteAccountButton}
						</Button>
					</div>
				</div>
			</SettingsGroup>

			<ClearDataDialog
				open={clearOpen}
				onOpenChange={setClearOpen}
				onConfirm={handleClearConfirm}
				isPending={clearAll.isPending}
				dict={clearDataDict}
			/>

			<DeleteAccountModal
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				lang={lang}
				dict={deleteDict}
			/>
		</SettingsSection>
	);
};
