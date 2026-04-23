"use client";

import { useCurrentUser } from "@/entities/user";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import type { FC, ReactNode } from "react";
import { AdminForbidden, AdminLoginRequired } from "./states";

interface AdminAuthGateProps {
	lang: Locale;
	dict: Dictionary["admin"]["common"];
	children: ReactNode;
}

export const AdminAuthGate: FC<AdminAuthGateProps> = ({
	lang,
	dict,
	children,
}) => {
	const status = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();
	const userQuery = useCurrentUser();

	if (status !== "ready") return <>{children}</>;

	if (!isAuthenticated) {
		return (
			<AdminLoginRequired
				lang={lang}
				title={dict.loginRequiredTitle}
				description={dict.loginRequiredText}
				ctaLabel={dict.loginRequiredCta}
			/>
		);
	}

	const user = userQuery.data;
	if (userQuery.isLoading || !user) return <>{children}</>;

	const isAdmin =
		user.isAdmin ||
		user.roles?.some(
			(r) => r.role.name === "ADMIN" || r.role.name === "EDITOR",
		);

	if (!isAdmin) {
		return (
			<AdminForbidden
				title={dict.forbiddenTitle}
				description={dict.forbiddenText}
			/>
		);
	}

	return <>{children}</>;
};
