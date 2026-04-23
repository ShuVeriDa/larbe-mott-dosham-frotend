export interface ParsedUserAgent {
	icon: string;
	label: string;
}

const BROWSERS: Array<{ test: RegExp; name: string }> = [
	{ test: /edg(e|a|ios)?\//i, name: "Edge" },
	{ test: /opr\//i, name: "Opera" },
	{ test: /firefox\//i, name: "Firefox" },
	{ test: /crios\//i, name: "Chrome" },
	{ test: /chrome\//i, name: "Chrome" },
	{ test: /safari\//i, name: "Safari" },
];

const OS: Array<{ test: RegExp; name: string; icon: string }> = [
	{ test: /iphone|ipad|ipod|ios/i, name: "iOS", icon: "📱" },
	{ test: /android/i, name: "Android", icon: "📱" },
	{ test: /mac os/i, name: "macOS", icon: "💻" },
	{ test: /windows/i, name: "Windows", icon: "💻" },
	{ test: /linux/i, name: "Linux", icon: "💻" },
];

export const parseUserAgent = (
	raw: string | null | undefined,
): ParsedUserAgent => {
	if (!raw) return { icon: "💻", label: "—" };
	const browser = BROWSERS.find((b) => b.test.test(raw))?.name;
	const os = OS.find((o) => o.test.test(raw));
	const label = [browser, os?.name].filter(Boolean).join(" · ") || raw.slice(0, 40);
	return { icon: os?.icon ?? "💻", label };
};
