"use client";

import type { FC } from "react";
import { useEffect } from "react";

interface Props {
	open: boolean;
	title: string;
	body: string;
	confirmLabel: string;
	cancelLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const LoadConfirmModal: FC<Props> = ({
	open,
	title,
	body,
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel,
}) => {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60"
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby="load-confirm-title"
		>
			<div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-6 max-w-[460px] w-full">
				<h3
					id="load-confirm-title"
					className="text-base font-semibold text-[var(--text)] mb-3"
				>
					{title}
				</h3>
				<p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
					{body}
				</p>
				<div className="flex gap-3 justify-end">
					<button
						type="button"
						onClick={onCancel}
						className="btn btn-sm btn-secondary"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="btn btn-sm btn-primary"
						autoFocus
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};
