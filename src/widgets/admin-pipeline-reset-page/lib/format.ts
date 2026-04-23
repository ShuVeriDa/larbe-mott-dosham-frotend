const NUMBER_FMT = new Intl.NumberFormat("ru-RU");

export const formatNumber = (n: number | null | undefined): string =>
	n == null ? "—" : NUMBER_FMT.format(n);

export const formatSizeMb = (mb: number | null | undefined): string => {
	if (mb == null) return "—";
	if (mb < 0.1) return `${(mb * 1024).toFixed(0)} KB`;
	return `${mb.toFixed(1)} MB`;
};

export const formatTimeHms = (iso: string): string => {
	try {
		return new Date(iso).toLocaleTimeString("ru-RU", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	} catch {
		return iso;
	}
};
