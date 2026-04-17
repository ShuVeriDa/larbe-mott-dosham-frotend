import type { Dictionary } from "@/i18n/dictionaries";

type ApiCodeKey = keyof Dictionary["apiSection"]["codeLines"];

export interface ApiCodeLine {
	kind: "comment" | "endpoint";
	key: ApiCodeKey;
}

export const API_CODE_LINES: ReadonlyArray<ApiCodeLine> = [
	{ kind: "comment", key: "searchComment" },
	{ kind: "endpoint", key: "searchEndpoint" },
	{ kind: "comment", key: "declensionComment" },
	{ kind: "endpoint", key: "declensionEndpoint" },
	{ kind: "comment", key: "conjugationComment" },
	{ kind: "endpoint", key: "conjugationEndpoint" },
	{ kind: "comment", key: "randomComment" },
	{ kind: "endpoint", key: "randomEndpoint" },
];
