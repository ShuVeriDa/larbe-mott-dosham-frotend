"use client";

import type { AuditItem } from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { useMemo } from "react";
import { formatDayLabel, toDayKey } from "../lib/format-date-time";
import { groupByDay } from "../lib/group-by-day";
import { AuditTimelineItem } from "./audit-timeline-item";

interface AuditTimelineProps {
	items: AuditItem[];
	lang: Locale;
	dict: Dictionary["admin"]["audit"];
}

const daysDiff = (todayKey: string, key: string): number => {
	const a = new Date(`${todayKey}T00:00:00Z`).getTime();
	const b = new Date(`${key}T00:00:00Z`).getTime();
	return Math.round((a - b) / (1000 * 60 * 60 * 24));
};

export const AuditTimeline: FC<AuditTimelineProps> = ({
	items,
	lang,
	dict,
}) => {
	const groups = useMemo(() => groupByDay(items), [items]);
	const todayKey = toDayKey(new Date().toISOString());

	return (
		<div className="flex flex-col">
			{groups.map((group) => {
				const relative = daysDiff(todayKey, group.dayKey);
				const label =
					relative === 0
						? dict.day.today
						: relative === 1
							? dict.day.yesterday
							: formatDayLabel(group.firstIso, lang);
				return (
					<section key={group.dayKey} className="mb-6">
						<header className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] pb-2 mb-2 border-b border-[var(--border)]">
							<span>{label}</span>
							<span className="font-mono text-[0.65rem] bg-[var(--surface-active)] text-[var(--text-faint)] rounded-full px-1.5 py-[1px]">
								{group.items.length}
							</span>
						</header>
						<div className="flex flex-col">
							{group.items.map((item) => (
								<AuditTimelineItem
									key={item.id}
									item={item}
									lang={lang}
									dict={dict}
								/>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
};
