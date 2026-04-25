import type { AuditChanges, AuditFieldChange } from "@/features/admin-audit";

export interface NormalizedFieldChange {
	field: string;
	old: unknown;
	new: unknown;
}

const isFieldChange = (value: unknown): value is AuditFieldChange =>
	typeof value === "object" &&
	value !== null &&
	"old" in value &&
	"new" in value;

export const extractFieldChanges = (
	changes: AuditChanges | null | undefined,
): NormalizedFieldChange[] => {
	if (!changes) return [];
	const result: NormalizedFieldChange[] = [];
	for (const [field, value] of Object.entries(changes)) {
		if (field === "_meta" || field === "command") continue;
		if (isFieldChange(value)) {
			result.push({ field, old: value.old, new: value.new });
		}
	}
	return result;
};

export const stringifyValue = (value: unknown): string => {
	if (value === null || value === undefined) return "null";
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};
