import type { AuditItem } from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import { extractFieldChanges } from "@/widgets/admin-audit-page/lib/normalize-changes";

type TimelineDict = Dictionary["admin"]["auditEntry"]["timeline"];

const interpolate = (template: string, vars: Record<string, string>): string =>
	template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");

export const describeLog = (
	item: AuditItem,
	dict: TimelineDict,
): string => {
	const changes = item.changes ?? null;
	const d = dict.descriptions;

	switch (item.action) {
		case "create": {
			const snapshot = changes?.snapshot as
				| { sources?: unknown }
				| undefined;
			const sources = Array.isArray(snapshot?.sources)
				? (snapshot?.sources as unknown[])
				: null;
			const first = sources?.[0];
			return typeof first === "string" && first
				? interpolate(d.create, { source: first })
				: d.createNoSource;
		}
		case "bulk": {
			const meta = (changes?._meta ?? null) as
				| { count?: number; field?: string }
				| null;
			const count = meta?.count ?? 0;
			const field = meta?.field;
			if (count > 0 && field) {
				return interpolate(d.bulkField, {
					count: String(count),
					field,
				});
			}
			if (count > 0) {
				return interpolate(d.bulkNoField, { count: String(count) });
			}
			return d.bulkGeneric;
		}
		case "pipeline": {
			const command =
				typeof changes?.command === "string" ? changes.command : null;
			return command
				? interpolate(d.pipelineCommand, { command })
				: d.pipelineGeneric;
		}
		case "revert": {
			const logId =
				typeof changes?.revertOf === "string" ? changes.revertOf : "";
			return interpolate(d.revert, { logId: logId.slice(0, 8) });
		}
		case "delete":
			return d.delete;
		case "update":
		default: {
			const fields = extractFieldChanges(changes);
			if (fields.length === 0) return d.updateNoFields;
			if (fields.length === 1) {
				return interpolate(d.updateField, {
					field: `\`${fields[0].field}\``,
				});
			}
			return interpolate(d.updateFields, {
				fields: fields.map((f) => `\`${f.field}\``).join(", "),
			});
		}
	}
};
