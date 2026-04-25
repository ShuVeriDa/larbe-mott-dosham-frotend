"use client";

import type { AuditQuery } from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { useAuditExport } from "../model/use-audit-export";

interface AuditExportButtonProps {
	query: AuditQuery;
	dict: Dictionary["admin"]["audit"]["toolbar"];
}

export const AuditExportButton: FC<AuditExportButtonProps> = ({
	query,
	dict,
}) => {
	const { download, isPending } = useAuditExport(query);

	return (
		<button
			type="button"
			onClick={() => {
				void download();
			}}
			disabled={isPending}
			className={cn(
				"inline-flex items-center gap-2 h-[38px] px-5 rounded-md text-sm font-semibold transition-all",
				"bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]",
				"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]",
				"disabled:opacity-60 disabled:cursor-wait",
			)}
		>
			{isPending ? dict.exporting : dict.export}
		</button>
	);
};
