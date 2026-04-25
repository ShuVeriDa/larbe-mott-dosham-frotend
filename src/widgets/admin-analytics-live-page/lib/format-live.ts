import type { Locale } from "@/i18n/dictionaries";
import type {
	AnalyticsLiveEvent,
	AnalyticsLiveEventMetadata,
} from "@/features/admin-analytics";

const localeFor = (lang: Locale): string => {
	switch (lang) {
		case "en":
			return "en-US";
		case "ru":
			return "ru-RU";
		default:
			return "ru-RU";
	}
};

export const formatLiveTime = (iso: string, lang: Locale): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleTimeString(localeFor(lang), {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

export const formatLiveNumber = (value: number, lang: Locale): string =>
	new Intl.NumberFormat(localeFor(lang)).format(Math.max(0, Math.round(value)));

const A_CODE = 0x41;
const REGIONAL_BASE = 0x1f1e6;

export const countryCodeToFlag = (code: string | null | undefined): string => {
	if (!code) return "—";
	const upper = code.trim().toUpperCase();
	if (upper.length !== 2) return "—";
	const a = upper.charCodeAt(0);
	const b = upper.charCodeAt(1);
	if (a < A_CODE || a > A_CODE + 25) return "—";
	if (b < A_CODE || b > A_CODE + 25) return "—";
	return String.fromCodePoint(REGIONAL_BASE + (a - A_CODE), REGIONAL_BASE + (b - A_CODE));
};

export const deviceIcon = (device: string | null): string => {
	switch ((device ?? "").toLowerCase()) {
		case "mobile":
			return "📱";
		case "tablet":
			return "📱";
		case "desktop":
			return "💻";
		case "bot":
			return "🤖";
		default:
			return "•";
	}
};

const meta = (event: AnalyticsLiveEvent): AnalyticsLiveEventMetadata =>
	event.metadata ?? {};

export const buildEntryHref = (id: string | number): string => `/entry/${id}`;

export const buildPhraseologyHref = (id: string | number): string =>
	`/phraseology/${id}`;

export const eventDisplayPath = (event: AnalyticsLiveEvent): string | null => {
	const m = meta(event);
	if (event.path) return event.path;
	if (m.entryId !== undefined && m.entryId !== null)
		return buildEntryHref(m.entryId);
	if (m.phraseId !== undefined && m.phraseId !== null)
		return buildPhraseologyHref(m.phraseId);
	return null;
};

export const prettyMetadata = (event: AnalyticsLiveEvent): string => {
	if (!event.metadata) return "{}";
	try {
		return JSON.stringify(event.metadata, null, 2);
	} catch {
		return "{}";
	}
};

export const eventBadgeClass = (eventType: string): string => {
	switch (eventType) {
		case "search":
			return "bg-[var(--accent-dim)] text-[var(--accent)]";
		case "entry_view":
			return "bg-[var(--success-dim)] text-[var(--success)]";
		case "favorite_add":
			return "bg-[var(--warning-dim)] text-[var(--warning)]";
		case "favorite_remove":
			return "bg-[var(--orange-dim)] text-[var(--orange)]";
		case "random_word":
			return "bg-[var(--purple-dim)] text-[var(--purple)]";
		case "word_of_day":
			return "bg-[var(--pink-dim)] text-[var(--pink)]";
		case "phraseology_view":
			return "bg-[var(--cyan-dim)] text-[var(--cyan)]";
		case "suggestion_create":
			return "bg-[var(--teal-dim)] text-[var(--teal)]";
		case "declension_view":
			return "bg-[var(--info-dim)] text-[var(--info)]";
		case "pageview":
		default:
			return "bg-[var(--surface-active)] text-[var(--text-secondary)]";
	}
};

export const eventDotColor = (eventType: string): string => {
	switch (eventType) {
		case "search":
			return "var(--accent)";
		case "entry_view":
			return "var(--success)";
		case "favorite_add":
			return "var(--warning)";
		case "favorite_remove":
			return "var(--orange)";
		case "random_word":
			return "var(--purple)";
		case "word_of_day":
			return "var(--pink)";
		case "phraseology_view":
			return "var(--cyan)";
		case "suggestion_create":
			return "var(--teal)";
		case "declension_view":
			return "var(--info)";
		case "pageview":
		default:
			return "var(--text-muted)";
	}
};
