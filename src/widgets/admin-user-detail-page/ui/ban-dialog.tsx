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
import { type FC, useId, useState } from "react";

const REASON_MAX = 500;

interface BanDialogProps {
	open: boolean;
	user: AdminUserDetail | undefined;
	dict: Dictionary["adminUserDetail"]["banDialog"];
	loading: boolean;
	onCancel: () => void;
	onConfirm: (reason: string) => void;
}

export const BanDialog: FC<BanDialogProps> = ({
	open,
	user,
	dict,
	loading,
	onCancel,
	onConfirm,
}) => {
	const reasonId = useId();
	const [reason, setReason] = useState("");

	const handleOpenChange = (o: boolean) => {
		if (!o) {
			setReason("");
			onCancel();
		}
	};

	const handleConfirm = () => {
		onConfirm(reason.trim().slice(0, REASON_MAX));
		setReason("");
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>🚫 {dict.title}</DialogTitle>
					{user && (
						<DialogDescription>
							{dict.body
								.replace("{name}", user.name)
								.replace("{username}", user.username)}
						</DialogDescription>
					)}
				</DialogHeader>

				<div className="flex flex-col gap-1">
					<label htmlFor={reasonId} className="text-xs text-muted-foreground">
						{dict.reasonLabel}
					</label>
					<textarea
						id={reasonId}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder={dict.reasonPlaceholder}
						maxLength={REASON_MAX}
						disabled={loading}
						rows={2}
						className="w-full rounded-md border border-edge bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:shadow-focus disabled:opacity-50 resize-y min-h-[60px]"
					/>
				</div>

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
						onClick={handleConfirm}
						disabled={loading}
					>
						{loading ? dict.loading : dict.confirm}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
