"use client";

import type {
	AuditAction,
	AuditActorType,
	AuditItem,
} from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";
import { describeItem, getItemTitle } from "../lib/describe-item";
import { formatTime } from "../lib/format-date-time";
import { AuditDiffPreview } from "./audit-diff-preview";

interface AuditTimelineItemProps {
	item: AuditItem;
	lang: Locale;
	dict: Dictionary["admin"]["audit"];
}

const DOT_CLASS: Record<AuditAction, string> = {
	create: "bg-[var(--success)]",
	update: "bg-[var(--info)]",
	delete: "bg-[var(--danger)]",
	bulk: "bg-[var(--warning)]",
	pipeline: "bg-[var(--accent)]",
	revert: "bg-[var(--warning)]",
};

const BADGE_CLASS: Record<AuditAction, string> = {
	create: "bg-[var(--success-dim)] text-[var(--success)]",
	update: "bg-[var(--info-dim)] text-[var(--info)]",
	delete: "bg-[var(--danger-dim)] text-[var(--danger)]",
	bulk: "bg-[var(--warning-dim)] text-[var(--warning)]",
	pipeline: "bg-[var(--accent-dim)] text-[var(--accent)]",
	revert: "bg-[var(--warning-dim)] text-[var(--warning)]",
};

const resolveActor = (item: AuditItem): AuditActorType | "unknown" => {
	if (item.actorType) return item.actorType;
	if (item.user) return "admin";
	if (item.action === "pipeline") return "pipeline";
	if (item.apiKeyId) return "api";
	return "unknown";
};

const resolveAuthorName = (
	item: AuditItem,
	actor: AuditActorType | "unknown",
	authors: Dictionary["admin"]["audit"]["item"]["authors"],
): string => {
	if (item.user?.name) return item.user.name;
	if (item.user?.username) return item.user.username;
	if (actor === "pipeline") return authors.pipeline;
	if (actor === "api") return authors.api;
	if (actor === "admin") return authors.admin;
	return authors.unknown;
};

const getAuthorInitial = (name: string): string => {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	return trimmed[0].toUpperCase();
};

export const AuditTimelineItem: FC<AuditTimelineItemProps> = ({
	item,
	lang,
	dict,
}) => {
	const title = getItemTitle(item);
	const description = describeItem(item, dict.item);
	const actor = resolveActor(item);
	const authorName = resolveAuthorName(item, actor, dict.item.authors);
	const initial = getAuthorInitial(authorName);
	const actionLabel = dict.actions[item.action];
	const isLinkable = item.entry?.id != null;
	const isDelete = item.action === "delete";

	return (
		<div className="flex flex-col md:flex-row gap-3 md:gap-4 px-4 py-3 rounded-md transition-colors hover:bg-[var(--surface)]">
			<div
				className={cn(
					"w-2 h-2 rounded-full shrink-0 mt-2",
					DOT_CLASS[item.action],
				)}
				aria-hidden
			/>

			<div className="flex-1 min-w-0">
				<div className="flex flex-wrap items-center gap-2 mb-1">
					<span
						className={cn(
							"text-[0.65rem] font-semibold uppercase tracking-wide px-1.5 py-[2px] rounded font-mono",
							BADGE_CLASS[item.action],
						)}
					>
						{actionLabel}
					</span>
					{isLinkable && item.entry ? (
						<Link
							href={`/${lang}/admin/entries/${item.entry.id}/edit`}
							className={cn(
								"text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors",
								isDelete && "line-through opacity-60",
							)}
						>
							{item.entry.word}
						</Link>
					) : title ? (
						<span
							className={cn(
								"text-sm font-semibold text-[var(--text)]",
								isDelete && "line-through opacity-60",
							)}
						>
							{title}
						</span>
					) : null}
					{item.entryId != null ? (
						<span className="text-[0.65rem] font-mono text-[var(--text-faint)]">
							#{item.entryId}
						</span>
					) : null}
				</div>
				<div className="text-xs text-[var(--text-secondary)] leading-relaxed">
					{description}
				</div>
				{item.action === "update" ? (
					<AuditDiffPreview changes={item.changes} />
				) : null}
			</div>

			<div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1 shrink-0 md:min-w-[150px]">
				<span className="font-mono text-xs text-[var(--text-faint)] whitespace-nowrap">
					{formatTime(item.createdAt, lang)}
				</span>
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.6rem] font-semibold shrink-0",
							actor === "pipeline"
								? "bg-[var(--accent-dim)] text-[var(--accent)]"
								: actor === "api"
									? "bg-[var(--success-dim)] text-[var(--success)]"
									: "bg-[var(--surface-active)] text-[var(--text-muted)]",
						)}
						aria-hidden
					>
						{initial}
					</span>
					<span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
						{authorName}
					</span>
				</div>
				{isLinkable && item.entry ? (
					<Link
						href={`/${lang}/admin/audit/entries/${item.entry.id}`}
						aria-label={dict.entryHistoryAria}
						className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] whitespace-nowrap transition-colors"
					>
						{dict.entryHistory}
					</Link>
				) : null}
			</div>
		</div>
	);
};
