export const downloadBlob = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const escapeCsvCell = (value: string) => {
	if (/[",\n\r]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
};

export const toCsv = (
	headers: readonly string[],
	rows: readonly Record<string, string>[],
) => {
	const headerLine = headers.map(escapeCsvCell).join(",");
	const dataLines = rows.map(row =>
		headers.map(h => escapeCsvCell(String(row[h] ?? ""))).join(","),
	);
	return [headerLine, ...dataLines].join("\n");
};
