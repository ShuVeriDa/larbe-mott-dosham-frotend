import type { Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";

interface QuickActionsCardProps {
	suggestion: Suggestion;
	dict: Dictionary["adminSuggestionDetail"]["quickActions"];
	lang: Locale;
}

export const QuickActionsCard: FC<QuickActionsCardProps> = ({
	suggestion,
	dict,
	lang,
}) => {
	const entryId = suggestion.entry?.id ?? suggestion.entryId;
	const userId = suggestion.user?.id ?? suggestion.userId;

	return (
		<section className="rounded-lg border border-edge bg-surface overflow-hidden">
			<header className="px-5 py-4 border-b border-edge">
				<h3 className="text-sm font-semibold text-foreground">{dict.title}</h3>
			</header>
			<div className="px-5 py-5 flex flex-col gap-2">
				<Button asChild variant="secondary" size="sm" className="w-full !justify-start">
					<Link href={`/${lang}/admin/entries/${entryId}/edit`}>
						{dict.editEntry}
					</Link>
				</Button>
				<Button asChild variant="secondary" size="sm" className="w-full !justify-start">
					<Link href={`/${lang}/admin/audit/entries/${entryId}`}>
						{dict.auditHistory}
					</Link>
				</Button>
				<Button asChild variant="secondary" size="sm" className="w-full !justify-start">
					<Link href={`/${lang}/admin/users/${userId}`}>
						{dict.authorProfile}
					</Link>
				</Button>
			</div>
		</section>
	);
};
