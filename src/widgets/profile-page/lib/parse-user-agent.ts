export interface ParsedUA {
	browser: string;
	os: string;
	icon: "desktop" | "mobile";
}

const browserPatterns: Array<[RegExp, string]> = [
	[/Edg\//i, "Edge"],
	[/OPR\/|Opera/i, "Opera"],
	[/Firefox/i, "Firefox"],
	[/Chrome/i, "Chrome"],
	[/Safari/i, "Safari"],
];

const osPatterns: Array<[RegExp, string]> = [
	[/Windows NT 10/i, "Windows 10"],
	[/Windows/i, "Windows"],
	[/Mac OS X|Macintosh/i, "macOS"],
	[/iPhone|iPad|iPod/i, "iOS"],
	[/Android/i, "Android"],
	[/Linux/i, "Linux"],
];

const mobileRegex = /Mobile|Android|iPhone|iPad|iPod/i;

export const parseUserAgent = (ua: string | undefined): ParsedUA => {
	const raw = ua ?? "";
	const browser = browserPatterns.find(([re]) => re.test(raw))?.[1] ?? "Browser";
	const os = osPatterns.find(([re]) => re.test(raw))?.[1] ?? "Unknown OS";
	return {
		browser,
		os,
		icon: mobileRegex.test(raw) ? "mobile" : "desktop",
	};
};
