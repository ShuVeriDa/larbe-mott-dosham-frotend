export const formatSizeMb = (mb: number | null | undefined): string => {
	if (mb === null || mb === undefined) return "—";
	if (mb < 1) return `${Math.round(mb * 1024)} KB`;
	return `${mb.toFixed(1)} MB`;
};

export const formatNumber = (
	value: number | null | undefined,
	locale = "ru-RU",
): string => {
	if (value === null || value === undefined) return "—";
	return new Intl.NumberFormat(locale).format(value);
};

export const formatPercent = (num: number, total: number): number => {
	if (!total) return 0;
	return Math.round((num / total) * 100);
};
