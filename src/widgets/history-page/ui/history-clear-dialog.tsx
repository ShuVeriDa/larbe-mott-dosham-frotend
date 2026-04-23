"use client";

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

interface HistoryClearDialogProps {
	open: boolean;
	dict: Dictionary["history"]["clearDialog"];
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export const HistoryClearDialog: FC<HistoryClearDialogProps> = ({
	open,
	dict,
	onOpenChange,
	onConfirm,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{dict.title}</DialogTitle>
				<DialogDescription>{dict.body}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="secondary"
					size="md"
					onClick={() => onOpenChange(false)}
				>
					{dict.cancel}
				</Button>
				<Button variant="danger" size="md" onClick={onConfirm}>
					{dict.confirm}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
