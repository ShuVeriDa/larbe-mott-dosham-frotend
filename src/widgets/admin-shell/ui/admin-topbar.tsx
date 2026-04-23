"use client";

import { ThemeSwitcher } from "@/features/theme-switcher";
import { UserMenu } from "@/features/user-menu";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { useMemo } from "react";
import { buildAdminNavGroups, findActiveNav } from "../lib/nav-items";

interface AdminTopbarProps {
	lang: Locale;
	dict: Dictionary["admin"]["shell"];
	userMenu: Dictionary["userMenu"];
	onOpenSidebar: () => void;
}

export const AdminTopbar: FC<AdminTopbarProps> = ({
	lang,
	dict,
	userMenu,
	onOpenSidebar,
}) => {
	const pathname = usePathname();
	const authStatus = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();

	const activeKey = useMemo(() => {
		const groups = buildAdminNavGroups(lang);
		return findActiveNav(pathname, groups);
	}, [pathname, lang]);

	const title = activeKey ? dict.items[activeKey] : dict.items.dashboard;

	return (
		<header
			className="sticky top-0 z-[60] backdrop-blur-xl border-b border-[var(--border)] px-4 md:px-6 py-3 flex items-center justify-between gap-4"
			style={{ background: "var(--bg-overlay)" }}
		>
			<div className="flex items-center gap-3 min-w-0">
				<button
					type="button"
					onClick={onOpenSidebar}
					className="md:hidden text-[var(--text)] text-[1.3rem] p-1"
					aria-label={dict.openSidebar}
				>
					☰
				</button>
				<h1
					className="font-semibold text-[var(--text)] truncate"
					style={{ fontSize: "var(--text-md)" }}
				>
					{title}
				</h1>
			</div>
			<div className="flex items-center gap-3">
				<Link
					href={`/${lang}`}
					className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors hidden sm:inline"
				>
					{dict.backToSite}
				</Link>
				{authStatus === "ready" && isAuthenticated ? (
					<UserMenu lang={lang} dict={userMenu} />
				) : (
					<ThemeSwitcher />
				)}
			</div>
		</header>
	);
};
