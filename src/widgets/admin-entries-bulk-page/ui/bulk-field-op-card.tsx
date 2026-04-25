"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";
import { FIELD_METAS, getFieldMeta, parseFieldValue } from "../lib/field-meta";
import type { FieldOpDraft } from "../lib/build-payload";

interface Props {
	index: number;
	op: FieldOpDraft;
	totalOps: number;
	entryCount: number;
	onChange: (patch: Partial<FieldOpDraft>) => void;
	onRemove: () => void;
	dict: Dictionary["admin"]["entriesBulk"]["operation"];
}

const FIELD_NONE = "__none__";
const VALUE_NONE = "__empty__";
const triggerClass = "h-10 w-full";

const inputClass =
	"h-10 w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)] transition-colors";

const textareaClass =
	"w-full min-h-[120px] bg-[var(--surface)] border border-[var(--border)] rounded-md p-3 text-sm font-mono text-[var(--text)] outline-none resize-y focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)] transition-colors";

export const BulkFieldOpCard: FC<Props> = ({
	index,
	op,
	totalOps,
	entryCount,
	onChange,
	onRemove,
	dict,
}) => {
	const meta = op.field ? getFieldMeta(op.field) : undefined;
	const parseResult = meta ? parseFieldValue(meta, op.rawValue) : null;
	const invalidJson =
		meta?.kind === "json" && op.rawValue !== "" && parseResult?.ok === false;

	return (
		<div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-md mb-3">
			<div className="flex items-center gap-3 mb-3">
				<span
					className="w-6 h-6 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-bold flex items-center justify-center shrink-0"
					aria-hidden
				>
					{index + 1}
				</span>
				<Select
					value={op.field === "" ? FIELD_NONE : op.field}
					onValueChange={(value) =>
						onChange({ field: value === FIELD_NONE ? "" : value })
					}
				>
					<SelectTrigger
						aria-label={`${dict.chooseField} #${index + 1}`}
						className={`${triggerClass} flex-1`}
					>
						<SelectValue placeholder={dict.chooseField} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={FIELD_NONE}>{dict.chooseField}</SelectItem>
						{FIELD_METAS.map((f) => (
							<SelectItem key={f.key} value={f.key}>
								{
									dict.fields[
										f.labelKey as keyof Dictionary["admin"]["entriesBulk"]["operation"]["fields"]
									]
								}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{totalOps > 1 ? (
					<button
						type="button"
						onClick={onRemove}
						aria-label={dict.remove}
						className="h-8 w-8 shrink-0 rounded-sm text-[var(--danger)] hover:bg-[var(--danger-dim)] transition-colors text-sm font-bold"
					>
						×
					</button>
				) : null}
			</div>

			{meta ? (
				<div className="flex flex-col gap-2">
					<label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
						{dict.value}
					</label>
					{meta.kind === "select" ? (
						<Select
							value={op.rawValue === "" ? VALUE_NONE : op.rawValue}
							onValueChange={(value) =>
								onChange({ rawValue: value === VALUE_NONE ? "" : value })
							}
						>
							<SelectTrigger
								className={triggerClass}
								aria-label={dict.value}
							>
								<SelectValue placeholder="—" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={VALUE_NONE}>—</SelectItem>
								{meta.options?.map((o) => (
									<SelectItem key={o} value={o}>
										{o}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : meta.kind === "json" ? (
						<textarea
							value={op.rawValue}
							onChange={(e) => onChange({ rawValue: e.target.value })}
							placeholder={dict.jsonPlaceholder}
							className={textareaClass}
							aria-invalid={invalidJson || undefined}
						/>
					) : (
						<input
							type="text"
							value={op.rawValue}
							onChange={(e) => onChange({ rawValue: e.target.value })}
							placeholder={meta.placeholder ?? dict.valuePlaceholder}
							className={inputClass}
						/>
					)}
					{invalidJson ? (
						<p className="text-xs text-[var(--danger)]">{dict.jsonInvalid}</p>
					) : op.rawValue !== "" ? (
						<p className="text-xs text-[var(--text-faint)]">
							{dict.hint
								.replace("{field}", op.field)
								.replace(
									"{value}",
									meta.kind === "json" ? "<JSON>" : op.rawValue,
								)
								.replace("{count}", String(entryCount))}
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
};
