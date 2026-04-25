"use client";

import type { AuditAction, AuditItem } from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	formatDayLabel,
	formatTime,
} from "@/widgets/admin-audit-page/lib/format-date-time";
import type { FC } from "react";
import {
	getActorInitial,
	resolveActor,
	resolveActorName,
} from "../lib/actor";
import { describeLog } from "../lib/describe-log";
import { classifyChanges } from "../lib/diff-classify";
import {
	buildFieldDiffLines,
	buildSnapshotDiffLines,
} from "../lib/json-diff-lines";
import { DiffTable } from "./diff-table";
import { ExpandToggle } from "./expand-toggle";
import { JsonDiffView } from "./json-diff-view";

interface AuditTimelineItemProps {
	item: AuditItem;
	lang: Locale;
	dict: Dictionary["admin"]["auditEntry"];
	auditDict: Dictionary["admin"]["audit"];
	onRevert?: (logId: string) => void;
}

const DOT_CLASS: Record<AuditAction, string> = {
	create: "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]",
	update: "bg-[var(--info-dim)] text-[var(--info)] border-[var(--info)]",
	delete: "bg-[var(--danger-dim)] text-[var(--danger)] border-[var(--danger)]",
	bulk: "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]",
	pipeline: "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent)]",
	revert: "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]",
};

const BADGE_CLASS: Record<AuditAction, string> = {
	create: "bg-[var(--success-dim)] text-[var(--success)]",
	update: "bg-[var(--info-dim)] text-[var(--info)]",
	delete: "bg-[var(--danger-dim)] text-[var(--danger)]",
	bulk: "bg-[var(--warning-dim)] text-[var(--warning)]",
	pipeline: "bg-[var(--accent-dim)] text-[var(--accent)]",
	revert: "bg-[var(--warning-dim)] text-[var(--warning)]",
};

const DOT_GLYPH: Record<AuditAction, string> = {
	create: "+",
	update: "✎",
	delete: "×",
	bulk: "⇄",
	pipeline: "⚙",
	revert: "↺",
};

const REVERTABLE: ReadonlySet<AuditAction> = new Set(["update", "bulk"]);

export const AuditTimelineItem: FC<AuditTimelineItemProps> = ({
	item,
	lang,
	dict,
	auditDict,
	onRevert,
}) => {
	const actor = resolveActor(item);
	const authorName = resolveActorName(item, actor, auditDict.item.authors);
	const initial = getActorInitial(authorName);
	const description = describeLog(item, dict.timeline);
	const actionLabel = auditDict.actions[item.action];
	const classified = classifyChanges(item.changes);
	const canRevert = REVERTABLE.has(item.action) && onRevert !== undefined;

	const snapshot =
		item.action === "create" && classified.hasSnapshot
			? item.changes?.snapshot
			: null;

	return (
		<li className="relative pb-6 last:pb-0">
			<span
				aria-hidden
				className={cn(
					"absolute -left-[28px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[0.6rem] z-[1]",
					DOT_CLASS[item.action],
				)}
			>
				{DOT_GLYPH[item.action]}
			</span>

			<article
				className={cn(
					"bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--border-hover)] transition-colors",
					item.action === "create" && "border-[var(--border-accent)]",
				)}
			>
				<header className="flex items-center gap-3 px-4 py-3 flex-wrap">
					<span
						className={cn(
							"text-xs font-semibold px-1.5 py-[2px] rounded font-mono",
							BADGE_CLASS[item.action],
						)}
					>
						{actionLabel}
					</span>
					<p className="text-sm text-[var(--text-secondary)] flex-1 min-w-0">
						{renderDescription(description)}
					</p>
					<div className="flex items-center gap-3 ml-auto shrink-0 flex-wrap">
						<time
							dateTime={item.createdAt}
							className="font-mono text-xs text-[var(--text-faint)] whitespace-nowrap"
							title={`${formatDayLabel(item.createdAt, lang)} · ${formatTime(item.createdAt, lang)}`}
						>
							{formatDayLabel(item.createdAt, lang)} ·{" "}
							{formatTime(item.createdAt, lang)}
						</time>
						<div className="flex items-center gap-1">
							<span
								aria-hidden
								className={cn(
									"w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-semibold",
									actor === "pipeline"
										? "bg-[var(--accent-dim)] text-[var(--accent)]"
										: actor === "api"
											? "bg-[var(--success-dim)] text-[var(--success)]"
											: "bg-[var(--surface-active)] text-[var(--text-muted)]",
								)}
							>
								{initial}
							</span>
							<span className="text-xs text-[var(--text-muted)]">
								{authorName}
							</span>
						</div>
						{canRevert ? (
							<button
								type="button"
								onClick={() => onRevert?.(item.id)}
								className="text-xs px-3 h-[26px] rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--warning)] hover:text-[var(--warning)] hover:bg-[var(--warning-dim)] font-medium transition-colors"
							>
								{dict.timeline.revert}
							</button>
						) : null}
					</div>
				</header>

				{classified.scalarFields.length > 0 ? (
					<DiffTable rows={classified.scalarFields} dict={dict.timeline} />
				) : null}

				{classified.complexFields.length > 0 ? (
					<JsonDiffView
						lines={classified.complexFields.flatMap((f) =>
							buildFieldDiffLines(f.field, f.old, f.new),
						)}
					/>
				) : null}

				{snapshot !== null && snapshot !== undefined ? (
					<ExpandToggle label={dict.timeline.expandSnapshot}>
						<JsonDiffView
							lines={buildSnapshotDiffLines(snapshot)}
							noTopBorder
						/>
					</ExpandToggle>
				) : null}
			</article>
		</li>
	);
};

const renderDescription = (text: string): React.ReactNode => {
	const segments = text.split(/(`[^`]+`)/g);
	return segments.map((seg, i) =>
		seg.startsWith("`") && seg.endsWith("`") ? (
			// biome-ignore lint/suspicious/noArrayIndexKey: stable split
			<code
				key={i}
				className="font-mono text-[0.7rem] bg-[var(--surface-active)] text-[var(--text-muted)] px-1 py-[1px] rounded"
			>
				{seg.slice(1, -1)}
			</code>
		) : (
			// biome-ignore lint/suspicious/noArrayIndexKey: stable split
			<span key={i}>{seg}</span>
		),
	);
};
