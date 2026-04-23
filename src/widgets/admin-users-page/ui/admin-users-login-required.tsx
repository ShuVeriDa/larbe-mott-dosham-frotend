"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FC, useMemo } from "react";

interface AdminUsersLoginRequiredProps {
	dict: Dictionary["adminUsers"]["loginRequired"];
	lang: Locale;
}

export const AdminUsersLoginRequired: FC<AdminUsersLoginRequiredProps> = ({
	dict,
	lang,
}) => {
	const params = useSearchParams();
	const redirect = useMemo(() => {
		const qs = params?.toString();
		return qs ? `/${lang}/admin/users?${qs}` : `/${lang}/admin/users`;
	}, [lang, params]);
	const href = `/${lang}/auth?redirect=${encodeURIComponent(redirect)}`;

	return (
		<div className="text-center py-16 px-6 bg-surface border border-border rounded-xl">
			<h2 className="text-lg font-semibold text-foreground mb-2">
				{dict.title}
			</h2>
			<p className="max-w-sm mx-auto mb-6 text-base text-muted-foreground">
				{dict.text}
			</p>
			<Button asChild variant="primary" size="md">
				<Link href={href}>{dict.cta}</Link>
			</Button>
		</div>
	);
};

interface AdminUsersForbiddenProps {
	dict: Dictionary["adminUsers"]["forbidden"];
}

export const AdminUsersForbidden: FC<AdminUsersForbiddenProps> = ({ dict }) => (
	<div className="text-center py-16 px-6 bg-surface border border-border rounded-xl">
		<h2 className="text-lg font-semibold text-foreground mb-2">{dict.title}</h2>
		<p className="max-w-sm mx-auto text-base text-muted-foreground">
			{dict.text}
		</p>
	</div>
);
