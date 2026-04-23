import type { Dictionary } from "@/i18n/dictionaries";

export type AdminNavKey =
	| "dashboard"
	| "quality"
	| "entries"
	| "suggestions"
	| "audit"
	| "pipeline"
	| "pipelineParse"
	| "pipelineUnify"
	| "pipelineLoad"
	| "pipelineImprove"
	| "pipelineRollback"
	| "pipelineReset"
	| "users"
	| "apiKeys";

export interface AdminNavItem {
	key: AdminNavKey;
	href: string;
	icon: string;
	labelKey: AdminNavKey;
	counterKey?: "entries" | "suggestions" | "users";
	isSub?: boolean;
	parents?: string[];
}

export interface AdminNavGroup {
	key: "overview" | "data" | "pipeline" | "system";
	items: AdminNavItem[];
}

export const buildAdminNavGroups = (lang: string): AdminNavGroup[] => {
	const path = (suffix: string) => `/${lang}/admin${suffix}`;
	return [
		{
			key: "overview",
			items: [
				{
					key: "dashboard",
					href: path(""),
					icon: "📊",
					labelKey: "dashboard",
				},
				{
					key: "quality",
					href: path("/quality"),
					icon: "✅",
					labelKey: "quality",
				},
			],
		},
		{
			key: "data",
			items: [
				{
					key: "entries",
					href: path("/entries"),
					icon: "📖",
					labelKey: "entries",
					counterKey: "entries",
				},
				{
					key: "suggestions",
					href: path("/suggestions"),
					icon: "💬",
					labelKey: "suggestions",
					counterKey: "suggestions",
				},
				{
					key: "audit",
					href: path("/audit"),
					icon: "📝",
					labelKey: "audit",
				},
			],
		},
		{
			key: "pipeline",
			items: [
				{
					key: "pipeline",
					href: path("/pipeline"),
					icon: "⚙️",
					labelKey: "pipeline",
				},
				{
					key: "pipelineParse",
					href: path("/pipeline/parse"),
					icon: "📥",
					labelKey: "pipelineParse",
					isSub: true,
					parents: [path("/pipeline")],
				},
				{
					key: "pipelineUnify",
					href: path("/pipeline/unify"),
					icon: "🔗",
					labelKey: "pipelineUnify",
					isSub: true,
					parents: [path("/pipeline")],
				},
				{
					key: "pipelineLoad",
					href: path("/pipeline/load"),
					icon: "🗄",
					labelKey: "pipelineLoad",
					isSub: true,
					parents: [path("/pipeline")],
				},
				{
					key: "pipelineImprove",
					href: path("/pipeline/improve"),
					icon: "🧹",
					labelKey: "pipelineImprove",
					isSub: true,
					parents: [path("/pipeline")],
				},
				{
					key: "pipelineRollback",
					href: path("/pipeline/rollback"),
					icon: "⏪",
					labelKey: "pipelineRollback",
					isSub: true,
					parents: [path("/pipeline")],
				},
				{
					key: "pipelineReset",
					href: path("/pipeline/reset"),
					icon: "💥",
					labelKey: "pipelineReset",
					isSub: true,
					parents: [path("/pipeline")],
				},
			],
		},
		{
			key: "system",
			items: [
				{
					key: "users",
					href: path("/users"),
					icon: "👥",
					labelKey: "users",
					counterKey: "users",
				},
				{
					key: "apiKeys",
					href: path("/api-keys"),
					icon: "🔑",
					labelKey: "apiKeys",
				},
			],
		},
	];
};

export const findActiveNav = (
	pathname: string,
	groups: AdminNavGroup[],
): AdminNavKey | null => {
	const normalize = (p: string) => p.replace(/\/$/, "");
	const target = normalize(pathname);

	let bestMatch: { key: AdminNavKey; length: number } | null = null;
	for (const group of groups) {
		for (const item of group.items) {
			const href = normalize(item.href);
			if (target === href || target.startsWith(`${href}/`)) {
				if (!bestMatch || href.length > bestMatch.length) {
					bestMatch = { key: item.key, length: href.length };
				}
			}
		}
	}
	return bestMatch?.key ?? null;
};

export const getPageTitleKey = (
	pathname: string,
	lang: string,
): { key: AdminNavKey | "default"; breadcrumb: AdminNavKey[] } => {
	const groups = buildAdminNavGroups(lang);
	const active = findActiveNav(pathname, groups);

	const breadcrumb: AdminNavKey[] = [];
	if (active) {
		for (const group of groups) {
			for (const item of group.items) {
				if (item.key === active) {
					if (item.parents) {
						for (const parentHref of item.parents) {
							const parent = groups
								.flatMap((g) => g.items)
								.find((i) => i.href === parentHref);
							if (parent) breadcrumb.push(parent.key);
						}
					}
					breadcrumb.push(active);
				}
			}
		}
	}

	return { key: active ?? "default", breadcrumb };
};

export type AdminShellDict = Dictionary["admin"]["shell"];
