"use client";

import type { AdminUserDetail } from "@/features/admin-users";
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

interface DeleteDialogProps {
	open: boolean;
	user: AdminUserDetail | undefined;
	dict: Dictionary["adminUserDetail"]["deleteDialog"];
	loading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export const DeleteDialog: FC<DeleteDialogProps> = ({
	open,
	user,
	dict,
	loading,
	onCancel,
	onConfirm,
}) => (
	<Dialog open={open} onOpenChange={(o) => (o ? null : onCancel())}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>🗑 {dict.title}</DialogTitle>
				{user && (
					<DialogDescription>
						{dict.body.replace("{name}", user.name)}
					</DialogDescription>
				)}
			</DialogHeader>

			<p className="text-sm text-muted-foreground">
				{dict.warning}
			</p>

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
					className="!bg-red-500 !text-white hover:!brightness-110"
					onClick={onConfirm}
					disabled={loading}
				>
					{loading ? dict.loading : dict.confirm}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
