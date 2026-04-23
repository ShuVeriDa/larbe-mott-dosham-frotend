import type { FC } from "react";

interface ToastProps {
	message: string;
}

export const Toast: FC<ToastProps> = ({ message }) => (
	<div
		role="status"
		aria-live="polite"
		className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 bg-[var(--bg-raised)] border border-[var(--border)] rounded-[14px] text-sm text-[var(--text)] shadow-lg z-[110]"
	>
		<span>{message}</span>
	</div>
);
