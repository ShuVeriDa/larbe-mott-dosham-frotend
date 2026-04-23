import type { SearchHistoryRecord } from "@/features/search-history";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { toIntlLocale } from "../lib/intl-locale";

export interface HistoryDateGroup {
	key: string;
	label: string;
	items: SearchHistoryRecord[];
}

interface GroupOptions {
	lang: Locale;
	groupsDict: Dictionary["history"]["groups"];
	now?: Date;
}

const dayKey = (d: Date): string => d.toDateString();

const formatDateLabel = (
	d: Date,
	lang: Locale,
	now: Date,
	dict: Dictionary["history"]["groups"],
): string => {
	const today = dayKey(now);
	const yesterday = dayKey(new Date(now.getTime() - 86_400_000));
	const target = dayKey(d);

	if (target === today) return dict.today;
	if (target === yesterday) return dict.yesterday;

	const sameYear = d.getFullYear() === now.getFullYear();
	return new Intl.DateTimeFormat(toIntlLocale(lang), {
		day: "numeric",
		month: "long",
		year: sameYear ? undefined : "numeric",
	}).format(d);
};

/**
 * Группирует записи по календарной дате создания. Сохраняет порядок
 * входного массива (бэкенд возвращает items DESC по `createdAt`).
 */
export const groupByDate = (
	items: SearchHistoryRecord[],
	{ lang, groupsDict, now = new Date() }: GroupOptions,
): HistoryDateGroup[] => {
	const buckets = new Map<string, HistoryDateGroup>();

	for (const item of items) {
		const date = new Date(item.createdAt);
		const key = dayKey(date);
		const existing = buckets.get(key);

		if (existing) {
			existing.items.push(item);
			continue;
		}

		buckets.set(key, {
			key,
			label: formatDateLabel(date, lang, now, groupsDict),
			items: [item],
		});
	}

	return Array.from(buckets.values());
};
