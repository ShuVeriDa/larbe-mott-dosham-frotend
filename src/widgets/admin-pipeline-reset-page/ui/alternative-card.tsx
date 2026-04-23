import type { Dictionary, Locale } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface AlternativeCardProps {
	lang: Locale;
	dict: Dictionary["admin"]["pipelineReset"]["alternative"];
}

export const AlternativeCard: FC<AlternativeCardProps> = ({ lang, dict }) => (
	<Link
		href={`/${lang}/admin/pipeline/rollback`}
		className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] rounded-2xl p-5 mb-8 transition-colors"
	>
		<div
			className="flex-shrink-0 w-11 h-11 rounded-md flex items-center justify-center text-xl bg-[var(--warning-dim)] text-[var(--warning)]"
			aria-hidden
		>
			⏪
		</div>
		<div className="flex-1 min-w-0">
			<div className="text-sm font-semibold text-[var(--text)]">
				{dict.title}
			</div>
			<div className="text-xs text-[var(--text-muted)]">
				{dict.description}{" "}
				<span className="text-[var(--accent)]">{dict.cta} →</span>
			</div>
		</div>
	</Link>
);
