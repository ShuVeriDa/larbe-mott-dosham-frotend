"use client";

import { cn } from "@/shared/lib";
import { type FC, useEffect, useRef } from "react";

interface Props {
	open: boolean;
	title: string;
	text: string;
	confirmLabel: string;
	cancelLabel: string;
	tone?: "warning" | "danger";
	isPending?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmModal: FC<Props> = ({
	open,
	title,
	text,
	confirmLabel,
	cancelLabel,
	tone = "warning",
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
			aria-labelledby="rollback-confirm-title"
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"
		>
			<div className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-6 max-w-[460px] w-full">
				<h3
					id="rollback-confirm-title"
					className="text-md font-semibold text-[var(--text)] mb-3"
				>
					{title}
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
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={onConfirm}
						disabled={isPending}
						className={cn(
							"btn btn-sm disabled:opacity-40",
							tone === "danger" ? "btn-danger" : "btn-warning",
						)}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};
