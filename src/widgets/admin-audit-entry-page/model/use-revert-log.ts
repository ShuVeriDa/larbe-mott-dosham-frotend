"use client";

import { useRevertAuditLog } from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type RevertDict = Dictionary["admin"]["auditEntry"]["revert"];

interface UseRevertLogOptions {
	entryId: number;
	dict: RevertDict;
}

export const useRevertLog = ({ entryId, dict }: UseRevertLogOptions) => {
	const [pendingLogId, setPendingLogId] = useState<string | null>(null);
	const mutation = useRevertAuditLog(entryId);

	const open = useCallback((logId: string) => {
		setPendingLogId(logId);
	}, []);

	const close = useCallback(() => {
		if (mutation.isPending) return;
		setPendingLogId(null);
	}, [mutation.isPending]);

	const confirm = useCallback(async () => {
		if (!pendingLogId) return;
		try {
			const result = await mutation.mutateAsync(pendingLogId);
			toast.success(dict.successTitle, {
				description: dict.successBody.replace(
					"{fields}",
					result.restoredFields.join(", ") || "—",
				),
			});
			setPendingLogId(null);
		} catch {
			toast.error(dict.errorTitle, { description: dict.errorBody });
		}
	}, [mutation, pendingLogId, dict]);

	return {
		pendingLogId,
		isOpen: pendingLogId !== null,
		isPending: mutation.isPending,
		open,
		close,
		confirm,
	};
};

export type RevertController = ReturnType<typeof useRevertLog>;
