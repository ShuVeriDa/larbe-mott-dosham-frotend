import type { AuditItem } from "@/features/admin-audit";
import { toDayKey } from "./format-date-time";

export interface AuditDayGroup {
	dayKey: string;
	firstIso: string;
	items: AuditItem[];
}

export const groupByDay = (items: AuditItem[]): AuditDayGroup[] => {
	const map = new Map<string, AuditDayGroup>();
	for (const item of items) {
		const key = toDayKey(item.createdAt);
		const group = map.get(key);
		if (group) {
			group.items.push(item);
		} else {
			map.set(key, { dayKey: key, firstIso: item.createdAt, items: [item] });
		}
	}
	return Array.from(map.values()).sort((a, b) =>
		a.dayKey < b.dayKey ? 1 : -1,
	);
};
