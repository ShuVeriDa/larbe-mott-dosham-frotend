import type { Dictionary } from "@/i18n/dictionaries";

type SummaryDict = Dictionary["admin"]["auditEntry"]["summary"];

export const formatDaysSinceCreation = (
	days: number | null | undefined,
	dict: SummaryDict,
): string => {
	if (days === null || days === undefined) return dict.unknown;
	if (days <= 0) return dict.daysZero;
	return dict.daysShort.replace("{count}", String(days));
};
