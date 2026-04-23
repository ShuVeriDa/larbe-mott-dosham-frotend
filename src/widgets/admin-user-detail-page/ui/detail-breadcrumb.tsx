import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface DetailBreadcrumbProps {
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["breadcrumb"];
	currentName: string | null;
}

export const DetailBreadcrumb: FC<DetailBreadcrumbProps> = ({
	lang,
	dict,
	currentName,
}) => (
	<nav
		aria-label={dict.aria}
		className="flex items-center gap-2 text-xs text-muted-foreground mb-4"
	>
		<Link
			href={`/${lang}/admin`}
			className="hover:text-primary transition-colors"
		>
			{dict.admin}
		</Link>
		<span aria-hidden>›</span>
		<Link
			href={`/${lang}/admin/users`}
			className="hover:text-primary transition-colors"
		>
			{dict.users}
		</Link>
		<span aria-hidden>›</span>
		<span className="text-foreground/80 truncate max-w-[40ch]">
			{currentName ?? "…"}
		</span>
	</nav>
);
