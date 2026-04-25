import type {
	AuditEntryHistoryMeta,
	AuditEntrySummary,
} from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatDaysSinceCreation } from "../lib/format-days";

interface EntrySummaryCardProps {
	entry: AuditEntrySummary;
	meta: AuditEntryHistoryMeta;
	dict: Dictionary["admin"]["auditEntry"]["summary"];
}

const WORD_LEVEL_TONE: Record<string, string> = {
	A: "text-[var(--success)] bg-[var(--success-dim)]",
	B: "text-[var(--warning)] bg-[var(--warning-dim)]",
	C: "text-[var(--danger)] bg-[var(--danger-dim)]",
};

export const EntrySummaryCard: FC<EntrySummaryCardProps> = ({
	entry,
	meta,
	dict,
}) => {
	const levelClass = entry.wordLevel
		? (WORD_LEVEL_TONE[entry.wordLevel] ??
			"text-[var(--text-muted)] bg-[var(--surface-active)]")
		: null;

	return (
		<section
			className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 mb-6 flex flex-wrap items-center gap-5"
			aria-labelledby="entry-summary-word"
		>
			<h2
				id="entry-summary-word"
				className="text-xl font-bold text-[var(--text)]"
			>
				{entry.word}
			</h2>

			<div className="flex flex-wrap items-center gap-2">
				{entry.partOfSpeech ? (
					<span className="text-[0.65rem] font-medium px-1.5 py-[2px] rounded text-[var(--text-muted)] bg-[var(--surface-active)]">
						{entry.partOfSpeech}
					</span>
				) : null}
				{entry.nounClass ? (
					<span className="text-[0.65rem] font-medium px-1.5 py-[2px] rounded text-[var(--info)] bg-[var(--info-dim)]">
						{entry.nounClass}
					</span>
				) : null}
				{entry.wordLevel && levelClass ? (
					<span
						className={cn(
							"text-[0.65rem] font-semibold px-1.5 py-[2px] rounded font-mono uppercase",
							levelClass,
						)}
					>
						{entry.wordLevel}
					</span>
				) : null}
				{entry.sources.map((src) => (
					<span
						key={src}
						className="text-[0.6rem] font-mono px-1.5 py-[1px] rounded text-[var(--text-faint)] bg-[var(--surface)] border border-[var(--border)]"
					>
						{src}
					</span>
				))}
			</div>

			<dl className="ml-auto flex flex-wrap gap-5 shrink-0">
				<SummaryStat label={dict.changesCount} value={meta.totalChanges} />
				<SummaryStat label={dict.authors} value={meta.uniqueAuthors} />
				<SummaryStat
					label={dict.sinceCreated}
					value={formatDaysSinceCreation(meta.daysSinceCreation, dict)}
				/>
			</dl>
		</section>
	);
};

interface SummaryStatProps {
	label: string;
	value: number | string;
}

const SummaryStat: FC<SummaryStatProps> = ({ label, value }) => (
	<div className="text-center">
		<dd className="text-lg font-bold font-mono text-[var(--text)] tabular-nums">
			{value}
		</dd>
		<dt className="text-xs text-[var(--text-muted)]">{label}</dt>
	</div>
);
