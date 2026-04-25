"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { type FC, useEffect, useRef } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["confirm"];
	open: boolean;
	text: string;
	isPending: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ParseConfirmModal: FC<Props> = ({
	dict,
	open,
	text,
	isPending,
	onConfirm,
	onCancel,
}) => {
	const confirmRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		document.addEventListener("keydown", onKey);
		confirmRef.current?.focus();
		return () => {
			document.body.style.overflow = prev;
			document.removeEventListener("keydown", onKey);
		};
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="parse-confirm-title"
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"
		>
			<div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-6 max-w-[460px] w-full">
				<h3
					id="parse-confirm-title"
					className="text-md font-semibold text-[var(--text)] mb-3"
				>
					{dict.title}
				</h3>
				<p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
					{text}
				</p>
				<div className="flex gap-3 justify-end flex-wrap">
					<button
						type="button"
						onClick={onCancel}
						disabled={isPending}
						className="btn btn-sm btn-secondary disabled:opacity-40"
					>
						{dict.cancel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={onConfirm}
						disabled={isPending}
						className="btn btn-sm btn-primary disabled:opacity-40"
					>
						{dict.confirm}
					</button>
				</div>
			</div>
		</div>
	);
};
