"use client";

import { useExportAuditCsv, type AuditQuery } from "@/features/admin-audit";
import { useCallback } from "react";

export const useAuditExport = (query: AuditQuery) => {
	const mutation = useExportAuditCsv();

	const download = useCallback(async () => {
		const blob = await mutation.mutateAsync(query);
		const url = URL.createObjectURL(blob);
		const today = new Date().toISOString().slice(0, 10);
		const link = document.createElement("a");
		link.href = url;
		link.download = `audit-log-${today}.csv`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}, [mutation, query]);

	return {
		download,
		isPending: mutation.isPending,
		isError: mutation.isError,
	};
};
