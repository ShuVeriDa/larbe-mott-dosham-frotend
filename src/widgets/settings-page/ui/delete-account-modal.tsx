"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
} from "@/shared/ui";
import { type FC, useEffect, useState } from "react";
import { useDeleteAccountFlow } from "../model/use-delete-account";

interface DeleteAccountModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	lang: Locale;
	dict: Dictionary["profile"]["delete"];
}

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({
	open,
	onOpenChange,
	lang,
	dict,
}) => {
	const [confirmation, setConfirmation] = useState("");
	const { submit, isPending } = useDeleteAccountFlow({
		lang,
		confirmPhrase: dict.confirmPhrase,
		dict,
	});

	useEffect(() => {
		if (!open) setConfirmation("");
	}, [open]);

	const canSubmit = confirmation.trim() === dict.confirmPhrase && !isPending;

	const handleConfirm = async () => {
		if (!canSubmit) return;
		await submit();
		onOpenChange(false);
	};

	const labelParts = dict.confirmLabel.split("{phrase}");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>{dict.title}</DialogTitle>
					<DialogDescription>{dict.text}</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="settings-delete-confirm"
						className="text-sm text-muted-foreground"
					>
						{labelParts[0]}
						<strong className="text-foreground">{dict.confirmPhrase}</strong>
						{labelParts[1] ?? ""}
					</label>
					<Input
						id="settings-delete-confirm"
						type="text"
						placeholder={dict.confirmPlaceholder}
						value={confirmation}
						disabled={isPending}
						onChange={e => setConfirmation(e.target.value)}
						autoComplete="off"
					/>
				</div>

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
						onClick={handleConfirm}
						disabled={!canSubmit}
					>
						{dict.submit}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
