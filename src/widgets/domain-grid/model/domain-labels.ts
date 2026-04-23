import type { Dictionary } from "@/i18n/dictionaries";

export type DomainKey = keyof Dictionary["stats"]["domains"]["labels"];

export const DOMAIN_ICONS: Record<DomainKey, string> = {
	general: "📖",
	law: "🏛",
	anatomy: "🫀",
	geology: "🪨",
	math: "🔢",
	it: "💻",
};

export const isDomainKey = (slug: string): slug is DomainKey =>
	slug in DOMAIN_ICONS;

export interface DomainView {
	slug: string;
	label: string;
	icon: string;
	count: number;
	percentage: number;
}

export const resolveDomain = (
	slug: string,
	labels: Dictionary["stats"]["domains"]["labels"],
): { label: string; icon: string } => {
	if (isDomainKey(slug)) {
		return { label: labels[slug], icon: DOMAIN_ICONS[slug] };
	}
	return { label: slug, icon: "📚" };
};
