const nf = new Intl.NumberFormat("ru-RU");

export const formatNumber = (value: number | undefined | null): string => {
	if (value === undefined || value === null) return "—";
	return nf.format(value);
};

export const formatPercent = (value: number, total: number): string => {
	if (!total) return "0";
	return ((value / total) * 100).toFixed(1);
};

export const formatDate = (iso: string | undefined, locale: string): string => {
	if (!iso) return "—";
	try {
		return new Date(iso).toLocaleDateString(locale, {
			day: "2-digit",
			month: "short",
			year: "2-digit",
		});
	} catch {
		return iso;
	}
};

export const interpolate = (
	template: string,
	values: Record<string, string | number>,
): string =>
	Object.entries(values).reduce(
		(acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
		template,
	);
