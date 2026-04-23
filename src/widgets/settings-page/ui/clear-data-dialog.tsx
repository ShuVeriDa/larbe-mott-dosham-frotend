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

interface ClearDataDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending: boolean;
	dict: Dictionary["settings"]["clearDataDialog"];
}

export const ClearDataDialog: FC<ClearDataDialogProps> = ({
	open,
	onOpenChange,
	onConfirm,
	isPending,
	dict,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-[400px]">
			<DialogHeader>
				<DialogTitle>{dict.title}</DialogTitle>
				<DialogDescription>{dict.text}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onOpenChange(false)}
					disabled={isPending}
				>
					{dict.cancel}
				</Button>
				<Button
					variant="danger"
					size="sm"
					onClick={onConfirm}
					disabled={isPending}
				>
					{dict.confirm}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
