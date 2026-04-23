"use client";

import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

interface Props {
	icon: string;
	iconTone:
		| "parse"
		| "unify"
		| "load"
		| "improve"
		| "rollback"
		| "reset";
	title: string;
	description: string;
	footer: ReactNode;
	result?: ReactNode;
}

const TONE: Record<Props["iconTone"], string> = {
	parse: "bg-[var(--accent-dim)] text-[var(--accent)]",
	unify: "bg-[var(--info-dim)] text-[var(--info)]",
	load: "bg-[var(--success-dim)] text-[var(--success)]",
	improve: "bg-[var(--warning-dim)] text-[var(--warning)]",
	rollback: "bg-[var(--surface-active)] text-[var(--text-muted)]",
	reset: "bg-[var(--danger-dim)] text-[var(--danger)]",
};

export const ActionCard: FC<Props> = ({
	icon,
	iconTone,
	title,
	description,
	footer,
	result,
}) => (
	<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-colors flex flex-col gap-3">
		<div className="flex items-start justify-between gap-3">
			<div
				className={cn(
					"w-9 h-9 rounded-xl flex items-center justify-center text-base",
					TONE[iconTone],
				)}
				aria-hidden
			>
				{icon}
			</div>
		</div>
		<div className="text-sm font-semibold text-[var(--text)]">{title}</div>
		<p className="text-xs text-[var(--text-muted)] leading-relaxed min-h-[2.5rem]">
			{description}
		</p>
		<div className="flex items-center gap-2 flex-wrap mt-auto">{footer}</div>
		{result}
	</div>
);

interface ResultProps {
	tone: "ok" | "err";
	children: ReactNode;
}

export const ActionCardResult: FC<ResultProps> = ({ tone, children }) => (
	<div
		className={cn(
			"mt-1 px-3 py-2 rounded-md text-xs font-mono leading-relaxed break-words",
			tone === "ok"
				? "bg-[var(--success-dim)] text-[var(--success)] border border-[var(--success-dim)]"
				: "bg-[var(--danger-dim)] text-[var(--danger)] border border-[var(--danger-dim)]",
		)}
		role="status"
	>
		{children}
	</div>
);
