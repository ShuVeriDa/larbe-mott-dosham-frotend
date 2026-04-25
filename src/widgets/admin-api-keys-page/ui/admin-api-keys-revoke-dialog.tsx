"use client";

import type { ApiKey } from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";
import type { FC } from "react";

interface AdminApiKeysRevokeDialogProps {
	apiKey: ApiKey | null;
	dict: Dictionary["admin"]["apiKeys"]["revokeDialog"];
	loading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export const AdminApiKeysRevokeDialog: FC<AdminApiKeysRevokeDialogProps> = ({
	apiKey,
	dict,
	loading,
	onCancel,
	onConfirm,
}) => (
	<Dialog open={!!apiKey} onOpenChange={(o) => (o ? null : onCancel())}>
		<DialogContent>
			{apiKey && (
				<>
					<DialogHeader>
						<DialogTitle>{dict.title}</DialogTitle>
						<DialogDescription>
							{dict.text
								.replace("{name}", apiKey.name)
								.replace("{prefix}", apiKey.prefix)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="secondary"
							onClick={onCancel}
							disabled={loading}
						>
							{dict.cancel}
						</Button>
						<Button
							type="button"
							variant="danger"
							onClick={onConfirm}
							disabled={loading}
						>
							{loading ? dict.confirming : dict.confirm}
						</Button>
					</DialogFooter>
				</>
			)}
		</DialogContent>
	</Dialog>
);
