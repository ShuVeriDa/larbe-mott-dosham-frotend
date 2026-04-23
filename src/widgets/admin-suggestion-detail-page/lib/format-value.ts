const stringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) return value.map(stringify).filter(Boolean).join("; ");
	if (typeof value === "object") {
		const obj = value as Record<string, unknown>;
		if (typeof obj.translation === "string") return obj.translation;
		if (typeof obj.text === "string") return obj.text;
		if (typeof obj.ru === "string") return obj.ru;
		if (typeof obj.value === "string") return obj.value;
		return JSON.stringify(value);
	}
	return String(value);
};

export const formatSuggestionText = (raw: string | null | undefined): string => {
	if (raw == null) return "";
	const trimmed = raw.trim();
	if (!trimmed) return "";
	try {
		return stringify(JSON.parse(trimmed));
	} catch {
		return trimmed;
	}
};

export const getInitials = (name: string): string => {
	if (!name) return "?";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
