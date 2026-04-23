"use client";

import type { AdminUserListItem } from "@/features/admin-users";
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

interface AdminUsersBlockDialogProps {
	user: AdminUserListItem | null;
	dict: Dictionary["adminUsers"]["blockDialog"];
	mode: "block" | "unblock";
	loading: boolean;
	onCancel: () => void;
	onConfirmBlock: (reason: string) => void;
	onConfirmUnblock: () => void;
}

const REASON_MAX = 500;

interface BlockDialogBodyProps {
	user: AdminUserListItem;
	dict: Dictionary["adminUsers"]["blockDialog"];
	mode: "block" | "unblock";
	loading: boolean;
	onCancel: () => void;
	onConfirmBlock: (reason: string) => void;
	onConfirmUnblock: () => void;
}

const BlockDialogBody: FC<BlockDialogBodyProps> = ({
	user,
	dict,
	mode,
	loading,
	onCancel,
	onConfirmBlock,
	onConfirmUnblock,
}) => {
	const reasonId = useId();
	const [reason, setReason] = useState("");
	const blocking = mode === "block";

	const title = blocking ? dict.blockTitle : dict.unblockTitle;
	const body = (blocking ? dict.blockBody : dict.unblockBody).replace(
		"{name}",
		user.name,
	);

	const handleConfirm = () => {
		if (blocking) {
			onConfirmBlock(reason.trim().slice(0, REASON_MAX));
		} else {
			onConfirmUnblock();
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{body}</DialogDescription>
			</DialogHeader>

			{blocking && (
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
						rows={3}
						className="w-full rounded-md border border-edge bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:shadow-focus disabled:opacity-50"
					/>
					<span className="text-[0.7rem] text-muted-foreground">
						{dict.reasonHint}
					</span>
				</div>
			)}

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
					variant={blocking ? "danger" : "primary"}
					onClick={handleConfirm}
					disabled={loading}
				>
					{loading
						? blocking
							? dict.blocking
							: dict.unblocking
						: blocking
							? dict.block
							: dict.unblock}
				</Button>
			</DialogFooter>
		</>
	);
};

export const AdminUsersBlockDialog: FC<AdminUsersBlockDialogProps> = ({
	user,
	dict,
	mode,
	loading,
	onCancel,
	onConfirmBlock,
	onConfirmUnblock,
}) => (
	<Dialog open={!!user} onOpenChange={(o) => (o ? null : onCancel())}>
		<DialogContent>
			{user && (
				<BlockDialogBody
					key={`${user.id}-${mode}`}
					user={user}
					dict={dict}
					mode={mode}
					loading={loading}
					onCancel={onCancel}
					onConfirmBlock={onConfirmBlock}
					onConfirmUnblock={onConfirmUnblock}
				/>
			)}
		</DialogContent>
	</Dialog>
);
