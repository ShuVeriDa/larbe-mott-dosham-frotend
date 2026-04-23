import type { Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";
import { StatusBadge } from "./status-badge";

interface DetailHeaderProps {
	suggestion: Suggestion;
	dict: Dictionary["adminSuggestionDetail"]["header"];
	fieldsDict: Dictionary["adminSuggestionDetail"]["diff"]["fields"];
	lang: Locale;
}

const fieldLabel = (
	field: string,
	dict: Dictionary["adminSuggestionDetail"]["diff"]["fields"],
): string => (field in dict ? dict[field as keyof typeof dict] : field);

export const DetailHeader: FC<DetailHeaderProps> = ({
	suggestion,
	dict,
	fieldsDict,
	lang,
}) => {
	const entryId = suggestion.entry?.id ?? suggestion.entryId;
	const word = suggestion.entry?.word ?? "";

	const shortId = `#${suggestion.id.slice(0, 8)}`;

	return (
		<header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 flex-wrap">
			<div className="min-w-0">
				<h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground mb-1 flex items-center gap-3 flex-wrap">
					<span lang="ce" className="truncate">
						{word}
					</span>
					<span className="inline-flex items-center rounded-full border border-edge bg-surface px-3 py-1 font-mono text-xs font-normal text-faint">
						{shortId}
					</span>
					<StatusBadge status={suggestion.status} dict={dict} size="lg" />
				</h1>
				<p className="text-sm text-muted">
					{dict.subtitle
						.replace("{field}", fieldLabel(suggestion.field, fieldsDict))
						.replace("{entryId}", String(entryId))}
				</p>
			</div>

			<div className="flex gap-2 items-center shrink-0">
				<Button asChild variant="secondary" size="sm">
					<Link href={`/${lang}/entry/${entryId}`} target="_blank" rel="noopener">
						{dict.viewOnSite}
					</Link>
				</Button>
				<Button asChild variant="secondary" size="sm">
					<Link href={`/${lang}/admin/entries/${entryId}/edit`}>
						{dict.editEntry}
					</Link>
				</Button>
			</div>
		</header>
	);
};
