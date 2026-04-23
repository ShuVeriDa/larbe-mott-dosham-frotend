"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Logo } from "@/shared/ui/primitives/logo";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { useMemo } from "react";
import {
	type AdminNavGroup,
	buildAdminNavGroups,
	findActiveNav,
} from "../lib/nav-items";
import { AdminSidebarLink } from "./admin-sidebar-link";

interface AdminSidebarProps {
	lang: Locale;
	dict: Dictionary["admin"]["shell"];
	open: boolean;
	onClose: () => void;
	counters?: Partial<Record<"entries" | "suggestions" | "users", number>>;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({
	lang,
	dict,
	open,
	onClose,
	counters,
}) => {
	const pathname = usePathname();
	const groups = useMemo<AdminNavGroup[]>(
		() => buildAdminNavGroups(lang),
		[lang],
	);
	const activeKey = useMemo(
		() => findActiveNav(pathname, groups),
		[pathname, groups],
	);

	return (
		<>
			<button
				type="button"
				aria-hidden={!open}
				onClick={onClose}
				className={cn(
					"fixed inset-0 bg-black/50 z-[99] transition-opacity md:hidden",
					open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
				)}
			/>
			<aside
				className={cn(
					"fixed top-0 left-0 bottom-0 w-[260px] z-[100]",
					"bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
					"flex flex-col transition-transform duration-300",
					"md:translate-x-0",
					open ? "translate-x-0" : "-translate-x-full",
				)}
				aria-label={dict.navAriaLabel}
			>
				<button
					type="button"
					onClick={onClose}
					className="md:hidden absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text)] p-1"
					aria-label={dict.closeSidebar}
				>
					✕
				</button>

				<div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border)]">
					<Logo variant="cyrillic" size="nav" locale={lang} />
					<span className="text-[0.6rem] font-semibold bg-[var(--danger-dim)] text-[var(--danger)] px-1.5 py-[2px] rounded-full tracking-wider">
						{dict.badge}
					</span>
				</div>

				<nav className="flex-1 overflow-y-auto py-3">
					{groups.map((group) => (
						<div key={group.key}>
							<div className="px-5 py-3 text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
								{dict.sections[group.key]}
							</div>
							{group.items.map((item) => (
								<AdminSidebarLink
									key={item.key}
									href={item.href}
									icon={item.icon}
									label={dict.items[item.labelKey]}
									active={activeKey === item.key}
									count={
										item.counterKey ? (counters?.[item.counterKey] ?? null) : null
									}
									isSub={item.isSub}
									onNavigate={onClose}
								/>
							))}
						</div>
					))}
				</nav>
			</aside>
		</>
	);
};
