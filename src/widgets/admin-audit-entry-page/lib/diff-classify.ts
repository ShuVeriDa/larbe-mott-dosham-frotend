import type { AuditChanges, AuditFieldChange } from "@/features/admin-audit";

export interface ScalarFieldChange {
	field: string;
	old: unknown;
	new: unknown;
}

const RESERVED_KEYS = new Set(["_meta", "command", "snapshot", "revertOf"]);

const isFieldChange = (value: unknown): value is AuditFieldChange =>
	typeof value === "object" &&
	value !== null &&
	"old" in value &&
	"new" in value;

const isScalar = (value: unknown): boolean => {
	if (value === null || value === undefined) return true;
	const type = typeof value;
	return type === "string" || type === "number" || type === "boolean";
};

export interface ClassifiedChanges {
	scalarFields: ScalarFieldChange[];
	complexFields: ScalarFieldChange[];
	hasSnapshot: boolean;
}

export const classifyChanges = (
	changes: AuditChanges | null | undefined,
): ClassifiedChanges => {
	const scalarFields: ScalarFieldChange[] = [];
	const complexFields: ScalarFieldChange[] = [];
	if (!changes)
		return { scalarFields, complexFields, hasSnapshot: false };

	for (const [key, value] of Object.entries(changes)) {
		if (RESERVED_KEYS.has(key)) continue;
		if (!isFieldChange(value)) continue;
		const entry: ScalarFieldChange = {
			field: key,
			old: value.old,
			new: value.new,
		};
		if (isScalar(value.old) && isScalar(value.new)) {
			scalarFields.push(entry);
		} else {
			complexFields.push(entry);
		}
	}

	return {
		scalarFields,
		complexFields,
		hasSnapshot:
			typeof changes.snapshot === "object" && changes.snapshot !== null,
	};
};

export const formatScalarValue = (value: unknown): string | null => {
	if (value === null || value === undefined) return null;
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	return null;
};

export const stringifyJson = (value: unknown): string => {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
};
