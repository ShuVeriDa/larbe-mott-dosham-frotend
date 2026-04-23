"use client";

import {
	useResetPipelineStatus,
	useUnifiedLog,
} from "@/features/admin-pipeline-reset";
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
import { formatNumber } from "../lib";

interface FinalConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dict: Dictionary["admin"]["pipelineReset"]["finalModal"];
	onConfirm: () => void;
	isPending: boolean;
}

export const FinalConfirmModal: FC<FinalConfirmModalProps> = ({
	open,
	onOpenChange,
	dict,
	onConfirm,
	isPending,
}) => {
	const statusQuery = useResetPipelineStatus();
	const unifiedLogQuery = useUnifiedLog();

	const entries = statusQuery.data?.unified.entries ?? 0;
	const snapshots = unifiedLogQuery.data?.totalSteps ?? 0;

	const body = dict.body
		.replace("{entries}", formatNumber(entries))
		.replace("{snapshots}", formatNumber(snapshots));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={!isPending}
				className="border-[var(--danger)]"
			>
				<DialogHeader>
					<DialogTitle className="text-[var(--danger)]">
						{dict.title}
					</DialogTitle>
					<DialogDescription>{body}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<button
						type="button"
						className="btn btn-sm btn-secondary disabled:opacity-40"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						{dict.cancel}
					</button>
					<button
						type="button"
						className="btn btn-sm btn-danger disabled:opacity-40"
						onClick={onConfirm}
						disabled={isPending}
					>
						{isPending ? `${dict.confirm}…` : dict.confirm}
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
