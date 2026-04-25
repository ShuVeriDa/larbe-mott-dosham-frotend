"use client";

import {
	extractFieldChanges,
	stringifyValue,
} from "../lib/normalize-changes";
import type { AuditChanges } from "@/features/admin-audit";
import type { FC } from "react";

interface AuditDiffPreviewProps {
	changes: AuditChanges | null | undefined;
	maxFields?: number;
}

export const AuditDiffPreview: FC<AuditDiffPreviewProps> = ({
	changes,
	maxFields = 4,
}) => {
	const fields = extractFieldChanges(changes).slice(0, maxFields);
	if (fields.length === 0) return null;

	return (
		<div className="mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden font-mono text-[0.7rem] leading-[1.6]">
			{fields.map(({ field, old, new: next }) => (
				<div key={field}>
					<div className="px-3 py-0.5 flex gap-2 bg-[var(--danger-dim)] text-[var(--danger)]">
						<span className="w-3 shrink-0 font-bold opacity-60">−</span>
						<span className="whitespace-pre-wrap break-all">
							{field}: {stringifyValue(old)}
						</span>
					</div>
					<div className="px-3 py-0.5 flex gap-2 bg-[var(--success-dim)] text-[var(--success)]">
						<span className="w-3 shrink-0 font-bold opacity-60">+</span>
						<span className="whitespace-pre-wrap break-all">
							{field}: {stringifyValue(next)}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};
