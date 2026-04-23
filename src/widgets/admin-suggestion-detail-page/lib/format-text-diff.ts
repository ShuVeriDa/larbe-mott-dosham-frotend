export interface DiffPart {
	value: string;
	type: "equal" | "added" | "removed";
}

const tokenize = (text: string): string[] => {
	const tokens: string[] = [];
	const pattern = /[\p{L}\p{N}]+|\s+|[^\p{L}\p{N}\s]/gu;
	for (const match of text.matchAll(pattern)) tokens.push(match[0]);
	return tokens;
};

const lcs = (a: string[], b: string[]): number[][] => {
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
	return dp;
};

export const diffWords = (oldText: string, newText: string): {
	old: DiffPart[];
	next: DiffPart[];
} => {
	const a = tokenize(oldText);
	const b = tokenize(newText);
	const dp = lcs(a, b);

	const oldParts: DiffPart[] = [];
	const newParts: DiffPart[] = [];

	const pushOld = (value: string, type: DiffPart["type"]) => {
		const last = oldParts[oldParts.length - 1];
		if (last && last.type === type) last.value += value;
		else oldParts.push({ value, type });
	};
	const pushNew = (value: string, type: DiffPart["type"]) => {
		const last = newParts[newParts.length - 1];
		if (last && last.type === type) last.value += value;
		else newParts.push({ value, type });
	};

	let i = 0;
	let j = 0;
	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			pushOld(a[i], "equal");
			pushNew(b[j], "equal");
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			pushOld(a[i], "removed");
			i++;
		} else {
			pushNew(b[j], "added");
			j++;
		}
	}
	while (i < a.length) {
		pushOld(a[i], "removed");
		i++;
	}
	while (j < b.length) {
		pushNew(b[j], "added");
		j++;
	}

	return { old: oldParts, next: newParts };
};
