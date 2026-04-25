"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

type EditDict = Dictionary["admin"]["entryEdit"]["saveBar"];

interface SaveBarProps {
	visible: boolean;
	isSaving: boolean;
	onSave: () => void;
	onCancel: () => void;
	dict: EditDict;
}

export const SaveBar: FC<SaveBarProps> = ({
	visible,
	isSaving,
	onSave,
	onCancel,
	dict,
}) => (
	<div
		className={cn(
			"fixed bottom-0 left-0 right-0 lg:left-[260px]",
			"bg-[var(--bg-raised)] backdrop-blur-xl border-t border-[var(--border)]",
			"px-4 sm:px-6 py-3 z-40",
			"flex items-center justify-between gap-3 flex-wrap",
			"transition-transform duration-300 ease-out",
			visible ? "translate-y-0" : "translate-y-full",
		)}
		aria-hidden={!visible}
	>
		<div className="flex items-center gap-3">
			<span className="w-2 h-2 rounded-full bg-[var(--warning)] animate-pulse" />
			<span className="text-sm text-[var(--text-secondary)]">
				{dict.unsaved}
			</span>
		</div>
		<div className="flex gap-2">
			<button
				type="button"
				onClick={onCancel}
				disabled={isSaving}
				className="btn btn-md btn-ghost disabled:opacity-50"
			>
				{dict.cancel}
			</button>
			<button
				type="button"
				onClick={onSave}
				disabled={isSaving}
				className="btn btn-md btn-primary disabled:opacity-50"
			>
				{isSaving ? dict.saving : dict.save}
			</button>
		</div>
	</div>
);
