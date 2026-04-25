import type { FC } from "react";
import {
	type ScalarFieldChange,
	formatScalarValue,
} from "../lib/diff-classify";
import type { Dictionary } from "@/i18n/dictionaries";

interface DiffTableProps {
	rows: ScalarFieldChange[];
	dict: Dictionary["admin"]["auditEntry"]["timeline"];
}

export const DiffTable: FC<DiffTableProps> = ({ rows, dict }) => {
	if (rows.length === 0) return null;

	return (
		<div className="border-t border-[var(--border)]">
			<table className="w-full border-collapse font-mono text-[0.72rem] leading-[1.7]">
				<thead>
					<tr>
						<th className="text-left px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--text-faint)] bg-[var(--surface)] border-b border-[var(--border)] w-[140px]">
							{dict.diffTableField}
						</th>
						<th className="text-left px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--text-faint)] bg-[var(--surface)] border-b border-[var(--border)] hidden md:table-cell">
							{dict.diffTableOld}
						</th>
						<th
							aria-hidden
							className="text-left px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)] hidden md:table-cell"
						/>
						<th className="text-left px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--text-faint)] bg-[var(--surface)] border-b border-[var(--border)]">
							{dict.diffTableNew}
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.field} className="align-top">
							<td className="px-4 py-2 border-b last:border-b-0 border-[var(--border)] text-[var(--text-muted)] font-medium whitespace-nowrap">
								{row.field}
							</td>
							<td className="px-4 py-2 border-b last:border-b-0 border-[var(--border)] hidden md:table-cell">
								<DiffValue value={row.old} tone="old" nullLabel={dict.diffNull} />
							</td>
							<td
								aria-hidden
								className="px-4 py-2 border-b last:border-b-0 border-[var(--border)] text-[var(--text-faint)] hidden md:table-cell"
							>
								→
							</td>
							<td className="px-4 py-2 border-b last:border-b-0 border-[var(--border)] break-words">
								<div className="md:hidden mb-1 flex items-center gap-2 flex-wrap">
									<DiffValue
										value={row.old}
										tone="old"
										nullLabel={dict.diffNull}
									/>
									<span className="text-[var(--text-faint)]">→</span>
								</div>
								<DiffValue value={row.new} tone="new" nullLabel={dict.diffNull} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

interface DiffValueProps {
	value: unknown;
	tone: "old" | "new";
	nullLabel: string;
}

const DiffValue: FC<DiffValueProps> = ({ value, tone, nullLabel }) => {
	const formatted = formatScalarValue(value);
	if (formatted === null) {
		return (
			<span className="italic text-[var(--text-faint)]">{nullLabel}</span>
		);
	}
	const className =
		tone === "old"
			? "text-[var(--danger)] bg-[var(--danger-dim)] rounded px-1"
			: "text-[var(--success)] bg-[var(--success-dim)] rounded px-1";
	return <span className={className}>{formatted}</span>;
};
