import type { Dictionary } from "@/i18n/dictionaries";
import { SectionCard } from "@/shared/ui/admin";
import type { FC } from "react";
import { BULK_MAX, parseIds } from "../lib/parse-ids";

interface Props {
	value: string;
	onChange: (next: string) => void;
	dict: Dictionary["admin"]["entriesBulk"]["select"]["ids"];
}

export const BulkMethodIds: FC<Props> = ({ value, onChange, dict }) => {
	const count = parseIds(value).length;
	return (
		<SectionCard title={dict.title}>
			<p className="text-xs text-[var(--text-muted)] -mt-2 mb-3">
				{dict.description}
			</p>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={dict.placeholder}
				rows={4}
				aria-label={dict.title}
				className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md p-3 text-sm font-mono text-[var(--text)] outline-none resize-y min-h-[80px] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)] transition-colors"
			/>
			<p className="text-xs text-[var(--text-faint)] mt-2">
				{dict.foundLabel}{" "}
				<strong className="text-[var(--accent)]">{count}</strong> {dict.idUnit}{" "}
				· {dict.maxLabel} {BULK_MAX}
			</p>
		</SectionCard>
	);
};
