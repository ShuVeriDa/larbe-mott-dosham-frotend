import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface DetailBreadcrumbProps {
	dict: Dictionary["adminSuggestionDetail"]["breadcrumb"];
	lang: Locale;
	word: string;
	suggestionId: string;
}

export const DetailBreadcrumb: FC<DetailBreadcrumbProps> = ({
	dict,
	lang,
	word,
	suggestionId,
}) => (
	<nav
		aria-label={dict.aria}
		className="flex items-center gap-2 text-xs text-muted mb-4"
	>
		<Link
			href={`/${lang}/admin`}
			className="text-muted transition-colors hover:text-primary"
		>
			{dict.dashboard}
		</Link>
		<span aria-hidden>›</span>
		<Link
			href={`/${lang}/admin/suggestions`}
			className="text-muted transition-colors hover:text-primary"
		>
			{dict.suggestions}
		</Link>
		<span aria-hidden>›</span>
		<span className="text-subtle truncate max-w-[200px]">
			{word} #{suggestionId.slice(0, 8)}
		</span>
	</nav>
);
