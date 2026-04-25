"use client";

import type { AnalyticsLiveEvent } from "@/features/admin-analytics";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/shared/ui/primitives/sheet";
import type { FC, ReactNode } from "react";
import {
	countryCodeToFlag,
	deviceIcon,
	eventBadgeClass,
	prettyMetadata,
} from "../lib/format-live";

interface LiveEventDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: AnalyticsLiveEvent | null;
	dict: Dictionary["admin"]["analyticsLive"]["drawer"];
}

const Field: FC<{ label: string; empty?: boolean; children: ReactNode }> = ({
	label,
	empty = false,
	children,
}) => (
	<div className="mb-4">
		<div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
			{label}
		</div>
		<div
			className={cn(
				"rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-sm break-all text-[var(--text)]",
				empty && "italic font-sans text-[var(--text-faint)]",
			)}
		>
			{children}
		</div>
	</div>
);

export const LiveEventDrawer: FC<LiveEventDrawerProps> = ({
	open,
	onOpenChange,
	event,
	dict,
}) => {
	if (!event) {
		return (
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="right" className="w-full sm:max-w-[480px]">
					<SheetHeader>
						<SheetTitle>{dict.title}</SheetTitle>
						<SheetDescription className="sr-only">
							{dict.description}
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		);
	}

	const flag = countryCodeToFlag(event.country);
	const userLine = event.userId
		? `@${event.user?.username ?? event.user?.name ?? event.userId} · ${event.userId}`
		: null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-[480px]">
				<SheetHeader className="flex flex-row items-center justify-between border-b border-[var(--border)] gap-3 p-5">
					<div className="flex items-center gap-3">
						<SheetTitle>{dict.title}</SheetTitle>
						<span
							className={cn(
								"inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
								eventBadgeClass(event.eventType),
							)}
						>
							{event.eventType}
						</span>
					</div>
					<SheetDescription className="sr-only">{dict.description}</SheetDescription>
				</SheetHeader>
				<div className="flex-1 overflow-y-auto p-5">
					<Field label={dict.fields.id}>{event.id}</Field>
					<Field label={dict.fields.time}>{event.createdAt}</Field>
					<Field label={dict.fields.path} empty={!event.path}>
						{event.path ?? dict.values.notPageview}
					</Field>
					<Field label={dict.fields.referrer} empty={!event.referrer}>
						{event.referrer ?? dict.values.directReferrer}
					</Field>
					<Field label={dict.fields.device}>
						<span className="mr-1" aria-hidden="true">
							{deviceIcon(event.device)}
						</span>
						{event.device ?? "—"}
						{event.browser ? ` · ${event.browser}` : ""}
						{event.os ? ` / ${event.os}` : ""}
					</Field>
					<Field label={dict.fields.country} empty={!event.country}>
						{event.country ? `${flag} ${event.country}` : dict.values.geoUnavailable}
					</Field>
					<Field label={dict.fields.user} empty={!event.userId}>
						{userLine ?? dict.values.anonymous}
					</Field>
					<div className="mb-4">
						<div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
							{dict.fields.metadata}
						</div>
						<pre className="whitespace-pre-wrap break-all rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-xs text-[var(--text)]">
							{prettyMetadata(event)}
						</pre>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
