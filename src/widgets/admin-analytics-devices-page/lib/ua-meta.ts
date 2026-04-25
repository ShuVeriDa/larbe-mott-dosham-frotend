import type { Dictionary } from "@/i18n/dictionaries";
import type { AnalyticsUaKind } from "@/features/admin-analytics";

type DevicesDict = Dictionary["admin"]["analyticsDevices"];

export interface UaMeta {
	name: string;
	icon: string;
	color: string;
}

const COLOR = {
	accent: "var(--accent)",
	info: "var(--info)",
	warning: "var(--warning)",
	success: "var(--success)",
	danger: "var(--danger)",
	purple: "var(--purple)",
	pink: "var(--pink)",
	muted: "var(--text-muted)",
} as const;

interface DeviceMeta {
	icon: string;
	color: string;
	dictKey: keyof DevicesDict["devices"];
}
interface BrowserMeta {
	icon: string;
	color: string;
	dictKey: keyof DevicesDict["browsers"];
}
interface OsMeta {
	icon: string;
	color: string;
	dictKey: keyof DevicesDict["os"];
}

const DEVICE_TABLE: Record<string, DeviceMeta> = {
	desktop: { icon: "🖥️", color: COLOR.accent, dictKey: "desktop" },
	mobile: { icon: "📱", color: COLOR.info, dictKey: "mobile" },
	tablet: { icon: "📲", color: COLOR.warning, dictKey: "tablet" },
	bot: { icon: "🤖", color: COLOR.muted, dictKey: "bot" },
	other: { icon: "…", color: COLOR.muted, dictKey: "other" },
};

const BROWSER_TABLE: Record<string, BrowserMeta> = {
	chrome: { icon: "🌐", color: COLOR.accent, dictKey: "chrome" },
	safari: { icon: "🧭", color: COLOR.info, dictKey: "safari" },
	firefox: { icon: "🦊", color: COLOR.warning, dictKey: "firefox" },
	edge: { icon: "◎", color: COLOR.success, dictKey: "edge" },
	yandex: { icon: "Я", color: COLOR.danger, dictKey: "yandex" },
	opera: { icon: "O", color: COLOR.pink, dictKey: "opera" },
	"samsung internet": { icon: "📱", color: COLOR.purple, dictKey: "samsung" },
	other: { icon: "…", color: COLOR.muted, dictKey: "other" },
};

const OS_TABLE: Record<string, OsMeta> = {
	android: { icon: "🤖", color: COLOR.success, dictKey: "android" },
	windows: { icon: "⊞", color: COLOR.info, dictKey: "windows" },
	ios: { icon: "📱", color: COLOR.accent, dictKey: "ios" },
	macos: { icon: "", color: COLOR.purple, dictKey: "macos" },
	linux: { icon: "🐧", color: COLOR.warning, dictKey: "linux" },
	"chrome os": { icon: "◎", color: COLOR.pink, dictKey: "chromeos" },
	other: { icon: "…", color: COLOR.muted, dictKey: "other" },
};

const FALLBACK_PALETTE: ReadonlyArray<string> = [
	COLOR.accent,
	COLOR.info,
	COLOR.warning,
	COLOR.success,
	COLOR.purple,
	COLOR.pink,
	COLOR.danger,
];

const hashIndex = (key: string, mod: number): number => {
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = (hash * 31 + key.charCodeAt(i)) | 0;
	}
	return Math.abs(hash) % mod;
};

const normalize = (key: string): string => key.trim().toLowerCase();

export const getUaMeta = (
	kind: AnalyticsUaKind,
	rawKey: string,
	dict: DevicesDict,
): UaMeta => {
	const norm = normalize(rawKey);
	const fallbackColor =
		FALLBACK_PALETTE[hashIndex(norm || "_", FALLBACK_PALETTE.length)];

	if (kind === "device") {
		const meta =
			DEVICE_TABLE[norm] ?? (norm === "" || norm === "unknown" ? DEVICE_TABLE.other : null);
		if (meta) {
			return { name: dict.devices[meta.dictKey], icon: meta.icon, color: meta.color };
		}
		return { name: rawKey, icon: "•", color: fallbackColor };
	}

	if (kind === "browser") {
		const meta =
			BROWSER_TABLE[norm] ?? (norm === "" || norm === "unknown" ? BROWSER_TABLE.other : null);
		if (meta) {
			return { name: dict.browsers[meta.dictKey], icon: meta.icon, color: meta.color };
		}
		return { name: rawKey, icon: "•", color: fallbackColor };
	}

	const meta =
		OS_TABLE[norm] ?? (norm === "" || norm === "unknown" ? OS_TABLE.other : null);
	if (meta) {
		return { name: dict.os[meta.dictKey], icon: meta.icon, color: meta.color };
	}
	return { name: rawKey, icon: "•", color: fallbackColor };
};
