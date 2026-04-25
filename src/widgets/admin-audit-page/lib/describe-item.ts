import type { AuditItem } from "@/features/admin-audit";
import { extractFieldChanges } from "./normalize-changes";

export interface ItemDescriptionDict {
	createEntry: string;
	updateFields: string;
	updateField: string;
	deleteEntry: string;
	bulkOperation: string;
	bulkAffected: string;
	pipelineCommand: string;
	pipelineGeneric: string;
	noDescription: string;
}

export const describeItem = (
	item: AuditItem,
	dict: ItemDescriptionDict,
): string => {
	const changes = item.changes ?? null;
	switch (item.action) {
		case "create":
			return dict.createEntry;
		case "delete":
			return dict.deleteEntry;
		case "update": {
			const fields = extractFieldChanges(changes);
			if (fields.length === 0) return dict.noDescription;
			if (fields.length === 1)
				return dict.updateField.replace("{field}", fields[0].field);
			return dict.updateFields.replace("{count}", String(fields.length));
		}
		case "bulk": {
			const meta = (changes?._meta ?? null) as
				| { count?: number; ids?: number[] }
				| null;
			const count = meta?.count ?? meta?.ids?.length ?? 0;
			return count > 0
				? dict.bulkAffected.replace("{count}", String(count))
				: dict.bulkOperation;
		}
		case "pipeline": {
			const command = (changes?.command as string | undefined) ?? null;
			return command
				? dict.pipelineCommand.replace("{command}", command)
				: dict.pipelineGeneric;
		}
		default:
			return dict.noDescription;
	}
};

export const getItemTitle = (item: AuditItem): string | null => {
	if (item.entry?.word) return item.entry.word;
	if (item.action === "pipeline") {
		const command = item.changes?.command;
		if (typeof command === "string") return command;
	}
	if (item.action === "bulk") {
		const meta = (item.changes?._meta ?? null) as
			| { count?: number }
			| null;
		if (meta?.count) return String(meta.count);
	}
	return null;
};
