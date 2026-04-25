"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";
import type { FC } from "react";

interface RevertModalProps {
	open: boolean;
	isPending: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	dict: Dictionary["admin"]["auditEntry"]["revert"];
}

export const RevertModal: FC<RevertModalProps> = ({
	open,
	isPending,
	onOpenChange,
	onConfirm,
	dict,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{dict.title}</DialogTitle>
				<DialogDescription>{dict.text}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<button
					type="button"
					onClick={() => onOpenChange(false)}
					disabled={isPending}
					className="btn btn-md btn-secondary"
				>
					{dict.cancel}
				</button>
				<button
					type="button"
					onClick={onConfirm}
					disabled={isPending}
					className="btn btn-md"
					style={{
						background: "var(--warning)",
						color: "#000",
						fontWeight: 700,
					}}
				>
					{isPending ? dict.pending : dict.confirm}
				</button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
