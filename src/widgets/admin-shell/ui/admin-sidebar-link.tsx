"use client";

import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";

interface AdminSidebarLinkProps {
	href: string;
	icon: string;
	label: string;
	active: boolean;
	count?: number | null;
	isSub?: boolean;
	onNavigate?: () => void;
}

const formatCount = (n: number) =>
	new Intl.NumberFormat("ru-RU").format(n);

export const AdminSidebarLink: FC<AdminSidebarLinkProps> = ({
	href,
	icon,
	label,
	active,
	count,
	isSub,
	onNavigate,
}) => (
	<Link
		href={href}
		onClick={onNavigate}
		className={cn(
			"flex items-center gap-3 px-5 py-2 text-sm transition-colors border-l-2 border-transparent",
			"text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
			active &&
				"text-[var(--accent)] bg-[var(--accent-dim)] border-l-[var(--accent)]",
			isSub && "pl-10 text-xs",
		)}
	>
		<span className="w-5 text-center text-[0.95rem] shrink-0" aria-hidden>
			{icon}
		</span>
		<span className="truncate flex-1">{label}</span>
		{typeof count === "number" && count > 0 ? (
			<span
				className={cn(
					"ml-auto text-xs px-[7px] py-[1px] rounded-full font-medium tabular-nums",
					"bg-[var(--surface)] text-[var(--text-muted)]",
					active && "bg-[var(--accent-dim)] text-[var(--accent)]",
				)}
			>
				{formatCount(count)}
			</span>
		) : null}
	</Link>
);
