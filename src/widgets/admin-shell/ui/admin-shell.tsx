"use client";

import { useAdminSidebarCounters } from "@/features/admin-dashboard";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import type { FC, ReactNode } from "react";
import { useAdminShell } from "../model/use-admin-shell";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

interface AdminShellProps {
	lang: Locale;
	dict: Dictionary["admin"]["shell"];
	userMenu: Dictionary["userMenu"];
	children: ReactNode;
}

export const AdminShell: FC<AdminShellProps> = ({
	lang,
	dict,
	userMenu,
	children,
}) => {
	const authStatus = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();
	const { open, openSidebar, closeSidebar } = useAdminShell();
	const countersQuery = useAdminSidebarCounters({
		enabled: authStatus === "ready" && isAuthenticated,
	});

	return (
		<div className="flex min-h-screen" data-admin-shell>
			<AdminSidebar
				lang={lang}
				dict={dict}
				open={open}
				onClose={closeSidebar}
				counters={countersQuery.data?.sidebar}
			/>
			<div className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
				<AdminTopbar
					lang={lang}
					dict={dict}
					userMenu={userMenu}
					onOpenSidebar={openSidebar}
				/>
				<div className="flex-1 px-4 md:px-6 py-6 pb-12">{children}</div>
			</div>
		</div>
	);
};
