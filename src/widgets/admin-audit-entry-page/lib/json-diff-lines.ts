import { stringifyJson } from "./diff-classify";

export type JsonDiffLineKind = "context" | "added" | "removed";

export interface JsonDiffLine {
	kind: JsonDiffLineKind;
	text: string;
}

const splitLines = (value: unknown): string[] =>
	stringifyJson(value).split("\n");

export const buildFieldDiffLines = (
	field: string,
	oldValue: unknown,
	newValue: unknown,
): JsonDiffLine[] => {
	const lines: JsonDiffLine[] = [];
	lines.push({ kind: "context", text: `${field}:` });
	for (const line of splitLines(oldValue)) {
		lines.push({ kind: "removed", text: `  ${line}` });
	}
	for (const line of splitLines(newValue)) {
		lines.push({ kind: "added", text: `  ${line}` });
	}
	return lines;
};

export const buildSnapshotDiffLines = (
	snapshot: unknown,
): JsonDiffLine[] =>
	splitLines(snapshot).map((text) => ({ kind: "added", text }));
