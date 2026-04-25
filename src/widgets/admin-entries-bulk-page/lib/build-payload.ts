import type {
	BatchFetchEntry,
	BulkUpdatePayload,
} from "@/features/admin-entries";
import { type BulkFieldMeta, getFieldMeta, parseFieldValue } from "./field-meta";

export interface FieldOpDraft {
	/** Stable row id (local only) */
	id: string;
	/** Backend field key, empty string when not picked yet */
	field: string;
	/** Raw user input */
	rawValue: string;
}

export interface ResolvedOperation {
	field: string;
	meta: BulkFieldMeta;
	rawValue: string;
	value: unknown;
}

export interface PreviewRow {
	id: number;
	word: string;
	field: string;
	before: unknown;
	after: unknown;
}

/** Keep only field operations whose field is picked and whose value parses. */
export const resolveOperations = (ops: FieldOpDraft[]): ResolvedOperation[] => {
	const resolved: ResolvedOperation[] = [];
	for (const op of ops) {
		if (!op.field) continue;
		const meta = getFieldMeta(op.field);
		if (!meta) continue;
		if (op.rawValue === "") continue;
		const parsed = parseFieldValue(meta, op.rawValue);
		if (!parsed.ok) continue;
		resolved.push({
			field: op.field,
			meta,
			rawValue: op.rawValue,
			value: parsed.value,
		});
	}
	return resolved;
};

export const buildPayload = (
	ids: number[],
	ops: ResolvedOperation[],
): BulkUpdatePayload => ({
	entryIds: ids,
	operations: ops.map((op) => ({ field: op.field, value: op.value })),
});

export const buildPreviewRows = (
	current: BatchFetchEntry[],
	ops: ResolvedOperation[],
): PreviewRow[] => {
	const rows: PreviewRow[] = [];
	for (const entry of current) {
		for (const op of ops) {
			rows.push({
				id: entry.id,
				word: entry.word,
				field: op.field,
				before: (entry as unknown as Record<string, unknown>)[op.field] ?? null,
				after: op.value,
			});
		}
	}
	return rows;
};
