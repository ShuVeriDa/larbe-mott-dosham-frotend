import type {
	AuditActorType,
	AuditItem,
} from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";

type AuthorsDict = Dictionary["admin"]["audit"]["item"]["authors"];

export type ResolvedActor = AuditActorType | "unknown";

export const resolveActor = (item: AuditItem): ResolvedActor => {
	if (item.actorType) return item.actorType;
	if (item.user) return "admin";
	if (item.action === "pipeline") return "pipeline";
	if (item.apiKeyId) return "api";
	return "unknown";
};

export const resolveActorName = (
	item: AuditItem,
	actor: ResolvedActor,
	dict: AuthorsDict,
): string => {
	if (item.user?.name) return item.user.name;
	if (item.user?.username) return item.user.username;
	if (actor === "pipeline") return dict.pipeline;
	if (actor === "api") return dict.api;
	if (actor === "admin") return dict.admin;
	return dict.unknown;
};

export const getActorInitial = (name: string): string => {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	return trimmed.slice(0, 1).toUpperCase();
};
