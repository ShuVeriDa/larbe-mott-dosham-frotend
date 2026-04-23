import type { Suggestion } from "@/features/suggestions";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";
import { formatDateTime } from "../lib/format-date";
import { getInitials } from "../lib/format-value";
import { StatusBadge } from "./status-badge";

interface InfoCardProps {
	suggestion: Suggestion;
	dict: Dictionary["adminSuggestionDetail"]["info"];
	headerDict: Dictionary["adminSuggestionDetail"]["header"];
	fieldsDict: Dictionary["adminSuggestionDetail"]["diff"]["fields"];
	lang: Locale;
}

const fieldLabel = (
	field: string,
	dict: Dictionary["adminSuggestionDetail"]["diff"]["fields"],
): string => (field in dict ? dict[field as keyof typeof dict] : field);

export const InfoCard: FC<InfoCardProps> = ({
	suggestion,
	dict,
	headerDict,
	fieldsDict,
	lang,
}) => {
	const entryId = suggestion.entry?.id ?? suggestion.entryId;
	const word = suggestion.entry?.word ?? "";
	const showReviewed = suggestion.status !== "PENDING";

	return (
		<section className="rounded-lg border border-edge bg-surface overflow-hidden mb-4">
			<header className="px-5 py-4 border-b border-edge">
				<h3 className="text-sm font-semibold text-foreground">{dict.title}</h3>
			</header>
			<dl className="px-5">
				<Row label={dict.status}>
					<StatusBadge status={suggestion.status} dict={headerDict} />
				</Row>
				{suggestion.user ? (
					<Row label={dict.author}>
						<span className="inline-flex items-center gap-2">
							<span
								aria-hidden
								className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-surface-active text-muted text-[0.55rem] font-semibold"
							>
								{getInitials(suggestion.user.name)}
							</span>
							<Link
								href={`/${lang}/admin/users/${suggestion.user.id}`}
								className="text-primary transition-colors hover:brightness-110"
							>
								{suggestion.user.name}
							</Link>
						</span>
					</Row>
				) : null}
				<Row label={dict.createdAt}>
					{formatDateTime(suggestion.createdAt, lang)}
				</Row>
				<Row label={dict.field}>
					<span className="font-mono text-xs text-primary">
						{fieldLabel(suggestion.field, fieldsDict)}
					</span>
				</Row>
				<Row label={dict.entry}>
					<Link
						href={`/${lang}/entry/${entryId}`}
						className="text-primary transition-colors hover:brightness-110"
					>
						{dict.entryLink
							.replace("{word}", word)
							.replace("{entryId}", String(entryId))}
					</Link>
				</Row>
				<Row label={dict.suggestionId}>
					<span className="font-mono text-xs text-muted">
						#{suggestion.id.slice(0, 8)}
					</span>
				</Row>
				{showReviewed && suggestion.reviewedAt ? (
					<Row label={dict.reviewedAt}>
						{formatDateTime(suggestion.reviewedAt, lang)}
					</Row>
				) : null}
				{showReviewed && suggestion.reviewer ? (
					<Row label={dict.reviewer}>{suggestion.reviewer.name}</Row>
				) : null}
			</dl>
		</section>
	);
};

const Row: FC<{ label: string; children: React.ReactNode }> = ({
	label,
	children,
}) => (
	<div className="flex justify-between items-center py-3 border-b border-edge last:border-b-0 gap-3">
		<dt className="text-xs text-muted font-medium shrink-0">{label}</dt>
		<dd className="text-sm text-foreground font-medium text-right max-w-[60%] break-words">
			{children}
		</dd>
	</div>
);
