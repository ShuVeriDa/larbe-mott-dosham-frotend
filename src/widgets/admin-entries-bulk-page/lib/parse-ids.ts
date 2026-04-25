export const BULK_MAX = 100;

export const parseIds = (raw: string): number[] => {
	const seen = new Set<number>();
	const out: number[] = [];
	for (const token of raw.split(/[\s,;]+/)) {
		if (!/^\d+$/.test(token)) continue;
		const n = Number.parseInt(token, 10);
		if (!Number.isFinite(n) || n <= 0) continue;
		if (seen.has(n)) continue;
		seen.add(n);
		out.push(n);
	}
	return out;
};
