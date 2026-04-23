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

interface FavoriteRemoveDialogProps {
	open: boolean;
	word: string;
	dict: Dictionary["favoritesPage"]["removeDialog"];
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export const FavoriteRemoveDialog: FC<FavoriteRemoveDialogProps> = ({
	open,
	word,
	dict,
	onOpenChange,
	onConfirm,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{dict.title}</DialogTitle>
				<DialogDescription>
					{dict.body.replace("{word}", word)}
				</DialogDescription>
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
