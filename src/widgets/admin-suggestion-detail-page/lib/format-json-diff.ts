export type JsonDiffLineType = "equal" | "added" | "removed";

export interface JsonDiffLine {
	type: JsonDiffLineType;
	text: string;
}

const prettify = (raw: string | null): string => {
	if (raw == null) return "";
	const trimmed = raw.trim();
	if (!trimmed) return "";
	try {
		return JSON.stringify(JSON.parse(trimmed), null, 2);
	} catch {
		return trimmed;
	}
};

const diffLines = (a: string[], b: string[]): JsonDiffLine[] => {
	const n = a.length;
	const m = b.length;
	const dp: number[][] = Array.from({ length: n + 1 }, () =>
		new Array<number>(m + 1).fill(0),
	);
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}
	const out: JsonDiffLine[] = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (a[i] === b[j]) {
			out.push({ type: "equal", text: a[i] });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			out.push({ type: "removed", text: a[i] });
			i++;
		} else {
			out.push({ type: "added", text: b[j] });
			j++;
		}
	}
	while (i < n) out.push({ type: "removed", text: a[i++] });
	while (j < m) out.push({ type: "added", text: b[j++] });
	return out;
};

export const buildJsonDiff = (
	oldValue: string | null,
	newValue: string | null,
): JsonDiffLine[] => {
	const oldPretty = prettify(oldValue);
	const newPretty = prettify(newValue);
	if (!oldPretty && !newPretty) return [];
	const oldLines = oldPretty ? oldPretty.split("\n") : [];
	const newLines = newPretty ? newPretty.split("\n") : [];
	return diffLines(oldLines, newLines);
};
